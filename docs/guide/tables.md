---
title: 表格实例指南
---

## API

[表格 API](../api/core/table.md)

## 表格实例指南

TanStack Table 是一个 headless UI 库。当我们谈论 `table` 或"表格实例"时，我们不是在谈论字面意义上的 `<table>` 元素。相反，我们指的是包含表格状态和 API 的核心表格对象。`table` 实例是通过调用您的适配器的 `createTable` 函数（例如 `useReactTable`、`createSolidTable`、`createSvelteTable`、`useQwikTable`、`useVueTable`）创建的。

### 创建表格实例

要创建表格实例，需要 2 个 `options`：`columns` 和 `data`。还有数十个其他表格选项来配置功能和行为，但这 2 个是必需的。

#### 定义数据

`data` 是一个对象数组，将被转换为表格的行。数组中的每个对象代表一行数据（在正常情况下）。如果您使用 TypeScript，我们通常为数据的形状定义一个类型。这个类型被用作所有其他表格、列、行和单元格实例的泛型类型。这个类型通常被称为 `TData`。

例如，如果我们有一个显示用户列表的表格，数组如下所示：

```json
[
  {
    "firstName": "Tanner",
    "lastName": "Linsley",
    "age": 33,
    "visits": 100,
    "progress": 50,
    "status": "Married"
  },
  {
    "firstName": "Kevin",
    "lastName": "Vandy",
    "age": 27,
    "visits": 200,
    "progress": 100,
    "status": "Single"
  }
]
```

然后我们可以定义一个 User (TData) 类型，如下所示：

```ts
//TData
type User = {
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: string
}
```

然后我们可以用这个类型定义我们的 `data` 数组，然后 TanStack Table 将能够在我们后续的列、行、单元格等中智能地推断出许多类型。

```ts
//注意：data 需要一个"稳定"的引用以防止无限重新渲染
const data: User[] = []
//或
const [data, setData] = React.useState<User[]>([])
//或
const data = ref<User[]>([])
//等等...
```

> 注意：`data` 需要一个"稳定"的引用（特别是在 React 中）以防止无限重新渲染。这就是为什么我们建议使用 `React.useState` 或 `React.useMemo`，或在创建表格实例的同一个 react 组件之外定义您的数据，或使用像 TanStack Query 这样的库来管理您的数据状态。

#### 定义列

列定义在下一节的[列定义指南](../column-defs.md)中有详细介绍。但是，我们在这里要注意的是，当您定义列的类型时，您应该使用与数据相同的 `TData` 类型。

```ts
const columns: ColumnDef<User>[] = [] //将 User 类型作为泛型 TData 类型传递
//或
const columnHelper = createColumnHelper<User>() //将 User 类型作为泛型 TData 类型传递
```

列定义是我们告诉 TanStack Table 每列应该如何通过 `accessorKey` 或 `accessorFn` 访问和/或转换行数据的地方。有关更多信息，请参阅[列定义指南](../column-defs.md)。

#### 创建表格实例

定义了我们的 `columns` 和 `data` 后，我们现在可以创建我们的基本表格实例。

```ts
//vanilla js
const table = createTable({ columns, data })

//react
const table = useReactTable({ columns, data })

//solid
const table = createSolidTable({ columns, data })

//svelte
const table = createSvelteTable({ columns, data })

//vue
const table = useVueTable({ columns, data })
```

那么 `table` 实例中有什么呢？让我们看看我们可以与表格实例进行哪些交互。

### 表格状态

表格实例包含所有表格状态，可以通过 `table.getState()` API 访问。每个表格功能在表格状态中注册各种状态。例如，行选择功能注册 `rowSelection` 状态，分页功能注册 `pagination` 状态等。

每个功能还将在表格实例上有相应的状态设置器 API 和状态重置器 API。例如，行选择功能将有一个 `setRowSelection` API 和一个 `resetRowSelection`。

```ts
table.getState().rowSelection //读取行选择状态
table.setRowSelection((old) => ({...old})) //设置行选择状态
table.resetRowSelection() //重置行选择状态
```

### 表格 API

每个功能创建了数十个表格 API 来帮助您以不同方式读取或修改表格状态。

核心表格实例和所有其他功能 API 的 API 参考文档可以在整个 API 文档中找到。

例如，您可以在这里找到核心表格实例 API 文档：[表格 API](../api/core/table#table-api)

### 表格行模型

有一组特殊的表格实例 API 用于从表格实例中读取行，称为行模型。TanStack Table 具有高级功能，其中生成的行可能与您最初传入的 `data` 数组非常不同。要了解更多关于您可以作为表格选项传入的不同行模型，请参阅[行模型指南](../row-models.md)。