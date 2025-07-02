---
title: 列指南
---

## API

[Column API](../api/core/column)

## 列指南

> 注意：本指南是关于在表格实例中生成的实际 `column` 对象，而不是关于为您的表格设置[列定义](column-defs)。

本快速指南将讨论在 TanStack Table 中检索和与 `column` 对象交互的不同方式。

### 从哪里获取列

您可以在许多地方找到 `column` 对象。它们经常被附加到其他对象上，或者可以通过各种表格实例 API 检索。

#### 标题和单元格对象

在您使用 `table` 实例 API 之前，请考虑您是否实际需要检索[标题](headers)或[单元格](cells)而不是 `columns`。如果您正在渲染表格的标记，您很可能想要使用返回标题或单元格而不是列的 API。列对象本身并不真正用于渲染标题或单元格，但 `header` 和 `cell` 对象将包含对这些 `column` 对象的引用，从中它们可以获得渲染其 UI 所需的信息。

```js
const column = cell.column; // 从单元格获取列
const column = header.column; // 从标题获取列
```

#### 列表格实例 API

有数十个 `table` 实例 API 可用于从表格实例检索列。您将使用哪些 API 完全取决于您在表格中使用的功能和您的用例。

##### 获取列

如果您只需要通过其 ID 获取单个列，您可以使用 `table.getColumn` API。

```js
const column = table.getColumn('firstName');
```

##### 获取所有列

最简单的列 API 是 `table.getAllColumns`，它将返回表格中所有列的列表。不过，还有数十个其他列 API 受到其他功能和表格状态的影响，与此 API 一起使用。`table.getAllFlatColumns`、`table.getAllLeafColumns`、`getCenterLeafColumns`、`table.getLeftVisibleLeafColumns` 只是您可能与列可见性或列固定功能一起使用的其他列 API 的一些示例。

### 列对象

列对象实际上并不意味着直接用于渲染表格 UI，因此它们与表格中的任何 `<th>` 或 `<td>` 元素不是一对一关联的，但它们包含许多有用的属性和方法，您可以使用这些属性和方法与表格状态交互。

#### 列 ID

每个列都必须在其关联的[列定义](column-defs)中定义唯一的 `id`。通常，您自己定义此 `id`，或者它从列定义中的 `accessorKey` 或 `header` 属性派生。

#### ColumnDef

用于创建列的原始 `columnDef` 对象的引用始终在列对象上可用。

#### 嵌套分组列属性

`column` 对象上有一些属性，只有当列是嵌套或分组列结构的一部分时才有用。这些属性包括：

- `columns`：属于组列的子列数组。
- `depth`：列组所属的标题组"行索引"。
- `parent`：列的父列。如果列是顶级列，这将是 `undefined`。

### 更多列 API

有数十个列 API 可用于与表格状态交互并根据表格状态从表格中提取单元格值。有关更多信息，请参见每个功能的列 API 文档。

### 列渲染

不要直接使用 `column` 对象来渲染 `headers` 或 `cells`。相反，使用[`header`](headers)和[`cell`](cells)对象，如上所述。

但是，如果您只是在 UI 的其他地方渲染列列表，例如列可见性菜单或类似的东西，您可以只是映射列数组并像往常一样渲染 UI。