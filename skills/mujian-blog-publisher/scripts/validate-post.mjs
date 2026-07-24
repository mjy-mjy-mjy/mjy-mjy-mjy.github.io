#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const [input] = process.argv.slice(2);

if (!input) {
  console.error("Usage: node validate-post.mjs <article.md>");
  process.exit(2);
}

const filePath = path.resolve(input);
const errors = [];
const warnings = [];

if (!fs.existsSync(filePath)) {
  console.error(`Article does not exist: ${filePath}`);
  process.exit(2);
}

if (path.extname(filePath) !== ".md") {
  errors.push("Article file must use the .md extension.");
}

const source = fs.readFileSync(filePath, "utf8");
const frontMatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);

if (!frontMatterMatch) {
  errors.push("Missing YAML front matter.");
} else {
  const frontMatter = frontMatterMatch[1];
  const getScalar = (key) => {
    const match = frontMatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return match ? match[1].trim().replace(/^['"]|['"]$/g, "") : "";
  };

  const required = ["layout", "title", "date", "description", "permalink"];
  for (const key of required) {
    if (!getScalar(key)) errors.push(`Missing front matter field: ${key}`);
  }

  const layout = getScalar("layout");
  const title = getScalar("title");
  const date = getScalar("date");
  const updated = getScalar("updated");
  const description = getScalar("description");
  const permalink = getScalar("permalink");

  if (layout && layout !== "layouts/post.njk") {
    warnings.push(`Unexpected layout: ${layout}`);
  }

  if (title && (title.length < 6 || title.length > 60)) {
    warnings.push(`Title length is ${title.length}; review readability.`);
  }

  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push("date must use YYYY-MM-DD.");
  }

  if (updated && !/^\d{4}-\d{2}-\d{2}$/.test(updated)) {
    errors.push("updated must use YYYY-MM-DD.");
  }

  if (description && (description.length < 20 || description.length > 180)) {
    warnings.push(`Description length is ${description.length}; expected roughly 20-180 characters.`);
  }

  if (permalink && !/^\/posts\/[a-z0-9-]+\/$/.test(permalink)) {
    errors.push("permalink must match /posts/article-slug/ using lowercase letters, numbers and hyphens.");
  }

  if (!/^tags:\s*$/m.test(frontMatter) || !/^\s*-\s+posts\s*$/m.test(frontMatter)) {
    errors.push("tags must exist and include posts.");
  }

  if (/^draft:\s*true\s*$/mi.test(frontMatter)) {
    warnings.push("Article is marked draft: true and will not enter the published post collection.");
  }

  const filename = path.basename(filePath);
  const fileDate = filename.match(/^(\d{4}-\d{2}-\d{2})-/)?.[1];
  if (fileDate && date && fileDate !== date) {
    errors.push(`Filename date (${fileDate}) does not match front matter date (${date}).`);
  }

  if (permalink) {
    const postsDir = path.resolve(path.dirname(filePath));
    if (fs.existsSync(postsDir)) {
      for (const name of fs.readdirSync(postsDir)) {
        if (!name.endsWith(".md") || name === filename) continue;
        const candidate = fs.readFileSync(path.join(postsDir, name), "utf8");
        if (candidate.includes(`permalink: ${permalink}`)) {
          errors.push(`Duplicate permalink found in ${name}: ${permalink}`);
        }
      }
    }
  }
}

const body = frontMatterMatch ? source.slice(frontMatterMatch[0].length) : source;
const plainBody = body
  .replace(/```[\s\S]*?```/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/[#>*_`\[\]()|-]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

if (plainBody.length < 600) {
  warnings.push(`Article body is short (${plainBody.length} characters); confirm this is intentional.`);
}

const h2Count = (body.match(/^##\s+.+$/gm) || []).length;
if (h2Count < 2) {
  warnings.push("Article has fewer than two level-2 sections.");
}

const placeholderPatterns = [
  /<文章标题>/,
  /<article-slug>/,
  /YYYY-MM-DD/,
  /待补充/,
  /待完善/,
  /FIXME/
];

for (const pattern of placeholderPatterns) {
  if (pattern.test(source)) errors.push(`Unresolved placeholder matched: ${pattern}`);
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);

if (errors.length) {
  console.error(`Validation failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log(`Article validation passed with ${warnings.length} warning(s): ${filePath}`);
