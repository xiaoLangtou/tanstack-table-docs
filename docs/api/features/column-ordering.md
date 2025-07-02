---
title: 列排序 API
id: column-ordering
---

## 状态

列排序状态使用以下结构存储在表格中：

```tsx
export type ColumnOrderTableState = {
  columnOrder: ColumnOrderState
}

export type ColumnOrderState = string[]
```

## 表格选项

### `onColumnOrderChange`

```tsx
onColumnOrderChange?: OnChangeFn<ColumnOrderState>
```

如果提供，当 `state.columnOrder` 更改时，将使用 `updaterFn` 调用此函数。这会覆盖默认的内部状态管理，因此您需要在表格外部完全或部分持久化状态更改。

## 表格 API

### `setColumnOrder`

```tsx
setColumnOrder: (updater: Updater<ColumnOrderState>) => void
```

设置或更新 `state.columnOrder` 状态。

### `resetColumnOrder`

```tsx
resetColumnOrder: (defaultState?: boolean) => void
```

将 **columnOrder** 状态重置为 `initialState.columnOrder`，或者可以传递 `true` 以强制默认空白状态重置为 `[]`。

## 列 API

### `getIndex`

```tsx
getIndex: (position?: ColumnPinningPosition) => number
```

返回列在可见列顺序中的索引。可选择传递 `position` 参数以获取列在表格子部分中的索引。

### `getIsFirstColumn`

```tsx
getIsFirstColumn: (position?: ColumnPinningPosition) => boolean
```

如果列是可见列顺序中的第一列，则返回 `true`。可选择传递 `position` 参数以检查列是否是表格子部分中的第一列。

### `getIsLastColumn`

```tsx
getIsLastColumn: (position?: ColumnPinningPosition) => boolean
```

如果列是可见列顺序中的最后一列，则返回 `true`。可选择传递 `position` 参数以检查列是否是表格子部分中的最后一列。