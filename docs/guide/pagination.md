---
title: 分页
---

# 分页

TanStack Table 对客户端和服务器端分页都有很好的支持。本指南将带您了解在表格中实现分页的不同方式。

### 客户端分页

使用客户端分页意味着您获取的 `data` 将包含表格的***所有***行，表格实例将在前端处理分页逻辑。

#### 您应该使用客户端分页吗？

客户端分页通常是使用 TanStack Table 实现分页的最简单方式，但对于非常大的数据集可能不太实用。

然而，很多人低估了客户端可以处理的数据量。如果您的表格只有几千行或更少，客户端分页仍然是一个可行的选择。TanStack Table 设计为可以扩展到数万行，在分页、过滤、排序和分组方面具有良好的性能。[官方分页示例](https://github.com/TanStack/table/tree/main/examples/react/pagination) 加载了 100,000 行数据，仍然表现良好，尽管只有少数几列。

每个用例都不同，将取决于表格的复杂性、您有多少列、每个数据片段有多大等等。需要注意的主要瓶颈是：

1. 您的服务器能否在合理的时间（和成本）内查询所有数据？
2. 获取的总大小是多少？（如果您没有很多列，这可能不会像您想象的那样糟糕。）
3. 如果一次加载所有数据，客户端的浏览器是否使用了太多内存？

如果您不确定，您可以始终从客户端分页开始，然后随着数据的增长在将来切换到服务器端分页。

#### 您应该使用虚拟化吗？

或者，您可以不对数据进行分页，而是在同一页面上渲染大型数据集的所有行，但只使用浏览器的资源来渲染在视口中可见的行。这种策略通常称为"虚拟化"或"窗口化"。TanStack 提供了一个名为 [TanStack Virtual](https://tanstack.com/virtual/latest) 的虚拟化库，可以与 TanStack Table 很好地配合使用。虚拟化和分页的 UI/UX 都有各自的权衡，所以看看哪种最适合您的用例。

#### 分页行模型

如果您想利用 TanStack Table 中内置的客户端分页，您首先需要传入分页行模型。

```jsx
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(), //加载客户端分页代码
});
```

### 手动服务器端分页

如果您决定需要使用服务器端分页，以下是如何实现它。

服务器端分页不需要分页行模型，但如果您在共享组件中为其他确实需要它的表格提供了它，您仍然可以通过将 `manualPagination` 选项设置为 `true` 来关闭客户端分页。将 `manualPagination` 选项设置为 `true` 将告诉表格实例在底层使用 `table.getPrePaginationRowModel` 行模型，并且它将使表格实例假设您传入的 `data` 已经分页。

#### 页数和行数

除非您告诉它，否则表格实例将无法知道您的后端总共有多少行/页。提供 `rowCount` 或 `pageCount` 表格选项，让表格实例知道总共有多少页。如果您提供 `rowCount`，表格实例将从 `rowCount` 和 `pageSize` 内部计算 `pageCount`。否则，如果您已经有了 `pageCount`，您可以直接提供它。如果您不知道页数，您可以为 `pageCount` 传入 `-1`，但在这种情况下，`getCanNextPage` 和 `getCanPreviousPage` 行模型函数将始终返回 `true`。

```jsx
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  // getPaginationRowModel: getPaginationRowModel(), //服务器端分页不需要
  manualPagination: true, //关闭客户端分页
  rowCount: dataQuery.data?.rowCount, //传入总行数，以便表格知道有多少页（如果未提供，则内部计算 pageCount）
  // pageCount: dataQuery.data?.pageCount, //或者直接传入 pageCount 而不是 rowCount
});
```

> **注意**：将 `manualPagination` 选项设置为 `true` 将使表格实例假设您传入的 `data` 已经分页。

### 分页状态

无论您使用客户端还是手动服务器端分页，您都可以使用内置的 `pagination` 状态和 API。

`pagination` 状态是一个包含以下属性的对象：

- `pageIndex`：当前页面索引（从零开始）。
- `pageSize`：当前页面大小。

您可以像管理表格实例中的任何其他状态一样管理 `pagination` 状态。

```jsx
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
//...
const [pagination, setPagination] = useState({
  pageIndex: 0, //初始页面索引
  pageSize: 10, //默认页面大小
});

const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  onPaginationChange: setPagination, //当内部 API 改变分页状态时更新分页状态
  state: {
    //...
    pagination,
  },
});
```

或者，如果您不需要在自己的作用域中管理 `pagination` 状态，但需要为 `pageIndex` 和 `pageSize` 设置不同的初始值，您可以使用 `initialState` 选项。

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: {
    pagination: {
      pageIndex: 2, //自定义初始页面索引
      pageSize: 25, //自定义默认页面大小
    },
  },
});
```

> **注意**：不要将 `pagination` 状态同时传递给 `state` 和 `initialState` 选项。`state` 将覆盖 `initialState`。只使用其中一个。

### 分页选项

除了对手动服务器端分页有用的 `manualPagination`、`pageCount` 和 `rowCount` 选项（在[上面](#manual-server-side-pagination)讨论过），还有一个其他有用的表格选项需要了解。

#### 自动重置页面索引

默认情况下，当发生改变页面的状态变化时，`pageIndex` 会重置为 `0`，例如当 `data` 更新、过滤器更改、分组更改等时。当 `manualPagination` 为 true 时，此行为会自动禁用，但可以通过显式为 `autoResetPageIndex` 表格选项分配布尔值来覆盖。

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  autoResetPageIndex: false, //关闭 pageIndex 的自动重置
});
```

但是，请注意，如果您关闭 `autoResetPageIndex`，您可能需要添加一些逻辑来自己处理重置 `pageIndex`，以避免显示空页面。

### 分页 API

有几个分页表格实例 API 对于连接您的分页 UI 组件很有用。

#### 分页按钮 API

- `getCanPreviousPage`：用于在第一页时禁用"上一页"按钮。
- `getCanNextPage`：用于在没有更多页面时禁用"下一页"按钮。
- `previousPage`：用于转到上一页。（按钮点击处理程序）
- `nextPage`：用于转到下一页。（按钮点击处理程序）
- `firstPage`：用于转到第一页。（按钮点击处理程序）
- `lastPage`：用于转到最后一页。（按钮点击处理程序）
- `setPageIndex`：用于"转到页面"输入。
- `resetPageIndex`：用于将表格状态重置为原始页面索引。
- `setPageSize`：用于"页面大小"输入/选择。
- `resetPageSize`：用于将表格状态重置为原始页面大小。
- `setPagination`：用于一次设置所有分页状态。
- `resetPagination`：用于将表格状态重置为原始分页状态。

> **注意**：其中一些 API 是 `v8.13.0` 中的新功能。

```jsx
<Button
  onClick={() => table.firstPage()}
  disabled={!table.getCanPreviousPage()}
>
  {'<<'}
</Button>
<Button
  onClick={() => table.previousPage()}
  disabled={!table.getCanPreviousPage()}
>
  {'<'}
</Button>
<Button
  onClick={() => table.nextPage()}
  disabled={!table.getCanNextPage()}
>
  {'>'}
</Button>
<Button
  onClick={() => table.lastPage()}
  disabled={!table.getCanNextPage()}
>
  {'>>'}
</Button>
<select
  value={table.getState().pagination.pageSize}
  onChange={e => {
    table.setPageSize(Number(e.target.value))
  }}
>
  {[10, 20, 30, 40, 50].map(pageSize => (
    <option key={pageSize} value={pageSize}>
      {pageSize}
    </option>
  ))}
</select>
```

#### 分页信息 API

- `getPageCount`：用于显示总页数。
- `getRowCount`：用于显示总行数。