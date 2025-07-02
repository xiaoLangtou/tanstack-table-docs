---
title: 列可见性指南
---

## 示例

想要跳转到实现？查看这些示例：

- [column-visibility](https://github.com/TanStack/table/tree/main/examples/react/column-visibility)
- [column-ordering](https://github.com/TanStack/table/tree/main/examples/react/column-ordering)
- [sticky-column-pinning](https://github.com/TanStack/table/tree/main/examples/react/column-pinning-sticky)

### 其他示例

- [SolidJS column-visibility](https://github.com/TanStack/table/tree/main/examples/solid/column-visibility)
- [Svelte column-visibility](https://github.com/TanStack/table/tree/main/examples/svelte/column-visibility)

## API

[列可见性 API](../api/features/column-visibility.md)

## 列可见性指南

列可见性功能允许表格列动态隐藏或显示。在 react-table 的早期版本中，此功能是列上的静态属性，但在 v8 中，有专用的 `columnVisibility` 状态和用于动态管理列可见性的 API。

### 列可见性状态

`columnVisibility` 状态是列 ID 到布尔值的映射。如果列的 ID 存在于映射中且值为 `false`，则该列将被隐藏。如果列 ID 不存在于映射中，或值为 `true`，则该列将显示。

```jsx
const [columnVisibility, setColumnVisibility] = useState({
  columnId1: true,
  columnId2: false, //默认隐藏此列
  columnId3: true,
});

const table = useReactTable({
  //...
  state: {
    columnVisibility,
    //...
  },
  onColumnVisibilityChange: setColumnVisibility,
});
```

或者，如果你不需要在表格外部管理列可见性状态，你仍然可以使用 `initialState` 选项设置初始默认列可见性状态。

> **注意**：如果 `columnVisibility` 同时提供给 `initialState` 和 `state`，`state` 初始化将优先，`initialState` 将被忽略。不要同时向 `initialState` 和 `state` 提供 `columnVisibility`，只提供其中一个。

```jsx
const table = useReactTable({
  //...
  initialState: {
    columnVisibility: {
      columnId1: true,
      columnId2: false, //默认隐藏此列
      columnId3: true,
    },
    //...
  },
});
```

### 禁用隐藏列

默认情况下，所有列都可以隐藏或显示。如果你想阻止某些列被隐藏，你可以为这些列将 `enableHiding` 列选项设置为 `false`。

```jsx
const columns = [
  {
    header: 'ID',
    accessorKey: 'id',
    enableHiding: false, // 为此列禁用隐藏
  },
  {
    header: 'Name',
    accessor: 'name', // 可以被隐藏
  },
];
```

### 列可见性切换 API

有几个列 API 方法对于在 UI 中渲染列可见性切换很有用。

- `column.getCanHide` - 对于为 `enableHiding` 设置为 `false` 的列禁用可见性切换很有用。
- `column.getIsVisible` - 对于设置可见性切换的初始状态很有用。
- `column.toggleVisibility` - 对于切换列的可见性很有用。
- `column.getToggleVisibilityHandler` - 将 `column.toggleVisibility` 方法连接到 UI 事件处理程序的快捷方式。

```jsx
{table.getAllColumns().map((column) => (
  <label key={column.id}>
    <input
      checked={column.getIsVisible()}
      disabled={!column.getCanHide()}
      onChange={column.getToggleVisibilityHandler()}
      type="checkbox"
    />
    {column.columnDef.header}
  </label>
))}
```

### 列可见性感知表格 API

当你渲染标题、主体和页脚单元格时，有很多 API 选项可用。你可能会看到像 `table.getAllLeafColumns` 和 `row.getAllCells` 这样的 API，但如果你使用这些 API，它们不会考虑列可见性。相反，你需要使用这些 API 的"可见"变体，如 `table.getVisibleLeafColumns` 和 `row.getVisibleCells`。

```jsx
<table>
  <thead>
    <tr>
      {table.getVisibleLeafColumns().map((column) => ( // 考虑列可见性
        //
      ))}
    </tr>
  </thead>
  <tbody>
    {table.getRowModel().rows.map((row) => (
      <tr key={row.id}>
        {row.getVisibleCells().map((cell) => ( // 考虑列可见性
          //
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

如果你使用标题组 API，它们已经会考虑列可见性。