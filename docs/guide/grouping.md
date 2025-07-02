---
title: 分组指南
---

## 示例

想要跳转到实现？查看这些示例：

- [grouping](https://github.com/TanStack/table/tree/main/examples/react/grouping)

## API

[分组 API](../api/features/grouping.md)

## 分组指南

有 3 个表格功能可以重新排序列，按以下顺序发生：

1. [列固定](../column-pinning.md) - 如果固定，列被分为左、中（未固定）和右固定列。
2. 手动[列排序](../column-ordering.md) - 应用手动指定的列顺序。
3. **分组** - 如果启用分组，分组状态处于活动状态，并且 `tableOptions.groupedColumnMode` 设置为 `'reorder' | 'remove'`，则分组列将重新排序到列流的开始。

TanStack table 中的分组是一个应用于列的功能，允许你根据特定列对表格行进行分类和组织。这在你有大量数据并希望根据某些标准将它们分组在一起的情况下很有用。

要使用分组功能，你需要使用分组行模型。此模型负责根据分组状态对行进行分组。

```tsx
import { getGroupedRowModel } from '@tanstack/react-table'

const table = useReactTable({
  // 其他选项...
  getGroupedRowModel: getGroupedRowModel(),
})
```

当分组状态处于活动状态时，表格将匹配的行作为 subRows 添加到分组行。分组行将在与第一个匹配行相同的索引处添加到表格行中。匹配的行将从表格行中删除。
要允许用户展开和折叠分组行，你可以使用展开功能。

```tsx
import { getGroupedRowModel, getExpandedRowModel} from '@tanstack/react-table'

const table = useReactTable({
  // 其他选项...
  getGroupedRowModel: getGroupedRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})
```

### 分组状态

分组状态是一个字符串数组，其中每个字符串是要分组的列的 ID。数组中字符串的顺序决定了分组的顺序。例如，如果分组状态是 ['column1', 'column2']，则表格将首先按 column1 分组，然后在每个组内，它将按 column2 分组。你可以使用 setGrouping 函数控制分组状态：

```tsx
table.setGrouping(['column1', 'column2']);
```

你也可以使用 resetGrouping 函数将分组状态重置为其初始状态：

```tsx
table.resetGrouping();
```

默认情况下，当列被分组时，它会移动到表格的开始。你可以使用 groupedColumnMode 选项控制此行为。如果你将其设置为 'reorder'，则分组列将移动到表格的开始。如果你将其设置为 'remove'，则分组列将从表格中删除。如果你将其设置为 false，则分组列不会被移动或删除。

```tsx
const table = useReactTable({
  // 其他选项...
  groupedColumnMode: 'reorder',
})
```

### 聚合

当行被分组时，你可以使用 aggregationFn 选项按列聚合分组行中的数据。这是聚合函数的 ID 字符串。你可以使用 aggregationFns 选项定义聚合函数。

```tsx
const column = columnHelper.accessor('key', {
  aggregationFn: 'sum',
})
```

在上面的示例中，sum 聚合函数将用于聚合分组行中的数据。
默认情况下，数字列将使用 sum 聚合函数，非数字列将使用 count 聚合函数。你可以通过在列定义中指定 aggregationFn 选项来覆盖此行为。

有几个内置聚合函数可以使用：

- sum - 对分组行中的值求和。
- count - 计算分组行中的行数。
- min - 查找分组行中的最小值。
- max - 查找分组行中的最大值。
- extent - 查找分组行中值的范围（最小值和最大值）。
- mean - 查找分组行中值的平均值。
- median - 查找分组行中值的中位数。
- unique - 返回分组行中唯一值的数组。
- uniqueCount - 计算分组行中唯一值的数量。

#### 自定义聚合

当行被分组时，你可以使用 aggregationFns 选项聚合分组行中的数据。这是一个记录，其中键是聚合函数的 ID，值是聚合函数本身。然后你可以在列的 aggregationFn 选项中引用这些聚合函数。

```tsx
const table = useReactTable({
  // 其他选项...
  aggregationFns: {
    myCustomAggregation: (columnId, leafRows, childRows) => {
      // 返回聚合值
    },
  },
})
```

在上面的示例中，myCustomAggregation 是一个自定义聚合函数，它接受列 ID、叶子行和子行，并返回聚合值。然后你可以在列的 aggregationFn 选项中使用此聚合函数：

```tsx
const column = columnHelper.accessor('key', {
  aggregationFn: 'myCustomAggregation',
})
```

### 手动分组

如果你正在进行服务器端分组和聚合，你可以使用 manualGrouping 选项启用手动分组。当此选项设置为 true 时，表格不会使用 getGroupedRowModel() 自动分组行，而是期望你在将行传递给表格之前手动分组行。

```tsx
const table = useReactTable({
  // 其他选项...
  manualGrouping: true,
})
```

> **注意：** 目前没有很多已知的简单方法来使用 TanStack Table 进行服务器端分组。你需要进行大量自定义单元格渲染才能使其工作。

### 分组更改处理程序

如果你想自己管理分组状态，你可以使用 onGroupingChange 选项。此选项是在分组状态更改时调用的函数。你可以通过 tableOptions.state.grouping 选项将管理的状态传回表格。

```tsx
const [grouping, setGrouping] = useState<string[]>([])

const table = useReactTable({
  // 其他选项...
  state: {
    grouping: grouping,
  },
  onGroupingChange: setGrouping
})
```