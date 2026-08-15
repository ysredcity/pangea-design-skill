# 变更日志（CHANGELOG）

本文件记录 `pangea-design-skill` 的重要变更。格式参考 [Keep a Changelog](https://keepachangelog.com/)。

事实源与版本约定见 [CONTRIBUTING.md](./CONTRIBUTING.md)。当前基线：主题包 `@arco-themes/vue-pangea-3-linear` **v1.0.11**，peer `@arco-design/web-vue ^2.57.0`。

> **阅读约定**：本文件只记录 **skill 本身**（文档、规范、脚手架）的**核心变化**，一条一行、按版本归组，供使用者快速判断"升级后有什么不一样"。
> 具体做法与用法请看对应文档（模板规范在 `references/patterns/`，全局准则在 `SKILL.md`）；**排查过程、踩坑细节、逐项实测记录见 `PROJECT_CONTEXT.md` 台账**。官网 `website/` 的调整不在本文件之列（同样见台账）。

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

## [1.3.0] - 2026-08-15

> 一次较大的能力补齐：页面模板 5 → **8**（分步表单页 / 详情页 / 审批详情页）、新增**「产品专属业务组件」层**（首个落地 MSC 附件上传）、新增**对话框宽度档位**硬约束，并修掉两阶段门与脚手架的几个阻塞性缺陷。

### Added — 页面模板

- **审批详情页**（`references/patterns/page-approval-detail.md` + 脚手架 `src/pages/ApprovalDetail/`，路由 `/approval-detail`）：**流程审批场景的公司强制模板**。页头（流程标题 + 状态 tag + 全屏/打印/传阅）+ 提交人信息行 + 悬浮「快速审批」+ 灰底白卡（业务详情复用详情页 `DetailContent` ／ 审批流程区 `ApprovalProcess.vue`：Tabs「流程处理 / 流程图（占位嵌入区）/ 传阅记录（只读三列）」+ 审批记录表 + 处理区）+「传阅」「以发起人身份操作」两个对话框。页头「全屏」用于预览「从邮件/待办直接打开、看不到全局导航」的形态（实现须 `Teleport` 到 body，否则盖不住 Layout）。
- 审批处理区的**行组成与顺序随所选操作变化**（通过 / 转办 / 沟通 / 驳回 / 不通过 / 加签各不相同），用 `ROW_LAYOUT` + `ACTION_CONFIG` 两张表**数据驱动行序**——不能用「固定超集 + `v-if` 显隐」，因为顺序也会变。
- **详情页**（`references/patterns/page-detail.md` + 脚手架 `src/pages/DetailPage/`，路由 `/detail`）：**内容与容器解耦**——详情内容抽成 `DetailContent.vue`，同一份内容可被独立页面 / `a-drawer` / `a-modal` 三种容器复用。只读字段用「label 在上 / 值在下」表单式布局 + 只读附件列表 + 只读子表单表格。
- **分步表单页**（`references/patterns/page-step-form.md` + 脚手架 `src/pages/StepForm/`，路由 `/step-form`）：支撑大型复杂录入——页头步骤条分步推进 + 每步折叠分组 + 多种录入交互（基础控件 / 只读子表单 / 可编辑子表单 / 上传）+ 逐步校验 + 末步复核提交。
- `SKILL.md` 决策树与索引表、`catalog.json` 同步（页面模板 5 → **8**）。

### Added — 设计约束：对话框宽度

- **`a-modal` 宽度只有 520 / 720 / 1000 三档，且不得超过 1000**；**1000 档仅当弹窗内含表格等宽组件时**才可使用（520 是默认档，不传 `width` 即 520）。装不进 1000 的内容说明它不该待在弹窗里 → 改独立页面。
- **确认类弹窗固定 400px**（`Modal.confirm | warning | info | error | success`，**不传 `width`**）。为此脚手架新增 `src/styles/arco-overrides.less`（`.arco-modal-simple { box-sizing: border-box }`）——`.arco-modal` 是 content-box，simple 模式根节点的 `padding` 会把 Arco 自带的 400 撑成 464。**复制脚手架时勿丢该文件与 `main.ts` 的引入。**
- **约束进机检**：`check-tokens.mjs` 新增第 3 条规则——`<a-modal>` 的字面 `width` 非档位或 >1000 直接失败（`width="auto"` / `fullscreen` / 绑定表达式跳过）。
- 既有模板改到档位上：对话框表单 `712 → 720`、详情页弹窗查看 `960 → 1000`、以发起人身份操作 `800 → 720`。

### Added — 产品专属业务组件（新增一层）

- **新增一层 `references/components-business/`（产品专属业务组件）**：按产品分子目录，每个产品的 `README.md` 声明**触发词**与组件清单。门槛规则：命中触发词 → 该场景优先用业务组件；未命中 → **一律用 Pangea 通用组件**；拿不准 → **问用户**。理由是业务组件承载特定产品的业务约定（字段口径、状态语义、操作集合），扩散到别的系统会出现用户看不懂的列、并糊掉「通用设计系统 / 产品定制」的边界。
- **MSC 附件上传 `MscAttachmentUpload`**（[文档](skills/pangea-design-vue/references/components-business/msc/attachment-upload.md) + 脚手架 `src/components/msc/MscAttachmentUpload.vue`），参照 Figma `5926:53694` 实现。**MSC 表单遇到附件上传时优先用它替代原生 `a-upload`**——原生的已上传列表是「文件名 + 删除」的轻量列表，MSC 要求用**详细表格**承载：附件名称 / 文件大小 / 状态（● 上传成功·● 上传失败）/ 操作（下载·预览·删除），并在表格下方提供**批量下载**。
  - 三种形态：**默认态**（空列表 →「暂无数据」，批量下载禁用）／**上传后**（成功行 `下载 预览 删除`；**失败行只有 `删除`**——失败没有可访问产物）／**仅查看**（`read-only`：不渲染上传入口与格式提示、行操作去掉删除）。
  - 组件**只负责选文件 + 呈现列表 + 抛语义事件**（`upload` / `preview` / `download` / `remove` / `batch-download`），不实现真实上传下载 → demo 用 mock、交付接真实接口，组件不改。`file-list` 受控；`size` 传展示文本（各系统口径不同，组件不做格式化）。
  - 前端校验类型与大小，且**提示文案由 `accept` + `maxSizeMB` 自动生成**，避免文案与实际校验规则不一致。
  - 「操作」列 `fixed: 'right'` + 表格开横向滚动，窄屏下操作始终可见（设计稿该列带投影即固定列）；表头底色用 `--color-fill-2` 对齐设计稿。
- **MSC 触发词**：**MSC** / **全球营销云中台** / **营销云中台** / **营销中台**。
- **`catalog.json` 新增 `businessProducts` 与 `businessComponents`**：前者按产品聚合（产品 + 触发词 + 组件清单），供 agent「先判产品线、再取组件」；`build-catalog.mjs` 相应支持递归扫子目录。
- 需求文档「全局约定」新增 **`产品线`** 字段（agent 顺手匹配触发词自动填，**不额外占澄清轮次**；无法判断时才问一句）。

### Fixed

- **脚手架 dev 下「工作台」菜单点不动**：可选依赖 `@visactor/vchart` 未安装时，`optimizeDeps.exclude` 只跳过预构建，**dev 的 import 分析仍会解析裸包名并让整个模块返回 HTTP 500**，`LazyChart` 的 `try/catch` 降级执行不到 → `/dashboard` 整页加载失败。新增 `apply: 'serve'` 的解析兜底插件（指向抛错的虚拟模块），恢复「图表未启用」占位。
- **分组表单页点右侧锚点跳到空白页**：hash 路由下 Arco `a-anchor` 默认改写 `location.hash`，把路由 hash 顶掉。修复：加 `:change-hash="false"`。
- **两阶段门被自家流程清单破坏**：`工程初始化流程` 原把「初始化工程 / `npm install` / 起 dev server」排在需求文档确认**之前**，照做必然违反顶部那道门（很可能就是此前「文档与工程同轮产出」的原因）。已改为显式回合分段——第一回合只出文档并停下，其余全部划入第二回合；门的禁止清单补上「复制模板」「起 dev server」。
- **起步方式改为优先本地复制**：`degit` 需要 GitHub 出网、沙箱/内网会失败，而 skill 包内本就自带 `templates/project-starter/`。改为首推 `cp -R` 复制，degit 降为备选。
- **澄清「不需要私有 registry」**：三个核心包都发布在**公共 npm**，工程内也没有 `.npmrc`。`getting-started.md` / `project-structure.md` 写明直接 `npm install`；装不上先查网络 / 代理 / Node 版本（≥ 18），**不要改 registry**。

### Changed

- **skill description 结构**：两阶段硬约束提到第一句。**未做长度压缩**——description 是触发匹配面，压缩会直接掉召回，且 703 字符远未触及 1024 上限；实际只删泛化尾部枚举并补上新模板 / 新约束的关键词。
- **分步表单页细节**：第一步不再渲染「上一步」（用 `v-if` 而非 `disabled`）；步骤条改小尺寸并去掉描述文字（⚠️ Arco Steps 只有布尔属性 `small`，写 `size="small"` 静默无效）；字段栅格列数上限 4 → 3。
- **审批详情页细节**：选人入口（添加转办人 / 沟通人 / 审批人）改为**纯占位、点击无效果**，实际项目接入组织架构的标准人员选择器；传阅记录表去掉「操作」列。
- 决策树中分组表单页描述改为「字段极多、**一次填完**、需分组 + 锚点定位」，与分步表单页划清边界；只读子表单表格统一 `size="medium"`。

- `SKILL.md` 新增「产品专属业务组件（默认不用，命中产品才用）」章节（产品表 + 触发词 + 判定执行步骤 + 设门理由），并在**页面生成决策树前置一句提醒**：走决策树之前先判断是否命中产品触发词。
- `CONTRIBUTING.md` 把原「新增定制业务组件 / 页面模板（后续规划）」改写为落地后的实际约定「**C. 新增产品专属业务组件**」：目录与命名规范、`meta` 必带 `kind: business-component` / `product` / `productName` / `triggers`、以及新增后要登记的三处。

### Verified

- 脚手架 + website 双 `npm run gate` 通过；三个新模板与本轮所有修复均经 Playwright 实测（对话框宽度实测为 720 / 1000 / 520 / 720 / 400，机检规则另用注入用例反向验证）。逐项实测记录见台账。

- 组件三态与交互经 Playwright 实测（含真实选文件上传、非法类型被拦、删除、批量下载仅作用于成功附件），表头底色实测 `rgb(242,243,245)` 与设计稿一致。逐项记录见台账。
---

## [1.2.0] - 2026-08-02

> 把**部署配置纳入 skill 一等公民**：默认改 Hash + 相对 base、新增嵌入式单文件构建（飞书 aily / 妙搭 / Coze / iframe），部署模式由 agent 按环境自动判断，不让用户选。

### Added

- **部署指南 `references/overview/deployment.md`**：三模式对照表、**环境识别信号表**、三层白屏根因与排错速查、体积权衡。
- **嵌入式单文件构建 `npm run build:embed`**：产出**单个 `dist/index.html`**（约 1.2MB / gzip ≈ 320KB，零外部 JS/CSS 引用）；**页面组件无需改写**，继续用 `() => import(...)` 懒加载。
- 构建脚本 `build:embed` / `build:history` / `gate:embed`；部署配置由 `.env` / `.env.embed` / `.env.history` 驱动（跨平台，避免 `VAR=x cmd` 在 Windows 失效）。
- 需求文档「全局约定」新增 `部署目标` 字段（agent 按信号表自动填，不额外占澄清轮次）；新增测试场景 `_tests/cases/S4-embed-deploy.md`。

### Changed

- **⚠️ 默认路由模式由 History 改为 Hash，并显式设 `base: './'`**（脚手架行为变化）：产物可直接部署到任意静态托管的**任意子路径**，**不再需要服务端 SPA fallback**，消除「部署后刷新 / 深链接白屏」。需要干净 URL 的团队用 `npm run build:history`（须自行配 fallback）。
- 质量门禁 **G1 增加交付项**：按目标模式构建后必须**实测产物能渲染**——「构建成功」≠「部署后能打开」。
- `SKILL.md` / `project-structure.md` 同步：deployment.md 索引、「dev 预览与交付构建是两套配置」、部署模式由 agent 判断。

### Fixed

- **嵌入式平台（妙搭）部署后白屏**：三层根因——① History 缺服务端 fallback；② `base: '/'` 在 `/page/<token>/` 子路径下资源 404；③ **懒加载 chunk 在「iframe + 动态 base + 子路径」下路径解析失败**（最关键，前两层修好仍白屏）。`build:embed` 一次性消除三层。

### Verified

- 三种构建均实测：默认模式部署到子路径 5 个路由正常；`build:embed` 直接 `file://` 打开 5 个路由全部正常（复现「无服务端 + 无正确 base」的最严苛环境）；`build:history` 需服务端 fallback。

---

## [1.1.2] - 2026-07-23

> 按实测反馈修正生成流程：需求文档确认升级为**两阶段硬门**、需求文档必须对齐页面模板基准；系统名称单一来源 + 浏览器标题。

### Changed

- **需求文档必须以页面模板结构为基准**（`requirement-intake.md` + `SKILL.md`）：写每页布局前先判断是否命中模板，命中则**逐区块照抄该模板的「## 页面结构」**，只允许**显式标注**的 `[增补]` / `[删减]`。修正实测问题——需求文档自行设计结构、生成时又套模板，导致产出与模板有偏差。
- **系统名称单一来源**：脚手架新增 `src/config/app.ts` 的 `APP_NAME`，Header 品牌名引用它；生成工程时只需替换这一处。

### Fixed

- **需求文档与工程被同一轮一起生成**（绕过确认闸门，实测多次出现）：升级为**两阶段强制门**并前置到 `SKILL.md` 最顶部——阶段一只出文档并**结束回复等待**，阶段二才允许动工程；明确**「已确认」的唯一标准**（用户看到文档后的明确肯定答复；初始需求、对澄清问题的回答都不算）；新增 **G0 生成前门禁**。
- **浏览器标签页标题写死 `Pangea App`**：改为取 `APP_NAME`，并用 `router.afterEach` 显示「页面名 · 系统名」。
- **单模块时侧边栏左上角模块名与 Header 系统名重复**：单模块下 Sidebar Head 整块隐藏。

---

## [1.1.1] - 2026-07-23

> 修复外部工具实测发现的「生成页面全空白」，并强化生成流程：类型检查前置 + AI 模板陷阱防护。

### Fixed

- **生成页面空白**：`<template>` 内写 TS 类型注解（如 `@click="(e: MouseEvent) => ..."`）会让模板运行时编译失败、渲染成**空白页**，而 Vite dev server 不做类型检查、不报错——根因是生成流程「先起 dev server、后跑类型检查」，buggy 代码未被拦截。

### Added

- **质量门禁 G9「AI 代码常见陷阱」**：① `<template>` 内禁 TS 类型注解（抽到 `<script setup>`）；② 响应式派生必须用 `computed()`；③ 模板内禁 `async`。含正反例。

### Changed

- **G1 增加执行顺序硬约束**：先跑通 `vue-tsc --noEmit`（或 `npm run gate`）再启动 / 依赖 dev server；**不能只凭「dev server 起来了、无控制台报错」判定页面正常**。
- `SKILL.md` 关键约定、决策树门禁提示（G1–G9）、PM Demo 流程与脚手架 `pm-compile-check` hook 同步插入 `vue-tsc` 把关。

---

## [1.1.0] - 2026-07-23

> 大幅补齐海信 B 端 / 中后台体系：生成前**需求规格化**输入层、**质量门禁 + 组件/模板元数据**、**混合菜单**脚手架、页面模板体系与仪表板示例、图表按需引入、响应式与背景分层全局准则。

### Added

- **需求规格化（生成前第一步）**（`references/overview/requirement-intake.md` + `SKILL.md`）：任意颗粒度输入（一句话～完整 PRD）先转成**面向界面架构的需求文档**（模块划分 ↔ 顶部模块 / 菜单 ↔ 左侧菜单 / 逐页 页型+布局+交互 / 待确认假设），参考头脑风暴但**克制限轮**（一次性打包问、最多 1–2 轮）。确立流程：**需求规格化 → 决策树选型 → 生成 → 门禁**。
- **质量门禁与元数据体系**：`quality-gates.md`（G1–G8）、`metadata-schema.md`、`references/component-selection/`（10 个高频组件选型元数据）、页面模板补 `meta` frontmatter、生成器 `scripts/build-catalog.mjs` → `catalog.json`；脚手架 `check-tokens.mjs` + `npm run gate`。
- **混合菜单结构**（脚手架 `GlobalLayout.vue`）：顶部横向**模块菜单** + 左侧**当前模块多级菜单**，单模块自动隐藏顶部；数据模型 `modules: { key, title, menu }[]`。
- **页面模板累计 5 个**：新增卡片列表页、对话框表单、分组表单页（折叠分组 + 锚点导航）；另加**仪表板示例页**（非固化模板）。
- **页面生成决策树**（`SKILL.md`）：按场景与模板匹配度决定「套模板 / 增补 / AI 自主设计」，自主设计也须用设计系统组件 + token。
- **图表（VChart）按需引入**：`@visactor/vchart` 不进基础依赖，经 `LazyChart.vue`（动态 import + 优雅降级）+ `vite.config.ts` 可选依赖处理，未装也能 build。
- **响应式适配 & 页面背景分层（全局准则）**（`SKILL.md`）：栅格断点 / 卡片自适应网格 / 表格横滚 / 工具栏换行 / 固定宽防溢出；内容区默认透明、背景由各页面自设。
- 新增测试场景 `_tests/cases/S3-meeting-room-booking.md`。

### Changed

- **skill 定位刷新为「海信集团 B 端 / 中后台产品」**：`SKILL.md` 新增「定位与适用范围」，description 更新。
- **图标分工根因修复**：移除 `vitePluginForArco` 的 `iconBox` 全局替换（它会连带替换 Arco 组件内建功能性图标、破坏组件样式），确立分工「功能性图标用 Arco 默认，业务图标从图标包命名导入」，并删掉治标的 `arco-fixes.less`。
- **非颜色 token 化**：主题包只把**颜色 + 圆角**注入为运行时 CSS 变量；脚手架硬编码圆角改 `var(--border-radius-*)`；`design-tokens.md` 补说明。
- **背景分层调整**：Layout 内容区背景由白改**透明**，背景责任下放到各页面。
- 全局 Layout / 菜单细节对齐设计稿（选中态配色、Header、折叠按钮胶囊、仅内容区滚动）。

### Fixed

- **菜单覆盖样式需 `!important`**：Arco 组件样式懒加载注入在全局 less 之后，部分覆盖仅靠特异性不稳。
- **顶部模块菜单竖向滚动条**：Arco `.arco-menu-inner{overflow:auto}` 叠加强制 48px 高会冒滚动条，改 `overflow:hidden`。

---

## [1.0.0] - 2026-07-22

> 首个成型版本：从 skill 初始化到可运行脚手架、标准化全局 Layout、首批页面模板与 PM Demo 模式。

### Added

- 初始化 `skills/pangea-design-vue/`（派生自官方 arco-design-vue skill）：`SKILL.md`、`design-tokens.md`（Pangea 全量 token + 基础色板 15 色系 × 10 阶）、`references/overview/`、72 篇组件文档 + 模式文档。
- 治理框架：`CONTRIBUTING.md` + `CHANGELOG.md`。
- **可运行脚手架 `templates/project-starter/`**：Vue 3 + Vite + TS + Vue Router + Arco Vue，已接入主题包与图标包，含 `package-lock.json`。
- **PM Demo 模式**：agent 全托管工程生命周期（PM 只需对话 + 浏览器预览）；脚手架内置 `pm-dev-server` / `pm-compile-check` hooks。
- **标准化全局 Layout**：基于 Figma 重写 `GlobalLayout.vue`（Header 48px + 可折叠侧边栏 200px + 内容区）+ `layout-menu.less`。
- **页面模板**：简单列表页、基础表单页；脚手架含示例页 + 路由 + 菜单。
- **纯前端铁律**：产出始终是完整 Vue 纯前端工程，**不产出、不涉及后端代码或服务**；demo 用 mock，开发交付对接既有接口。
- 模式文档本地补充：`form-patterns.md`（提交与校验二选一）、`table-patterns.md`（分页 `total` 联动、插槽 `record` 的 TS7053 规避）。
- 效果测试材料 `_tests/`（S1 请假管理、S2 商品管理；本地保留、不入 Git）。

### Changed

- `design-tokens.md` 补全基础色板，并明确**以主题包运行时为唯一事实源**（Figma 与主题包差异一律以主题包为准）。
- 图标引用统一到 Pangea 图标包命名导入，清理默认 Arco 图标 / iconfont 残留。
- 登记生成层级（页面为全局 Layout 子路由）与脚手架可运行性要点（`less` 必需、显式引 `theme.css`、`vite-env.d.ts`）。

### Fixed

- 修复脚手架三处「跑不起来 / 样式不生效」缺口：新增 `src/vite-env.d.ts`、`main.ts` 显式引 `theme.css`、`package.json` 补 `less`。
- 修复表格插槽 `record` 无类型导致的 TS7053，并把经验回流到 `table-patterns.md`。
