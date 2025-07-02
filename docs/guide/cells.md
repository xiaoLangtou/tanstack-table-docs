---
title: 单元格指南
---

## API

[单元格 API](../api/core/cell)

## 单元格指南

本快速指南将讨论在 TanStack Table 中检索和与 `cell` 对象交互的不同方式。

### 从哪里获取单元格

单元格来自[行](rows)。说得够清楚了，对吧？

有多个 `row` 实例 API 可用于从行中检索适当的单元格，具体取决于您使用的功能。最常见的是，您将使用 `row.getAllCells` 或 `row.getVisibleCells` API（如果您使用列可见性功能），但还有一些其他类似的 API 可以使用。

### 单元格对象

每个单元格对象都可以与 UI 中的 `<td>` 或类似的单元格元素关联。`cell` 对象上有一些属性和方法，您可以使用它们与表格状态交互，并根据表格状态从表格中提取单元格值。

#### 单元格 ID

每个单元格对象都有一个 `id` 属性，使其在表格实例中唯一。每个 `cell.id` 简单地构造为其父行和列 ID 的联合，用下划线分隔。

```js
{ id: `${row.id}_${column.id}` }
```

在分组或聚合功能期间，`cell.id` 将附加额外的字符串。

#### 单元格父对象

每个单元格都存储对其父[行](rows)和[列](columns)对象的引用。

#### 访问单元格值

从单元格访问数据值的推荐方式是使用 `cell.getValue` 或 `cell.renderValue` API。使用这些 API 中的任何一个都将缓存访问器函数的结果并保持渲染高效。两者之间的唯一区别是，如果值未定义，`cell.renderValue` 将返回值或 `renderFallbackValue`，而如果值未定义，`cell.getValue` 将返回值或 `undefined`。

> 注意：`cell.getValue` 和 `cell.renderValue` API 分别是 `row.getValue` 和 `row.renderValue` API 的快捷方式。

```js
// 从任何列访问数据
const firstName = cell.getValue('firstName') // 从 firstName 列读取单元格值
const renderedLastName = cell.renderValue('lastName') // 从 lastName 列渲染值
```

#### 从任何单元格访问其他行数据

由于每个单元格对象都与其父行关联，您可以使用 `cell.row.original` 访问表格中使用的原始行中的任何数据。

```js
// 即使我们在不同单元格的作用域中，我们仍然可以访问原始行数据
const firstName = cell.row.original.firstName // { firstName: 'John', lastName: 'Doe' }
```

### 更多单元格 API

根据您为表格使用的功能，还有数十个更有用的 API 用于与单元格交互。有关更多信息，请参阅每个功能的相应 API 文档或指南。

### 单元格渲染

您可以只使用 `cell.renderValue` 或 `cell.getValue` API 来渲染表格的单元格。但是，这些 API 只会输出原始单元格值（来自访问器函数）。如果您使用 `cell: () => JSX` 列定义选项，您将需要使用适配器中的 `flexRender` API 实用程序。

使用 `flexRender` API 将允许单元格使用任何额外的标记或 JSX 正确渲染，并且它将使用正确的参数调用回调函数。

```jsx
import { flexRender } from '@tanstack/react-table'

const columns = [
  {
    accessorKey: 'fullName',
    cell: ({ cell, row }) => {
      return <div><strong>{row.original.firstName}</strong> {row.original.lastName}</div>
    }
    //...
  }
]
//...
<tr>
  {row.getVisibleCells().map(cell => {
    return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
  })}
</tr>
```