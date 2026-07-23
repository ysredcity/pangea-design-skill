---
name: pangea-design-vue
description: "海信集团 Pangea 设计体系的 Vue 3 前端参考，面向海信集团 B 端 / 中后台产品（管理后台、业务系统、数据平台等），基于 `@arco-design/web-vue` + 定制主题包 `@arco-themes/vue-pangea-3-linear`。当用户要求构建海信 B 端/中后台的 Vue 页面、管理后台、业务系统界面、列表页/表单页/详情页/仪表盘，或使用 Pangea 主题/公司组件库编写前端代码，或提到 Pangea、Pangea 3 Linear、`@arco-themes/vue-pangea-3-linear`、`@arco-design/web-vue`、`a-button`、`a-table`、`a-form`、`a-modal`、`a-select`、`Message`、任意 Arco Vue 组件名、VChart 图表时使用。覆盖页面模板与选型决策、安装、主题包接入、Pangea 设计 token（品牌青绿主色、语义色、字体、间距、圆角、阴影、组件 token）、暗黑模式、全局注册、按需加载、国际化、Vue 3 Composition API 约定、组件属性/事件/插槽、示例、表单、表格、弹窗、导航、数据录入、数据展示、图表（VChart）、反馈和响应式布局。"
---

# Pangea Design Vue Skill

海信集团前端设计体系 **Pangea** 的 Vue 3 实现说明。

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
- **产出页面不能独立运行**，必须落在完整工程里。**始终基于脚手架 `templates/project-starter/` 起步**（已实测 install/build/dev 通过；`npx degit ysredcity/pangea-design-skill/skills/pangea-design-vue/templates/project-starter my-app` 可一键起），不要只交付孤立 `.vue` 文件。详见 [project-structure.md](references/overview/project-structure.md)。
- **主题包** `@arco-themes/vue-pangea-3-linear` 与 **图标包** `@arco-iconbox/vue-pangea-mobile` 通过 `@arco-plugins/vite-vue` 的 `theme` / `iconBox` 选项接入（脚手架已内置）；`less` 为必需 devDep；`main.ts` 显式 `import` 主题 `theme.css` 以保证运行时 CSS 变量。
- 图标从图标包**命名导入**（如 `import { IconGlobal } from '@arco-iconbox/vue-pangea-mobile'`），`font-size` 控制大小、`color` 控制颜色；不确定图标名就问用户，不臆造。
- **全局 Layout 是稳定骨架，具体页面是它内部的路由子页面**：页面放 `src/pages/<PageName>/index.vue`，注册为全局 Layout 路由的 `children`，渲染在 Layout 的 `<router-view/>` 中。
- 全局 Layout 已按 Figma 设计稿（Pangea Design PC Templates）**标准化实现**，包含：顶部 Header（48px）、左侧可折叠侧边栏（200px，自定义 Menu 样式）、右侧内容区（白背景 + 左上圆角 8px）。**不要重写/替换全局 Layout**（除非明确被要求）。
- 侧边栏菜单数据通过 `GlobalLayout.vue` 中的 `menuItems` 配置；新增页面后同步追加菜单项。菜单样式已通过 `src/layouts/layout-menu.less` 覆盖 Arco 默认样式（选中态：白背景 + `primary-7` 文字 + medium 字重）。

## 页面生成决策树（先选型，再动手）

生成任何页面前，**先判断场景与现有页面模板的匹配度**，据此选择「套用模板」还是「AI 自主设计」。核心原则：**能套模板就套模板；套不了也必须用设计系统的组件与 token，不自由发挥。**

```
需求场景
  │
  ├─ 是否命中现有页面模板？（见 references/patterns/ 的页面模板）
  │    ├─ 基础表格列表、单关键词/单条件搜索      → 套用「简单列表页」page-simple-list.md
  │    ├─ 字段较多、单一表单录入/编辑            → 套用「基础表单页」page-form.md
  │    ├─ 字段极多、需分组 + 锚点定位的长表单     → 套用「分组表单页」page-grouped-form.md
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

页面模板清单见下方「Skill 索引 → 模式」。

## 图表（VChart）

需要数据可视化（折线、柱状、饼图、仪表盘指标图等）时，**优先使用 VChart 图表库**（VisActor 出品，开源）：仓库 https://github.com/VisActor/VChart 。

- Vue 场景用 `@visactor/vchart`（或其 Vue 封装），按需引入，避免与 Arco 组件职责重叠。
- **图表配色接入 Pangea token**：系列色优先取 Pangea 调色板（`rgb(var(--primary-6))`、`rgb(var(--cyan-6))`、`rgb(var(--purple-6))` 等，见 design-tokens.md「基础色板」），不自造色板；主色系列用品牌青绿 `primary-6`。
- 图表容器、卡片外框仍用 Arco 组件（`a-card` 等）+ Pangea token 承载。
- 不确定 VChart 具体 API 时，参考其官方文档；图表**数据用 mock**（demo）或对接既有接口（开发交付），不实现后端。

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
- 图标从 **Pangea 图标包**命名导入：`import { IconGlobal } from '@arco-iconbox/vue-pangea-mobile'`（经 `@arco-plugins/vite-vue` 的 `iconBox` 选项替换默认 Arco 图标）。**不要**从 `@arco-design/web-vue/es/icon` 引入默认图标，也不要用 iconfont.cn。
- 默认全局组件标签使用 `a-` 前缀：`<a-button>`、`<a-table>`、`<a-form>`、`<a-form-item>`。
- 模板中的属性使用 kebab-case：`html-type`、`show-jumper`、`row-selection`。
- 事件使用 Vue 语法：`@click`、`@change`、`@page-change`、`@submit-success`。
- 双向绑定使用 `v-model` 或命名形式：`v-model:visible`、`v-model:selected-keys`、`v-model:current`。
- 插槽使用 `#slot-name`；作用域插槽参数以组件文档为准。
- 表单使用 `:model`、`field` 和校验规则；子输入控件用 `v-model`。
- 日期时间组件内部使用 `dayjs`；不要引入 Moment.js。
- 优先使用本 skill 中的 Vue 示例。不要套用 React 专属 API，例如 `Form.useForm`、JSX children 或 `Component.Sub`。

### 主题取值铁律（Pangea 专属）

- **颜色只用语义 token 或 Pangea 调色板变量**，绝不硬编码 hex：
  - 语义色：`var(--color-text-1)`、`var(--color-bg-2)`、`var(--color-border-2)`、`var(--color-fill-2)` 等。
  - 品牌/状态色以 RGB 分量存储，需包 `rgb()`：`rgb(var(--primary-6))`、`rgba(var(--primary-6), 0.2)`、`rgb(var(--success-6))`。
- **品牌主色是青绿色 `#00aaa6`（`--primary-6`）**，不是 Arco 默认蓝。交互主色用 `primary-6`，hover 用 `primary-5`，active 用 `primary-7`。
- 间距用 4px 倍数档位，圆角按钮/输入框 4px、卡片/弹窗 8px，正文字号 14px。
- 使用语义 token 而非调色板直接值，可自动适配暗黑模式（`body[arco-theme='dark']`）。
- **数据可视化、多色标签/分类、图表系列等语义色不够用的场景**，从 design-tokens.md「基础色板」取扩展色（15 个色系 × 10 级，如 `rgb(var(--purple-6))`、`rgb(var(--cyan-6))`），仍用 `rgb(var(--x-n))` 变量而非硬编码。
- 完整取值见 [design-tokens.md](references/theme/design-tokens.md)。

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
| 工程结构与生成层级 | [project-structure.md](references/overview/project-structure.md) | 项目脚手架、主题包/图标包引用约定、全局 Layout 下的路由页面生成层级、PM demo 与开发交付差异；脚手架样例见 `templates/project-starter/` |
| 安装 | [getting-started.md](references/overview/getting-started.md) | 安装 `@arco-design/web-vue`、注册 ArcoVue、引入样式、接入 Pangea 主题、配置按需加载 |
| 全局配置 | [config-provider.md](references/overview/config-provider.md) | 使用 `app.use(ArcoVue, options)` 或 `<a-config-provider>` 配置语言、前缀、尺寸等 |
| 国际化 | [internationalization.md](references/overview/internationalization.md) | 语言包和 `<a-config-provider :locale="...">` |
| 架构约定 | [architecture.md](references/overview/architecture.md) | Vue 3 SFC 结构、导入、`v-model`、属性、事件、插槽、组件注册 |

### 通用

| 组件 | 文件 | 适用场景 |
|---|---|---|
| Button | [button.md](references/components/general/button.md) | 操作按钮、加载按钮、图标按钮、按钮组 |
| ConfigProvider | [config-provider.md](references/components/general/config-provider.md) | 全局语言、前缀、尺寸、滚动更新等配置 |
| Icon | [icon.md](references/components/general/icon.md) | Arco `Icon` 组件的通用机制参考（自定义图标注册、IconFont 等）。**Pangea 业务图标一律用图标包 `@arco-iconbox/vue-pangea-mobile`（命名导入），见[工程结构](references/overview/project-structure.md)**；不要用默认 Arco 图标或 iconfont.cn |
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
| 基础表单页 | [page-form.md](references/patterns/page-form.md) | 字段较多的独立数据录入/编辑页：顶部操作栏（返回+标题+提交）+ 可选提示 + 垂直表单（多列栅格，含 input/select/switch/datepicker/radio/子表单） |
| 分组表单页 | [page-grouped-form.md](references/patterns/page-grouped-form.md) | 字段极多的长表单：折叠分组（a-collapse）+ 右侧锚点导航（a-anchor）快速定位 + 多样表单形态；分组多、表单长时使用 |
| 表单模式 | [form-patterns.md](references/patterns/form-patterns.md) | 复杂表单、校验、动态字段、表单提交 |
| 表格模式 | [table-patterns.md](references/patterns/table-patterns.md) | 远程表格、插槽、行选择、分页 |
| 弹窗模式 | [modal-patterns.md](references/patterns/modal-patterns.md) | 弹窗表单、确认、全局反馈 |
| 受控值 | [controlled-uncontrolled.md](references/patterns/controlled-uncontrolled.md) | `v-model`、`default-*`、受控/非受控状态 |
| 响应式设计 | [responsive-design.md](references/patterns/responsive-design.md) | 栅格断点、响应式表单、自适应仪表盘 |

## PM Demo 模式（产品经理多轮迭代）

当使用者是产品经理（PM），目标是快速产出/迭代高保真 demo 原型时，agent 必须**全权托管工程生命周期**，让 PM 只需要：对话 + 浏览器预览。PM 不应接触终端、不应处理编译错误、不应手动执行任何命令。

### Agent 职责清单

| 阶段 | Agent 必须做的事 | PM 需要做的事 |
|---|---|---|
| **首次生成** | 1. 从脚手架初始化完整工程<br>2. 执行 `npm install`<br>3. 启动 `npm run dev`（后台）<br>4. 确认编译成功后，告知 PM 预览地址（如 `http://localhost:5173/`） | 打开浏览器访问地址 |
| **每轮修改** | 1. 修改代码<br>2. 确认 HMR 热更新生效（无编译错误）<br>3. 若编译报错，自动修复直到通过<br>4. 告知 PM「已更新，刷新浏览器即可」 | 刷新浏览器看效果 |
| **编译报错** | 读取终端输出，定位错误，自动修复，**不要把报错信息抛给 PM** | 无需任何操作 |
| **Dev server 意外停止** | 自动重启 dev server，确认恢复后告知 PM | 无需任何操作 |
| **会话结束/PM 说"完了"** | 告知 PM 工程位置；可选执行 `npm run build` 确认产物可构建 | 保存工程目录即可 |

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

当 PM 首次提出需求且当前目录无已有工程时：

1. **确认目标目录**：询问 PM 要把 demo 放哪（或用默认路径如 `~/pangea-demos/<需求名>`）。
2. **初始化**：从 `templates/project-starter` 创建工程（`npx degit` 或复制）。
3. **安装依赖**：后台执行 `npm install`，等待完成。
4. **启动 dev server**：后台执行 `npm run dev`，监听输出确认 `Local: http://localhost:xxxx` 就绪。
5. **生成页面**：按需求写页面 + 路由 + mock 数据。
6. **交付预览地址**：告诉 PM 打开浏览器访问具体路由。

若当前目录已有工程（PM 继续上次的迭代）：

1. **检查 dev server 是否在运行**：是 → 直接进入修改流程；否 → 自动启动。
2. **检查 `node_modules`**：不存在 → 先 `npm install`。

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
