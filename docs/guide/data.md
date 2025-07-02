---
title: 数据指南
---

## 数据指南

表格从您的数据开始。您的列定义和行将取决于数据的形状。TanStack Table 具有一些 TypeScript 功能，可以帮助您创建其余的表格代码，并获得出色的类型安全体验。如果您正确设置数据和类型，TanStack Table 将能够推断数据的形状，并确保您的列定义正确创建。

### TypeScript

TypeScript 不是使用 TanStack Table 包的必需条件...***但是*** TanStack Table 的编写和组织方式使您获得的出色 TypeScript 体验感觉像是该库的主要卖点之一。如果您不使用 TypeScript，您将错过许多出色的自动完成和类型检查功能，这些功能既能加快您的开发时间，又能减少代码中的错误数量。

#### TypeScript 泛型

对 TypeScript 泛型是什么以及它们如何工作有基本的了解将帮助您更好地理解本指南，但在学习过程中应该很容易掌握。官方的 [TypeScript 泛型文档](https://www.typescriptlang.org/docs/handbook/2/generics.html) 对于那些还不熟悉 TypeScript 的人可能会有所帮助。

### 定义数据类型

`data` 是一个对象数组，将被转换为表格的行。数组中的每个对象代表一行数据（在正常情况下）。如果您使用 TypeScript，我们通常为数据的形状定义一个类型。此类型用作所有其他表格、列、行和单元格实例的泛型类型。此泛型在 TanStack Table 类型和 API 的其余部分中通常称为 `TData`。

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

然后我们可以像这样定义一个 User (TData) 类型：

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

然后我们可以使用此类型定义我们的 `data` 数组，然后 TanStack Table 将能够在我们的列、行、单元格等中智能地推断出许多类型。这是因为 `data` 类型字面上定义为 `TData` 泛型类型。您传递给 `data` 表格选项的任何内容都将成为表格实例其余部分的 `TData` 类型。只需确保您的列定义在稍后定义时使用与 `data` 类型相同的 `TData` 类型。

```ts
//注意：data 需要一个"稳定"的引用以防止无限重新渲染
const data: User[] = []
//或
const [data, setData] = React.useState<User[]>([])
//或
const data = ref<User[]>([]) //vue
//等等...
```

#### 深层键控数据

如果您的数据不是一个很好的扁平对象数组，那也没关系！一旦您开始定义列，就有策略在访问器中访问深度嵌套的数据。

如果您的 `data` 看起来像这样：

```json
[
  {
    "name": {
      "first": "Tanner",
      "last": "Linsley"
    },
    "info": {
      "age": 33,
      "visits": 100,
    }
  },
  {
    "name": {
      "first": "Kevin",
      "last": "Vandy"
    },
    "info": {
      "age": 27,
      "visits": 200,
    }
  }
]
```

您可以定义这样的类型：

```ts
type User = {
  name: {
    first: string
    last: string
  }
  info: {
    age: number
    visits: number
  }
}
```

您将能够在列定义中使用 accessorKey 中的点表示法或简单地使用 accessorFn 来访问数据。

```ts
const columns = [
  {
    header: 'First Name',
    accessorKey: 'name.first',
  },
  {
    header: 'Last Name',
    accessorKey: 'name.last',
  },
  {
    header: 'Age',
    accessorFn: row => row.info.age, 
  },
  //...
]
```

这在[列定义指南](column-defs.md)中有更详细的讨论。

> 注意：您的 json 数据中的"键"通常可以是任何内容，但键中的任何句点都将被解释为深层键并将导致错误。

#### 嵌套子行数据

如果您使用展开功能，在数据中拥有嵌套子行是很常见的。这导致了一个稍有不同的递归类型。

所以如果您的数据看起来像这样：

```json
[
  {
    "firstName": "Tanner",
    "lastName": "Linsley",
    "subRows": [
      {
        "firstName": "Kevin",
        "lastName": "Vandy",
      },
      {
        "firstName": "John",
        "lastName": "Doe",
        "subRows": [
          //...
        ]
      }
    ]
  },
  {
    "firstName": "Jane",
    "lastName": "Doe",
  }
]
```

您可以定义这样的类型：

```ts
type User = {
  firstName: string
  lastName: string
  subRows?: User[] //不必称为"subRows"，可以称为任何名称
}
```

其中 `subRows` 是 `User` 对象的可选数组。这在[展开指南](expanding.md)中有更详细的讨论。

### 给数据一个"稳定"的引用

您传递给表格实例的 `data` 数组***必须***具有"稳定"的引用，以防止导致无限重新渲染的错误（特别是在 React 中）。

这将取决于您使用的框架适配器，但在 React 中，您应该经常使用 `React.useState`、`React.useMemo` 或类似的方法来确保 `data` 和 `columns` 表格选项都具有稳定的引用。

```tsx
const fallbackData = []

export default function MyComponent() {
  //✅ 好：这不会导致无限重新渲染循环，因为 `columns` 是一个稳定的引用
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ 好：这不会导致无限重新渲染循环，因为 `data` 是一个稳定的引用
  const [data, setData] = useState(() => [
    // ...
  ]);

  // 列和数据在稳定引用中定义，不会导致无限循环！
  const table = useReactTable({
    columns,
    data ?? fallbackData, //使用在组件外部定义的后备数组也很好（稳定引用）
  });

  return <table>...</table>;
}
```

`React.useState` 和 `React.useMemo` 不是给数据稳定引用的唯一方法。您还可以在组件外部定义数据或使用第三方状态管理库，如 Redux、Zustand 或 TanStack Query。

要避免的主要事情是在与 `useReactTable` 调用相同的作用域内定义 `data` 数组。这将导致 `data` 数组在每次渲染时重新定义，这将导致无限重新渲染循环。

```tsx
export default function MyComponent() {
  //😵 坏：这将导致无限重新渲染循环，因为 `columns` 在每次渲染时都被重新定义为新数组！
  const columns = [
    // ...
  ];

  //😵 坏：这将导致无限重新渲染循环，因为 `data` 在每次渲染时都被重新定义为新数组！
  const data = [
    // ...
  ];

  //❌ 列和数据在与 `useReactTable` 相同的作用域中定义，没有稳定的引用，将导致无限循环！
  const table = useReactTable({
    columns,
    data ?? [], //❌ 也不好，因为后备数组在每次渲染时都会重新创建
  });

  return <table>...</table>;
}
```

### TanStack Table 如何转换数据

稍后，在这些文档的其他部分中，您将看到 TanStack Table 如何处理您传递给表格的 `data` 并生成用于创建表格的行和单元格对象。您传递给表格的 `data` 永远不会被 TanStack Table 改变，但行和单元格中的实际值可能会被列定义中的访问器或由[行模型](row-models.md)执行的其他功能（如分组或聚合）转换。

### TanStack Table 可以处理多少数据？

信不信由你，TanStack Table 实际上是为了扩展以处理客户端中潜在的数十万行数据而构建的。这显然并不总是可能的，这取决于每列数据的大小和列数。但是，排序、过滤、分页和分组功能都是为大型数据集的性能而构建的。

构建数据网格的开发人员的默认思维模式是为大型数据集实现服务器端分页、排序和过滤。这通常仍然是一个好主意，但许多开发人员低估了现代浏览器和正确优化实际上可以在客户端处理多少数据。如果您的表格永远不会有超过几千行，您可能可以利用 TanStack Table 中的客户端功能，而不是在服务器上自己实现它们。当然，在承诺让 TanStack Table 的客户端功能处理您的大型数据集之前，您应该使用实际数据进行测试，看看它是否能够满足您的需求。

这在[分页指南](pagination.md#should-you-use-client-side-pagination)中有更详细的讨论。