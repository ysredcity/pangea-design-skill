---
name: pangea-select-alert
description: "警告提示 Alert 选型元数据：何时用页内持久提示、与 Message/Modal/Notification 的区别。"
user-invocable: false
meta:
  id: alert
  kind: component
  title: 警告提示 Alert
  whenToUse: [页内持久的提示/警告/说明, 表单顶部填写须知]
  whenNotToUse: [操作后瞬时反馈→Message, 需用户确认→Modal/Popconfirm, 全局富通知→Notification]
  variants: [info/success/warning/error 四类型, 可关闭, 带标题+描述]
  composeWith: [表单顶部, 页面提示区]
  composeBoundary: [用于页内内联提示不用于瞬时反馈]
  pitfalls: [不要用 Alert 做瞬时操作反馈(那是 Message)]
  tags: [反馈, 提示]
---

# 警告提示 Alert · 选型要点

- **用它**：页内**持久**的提示/警告/说明（如表单顶部填写须知）。
- **别用它**：操作后**瞬时**反馈用 `Message`；需用户确认用 `Modal`/`Popconfirm`；全局富内容通知用 `Notification`。
- **变体**：`info`/`success`/`warning`/`error` 四类型 / 可关闭 / 带标题 + 描述。
- **组合边界**：仅用于页内内联提示，不承担瞬时反馈职责。

完整 API：[alert.md](../components/feedback/alert.md)。
