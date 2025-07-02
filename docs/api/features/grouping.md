---
title: 分组 API
id: grouping
---

## 状态

分组状态使用以下结构存储在表格中：

```tsx
export type GroupingState = string[]

export type GroupingTableState = {
  grouping: GroupingState
}
```

## 聚合函数

以下聚合函数内置于表格核心中：

- `sum`
  - 对一组行的值求和
- `min`
  - 查找一组行的最小值
- `max`
  - 查找一组行的最大值
- `extent`
  - 查找一组行的最小值和最大值
- `mean`
  - 查找一组行的平均值
- `median`
  - 查找一组行的中位数值
- `unique`
  - 查找一组行的唯一值
- `uniqueCount`
  - 查找一组行的唯一值数量
- `count`
  - 计算组中的行数

每个分组函数接收：

- 一个检索组行叶值的函数
- 一个检索组行直接子值的函数

并应返回一个值（通常是原始值）来构建聚合行模型。

这是每个聚合函数的类型签名：

```tsx
export type AggregationFn<TData extends AnyData> = (
  getLeafRows: () => Row<TData>[],
  getChildRows: () => Row<TData>[]
) => any
```

#### 使用聚合函数

聚合函数可以通过向 `columnDefinition.aggregationFn` 传递以下内容来使用/引用/定义：

- 引用内置聚合函数的 `string`
- 引用通过 `tableOptions.aggregationFns` 选项提供的自定义聚合函数的 `string`
- 直接提供给 `columnDefinition.aggregationFn` 选项的函数

`columnDef.aggregationFn` 可用的最终聚合函数列表使用以下类型：

```tsx
export type AggregationFnOption<TData extends AnyData> =
  | 'auto'
  | keyof AggregationFns
  | BuiltInAggregationFn
  | AggregationFn<TData>
```

## 列定义选项

### `aggregationFn`

```tsx
aggregationFn?: AggregationFn | keyof AggregationFns | keyof BuiltInAggregationFns
```

与此列一起使用的聚合函数。

选项：

- 引用[内置聚合函数](#aggregation-functions)的 `string`
- [自定义聚合函数](#aggregation-functions)

### `aggregatedCell`

```tsx
aggregatedCell?: Renderable<
  {
    table: Table<TData>
    row: Row<TData>
    column: Column<TData>
    cell: Cell<TData>
    getValue: () => any
    renderValue: () => any
  }
>
```

如果单元格是聚合的，则为列的每一行显示的单元格。如果传递了函数，它将传递一个带有单元格上下文的 props 对象，并应返回适配器的属性类型（确切类型取决于所使用的适配器）。

### `enableGrouping`

```tsx
enableGrouping?: boolean
```

启用/禁用此列的分组。

### `getGroupingValue`

```tsx
getGroupingValue?: (row: TData) => any
```

指定用于在此列上分组行的值。如果未指定此选项，将使用从 `accessorKey` / `accessorFn` 派生的值。

## 列 API

### `aggregationFn`

```tsx
aggregationFn?: AggregationFnOption<TData>
```

列的已解析聚合函数。

### `getCanGroup`

```tsx
getCanGroup: () => boolean
```

返回列是否可以分组。

### `getIsGrouped`

```tsx
getIsGrouped: () => boolean
```

返回列当前是否已分组。

### `getGroupedIndex`

```tsx
getGroupedIndex: () => number
```

返回列在分组状态中的索引。

### `toggleGrouping`

```tsx
toggleGrouping: () => void
```

切换列的分组状态。

### `getToggleGroupingHandler`

```tsx
getToggleGroupingHandler: () => () => void
```

返回切换列分组状态的函数。这对于传递给按钮的 `onClick` 属性很有用。

### `getAutoAggregationFn`

```tsx
getAutoAggregationFn: () => AggregationFn<TData> | undefined
```

返回列的自动推断聚合函数。

### `getAggregationFn`

```tsx
getAggregationFn: () => AggregationFn<TData> | undefined
```

返回列的聚合函数。

## 行 API

### `groupingColumnId`

```tsx
groupingColumnId?: string
```

如果此行已分组，这是此行分组依据的列的 id。

### `groupingValue`

```tsx
groupingValue?: any
```

如果此行已分组，这是此组中所有行的 `groupingColumnId` 的唯一/共享值。

### `getIsGrouped`

```tsx
getIsGrouped: () => boolean
```

返回行当前是否已分组。

### `getGroupingValue`

```tsx
getGroupingValue: (columnId: string) => unknown
```

返回任何行和列的分组值（包括叶行）。

## 表格选项

### `aggregationFns`

```tsx
aggregationFns?: Record<string, AggregationFn>
```

此选项允许您定义自定义聚合函数，这些函数可以通过其键在列的 `aggregationFn` 选项中引用。
示例：

```tsx
declare module '@tanstack/table-core' {
  interface AggregationFns {
    myCustomAggregation: AggregationFn<unknown>
  }
}

const column = columnHelper.data('key', {
  aggregationFn: 'myCustomAggregation',
})

const table = useReactTable({
  columns: [column],
  aggregationFns: {
    myCustomAggregation: (columnId, leafRows, childRows) => {
      // 返回聚合值
    },
  },
})
```

### `manualGrouping`

```tsx
manualGrouping?: boolean
```

启用手动分组。如果此选项设置为 `true`，表格将不会使用 `getGroupedRowModel()` 自动分组行，而是期望您在将行传递给表格之前手动分组行。这在进行服务器端分组和聚合时很有用。

### `onGroupingChange`

```tsx
onGroupingChange?: OnChangeFn<GroupingState>
```

如果提供此函数，当分组状态更改时将调用它，您需要自己管理状态。您可以通过 `tableOptions.state.grouping` 选项将管理的状态传递回表格。

### `enableGrouping`

```tsx
enableGrouping?: boolean
```

启用/禁用所有列的分组。

### `getGroupedRowModel`

```tsx
getGroupedRowModel?: (table: Table<TData>) => () => RowModel<TData>
```

返回分组发生后的行模型，但不再进一步。

### `groupedColumnMode`

```tsx
groupedColumnMode?: false | 'reorder' | 'remove' // 默认: `reorder`
```

分组列默认自动重新排序到列列表的开始。如果您希望删除它们或保持原样，请在此处设置适当的模式。

## 表格 API

### `setGrouping`

```tsx
setGrouping: (updater: Updater<GroupingState>) => void
```

设置或更新 `state.grouping` 状态。

### `resetGrouping`

```tsx
resetGrouping: (defaultState?: boolean) => void
```

将 **grouping** 状态重置为 `initialState.grouping`，或者可以传递 `true` 以强制默认空白状态重置为 `[]`。

### `getPreGroupedRowModel`

```tsx
getPreGroupedRowModel: () => RowModel<TData>
```

返回应用任何分组之前的表格行模型。

### `getGroupedRowModel`

```tsx
getGroupedRowModel: () => RowModel<TData>
```

返回应用分组后的表格行模型。

## 单元格 API

### `getIsAggregated`

```tsx
getIsAggregated: () => boolean
```

返回单元格当前是否已聚合。

### `getIsGrouped`

```tsx
getIsGrouped: () => boolean
```

返回单元格当前是否已分组。

### `getIsPlaceholder`

```tsx
getIsPlaceholder: () => boolean
```

返回单元格当前是否为占位符。