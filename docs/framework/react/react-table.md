---
title: React Table
---

`@tanstack/react-table` 适配器是对核心表格逻辑的包装器。它的主要工作是以 "react" 的方式管理状态，提供类型以及单元格/标题/页脚模板的渲染实现。

## `useReactTable`

接受一个 `options` 对象并返回一个表格。

```tsx
import { useReactTable } from '@tanstack/react-table'

function App() {
  const table = useReactTable(options)

  // ...渲染您的表格
}
```