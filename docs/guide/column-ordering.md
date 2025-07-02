---
title: 列排序指南
---

## 示例

想要跳转到实现？查看这些示例：

- [column-ordering](https://github.com/TanStack/table/tree/main/examples/react/column-ordering)
- [column-dnd](https://github.com/TanStack/table/tree/main/examples/react/column-dnd)

## API

[列排序 API](../api/features/column-ordering.md)

## 列排序指南

默认情况下，列按照它们在 `columns` 数组中定义的顺序排序。但是，你可以使用 `columnOrder` 状态手动指定列顺序。其他功能如列固定和分组也可以影响列顺序。

### 影响列顺序的因素

有 3 个表格功能可以重新排序列，按以下顺序发生：

1. [列固定](column-pinning) - 如果固定，列被分为左侧、中心（未固定）和右侧固定列。
2. 手动**列排序** - 应用手动指定的列顺序。
3. [分组](grouping) - 如果启用分组，分组状态处于活动状态，并且 `tableOptions.groupedColumnMode` 设置为 `'reorder' | 'remove'`，则分组列重新排序到列流的开始。

> **注意：** 如果与列固定结合使用，`columnOrder` 状态只会影响未固定的列。

### 列顺序状态

如果你不提供 `columnOrder` 状态，TanStack Table 将只使用 `columns` 数组中列的顺序。但是，你可以向 `columnOrder` 状态提供字符串列 id 数组来指定列的顺序。

#### 默认列顺序

如果你只需要指定初始列顺序，你可以在 `initialState` 表格选项中指定 `columnOrder` 状态。

```jsx
const table = useReactTable({
  //...
  initialState: {
    columnOrder: ['columnId1', 'columnId2', 'columnId3'],
  }
  //...
});
```

> **注意：** 如果你使用 `state` 表格选项来同时指定 `columnOrder` 状态，`initialState` 将不起作用。只在 `initialState` 或 `state` 中指定特定状态，不要两者都指定。

#### 管理列顺序状态

如果你需要动态更改列顺序，或在表格初始化后设置列顺序，你可以像管理任何其他表格状态一样管理 `columnOrder` 状态。

```jsx
const [columnOrder, setColumnOrder] = useState<string[]>(['columnId1', 'columnId2', 'columnId3']); //可选择初始化列顺序
//...
const table = useReactTable({
  //...
  state: {
    columnOrder,
    //...
  }
  onColumnOrderChange: setColumnOrder,
  //...
});
```

### 重新排序列

如果表格有允许用户重新排序列的 UI，你可以设置类似这样的逻辑：

```tsx
const [columnOrder, setColumnOrder] = useState<string[]>(columns.map(c => c.id));

//根据你选择的 dnd 解决方案，你可能需要也可能不需要这样的状态
const [movingColumnId, setMovingColumnId] = useState<string | null>(null);
const [targetColumnId, setTargetColumnId] = useState<string | null>(null);

//用于拼接和重新排序 columnOrder 数组的工具函数
const reorderColumn = <TData extends RowData>(
  movingColumnId: Column<TData>,
  targetColumnId: Column<TData>,
): string[] => {
  const newColumnOrder = [...columnOrder];
  newColumnOrder.splice(
    newColumnOrder.indexOf(targetColumnId),
    0,
    newColumnOrder.splice(newColumnOrder.indexOf(movingColumnId), 1)[0],
  );
  setColumnOrder(newColumnOrder);
};

const handleDragEnd = (e: DragEvent) => {
  if(!movingColumnId || !targetColumnId) return;
  setColumnOrder(reorderColumn(movingColumnId, targetColumnId));
};

//使用你选择的 dnd 解决方案
```

#### 拖放列重新排序建议（React）

毫无疑问，有许多方法可以与 TanStack Table 一起实现拖放功能。以下是一些建议，让你不会遇到糟糕的体验：

1. 如果你使用 React 18 或更新版本，请不要尝试使用 [`"react-dnd"`](https://react-dnd.github.io/react-dnd/docs/overview)。React DnD 在其时代是一个重要的库，但现在更新不够频繁，并且与 React 18 不兼容，特别是在 React 严格模式下。虽然仍然可以让它工作，但有更新的替代方案具有更好的兼容性并且维护更积极。React DnD 的 Provider 也可能干扰并与你可能想在应用中尝试的任何其他 DnD 解决方案冲突。

2. 使用 [`"@dnd-kit/core"`](https://dndkit.com/)。DnD Kit 是一个现代、模块化和轻量级的拖放库，与现代 React 生态系统高度兼容，并且与语义 `<table>` 标记配合良好。官方 TanStack DnD 示例，[列 DnD](https://github.com/TanStack/table/tree/main/examples/react/column-dnd) 和 [行 DnD](https://github.com/TanStack/table/tree/main/examples/react/row-dnd)，现在都使用 DnD Kit。

3. 考虑其他 DnD 库，如 [`"react-beautiful-dnd"`](https://github.com/atlassian/react-beautiful-dnd)，但要注意它们可能很大的包大小、维护状态以及与 `<table>` 标记的兼容性。

4. 考虑使用原生浏览器事件和状态管理来实现轻量级拖放功能。但是，请注意，如果你不额外努力实现适当的触摸事件，这种方法可能不适合移动用户。[Material React Table V2](https://www.material-react-table.com/docs/examples/column-ordering) 是一个库的示例，它仅使用浏览器拖放事件（如 `onDragStart`、`onDragEnd`、`onDragEnter`）而没有其他依赖项来实现 TanStack Table。浏览其源代码以了解如何完成。