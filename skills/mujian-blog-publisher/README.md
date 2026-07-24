# 沐简博客发布流程

这是“沐简的博客”的仓库内 Skill。它把选题、调研、写作、配图、独立预览、文章改稿、GitHub PR 交付和构建验证沉淀为一套可版本化流程。

## 使用方式

在已连接 GitHub、能够访问本仓库的 ChatGPT 对话中，直接使用以下调用语。

### 推荐今天的选题

```text
调用沐简博客发布流程，进入选题模式，给我推荐今天的三个文章主题。
```

### 编写文章初稿

```text
调用沐简博客发布流程，进入初稿模式。
主题：上下文工程不是把所有资料都塞给 AI。
目标读者：AI Agent 实践者。
```

### 制作独立预览

```text
调用沐简博客发布流程，进入预览模式。
把刚才的文章优化、配图，并生成可以直接打开的独立 HTML，先不要修改 GitHub。
```

### 提交到博客

```text
预览没问题。调用沐简博客发布流程，进入发布模式：
从最新 main 创建新分支，提交文章和图片，创建 PR，并等待 npm test 通过。不要自动合并。
```

### 完整执行

```text
调用沐简博客发布完整流程。
主题：为什么 AI 明明说已经完成，结果却不能直接用？
从选题角度、文章初稿、视觉预览一直做到 GitHub PR，但不要自动合并。
```

### 沉淀本次反馈

```text
调用沐简博客发布流程，进入改进模式。
把我这次提出的长期写作和视觉偏好沉淀到 Skill，更新版本并创建 PR。
```

## 推荐提供的信息

不是每次都必须全部提供。已有上下文时不应重复询问。

- 文章主题或想讨论的问题；
- 目标读者；
- 想强调的核心观点；
- 可以使用的真实经历或项目；
- 只要初稿、先看预览，还是直接创建 PR；
- 是否允许联网调研；
- 是否需要配图。

## 默认行为

- 以第三人称讲解为主，少量第一人称增加真实性；
- 使用真实项目或小工具解释抽象概念；
- 不为了配图而配图；
- 预览未确认前不修改 GitHub，除非用户明确要求直接发布；
- 发布时使用新分支和 Pull Request；
- 等待 `npm test` 得到明确结果；
- 默认不合并 Pull Request。

## 文件结构

```text
skills/mujian-blog-publisher/
├── SKILL.md
├── README.md
├── CHANGELOG.md
├── references/
│   ├── blog-profile.md
│   ├── writing-style.md
│   ├── visual-style.md
│   ├── publishing-rules.md
│   └── lessons-learned.md
├── templates/
│   ├── post.md
│   ├── preview-shell.html
│   └── pull-request.md
└── scripts/
    ├── validate-post.mjs
    └── validate-assets.mjs
```

## 更新原则

- 单篇文章的临时要求保留在当次任务中；
- 多次重复或用户明确要求长期保留的偏好，写入 `references/`；
- 一次任务的有效做法和失败教训，写入 `lessons-learned.md`；
- 每次修改更新版本号和 `CHANGELOG.md`；
- Skill 修改也通过独立分支和 PR 交付。