---
title: 列大小调整指南
---

## 示例

想要跳转到实现？查看这些示例：

- [column-sizing](https://github.com/TanStack/table/tree/main/examples/react/column-sizing)
- [column-resizing-performant](https://github.com/TanStack/table/tree/main/examples/react/column-resizing-performant)

## API

[列大小调整 API](../api/features/column-sizing.md)

## 列大小调整指南

列大小调整功能允许你可选地指定每列的宽度，包括最小和最大宽度。它还允许你和你的用户能够随意动态更改所有列的宽度，例如通过拖动列标题。

### 列宽度

默认情况下，列被赋予以下测量选项：

```tsx
export const defaultColumnSizing = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER,
}
```

这些默认值可以被 `tableOptions.defaultColumn` 和单个列定义覆盖，按此顺序。

```tsx
const columns = [
  {
    accessorKey: 'col1',
    size: 270, //为此列设置列大小
  },
  //...
]

const table = useReactTable({
  //覆盖默认列大小
  defaultColumn: {
    size: 200, //起始列大小
    minSize: 50, //在列调整大小期间强制执行
    maxSize: 500, //在列调整大小期间强制执行
  },
})
```

列"大小"作为数字存储在表格状态中，通常被解释为像素单位值，但你可以根据需要将这些列大小值连接到你的 css 样式。

作为无头实用程序，列大小调整的表格逻辑实际上只是一组状态，你可以根据需要将其应用到自己的布局中（我们上面的示例实现了这种逻辑的 2 种样式）。你可以通过多种方式应用这些宽度测量：

- 语义 `table` 元素或以表格 css 模式显示的任何元素
- `div/span` 元素或以非表格 css 模式显示的任何元素
  - 具有严格宽度的块级元素
  - 具有严格宽度的绝对定位元素
  - 具有松散宽度的 Flexbox 定位元素
  - 具有松散宽度的 Grid 定位元素
- 实际上任何可以将单元格宽度插值到表格结构中的布局机制。

每种方法都有自己的权衡和限制，这些通常是 UI/组件库或设计系统持有的观点，幸运的是不是你 😉。

### 列调整大小

TanStack Table 提供内置的列调整大小状态和 API，允许你轻松在表格 UI 中实现列调整大小，并为 UX 和性能提供各种选项。

#### 启用列调整大小

默认情况下，`column.getCanResize()` API 默认为所有列返回 `true`，但你可以使用 `enableColumnResizing` 表格选项为所有列禁用列调整大小，或使用 `enableResizing` 列选项在每列基础上禁用列调整大小。

```tsx
const columns = [
  {
    accessorKey: 'id',
    enableResizing: false, //仅为此列禁用调整大小
    size: 200, //起始列大小
  },
  //...
]
```

#### 列调整大小模式

默认情况下，列调整大小模式设置为 `"onEnd"`。这意味着 `column.getSize()` API 在用户完成调整（拖动）列大小之前不会返回新的列大小。通常在用户调整列大小时会显示一个小的 UI 指示器。

在 React TanStack Table 适配器中，根据表格或网页的复杂性，实现 60 fps 列调整大小渲染可能很困难，`"onEnd"` 列调整大小模式可以是一个很好的默认选项，以避免用户调整列大小时出现卡顿或延迟。这并不是说你不能在使用 TanStack React Table 时实现 60 fps 列调整大小渲染，但你可能需要做一些额外的记忆化或其他性能优化才能实现这一点。

> 高级列调整大小性能技巧将在[下面](#advanced-column-resizing-performance)讨论。

如果你想将列调整大小模式更改为 `"onChange"` 以进行即时列调整大小渲染，你可以使用 `columnResizeMode` 表格选项来实现。

```tsx
const table = useReactTable({
  //...
  columnResizeMode: 'onChange', //将列调整大小模式更改为 "onChange"
})
```

#### 列调整大小方向

默认情况下，TanStack Table 假设表格标记以从左到右的方向布局。对于从右到左的布局，你可能需要将列调整大小方向更改为 `"rtl"`。

```tsx
const table = useReactTable({
  //...
  columnResizeDirection: 'rtl', //为某些区域设置将列调整大小方向更改为 "rtl"
})
```

#### 将列调整大小 API 连接到 UI

有一些非常方便的 API，你可以使用它们将列调整大小拖动交互连接到你的 UI。

##### 列大小 API

要将列的大小应用到列头单元格、数据单元格或页脚单元格，你可以使用以下 API：

```ts
header.getSize()
column.getSize()
cell.column.getSize()
```

如何将这些大小样式应用到你的标记取决于你，但使用 CSS 变量或内联样式来应用列大小是很常见的。

```tsx
<th
  key={header.id}
  colSpan={header.colSpan}
  style={{ width: `${header.getSize()}px` }}
>
```

不过，正如在[高级列调整大小性能部分](#advanced-column-resizing-performance)中讨论的，你可能想要考虑使用 CSS 变量将列大小应用到你的标记。

##### 列调整大小 API

TanStack Table 提供预构建的事件处理程序，使你的拖动交互易于实现。这些事件处理程序只是便利函数，调用其他内部 API 来更新列大小状态并重新渲染表格。使用 `header.getResizeHandler()` 连接到你的列调整大小拖动交互，适用于鼠标和触摸事件。

```tsx
<ColumnResizeHandle
  onMouseDown={header.getResizeHandler()} //用于桌面
  onTouchStart={header.getResizeHandler()} //用于移动设备
/>
```

##### 使用 ColumnSizingInfoState 的列调整大小指示器

TanStack Table 跟踪一个名为 `columnSizingInfo` 的状态对象，你可以使用它来渲染列调整大小指示器 UI。

```jsx
<ColumnResizeIndicator
  style={{
    transform: header.column.getIsResizing()
      ? `translateX(${table.getState().columnSizingInfo.deltaOffset}px)`
      : '',
  }}
/>
```

#### 高级列调整大小性能

如果你正在创建大型或复杂的表格（并且使用 React 😉），你可能会发现，如果你没有为渲染逻辑添加适当的记忆化，你的用户在调整列大小时可能会遇到性能下降。

我们创建了一个[高性能列调整大小示例](https://github.com/TanStack/table/tree/main/examples/react/column-resizing-performant)，演示了如何在可能否则渲染缓慢的复杂表格中实现 60 fps 列调整大小渲染。建议你只查看该示例以了解如何完成，但这些是要记住的基本事项：

1. 不要在每个标题和每个数据单元格上使用 `column.getSize()`。相反，提前一次性计算所有列宽度，**记忆化**！
2. 在调整大小进行时记忆化你的表格主体。
3. 使用 CSS 变量将列宽度传达给你的表格单元格。

如果你遵循这些步骤，你应该在调整列大小时看到显著的性能改进。

如果你不使用 React，而是使用 Svelte、Vue 或 Solid 适配器，你可能不需要太担心这个问题，但类似的原则适用。