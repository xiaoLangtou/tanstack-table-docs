---
title: Svelte Table
---

`@tanstack/svelte-table` 适配器是核心表格逻辑的包装器。它的主要工作是以 "svelte" 的方式管理状态，提供类型以及单元格/头部/尾部模板的渲染实现。

## `createSvelteTable`

接受一个 `options` 对象并返回一个表格。

```svelte
<script>

import { createSvelteTable } from '@tanstack/svelte-table'

const table = createSvelteTable(options)

</script>
```