---
title: 列分面指南
---

## 示例

想要跳转到实现？查看这些示例：

- [filters-faceted](https://github.com/TanStack/table/tree/main/examples/react/filters-faceted)

## API

[列分面 API](../api/features/column-faceting.md)

## 列分面指南

列分面是一个功能，允许你从给定列的数据中生成该列的值列表。例如，可以从列中的所有行生成唯一值列表，用作自动完成过滤器组件中的搜索建议。或者，可以从数字列生成最小值和最大值的元组，用作范围滑块过滤器组件的范围。

### 列分面行模型

为了使用任何列分面功能，你必须在表格选项中包含适当的行模型。

```ts
//只导入你需要的行模型
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues, //依赖于 getFacetedRowModel
  getFacetedUniqueValues, //依赖于 getFacetedRowModel
}
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFacetedRowModel: getFacetedRowModel(), //如果你需要列的值列表（其他分面行模型依赖于这个）
  getFacetedMinMaxValues: getFacetedMinMaxValues(), //如果你需要最小/最大值
  getFacetedUniqueValues: getFacetedUniqueValues(), //如果你需要唯一值列表
  //...
})
```

首先，你必须包含 `getFacetedRowModel` 行模型。这个行模型将为给定列生成值列表。如果你需要唯一值列表，包含 `getFacetedUniqueValues` 行模型。如果你需要最小值和最大值的元组，包含 `getFacetedMinMaxValues` 行模型。

### 使用分面行模型

一旦你在表格选项中包含了适当的行模型，你就能够使用分面列实例 API 来访问由分面行模型生成的值列表。

```ts
// 用于自动完成过滤器的唯一值列表
const autoCompleteSuggestions = 
 Array.from(column.getFacetedUniqueValues().keys())
  .sort()
  .slice(0, 5000);
```

```ts
// 用于范围过滤器的最小值和最大值元组
const [min, max] = column.getFacetedMinMaxValues() ?? [0, 1];
```

### 自定义（服务端）分面

如果不使用内置的客户端分面功能，你可以在服务端实现自己的分面逻辑，并将分面值传递给客户端。你可以使用 `getFacetedUniqueValues` 和 `getFacetedMinMaxValues` 表格选项来从服务端解析分面值。

```ts
const facetingQuery = useQuery(
  //...
)

const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: (table, columnId) => {
    const uniqueValueMap = new Map<string, number>();
    //...
    return uniqueValueMap;
  },
  getFacetedMinMaxValues: (table, columnId) => {
    //...
    return [min, max];
  },
  //...
})
```

或者，你完全不必通过 TanStack Table API 来处理任何分面逻辑。只需获取你的列表并直接传递给你的过滤器组件。