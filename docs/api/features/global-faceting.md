---
title: 全局分面 API
id: global-faceting
---

## 表格 API

### `getGlobalFacetedRowModel`

```tsx
getGlobalFacetedRowModel: () => RowModel<TData>
```

返回全局过滤器的分面行模型。

### `getGlobalFacetedUniqueValues`

```tsx
getGlobalFacetedUniqueValues: () => Map<any, number>
```

返回全局过滤器的分面唯一值。

### `getGlobalFacetedMinMaxValues`

```tsx
getGlobalFacetedMinMaxValues: () => [number, number]
```

返回全局过滤器的分面最小值和最大值。