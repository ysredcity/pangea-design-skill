---
name: pangea-select-card
description: "卡片 Card 选型元数据：何时用卡片承载、白底/灰底两种区隔方式、卡片网格的组合边界。"
user-invocable: false
meta:
  id: card
  kind: component
  title: 卡片 Card
  whenToUse: [内容分块承载, 卡片列表/网格项, 仪表板区块]
  whenNotToUse: [规整多列数据→表格, 纯分隔用间距即可不必卡片]
  variants: [带标题(title+extra), 无标题纯 body, 网格项]
  composeWith: [a-card-meta, a-grid, a-avatar, a-link]
  composeBoundary: [白页面上用边框(默认 bordered), 灰底仪表板上用无边框白卡(:bordered=false)+大圆角+极轻阴影, 圆角用 var(--border-radius-large)]
  pitfalls: [卡片网格用 CSS auto-fill/minmax 不写死列数]
  tags: [数据展示, 容器]
---

# 卡片 Card · 选型要点

- **用它**：内容分块承载、卡片列表/网格项、仪表板区块。
- **别用它**：规整多列数据用表格；仅需分隔用间距即可，别为分隔而套卡片。
- **变体**：带标题（`#title` + `#extra`）/ 无标题纯 body / 网格项。
- **组合边界（背景分层）**：白底页面上用**边框**区隔（默认 `bordered`）；灰底仪表板类页面上用**无边框白卡**（`:bordered="false"`）。→ 两类页面的背景归属、圆角 / 阴影 / 浅底芯片细则见 **[design.md 1.3](../design.md#13-页面背景分层)**；卡片网格 `auto-fill` 自适应见 **[design.md 3.2](../design.md#32-响应式适配)**。

完整 API：[card.md](../components/data-display/card.md)。卡片列表模板见 [page-card-list.md](../patterns/page-card-list.md)。
