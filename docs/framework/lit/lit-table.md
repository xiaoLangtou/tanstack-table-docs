---
title: Lit Table
---

`@tanstack/lit-table` 适配器是对核心表格逻辑的包装器。它的主要工作是以 "lit" 的方式管理状态，提供类型以及单元格/标题/页脚模板的渲染实现。

## 导出

`@tanstack/lit-table` 重新导出了 `@tanstack/table-core` 的所有 API 以及以下内容：

### `TableController`

是一个响应式控制器，提供一个 `table` API，该 API 接受一个 `options` 对象并返回一个表格实例。

```ts
import { TableController } from '@tanstack/lit-table'

@customElement('my-table-element')
class MyTableElement extends LitElement {
  private tableController = new TableController<Person>(this)

  protected render() {
    const table = this.tableController.table(options)
    // ...渲染您的表格
  }
}
```

### `flexRender`

一个用于渲染具有动态值的单元格/标题/页脚模板的实用函数。

示例：

```jsx
import { flexRender } from '@tanstack/lit-table'
//...
return html`
<tbody>
  ${table
    .getRowModel()
    .rows.slice(0, 10)
    .map(
      row => html`
        <tr>
          ${row
            .getVisibleCells()
            .map(
              cell => html`
                <td>
                  ${flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              `
            )}
        </tr>
      `
    )}
</tbody>
`
```