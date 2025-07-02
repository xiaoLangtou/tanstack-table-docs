---
title: 行固定 API
id: row-pinning
---

## 可固定条件

行能够被**固定**的条件由以下因素决定：

- `options.enableRowPinning` 解析为 `true`
- `options.enablePinning` 未设置为 `false`

## 状态

固定状态使用以下结构存储在表格中：

```tsx
export type RowPinningPosition = false | 'top' | 'bottom'

export type RowPinningState = {
  top?: string[]
  bottom?: string[]
}

export type RowPinningRowState = {
  rowPinning: RowPinningState
}
```

## 表格选项

### `enableRowPinning`

```tsx
enableRowPinning?: boolean | ((row: Row<TData>) => boolean)
```

启用/禁用表格中所有行的行固定。

### `keepPinnedRows`

```tsx
keepPinnedRows?: boolean
```

当为 `false` 时，如果固定行被过滤或分页排除在表格之外，则不会显示。当为 `true` 时，无论过滤或分页如何，固定行都将始终可见。默认为 `true`。

### `onRowPinningChange`

```tsx
onRowPinningChange?: OnChangeFn<RowPinningState>
```

如果提供此函数，当 `state.rowPinning` 更改时将使用 `updaterFn` 调用它。这会覆盖默认的内部状态管理，因此您还需要从自己管理的状态中提供 `state.rowPinning`。

## 表格 API

### `setRowPinning`

```tsx
setRowPinning: (updater: Updater<RowPinningState>) => void
```

设置或更新 `state.rowPinning` 状态。

### `resetRowPinning`

```tsx
resetRowPinning: (defaultState?: boolean) => void
```

将 **rowPinning** 状态重置为 `initialState.rowPinning`，或者可以传递 `true` 以强制默认空白状态重置为 `{}`。

### `getIsSomeRowsPinned`

```tsx
getIsSomeRowsPinned: (position?: RowPinningPosition) => boolean
```

返回是否有任何行被固定。可选择指定仅检查固定在 `top` 或 `bottom` 位置的行。

### `getTopRows`

```tsx
getTopRows: () => Row<TData>[]
```

返回所有顶部固定行。

### `getBottomRows`

```tsx
getBottomRows: () => Row<TData>[]
```

返回所有底部固定行。

### `getCenterRows`

```tsx
getCenterRows: () => Row<TData>[]
```

返回所有未固定到顶部或底部的行。

## 行 API

### `pin`

```tsx
pin: (position: RowPinningPosition) => void
```

将行固定到 `'top'` 或 `'bottom'`，或者如果传递 `false` 则取消固定行到中心。

### `getCanPin`

```tsx
getCanPin: () => boolean
```

返回行是否可以被固定。

### `getIsPinned`

```tsx
getIsPinned: () => RowPinningPosition
```

返回行的固定位置。（`'top'`、`'bottom'` 或 `false`）

### `getPinnedIndex`

```tsx
getPinnedIndex: () => number
```

返回行在固定行组内的数字固定索引。