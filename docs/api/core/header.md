---
title: 表头 API
---

这些是所有表头的**核心**选项和 API 属性。其他[表格功能](../guide/features.md)可能还提供了更多选项和 API 属性。

## 表头 API

所有表头对象都具有以下属性：

### `id`

```tsx
id: string
```

表头的唯一标识符。

### `index`

```tsx
index: number
```

表头在表头组中的索引。

### `depth`

```tsx
depth: number
```

表头的深度，基于零索引。

### `column`

```tsx
column: Column<TData>
```

表头关联的[列](../column.md)对象

### `headerGroup`

```tsx
headerGroup: HeaderGroup<TData>
```

表头关联的[表头组](../header-group.md)对象

### `subHeaders`

```tsx
type subHeaders = Header<TData>[]
```

表头的分层子表头。如果表头关联的列是叶列，则为空。

### `colSpan`

```tsx
colSpan: number
```

表头的列跨度。

### `rowSpan`

```tsx
rowSpan: number
```

表头的行跨度。

### `getLeafHeaders`

```tsx
type getLeafHeaders = () => Header<TData>[]
```

返回此表头下分层嵌套的叶表头。

### `isPlaceholder`

```tsx
isPlaceholder: boolean
```

表示表头是否为占位符表头的布尔值

### `placeholderId`

```tsx
placeholderId?: string
```

如果表头是占位符表头，这将是一个唯一的表头 ID，不会与表格中的任何其他表头冲突

### `getContext`

```tsx
getContext: () => {
  table: Table<TData>
  header: Header<TData, TValue>
  column: Column<TData, TValue>
}
```

返回基于列的组件（如表头、页脚和过滤器）的渲染上下文（或属性）。将这些属性与框架的 `flexRender` 工具一起使用，以使用您选择的模板进行渲染：

```tsx
flexRender(header.column.columnDef.header, header.getContext())
```

## 表格 API

### `getHeaderGroups`

```tsx
type getHeaderGroups = () => HeaderGroup<TData>[]
```

返回表格的所有表头组。

### `getLeftHeaderGroups`

```tsx
type getLeftHeaderGroups = () => HeaderGroup<TData>[]
```

如果启用固定，返回左侧固定列的表头组。

### `getCenterHeaderGroups`

```tsx
type getCenterHeaderGroups = () => HeaderGroup<TData>[]
```

如果启用固定，返回未固定列的表头组。

### `getRightHeaderGroups`

```tsx
type getRightHeaderGroups = () => HeaderGroup<TData>[]
```

如果启用固定，返回右侧固定列的表头组。

### `getFooterGroups`

```tsx
type getFooterGroups = () => HeaderGroup<TData>[]
```

返回表格的所有页脚组。

### `getLeftFooterGroups`

```tsx
type getLeftFooterGroups = () => HeaderGroup<TData>[]
```

如果启用固定，返回左侧固定列的页脚组。

### `getCenterFooterGroups`

```tsx
type getCenterFooterGroups = () => HeaderGroup<TData>[]
```

如果启用固定，返回未固定列的页脚组。

### `getRightFooterGroups`

```tsx
type getRightFooterGroups = () => HeaderGroup<TData>[]
```

如果启用固定，返回右侧固定列的页脚组。

### `getFlatHeaders`

```tsx
type getFlatHeaders = () => Header<TData, unknown>[]
```

返回表格中所有列的表头，包括父表头。

### `getLeftFlatHeaders`

```tsx
type getLeftFlatHeaders = () => Header<TData, unknown>[]
```

如果启用固定，返回表格中所有左侧固定列的表头，包括父表头。

### `getCenterFlatHeaders`

```tsx
type getCenterFlatHeaders = () => Header<TData, unknown>[]
```

如果启用固定，返回所有未固定列的表头，包括父表头。

### `getRightFlatHeaders`

```tsx
type getRightFlatHeaders = () => Header<TData, unknown>[]
```

如果启用固定，返回表格中所有右侧固定列的表头，包括父表头。

### `getLeafHeaders`

```tsx
type getLeafHeaders = () => Header<TData, unknown>[]
```

返回表格中所有叶列的表头（不包括父表头）。

### `getLeftLeafHeaders`

```tsx
type getLeftLeafHeaders = () => Header<TData, unknown>[]
```

如果启用固定，返回表格中所有左侧固定叶列的表头（不包括父表头）。

### `getCenterLeafHeaders`

```tsx
type getCenterLeafHeaders = () => Header<TData, unknown>[]
```

如果启用固定，返回所有未固定列的表头（不包括父表头）。

### `getRightLeafHeaders`

```tsx
type getRightLeafHeaders = () => Header<TData, unknown>[]
```

如果启用固定，返回表格中所有右侧固定叶列的表头（不包括父表头）。