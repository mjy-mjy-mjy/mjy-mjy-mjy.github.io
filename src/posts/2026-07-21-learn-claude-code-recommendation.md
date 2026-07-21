---
layout: layouts/post.njk
title: 从零理解 AI Agent 如何工作：为什么我推荐 Learn Claude Code
date: 2026-07-21
updated: 2026-07-21
description: 一套从最小 Agent Loop 出发，逐步实现工具调用、权限、记忆、错误恢复、MCP 与多 Agent 协作的中文实践教程。
permalink: /posts/learn-claude-code-recommendation/
tags:
  - posts
  - AI Agent
  - Claude Code
  - Agent Harness
  - 开源项目
  - 学习资源
---

学习 AI Agent 时，一个很常见的问题是：看过不少框架教程，也能调用模型和工具，但仍然说不清一个 Agent 在代码里究竟是怎样运行的。

模型为什么会连续调用多个工具？工具执行结果怎样重新进入上下文？权限、记忆、上下文压缩和错误恢复又应该放在哪里？

如果你也有这些疑问，我推荐从 **Learn Claude Code** 开始。它不是一套教你记忆某个框架 API 的速成课程，而是一套带着你从零搭建 Agent Harness 的渐进式教程。

- 教程网站：[learn.shareai.run/zh](https://learn.shareai.run/zh/)
- 源码仓库：[shareAI-lab/learn-claude-code](https://github.com/shareAI-lab/learn-claude-code)

## 一、Learn Claude Code 在教什么

这套教程从一个极简循环开始：

```python
while True:
    response = LLM(messages, tools)

    if response requests tools:
        results = execute_tools(response)
        messages.append(results)
    else:
        break
```

这段代码已经包含了 Agent 最基础的运行逻辑：

1. 把消息和工具定义发送给大模型；
2. 模型决定直接回答，还是调用某个工具；
3. 程序执行工具；
4. 把工具结果重新放回上下文；
5. 模型继续判断下一步，直到任务结束。

真正的 Agent 系统当然远比这个循环复杂。Learn Claude Code 的价值，就在于它没有一开始把所有复杂度塞进一个大型框架，而是在 20 个章节中逐步加入新的工程机制。

| 学习阶段 | 主要内容 |
| --- | --- |
| 工具与执行 | Agent Loop、Tool Use、Permission、Hooks |
| 规划与控制 | Todo、Subagent、Skill、System Prompt、Task System |
| 上下文与记忆 | Context Compact、长期 Memory |
| 可靠性 | Error Recovery、任务依赖、终止条件 |
| 并发与调度 | Background Tasks、Cron Scheduler |
| 多 Agent 能力 | 团队通信、任务认领、Worktree、MCP、综合 Harness |

从最初的一百多行代码，到后面包含数十个工具的综合实现，学习者能够直接观察：一个简单 Agent 是怎样一步步演变成复杂 Agent Harness 的。

## 二、为什么这套教程值得优先学习

### 1. 它讲的是可以迁移的底层机制

Agent 框架更新很快，LangGraph、OpenAI Agents SDK、Claude Agent SDK 等工具的接口也会不断变化。

但它们底层绕不开这些问题：

- 消息状态怎样维护；
- Tool Schema 怎样定义；
- Tool call 和 Tool result 怎样配对；
- 工具如何注册、分发和执行；
- 危险操作怎样审批；
- 上下文超出预算后怎样压缩；
- 长期记忆什么时候加载；
- 子 Agent 怎样隔离上下文；
- 错误应该重试、降级还是终止；
- MCP 工具如何发现和调用。

理解这些机制后，再学习任何框架，都会更容易判断一个 API 在系统中承担什么职责，而不是只会照着示例拼代码。

### 2. 每一章都围绕一个真实问题展开

这套教程的组织方式很适合工程学习：先提出问题，再加入机制，最后解释与上一章相比发生了什么变化。

例如：

- 工具越来越多后，怎样控制权限？
- 长时间运行后，上下文越来越大怎么办？
- Agent 执行失败时，哪些错误值得重试？
- 子 Agent 之间如何分工，又如何避免互相污染？
- 多个 Agent 同时修改代码时，如何隔离工作区？

这些问题都不是“调用一次 Function Calling”能够覆盖的，却是实际开发 Agent 时迟早会遇到的。

### 3. 它没有把教学实现包装成生产系统

不少教程会给出一个成功运行的 Demo，却很少解释它为什么还不能上线。

Learn Claude Code 会主动指出教学实现的简化，例如：

- 权限判断可能只是简单字符串匹配；
- 并发通信可能依赖线程或文件；
- 上下文压缩策略比较粗糙；
- 综合版本仍缺少可靠持久化和完整可观测性。

能够明确 Demo 与生产系统之间的距离，是这套教程很重要的优点。

## 三、哪些章节最值得认真学习

不建议把 20 章全部以同样的强度学习。

### 第一优先级：真正写懂

建议重点掌握：

- s01：Agent Loop
- s02：Tool Use
- s03：Permission
- s04：Hooks
- s05：TodoWrite
- s06：Subagent
- s07：Skill Loading
- s08：Context Compact
- s09：Memory
- s10：System Prompt
- s11：Error Recovery
- s12：Task System
- s19：MCP Tools
- s20：Comprehensive Agent

这些章节基本覆盖了一个工具型 Agent Harness 的核心骨架。

### 第二优先级：理解并运行

- s13：Background Tasks
- s18：Worktree Isolation

它们非常有工程价值，但可以在掌握可靠的单 Agent 系统后再深入。

### 第三优先级：按需求学习

- s14：Cron Scheduler
- s15：Agent Teams
- s16：Team Protocols
- s17：Autonomous Agents

多 Agent 很吸引人，但很多任务并不需要多个 Agent。单 Agent 的工具设计、可靠性、评估和可观测性没有做好时，增加 Agent 数量往往只会增加成本与失败路径。

## 四、怎样学习才不会变成“看完就忘”

最有效的方式不是顺着网页读完，而是每章完成一次小型工程闭环：

1. 先阅读本章试图解决的问题；
2. 暂时不看完整代码，自己设计接口或伪代码；
3. 运行作者实现，观察每轮消息和工具调用；
4. 修改至少一个机制；
5. 主动构造失败场景；
6. 记录教学实现省略了哪些生产能力。

一些值得尝试的改造包括：

| 章节 | 可以加入的实验 |
| --- | --- |
| s02 | 增加文本搜索工具，并处理参数错误 |
| s03 | 增加路径级权限与审批记录 |
| s04 | 记录耗时、Token 和工具失败信息 |
| s06 | 让两个 Subagent 分析不同目录后汇总 |
| s08 | 主动构造 Context Overflow 并测试恢复 |
| s09 | 增加记忆冲突、更新和删除机制 |
| s11 | 模拟超时、限流、工具异常与不可重试错误 |
| s19 | 接入一个真实 MCP Server |
| s20 | 加入统一 Trace ID、评估记录和模型切换 |

只有在修改、失败和复盘之后，教程里的机制才会真正变成自己的工程经验。

## 五、这套教程没有覆盖什么

Learn Claude Code 主要围绕 Coding Agent 和 Agent Harness 展开，因此它不能代表完整的 Agent 工程知识体系。

它没有系统讲解：

- RAG、Embedding、混合检索与 Rerank；
- Agent Eval 和回归测试；
- Web 服务与生产部署；
- 完整的日志、Trace、指标与成本体系；
- 浏览器和 Computer Use；
- 多模态 Agent；
- 真实业务数据闭环；
- 身份认证、多租户与安全沙箱。

因此，学完之后仍然需要配合更系统的 Agent 教材和真实项目。

我更推荐把它理解为：**Agent Harness 的实践主线，而不是 Agent 工程师的全部课程。**

## 六、它适合哪些人

Learn Claude Code 尤其适合：

- 已经会使用 Python，想系统理解 Agent 的开发者；
- 用过 LangChain 或其他框架，但不清楚底层运行机制的人；
- 想开发 Coding Agent、工具型 Agent 或自动化助手的人；
- 想学习 MCP、子 Agent、权限和上下文管理的人；
- 准备从“会调用大模型”进一步走向 Agent 工程的人。

它不太适合完全没有编程基础、只想快速使用现成 AI 产品的人。

## 七、我的推荐结论

在中文 Agent 学习资源中，Learn Claude Code 很适合作为第一条动手主线。

它最大的价值不是复刻 Claude Code，而是借助这个具体目标，把 Agent Loop、工具系统、权限、Hooks、记忆、上下文压缩、错误恢复、MCP 和多 Agent 协作串成一套可以运行、观察和修改的系统。

学习完成的标准也不应该是“读完 20 章”，而应该是：

- 能独立写出最小 Agent Loop；
- 能解释 Tool call/result 的消息协议；
- 能设计工具参数校验和权限机制；
- 能处理长上下文与大工具输出；
- 能区分可重试和不可重试错误；
- 能连接真实 MCP 工具；
- 能为 Agent 加入 Trace、测试和 Eval；
- 能说清教学 Demo 到生产系统还缺少什么。

做到这些之后，再接触其他 Agent 框架，你看到的就不再只是 API，而是一套可以拆解和判断的工程系统。

## 延伸阅读

- [AI Agent Book：系统学习 Agent 设计原理与工程实践](/posts/ai-agent-book-recommendation/)
- [agent-interview-hub：一套适合查漏补缺的 Agent 工程知识库](/posts/agent-interview-hub-recommendation/)
