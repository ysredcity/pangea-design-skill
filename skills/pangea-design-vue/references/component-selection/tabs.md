---
name: pangea-select-tabs
description: "标签页 Tabs 选型元数据：何时用页内切换、与菜单/步骤的区别、胶囊型对齐等组合边界。"
user-invocable: false
meta:
  id: tabs
  kind: component
  title: 标签页 Tabs
  whenToUse: [同一区域切换多组内容, 列表页多状态切换(待办/已办)]
  whenNotToUse: [页面级导航→菜单/路由, 步骤流程→a-steps]
  variants: [line(默认), card, capsule(胶囊), rounded, text]
  composeWith: [a-tab-pane, a-badge]
  composeBoundary: [页内内容切换不做页面跳转, 胶囊型默认右对齐需按需覆盖为左对齐]
  controls: { size: default }
  pitfalls: [胶囊 tabs 默认 justify-content flex-end 右对齐, 需覆盖为 flex-start 改左对齐]
  tags: [数据展示, 切换]
---

# 标签页 Tabs · 选型要点

- **用它**：同一区域切换多组内容（如列表页「待我审批 / 我已处理」）。
- **别用它**：页面级导航用菜单/路由；步骤流程用 `a-steps`。
- **变体**：`line`（默认）/ `card` / `capsule`（胶囊）/ `rounded` / `text`。
- **组合边界**：只切换页内内容、不做页面跳转。
- **常见坑**：**胶囊型 tabs 默认右对齐**（`.arco-tabs-nav-type-capsule .arco-tabs-nav-tab { justify-content: flex-end }`），需要左对齐时用 `:deep()` 覆盖为 `flex-start`。

完整 API：[tabs.md](../components/data-display/tabs.md)。
