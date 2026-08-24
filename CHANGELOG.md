# 变更日志（CHANGELOG）

本文件记录 `pangea-design-skill` 的重要变更。格式参考 [Keep a Changelog](https://keepachangelog.com/)。

事实源与版本约定见 [CONTRIBUTING.md](./CONTRIBUTING.md)。当前基线：主题包 `@arco-themes/vue-pangea-3-linear` **v1.0.11**，peer `@arco-design/web-vue ^2.57.0`。

> **本文件写给 skill 使用者**，只回答一件事：**这个版本多了什么能力、升级后有什么不一样**。一条一行，看完即可判断是否需要调整用法。
>
> 以下内容**不在本文件**，都在 `PROJECT_CONTEXT.md`（工程台账，供日常迭代）：同一版本内对新增内容的返工与修正（你看到的只有最终状态）、根因排查与踩坑细节、逐项实测记录、仓库工具与官网 `website/` 的调整。
>
> 具体用法看文档：模板规范在 `references/patterns/`，全局准则在 `SKILL.md`。

---

## [Unreleased]

### 计划中

**功能侧**
- 继续补充更多页面模板（仪表盘固化模板、多条件高级列表页等）。
- 提升从需求到原型的集成性，论证是否可以包含 PRD 部分的输出。
- 通过套壳的方式，让原型能够边点击边查看交互描述，把 PRD 和原型混合交互式呈现，提升可读性。

**生态侧**
- 梳理不同产品构建类似设计系统的必备输入和结构，便于其他产品快速构建类似产物。

---

## [1.4.2] - 2026-08-22

> 新增第 10 个页面模板：**基础列表页**——筛选能力更强的表格列表页。

### Added

- **基础列表页模板 `page-filter-list.md`**（[文档](skills/pangea-design-vue/references/patterns/page-filter-list.md) · 预览路由 `/filter-list`）：表格列表页，但支持**多字段同时查询**与**筛选方案**保存/复用。页头区域（筛选方案 + 搜索 + 可展开的高级筛选面板 + 按钮组）复用卡片列表页的形态，表格与分页复用简单列表页的形态。
- 与简单列表页的定位差异**只在筛选复杂度**：简单列表页每次只能单字段查询；基础列表页支持多字段同时筛选。

---

## [1.4.1] - 2026-08-22

> 新增 **`references/design.md`**：跨页型 / 跨组件的设计规则从此只有一处。新增两条设计约定（**表单承载容器决策路径**、**按钮组规范**），并修正「表格控件用 `size="small"`」这个错误结论。

### Added

- **全局设计规则 `references/design.md`**（[文档](skills/pangea-design-vue/references/design.md)）：跨 2 个以上页型或组件生效的规则的唯一事实源，分三组——容器与布局 / 组件与交互 / 取值与适配。`SKILL.md` 只留一句话结论 + 锚点。
- **表单承载容器决策路径**：出现「新建 / 编辑」时判断该用**对话框 / 抽屉 / 表单页**。先按预估完成时间（≤30s → 对话框、30s~3min → 抽屉、>3min → 表单页），再看特定场景覆盖（2 步短字段 → 对话框分步；≥3 步或含分支 → 抽屉/表单页；≥3 组 → 抽屉；≥3 组 + 锚点 → 表单页；填写时必须持续参考页面数据 → 非模态抽屉），最后给出落到哪个页面模板。
- **按钮组规范**：靠左的按钮组按重要性**从左至右**、靠右的**从右至左**（最重要的离容器边缘最近）；超过 3 个用 `a-dropdown` 折叠次要项；**同一组最多 1 个 `type="primary"`**。
- **控件密度分档**：明确密度**按区域分档、不是全局一律 `small`**——列表类页面的操作栏按钮 / 搜索 / 树内搜索框 `small`，**表格自身 `medium`**，分页器 `small`，**表单页控件与操作栏按钮用默认尺寸**，表格内联控件 `small` / `mini`。
- **状态不只靠颜色传达**：状态必须「颜色 + 文字」双通道（表格状态列用 `a-badge :status :text`），图表系列要有图例区分，纯图标按钮要有可访问名，正文对比度 ≥ 4.5:1。
- **单组件选型速查表**：10 个高频组件的一句话误用排除（如「Select 选项 2–3 个改 `a-radio-group`」），一处看全。

### Fixed

- **纠正「表格用 `size="small"`」的错误结论**：脚手架所有表格实际是 `size="medium"`，此前 `component-selection/table.md` 写的是 `small`，照它写会得到与模板不一致的表格。同时修正 `page-simple-list.md` 元数据与自身代码矛盾、`select.md` 未区分「列表搜索区用 small / 表单内用默认尺寸」两处。

### Changed

- **设计规则不再分散**：对话框宽度档位、页面背景分层、栅格断点、控件密度、状态双通道原先在 `SKILL.md` 与 6 个组件选型文档里各写一份，现统一由 `design.md` 持有正文，其余文档只留一行结论 + 链接。查规则不必再比对多处。
- **移除元数据字段 `controls`**：`patterns/` 与 `component-selection/` 的 frontmatter 不再声明 `controls`（原用于记录控件尺寸，20 条里 4 条与实际实现不符）。控件尺寸改以 `design.md` 的密度分档为准，`catalog.json` 相应不再输出该字段。其余字段（`whenToUse` / `variants` / `composeBoundary` / `pitfalls` / `tags` 等）不变。

---

## [1.4.0] - 2026-08-19

> 新增页面模板「**左树右表列表页**」（页面模板 8 → **9**）。

### Added

- **左树右表列表页**（[`page-tree-table.md`](skills/pangea-design-vue/references/patterns/page-tree-table.md) + 脚手架 `src/pages/TreeTable/`，路由 `/tree-table`）：主子表场景——左树选中主表主数据、右表展示其子表数据，主子各自增删改查。左树 260px，右侧沿用[简单列表页](skills/pangea-design-vue/references/patterns/page-simple-list.md)形态。
- **选型判断**：新建子数据**必须指定父级**（归属关系）才用本模板；层级只是筛选维度 → 用简单列表页加个筛选项。
- 模板内置三条联动约定：切主数据要**重拉 + 分页复位 + 清空勾选**；未选主数据**不摆空表格**、给空状态引导；子表创建必须依附当前主数据。
- `SKILL.md` 决策树与索引、`catalog.json` 同步（页面模板 8 → **9**）。

---

## [1.3.1] - 2026-08-15

> 安全修复：移除「会话开始即自动装依赖 / 起 dev server」的 hook。它绕过「用户确认后再执行」的基线，上传第三方平台时被安全扫描判定为 **P0「指令覆盖」**、导致 1.3.0 的包被拒绝分发。**能力无损失。**

### Security

- **移除脚手架 hook `pm-dev-server`**（`SessionStart` 时自动 `npm install` + 起 dev server）。装依赖与起服务改为**在你要求预览时于当轮执行**——PM 依然不碰终端，只是把「自动」换成「你说要看效果时我就做」。
- `SKILL.md` / `project-structure.md` 写明**禁止再引入 `SessionStart` + 执行类动作的 hook**，避免被加回。
- 保留的 `pm-compile-check`（`PostFileSave`，由你的保存动作触发）只做校验；其中 `npx vue-tsc` 改为 `npm run type-check`，避免 `npx` 触发远程拉取。

---

## [1.3.0] - 2026-08-15

> 页面模板 5 → **8**（分步表单页 / 详情页 / 审批详情页）、新增**「产品专属业务组件」层**（首个落地 MSC 附件上传）、新增**对话框宽度档位**硬约束。

### Added — 页面模板

- **审批详情页**（`page-approval-detail.md` + 脚手架 `src/pages/ApprovalDetail/`，路由 `/approval-detail`）：**流程审批场景的公司强制模板**。页头（流程标题 + 状态 + 全屏/打印/传阅）+ 提交人信息行 + 悬浮「快速审批」+ 业务详情（复用详情页内容）与审批流程区（流程处理 / 流程图 / 传阅记录 + 审批记录表 + 处理区）。审批处理区的**行组成与顺序随所选操作变化**（通过 / 转办 / 沟通 / 驳回 / 不通过 / 加签各不相同）。
- **详情页**（`page-detail.md` + `src/pages/DetailPage/`，路由 `/detail`）：**内容与容器解耦**——详情内容抽成 `DetailContent.vue`，同一份内容可被独立页面 / 抽屉 / 弹窗三种容器复用。
- **分步表单页**（`page-step-form.md` + `src/pages/StepForm/`，路由 `/step-form`）：大型复杂录入——步骤条分步推进 + 每步折叠分组 + 逐步校验 + 末步复核提交。
- `SKILL.md` 决策树与索引、`catalog.json` 同步（页面模板 5 → **8**）。

### Added — 对话框宽度档位（硬约束）

- **`a-modal` 宽度只有 520 / 720 / 1000 三档，且不得超过 1000**；**1000 档仅当弹窗内含表格等宽组件时**才可用（520 是默认档，不传 `width` 即 520）。装不进 1000 的内容说明它不该待在弹窗里 → 改独立页面。
- **确认类弹窗固定 400px**（`Modal.confirm | warning | info | error | success`，**不传 `width`**）。为此脚手架新增 `src/styles/arco-overrides.less` 保证该宽度生效，**复制脚手架时勿丢该文件与 `main.ts` 的引入**。
- 约束进机检：`check-tokens.mjs` 对 `<a-modal>` 的字面 `width` 越档即失败。
- 既有模板改到档位上（对话框表单 712 → 720、详情页弹窗 960 → 1000、以发起人身份操作 800 → 720）。

### Added — 产品专属业务组件（新增一层）

- **新增 `references/components-business/`**：按产品分子目录，各产品 `README.md` 声明**触发词**与组件清单。规则：命中触发词 → 该场景优先用业务组件；未命中 → **一律用 Pangea 通用组件**；拿不准 → **问用户**。这层承载特定产品的业务约定，扩散到别的系统会出现用户看不懂的字段，也会糊掉「通用设计系统 / 产品定制」的边界。
- **MSC 附件上传 `MscAttachmentUpload`**（[文档](skills/pangea-design-vue/references/components-business/msc/attachment-upload.md) + 脚手架 `src/components/msc/MscAttachmentUpload.vue`）：**MSC 表单遇到附件上传时优先用它替代 `a-upload`**——已上传列表改用**详细表格**承载（附件名称 / 文件大小 / 状态 / 操作），并支持**批量下载**。三种形态：默认态 / 上传后（**失败行只有「删除」**）/ 仅查看。组件只负责选文件 + 呈现列表 + 抛语义事件（`upload` / `preview` / `download` / `remove` / `batch-download`），**不实现真实上传下载** → demo 用 mock、交付接接口，组件不改。
- **MSC 触发词**：**MSC** / **全球营销云中台** / **营销云中台** / **营销中台**。
- `catalog.json` 新增 `businessProducts` / `businessComponents`（供 agent 先判产品线、再取组件）；需求文档「全局约定」新增 **`产品线`** 字段（自动匹配填写，不额外占澄清轮次）。

### Fixed

- **脚手架 dev 下「工作台」菜单点不动**：未安装可选依赖 `@visactor/vchart` 时 `/dashboard` 整页加载失败（`LazyChart` 的降级执行不到）。已恢复「图表未启用」占位。
- **分组表单页点右侧锚点跳到空白页**：hash 路由下 `a-anchor` 会顶掉路由 hash，已加 `:change-hash="false"`。
- **两阶段门被自家流程清单破坏**：`工程初始化流程` 原把「初始化工程 / `npm install` / 起 dev server」排在需求文档确认**之前**，照做必然违反顶部那道门。已改为显式回合分段。
- **起步方式改为优先本地复制**：`degit` 需要 GitHub 出网、沙箱/内网会失败，而 skill 包内自带脚手架 → 首推 `cp -R`，degit 降为备选。
- **澄清「不需要私有 registry」**：三个核心包都在**公共 npm**，直接 `npm install`；装不上先查网络 / 代理 / Node 版本（≥ 18），**不要改 registry**。

### Changed

- skill description 把**两阶段硬约束提到第一句**（未做长度压缩：description 是触发匹配面，压缩会掉召回）。
- 决策树中分组表单页描述改为「字段极多、**一次填完**、需分组 + 锚点定位」，与分步表单页划清边界。
- `SKILL.md` 新增「产品专属业务组件」章节，并在页面生成决策树前提醒**先判断是否命中产品触发词**；`CONTRIBUTING.md` 新增「C. 新增产品专属业务组件」规范。

---

## [1.2.0] - 2026-08-02

> 把**部署配置纳入 skill 一等公民**：默认改 Hash + 相对 base、新增嵌入式单文件构建（飞书 aily / 妙搭 / Coze / iframe），部署模式由 agent 按环境自动判断，不让你选。

### Added

- **部署指南 `references/overview/deployment.md`**：三模式对照表、环境识别信号表、白屏根因与排错速查。
- **嵌入式单文件构建 `npm run build:embed`**：产出**单个 `dist/index.html`**（约 1.2MB / gzip ≈ 320KB，零外部 JS/CSS 引用）；**页面组件无需改写**，继续用 `() => import(...)` 懒加载。
- 构建脚本 `build:embed` / `build:history` / `gate:embed`；部署配置由 `.env` / `.env.embed` / `.env.history` 驱动（跨平台）。
- 需求文档「全局约定」新增 `部署目标` 字段。

### Changed

- **⚠️ 默认路由模式由 History 改为 Hash，并显式设 `base: './'`**（脚手架行为变化）：产物可直接部署到任意静态托管的**任意子路径**，**不再需要服务端 SPA fallback**，消除「部署后刷新 / 深链接白屏」。需要干净 URL 用 `npm run build:history`（须自行配 fallback）。
- 质量门禁 **G1 增加交付项**：按目标模式构建后必须**实测产物能渲染**——「构建成功」≠「部署后能打开」。

### Fixed

- **嵌入式平台（妙搭）部署后白屏**：`build:embed` 一次性消除三层根因（History 缺服务端 fallback、`base: '/'` 在子路径下资源 404、懒加载 chunk 在「iframe + 动态 base + 子路径」下路径解析失败）。

---

## [1.1.2] - 2026-07-23

> 需求文档确认升级为**两阶段硬门**、需求文档必须对齐页面模板基准；系统名称单一来源。

### Changed

- **需求文档必须以页面模板结构为基准**：写每页布局前先判断是否命中模板，命中则**逐区块照抄该模板的「## 页面结构」**，只允许**显式标注**的 `[增补]` / `[删减]`。
- **系统名称单一来源**：脚手架新增 `src/config/app.ts` 的 `APP_NAME`，生成工程时只需替换这一处。

### Fixed

- **需求文档与工程被同一轮一起生成**（绕过确认闸门）：升级为**两阶段强制门**并前置到 `SKILL.md` 最顶部——阶段一只出文档并**结束回复等待**，阶段二才允许动工程；明确**「已确认」的唯一标准**；新增 **G0 生成前门禁**。
- 浏览器标签页标题改为「页面名 · 系统名」（原先写死 `Pangea App`）。
- 单模块时侧边栏左上角模块名与 Header 系统名重复 → 单模块下隐藏 Sidebar Head。

---

## [1.1.1] - 2026-07-23

> 修复「生成页面全空白」，并强化生成流程：类型检查前置 + AI 模板陷阱防护。

### Fixed

- **生成页面空白**：`<template>` 内写 TS 类型注解（如 `@click="(e: MouseEvent) => ..."`）会让模板运行时编译失败、渲染成**空白页**，而 Vite dev server 不做类型检查、不报错。

### Added

- **质量门禁 G9「AI 代码常见陷阱」**：① `<template>` 内禁 TS 类型注解；② 响应式派生必须用 `computed()`；③ 模板内禁 `async`。含正反例。

### Changed

- **G1 增加执行顺序硬约束**：先跑通 `vue-tsc --noEmit`（或 `npm run gate`）再启动 / 依赖 dev server；**不能只凭「dev server 起来了、无控制台报错」判定页面正常**。

---

## [1.1.0] - 2026-07-23

> 大幅补齐海信 B 端 / 中后台体系：生成前**需求规格化**输入层、**质量门禁 + 组件/模板元数据**、**混合菜单**脚手架、页面模板体系与仪表板示例、图表按需引入、响应式与背景分层全局准则。

### Added

- **需求规格化（生成前第一步）**（`requirement-intake.md`）：任意颗粒度输入（一句话～完整 PRD）先转成**面向界面架构的需求文档**（模块划分 ↔ 顶部模块 / 菜单 ↔ 左侧菜单 / 逐页 页型+布局+交互 / 待确认假设），澄清**克制限轮**（一次性打包问、最多 1–2 轮）。确立流程：**需求规格化 → 决策树选型 → 生成 → 门禁**。
- **质量门禁与元数据体系**：`quality-gates.md`（G1–G8）、`metadata-schema.md`、10 个高频组件选型元数据、页面模板 `meta` frontmatter、`catalog.json` 生成器；脚手架 `check-tokens.mjs` + `npm run gate`。
- **混合菜单结构**（脚手架 `GlobalLayout.vue`）：顶部横向**模块菜单** + 左侧**当前模块多级菜单**，单模块自动隐藏顶部。
- **页面模板累计 5 个**：新增卡片列表页、对话框表单、分组表单页（折叠分组 + 锚点导航）；另加**仪表板示例页**（非固化模板）。
- **页面生成决策树**（`SKILL.md`）：按场景与模板匹配度决定「套模板 / 增补 / AI 自主设计」，自主设计也须用设计系统组件 + token。
- **图表（VChart）按需引入**：不进基础依赖，经 `LazyChart.vue`（动态 import + 优雅降级）处理，未装也能 build。
- **响应式适配 & 页面背景分层（全局准则）**：栅格断点 / 卡片自适应网格 / 表格横滚 / 工具栏换行 / 固定宽防溢出。

### Changed

- **skill 定位刷新为「海信集团 B 端 / 中后台产品」**（新增「定位与适用范围」，description 更新）。
- **图标分工修复**：移除 `vitePluginForArco` 的 `iconBox` 全局替换（它会连带替换 Arco 组件内建功能性图标、破坏组件样式），确立「功能性图标用 Arco 默认，业务图标从图标包命名导入」。
- **非颜色 token 化**：主题包只把颜色 + 圆角注入为运行时 CSS 变量；脚手架硬编码圆角改 `var(--border-radius-*)`。
- **背景分层调整**：Layout 内容区背景由白改**透明**，背景责任下放到各页面。
- 全局 Layout / 菜单细节对齐设计稿（选中态配色、Header、折叠按钮胶囊、仅内容区滚动）。

---

## [1.0.0] - 2026-07-22

> 首个成型版本：从 skill 初始化到可运行脚手架、标准化全局 Layout、首批页面模板与 PM Demo 模式。

### Added

- 初始化 `skills/pangea-design-vue/`（派生自官方 arco-design-vue skill）：`SKILL.md`、`design-tokens.md`（Pangea 全量 token + 基础色板 15 色系 × 10 阶）、`references/overview/`、72 篇组件文档 + 模式文档。
- **可运行脚手架 `templates/project-starter/`**：Vue 3 + Vite + TS + Vue Router + Arco Vue，已接入主题包与图标包，含 `package-lock.json`。
- **PM Demo 模式**：agent 全托管工程生命周期（PM 只需对话 + 浏览器预览）。
- **标准化全局 Layout**：基于 Figma 的 `GlobalLayout.vue`（Header 48px + 可折叠侧边栏 200px + 内容区）+ `layout-menu.less`。
- **页面模板**：简单列表页、基础表单页；脚手架含示例页 + 路由 + 菜单。
- **纯前端铁律**：产出始终是完整 Vue 纯前端工程，**不产出、不涉及后端代码或服务**；demo 用 mock，开发交付对接既有接口。
- 模式文档本地补充：`form-patterns.md`（提交与校验二选一）、`table-patterns.md`（分页 `total` 联动、插槽 `record` 的 TS7053 规避）。

### Changed

- `design-tokens.md` 补全基础色板，并明确**以主题包运行时为唯一事实源**（Figma 与主题包差异一律以主题包为准）。
- 图标引用统一到 Pangea 图标包命名导入，清理默认 Arco 图标 / iconfont 残留。
