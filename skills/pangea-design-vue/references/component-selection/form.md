---
name: pangea-select-form
description: "表单 Form 选型元数据：何时用表单、布局变体、多列栅格与提交校验的组合边界。"
user-invocable: false
meta:
  id: form
  kind: component
  title: 表单 Form
  whenToUse: [结构化字段录入/编辑, 需要校验]
  whenNotToUse: [纯展示→描述列表, 单个开关/输入→直接用控件]
  variants: [垂直布局(label 在上), 水平布局, 内联 inline]
  composeWith: [a-form-item, a-grid(a-row/a-col), a-input, a-select, a-switch, a-date-picker, a-radio-group]
  composeBoundary: [多列用响应式断点 xs/sm/lg 不写死 span, 整行字段 span=24, 提交与校验二选一不混用]
  pitfalls: [声明式 @submit-success 与命令式 validate() 二选一, 校验规则写在 rules]
  tags: [表单, 录入]
---

# 表单 Form · 选型要点

- **用它**：结构化字段的录入/编辑，需要校验。
- **别用它**：纯展示用描述列表；单个开关/输入直接用对应控件即可。
- **变体**：垂直布局（label 在上，最常用）/ 水平布局 / 内联。
- **组合边界**：多列栅格用 Arco Grid 响应式断点**不写死 `:span`**，整行字段 `:span="24"`（标准配方见 **[design.md 3.2](../design.md#32-响应式适配)**）；表单控件用**默认尺寸**不用 small（见 **[design.md 2.2](../design.md#22-控件密度)**）；**提交与校验二选一**（声明式 `@submit-success` 或命令式 `validate()`）不混用。
- **常见坑**：校验规则写在 `rules`；避免重复校验。

完整 API：[form.md](../components/data-entry/form.md)。表单模式见 [form-patterns.md](../patterns/form-patterns.md)。
