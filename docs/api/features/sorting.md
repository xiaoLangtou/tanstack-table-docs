---
title: 排序 API
id: sorting
---

## 状态

排序状态使用以下结构存储在表格中：

```tsx
export type SortDirection = 'asc' | 'desc'

export type ColumnSort = {
  id: string
  desc: boolean
}

export type SortingState = ColumnSort[]

export type SortingTableState = {
  sorting: SortingState
}
```

## 排序函数

以下排序函数内置于表格核心中：

- `alphanumeric`
  - 按混合字母数字值排序，不区分大小写。较慢，但如果您的字符串包含需要自然排序的数字，则更准确。
- `alphanumericCaseSensitive`
  - 按混合字母数字值排序，区分大小写。较慢，但如果您的字符串包含需要自然排序的数字，则更准确。
- `text`
  - 按文本/字符串值排序，不区分大小写。更快，但如果您的字符串包含需要自然排序的数字，则不太准确。
- `textCaseSensitive`
  - 按文本/字符串值排序，区分大小写。更快，但如果您的字符串包含需要自然排序的数字，则不太准确。
- `datetime`
  - 按时间排序，如果您的值是 `Date` 对象，请使用此选项。
- `basic`
  - 使用基本/标准的 `a > b ? 1 : a < b ? -1 : 0` 比较进行排序。这是最快的排序函数，但可能不是最准确的。

每个排序函数接收 2 行和一个列 ID，并期望使用列 ID 比较两行，以升序返回 `-1`、`0` 或 `1`。这是一个速查表：

| 返回值 | 升序 |
| ------ | --------------- |
| `-1`   | `a < b`         |
| `0`    | `a === b`       |
| `1`    | `a > b`         |

这是每个排序函数的类型签名：

```tsx
export type SortingFn<TData extends AnyData> = {
  (rowA: Row<TData>, rowB: Row<TData>, columnId: string): number
}
```

#### 使用排序函数

排序函数可以通过向 `columnDefinition.sortingFn` 传递以下内容来使用/引用/定义：

- 引用内置排序函数的 `string`
- 引用通过 `tableOptions.sortingFns` 选项提供的自定义排序函数的 `string`
- 直接提供给 `columnDefinition.sortingFn` 选项的函数

`columnDef.sortingFn` 可用的最终排序函数列表使用以下类型：

```tsx
export type SortingFnOption<TData extends AnyData> =
  | 'auto'
  | SortingFns
  | BuiltInSortingFns
  | SortingFn<TData>
```

## 列定义选项

### `sortingFn`

```tsx
sortingFn?: SortingFn | keyof SortingFns | keyof BuiltInSortingFns
```

与此列一起使用的排序函数。

选项：

- 引用[内置排序函数](#sorting-functions)的 `string`
- [自定义排序函数](#sorting-functions)

### `sortDescFirst`

```tsx
sortDescFirst?: boolean
```

设置为 `true` 以使此列上的排序切换从降序方向开始。

### `enableSorting`

```tsx
enableSorting?: boolean
```

启用/禁用此列的排序。

### `enableMultiSort`

```tsx
enableMultiSort?: boolean
```

启用/禁用此列的多重排序。

### `invertSorting`

```tsx
invertSorting?: boolean
```

反转此列的排序顺序。这对于具有反向最佳/最差比例的值很有用，其中较低的数字更好，例如排名（第1、第2、第3）或高尔夫式评分。

### `sortUndefined`

```tsx
sortUndefined?: 'first' | 'last' | false | -1 | 1 // 默认为 1
```

- `'first'`
  - 未定义的值将被推到列表的开头
- `'last'`
  - 未定义的值将被推到列表的末尾
- `false`
  - 未定义的值将被视为并列，需要按下一个列过滤器或原始索引排序（以适用者为准）
- `-1`
  - 未定义的值将以更高优先级排序（升序）（如果升序，未定义将出现在列表的开头）
- `1`
  - 未定义的值将以较低优先级排序（降序）（如果升序，未定义将出现在列表的末尾）

> 注意：`'first'` 和 `'last'` 选项是 v8.16.0 中的新功能

## 列 API

### `getAutoSortingFn`

```tsx
getAutoSortingFn: () => SortingFn<TData>
```

返回基于列值自动推断的排序函数。

### `getAutoSortDir`

```tsx
getAutoSortDir: () => SortDirection
```

返回基于列值自动推断的排序方向。

### `getSortingFn`

```tsx
getSortingFn: () => SortingFn<TData>
```

返回用于此列的已解析排序函数。

### `getNextSortingOrder`

```tsx
getNextSortingOrder: () => SortDirection | false
```

返回下一个排序顺序。

### `getCanSort`

```tsx
getCanSort: () => boolean
```

返回此列是否可以排序。

### `getCanMultiSort`

```tsx
getCanMultiSort: () => boolean
```

返回此列是否可以多重排序。

### `getSortIndex`

```tsx
getSortIndex: () => number
```

返回此列在排序状态中的索引位置。

### `getIsSorted`

```tsx
getIsSorted: () => false | SortDirection
```

返回此列是否已排序。

### `getFirstSortDir`

```tsx 
getFirstSortDir: () => SortDirection
```

返回排序此列时应使用的第一个方向。

### `clearSorting`

```tsx
clearSorting: () => void
```

从表格的排序状态中移除此列。

### `toggleSorting`

```tsx
toggleSorting: (desc?: boolean, isMulti?: boolean) => void
```

切换此列的排序状态。如果提供 `desc`，它将强制排序方向为该值。如果提供 `isMulti`，它将附加多重排序列（或如果已排序则切换它）。

### `getToggleSortingHandler`

```tsx
getToggleSortingHandler: () => undefined | ((event: unknown) => void)
```

返回可用于切换此列排序状态的函数。这对于将点击处理程序附加到列标题很有用。

## 表格选项

### `sortingFns`

```tsx
sortingFns?: Record<string, SortingFn>
```

此选项允许您定义自定义排序函数，这些函数可以通过其键在列的 `sortingFn` 选项中引用。
示例：

```tsx
declare module '@tanstack/table-core' {
  interface SortingFns {
    myCustomSorting: SortingFn<unknown>
  }
}

const column = columnHelper.data('key', {
  sortingFn: 'myCustomSorting',
})

const table = useReactTable({
  columns: [column],
  sortingFns: {
    myCustomSorting: (rowA: any, rowB: any, columnId: any): number =>
      rowA.getValue(columnId).value < rowB.getValue(columnId).value ? 1 : -1,
  },
})
```

### `manualSorting`

```tsx
manualSorting?: boolean
```

为表格启用手动排序。如果为 `true`，您需要在将数据传递给表格之前对其进行排序。这在进行服务器端排序时很有用。

### `onSortingChange`

```tsx
onSortingChange?: OnChangeFn<SortingState>
```

如果提供此函数，当 `state.sorting` 更改时将使用 `updaterFn` 调用它。这会覆盖默认的内部状态管理，因此您需要在表格外部完全或部分持久化状态更改。

### `enableSorting`

```tsx
enableSorting?: boolean
```

启用/禁用表格的排序。

### `enableSortingRemoval`

```tsx
enableSortingRemoval?: boolean
```

启用/禁用表格移除排序的能力。
- 如果为 `true`，则更改排序顺序将循环如下：'none' -> 'desc' -> 'asc' -> 'none' -> ...
- 如果为 `false`，则更改排序顺序将循环如下：'none' -> 'desc' -> 'asc' -> 'desc' -> 'asc' -> ...

### `enableMultiRemove`

```tsx
enableMultiRemove?: boolean
```

启用/禁用移除多重排序的能力。

### `enableMultiSort`

```tsx
enableMultiSort?: boolean
```

启用/禁用表格的多重排序。

### `sortDescFirst`

```tsx
sortDescFirst?: boolean
```

如果为 `true`，所有排序将默认以降序作为其第一个切换状态。

### `getSortedRowModel`

```tsx
getSortedRowModel?: (table: Table<TData>) => () => RowModel<TData>
```

此函数用于检索排序的行模型。如果使用服务器端排序，则不需要此函数。要使用客户端排序，请将从适配器导出的 `getSortedRowModel()` 传递给表格或实现您自己的。

### `maxMultiSortColCount`

```tsx
maxMultiSortColCount?: number
```

设置可以多重排序的列的最大数量。

### `isMultiSortEvent`

```tsx
isMultiSortEvent?: (e: unknown) => boolean
```

传递一个自定义函数，用于确定是否应触发多重排序事件。它从排序切换处理程序传递事件，如果事件应触发多重排序，则应返回 `true`。

## 表格 API

### `setSorting`

```tsx
setSorting: (updater: Updater<SortingState>) => void
```

设置或更新 `state.sorting` 状态。

### `resetSorting`

```tsx
resetSorting: (defaultState?: boolean) => void
```

将 **sorting** 状态重置为 `initialState.sorting`，或者可以传递 `true` 以强制默认空白状态重置为 `[]`。

### `getPreSortedRowModel`

```tsx
getPreSortedRowModel: () => RowModel<TData>
```

返回应用任何排序之前的表格行模型。

### `getSortedRowModel`

```tsx
getSortedRowModel: () => RowModel<TData>
```

返回应用排序后的表格行模型。