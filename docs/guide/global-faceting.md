---
title: 全局分面指南
---

## 示例

想要跳到实现部分？查看这些示例：

- [filters-faceted](../framework/react/examples/filters)

## API

[全局分面 API](../api/features/global-faceting)

## 全局分面指南

全局分面允许您从表格数据中为所有列生成值列表。例如，可以从所有行的所有列中生成表格中唯一值的列表，用作自动完成过滤器组件中的搜索建议。或者，可以从数字表格中生成最小值和最大值的元组，用作范围滑块过滤器组件的范围。

### 全局分面行模型

为了使用任何全局分面功能，您必须在表格选项中包含适当的行模型。

```ts
// 只导入您需要的行模型
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues, // 依赖于 getFacetedRowModel
  getFacetedUniqueValues, // 依赖于 getFacetedRowModel
} from '@tanstack/react-table'
//...
const table = useReactTable({
  // 其他选项...
  getCoreRowModel: getCoreRowModel(),
  getFacetedRowModel: getFacetedRowModel(), // 客户端分面的分面模型（其他分面方法依赖于此模型）
  getFacetedMinMaxValues: getFacetedMinMaxValues(), // 如果您需要最小/最大值
  getFacetedUniqueValues: getFacetedUniqueValues(), // 如果您需要唯一值列表
  //...
})
```

### 使用全局分面行模型

一旦您在表格选项中包含了适当的行模型，您将能够使用分面表格实例 API 来访问由分面行模型生成的值列表。

```ts
// 用于自动完成过滤器的唯一值列表
const autoCompleteSuggestions =
 Array.from(table.getGlobalFacetedUniqueValues().keys())
  .sort()
  .slice(0, 5000);
```

```ts
// 用于范围过滤器的最小值和最大值元组
const [min, max] = table.getGlobalFacetedMinMaxValues() ?? [0, 1];
```

### 自定义全局（服务器端）分面

如果不使用内置的客户端分面功能，您可以在服务器端实现自己的分面逻辑，并将分面值传递给客户端。您可以使用 getGlobalFacetedUniqueValues 和 getGlobalFacetedMinMaxValues 表格选项来从服务器端解析分面值。

```ts
const facetingQuery = useQuery(
  'faceting',
  async () => {
    const response = await fetch('/api/faceting');
    return response.json();
  },
  {
    onSuccess: (data) => {
      table.getGlobalFacetedUniqueValues = () => data.uniqueValues;
      table.getGlobalFacetedMinMaxValues = () => data.minMaxValues;
    },
  }
);
```

在此示例中，我们使用 `react-query` 的 `useQuery` hook 从服务器获取分面数据。一旦获取到数据，我们设置 `getGlobalFacetedUniqueValues` 和 `getGlobalFacetedMinMaxValues` 表格选项以返回服务器响应中的分面值。这将允许表格使用服务器端分面数据来生成自动完成建议和范围过滤器。