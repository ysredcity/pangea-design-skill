---
name: pangea-select-menu
description: "菜单 Menu 选型元数据：何时用导航菜单、与标签页/下拉的区别、全局 Layout 已封装侧边菜单的组合边界。"
user-invocable: false
meta:
  id: menu
  kind: component
  title: 菜单 Menu
  whenToUse: [侧边/顶部导航, 多级子菜单]
  whenNotToUse: [页内内容切换→a-tabs, 命令浮层→a-dropdown]
  variants: [垂直(侧边), 水平(顶部), 含子菜单]
  composeWith: [a-sub-menu, a-menu-item]
  composeBoundary: [全局 Layout 已封装侧边菜单+layout-menu.less 样式, 新增页面在 menuItems 追加而非重写 Layout]
  pitfalls: [选中态样式已定制(白底+primary-7+medium), 激活时 hover 保持白色]
  tags: [导航]
---

# 菜单 Menu · 选型要点

- **用它**：侧边/顶部导航、多级子菜单。
- **别用它**：页内内容切换用 `a-tabs`；命令浮层用 `a-dropdown`。
- **变体**：垂直（侧边）/ 水平（顶部）/ 含子菜单。
- **组合边界**：**全局 Layout 已封装侧边菜单**并有自定义样式 `layout-menu.less`；新增页面只在 `GlobalLayout.vue` 的 `menuItems` 追加，**不要重写 Layout**。
- **常见坑**：选中态样式已定制（白底 + `primary-7` + medium 字重）；激活时 hover 保持白色。

完整 API：[menu.md](../components/navigation/menu.md)。生成层级见 [project-structure.md](../overview/project-structure.md)。
