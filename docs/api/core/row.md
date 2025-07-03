---
title: 行 API
---

这些是所有行的**核心**选项和 API 属性。其他[表格功能](../guide/features.md)还提供了更多选项和 API 属性。

## 行 API

所有行对象都具有以下属性：

### `id`

```tsx
id: string
```

通过 `options.getRowId` 选项解析的行的唯一标识符。默认为行的索引（如果是子行，则为相对索引）

### `depth`

```tsx
depth: number
```

行的深度（如果嵌套或分组）相对于根行数组。

### `index`

```tsx
index: number
```

行在其父数组（或根数据数组）中的索引

### `original`

```tsx
original: TData
```

提供给表格的原始行对象。

> 🧠 如果行是分组行，原始行对象将是组中的第一个原始对象。

### `parentId`

```tsx
parentId?: string
```

如果嵌套，此行的父行 ID。

### `getValue`

```tsx
getValue: (columnId: string) => TValue
```

返回给定 columnId 的行值

### `renderValue`

```tsx
renderValue: (columnId: string) => TValue
```

渲染给定 columnId 的行值，但如果找不到值，将返回 `renderFallbackValue`。

### `getUniqueValues`

```tsx
getUniqueValues: (columnId: string) => TValue[]
```

返回给定 columnId 的行的唯一值数组。

### `subRows`

```tsx
type subRows = Row<TData>[]
```

由 `options.getSubRows` 选项返回和创建的行的子行数组。

### `getParentRow`

```tsx
type getParentRow = () => Row<TData> | undefined
```

返回行的父行（如果存在）。

### `getParentRows`

```tsx
type getParentRows = () => Row<TData>[]
```

返回行的父行，一直到根行。

### `getLeafRows`

```tsx
type getLeafRows = () => Row<TData>[]
```

返回行的叶行，不包括任何父行。

### `originalSubRows`

```tsx
originalSubRows?: TData[]
```

由 `options.getSubRows` 选项返回的原始子行数组。

### `getAllCells`

```tsx
type getAllCells = () => Cell<TData>[]
```

返回行的所有[单元格](cell.md)。
