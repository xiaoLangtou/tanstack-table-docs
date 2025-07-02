---
title: Vanilla TS/JS
---

`@tanstack/table-core` 库包含 TanStack Table 的核心逻辑。如果您使用的是非标准框架或无法访问框架，您可以通过 TypeScript 或 JavaScript 直接使用核心库。

## `createTable`

接受一个 `options` 对象并返回一个表格。

```tsx
import { createTable } from '@tanstack/table-core'

const table = createTable(options)
```