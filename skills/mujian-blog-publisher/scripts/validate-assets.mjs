#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const [input] = process.argv.slice(2);

if (!input) {
  console.error("Usage: node validate-assets.mjs <article.md>");
  process.exit(2);
}

const articlePath = path.resolve(input);
const errors = [];
const warnings = [];

if (!fs.existsSync(articlePath)) {
  console.error(`Article does not exist: ${articlePath}`);
  process.exit(2);
}

const source = fs.readFileSync(articlePath, "utf8");
const repoRoot = findRepoRoot(path.dirname(articlePath));

if (!repoRoot) {
  console.error("Could not locate repository root containing src/posts and package.json.");
  process.exit(2);
}

const permalink = source.match(/^permalink:\s*\/posts\/([a-z0-9-]+)\/\s*$/m)?.[1] ?? "";
const expectedPrefix = permalink
  ? `/assets/images/posts/${permalink}/`
  : "";

const references = [];

for (const match of source.matchAll(/<img\b[^>]*?src=["']([^"']+)["'][^>]*>/gi)) {
  const tag = match[0];
  const src = match[1];
  const altMatch = tag.match(/\balt=["']([^"']*)["']/i);
  references.push({ type: "html", src, alt: altMatch?.[1] ?? null });
}

for (const match of source.matchAll(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g)) {
  references.push({ type: "markdown", src: match[2], alt: match[1] });
}

const localReferences = references.filter(({ src }) => src.startsWith("/assets/"));

if (!localReferences.length) {
  warnings.push("No local /assets/ image references found. Confirm the article intentionally has no images.");
}

for (const reference of localReferences) {
  const decoded = decodeURIComponent(reference.src.split(/[?#]/)[0]);
  const diskPath = path.join(repoRoot, "src", decoded.replace(/^\//, ""));

  if (!fs.existsSync(diskPath)) {
    errors.push(`Missing asset: ${reference.src} -> ${path.relative(repoRoot, diskPath)}`);
    continue;
  }

  const extension = path.extname(diskPath).toLowerCase();
  if (![".svg", ".webp", ".png", ".jpg", ".jpeg", ".gif", ".avif"].includes(extension)) {
    warnings.push(`Unusual image extension: ${reference.src}`);
  }

  if (expectedPrefix && reference.src.startsWith("/assets/images/posts/") && !reference.src.startsWith(expectedPrefix)) {
    warnings.push(`Article image is outside its expected directory ${expectedPrefix}: ${reference.src}`);
  }

  if (reference.alt === null) {
    errors.push(`Image is missing an alt attribute: ${reference.src}`);
  } else if (!reference.alt.trim()) {
    warnings.push(`Image has empty alt text; confirm it is purely decorative: ${reference.src}`);
  }

  if (extension === ".svg") {
    const svg = fs.readFileSync(diskPath, "utf8");
    if (!/<svg\b/i.test(svg)) errors.push(`File extension is .svg but content is not SVG: ${reference.src}`);
    if (!/<title\b/i.test(svg) && !reference.alt?.trim()) {
      warnings.push(`SVG has neither a title element nor meaningful alt text: ${reference.src}`);
    }
  }
}

const duplicateSources = localReferences
  .map(({ src }) => src)
  .filter((src, index, values) => values.indexOf(src) !== index);

for (const src of [...new Set(duplicateSources)]) {
  warnings.push(`Asset is referenced more than once: ${src}`);
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);

if (errors.length) {
  console.error(`Asset validation failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log(`Asset validation passed with ${warnings.length} warning(s): ${articlePath}`);

function findRepoRoot(start) {
  let current = path.resolve(start);
  while (true) {
    if (
      fs.existsSync(path.join(current, "package.json")) &&
      fs.existsSync(path.join(current, "src", "posts"))
    ) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}
