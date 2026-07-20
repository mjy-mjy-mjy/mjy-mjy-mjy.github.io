import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const output = resolve("_site");
const requiredFiles = [
  "index.html",
  "archive/index.html",
  "tags/index.html",
  "about/index.html",
  "404.html",
  "posts/jenkins-to-cloud-native/index.html",
  "search.json",
  "assets/css/main.css",
  "assets/js/site.js",
  "sitemap.xml"
];

const errors = [];
for (const file of requiredFiles) {
  if (!existsSync(join(output, file))) errors.push("缺少构建产物：" + file);
}

const walk = (directory) =>
  readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const htmlFiles = existsSync(output)
  ? walk(output).filter((file) => extname(file) === ".html")
  : [];

const resolveInternalPath = (href) => {
  const pathname = decodeURIComponent(href.split("#")[0].split("?")[0]);
  if (!pathname || pathname === "/") return join(output, "index.html");
  const relative = pathname.replace(/^\/+/, "");
  const direct = join(output, relative);
  if (pathname.endsWith("/")) return join(direct, "index.html");
  if (existsSync(direct)) return direct;
  if (!extname(relative)) {
    const html = direct + ".html";
    if (existsSync(html)) return html;
    return join(direct, "index.html");
  }
  return direct;
};

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const hrefPattern = /href=["']([^"']+)["']/g;
  let match;
  while ((match = hrefPattern.exec(html)) !== null) {
    const href = match[1];
    if (
      /^(https?:|mailto:|tel:|data:|javascript:)/i.test(href) ||
      href.startsWith("//")
    ) {
      continue;
    }
    if (href.startsWith("#")) {
      const id = href.slice(1);
      if (
        id &&
        !html.includes('id="' + id + '"') &&
        !html.includes("id='" + id + "'")
      ) {
        errors.push(file.replace(output, "") + " 中找不到锚点 " + href);
      }
      continue;
    }
    const target = resolveInternalPath(href);
    if (!existsSync(target)) {
      errors.push(file.replace(output, "") + " 中存在无效链接 " + href);
    }
  }
}

if (existsSync(join(output, "search.json"))) {
  try {
    const index = JSON.parse(readFileSync(join(output, "search.json"), "utf8"));
    if (!Array.isArray(index) || index.length < 1) {
      errors.push("搜索索引为空");
    } else if (!index[0].title || !index[0].text || !index[0].url) {
      errors.push("搜索索引缺少必要字段");
    }
  } catch (error) {
    errors.push("search.json 无法解析：" + error.message);
  }
}

const articlePath = join(output, "posts/jenkins-to-cloud-native/index.html");
if (existsSync(articlePath)) {
  const article = readFileSync(articlePath, "utf8");
  if (!article.includes('class="mermaid"')) errors.push("文章缺少 Mermaid 概念关系图");
  if (!article.includes('class="toc"')) errors.push("文章目录未生成");
  if (!article.includes("language-groovy")) errors.push("Jenkinsfile 代码高亮未生成");
}

if (errors.length) {
  console.error("站点检查失败：\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log(
  "站点检查通过：" +
    htmlFiles.length +
    " 个 HTML 页面，主要页面、内部链接、搜索索引、目录与 Mermaid 均有效。"
);
