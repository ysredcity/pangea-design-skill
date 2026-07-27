# 变更日志（CHANGELOG）

本文件记录 `pangea-design-skill` 的重要变更。格式参考 [Keep a Changelog](https://keepachangelog.com/)。

事实源与版本约定见 [CONTRIBUTING.md](./CONTRIBUTING.md)。当前基线：主题包 `@arco-themes/vue-pangea-3-linear` **v1.0.11**，peer `@arco-design/web-vue ^2.57.0`。

> 逐日细粒度流水见 `PROJECT_CONTEXT.md` 台账；本文件按版本归组「重要变更」。

---

## [Unreleased]

### 计划中
- 新增定制业务组件文档（`references/components-custom/`）。
- 继续补充更多页面模板（详情页、仪表盘固化模板、多条件高级列表页等）。
- 定夺脚手架 `src/pages/` 内示例页（Example/CardList/ContractForm/GroupedForm/Dashboard）是否保留为自带示例。

---

## [1.0.1] - 2026-07-23

> 定位刷新为海信集团 B 端 / 中后台产品；补齐页面模板体系、仪表板示例、图表（按需引入）、响应式与背景分层全局准则。

### Added
- **页面模板**（`references/patterns/page-*.md`，基于 Figma 设计稿；脚手架含示例页 + 路由 + 菜单）：卡片列表页（a-card 网格 + 高级筛选面板）、对话框表单、分组表单页（折叠分组 + 锚点导航）。
- **仪表板示例页（非固化模板）** `src/pages/Dashboard/index.vue`：KPI 指标卡 + 流程中心/我的项目表格 + 分段占比条 + VChart 环形图；灰底 + 无边框白卡 + 响应式。
- **页面生成决策树**（`SKILL.md`）：按场景与模板匹配度决定「套模板 / 增补 / AI 自主设计」，自主设计也须用设计系统组件 + token。
- **图表（VChart）章节 + 按需引入机制**：图表库 `@visactor/vchart` **不进基础依赖**，通过 `src/components/LazyChart.vue`（动态 import + 优雅降级）+ `vite.config.ts` 可选依赖处理（未装时 external，保证没装也能 build）；需要时 `npm i @visactor/vchart`。
- **响应式适配（全局准则）**（`SKILL.md`）：表单多列栅格用 Arco Grid 断点（`:xs/:sm/:lg`）不写死 `:span`、卡片网格用 CSS `auto-fill/fit minmax`、表格横滚/隐列、工具栏 `flex-wrap`、固定宽防溢出；5 个模板已落地。
- **页面背景（全局准则）**（`SKILL.md`）：Layout 内容区默认透明（漏出 body 灰底），背景由各页面自设——常规内容页白底、仪表板类页透明 + 无边框白卡区隔。
- 新增测试场景 `_tests/cases/S3-meeting-room-booking.md`（会议室预约系统，综合检验多个页面模板选型与组装）。

### Changed
- **skill 定位刷新为「海信集团 B 端 / 中后台产品」**（管理后台、业务系统、数据平台、内部工具）：`SKILL.md` 新增「定位与适用范围」章节，frontmatter description 更新。
- **图标分工根因修复**：移除 `vite.config.ts` 中 `vitePluginForArco` 的 `iconBox` 全局替换选项（它会连带替换 Arco 组件内建功能性图标、破坏组件内部样式）；确立分工「功能性/组件内建图标用 Arco 默认，业务/内容图标从图标包命名导入」；删除治标的 `arco-fixes.less`；同步 `project-structure.md`/`SKILL.md`/`README.md`/`getting-started.md`/`theming.md`。
- **非颜色 token 化**：确认主题包只把**颜色 + 圆角**注入为运行时 CSS 变量；`GlobalLayout.vue`/`layout-menu.less` 硬编码圆角改 `var(--border-radius-*)`；`design-tokens.md` 补「哪些 token 是运行时 CSS 变量」。
- **背景分层调整**：`GlobalLayout` 内容区背景由白改**透明**，背景责任下放到各页面（4 个内容页加白底、仪表板示例改透明 + 无边框白卡）。
- **全局 Layout / 菜单细节修正**：菜单各状态样式对齐组件设计稿（默认透明 / hover / 选中白底 + `primary-7` + medium）、Header 图标/Logo/平台名调整、侧边栏展开/折叠按钮、固定视口高度仅内容区滚动等。

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
