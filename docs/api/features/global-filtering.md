---
title: 全局过滤 API
id: global-filtering
---

## 可过滤性

列是否能够被**全局**过滤由以下条件决定：

- 列定义了有效的 `accessorKey`/`accessorFn`。
- 如果提供，`options.getColumnCanGlobalFilter` 对给定列返回 `true`。如果未提供，如果第一行中的值是 `string` 或 `number` 类型，则假定该列可全局过滤。
- `column.enableColumnFilter` 未设置为 `false`
- `options.enableColumnFilters` 未设置为 `false`
- `options.enableFilters` 未设置为 `false`

## 状态

过滤状态使用以下结构存储在表格中：

```tsx
export interface GlobalFilterTableState {
  globalFilter: any
}
```

## 过滤函数

您可以使用与列过滤相同的过滤函数进行全局过滤。请参阅[列过滤](../guide/column-filtering.md)了解更多关于过滤函数的信息。

#### 使用过滤函数

过滤函数可以通过向 `options.globalFilterFn` 传递以下内容来使用/引用/定义：

- 引用内置过滤函数的 `string`
- 直接提供给 `options.globalFilterFn` 选项的函数

`tableOptions.globalFilterFn` 选项可用的最终过滤函数列表使用以下类型：

```tsx
export type FilterFnOption<TData extends AnyData> =
  | 'auto'
  | BuiltInFilterFn
  | FilterFn<TData>
```

#### 过滤元数据

过滤数据通常可以暴露关于数据的附加信息，这些信息可用于帮助对相同数据进行其他未来操作。这个概念的一个很好的例子是像 [`match-sorter`](https://github.com/kentcdodds/match-sorter) 这样的排名系统，它同时对数据进行排名、过滤和排序。虽然像 `match-sorter` 这样的实用程序对于单维过滤+排序任务很有意义，但构建表格的解耦过滤/排序架构使它们非常难以使用且速度很慢。

为了使排名/过滤/排序系统与表格一起工作，`filterFn` 可以选择性地用**过滤元数据**值标记结果，该值可以稍后用于按您的喜好对数据进行排序/分组等。这是通过调用提供给您的自定义 `filterFn` 的 `addMeta` 函数来完成的。

下面是一个使用我们自己的 `match-sorter-utils` 包（`match-sorter` 的实用程序分支）对数据进行排名、过滤和排序的示例

```tsx
import { sortingFns } from '@tanstack/[adapter]-table'

import { rankItem, compareItems } from '@tanstack/match-sorter-utils'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // 对项目进行排名
  const itemRank = rankItem(row.getValue(columnId), value)

  // 存储排名信息
  addMeta(itemRank)

  // 返回项目是否应该被过滤进/出
  return itemRank.passed
}

const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0

  // 只有当列有排名信息时才按排名排序
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]!,
      rowB.columnFiltersMeta[columnId]!
    )
  }

  // 当项目排名相等时提供字母数字回退
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
```

## 列定义选项

### `enableGlobalFilter`

```tsx
enableGlobalFilter?: boolean
```

启用/禁用此列的**全局**过滤。

## 列 API

### `getCanGlobalFilter`

```tsx
getCanGlobalFilter: () => boolean
```

返回列是否可以被**全局**过滤。设置为 `false` 以禁用列在全局过滤期间被扫描。

## 行 API

### `columnFiltersMeta`

```tsx
columnFiltersMeta: Record<string, any>
```

行的列过滤元数据映射。此对象跟踪行的任何过滤元数据，如在过滤过程中可选提供的。

## 表格选项

### `filterFns`

```tsx
filterFns?: Record<string, FilterFn>
```

此选项允许您定义自定义过滤函数，这些函数可以通过其键在列的 `filterFn` 选项中引用。
示例：

```tsx
declare module '@tanstack/table-core' {
  interface FilterFns {
    myCustomFilter: FilterFn<unknown>
  }
}

const column = columnHelper.data('key', {
  filterFn: 'myCustomFilter',
})

const table = useReactTable({
  columns: [column],
  filterFns: {
    myCustomFilter: (rows, columnIds, filterValue) => {
      // 返回过滤后的行
    },
  },
})
```

### `filterFromLeafRows`

```tsx
filterFromLeafRows?: boolean
```

默认情况下，过滤是从父行向下进行的（因此如果父行被过滤掉，其所有子行也将被过滤掉）。将此选项设置为 `true` 将导致过滤从叶行向上进行（这意味着只要父行的子行或孙行之一也被包含，父行就会被包含）。

### `maxLeafRowFilterDepth`

```tsx
maxLeafRowFilterDepth?: number
```

默认情况下，过滤对所有行进行（最大深度为 100），无论它们是根级父行还是父行的子叶行。将此选项设置为 `0` 将导致过滤仅应用于根级父行，所有子行保持未过滤。类似地，将此选项设置为 `1` 将导致过滤仅应用于 1 级深的子叶行，依此类推。

这对于您希望行的整个子层次结构无论应用的过滤器如何都可见的情况很有用。

### `enableFilters`

```tsx
enableFilters?: boolean
```

启用/禁用表格的所有过滤器。

### `manualFiltering`

```tsx
manualFiltering?: boolean
```

禁用使用 `getFilteredRowModel` 来过滤数据。如果您的表格需要动态支持客户端和服务器端过滤，这可能很有用。

### `getFilteredRowModel`

```tsx
getFilteredRowModel?: (
  table: Table<TData>
) => () => RowModel<TData>
```

如果提供，此函数每个表格调用**一次**，应返回一个**新函数**，该函数将在表格过滤时计算并返回表格的行模型。

- 对于服务器端过滤，此函数是不必要的，可以忽略，因为服务器应该已经返回过滤后的行模型。
- 对于客户端过滤，此函数是必需的。通过任何表格适配器的 `{ getFilteredRowModel }` 导出提供默认实现。

示例：

```tsx
import { getFilteredRowModel } from '@tanstack/[adapter]-table'

  getFilteredRowModel: getFilteredRowModel(),
})
```

### `globalFilterFn`

```tsx
globalFilterFn?: FilterFn | keyof FilterFns | keyof BuiltInFilterFns
```

用于全局过滤的过滤函数。

选项：

- 引用[内置过滤函数](#filter-functions)的 `string`
- 引用通过 `tableOptions.filterFns` 选项提供的自定义过滤函数的 `string`
- [自定义过滤函数](#filter-functions)

### `onGlobalFilterChange`

```tsx
onGlobalFilterChange?: OnChangeFn<GlobalFilterState>
```

如果提供，当 `state.globalFilter` 更改时，将使用 `updaterFn` 调用此函数。这会覆盖默认的内部状态管理，因此您需要在表格外部完全或部分持久化状态更改。

### `enableGlobalFilter`

```tsx
enableGlobalFilter?: boolean
```

启用/禁用表格的全局过滤器。

### `getColumnCanGlobalFilter`

```tsx
getColumnCanGlobalFilter?: (column: Column<TData>) => boolean
```

如果提供，此函数将使用列调用，应返回 `true` 或 `false` 以指示此列是否应用于全局过滤。
这在列可以包含不是 `string` 或 `number` 的数据（即 `undefined`）时很有用。

## 表格 API

### `getPreFilteredRowModel`

```tsx
getPreFilteredRowModel: () => RowModel<TData>
```

返回应用任何**列**过滤之前的表格行模型。

### `getFilteredRowModel`

```tsx
getFilteredRowModel: () => RowModel<TData>
```

返回应用**列**过滤后的表格行模型。

### `setGlobalFilter`

```tsx
setGlobalFilter: (updater: Updater<any>) => void
```

设置或更新 `state.globalFilter` 状态。

### `resetGlobalFilter`

```tsx
resetGlobalFilter: (defaultState?: boolean) => void
```

将 **globalFilter** 状态重置为 `initialState.globalFilter`，或者可以传递 `true` 以强制默认空白状态重置为 `undefined`。

### `getGlobalAutoFilterFn`

```tsx
getGlobalAutoFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

目前，此函数返回内置的 `includesString` 过滤函数。在未来的版本中，它可能会根据提供的数据性质返回更动态的过滤函数。

### `getGlobalFilterFn`

```tsx
getGlobalFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

返回表格的全局过滤函数（用户定义或自动，取决于配置）。