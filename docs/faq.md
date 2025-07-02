---
title: 常见问题
---

## 如何停止无限渲染循环？

如果您使用 React，有一个非常常见的陷阱可能导致无限渲染。如果您未能为 `columns`、`data` 或 `state` 提供稳定的引用，React 将在表格状态发生任何变化时进入无限重新渲染循环。

为什么会发生这种情况？这是 TanStack Table 的错误吗？**不是**，这不是错误。*这是 React 工作的基本方式*，正确管理您的列、数据和状态将防止这种情况发生。

TanStack Table 被设计为在传递给表格的 `data` 或 `columns` 发生变化时，或者在表格的任何状态发生变化时触发重新渲染。

> 未能为 `columns` 或 `data` 提供稳定引用可能导致无限重新渲染循环。

### 陷阱 1：在每次渲染时创建新的列或数据

```js
export default function MyComponent() {
  //😵 错误：这将导致无限重新渲染循环，因为 `columns` 在每次渲染时都被重新定义为新数组！
  const columns = [
    // ...
  ];

  //😵 错误：这将导致无限重新渲染循环，因为 `data` 在每次渲染时都被重新定义为新数组！
  const data = [
    // ...
  ];

  //❌ 列和数据在与 `useReactTable` 相同的作用域中定义，没有稳定的引用，将导致无限循环！
  const table = useReactTable({
    columns,
    data,
  });

  return <table>...</table>;
}
```

### 解决方案 1：使用 useMemo 或 useState 的稳定引用

在 React 中，您可以通过在组件外部/上方定义变量，或使用 `useMemo` 或 `useState`，或使用第三方状态管理库（如 Redux 或 React Query 😉）来为变量提供"稳定"引用

```js
//✅ 正确：在组件外部定义列
const columns = [
  // ...
];

//✅ 正确：在组件外部定义数据
const data = [
  // ...
];

// 通常在组件内部定义列和数据更实用，所以使用 `useMemo` 或 `useState` 为它们提供稳定引用
export default function MyComponent() {
  //✅ 好：这不会导致无限重新渲染循环，因为 `columns` 是稳定引用
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ 好：这不会导致无限重新渲染循环，因为 `data` 是稳定引用
  const [data, setData] = useState(() => [
    // ...
  ]);

  // 列和数据定义在稳定引用中，不会导致无限循环！
  const table = useReactTable({
    columns,
    data,
  });

  return <table>...</table>;
}
```

### 陷阱 2：就地修改列或数据

即使您为初始的 `columns` 和 `data` 提供了稳定引用，如果您就地修改它们，仍然可能遇到无限循环。这是一个常见的陷阱，您可能一开始不会注意到自己在这样做。像内联 `data.filter()` 这样简单的操作，如果不小心，也可能导致无限循环。

```js
export default function MyComponent() {
  //✅ 好
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ 好（React Query 自动为数据提供稳定引用）
  const { data, isLoading } = useQuery({
    //...
  });

  const table = useReactTable({
    columns,
    //❌ 错误：这将导致无限重新渲染循环，因为 `data` 被就地修改（破坏了稳定引用）
    data: data?.filter(d => d.isActive) ?? [],
  });

  return <table>...</table>;
}
```

### 解决方案 2：记忆化您的数据转换

为了防止无限循环，您应该始终记忆化您的数据转换。这可以通过 `useMemo` 或类似方法来完成。

```js
export default function MyComponent() {
  //✅ 好
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ 好
  const { data, isLoading } = useQuery({
    //...
  });

  //✅ 好：这不会导致无限重新渲染循环，因为 `filteredData` 被记忆化了
  const filteredData = useMemo(() => data?.filter(d => d.isActive) ?? [], [data]);

  const table = useReactTable({
    columns,
    data: filteredData, // 稳定引用！
  });

  return <table>...</table>;
}
```

### React Forget

当 React Forget 发布时，这些问题可能会成为过去。或者直接使用 Solid.js... 🤓

## 如何阻止我的表格状态在数据变化时自动重置？

大多数插件使用的状态在数据源变化时_应该_正常重置，但有时如果您在外部筛选数据，或在查看数据时不可变地编辑数据，或者简单地对数据进行任何外部操作而不希望触发表格状态的某个部分自动重置，您需要抑制这种情况的发生。

对于这些情况，每个插件都提供了一种方法来禁用状态在数据或状态片段的其他依赖项发生变化时自动内部重置。通过将其中任何一个设置为 `false`，您可以阻止触发自动重置。

这是一个基于 React 的示例，在我们编辑表格的 `data` 源时，基本上阻止每个状态片段像通常那样发生变化：

```js
const [data, setData] = React.useState([])
const skipPageResetRef = React.useRef()

const updateData = newData => {
  // 当使用此函数更新数据时，设置一个标志
  // 来禁用所有自动重置
  skipPageResetRef.current = true

  setData(newData)
}

React.useEffect(() => {
  // 表格更新后，始终移除标志
  skipPageResetRef.current = false
})

useReactTable({
  ...
  autoResetPageIndex: !skipPageResetRef.current,
  autoResetExpanded: !skipPageResetRef.current,
})
```

现在，当我们更新数据时，上述表格状态将不会自动重置！