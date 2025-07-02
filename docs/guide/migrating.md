---
title: 迁移到 V8 指南
---

## 迁移到 V8

TanStack Table V8 是对 React Table v7 的重大重写，从头开始使用 TypeScript 构建。您的标记和 CSS 的整体结构/组织将基本保持不变，但许多 API 已被重命名或替换。

### 重要变化

- 完全重写为 TypeScript，类型包含在基础包中
- 移除插件系统，支持更多的控制反转
- 大幅扩展和改进的 API（以及像固定等新功能）
- 更好的受控状态管理
- 更好的服务器端操作支持
- 完整（但可选）的数据管道控制
- 与框架无关的核心，带有 React、Solid、Svelte、Vue 的框架适配器，未来可能会有更多
- 新的开发工具

### 安装新版本

新版本的 TanStack Table 在 `@tanstack` 作用域下发布。使用您喜欢的包管理器安装新包：

```bash
npm uninstall react-table @types/react-table
npm install @tanstack/react-table
```

```tsx
- import { useTable } from 'react-table' // [!code --]
+ import { useReactTable } from '@tanstack/react-table' // [!code ++]
```

类型现在包含在基础包中，因此您可以移除 `@types/react-table` 包。

> 如果您愿意，可以保留旧的 `react-table` 包，以便逐步迁移代码。您应该能够在不同的表格中并行使用两个包而不会有任何问题。

### 更新表格选项

- 将 `useTable` 重命名为 `useReactTable`
- 旧的 hook 和插件系统已被移除，但它们被每个功能的可摇树优化的行模型导入所替代。

```tsx
- import { useTable, usePagination, useSortBy } from 'react-table'; // [!code --]
+ import { // [!code ++]
+   useReactTable, // [!code ++]
+   getCoreRowModel, // [!code ++]
+   getPaginationRowModel, // [!code ++]
+   getSortedRowModel // [!code ++]
+ } from '@tanstack/react-table'; // [!code ++]

// ...

-   const tableInstance = useTable( // [!code --]
-     { columns,  data }, // [!code --]
-     useSortBy, // [!code --]
-     usePagination, //hook 的使用顺序曾经很重要 // [!code --]
-     // 等等。 // [!code --]
-   ); // [!code --]
+   const tableInstance = useReactTable({ // [!code ++]
+     columns, // [!code ++]
+     data, // [!code ++]
+     getCoreRowModel: getCoreRowModel(), // [!code ++]
+     getPaginationRowModel: getPaginationRowModel(), // [!code ++]
+     getSortedRowModel: getSortedRowModel(), //顺序不再重要！ // [!code ++]
+     // 等等。 // [!code ++]
+   }); // [!code ++]
```

- 所有 `disable*` 表格选项都重命名为 `enable*` 表格选项。（例如 `disableSortBy` 现在是 `enableSorting`，`disableGroupBy` 现在是 `enableGrouping` 等）
- ...

### 更新列定义

- accessor 重命名为 `accessorKey` 或 `accessorFn`（取决于您使用的是字符串还是函数）
- width、minWidth、maxWidth 重命名为 size、minSize、maxSize
- 可选地，您可以在每个列定义周围使用新的 `createColumnHelper` 函数以获得更好的 TypeScript 提示。（如果您愿意，仍然可以只使用列定义数组。）
  - 第一个参数是访问器函数或访问器字符串。
  - 第二个参数是列选项对象。

```tsx
const columns = [
-  { // [!code --]
-    accessor: 'firstName', // [!code --]
-    Header: 'First Name', // [!code --]
-  }, // [!code --]
-  { // [!code --]
-    accessor: row => row.lastName, // [!code --]
-    Header: () => <span>Last Name</span>, // [!code --]
-  }, // [!code --]

// 最佳 TypeScript 体验，特别是在稍后使用 `cell.getValue()` 时
+  columnHelper.accessor('firstName', { //accessorKey // [!code ++]
+    header: 'First Name', // [!code ++]
+  }), // [!code ++]
+  columnHelper.accessor(row => row.lastName, { //accessorFn // [!code ++]
+    header: () => <span>Last Name</span>, // [!code ++]
+  }), // [!code ++]

// 或者（如果您更喜欢）
+ { // [!code ++]
+   accessorKey: 'firstName', // [!code ++]
+   header: 'First Name', // [!code ++]
+ }, // [!code ++]
+ { // [!code ++]
+   accessorFn: row => row.lastName, // [!code ++]
+   header: () => <span>Last Name</span>, // [!code ++]
+ }, // [!code ++]
]
```

> 注意：如果在组件内定义列，您仍应尝试为列定义提供稳定的标识。这将有助于性能并防止不必要的重新渲染。将列定义存储在 `useMemo` 或 `useState` hook 中。

- 列选项名称更改

  - `Header` 重命名为 `header`
  - `Cell` 重命名为 `cell`（单元格渲染函数也发生了变化。见下文）
  - `Footer` 重命名为 `footer`
  - 所有 `disable*` 列选项都重命名为 `enable*` 列选项。（例如 `disableSortBy` 现在是 `enableSorting`，`disableGroupBy` 现在是 `enableGrouping` 等）
  - `sortType` 重命名为 `sortingFn`
  - ...

- 自定义单元格渲染器的更改

  - `value` 重命名为 `getValue`（在整个升级过程中，不是直接提供值，而是暴露一个函数 `getValue` 来评估值。此更改旨在通过仅在调用 `getValue()` 时评估值然后缓存它来提高性能。）
  - `cell: { isGrouped, isPlaceholder, isAggregated }` 现在是 `cell: { getIsGrouped, getIsPlaceholder, getIsAggregated }`
  - `column`：基础级别属性现在是 RT 特定的。您在定义时添加到对象的值现在在 `columnDef` 中更深一层。
  - `table`：传递到 `useTable` hook 的属性现在出现在 `options` 下。

### 迁移表格标记

- 使用 `flexRender()` 而不是 `cell.render('Cell')` 或 `column.render('Header')` 等。
- `getHeaderProps`、`getFooterProps`、`getCellProps`、`getRowProps` 等都已被_弃用_。
  - TanStack Table 不再提供任何默认的 `style` 或可访问性属性如 `role`。这些对您来说仍然很重要，但为了支持与框架无关，必须移除它们。
  - 您需要手动定义 `onClick` 处理程序，但有新的 `get*Handler` 助手来保持简单。
  - 您需要手动定义 `key` 属性
  - 如果使用需要它的功能（分组头部、聚合等），您需要手动定义 `colSpan` 属性

```tsx
- <th {...header.getHeaderProps()}>{cell.render('Header')}</th> // [!code --]
+ <th colSpan={header.colSpan} key={column.id}> // [!code ++]
+   {flexRender( // [!code ++]
+     header.column.columnDef.header, // [!code ++]
+     header.getContext() // [!code ++]
+   )} // [!code ++]
+ </th> // [!code ++]
```

```tsx
- <td {...cell.getCellProps()}>{cell.render('Cell')}</td> // [!code --]
+ <td key={cell.id}> // [!code ++]
+   {flexRender( // [!code ++]
+     cell.column.columnDef.cell, // [!code ++]
+     cell.getContext() // [!code ++]
+   )} // [!code ++]
+ </td> // [!code ++]
```

```tsx
// 在这种情况下在列定义中
- Header: ({ getToggleAllRowsSelectedProps }) => ( // [!code --]
-   <input type="checkbox" {...getToggleAllRowsSelectedProps()} /> // [!code --]
- ), // [!code --]
- Cell: ({ row }) => ( // [!code --]
-   <input type="checkbox" {...row.getToggleRowSelectedProps()} /> // [!code --]
- ), // [!code --]
+ header: ({ table }) => ( // [!code ++]
+   <Checkbox // [!code ++]
+     checked={table.getIsAllRowsSelected()} // [!code ++]
+     indeterminate={table.getIsSomeRowsSelected()} // [!code ++]
+     onChange={table.getToggleAllRowsSelectedHandler()} // [!code ++]
+   /> // [!code ++]
+ ), // [!code ++]
+ cell: ({ row }) => ( // [!code ++]
+   <Checkbox // [!code ++]
+     checked={row.getIsSelected()} // [!code ++]
+     disabled={!row.getCanSelect()} // [!code ++]
+     indeterminate={row.getIsSomeSelected()} // [!code ++]
+     onChange={row.getToggleSelectedHandler()} // [!code ++]
+   /> // [!code ++]
+ ), // [!code ++]
```

### 其他更改

- 自定义 `filterTypes`（现在称为 `filterFns`）有新的函数签名，因为它只返回一个布尔值来表示是否应包含该行。

```tsx
- (rows: Row[], id: string, filterValue: any) => Row[] // [!code --]
+ (row: Row, id: string, filterValue: any) => boolean // [!code ++]
```

- ...

> 本指南正在进行中。如果您有时间，请考虑为其做出贡献！