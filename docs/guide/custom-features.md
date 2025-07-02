---
title: 自定义功能指南
---

## 示例

想要跳到实现部分？查看这些示例：

- [custom-features](https://github.com/TanStack/table/tree/main/examples/react/custom-features)

## 自定义功能指南

在本指南中，我们将介绍如何使用自定义功能扩展 TanStack Table，同时我们将了解更多关于 TanStack Table v8 代码库的结构和工作原理。

### TanStack Table 力求保持精简

TanStack Table 有一套内置的核心功能，如排序、过滤、分页等。我们收到了很多请求，有时甚至是一些经过深思熟虑的 PR，要求向库中添加更多功能。虽然我们总是乐于改进库，但我们也希望确保 TanStack Table 保持精简，不包含太多冗余代码和在大多数用例中不太可能使用的代码。并非每个 PR 都能或应该被接受到核心库中，即使它确实解决了一个真实的问题。这可能会让那些 TanStack Table 解决了 90% 用例但需要更多控制的开发者感到沮丧。

TanStack Table 一直以允许高度扩展的方式构建（至少从 v7 开始）。从任何框架适配器（`useReactTable`、`useVueTable` 等）返回的 `table` 实例是一个普通的 JavaScript 对象，可以向其添加额外的属性或 API。一直以来都可以使用组合来向表格实例添加自定义逻辑、状态和 API。像 [Material React Table](https://github.com/KevinVandy/material-react-table/blob/v2/packages/material-react-table/src/hooks/useMRT_TableInstance.ts) 这样的库只是在 `useReactTable` hook 周围创建了自定义包装器 hook，以使用自定义功能扩展表格实例。

然而，从版本 8.14.0 开始，TanStack Table 暴露了一个新的 `_features` 表格选项，允许您以与内置表格功能完全相同的方式更紧密、更清洁地将自定义代码集成到表格实例中。

> TanStack Table v8.14.0 引入了一个新的 `_features` 选项，允许您向表格实例添加自定义功能。

通过这种新的更紧密的集成，您可以轻松地向表格添加更复杂的自定义功能，甚至可能将它们打包并与社区分享。我们将看到这如何随时间发展。在未来的 v9 版本中，我们甚至可能通过使所有功能都可选来降低 TanStack Table 的包大小，但这仍在探索中。

### TanStack Table 功能的工作原理

TanStack Table 的源代码可以说是相当简单的（至少我们认为如此）。每个功能的所有代码都被拆分到自己的对象/文件中，具有实例化方法来创建初始状态、默认表格和列选项，以及可以添加到 `table`、`header`、`column`、`row` 和 `cell` 实例的 API 方法。

功能对象的所有功能都可以用从 TanStack Table 导出的 `TableFeature` 类型来描述。这个类型是一个 TypeScript 接口，描述了创建功能所需的功能对象的形状。

```ts
export interface TableFeature<TData extends RowData = any> {
  createCell?: (
    cell: Cell<TData, unknown>,
    column: Column<TData>,
    row: Row<TData>,
    table: Table<TData>
  ) => void
  createColumn?: (column: Column<TData, unknown>, table: Table<TData>) => void
  createHeader?: (header: Header<TData, unknown>, table: Table<TData>) => void
  createRow?: (row: Row<TData>, table: Table<TData>) => void
  createTable?: (table: Table<TData>) => void
  getDefaultColumnDef?: () => Partial<ColumnDef<TData, unknown>>
  getDefaultOptions?: (
    table: Table<TData>
  ) => Partial<TableOptionsResolved<TData>>
  getInitialState?: (initialState?: InitialTableState) => Partial<TableState>
}
```

这可能有点令人困惑，所以让我们分解一下这些方法的作用：

#### 默认选项和初始状态

<br />

##### getDefaultOptions

表格功能中的 `getDefaultOptions` 方法负责为该功能设置默认表格选项。例如，在 [Column Sizing](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/ColumnSizing.ts) 功能中，`getDefaultOptions` 方法设置默认的 `columnResizeMode` 选项，默认值为 `"onEnd"`。

<br />

##### getDefaultColumnDef

表格功能中的 `getDefaultColumnDef` 方法负责为该功能设置默认列选项。例如，在 [Sorting](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowSorting.ts) 功能中，`getDefaultColumnDef` 方法设置默认的 `sortUndefined` 列选项，默认值为 `1`。

<br />

##### getInitialState

表格功能中的 `getInitialState` 方法负责为该功能设置默认状态。例如，在 [Pagination](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowPagination.ts) 功能中，`getInitialState` 方法设置默认的 `pageSize` 状态值为 `10`，默认的 `pageIndex` 状态值为 `0`。

#### API 创建器

<br />

##### createTable

表格功能中的 `createTable` 方法负责向 `table` 实例添加方法。例如，在 [Row Selection](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowSelection.ts) 功能中，`createTable` 方法添加了许多表格实例 API 方法，如 `toggleAllRowsSelected`、`getIsAllRowsSelected`、`getIsSomeRowsSelected` 等。因此，当您调用 `table.toggleAllRowsSelected()` 时，您正在调用由 `RowSelection` 功能添加到表格实例的方法。

<br />

##### createHeader

表格功能中的 `createHeader` 方法负责向 `header` 实例添加方法。例如，在 [Column Sizing](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/ColumnSizing.ts) 功能中，`createHeader` 方法添加了许多头部实例 API 方法，如 `getStart` 等。因此，当您调用 `header.getStart()` 时，您正在调用由 `ColumnSizing` 功能添加到头部实例的方法。

<br />

##### createColumn

表格功能中的 `createColumn` 方法负责向 `column` 实例添加方法。例如，在 [Sorting](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowSorting.ts) 功能中，`createColumn` 方法添加了许多列实例 API 方法，如 `getNextSortingOrder`、`toggleSorting` 等。因此，当您调用 `column.toggleSorting()` 时，您正在调用由 `RowSorting` 功能添加到列实例的方法。

<br />

##### createRow

表格功能中的 `createRow` 方法负责向 `row` 实例添加方法。例如，在 [Row Selection](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowSelection.ts) 功能中，`createRow` 方法添加了许多行实例 API 方法，如 `toggleSelected`、`getIsSelected` 等。因此，当您调用 `row.toggleSelected()` 时，您正在调用由 `RowSelection` 功能添加到行实例的方法。

<br />

##### createCell

表格功能中的 `createCell` 方法负责向 `cell` 实例添加方法。例如，在 [Column Grouping](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/ColumnGrouping.ts) 功能中，`createCell` 方法添加了许多单元格实例 API 方法，如 `getIsGrouped`、`getIsAggregated` 等。因此，当您调用 `cell.getIsGrouped()` 时，您正在调用由 `ColumnGrouping` 功能添加到单元格实例的方法。

### 添加自定义功能

让我们通过为一个假设的用例制作自定义表格功能来演示。假设我们想要向表格实例添加一个功能，允许用户更改表格的"密度"（单元格的内边距）。

查看完整的 [custom-features](https://github.com/TanStack/table/tree/main/examples/react/custom-features) 示例以查看完整实现，但这里是创建自定义功能步骤的深入介绍。

#### 步骤 1：设置 TypeScript 类型

假设您希望获得与 TanStack Table 内置功能相同的完整类型安全性，让我们为新功能设置所有 TypeScript 类型。我们将为新的表格选项、状态和表格实例 API 方法创建类型。

这些类型遵循 TanStack Table 内部使用的命名约定，但您可以随意命名。我们还没有将这些类型添加到 TanStack Table 中，但我们将在下一步中这样做。

```ts
// 为我们新功能的自定义状态定义类型
export type DensityState = 'sm' | 'md' | 'lg'
export interface DensityTableState {
  density: DensityState
}

// 为我们新功能的表格选项定义类型
export interface DensityOptions {
  enableDensity?: boolean
  onDensityChange?: OnChangeFn<DensityState>
}

// 为我们新功能的表格 API 定义类型
export interface DensityInstance {
  setDensity: (updater: Updater<DensityState>) => void
  toggleDensity: (value?: DensityState) => void
}
```

#### 步骤 2：使用声明合并将新类型添加到 TanStack Table

我们可以告诉 TypeScript 修改从 TanStack Table 导出的类型以包含我们新功能的类型。这称为"声明合并"，是 TypeScript 的一个强大功能。这样，我们不必在新功能的代码或应用程序代码中使用任何 TypeScript 技巧，如 `as unknown as CustomTable` 或 `// @ts-ignore`。

```ts
// 使用声明合并将我们的新功能 API 和状态类型添加到 TanStack Table 的现有类型中。
declare module '@tanstack/react-table' { // 或您正在使用的任何框架适配器
  // 将我们新功能的状态与现有表格状态合并
  interface TableState extends DensityTableState {}
  // 将我们新功能的选项与现有表格选项合并
  interface TableOptionsResolved<TData extends RowData>
    extends DensityOptions {}
  // 将我们新功能的实例 API 与现有表格实例 API 合并
  interface Table<TData extends RowData> extends DensityInstance {}
  // 如果您需要添加单元格实例 API...
  // interface Cell<TData extends RowData, TValue> extends DensityCell
  // 如果您需要添加行实例 API...
  // interface Row<TData extends RowData> extends DensityRow
  // 如果您需要添加列实例 API...
  // interface Column<TData extends RowData, TValue> extends DensityColumn
  // 如果您需要添加头部实例 API...
  // interface Header<TData extends RowData, TValue> extends DensityHeader

  // 注意：在 `ColumnDef` 上进行声明合并是不可能的，因为它是一个复杂类型，而不是接口。
  // 但您仍然可以在 `ColumnDef.meta` 上使用声明合并
}
```

一旦我们正确地做到这一点，当我们尝试创建新功能的代码并在应用程序中使用它时，应该没有 TypeScript 错误。

##### 使用声明合并的注意事项

使用声明合并的一个注意事项是它会影响代码库中每个表格的 TanStack Table 类型。如果您计划为应用程序中的每个表格加载相同的功能集，这不是问题，但如果您的某些表格加载额外功能而某些不加载，这可能是一个问题。或者，您可以创建一堆扩展 TanStack Table 类型并添加新功能的自定义类型。这是 [Material React Table](https://github.com/KevinVandy/material-react-table/blob/v2/packages/material-react-table/src/types.ts) 为了避免影响原版 TanStack Table 表格的类型而做的，但这有点繁琐，并且在某些点需要大量类型转换。

#### 步骤 3：创建功能对象

完成所有 TypeScript 设置后，我们现在可以为新功能创建功能对象。这是我们定义将添加到表格实例的所有方法的地方。

使用 `TableFeature` 类型确保您正确创建功能对象。如果 TypeScript 类型设置正确，当您使用新状态、选项和实例 API 创建功能对象时，应该没有 TypeScript 错误。

```ts
export const DensityFeature: TableFeature<any> = { // 使用 TableFeature 类型！！
  // 定义新功能的初始状态
  getInitialState: (state): DensityTableState => {
    return {
      density: 'md',
      ...state,
    }
  },

  // 定义新功能的默认选项
  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): DensityOptions => {
    return {
      enableDensity: true,
      onDensityChange: makeStateUpdater('density', table),
    } as DensityOptions
  },
  // 如果您需要添加默认列定义...
  // getDefaultColumnDef: <TData extends RowData>(): Partial<ColumnDef<TData>> => {
  //   return { meta: {} } // 使用 meta 而不是直接添加到 columnDef 以避免难以解决的 typescript 问题
  // },

  // 定义新功能的表格实例方法
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setDensity = updater => {
      const safeUpdater: Updater<DensityState> = old => {
        let newState = functionalUpdate(updater, old)
        return newState
      }
      return table.options.onDensityChange?.(safeUpdater)
    }
    table.toggleDensity = value => {
      table.setDensity(old => {
        if (value) return value
        return old === 'lg' ? 'md' : old === 'md' ? 'sm' : 'lg' // 在 3 个选项之间循环
      })
    }
  },

  // 如果您需要添加行实例 API...
  // createRow: <TData extends RowData>(row, table): void => {},
  // 如果您需要添加单元格实例 API...
  // createCell: <TData extends RowData>(cell, column, row, table): void => {},
  // 如果您需要添加列实例 API...
  // createColumn: <TData extends RowData>(column, table): void => {},
  // 如果您需要添加头部实例 API...
  // createHeader: <TData extends RowData>(header, table): void => {},
}
```

#### 步骤 4：将功能添加到表格

现在我们有了功能对象，我们可以通过在创建表格实例时将其传递给 `_features` 选项来将其添加到表格实例。

```ts
const table = useReactTable({
  _features: [DensityFeature], // 传递新功能以在底层与所有内置功能合并
  columns,
  data,
  //...
})
```

#### 步骤 5：在应用程序中使用功能

现在功能已添加到表格实例，您可以在应用程序中使用新的实例 API 选项和状态。

```tsx
const table = useReactTable({
  _features: [DensityFeature], // 将我们的自定义功能传递给表格以在创建时实例化
  columns,
  data,
  //...
  state: {
    density, // 将密度状态传递给表格，TS 仍然满意 :)
  },
  onDensityChange: setDensity, // 使用新的 onDensityChange 选项，TS 仍然满意 :)
})
//...
const { density } = table.getState()
return(
  <td
    key={cell.id}
    style={{
      // 在代码中使用我们的新功能
      padding:
        density === 'sm'
          ? '4px'
          : density === 'md'
            ? '8px'
            : '16px',
      transition: 'padding 0.2s',
    }}
  >
    {flexRender(
      cell.column.columnDef.cell,
      cell.getContext()
    )}
  </td>
)
```

#### 我们必须这样做吗？

这只是在 TanStack Table 中将自定义代码与内置功能一起集成的新方法。在上面的示例中，我们同样可以轻松地将 `density` 状态存储在 `React.useState` 中，在任何地方定义我们自己的 `toggleDensity` 处理程序，并在我们的代码中单独使用它，而不是与表格实例一起使用。在 TanStack Table 旁边构建表格功能而不是将它们深度集成到表格实例中仍然是构建自定义功能的完全有效的方法。根据您的用例，这可能是也可能不是使用自定义功能扩展 TanStack Table 的最清洁方法。