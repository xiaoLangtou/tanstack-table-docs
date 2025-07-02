---
title: 分页 API
id: pagination
---

## 状态

分页状态使用以下结构存储在表格中：

```tsx
export type PaginationState = {
  pageIndex: number
  pageSize: number
}

export type PaginationTableState = {
  pagination: PaginationState
}

export type PaginationInitialTableState = {
  pagination?: Partial<PaginationState>
}
```

## 表格选项

### `manualPagination`

```tsx
manualPagination?: boolean
```

启用手动分页。如果此选项设置为 `true`，表格将不会使用 `getPaginationRowModel()` 自动分页行，而是期望您在将行传递给表格之前手动分页行。这在进行服务器端分页和聚合时很有用。

### `pageCount`

```tsx
pageCount?: number
```

当手动控制分页时，如果您知道总页数，可以向表格提供总 `pageCount` 值。如果您不知道有多少页，可以将其设置为 `-1`。或者，您可以提供 `rowCount` 值，表格将在内部计算 `pageCount`。

### `rowCount`

```tsx
rowCount?: number
```

当手动控制分页时，如果您知道总行数，可以向表格提供总 `rowCount` 值。`pageCount` 将从 `rowCount` 和 `pageSize` 内部计算。

### `autoResetPageIndex`

```tsx
autoResetPageIndex?: boolean
```

如果设置为 `true`，当页面更改状态发生变化时（例如 `data` 更新、过滤器更改、分组更改等），分页将重置为第一页。

> 🧠 注意：如果 `manualPagination` 设置为 `true`，此选项默认为 `false`

### `onPaginationChange`

```tsx
onPaginationChange?: OnChangeFn<PaginationState>
```

如果提供此函数，当分页状态更改时将调用它，您需要自己管理状态。您可以通过 `tableOptions.state.pagination` 选项将管理的状态传递回表格。

### `getPaginationRowModel`

```tsx
getPaginationRowModel?: (table: Table<TData>) => () => RowModel<TData>
```

返回分页发生后的行模型，但不再进一步。

分页列默认自动重新排序到列列表的开始。如果您希望删除它们或保持原样，请在此处设置适当的模式。

## 表格 API

### `setPagination`

```tsx
setPagination: (updater: Updater<PaginationState>) => void
```

设置或更新 `state.pagination` 状态。

### `resetPagination`

```tsx
resetPagination: (defaultState?: boolean) => void
```

将 **pagination** 状态重置为 `initialState.pagination`，或者可以传递 `true` 以强制默认空白状态重置为 `[]`。

### `setPageIndex`

```tsx
setPageIndex: (updater: Updater<number>) => void
```

使用提供的函数或值更新页面索引。

### `resetPageIndex`

```tsx
resetPageIndex: (defaultState?: boolean) => void
```

将页面索引重置为其初始状态。如果 `defaultState` 为 `true`，页面索引将重置为 `0`，无论初始状态如何。

### `setPageSize`

```tsx
setPageSize: (updater: Updater<number>) => void
```

使用提供的函数或值更新页面大小。

### `resetPageSize`

```tsx
resetPageSize: (defaultState?: boolean) => void
```

将页面大小重置为其初始状态。如果 `defaultState` 为 `true`，页面大小将重置为 `10`，无论初始状态如何。

### `getPageOptions`

```tsx
getPageOptions: () => number[]
```

返回当前页面大小的页面选项数组（基于零索引）。

### `getCanPreviousPage`

```tsx
getCanPreviousPage: () => boolean
```

返回表格是否可以转到上一页。

### `getCanNextPage`

```tsx
getCanNextPage: () => boolean
```

返回表格是否可以转到下一页。

### `previousPage`

```tsx
previousPage: () => void
```

如果可能，将页面索引减一。

### `nextPage`

```tsx
nextPage: () => void
```

如果可能，将页面索引加一。

### `firstPage`

```tsx
firstPage: () => void
```

将页面索引设置为 `0`。

### `lastPage`

```tsx
lastPage: () => void
```

将页面索引设置为最后一个可用页面。

### `getPageCount`

```tsx
getPageCount: () => number
```

返回页面计数。如果手动分页或控制分页状态，这将直接来自 `options.pageCount` 表格选项，否则将使用总行数和当前页面大小从表格数据计算。

### `getPrePaginationRowModel`

```tsx
getPrePaginationRowModel: () => RowModel<TData>
```

返回应用任何分页之前的表格行模型。

### `getPaginationRowModel`

```tsx
getPaginationRowModel: () => RowModel<TData>
```

返回应用分页后的表格行模型。