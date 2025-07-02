---
title: 展开指南
---

## 示例

想要跳转到实现？查看这些示例：

- [expanding](../framework/react/examples/expanding)
- [grouping](../framework/react/examples/grouping)
- [sub-components](../framework/react/examples/sub-components)

## API

[展开 API](../api/features/expanding)

## 展开功能指南

展开是一个允许你显示和隐藏与特定行相关的额外数据行的功能。这在你有分层数据并希望允许用户从更高级别深入数据的情况下很有用。或者它对于显示与行相关的额外信息很有用。

### 展开功能的不同用例

TanStack Table 中的展开功能有多个用例，将在下面讨论。

1. 展开子行（子行、聚合行等）
2. 展开自定义 UI（详细面板、子表格等）

### 启用客户端展开

要使用客户端展开功能，你需要在表格选项中定义 getExpandedRowModel 函数。此函数负责返回展开的行模型。

```ts
const table = useReactTable({
  // 其他选项...
  getExpandedRowModel: getExpandedRowModel(),
})
```

展开的数据可以包含表格行或你想要显示的任何其他数据。我们将在本指南中讨论如何处理这两种情况。

### 表格行作为展开数据

展开行本质上是继承与其父行相同列结构的子行。如果你的数据对象已经包含这些展开行数据，你可以利用 `getSubRows` 函数来指定这些子行。但是，如果你的数据对象不包含展开行数据，它们可以被视为自定义展开数据，这在下一节中讨论。

例如，如果你有这样的数据对象：

```ts
type Person = {
  id: number
  name: string
  age: number
  children?: Person[] | undefined
}

const data: Person[] =  [
  { id: 1, 
  name: 'John', 
  age: 30, 
  children: [
      { id: 2, name: 'Jane', age: 5 },
      { id: 5, name: 'Jim', age: 10 }
    ] 
  },
  { id: 3,
   name: 'Doe', 
   age: 40, 
    children: [
      { id: 4, name: 'Alice', age: 10 }
    ] 
  },
]
```

然后你可以使用 getSubRows 函数返回每行中的 children 数组作为展开行。表格实例现在将了解在每行上查找子行的位置。

```ts
const table = useReactTable({
  // 其他选项...
  getSubRows: (row) => row.children, // 返回 children 数组作为子行
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})
```

> **注意：** 你可以有一个复杂的 `getSubRows` 函数，但请记住它将为每行和每个子行运行。如果函数没有优化，这可能会很昂贵。不支持异步函数。

### 自定义展开 UI

在某些情况下，你可能希望显示额外的详细信息或信息，这些信息可能是也可能不是表格数据对象的一部分，例如行的展开数据。这种展开行 UI 多年来有许多名称，包括"可展开行"、"详细面板"、"子组件"等。

默认情况下，`row.getCanExpand()` 行实例 API 将返回 false，除非它在行上找到 `subRows`。这可以通过在表格实例选项中实现你自己的 `getRowCanExpand` 函数来覆盖。

```ts
//...
const table = useReactTable({
  // 其他选项...
  getRowCanExpand: (row) => true, // 添加你的逻辑来确定行是否可以展开。True 意味着所有行都包含展开数据
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})
//...
<tbody>
  {table.getRowModel().rows.map((row) => (
    <React.Fragment key={row.id}>
     {/* 正常行 UI */}
      <tr>
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id}>
            <FlexRender
              render={cell.column.columnDef.cell}
              props={cell.getContext()}
            />
          </td>
        ))}
      </tr>
      {/* 如果行已展开，将展开的 UI 渲染为单独的行，其中单个单元格跨越表格的宽度 */}
      {row.getIsExpanded() && (
        <tr>
          <td colSpan={row.getAllCells().length}> // 如果展开数据不是与父行共享相同列的行，你希望为展开数据跨越的列数
            // 你的自定义 UI 在这里
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>
//...
```

### 展开行状态

如果你需要控制表格中行的展开状态，你可以通过使用展开状态和 `onExpandedChange` 选项来做到这一点。这允许你根据你的要求管理展开状态。

```ts
const [expanded, setExpanded] = useState<ExpandedState>({})

const table = useReactTable({
  // 其他选项...
  state: {
    expanded: expanded, // 必须将展开状态传回表格
  },
  onExpandedChange: setExpanded
})
```

ExpandedState 类型定义如下：

```ts
type ExpandedState = true | Record<string, boolean>
```

如果 ExpandedState 为 true，意味着所有行都已展开。如果它是一个记录，只有在记录中作为键存在且其值设置为 true 的 ID 的行才会展开。例如，如果展开状态是 { row1: true, row2: false }，意味着 ID 为 row1 的行已展开，ID 为 row2 的行未展开。表格使用此状态来确定哪些行已展开并应显示其 subRows（如果有）。

### 展开行的 UI 切换处理程序

TanStack table 不会为你的表格添加展开数据的切换处理程序 UI。你应该在每行的 UI 中手动添加它，以允许用户展开和折叠行。例如，你可以在列定义中添加按钮 UI。

```ts
const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    header: 'Children',
    cell: ({ row }) => {
      return row.getCanExpand() ?
        <button
          onClick={row.getToggleExpandedHandler()}
          style={{ cursor: 'pointer' }}
        >
        {row.getIsExpanded() ? '👇' : '👉'}
        </button>
       : '';
    },
  },
]
```

### 过滤展开行

默认情况下，过滤过程从父行开始向下移动。这意味着如果父行被过滤器排除，其所有子行也将被排除。但是，你可以通过使用 `filterFromLeafRows` 选项来改变此行为。启用此选项时，过滤过程从叶子（子）行开始向上移动。这确保只要其子行或孙行中至少有一个满足过滤条件，父行就会包含在过滤结果中。此外，你可以通过使用 `maxLeafRowFilterDepth` 选项来控制过滤过程深入子层次结构的深度。此选项允许你指定过滤器应考虑的子行的最大深度。

```ts
//...
const table = useReactTable({
  // 其他选项...
  getSubRows: row => row.subRows,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  filterFromLeafRows: true, // 搜索展开的行
  maxLeafRowFilterDepth: 1, // 限制搜索的展开行的深度
})
```

### 分页展开行

默认情况下，展开行与表格的其余部分一起分页（这意味着展开行可能跨越多个页面）。如果你想禁用此行为（这意味着展开行将始终在其父页面上渲染。这也意味着将渲染比设置的页面大小更多的行），你可以使用 `paginateExpandedRows` 选项。

```ts
const table = useReactTable({
  // 其他选项...
  paginateExpandedRows: false,
})
```

### 固定展开行

固定展开行的工作方式与固定常规行相同。你可以将展开行固定到表格的顶部或底部。有关行固定的更多信息，请参阅[固定指南](../pinning.md)。

### 排序展开行

默认情况下，展开行与表格的其余部分一起排序。

### 手动展开（服务器端）

如果你正在进行服务器端展开，你可以通过将 manualExpanding 选项设置为 true 来启用手动行展开。这意味着 `getExpandedRowModel` 将不会用于展开行，你需要在自己的数据模型中执行展开。

```ts
const table = useReactTable({
  // 其他选项...
  manualExpanding: true,
})
```