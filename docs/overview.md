---
title: 概述
---

TanStack Table 的核心是**框架无关的**，这意味着无论您使用哪个框架，其 API 都是相同的。我们提供了适配器来让您根据所使用的框架更轻松地使用表格核心。请查看适配器菜单了解可用的适配器。

## TypeScript

虽然 TanStack Table 是用 [TypeScript](https://www.typescriptlang.org/) 编写的，但在您的应用程序中使用 TypeScript 是可选的（但建议使用，因为它为您和您的代码库带来了卓越的好处）

## Headless

正如在[介绍](../introduction.md)部分中广泛提到的，TanStack Table 是 **headless** 的。这意味着它不渲染任何 DOM 元素，而是依赖您这位 UI/UX 开发者来提供表格的标记和样式。这是构建可在任何 UI 框架中使用的表格的绝佳方式，包括 React、Vue、Solid、Svelte、Qwik，甚至是像 React Native 这样的 JS-to-native 平台！

## 核心对象和类型

表格核心使用以下抽象，通常由适配器公开：

- Column Defs（列定义）
  - 用于配置列及其数据模型、显示模板等的对象
- Table（表格）
  - 包含状态和 API 的核心表格对象
- Table Data（表格数据）
  - 您提供给表格的核心数据数组
- Columns（列）
  - 每列都镜像其相应的列定义，并提供特定于列的 API
- Rows（行）
  - 每行都镜像其相应的行数据，并提供特定于行的 API
- Header Groups（表头组）
  - 表头组是嵌套表头级别的计算切片，每个都包含一组表头
- Headers（表头）
  - 每个表头要么直接关联，要么派生自其列定义，并提供特定于表头的 API
- Cells（单元格）
  - 每个单元格都镜像其相应的行列交集，并提供特定于单元格的 API

还有更多与特定功能相关的结构，如筛选、排序、分组等，您可以在[功能](../guide/features.md)部分找到它们。