---
name: pangea-select-select
description: "选择器 Select 选型元数据：何时用下拉选择、与单选/开关/树选的取舍、搜索与组合边界。"
user-invocable: false
meta:
  id: select
  kind: component
  title: 选择器 Select
  whenToUse: [从有限选项单选/多选, 需搜索或远程搜索的选择]
  whenNotToUse: [选项极少(2-3)→a-radio-group, 布尔→a-switch, 层级数据→a-tree-select]
  variants: [单选, 多选, 可搜索, 远程加载, 选项分组]
  composeWith: [a-option, a-optgroup, a-input-group]
  composeBoundary: [下拉箭头用 Arco 默认不替换, 提供 allow-clear 清除]
  pitfalls: [远程搜索加防抖, 大数据量用虚拟列表]
  tags: [表单, 选择]
---

# 选择器 Select · 选型要点

- **用它**：从有限选项单选/多选；需要搜索或远程搜索。
- **别用它**：选项极少（2–3 个）用 `a-radio-group`；布尔用 `a-switch`；层级数据用 `a-tree-select`。
- **变体**：单选 / 多选 / 可搜索 / 远程加载 / 选项分组。
- **组合边界**：下拉箭头用 Arco 默认（不替换）；提供 `allow-clear`；常与搜索框用 `a-input-group` 组合。
- **常见坑**：远程搜索加防抖；大数据量启用虚拟列表。

完整 API：[select.md](../components/data-entry/select.md)。
