---
title: Vue Table
---

`@tanstack/vue-table` 适配器是核心表格逻辑的包装器。它的主要工作是以 "vue" 的方式管理状态，提供类型以及单元格/头部/尾部模板的渲染实现。

## 导出

`@tanstack/vue-table` 重新导出了 `@tanstack/table-core` 的所有 API 以及以下内容：

### `useVueTable`

接受一个 `options` 对象并返回一个表格。

```ts
import { useVueTable } from '@tanstack/vue-table'

const table = useVueTable(options)
// ...渲染你的表格

```

### `FlexRender`

一个用于渲染具有动态值的单元格/头部/尾部模板的 Vue 组件。

示例：

```vue
import { FlexRender } from '@tanstack/vue-table'

<template>
  <tbody>
    <tr v-for="row in table.getRowModel().rows" :key="row.id">
      <td v-for="cell in row.getVisibleCells()" :key="cell.id">
        <FlexRender
          :render="cell.column.columnDef.cell"
          :props="cell.getContext()"
        />
      </td>
    </tr>
  </tbody>
</template>
```