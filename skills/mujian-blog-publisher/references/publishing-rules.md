# 发布与协作规则

## 分支策略

- 永远从仓库最新默认分支创建功能分支；
- 不复用已经合并、关闭或明显偏离主分支的旧分支；
- 分支名使用小写英文和连字符。

推荐格式：

- 新文章：`post/<article-slug>`
- 文章改版：`revise/<article-slug>`
- Skill 改进：`skill/mujian-blog-publisher-v<version>`
- 通用样式：`feature/<capability>`

## 提交规则

提交信息使用清楚的英文 Conventional Commits 风格：

- `feat: add article about context engineering`
- `feat: add article visuals and preview styles`
- `fix: correct broken article asset paths`
- `docs: refine blog writing guidelines`
- `chore: update publisher skill changelog`

一次提交应表达一个可理解的修改目的。不要制造无意义空文件或临时提交来推动分支。

## Pull Request

PR 标题使用中文，说明读者可以理解的交付结果。

PR 正文至少包含：

1. 本次修改；
2. 文章和资源路径；
3. 视觉或结构变化；
4. 验证方式；
5. 已知差异或注意事项。

使用 `templates/pull-request.md` 作为基础。

## 构建与验证

发布前至少完成：

```bash
node skills/mujian-blog-publisher/scripts/validate-post.mjs <article-file>
node skills/mujian-blog-publisher/scripts/validate-assets.mjs <article-file>
npm test
```

若无法在本地运行，以 GitHub Actions 中的 `npm test` 为最终构建证据。

必须等待 CI 得出明确结论：

- `success`：可以汇报验证通过；
- `failure`：读取日志、修复并重新验证；
- `in_progress`：只能说明正在验证，不能声称完成；
- 未找到运行：检查 PR 触发规则和 head SHA。

## 发布状态表述

请严格区分：

- 文件已生成；
- 文件已提交到功能分支；
- Pull Request 已创建；
- Pull Request 已合并；
- GitHub Pages 已部署；
- 线上页面已经可以访问。

不能因为 PR 创建成功就说文章已经发布。

## 合并规则

- 默认不合并 PR；
- 用户明确说“合并”“发布上线”或同等意思时，才执行合并；
- 合并前检查 PR 是否仍然基于合理的主分支状态；
- 合并后检查主分支构建和 GitHub Pages 部署结果；
- 若用户自己在执行期间合并了 PR，重新读取状态，不继续假设 PR 仍然打开。

## 冲突与并行修改

发现主分支在任务期间变化时：

1. 重新比较功能分支与主分支；
2. 判断是否只是正常合并，还是有真实冲突；
3. 不在旧假设上继续修改；
4. 必要时从最新主分支创建新的干净分支；
5. 不为了保留提交历史而把无关改动带入新 PR。

## 样式修改

- 优先复用现有 CSS；
- 通用能力放在独立、语义清楚的样式文件中；
- 页面布局只加载实际存在且需要的样式；
- 删除能力时同步清理引用；
- 新增卡片或图片样式要检查浅色、深色和移动端；
- 不为了单篇文章大范围重构全站设计。

## 文章资源

- 每篇文章使用独立资源目录；
- 删除文章时检查并清理孤立资源；
- SVG 作为 UTF-8 文本提交；
- 二进制图片使用正确编码上传；
- 不用扩展名伪装文件格式；
- 提交后重新读取文件，确认内容和路径正确。

## 最终汇报模板

发布 PR 完成后，用以下结构汇报：

```text
已完成：<文章标题>

PR：<地址>
分支：<分支名>
文章：<Markdown 路径>
资源：<资源目录>
验证：npm test <结果>
状态：PR 未合并 / 已合并 / 已部署
```

如果存在未完成项，放在同一汇报中明确列出。