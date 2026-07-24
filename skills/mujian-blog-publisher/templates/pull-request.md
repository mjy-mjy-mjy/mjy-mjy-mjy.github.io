## 本次修改

- 新增/修改文章：《<文章标题>》
- <一句话说明本次内容或视觉变化>
- <列出新增的通用能力；若没有则删除本项>

## 文章与资源

```text
文章：src/posts/<YYYY-MM-DD-article-slug.md>
资源：src/assets/images/posts/<article-slug>/
```

## 内容说明

- 目标读者：<读者>
- 核心观点：<一句话>
- 主要示例：<真实项目、工具或经历>
- 与已有文章的关系：<延续、补充或区别>

## 视觉方案

- 头图：<有/无，格式和作用>
- 信息图：<数量、格式和作用>
- 原生组件：<步骤卡片、诊断卡片、表格等>
- Mermaid：<是否使用及原因>

## 验证

已执行或由 GitHub Actions 执行：

```bash
node skills/mujian-blog-publisher/scripts/validate-post.mjs <article-file>
node skills/mujian-blog-publisher/scripts/validate-assets.mjs <article-file>
npm test
```

## 注意事项

- 本 PR 不直接修改默认分支；
- 本 PR 未自动合并；
- <预览与正式页面的已知差异，若无则写“无”>。