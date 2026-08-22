---
name: pangea-select-badge
description: "徽标 Badge 选型元数据：何时用状态点/计数、与标签 Tag 的区别、状态不只靠颜色的组合边界。"
user-invocable: false
meta:
  id: badge
  kind: component
  title: 徽标 Badge
  whenToUse: [状态点+文字, 数字/未读计数, 通知标记]
  whenNotToUse: [分类标注→a-tag, 大段说明→文字]
  variants: [status 状态点(processing/success/warning/danger/normal), count 计数, dot 圆点]
  composeWith: [a-table(状态列), 文字]
  composeBoundary: [状态不只靠颜色需带文字, 表格状态列用 status+text]
  pitfalls: [独立计数徽标注意垂直居中]
  tags: [数据展示, 状态]
---

# 徽标 Badge · 选型要点

- **用它**：状态点 + 文字、数字/未读计数、通知标记。表格「状态列」的首选。
- **别用它**：分类标注用 `a-tag`；大段说明用文字。
- **变体**：`status` 状态点（processing/success/warning/danger/normal）/ `count` 计数 / `dot` 圆点。
- **组合边界**：**状态不只靠颜色传达**——带文字（表格状态列用 `status` + `text`）。→ 双通道规则的完整要求（含图表系列、图标按钮可访问名、对比度）见 **[design.md 2.3](../design.md#23-状态不只靠颜色传达)**。
- **常见坑**：独立使用的计数徽标注意与相邻文字垂直居中。

完整 API：[badge.md](../components/data-display/badge.md)。
