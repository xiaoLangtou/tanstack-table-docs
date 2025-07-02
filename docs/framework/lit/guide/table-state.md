---
title: 表格状态（Lit）指南
---

## 表格状态（Lit）指南

TanStack Table 有一个简单的底层内部状态管理系统来存储和管理表格的状态。它还允许您选择性地提取任何需要在自己的状态管理中管理的状态。本指南将引导您了解与表格状态交互和管理的不同方式。

### 访问表格状态

您无需设置任何特殊内容即可使表格状态正常工作。如果您没有向 `state`、`initialState` 或任何 `on[State]Change` 表格选项传入任何内容，表格将在内部管理自己的状态。您可以使用 `table.getState()` 表格实例 API 访问此内部状态的任何部分。

```ts
private tableController = new TableController<Person>(this);

render() {
  const table = this.tableController.table({
    columns,
    data,
    ...
  })

  console.log(table.getState()) //访问整个内部状态
  console.log(table.getState().rowSelection) //仅访问行选择状态
  // ...
}
```

### 自定义初始状态

如果您只需要为某些状态自定义其初始默认值，您仍然不需要自己管理任何状态。您可以简单地在表格实例的 `initialState` 选项中设置值。

```ts
render() {
  const table = this.tableController.table({
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
  })

  return html`...`;
}
```

> **注意**：只在 `initialState` 或 `state` 中指定每个特定状态，但不要同时指定两者。如果您将特定状态值同时传递给 `initialState` 和 `state`，`state` 中的初始化状态将覆盖 `initialState` 中的任何相应值。

### 受控状态

如果您需要在应用程序的其他区域轻松访问表格状态，TanStack Table 使您可以轻松地在自己的状态管理系统中控制和管理任何或所有表格状态。您可以通过将自己的状态和状态管理函数传递给 `state` 和 `on[State]Change` 表格选项来实现这一点。

#### 单独受控状态

您可以只控制需要轻松访问的状态。如果不需要，您不必控制所有表格状态。建议根据具体情况只控制您需要的状态。

为了控制特定状态，您需要同时向表格实例传递相应的 `state` 值和 `on[State]Change` 函数。

让我们以在 "手动" 服务器端数据获取场景中的过滤、排序和分页为例。您可以在自己的状态管理中存储过滤、排序和分页状态，但如果您的 API 不关心这些值，则可以省略任何其他状态，如列顺序、列可见性等。

```jsx
import {html} from "lit";

@customElement('my-component')
class MyComponent extends LitElement {
  @state()
  private _sorting: SortingState = []

  render() {
    const table = this.tableController.table({
      columns,
      data,
      state: {
        sorting: this._sorting,
      },
      onSortingChange: updaterOrValue => {
        if (typeof updaterOrValue === 'function') {
          this._sorting = updaterOrValue(this._sorting)
        } else {
          this._sorting = updaterOrValue
        }
      },
      getSortedRowModel: getSortedRowModel(),
      getCoreRowModel: getCoreRowModel(),
    })

    return html`...`
  }
}
//...
```

#### 完全受控状态

或者，您可以使用 `onStateChange` 表格选项控制整个表格状态。它将把整个表格状态提升到您自己的状态管理系统中。请谨慎使用这种方法，因为您可能会发现将一些频繁变化的状态值（如 `columnSizingInfo` 状态）提升到组件树上可能会导致严重的性能问题。

可能需要一些额外的技巧来使其工作。如果您使用 `onStateChange` 表格选项，`state` 的初始值必须填充您想要使用的所有功能的所有相关状态值。您可以手动输入所有初始状态值，或者以特殊方式使用 `table.setOptions` API，如下所示。

```ts

private tableController = new TableController<Person>(this);

@state()
private _tableState;

render() {
  const table = this.tableController.table({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })
  const state = { ...table.initialState, ...this._tableState };
  table.setOptions(prev => ({
    ...prev,
    state,
    onStateChange: updater => {
      this._tableState =
        updater instanceof Function ? updater(state) : updater //任何状态变化都将被推送到我们自己的状态管理中
    },
  }))

  return html`...`;
}
```

### 状态变更回调

到目前为止，我们已经看到 `on[State]Change` 和 `onStateChange` 表格选项如何将表格状态变化 "提升" 到我们自己的状态管理中。但是，关于使用这些选项，您应该了解一些事情。

#### 1. **状态变更回调必须在 `state` 选项中有其对应的状态值**。

指定 `on[State]Change` 回调告诉表格实例这将是一个受控状态。如果您不指定相应的 `state` 值，该状态将被 "冻结" 为其初始值。

```jsx
@state()
private _sorting = [];
//...
render() {
  const table = this.tableController.table({
    columns,
    data,
    state: {
      sorting: this._sorting,
    },
    onSortingChange: updaterOrValue => {
      if (typeof updaterOrValue === 'function') {
        this._sorting = updaterOrValue(this._sorting)
      } else {
        this._sorting = updaterOrValue
      }
    },
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  })

  return html`...`;
}
```

#### 2. **更新器可以是原始值或回调函数**。

`on[State]Change` 和 `onStateChange` 回调的工作方式与 React 中的 `setState` 函数完全相同。更新器值可以是新的状态值或接受先前状态值并返回新状态值的回调函数。

这有什么含义？这意味着如果您想在任何 `on[State]Change` 回调中添加一些额外的逻辑，您可以这样做，但您需要检查新传入的更新器值是函数还是值。

这就是为什么您会在上面的示例中看到 `updater instanceof Function ? updater(state.value) : updater` 模式。此模式检查更新器是否为函数，如果是，则使用先前的状态值调用该函数以获取新的状态值。

### 状态类型

TanStack Table 中的所有复杂状态都有自己的 TypeScript 类型，您可以导入和使用。这对于确保您为正在控制的状态值使用正确的数据结构和属性非常有用。

```tsx
import { TableController, type SortingState } from '@tanstack/lit-table'
//...
@state()
private _sorting: SortingState = [
  {
    id: 'age', //您应该获得 `id` 和 `desc` 属性的自动完成
    desc: true,
  }
]
```