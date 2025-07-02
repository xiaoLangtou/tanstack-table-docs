---
title: 列 API
---

这些是所有列的**核心**选项和 API 属性。其他[表格功能](../guide/features.md)还提供了更多选项和 API 属性。

## 列 API

所有列对象都具有以下属性：

### `id`

```tsx
id: string
```

按以下优先级解析的列的唯一标识符：

- 列定义中的手动 `id` 属性
- 列定义中的访问器键
- 列定义中的标题字符串

### `depth`

```tsx
depth: number
```

列的深度（如果分组）相对于根列定义数组。

### `accessorFn`

```tsx
accessorFn?: AccessorFn<TData>
```

从每行中提取列值时要使用的已解析访问器函数。仅当列定义具有有效的访问器键或函数定义时才会定义。

### `columnDef`

```tsx
columnDef: ColumnDef<TData>
```

用于创建列的原始列定义。

### `columns`

```tsx
type columns = ColumnDef<TData>[]
```

子列（如果列是分组列）。如果列不是分组列，将是一个空数组。

### `parent`

```tsx
parent?: Column<TData>
```

此列的父列。如果这是根列，将是 undefined。

### `getFlatColumns`

```tsx
type getFlatColumns = () => Column<TData>[]
```

返回此列及其所有子/孙列的扁平化数组。

### `getLeafColumns`

```tsx
type getLeafColumns = () => Column<TData>[]
```

返回此列的所有叶节点列的数组。如果列没有子列，则被视为唯一的叶节点列。