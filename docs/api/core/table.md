---
title: 表格 API
---

## `useReactTable` / `createSolidTable` / `useQwikTable` / `useVueTable` / `createSvelteTable`

```tsx
type useReactTable = <TData extends AnyData>(
  options: TableOptions<TData>
) => Table<TData>
```

这些函数用于创建表格。您使用哪一个取决于您使用的框架适配器。

## 选项

这些是表格的**核心**选项和 API 属性。其他[表格功能](../guide/features.md)还提供了更多选项和 API 属性。

### `data`

```tsx
data: TData[]
```

表格要显示的数据。此数组应与您提供给 `table.setRowType<...>` 的类型匹配，但理论上可以是任何内容的数组。数组中的每个项目通常是键/值对象，但这不是必需的。列可以通过字符串/索引或函数访问器访问此数据以返回它们想要的任何内容。

当 `data` 选项更改引用时（通过 `Object.is` 比较），表格将重新处理数据。任何其他依赖于核心数据模型的数据处理（如分组、排序、过滤等）也将被重新处理。

> 🧠 确保您的 `data` 选项仅在您希望表格重新处理时才更改。每次要渲染表格时提供内联 `[]` 或将数据数组构造为新对象将导致大量不必要的重新处理。这在较小的表格中很容易被忽视，但您可能会在较大的表格中注意到它。

### `columns`

```tsx
type columns = ColumnDef<TData>[]
```

用于表格的列定义数组。有关创建列定义的更多信息，请参阅[列定义指南](../guide/column-defs.md)。

### `defaultColumn`

```tsx
defaultColumn?: Partial<ColumnDef<TData>>
```

用于提供给表格的所有列定义的默认列选项。这对于提供默认的单元格/表头/页脚渲染器、排序/过滤/分组选项等很有用。传递给 `options.columns` 的所有列定义都与此默认列定义合并以产生最终的列定义。

### `initialState`

```tsx
initialState?: Partial<
  VisibilityTableState &
  ColumnOrderTableState &
  ColumnPinningTableState &
  FiltersTableState &
  SortingTableState &
  ExpandedTableState &
  GroupingTableState &
  ColumnSizingTableState &
  PaginationTableState &
  RowSelectionTableState
>
```

使用此选项可选择性地将初始状态传递给表格。当表格自动重置各种表格状态（例如 `options.autoResetPageIndex`）或通过 `table.resetRowSelection()` 等函数重置时，将使用此状态。大多数重置函数允许您可选择性地传递标志以重置为空白/默认状态而不是初始状态。

> 🧠 当此对象更改时，表格状态不会重置，这也意味着初始状态对象不需要稳定。

### `autoResetAll`

```tsx
autoResetAll?: boolean
```

设置此选项以覆盖任何 `autoReset...` 功能选项。

### `meta`

```tsx
meta?: TableMeta // 此接口可通过声明合并进行扩展。见下文！
```

您可以将任何对象传递给 `options.meta` 并通过 `table.options.meta` 在 `table` 可用的任何地方访问它。此类型对所有表格都是全局的，可以像这样扩展：

```tsx
declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    foo: string
  }
}
```

> 🧠 将此选项视为表格的任意"上下文"。这是将任意数据或函数传递给表格而无需将其传递给表格接触的每个内容的好方法。一个很好的例子是将区域设置对象传递给表格以用于格式化日期、数字等，甚至是可用于更新可编辑数据的函数，如[可编辑数据](https://github.com/TanStack/table/tree/main/examples/react/editable-data)示例中所示。

### `state`

```tsx
state?: Partial<
  VisibilityTableState &
  ColumnOrderTableState &
  ColumnPinningTableState &
  FiltersTableState &
  SortingTableState &
  ExpandedTableState &
  GroupingTableState &
  ColumnSizingTableState &
  PaginationTableState &
  RowSelectionTableState
>
```

`state` 选项可用于可选择性地控制表格状态的部分或全部。您在此处传递的状态将与内部自动管理的状态合并并覆盖，以产生表格的最终状态。您还可以通过 `onStateChange` 选项监听状态更改。

### `onStateChange`

```tsx
onStateChange: (updater: Updater<TableState>) => void
```

`onStateChange` 选项可用于可选择性地监听表格内的状态更改。如果您提供此选项，您将负责自己控制和更新表格状态。您可以使用 `state` 选项将状态提供回表格。

### `debugAll`

> ⚠️ 调试仅在开发模式下可用。

```tsx
debugAll?: boolean
```

将此选项设置为 true 以将所有调试信息输出到控制台。

### `debugTable`

> ⚠️ 调试仅在开发模式下可用。

```tsx
debugTable?: boolean
```

将此选项设置为 true 以将表格调试信息输出到控制台。

### `debugHeaders`

> ⚠️ 调试仅在开发模式下可用。

```tsx
debugHeaders?: boolean
```

将此选项设置为 true 以将表头调试信息输出到控制台。

### `debugColumns`

> ⚠️ 调试仅在开发模式下可用。

```tsx
debugColumns?: boolean
```

将此选项设置为 true 以将列调试信息输出到控制台。

### `debugRows`

> ⚠️ 调试仅在开发模式下可用。

```tsx
debugRows?: boolean
```

将此选项设置为 true 以将行调试信息输出到控制台。

### `_features`

```tsx
_features?: TableFeature[]
```

您可以添加到表格实例的额外功能数组。

### `render`

> ⚠️ 此选项仅在您实现表格适配器时才需要。

```tsx
type render = <TProps>(template: Renderable<TProps>, props: TProps) => any
```

`render` 选项为表格提供渲染器实现。此实现用于将表格的各种列标题和单元格模板转换为用户框架支持的结果。

### `mergeOptions`

> ⚠️ 此选项仅在您实现表格适配器时才需要。

```tsx
type mergeOptions = <T>(defaultOptions: T, options: Partial<T>) => T
```

此选项用于可选择性地实现表格选项的合并。一些框架（如 solid-js）使用代理来跟踪响应性和使用情况，因此需要小心处理响应式对象的合并。此选项将此过程的控制权反转给适配器。

### `getCoreRowModel`

```tsx
getCoreRowModel: (table: Table<TData>) => () => RowModel<TData>
```

此必需选项是一个工厂函数，用于计算并返回表格的核心行模型。每个表格调用一次，应返回一个新函数，该函数将计算并返回表格的行模型。

通过任何表格适配器的 `{ getCoreRowModel }` 导出提供默认实现。

### `getSubRows`

```tsx
getSubRows?: (
  originalRow: TData,
  index: number
) => undefined | TData[]
```

此可选函数用于访问任何给定行的子行。如果您使用嵌套行，您需要使用此函数从行返回子行对象（或 undefined）。

### `getRowId`

```tsx
getRowId?: (
  originalRow: TData,
  index: number,
  parent?: Row<TData>
) => string
```

此可选函数用于为任何给定行派生唯一 ID。如果未提供，则使用行的索引（嵌套行使用其祖父母的索引与 `.` 连接，例如 `index.index.index`）。如果您需要识别来自任何服务器端操作的单个行，建议您使用此函数返回一个无论网络 IO/歧义如何都有意义的 ID，例如 userId、taskId、数据库 ID 字段等。

## 表格 API

这些属性和方法在表格对象上可用：

### `initialState`

```tsx
initialState: VisibilityTableState &
  ColumnOrderTableState &
  ColumnPinningTableState &
  FiltersTableState &
  SortingTableState &
  ExpandedTableState &
  GroupingTableState &
  ColumnSizingTableState &
  PaginationTableState &
  RowSelectionTableState
```

这是表格的已解析初始状态。

### `reset`

```tsx
reset: () => void
```

调用此函数将表格状态重置为初始状态。

### `getState`

```tsx
getState: () => TableState
```

调用此函数获取表格的当前状态。建议使用此函数及其状态，特别是在手动管理表格状态时。这是表格内部用于其提供的每个功能和函数的完全相同的状态。

> 🧠 此函数返回的状态是自动管理的内部表格状态和通过 `options.state` 传递的任何手动管理状态的浅合并结果。

### `setState`

```tsx
setState: (updater: Updater<TableState>) => void
```

调用此函数更新表格状态。建议您以 `(prevState) => newState` 的形式传递更新器函数来更新状态，但也可以传递直接对象。

> 🧠 如果提供了 `options.onStateChange`，此函数将使用新状态触发它。

### `options`

```tsx
options: TableOptions<TData>
```

对表格当前选项的只读引用。

> ⚠️ 此属性通常在内部或由适配器使用。可以通过向表格传递新选项来更新它。这对每个适配器都不同。对于适配器本身，必须通过 `setOptions` 函数更新表格选项。

### `setOptions`

```tsx
setOptions: (newOptions: Updater<TableOptions<TData>>) => void
```

> ⚠️ 此函数通常由适配器用于更新表格选项。它可以用于直接更新表格选项，但通常不建议绕过适配器的更新表格选项策略。

### `getCoreRowModel`

```tsx
getCoreRowModel: () => {
  rows: Row<TData>[],
  flatRows: Row<TData>[],
  rowsById: Record<string, Row<TData>>,
}
```

返回应用任何处理之前的核心行模型。

### `getRowModel`

```tsx
getRowModel: () => {
  rows: Row<TData>[],
  flatRows: Row<TData>[],
  rowsById: Record<string, Row<TData>>,
}
```

返回应用其他使用功能的所有处理后的最终模型。

### `getAllColumns`

```tsx
type getAllColumns = () => Column<TData>[]
```

返回表格中所有列的规范化和嵌套层次结构，镜像传递给表格的列定义。

### `getAllFlatColumns`

```tsx
type getAllFlatColumns = () => Column<TData>[]
```

返回表格中扁平化为单一级别的所有列。这包括整个层次结构中的父列对象。

### `getAllLeafColumns`

```tsx
type getAllLeafColumns = () => Column<TData>[]
```

返回表格中扁平化为单一级别的所有叶节点列。这不包括父列。

### `getColumn`

```tsx
type getColumn = (id: string) => Column<TData> | undefined
```

通过其 ID 返回单个列。

### `getHeaderGroups`

```tsx
type getHeaderGroups = () => HeaderGroup<TData>[]
```

返回表格的表头组。

### `getFooterGroups`

```tsx
type getFooterGroups = () => HeaderGroup<TData>[]
```

返回表格的页脚组。

### `getFlatHeaders`

```tsx
type getFlatHeaders = () => Header<TData>[]
```

返回表格的扁平化表头对象数组，包括父表头。

### `getLeafHeaders`

```tsx
type getLeafHeaders = () => Header<TData>[]
```

返回表格的扁平化叶节点表头对象数组。