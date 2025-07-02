---
title: 列大小调整 API
id: column-sizing
---

## 状态

列大小调整状态使用以下结构存储在表格中：

```tsx
export type ColumnSizingTableState = {
  columnSizing: ColumnSizing
  columnSizingInfo: ColumnSizingInfoState
}

export type ColumnSizing = Record<string, number>

export type ColumnSizingInfoState = {
  startOffset: null | number
  startSize: null | number
  deltaOffset: null | number
  deltaPercentage: null | number
  isResizingColumn: false | string
  columnSizingStart: [string, number][]
}
```

## 列定义选项

### `enableResizing`

```tsx
enableResizing?: boolean
```

启用或禁用该列的列大小调整功能。

### `size`

```tsx
size?: number
```

列的期望大小

### `minSize`

```tsx
minSize?: number
```

列的最小允许大小

### `maxSize`

```tsx
maxSize?: number
```

列的最大允许大小

## 列 API

### `getSize`

```tsx
getSize: () => number
```

返回列的当前大小

### `getStart`

```tsx
getStart: (position?: ColumnPinningPosition) => number
```

返回列沿行轴（对于标准表格通常是 x 轴）的偏移测量值，测量所有前置列的大小。

对于列的粘性或绝对定位很有用。（例如 `left` 或 `transform`）

### `getAfter`

```tsx
getAfter: (position?: ColumnPinningPosition) => number
```

返回列沿行轴（对于标准表格通常是 x 轴）的偏移测量值，测量所有后续列的大小。

对于列的粘性或绝对定位很有用。（例如 `right` 或 `transform`）

### `getCanResize`

```tsx
getCanResize: () => boolean
```

如果列可以调整大小，则返回 `true`。

### `getIsResizing`

```tsx
getIsResizing: () => boolean
```

如果列当前正在调整大小，则返回 `true`。

### `resetSize`

```tsx
resetSize: () => void
```

将列大小重置为其初始大小。

## 标题 API

### `getSize`

```tsx
getSize: () => number
```

返回标题的大小，通过汇总属于它的所有叶列的大小来计算。

### `getStart`

```tsx
getStart: (position?: ColumnPinningPosition) => number
```

返回标题沿行轴（对于标准表格通常是 x 轴）的偏移测量值。这实际上是所有前置标题的偏移测量值的总和。

### `getResizeHandler`

```tsx
getResizeHandler: () => (event: unknown) => void
```

返回可用于调整标题大小的事件处理函数。它可以用作：

- `onMouseDown` 处理程序
- `onTouchStart` 处理程序

拖拽和释放事件会自动为您处理。

## 表格选项

### `enableColumnResizing`

```tsx
enableColumnResizing?: boolean
```

启用/禁用*所有列*的列大小调整功能。

### `columnResizeMode`

```tsx
columnResizeMode?: 'onChange' | 'onEnd'
```

确定何时更新 columnSizing 状态。`onChange` 在用户拖拽调整大小手柄时更新状态。`onEnd` 在用户释放调整大小手柄时更新状态。

### `columnResizeDirection`

```tsx
columnResizeDirection?: 'ltr' | 'rtl'
```

启用或禁用列大小调整的从右到左支持。默认为 'ltr'。

### `onColumnSizingChange`

```tsx
onColumnSizingChange?: OnChangeFn<ColumnSizingState>
```

当 columnSizing 状态更改时，将调用此可选函数。如果您提供此函数，您将负责自己维护其状态。您可以通过 `state.columnSizing` 表格选项将此状态传递回表格。

### `onColumnSizingInfoChange`

```tsx
onColumnSizingInfoChange?: OnChangeFn<ColumnSizingInfoState>
```

当 columnSizingInfo 状态更改时，将调用此可选函数。如果您提供此函数，您将负责自己维护其状态。您可以通过 `state.columnSizingInfo` 表格选项将此状态传递回表格。

## 表格 API

### `setColumnSizing`

```tsx
setColumnSizing: (updater: Updater<ColumnSizingState>) => void
```

使用更新函数或值设置列大小调整状态。如果向表格选项传递了 `onColumnSizingChange` 函数，这将触发底层的该函数，否则状态将由表格自动管理。

### `setColumnSizingInfo`

```tsx
setColumnSizingInfo: (updater: Updater<ColumnSizingInfoState>) => void
```

使用更新函数或值设置列大小调整信息状态。如果向表格选项传递了 `onColumnSizingInfoChange` 函数，这将触发底层的该函数，否则状态将由表格自动管理。

### `resetColumnSizing`

```tsx
resetColumnSizing: (defaultState?: boolean) => void
```

将列大小调整重置为其初始状态。如果 `defaultState` 为 `true`，将使用表格的默认状态而不是提供给表格的 initialValue。

### `resetHeaderSizeInfo`

```tsx
resetHeaderSizeInfo: (defaultState?: boolean) => void
```

将列大小调整信息重置为其初始状态。如果 `defaultState` 为 `true`，将使用表格的默认状态而不是提供给表格的 initialValue。

### `getTotalSize`

```tsx
getTotalSize: () => number
```

通过计算所有叶列大小的总和来返回表格的总大小。

### `getLeftTotalSize`

```tsx
getLeftTotalSize: () => number
```

如果使用固定，通过计算所有左侧叶列大小的总和来返回表格左侧部分的总大小。

### `getCenterTotalSize`

```tsx
getCenterTotalSize: () => number
```

如果使用固定，通过计算所有未固定/中心叶列大小的总和来返回表格中心部分的总大小。

### `getRightTotalSize`

```tsx
getRightTotalSize: () => number
```

如果使用固定，通过计算所有右侧叶列大小的总和来返回表格右侧部分的总大小。