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
  variants: [确认弹窗(400), 弹窗表单(520/720), 含表格弹窗(1000), 全屏 fullscreen]
  composeWith: [a-form, a-button]
  composeBoundary: [宽度只有 520/720/1000 三档且不超过 1000, 1000 档仅当弹窗内含表格等宽组件, 确认类(simple)固定 400 不传 width, 列≤3, body max-height 内联滚动保证底部按钮可见, on-before-ok 返回 Promise 控制校验后关闭, 窄屏宽不超视口]
  controls: { size: default }
  pitfalls: [写 712/800/960 这类非档位宽度, 弹窗里没表格却用 1000 档, 给确认类弹窗传 width, arco-modal 是 content-box 导致 simple 模式 400 实际渲染成 464（需 box-sizing:border-box 覆盖）, 关闭图标用 Arco 默认不替换, unmount-on-close 重置状态]
  tags: [反馈, 弹窗, 表单]
---

# 对话框 Modal · 选型要点

- **用它**：轻量确认、弹窗内录入/编辑、不跳转的临时任务。
- **别用它**：字段极多的长流程用**独立表单页**（[page-form](../patterns/page-form.md)）；侧向持久面板用 `a-drawer`。
- **变体**：确认弹窗 / 弹窗表单 / 全屏。
- **宽度档位（硬约束）**：只有 **520 / 720 / 1000** 三档，**不允许超过 1000**。
  - `520`：默认档（不传 `width` 即 520）——字段少的轻量录入、单个选择/输入、简单信息展示。
  - `720`：字段较多需 2 列栅格、或内容较长需要更多横向空间。
  - `1000`：**仅当弹窗内含表格等宽组件时**（只读子表单表格、可编辑明细、宽数据列表）才允许；没有表格就降到 720 / 520。
  - 不得写 712 / 800 / 960 / 1200 这类非档位值；内容宽到装不进 1000，说明它不该待在弹窗里 → 改独立页面。
- **确认类弹窗固定 400**：删除确认 / 操作确认 / 风险提示用 `Modal.confirm | warning | info | error | success`（simple 模式），宽度 **400px**，**不要传 `width`**。⚠️ `.arco-modal` 是 **content-box**、simple 模式把 `padding: 24px 32px 32px` 加在根节点上，所以 Arco 自带的 `width: 400px` 实际渲染成 **464px**；脚手架用一条全局覆盖 `.arco-modal-simple { box-sizing: border-box }`（`src/styles/arco-overrides.less`）把它纠正为真实 400。
- **组合边界**：列数 ≤ 3；body 设 `max-height` 内联滚动保证底部按钮可见；用 `on-before-ok` 返回 `Promise<boolean>` 控制校验后关闭；窄屏宽度不超视口。
- **机检**：`npm run check:tokens`（含在 `npm run gate`）会扫 `<a-modal>` 的字面 `width`，非档位或 >1000 报错。
- **常见坑**：关闭图标用 Arco 默认（不替换）；`unmount-on-close` 重置内部状态。

完整 API：[modal.md](../components/feedback/modal.md)。弹窗表单模板见 [page-modal-form.md](../patterns/page-modal-form.md)。
