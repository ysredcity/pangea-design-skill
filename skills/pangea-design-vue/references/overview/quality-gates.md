---
name: pangea-quality-gates
description: "质量门禁（G0–G9）。G0 为生成前硬门禁（需求文档已经用户确认，禁止同轮出文档又出代码）；G1–G9 为每次生成或修改页面后的自检：编译（先类型检查再依赖 dev server）、Token 规范、组件用法与图标分工、响应式、背景分层、交互四态、可访问性、生成层级、AI 代码常见陷阱（模板内 TS 注解 / 响应式用 computed / 模板 async）。用于保证产出符合 Pangea 设计系统与可交付标准。"
user-invocable: false
---

# 生成后质量门禁（Quality Gates）

> **什么时候用**：每次**生成一个新页面**或**对页面做完一轮修改**后，在交付/预览前按 G1–G8 逐项核销。任一门禁不过 → 先修复再交付。
> 本清单是 skill 的一部分，也是官网 showcase 自身必须通过的标准（dogfood）。

## 用法约定

- AI 生成页面后，**逐条对照本清单自检**，对不满足项直接修复。
- 能自动化的门禁（G1 + G2 机检部分）由脚手架命令覆盖：**`npm run gate`**（= `node scripts/check-tokens.mjs && vue-tsc --noEmit && vite build`）。也可单跑 `npm run check:tokens` 只做裸值机检。
- 其余门禁靠对照检查（结构化、可复述）。

---

## G0 · 前置：需求文档已确认（生成前硬门禁）

**检查**：本次生成所依据的**界面架构需求文档**已产出，且用户在**看到文档之后**明确确认。

**怎么查**（动手写任何工程文件前自问）：
1. 需求文档已经发给用户了吗？
2. 用户看到文档后明确说「确认 / 可以 / 按这个做」了吗？
3. 任一为「否」→ **停止生成**，先补 [需求规格化](requirement-intake.md) 并请用户确认。

> ⛔ **禁止同一轮里既输出需求文档又生成工程代码**。可跳过的情形仅限：已确认文档下的增量、纯样式/文案单点微调、用户显式要求「不用出文档直接做」（从严解释）。详见 SKILL.md 顶部「🚦 两阶段强制门」。

## G1 · 编译与类型（硬门禁）

**检查**：TypeScript 无错、构建通过。

**怎么查**：
- 运行 `npm run gate`（含 `vue-tsc --noEmit` 类型检查 + `vite build` 构建 + 裸值机检），均无报错。
- 常见坑：表格插槽 `record` 为 `any`，用强类型索引映射会触发 TS7053 → 改用接受 `string` 的 helper 查表（见 [table-patterns.md](../patterns/table-patterns.md)）。

> ⚠️ **硬性执行顺序（务必遵守）**：**先跑通 `vue-tsc --noEmit`（或 `npm run gate`）确认无类型/模板错误，再启动或依赖 dev server 判断结果。** Vite dev server **默认不做类型检查**——模板里的非法语法（如下方 G9 的模板内 TS 注解）不会阻止 dev server 启动，却会让组件在运行时编译失败、`router-view` 渲染成**空白页**。因此：**不能只凭「dev server 起来了、无控制台报错」就认为页面正常**；生成/修改页面后、告知用户预览前，必须先过一遍 `vue-tsc`。（PM Demo 模式下 dev server 可长驻预览，但每轮改完仍要跑 `vue-tsc` 确认，再告知 PM 刷新。）

## G2 · Token 规范

**检查**：
- 颜色**只用语义 token / 调色板变量**（`var(--color-*)`、`rgb(var(--x-n))`），**无裸 hex/rgb**（图表 canvas 例外，见 SKILL「图表」）。
- 圆角**只用** `var(--border-radius-small/medium/large)`，不写死 px。
- 间距为 **4 的倍数**档位；字号落 `12/13/14/16/20/24`；字重落 `400/500/600/700`。
- **无自造组件**、不引入其它 UI 库。

**怎么查**：
- 机检：`npm run check:tokens`（脚手架 `scripts/check-tokens.mjs`）——扫 `src` 样式中的裸 `#hex` 与写死圆角（`.vue` 只扫 `<style>`，图表 canvas 的 JS 调色板 hex 为允许例外）。
- 人检：scoped `<style>` 里颜色/圆角是否全走变量。
- 依据：[design-tokens.md](../theme/design-tokens.md)（含「哪些 token 是运行时 CSS 变量」——只有颜色 + 圆角是 CSS 变量）。

## G3 · 组件用法与图标分工

**检查**：
- UI 一律用 Arco Vue 组件（`a-*`）。
- **图标分工**：组件内建功能性图标（Modal 关闭、Select 箭头、DatePicker 日历等）用 **Arco 默认，不替换**；业务/内容图标从 `@arco-iconbox/vue-pangea-mobile` **命名导入**。
- 不启用 `iconBox` 全局替换；不用 `@arco-design/web-vue/es/icon` 或 iconfont.cn。

**怎么查**：检查图标 import 来源；确认未在 `vite.config.ts` 开启 `iconBox`。

## G4 · 响应式适配

**检查**（见 [responsive-design.md](../patterns/responsive-design.md) 与 SKILL「响应式适配」）：
- 表单多列栅格用 Arco Grid 断点（`:xs/:sm/:lg`），**不写死 `:span`**；整行字段 `:span="24"`。
- 卡片/磁贴网格用 CSS `repeat(auto-fill|auto-fit, minmax(...))`，不写死列数。
- 表格窄屏可用（`:scroll={x}` 或隐列）。
- 工具栏/筛选行 `flex-wrap`；固定像素宽度（modal/面板）不超视口；辅助区（锚点/侧栏）窄屏可隐藏。

**怎么查**：拖动窗口宽度或折叠侧边栏，确认列数收敛、无溢出/挤压。

## G5 · 背景分层

**检查**（见 SKILL「页面背景」）：
- Layout 内容区默认透明，**背景由页面自己设**——不依赖 Layout 提供背景。
- 常规内容页（列表/表单/详情）页面根设白底 `var(--color-bg-1)`。
- 仪表板/工作台类聚合页页面根保持透明（漏出 body 灰底），区块用**白底无边框卡片**（`:bordered="false"`）区隔，可加大圆角 + 极轻阴影。

**怎么查**：确认页面根有明确背景；仪表板类未用边框线做卡片区隔。

## G6 · 交互完整性

**检查**：
- **四态齐全**：空态、加载态、错误态、禁用态都有合理呈现。
- 表单**提交与校验二选一**，不混用（声明式 `@submit-success` 或命令式 `validate()`，见 [form-patterns.md](../patterns/form-patterns.md)）。
- 分页 `total` 与真实数据联动、不写死；筛选后复位页码（见 [table-patterns.md](../patterns/table-patterns.md)）。
- 一组操作只突出一个主操作（`type="primary"`）。

**怎么查**：走查空数据/请求失败/提交中/禁用等路径。

## G7 · 可访问性

**检查**：
- 纯图标按钮有可访问名（`aria-label` 或 tooltip 文本）。
- 正文对比度 ≥ 4.5:1；状态不只靠颜色传达（配图标/文字）。
- 用语义化标签与结构。

**怎么查**：检查图标按钮的可访问名；对比度用工具核对；状态列除颜色外有文字/图标。

## G8 · 生成层级

**检查**（见 [project-structure.md](project-structure.md)）：
- 页面放 `src/pages/<PageName>/index.vue`，注册为全局 Layout 路由的 `children`。
- 已在 `GlobalLayout.vue` 的 `menuItems` 追加对应菜单项。
- **未重写/替换全局 Layout**（除非明确被要求）。

**怎么查**：确认路由已注册、菜单已加、Layout 未被改动。

## G9 · AI 代码常见陷阱（模板 / 响应式）

> 这些错误 **Vite dev server 不会拦**，只在运行时暴露（常表现为**空白页**或功能不更新）。AI 生成 Vue 代码时高发，务必自检。

**检查**：
- **模板里禁止出现 TypeScript 类型注解**：`<template>` 中的内联函数（`v-on`/`v-bind`/作用域插槽等）**不能带 `: Type` / `?: Type`**。
  - ✗ 反例：`@click="(e: MouseEvent) => handle(e)"`、`:disabled-date="(current?: Date) => ..."`
  - ✓ 正确：把函数抽到 `<script setup>` 里（`const onClick = (e: MouseEvent) => {...}`），模板只写 `@click="onClick"`；或在模板里写不带注解的版本 `(current) => ...`。
- **响应式推导必须用 `computed()`**：对 `ref`/`reactive` 数据做过滤/排序/派生，用 `import { computed } from 'vue'` 的 `computed`，**不能用普通 `function` 调用一次赋值**（那样不会随依赖更新）。
  - ✗ 反例：`function computedFiltered(){...}; const filteredRooms = computedFiltered()`
  - ✓ 正确：`const filteredRooms = computed(() => rooms.value.filter(...))`
- **模板里禁止 `async`**：不要写 `@click="async () => await ..."`；异步逻辑放到 script 的方法里。

**怎么查**：
- `vue-tsc --noEmit`（G1）能捕获**模板内 TS 注解**这类致命语法错误——这也是「先类型检查再依赖 dev server」的原因。
- 人检/搜索：在 `<template>` 区域搜 `?:`、`: Date`、`: MouseEvent`、`: string`、`: number`、`async ` 等模式；搜 `function` 是否被用来对 `ref`/`reactive` 数据做派生（应改 `computed`）。

---

## 交付前速查（一句话版）

需求文档已确认才动手（G0）· 编译过 + **先类型检查再依赖 dev server**（G1）· 颜色圆角走变量、间距字号落档（G2）· Arco 组件 + 图标分工对（G3）· 响应式收敛不溢出（G4）· 背景由页面设、仪表板用无边框白卡（G5）· 空/载/错/禁四态 + 校验不重复 + 分页联动（G6）· 图标按钮有可访问名、不只靠颜色（G7）· 页面是 Layout 子路由 + 菜单已加（G8）· 模板无 TS 注解 / 派生用 computed / 模板无 async（G9）。
