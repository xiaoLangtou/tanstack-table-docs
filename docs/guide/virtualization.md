---
title: 虚拟化指南
---

## 示例

想要跳转到实现？查看这些示例：

- [virtualized-columns](https://github.com/TanStack/table/tree/main/examples/react/virtualized-columns)
- [virtualized-rows (dynamic row height)](https://github.com/TanStack/table/tree/main/examples/react/virtualized-rows)
- [virtualized-rows (fixed row height)](https://github.com/TanStack/table/tree/main/examples/react/virtualized-rows)
- [virtualized-infinite-scrolling](https://github.com/TanStack/table/tree/main/examples/react/virtualized-infinite-scrolling)

## 虚拟化指南

TanStack Table 包没有内置任何虚拟化 API 或功能，但 TanStack Table 可以轻松与其他虚拟化库（如 [react-window](https://www.npmjs.com/package/react-window)）或 TanStack 自己的 [TanStack Virtual](https://tanstack.com/virtual/v3) 配合使用。本指南将展示一些将 TanStack Table 与 TanStack Virtual 结合使用的策略。