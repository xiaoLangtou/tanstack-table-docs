---
title: 表格状态
---

## 表格状态（Table State）

TanStack Table 有一个简单的底层内部状态管理系统，可以自动管理表格的状态，也可以被覆盖和控制。

## 访问表格状态

您可以通过 `table.getState()` API 访问表格的任何状态：

```ts
const state = table.getState()
// {
//   columnFilters: [],
//   columnOrder: [],
//   columnPinning: {},
//   columnSizing: {},
//   columnSizingInfo: { startOffset: null, startSize: null, deltaOffset: null, deltaPercentage: null, isResizingColumn: false, columnSizingStart: [] },
//   columnVisibility: {},
//   expanded: {},
//   globalFilter: undefined,
//   grouping: [],
//   pagination: { pageIndex: 0, pageSize: 10 },
//   rowPinning: { top: [], bottom: [] },
//   rowSelection: {},
//   sorting: [],
// }
```

## 自定义初始状态

如果您想设置表格的初始状态，可以在表格选项中传递一个 `initialState` 对象：

```ts
const table = createAngularTable(() => ({
  data: this.data(),
  columns: this.columns(),
  getCoreRowModel: getCoreRowModel(),
  initialState: {
    pagination: {
      pageSize: 20,
    },
    columnVisibility: {
      id: false,
    },
  },
}))
```

## 受控状态

如果您想控制表格的部分或全部状态，可以在表格选项中传递一个 `state` 对象和相应的 `on[State]Change` 回调函数：

### 单独受控状态

您可以控制表格状态的任何部分，而让其余部分由表格内部管理：

```ts
export class AppComponent {
  sorting = signal<SortingState>([])

  table = createAngularTable(() => ({
    data: this.data(),
    columns: this.columns(),
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting: this.sorting(),
    },
    onSortingChange: (updaterOrValue) => {
      this.sorting.set(
        typeof updaterOrValue === 'function'
          ? updaterOrValue(this.sorting())
          : updaterOrValue
      )
    },
  }))
}
```

### 完全受控状态

或者，您可以控制表格的整个状态：

```ts
export class AppComponent {
  state = signal<TableState>({
    columnFilters: [],
    columnOrder: [],
    columnPinning: {},
    columnSizing: {},
    columnSizingInfo: {
      startOffset: null,
      startSize: null,
      deltaOffset: null,
      deltaPercentage: null,
      isResizingColumn: false,
      columnSizingStart: [],
    },
    columnVisibility: {},
    expanded: {},
    globalFilter: undefined,
    grouping: [],
    pagination: { pageIndex: 0, pageSize: 10 },
    rowPinning: { top: [], bottom: [] },
    rowSelection: {},
    sorting: [],
  })

  table = createAngularTable(() => ({
    data: this.data(),
    columns: this.columns(),
    getCoreRowModel: getCoreRowModel(),
    state: this.state(),
    onStateChange: (updaterOrValue) => {
      this.state.set(
        typeof updaterOrValue === 'function'
          ? updaterOrValue(this.state())
          : updaterOrValue
      )
    },
  }))
}
```

## 状态变更回调

当您提供一个 `on[State]Change` 回调函数时，您**必须**也提供相应的 `state` 值。这是因为一旦您选择控制状态，表格就会将该状态的控制权交给您。

每个状态变更回调都会被调用，并传入一个 `updater` 函数或一个直接值。如果传入的是一个 `updater` 函数，您必须调用它并传入之前的值以获取新值。如果传入的是一个直接值，您可以直接使用它。

```ts
// 给定这个状态变更回调：
onSortingChange: (updaterOrValue) => {
  this.sorting.set(
    typeof updaterOrValue === 'function'
      ? updaterOrValue(this.sorting()) // 调用更新器函数并传入之前的值
      : updaterOrValue // 或者直接使用值
  )
},
```

## 状态类型

所有复杂的状态都有相应的 TypeScript 类型，您可以导入并使用：

```ts
import type {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  GroupingState,
  PaginationState,
  RowPinningState,
  RowSelectionState,
  SortingState,
  TableState,
  VisibilityState,
} from '@tanstack/angular-table'
```