---
title: 列过滤指南
---

## 示例

想要跳转到实现？查看这些示例：

- [filters](https://github.com/TanStack/table/tree/main/examples/react/filters) (包含分面)
- [editable-data](https://github.com/TanStack/table/tree/main/examples/react/editable-data)
- [expanding](https://github.com/TanStack/table/tree/main/examples/react/expanding)
- [grouping](https://github.com/TanStack/table/tree/main/examples/react/grouping)
- [pagination](https://github.com/TanStack/table/tree/main/examples/react/pagination)
- [row-selection](https://github.com/TanStack/table/tree/main/examples/react/row-selection)

## API

[列过滤 API](../api/features/column-filtering.md)

## 列过滤指南

过滤有两种类型：列过滤和全局过滤。

本指南将专注于列过滤，这是应用于单个列的访问器值的过滤器。

TanStack table 支持客户端和手动服务端过滤。本指南将介绍如何实现和自定义这两种方式，并帮助你决定哪种最适合你的用例。

### 客户端 vs 服务端过滤

如果你有大量数据集，你可能不想将所有数据加载到客户端浏览器中进行过滤。在这种情况下，你很可能想要实现服务端过滤、排序、分页等。

然而，正如在[分页指南](../pagination.md#should-you-use-client-side-pagination)中讨论的，许多开发者低估了可以在客户端加载多少行而不会影响性能。TanStack table 示例经常测试处理多达 100,000 行或更多，在客户端过滤、排序、分页和分组方面具有良好的性能。这并不一定意味着你的应用能够处理那么多行，但如果你的表格最多只有几千行，你可能能够利用 TanStack table 提供的客户端过滤、排序、分页和分组功能。

> TanStack Table 可以以良好的性能处理数千个客户端行。不要在没有仔细考虑的情况下就排除客户端过滤、分页、排序等。

每个用例都不同，将取决于表格的复杂性、你有多少列、每个数据有多大等。需要注意的主要瓶颈是：

1. 你的服务器能否在合理的时间（和成本）内查询所有数据？
2. 获取的总大小是多少？（如果你没有很多列，这可能不会像你想象的那样糟糕。）
3. 如果一次加载所有数据，客户端浏览器是否使用了太多内存？

如果你不确定，你总是可以从客户端过滤和分页开始，然后随着数据的增长在将来切换到服务端策略。

### 手动服务端过滤

如果你决定需要实现服务端过滤而不是使用内置的客户端过滤，以下是操作方法。

手动服务端过滤不需要 `getFilteredRowModel` 表格选项。相反，你传递给表格的 `data` 应该已经被过滤。但是，如果你已经传递了 `getFilteredRowModel` 表格选项，你可以通过将 `manualFiltering` 选项设置为 `true` 来告诉表格跳过它。

```jsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  // getFilteredRowModel: getFilteredRowModel(), // 手动服务端过滤不需要
  manualFiltering: true,
})
```

> **注意：** 当使用手动过滤时，本指南其余部分讨论的许多选项将不起作用。当 `manualFiltering` 设置为 `true` 时，表格实例不会对传递给它的行应用任何过滤逻辑。相反，它将假设行已经被过滤，并将按原样使用你传递给它的 `data`。

### 客户端过滤

如果你使用内置的客户端过滤功能，首先你需要向表格选项传递一个 `getFilteredRowModel` 函数。每当表格需要过滤数据时，都会调用此函数。你可以从 TanStack Table 导入默认的 `getFilteredRowModel` 函数或创建自己的函数。

```jsx
import { useReactTable, getFilteredRowModel } from '@tanstack/react-table'
//...
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(), // 客户端过滤需要
})
```

### 列过滤状态

无论你使用客户端还是服务端过滤，你都可以利用 TanStack Table 提供的内置列过滤状态管理。有许多表格和列 API 可以变更和交互过滤状态以及检索列过滤状态。

列过滤状态定义为具有以下形状的对象数组：

```ts
interface ColumnFilter {
  id: string
  value: unknown
}
type ColumnFiltersState = ColumnFilter[]
```

由于列过滤状态是对象数组，你可以同时应用多个列过滤器。

#### 访问列过滤状态

你可以像访问任何其他表格状态一样，使用 `table.getState()` API 从表格实例访问列过滤状态。

```jsx
const table = useReactTable({
  columns,
  data,
  //...
})

console.log(table.getState().columnFilters) // 从表格实例访问列过滤状态
```

但是，如果你需要在表格初始化之前访问列过滤状态，你可以像下面那样"控制"列过滤状态。

### 受控列过滤状态

如果你需要轻松访问列过滤状态，你可以使用 `state.columnFilters` 和 `onColumnFiltersChange` 表格选项在自己的状态管理中控制/管理列过滤状态。

```tsx
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) // 可以在这里设置初始列过滤状态
//...
const table = useReactTable({
  columns,
  data,
  //...
  state: {
    columnFilters,
  },
  onColumnFiltersChange: setColumnFilters,
})
```

#### 初始列过滤状态

如果你不需要在自己的状态管理或作用域中控制列过滤状态，但仍想设置初始列过滤状态，你可以使用 `initialState` 表格选项而不是 `state`。

```jsx
const table = useReactTable({
  columns,
  data,
  //...
  initialState: {
    columnFilters: [
      {
        id: 'name',
        value: 'John', // 默认按 'John' 过滤 name 列
      },
    ],
  },
})
```

> **注意**：不要同时使用 `initialState.columnFilters` 和 `state.columnFilters`，因为 `state.columnFilters` 中的初始化状态将覆盖 `initialState.columnFilters`。

### FilterFns

每个列都可以有自己独特的过滤逻辑。从 TanStack Table 提供的任何过滤函数中选择，或创建自己的函数。

默认情况下，有 10 个内置过滤函数可供选择：

- `includesString` - 不区分大小写的字符串包含
- `includesStringSensitive` - 区分大小写的字符串包含
- `equalsString` - 不区分大小写的字符串相等
- `equalsStringSensitive` - 区分大小写的字符串相等
- `arrIncludes` - 数组中的项目包含
- `arrIncludesAll` - 数组中包含所有项目
- `arrIncludesSome` - 数组中包含某些项目
- `equals` - 对象/引用相等 `Object.is`/`===`
- `weakEquals` - 弱对象/引用相等 `==`
- `inNumberRange` - 数字范围包含

你还可以将自己的自定义过滤函数定义为 `filterFn` 列选项，或使用 `filterFns` 表格选项作为全局过滤函数。

#### 自定义过滤函数

> **注意：** 这些过滤函数仅在客户端过滤期间运行。

在 `filterFn` 列选项或 `filterFns` 表格选项中定义自定义过滤函数时，它应该具有以下签名：

```ts
const myCustomFilterFn: FilterFn = (row: Row, columnId: string, filterValue: any, addMeta: (meta: any) => void) => boolean
```

每个过滤函数接收：

- 要过滤的行
- 用于检索行值的 columnId
- 过滤值

并且应该返回 `true`（如果行应该包含在过滤行中）和 `false`（如果应该删除）。

```jsx
const columns = [
  {
    header: () => 'Name',
    accessorKey: 'name',
    filterFn: 'includesString', // 使用内置过滤函数
  },
  {
    header: () => 'Age',
    accessorKey: 'age',
    filterFn: 'inNumberRange',
  },
  {
    header: () => 'Birthday',
    accessorKey: 'birthday',
    filterFn: 'myCustomFilterFn', // 使用自定义全局过滤函数
  },
  {
    header: () => 'Profile',
    accessorKey: 'profile',
    // 直接使用自定义过滤函数
    filterFn: (row, columnId, filterValue) => {
      return // 基于你的自定义逻辑返回 true 或 false
    },
  }
]
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  filterFns: { //添加自定义排序函数
    myCustomFilterFn: (row, columnId, filterValue) => { //在这里内联定义
      return // 基于你的自定义逻辑返回 true 或 false
    },
    startsWith: startsWithFilterFn, // 在其他地方定义
  },
})
```

##### 自定义过滤函数行为

你可以将一些其他属性附加到过滤函数以自定义其行为：

- `filterFn.resolveFilterValue` - 任何给定 `filterFn` 上的这个可选"悬挂"方法允许过滤函数在将过滤值传递给过滤函数之前转换/清理/格式化过滤值。

- `filterFn.autoRemove` - 任何给定 `filterFn` 上的这个可选"悬挂"方法传递一个过滤值，并期望如果过滤值应该从过滤状态中删除则返回 `true`。例如，一些布尔样式的过滤器可能希望在过滤值设置为 `false` 时从表格状态中删除过滤值。

```tsx
const startsWithFilterFn = <TData extends MRT_RowData>(
  row: Row<TData>,
  columnId: string,
  filterValue: number | string, //resolveFilterValue 将把这个转换为字符串
) =>
  row
    .getValue<number | string>(columnId)
    .toString()
    .toLowerCase()
    .trim()
    .startsWith(filterValue); // 在 `resolveFilterValue` 中对过滤值进行 toString、toLowerCase 和 trim

// 如果过滤值为假值（在这种情况下为空字符串），则从过滤状态中删除过滤值
startsWithFilterFn.autoRemove = (val: any) => !val; 

// 在将过滤值传递给过滤函数之前转换/清理/格式化过滤值
startsWithFilterFn.resolveFilterValue = (val: any) => val.toString().toLowerCase().trim(); 
```

### 自定义列过滤

有很多表格和列选项可以用来进一步自定义列过滤行为。

#### 禁用列过滤

默认情况下，所有列都启用列过滤。你可以使用 `enableColumnFilters` 表格选项或 `enableColumnFilter` 列选项为所有列或特定列禁用列过滤。你还可以通过将 `enableFilters` 表格选项设置为 `false` 来关闭列过滤和全局过滤。

为列禁用列过滤将导致该列的 `column.getCanFilter` API 返回 `false`。

```jsx
const columns = [
  {
    header: () => 'Id',
    accessorKey: 'id',
    enableColumnFilter: false, // 为此列禁用列过滤
  },
  //...
]
//...
const table = useReactTable({
  columns,
  data,
  enableColumnFilters: false, // 为所有列禁用列过滤
})
```

#### 过滤子行（展开）

在使用展开、分组和聚合等功能时，有一些额外的表格选项可以自定义列过滤的行为。

##### 从叶子行过滤

默认情况下，过滤是从父行向下进行的，所以如果父行被过滤掉，其所有子行也会被过滤掉。根据你的用例，如果你只想让用户搜索顶级行而不是子行，这可能是期望的行为。这也是性能最好的选项。

但是，如果你想允许子行被过滤和搜索，无论父行是否被过滤掉，你可以将 `filterFromLeafRows` 表格选项设置为 `true`。将此选项设置为 `true` 将导致过滤从叶子行向上进行，这意味着只要父行的子行或孙子行之一也被包含，父行就会被包含。

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  filterFromLeafRows: true, // 过滤和搜索子行
})
```

##### 最大叶子行过滤深度

默认情况下，过滤对树中的所有行进行，无论它们是根级父行还是父行的子叶子行。将 `maxLeafRowFilterDepth` 表格选项设置为 `0` 将导致过滤仅应用于根级父行，所有子行保持未过滤。类似地，将此选项设置为 `1` 将导致过滤仅应用于 1 级深的子叶子行，依此类推。

如果你想在父行通过过滤器时保留父行的子行不被过滤掉，请使用 `maxLeafRowFilterDepth: 0`。

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  maxLeafRowFilterDepth: 0, // 只过滤掉根级父行
})
```

### 列过滤 API

有很多列和表格 API 可以用来与列过滤状态交互并连接到你的 UI 组件。以下是可用 API 及其最常见用例的列表：

- `table.setColumnFilters` - 用新状态覆盖整个列过滤状态
- `table.resetColumnFilters` - 对"清除所有/重置过滤器"按钮有用

- **`column.getFilterValue`** - 对于获取输入的默认初始过滤值，或甚至直接向过滤输入提供过滤值很有用
- **`column.setFilterValue`** - 对于将过滤输入连接到其 `onChange` 或 `onBlur` 处理程序很有用

- `column.getCanFilter` - 对于禁用/启用过滤输入很有用
- `column.getIsFiltered` - 对于显示列当前正在被过滤的视觉指示器很有用
- `column.getFilterIndex` - 对于显示当前过滤器应用的顺序很有用

- `column.getAutoFilterFn` - 
- `column.getFilterFn` - 对于显示当前使用的过滤模式或函数很有用