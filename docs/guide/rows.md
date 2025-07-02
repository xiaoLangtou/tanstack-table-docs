---
title: 行指南
---

## API

[行 API](../api/core/row)

## 行指南

本快速指南将讨论在 TanStack Table 中检索和与行对象交互的不同方式。

### 从哪里获取行

有多个 `table` 实例 API 可用于从表格实例检索行。

#### table.getRow

如果您需要通过其 `id` 访问特定行，可以使用 `table.getRow` 表格实例 API。

```js
const row = table.getRow(rowId)
```

#### 行模型

`table` 实例生成 `row` 对象并将它们存储在称为["行模型"](row-models)的有用数组中。这在[行模型指南](row-models)中有更详细的讨论，但这里是您可能访问行模型的最常见方式。

##### 渲染行

```jsx
<tbody>
  {table.getRowModel().rows.map(row => (
    <tr key={row.id}>
     {/* ... */}
    </tr>
  ))}
</tbody>
```

##### 获取选中的行

```js
const selectedRows = table.getSelectedRowModel().rows
```

### 行对象

每个行对象都包含行数据和许多 API，用于与表格状态交互或根据表格状态从行中提取单元格。

#### 行 ID

每个行对象都有一个 `id` 属性，使其在表格实例中唯一。默认情况下，`row.id` 与在行模型中创建的 `row.index` 相同。但是，使用行数据中的唯一标识符覆盖每行的 `id` 可能很有用。您可以使用 `getRowId` 表格选项来执行此操作。

```js
const table = useReactTable({
  columns,
  data,
  getRowId: originalRow => originalRow.uuid, //使用原始行数据中的 uuid 覆盖 row.id
})
```

> 注意：在分组和展开等某些功能中，`row.id` 将附加额外的字符串。

#### 访问行值

从行访问数据值的推荐方式是使用 `row.getValue` 或 `row.renderValue` API。使用这些 API 中的任何一个都将缓存访问器函数的结果并保持渲染高效。两者之间的唯一区别是，如果值未定义，`row.renderValue` 将返回值或 `renderFallbackValue`，而如果值未定义，`row.getValue` 将返回值或 `undefined`。

```js
// 从任何列访问数据
const firstName = row.getValue('firstName') // 从 firstName 列读取行值
const renderedLastName = row.renderValue('lastName') // 从 lastName 列渲染值
```

> 注意：`cell.getValue` 和 `cell.renderValue` 分别是 `row.getValue` 和 `row.renderValue` API 的快捷方式。

#### 访问原始行数据

对于每个行对象，您可以通过 `row.original` 属性访问传递给表格实例的原始对应 `data`。`row.original` 中的数据都不会被列定义中的访问器修改，因此如果您在访问器中进行任何数据转换，这些转换不会反映在 `row.original` 对象中。

```js
// 从原始行访问任何数据
const firstName = row.original.firstName // { firstName: 'John', lastName: 'Doe' }
```

### 子行

如果您使用分组或展开功能，您的行可能包含子行或父行引用。这在[展开指南](expanding)中有更详细的讨论，但这里是处理子行的有用属性和方法的快速概述。

- `row.subRows`：行的子行数组。
- `row.depth`：行相对于根行数组的深度（如果嵌套或分组）。根级行为 0，子行为 1，孙行为 2，等等。
- `row.parentId`：行的父行的唯一 ID（在其 subRows 数组中包含此行的行）。
- `row.getParentRow`：返回行的父行（如果存在）。

### 更多行 API

根据您为表格使用的功能，还有数十个更有用的 API 用于与行交互。有关更多信息，请参阅每个功能的相应 API 文档或指南。