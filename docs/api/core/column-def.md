---
title: 列定义 API
---

列定义是具有以下选项的普通对象：

## 选项

### `id`

```tsx
id: string
```

列的唯一标识符。

> 🧠 在以下情况下列 ID 是可选的：
>
> - 使用对象键访问器创建访问器列
> - 列标题定义为字符串

### `accessorKey`

```tsx
accessorKey?: string & typeof TData
```

提取列值时要使用的行对象的键。

### `accessorFn`

```tsx
accessorFn?: (originalRow: TData, index: number) => any
```

从每行提取列值时要使用的访问器函数。

### `columns`

```tsx
columns?: ColumnDef<TData>[]
```

要包含在分组列中的子列定义。

### `header`

```tsx
header?:
  | string
  | ((props: {
      table: Table<TData>
      header: Header<TData>
      column: Column<TData>
    }) => unknown)
```

要为列显示的表头。如果传递字符串，它可以用作列 ID 的默认值。如果传递函数，它将接收表头的属性对象，并应返回渲染的表头值（确切类型取决于所使用的适配器）。

### `footer`

```tsx
footer?:
  | string
  | ((props: {
      table: Table<TData>
      header: Header<TData>
      column: Column<TData>
    }) => unknown)
```

要为列显示的页脚。如果传递函数，它将接收页脚的属性对象，并应返回渲染的页脚值（确切类型取决于所使用的适配器）。

### `cell`

```tsx
cell?:
  | string
  | ((props: {
      table: Table<TData>
      row: Row<TData>
      column: Column<TData>
      cell: Cell<TData>
      getValue: () => any
      renderValue: () => any
    }) => unknown)
```

要为列的每行显示的单元格。如果传递函数，它将接收单元格的属性对象，并应返回渲染的单元格值（确切类型取决于所使用的适配器）。

### `meta`

```tsx
meta?: ColumnMeta // 此接口可通过声明合并进行扩展。见下文！
```

要与列关联的元数据。我们可以在列可用的任何地方通过 `column.columnDef.meta` 访问它。此类型对所有表格都是全局的，可以像这样扩展：

```tsx
import '@tanstack/react-table' //或 vue、svelte、solid、qwik 等。

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    foo: string
  }
}
```