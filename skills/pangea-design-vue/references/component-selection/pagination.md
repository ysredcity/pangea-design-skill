---
name: pangea-select-pagination
description: "分页 Pagination 选型元数据：何时用分页、变体、total 联动与列表页布局的组合边界。"
user-invocable: false
meta:
  id: pagination
  kind: component
  title: 分页 Pagination
  whenToUse: [列表/表格分页]
  whenNotToUse: [无限滚动场景, 数据量极小无需分页]
  variants: [基础, 带跳转(show-jumper), 带页大小(show-page-size), simple]
  composeWith: [a-table, a-list, 卡片网格]
  composeBoundary: [total 与真实数据联动不写死, 筛选后复位 current=1, 列表页布局总数左对齐翻页器右对齐]
  pitfalls: [服务端分页 total 取接口返回, 客户端取数据长度]
  tags: [导航, 列表]
---

# 分页 Pagination · 选型要点

- **用它**：列表/表格分页。
- **别用它**：无限滚动场景；数据量极小无需分页。
- **变体**：基础 / 带跳转（`show-jumper`）/ 带页大小（`show-page-size`）/ `simple`。
- **组合边界**：`total` 与真实数据联动、**不写死**；筛选后复位 `current=1`；列表页布局为「总数左对齐、翻页器右对齐」；分页器 `size="small"`（密度分档见 **[design.md 2.2](../design.md#22-控件密度)**）。
- **常见坑**：服务端分页 `total` 取接口返回、客户端取数据长度（见 [table-patterns.md](../patterns/table-patterns.md)）。

完整 API：[pagination.md](../components/navigation/pagination.md)。
