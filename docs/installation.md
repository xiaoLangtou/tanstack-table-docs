---
title: 安装
---

在我们深入了解 API 之前，让我们先设置好环境！

使用您喜欢的 npm 包管理器将表格适配器作为依赖项安装。

_只安装以下包中的一个：_

## React Table

```bash
npm install @tanstack/react-table
```

`@tanstack/react-table` 包适用于 React 16.8、React 17、React 18 和 React 19。

> 注意：尽管 react 适配器适用于 React 19，但它可能无法与 React 19 一起推出的新 React 编译器配合使用。这可能会在未来的 TanStack Table 更新中得到修复。

## Vue Table

```bash
npm install @tanstack/vue-table
```

`@tanstack/vue-table` 包适用于 Vue 3。

## Solid Table

```bash
npm install @tanstack/solid-table
```

`@tanstack/solid-table` 包适用于 Solid-JS 1

## Svelte Table

```bash
npm install @tanstack/svelte-table
```

`@tanstack/svelte-table` 包适用于 Svelte 3 和 Svelte 4。

> 注意：目前还没有内置的 Svelte 5 适配器，但您仍然可以通过安装 `@tanstack/table-core` 包并使用社区的自定义适配器来在 Svelte 5 中使用 TanStack Table。请参考这个 [PR](https://github.com/TanStack/table/pull/5403) 获取灵感。

## Qwik Table

```bash
npm install @tanstack/qwik-table
```

`@tanstack/qwik-table` 包适用于 Qwik 1。

> 注意：在不久的将来会有一个"破坏性变更"版本来支持 Qwik 2。这将作为次要版本更新发布，但会有文档说明。Qwik 2 本身不会有破坏性变更，但它在 npm 注册表上的名称会改变，并需要不同的对等依赖项。

> 注意：当前的 qwik 适配器仅适用于 CSR。更多改进可能要等到未来的表格版本才能提供。

## Angular Table

```bash
npm install @tanstack/angular-table
```

`@tanstack/angular-table` 包适用于 Angular 17。Angular 适配器使用新的 Angular Signal 实现。

## Lit Table

```bash
npm install @tanstack/lit-table
```

`@tanstack/lit-table` 包适用于 Lit 3。

## Table Core（无框架）

```bash
npm install @tanstack/table-core
```

没有看到您喜欢的框架（或您喜欢的框架版本）？您总是可以使用 `@tanstack/table-core` 包并在您自己的代码库中构建自己的适配器。通常，只需要一个薄包装器来管理特定框架的状态和渲染。浏览所有其他适配器的[源代码](https://github.com/TanStack/table/tree/main/packages)以了解它们的工作原理。