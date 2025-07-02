---
title: 模糊过滤指南
---

## 示例

想要跳转到实现？查看这些示例：

- [filters-fuzzy](https://github.com/TanStack/table/tree/main/examples/react/filters-fuzzy)

## API

[过滤器 API](../api/features/filters.md)

## 模糊过滤指南

模糊过滤是一种允许你基于近似匹配来过滤数据的技术。当你想要搜索与给定值相似的数据，而不是精确匹配时，这会很有用。

你可以通过定义自定义过滤函数来实现客户端模糊过滤。此函数应接收行、columnId 和过滤值，并返回一个布尔值，指示该行是否应包含在过滤数据中。

模糊过滤主要用于全局过滤，但你也可以将其应用于单个列。我们将讨论如何为这两种情况实现模糊过滤。

> **注意：** 你需要安装 `@tanstack/match-sorter-utils` 库来使用模糊过滤。
> TanStack Match Sorter Utils 是 Kent C. Dodds 的 [match-sorter](https://github.com/kentcdodds/match-sorter) 的分支。它被分叉是为了更好地与 TanStack Table 的逐行过滤方法配合使用。

使用 match-sorter 库是可选的，但 TanStack Match Sorter Utils 库提供了一种很好的方式来进行模糊过滤和根据它返回的排名信息进行排序，这样行可以按照它们与搜索查询的最接近匹配进行排序。

### 定义自定义模糊过滤函数

这是一个自定义模糊过滤函数的示例：

```typescript
import { rankItem } from '@tanstack/match-sorter-utils';
import { FilterFn } from '@tanstack/table';

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // 对项目进行排名
  const itemRank = rankItem(row.getValue(columnId), value)

  // 存储 itemRank 信息
  addMeta({ itemRank })

  // 返回项目是否应该被过滤进/出
  return itemRank.passed
}
```

在此函数中，我们使用 @tanstack/match-sorter-utils 库中的 rankItem 函数对项目进行排名。然后我们将排名信息存储在行的元数据中，并返回项目是否通过了排名标准。

### 在全局过滤中使用模糊过滤

要在全局过滤中使用模糊过滤，你可以在表格实例的 globalFilterFn 选项中指定模糊过滤函数：

```typescript
const table = useReactTable({ // 或你的框架的等效函数
    columns,
    data,
    filterFns: {
      fuzzy: fuzzyFilter, //定义为可在列定义中使用的过滤函数
    },
    globalFilterFn: 'fuzzy', //将模糊过滤应用于全局过滤（模糊过滤的最常见用例）
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //客户端过滤
    getSortedRowModel: getSortedRowModel(), //如果你也想使用排序，需要客户端排序。
})
```

### 在列过滤中使用模糊过滤

要在列过滤中使用模糊过滤，你应该首先在表格实例的 filterFns 选项中定义模糊过滤函数。然后你可以在列定义的 filterFn 选项中指定模糊过滤函数：

```typescript
const column = [
  {
    accessorFn: row => `${row.firstName} ${row.lastName}`,
    id: 'fullName',
    header: 'Full Name',
    cell: info => info.getValue(),
    filterFn: 'fuzzy', //使用我们的自定义模糊过滤函数
  },
  // 其他列...
];
```

在此示例中，我们将模糊过滤应用于组合数据的 firstName 和 lastName 字段的列。

#### 使用模糊过滤进行排序

在列过滤中使用模糊过滤时，你可能还想根据排名信息对数据进行排序。你可以通过定义自定义排序函数来做到这一点：

```typescript
import { compareItems } from '@tanstack/match-sorter-utils'
import { sortingFns } from '@tanstack/table'

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // 只有当列有排名信息时才按排名排序
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  // 当项目排名相等时提供字母数字回退
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
```

在此函数中，我们比较两行的排名信息。如果排名相等，我们回退到字母数字排序。

然后你可以在列定义的 sortFn 选项中指定此排序函数：

```typescript
{
  accessorFn: row => `${row.firstName} ${row.lastName}`,
  id: 'fullName',
  header: 'Full Name',
  cell: info => info.getValue(),
  filterFn: 'fuzzy', //使用我们的自定义模糊过滤函数
  sortFn: 'fuzzySort', //使用我们的自定义模糊排序函数
}
```