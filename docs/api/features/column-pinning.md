---
title: 列固定 API
id: column-pinning
---

## 可固定性

列是否能够被**固定**由以下条件决定：

- `options.enablePinning` 未设置为 `false`
- `options.enableColumnPinning` 未设置为 `false`
- `columnDefinition.enablePinning` 未设置为 `false`

## 状态

固定状态使用以下结构存储在表格中：

```tsx
export type ColumnPinningPosition = false | 'left' | 'right'

export type ColumnPinningState = {
  left?: string[]
  right?: string[]
}


export type ColumnPinningTableState = {
  columnPinning: ColumnPinningState
}
```

## 表格选项

### `enableColumnPinning`

```tsx
enableColumnPinning?: boolean
```

启用/禁用表格中所有列的列固定功能。

### `onColumnPinningChange`

```tsx
onColumnPinningChange?: OnChangeFn<ColumnPinningState>
```

如果提供，当 `state.columnPinning` 更改时，将使用 `updaterFn` 调用此函数。这会覆盖默认的内部状态管理，因此您还需要从自己管理的状态中提供 `state.columnPinning`。

## 列定义选项

### `enablePinning`

```tsx
enablePinning?: boolean
```

启用/禁用该列的固定功能。

## 表格 API

### `setColumnPinning`

```tsx
setColumnPinning: (updater: Updater<ColumnPinningState>) => void
```

设置或更新 `state.columnPinning` 状态。

### `resetColumnPinning`

```tsx
resetColumnPinning: (defaultState?: boolean) => void
```

将 **columnPinning** 状态重置为 `initialState.columnPinning`，或者可以传递 `true` 以强制默认空白状态重置为 `{ left: [], right: [], }`。

### `getIsSomeColumnsPinned`

```tsx
getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean
```

返回是否有任何列被固定。可选择指定仅检查 `left` 或 `right` 位置的固定列。

_注意：不考虑列可见性_

### `getLeftHeaderGroups`

```tsx
getLeftHeaderGroups: () => HeaderGroup<TData>[]
```

返回表格的左侧固定标题组。

### `getCenterHeaderGroups`

```tsx
getCenterHeaderGroups: () => HeaderGroup<TData>[]
```

返回表格的未固定/中心标题组。

### `getRightHeaderGroups`

```tsx
getRightHeaderGroups: () => HeaderGroup<TData>[]
```

返回表格的右侧固定标题组。

### `getLeftFooterGroups`

```tsx
getLeftFooterGroups: () => HeaderGroup<TData>[]
```

返回表格的左侧固定页脚组。

### `getCenterFooterGroups`

```tsx
getCenterFooterGroups: () => HeaderGroup<TData>[]
```

返回表格的未固定/中心页脚组。

### `getRightFooterGroups`

```tsx
getRightFooterGroups: () => HeaderGroup<TData>[]
```

返回表格的右侧固定页脚组。

### `getLeftFlatHeaders`

```tsx
getLeftFlatHeaders: () => Header<TData>[]
```

返回表格左侧固定标题的扁平数组，包括父标题。

### `getCenterFlatHeaders`

```tsx
getCenterFlatHeaders: () => Header<TData>[]
```

返回表格未固定/中心标题的扁平数组，包括父标题。

### `getRightFlatHeaders`

```tsx
getRightFlatHeaders: () => Header<TData>[]
```

返回表格右侧固定标题的扁平数组，包括父标题。

### `getLeftLeafHeaders`

```tsx
getLeftLeafHeaders: () => Header<TData>[]
```

返回表格左侧固定叶节点标题的扁平数组。

### `getCenterLeafHeaders`

```tsx
getCenterLeafHeaders: () => Header<TData>[]
```

返回表格未固定/中心叶节点标题的扁平数组。

### `getRightLeafHeaders`

```tsx
getRightLeafHeaders: () => Header<TData>[]
```

返回表格右侧固定叶节点标题的扁平数组。

### `getLeftLeafColumns`

```tsx
getLeftLeafColumns: () => Column<TData>[]
```

返回所有左侧固定叶列。

### `getRightLeafColumns`

```tsx
getRightLeafColumns: () => Column<TData>[]
```

返回所有右侧固定叶列。

### `getCenterLeafColumns`

```tsx
getCenterLeafColumns: () => Column<TData>[]
```

返回所有中心固定（未固定）叶列。

## 列 API

### `getCanPin`

```tsx
getCanPin: () => boolean
```

返回列是否可以被固定。

### `getPinnedIndex`

```tsx
getPinnedIndex: () => number
```

返回列在固定列组中的数字固定索引。

### `getIsPinned`

```tsx
getIsPinned: () => ColumnPinningPosition
```

返回列的固定位置。（`'left'`、`'right'` 或 `false`）

### `pin`

```tsx
pin: (position: ColumnPinningPosition) => void
```

将列固定到 `'left'` 或 `'right'`，或者如果传递 `false` 则将列取消固定到中心。

## 行 API

### `getLeftVisibleCells`

```tsx
getLeftVisibleCells: () => Cell<TData>[]
```

返回行中所有左侧固定叶单元格。

### `getRightVisibleCells`

```tsx
getRightVisibleCells: () => Cell<TData>[]
```

返回行中所有右侧固定叶单元格。

### `getCenterVisibleCells`

```tsx
getCenterVisibleCells: () => Cell<TData>[]
```

返回行中所有中心固定（未固定）叶单元格。