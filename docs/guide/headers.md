---
title: 表头指南
---

## API

[表头 API](../api/core/header.md)

## 表头指南

本快速指南将讨论在 TanStack Table 中检索和与 `header` 对象交互的不同方式。

表头相当于单元格，但用于表格的 `<thead>` 部分而不是 `<tbody>` 部分。

### 从哪里获取表头

表头来自[表头组](header-groups)，它们相当于行，但用于表格的 `<thead>` 部分而不是 `<tbody>` 部分。

#### 表头组表头

如果您在表头组中，表头存储在 `headerGroup.headers` 属性的数组中。通常您只需遍历此数组来渲染表头。

```jsx
<thead>
  {table.getHeaderGroups().map(headerGroup => {
    return (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => ( // 遍历 headerGroup headers 数组
          <th key={header.id} colSpan={header.colSpan}>
            {/* */}
          </th>
        ))}
      </tr>
    )
  })}
</thead>
```

#### 表头表格实例 API

有多个 `table` 实例 API 可用于检索表头列表，具体取决于您使用的功能。您可能使用的最常见 API 是 `table.getFlatHeaders`，它将返回表格中所有表头的扁平列表，但还有至少十几个其他表头 API 与列可见性和列固定功能结合使用很有用。根据您的用例，像 `table.getLeftLeafHeaders` 或 `table.getRightFlatHeaders` 这样的 API 可能很有用。

### 表头对象

表头对象类似于[单元格](cells.md)对象，但用于表格的 `<thead>` 部分而不是 `<tbody>` 部分。每个表头对象都可以与 UI 中的 `<th>` 或类似的单元格元素关联。`header` 对象上有一些属性和方法，您可以使用它们与表格状态交互，并根据表格状态从表格中提取单元格值。

#### 表头 ID

每个表头对象都有一个 `id` 属性，使其在表格实例中唯一。通常您只需要此 `id` 作为 React 键的唯一标识符，或者如果您遵循[高性能列调整大小示例](https://github.com/TanStack/table/tree/main/examples/react/column-resizing-performant)。

对于没有高级嵌套或分组表头逻辑的简单表头，`header.id` 将与其父 `column.id` 相同。但是，如果表头是组列或占位符单元格的一部分，它将具有更复杂的 id，该 id 由表头族、深度/表头行索引、列 id 和表头组 id 构造。

#### 嵌套分组表头属性

`header` 对象上有一些属性，只有当表头是嵌套或分组表头结构的一部分时才有用。这些属性包括：

- `colspan`：表头应跨越的列数。这对于在 `<th>` 元素上渲染 `colSpan` 属性很有用。
- `rowSpan`：表头应跨越的行数。这对于在 `<th>` 元素上渲染 `rowSpan` 属性很有用。（目前在默认 TanStack Table 中未实现）
- `depth`：表头组所属的表头组"行索引"。
- `isPlaceholder`：一个布尔标志，如果表头是占位符表头则为 true。占位符表头用于在列被隐藏或列是组列的一部分时填补空白。
- `placeholderId`：占位符表头的唯一标识符。
- `subHeaders`：属于此表头的子/子表头数组。如果表头是叶表头，则为空。

> 注意：`header.index` 指的是它在表头组（表头行）中的索引，即它从左到右的位置。它与 `header.depth` 不同，后者指的是表头组"行索引"。

#### 表头父对象

每个表头都存储对其父[列](columns.md)对象和其父[表头组](header-groups.md)对象的引用。

### 更多表头 API

表头附加了一些更有用的 API，这些 API 对于与表格状态交互很有用。其中大多数与列大小调整和调整大小功能相关。有关更多信息，请参阅[列大小调整指南](column-sizing.md)。

### 表头渲染

由于您定义的 `header` 列选项可以是字符串、jsx 或返回其中任一的函数，渲染表头的最佳方式是使用适配器中的 `flexRender` 实用程序，它将为您处理所有这些情况。

```jsx
{headerGroup.headers.map(header => (
  <th key={header.id} colSpan={header.colSpan}>
    {/* 处理 `header` 的所有可能表头列定义场景 */}
    {flexRender(header.column.columnDef.header, header.getContext())}
  </th>
))}
```