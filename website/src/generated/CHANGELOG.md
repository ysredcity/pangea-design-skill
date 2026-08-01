# 变更日志（CHANGELOG）

本文件记录 `pangea-design-skill` 的重要变更。格式参考 [Keep a Changelog](https://keepachangelog.com/)。

事实源与版本约定见 [CONTRIBUTING.md](./CONTRIBUTING.md)。当前基线：主题包 `@arco-themes/vue-pangea-3-linear` **v1.0.11**，peer `@arco-design/web-vue ^2.57.0`。

> 本文件只记录 **skill 本身**（文档、规范、脚手架）的重要变更；官网 `website/`（showcase）的调整不在此列（其记录见 `PROJECT_CONTEXT.md` 台账）。逐日细粒度流水同样见台账；本文件按版本归组。

---

## [Unreleased]

### 计划中

**功能侧**
- 新增定制业务组件文档（`references/components-custom/`）。
- 继续补充更多页面模板（详情页、仪表盘固化模板、多条件高级列表页等）。
- 提升从需求到原型的集成性，论证是否可以包含 PRD 部分的输出。
- 通过套壳的方式，让原型能够边点击边查看交互描述，把 PRD 和原型混合交互式呈现，提升可读性。

**生态侧**
- 梳理不同产品构建类似设计系统的必备输入和结构，便于其他产品快速构建类似产物。

---

## [1.1.2] - 2026-07-23

> 需求文档对齐页面模板基准（修实测偏差）；系统名称单一来源 + 浏览器标题；单模块下去掉重复的模块名。

### Changed
- **需求文档必须以页面模板结构为基准**（`references/overview/requirement-intake.md` 新增「命中页面模板时：以模板结构为基准」+ `SKILL.md` 需求规格化第 3 步）：写每页布局前先判断是否命中模板，命中则**逐区块照抄该模板文档的「## 页面结构」**，只允许**显式标注**的 `[增补]` / `[删减]`；无模板才写「自定义页型（无模板）」。修正实测问题——需求文档自行设计结构、生成时又套模板，导致产出与模板存在偏差。需求文档模板的每页新增「套用模板」字段。
- **系统名称单一来源**：脚手架新增 `src/config/app.ts` 导出 `APP_NAME`，`GlobalLayout` 的 Header 品牌名改为引用它；生成工程时只需替换这一处（`project-structure.md` 已同步说明与目录树）。

### Fixed
- **浏览器标签页标题写死 `Pangea App`**：改为取系统名称——`main.ts` 设 `document.title = APP_NAME`，并用 `router.afterEach` 配合路由 `meta.title` 显示「页面名 · 系统名」；`index.html` 的 `<title>` 降为首屏占位并注明生成时替换。
- **单模块时侧边栏左上角模块名与 Header 系统名重复**：单模块下 Sidebar Head 整块隐藏（`v-if="isMultiModule"`），多模块仍显示当前模块名。

---

## [1.1.1] - 2026-07-23

> 修复外部工具实测发现的「生成页面全空白」，强化生成流程：类型检查前置 + AI 模板陷阱防护。

### Fixed
- **生成页面空白**：`<template>` 内写 TypeScript 类型注解（如 `:disabled-date="(current?: Date) => ..."`、`@click="(e: MouseEvent) => ..."`）会让 Vue 模板运行时编译失败、`router-view` 渲染成**空白页**；而 Vite dev server 不做类型检查、不报错——根因是生成流程「先起 dev server、后跑类型检查」，buggy 代码未被拦截。

### Added
- **质量门禁 G9「AI 代码常见陷阱」**（`references/overview/quality-gates.md`）：① `<template>` 内禁 TS 类型注解（抽到 `<script setup>`）；② 响应式派生必须用 `computed()`，不用普通函数调用一次赋值；③ 模板内禁 `async`。含正反例与自查方式。

### Changed
- **G1 增加执行顺序硬约束**：先跑通 `vue-tsc --noEmit`（或 `npm run gate`）确认无类型/模板错误，再启动或依赖 dev server；**不能只凭「dev server 起来了、无控制台报错」判定页面正常**。
- `SKILL.md`：「关键约定」补两条（`<template>` 不写 TS 注解、响应式派生用 `computed`）；决策树门禁提示与索引更新为 **G1–G9** 并加「先类型检查再依赖 dev server」警告；PM Demo 流程（首次生成 / 每轮修改 / 空白排错 + 初始化步骤）插入 `vue-tsc` 把关。
- 脚手架 `pm-compile-check` hook 提示补充：保存 `.vue` 后**额外跑 `vue-tsc`**，不要只看 dev server 输出（模板 TS 注解等错误 dev 不报却会空白）。

---

## [1.1.0] - 2026-07-23

> 大幅补齐海信 B 端 / 中后台体系：生成前**需求规格化**输入层、**质量门禁 + 组件/模板元数据**、**混合菜单**脚手架、页面模板体系与仪表板示例、图表按需引入、响应式与背景分层全局准则。skill 定位刷新为海信集团 B 端 / 中后台产品。

### Added
- **需求规格化（生成前第一步）**：`references/overview/requirement-intake.md` + `SKILL.md`「生成前：需求规格化」章节——任意颗粒度输入（一句话～完整 PRD）先转成**面向界面架构的需求文档**（模块划分↔顶部模块 / 菜单导航↔左侧菜单 / 逐页 页型+布局+关键内容+交互 / 待确认假设），参考头脑风暴但**克制限轮**（一次性打包问、最多 1–2 轮、余下用默认假设），用户确认后再逐页生成。确立流程：**需求规格化 → 决策树选型 → 生成 → G1–G8 门禁**。
- **质量门禁与元数据体系**：`references/overview/quality-gates.md`（生成后自检 G1–G8）、`metadata-schema.md`（元数据 frontmatter 规范）、`references/component-selection/`（10 个高频组件选型元数据）、5 个页面模板补 `meta` frontmatter、零依赖生成器 `scripts/build-catalog.mjs` → `references/_generated/catalog.json`；脚手架 `scripts/check-tokens.mjs` + `npm run gate`（check-tokens + vue-tsc + build）。
- **混合菜单结构**（脚手架 `GlobalLayout.vue`）：顶部 Header 横向**模块菜单** + 左侧**当前模块多级菜单**，按场景判断单/多模块（单模块自动隐藏顶部）；一级菜单可选图标、二级菜单不用图标（去 Arco 图标缩进占位）。数据模型 `modules: { key, title, menu }[]`。
- **页面模板**（累计 5 个）：卡片列表页（a-card 网格 + 高级筛选面板）、对话框表单、分组表单页（折叠分组 + 锚点导航）（+ 已有简单列表页、基础表单页）；**仪表板示例页（非固化模板）** `templates/project-starter/src/pages/Dashboard/index.vue`（KPI 卡 + 表格 + 分段占比条 + VChart 环形图，灰底 + 无边框白卡 + 响应式）。
- **页面生成决策树**（`SKILL.md`）：按场景与模板匹配度决定「套模板 / 增补 / AI 自主设计」，自主设计也须用设计系统组件 + token。
- **图表（VChart）按需引入**：`@visactor/vchart` **不进基础依赖**，经 `src/components/LazyChart.vue`（动态 import + 优雅降级）+ `vite.config.ts` 可选依赖处理（未装也能 build）；需要时 `npm i @visactor/vchart`。
- **响应式适配 & 页面背景分层（全局准则）**（`SKILL.md`）：栅格断点（`:xs/:sm/:lg`）/ 卡片自适应网格 / 表格横滚 / 工具栏换行 / 固定宽防溢出；内容区默认透明、背景由各页面自设（常规页白底、仪表板灰底无边框白卡）。
- 新增测试场景 `_tests/cases/S3-meeting-room-booking.md`（会议室预约系统，综合检验多个页面模板选型与组装）。

### Changed
- **skill 定位刷新为「海信集团 B 端 / 中后台产品」**（管理后台、业务系统、数据平台、内部工具）：`SKILL.md` 新增「定位与适用范围」章节，frontmatter description 更新。
- **图标分工根因修复**：移除 `vite.config.ts` 中 `vitePluginForArco` 的 `iconBox` 全局替换选项（它会连带替换 Arco 组件内建功能性图标、破坏组件内部样式）；确立分工「功能性/组件内建图标用 Arco 默认，业务/内容图标从图标包命名导入」；删除治标的 `arco-fixes.less`；同步 `project-structure.md`/`SKILL.md`/`README.md`/`getting-started.md`/`theming.md`。
- **非颜色 token 化**：确认主题包只把**颜色 + 圆角**注入为运行时 CSS 变量；`GlobalLayout.vue`/`layout-menu.less` 硬编码圆角改 `var(--border-radius-*)`；`design-tokens.md` 补「哪些 token 是运行时 CSS 变量」。
- **背景分层调整**：脚手架 `GlobalLayout` 内容区背景由白改**透明**，背景责任下放到各页面（内容页加白底、仪表板示例改透明 + 无边框白卡）。
- **全局 Layout / 菜单细节**：状态样式对齐设计稿（侧边选中白底 + `primary-7` + medium；顶部模块选中 `primary-6` + 下划线）、Header 图标/Logo/平台名、折叠按钮胶囊 + 悬停、固定视口高度仅内容区滚动。

### Fixed
- **菜单覆盖样式需 `!important`**（脚手架 `layout-menu.less`）：Arco 组件样式懒加载注入在全局 less 之后，部分覆盖仅靠特异性不稳——顶部模块菜单关键属性、侧边一级选中色 `primary-7`（Arco `.arco-menu-light .arco-menu-item.arco-menu-selected` 特异性 0,4,0）统一补 `!important`，不依赖注入顺序。
- **顶部模块菜单竖向滚动条**：Arco 基础 `.arco-menu-inner{overflow:auto}` 叠加自定义强制 48px 高，内容略超出会冒出竖滚动条——对模块菜单 inner 补 `overflow:hidden`。

---

## [1.0.0] - 2026-07-22

> 首个成型版本：从 skill 初始化到可运行脚手架、标准化全局 Layout、首批页面模板与 PM Demo 模式。

### Added
- 初始化 `skills/pangea-design-vue/` skill（派生自官方 arco-design-vue skill）：`SKILL.md`（品牌说明 / 关键约定 / 主题取值铁律 / 完整组件索引）、`references/theme/design-tokens.md`（Pangea 全量设计 token + 完整基础色板 15 色系 × 10 阶）、`references/overview/`（`theming.md`/`getting-started.md`/`project-structure.md` 定制 + `architecture.md`/`config-provider.md`/`internationalization.md` 照搬）、72 篇组件文档 + 模式文档（API 照搬上游）。
- 建立治理框架：`CONTRIBUTING.md`（贡献/维护规则、事实源约定、提交检查）+ `CHANGELOG.md`。
- **可运行脚手架** `templates/project-starter/`：Vue 3 + Vite + TS + Vue Router + Arco Vue，已内置并接入主题包 `@arco-themes/vue-pangea-3-linear` 与图标包 `@arco-iconbox/vue-pangea-mobile`；含 `package-lock.json`；支持 `npx degit ysredcity/pangea-design-skill/skills/pangea-design-vue/templates/project-starter my-app` 一键起项目。
- **PM Demo 模式**：`SKILL.md` 新增章节（agent 全托管工程生命周期，PM 只需对话 + 浏览器预览）；脚手架 `.kiro/hooks/` 内置 `pm-dev-server`（SessionStart 自动起 dev server）+ `pm-compile-check`（PostFileSave 自动编译检查）。
- **标准化全局 Layout**：基于 Figma「Pangea Design PC Templates / 菜单-展开」重写 `GlobalLayout.vue`（Header 48px + 可折叠侧边栏 200px + 内容区）+ 侧边栏自定义样式 `layout-menu.less`。
- **页面模板**：简单列表页、基础表单页（`references/patterns/page-simple-list.md`、`page-form.md`），基于 Figma；脚手架含示例页 + 路由 + 菜单。
- **纯前端铁律**：产出始终是完整 Vue 纯前端工程，范围仅限前端，不产出/不涉及后端代码或服务；demo 用 mock、开发对接既有接口但不实现后端。写入 `SKILL.md`/`project-structure.md`/`CONTRIBUTING.md`。
- 模式文档「本地补充」（通用最佳实践，非上游照搬）：`patterns/form-patterns.md`（提交与校验二选一，避免重复校验）、`patterns/table-patterns.md`（分页 `total` 与真实数据联动；插槽 `record` 为 `any` 的 TS7053 规避——改用接受 `string` 的 helper 查表）。源自场景测试 S1/S2 实测。
- 效果测试材料 `_tests/`（S1 请假管理、S2 商品管理，多页 + 路由 + 共享 mock store；本地保留、不入 Git）。

### Changed
- `design-tokens.md` 补全**基础色板**（15 色系 × 10 阶）并明确以主题包运行时（`theme.css`/`tokens.less`）为唯一事实源；Figma 与主题包在 Cyan 色系及 `red-7` 的差异统一以主题包为准。
- 图标引用统一到 Pangea 图标包命名导入，清理定制文档中默认 Arco 图标 / iconfont 残留。
- `project-structure.md`/`SKILL.md`/`CONTRIBUTING.md`：登记生成层级（页面为全局 Layout 子路由）与脚手架可运行性要点（`less` 必需、`main.ts` 显式引 `theme.css`、`vite-env.d.ts`）。

### Fixed
- 修复脚手架三处「跑不起来 / 样式不生效」缺口：新增 `src/vite-env.d.ts`（`*.vue` shim + 图标包 `declare module`）、`main.ts` 显式 `import '@arco-themes/vue-pangea-3-linear/theme.css'`、`package.json` 补 `less` devDep。经 `npm install` + `vue-tsc` + `vite build` + `npm run dev` 实测通过，产物 CSS 含青绿 `--primary-6: 0, 170, 166`。
- 修复场景测试暴露的表格插槽 `record` 无类型导致的 TS7053，并把经验回流到 `table-patterns.md`。
