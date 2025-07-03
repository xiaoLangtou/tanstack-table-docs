---
title: 单元格 API
---

这些是所有单元格的**核心**选项和 API 属性。其他[表格功能](../guide/features.md)还提供了更多选项和 API 属性。

## 单元格 API

所有单元格对象都具有以下属性：

### `id`

```tsx
id: string
```

单元格在整个表格中的唯一 ID。

### `getValue`

```tsx
getValue: () => any
```

返回单元格的值，通过关联列的访问器键或访问器函数访问。

### `renderValue`

```tsx
renderValue: () => any
```

渲染单元格的值，与 `getValue` 相同，但如果未找到值，将返回 `renderFallbackValue`。

### `row`

```tsx
row: Row<TData>
```

单元格关联的行对象。

### `column`

```tsx
column: Column<TData>
```

单元格关联的列对象。

### `getContext`

```tsx
getContext: () => {
  table: Table<TData>
  column: Column<TData, TValue>
  row: Row<TData>
  cell: Cell<TData, TValue>
  getValue: <TTValue = TValue,>() => TTValue
  renderValue: <TTValue = TValue,>() => TTValue | null
}
```

返回基于单元格的组件（如单元格和聚合单元格）的渲染上下文（或属性）。将这些属性与您框架的 `flexRender` 工具一起使用，以使用您选择的模板渲染这些内容：

```tsx
flexRender(cell.column.columnDef.cell, cell.getContext())
```
