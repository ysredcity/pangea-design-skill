# 变更日志（CHANGELOG）

本文件记录 `pangea-design-skill` 的重要变更。格式参考 [Keep a Changelog](https://keepachangelog.com/)。

事实源与版本约定见 [CONTRIBUTING.md](./CONTRIBUTING.md)。当前基线：主题包 `@arco-themes/vue-pangea-3-linear` **v1.0.11**，peer `@arco-design/web-vue ^2.57.0`。

---

## [Unreleased]

### Added
- 新增**纯前端铁律**：产出始终是完整的 Vue 纯前端工程，范围仅限前端（页面/路由/组件/前端状态/mock 或调用既有接口），**不产出、不涉及后端代码或服务**；demo 用 mock，开发对接既有接口但不实现后端。写入 `SKILL.md`（核心目的 + 「纯前端铁律」小节）、`project-structure.md`、`CONTRIBUTING.md`（核心原则 #7）。

### Changed
- 依据 skill 原型生成效果测试的发现，为两份模式文档增加「本地补充」小节（通用最佳实践，非上游照搬）：
  - `patterns/form-patterns.md`：新增「提交与校验：二选一，避免重复校验」——明确声明式（`@submit-success`）与命令式（`@click` + `validate()`）两种方式，禁止混用导致的重复校验。
  - `patterns/table-patterns.md`：新增「分页：客户端 vs 服务端」——`total` 必须与真实数据联动（客户端由 data 长度、服务端由接口返回），不写死；筛选后复位页码；`@page-change`/`@page-size-change` 事件骨架。另新增「插槽 record 的类型（TS strict 下的坑）」——插槽 `record` 为 `any`，索引强类型映射会 TS7053，改用接受 `string` 的 helper 查表（源自场景测试 S1/S2 实测发现）。
  - `CONTRIBUTING.md`：在「照搬」分类中登记这两个文件带本地补充小节，上游同步时应保留。

### 计划中
- 提供**标准化全局 Layout** 替换脚手架中的占位版 `GlobalLayout.vue`。
- 新增定制业务组件文档（`references/components-custom/`）。
- 新增页面模板文档（`references/templates/`）。

---

## 2026-07-21 — 脚手架可运行化 + 一键起项目

### Fixed
- 修复脚手架 `templates/project-starter/` 三处导致「跑不起来 / 样式不生效」的缺口（经 `npm install` + `vue-tsc` + `vite build` + `npm run dev` 实测通过）：
  - 新增 `src/vite-env.d.ts`：`*.vue` 类型 shim + `vite/client` 引用 + 图标包 `declare module`，解决 `vue-tsc` 找不到模块类型导致的 build 失败。
  - `main.ts` 显式 `import '@arco-themes/vue-pangea-3-linear/theme.css'`：保证运行时 CSS 变量（`--primary-6` 等）一定存在，不再依赖插件是否注入全局变量。已验证产物 CSS 含 `--primary-6: 0, 170, 166`（青绿）。
  - `package.json` 补 `less` devDep：缺失时 `vite build` 报 `Preprocessor dependency "less" not found`。

### Added
- 脚手架加入 `package-lock.json`（D：锁定依赖，保证跨机器可复现安装）。
- **一键起项目（degit）**：`npx degit ysredcity/pangea-design-skill/skills/pangea-design-vue/templates/project-starter my-app`，写入 README / starter README / `project-structure.md`。
- `project-structure.md` 新增「快速开始（从零到可运行）」与「接入既有工程（最小清单）」两节。

### Changed
- `project-structure.md`：更正「无需手动 import 主题 CSS」的旧说法为「main.ts 显式引入 theme.css」；依赖清单补 `less`；目录树补 `vite-env.d.ts`。
- `SKILL.md` 工程铁律：强调产出页面须落在完整工程、始终基于脚手架起步（含 degit），并列明 `less` / theme.css / vite-env.d.ts 三个可运行性要点。
- `CONTRIBUTING.md` E 节：脚手架列为「已验证可运行」基线，改依赖/配置后须重跑 install/build/dev 并更新 lockfile。

---

## 2026-07-21 — 工程结构与目的定义

### Added
- 明确 skill **核心目的与双受众**：同时服务 PM 出高保真 demo 原型（mock 数据）与开发基于 PRD 产出符合规范的 UI（真实接口），产物结构一致、仅数据来源不同。写入 `SKILL.md`。
- 新增 `references/overview/project-structure.md`：工程技术栈、依赖与引用约定、主题包/图标包接入、目录结构、**生成层级约定**（页面为全局 Layout 下的路由子页面）。
- 新增可运行脚手架 `templates/project-starter/`：Vue 3 + Vite + TS + Vue Router + Arco Vue，已内置并接入**主题包** `@arco-themes/vue-pangea-3-linear` 与**图标包** `@arco-iconbox/vue-pangea-mobile`（经 `@arco-plugins/vite-vue` 的 `theme` / `iconBox` 选项）。含 `GlobalLayout.vue` 占位版、`pages/Example` 示例页与子路由注册示例。

### Changed
- `SKILL.md`：新增「核心目的与受众」「工程结构与生成层级铁律」，并在索引中登记 `project-structure.md`。
- `CONTRIBUTING.md`：目录结构补充 `project-structure.md` 与 `templates/project-starter/`；新增「E. 工程脚手架与全局 Layout」治理条款；事实源速查表补充图标包与生成层级基线（图标包 v1.0.24）。

### Fixed
- 清理定制文档中残留的默认 Arco 图标引用，统一到 Pangea 图标包：
  - `SKILL.md` 关键约定改为从 `@arco-iconbox/vue-pangea-mobile` 命名导入，并明确「不要用 `@arco-design/web-vue/es/icon` 或 iconfont.cn」；Icon 索引行改为标注 icon.md 为 Arco 通用机制参考、业务图标走图标包。
  - `theming.md` 插件版 `main.ts` 示例移除 `ArcoVueIcon` 默认图标注册（由 `iconBox` 替换）。
  - `getting-started.md` 图标导入段改为 Pangea 图标包命名导入。
  - 注：`references/components/` 下的组件文档为「照搬」上游，其中图标示例保持原样；实际使用以 SKILL.md 全局图标规则为准。

### Notes
- 图标包 `@arco-iconbox/vue-pangea-mobile` 为命名导出（517 个图标组件，无默认 install 插件），图标继承 `currentColor`、以 `font-size` 控制大小。
- 全局 Layout 当前为占位版，标准化版本待团队提供后替换。

---

## 2026-07-21

### Added
- 初始化 `skills/pangea-design-vue/` skill，基于官方 arco-design-vue skill 派生。
  - `SKILL.md`：Pangea 品牌说明、关键约定、主题取值铁律、完整组件索引，并预留「后续补充」（定制业务组件 / 页面模板）。
  - `references/theme/design-tokens.md`：Pangea 全量设计 token（品牌青绿主色 `#00aaa6`、语义色、字体、间距、尺寸、圆角、阴影、过渡、层级、组件级 token、暗黑模式、CSS 变量速查）。
  - `references/overview/theming.md`：主题包 `@arco-themes/vue-pangea-3-linear` 接入（`@arco-plugins/vite-vue` 的 `theme` 选项 / 直接引入 CSS·Less、Less 变量定制、暗黑模式）。
  - `references/overview/getting-started.md`：安装组件库 + 接入 Pangea 主题包。
- 逐字照搬开源 Arco 的开发用法文档：`architecture.md`、`config-provider.md`、`internationalization.md`，以及 72 篇组件文档、5 篇模式文档（组件 API 与上游一致）。
- 建立治理框架：`CONTRIBUTING.md`（贡献与维护规则、事实源约定、提交检查）、`CHANGELOG.md`（本文件）。

### Changed
- `design-tokens.md` 补充**完整基础色板**：15 个色系 × 10 级色阶（品牌/中性、状态色、扩展色），结合 Figma 导出（Mode 1）整理，并新增「场景扩展用法建议」（数据可视化、多色分类等）。
- 明确取值以主题包运行时（`theme.css`/`tokens.less`）为唯一事实源。经比对，Figma 导出与主题包在 Cyan 色系及 `red-7` 上存在差异，统一以主题包为准（Figma 侧由维护者手动对齐）。

### Notes
- 组件 API 相关文档为「照搬」上游，非 Pangea 定制内容；仅在上游组件库 API 变化时更新。
