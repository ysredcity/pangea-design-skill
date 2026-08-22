---
name: pangea-select-table
description: "表格 Table 选型元数据：何时用表格、何时改用卡片/描述列表、常见变体与组合边界。"
user-invocable: false
meta:
  id: table
  kind: component
  title: 表格 Table
  whenToUse: [规整多列结构化数据, 需要行选择/排序/分页, 需状态列]
  whenNotToUse: [图文混合每条信息丰富→卡片(a-card), 少量键值展示→描述列表/详情摘要]
  variants: [基础表格, 行选择(checkbox), 可编辑子表格, 撑满父容器高度]
  composeWith: [a-pagination, a-badge, a-input-group, a-button]
  composeBoundary: [分页独立于表格且 total 与真实数据联动, 状态列用 a-badge 不只靠颜色, 操作列用 a-link/text 按钮]
  pitfalls: [插槽 record 为 any 用接受 string 的 helper 查表避免 TS7053, 撑满高度需 scroll y 100% + 容器 flex]
  tags: [数据展示, 列表]
---

# 表格 Table · 选型要点

- **用它**：规整、多列的结构化数据；需要行选择、排序、分页、状态列。
- **别用它**：每条信息图文混合且较丰富时改用**卡片**（`a-card`，见 [card.md](card.md)）；只是少量键值展示用描述列表/详情摘要。
- **变体**：基础表格 / 行选择 / 可编辑子表格 / 撑满父容器高度。
- **组合边界**：分页与表格解耦、`total` 与真实数据联动；状态列用 `a-badge`（**[不只靠颜色](../design.md#23-状态不只靠颜色传达)**）；操作列用 `a-link` 或文本按钮；**表格自身 `size="medium"`**，同页的操作栏按钮 / 搜索 / 分页用 `size="small"`（见 **[design.md 2.2](../design.md#22-控件密度)**）。
- **常见坑**：插槽 `record` 为 `any`，强类型索引映射会 TS7053 → 用接受 `string` 的 helper 查表；撑满高度需 `:scroll="{ y: '100%' }"` + 容器 flex。

完整 API：[table.md](../components/data-display/table.md)。表格相关模式见 [table-patterns.md](../patterns/table-patterns.md)。
