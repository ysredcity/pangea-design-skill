---
name: pangea-design-vue
description: "⚠️ 硬约束（最高优先级）：任何「生成 / 新建系统、模块、页面」的需求，**必须先输出「界面架构需求文档」并经用户明确确认，确认后的下一轮才写代码；禁止同一轮里既出需求文档又动工程**（脚手架初始化、复制模板、`npm install`、写 `.vue`/路由/菜单都算）。本 skill 是海信集团 Pangea 设计体系的 Vue 3 前端参考，面向海信集团 B 端 / 中后台产品（管理后台、业务系统、数据平台等），基于 `@arco-design/web-vue` + 定制主题包 `@arco-themes/vue-pangea-3-linear`。当用户要求构建海信 B 端/中后台的 Vue 页面、管理后台、业务系统界面、列表页/表单页/分步表单页/详情页/审批详情页/仪表盘，或使用 Pangea 主题/公司组件库编写前端代码，或需要把生成的 Vue 工程部署 / 嵌入到飞书 aily、妙搭 Miaoda、Coze 等平台（嵌入式单文件构建），或提到 Pangea、Pangea 3 Linear、`@arco-themes/vue-pangea-3-linear`、`@arco-design/web-vue`、`a-button`、`a-table`、`a-form`、`a-modal`、`a-select`、`Message`、任意 Arco Vue 组件名、VChart 图表时使用。覆盖需求规格化、页面模板与选型决策、主题包接入、Pangea 设计 token（品牌青绿主色、语义色、字号、间距、圆角、对话框宽度档位）、暗黑模式、响应式布局、图表（VChart）与质量门禁。"
---

# Pangea Design Vue Skill

海信集团前端设计体系 **Pangea** 的 Vue 3 实现说明。

## 🚦 最高优先级：两阶段强制门（先确认需求文档，再写代码）

**任何「生成 / 新建系统、模块、页面」的需求，必须分两个回合完成，禁止在同一轮里既出需求文档又出工程代码。**

| 阶段 | 你要做的 | 你**禁止**做的 |
|---|---|---|
| **阶段一（本轮）** | 有限轮澄清（最多 1–2 轮，一次性打包问）→ 输出**界面架构需求文档** → **明确请用户确认或修改** → **结束本轮回复，停下等待** | ❌ 创建 / 修改任何工程文件（含脚手架初始化、**复制 `templates/project-starter/`**、`degit`、`npm install`、起 dev server、写 `.vue`/路由/菜单）<br>❌ 在同一条回复里继续进入生成<br>❌ 说「已确认，我继续」自问自答 |
| **阶段二（用户确认后的下一轮）** | 按已确认文档逐页生成 → 类型检查 → 质量门禁 → 交付 | ❌ 偏离已确认文档（要改先说明） |

**判定「已确认」的唯一标准**：用户在**看到需求文档之后**给出明确肯定答复（如「确认」「可以」「按这个做」「开始开发」）。以下都**不算**确认：用户最初那句需求、用户回答澄清问题、用户说「继续」但还没看到文档、你自己推断"应该没问题"。

**唯一可跳过本门的情形**（从严解释，拿不准就走门）：① 已确认文档下的增量（加/改一个文档里已写清的页面）；② 纯样式 / 文案 / 单点微调（如「按钮改次要」）；③ 用户**显式**要求「不用出文档，直接做」。

> 违反表现：一轮回复里同时产出了 `requirement.md` 和 `src/pages/**` —— 这是**错误**，必须避免。完整流程见 [需求规格化](references/overview/requirement-intake.md)。

## 定位与适用范围

本 skill 面向**海信集团 B 端 / 中后台产品**——管理后台、业务系统、数据平台、内部工具等企业级 Web 应用。典型页型为列表页、表单页、详情页、仪表盘等信息密集型界面，强调**一致性、规范性、可交付性**，而非营销官网 / C 端消费级视觉。生成界面时以「规范执行」为先，不做规范外的自由发挥。

Pangea 在开源组件库 `@arco-design/web-vue`（Arco Design Vue）之上，套用海信定制主题包 **`@arco-themes/vue-pangea-3-linear`**（由 Arco 官方主题定制工具产出）。因此：

- **组件的 API（属性/事件/插槽/用法）与 Arco Design Vue 完全一致** —— 直接沿用本 skill `references/components/` 与 `references/patterns/` 中的说明。
- **视觉 token（颜色、字体、间距、圆角、阴影、组件尺寸）由 Pangea 主题包决定** —— 取值以 `references/theme/` 为准，不要使用 Arco 默认蓝色调色板。
- 公司自有的**定制业务组件**将后续补充（见文末「后续补充」）。

## 核心目的与受众

本 skill 的产出物**始终是一个完整的 Vue 纯前端工程**，同时服务两类使用者（产物结构一致，**差别只在数据来源**）：

- **产品经理（PM）**：快速产出**高保真 demo 原型**（mock 数据），用于评审、对齐、演示。
- **开发工程师**：基于 **PRD 直接产出符合设计规范的 UI 界面**（对接既有后端接口）。

生成页面时，结构 / 组件 / 主题 token 完全一致；PM demo 用内联 mock，开发交付把 mock 换成接口请求即可，页面骨架与路由层级不变。

### 纯前端铁律

- **产出范围仅限前端**：页面、路由、组件、样式、前端状态、mock 数据 / 调用既有接口。**不产出、不设计、不涉及任何后端代码或服务**（数据库、服务端 API 实现、鉴权后端等一律不做）。
- 需要数据时：demo 用前端 mock（内存数据 / 假接口）；开发交付对接**既有**后端接口（`fetch`/`axios` 等前端调用），但不实现后端。
- 若需求隐含后端能力（如"新建一个登录后端"），只产出前端部分并说明后端不在本工程范围。

工程结构、依赖引用与生成层级见 [project-structure.md](references/overview/project-structure.md)；可直接复制运行的脚手架见 `templates/project-starter/`。

### 工程结构与生成层级铁律

- 技术栈：Vue 3 + Vite + TS + Vue Router + `@arco-design/web-vue` + Pangea 主题包/图标包。
- **产出页面不能独立运行**，必须落在完整工程里。**始终基于脚手架 `templates/project-starter/` 起步**（已实测 install/build/dev 通过）：**首选把 skill 自带的该目录直接复制到目标位置**（不依赖外网）；拿不到本地模板时才退到 `npx degit ysredcity/pangea-design-skill/skills/pangea-design-vue/templates/project-starter my-app`（需 GitHub 出网，沙箱/内网可能失败）。不要只交付孤立 `.vue` 文件。详见 [project-structure.md](references/overview/project-structure.md)。
- **主题包** `@arco-themes/vue-pangea-3-linear` 通过 `@arco-plugins/vite-vue` 的 `theme` 选项接入（脚手架已内置）；`less` 为必需 devDep；`main.ts` 显式 `import` 主题 `theme.css` 以保证运行时 CSS 变量。
- **图标分工（铁律）**：组件内建的**功能性图标**（Modal 关闭、Select 下拉箭头、DatePicker 日历等）用 **Arco 默认，不替换**（不启用 `iconBox` 全局替换，否则会破坏组件内部样式）；**业务/内容图标**从 Pangea 图标包**命名导入**（如 `import { IconGlobal } from '@arco-iconbox/vue-pangea-mobile'`），`font-size` 控制大小、`color` 控制颜色；不确定图标名就问用户，不臆造。
- **全局 Layout 是稳定骨架，具体页面是它内部的路由子页面**：页面放 `src/pages/<PageName>/index.vue`，注册为全局 Layout 路由的 `children`，渲染在 Layout 的 `<router-view/>` 中。
- 全局 Layout 已按 Figma 设计稿（Pangea Design PC Templates）**标准化实现**，包含：顶部 Header（48px）、左侧可折叠侧边栏（200px，自定义 Menu 样式）、右侧内容区（左上圆角 8px，背景由页面自设）。**不要重写/替换全局 Layout**（除非明确被要求）。
- **混合菜单结构**：顶部 Header 是**横向模块菜单**、左侧是**当前模块的多级菜单**；数据模型为 `GlobalLayout.vue` 的 `modules`（`{ key, title, menu }[]`，每模块独立菜单）。**按场景判断单/多模块**：层级简单 → `modules` 只配 1 个（自动隐藏顶部模块菜单，退化为纯侧边菜单）；层级复杂需分业务域 → 配多个模块。新增页面 = 建页面 + 注册子路由 + 加进**所属模块**的 `menu`。菜单样式见 `src/layouts/layout-menu.less`（侧边选中：白底 + `primary-7` + medium；顶部模块选中：`primary-6` 文字）。详见 [project-structure.md](references/overview/project-structure.md)。

## 生成前：需求规格化（第一步，先对齐再动手）

**不论用户输入是「一句话需求」还是「完整 PRD」，生成任何实际代码之前，先把它转化为一份面向界面架构的需求文档并经用户确认。** 这一步消除输入颗粒度差异导致的生成质量波动。

流程（参考头脑风暴的原理，但**克制、限轮**）：

1. **理解意图**：从输入中提取目标用户/角色、核心场景、关键实体与数据、主要操作。
2. **有限轮澄清**：只针对**影响界面架构**的模糊点（模块划分、页面清单、每页形态、关键字段/列、角色差异、数据来源、特殊交互）提问；**一次性打包成一组问，最多 1–2 轮**；仍不明确的用合理默认假设补齐并在文档标注，不无限追问。能按中后台常规推断的（分页、校验、CRUD、空/加载/错误态）不问。
3. **产出需求文档**：以界面架构为中心，含①概述 ②模块划分（对应顶部模块）③菜单与导航（对应左侧菜单）④页面清单与每页结构（页型/套用模板/布局/关键内容/交互）⑤全局约定 ⑥待确认假设。
   - ⚠️ **命中页面模板的页面，布局结构必须以该模板文档的「## 页面结构」为基准逐区块照抄**，只允许做**显式标注**的增补 `[增补]` / 删减 `[删减]`；不要在需求文档里另行设计一套结构（否则文档与模板不一致，产出会与模板存在偏差）。无模板可用时才写「自定义页型（无模板）」并自拟结构。
4. **确认闸门（硬停止）**：输出需求文档后，**请用户确认并结束本轮回复**——不要在同一轮继续生成任何工程文件。用户明确确认（或改后确认）**模块划分、菜单设定、页面清单、每页布局与交互**，**下一轮**才进入下方决策树逐页生成 → 类型检查 → 质量门禁 → 交付。建议把需求文档留存到工程 `docs/requirement.md`。

> ⛔ 参见顶部「🚦 两阶段强制门」：**同一轮里既产出需求文档又产出工程代码是错误的**。「已确认」= 用户看到文档后的明确肯定答复；用户的初始需求、对澄清问题的回答都**不算**确认。

已确认文档下的增量迭代（加/改单个已说清的页面）、纯样式/文案微调、明确的单点修改，以及用户显式要求「不用出文档直接做」时可跳过本步骤（从严解释）。完整流程、澄清问题清单与需求文档模板见 [requirement-intake.md](references/overview/requirement-intake.md)。

## 页面生成决策树（先选型，再动手）

**在需求文档确认后**，对文档中的每个页面按其「页型」走本决策树：**先判断场景与现有页面模板的匹配度**，据此选择「套用模板」还是「AI 自主设计」。核心原则：**能套模板就套模板；套不了也必须用设计系统的组件与 token，不自由发挥。**

```
需求场景
  │
  ├─ 是否命中现有页面模板？（见 references/patterns/ 的页面模板）
  │    ├─ 基础表格列表、单关键词/单条件搜索      → 套用「简单列表页」page-simple-list.md
  │    ├─ 数据以卡片形式呈现（图文/资源/应用墙）  → 套用「卡片列表页」page-card-list.md
  │    ├─ 字段少、轻量、弹窗内录入/编辑（不跳转）  → 套用「对话框表单」page-modal-form.md
  │    ├─ 字段较多、单一表单、独立页面录入/编辑    → 套用「基础表单页」page-form.md
  │    ├─ 字段极多、一次填完、需分组 + 锚点定位    → 套用「分组表单页」page-grouped-form.md
  │    ├─ 大型复杂录入、需拆成阶段逐步填写 +
  │    │  多种录入交互（含可编辑子表单/上传）      → 套用「分步表单页」page-step-form.md
  │    ├─ 查看已录入数据（只读展示，页面/抽屉/弹窗）→ 套用「详情页」page-detail.md
  │    ├─ **流程审批的详情与处理（公司强制）**      → 套用「审批详情页」page-approval-detail.md
  │    │
  │    └─ 高匹配（结构基本一致，仅字段/列不同）
  │         → 直接复制模板，替换字段/列/数据，不改结构与样式约定
  │
  ├─ 部分匹配（主体像某模板，但有额外区块）
  │    → 以最接近的模板为骨架，在其基础上增补区块；
  │      增补部分仍只用 Arco Vue 组件 + Pangea token
  │
  └─ 低匹配 / 无模板可套（如仪表盘、看板、特殊交互页）
       → 由 AI 自主设计页面布局，但【硬性约束】：
         · 只用 Arco Vue 组件（a-*），不自造组件、不引入其它 UI 库
         · 颜色只用语义 token / 调色板变量，圆角用 var(--border-radius-*)
         · 字号/字重/间距落在 Pangea 档位（见 design-tokens.md）
         · 布局遵循全局 Layout 生成层级（页面是 Layout 子路由）
         · 需要图表时用 VChart（见下方「图表」）
         · 参考 references/patterns/ 的既有模式（表单/表格/弹窗/响应式）
```

**判断匹配度的三个维度**：① 页面主体形态（列表 / 表单 / 展示 / 混合）；② 字段或列的规模；③ 是否需要分组、锚点、图表等特殊结构。拿不准时优先套最接近的模板并增补，而不是从零设计。

页面模板清单见下方「Skill 索引 → 模式」。各模板与常用组件的**「适用任务 / 变体 / 组合边界」结构化元数据**见 [metadata-schema.md](references/overview/metadata-schema.md)（机读索引 `references/_generated/catalog.json`），可用于更精细的选型判断。

> ⚑ **动手前先过 G0（需求文档已确认），生成或修改任何页面后，务必按 [质量门禁](references/overview/quality-gates.md)（G0–G9）逐项自检再交付**：编译、Token 规范、组件与图标分工、响应式、背景分层、交互四态、可访问性、生成层级、AI 代码常见陷阱（模板内 TS 注解 / 响应式用 computed / 模板 async）。
> ⚠️ **先类型检查、再依赖 dev server**：Vite dev server 默认不做类型检查——模板内的非法语法（如内联函数带 TS 注解 `(v?: Date) =>`）不会阻止启动，却会让组件运行时编译失败、页面渲染成**空白页**。生成/修改后先跑 `vue-tsc --noEmit`（或 `npm run gate`）确认无误，**不要只凭「dev server 起来了、无报错」就判定页面正常**。

## 图表（VChart）

需要数据可视化（折线、柱状、饼图、仪表盘指标图等）时，**优先使用 VChart 图表库**（VisActor 出品，开源）：仓库 https://github.com/VisActor/VChart 。

- **按需引入，不进基础依赖**：`@visactor/vchart` **不在脚手架基础依赖里**（体积约 2MB，保持 base 轻量）。需要图表时才安装：`npm i @visactor/vchart`。
- **用脚手架的 `LazyChart` 封装**（`src/components/LazyChart.vue`）：它**动态 import** vchart——装了就渲染，没装显示占位提示且**不影响 dev/build**。`vite.config.ts` 已把该包按可选依赖处理：**build** 侧 `external` + `optimizeDeps.exclude`；**dev** 侧还额外注册了一个 `apply: 'serve'` 的解析兜底插件，把未安装的包指向「一 import 就抛错」的虚拟模块。⚠️ 这个 dev 兜底是必须的——`optimizeDeps.exclude` 只跳过预构建，**dev 的 import 分析仍会解析裸包名**，解析失败会让整个模块返回 **HTTP 500**，`LazyChart` 里的 `try/catch` 根本执行不到，结果是**引用图表的页面整页加载失败**（表现为对应菜单"点了没反应"）。用法：`<LazyChart :spec="chartSpec" height="240px" />`，`spec` 为 VChart 配置对象。
- **图表配色接入 Pangea 调色板**：系列色取 Pangea 色板；但注意 **VChart 在 canvas 上渲染，需要字面色值**（不能用 CSS 变量 `var(--x)`）——从 design-tokens.md 基础色板取对应 `-6` 阶 hex（primary `#00aaa6`、arcoblue `#165dff`、gold `#f7ba1e`、purple `#722ed1` 等）定义系列色数组；主色系列用品牌青绿 `#00aaa6`。
- 图表容器、卡片外框仍用 Arco 组件（`a-card` 等）+ Pangea token 承载；环形图中心文字用绝对定位 div 覆盖更稳。
- 不确定 VChart 具体 API 时参考其官方文档；图表**数据用 mock**（demo）或对接既有接口（开发交付），不实现后端。
- **完整可运行示例见脚手架 `templates/project-starter/src/pages/Dashboard/index.vue`**（工作台/仪表板：KPI 卡 + 表格 + 分段占比条 + 经 LazyChart 的 VChart 环形图，灰底 + 无边框白卡 + 响应式），可作为仪表板类页面的组装参考。

## 关键约定

编写 Pangea（Arco Design Vue + Pangea 主题）代码时始终遵守这些规则：

- 使用 Vue 3。新代码优先使用 `<script setup lang="ts">` 和 Composition API。
- 组件库完整引入：

```ts
import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import App from './App.vue';

const app = createApp(App);
app.use(ArcoVue);
app.mount('#app');
```

- **接入 Pangea 主题包**：在引入组件库样式之后应用 `@arco-themes/vue-pangea-3-linear`（推荐用 `@arco-plugins/vite-vue` 的 `theme` 选项自动注入；详见 [theming.md](references/overview/theming.md)）。
- 组件与服务从根包导入：`import { Button, Table, Form, Message } from '@arco-design/web-vue'`。
- **业务/内容图标**从 **Pangea 图标包**命名导入：`import { IconGlobal } from '@arco-iconbox/vue-pangea-mobile'`（命名导入，不依赖 `iconBox` 插件选项）。**功能性/组件内建图标用 Arco 默认，不替换、不启用 iconBox 全局替换**；也不要用 iconfont.cn。
- 默认全局组件标签使用 `a-` 前缀：`<a-button>`、`<a-table>`、`<a-form>`、`<a-form-item>`。
- 模板中的属性使用 kebab-case：`html-type`、`show-jumper`、`row-selection`。
- 事件使用 Vue 语法：`@click`、`@change`、`@page-change`、`@submit-success`。
- 双向绑定使用 `v-model` 或命名形式：`v-model:visible`、`v-model:selected-keys`、`v-model:current`。
- 插槽使用 `#slot-name`；作用域插槽参数以组件文档为准。
- 表单使用 `:model`、`field` 和校验规则；子输入控件用 `v-model`。
- 日期时间组件内部使用 `dayjs`；不要引入 Moment.js。
- 优先使用本 skill 中的 Vue 示例。不要套用 React 专属 API，例如 `Form.useForm`、JSX children 或 `Component.Sub`。
- **`<template>` 里不写 TypeScript 类型注解**：模板中的内联函数（`v-on`/`v-bind`/作用域插槽）不能带 `: Type` / `?: Type`——如 `@click="(e: MouseEvent) => ..."`、`:disabled-date="(current?: Date) => ..."` 都会让模板编译失败、页面渲染成**空白页**（Vite dev server 不拦，只在运行时暴露）。把函数抽到 `<script setup>`（`const onClick = (e: MouseEvent) => {...}`），模板只写 `@click="onClick"`。
- **响应式派生用 `computed()`**：对 `ref`/`reactive` 数据做过滤 / 排序 / 派生，用 `import { computed } from 'vue'` 的 `computed`，不要用普通 `function` 调用一次赋值（那样不会随依赖更新）。详见 [质量门禁 G9](references/overview/quality-gates.md)。

### 主题取值铁律（Pangea 专属）

- **颜色只用语义 token 或 Pangea 调色板变量**，绝不硬编码 hex：
  - 语义色：`var(--color-text-1)`、`var(--color-bg-2)`、`var(--color-border-2)`、`var(--color-fill-2)` 等。
  - 品牌/状态色以 RGB 分量存储，需包 `rgb()`：`rgb(var(--primary-6))`、`rgba(var(--primary-6), 0.2)`、`rgb(var(--success-6))`。
- **品牌主色是青绿色 `#00aaa6`（`--primary-6`）**，不是 Arco 默认蓝。交互主色用 `primary-6`，hover 用 `primary-5`，active 用 `primary-7`。
- 间距用 4px 倍数档位，圆角按钮/输入框 4px、卡片/弹窗 8px，正文字号 14px。
- 使用语义 token 而非调色板直接值，可自动适配暗黑模式（`body[arco-theme='dark']`）。
- **数据可视化、多色标签/分类、图表系列等语义色不够用的场景**，从 design-tokens.md「基础色板」取扩展色（15 个色系 × 10 级，如 `rgb(var(--purple-6))`、`rgb(var(--cyan-6))`），仍用 `rgb(var(--x-n))` 变量而非硬编码。
- 完整取值见 [design-tokens.md](references/theme/design-tokens.md)。

### 响应式适配（全局准则）

生成的**每个页面都必须做响应式适配**。中后台工作区常见 1280–1920，但内容区实际宽度会随侧边栏展开/折叠、浏览器分屏、笔记本小屏而变化，也要兼容约 1024 的窄屏——**不允许固定死宽导致字段挤压、内容溢出或非预期横向滚动**。

- **表单多列栅格用 Arco Grid 断点，不写死 `:span`**：多列表单的 `a-col` 用响应式断点让列数随宽度收敛。标准配方——3 列表单用 `:xs="24" :sm="12" :lg="8"`（窄屏 1 列 / 平板 2 列 / 桌面 3 列），2 列表单用 `:xs="24" :sm="12"`；整行字段（textarea、子表单等）保持 `:span="24"`。断点：xs<576 / sm≥576 / md≥768 / lg≥992 / xl≥1200 / xxl≥1600。
- **卡片 / 磁贴网格用 CSS grid 自适应**：`grid-template-columns: repeat(auto-fill, minmax(<最小宽>, 1fr))`，随容器宽度自动增减列数，不写死列数。
- **表格窄屏保可用**：设 `:scroll="{ x }"` 横向滚动，或隐藏次要列、改卡片/列表展示。
- **操作栏 / 筛选行允许换行**：工具栏用 `flex-wrap`，避免按钮组与搜索框在窄屏互相挤压溢出。
- **固定像素宽度需设上限并防溢出**：弹窗、面板等固定宽度必须 `≤` 视口宽度（如 modal 在窄屏改用更小宽度或全屏）；侧栏、锚点等辅助区在窄屏可隐藏或下移。对话框宽度另有**硬性档位约束**（520 / 720 / 1000，确认类 400），见下文「对话框宽度」。
- 优先用 Arco Grid 的断点属性表达响应式，能不写媒体查询就不写；确需媒体查询时放在组件 scoped 样式里。详见 [responsive-design.md](references/patterns/responsive-design.md)。

### 页面背景（全局准则）

全局 Layout 的**内容区默认透明**，漏出 body 层灰色（`--color-fill-2`）。**具体背景色由每个页面自己决定**，不要依赖 Layout 提供背景——新页面务必显式设置自己的背景：

- **常规内容页**（列表页、表单页、详情页等，页面本身是一整块内容）：页面根元素设白底 `background: var(--color-bg-1)`，铺满内容区。内容区的左上圆角 + overflow 会把白底裁出圆角，自动复现「白面板悬浮在灰底」的观感。
- **仪表板 / 工作台类聚合页**（多个独立区块拼合）：页面根**保持透明**（露出灰底），页内每个区块用**白底卡片**承载（`a-card` 白底、**去边框** `:bordered="false"`）——灰底 + 无边框白卡是这类页的标准做法，靠底色差异而非边框线区隔区块。卡片建议用**大圆角** `var(--border-radius-large)` + **极轻阴影**（如 `box-shadow: 0 1px 4px rgba(0,0,0,0.05)`）增强区隔与层次；卡内强调图标可用「浅底色芯片」（强调色 10% 透明度做底、同色图标）提升设计感。
- 灰底取 `--color-fill-2`（与 Layout body 一致），白底取 `--color-bg-1`，均用变量，不写死 hex。

### 对话框宽度（全局准则，硬约束）

对话框宽度**只有三个档位**，且**不允许超过 1000**：

| 档位 | 用在什么场景 |
|---|---|
| **520** | 默认档。字段少的轻量录入、单个选择/输入、简单信息展示（`a-modal` 不传 `width` 就是 520） |
| **720** | 字段较多需要 2 列栅格、或内容较长需要更多横向空间 |
| **1000** | **仅当弹窗内含表格等宽组件时**（只读子表单表格、可编辑明细表格、宽数据列表）才允许使用 |

- **不得写 712 / 800 / 960 / 1200 这类非档位值**，也**不得超过 1000**（更宽的内容说明它不该待在弹窗里 → 改用独立页面，见 [page-form.md](references/patterns/page-form.md)）。
- **1000 档要能说出理由**：弹窗里没有表格就不要用 1000，降到 720 或 520。
- **确认类弹窗固定 400**：删除确认、操作确认、风险提示等用 `Modal.confirm / warning / info / error / success`（simple 模式），规范宽度 **400px**，**不要传 `width`**。
  - ⚠️ 脚手架已内置一条全局覆盖 `.arco-modal-simple { box-sizing: border-box }`（`src/styles/arco-overrides.less`）。原因：`.arco-modal` 是 **content-box**，simple 模式把 `padding: 24px 32px 32px` 加在**根节点**上，Arco 自带的 `width: 400px` 在 content-box 下实际渲染成 **464px**；改 border-box 后 400 才是真实视觉宽度。**复制脚手架时勿丢这个文件与 `main.ts` 里的引入。**
- 窄屏仍要防溢出：固定宽度不能超过视口，窄屏改小宽度或 `fullscreen`。
- **机检**：`npm run check:tokens`（含在 `npm run gate`）会扫 `<a-modal>` 的字面 `width`，非档位或 >1000 直接报错；`width="auto"`、`fullscreen`、绑定表达式跳过。

## Skill 索引

需要完整属性、事件、插槽、示例和使用要点时，加载对应参考文件。

### 主题（Pangea 专属，先读）

| 主题 | 文件 | 适用场景 |
|---|---|---|
| 设计 Token | [design-tokens.md](references/theme/design-tokens.md) | Pangea 全部 token：品牌青绿主色、语义色、调色板、字体、间距、尺寸、圆角、阴影、过渡、层级、组件级 token、暗黑模式、CSS 变量速查 |
| 主题接入 | [theming.md](references/overview/theming.md) | 安装并接入 `@arco-themes/vue-pangea-3-linear`、样式引入顺序、`@arco-plugins/vite-vue` 配置、Less 变量定制、暗黑模式切换 |

### 安装与配置

| 主题 | 文件 | 适用场景 |
|---|---|---|
| 需求规格化（生成前第一步） | [requirement-intake.md](references/overview/requirement-intake.md) | **生成代码前**把任意颗粒度输入转成面向界面架构的需求文档：有限轮澄清、问题清单、需求文档模板（模块/菜单/页面结构/交互）、确认闸门 |
| 部署配置 | [deployment.md](references/overview/deployment.md) | **交付/部署前必读**：默认（Hash + 相对 base）/ 嵌入式单文件（飞书 aily·妙搭·Coze·iframe）/ History（需 SPA fallback）三种模式、**环境识别信号表**（agent 自动选命令，用户不必选）、白屏排错速查、体积权衡 |
| 工程结构与生成层级 | [project-structure.md](references/overview/project-structure.md) | 项目脚手架、主题包/图标包引用约定、全局 Layout 下的路由页面生成层级、PM demo 与开发交付差异；脚手架样例见 `templates/project-starter/` |
| 安装 | [getting-started.md](references/overview/getting-started.md) | 安装 `@arco-design/web-vue`、注册 ArcoVue、引入样式、接入 Pangea 主题、配置按需加载 |
| 全局配置 | [config-provider.md](references/overview/config-provider.md) | 使用 `app.use(ArcoVue, options)` 或 `<a-config-provider>` 配置语言、前缀、尺寸等 |
| 国际化 | [internationalization.md](references/overview/internationalization.md) | 语言包和 `<a-config-provider :locale="...">` |
| 架构约定 | [architecture.md](references/overview/architecture.md) | Vue 3 SFC 结构、导入、`v-model`、属性、事件、插槽、组件注册 |
| 质量门禁 | [quality-gates.md](references/overview/quality-gates.md) | **G0（生成前：需求文档已确认）+ 生成后自检清单（G1–G9）**：编译（先类型检查再依赖 dev server）/Token/组件与图标/响应式/背景分层/交互四态/可访问性/生成层级/AI 代码常见陷阱（模板内 TS 注解·computed·async） |
| 元数据 Schema | [metadata-schema.md](references/overview/metadata-schema.md) | 页面模板/组件选型元数据的 frontmatter 规范（适用任务/变体/组合边界）+ `catalog.json` 生成约定 |

### 通用

| 组件 | 文件 | 适用场景 |
|---|---|---|
| Button | [button.md](references/components/general/button.md) | 操作按钮、加载按钮、图标按钮、按钮组 |
| ConfigProvider | [config-provider.md](references/components/general/config-provider.md) | 全局语言、前缀、尺寸、滚动更新等配置 |
| Icon | [icon.md](references/components/general/icon.md) | Arco `Icon` 组件的通用机制参考。**图标分工**：功能性/组件内建图标用 Arco 默认（不替换）；**业务图标**从图标包 `@arco-iconbox/vue-pangea-mobile` 命名导入，见[工程结构](references/overview/project-structure.md)。不用 iconfont.cn |
| Link | [link.md](references/components/general/link.md) | 链接及其状态、图标链接 |
| Typography | [typography.md](references/components/general/typography.md) | 标题、段落、文本、省略、复制、编辑 |

### 布局

| 组件 | 文件 | 适用场景 |
|---|---|---|
| Divider | [divider.md](references/components/layout/divider.md) | 水平或垂直分割线 |
| Grid | [grid.md](references/components/layout/grid.md) | 24 栅格、响应式行列布局 |
| Layout | [layout.md](references/components/layout/layout.md) | 页面骨架、页头、侧边栏、内容区、页脚 |
| Space | [space.md](references/components/layout/space.md) | 行内或块级元素间距 |

### 导航

| 组件 | 文件 | 适用场景 |
|---|---|---|
| Breadcrumb | [breadcrumb.md](references/components/navigation/breadcrumb.md) | 页面层级和路由面包屑 |
| Dropdown | [dropdown.md](references/components/navigation/dropdown.md) | 下拉菜单和命令浮层 |
| Menu | [menu.md](references/components/navigation/menu.md) | 侧边导航、顶部导航、子菜单 |
| PageHeader | [page-header.md](references/components/navigation/page-header.md) | 页头、返回操作、面包屑、额外操作 |
| Pagination | [pagination.md](references/components/navigation/pagination.md) | 分页、跳转、页大小切换 |
| Steps | [steps.md](references/components/navigation/steps.md) | 步骤流程和进度 |

### 数据录入

| 组件 | 文件 | 适用场景 |
|---|---|---|
| AutoComplete | [auto-complete.md](references/components/data-entry/auto-complete.md) | 输入建议和搜索补全 |
| Cascader | [cascader.md](references/components/data-entry/cascader.md) | 多级级联选择 |
| Checkbox | [checkbox.md](references/components/data-entry/checkbox.md) | 多选、全选、半选状态 |
| ColorPicker | [color-picker.md](references/components/data-entry/color-picker.md) | 颜色选择 |
| DatePicker | [date-picker.md](references/components/data-entry/date-picker.md) | 日期、周、月、季度、年、范围选择 |
| Form | [form.md](references/components/data-entry/form.md) | 表单、校验、动态字段、布局、提交处理 |
| Input | [input.md](references/components/data-entry/input.md) | 文本输入、搜索、密码、文本域相关模式 |
| InputNumber | [input-number.md](references/components/data-entry/input-number.md) | 数字输入、精度、最小/最大值 |
| InputTag | [input-tag.md](references/components/data-entry/input-tag.md) | 标签输入和编辑 |
| Mention | [mention.md](references/components/data-entry/mention.md) | 在文本中提及用户或主题 |
| Radio | [radio.md](references/components/data-entry/radio.md) | 单选和单选组 |
| Rate | [rate.md](references/components/data-entry/rate.md) | 评分 |
| Select | [select.md](references/components/data-entry/select.md) | 选择器、多选、搜索、选项插槽 |
| Slider | [slider.md](references/components/data-entry/slider.md) | 滑动输入和范围输入 |
| Switch | [switch.md](references/components/data-entry/switch.md) | 布尔开关 |
| Textarea | [textarea.md](references/components/data-entry/textarea.md) | 多行文本输入 |
| TimePicker | [time-picker.md](references/components/data-entry/time-picker.md) | 时间和时间范围选择 |
| Transfer | [transfer.md](references/components/data-entry/transfer.md) | 两栏穿梭选择 |
| TreeSelect | [tree-select.md](references/components/data-entry/tree-select.md) | 树形数据选择 |
| Upload | [upload.md](references/components/data-entry/upload.md) | 文件上传、拖拽上传、图片上传 |
| VerificationCode | [verification-code.md](references/components/data-entry/verification-code.md) | 验证码或 OTP 输入 |

### 数据展示

| 组件 | 文件 | 适用场景 |
|---|---|---|
| Avatar | [avatar.md](references/components/data-display/avatar.md) | 用户头像和头像组 |
| Badge | [badge.md](references/components/data-display/badge.md) | 数字徽标、状态点、通知标记 |
| Calendar | [calendar.md](references/components/data-display/calendar.md) | 日历展示 |
| Card | [card.md](references/components/data-display/card.md) | 内容卡片和卡片栅格 |
| Carousel | [carousel.md](references/components/data-display/carousel.md) | 轮播图 |
| Collapse | [collapse.md](references/components/data-display/collapse.md) | 折叠面板 |
| Comment | [comment.md](references/components/data-display/comment.md) | 评论展示和嵌套评论 |
| Descriptions | [descriptions.md](references/components/data-display/descriptions.md) | 键值详情展示 |
| Empty | [empty.md](references/components/data-display/empty.md) | 空状态 |
| Image | [image.md](references/components/data-display/image.md) | 图片展示和预览 |
| List | [list.md](references/components/data-display/list.md) | 列表和虚拟列表 |
| OverflowList | [overflow-list.md](references/components/data-display/overflow-list.md) | 折叠溢出的列表项 |
| Popover | [popover.md](references/components/data-display/popover.md) | 富内容气泡卡片 |
| Statistic | [statistic.md](references/components/data-display/statistic.md) | 数值、倒计时、指标 |
| Table | [table.md](references/components/data-display/table.md) | 表格、列、排序、筛选、选择、虚拟滚动 |
| Tabs | [tabs.md](references/components/data-display/tabs.md) | 标签页、可编辑标签页、卡片式标签页 |
| Tag | [tag.md](references/components/data-display/tag.md) | 标签、可选标签、可关闭标签 |
| Timeline | [timeline.md](references/components/data-display/timeline.md) | 时间线和活动流 |
| Tooltip | [tooltip.md](references/components/data-display/tooltip.md) | 悬浮或聚焦文字提示 |
| Tree | [tree.md](references/components/data-display/tree.md) | 树形层级数据 |

### 反馈

| 组件 | 文件 | 适用场景 |
|---|---|---|
| Alert | [alert.md](references/components/feedback/alert.md) | 行内警告提示 |
| Drawer | [drawer.md](references/components/feedback/drawer.md) | 抽屉面板和抽屉表单 |
| Message | [message.md](references/components/feedback/message.md) | 全局轻量提示 |
| Modal | [modal.md](references/components/feedback/modal.md) | 对话框、确认流程、弹窗表单 |
| Notification | [notification.md](references/components/feedback/notification.md) | 富内容全局通知 |
| Popconfirm | [popconfirm.md](references/components/feedback/popconfirm.md) | 轻量确认气泡 |
| Progress | [progress.md](references/components/feedback/progress.md) | 线形/环形进度 |
| Result | [result.md](references/components/feedback/result.md) | 成功、错误、404 等结果状态 |
| Skeleton | [skeleton.md](references/components/feedback/skeleton.md) | 骨架屏加载占位 |
| Spin | [spin.md](references/components/feedback/spin.md) | 加载中 |

### 其他

| 组件 | 文件 | 适用场景 |
|---|---|---|
| Affix | [affix.md](references/components/other/affix.md) | 滚动时固定元素 |
| Anchor | [anchor.md](references/components/other/anchor.md) | 页内锚点导航 |
| BackTop | [back-top.md](references/components/other/back-top.md) | 回到顶部 |
| ResizeBox | [resize-box.md](references/components/other/resize-box.md) | 可伸缩容器和分割面板 |
| Scrollbar | [scrollbar.md](references/components/other/scrollbar.md) | 自定义滚动条 |
| Split | [split.md](references/components/other/split.md) | 面板分割 |
| Trigger | [trigger.md](references/components/other/trigger.md) | 基础弹出触发和定位 |
| Watermark | [watermark.md](references/components/other/watermark.md) | 文字或图片水印 |

### 模式

| 主题 | 文件 | 适用场景 |
|---|---|---|
| 简单列表页 | [page-simple-list.md](references/patterns/page-simple-list.md) | 基础表格列表页：标题 + 操作栏（按钮组+简单搜索）+ 表格（行选择）+ 分页；无复杂查询条件 |
| 卡片列表页 | [page-card-list.md](references/patterns/page-card-list.md) | 以卡片呈现数据列表（图文/资源/应用墙）：标题 + 操作栏（按钮组+搜索/筛选）+ 卡片网格（a-card 自适应换行）+ 分页；数据比表格更适合卡片时使用 |
| 对话框表单 | [page-modal-form.md](references/patterns/page-modal-form.md) | 字段少、轻量的弹窗内录入/编辑：a-modal + 2 列栅格垂直表单 + 取消/确定；不跳转独立页面 |
| 基础表单页 | [page-form.md](references/patterns/page-form.md) | 字段较多的独立数据录入/编辑页：顶部操作栏（返回+标题+提交）+ 可选提示 + 垂直表单（多列栅格，含 input/select/switch/datepicker/radio/子表单） |
| 分组表单页 | [page-grouped-form.md](references/patterns/page-grouped-form.md) | 字段极多的长表单：折叠分组（a-collapse）+ 右侧锚点导航（a-anchor）快速定位 + 多样表单形态；分组多、表单长时使用 |
| 分步表单页 | [page-step-form.md](references/patterns/page-step-form.md) | **大型复杂录入**：页头步骤条（a-steps）分步推进 + 每步折叠分组 + 多种录入交互（基础控件 / 只读子表单 / 可编辑子表单 / 上传）+ 逐步校验 + 末步复核提交 |
| 详情页 | [page-detail.md](references/patterns/page-detail.md) | **查看已录入数据**：只读字段（label 在上/值在下）+ 长文本 + 只读附件列表 + 只读子表单表格；**内容抽成组件，可被独立页面 / a-drawer 抽屉 / a-modal 对话框复用** |
| 审批详情页 | [page-approval-detail.md](references/patterns/page-approval-detail.md) | **流程审批场景的公司强制模板**：页头（流程标题 + 状态 tag + 打印/传阅）+ 提交人信息行 + 悬浮快速审批 + 灰底白卡（业务详情复用 DetailContent + 审批流程区：Tabs / 显示审批记录 / 审批记录表格 / 处理区） |
| 表单模式 | [form-patterns.md](references/patterns/form-patterns.md) | 复杂表单、校验、动态字段、表单提交 |
| 表格模式 | [table-patterns.md](references/patterns/table-patterns.md) | 远程表格、插槽、行选择、分页 |
| 弹窗模式 | [modal-patterns.md](references/patterns/modal-patterns.md) | 弹窗表单、确认、全局反馈 |
| 受控值 | [controlled-uncontrolled.md](references/patterns/controlled-uncontrolled.md) | `v-model`、`default-*`、受控/非受控状态 |
| 响应式设计 | [responsive-design.md](references/patterns/responsive-design.md) | 栅格断点、响应式表单、自适应仪表盘 |

### 组件选型元数据

选组件/模板时可查各自的**「适用任务 / 变体 / 组合边界 / 常见坑」**结构化元数据：

- 页面模板：各 `references/patterns/page-*.md` 顶部 frontmatter 的 `meta`。
- 常用组件：[references/component-selection/](references/component-selection/)（Table / Form / Modal / Card / Tabs / Select / Badge / Menu / Pagination / Alert）。
- **机读汇总**：`references/_generated/catalog.json`（由 `scripts/build-catalog.mjs` 从上述 frontmatter 生成）——快速选型/过滤时读它。**改元数据后需重跑生成器**。字段规范见 [metadata-schema.md](references/overview/metadata-schema.md)。

## PM Demo 模式（产品经理多轮迭代）

当使用者是产品经理（PM），目标是快速产出/迭代高保真 demo 原型时，agent 必须**全权托管工程生命周期**，让 PM 只需要：对话 + 浏览器预览。PM 不应接触终端、不应处理编译错误、不应手动执行任何命令。

### Agent 职责清单

| 阶段 | Agent 必须做的事 | PM 需要做的事 |
|---|---|---|
| **首次生成**（⚠️ 仅在需求文档**已被 PM 确认**后执行；未确认时本行一律不做） | 1. 从脚手架初始化完整工程<br>2. 执行 `npm install`<br>3. 生成页面后**先跑 `vue-tsc --noEmit`（或 `npm run gate`）确认无类型/模板错误**<br>4. 再启动 `npm run dev`（后台）<br>5. 告知 PM 预览地址（如 `http://localhost:5173/`） | 打开浏览器访问地址 |
| **每轮修改** | 1. 修改代码<br>2. **跑 `vue-tsc --noEmit` 确认无类型/模板错误**（⚠️ Vite HMR 不做类型检查，不能只看「热更新了、无控制台报错」就当没问题——模板内 TS 注解等错误会让页面空白）<br>3. 有错自动修复直到 `vue-tsc` 通过<br>4. 告知 PM「已更新，刷新浏览器即可」 | 刷新浏览器看效果 |
| **页面空白 / 编译报错** | 优先跑 `vue-tsc --noEmit` 定位（dev server 无报错也可能已空白）；定位错误、自动修复，**不要把报错信息抛给 PM** | 无需任何操作 |
| **Dev server 意外停止** | 自动重启 dev server，确认恢复后告知 PM | 无需任何操作 |
| **会话结束/PM 说"完了"** | 告知 PM 工程位置；按部署目标跑对应构建（默认 `npm run build`；aily / 妙搭 / iframe 等嵌入式环境用 `npm run build:embed` 出**单个 HTML**）并**实测产物能打开**，见 [deployment.md](references/overview/deployment.md) | 保存工程目录即可 |

> **dev 预览与交付构建是两套配置**：`npm run dev` 只管开发体验（HMR、分包快编译）；交付时按部署目标选构建命令（默认 / `build:embed` / `build:history`）。部署模式由 agent 按 [deployment.md](references/overview/deployment.md) 的环境识别信号表自动判断，**不要让用户在模式之间做选择**。

### 交互话术约定

Agent 对 PM 的反馈应简洁、非技术性：

```
✅ 好的用法：
- "页面已更新，刷新浏览器看效果"
- "预览地址：http://localhost:5173/leave/mine"
- "已完成，你的工程在 /path/to/my-app，下次打开 Kiro 可以继续迭代"

❌ 避免的用法：
- "请在终端执行 npm run dev"
- "编译报错：TS2345 Argument of type..."
- "请检查 tsconfig.json 中的 strict 配置"
```

### 工程初始化流程（首次对话）

当 PM 首次提出需求且当前目录无已有工程时，**严格按下面的回合边界执行**——注意「初始化工程 / `npm install` / 起 dev server」全部属于**第二回合**，第一回合只出文档：

**第一回合（本轮只做这两步，然后停下）**

1. **需求规格化并确认（硬停止）**：按 [需求规格化](references/overview/requirement-intake.md) 把 PM 的需求转成「界面架构需求文档」（有限轮澄清，最多 1–2 轮、一次性打包问）→ **发给 PM 请其确认或修改** → **结束本轮回复，停下等待**。问答对 PM 用非技术语言，聚焦「要哪些页面、每页长什么样」。
2. **顺便问一下目标目录**（可与澄清问题一起打包问）：demo 放哪（或用默认路径如 `~/pangea-demos/<需求名>`）。
   > ⚠️ 本回合**不要**创建工程、不要 `degit` / 复制脚手架、不要 `npm install`、不要起 dev server、不要写任何 `.vue`/路由/菜单——这正是[顶部两阶段门](#-最高优先级两阶段强制门先确认需求文档再写代码)禁止的行为。文档此时先放在会话里；工程建好后再落盘到 `docs/requirement.md`。

**第二回合（PM 明确确认文档之后）**

3. **初始化工程**：从 skill 自带的 `templates/project-starter/` **复制**到目标目录（详见下方「起步方式」）。
4. **安装依赖**：后台执行 `npm install`，等待完成。
5. **生成页面**：按已确认的需求文档写页面 + 路由 + mock 数据，并把需求文档存到 `docs/requirement.md`。
6. **类型检查把关**：跑 `vue-tsc --noEmit`（或 `npm run gate`）确认无类型/模板错误，有错先修复至通过——**不要只依赖 dev server 判断**（Vite 不做类型检查，模板内 TS 注解等错误会让页面空白）。
7. **启动 dev server**：后台执行 `npm run dev`，监听输出确认 `Local: http://localhost:xxxx` 就绪。
8. **交付预览地址**：告诉 PM 打开浏览器访问具体路由。

若当前目录已有工程（PM 继续上次的迭代）：

1. **检查 dev server 是否在运行**：是 → 直接进入修改流程；否 → 自动启动。
2. **检查 `node_modules`**：不存在 → 先 `npm install`。

#### 起步方式（优先本地复制，不要默认走网络）

**首选：复制 skill 自带的模板目录**——skill 包里已经带了 `templates/project-starter/`，直接复制即可，不依赖任何外网：

```bash
cp -R <skill 目录>/templates/project-starter <目标目录> && cd <目标目录> && npm install
```

**备选（仅当拿不到本地模板时）**：`npx degit ysredcity/pangea-design-skill/skills/pangea-design-vue/templates/project-starter my-app`。

> ⚠️ `degit` 需要访问 GitHub，**在无外网出口的沙箱 / 内网环境会失败**，而此时本地模板其实就在 skill 包里——所以别把 degit 当默认路径。
> `npm install` 仍需访问 npm registry；三个核心包（`@arco-design/web-vue`、`@arco-themes/vue-pangea-3-linear`、`@arco-iconbox/vue-pangea-mobile`）都在**公共 npm registry** 上，无需配置私有源。若 `npm install` 失败，先查网络 / 代理 / Node 版本，不要去改 registry。

### 多页面路由导航提示

当 demo 包含多个页面时，每次生成/修改完毕，**告知 PM 所有可访问的路由**：

```
已完成，预览地址：
- 我的请假：http://localhost:5173/leave/mine
- 发起请假：http://localhost:5173/leave/apply
- 待我审批：http://localhost:5173/leave/approval
```

### 与 Kiro Hooks 协作

本 skill 配套提供以下 Kiro hooks（位于 `.kiro/hooks/`），在 PM demo 模式下辅助 agent：

- **`pm-dev-server`**（SessionStart）：会话开始时检查工程状态，自动安装依赖并启动 dev server。
- **`pm-compile-check`**（PostFileSave）：文件保存后检查编译输出，若有错误提醒 agent 修复。

这些 hooks 让 PM demo 模式的体验更加无缝——即使 PM 关闭 Kiro 后重新打开，环境也能自动恢复。

### 注意事项

- **不要让 PM 手动执行命令**。如果某个操作需要终端，agent 用工具执行。
- **编译错误是 agent 的事**。PM 不需要知道 TypeScript 是什么。
- **预览地址要包含具体路由路径**，不要只给根地址让 PM 自己找页面。
- 如果 PM 的修改需求导致了架构变化（如增加新依赖），agent 自行处理安装，不要问 PM。
- **端口冲突**：如果 5173 被占用，读取 Vite 输出中的实际端口告知 PM。

## 后续补充

以下内容将在后续迭代中加入本 skill（当前尚未提供）：

- **定制业务组件**：公司自研、对 Arco Vue 二次封装的业务组件（属性/事件/插槽/示例）。
- **更多页面模板**：高级列表页（多条件筛选）、详情页、表单页、仪表盘等。

在这些内容补充之前，业务组件与页面请基于上述标准 Arco Vue 组件 + Pangea 主题 token 组合实现。
