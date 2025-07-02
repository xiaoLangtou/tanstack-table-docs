---
title: 列固定指南
---

## 示例

想要跳转到实现？查看这些示例：

- [column-pinning](../framework/react/examples/column-pinning)
- [sticky-column-pinning](../framework/react/examples/column-pinning-sticky)

 ### 其他示例
 
- [Svelte column-pinning](../framework/svelte/examples/column-pinning)
- [Vue column-pinning](../framework/vue/examples/column-pinning)

## API

[列固定 API](../api/features/column-pinning)

## 列固定指南

TanStack Table 提供了有助于在表格 UI 中实现列固定功能的状态和 API。你可以通过多种方式实现列固定。你可以将固定列拆分为自己的独立表格，或者你可以将所有列保留在同一个表格中，但使用固定状态来正确排序列并使用粘性 CSS 将列固定到左侧或右侧。

### 列固定如何影响列顺序

有 3 个表格功能可以重新排序列，按以下顺序发生：

1. **列固定** - 如果固定，列被分为左侧、中心（未固定）和右侧固定列。
2. 手动[列排序](column-ordering) - 应用手动指定的列顺序。
3. [分组](grouping) - 如果启用分组，分组状态处于活动状态，并且 `tableOptions.groupedColumnMode` 设置为 `'reorder' | 'remove'`，则分组列重新排序到列流的开始。

更改固定列顺序的唯一方法是在 `columnPinning.left` 和 `columnPinning.right` 状态本身中。`columnOrder` 状态只会影响未固定（"中心"）列的顺序。

### 列固定状态

管理 `columnPinning` 状态是可选的，通常不是必需的，除非你要添加持久状态功能。TanStack Table 已经为你跟踪列固定状态。如果需要，可以像管理任何其他表格状态一样管理 `columnPinning` 状态。

```jsx
const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
  left: [],
  right: [],
});
//...
const table = useReactTable({
  //...
  state: {
    columnPinning,
    //...
  }
  onColumnPinningChange: setColumnPinning,
  //...
});
```

### 默认固定列

一个非常常见的用例是默认固定一些列。你可以通过使用固定的 columnIds 初始化 `columnPinning` 状态，或使用 `initialState` 表格选项来实现这一点

```jsx
const table = useReactTable({
  //...
  initialState: {
    columnPinning: {
      left: ['expand-column'],
      right: ['actions-column'],
    },
    //...
  }
  //...
});
```

### 有用的列固定 API

> 注意：其中一些 API 是 v8.12.0 中的新功能

有一些有用的列 API 方法可以帮助你实现列固定功能：

- [`column.getCanPin`](../api/features/column-pinning#getcanpin)：用于确定列是否可以固定。
- [`column.pin`](../api/features/column-pinning#pin)：用于将列固定到左侧或右侧。或用于取消固定列。
- [`column.getIsPinned`](../api/features/column-pinning#getispinned)：用于确定列固定在哪里。
- [`column.getStart`](../api/features/column-pinning#getstart)：用于为固定列提供正确的 `left` CSS 值。
- [`column.getAfter`](../api/features/column-pinning#getafter)：用于为固定列提供正确的 `right` CSS 值。
- [`column.getIsLastColumn`](../api/features/column-pinning#getislastcolumn)：用于确定列是否是其固定组中的最后一列。对于添加 box-shadow 很有用
- [`column.getIsFirstColumn`](../api/features/column-pinning#getisfirstcolumn)：用于确定列是否是其固定组中的第一列。对于添加 box-shadow 很有用

### 拆分表格列固定

如果你只是使用粘性 CSS 来固定列，你大部分情况下可以使用 `table.getHeaderGroups` 和 `row.getVisibleCells` 方法正常渲染表格。

但是，如果你将固定列拆分为自己的独立表格，你可以使用 `table.getLeftHeaderGroups`、`table.getCenterHeaderGroups`、`table.getRightHeaderGroups`、`row.getLeftVisibleCells`、`row.getCenterVisibleCells` 和 `row.getRightVisibleCells` 方法来仅渲染与当前表格相关的列。