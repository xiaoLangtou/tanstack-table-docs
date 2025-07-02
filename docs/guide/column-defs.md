---
title: 列指南
---

## API

[Table API](../api/core/table.md)

## 列定义指南

列定义是构建表格最重要的部分。它们负责：

- 构建用于所有功能（包括排序、过滤、分组等）的底层数据模型
- 将数据模型格式化为将在表格中显示的内容
- 创建[标题组](../api/core/header-group.md)、[标题](../api/core/header.md)和[页脚](../api/core/column-def.md#footer)
- 创建仅用于显示目的的列，例如操作按钮、复选框、展开器、迷你图等

## 列定义类型

以下列定义的"类型"实际上不是 TypeScript 类型，而更多是一种谈论和描述列定义整体类别的方式：

- `访问器列`
  - 访问器列具有底层数据模型，这意味着它们可以被排序、过滤、分组等。
- `显示列`
  - 显示列**没有**数据模型，这意味着它们不能被排序、过滤等，但它们可以用于在表格中显示任意内容，例如行操作按钮、复选框、展开器等。
- `分组列`
  - 分组列**没有**数据模型，因此它们也不能被排序、过滤等，用于将其他列组合在一起。通常为列组定义标题或页脚。

## 列助手

虽然列定义最终只是普通对象，但表格核心暴露了一个 `createColumnHelper` 函数，当使用行类型调用时，返回一个用于创建不同列定义类型的实用程序，具有最高的类型安全性。

以下是创建和使用列助手的示例：

```tsx
// 定义您的行形状
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const columnHelper = createColumnHelper<Person>()

// 创建一些列！
const defaultColumns = [
  // 显示列
  columnHelper.display({
    id: 'actions',
    cell: props => <RowActions row={props.row} />,
  }),
  // 分组列
  columnHelper.group({
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      // 访问器列
      columnHelper.accessor('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id,
      }),
      // 访问器列
      columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      }),
    ],
  }),
  // 分组列
  columnHelper.group({
    header: 'Info',
    footer: props => props.column.id,
    columns: [
      // 访问器列
      columnHelper.accessor('age', {
        header: () => 'Age',
        footer: props => props.column.id,
      }),
      // 分组列
      columnHelper.group({
        header: 'More Info',
        columns: [
          // 访问器列
          columnHelper.accessor('visits', {
            header: () => <span>Visits</span>,
            footer: props => props.column.id,
          }),
          // 访问器列
          columnHelper.accessor('status', {
            header: 'Status',
            footer: props => props.column.id,
          }),
          // 访问器列
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
            footer: props => props.column.id,
          }),
        ],
      }),
    ],
  }),
]
```

## 创建访问器列

数据列的独特之处在于它们必须配置为从 `data` 数组中的每个项目提取原始值。

有 3 种方法可以做到这一点：

- 如果您的项目是 `objects`，使用与您想要提取的值对应的对象键。
- 如果您的项目是嵌套 `arrays`，使用与您想要提取的值对应的数组索引。
- 使用返回您想要提取的值的访问器函数。

## 对象键

如果您的每个项目都是具有以下形状的对象：

```tsx
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}
```

您可以像这样提取 `firstName` 值：

```tsx

columnHelper.accessor('firstName')

// 或

{
  accessorKey: 'firstName',
}
```

## 数组索引

如果您的每个项目都是具有以下形状的数组：

```tsx
type Sales = [Date, number]
```

您可以像这样提取 `number` 值：

```tsx
columnHelper.accessor(1)

// 或

{
  accessorKey: 1,
}
```

## 访问器函数

如果您的每个项目都是具有以下形状的对象：

```tsx
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}
```

您可以像这样提取计算的全名值：

```tsx
columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
  id: 'fullName',
})

// 或

{
  id: 'fullName',
  accessorFn: row => `${row.firstName} ${row.lastName}`,
}
```

> 🧠 记住，访问的值是用于排序、过滤等的值，所以您需要确保您的访问器函数返回一个可以有意义地操作的原始值。如果您返回一个非原始值，如对象或数组，您将需要适当的过滤/排序/分组函数来操作它们，甚至提供您自己的！😬

## 唯一列 ID

列通过 3 种策略唯一标识：

- 如果使用对象键或数组索引定义访问器列，将使用相同的值来唯一标识列。
  - 对象键中的任何句点（`.`）将被下划线（`_`）替换。
- 如果使用访问器函数定义访问器列
  - 列的 `id` 属性将用于唯一标识列，或者
  - 如果提供了原始 `string` 标题，该标题字符串将用于唯一标识列

> 🧠 一个简单的记忆方法：如果您使用访问器函数定义列，要么提供字符串标题，要么提供唯一的 `id` 属性。

## 列格式化和渲染

默认情况下，列单元格将其数据模型值显示为字符串。您可以通过提供自定义渲染实现来覆盖此行为。每个实现都提供有关单元格、标题或页脚的相关信息，并返回您的框架适配器可以渲染的内容，例如 JSX/组件/字符串等。这将取决于您使用的适配器。

有几个格式化程序可供您使用：

- `cell`：用于格式化单元格。
- `aggregatedCell`：用于在聚合时格式化单元格。
- `header`：用于格式化标题。
- `footer`：用于格式化页脚。

## 单元格格式化

您可以通过向 `cell` 属性传递函数并使用 `props.getValue()` 函数访问单元格值来提供自定义单元格格式化程序：

```tsx
columnHelper.accessor('firstName', {
  cell: props => <span>{props.getValue().toUpperCase()}</span>,
})
```

单元格格式化程序还提供 `row` 和 `table` 对象，允许您自定义单元格格式化，而不仅仅是单元格值。下面的示例提供 `firstName` 作为访问器，但也显示位于原始行对象上的前缀用户 ID：

```tsx
columnHelper.accessor('firstName', {
  cell: props => (
    <span>{`${props.row.original.id} - ${props.getValue()}`}</span>
  ),
})
```

## 聚合单元格格式化

有关聚合单元格的更多信息，请参见[分组](../grouping.md)。

## 标题和页脚格式化

标题和页脚无法访问行数据，但仍使用相同的概念来显示自定义内容。