---
title: 列分面 API
id: column-faceting
---

## 列 API

### `getFacetedRowModel`

```tsx
type getFacetedRowModel = () => RowModel<TData>
```

> ⚠️ 需要您向 `options.facetedRowModel` 传递有效的 `getFacetedRowModel` 函数。通过导出的 `getFacetedRowModel` 函数提供默认实现。

返回应用了所有其他列过滤器但排除自身过滤器的行模型。对于显示分面结果计数很有用。

### `getFacetedUniqueValues`

```tsx
getFacetedUniqueValues: () => Map<any, number>
```

> ⚠️ 需要您向 `options.getFacetedUniqueValues` 传递有效的 `getFacetedUniqueValues` 函数。通过导出的 `getFacetedUniqueValues` 函数提供默认实现。

一个**计算并返回**从 `column.getFacetedRowModel` 派生的唯一值及其出现次数的 `Map` 的函数。对于显示分面结果值很有用。

### `getFacetedMinMaxValues`

```tsx
getFacetedMinMaxValues: () => Map<any, number>
```

> ⚠️ 需要您向 `options.getFacetedMinMaxValues` 传递有效的 `getFacetedMinMaxValues` 函数。通过导出的 `getFacetedMinMaxValues` 函数提供默认实现。

一个**计算并返回**从 `column.getFacetedRowModel` 派生的最小/最大值元组的函数。对于显示分面结果值很有用。

## 表格选项

### `getColumnFacetedRowModel`

```tsx
getColumnFacetedRowModel: (columnId: string) => RowModel<TData>
```

返回给定 columnId 的分面行模型。