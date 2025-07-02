---
title: 表头组 API
---

这些是所有表头组的**核心**选项和 API 属性。其他[表格功能](../guide/features.md)可能还提供了更多选项和 API 属性。

## 表头组 API

所有表头组对象都具有以下属性：

### `id`

```tsx
id: string
```

表头组的唯一标识符。

### `depth`

```tsx
depth: number
```

表头组的深度，基于零索引。

### `headers`

```tsx
type headers = Header<TData>[]
```

属于此表头组的[表头](../header.md)对象数组