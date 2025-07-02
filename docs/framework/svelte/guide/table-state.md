---
title: 表格状态 (Svelte) 指南
---

## 表格状态 (Svelte) 指南

TanStack Table 有一个简单的底层内部状态管理系统来存储和管理表格的状态。它还允许你选择性地提取任何需要在自己的状态管理中管理的状态。本指南将引导你了解与表格状态交互和管理的不同方式。

### 访问表格状态

你不需要设置任何特殊的东西来使表格状态工作。如果你没有向 `state`、`initialState` 或任何 `on[State]Change` 表格选项传入任何内容，表格将在内部管理自己的状态。你可以使用 `table.getState()` 表格实例 API 访问这个内部状态的任何部分。

```jsx
const options = writable({
  columns,
  data,
  //...
})

const table = createSvelteTable(options)

console.log(table.getState()) //访问整个内部状态
console.log(table.getState().rowSelection) //只访问行选择状态
```

### 自定义初始状态

如果你对某些状态只需要自定义它们的初始默认值，你仍然不需要自己管理任何状态。你可以简单地在表格实例的 `initialState` 选项中设置值。

```jsx
const options = writable({
  columns,
  data,
  initialState: {
    columnOrder: ['age', 'firstName', 'lastName'], //自定义初始列顺序
    columnVisibility: {
      id: false //默认隐藏 id 列
    },
    expanded: true, //默认展开所有行
    sorting: [
      {
        id: 'age',
        desc: true //默认按年龄降序排序
      }
    ]
  },
  //...
})

const table = createSvelteTable(options)
```

> **注意**：只在 `initialState` 或 `state` 中指定每个特定状态，但不要同时指定。如果你同时向 `initialState` 和 `state` 传入特定的状态值，`state` 中的初始化状态将覆盖 `initialState` 中的任何对应值。

### 受控状态

如果你需要在应用程序的其他区域轻松访问表格状态，TanStack Table 使得在你自己的状态管理系统中控制和管理任何或所有表格状态变得容易。你可以通过向 `state` 和 `on[State]Change` 表格选项传入你自己的状态和状态管理函数来实现这一点。

#### 单独受控状态

你可以只控制你需要轻松访问的状态。如果你不需要，你不必控制所有的表格状态。建议根据具体情况只控制你需要的状态。

为了控制特定状态，你需要同时向表格实例传入对应的 `state` 值和 `on[State]Change` 函数。

让我们以在"手动"服务器端数据获取场景中的过滤、排序和分页为例。你可以在自己的状态管理中存储过滤、排序和分页状态，但如果你的 API 不关心这些值，可以省略任何其他状态，如列顺序、列可见性等。

```ts
let sorting = [
  {
    id: 'age',
    desc: true, //默认按年龄降序排序
  },
]
const setSorting = updater => {
  if (updater instanceof Function) {
    sorting = updater(sorting)
  } else {
    sorting = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      sorting,
    },
  }))
}

let columnFilters = [] //没有默认过滤器
const setColumnFilters = updater => {
  if (updater instanceof Function) {
    columnFilters = updater(columnFilters)
  } else {
    columnFilters = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      columnFilters,
    },
  }))
}

let pagination = { pageIndex: 0, pageSize: 15 } //默认分页
const setPagination = updater => {
  if (updater instanceof Function) {
    pagination = updater(pagination)
  } else {
    pagination = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      pagination,
    },
  }))
}

//使用我们的受控状态值来获取数据
const tableQuery = createQuery({
  queryKey: ['users', columnFilters, sorting, pagination],
  queryFn: () => fetchUsers(columnFilters, sorting, pagination),
  //...
})

const options = writable({
  columns,
  data: tableQuery.data,
  //...
  state: {
    columnFilters, //将受控状态传回表格（覆盖内部状态）
    sorting,
    pagination
  },
  onColumnFiltersChange: setColumnFilters, //将 columnFilters 状态提升到我们自己的状态管理中
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
})

const table = createSvelteTable(options)
//...
```

#### 完全受控状态

或者，你可以使用 `onStateChange` 表格选项控制整个表格状态。它将把整个表格状态提升到你自己的状态管理系统中。要小心这种方法，因为你可能会发现将一些频繁变化的状态值（如 `columnSizingInfo` 状态）提升到 svelte 树中可能会导致性能问题。

可能需要一些额外的技巧来使这个工作。如果你使用 `onStateChange` 表格选项，`state` 的初始值必须填充所有你想要使用的功能的相关状态值。你可以手动输入所有初始状态值，或者以特殊方式使用 `table.setOptions` API，如下所示。

```jsx
//创建一个具有默认状态值的表格实例
const options = writable({
  columns,
  data,
  //... 注意：`state` 值尚未传入
})
const table = createSvelteTable(options)

let state = {
  ...table.initialState, //用表格实例的所有默认状态值填充初始状态
  pagination: {
    pageIndex: 0,
    pageSize: 15 //可选择性地自定义初始分页状态。
  }
}
const setState = updater => {
  if (updater instanceof Function) {
    state = updater(state)
  } else {
    state = updater
  }
  options.update(old => ({
    ...old,
    state,
  }))
}

//使用 table.setOptions API 将我们完全受控的状态合并到表格实例上
table.setOptions(prev => ({
  ...prev, //保留我们在上面设置的任何其他选项
  state, //我们完全受控的状态覆盖内部状态
  onStateChange: setState //任何状态变化都将推送到我们自己的状态管理中
}))
```

### 状态变更回调

到目前为止，我们已经看到 `on[State]Change` 和 `onStateChange` 表格选项如何将表格状态变化"提升"到我们自己的状态管理中。但是，关于使用这些选项，你应该了解一些事情。

#### 1. **状态变更回调必须在 `state` 选项中有其对应的状态值**。

指定 `on[State]Change` 回调告诉表格实例这将是一个受控状态。如果你不指定对应的 `state` 值，该状态将被"冻结"在其初始值。

```ts
let sorting = []
const setSorting = updater => {
  if (updater instanceof Function) {
    sorting = updater(sorting)
  } else {
    sorting = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      sorting,
    },
  }))
}
//...
const options = writable({
  columns,
  data,
  //...
  state: {
    sorting, //必需，因为我们使用 `onSortingChange`
  },
  onSortingChange: setSorting, //使 `state.sorting` 受控
})
const table = createSvelteTable(options)
```

#### 2. **更新器可以是原始值或回调函数**。

`on[State]Change` 和 `onStateChange` 回调的工作方式与 React 中的 `setState` 函数完全相同。更新器值可以是新的状态值或接受先前状态值并返回新状态值的回调函数。

这有什么含义？这意味着如果你想在任何 `on[State]Change` 回调中添加一些额外的逻辑，你可以这样做，但你需要检查新的传入更新器值是函数还是值。

这就是为什么你在上面的示例中看到 `if (updater instanceof Function)` 检查的原因。

### 状态类型

TanStack Table 中的所有复杂状态都有自己的 TypeScript 类型，你可以导入和使用。这对于确保你为正在控制的状态值使用正确的数据结构和属性很有用。

```ts
import { createSvelteTable, type SortingState, type Updater } from '@tanstack/svelte-table'
//...
let sorting: SortingState[] = [
  {
    id: 'age', //你应该为 `id` 和 `desc` 属性获得自动完成
    desc: true,
  }
]
const setSorting = (updater: Updater<SortingState>)  => {
  if (updater instanceof Function) {
    sorting = updater(sorting)
  } else {
    sorting = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      sorting,
    },
  }))
}
```