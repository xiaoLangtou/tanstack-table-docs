---
title: 行选择 API
id: row-selection
---

## 状态

行选择状态使用以下结构存储在表格中：

```tsx
export type RowSelectionState = Record<string, boolean>

export type RowSelectionTableState = {
  rowSelection: RowSelectionState
}
```

默认情况下，行选择状态使用每行的索引作为行标识符。通过向表格传递自定义的 [getRowId](../core/table.md#getrowid) 函数，行选择状态可以改为使用自定义的唯一行 id 进行跟踪。

## 表格选项

### `enableRowSelection`

```tsx
enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
```

- 启用/禁用表格中所有行的行选择 或
- 给定一行，返回是否为该行启用/禁用行选择的函数

### `enableMultiRowSelection`

```tsx
enableMultiRowSelection?: boolean | ((row: Row<TData>) => boolean)
```

- 启用/禁用表格中所有行的多行选择 或
- 给定一行，返回是否为该行的子行/孙行启用/禁用多行选择的函数

### `enableSubRowSelection`

```tsx
enableSubRowSelection?: boolean | ((row: Row<TData>) => boolean)
```

当选择父行时启用/禁用自动子行选择，或为每行启用/禁用自动子行选择的函数。

（与展开或分组功能结合使用）

### `onRowSelectionChange`

```tsx
onRowSelectionChange?: OnChangeFn<RowSelectionState>
```

如果提供此函数，当 `state.rowSelection` 更改时将使用 `updaterFn` 调用它。这会覆盖默认的内部状态管理，因此您需要在表格外部完全或部分持久化状态更改。

## 表格 API

### `getToggleAllRowsSelectedHandler`

```tsx
getToggleAllRowsSelectedHandler: () => (event: unknown) => void
```

返回可用于切换表格中所有行的处理程序。

### `getToggleAllPageRowsSelectedHandler`

```tsx
getToggleAllPageRowsSelectedHandler: () => (event: unknown) => void
```

返回可用于切换当前页面上所有行的处理程序。

### `setRowSelection`

```tsx
setRowSelection: (updater: Updater<RowSelectionState>) => void
```

设置或更新 `state.rowSelection` 状态。

### `resetRowSelection`

```tsx
resetRowSelection: (defaultState?: boolean) => void
```

将 **rowSelection** 状态重置为 `initialState.rowSelection`，或者可以传递 `true` 以强制默认空白状态重置为 `{}`。

### `getIsAllRowsSelected`

```tsx
getIsAllRowsSelected: () => boolean
```

返回表格中是否选择了所有行。

### `getIsAllPageRowsSelected`

```tsx
getIsAllPageRowsSelected: () => boolean
```

返回当前页面上是否选择了所有行。

### `getIsSomeRowsSelected`

```tsx
getIsSomeRowsSelected: () => boolean
```

返回表格中是否选择了任何行。

### `getIsSomePageRowsSelected`

```tsx
getIsSomePageRowsSelected: () => boolean
```

返回当前页面上是否选择了任何行。

### `toggleAllRowsSelected`

```tsx
toggleAllRowsSelected: (value: boolean) => void
```

选择/取消选择表格中的所有行。

### `toggleAllPageRowsSelected`

```tsx
toggleAllPageRowsSelected: (value: boolean) => void
```

选择/取消选择当前页面上的所有行。

### `getPreSelectedRowModel`

```tsx
getPreSelectedRowModel: () => RowModel<TData>
```

### `getSelectedRowModel`

```tsx
getSelectedRowModel: () => RowModel<TData>
```

### `getFilteredSelectedRowModel`

```tsx
getFilteredSelectedRowModel: () => RowModel<TData>
```

### `getGroupedSelectedRowModel`

```tsx
getGroupedSelectedRowModel: () => RowModel<TData>
```

## 行 API

### `getIsSelected`

```tsx
getIsSelected: () => boolean
```

返回行是否被选择。

### `getIsSomeSelected`

```tsx
getIsSomeSelected: () => boolean
```

返回行的某些子行是否被选择。

### `getIsAllSubRowsSelected`

```tsx
getIsAllSubRowsSelected: () => boolean
```

返回行的所有子行是否都被选择。

### `getCanSelect`

```tsx
getCanSelect: () => boolean
```

返回行是否可以被选择。

### `getCanMultiSelect`

```tsx
getCanMultiSelect: () => boolean
```

返回行是否可以多选。

### `getCanSelectSubRows`

```tsx
getCanSelectSubRows: () => boolean
```

返回当选择父行时，行是否可以自动选择子行。

### `toggleSelected`

```tsx
toggleSelected: (value?: boolean) => void
```

选择/取消选择行。

### `getToggleSelectedHandler`

```tsx
getToggleSelectedHandler: () => (event: unknown) => void
```

返回可用于切换行的处理程序。