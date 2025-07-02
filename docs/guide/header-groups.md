---
title: 表头组指南
---

## API

[表头组 API](../api/core/header-group)

## 表头组指南

本快速指南将讨论在 TanStack Table 中检索和与表头组对象交互的不同方式。

### 什么是表头组？

表头组简单来说就是表头的"行"。不要被名称搞混，就是这么简单。绝大多数表格只有一行表头（单个表头组），但如果您使用嵌套列定义列结构，如[列组示例](../framework/react/examples/column-groups)，您可以有多行表头（多个表头组）。

### 从哪里获取表头组

有多个 `table` 实例 API 可用于从表格实例检索表头组。`table.getHeaderGroups` 是最常用的 API，但根据您使用的功能，您可能需要使用其他 API，例如如果您使用列固定功能，则需要使用 `table.get[Left/Center/Right]HeaderGroups`。

### 表头组对象

表头组对象类似于[行](rows)对象，但更简单，因为表头行中没有主体行那么多的内容。

默认情况下，表头组只有三个属性：

- `id`：表头组的唯一标识符，由其深度（索引）生成。这对于 React 组件的键很有用。
- `depth`：表头组的深度，从零开始索引。将其视为所有表头行中的行索引。
- `headers`：属于此表头组（行）的[表头](headers)单元格对象数组。

### 访问表头单元格

要渲染表头组中的表头单元格，您只需遍历表头组对象中的 `headers` 数组。

```jsx
<thead>
  {table.getHeaderGroups().map(headerGroup => {
    return (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => ( // 遍历 headerGroup headers 数组
          <th key={header.id} colSpan={header.colSpan}>
            {/* */}
          </th>
        ))}
      </tr>
    )
  })}
</thead>
```