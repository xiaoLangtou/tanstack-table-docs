---
title: 介绍
---

TanStack Table 是一个用于构建强大表格和数据网格的 **Headless UI** 库，支持 TS/JS、React、Vue、Solid、Qwik 和 Svelte。

## 什么是 "headless" UI？

**Headless UI** 是指为 UI 元素和交互提供逻辑、状态、处理和 API，但**不提供标记、样式或预构建实现**的库和工具的术语。感到困惑了吗？😉 Headless UI 有几个主要目标：

构建复杂 UI 最困难的部分通常围绕状态、事件、副作用、数据计算/管理。通过将这些关注点从标记、样式和实现细节中分离出来，我们的逻辑和组件可以更加模块化和可重用。

构建 UI 是一个非常品牌化和定制化的体验，即使这意味着选择设计系统或遵循设计规范。为了支持这种定制体验，基于组件的 UI 库需要支持围绕标记和样式定制的庞大（且看似无穷无尽的）API 表面。Headless UI 库将您的逻辑与 UI 解耦。

当您使用 headless UI 库时，**数据处理、状态管理和业务逻辑**的复杂任务由库为您处理，让您专注于在不同实现和用例中有所差异的高基数决策。

> 想要深入了解？[阅读更多关于 Headless UI 的内容](https://www.merrickchristensen.com/articles/headless-user-interface-components/)。

## 基于组件的库 vs Headless 库

在表格/数据网格库的生态系统中，主要有两个类别：

- 基于组件的表格库
- Headless 表格库

### 我应该使用哪种类型的表格库？

每种方法都有微妙的权衡。理解这些细微差别将帮助您为您的应用程序和团队做出正确的决定。

### 基于组件的表格库

基于组件的表格库通常会为您提供功能丰富的即插即用解决方案和现成的组件/标记，并配有完整的样式/主题。[AG Grid](https://ag-grid.com/react-data-grid/?utm_source=reacttable&utm_campaign=githubreacttable) 是这类表格库的一个很好的例子。

**优点：**

- 提供现成的标记/样式
- 需要很少的设置
- 开箱即用的体验

**缺点：**

- 对标记的控制较少
- 自定义样式通常基于主题
- 更大的包体积
- 与框架适配器和平台高度耦合

**如果您想要一个现成的表格，并且设计/包体积不是硬性要求**，那么您应该考虑使用基于组件的表格库。

市面上有很多基于组件的表格库，但我们相信 [AG Grid](https://ag-grid.com/react-data-grid/?utm_source=reacttable&utm_campaign=githubreacttable) 是黄金标准，是我们最喜欢的网格兄弟（别告诉其他人 🤫）。

### Headless 表格库

Headless 表格库通常会为您提供函数、状态、工具和事件监听器来构建您自己的表格标记或附加到现有的表格标记。

**优点：**

- 完全控制标记和样式
- 支持所有样式模式（CSS、CSS-in-JS、UI 库等）
- 更小的包体积
- 可移植。可在任何运行 JS 的地方运行！

**缺点：**

- 需要更多设置
- 不提供标记、样式或主题

**如果您想要一个更轻量级的表格或完全控制设计**，那么您应该考虑使用 headless 表格库。

市面上很少有 headless 表格库，显然，**TanStack Table** 是我们的最爱！