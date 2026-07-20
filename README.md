# 沐简的博客

一个面向中文长文阅读的个人技术博客，记录技术学习、开发实践和阶段性思考。项目使用 Eleventy 在构建阶段把 Markdown 转成纯静态文件，通过 GitHub Actions 自动验证并发布到 GitHub Pages，无需服务器和数据库。

预计访问地址：<https://mjy-mjy-mjy.github.io>

## 技术栈

- [Eleventy 3.1.6](https://www.11ty.dev/)：轻量级静态站点生成器；
- Markdown + Nunjucks：文章写作与页面模板；
- 原生 HTML、CSS、JavaScript：导航、主题切换、搜索与交互；
- Prism（由 Eleventy 插件集成）：构建时代码高亮；
- Mermaid 11.12.0：浏览器端渲染概念关系图，脚本随站点一同发布，不依赖运行时 CDN；
- GitHub Actions + GitHub Pages：自动构建、检查与部署；
- Node.js 22：Apple Silicon 与常见 Linux 环境使用同一套构建流程。

Node 版本、npm 依赖及间接依赖分别由 `.nvmrc`、`package.json` 和 `package-lock.json` 约束。

## 目录结构

```text
.
├── .github/workflows/pages.yml     # 构建与 Pages 部署工作流
├── scripts/check-site.mjs          # 构建产物与内部链接检查
├── src
│   ├── _data/site.js               # 标题、副标题、导航、链接等集中配置
│   ├── _includes
│   │   ├── layouts                 # 基础、普通页面、文章布局
│   │   └── partials                # 可复用文章卡片
│   ├── assets
│   │   ├── css/main.css            # 原创视觉系统与响应式样式
│   │   └── js/site.js              # 搜索、主题、导航、复制代码等交互
│   ├── posts                       # Markdown 文章
│   ├── index.njk                   # 首页
│   ├── archive.njk                 # 归档页
│   ├── tags.njk                    # 标签页
│   ├── about.md                    # 关于页
│   ├── 404.njk                     # 404 页面
│   └── search.json.njk             # 构建时搜索索引
├── eleventy.config.js
└── package.json
```

## 本地环境

- Node.js 22（建议使用当前 Node.js 22 LTS）；
- npm 10 或更高版本；
- macOS（包括 Apple Silicon）、Linux 或 Windows。

使用 nvm 时，可直接执行：

```bash
nvm install
nvm use
```

## 安装与启动

```bash
npm ci
npm run dev
```

开发服务器默认会给出本地访问地址，并在文件变化后自动重新构建。

生产构建：

```bash
npm run build
```

完整验证：

```bash
npm test
```

`npm test` 会生成 `_site/`，随后检查主要页面、内部链接、搜索索引、文章目录、代码高亮和 Mermaid 容器。

## 新增一篇 Markdown 文章

在 `src/posts/` 新建文件，例如：

```text
src/posts/2026-08-01-example.md
```

文章头部填写：

```yaml
---
layout: layouts/post.njk
title: 文章标题
date: 2026-08-01
updated: 2026-08-01
description: 一句话摘要，会显示在首页和搜索结果中。
permalink: /posts/example/
tags:
  - posts
  - 软件工程
---
```

正文使用标准 Markdown。二级和三级标题会自动进入文章目录；代码围栏会生成高亮样式。Mermaid 图使用 `<div class="mermaid">…</div>` 包裹图表源码。

## 修改站点内容

### 标题、副标题、导航与 GitHub 链接

编辑 `src/_data/site.js`：

- `title`：博客标题；
- `subtitle`：首页副标题；
- `description`：默认站点描述；
- `author`：预留作者字段，第一版为空；
- `githubUrl`：页脚 GitHub 入口；
- `navigation`：主导航名称和地址。

### 关于页

直接编辑 `src/about.md`。第一版只保留客观占位说明，没有虚构个人经历。

### 首页封面

默认封面由 `src/assets/css/main.css` 中的渐变、网格和抽象圆环生成，不依赖第三方图片。

如需使用自己的图片：

1. 把图片放入 `src/assets/images/`；
2. 将 `src/_data/site.js` 中的 `heroImage` 改为 `/assets/images/文件名.webp`；
3. 使用 WebP 或 AVIF，并尽量控制文件体积；
4. 如需调整遮罩与构图，修改 `.home-hero--image` 样式。

## GitHub Pages 部署

仓库包含 `.github/workflows/pages.yml`。Pull Request 会执行构建与验证，但不会部署；合并到 `main` 后才会部署。

首次启用：

1. 打开仓库的 **Settings → Pages**；
2. 在 **Build and deployment** 下，将 **Source** 选择为 **GitHub Actions**；
3. 合并本 Pull Request，或在 **Actions** 页面手动运行 `Build and deploy GitHub Pages`；
4. 等待 Actions 中的 `build` 和 `deploy` 任务完成。

对于名为 `mjy-mjy-mjy.github.io` 的用户主页仓库，默认地址是：

<https://mjy-mjy-mjy.github.io>

## 绑定自定义域名

1. 在 **Settings → Pages → Custom domain** 填入域名；
2. 按 GitHub 提示配置 DNS：
   - 子域名通常使用 CNAME 指向 `mjy-mjy-mjy.github.io`；
   - 根域名使用 GitHub Pages 文档给出的 A/AAAA 记录；
3. 等待 DNS 生效并启用 **Enforce HTTPS**；
4. 如希望域名随代码保存，可在 `src/` 添加 `CNAME` 文件，并在 `eleventy.config.js` 中将其设为 passthrough copy。

不要照抄过期 IP，具体记录以 [GitHub Pages 自定义域名文档](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site) 为准。

## 常见问题

### `npm ci` 提示 lockfile 不一致

不要手工修改 `package-lock.json`。先确认使用 Node.js 22，在确需升级依赖时运行 `npm install`，完成构建验证后同时提交 `package.json` 和 `package-lock.json`。

### 本地端口被占用

```bash
npx @11ty/eleventy --serve --port=8081
```

### 页面样式或搜索索引没有更新

停止开发服务器，删除构建目录后重新构建：

```bash
rm -rf _site
npm run dev
```

`_site/` 是可再生成的本地构建产物，不会提交到仓库。

### GitHub Pages 显示 404

确认：

- Settings → Pages 的 Source 已选为 GitHub Actions；
- Actions 中部署工作流已成功；
- 访问的是用户主页根地址，而不是额外拼接仓库名；
- 工作流拥有 `pages: write` 和 `id-token: write` 权限。

## 隐私与安全

仓库不包含真实姓名、邮箱、地址、令牌或其他不必要的个人信息。不要把 API Key、访问令牌或私有配置写入 Markdown、JavaScript、工作流或提交历史；需要秘密时应使用 GitHub Actions Secrets。
