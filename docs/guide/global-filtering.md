---
title: 全局过滤指南
---

## 示例

想要跳转到实现？查看这些示例：

- [Global Filters](https://github.com/TanStack/table/tree/main/examples/react/filters-global)

## API

[全局过滤 API](../api/features/global-filtering.md)

## 全局过滤指南

过滤有两种类型：列过滤和全局过滤。

本指南将专注于全局过滤，这是一种应用于所有列的过滤器。

### 客户端与服务器端过滤

如果你有大型数据集，你可能不想将所有数据加载到客户端浏览器中来过滤它。在这种情况下，你很可能想要实现服务器端过滤、排序、分页等。

然而，正如在[分页指南](pagination#should-you-use-client-side-pagination)中也讨论的那样，许多开发者低估了可以在客户端加载多少行而不会影响性能。TanStack table 示例经常测试处理多达 100,000 行或更多，在客户端过滤、排序、分页和分组方面具有良好的性能。这并不一定意味着你的应用程序能够处理那么多行，但如果你的表格最多只有几千行，你可能能够利用 TanStack table 提供的客户端过滤、排序、分页和分组。

> TanStack Table 可以以良好的性能处理数千个客户端行。不要在没有先考虑的情况下排除客户端过滤、分页、排序等。

每个用例都不同，将取决于表格的复杂性、你有多少列、每个数据片段有多大等。需要注意的主要瓶颈是：

1. 你的服务器能否在合理的时间（和成本）内查询所有数据？
2. 获取的总大小是多少？（如果你没有很多列，这可能不会像你想象的那样扩展得那么糟糕。）
3. 如果一次加载所有数据，客户端浏览器是否使用了太多内存？

如果你不确定，你总是可以从客户端过滤和分页开始，然后随着数据的增长在将来切换到服务器端策略。

### 手动服务器端全局过滤

如果你已经决定需要实现服务器端全局过滤而不是使用内置的客户端全局过滤，这是你的做法。

手动服务器端全局过滤不需要 `getFilteredRowModel` 表格选项。相反，你传递给表格的 `data` 应该已经被过滤。但是，如果你已经传递了 `getFilteredRowModel` 表格选项，你可以通过将 `manualFiltering` 选项设置为 `true` 来告诉表格跳过它。

```jsx
const table = useReactTable({
  data,
  columns,
  // getFilteredRowModel: getFilteredRowModel(), // 手动服务器端全局过滤不需要
  manualFiltering: true,
})
```

注意：使用手动全局过滤时，本指南其余部分讨论的许多选项将不起作用。当 manualFiltering 设置为 true 时，表格实例不会对传递给它的行应用任何全局过滤逻辑。相反，它将假设行已经被过滤，并将按原样使用你传递给它的数据。

### 客户端全局过滤

如果你使用内置的客户端全局过滤，首先你需要向表格选项传递 getFilteredRowModel 函数。

```jsx
import { useReactTable, getFilteredRowModel } from '@tanstack/react-table'
//...
const table = useReactTable({
  // 其他选项...
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(), // 客户端全局过滤需要
})
```

### 全局过滤函数

globalFilterFn 选项允许你指定将用于全局过滤的过滤函数。过滤函数可以是引用内置过滤函数的字符串、引用通过 tableOptions.filterFns 选项提供的自定义过滤函数的字符串，或自定义过滤函数。

```jsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  globalFilterFn: 'text' // 内置过滤函数
})
```

默认情况下，有 10 个内置过滤函数可供选择：

- includesString - 不区分大小写的字符串包含
- includesStringSensitive - 区分大小写的字符串包含
- equalsString - 不区分大小写的字符串相等
- equalsStringSensitive - 区分大小写的字符串相等
- arrIncludes - 数组内的项目包含
- arrIncludesAll - 数组中包含所有项目
- arrIncludesSome - 数组中包含某些项目
- equals - 对象/引用相等 Object.is/===
- weakEquals - 弱对象/引用相等 ==
- inNumberRange - 数字范围包含

你也可以将自己的自定义过滤函数定义为 globalFilterFn 表格选项。

### 全局过滤状态

全局过滤状态存储在表格的内部状态中，可以通过 table.getState().globalFilter 属性访问。如果你想在表格外部持久化全局过滤状态，你可以使用 onGlobalFilterChange 选项提供一个回调函数，该函数将在全局过滤状态更改时被调用。

```jsx
const [globalFilter, setGlobalFilter] = useState<any>([])

const table = useReactTable({
  // 其他选项...
  state: {
    globalFilter,
  },
  onGlobalFilterChange: setGlobalFilter
})
```

全局过滤状态定义为具有以下形状的对象：

```jsx
interface GlobalFilter {
  globalFilter: any
}
```

### 向 UI 添加全局过滤输入

TanStack table 不会向你的表格添加全局过滤输入 UI。你应该手动将其添加到你的 UI 中，以允许用户过滤表格。例如，你可以在表格上方添加输入 UI，以允许用户输入搜索词。

```jsx
return (
  <div>
    <input
      value=""
      onChange={e => table.setGlobalFilter(String(e.target.value))}
      placeholder="Search..."
    />
  </div>
)
```

### 自定义全局过滤函数

如果你想使用自定义全局过滤函数，你可以定义函数并将其传递给 globalFilterFn 选项。

> **注意：** 对于全局过滤使用模糊过滤函数通常是一个流行的想法。这在[模糊过滤指南](../fuzzy-filtering.md)中讨论。

```jsx
const customFilterFn = (rows, columnId, filterValue) => {
  // 自定义过滤逻辑
}

const table = useReactTable({
  // 其他选项...
  globalFilterFn: customFilterFn
})
```

### 初始全局过滤状态

如果你想在表格初始化时设置初始全局过滤状态，你可以将全局过滤状态作为表格 initialState 选项的一部分传递。

但是，你也可以只在 state.globalFilter 选项中指定初始全局过滤状态。

```jsx
const [globalFilter, setGlobalFilter] = useState("search term") //建议在这里初始化 globalFilter 状态

const table = useReactTable({
  // 其他选项...
  initialState: {
    globalFilter: 'search term', // 如果不管理 globalFilter 状态，在这里设置初始状态
  }
  state: {
    globalFilter, // 将我们管理的 globalFilter 状态传递给表格
  }
})
```

> 注意：不要同时使用 initialState.globalFilter 和 state.globalFilter，因为 state.globalFilter 中的初始化状态将覆盖 initialState.globalFilter。

### 禁用全局过滤

默认情况下，所有列都启用全局过滤。你可以通过使用 enableGlobalFilter 表格选项为所有列禁用全局过滤。你也可以通过将 enableFilters 表格选项设置为 false 来关闭列和全局过滤。

禁用全局过滤将导致该列的 column.getCanGlobalFilter API 返回 false。

```jsx
const columns = [
  {
    header: () => 'Id',
    accessorKey: 'id',
    enableGlobalFilter: false, // 为此列禁用全局过滤
  },
  //...
]
//...
const table = useReactTable({
  // 其他选项...
  columns,
  enableGlobalFilter: false, // 为所有列禁用全局过滤
})
```