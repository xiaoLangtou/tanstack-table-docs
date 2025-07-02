---
title: 列过滤 API
id: column-filtering
---

## 可过滤性

列是否能够进行**列**过滤由以下条件决定：

- 列定义时使用了有效的 `accessorKey`/`accessorFn`
- `column.enableColumnFilter` 未设置为 `false`
- `options.enableColumnFilters` 未设置为 `false`
- `options.enableFilters` 未设置为 `false`

## 状态

过滤状态使用以下结构存储在表格中：

```tsx
export interface ColumnFiltersTableState {
  columnFilters: ColumnFiltersState
}

export type ColumnFiltersState = ColumnFilter[]

export interface ColumnFilter {
  id: string
  value: unknown
}
```

## 过滤函数

表格核心内置了以下过滤函数：

- `includesString`
  - 不区分大小写的字符串包含
- `includesStringSensitive`
  - 区分大小写的字符串包含
- `equalsString`
  - 不区分大小写的字符串相等
- `equalsStringSensitive`
  - 区分大小写的字符串相等
- `arrIncludes`
  - 数组中的项目包含
- `arrIncludesAll`
  - 数组中包含所有项目
- `arrIncludesSome`
  - 数组中包含某些项目
- `equals`
  - 对象/引用相等 `Object.is`/`===`
- `weakEquals`
  - 弱对象/引用相等 `==`
- `inNumberRange`
  - 数字范围包含

每个过滤函数接收：

- 要过滤的行
- 用于检索行值的 columnId
- 过滤值

如果行应包含在过滤结果中，应返回 `true`；如果应移除，则返回 `false`。

这是每个过滤函数的类型签名：

```tsx
export type FilterFn<TData extends AnyData> = {
  (
    row: Row<TData>,
    columnId: string,
    filterValue: any,
    addMeta: (meta: any) => void
  ): boolean
  resolveFilterValue?: TransformFilterValueFn<TData>
  autoRemove?: ColumnFilterAutoRemoveTestFn<TData>
  addMeta?: (meta?: any) => void
}

export type TransformFilterValueFn<TData extends AnyData> = (
  value: any,
  column?: Column<TData>
) => unknown

export type ColumnFilterAutoRemoveTestFn<TData extends AnyData> = (
  value: any,
  column?: Column<TData>
) => boolean

export type CustomFilterFns<TData extends AnyData> = Record<
  string,
  FilterFn<TData>
>
```

### `filterFn.resolveFilterValue`

任何给定 `filterFn` 上的这个可选"挂起"方法允许过滤函数在过滤值传递给过滤函数之前对其进行转换/清理/格式化。

### `filterFn.autoRemove`

任何给定 `filterFn` 上的这个可选"挂起"方法接收过滤值，如果过滤值应从过滤状态中移除，则期望返回 `true`。例如，某些布尔样式的过滤器可能希望在过滤值设置为 `false` 时从表格状态中移除过滤值。

#### 使用过滤函数

过滤函数可以通过向 `columnDefinition.filterFn` 传递以下内容来使用/引用/定义：

- 引用内置过滤函数的 `string`
- 直接提供给 `columnDefinition.filterFn` 选项的函数

`columnDef.filterFn` 选项可用的最终过滤函数列表使用以下类型：

```tsx
export type FilterFnOption<TData extends AnyData> =
  | 'auto'
  | BuiltInFilterFn
  | FilterFn<TData>
```

#### 过滤元数据

过滤数据通常可以暴露有关数据的附加信息，这些信息可用于帮助对相同数据进行其他未来操作。这个概念的一个很好的例子是像 [`match-sorter`](https://github.com/kentcdodds/match-sorter) 这样的排名系统，它同时对数据进行排名、过滤和排序。虽然像 `match-sorter` 这样的工具对于单维过滤+排序任务很有意义，但构建表格的解耦过滤/排序架构使它们非常难以使用且速度缓慢。

为了使排名/过滤/排序系统与表格一起工作，`filterFn` 可以选择性地用**过滤元数据**值标记结果，该值可以稍后用于按您的喜好对数据进行排序/分组等。这是通过调用提供给您的自定义 `filterFn` 的 `addMeta` 函数来完成的。

下面是一个使用我们自己的 `match-sorter-utils` 包（`match-sorter` 的实用程序分支）对数据进行排名、过滤和排序的示例：

```tsx
import { sortingFns } from '@tanstack/react-table'

import { rankItem, compareItems } from '@tanstack/match-sorter-utils'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // 对项目进行排名
  const itemRank = rankItem(row.getValue(columnId), value)

  // 存储排名信息
  addMeta(itemRank)

  // 返回项目是否应被过滤进/出
  return itemRank.passed
}

const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0

  // 仅在列具有排名信息时按排名排序
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

### `filterFn`

```tsx
filterFn?: FilterFn | keyof FilterFns | keyof BuiltInFilterFns
```

此列要使用的过滤函数。

选项：

- 引用[内置过滤函数](#filter-functions)的 `string`
- [自定义过滤函数](#filter-functions)

### `enableColumnFilter`

```tsx
enableColumnFilter?: boolean
```

启用/禁用此列的**列**过滤。

## 列 API

### `getCanFilter`

```tsx
getCanFilter: () => boolean
```

返回列是否可以进行**列**过滤。

### `getFilterIndex`

```tsx
getFilterIndex: () => number
```

返回列过滤器在表格 `state.columnFilters` 数组中的索引（包括 `-1`）。

### `getIsFiltered`

```tsx
getIsFiltered: () => boolean
```

返回列当前是否被过滤。

### `getFilterValue`

```tsx
getFilterValue: () => unknown
```

返回列的当前过滤值。

### `setFilterValue`

```tsx
setFilterValue: (updater: Updater<any>) => void
```

设置列当前过滤值的函数。您可以传递值或更新器函数以对现有值进行不可变安全操作。

### `getAutoFilterFn`

```tsx
getAutoFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

根据列的第一个已知值为列返回自动计算的过滤函数。

### `getFilterFn`

```tsx
getFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

返回指定 columnId 的过滤函数（用户定义或自动，取决于配置）。

## 行 API

### `columnFilters`

```tsx
columnFilters: Record<string, boolean>
```

行的列过滤器映射。此对象通过列 ID 跟踪行是否通过/未通过特定过滤器。

### `columnFiltersMeta`

```tsx
columnFiltersMeta: Record<string, any>
```

行的列过滤器元数据映射。此对象跟踪在过滤过程中可选提供的行的任何过滤元数据。

## 表格选项

### `filterFns`

```tsx
filterFns?: Record<string, FilterFn>
```

此选项允许您定义可以在列的 `filterFn` 选项中通过其键引用的自定义过滤函数。
示例：

```tsx
declare module '@tanstack/[adapter]-table' {
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

默认情况下，过滤是从父行向下进行的（因此如果父行被过滤掉，其所有子行也将被过滤掉）。将此选项设置为 `true` 将导致过滤从叶子行向上进行（这意味着只要父行的子行或孙行之一也被包含，父行就会被包含）。

### `maxLeafRowFilterDepth`

```tsx
maxLeafRowFilterDepth?: number
```

默认情况下，过滤对所有行进行（最大深度为 100），无论它们是根级父行还是父行的子叶子行。将此选项设置为 `0` 将导致过滤仅应用于根级父行，所有子行保持未过滤状态。类似地，将此选项设置为 `1` 将导致过滤仅应用于 1 级深的子叶子行，依此类推。

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

### `onColumnFiltersChange`

```tsx
onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
```

如果提供，当 `state.columnFilters` 更改时，将使用 `updaterFn` 调用此函数。这会覆盖默认的内部状态管理，因此您需要在表格外部完全或部分持久化状态更改。

### `enableColumnFilters`

```tsx
enableColumnFilters?: boolean
```

启用/禁用表格的**所有**列过滤器。

### `getFilteredRowModel`

```tsx
getFilteredRowModel?: (
  table: Table<TData>
) => () => RowModel<TData>
```

如果提供，此函数每个表格调用**一次**，应返回一个**新函数**，该函数将在表格被过滤时计算并返回表格的行模型。

- 对于服务器端过滤，此函数是不必要的，可以忽略，因为服务器应该已经返回过滤后的行模型。
- 对于客户端过滤，此函数是必需的。通过任何表格适配器的 `{ getFilteredRowModel }` 导出提供默认实现。

示例：

```tsx
import { getFilteredRowModel } from '@tanstack/[adapter]-table'


  getFilteredRowModel: getFilteredRowModel(),
})
```

## 表格 API

### `setColumnFilters`

```tsx
setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
```

设置或更新 `state.columnFilters` 状态。

### `resetColumnFilters`

```tsx
resetColumnFilters: (defaultState?: boolean) => void
```

将 **columnFilters** 状态重置为 `initialState.columnFilters`，或者可以传递 `true` 以强制默认空白状态重置为 `[]`。

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