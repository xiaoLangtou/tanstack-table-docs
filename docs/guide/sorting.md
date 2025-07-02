---
title: 排序指南
---

## 示例

想要跳到实现部分？查看这些示例：

- [排序](../framework/react/examples/sorting)
- [过滤器](../framework/react/examples/filters)

## API

[排序 API](../api/features/sorting)

## 排序指南

TanStack Table 为你可能遇到的几乎任何排序用例提供解决方案。本指南将引导你了解可以用来自定义内置客户端排序功能的各种选项，以及如何选择退出客户端排序而使用手动服务器端排序。

### 排序状态

排序状态定义为具有以下形状的对象数组：

```tsx
type ColumnSort = {
  id: string
  desc: boolean
}
type SortingState = ColumnSort[]
```

由于排序状态是一个数组，因此可以同时按多列排序。阅读下面关于多排序自定义的更多信息[below](#multi-sorting)。

#### 访问排序状态

你可以像访问任何其他状态一样，使用 `table.getState()` API 直接从表格实例访问排序状态。

```tsx
const table = useReactTable({
  columns,
  data,
  //...
})

console.log(table.getState().sorting) // 从表格实例访问排序状态
```

但是，如果你需要在表格初始化之前访问排序状态，你可以像下面那样"控制"排序状态。

#### 受控排序状态

如果你需要轻松访问排序状态，你可以使用 `state.sorting` 和 `onSortingChange` 表格选项在你自己的状态管理中控制/管理排序状态。

```tsx
const [sorting, setSorting] = useState<SortingState>([]) // 可以在这里设置初始排序状态
//...
// 使用排序状态从服务器获取数据或其他操作...
//...
const table = useReactTable({
  columns,
  data,
  //...
  state: {
    sorting,
  },
  onSortingChange: setSorting,
})
```

#### 初始排序状态

如果你不需要在自己的状态管理或作用域中控制排序状态，但仍想设置初始排序状态，你可以使用 `initialState` 表格选项而不是 `state`。

```jsx
const table = useReactTable({
  columns,
  data,
  //...
  initialState: {
    sorting: [
      {
        id: 'name',
        desc: true, // 默认按名称降序排序
      },
    ],
  },
})
```

> **注意**：不要同时使用 `initialState.sorting` 和 `state.sorting`，因为 `state.sorting` 中的初始化状态将覆盖 `initialState.sorting`。

### 客户端 vs 服务器端排序

是否应该使用客户端或服务器端排序完全取决于你是否也在使用客户端或服务器端分页或过滤。保持一致，因为将客户端排序与服务器端分页或过滤一起使用只会对当前加载的数据进行排序，而不是整个数据集。

### 手动服务器端排序

如果你计划在后端逻辑中只使用自己的服务器端排序，你不需要提供排序行模型。但如果你已经提供了排序行模型，但想要禁用它，你可以使用 `manualSorting` 表格选项。

```jsx
const [sorting, setSorting] = useState<SortingState>([])
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  //getSortedRowModel: getSortedRowModel(), //手动排序不需要
  manualSorting: true, //使用预排序行模型而不是排序行模型
  state: {
    sorting,
  },
  onSortingChange: setSorting,
})
```

> **注意**：当 `manualSorting` 设置为 `true` 时，表格将假设你提供的数据已经排序，并且不会对其应用任何排序。

### 客户端排序

要实现客户端排序，首先你必须为表格提供排序行模型。你可以从 TanStack Table 导入 `getSortedRowModel` 函数，它将用于将你的行转换为排序行。

```jsx
import { useReactTable } from '@tanstack/react-table'
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(), //提供排序行模型
})
```

### 排序函数

所有列的默认排序函数是从列的数据类型推断的。但是，为特定列定义你想要使用的确切排序函数可能很有用，特别是如果你的任何数据是可空的或不是标准数据类型。

你可以使用 `sortingFn` 列选项在每列基础上确定自定义排序函数。

默认情况下，有 6 个内置排序函数可供选择：

- `alphanumeric` - 按混合字母数字值排序，不区分大小写。较慢，但如果你的字符串包含需要自然排序的数字，则更准确。
- `alphanumericCaseSensitive` - 按混合字母数字值排序，区分大小写。较慢，但如果你的字符串包含需要自然排序的数字，则更准确。
- `text` - 按文本/字符串值排序，不区分大小写。更快，但如果你的字符串包含需要自然排序的数字，则不太准确。
- `textCaseSensitive` - 按文本/字符串值排序，区分大小写。更快，但如果你的字符串包含需要自然排序的数字，则不太准确。
- `datetime` - 按时间排序，如果你的值是 `Date` 对象，请使用此选项。
- `basic` - 使用基本/标准 `a > b ? 1 : a < b ? -1 : 0` 比较进行排序。这是最快的排序函数，但可能不是最准确的。

你还可以将自己的自定义排序函数定义为 `sortingFn` 列选项，或使用 `sortingFns` 表格选项作为全局排序函数。

#### 自定义排序函数

在 `sortingFns` 表格选项或 `sortingFn` 列选项中定义自定义排序函数时，它应该具有以下签名：

```tsx
//可选择使用 SortingFn 推断参数类型
const myCustomSortingFn: SortingFn<TData> = (rowA: Row<TData>, rowB: Row<TData>, columnId: string) => {
  return //-1, 0, 或 1 - 使用 rowA.original 和 rowB.original 访问任何行数据
}
```

> 注意：比较函数不需要考虑列是降序还是升序。行模型将处理该逻辑。`sortingFn` 函数只需要提供一致的比较。

每个排序函数接收 2 行和一个列 ID，并期望使用列 ID 比较两行，以升序返回 `-1`、`0` 或 `1`。这里是一个备忘单：

| 返回值 | 升序 |
| ------ | --------------- |
| `-1`   | `a < b`         |
| `0`    | `a === b`       |
| `1`    | `a > b`         |

```jsx
const columns = [
  {
    header: () => 'Name',
    accessorKey: 'name',
    sortingFn: 'alphanumeric', // 按名称使用内置排序函数
  },
  {
    header: () => 'Age',
    accessorKey: 'age',
    sortingFn: 'myCustomSortingFn', // 使用自定义全局排序函数
  },
  {
    header: () => 'Birthday',
    accessorKey: 'birthday',
    sortingFn: 'datetime', // 推荐用于日期列
  },
  {
    header: () => 'Profile',
    accessorKey: 'profile',
    // 直接使用自定义排序函数
    sortingFn: (rowA, rowB, columnId) => {
      return rowA.original.someProperty - rowB.original.someProperty
    },
  }
]
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  sortingFns: { //添加自定义排序函数
    myCustomSortingFn: (rowA, rowB, columnId) => {
      return rowA.original[columnId] > rowB.original[columnId] ? 1 : rowA.original[columnId] < rowB.original[columnId] ? -1 : 0
    },
  },
})
```

### 自定义排序

有很多表格和列选项可以用来进一步自定义排序 UX 和行为。

#### 禁用排序

你可以使用 `enableSorting` 列选项或表格选项为特定列或整个表格禁用排序。

```jsx
const columns = [
  {
    header: () => 'ID',
    accessorKey: 'id',
    enableSorting: false, // 为此列禁用排序
  },
  {
    header: () => 'Name',
    accessorKey: 'name',
  },
  //...
]
//...
const table = useReactTable({
  columns,
  data,
  enableSorting: false, // 为整个表格禁用排序
})
```

#### 排序方向

默认情况下，使用 `toggleSorting` API 循环列排序时的第一个排序方向对于字符串列是升序，对于数字列是降序。你可以使用 `sortDescFirst` 列选项或表格选项更改此行为。

```jsx
const columns = [
  {
    header: () => 'Name',
    accessorKey: 'name',
    sortDescFirst: true, //首先按名称降序排序（字符串列的默认值是升序）
  },
  {
    header: () => 'Age',
    accessorKey: 'age',
    sortDescFirst: false, //首先按年龄升序排序（数字列的默认值是降序）
  },
  //...
]
//...
const table = useReactTable({
  columns,
  data,
  sortDescFirst: true, //首先按所有列降序排序（字符串列的默认值是升序，数字列的默认值是降序）
})
```

> **注意**：你可能希望在任何包含可空值的列上显式设置 `sortDescFirst` 列选项。如果表格包含可空值，表格可能无法正确确定列是数字还是字符串。

#### 反转排序

反转排序与更改默认排序方向不同。如果列的 `invertSorting` 列选项为 `true`，那么"desc/asc"排序状态仍将正常循环，但行的实际排序将被反转。这对于具有反转最佳/最差比例的值很有用，其中较低的数字更好，例如排名（第1、第2、第3）或高尔夫式评分。

```jsx
const columns = [
  {
    header: () => 'Rank',
    accessorKey: 'rank',
    invertSorting: true, // 反转此列的排序。第1 -> 第2 -> 第3 -> ... 即使应用了"desc"排序
  },
  //...
]
```

#### 排序未定义值

任何未定义的值将根据 `sortUndefined` 列选项或表格选项排序到列表的开头或结尾。你可以为你的特定用例自定义此行为。

如果未指定，`sortUndefined` 的默认值是 `1`，未定义的值将以较低优先级排序（降序），如果是升序，未定义将出现在列表的末尾。

- `'first'` - 未定义的值将被推到列表的开头
- `'last'` - 未定义的值将被推到列表的末尾
- `false` - 未定义的值将被视为并列，需要按下一个列过滤器或原始索引排序（以适用者为准）
- `-1` - 未定义的值将以较高优先级排序（升序）（如果升序，未定义将出现在列表的开头）
- `1` - 未定义的值将以较低优先级排序（降序）（如果升序，未定义将出现在列表的末尾）

> 注意：`'first'` 和 `'last'` 选项在 v8.16.0 中是新的

```jsx
const columns = [
  {
    header: () => 'Rank',
    accessorKey: 'rank',
    sortUndefined: -1, // 'first' | 'last' | 1 | -1 | false
  },
]
```

#### 排序移除

默认情况下，在循环列的排序状态时移除排序的能力是启用的。你可以使用 `enableSortingRemoval` 表格选项禁用此行为。如果你想确保至少有一列始终排序，此行为很有用。

使用 `getToggleSortingHandler` 或 `toggleSorting` API 时的默认行为是像这样循环排序状态：

`'none' -> 'desc' -> 'asc' -> 'none' -> 'desc' -> 'asc' -> ...`

如果你禁用排序移除，行为将是这样的：

`'none' -> 'desc' -> 'asc' -> 'desc' -> 'asc' -> ...`

一旦列被排序且 `enableSortingRemoval` 为 `false`，切换该列的排序将永远不会移除排序。但是，如果用户按另一列排序且不是多排序事件，那么排序将从前一列移除并仅应用于新列。

> 如果你想确保至少有一列始终排序，请将 `enableSortingRemoval` 设置为 `false`。

```jsx
const table = useReactTable({
  columns,
  data,
  enableSortingRemoval: false, // 禁用移除列排序的能力（始终 none -> asc -> desc -> asc）
})
```

#### 多排序

如果使用 `column.getToggleSortingHandler` API，默认情况下启用同时按多列排序。如果用户在点击列标题时按住 `Shift` 键，表格将按该列排序，除了已经排序的列之外。如果你使用 `column.toggleSorting` API，你必须手动传入是否使用多排序。（`column.toggleSorting(desc, multi)`）。

##### 禁用多排序

你可以使用 `enableMultiSort` 列选项或表格选项为特定列或整个表格禁用多排序。为特定列禁用多排序将用新列的排序替换所有现有排序。

```jsx
const columns = [
  {
    header: () => 'Created At',
    accessorKey: 'createdAt',
    enableMultiSort: false, // 如果按此列排序，始终只按此列排序
  },
  //...
]
//...
const table = useReactTable({
  columns,
  data,
  enableMultiSort: false, // 为整个表格禁用多排序
})
```

##### 自定义多排序触发器

默认情况下，`Shift` 键用于触发多排序。你可以使用 `isMultiSortEvent` 表格选项更改此行为。你甚至可以通过从自定义函数返回 `true` 来指定所有排序事件都应触发多排序。

```jsx
const table = useReactTable({
  columns,
  data,
  isMultiSortEvent: (e) => true, // 正常点击触发多排序
  //或
  isMultiSortEvent: (e) => e.ctrlKey || e.shiftKey, // 也使用 `Ctrl` 键触发多排序
})
```

##### 多排序限制

默认情况下，可以同时排序的列数没有限制。你可以使用 `maxMultiSortColCount` 表格选项设置限制。

```jsx
const table = useReactTable({
  columns,
  data,
  maxMultiSortColCount: 3, // 只允许同时排序 3 列
})
```

##### 多排序移除

默认情况下，移除多排序的能力是启用的。你可以使用 `enableMultiRemove` 表格选项禁用此行为。

```jsx
const table = useReactTable({
  columns,
  data,
  enableMultiRemove: false, // 禁用移除多排序的能力
})
```

### 排序 API

有很多与排序相关的 API，你可以用来连接到你的 UI 或其他逻辑。以下是所有排序 API 及其一些用例的列表。

- `table.setSorting` - 直接设置排序状态。
- `table.resetSorting` - 将排序状态重置为初始状态或清除它。

- `column.getCanSort` - 用于启用/禁用列的排序 UI。
- `column.getIsSorted` - 用于显示列的视觉排序指示器。

- `column.getToggleSortingHandler` - 用于连接列的排序 UI。添加到排序箭头（图标按钮）、菜单项或简单的整个列标题单元格。此处理程序将使用正确的参数调用 `column.toggleSorting`。
- `column.toggleSorting` - 用于连接列的排序 UI。如果使用而不是 `column.getToggleSortingHandler`，你必须手动传入是否使用多排序。（`column.toggleSorting(desc, multi)`）
- `column.clearSorting` - 用于特定列的"清除排序"按钮或菜单项。

- `column.getNextSortingOrder` - 用于显示列接下来将按哪个方向排序。（在工具提示/菜单项/aria-label 或其他地方显示 asc/desc/clear）
- `column.getFirstSortDir` - 用于显示列首先将按哪个方向排序。（在工具提示/菜单项/aria-label 或其他地方显示 asc/desc）
- `column.getAutoSortDir` - 确定列的第一个排序方向是升序还是降序。
- `column.getAutoSortingFn` - 内部用于查找列的默认排序函数（如果未指定）。
- `column.getSortingFn` - 返回用于列的确切排序函数。

- `column.getCanMultiSort` - 用于启用/禁用列的多排序 UI。
- `column.getSortIndex` - 用于在多排序场景中显示列排序顺序的徽章或指示器。即它是否是第一、第二、第三等要排序的列。