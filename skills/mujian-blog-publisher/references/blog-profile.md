# 博客档案

## 基本信息

- 博客名称：沐简的博客
- 仓库：`mjy-mjy-mjy/mjy-mjy-mjy.github.io`
- 技术栈：Eleventy、Markdown、Nunjucks、原生 CSS/JavaScript
- 部署方式：GitHub Pages
- 默认分支：`main`
- 文章目录：`src/posts/`
- 静态资源目录：`src/assets/`
- 构建验证：`npm test`

## 内容定位

博客主要记录：

- AI 与 Agent 工程实践；
- 软件开发、工具与工程方法；
- 技术学习过程中的理解和判断；
- 个人在实际使用技术产品时形成的思考。

文章不是新闻搬运，也不是纯粹的概念百科。应尽量把技术概念放回真实任务、项目或选择中讨论。

## 目标读者

默认读者是：

- 已经接触相关技术，但尚未形成完整理解的实践者；
- 希望从实际经验中建立判断框架的开发者；
- 对 AI Agent、开发工具和工程实践感兴趣的中文读者。

根据具体文章可进一步收窄目标读者。

## 当前内容方向

已有文章覆盖：

- Jenkins、云原生与现代软件交付；
- Agent 学习资源与知识库推荐；
- 什么才算真正会使用 AI；
- Prompt、Skill、MCP 与 Workflow 的区别。

新增文章应优先考虑：

- 延续已有系列；
- 补足已有文章留下的问题；
- 记录真实开发或使用经历；
- 避免重复写同一套概念解释。

## 文章文件约定

文章文件名：

`YYYY-MM-DD-article-slug.md`

Front Matter 基础字段：

```yaml
---
layout: layouts/post.njk
title: 文章标题
date: YYYY-MM-DD
updated: YYYY-MM-DD
description: 一句话说明文章解决的问题或核心观点。
permalink: /posts/article-slug/
tags:
  - posts
  - 主题标签
---
```

每篇文章的图片放在：

`src/assets/images/posts/<article-slug>/`

文章中使用站点绝对路径：

`/assets/images/posts/<article-slug>/<filename>`