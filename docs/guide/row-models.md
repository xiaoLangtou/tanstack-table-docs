---
title: 行模型指南
---

## 行模型指南

如果你查看 TanStack Table 的最基本示例，你会看到这样的代码片段：

```ts
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'

function Component() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), //行模型
  })
}
```

这个 `getCoreRowModel` 函数是什么？为什么你必须从 TanStack Table 导入它，然后又把它传回给自己？

答案是 TanStack Table 是一个模块化库。默认情况下，createTable 函数/钩子中不包含每个功能的所有代码。你只需要导入和包含你需要的代码，以便根据你想要使用的功能正确生成行。

### 什么是行模型？

行模型在 TanStack Table 的底层运行，以有用的方式转换你的原始数据，这些方式是数据网格功能（如过滤、排序、分组、展开和分页）所需要的。生成并在屏幕上渲染的行不一定与你传递给表格的原始数据一一对应。它们可能被排序、过滤、分页等。

### 导入行模型

你应该只导入你需要的行模型。以下是所有可用的行模型：

```ts
//只导入你需要的行模型
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
}
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getFacetedMinMaxValues: getFacetedMinMaxValues(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  getFilteredRowModel: getFilteredRowModel(),
  getGroupedRowModel: getGroupedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

### 自定义/分叉行模型

你不必使用 TanStack Table 提供的确切行模型。如果你需要对某些行模型进行一些高级自定义，请随时复制你想要自定义的行模型的[源代码](https://github.com/TanStack/table/tree/main/packages/table-core/src/utils)并根据你的需要进行修改。

### 使用行模型

一旦创建了表格实例，你就可以直接从表格实例访问你可能需要的所有行模型。除了你可能导入的行模型之外，还有更多派生的行模型可用。

对于正常的渲染用例，你可能只需要使用 `table.getRowModel()` 方法，因为这个行模型将根据你启用或禁用的功能使用所有/任何其他行模型。所有其他行模型都可供你"深入"表格中发生的一些底层数据转换。

### 表格实例上可用的行模型

- **`getRowModel`** - 这是你应该用于渲染表格行标记的主要行模型。它将使用所有其他行模型来生成你将用于渲染表格行的最终行模型。

- `getCoreRowModel` - 返回一个基本行模型，它只是传递给表格的原始数据的一一映射。

- `getFilteredRowModel` - 返回一个考虑列过滤和全局过滤的行模型。
- `getPreFilteredRowModel` - 返回应用列过滤和全局过滤之前的行模型。

- `getGroupedRowModel` - 返回一个对数据应用分组和聚合并创建子行的行模型。
- `getPreGroupedRowModel` - 返回应用分组和聚合之前的行模型。

- `getSortedRowModel` - 返回一个已应用排序的行模型。
- `getPreSortedRowModel` - 返回应用排序之前的行模型（行按原始顺序）。

- `getExpandedRowModel` - 返回一个考虑展开/隐藏子行的行模型。
- `getPreExpandedRowModel` - 返回一个只包含根级行且不包含展开子行的行模型。仍包含排序。

- `getPaginationRowModel` - 返回一个只包含基于分页状态应在当前页面显示的行的行模型。
- `getPrePaginationRowModel` - 返回一个未应用分页的行模型（包含所有行）。

- `getSelectedRowModel` - 返回所有选中行的行模型（但仅基于传递给表格的数据）。在 getCoreRowModel 之后运行。
- `getPreSelectedRowModel` - 返回应用行选择之前的行模型（只返回 getCoreRowModel）。
- `getGroupedSelectedRowModel` - 返回分组后选中行的行模型。在 getSortedRowModel 之后运行，getSortedRowModel 在 getGroupedRowModel 之后运行，getGroupedRowModel 在 getFilteredRowModel 之后运行。
- `getFilteredSelectedRowModel` - 返回列过滤和全局过滤后选中行的行模型。在 getFilteredRowModel 之后运行。

### 行模型执行顺序

了解 TanStack Table 如何在内部处理行可以帮助你更好地理解底层发生的事情，并帮助你调试可能遇到的任何问题。

在内部，如果启用了相应的功能，这是每个行模型应用于数据的顺序：

`getCoreRowModel` -> `getFilteredRowModel` -> `getGroupedRowModel` -> `getSortedRowModel` -> `getExpandedRowModel` -> `getPaginationRowModel` -> `getRowModel`

如果在任何情况下相应的功能被禁用或使用 `"manual*"` 表格选项关闭，则在该过程步骤中将使用 `getPre*RowModel`。

如上所示，首先过滤数据，然后分组，然后排序，然后展开，最后分页作为最后一步。

### 行模型数据结构

每个行模型将以 3 种不同的有用格式为你提供行：

1. `rows` - 行数组。
2. `flatRows` - 行数组，但所有子行都被扁平化到顶层。
3. `rowsById` - 行对象，其中每行都由其 `id` 键控。这对于通过 `id` 快速查找行并获得更好的性能很有用。

```ts
console.log(table.getRowModel().rows) // 行数组
console.log(table.getRowModel().flatRows) // 行数组，但所有子行都被扁平化到顶层
console.log(table.getRowModel().rowsById['row-id']) // 行对象，其中每行都由其 `id` 键控
```