---
title: 行选择指南
---

## 示例

想要跳转到实现？查看这些示例：

- [React row-selection](https://github.com/TanStack/table/tree/main/examples/react/row-selection)
- [Vue row-selection](https://github.com/TanStack/table/tree/main/examples/vue/row-selection)
- [React expanding](https://github.com/TanStack/table/tree/main/examples/react/expanding)

## API

[行选择 API](../api/features/row-selection.md)

## 行选择指南

行选择功能跟踪哪些行被选中，并允许你以多种方式切换行的选择。让我们看看一些常见的用例。

### 访问行选择状态

表格实例已经为你管理行选择状态（尽管如下所示，在你自己的作用域中管理行选择状态可能更方便）。你可以从几个 API 访问内部行选择状态或选中的行。

- `getState().rowSelection` - 返回内部行选择状态
- `getSelectedRowModel()` - 返回选中的行
- `getFilteredSelectedRowModel()` - 返回过滤后的选中行
- `getGroupedSelectedRowModel()` - 返回分组和排序后的选中行

```ts
console.log(table.getState().rowSelection) //获取行选择状态 - { 1: true, 2: false, etc... }
console.log(table.getSelectedRowModel().rows) //获取完整的客户端选中行
console.log(table.getFilteredSelectedRowModel().rows) //获取过滤的客户端选中行
console.log(table.getGroupedSelectedRowModel().rows) //获取分组的客户端选中行
```

> 注意：如果你使用 `manualPagination`，请注意 `getSelectedRowModel` API 只会返回当前页面上的选中行，因为表格行模型只能基于传入的 `data` 生成行。但是，行选择状态可以包含不在 `data` 数组中的行 id。

### 管理行选择状态

尽管表格实例已经为你管理行选择状态，但通常自己管理状态更方便，以便轻松访问选中的行 id，你可以使用这些 id 进行 API 调用或其他操作。

使用 `onRowSelectionChange` 表格选项将行选择状态提升到你自己的作用域。然后使用 `state` 表格选项将行选择状态传回表格实例。

```ts
const [rowSelection, setRowSelection] = useState<RowSelectionState>({}) //管理你自己的行选择状态

const table = useReactTable({
  //...
  onRowSelectionChange: setRowSelection, //将行选择状态提升到你自己的作用域
  state: {
    rowSelection, //将行选择状态传回表格实例
  },
})
```

### 有用的行 ID

默认情况下，每行的行 id 只是 `row.index`。如果你使用行选择功能，你很可能想要使用更有用的行标识符，因为行选择状态是按行 id 键控的。你可以使用 `getRowId` 表格选项指定一个返回每行唯一行 id 的函数。

```ts
const table = useReactTable({
  //...
  getRowId: row => row.uuid, //使用数据库中行的 uuid 作为行 id
})
```

现在当行被选中时，行选择状态将看起来像这样：

```json
{
  "13e79140-62a8-4f9c-b087-5da737903b76": true,
  "f3e2a5c0-5b7a-4d8a-9a5c-9c9b8a8e5f7e": false
  //...
}
```

而不是这样：

```json
{
  "0": true,
  "1": false
  //...
}
```

### 有条件地启用行选择

默认情况下，所有行都启用行选择。要么有条件地为某些行启用行选择，要么为所有行禁用行选择，你可以使用 `enableRowSelection` 表格选项，它接受布尔值或函数以进行更精细的控制。

```ts
const table = useReactTable({
  //...
  enableRowSelection: row => row.original.age > 18, //只为成年人启用行选择
})
```

要在你的 UI 中强制行是否可选择，你可以为你的复选框或其他选择 UI 使用 `row.getCanSelect()` API。

### 单行选择

默认情况下，表格允许一次选择多行。但是，如果你只想允许一次选择一行，你可以将 `enableMultiRowSelection` 表格选项设置为 `false` 以禁用多行选择，或传入函数以有条件地为行的子行禁用多行选择。

这对于制作具有单选按钮而不是复选框的表格很有用。

```ts
const table = useReactTable({
  //...
  enableMultiRowSelection: false, //一次只允许选择一行
  // enableMultiRowSelection: row => row.original.age > 18, //成年人一次只允许选择一行
})
```

### 子行选择

默认情况下，选择父行将选择其所有子行。如果你想禁用自动子行选择，你可以将 `enableSubRowSelection` 表格选项设置为 `false` 以禁用子行选择，或传入函数以有条件地为行的子行禁用子行选择。

```ts
const table = useReactTable({
  //...
  enableSubRowSelection: false, //禁用子行选择
  // enableSubRowSelection: row => row.original.age > 18, //为成年人禁用子行选择
})
```

### 渲染行选择 UI

TanStack table 不规定你应该如何渲染行选择 UI。你可以使用复选框、单选按钮，或简单地将点击事件连接到行本身。表格实例提供了一些 API 来帮助你渲染行选择 UI。

#### 将行选择 API 连接到复选框输入

TanStack Table 提供了一些处理函数，你可以直接连接到你的复选框输入，以便轻松切换行选择。这些函数自动调用其他内部 API 来更新行选择状态并重新渲染表格。

使用 `row.getToggleSelectedHandler()` API 连接到你的复选框输入以切换行的选择。

使用 `table.getToggleAllRowsSelectedHandler()` 或 `table.getToggleAllPageRowsSelectedHandler` API 连接到你的"全选"复选框输入以切换所有行的选择。

如果你需要对这些函数处理程序进行更精细的控制，你总是可以直接使用 `row.toggleSelected()` 或 `table.toggleAllRowsSelected()` API。或者你甚至可以直接调用 `table.setRowSelection()` API 来直接设置行选择状态，就像你对任何其他状态更新器所做的那样。这些处理函数只是为了方便。

```tsx
const columns = [
  {
    id: 'select-col',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()} //或 getToggleAllPageRowsSelectedHandler
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  //... 更多列定义...
]
```

#### 将行选择 API 连接到 UI

如果你想要更简单的行选择 UI，你可以只将点击事件连接到行本身。`row.getToggleSelectedHandler()` API 对于这个用例也很有用。

```tsx
<tbody>
  {table.getRowModel().rows.map(row => {
    return (
      <tr
        key={row.id}
        className={row.getIsSelected() ? 'selected' : null}
        onClick={row.getToggleSelectedHandler()}
      >
        {row.getVisibleCells().map(cell => {
          return <td key={cell.id}>{/* */}</td>
        })}
      </tr>
    )
  })}
</tbody>
```