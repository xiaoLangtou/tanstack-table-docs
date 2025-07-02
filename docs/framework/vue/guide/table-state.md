---
title: 表格状态 (Vue) 指南
---

## 表格状态 (Vue) 指南

TanStack Table 有一个简单的底层内部状态管理系统来存储和管理表格的状态。它还允许你选择性地提取任何需要在自己的状态管理中管理的状态。本指南将引导你了解与表格状态交互和管理的不同方式。

### 访问表格状态

你不需要设置任何特殊的东西来使表格状态工作。如果你没有向 `state`、`initialState` 或任何 `on[State]Change` 表格选项传入任何内容，表格将在内部管理自己的状态。你可以使用 `table.getState()` 表格实例 API 访问这个内部状态的任何部分。

```ts
const table = useVueTable({
  columns,
  data: dataRef, // 响应式数据支持
  //...
})

console.log(table.getState()) //访问整个内部状态
console.log(table.getState().rowSelection) //只访问行选择状态
```

### 使用响应式数据

> **v8.20.0 中的新功能**

`useVueTable` hook 现在支持响应式数据。这意味着你可以将包含数据的 Vue `ref` 或 `computed` 传递给 `data` 选项。表格将自动响应数据的变化。

```ts
const columns = [
  { accessor: 'id', Header: 'ID' },
  { accessor: 'name', Header: 'Name' }
]

const dataRef = ref([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
])

const table = useVueTable({
  columns,
  data: dataRef, // 传递响应式数据 ref
})

// 稍后，更新 dataRef 将自动更新表格
dataRef.value = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Doe' }
]
```

> ⚠️ 出于性能原因，底层使用了 `shallowRef`，这意味着数据不是深度响应式的，只有 `.value` 是响应式的。要更新数据，你必须直接修改数据。

```ts
const dataRef = ref([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
])

// 这不会更新表格 ❌
dataRef.value.push({ id: 4, name: 'John' })

// 这会更新表格 ✅
dataRef.value = [
  ...dataRef.value,
  { id: 4, name: 'John' }
]
```

### 自定义初始状态

如果你对某些状态只需要自定义它们的初始默认值，你仍然不需要自己管理任何状态。你可以简单地在表格实例的 `initialState` 选项中设置值。

```jsx
const table = useVueTable({
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
```

> **注意**：只在 `initialState` 或 `state` 中指定每个特定状态，但不要同时指定。如果你同时向 `initialState` 和 `state` 传入特定的状态值，`state` 中的初始化状态将覆盖 `initialState` 中的任何对应值。

### 受控状态

如果你需要在应用程序的其他区域轻松访问表格状态，TanStack Table 使得在你自己的状态管理系统中控制和管理任何或所有表格状态变得容易。你可以通过向 `state` 和 `on[State]Change` 表格选项传入你自己的状态和状态管理函数来实现这一点。

#### 单独受控状态

你可以只控制你需要轻松访问的状态。如果你不需要，你不必控制所有的表格状态。建议根据具体情况只控制你需要的状态。

为了控制特定状态，你需要同时向表格实例传入对应的 `state` 值和 `on[State]Change` 函数。

让我们以在"手动"服务器端数据获取场景中的过滤、排序和分页为例。你可以在自己的状态管理中存储过滤、排序和分页状态，但如果你的 API 不关心这些值，可以省略任何其他状态，如列顺序、列可见性等。

```ts
const columnFilters = ref([]) //没有默认过滤器
const sorting = ref([{
  id: 'age',
  desc: true, //默认按年龄降序排序
}])
const pagination = ref({ pageIndex: 0, pageSize: 15 }

//使用我们的受控状态值来获取数据
const tableQuery = useQuery({
  queryKey: ['users', columnFilters, sorting, pagination],
  queryFn: () => fetchUsers(columnFilters, sorting, pagination),
  //...
})

const table = useVueTable({
  columns,
  data: tableQuery.data,
  //...
  state: {
    get columnFilters() {
      return columnFilters.value
    },
    get sorting() {
      return sorting.value
    },
    get pagination() {
      return pagination.value
    }
  },
  onColumnFiltersChange: updater => {
    columnFilters.value =
      updater instanceof Function
        ? updater(columnFilters.value)
        : updater
  },
  onSortingChange: updater => {
    sorting.value =
      updater instanceof Function
        ? updater(sorting.value)
        : updater
  },
  onPaginationChange: updater => {
    pagination.value =
      updater instanceof Function
        ? updater(pagination.value)
        : updater
  },
})
//...
```

#### 完全受控状态

或者，你可以使用 `onStateChange` 表格选项控制整个表格状态。它将把整个表格状态提升到你自己的状态管理系统中。要小心这种方法，因为你可能会发现将一些频繁变化的状态值（如 `columnSizingInfo` 状态）提升到 react 树中可能会导致性能问题。

可能需要一些额外的技巧来使这个工作。如果你使用 `onStateChange` 表格选项，`state` 的初始值必须填充所有你想要使用的功能的相关状态值。你可以手动输入所有初始状态值，或者以特殊方式使用 `table.setOptions` API，如下所示。

```jsx
//创建一个具有默认状态值的表格实例
const table = useVueTable({
  get columns() {
    return columns.value
  },
  data,
  //... 注意：`state` 值尚未传入
})

const state = ref({
  ...table.initialState,
  pagination: {
    pageIndex: 0,
    pageSize: 15
  }
})
const setState = updater => {
  state.value = updater instanceof Function ? updater(state.value) : updater
}

//使用 table.setOptions API 将我们完全受控的状态合并到表格实例上
table.setOptions(prev => ({
  ...prev, //保留我们在上面设置的任何其他选项
  get state() {
    return state.value
  },
  onStateChange: setState //任何状态变化都将推送到我们自己的状态管理中
}))
```

### 状态变更回调

到目前为止，我们已经看到 `on[State]Change` 和 `onStateChange` 表格选项如何将表格状态变化"提升"到我们自己的状态管理中。但是，关于使用这些选项，你应该了解一些事情。

#### 1. **状态变更回调必须在 `state` 选项中有其对应的状态值**。

指定 `on[State]Change` 回调告诉表格实例这将是一个受控状态。如果你不指定对应的 `state` 值，该状态将被"冻结"在其初始值。

```jsx
const sorting = ref([])
const setSorting = updater => {
  sorting.value = updater instanceof Function ? updater(sorting.value) : updater
}
//...
const table = useVueTable({
  columns,
  data,
  //...
  state: {
    get sorting() {
      return sorting //必需，因为我们使用 `onSortingChange`
    },
  },
  onSortingChange: setSorting, //使 `state.sorting` 受控
})
```

#### 2. **更新器可以是原始值或回调函数**。

`on[State]Change` 和 `onStateChange` 回调的工作方式与 React 中的 `setState` 函数完全相同。更新器值可以是新的状态值或接受先前状态值并返回新状态值的回调函数。

这有什么含义？这意味着如果你想在任何 `on[State]Change` 回调中添加一些额外的逻辑，你可以这样做，但你需要检查新的传入更新器值是函数还是值。

这就是为什么我们在上面的 `setState` 函数中有 `updater instanceof Function` 检查的原因。这个检查允许我们在同一个函数中处理原始值和回调函数。

### 状态类型

TanStack Table 中的所有复杂状态都有自己的 TypeScript 类型，你可以导入和使用。这对于确保你为正在控制的状态值使用正确的数据结构和属性很有用。

```tsx
import { useVueTable, type SortingState } from '@tanstack/vue-table'
//...
const sorting = ref<SortingState[]>([
  {
    id: 'age', //你应该为 `id` 和 `desc` 属性获得自动完成
    desc: true,
  }
])
```