---
name: pangea-select-modal
description: "对话框 Modal 选型元数据：何时用弹窗、与抽屉/独立页的取舍、弹窗表单的组合边界。"
user-invocable: false
meta:
  id: modal
  kind: component
  title: 对话框 Modal
  whenToUse: [轻量确认, 弹窗内录入/编辑, 不跳转的临时任务]
  whenNotToUse: [字段极多的长流程→独立表单页, 侧向持久面板→a-drawer]
  variants: [确认弹窗, 弹窗表单, 全屏 fullscreen]
  composeWith: [a-form, a-button]
  composeBoundary: [宽度≤1000px 列≤3, body max-height 内联滚动保证底部按钮可见, on-before-ok 返回 Promise 控制校验后关闭, 窄屏宽不超视口]
  controls: { size: default }
  pitfalls: [关闭图标用 Arco 默认不替换, unmount-on-close 重置状态]
  tags: [反馈, 弹窗, 表单]
---

# 对话框 Modal · 选型要点

- **用它**：轻量确认、弹窗内录入/编辑、不跳转的临时任务。
- **别用它**：字段极多的长流程用**独立表单页**（[page-form](../patterns/page-form.md)）；侧向持久面板用 `a-drawer`。
- **变体**：确认弹窗 / 弹窗表单 / 全屏。
- **组合边界**：宽度 ≤ 1000px、列数 ≤ 3；body 设 `max-height` 内联滚动保证底部按钮可见；用 `on-before-ok` 返回 `Promise<boolean>` 控制校验后关闭；窄屏宽度不超视口。
- **常见坑**：关闭图标用 Arco 默认（不替换）；`unmount-on-close` 重置内部状态。

完整 API：[modal.md](../components/feedback/modal.md)。弹窗表单模板见 [page-modal-form.md](../patterns/page-modal-form.md)。
