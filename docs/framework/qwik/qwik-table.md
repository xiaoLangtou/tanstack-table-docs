---
title: Qwik Table
---

`@tanstack/qwik-table` 适配器是对核心表格逻辑的包装器。它的主要工作是以 "qwik" 的方式管理状态，提供类型以及单元格/标题/页脚模板的渲染实现。

## 导出

`@tanstack/qwik-table` 重新导出了 `@tanstack/table-core` 的所有 API 以及以下内容：

### `useQwikTable`

接受一个 `options` 对象，并从带有 `NoSerialize` 的 Qwik Store 返回一个表格。

```ts
import { useQwikTable } from '@tanstack/qwik-table'

const table = useQwikTable(options)
// ...渲染您的表格

```

### `flexRender`

一个用于渲染具有动态值的单元格/标题/页脚模板的实用函数。

示例：

```jsx
import { flexRender } from '@tanstack/qwik-table'
//...
return (
  <tbody>
    {table.getRowModel().rows.map(row => {
      return (
        <tr key={row.id}>
          {row.getVisibleCells().map(cell => (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      )
    })}
  </tbody>
);
```