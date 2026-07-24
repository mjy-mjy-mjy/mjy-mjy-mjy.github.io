import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { createHash } from "node:crypto";

const cleanText = (value = "") =>
  String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|amp|lt|gt|quot|#39);/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const readingMinutes = (value = "") => {
  const text = cleanText(value);
  const cjkCount = (text.match(/[\u3400-\u9fff\uf900-\ufaff]/g) || []).length;
  const latinWords = text
    .replace(/[\u3400-\u9fff\uf900-\ufaff]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(cjkCount / 420 + latinWords / 220));
};

const formatDate = (value, options = {}) =>
  new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
    ...options
  }).format(new Date(value));

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/mermaid/dist/mermaid.min.js": "assets/vendor/mermaid.min.js"
  });
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  const markdown = markdownIt({
    html: true,
    linkify: true,
    typographer: true
  }).use(markdownItAnchor, {
    level: [2, 3],
    tabIndex: false,
    slugify: (value) =>
      "section-" + createHash("sha1").update(value).digest("hex").slice(0, 12)
  });

  const defaultFence = markdown.renderer.rules.fence;
  markdown.renderer.rules.fence = (tokens, index, options, env, self) => {
    const token = tokens[index];
    const language = token.info.trim().split(/\s+/)[0].toLowerCase();

    if (language === "mermaid") {
      const source = markdown.utils.escapeHtml(token.content.trim());
      return `<figure class="mermaid-figure"><div class="mermaid">${source}</div></figure>\n`;
    }

    if (defaultFence) {
      return defaultFence(tokens, index, options, env, self);
    }

    const className = language
      ? ` class="language-${markdown.utils.escapeHtml(language)}"`
      : "";
    return `<pre><code${className}>${markdown.utils.escapeHtml(token.content)}</code></pre>\n`;
  };

  eleventyConfig.setLibrary("md", markdown);

  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set();
    for (const item of collectionApi.getFilteredByGlob("src/posts/*.md")) {
      for (const tag of item.data.tags || []) {
        if (!["posts", "all"].includes(tag)) tags.add(tag);
      }
    }
    return [...tags].sort((a, b) => a.localeCompare(b, "zh-CN"));
  });

  eleventyConfig.addFilter("dateDisplay", (value) => formatDate(value));
  eleventyConfig.addFilter("dateIso", (value) =>
    new Date(value).toISOString().slice(0, 10)
  );
  eleventyConfig.addFilter("year", (value) =>
    new Intl.DateTimeFormat("zh-CN", { year: "numeric", timeZone: "UTC" }).format(
      new Date(value)
    )
  );
  eleventyConfig.addFilter("month", (value) =>
    new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      timeZone: "UTC"
    }).format(new Date(value))
  );
  eleventyConfig.addFilter("readingTime", readingMinutes);
  eleventyConfig.addFilter("plainText", cleanText);
  eleventyConfig.addFilter("jsonify", (value) => JSON.stringify(value));
  eleventyConfig.addFilter("newerPost", (collection, url) => {
    const index = collection.findIndex((item) => item.url === url);
    return index > 0 ? collection[index - 1] : null;
  });
  eleventyConfig.addFilter("olderPost", (collection, url) => {
    const index = collection.findIndex((item) => item.url === url);
    return index >= 0 && index < collection.length - 1
      ? collection[index + 1]
      : null;
  });
  eleventyConfig.addFilter("toc", (content = "") => {
    const headings = [];
    const pattern = /<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g;
    let match;
    while ((match = pattern.exec(content)) !== null) {
      headings.push({
        level: Number(match[1]),
        id: match[2],
        text: cleanText(match[3])
      });
    }
    if (!headings.length) return "";
    return [
      '<div class="toc">',
      '<p class="toc__title">本文目录</p>',
      "<ol>",
      ...headings.map(
        (heading) =>
          '<li class="toc__item toc__item--' +
          heading.level +
          '"><a href="#' +
          heading.id +
          '">' +
          heading.text +
          "</a></li>"
      ),
      "</ol>",
      "</div>"
    ].join("");
  });

  eleventyConfig.addShortcode("currentYear", () =>
    String(new Date().getFullYear())
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"]
  };
}
