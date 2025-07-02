---
title: 列可见性 API
id: column-visibility
---

## 状态

列可见性状态使用以下结构存储在表格中：

```tsx
export type VisibilityState = Record<string, boolean>

export type VisibilityTableState = {
  columnVisibility: VisibilityState
}
```

## 列定义选项

### `enableHiding`

```tsx
enableHiding?: boolean
```

启用/禁用隐藏该列

## 列 API

### `getCanHide`

```tsx
getCanHide: () => boolean
```

返回列是否可以被隐藏

### `getIsVisible`

```tsx
getIsVisible: () => boolean
```

返回列是否可见

### `toggleVisibility`

```tsx
toggleVisibility: (value?: boolean) => void
```

切换列可见性

### `getToggleVisibilityHandler`

```tsx
getToggleVisibilityHandler: () => (event: unknown) => void
```

返回可用于切换列可见性的函数。此函数可用于绑定到复选框的事件处理程序。

## 表格选项

### `onColumnVisibilityChange`

```tsx
onColumnVisibilityChange?: OnChangeFn<VisibilityState>
```

如果提供，当 `state.columnVisibility` 更改时，将使用 `updaterFn` 调用此函数。这会覆盖默认的内部状态管理，因此您需要在表格外部完全或部分持久化状态更改。

### `enableHiding`

```tsx
enableHiding?: boolean
```

启用/禁用列的隐藏功能。

## 表格 API

### `getVisibleFlatColumns`

```tsx
getVisibleFlatColumns: () => Column<TData>[]
```

返回可见列的扁平数组，包括父列。

### `getVisibleLeafColumns`

```tsx
getVisibleLeafColumns: () => Column<TData>[]
```

返回可见叶节点列的扁平数组。

### `getLeftVisibleLeafColumns`

```tsx
getLeftVisibleLeafColumns: () => Column<TData>[]
```

如果使用列固定，返回表格左侧部分可见叶节点列的扁平数组。

### `getRightVisibleLeafColumns`

```tsx
getRightVisibleLeafColumns: () => Column<TData>[]
```

如果使用列固定，返回表格右侧部分可见叶节点列的扁平数组。

### `getCenterVisibleLeafColumns`

```tsx
getCenterVisibleLeafColumns: () => Column<TData>[]
```

如果使用列固定，返回表格未固定/中心部分可见叶节点列的扁平数组。

### `setColumnVisibility`

```tsx
setColumnVisibility: (updater: Updater<VisibilityState>) => void
```

通过更新函数或值更新列可见性状态

### `resetColumnVisibility`

```tsx
resetColumnVisibility: (defaultState?: boolean) => void
```

将列可见性状态重置为初始状态。如果提供 `defaultState`，状态将重置为 `{}`

### `toggleAllColumnsVisible`

```tsx
toggleAllColumnsVisible: (value?: boolean) => void
```

切换所有列的可见性

### `getIsAllColumnsVisible`

```tsx
getIsAllColumnsVisible: () => boolean
```

返回是否所有列都可见

### `getIsSomeColumnsVisible`

```tsx
getIsSomeColumnsVisible: () => boolean
```

返回是否有些列可见

### `getToggleAllColumnsVisibilityHandler`

```tsx
getToggleAllColumnsVisibilityHandler: () => ((event: unknown) => void)
```

返回用于切换所有列可见性的处理程序，旨在绑定到 `input[type=checkbox]` 元素。

## 行 API

### `getVisibleCells`

```tsx
getVisibleCells: () => Cell<TData>[]
```

返回考虑行的列可见性的单元格数组。