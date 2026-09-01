# 项目上下文台账（PROJECT_CONTEXT）

> **这是本项目的单一事实源（Single Source of Truth）。** 每次新会话开始时先读它；完成里程碑、做出重要决策、或新增/移动文件后**及时更新它**。
> 它是跨软件、跨电脑、防突发丢失的锚点——**提交并推送到 Git 后**即可在任何机器/工具上恢复上下文。维护协议见文末「■ 更新协议」。最后更新：2026-08-29。

---

## 1. 项目是什么
`pangea-design-skill`：**Pangea 设计体系的 Vue 3 skill**——给 AI agent 消费的知识库，让 agent 产出「组件用法正确 + 视觉符合 Pangea 主题」的前端代码。

Pangea = 开源组件库 `@arco-design/web-vue` + 公司定制主题包 `@arco-themes/vue-pangea-3-linear` + 图标包 `@arco-iconbox/vue-pangea-mobile`。

产出物是一个 **Vue 工程**，同时服务两类使用者（产物结构一致，**差别只在数据来源**）：
- **产品经理（PM）**：出高保真 demo 原型（mock 数据）。
- **开发工程师**：基于 PRD 产出符合规范的 UI（真实接口）。

GitHub：https://github.com/ysredcity/pangea-design-skill

## 2. 当前状态（Status）
- ✅ **skill 主体已建**：`skills/pangea-design-vue/`，从官方 arco-design-vue skill 派生。
  - `SKILL.md`：约定 + 核心目的/双受众 + 工程结构与生成层级铁律 + 主题铁律 + 完整索引。
  - `references/theme/design-tokens.md`：Pangea 全量 token（含**完整基础色板** 15 色系 × 10 阶）。
  - `references/overview/`：`project-structure.md`（工程结构+生成层级）、`theming.md`、`getting-started.md`（均定制）+ `architecture.md`/`config-provider.md`/`internationalization.md`（照搬）。
  - `references/components/`（72 篇）+ `references/patterns/`（5 篇）：照搬上游。
- ✅ **可运行脚手架**：`skills/pangea-design-vue/templates/project-starter/`，已内置并接入主题包（`vitePluginForArco({ theme })`，**不再启用 `iconBox` 全局替换**，图标改命名导入），含**标准化 `GlobalLayout.vue`**（基于 Figma 设计稿实现：Header 48px + 左侧可折叠侧边栏 200px + 内容区**透明**+左上圆角 8px，背景由各页面自行设置；**混合菜单**：顶部横向模块菜单 + 左侧当前模块多级菜单，单模块自动隐藏顶部）+ 自定义菜单样式 `layout-menu.less` + `pages/Example` + 子路由示例。
- ✅ **治理框架**：`README.md`、`CONTRIBUTING.md`、`CHANGELOG.md`（根目录）。
- ✅ **已上传 GitHub**：`main` 分支，初始提交 + README。
- ✅ **图标引用已统一**：定制文档全部指向图标包命名导入，清理了默认 Arco 图标/iconfont 残留。
- ✅ **脚手架已实测可运行**（A+D+C）：修复 3 处缺口后 `npm install`→`vue-tsc`→`vite build`→`npm run dev` 全通过，产物 CSS 含青绿 `--primary-6: 0,170,166`；加了 `package-lock.json`；支持 `npx degit …/templates/project-starter my-app` 一键起项目。
- ✅ **模式文档增补**：form-patterns（提交/校验二选一）、table-patterns（分页 total 联动）本地补充。
- ✅ **PM Demo 模式**：SKILL.md 新增「PM Demo 模式」章节（agent 全托管工程生命周期），脚手架内置 2 个 Kiro hooks（`pm-dev-server` SessionStart / `pm-compile-check` PostFileSave），`project-structure.md` 新增对应说明。PM 只需对话+浏览器预览，无需接触终端或处理编译错误。
- ✅ **官网 showcase 骨架已建**（`website/`，方案阶段 3）：以 `project-starter` 为基底 fork 的**独立** Vue 工程（全站用 GlobalLayout、hash 路由、`base './'`），**内容分 2 模块（顶部横向菜单切换，dogfood 混合菜单）**：① **说明文档** 模块——介绍 Home（Hero + 定位 + 能力 + 读 catalog 统计）、使用指南 Guide、更新日志 Changelog（?raw + 轻量 md 渲染）；② **设计系统** 模块——Design Tokens（Foundations，颜色/圆角运行时读 CSS 变量，第一项）、页面模板 Templates（索引 + 预览路由渲染同步来的示例页，第二项）、**组件**（一级菜单，第三项，下挂各组件页作为二级菜单）。组件页 `/components/:id`（`Components/Detail.vue`：命中 catalog 时展示选型卡 + 按 id 优先渲染专属 demo `Components/demos/<Id>.vue`，否则内联回退），二级菜单来自站点组件清单 `Components/registry.ts`（分组排序平铺，现 16 个 = 原 10 + 新 6：Button/Tag/Tooltip/Tree/Dropdown/Steps，每个专属 demo 全面铺展属性）。`/components` 重定向到首个组件；模块归属用前缀匹配（`/templates/xxx` 预览页也归设计系统）。`scripts/sync-from-skill.mjs` 单向同步 skill 的 `catalog.json` + `CHANGELOG.md` + 示例页/LazyChart → `src/generated/`（提交 git，Dashboard 的 LazyChart 导入改相对路径）。为渲染仪表盘图表，website 把 `@visactor/vchart` 作为**正式依赖**（区别于基础脚手架的按需引入）。独立 `npm install` + `npm run gate`（含 build，vchart 打包）通过；dev 5173 全路由 200。
- ✅ **5 个页面模板已建**（`references/patterns/`）：`page-simple-list.md`（简单列表页）、`page-card-list.md`（卡片列表页，a-card 网格）、`page-modal-form.md`（对话框表单）、`page-form.md`（基础表单页）、`page-grouped-form.md`（分组表单页）。均基于 Figma 设计稿。脚手架 `src/pages/` 内有示例页（Example=简单列表 / CardList / ContractForm / GroupedForm / **Dashboard=仪表板示例**），均已注册路由 + 菜单。
- ✅ **仪表板示例（非固化模板）**：`src/pages/Dashboard/index.vue`——工作台/仪表板示例（KPI 卡 + 流程中心/我的项目表格 + 分段占比条 + VChart 环形图），白底 + 边框卡片 + 响应式。是「示例」不是模板，未进 patterns 索引；作为图表/仪表板类页面的组装参考（SKILL.md 图表章节已指向它）。图表库 `@visactor/vchart` **按需引入、不在基础依赖里**（见下 2026-07-23 方案 B）——脚手架用 `src/components/LazyChart.vue` 动态 import + 优雅降级，`vite.config.ts` 把它按可选依赖处理。

## 3. 关键结论与决策（不要重复踩坑）
- **视觉 token 唯一事实源 = 主题包运行时**（`@arco-themes/vue-pangea-3-linear` 的 `theme.css`/`tokens.less`/`theme.less`，即 `rgb(var(--x-n))` 实际解析值）。Figma/设计稿/记忆都不是权威，**冲突以主题包为准**。
- **品牌主色 = 青绿 `#00aaa6`（`--primary-6`）**，不是 Arco 默认蓝；`link` 与 primary 同色。状态色（success=green / danger=red / warning=orange / info=arcoblue）沿用 Arco 标准。
- **Figma 与主题包的 Cyan 色系（及 red-7）不一致** → 已统一以主题包为准（Figma 由 @维护者 手动对齐）。`design-tokens.md` 中已删除该差异说明。
- **图标分工（重要，勿再走 iconBox 全局替换）**：① **功能性/组件内建图标**（Modal 关闭、Select 箭头、DatePicker 日历、Collapse caret 等）用 **Arco 默认，不替换**——**已移除 `@arco-plugins/vite-vue` 的 `iconBox` 全局替换选项**，因为它会连带替换 Arco 组件内建图标、破坏组件内部样式（根因）。② **业务/内容图标**从图标包 `@arco-iconbox/vue-pangea-mobile` **命名导入**（如 `import { IconGlobal } from '@arco-iconbox/vue-pangea-mobile'`，517 个命名导出，继承 `currentColor`、`font-size` 控大小）。**不要**用 `@arco-design/web-vue/es/icon` 或 iconfont.cn，不启用 iconBox。（曾用 `src/styles/arco-fixes.less` 全局 CSS 修 hover 变白问题，属治标——已删除，根因是 iconBox。）
- **生成层级**：具体页面是**全局 Layout 下的路由子页面**（`src/pages/<PageName>/index.vue` + 注册为 Layout 路由 children + 加进**所属模块**的 `menu`）。全局 Layout 已按 Figma 设计稿标准化，**不要重写/替换全局 Layout**（除非明确要求）。
- **混合菜单结构 = 全局 Layout 铁律**（`GlobalLayout.vue`）：顶部 Header 横向**模块菜单** + 左侧**当前模块的多级菜单**，切换模块联动左侧。数据模型 `modules: { key, title, menu: MenuItem[] }[]`，每模块独立菜单；当前模块由当前路由所属菜单自动推导；模块点击跳该模块首个叶子菜单；`selectedKeys` 支持子路由高亮父项。**单/多模块按场景判断**：`modules` 只 1 个 → `isMultiModule=false` 自动隐藏顶部模块菜单、退化为纯侧边菜单；多个 → 顶部显示模块菜单。**左侧菜单栏保持原貌**：左上角只显示模块名（单模块=appName），下面是该模块菜单（无图标、无「当前模块」标签、样式交互不变）。（website 官网即单模块示例；脚手架默认配 3 个模块演示多模块。）
- **菜单自定义样式**（`src/layouts/layout-menu.less`，`main.ts` 全局 import）：① 侧边菜单——透明背景、13px 一级 / 12px 二级、**默认透明 / 选中白背景 + `primary-7`（必须 `!important`：Arco `.arco-menu-light .arco-menu-item.arco-menu-selected` 特异性 0,4,0 更高）+ medium（选中+hover 保持白）**、hover `rgba(0,0,0,0.06)`、圆角 `var(--border-radius-*)`、无左侧竖条；**二级菜单不用图标**——隐藏 Arco 图标缩进占位 `.arco-menu-indent-list{display:none}`、缩进改由 `padding-left:28px` 控制、高度 `padding:6px 8px 6px 28px` = 32px；**一级菜单可选图标**（`MenuItem.icon?: Component`，模板对一级 `a-menu-item`/`a-sub-menu #title` 渲染 `<component :is>`，二级不渲染）；② 顶部模块菜单——透明背景、去底部整条边框、14px、选中 `primary-6` 文字 + 下划线、与 Header 等高 48px。⚠️ Arco 组件样式**懒加载注入在全局 less 之后**，覆盖选中态/padding 等需加 `!important`。
- **非颜色 token 的 CSS 变量可用性**：主题包**只把颜色 + 圆角注入为运行时 CSS 变量**（`var(--color-*)`、`var(--border-radius-*)`）；字号/字重/行高/间距/尺寸**只有 Less 变量**（`@font-size-*` 等），无对应 CSS 变量。故 scoped `<style>` 里：圆角一律用 `var(--border-radius-*)`；字号/字重优先走组件，确需自定义只能写字面值且必须落在 Pangea 档位（字号 12/13/14/16/20、字重 400/500/600、间距 4 的倍数）。详见 design-tokens.md「哪些 token 是运行时 CSS 变量」。
- **照搬 vs 定制**：组件/模式文档 + architecture/config-provider/i18n 为「照搬」上游，仅上游 API 变化时才动；主题/工程结构相关为「定制」。（例外：form-patterns/table-patterns 末尾带「本地补充」小节，同步上游时保留。）
- **脚手架可运行性三要点（勿破坏）**：① `less` 必需 devDep；② `main.ts` 显式 `import '@arco-themes/vue-pangea-3-linear/theme.css'`（运行时 CSS 变量，只靠插件注入不可靠）；③ `src/vite-env.d.ts` 提供 `*.vue`/`vite/client`/图标包类型声明。改依赖或配置后须重跑 install/build/dev 并更新 lockfile。
- **纯前端铁律**：产出始终是完整的 Vue 纯前端工程，只做前端（页面/路由/组件/前端状态/mock 或调用既有接口），**不产出、不涉及任何后端代码或服务**。demo 用 mock；开发对接既有后端接口但不实现后端。
- **skill 定位 = 海信集团 B 端 / 中后台产品**（管理后台、业务系统、数据平台、内部工具），以「规范执行」为先，不做规范外自由发挥。SKILL.md 开头有「定位与适用范围」章节。
- **需求规格化 = 生成前第一步**（`references/overview/requirement-intake.md`，SKILL.md「生成前：需求规格化」章节）：任何颗粒度输入（一句话～完整 PRD）在写代码前先转成**面向界面架构的需求文档**（概述/模块划分↔顶部模块/菜单导航↔左侧菜单/逐页页型+布局+关键内容+交互/全局约定/待确认假设）；参考头脑风暴但**克制限轮**——只澄清影响界面架构的模糊点、一次性打包问、最多 1–2 轮、余下用默认假设并标注；**用户确认后**才进决策树逐页生成→质量门禁。已确认文档下的增量/微调可跳过。PM demo 与开发交付都走此步（差别只在数据来源）。建议留存 `docs/requirement.md`。**流程顺序：需求规格化 → 决策树选型 → 生成 → G1–G8 门禁。**
- **页面生成决策树**（SKILL.md「页面生成决策树」章节）：先判断场景与现有页面模板匹配度——高匹配直接套模板、部分匹配以模板为骨架增补、低匹配才 AI 自主设计；但自主设计也必须只用 Arco Vue 组件 + Pangea token（颜色/圆角变量、字号字重间距落档位），不自造组件、不引其它 UI 库。
- **图表 = VChart**（VisActor，https://github.com/VisActor/VChart ，`@visactor/vchart`）：需数据可视化时优先用；系列配色接入 Pangea 调色板（主色 primary-6），容器用 a-card 承载，数据 mock 或对接既有接口。
- **页面背景分层 = 全局准则**（SKILL.md「页面背景（全局准则）」）：Layout 内容区默认**透明**（漏出 body 灰底 `--color-fill-2`），**背景色由每个页面自己设置**，不依赖 Layout。常规内容页（列表/表单/详情）在页面根设白底 `var(--color-bg-1)`（内容区左上圆角 + overflow 自动把白底裁成圆角，复现「白面板浮灰底」）；仪表板/工作台类聚合页页面根保持透明、用白底**无边框**卡片（`:bordered="false"`）靠底色差异区隔区块。均用变量不写死 hex。
- **响应式适配 = 全局准则**（SKILL.md「响应式适配（全局准则）」+ 各页面模板已落地）：每个页面都必须响应式，内容区宽度会随侧边栏折叠/分屏/小屏变化。铁律——**表单多列栅格用 Arco Grid 断点、不写死 `:span`**：3 列表单 `:xs="24" :sm="12" :lg="8"`、2 列 `:xs="24" :sm="12"`，整行字段保持 `:span="24"`（断点 xs<576/sm≥576/md≥768/lg≥992/xl≥1200/xxl≥1600）；卡片/磁贴网格用 CSS `repeat(auto-fill|auto-fit, minmax(...))`；表格窄屏用 `:scroll={x}`/隐藏次要列；工具栏/筛选行 `flex-wrap`；固定像素宽度（modal/面板）不超视口、辅助区（锚点/侧栏）窄屏隐藏。优先用 Grid 断点，能不写媒体查询就不写。详见 responsive-design.md。
- **协作约定**：❗**不要替用户自动 `git commit` / `git push`**，只改文件，提交推送由用户手动操作（用户 2026-07-21 明确要求）。

## 4. 文件地图（File Map）
```
pangea-design-skill/
├── PROJECT_CONTEXT.md            # 本台账（单一事实源）
├── README.md                     # 仓库首页
├── CONTRIBUTING.md               # 贡献/维护规则、事实源约定、提交检查
├── CHANGELOG.md                  # 变更记录（按版本归组：v1.0.0 / v1.0.1 / Unreleased）
├── docs/
│   └── plan-gates-metadata-website.md   # 实施蓝图：质量门禁+元数据+官网（阶段0-3已落地，独立于 skills/website）
├── .kiro/steering/context-management.md   # Kiro 常驻规则：自动注入本台账
├── website/                     # 官网 showcase（独立工程，dogfood）：Home/Guide/ComingSoon + sync-from-skill.mjs + src/generated 快照
└── skills/pangea-design-vue/
    ├── SKILL.md                  # skill 入口
    ├── references/
    │   ├── design.md                        # 全局设计规则唯一事实源（跨页型/跨组件；无 meta，不进 catalog）
    │   ├── theme/design-tokens.md          # 全部设计 token（核心）
    │   ├── overview/requirement-intake.md   # 需求规格化（生成前第一步：输入→界面架构需求文档）
    │   ├── overview/project-structure.md   # 工程结构 + 生成层级
    │   ├── overview/theming.md · getting-started.md   # 定制
    │   ├── overview/architecture.md · config-provider.md · internationalization.md  # 照搬
    │   ├── components/ (72)  # 照搬（组件 API）
    │   ├── component-selection/ (10)  # 组件选型元数据（含 meta frontmatter）
    │   ├── _generated/catalog.json    # 机读元数据索引（build-catalog.mjs 生成，勿手改）
    │   └── patterns/  (10)   # 5 照搬 + 5 页面模板（页面模板顶部含 meta frontmatter）
    ├── scripts/build-catalog.mjs       # 零依赖生成器：frontmatter meta → catalog.json
    ├── references/overview/quality-gates.md · metadata-schema.md   # 质量门禁 G1–G8 / 元数据 schema
    ├── references/patterns/     # 5 照搬 + 5 页面模板（simple-list / card-list / modal-form / form / grouped-form）
    └── templates/project-starter/          # 可运行脚手架（含主题包/图标包）
        ├── .kiro/hooks/                    # PM Demo 模式 Kiro hooks（随脚手架交付）
        └── src/
            ├── layouts/
            │   ├── GlobalLayout.vue        # 标准化全局 Layout（header+sidebar+content）
            │   └── layout-menu.less        # 侧边栏菜单自定义样式
            └── pages/                      # 示例页：Example(简单列表)/ContractForm/GroupedForm
```

## 5. 关键约定 / 事实源速查
| 事项 | 事实源 / 约定 |
|---|---|
| 视觉 token | 主题包 `@arco-themes/vue-pangea-3-linear`（`theme.css`/`tokens.less`/`theme.less`） |
| 组件 API | `@arco-design/web-vue` 官方 / arco-design-vue skill（照搬文档） |
| 图标 | `@arco-iconbox/vue-pangea-mobile`（命名导入） |
| 工程结构/生成层级 | `references/overview/project-structure.md` + `templates/project-starter/` |
| 基线版本 | 主题包 v1.0.11 · 图标包 v1.0.24 · peer `@arco-design/web-vue ^2.57.0` |
| Git 协作 | 只改文件，提交/推送由用户手动 |

## 6. 待办 / 下一步（Next）
- [ ] 补充**定制业务组件**文档（建议 `references/components-custom/`）。
- [ ] 继续补充**更多页面模板**（详情页、仪表盘、高级列表页/多条件筛选等）。
- [ ] （可选）为 `icon.md` 出一份 Pangea 专属图标使用文档（图标包 + iconBox），不动其他照搬文档。
- [ ] 清理脚手架 `src/pages/` 里的示例页（Example/CardList/ContractForm/GroupedForm/Dashboard）——它们是预览调试/示例用，是否保留为脚手架自带示例需定夺；保留则更新 router/menu 说明，移除则恢复单 Example。若移除 Dashboard，一并评估是否卸载 `@visactor/vchart` 依赖。
- [ ] **执行 `docs/plan-gates-metadata-website.md` 方案**（已评审通过，分 0–5 阶段）：
  - [x] 阶段 0（已完成 2026-07-23）：质量门禁清单 `references/overview/quality-gates.md`（G1–G8）+ 元数据 schema `references/overview/metadata-schema.md`（frontmatter `meta` + catalog.json 约定）；已接入 SKILL.md（索引 + 决策树引用）。
  - [x] 阶段 1（已完成 2026-07-23）：5 个 `page-*.md` 回填 `meta` frontmatter；新建 `references/component-selection/`（10 个高频组件选型文档）；写零依赖生成器 `scripts/build-catalog.mjs` 并生成 `references/_generated/catalog.json`（5 模板 + 10 组件）；SKILL.md 加「组件选型元数据」小节。
  - [x] 阶段 2（已完成 2026-07-23）：脚手架 `scripts/check-tokens.mjs` + `npm run gate` / `check:tokens`；`pm-compile-check` hook 加交付前跑 gate 说明；quality-gates.md / project-structure.md 同步命令。正负测试通过。
  - [x] 阶段 3（已完成 2026-07-23）：`website/` 骨架——fork project-starter（全站 GlobalLayout、hash 路由、base './'）、`sync-from-skill.mjs`（catalog→src/generated 提交 git）、首页 Home + 使用指南 Guide + 占位 ComingSoon；独立 install + gate 通过。
  - [x] 阶段 4（已完成 2026-07-23）：website 设计基础页 Foundations（颜色/圆角运行时读 CSS 变量 + 排版/间距/阴影静态档位）+ 组件预览页 Components（live 画廊分组 + 读 catalog 选型元数据）；router 指向真页面；gate 通过。
  - [x] 阶段 5（已完成 2026-07-23）：website 页面模板 Templates（索引 + 预览路由渲染同步来的示例页）+ 更新日志 Changelog（渲染同步的 CHANGELOG.md）；sync 扩展为同步示例页/LazyChart/CHANGELOG；website 加 `@visactor/vchart` 正式依赖；gate（含 build）通过。部署暂通用（`base './'`，静态产物可上任意托管，后续 Cloudflare）。
  - ✅ **方案 `docs/plan-gates-metadata-website.md` 阶段 0–5 全部完成**（质量门禁 + 元数据 + 官网 showcase 三条工作流落地）。

---

## ■ 更新协议（How to update this file）
**何时更新**（满足任一即更新）：
1. 完成一个里程碑（如产出一版脚手架、补一类文档）。
2. 做出会影响后续的重要决策（事实源、版本、约定）。
3. 新增 / 移动 / 删除了重要文件或目录。
4. 明确了新的待办或放弃了某个方向。

**更新哪里**：改「第 2 节 当前状态」「第 3 节 关键结论」「第 4 节 文件地图」「第 6 节 待办」，并在文末「变更日志」加一行；同时更新顶部「最后更新」日期。

**跨工具使用**：本台账是纯 Markdown，任何工具/AI 都能读。换软件/换电脑时，先读本文件即可恢复上下文。Kiro 下由 `.kiro/steering/context-management.md` 自动注入；其它工具可把其规则/AGENTS 指向本文件。**务必提交并推送到 Git**，否则跨机器无法同步、也无法防丢失。

**风格**：精炼、只记「对后续有用」的信息；不写流水账；结论要能被没有前情的人直接看懂。

**与 `CHANGELOG.md` 的分工**（详见 [CONTRIBUTING.md 第七节](./CONTRIBUTING.md#七changelog-与工程台账的分工)）：本台账写给**维护者**，过程 / 根因 / 实测数据 / 教训都往这里放，越细越好；`CHANGELOG.md` 写给**使用者**，只写「这个版本多了什么能力、升级后有什么不一样」。四类内容**只进台账**：① 同一版本内对新增内容的返工修正（使用者只看到最终状态；修的是上一个**已发布**版本才写进 CHANGELOG）；② 根因排查与踩坑细节（结论应落到规范文档，过程留台账）；③ 逐项实测记录；④ 不随包分发的东西（`scripts/` 仓库工具、`website/`、`_tests/`）。

---

## 变更日志（Changelog）
- 2026-07-21 建立台账 + `.kiro` 上下文管理机制；记录 skill 主体、脚手架、治理框架、GitHub 上传、图标统一等状态与关键决策（主题包为事实源、青绿主色、生成层级、不自动提交等）。
- 2026-07-21 脚手架可运行化（A+D+C）：修 3 处缺口并实测通过、加 lockfile、加 degit 一键起项目；补 form/table 模式文档；同步 SKILL/project-structure/README/CONTRIBUTING/CHANGELOG。（本仓 `_tests/` 效果测试材料本地保留、不入 Git。）
- 2026-07-21 加入「纯前端铁律」（SKILL/project-structure/CONTRIBUTING）；`_tests/` 换成 2 个完整场景用例（S1 请假管理、S2 商品管理，多页+路由+共享 mock store），并升级测试法为「生成→组装进脚手架→实测编译」，实测暴露并修复了表格插槽 record 无类型的 TS7053；已把该经验回流到 `table-patterns.md`（新增「插槽 record 的类型」小节）。
- 2026-07-22 新增 PM Demo 模式（方案 A+C）：SKILL.md 加「PM Demo 模式」章节（agent 职责清单/话术约定/初始化流程/路由提示/hooks 协作）；脚手架 `templates/project-starter/.kiro/hooks/` 新增 `pm-dev-server.json`（SessionStart 自动启动 dev server）+ `pm-compile-check.json`（PostFileSave 自动编译检查修复）；`project-structure.md` 新增「PM Demo 模式（多轮迭代体验）」章节。
- 2026-07-22 全局 Layout 标准化：基于 Figma「Pangea Design PC Templates / 菜单-展开」重写 `GlobalLayout.vue`（Header 48px + 左侧可折叠侧边栏 200px + 内容区白背景左上圆角 8px + 折叠按钮），新增 `layout-menu.less`（覆盖 Arco Menu 样式：选中态白背景+primary-7+medium、13px/12px 字号、4px 圆角、28px 缩进），`main.ts` import 该 less，router 注释更新，SKILL.md/project-structure.md 从「占位版」改为「标准化实现」，新增页面步骤变为 3 步（加菜单项）。待办中「标准化 Layout」已完成移除。
- 2026-07-22 新增「简单列表页」页面模板（`references/patterns/page-simple-list.md`）：基于 Figma 设计稿，适用于基础表格列表、无复杂查询条件场景。结构：页标题+操作栏(按钮组+input-group搜索)+表格(row-selection+bordered)+独立分页(small size)。SKILL.md patterns 索引已追加。经实测修正：控件 small 尺寸、分页总数左对齐+翻页器右对齐、表格撑满高度、Layout content 去 padding、状态列用 a-badge。
- 2026-07-22 新增「基础表单页」页面模板（`references/patterns/page-form.md`）：基于 Figma 设计稿（创建合同），适用于字段多、需独立页面录入/编辑场景。结构：顶部操作栏(返回icon+标题+帮助文档link+返回+提交)+可选Alert+垂直表单(a-form layout=vertical，a-row/a-col 3列栅格，含 input/select/switch/date-picker/radio-group)+子表单(可编辑a-table+新增一项)。SKILL.md patterns 索引已追加。后续微调：返回按钮改 text 类型+图标自定义 text-1 色、帮助文档改 text 按钮+IconFile 图标、头部按钮定稿为默认尺寸。
- 2026-07-23 Layout/菜单细节修正：① Header 左图标改 IconGeneral、Logo 用 IconHisense（108px 完整文字）、去掉右侧搜索框、平台名改 appName 变量（生成时替换）；② 侧边栏展开/折叠按钮（折叠后 sidebar 宽 0，按钮浮在内容区左缘）；③ 全局 Layout 固定视口高度（`height:100vh`+`overflow:hidden`），只内容区滚动，顶部导航不参与；④ 菜单各状态对齐组件设计稿（默认透明/hover `rgba(0,0,0,0.06)`/选中白底+primary-7+medium，选中+hover 保持白色），去掉 `.arco-menu-inner` padding；因 Arco 懒加载注入需用 `!important` 覆盖。
- 2026-07-23 新增「分组表单页」页面模板（`references/patterns/page-grouped-form.md`）：基于 Figma 设计稿，适用于字段极多、需分组+锚点定位的长表单。结构：顶部操作栏 + 左侧折叠分组(a-collapse，隐藏 header 边框线、组间 16px 间距、content 去左右 padding、header-left padding-left 20px、caret 图标 left:0) + 右侧锚点导航(a-anchor 绑定 scroll-container)。SKILL.md patterns 索引已追加。脚手架加 GroupedForm 示例页 + 路由 + 菜单。
- 2026-07-23 非颜色 token 化检查：确认主题包只把**颜色 + 圆角**注入为运行时 CSS 变量，字号/字重/间距仅 Less 变量。已把 `GlobalLayout.vue` 和 `layout-menu.less` 中所有硬编码圆角改为 `var(--border-radius-small/medium/large)`；在 `design-tokens.md` 补「哪些 token 是运行时 CSS 变量」说明，明确 scoped 样式中圆角用 var()、字号字重优先走组件或写档位字面值。
- 2026-07-23 新增测试场景 `_tests/cases/S3-meeting-room-booking.md`（会议室预约系统）：综合检验三个页面模板的选型与组装（会议室列表=简单列表页、快速预约=基础表单页、发起会议申请=分组表单页、我的预约=简单列表页复用），延续多页+路由+共享 mock store + 纯前端考察点。
- 2026-07-23 SKILL.md 三处刷新：① 明确 skill 定位为**海信集团 B 端/中后台产品**（新增「定位与适用范围」章节 + frontmatter description 更新）；② 新增「页面生成决策树」章节（高/部分/低匹配 → 套模板/增补/AI 自主设计，自主设计也须用设计系统组件+token）；③ 新增「图表（VChart）」章节（优先 VChart，配色接入 Pangea 调色板）。
- 2026-07-23 新增「对话框表单」页面模板（`references/patterns/page-modal-form.md`）：基于 Figma 设计稿（创建合同弹窗），适用于字段少、轻量、弹窗内录入/编辑（不跳转独立页）。结构：a-modal（宽 520–712px）+ 2 列栅格垂直表单（input/select/switch/textarea）+ 取消/确定；用 `on-before-ok` 返回 Promise<boolean> 控制校验后关闭、`ok-loading` 提交态、`unmount-on-close`。SKILL.md patterns 索引 + 决策树已同步追加。至此页面模板共 4 个。
- 2026-07-23 图标分工根因修复：**移除 `vite.config.ts` 中 `vitePluginForArco` 的 `iconBox` 全局替换选项**——iconBox 会连带替换 Arco 组件内建功能性图标（如 Modal 关闭按钮），破坏组件内部样式（表现为关闭图标 hover 变白看不清）。删除了治标的 `src/styles/arco-fixes.less` workaround 及 `main.ts` 中其 import。确立图标分工：功能性/组件内建图标用 Arco 默认（不替换）、业务/内容图标从图标包命名导入。已同步 project-structure.md、SKILL.md（3 处）、README.md、getting-started.md、theming.md。
- 2026-07-23 新增「卡片列表页」页面模板（`references/patterns/page-card-list.md`）：基于 Figma 设计稿（node 57:4916），适用于以卡片形式呈现数据列表（图文/资源/应用墙）。结构：页标题 + 操作栏（按钮组+搜索/筛选）+ 卡片网格（**统一用 a-card**，CSS grid `repeat(auto-fill, minmax(260px,1fr))` 自适应换行，卡片 header `#title`+`#extra` More 链接、body 描述+footer 头像/操作图标）+ 分页（复用简单列表页规范）。控件 small、圆角用 `var(--border-radius-large)`、卡片内操作图标走业务图标命名导入。SKILL.md patterns 索引 + 决策树已同步追加。至此页面模板共 5 个。
- 2026-07-23 卡片列表页细节打磨（核对设计稿 node 57:4916 / 689:35304，脚手架示例页 `src/pages/CardList/index.vue` + 模板文档同步）：① 筛选方案 placeholder 改「筛选方案」；② 页头底部加通栏 1px 下边框 `--color-border-2`（像素核对 rgb(229,230,235)），下内边距补 12px；③ 卡片右下角操作图标改为可点击 icon-hover 样式——用 `<a-button type="text" shape="circle" size="small">` 包裹图标（悬停浅灰圆背景）；④ 筛选行右上角新增展开/折叠按钮（`IconDown`/`IconUp` 切换）控制**高级筛选面板**：面板在筛选行与按钮组间插入，3 列 label+input 栅格、右下角保存(`IconSave`)/重置(`IconUndo`)/查询；⑤ 高级筛选面板加灰底 `--color-fill-1`(#F7F8FA) + 四边 1px 边框 `--color-border-3`(#C9CDD4) + `--border-radius-medium` 圆角 + 16px 内边距（均像素核对设计稿）。图标 `IconUp/IconDown/IconSave/IconUndo` 均图标包命名导入。
- 2026-07-23 响应式适配纳入全局准则 + 各模板落地：① SKILL.md「关键约定」新增「响应式适配（全局准则）」章节（表单栅格用断点不写死 span、卡片网格 auto-fill/fit、表格横滚/隐列、工具栏 wrap、固定宽防溢出、辅助区窄屏隐藏）；② 三个表单模板去掉写死列宽改响应式断点——基础表单页/分组表单页 `:span="8"`→`:xs="24" :sm="12" :lg="8"`、对话框表单 `:span="12"`→`:xs="24" :sm="12"`，整行字段仍 `:span="24"`；③ 分组表单页窄屏（≤992px）媒体查询隐藏右侧锚点；④ 卡片列表页高级筛选面板栅格 `repeat(3,1fr)`→`repeat(auto-fit, minmax(220px,1fr))`、动作组 `grid-column:1/-1` 独占整行右对齐（卡片主网格原本已是 auto-fill 响应式）。脚手架示例页（ContractForm/GroupedForm/Example.ContractModal/CardList）与对应模板文档同步，四条路由实测编译通过。
- 2026-07-23 新增仪表板示例页（非固化模板）`src/pages/Dashboard/index.vue`：参考用户提供的工作台截图组装——顶部欢迎信息、4 个 KPI 指标卡、左栏（流程中心 a-tabs+a-table、我的项目 a-table）、右栏（项目总体情况 分段占比条+统计、组织资产库统计 VChart 环形图）。**约束**：全部 Arco 组件 + Pangea token；页面白底、卡片区块一律用**边框线**（a-card bordered、无阴影/无灰底）；图表按 skill 约定用 **VChart**（新增依赖 `@visactor/vchart`），系列色取 Pangea 调色板 -6 阶 hex（canvas 需字面色值）；KPI 自适应网格 + 主区窄屏（≤1100px）堆叠。已注册 `/dashboard` 路由 + 菜单「仪表板（示例）」。`npm run build`（vue-tsc + vite build）实测通过。SKILL.md 图表章节补充 VChart 用法要点并指向该示例。因是示例非模板，未加入 patterns 索引/决策树。
- 2026-07-23 背景分层逻辑调整（全局准则）：① 全局 Layout 内容区 `.pg-layout__content` 背景由白色 `--color-bg-1` 改为 **透明**（漏出 body 灰底 `--color-fill-2`），保留左上圆角 + overflow（会把页面白底裁成圆角）；② 背景色改由**各页面自己设**——4 个内容页（简单列表/卡片列表/基础表单/分组表单）页面根加 `background: var(--color-bg-1)`；③ 仪表板示例页 `.pg-dash` 根改透明、所有 `a-card` 由 `:bordered="true"` 改 `:bordered="false"`（灰底 + 无边框白卡区隔）。SKILL.md 新增「页面背景（全局准则）」章节、project-structure.md 同步更新、4 个页面模板文档根样式同步加白底。脚手架 5 条路由实测编译通过、HMR 无报错。
- 2026-07-23 仪表板示例视觉打磨：① 白卡加**极轻阴影** `0 1px 4px rgba(0,0,0,0.05)` + **大圆角** `var(--border-radius-large)`（KPI 卡与面板）；② 流程中心 tabs 改**胶囊型** `type="capsule"`，数字用 `a-badge`（`:count`+`:max-count`）并用 inline-flex 水平居中；③ KPI 卡重设计——图标改「浅底色芯片」（各卡不同强调色，取 Pangea 调色板蓝/青绿/紫/金，10% 透明度做底 + 同色图标）、数值加大到 30px、底部趋势标签与描述之间加分隔线，提升层次与设计感。SKILL.md「页面背景」准则补充大圆角+极轻阴影+图标芯片做法。`npm run build` 通过。
- 2026-07-23 仪表板细节微调：流程中心 tabs 恢复默认尺寸（去 `size="small"`，仍 capsule）、去掉「待我审批」的数字徽标；我的项目表格——「我的角色」列改普通文本、「项目状态」列改用 `a-badge`（status 徽标：进行中=processing、已上线=success）、「进入」操作去掉右侧箭头图标。清理了对应的 role/status/tab 冗余样式。`npm run build` 通过。
- 2026-07-23 修流程中心 tabs 对齐：Arco 胶囊型 tabs 默认 `.arco-tabs-nav-type-capsule .arco-tabs-nav-tab { justify-content: flex-end }`（右对齐），在 Dashboard 用 `:deep()` 覆盖为 `flex-start` 改左对齐。
- 2026-07-23 VChart 依赖轻量化（方案 B：按需引入 + 懒加载 + 优雅降级）：① 从脚手架基础依赖**移除 `@visactor/vchart`**（`npm uninstall`，package.json/lockfile 已清干净，base 不再背 ~2MB）；② 新增通用封装 `src/components/LazyChart.vue`——`onMounted` 里**动态 import** vchart，装了渲染、没装显示占位提示（用 `// @ts-ignore` 抑制可选依赖的类型解析）；③ `vite.config.ts` 用 `createRequire().resolve` 检测是否安装，未装时把该包加入 `build.rollupOptions.external` + `optimizeDeps.exclude`，**保证没装图表库也能 `vite build`**；④ Dashboard 改用 `<LazyChart :spec="donutSpec" />`，移除直接 `import VChart`。两条路径都实测：**无 vchart 时 build 通过（7.5s，未打包）**、`npm i @visactor/vchart` 后 build 通过（14.4s，正常打包）。SKILL.md 图表章节 + project-structure.md 依赖章节同步「按需安装 + LazyChart + vite 可选依赖」写法。本地预览用 `npm i @visactor/vchart --no-save` 装着（不污染 package.json/lockfile）。
- 2026-07-23 CHANGELOG 版本化归组：确立版本划分——**≤ 2026-07-22 的全部改动归 `v1.0.0`（首个成型版本）、2026-07-23 起归 `v1.0.1`**；`[Unreleased]` 只保留「计划中」路线图。把原三段 `## 2026-07-21` 明细整合进 v1.0.0（按 Added/Changed/Fixed 分组），逐日细粒度流水仍以本台账为准。今后新改动累加到 v1.0.1 或按需开新版本号。
- 2026-07-23 定稿「质量门禁 + 组件/模板元数据 + Showcase 官网」实施方案（受 Mihua Design 调研启发）：产出蓝图文档 `docs/plan-gates-metadata-website.md`（**已评审通过、待实施**）。核心边界——**skill 为唯一事实源 + 核心交付；website 为 dogfood showcase、以 `templates/project-starter` 为基底 fork、独立部署、单向消费 skill 产物；不做可视化编辑**。锁定：元数据用文档 frontmatter + 生成 `references/_generated/catalog.json`；门禁 = 清单文档 `quality-gates.md` + 脚手架 `npm run gate`；部署暂通用（后续 Cloudflare）。分 0–5 阶段，阶段 0（门禁清单 + 元数据 schema）为地基先做。该方案文档独立于 skills/ 与 website/，改它不影响两者。
- 2026-07-23 方案阶段 0 落地（地基）：新增 `references/overview/quality-gates.md`（生成后质量门禁 G1–G8：编译/Token/组件与图标/响应式/背景分层/交互四态/可访问性/生成层级，每条含「怎么查」）+ `references/overview/metadata-schema.md`（页面模板/组件选型元数据 frontmatter `meta` 字段规范 + 示例 + `references/_generated/catalog.json` 生成约定）。SKILL.md 已接入：索引表加两行、决策树末尾加「生成后按质量门禁自检」提示 + 元数据选型引用。阶段 1（回填元数据 + build-catalog.mjs）待接续。
- 2026-07-23 方案阶段 1 落地：① 5 个 `page-*.md` 顶部 frontmatter 回填 `meta`（id/kind/whenToUse/whenNotToUse/keyStructure/variants/composeWith/composeBoundary/controls/pitfalls/previewRoute/source/tags）；② 新建 `references/component-selection/` 共 10 个组件选型文档（Table/Form/Modal/Card/Tabs/Select/Badge/Menu/Pagination/Alert，含 meta + 简要选型要点）；③ 写零依赖生成器 `scripts/build-catalog.mjs`（内置 meta 子集解析：内联数组/内联对象/标量），运行生成 `references/_generated/catalog.json`（5 模板 + 10 组件，各条自动补 `doc` 路径）；④ SKILL.md 加「组件选型元数据」小节指向 component-selection + catalog。阶段 2（脚手架 `npm run gate` + check-tokens）待接续。
- 2026-07-23 方案阶段 2 落地：脚手架新增 `scripts/check-tokens.mjs`（零依赖机检 G2：`.vue` 只扫 `<style>` 里的裸 `#hex` 与写死圆角，`.less/.css` 全扫；图表 JS 调色板 hex 为允许例外），`package.json` 加 `check:tokens` 与 `gate`（= `check-tokens && vue-tsc --noEmit && vite build`）。正/负测试均通过（干净→exit 0；注入 `#ff0000`+`6px`→exit 1 报 2 处）。`pm-compile-check` hook 加说明：每次保存只做即时编译检查，**交付前**另跑 `npm run gate` + 对照 G1–G8。quality-gates.md、project-structure.md 同步更新命令。阶段 3–5（website）待接续。
- 2026-07-23 方案阶段 3 落地：新建 **`website/`** 官网 showcase——以 `templates/project-starter` 为基底 fork 的独立 Vue 工程（自有 package.json/依赖/lockfile，运行时不 import skills/**）。全站用 `GlobalLayout`（站点导航 menuItems：介绍/使用指南/设计基础/组件预览/页面模板/更新日志，appName=Pangea Design），**hash 路由** + `base './'`。页面：首页 `Home`（Hero + 定位 + 6 张能力卡 + 读 `catalog.json` 的统计 + 页面模板 tag + 核心机制）、使用指南 `Guide`（三步跑通 degit/描述需求/预览交付 + 选型对照 + 生成机制 + PM Demo + 资源链接，结构参考花叔 Design）、占位 `ComingSoon`（设计基础/组件/模板/更新日志）。`scripts/sync-from-skill.mjs` 单向同步 skill 的 `catalog.json` → `src/generated/`（加 `_note` 标注 + README，提交 git，官网可独立构建）。独立 `npm install` + `npm run gate`（token 机检 + vue-tsc + build，4.1s）通过，dev 5173 路由 200。阶段 4（设计基础 + 组件 live 预览）待接续。
- 2026-07-23 方案阶段 5 落地（收尾，方案全部完成）：① `sync-from-skill.mjs` 扩展为递归同步——示例页（Example/CardList/ContractForm/GroupedForm/Dashboard）+ LazyChart → `src/generated/templates/`（Dashboard 的 `@/components/LazyChart.vue` 导入按同步改写为相对路径），并同步 `CHANGELOG.md`；② website 加 `@visactor/vchart` 正式依赖（showcase 需渲染仪表盘环形图），vite.config 检测到已装则正常打包；`vite-env.d.ts` 加 `*.md?raw` 声明；③ 新增**页面模板 Templates** 索引页（读 catalog + 链到预览路由）+ 5 条预览子路由渲染同步来的真实示例页；④ 新增**更新日志 Changelog** 页（`?raw` 导入 CHANGELOG.md + 零依赖轻量 markdown 渲染，转义后套 **加粗**/`代码`/链接）；⑤ GlobalLayout 菜单高亮支持子路由（/templates/xxx 高亮 /templates）。gate（token+vue-tsc+build 14.8s，vchart 打包）通过，dev 全路由 200。部署：`base './'` 静态产物，暂通用，后续 Cloudflare。**至此 docs/plan-gates-metadata-website.md 阶段 0–5 全部完成。**
- 2026-07-23 GlobalLayout 升级为**混合菜单结构**（参照 Figma 25:3623）：顶部 Header 横向**模块菜单** + 左侧**当前模块的多级菜单**，切换模块联动左侧；数据模型改为 `modules: {key,title,menu[]}[]`（每模块独立菜单），当前模块由路由自动推导、模块点击跳首个叶子、`selectedKeys` 支持子路由高亮父项、`defaultOpenKeys` 自动展开含当前路由的子菜单。**单/多模块按场景**：`modules` 只 1 个 → 自动隐藏顶部模块菜单退化为纯侧边菜单（Sidebar 头显示 appName）；多个 → 顶部显示模块菜单（Sidebar 头显示「当前模块」名）。`layout-menu.less` 增顶部横向模块菜单样式（透明底、去边框线、选中 primary-6）。脚手架默认配 3 模块（工作台/列表页/表单页）演示多模块并映射现有示例页；**同一份 GlobalLayout 同步到 website**（配成单模块=6 个栏目，自动无顶部菜单，与原观感一致）。project-structure.md / SKILL.md 生成层级铁律同步更新（menuItems→modules、单/多模块判断）。脚手架与 website 双 gate（vue-tsc+build）通过，dev 无报错。
- 2026-07-23 混合菜单微调（按用户要求）：**左侧菜单栏恢复原貌**——撤销了此前给 Sidebar 加的「当前模块」小标签 + 文件夹图标 + 菜单项图标，改回「左上角单一模块名（单模块=appName）+ 下方菜单（无图标）」，样式与交互与升级前一致；顶部横向模块菜单保留。`modules` 菜单项去掉 icon 字段、`MenuItem` icon 改回可选、移除相关图标 import 与 module-icon/info/hint 样式。脚手架 + website 同步，双 gate 通过。
- 2026-07-23 混合菜单两处贴稿修正（核对 Figma 25:3623 展开 / 28:5732 折叠）：① 顶部模块菜单**选中态加青绿下划线**（`.arco-menu-selected::after`，`left/right:16px bottom:0 height:2px` primary-6），layout-menu.less 改；② 侧边栏**折叠/展开按钮改胶囊样式**——展开为完整胶囊（16×62，`fill-2` 底 + 1px `border-2` 边、`border-radius: large`=8px 因宽 16 即上下端全圆、`right:-8px` 跨在侧栏右缘上、去掉旧 box-shadow）、折叠为贴左缘的右侧半胶囊（`left:0`、右侧圆角、`border-left:none`），chevron 颜色 text-3→text-2。GlobalLayout.vue（脚手架+website 各改一次）+ layout-menu.less（改后复制到 website）。双 gate 通过。
- 2026-07-23 混合菜单再微调：① 顶部模块菜单与 Header **等高 48px**（`.arco-menu`/`.arco-menu-inner`/`.arco-menu-item` 均 height:48 + inner `align-items:center` + item `inline-flex` 居中），使文字垂直居中、选中下划线落在 header 底部（layout-menu.less，复制到 website）；② 侧边栏折叠/展开按钮**加明显悬停态**——`.pg-layout__collapse-btn:hover` 底色转白(`--color-bg-1`)+ 描边与箭头转 `primary-6`；chevron 改为继承 `currentColor`（移除 IconLeft 内联 color，按钮 `color: text-2` 默认、hover 变主色），加 transition。GlobalLayout.vue 脚手架+website 各改。双 gate 通过。
- 2026-07-23 修顶部模块菜单样式不生效根因：顶部导航**确实是 `a-menu mode="horizontal"`**，但此前自定义样式选择器（`.pg-layout__module-menu .arco-menu-item`，特异性 0,2,0）与 Arco 的 `.arco-menu-horizontal .arco-menu-item` 同级，而 Arco 组件样式**懒加载注入在全局 less 之后** → Arco 默认（inner `padding:14px 20px`、item 高度等）覆盖了自定义样式，看起来「不像 horizontal」。修法：把 module-menu 选择器提到 `.pg-layout__module-menu.arco-menu .arco-menu-item`（更高特异性）并对 padding/height/line-height/margin/选中色加 `!important`（与侧边菜单同策略），使菜单与 Header 等高 48px、文字垂直居中、选中下划线贴 header 底。layout-menu.less 改后复制到 website，脚手架 gate 通过。
- 2026-07-23 website 内容重构为 **2 模块**（dogfood 混合菜单的多模块形态）：① GlobalLayout 由单模块改为 `设计系统` + `组件预览` 两个模块（顶部横向菜单切换），组件模块菜单从 `catalog.components` 动态生成（每组件一项）；② 组件预览由单页 live 画廊拆成**每组件一页** `/components/:id` —— 新建 `Components/Detail.vue`（读 catalog meta 显示适用/不适用/变体/组合边界/坑 + 按 id 渲染 Arco live demo：table/form/modal/card/tabs/select/badge/menu/pagination/alert），删除旧 `Components/index.vue`；③ router：`/components` 重定向到首个组件、`/components/:id`→Detail，其余设计系统路由不变。website gate 通过、dev 全路由 200。（skill 脚手架不受影响。）
- 2026-07-23 website 模块/菜单再调整：模块①改名「说明文档」（介绍/使用指南/更新日志）；模块②改名「设计系统」，菜单 = Design Tokens（原设计基础改名，第一）+ 页面模板（第二）+ **组件（一级菜单，第三，下挂各组件页为二级菜单，`components-group` 为非路由父项）**。GlobalLayout 模块归属新增 `menuOwnsPath` 前缀匹配（让 `/templates/xxx` 预览页正确归属设计系统模块）。website gate 通过、dev 全路由 200。
- 2026-07-23 方案阶段 4 落地：website 新增两页并接入路由。① **设计基础 Foundations**：颜色（品牌 primary 1-10、文字/背景填充/边框、状态色、扩展调色板）与圆角用 CSS 变量渲染色块并在 `onMounted` 读 `getComputedStyle` 显示解析值（体现「颜色+圆角是运行时变量」）；排版（字号 24/20/16/14/13/12 + 字重 400/500/600/700）、间距（4 倍档）、阴影按 Less 档位静态参考。② **组件预览 Components**：Arco+Pangea live 画廊（基础/表单/数据展示/反馈 分组，含 Button/Tag/Badge/Avatar/Input/Select/DatePicker/Switch/Radio/Checkbox/Tabs(capsule)/Table/Pagination/Alert/Message/Modal），下半读同步的 catalog 展示 10 个组件选型元数据（title + whenToUse）。router 把 /foundations、/components 从 ComingSoon 换成真页面。独立 gate（token+vue-tsc+build，5.2s）通过，dev 路由 200。阶段 5（模板预览 + 更新日志 + 部署）待接续。
- 2026-07-23 GlobalLayout 侧边菜单三处修正 + website 一级菜单图标：**（通用，脚手架+website 同步）**①二级菜单去图标占位——`layout-menu.less` 加 `.arco-menu-indent-list{display:none}`，二级缩进改由 `padding-left:28px` 提供；②一级选中态文字色 `primary-7` **补 `!important`**（此前无 `!important` 被 Arco 默认选中色 0,4,0 特异性覆盖，实际没生效）+ 二级选中色同补 `!important`；③二级项高度用 padding 调到 32px（`padding:6px 8px 6px 28px`，line-height 20 + 上下 6）。GlobalLayout.vue 加**一级菜单可选图标**支持（`MenuItem.icon?: Component`、`import { type Component }`，模板对一级 `a-menu-item` 与 `a-sub-menu #title` 渲染 `<component :is="item.icon"/>`，二级 child 不渲染图标；脚手架数据不配图标保持原貌）。**website 专属**：6 个一级菜单各配图标（介绍 IconHome / 使用指南 IconBook / 更新日志 IconFile / Design Tokens IconPalette / 页面模板 IconLayout / 组件 IconApps）；`defaultOpenKeys` 改为展开当前模块下**所有分组**（「组件」一级菜单默认展开）。`layout-menu.less` 改脚手架后 `cp` 到 website。脚手架 + website 双 `npm run gate` 通过，website dev 5173 运行。
- 2026-07-23 website 已部署到 Cloudflare Pages：**https://pangea-design-skill.pages.dev/** 。README 顶部加在线预览 callout + 「相关文档」加链接。（部署方式 = `base './'` 静态产物上 Cloudflare Pages。）
- 2026-07-23 website 介绍页(Home)内容重构 + 科技感设计（调 ui-ux-pro-max 技能指导）：借鉴「AI 设计 skill 产品站」通用框架，把原 4 板块扩为 **9 板块**——Hero(mono kicker + 4 项统计网格) / 01 为什么(3 张痛点→解法卡) / 02 能做什么(6 能力卡) / 03 怎么工作(4 步 stepper + 终端块) / 04 适合谁(PM 高保真 Demo vs 开发可交付 UI 双栏) / 05 页面模板一览(catalog 驱动卡片) / 06 与普通 AI 生成的区别(对比矩阵原生 table，Pangea 列高亮) / 07 核心机制(mono 编号列表) / 底部 CTA band(GitHub 外链)。视觉走**企业级 Swiss 栅格 + 克制科技感**：等宽字体 kicker/统计/终端、网格点阵底 + 双青绿光晕、玻璃卡 + hover 上浮/顶部渐变强调线、stepper 虚线连接 + 编号节点、终端窗口块。**全部 Pangea token**（颜色 `var(--color-*)`/`rgb(var(--primary-*))`/`rgba(var(--primary-6),a)`、圆角 `var(--border-radius-*)`、圆点/节点用 `50%`）；滚动进场用 IntersectionObserver（无 IO/reduce-motion 时降级全显）。踩坑：① `mask-image` 里 `#000` 会被 check-tokens 判裸 hex → 改 `black` 关键字；② 模板里不能用 `window.*` 内联 → 抽 `openGithub()` 方法。仅改 `website/src/pages/Home/index.vue`，未动路由/依赖。website `npm run gate`（check-tokens+vue-tsc+build）通过，dev 5173 运行。
- 2026-07-23 介绍页 Hero 主按钮改为「获取 Skill」（primary，外链到 skill 目录 `https://github.com/ysredcity/pangea-design-skill/tree/main/skills/pangea-design-vue`，IconGithub），使用指南/页面模板/组件预览降为次按钮；**删除最底部「开始用 Pangea Design 生成」CTA band 区块**（含其样式与 `--soft` 网格底、`IconBook` import）。`SKILL_URL` 常量 + `openSkill()`。website gate 通过。
- 2026-07-23 website 组件预览扩充（新增 6 个组件 + 解耦架构）：① Design Tokens/Foundations 展示**完整调色板**——品牌主色 + 全部 14 个基础色系（red/orangered/orange/gold/yellow/lime/green/cyan/blue/arcoblue/purple/pinkpurple/magenta/gray）× 10 阶矩阵（-6 描边标注、悬停看实时解析值），语义色（文字/背景填充/边框/状态）单列；确认主题包把全部 `--<hue>-1..10` 都注入为运行时 CSS 变量。② 组件预览由 catalog 驱动改为**站点本地清单** `Components/registry.ts`（分组有序：通用/数据录入/数据展示/反馈/导航，平铺 16 项）驱动菜单+路由+标题；新增统一示例块 `Components/DemoBlock.vue`；`Detail.vue` 改为按 id 用 `import.meta.glob` 动态加载专属 demo，命中 catalog 才显选型卡，无专属 demo 的 10 个走内联回退。③ 新增 6 个专属 demo（`Components/demos/{Button,Tag,Tooltip,Tree,Dropdown,Steps}.vue`），每个全面铺展属性/状态（Button：类型/状态/尺寸/形状/图标/加载/禁用/长按钮/按钮组；Tag：颜色13/尺寸/边框/可关闭/可选中/加载；Tooltip：12 方位/迷你/自定义背景/富文本；Tree：基础/勾选/连线/多选/可拖拽含 onDrop 重排；Dropdown：触发方式/图标选项/位置/下拉按钮；Steps：基础/描述/可点击/小型/点状箭头导航/错误态/垂直）。④ website GlobalLayout 组件子菜单改从 registry 生成、`/components` 重定向到 `/components/button`。Arco API 以 skill references/components 对齐。踩坑：dropdown `@select` handler 需签名 `(v: string|number|Record<string,any>|undefined)`。website gate（check-tokens+vue-tsc+build）通过，dev 全路由 200。（现有 10 个组件的内联 demo 未增强，本轮只加 6 个新组件。）
- 2026-07-23 修 Foundations 调色板「部分区块消失」：根因=浅阶色块（step 1–2 近白）无边框、块间 4px 间距落在白底容器上 → 视觉消失；叠加 `mix-blend-mode:difference` 让数字也发虚。参照 Ant Design 颜色规范页重做为**连续色块条**——每系一行，`.pal-scale` 用 `gap:1px + background:var(--color-border-2) + overflow:hidden` 让格间恒有 1px 分隔线（浅色也可见），块内显示阶数 + 实时 hex，文字色按亮度自适应（onMounted 解析 rgb 算 luminance<150→深块用浅字、否则深字；顺带 rgb→hex 展示），第 6 阶标「主」加粗。移除旧 chip 的 blend-mode/白底描边环。窄屏隐藏 hex、超窄堆叠。website gate 通过。
- 2026-07-23 表单组件页补全录入控件示例：新增专属 demo `Components/demos/Form.vue`（Detail 的 glob 自动接管 `form`，内联回退随之弃用）。四块：① 常用录入控件总览（一个 vertical 表单响应式栅格铺开 Input[前缀图标]/InputNumber/Select 单选·多选/Cascader/DatePicker/TimePicker/RangePicker/Radio/Checkbox/Switch/Rate/Slider/Textarea/Upload）；② 表单布局（vertical/horizontal/inline 单选切换）；③ 校验与提交（rules 声明式 required/邮箱/最小长度 + `@submit-success` + 重置 resetFields）；④ 控件尺寸(mini/small/medium/large)/禁用/只读。踩坑：`vrules` 标注 `Record<string,any>`、upload `file-list` 用 `any[]` 避免 vue-tsc 类型不匹配。website gate 通过。
- 2026-07-23 修「加 Form demo 后顶部 header 模块菜单样式错乱」：根因**不是** Form.vue 本身改了 header，而是它引入大量 Arco 组件（cascader/slider/rate/upload/time-range-picker…）→ Arco 组件样式**懒加载注入时机/顺序变化** + HMR 重注入，使原先仅靠**特异性**取胜、未加 `!important` 的顶部模块菜单覆盖规则（`.arco-menu` 的 height/background/border-bottom、`.arco-menu-inner` 的 height/align、item 的 font-size/color、selected 的 font-weight、hover 的 color）被 Arco 同级/后注入规则翻盘。修法：给 `layout-menu.less` 顶部模块菜单这些属性统一补 `!important`（与既有策略一致），使其不依赖注入顺序。scaffold(SSOT)+website 两份同步（copy 后 diff 一致），website gate 通过。提示：dev 下若仍见残留错乱，硬刷新（Cmd+Shift+R）清掉 HMR 旧注入样式即可。
- 2026-07-23 新增「需求规格化」输入处理层（提升需求输入质量、稳定生成结果）：新建 `references/overview/requirement-intake.md`——任何颗粒度输入（一句话～完整 PRD）在生成代码前，先转成**面向界面架构的需求文档**（概述/模块划分↔顶部模块/菜单导航↔左侧菜单/逐页 页型+布局+关键内容+交互/全局约定/待确认假设），参考头脑风暴原理但**克制限轮**（只澄清影响界面架构的模糊点、一次性打包问、最多 1–2 轮、余下用默认假设并标注），**用户确认后**（模块/菜单/页面结构/交互）才进决策树逐页生成→质量门禁；已确认文档下的增量/微调可跳过；建议留存工程 `docs/requirement.md`。SKILL.md 接入：决策树前新增「生成前：需求规格化（第一步）」章节、决策树改为「在需求文档确认后」逐页走、索引表加行、frontmatter description 补触发词（需求规格化/澄清/需求文档）、PM Demo 初始化流程插入「需求规格化并确认」步骤（对 PM 用非技术语言）。确立流程顺序：**需求规格化 → 决策树选型 → 生成 → G1–G8 门禁**。（纯 skill 文档改动，不影响 website/脚手架运行。）
- 2026-07-23 版本归组调整（按用户要求）：**今天（2026-07-23）的所有变动统一归为 `v1.1.0`**（此前暂记的 `[1.0.1]` 提升为 `[1.1.0]`，并把当天后续所有重要变更——官网 showcase/阶段3-5、混合菜单、website 2 模块重构、介绍页科技感重构、组件预览扩充 registry+6 组件+表单 demo、Foundations 全调色板与消失修复、header 菜单 !important 修复、需求规格化输入层、Cloudflare 部署等——一并并入 v1.1.0 的 Added/Changed/Fixed/Notes）。依据 SemVer：本批以「新增功能」为主 → MINOR 升级。`CHANGELOG.md` 已重写该版本段；`1.0.0` 段（≤2026-07-22）不变。逐日细粒度流水仍以本台账为准。
- 2026-07-23 官网体现需求规格化 + 重写使用指南：① 介绍页「怎么工作」流程由 4 步扩为 **5 步**（描述需求 → **需求规格化** → 决策树匹配 → 规范生成 → 门禁自检），终端演示加「规格化需求 → 确认界面架构」行，核心机制新增「需求先规格化」为首条（import IconFile）。② 重写 `website/src/pages/Guide/index.vue`：重心从「三步跑通（起项目/描述/预览交付）」转为**以需求澄清为中心**——把「起项目」「预览与交付」描述为 **skill 自动处理、用户不用操心**（降低心理负担，命令降级为页尾「可选」提示），主体改为「把需求说清楚」（澄清清单 7 项 + 好/模糊两种说法对照 + 澄清与确认 5 步流程 + 选型对照 + PM 提示）。全走 Pangea token，website gate 通过。
- 2026-07-23 同步官网更新日志到 v1.1.0：根 CHANGELOG 改版后 website 的 `src/generated/CHANGELOG.md` 是快照、需重跑同步——`npm run sync`（sync-from-skill.mjs）已更新（含 catalog/CHANGELOG/示例页 8 项）。另修：根 CHANGELOG 里 `<https://…>` 角括号自动链接改为 `[text](url)` markdown 链接（website 更新日志页的轻量渲染器会转义 `<`/`>`、只认 `[](())`，否则显示成字面尖括号）。website gate 通过。**提醒：以后改根 CHANGELOG.md 后要 `cd website && npm run sync` 才会反映到官网更新日志页。**
- 2026-07-23 三处调整：① **CHANGELOG 只记 skill 变更、不记 website**——顶部加范围说明，`[1.1.0]` 删掉「官网 showcase / Foundations 调色板重做与消失修复 / Dropdown select / 部署 Notes」等 website-only 条目，Fixed 合并为「菜单覆盖需 !important」+ 新增「顶部模块菜单竖向滚动条」；重跑 `npm run sync` 同步到官网更新日志页。**约定：website 变更只进台账、不进 CHANGELOG。** ② **修 header 右侧竖向滚动条**：根因=Arco 基础 `.arco-menu-inner{overflow:auto}` 叠加我们强制的 48px 高，内容略超出即出滚动条——`layout-menu.less` 模块菜单 inner 补 `overflow:hidden !important`（scaffold+website 同步）。③ **website header 右侧头像左侧加 GitHub 图标按钮**（`.pg-layout__gh`，a-tooltip 包裹，`openGithub()` 新标签打开仓库；hover 变主色+浅底）——仅 website GlobalLayout，脚手架不加（避免把本仓地址带进生成工程）。website gate 通过。
- 2026-07-23 修「外部工具实测：生成页面全空白」（附件 `~/Downloads/pangea-skill-optimization-prompt.md`）：根因=① 模板内写 TS 类型注解（如 `:disabled-date="(current?: Date)=>..."`）→ Vue 模板运行时编译失败、`router-view` 空白；② 对 reactive 用普通函数而非 `computed` 做派生（不响应）；**流程根因=先起 dev server、后跑类型检查，而 Vite 不做类型检查、不报错**。修法（纯文档/流程，vue-tsc 已能捕获①）：`quality-gates.md` G1 加**执行顺序硬约束**（先 `vue-tsc --noEmit`/`npm run gate` 再依赖 dev server）+ 新增 **G9「AI 代码常见陷阱」**（模板内 TS 注解 / 派生用 computed / 模板 async，含正反例与自查方式）+ frontmatter 与速查更新为 G1–G9；`SKILL.md` 决策树门禁提示与索引改 G1–G9、加「先类型检查再依赖 dev server」警告、「关键约定」补两条（模板不写 TS 注解、派生用 computed）、PM Demo 流程（首次/每轮/空白排错）与初始化步骤都插入 `vue-tsc` 把关；脚手架 `pm-compile-check` hook 提示补「保存 .vue 后额外跑 vue-tsc、别只看 dev 输出」。CHANGELOG（skill）[1.1.0] 记入 + 重跑 website sync。（未新增机检脚本：①由 vue-tsc 覆盖，②难可靠静态识别，靠 G9 清单。）
- 2026-07-23 版本修正：上一条「生成页面空白」修复（G1 执行顺序 + G9 + 流程/hook）单独归为 **`v1.1.1`**（不并入 1.1.0）。CHANGELOG 已把相关条目从 [1.1.0] 移出、新建 [1.1.1] - 2026-07-23（Fixed 空白页 / Added G9 / Changed G1 顺序+SKILL+hook）；[1.1.0] 的质量门禁条目回退为 G1–G8。重跑 website sync。**版本划分现状：≤07-22 = 1.0.0；07-23 主体 = 1.1.0；07-23 空白页修复 = 1.1.1。**
- 2026-07-23 路线图 + 三项修复（CHANGELOG 记为 **v1.1.2**）：① **CHANGELOG 计划中按「功能侧 / 生态侧」分组**（新增：提升需求→原型集成性、论证含 PRD 输出；套壳让原型边点边看交互描述、PRD+原型混合交互式呈现；梳理其他产品构建同类设计系统的必备输入与结构）；已 `npm run sync` 反映到官网更新日志（渲染器支持 `**bold**` 段落，分组标题正常）。② **单模块隐藏侧栏模块名**：`sidebarTitle` 简化为 `activeModule.title`，Sidebar Head 加 `v-if="isMultiModule"`（单模块下与 Header 系统名重复）——scaffold + website 两份同步。③ **需求文档须对齐页面模板基准**（修外部工具实测「产出与模板有偏差」）：`requirement-intake.md` 新增「命中页面模板时：以模板结构为基准」——页型→模板文档对照表、**逐区块照抄模板「## 页面结构」**、偏离须标 `[基准]`/`[增补]`/`[删减]`、无模板才写「自定义页型」；需求文档模板每页加「套用模板」字段；`SKILL.md` 规格化第 3 步补同款警告。④ **浏览器 title 取系统名**：脚手架新增 `src/config/app.ts` 的 `APP_NAME`（**系统名单一来源**），`main.ts` 设 `document.title = APP_NAME` + `router.afterEach` 用路由 `meta.title` 显示「页面名 · 系统名」，`GlobalLayout` 的 appName 改引用 `APP_NAME`（`@/config/app`），`index.html` 的 `<title>` 降为首屏占位并注明生成时替换；`project-structure.md` 同步（目录树加 `config/`、单模块隐藏说明、APP_NAME 段、G1–G8→G1–G9）。脚手架 + website 双 `npm run gate` 通过。
- 2026-07-23 官网介绍页同步最新 skill 变化：`website/src/pages/Home/index.vue` 把 **G1–G8 → G1–G9**（痛点解法卡 / 能力卡「生成后质量门禁」补「类型检查前置 + AI 代码陷阱」/ 流程「门禁自检」/ 对比矩阵「可交付性」/ 核心机制「门禁保交付」共 5 处）、Hero 统计「质量门禁 8→9」、「组件文档 72→**74**」（实际 `references/components/` 74 篇，之前数字过期）；流程「需求规格化」与机制「需求先规格化」补上**命中模板的页面以模板结构为基准**（v1.1.2 新规则）。website gate 通过。**注意：介绍页/使用指南的这类数字与规则是手写的，skill 侧改门禁数量、模板数、规则时需回来同步（catalog 驱动的模板/组件数会自动更新）。**
- 2026-07-23 修「需求文档与工程被同一轮一起生成」（绕过确认闸门，实测多次）：判断根因=①指令埋在 SKILL.md 中部，agent 可能先动手后读到；②原措辞是流程叙述（"先…再…"）而非**硬停止**，没说"结束本轮回复等待"；③"已确认"无判定标准，agent 把用户初始需求/回答澄清问题当成确认；④跳过条件宽泛易滥用。修法（纯文档，强化措辞+位置+可自检）：**SKILL.md 最顶部新增「🚦 最高优先级：两阶段强制门」**（表格列阶段一/二各自"要做/禁止做"，禁止清单含脚手架初始化·degit·npm install·写 .vue/路由/菜单；给出「已确认」唯一标准与不算确认的四种情形；跳过情形收紧为 3 条并注明从严解释；附违反表现）；`quality-gates.md` 新增 **G0 生成前硬门禁**（动手前三问自检）+ frontmatter/速查改 G0–G9；`requirement-intake.md` 确认闸门重写为「硬停止，禁止同轮继续开发」（阶段一收束话术、什么算/不算已确认、阶段二、动手前自检三问、**错误反例**）；SKILL 中部规格化第 4 步加⛔提示、PM Demo 第 5 步改"硬停止"、PM 流程表「首次生成」行标注"仅在需求文档已确认后执行"；frontmatter description 加"禁止同一轮既出文档又出工程"。CHANGELOG 记入 [1.1.2] Fixed（如需可拆成 1.1.3）+ 已 sync。**未做机械拦截**（考虑过 Kiro PreToolUse hook 拦 src/pages 写入，但只在 Kiro 生效、且可能误拦，跨工具场景仍靠文档；如需可加）。

## 2026-08-02 · v1.2.0 部署配置纳入 skill（修 aily/妙搭 白屏）

- **背景**：飞书 aily 是通用智能体，**执行开发类任务时会转交妙搭（Miaoda）执行** ⇒ 产物落在「纯静态托管 + `/page/<token>/` 子路径 + iframe」环境。实测「类型检查+构建都通过，但部署后白屏」，三层根因：① History 缺服务端 SPA fallback；② `base:'/'` 在子路径下资源 404（平台还注入动态 `<base>`）；③ **路由懒加载 chunk 在 iframe+动态 base+子路径下路径解析失败**（最关键，前两层修完仍白屏）。
- **关键判断（决定方案落点）**：**代码级自动检测不可行**——base/是否分包是构建期固化的决定；运行期虽能测 iframe，但资源 404 与 chunk 失败发生在我们 JS 执行之前。所以"自动切换"放在 **agent 指令层**：按环境信号自动选构建命令，**用户不做选择**。
- **落地**：脚手架 `.env`（默认 hash + `base './'` + 正常分包）/ `.env.embed`（hash + 单文件内联）/ `.env.history`（history + `base '/'`）；`vite.config.ts` 改 `defineConfig(({mode}) => ...)` + `loadEnv` 读 `VITE_ROUTER_MODE`/`VITE_BASE`/`VITE_BUILD_TARGET`，embed 时挂 `viteSingleFile()` + `cssCodeSplit:false` + `assetsInlineLimit` + `output.inlineDynamicImports`；`router/index.ts` 按 `VITE_ROUTER_MODE` 选 `createWebHashHistory`/`createWebHistory`（**页面仍用 `() => import()` 懒加载，不改静态导入**）；`package.json` 加 `build:embed`/`build:history`/`gate:embed` + devDep `vite-plugin-singlefile@2.3.3`。
- **默认行为变化**：路由默认 **History → Hash**，并显式 `base:'./'`（用户已确认按此推荐）。好处：任意静态托管/子路径开箱可用、免 fallback；aily/妙搭 场景与默认只差"单文件打包"一步。
- **拒绝的三条报告建议**（写下来避免以后重走）：① 报告的 `build:single` 脚本有 bug——`A=1 vue-tsc && vite build` 里变量只作用于前半句、`vite build` 拿不到，且 Windows 不支持 → 统一用 `--mode`；② "路由改条件/静态导入"**不必要**——`inlineDynamicImports` 已合并 chunk，条件导入还会让组件被 eager 收进主包；③ `process.env` 与 `import.meta.env` 混用 → 统一 `.env` + `loadEnv`。
- **文档**：新增 `references/overview/deployment.md`（三模式对照 / **环境识别信号表** / 三层根因消除表 / 体积权衡 / 白屏排错速查）；`requirement-intake.md` 全局约定加 `部署目标`（agent 自动填，**不额外提问**）；`quality-gates.md` G1 增"按目标模式构建 + 实测产物能渲染"；`SKILL.md` 索引+PM Demo+frontmatter；`project-structure.md` 同步；新增 `_tests/cases/S4-embed-deploy.md`。
- **实测结论（重要，别再只看"构建成功"）**：默认构建部署到子路径 `/page/token123/` → 5 路由正常；`build:embed` → 仅 `dist/index.html`（1.2MB / gzip 320KB、零外部引用），**`file://` 直接打开 5 路由全部渲染、无报错**（用 Playwright 无头 Chromium 实测；本机 Node 无 playwright，用的是 Python playwright + 缓存 chromium-1228，需 `executable_path` 指定）；`build:history` 产出绝对路径资源。
- **体积注意**：装了 `@visactor/vchart` 后单文件会 +2MB 量级 → 嵌入式场景建议避开图表页或接受体积。
- CHANGELOG 记 **[1.2.0] - 2026-08-02**（默认路由改 Hash 已显著标注为 Changed）+ 已 `npm run sync` 同步官网；website gate 通过。
- 2026-08-02 skill 打包流程固化：新增 `scripts/pack-skill.sh`（仓库级工具，区别于随包发布的 `skills/*/scripts/`）——版本号默认取 CHANGELOG 最新 `## [x.y.z]`（可传参覆盖）、产物 `releases/pangea-design-vue_<版本>.zip`（包内根目录 `pangea-design-vue/`，可直接上传 aily/妙搭）、打完自检（必需文件齐全 + 无 node_modules/dist/.DS_Store/_tests，不满足退出码 1）、可从任意子目录调用。**核心要点：打的是工作区当前状态而非 `git HEAD`**（用 `git ls-files --cached --others --exclude-standard`），否则未提交的新文件会被静默漏掉、打出旧版本内容。`releases/` 已加入 `.gitignore`。当前产物 `releases/pangea-design-vue_1.2.0.zip`（316K / 135 文件）。已实测：默认版本号、手动版本号、子目录调用、自检失败路径（退出码 1）均正确。踩坑：bash 里 `$SIZE，` 这种「变量名紧跟全角字符」会被当成变量名的一部分（`set -u` 下报 unbound variable）→ 必须写 `${SIZE}`。CONTRIBUTING 新增「五-b、打包上传平台」章节记录用法与注意事项。
- 2026-08-15 website「设计系统」模块新增**图标页**（Design Tokens 之后）：`/icons` → `src/pages/Icons/index.vue`，把图标包 `@arco-iconbox/vue-pangea-mobile` 的**全部 517 个图标**按 Figma 分类可视化，排列参考 lucide.dev/icons（无左侧筛选栏；有顶部吸顶搜索 + 分类锚点跳转），**点击图标块即复制其组件名**（`IconXxx`，clipboard API + execCommand 降级），复制态图标临时变对勾 + Message 提示。菜单项图标用 `IconFaceSmileFill`。
  - **分类数据生成**：新增 `website/scripts/build-icon-catalog.mjs`（`npm run build:icons`）→ 产出 `src/data/icon-catalog.json`（提交入库）。**分类事实源 = Figma「Pangea Icons Library」8 个分类画布**（通用/编辑/方向/影音/交互/提示/商标/AI，用 Figma MCP `get_metadata` 逐个画布取 kebab 名）；**图标事实源 = 图标包实际导出**。两侧名称都归一化（去非字母数字 + 转小写）后比对，解决大小写/连字符差异（如 Figma `faceBook-circle-fill` ↔ 导出 `IconFacebookCircleFill`）。脚本会报告：Figma 有但包里没有的（当前 2 个：`dev-process`、`mind-map`，已跳过不产生坏引用）；包里有但 Figma 未分类的自动归入「其他」（当前 3 个：focus/frame/mult-table），并**断言收录数 == 导出数（517）否则退出码 1**，保证一个不漏。
  - 分类分布：通用 196 / 编辑 91 / 方向 44 / 影音 24 / 交互 57 / 提示 29 / 商标 57 / AI 16 / 其他 3。
  - **实测**（Playwright 无头 Chromium）：517 个格子 = 517 个真实渲染的 SVG（无坏组件）、9 个分类计数正确、点击复制得到 `IconColumnSetting`、搜索 `arrow` 正确过滤到 10 个。website gate 通过。
  - 介绍页 Hero 统计加「图标 517」。**图标包升级后需重跑 `npm run build:icons`**（脚本会告知新增/未分类图标）。

## 2026-08-15 · v1.3.0 新增「分步表单页」模板（第 6 个页面模板）

- **来源**：Figma `Pangea Design PC Templates` node `344:12772`（用 Figma MCP `get_metadata` 取结构 + `get_design_context`(1518:17369) 取页头/步骤条规格 + `get_screenshot` 做视觉基准）。用户口述「分布表单页」，实为**分步（步骤条）表单页**。
- **定位**：支撑**大型、复杂数据录入**——录入拆成阶段推进，且同页并存多种录入交互。与已有 `page-grouped-form` 的边界：分组表单页 = **一次填完**的长表单 + 右侧**锚点**；分步表单页 = **分阶段** + 页头**步骤条** + 逐步校验 + 末步复核。
- **产出**：`references/patterns/page-step-form.md`（含 meta frontmatter，供 catalog 收录）+ 脚手架示例页 `src/pages/StepForm/index.vue` + 脚手架路由 `/step-form` 与「表单页」模块菜单项。
- **结构（对齐设计稿）**：页头两行（操作栏：返回+标题「创建合同」+ 帮助文档 + 上一步/下一步；步骤条 `a-steps` 居中 `max-width:900px`、每步带 12px 描述）+ 内容区（唯一滚动区，padding 24）；每步内 `a-collapse` 折叠分组（样式复用分组表单页那套 `:deep()` 覆盖）；字段 **4 列**响应式 `:xs=24 :sm=12 :lg=8 :xl=6`、`:gutter="20"`、整行 `:span=24`。
- **三步示例**：① 合同信息（设计稿的 3 个分组：4列多控件+textarea、只读子表单表格、日期/单选）② 明细与附件（**可编辑子表单**：行内 input/select/input-number + 添加行 + 删除保底一行；`a-upload`）③ 确认提交（`a-descriptions` 只读复核）。
- **关键约定（已写进文档 pitfalls）**：**必须用 `v-show` 切步骤**（`v-if` 会卸载表单项 → 已填数据与校验状态丢失、末步全量校验失效）；**每步只校验该步 `fields`**（`await formRef.validate(fields)`，一次校验整表会误报后续步骤）；末步提交前 `validate()` 全量；步骤条**不开 `changeable`**，跳转只走上一步/下一步以防绕过校验。
- **同步范围**：`SKILL.md` 决策树加分支 + 索引表加行（并把分组表单页描述改为"一次填完"以划清边界）；`build-catalog.mjs` 重跑 → catalog 页面模板 **5→6**；website `sync-from-skill.mjs` 的 `EXAMPLE_PAGES` 加 `StepForm`、router 加预览路由 `/templates/step-form`、`Templates/index.vue` 的 previewRoute 映射加 `page-step-form`。
- **实测**（Playwright 无头 Chromium，脚手架 dev :5174）：3 步步骤条、5 个折叠分组、2 个子表单表格、3 开关、3 日期选择器均正常渲染；**未填必填点「下一步」被正确拦截**（停留「合同信息」步 + 8 个错误项 + Message 提示）；截图与 Figma 设计稿逐区块比对一致。脚手架 + website 双 gate 通过。
- CHANGELOG 记 **[1.3.0] - 2026-08-15**（新增能力 = MINOR）+ 已 `npm run sync` 同步官网更新日志。
- 2026-08-15（同属 v1.3.0）新增**「详情页」模板**（第 7 个页面模板）：来源 Figma node `5917:19717`。定位=查看已录入数据（列表页「查看详情」入口）。
  - **核心架构决定：内容与容器解耦**。因用户明确「详情未必是独立页面，也可能是对话框或抽屉承载」→ 把详情内容抽成 `DetailPage/DetailContent.vue`（**不含页头**），页面壳 `DetailPage/index.vue` 提供页头 + 滚动区，并在同页演示 `a-drawer` / `a-modal` **复用同一份内容**（页头有「抽屉查看 / 弹窗查看」按钮）。内容组件 props：`fields/files/tableColumns/tableData/embedded/cols`。
  - **形态**：只读字段用「label 在上（14px text-2）/ 值在下（14px text-1）」的**表单式**布局（**不是** `a-descriptions` 边框表格——字段多时更紧凑且与录入页字段位置对照），3 列响应式；整行长文本 `white-space: pre-line`；空值统一 `—`；必填红星由 `required` 控制（设计稿保留，纯查看可关）；只读附件列表（40px 行 + 按扩展名映射 `IconUploadPdf/Zip/Ppt/Word/Excel/Image` 兜底 `IconUploadDefault` + 预览/下载图标按钮带 aria-label）；只读子表单表格 `size="medium"`。
  - **踩坑（重要，已写进文档与 CHANGELOG）**：① **Arco 栅格断点按视口宽度判断、不看容器宽度** → 720px 抽屉里 `:lg="8"` 仍渲染 3 列、偏挤，必须由容器显式传 `:cols="2"`（组件内做 cols→断点映射）；② `embedded` 用于去掉内容自身 `padding:24px` 交由容器控制；③ 抽屉/弹窗需 `unmount-on-close` 防多条记录数据串台。
  - **顺带修正**：只读子表单表格统一 `size="medium"`（分步表单页「签订依据」也补上），对齐分组表单页既有约定（Arco 默认是 large，行高偏大）。
  - **同步**：SKILL.md 决策树 + 索引表；catalog **6→7**；step-form / grouped-form 的「与其他模板区别」加交叉链接；website `EXAMPLE_PAGES` 加 `DetailPage`、router 加 `/templates/detail`、Templates previewRoute 映射加 `page-detail`。
  - **实测**（Playwright）：脚手架 :5174 与官网 :5173 均通过——12 只读字段（7 必填星）+ 3 附件行（3 类型图标）+ 5列×3行子表单；抽屉/弹窗各复用 12 字段且 `embedded` 生效；抽屉 `:cols="2"` 实际渲染 `arco-col-lg-12`。双 gate 通过。
  - 验证脚本踩坑：Arco 表格 DOM 用 `.arco-table-th` / `.arco-table-td`（**不是** `thead th`/`tbody`），早前用错选择器误判「表格 0 行 0 列」。
- 2026-08-15（同属 v1.3.0）新增**「审批详情页」模板**（第 8 个页面模板，**公司流程审批场景强制模板**）：来源 Figma node `4889:610250`。用户明确「交互比较多，先开发基本的页面结构」→ 本轮只做结构，交互留 TODO。
  - **结构**：页头两行（流程标题 20px semibold + 状态 `a-tag` + 打印/传阅 small 按钮 ／ 提交人信息行：avatar24 + 姓名 + 部门 + 1px 竖分隔线 + 提交于时间）+ body（灰底）内左侧**悬浮「快速审批」书签** + 两张白卡（① 业务详情 ② 审批流程区）。
  - **组合复用（关键）**：业务详情区**直接复用详情页的 `DetailPage/DetailContent.vue`**（传 `embedded`），审批流程区抽成 `ApprovalDetail/ApprovalProcess.vue`（与业务解耦，任何审批页可直接挂）。⚠️ 因此**复制 ApprovalDetail 时必须连带 DetailPage/DetailContent.vue**（文档已注明）；website sync 里两个目录都在 `EXAMPLE_PAGES`，相对导入 `../DetailPage/DetailContent.vue` 在同步产物中同样成立（gate 已验证）。
  - **背景分层**：页面根**不设白底**（漏出 body 灰底）+ 白卡区隔、卡间距 12px。这是本模板最易犯错处（设白底 → 白卡与背景同色、区隔消失），已写进 pitfalls。
  - **快速审批书签**：`position: sticky; float:left; margin-left:-24px` + 竖排 `writing-mode: vertical-rl` + `clip-path` 下切角；窄屏 ≤992px 退化为横向普通按钮（否则遮挡内容）；带 `aria-label`。
  - **审批流程区**：`a-tabs`(流程处理/流程图/传阅记录) +「显示审批记录」checkbox（勾掉隐藏记录表）+ 审批记录表格（**时间180/节点140/操作者128/操作120 四列固定宽**，处理意见列吃满剩余——不固定会被压缩换行；意见内可挂附件 `a-link`）+ **处理区**：**左 label 灰底列(136px, fill-1) + 右内容列的边框网格**（不用 `a-descriptions`——单元格里放 textarea+按钮难对齐），五行=操作 radio(通过/转办/沟通/驳回/不通过/加签)/处理意见 textarea+提交/附件 upload/即将流向/当前处理人；窄屏 label 列上移整行。`actionable=false` 可隐藏整个处理区（服务「我已处理/我发起的」只读场景）。
  - **实测**（Playwright，脚手架 :5174 + 官网 :5173）：状态 tag、3 Tabs、11 业务字段、4×5 记录表（含附件链接）、处理区 5 行 + 6 单选项均正常；勾掉「显示审批记录」记录表消失；**空意见提交被拦**（「请填写处理意见」），选「驳回」+ 填写后提交成功；页面根背景 `rgba(0,0,0,0)`、快速审批 `sticky`。双 gate 通过。
  - 验证脚本踩坑：`page.click("text=提交")` 会命中**审批记录表格里的"提交"文本单元格**而非按钮 → 必须用精确选择器（`.pg-approval-grid__value--comment button`）。
  - **同步**：SKILL.md 决策树 + 索引表；catalog **7→8**；page-detail 的「与其他模板区别」加交叉链接；website `EXAMPLE_PAGES` 加 `ApprovalDetail`、router 加 `/templates/approval-detail`、Templates previewRoute 映射加 `page-approval-detail`。
  - **后续迭代 TODO**（已在代码与文档标注）：快速审批抽屉、流程图、传阅记录、转办/加签选人、驳回选目标节点、附件真实上传预览、批量审批。
- 2026-08-15 审批详情页 7 项细节打磨（同属 v1.3.0，均已实测）：① 业务详情区补上**只读子表单「指标」**（`:table-columns`/`:table-data` 传给 DetailContent，自动成为第二个折叠分组）；② 快速审批书签补 `margin-right: 8px`（原先紧贴白卡，实测间距 0→8px）；③ **点击快速审批 = 切回「流程处理」页签 + 平滑滚动到处理意见 + 聚焦 textarea**（`ApprovalProcess` 用 `defineExpose({ focusComment })`，页面用 `ref` 调；实测 scrollTop 0→615、行可见、`document.activeElement` 为 textarea）；④ **操作切到「通过」以外自动清空处理意见**（`watch(form.action)`，切回「通过」回填「同意」；实测 同意→''→同意）——避免把「同意」误带到驳回/不通过；⑤ 提交按钮高度始终等于 textarea（容器 `align-items: stretch` + `:deep(.arco-btn){height:auto}`，实测均 54px；原先 Arco 固定 32px 会错位）；⑥⑦ **清掉 Arco Tabs 三处默认样式**：`.arco-tabs-nav` 的 padding/border 归零 + **`.arco-tabs-nav::before {display:none}`（默认下边框其实来自伪元素，只改 border-bottom 去不掉——关键点）** + `.arco-tabs-content{padding-top:0}`，留白统一交给 `__pane{padding:16px}`。文档 `page-approval-detail.md`（设计规范/代码骨架/使用要点）与 CHANGELOG 同步更新；脚手架 + website 双 gate 通过、已 sync。
- 2026-08-15 审批详情页再补 4 项（同属 v1.3.0，均实测）：① **全屏（沉浸）模式**——页头「打印」左侧加「全屏 ⇄ 退出全屏」（`IconFullscreen`/`IconFullscreenExit`，`Esc` 可退），用于预览「从邮件/待办/IM 直接打开、看不到全局导航」的形态。**关键坑：只加 `position:fixed; z-index:1000` 盖不住 Layout 侧边栏**——诊断出 `.pg-layout__content` 是 `position:relative; z-index:1`，**形成层叠上下文**，子元素 z-index 再大也逃不出去；解法 = `<Teleport to="body" :disabled="!isFullscreen">` 把整页移出该上下文（组件状态不丢），并自补 `background: var(--color-fill-2)`（脱离 Layout 后拿不到它的灰底）。实测全屏后 `.pg-approval` 父元素变 BODY、视口 (10,10)/(60,450) 命中的都是页面自身元素（侧边栏不再压在上面），Esc 后回到 `.pg-layout__content`。② **修正上一轮过度删除**：tab 下边框要保留——**只去 `.arco-tabs-nav` 的 padding，保留 Arco 自带的 `::before` 那一条**；自己再加 `border-bottom` 会两条、把 `::before` 关掉又没有线（文档/CHANGELOG 已同步纠正上一轮写法）。③ **传阅记录 tab**（Figma `344:28409`）：传阅时间/传阅发起人/传阅对象/操作（`查看` + `更多` 下拉含重新传阅、撤回）+ 表格内置分页（`showTotal`+`showPageSize`，实测「共 50 条」+ 每页选择器）。④ **流程图 tab**：虚线占位嵌入区（`min-height:320px` 防切页签跳动 + `role="img"`/`aria-label`），不放真实图表。文档 `page-approval-detail.md`（meta/设计规范/代码骨架/使用要点/pitfalls）全量同步；双 gate 通过、已 sync。
  - 验证脚本踩坑：Arco Tabs 会把**未激活的 pane 也留在 DOM**，用 `.arco-tabs-content-item` 取值会读到别的页签内容 → 必须用 `.arco-tabs-content-item-active` 限定。
- 2026-08-15 审批详情页再补 5 项（同属 v1.3.0，均已 Playwright 实测通过）：
  ① 处理区「当前处理人」文案 `部门长审批` → **`项目负责人审批：张益达,吴迪`**（index.vue 的 `currentHandler`）。
  ② **传阅记录表格删除「操作」列** → 只剩 传阅时间/传阅发起人/传阅对象 三列（传阅是既成事实的记录，不在此撤回/重发）。实测表头 3 列、数据行 3 单元格。
  ③ 「显示审批记录」checkbox **同行右侧**加 `a-link`「以发起人身份操作」（容器 `.pg-approval-process__bar` 用 `justify-content: space-between` 两端对齐），点击开 `a-modal`（`title-align="start"`、`800`、`ok-text="提交"`、`unmount-on-close`），body **复用 `.pg-approval-grid` 同一套样式**（三行：操作 radio 催办/撤回 · 处理意见 textarea · 当前处理人）。Figma `344:28366`。
  ④ 页头「传阅」按钮打开**传阅对话框**（Figma `4889:612531`）：`title-align="start"`、`520`；body = 必填星号 + 「传阅对象」label + **多选 `a-select`**（`multiple` `allow-clear` `:max-tag-count="3"`、placeholder「请选择」）+ `a-alert type="info"`「系统会通过「邮件」告知传阅对象」；**未选对象时「确定」禁用**（`:ok-button-props="{ disabled: targets.length === 0 }"`），每次打开清空已选。实测 disabled true→选 2 人后 false。
  ⑤ **处理区的行「组成 + 顺序」随所选操作变化**（Figma `4889:616656`，本模板最易做错处）。**核心决策：数据驱动行序，拒绝「固定超集 + `v-if` 显隐」**——因为转办/沟通/加签把「即将流向」提到「处理意见」**之上**、驳回把它压到附件**之后**，顺序变化用显隐做不到。实现 = `ROW_LAYOUT`（每操作的有序 row key 数组）+ `ACTION_CONFIG`（`commentRequired` / `pickLabel` / `nextText` / `defaultComment`），模板 `<template v-for="row in rows">` + 一串 `v-else-if`。八种行类型：`comment`（必填时 label 显示「处理意见(必填)」）/ `attach` / `pickNext`（可编辑选人：`a-dropdown`+`IconPlus` link + `a-tag closable`，文案「添加转办人/沟通人/审批人」）/ `nextText`（只读：通过=下一节点、驳回=`—`、不通过=`结束节点`）/ `rejectTo`（`a-select`「请选择节点」）/ `rejectMode`（「按顺序流转 / 返回这个节点所有人」）/ `signMode`（「前加签 / 后加签」+ `a-tooltip mini`：前=「加签人先处理，之后我处理」后=「审核通过，之后让加签人处理」）/ `handler`。切操作时连带复位 picked/rejectTo/rejectMode/signMode。提交校验按操作分支（必填意见 / 需选人 / 驳回节点）。
  - **实测行序**（逐个切 6 个 radio）：通过 `意见·附件·流向·处理人`；转办 `流向·意见·附件·处理人`；沟通 `流向·意见(必填)·附件·处理人`；驳回 `驳回到·驳回节点通过后·意见(必填)·附件·流向(—)·处理人`；不通过 `意见(必填)·附件·流向(结束节点)·处理人`；加签 `加签方式·流向·意见·附件·处理人`。另实测：加签 tooltip 文案、驳回 select placeholder/两个 radio、沟通空意见提交被拦（「请填写处理意见」）、选人下拉加人出 tag、提交按钮与 textarea 同高 54/54。
  - ⚠️ **新踩坑（重要）**：处理意见行现在渲染在 `v-for` 内，Vue 3 会把同名模板 `ref` **收集成数组** → `commentRow.value.scrollIntoView` 直接报错、「快速审批」滚动定位失效。解法 = **函数 ref**（`:ref="setCommentRow"` / `:ref="setCommentInput"`）。已回归实测：切到流程图页签后点快速审批 → 页签切回、scrollTop 0→723、行在视口内、`activeElement` = TEXTAREA；顺带回归全屏（父元素 BODY、1440×800、Esc 退出）与无 console/page error。
  - 验证脚本踩坑：`.arco-select-dropdown` 会同时匹配到**传阅记录分页的 pageSize 下拉**（未激活 pane 仍在 DOM）→ 用 `:visible` 伪类限定；`a-modal` 未打开时 DOM 也已存在，`.arco-modal-footer button` 会匹配到多个弹窗的按钮，需按 DOM 顺序取（origin 在前、传阅在后）。
  - **同步**：`page-approval-detail.md` 全量更新（meta description/keyStructure/variants/composeWith/composeBoundary/pitfalls + 新增「处理区行序表」与「对话框」两节 + 代码骨架改为 ROW_LAYOUT 版 + 使用要点扩到 10 条）；CHANGELOG [1.3.0] 的审批详情页条目改写；catalog 重跑（仍 8 个模板，front-matter 变更需重跑）；website `npm run sync` + 双 gate 通过。
- 2026-08-15 审批详情页再补 2 项（同属 v1.3.0，均实测）：
  ① **「添加转办人 / 添加沟通人 / 添加审批人」改为纯占位入口，点击不触发任何效果**（用户明确：实际代码实现时会接标准人员选择器）。原本的 `a-dropdown` 候选人列表 + `a-tag closable` 一并删掉，`form.picked`、`CANDIDATES`、`pickableCandidates`、`addPerson`/`removePerson`、以及提交校验里的「请{pickLabel}」也随之移除（留注释说明：接入选择器后需补「未选人拦截提交」）。`pickLabel` 保留（只用来出 link 文案），`.pg-approval-grid__value--pick` 的 `flex-wrap/gap` 保留（备将来回填人员 tag）。实测点 link 后文案不变、0 个 tag、无弹层、无 Message。
  ② 快速审批书签**左侧也补 8px**：内容区左内边距 24px，故 `margin-left` 由 `-24px` 改为 **`-16px`**（抵消 24 再留 8），配合原有 `margin-right: 8px` → 实测左右间距各 8px、仍 `position: sticky`。
  - 回归：6 个操作行序全部不变、沟通空意见仍被拦（「请填写处理意见」）、快速审批仍能切回页签+滚动(455)+聚焦 TEXTAREA、无 console/page error。
  - 同步：`page-approval-detail.md`（行类型表 pickNext 说明、提交校验说明、代码骨架、快速审批 margin 说明与代码、使用要点第 9 条）+ CHANGELOG [1.3.0] 对应措辞；website `npm run sync` + 双 gate 通过。
- 2026-08-15 脚手架 5 项缺陷修复（同属 v1.3.0，均已 Playwright 实测；含两个**根因不在表象处**的坑，务必记住）：
  ① **顶部导航「工作台」点不动 —— 根因是 dev 下 `@visactor/vchart` 解析失败让整页挂掉，与菜单无关。** 排查过程：先用 `elementFromPoint` 确认命中的就是 `.arco-menu-item`（不是被 108px 的 `IconHisense` 遮挡），JS 强制 `.click()` 也不跳转；再看 console 发现 `Failed to fetch dynamically imported module .../Dashboard/index.vue`；`curl` 该模块 200、但 `curl /src/components/LazyChart.vue` **500**，报 `Failed to resolve import "@visactor/vchart"`。真因：`@visactor/vchart` 是可选依赖（scaffold 未安装，`node_modules/@visactor/` 只是个空残留目录），`vite.config.ts` 原先只做 `optimizeDeps.exclude` + build 侧 `rollupOptions.external`——但**`optimizeDeps.exclude` 只跳过预构建，dev 的 import 分析仍会解析裸包名**，失败就对整个模块返回 500，`LazyChart` 的 `try/catch` 优雅降级压根执行不到 → `/dashboard` 的动态 import 失败 → 整页白 → 表现为「菜单点了没反应」。**修复**：`vite.config.ts` 增加 `apply: 'serve'` + `enforce: 'pre'` 的兜底插件，未安装时把该包 `resolveId` 到虚拟模块 `\0virtual:pangea-optional-chart-missing`，`load` 返回一行 `throw new Error(...)` → `await import()` reject → 被 catch → 正常显示「图表未启用」占位。实测：点「工作台」→ `#/dashboard`、仪表板渲染、图表位出占位、**零 console 报错**。⚠️ 教训：`optimizeDeps.exclude` ≠ dev 可解析；可选依赖必须 **dev + build 两侧都兜**。SKILL.md 与 `references/overview/project-structure.md` 里「不影响 dev」的旧描述已纠正。
  ② **分组表单页点右侧锚点跳到空白页 —— 根因是 Arco Anchor 改写 `location.hash` 顶掉了 hash 路由。** 脚手架默认 `createWebHashHistory()`，URL 是 `#/grouped-form`；Arco `a-anchor` 默认 `changeHash: true`，点链接会把 hash 改成 `#group-detail` → vue-router 匹配不到 → 整页空白（`id="group-xxx"` 本身没问题）。**修复**：`a-anchor` 加 **`:change-hash="false"`**（只滚动、不动 URL）。实测点三个锚点 URL 始终为 `#/grouped-form`、滚动与 `arco-anchor-link-active` 高亮正常。已写进 `page-grouped-form.md` 的 pitfalls + composeBoundary + 代码注释。→ **凡在 hash 路由工程里用 `a-anchor`，必须关 changeHash。**
  ③ 分步表单页**第一步不渲染「上一步」**：`:disabled="isFirst"` → `v-if="!isFirst"`（不留永远点不动的按钮）。实测按钮组：第1步 `下一步`／第2步 `上一步+下一步`／第3步 `上一步+提交`／退回第1步「上一步」再次消失。
  ④ 分步表单页**步骤条改小尺寸 + 去掉描述文字**。⚠️ **Arco Steps 没有 `size` 属性，只有布尔属性 `small`**——第一次写成 `size="small"` 时**静默不生效**（DOM 里既无 `arco-steps-size-small`、图标仍 28px），是靠读 `node_modules/@arco-design/web-vue/es/steps/steps.js` 看到 `[`${prefixCls}-size-small`]: props.small` 才定位到。改用 `small` 后实测 `arco-steps-size-small` 生效、图标 24×24、无 description。
  ⑤ 分步表单页**字段栅格列数上限 4 → 3**：去掉 `:xl="6"`，断点为 `:xs="24" :sm="12" :lg="8"`。实测 col class 最深只到 `arco-col-lg-8`、每行实测最多 3 列。
  - 同步：`page-step-form.md`（frontmatter keyStructure/ASCII/操作栏/步骤条/栅格章节/代码骨架 全量改为「最多 3 列 + small + 无描述 + 首步不渲染上一步」）、`page-grouped-form.md`、`SKILL.md`（图表章节）、`references/overview/project-structure.md`；catalog 重跑；CHANGELOG [1.3.0] 新增 **Fixed** 段 + 「Changed（分步表单页细节）」段 + Verified 补实测结论。scaffold + website 双 gate 通过、已 sync；website 侧预览页（:5173 `/templates/step-form`、`/templates/grouped-form`）同样实测通过。
  - website 侧同步（不进 CHANGELOG）：website 自己装了 `@visactor/vchart`（`chartInstalled=true`）所以本就不受 ① 影响，但其 `vite.config.ts` 存在同一个潜在坑 → **已补上同样的 `optionalChartDevFallback()` dev 兜底插件**（仅 `chartInstalled=false` 时注册，与脚手架实现保持一致）。
    验证方式（有效的手法，以后可复用）：把 `website/node_modules/@visactor/vchart` 临时改名成 `__vchart_hidden__` 造出「未安装」环境 → 重启 dev（另开 5175 端口）→ `curl` LazyChart 模块得 **200**（修复前会是 500）、`/#/templates/dashboard` 整页正常渲染且显示占位「图表未启用 / 运行 npm i @visactor/vchart 后显示」、**零 console 报错**；再改回原名重启 5173 → 图表恢复为真实 canvas（`canvases:1`、`placeholders:0`）、插件不注册。website gate 通过。
- 2026-08-15 新增**硬性设计约束「对话框宽度档位」**（同属 v1.3.0，已实测）：
  - **档位**：`a-modal` 只有 **520 / 720 / 1000** 三档、**不得超过 1000**；**1000 档仅当弹窗内含表格等宽组件**（只读子表单、可编辑明细、宽列表）才可用，没表格就降 720 / 520。520 = 默认档（不传 `width` 即 520，来自 Arco `.arco-modal { width: 520px }`）。装不进 1000 → 不该待在弹窗里，改独立页面。
  - **确认类固定 400**：`Modal.confirm|warning|info|error|success`（simple 模式），**不传 width**。
  - ⚠️ **关键坑（实测才发现）**：Arco 自带 `.arco-modal-simple { width: 400px }`，但**实测渲染出来是 464px**——`.arco-modal` 是 **content-box**，simple 模式把 `padding: 24px 32px 32px` 加在**根节点**上，400+32+32=464。（普通对话框的水平 padding 在 `.arco-modal-body`、根节点 padding 为 0，所以 520/720/1000 是准的，实测 offsetWidth 与 cssWidth 一致。）→ 新增全局覆盖文件 **`src/styles/arco-overrides.less`**（`.arco-modal-simple { box-sizing: border-box }`）+ `main.ts` 引入，400 才是真实视觉宽度。**复制脚手架时勿丢该文件与引入**（已写进 project-structure.md 文件地图 + 说明）。
  - **约束已进机检**：`check-tokens.mjs` 加第 3 条规则——扫 `.vue` 中 `<a-modal>` 开标签里的**字面** `width`（手写小状态机截取标签属性区，避免被属性值里的 `>` 干扰），非档位或 >1000 则 `exit 1`，报错定位到 `width` 属性所在行；`width="auto"` / `fullscreen` / 绑定表达式跳过。**已用注入用例反向验证**：`800 / 1200 / 960` 被准确报出且区分「不在档位」与「超过 1000 上限」，`520 / 720 / 1000 / 不传 / auto / fullscreen / 三元表达式` 均正确放过。
  - **修正既有违规**：`Example/ContractModal.vue` 712→**720**；`DetailPage/index.vue` 弹窗查看 960→**1000**（含 5 列只读子表单表格，符合 1000 档条件，已加注释说明理由）；`ApprovalDetail/ApprovalProcess.vue`「以发起人身份操作」800→**720**（无表格）。传阅弹窗 520 本就合规。
  - **实测各弹窗真实宽度**（Playwright `getBoundingClientRect`）：对话框表单 720 / 详情页弹窗查看 1000（内含 5 列表格）/ 传阅 520 / 以发起人身份操作 720 / 删除确认 400（覆盖前 464）。website 侧预览同样 1000 + 400。
  - **顺带一条有意思的交叉验证**：把新规则同步到 website 的 `check-tokens.mjs` 后，它**独立报出了 website/src/generated 里 3 个尚未 sync 的旧宽度**（712 / 960 / 800）—— 正好等于我改的那三处，`npm run sync` 后恢复通过。说明规则有效且 sync 链路完整。
  - **同步**：SKILL.md 新增「对话框宽度（全局准则，硬约束）」小节 + 响应式准则交叉引用；`component-selection/modal.md`（frontmatter variants/composeBoundary/pitfalls + 正文）、`patterns/modal-patterns.md`（新增置顶「宽度档位」表）、`patterns/page-modal-form.md`（frontmatter + 正文 + 代码 712→720）、`patterns/page-detail.md`、`patterns/page-approval-detail.md`（含 controls.originModal 800→720）、`overview/quality-gates.md`（G2 机检三条规则 + 检查项）、`overview/project-structure.md`（文件地图加 `src/styles/`）；catalog 重跑；CHANGELOG [1.3.0] 新增「Added（设计约束：对话框宽度）」段 + Verified 补实测。
  - website 侧（不进 CHANGELOG）：同步加了 `src/styles/arco-overrides.less` + `main.ts` 引入 + `scripts/check-tokens.mjs` 第 3 条规则，与脚手架保持一致；双 gate 通过。
- 2026-08-15 skill 评测复盘：采纳 2.5 条、驳回 1 条（同属 v1.3.0）。评测给了两条建议，核查后结论如下——
  - **评测建议 1「精简 description 至 200 词 + 强化两阶段门」→ 只采纳后半条。**「两阶段门提到第一句」有价值（原先埋在 703 字里约 60% 处，且此前确实发生过"文档与工程同轮产出"），已改为开篇 `⚠️ 硬约束（最高优先级）`。但**"精简到 200 词"不该做**：description 的作用是**触发匹配**，里面那串关键词（Pangea / Pangea 3 Linear / 主题包与组件库包名 / a-button·a-table·a-form·a-modal·a-select·Message / 飞书 aily·妙搭·Coze / VChart）是刻意铺的召回网，砍长度＝直接掉召回率；且 703 字符远没到 skill description 的 **1024 字符上限**。实际做法＝重排 + 只删泛化尾部枚举（全局注册/按需加载/国际化/组件属性事件插槽/示例…）+ 补新关键词（分步表单页、审批详情页、对话框宽度档位、质量门禁）。改完**净长度仍是 703**（用脚本断言关键词零丢失 + 长度 < 1024）。
  - **评测建议 2「固化离线初始化 + 私有 registry 文档」→ 前提是错的，驳回主体。** 实测 `npm view --registry=https://registry.npmjs.org/`：`@arco-design/web-vue` 2.58.0、`@arco-themes/vue-pangea-3-linear` 1.0.11、`@arco-iconbox/vue-pangea-mobile` 1.0.25 —— **三个包全部在公共 npm 上**，工程里也没有任何 `.npmrc`。写"私有 registry 配置"等于凭空造一份不存在的配置要求，会把新用户带去折腾伪问题。→ 反向处理：在 `getting-started.md`「安装」开头与 `project-structure.md` 新增小节**明确写「不需要私有 registry」**，并给出正确排查顺序（网络/代理/Node ≥ 18，**不要改 registry**）。`init.sh` 也没做：真离线不可能（`npm install` 必须连 registry），而 skill 会跑在 Windows / 无 shell 沙箱，加脚本只是增加维护面。
  - **吸收了建议 2 里唯一成立的内核**：原先主推 `npx degit ysredcity/...` 起项目，**依赖 GitHub 出网**，而 skill 包里本来就带着 `templates/project-starter/`——沙箱/内网下 degit 会失败而本地模板明明可用。→ `SKILL.md`「纯前端铁律」+ `project-structure.md`「快速开始」都改成**首选 `cp -R` 复制本地模板，degit 降级为备选并标注网络依赖**。
  - **⭐ 核查中发现一个评测没提、但优先级更高的真 bug（已修）**：`SKILL.md` 顶部两阶段门禁止阶段一做「脚手架初始化 / degit / npm install」，但同一份文件里「PM Demo 模式 → 工程初始化流程（首次对话）」的步骤顺序是 `1.问目录 → 2.初始化工程 → 3.npm install → 4.起 dev server → 5.需求文档确认(硬停止) → 6.生成页面`——**这份清单本身就在教 agent 违反那道门**，严格照做就会复现之前反馈过的"文档和工程同时生成了"。（旁证：同文件 PM Demo 职责表那行反而标了"仅在需求文档已被确认后执行"，说明是这份清单漏改。）→ 已重写为显式回合分段：**第一回合只做「需求规格化 + 请确认 + 停下」（目标目录一起打包问）**，初始化/install/生成页面/类型检查/起 dev server 全部划入**第二回合**，并在第一回合下加显式禁止项 + 回链顶部门。**教训：门的措辞对了不代表流程清单跟着改了，改门时要全文搜一遍所有操作序列。**
  - 顺带对齐：两阶段门的禁止清单（SKILL.md 门表 + `requirement-intake.md` 确认闸门）都补上「**复制 `templates/project-starter/`**」与「起 dev server」——原先只列 degit / npm install，而复制模板同样是动工程。
  - 同步：catalog 重跑（front-matter description 变更需重跑）；CHANGELOG [1.3.0] 新增「Fixed（两阶段门与起步方式）」+「Changed（skill description 结构）」两段；website `npm run sync` + 双 gate 通过。
- 2026-08-15 **CHANGELOG 精简（定位澄清：CHANGELOG = 摘要，台账 = 细节）**：使用者反馈"过于详细，看不清核心变化"。全量重写 `CHANGELOG.md`（204 → 186 行，但**最长行 1272 → 383 字符**，密度大幅下降）：
  - **确立分工并写进文件顶部「阅读约定」**：CHANGELOG 只记**核心变化**（一条一行、按版本归组，供人快速判断"升级后有什么不一样"）；**做法/用法看对应文档，排查过程与逐项实测记录看本台账**。
  - 主要修法：① 消掉 1.3.0 里 8 个重复小节标题（曾出现两个 `### Added`、三个 `### Changed`、两个 `### Fixed`）→ 归并为 `Added—页面模板 / Added—设计约束 / Fixed / Changed / Verified`；② 删掉 Figma node id、逐步调试叙事、大段 Verified 明细（这些台账里都有）；③ 老版本（1.0.0–1.2.0）同样按一行一条压缩，Verified 各收敛为一行。
  - **安全网**：写了个校验脚本，对每个版本列出"必须仍能检索到的变更项"关键词（1.3.0 共 29 个，全 6 个版本合计 ~90 个）做断言 + 检查小节标题不重复 + 无超长行。**第一版跑出丢了 2 项**（「流程图」页签占位、全屏的 `Teleport` 实现要点）→ 补回后全绿。**教训：压缩 changelog 必须机检"变更项没丢"，只靠肉眼读会漏。**
  - 顺带修正 `[Unreleased] 计划中`：「详情页」已在 1.3.0 交付，从计划里移除。
  - 同步：website `npm run sync`（CHANGELOG 是同步项之一，官网更新日志随之更新）+ 双 gate 通过。
- 2026-08-15 **（同属 v1.3.0）新增「产品专属业务组件」层 + 首个落地 MSC 附件上传**（已 Playwright 实测）：
  - **背景与架构决策**：Pangea 是企业**通用**设计系统，但部分产品（如 MSC 全球营销云中台）在其之上延展了只属于自己的业务组件。原先 CONTRIBUTING 里只有一句"后续规划放 `references/components-custom/`"，这次正式落地，并把目录改为**按产品隔离**的 `references/components-business/<产品 key>/`（`components-custom` 平铺放不下多产品，且无法表达"哪个组件属于哪个产品"）。
  - **核心是那道门槛，不是组件本身**：`README.md` 里定死「**默认不用**；命中该产品触发词 → 该场景优先用业务组件；未命中 → **一律用通用组件**；拿不准 → **问用户**」。理由写进文档：业务组件承载特定产品的业务约定（字段口径、状态语义、操作集合），扩散到别的系统会出现用户看不懂的列、与该产品自身规范冲突、并糊掉「通用设计系统 / 产品定制」的边界。**MSC 触发词：MSC / 全球营销云中台 / 营销云中台 / 营销中台。**
  - **文件落位**：文档 `references/components-business/{README.md, msc/README.md, msc/attachment-upload.md}`；源码 `templates/project-starter/src/components/msc/MscAttachmentUpload.vue`（带 `msc/` 子目录 + `Msc` 前缀，和通用组件区分）。**有意不在脚手架加 demo 页/路由**——通用脚手架要保持产品中立，预览交给 website。
  - **组件规格**（Figma `5926:53694`，三态 `5557:56630` 默认 / `5557:56627` 上传后 / `5557:56628` 仅查看）：label + [⤒点击上传] + 12px 提示 + 表格（附件名称 flex·ellipsis / 文件大小 120 / 状态 180 / **操作 200 fixed right**）+ [⤓批量下载]。设计稿所有色值都能落到既有 token（`#f2f3f5`=fill-2 表头、`#00aaa6`=primary-6、`#f53f3f`=danger-6、`#00b42a`=success-6…），所以**纯用 Arco 组件 + token 实现，零裸 hex**。
  - **契约设计**：组件**只做「选文件 + 呈现列表 + 抛语义事件」**（`upload`/`preview`/`download`/`remove`/`batch-download`），不实现真实上传下载 → demo 用 mock、交付接真实接口时组件不改。`file-list` 受控（删除除外，组件会剔除该行并抛 `update:file-list`）；`size` 传**展示文本**不传字节数（各系统口径不同）；提示文案由 `accept` + `maxSizeMB` **自动生成**，避免文案与校验规则不一致。
  - **业务规则固化**：失败行**只给「删除」**（没有可访问产物，别放开下载/预览）；`read-only` 时无上传入口/无提示/无删除；批量下载**只作用于上传成功的**且无成功文件时禁用。
  - **踩坑（重要，已写进组件与文档）**：表格插槽 `record` 是 `any`，直接 `STATUS_MAP[record.status]` 触发 **TS7053**，`vue-tsc` 直接让 gate 失败。按既有 `table-patterns.md` 的约定改用接受 `string` 的 helper `statusOf()` 规避。→ **这条是本项目第二次踩同一个坑**（1.0.0 就记录过），说明该约定值得在新组件里主动套用。
  - **机读索引扩展**：`build-catalog.mjs` 的 `collect()` 支持递归；新增 `businessComponents` + **`businessProducts`**（按产品聚合 product/productName/triggers/components），让 agent 能「先判产品线、再取组件」。实测输出：页面模板 8 / 组件 10 / **业务组件 1（1 个产品）**。
  - **website 在「设计系统」模块下新增侧边一级菜单「MSC 组件」**（`IconPuzzle`，挂在「组件」之后，下挂 `附件上传` 子项，后续新增 MSC 组件往 children 追加）：`sync-from-skill.mjs` 加 `BUSINESS_PRODUCTS=['msc']` → 快照到 `src/generated/business/msc/`（同步 12 项）；页面 `src/pages/Msc/AttachmentUpload.vue` = 门槛 alert（触发词 tag）+ 选型要点卡（读 catalog）+ 三态 DemoBlock（默认态可**真实选文件** mock 上传，每第 3 个故意失败以便看失败态）+ Props/Events/数据结构表。**单独成一个侧边菜单分组**（而不是混进「组件」里）：让"通用组件"与"产品定制组件"在导航层就分得开。
  - **实测（Playwright，website :5173）**：顶部模块仍是 `[说明文档, 设计系统]`；进 `/msc/attachment-upload` 时顶部停在「设计系统」、侧边一级 `[Design Tokens, 图标, 页面模板, 组件, MSC 组件]`、「MSC 组件」分组展开且 header 带 `arco-menu-selected`、子项「附件上传」选中；默认态 表头 4 列 +「暂无数据」+ 批量下载 `disabled=true`；上传后 失败行 actions=`[删除]`、成功行=`[下载,预览,删除]`；仅查看 无上传入口(`hasUploadEntry=false`)、无提示、actions=`[下载,预览]`；表头底色实测 `rgb(242,243,245)`=`#f2f3f5` 与设计稿一致；真实上传 `demo-a.pdf` → `1.6m 上传成功`；`.txt` 被拦「只能上传 pdf / png / jpg 格式的文件」且不入列；删除 3→2；批量下载提示「批量下载 2 个附件」；**零 console/page error**。
  - **同步**：`SKILL.md` 新增「产品专属业务组件（默认不用，命中产品才用）」章节 + 决策树前置提醒 + 索引段补业务组件；`requirement-intake.md`「全局约定」加 `产品线` 字段（顺手匹配触发词自动填，**不额外占澄清轮次**，无法判断才问）；`CONTRIBUTING.md` 的「C.」由"后续规划"重写为落地约定（含 meta 必填字段 + 新增后要登记的三处）；README 目录树补 `components-business/msc`；CHANGELOG 归入 **[1.3.0] - 2026-08-15**（本批与页面模板、对话框宽度约束合并为一个未发布版本，见下条日期基线说明）并从「计划中」移除已交付的业务组件文档项；catalog 重跑；双 gate 通过。
  - ✅ **日期基线已纠正（原先这里记的日期是错的）**：把 1.4.0 **并回 1.3.0**（1.3.0 从未发布——既无 `1.3.0` tag、`releases/` 里也只有 `pangea-design-vue_1.2.0.zip`，所以合并不留版本号空档），统一记 **[1.3.0] - 2026-08-15**。
    **根因**：会话里注入的「当前日期」是 2026-07-22，而**机器真实日期是 2026-08-15**（`date` 命令为准）；此前几轮就是照注入日期猜的，才出现 08-11 / 08-12 这种既非真实、又互相不一致的戳。
    **判断依据（可复用）**：`releases/pangea-design-vue_1.2.0.zip` 的文件 mtime = 8月2日，与 CHANGELOG 里 `1.2.0 - 2026-08-02` 吻合；`git log` 显示最近提交在 08-15；`git log -S` 查到 `[1.3.0] - 2026-08-11` 是**今天那次提交**才引入的 → 证明老版本日期可信、只有 1.3.0/1.4.0 的戳是猜的。
    **处理范围**：只改未发布的 1.3.0 批次（CHANGELOG 版本头 + 台账里 12 条 08-11/08-12 前缀 → 08-15）；**已发布版本 1.0.0(07-22) / 1.1.x(07-23) / 1.2.0(08-02) 一律不动**（有 tag + zip 佐证）；`docs/plan-gates-metadata-website.md` 与 `metadata-schema.md` 里的 07-23 属 1.1.x 期，也不动。
    **防复发规则：以后要写日期，先跑 `date` 取机器时间，不要用上下文里注入的日期。**
  - 2026-08-15 **纠正 MSC 在 website 的信息架构**（按用户要求）：原先把「MSC 组件」做成了**第 3 个顶部一级模块**，改为**放在「设计系统」模块下、作为侧边一级菜单分组**（`key: 'msc-group'`、`IconPuzzle`、挂在「组件」之后、下挂 `附件上传`）。顶部模块回到两个（说明文档 / 设计系统）。后续新增 MSC 组件只往该分组 `children` 追加即可。GlobalLayout 与 router 的注释、CONTRIBUTING 的「登记三处」措辞一并同步。
    - 验证脚本踩坑：判断 Arco inline 子菜单是否展开时我先用了 `arco-menu-inline-open`——**这个 class 不存在**，导致误判成「分组没展开」。实际 DOM 是：分组根 `arco-menu-inline`，**当前分组的 header 带 `arco-menu-selected`**，展开与否要看子项是否可见（`offsetParent !== null` + 高度 > 0）。按真实 DOM 复测后确认行为与既有「组件」分组一致，本来就没问题。→ **教训：判断第三方组件状态别猜 class，先 dump 真实 classList。**
- 2026-08-15 **打包**：`./scripts/pack-skill.sh`（版本自动取 CHANGELOG 首个 `## [x.y.z]`）。先打了 1.3.0 → `releases/pangea-design-vue_1.3.0.zip`（**392K / 148 个文件**，包内根目录 `pangea-design-vue/`，可直接上传平台；`releases/` 已 gitignore）。打包前先重跑了 `build-catalog.mjs` 保证 catalog 是最新的。
  - **顺手加固了打包自检**：`pack-skill.sh` 的 `MUST_HAVE` 清单补进业务组件三个关键文件（`components-business/README.md`、`msc/attachment-upload.md`、`src/components/msc/MscAttachmentUpload.vue`）。理由：这一层全是**新增未提交文件**，而脚本打的是工作区状态——正是最容易被静默漏掉的一类，值得进自检。
  - **产物实测复核**（不只信脚本自检）：包内根目录正确；业务组件 4 个文件在位；本轮 3 个新模板文档 + 对应脚手架页 + `styles/arco-overrides.less` 都在；`catalog.json` 里 `counts={8,10,1}` 且 `businessProducts` 带 MSC 全部 4 个触发词；`package-lock.json` 与 `.env/.env.embed/.env.history` 齐全（可复现安装）；`node_modules` / `dist` / `.DS_Store` / `_tests` / `website` / `releases` **均为 0**；文档里无本机绝对路径泄漏。references 文档 111 篇、scaffold 34 个文件。
- 2026-08-15 **修平台安全扫描的 P0「指令覆盖」→ 移除 `SessionStart` 自动执行 hook**（上传第三方平台时被判「存在严重安全风险，暂不可使用和分享」，P0 2/3、P1 8/8、P2 3/3，唯一不过项就是这条）：
  - **被判定的行为**：脚手架 `.kiro/hooks/pm-dev-server.json`（`SessionStart` → 检查 `node_modules` → 自动 `npm install` → 自动 `control_bash_process` 起 `npm run dev`）。扫描器判语：「会话开始即自动安装依赖并启动服务，绕过『用户确认后再执行』的正常基线」，建议「移除或默认禁用 SessionStart 自动执行」。
  - **这条结论成立，而且它同时是个内部矛盾**：SKILL.md 顶部两阶段门明确禁止阶段一执行 `npm install` / 起 dev server，而该 hook 恰恰在会话一开始就做这两件事。→ **和之前修掉的「工程初始化流程顺序」是同一类 bug：门的措辞改对了，但别处的自动化配置没跟着改。**
  - **处理：直接删除该 hook**（不是改成"确认后再跑"）。理由：① 删除才能保证重扫必过，而平台当前是**拒绝分发**状态，确定性优先；② 能力损失≈0——PM Demo 的 agent 职责清单本来就有「检查 node_modules → 先 install」「检查 dev server → 没起就起」，只是原先被提前到会话开始；现在改为**用户要求预览时于当轮执行**（如用户说"运行一下看看效果"），PM 依然不碰终端。
  - **防复发**：`SKILL.md`「与 Kiro Hooks 协作」与 `project-structure.md` 都加了 ⛔ 说明——**不要再引入 `SessionStart` + 执行类动作的 hook**，并写明两条理由（安全基线 / 与两阶段门冲突），避免后人当成"体验优化"加回来。
  - **顺带收紧保留的那个 hook**：`pm-compile-check`（`PostFileSave`）由**用户自己的保存动作**触发、只做校验（读 dev 输出 + 类型检查），不装依赖不起服务，扫描未报——但把里面的 `npx vue-tsc --noEmit` 改成 `npm run type-check`（package.json 新增该脚本），避免 `npx` 在缺包时触发远程拉取。
  - **全量复查**：`grep` 了整个 skill 的 `SessionStart|UserPromptSubmit|PreToolUse|自动安装依赖|npx`，剩余命中全是说明性/禁止性文字或"备选 degit 命令"，无实际自动执行配置；`.kiro/hooks/` 现在只剩 `pm-compile-check.json`（PostFileSave / agent）。顺手把脚手架 `README.md` 的起步方式也改为「首选 `cp -R` 复制，degit 为备选」（与 SKILL.md / project-structure.md 一致）。
  - **版本归属：本轮安全修复独立为 [1.3.1] - 2026-08-15**（按用户要求），1.3.0 保持为「能力补齐」那一批；1.3.1 含 `### Security`（移除 hook）+ `### Fixed`（打包脚本）+ `### Verified`。双 gate 通过。
  - **顺带修掉 `pack-skill.sh` 的一个真实缺陷（这次差点被它糊过去）**：删掉 hook 后重新打包，报告仍是「148 个文件」——和删除前一样。查下来是 `git ls-files --cached` 读的是 **index**，文件删了但没 `git add`，它**仍会列出该条目**；`zip -q` 又把 "name not matched" 警告吞掉，于是 zip 少打一个文件却退出码 0，而 `COUNT` 是按 git 列表 `wc -l` 算的 → **报告数虚高，且"有文件被静默跳过"这件事完全不可见**（实测 git 列表 148 / zip 实际 147）。修法两条：① 收集时过滤掉磁盘上已不存在的条目（`[[ -f "$f" ]]`）；② 打包后断言 `unzip -Z1 | wc -l` 等于待打包条数，不等就 `exit 1`。修完重打为 **147 个文件**，两个数字一致。
  - **教训**：`git ls-files --cached` ≠ 工作区实际文件；凡"按工作区状态打包"的脚本都要过滤已删条目，并且**用产物本身反查数量**，不能只信输入列表。
  - **最终产物：`releases/pangea-design-vue_1.3.1.zip`（392K / 147 个文件）**，复核通过：`pm-dev-server` 残留 0、hook 内 `npx` 0、`type-check` 脚本在位、SKILL.md 含"禁止 SessionStart 自动执行"说明、业务组件层 4 个文件在位、入包数与待打包数一致。
  - ⚠️ **删掉了 `pangea-design-vue_1.3.0.zip`**：它是安全修复**之后**重打的，内容与 1.3.1 **完全一致**（条目 diff 为空，md5 仅因时间戳不同），却标着 1.3.0；而**包内不含 CHANGELOG，文件名是唯一版本标识** → 留着容易把修复后的内容当 1.3.0 上传。需要时 `./scripts/pack-skill.sh 1.3.0` 可重建。
  - **记住这条产物纪律**：`pack-skill.sh` 的版本号取自 CHANGELOG 首个版本，**所以要先定版本号、再打包**；打完若又改了 CHANGELOG 版本结构，必须重打并清掉旧标签的包。
- 2026-08-15 ⚠️ **待用户处理：线上 1.3.0 Release 的 zip 资产含被判风险的 hook**（我无权也不应替用户动公开产物，仅记录）：
  - **事实**：tag `1.3.0` = commit `53ebc8b`（18:26「1.3.0打包」）**已推到 origin**，且 GitHub 上存在**正式 Release `1.3.0`**（非 draft/prerelease，published 2026-08-15T10:27:39Z）并挂了资产 `pangea-design-vue_1.3.0.zip`（**400706 B**，`sha256:90ed7f8e…b587`，**下载次数 0**）。
  - **该资产是"修复前"的包**：判定依据是体积——修复前那次打包（18:24）为 **400706 B**，与线上资产完全一致；修复后重打为 **400427 B**。另 `git ls-tree -r 1.3.0` 确认该 tag 的树里**仍含 `pm-dev-server.json`**。→ 线上 1.3.0 的包里有被平台判 P0「指令覆盖」的那个 hook。
  - **本地 1.3.1（修复后）**：`releases/pangea-design-vue_1.3.1.zip`，**400427 B**，`sha256:642d891b63be5dbee1bf03b73819d433363fb83248f9f5622e03014017de5e2b`。**体积 400427 / sha 前缀 642d 可作为"已修复"的快速判别标志**。
  - **建议动作（需用户决定，属公开且不易回退的操作）**：① 删除 1.3.0 Release 上的 zip 资产（下载数为 0，删掉最干净），或直接删除整个 1.3.0 Release；**tag 与 commit 建议保留**（历史诚实，且 1.3.1 的 CHANGELOG 正是以"1.3.0 被拒绝分发"为叙事）；② 发布 1.3.1 Release 并上传修复后的 zip；③ 若保留 1.3.0 Release，至少在其说明顶部加一句「⚠️ 该版本含会话开始自动执行的 hook，已被安全扫描拒绝，请使用 1.3.1」。
  - 排查踩坑：我先用 `gh release list` 判断"没有 release"——但**这台机器没装 `gh`**，命令不存在的报错被 `2>/dev/null` 吞掉，得出了假结论。改用 GitHub 公开 API（`api.github.com/repos/<owner>/<repo>/releases`）才看到真实情况。→ **教训：用 CLI 探测外部状态前先确认该 CLI 存在；别把"无输出"当成"无数据"。**
- 2026-08-19 website 侧边菜单两处调整（**仅 website，不进 CHANGELOG**）：① 「组件」一级菜单改名 **「通用组件」**（与「MSC 组件」形成"通用 / 产品专属"的对照）；② 两个分组**默认折叠**。
  - **根因不是"没配折叠"，而是配错了**：`GlobalLayout.vue` 的 `defaultOpenKeys` 计算里是**无条件** `keys.push(it.key)`（没有任何路由判断），等于把所有分组都塞进默认展开列表 → 两个分组永远展开，侧边栏被 16 个组件项撑得很长。（注意：**脚手架**同名计算是带 `menuContainsPath` 判断的，只展开当前路由所在分组——两边实现不一致，这次只改 website。）
  - 改法：删掉该 computed 与 `:default-open-keys` 绑定（Arco `a-menu` 不传即全部收起），并留注释说明为什么不用它。折叠后不会"迷路"——Arco 会给当前所在分组的 header 加 `arco-menu-selected`；展开状态改由用户手动操作驱动，切顶部模块时菜单按 `:key` 重挂载自动复位为折叠。顺手清掉了上方一条与新行为相反的旧注释（"默认展开当前模块下的所有分组"）。
  - **实测**（Playwright）：`/foundations`、`/components/button`、`/msc/attachment-upload` 三个路由下两个分组 `expanded` 均为 `false`；且 `/components/button` 时「通用组件」header `arco-menu-selected=true`、`/msc/attachment-upload` 时「MSC 组件」为 true（定位不丢）；手动点开「通用组件」→ `expanded=true` 且能正常点进 `#/components/button`。website gate 通过。
  - ⚠️ **环境踩坑（浪费了几轮）**：本轮相隔数天后重来，**5173 端口已被另一个应用占用**（页面 title 是「会议室预约系统」、`/foundations` 路由匹配不到），我一开始以为是自己改崩了。→ **验证前先确认端口上跑的是不是目标应用**（看 `document.title` / 关键选择器是否存在），别默认沿用上次会话的端口；本轮改用 `--port 5188 --strictPort`。
  - 另一条工具使用教训：**不要把 `fs_write` 和依赖它的 `execute_bash` 放在同一个并行块里**——脚本还没落盘 bash 就执行了，报 "can't open file"。
- 2026-08-19 website「页面模板」列表页改造：**每卡带截图 + 严格等高 + 按使用顺序排**（**仅 website，不进 CHANGELOG**）。
  - **等高的真实原因是两个，不是一个**（实测 1440 视口）：① 行与行不等高——第 1 行 260px、第 2/3 行 182px，因为 CSS grid **各行独立**按最高内容定高，而第 1 行有「审批详情页」（4 个 variants 标签换成 2 行）；② **同一行内「预览」按钮也不齐**——footer 距顶 137px vs 215px，因为 `align-items: stretch` 只拉齐**卡片外框**、内容仍顶对齐。数据源 `catalog.pageTemplates` 文本天然不齐（whenToUse 26–50 字、variants 0–85 字）→ **靠内容自然撑开永远齐不了，必须把每块行数写死**。
  - **做法**：`a-card` + `#cover` 放截图（`aspect-ratio:16/10`），card 根 `height:100%` + 竖向 flex、`:deep(.arco-card-body){flex:1;display:flex;flex-direction:column}`，标题锁 1 行 ellipsis、说明锁 2 行（`line-clamp:2` + `min-height:44px`）、标签锁 1 行（最多 2 个 + 「+N」）、footer `margin-top:auto` 吸底。顺序改为显式 `ORDER` 数组（列表→表单→详情→审批→仪表板），不再用 catalog 的 id 字母序（原先审批详情页排第 1、简单列表页排第 7）。容器 max-width 960→1120（与 MSC 页一致，3 列配缩略图更舒展）。
  - **截图生成**：新增 `website/scripts/shoot_templates.py` + `npm run shoot:templates`（**手动跑**，模板 UI 变了才跑）。产出 `src/assets/template-shots/<id>.jpg`，**提交入库 → 官网构建/部署完全不需要 playwright**。
    - **刻意用 Python 而不是 Node**：website devDeps 没有 playwright，加进去会让 Cloudflare 每次 `npm install` 下载 ~150MB 浏览器；而机器上已有 Python playwright。npm 侧只留一个包装脚本，`package.json` 依赖零变化。
    - 只截 `.pg-layout__content`（预览路由是挂在官网 GlobalLayout 下的子路由，整页截会把官网自己的 header/sidebar 拍进去）；**「对话框表单」没有独立页面** → 在简单列表页点「创建」后**只截 `.arco-modal`** 本体。
    - 体积：初版 `device_scale_factor=2` 直出 2480×1704、合计 **1.6MB**；加一步 Pillow **按 16:10 从顶部裁 + 缩到 640×400**（从顶部裁是因为页头/操作栏在上半部分，居中裁会把最能辨识模板的区域切掉）→ 合计 **209KB**（9 张，每张 16–33KB）。
  - ⚠️ **踩了一个很典型的坑（值得记住）**：初版 9 张里**第 1 张「简单列表页」拍成了官网首页**。根因是脚本等的 `.pg-layout__content` **在所有路由下都存在、毫无区分度**；再叠加「只改 hash 时浏览器不重新加载文档 → Playwright 的 `goto` 立即 resolve、`networkidle` 早已满足」，于是探活时打开的首页还在屏上就被截了。**修法两条**：① 每个 target 声明**该页独有的根类名**做 `ready`（`.pg-simple-list` / `.pg-card-list` / `.pg-form-page` / `.pg-grouped-form` / `.pg-step-form` / `.pg-detail` / `.pg-approval` / `.pg-dash`）；② `goto` 后强制 `reload(wait_until="networkidle")`，让等待真正等到这一页。→ **教训：hash 路由下等通用容器等于没等；等待选择器必须对目标页唯一。**
  - **实测**（Playwright，5 个断点 1600/1280/1100/820/480）：每个断点下 9 张卡 `uniqueHeights` 与 `uniqueFootOffset` **都只有一个值**（3 列 441 / 2 列 441 / 1 列 533、480 时 373），顺序全部正确，点卡片能跳转，无 console/page error；9 张图 md5 去重后仍是 9（无拍错/拍重）。website gate 通过。
  - CONTRIBUTING「提交前检查」补一条：改了脚手架页面视觉后要 `npm run sync` + `npm run shoot:templates` 重拍缩略图。
- 2026-08-19 **v1.4.0：新增页面模板「左树右表列表页」（第 9 个）** + 两项 website 调整。
  - **模板定位与选型判断（关键，写进了决策树）**：适用**主子表结构**——左树选中主表主数据、右表展示其子表数据。**判断标准：新建子数据是否必须指定父级**。是（归属）→ 用本模板；否（层级只是筛选维度）→ 简单列表页加个筛选项就够，不要上主子表。来源 Figma `219:4241`。
  - **右侧直接沿用简单列表页的形态**（操作栏 创建/导入/导出/打印 + 表格 + 分页 规格一致），不另造一套；本模板的增量价值只在「左树 + 主子联动」。
  - **三条联动契约（本模板最容易做错，已写进文档与代码注释）**：① 树选中项是右侧数据**唯一来源**，切主数据必须**重拉 + 分页复位 + 清空已勾选**——不复位会出现"切到只有 8 条的主数据却停在第 3 页→右侧空白"，不清空勾选会把上一条主数据的选中带过来导致误批量操作；② **未选主数据时不摆空表格**，给 `a-empty` 引导（否则用户分不清"没数据"还是"没选"）；③ 子表「创建」必须依附当前主数据，否则产生挂空子记录。
  - 其他实现要点：树搜索前端过滤但**保留命中节点父链**（只留命中节点层级会断）；节点级「编辑/新增子级/删除」用 `#extra` + **hover 才显形**（常驻太吵），图标必须 `@click.stop` 否则点操作会顺带选中节点；删除主数据的确认文案**明确提示级联删除子数据**；`a-tree` 要加 **`block-node`** 才是整行高亮（与设计稿一致）。设计稿只画了左上角 `+`，节点级增删改属**增补**（需求明确要求主子各自 CRUD），文档已标注。
  - **实测**（Playwright，脚手架 :5199）：未选→空状态无表格；选「上海分公司」出表格且数据随主数据变；**翻到第 2 页 + 勾选 1 行后切到「北京分公司」→ 分页复位 1、勾选归 0、数据正确切换**；树搜索「杭州」保留父链；节点 hover 出更多三项且删除弹级联提示确认；行更多为 编辑/删除；无 console error；左栏实测 261px ≈ 设计稿 260。
  - **同步范围**：`page-tree-table.md`（含 meta）+ 脚手架页/路由/菜单 + SKILL.md 决策树与索引 + catalog（**8→9**）+ website（`sync-from-skill.mjs` 的 `EXAMPLE_PAGES` 加 `TreeTable`、预览路由 `/templates/tree-table`、截图脚本加 target、模板列表归入「列表页」组）+ CHANGELOG **[1.4.0] - 2026-08-19**。双 gate 通过。
- 2026-08-19 website 两项调整（**不进 CHANGELOG**）：
  - ① **返回按钮**：文字「返回模板列表」→「**返回**」，样式改**半透明黑底 + 白字**（`--color-mask-bg` + `--color-white`，去掉边框与阴影，hover 加深到 0.85）——悬浮在任意模板页（白底/灰底）上都清晰且不抢戏。实测 `bg: rgba(29,33,41,0.6)` / `color: rgb(255,255,255)` / `border: 0px`。
  - ② **模板列表按页面类型分组**：列表页(3) / 表单页(4) / 详情页(2) / 其他(1)，组内保持由简到繁的使用顺序；原来的扁平 `ORDER` 数组拆成 `GROUPS` + 独立的 `ROUTES` 映射。分组头 = 标题 + 轻量计数 + 一句说明 + 下边框。实测 10 张卡 `uniqueHeights` 仍只有一个值（247），等高没被分组破坏。
  - 截图脚本新增通用 **`pre_click`** 字段：左树右表默认未选主数据、右侧是空状态，缩略图会看不出「左树+右表」→ 截图前先点一个树节点。缩略图现共 10 张 / 227KB。
  - ⚠️ 又踩了一次「`fs_write` 与依赖它的 `execute_bash` 放在同一并行块里 → 脚本还没落盘就执行」，这次表现为**用旧脚本重拍了一遍**（输出看起来正常、但改动未生效）。**并行块里不要放有依赖关系的调用。**
- 2026-08-19 左树右表模板 5 项细节返工（归入 **[1.4.0]** 就地订正，未单开版本）：
  - ① **`#extra` 图标落在高亮区外**（用户感受是"按钮不在节点内"）。**根因（实测确认）**：Arco 把 `#extra` 渲染成 `.arco-tree-node` 的**直接子元素、排在 `.arco-tree-node-title` 之后**（title 结束于 x=430，extra 就在 430），而选中/hover 底色 `rgba(232,255,251,0.5)` 是加在 **title** 上的 → 图标天然在高亮块外。**修法**：`.arco-tree-node{position:relative}` + 图标 `position:absolute;right:8px;top:50%;translateY(-50%)`，并给 `.arco-tree-node-title-block` 加 `padding-right:28px` 防压字。`block-node` 下 title 是 block，**靠"缩短 title 宽度"腾位置做不到**，必须绝对定位。图标外层加 `arco-icon-hover` 拿 Arco 标准圆形悬停底（该类的圆背景在伪元素上，`border-radius` 读到 0 是正常的）。
  - ② **`+` 按钮宽高不等（24×28）**。**先前的假设是错的**：一度以为「只给 `#icon` 插槽时标签内空白文本节点会让 Arco 判定有默认内容、不加 icon-only 类」——查 Arco 源码后确认判定条件是 `$slots.icon && !$slots.default`，类名叫 **`arco-btn-only-icon`（不是 `arco-btn-icon-only`）**，我第一次断言查错了名字才误判成 false。**真因**：主题里 `.arco-btn-size-small.arco-btn-only-icon{width:28px;height:28px}` 确实命中了，但按钮是工具条 flex 的子项，被撑满的搜索框挤到 **flex-shrink** → 计算宽度 23.89px。**修法**：`flex-shrink:0`。另确认 **`.arco-btn-shape-square` 在本主题没有任何 CSS 规则**，`shape="square"` 是无效属性，已移除（避免留下 cargo-cult 写法）。
    - 教训：**断言"某个类不存在"之前先去 node_modules 核对类名**；以及"元素声明了 width 却量到更小值"优先怀疑 flex 收缩，而不是组件内部逻辑。
  - ③④ **新增入口收敛**：`+` 改 `a-dropdown position="bl"` 承载「新增根级」+「新增子级」（后者 `:disabled="!selectedNode"`）；节点 `#extra` 菜单删掉「新增子级」，只剩 编辑/删除。`handleAddRoot` → `handleAdd(kind)`。
  - ⑤ **首屏占位**：本来就没预选（无需改逻辑），把 `a-empty` 换成 `#image` 插槽放 `IconList`（48px / `--color-text-4`）+ 文案「先从左侧列表选择」。
  - **实测**（Playwright，:5199）：首屏 selected=0 / 无表格 / 占位图标 48px + 文案正确；`+` 28×28 且 `flex-shrink:0`；下拉未选中时「新增子级」`arco-dropdown-option-disabled`、选中后解除；`⋯` 带 `arco-icon-hover` 且矩形 `[424,444]` 完整落在 title `[228,452]` 内；节点菜单只剩 编辑/删除。三张截图肉眼复核通过。
  - **同步范围**：脚手架 `TreeTable/index.vue` + `page-tree-table.md`（新增下拉规范、两个 Arco 坑、首屏不预选、代码片段与样式同步）+ website `sync` + 双 gate 通过 + 重拍缩略图（10 张 / 227KB）+ CHANGELOG 就地订正 1.4.0。
  - 另记：Arco 树选中态类名是 **`.arco-tree-node-selected`**（在节点上），没有 `.arco-tree-node-title-selected`；写等待选择器时别猜。
- 2026-08-19 左树右表节点「更多」图标再修 2 项（仍归入 **[1.4.0]**）：
  - ① **去掉 `.arco-tree-node-title-block` 的 `padding-right: 28px`**（回到 Arco 默认 4px）。用户判断：图标盖在文字上不构成问题，为它给每个节点都空出一块反而更亏——只有超长文案才会被压到。
  - ② **hover 时图标"变白看不见"的根因**：`.arco-icon-hover` 的圆形底是**绝对定位的 `::before`**（`--color-fill-2` = `#f2f3f5`，20×20，`--border-radius-circle`），Arco 靠 `.arco-icon-hover .arco-icon { position: relative }` 把图标垫到圆底之上；而 **iconbox 图标的 class 是 `van-icon-*`、不是 `.arco-icon`**，吃不到这条规则 → 静态流内的 svg 被绝对定位的 `::before` 压在下面，看起来就是图标消失/变白。**修法**：`.pg-tree-table__node-more :deep(svg){position:relative}`。实测 hover 后 svg `position: relative`、色 `rgb(0,170,166)`、圆底 `rgb(242,243,245)`，对比清晰。
    - **这是通用坑，不只本模板**：已写进 `references/overview/project-structure.md` 的「图标使用（分工铁律）」章节——凡是把图标包图标套 `arco-icon-hover` 都要补这个 `position: relative`。与既有的"不启用 iconBox 全局替换（会破坏 icon-hover 圆底定位）"是同一族问题：**Arco 组件样式常按 `.arco-icon` 选择器写，换成图标包图标就会漏样式。**
  - 同步：脚手架 + `page-tree-table.md` + `project-structure.md` + website `sync` + 双 gate 通过 + 重拍缩略图（10 张 / 227KB，视觉无变化）+ CHANGELOG 就地补进 1.4.0 的坑位清单与实测记录。
- 2026-08-19 website 换浏览器图标（favicon，**不进 CHANGELOG**）：原先 `index.html` **完全没有 `<link rel="icon">`**、也没有 `public/` 目录（浏览器只能落到默认图标）。新建 `website/public/`，把 `_tests/cases/pangea.ico`（多尺寸 ICO，16/32/… 共 6 张，51740 B）复制为 `public/favicon.ico`，并在 `index.html` 加 `<link rel="icon" href="./favicon.ico" sizes="any" />`。**href 必须用相对 `./`**——website 是 `base: './'`（产物要能部署到任意子路径），写绝对 `/favicon.ico` 在子路径下会 404。实测：dev :5188 直取 `/favicon.ico` 返回 200 / `image/x-icon` / 51740 B（与源文件同尺寸），`dist/favicon.ico` 已随 build 落地、产物 HTML 中的 href 保持相对。gate 通过。
  - 备注：headless shell **不会主动请求 favicon**，所以用「解析 link 标签 href + 直接 `request.get`」验证，别指望在网络记录里看到 favicon 请求。
- 2026-08-19 打包 **v1.4.0** → `releases/pangea-design-vue_1.4.0.zip`（408K / **149 个文件**，包内根目录 `pangea-design-vue/`，可直接上传平台）。版本号由脚本从 CHANGELOG 首个 `## [x.y.z]` 自动取到 1.4.0。按【工作区当前状态】打包（本轮改动尚未 git 提交，这是脚本的预期行为）。
  - 手工复核入包内容：`page-tree-table.md` / `TreeTable/index.vue` / `project-structure.md` / `catalog.json`（包内为 **页面模板 9 / 组件 10 / 业务组件 1**）均在，且 TreeTable 里「新增子级下拉 + `flex-shrink:0` + `:deep(svg)` 垫高」三处修法都在包内。
  - 顺手把 `page-tree-table.md` 与 `TreeTable/index.vue` 加进 `scripts/pack-skill.sh` 的 `MUST_HAVE` 自检清单——它们当前是未跟踪文件，正属脚本注释里点明的「新增未提交 → 静默漏包」高发区，这次靠手查确认，之后由脚本兜住。
- 2026-08-19 **重新划定 CHANGELOG 与本台账的分工**（用户定调）：台账 = 工程核心上下文、供日常迭代；CHANGELOG = **写给 skill 使用者**，只回答「这个版本多了什么能力、升级后有什么不一样」。
  - **判断口径**（已写进 `CONTRIBUTING.md` 新增第七节 + 本文件「更新协议」）：写之前问一句——*使用者不知道这件事，会不会用错、或错过一个能力？* 不会 → 只进台账。四类**只进台账**：① 同一版本内对**本版新增内容**的返工修正（使用者只看到最终状态；修的是**上一个已发布版本**才算本版交付内容、要写进 CHANGELOG）；② 根因排查与踩坑细节（结论落到规范文档，过程留台账）；③ 逐项实测记录（Playwright 步骤、像素/颜色值）；④ 不随包分发的东西（`scripts/` 仓库工具、`website/`、`_tests/`）。
  - **按这个口径重写了 CHANGELOG**：246 → 193 行（-113/+60）。删除全部 `### Verified` 段（6 处）；1.4.0 从「三条契约 + 三个 Arco 坑 + 两段实测」压到 4 条；1.3.1 删掉 `pack-skill.sh` 的修复（仓库工具、不随包分发）；1.3.0 删掉分步表单/审批详情的**版本内细节返工**（第一步不渲染上一步、步骤条小尺寸、字段 4→3 列、选人入口改占位、传阅记录去操作列）与 Arco Steps `size="small"` 静默无效的坑；1.1.0 / 1.0.0 删掉修自己本版新增内容的 `Fixed` 段（菜单 `!important`、顶部菜单滚动条、脚手架三处跑不起来的缺口、TS7053）。各版本现为 7–28 行。
  - **删前逐条核对过台账已覆盖**（避免删掉只存在一处的信息）：`pack-skill.sh` 的 index/zip 缺陷在台账 317–318 行、Arco Steps 布尔 `small` 的坑在 259 行、妙搭白屏与 `file://` 实测在 198 行、MSC 表头底色 `rgb(242,243,245)` 与对话框宽度实测均在。**这一步是必须的**——CHANGELOG 里有些内容当初只写在了那儿。
  - 保留在 CHANGELOG 的「修复」都指向**已发布版本**的缺陷（工作台点不动、锚点跳空白、两阶段门被流程清单破坏、degit 出网、私有 registry 澄清、妙搭白屏、生成页面空白），这些属于本版交付内容。
  - website 同步后双 gate 通过（website 渲染的是 `src/generated/CHANGELOG.md`，需 `npm run sync` 才更新）。

---

## 2026-08-20 · 新增 `references/design.md`：全局设计规则唯一事实源

**起因**：用户要补两条**非工程性**的设计约定（表单承载容器决策路径、按钮组规范），问该放哪个文档；并追问了三轮架构问题。结论是 skill 里**缺一层**——设计规则此前没有归口，只能内联在 `SKILL.md`。

**四轮论证的结论（含我被纠正的两处）**：

1. **现状盘点**：设计规则散在三处 —— `SKILL.md`「关键约定」内联约 47 行（主题取值铁律 / 响应式 / 页面背景 / 对话框宽度）、`component-selection/`（10 篇 × ~27 行）、`patterns/page-*.md`。`theme/` 下只有 `design-tokens.md`，是**取值表不是规则**。
2. **我第一轮说错了**：说"搬走 `component-selection` 正文会破坏 catalog 体系"。**实际 `build-catalog.mjs` 只解析 frontmatter 的 `meta:` 块（正则取 `^---...---` 再找 `meta:` 行），正文一个字都不读** —— 正文本来就是自由的。用户质疑得对。
3. **`component-selection/` 里混了三类**：A 组件独有坑（tabs 胶囊右对齐、table TS7053、select 防抖）→ 留；B 对象视角邻域决策（选项 2–3 个改 radio 等）→ 留，因为它与 design.md 的**问题形状不同**（design.md 是「场景→结论」，它是「对象→邻域」，agent 命中时机不同，已在写 `<a-select>` 的 agent 不会去翻决策路径文档）；C 全局规则副本 → 搬。
4. **C 类重复实测（比初判严重）**：对话框宽度档位在 `SKILL.md` + `modal.md` **两份完整正文**（连 content-box 464px 那段都重复）；背景分层在 `SKILL.md` + `card.md`，而 **`card.md` 自己写了"详见 SKILL『页面背景（全局准则）』"却又重述了一遍**，自认副本；栅格断点在 `SKILL.md` + `form.md` + `responsive-design.md`；`size="small"` 在 `table.md` + `pagination.md`；不只靠颜色在 `badge.md` + `table.md` + `quality-gates.md`。（`patterns/page-*.md` 里的 `size="small"`、`:xs=` 是**示例代码**里的自然出现，非竞争性规则陈述，不算重复、不动。）
5. **为什么不能塞进 `components/` 同名文件**（用户第三问）：`components/` 是**零漂移上游镜像** —— 上游 skill 在本机 `/Users/yangshuo/Code/arco-design-skill`，74 篇对 74 篇，**逐篇 diff 全部字节一致、0 篇有差异**。掺入本地内容会毁掉「Arco 升级时 `diff -r` 找 API 变化」的干净信号。且这条路已走过一次：`patterns/form-patterns.md`、`table-patterns.md` 加了本地补充，导致 `CONTRIBUTING.md` 第 16 行必须写专门豁免"上游同步时保留这些小节"，现分别对上游 diff 74 / 116 行 —— 每掺一处就多欠一条**人工保留义务**。另外 `components/` 74 篇**全部没有 `meta:`**，合并还得给上游文档加 frontmatter，镜像彻底破。
6. **为什么不把 `component-selection/` 全塞进 design.md**（用户第四问，逐条量化过代价）：`build-catalog.mjs` 第 20 行 `SELECTION_DIR` + 第 113 行 `collect(SELECTION_DIR)` → 删文件则 `components: []`；连带**官网当场坏两处** —— `website/src/pages/Home/index.vue` 第 37 行统计卡「组件选型」显示 0，`website/src/pages/Components/Detail.vue` 第 16 行 `catalog.components.find()` 永远 undefined → **所有组件详情页的「选型要点」卡片整块消失**（whenToUse / whenNotToUse / variants / composeBoundary / pitfalls 五字段）。`registry.ts` 是解耦的（自维护展示列表），所以列表页不空、只有详情页卡片没了。另外 10 个 `meta:` 块合并后只能留一个 frontmatter，结构化字段要么退化成散文、要么在一个文件里堆 10 个 meta（更难维护、零收益）。**结论：能做但要付三笔改造（改生成器 + 改官网取数 + 放弃按字段过滤），收益只是少一个目录 → 不做。**

**最终方案（分层，不合并）**：`design.md` 持有跨对象规则**正文**；`component-selection/` 保留 frontmatter + 对象邻域一行 + 独有坑；单一入口靠 design.md 里的「2.2 单组件选型速查」表（10 个组件一句话结论 + 链接）达成，catalog 与官网零改动。

**本轮已落地（纯新增 + 一处瘦身，未动 `components/` 与 `component-selection/`）**：
- 新建 `references/design.md`（153 行）：三分组结构 —— **一、容器与布局**（1.1 表单容器决策路径【新】/ 1.2 对话框宽度档位【迁】/ 1.3 页面背景分层【迁】）、**二、组件与交互**（2.1 按钮组规范【新】/ 2.2 单组件选型速查【新】）、**三、取值与适配**（3.1 主题取值铁律【迁】/ 3.2 响应式适配【迁】）。顶部有收录标准表 + 速查目录。
- 1.1 补了原始需求没有的**第三步「落到模板」**映射；并**记录一处缺口：抽屉表单无固化模板**（现用 `a-drawer` + 参照 `page-form.md`，非模态用 `:mask="false"`）——可作为后续模板候选。
- `SKILL.md`：47 行正文 → 14 行「全局设计规则」结论表（每行链到 design.md 锚点），503 → 477 行；索引新增「设计规则（Pangea 专属，先读）」节，排在「主题」之前。
- `CONTRIBUTING.md`：原则 4「定制」清单补 `design.md` / `component-selection/` / `components-business/`；新增**原则 8「设计规则只写一处」**；新增**三-F 节**（作用范围→写到哪的归属表 + 6 条操作要求，含"不给 design.md 加 meta"和"单分组超 150 行才拆 `design/` 目录"）。注意 A–E 已被占用，新节编号为 **F**。
- 验证：`build-catalog.mjs` 重跑仍 9/10/1，`design.md` 未被扫入；15 个锚点全可达，design.md 与 SKILL.md 零死链。官网 `sync-from-skill.mjs` 只同步 catalog / CHANGELOG / 模板页 / 业务组件，**不同步 reference 文档，故无需 sync**。

**待办（下一步，用户已同意分两步）**：清理 C 类重复 —— 删 `modal.md` 宽度档位正文、`card.md` 背景分层正文、`form.md` 栅格断点正文、`table.md` + `pagination.md` 的 `size="small"` 陈述、`badge.md` + `table.md` 的不只靠颜色陈述，各换成一行指针链到 `design.md` 锚点。**只删正文，`meta:` frontmatter 一律不动**（否则 catalog 和官网选型卡片受影响）。

**CHANGELOG 未动**：按 CONTRIBUTING 第七节，这属于使用者可见的新能力，但当前无新版本号 → 留到下次发版时归入该版本的 `Added`，避免在 CHANGELOG 里记版本内过程。

### 2026-08-22 · 第二步：清除 C 类重复（6 个选型文档正文 → 指针）

**执行前发现两条规则在 design.md 里没有落点**（上一步只迁了 SKILL.md 那四段），直接删会造成规则丢失 → 先补进 design.md 再删：

- **新增 2.2 控件密度**。查证后发现**「控件一律 `size="small"`」这个说法本身是错的**，真实约定按区域分档（事实源＝脚手架实现）：浏览类页面的操作栏按钮 / 搜索 / 树内搜索框 `small`、**表格自身 `size="medium"`**（`Example/index.vue` 第 145 行、TreeTable、GroupedForm、StepForm、ApprovalProcess 全是 medium）、分页器 `small`（Example 174 / TreeTable 311 / CardList 220）、**表单页控件与操作栏按钮用默认尺寸**（`page-form.md` 第 59/70 行明确「表单页字段是主体，不需要 small」）、表格单元格内联控件 `small`/`mini`。顺带把 Arco Steps 小尺寸要用布尔 `small`（写 `size="small"` 静默无效）这条坑也收进来了。
- **新增 2.3 状态不只靠颜色传达**：颜色 + 文字双通道、图表系列要有图例区分、纯图标按钮要有可访问名、对比度 ≥ 4.5:1。规则正文在 design.md，**检查项仍在 quality-gates G7**（第 99 行），两者不重复。
- 顺手把原 2.2 单组件选型速查挪到分组末尾（规则在前、索引在后），编号 2.2 → **2.4**，同步改了 design.md 速查目录与 SKILL.md 的锚点链接。

**发现并修正一处事实错误**：`component-selection/table.md` 原正文写「控件 `size="small"`」，与脚手架 `a-table size="medium"` 矛盾。已改为「表格自身 `size="medium"`，同页操作栏 / 搜索 / 分页用 `small`」。

**⚠️ 遗留待定（需用户决策，我没动）**：`table.md` / `select.md` / `pagination.md` / `card-list` 的 frontmatter 都写着 `controls: { size: small }`。`metadata-schema.md` 第 32 行只说 `controls` 是「控件规格约定（如 `{ size: small }`）」，**没定义它指组件自身还是该场景下的周边控件**。对 table 而言按前者解读就是错的（实际 medium）。因为 frontmatter 喂 catalog + 官网选型卡片，属于数据变更，**本轮按既定原则未改**。要改需同时想清 `controls` 的语义定义。

**6 个文件的替换（正文 → 一行结论 + 锚点指针，frontmatter 一律未动）**：
- `modal.md`：删掉宽度四档明细 + 确认类 400 + content-box 464 解释 + 独立机检行（-10 行），压成一行结论 + 链 1.2；「别用它」补链 1.1 完整容器决策路径。
- `card.md`：删掉背景分层明细与「详见 SKILL『页面背景（全局准则）』」，改链 1.3 + 3.2。
- `form.md`：栅格断点改链 3.2，并补一句表单控件用默认尺寸链 2.2。
- `table.md`：不只靠颜色改链 2.3；尺寸表述修正后链 2.2。
- `pagination.md`：分页器 small 链 2.2。
- `badge.md`：双通道规则链 2.3。

**验证**：frontmatter **零改动**（git diff 逐行确认）；`build-catalog.mjs` 重跑 9/10/1，catalog 唯一变化是 `generatedAt` 时间戳、内容字节相同；design.md 17 个锚点，跨 SKILL.md + 10 篇选型文档 + design.md 自身共 **32 处锚点引用全部可达、零死链**；`grep` 确认组件文档正文已无 C 类内容（仅 `card.md` frontmatter 的 `composeBoundary` 仍含「极轻阴影」等字样，那是机读元数据，**故意保留**）。

**净效果**：SKILL.md 503 → 478 行；design.md 178 行（三分组 7 条规则 + 速查表）；6 个选型文档 -58/+26 行。设计规则从「散在 SKILL.md + 6 个组件文档」收敛为「design.md 持有正文，其余只留指针」。

### 2026-08-22 · 移除元数据字段 `controls`（连带修正上一条的遗留待定）

**结论：删掉，不设替代字段。** 上一条记的「⚠️ 遗留待定」到此关闭。

**核查过消费场景（这是决定删的依据）**：`build-catalog.mjs` 只是**原样透传**进 catalog.json；官网 `Components/Detail.vue` 只渲染 `whenToUse` / `whenNotToUse` / `variants` / `composeBoundary` / `pitfalls` **五个字段，不含 `controls`**；`check-tokens.mjs`、`quality-gates.md` 都不读；**`SKILL.md` 从未提及 `controls`**（agent 根本没被引导去读）；`metadata-schema.md` 标为非必填。→ **纯只写数据，零消费者。**

**删的四条理由**：
1. 零消费者，改错也没人发现。
2. **20 条里 4 条有问题（20%）**：`component-selection/table.md` 写 `{size: small}` 而脚手架所有表格是 `medium`（错）；`patterns/page-simple-list.md` 声明 `{size: small}` 但**同一文件第 216 行代码就是 `size="medium"`**（自相矛盾）；`select.md` 写死 `small` 但表单页 17 个 select 全是默认尺寸（不准）；模板层与组件层对 `size` 的语义理解不同（模板层 = 场景基调 + 元素例外键，组件层 = 组件自身尺寸），而 schema 从未定义过该选哪种 —— **这是根因**。
3. 违反本轮刚立的 `CONTRIBUTING` 原则 8 / F.1「设计规则只写一处」：`controls` 就是把尺寸规则复制进 20 个 frontmatter，与刚清掉的 C 类重复是同一反模式。
4. 信息已有三层更精确的落点：**规则**在 design.md 2.2 控件密度（区域分档矩阵）、**具体元素值**在各模板正文、**实现**在脚手架代码。逐条核对过 `controls` 里的每个值，正文/代码版本都比 frontmatter 更详细 —— 例：`circulateModal: 520` / `originModal: 720` 在 `page-approval-detail.md` 第 165/173 行，连「不要用 800——不在 520/720/1000 档位」的理由都写了；`leftPanel: 260` 在 `page-tree-table.md` 第 72 行还带窄屏降级（≤1100 收 220、≤768 上下堆叠）。

**删之前补了唯一的信息缺口**：`tree: medium` 是 `controls` 独有、正文没写的（脚手架 `TreeTable/index.vue` 第 219 行有）。已补进 `page-tree-table.md` 第 76 行树的说明，并链到 design.md 2.2。

**改动**：删 20 处 frontmatter 的 `controls` 行（9 个 `patterns/page-*.md` + 10 个 `component-selection/*.md` + `components-business/msc/attachment-upload.md`）；`metadata-schema.md` 删字段定义 1 行 + 两处示例行。用脚本限定在「首个 `---` 到第二个 `---`」范围内匹配 `^\s{2}controls:`，避免误删正文。`docs/plan-gates-metadata-website.md` 第 95 行**故意不动**（历史规划文档，属记录）。

**不设替代字段的理由**：尺寸应由 design.md 规则 + 机检保证。真要机检就**直接扫代码里的 `<a-table size>` 是否为 medium**，而不是拿 frontmatter 去比对 —— 后者只会再造一份需要人工同步的副本，重演这次的矛盾。

**验证**：catalog 重跑 9/10/1，20 条**全部不含 controls**，剩余字段 20 个（composeBoundary / whenToUse / pitfalls / tags / previewRoute / source / figma / triggers / replaces / status …）；20 个文件 frontmatter 的 `---` 配对与 `meta:` / `id:` 全部完好；官网 sync 后 10 个组件的 5 个渲染字段齐备、`controls` 残留 0；design.md 33 处锚点引用全可达、零死链；website `npm run gate` 通过（check-tokens + vue-tsc + build 20.92s）。

### 2026-08-22 · 扫尾 + 定版 1.4.1

**扫出 4 处失效指向**（把 SKILL.md 四段规则搬到 design.md 后留下的悬空引用，是本轮最容易漏的一类）：`quality-gates.md` 第 47 行「详见 SKILL『对话框宽度』」、第 68 行「SKILL『响应式适配』」、第 78 行「SKILL『页面背景』」、`project-structure.md` 第 202 行「详见 SKILL.md『页面背景（全局准则）』」→ 全部改为 design.md 对应锚点。
→ **教训：以后迁移 SKILL.md 章节，必须 `grep -rn "SKILL「\|SKILL.md「"` 扫一遍反向引用。**

**保留不动的两处**：`quality-gates.md` 第 46 行、`project-structure.md` 第 99 行指向 SKILL「图表（VChart）」——该节仍在 SKILL.md 第 144 行，引用有效。

**README.md 同步**：结构树补 `design.md` 与 `component-selection/ (10 篇)`，`components/` 篇数 **72 → 74**（早就过期了），`patterns/` 注明 9 个页面模板；「相关文档」列表加一行全局设计规则。

**已确认官网没有第三份规则副本**：`website/src/pages/Guide/`、`Foundations/` 里搜 520/720/背景分层/按钮组/auto-fill，只命中 `Foundations/index.vue` 第 424 行的官网自身 CSS，不是规则复制。

**CHANGELOG 定版 [1.4.1] - 2026-08-22**，按第七节口径只写使用者视角：Added（design.md 本身 + 容器决策路径 + 按钮组 + 控件密度分档 + 状态双通道 + 选型速查表）、Fixed（纠正「表格用 small」的错误结论）、Changed（设计规则收敛到一处 + 移除 `controls` 字段并说明 catalog 不再输出）。**版本内的返工与论证过程全部留在本台账**，CHANGELOG 里没写。

**`controls` 全仓残留仅 4 个文件，均属预期**：本台账、`CHANGELOG.md`（记录其移除）、`website/src/generated/CHANGELOG.md`（同步副本）、`docs/plan-gates-metadata-website.md`（历史规划文档，故意不动）。

**最终验证**：design.md 17 个锚点 / **50 处引用全部可达**；`references/` + `SKILL.md` **零死链**；catalog 9/10/1 且 `controls` 残留 0；website sync 后官网更新日志页已含 1.4.1；`npm run gate` 通过（check-tokens + vue-tsc + build 22.49s）。

**未做（待用户决定）**：**尚未打包**。`pack-skill.sh` 取 CHANGELOG 首个 `## [x.y.z]` 作版本号，现在会打成 1.4.1，需要发版时执行。

**已打包 v1.4.1**：`releases/pangea-design-vue_1.4.1.zip`，**412K / 150 个文件**（1.4.0 是 408K / 149）。脚本提示「skill 存在未提交改动，按工作区当前状态打包」——预期行为。校验：声明 150 = 实际 150；与 1.4.0 逐文件 diff **只多 `references/design.md` 一个**（其余都是文件内改动，不影响清单）；包内 design.md 的 9 个章节（7 条规则 + 分组）齐全；包内 `patterns/page-*` / `component-selection/` / `attachment-upload.md` **无 `controls:` 残留**；CHANGELOG 不随包分发（既有设计）。

### 2026-08-22 · 新增第 10 个页面模板：基础列表页（page-filter-list）

**需求**：用户要一个新页型——表格列表页，但筛选能力比简单列表页强（多字段同时查询 + 筛选方案），页头区域直接复用卡片列表页的形态（筛选方案+搜索+可展开高级筛选面板+按钮组），下方列表载体换成表格（同简单列表页）。**与简单列表页的定位差异只在筛选复杂度，不在数据呈现**。

**命名**：id 定为 `page-filter-list`，中文标题「基础列表页」（用户原话）。之所以不叫「高级列表页」——`page-simple-list.md` 里此前留了一条待补充的「高级列表页（多条件筛选）」占位，本次新模板正是它的实现，但用户明确说的是「基础列表页」，采用用户命名，并顺手清掉了 3 处「高级列表页/待补充」的陈旧占位引用。

**三个模板的关系**（已在新文档里画出）：页头形态是共享轴（筛选方案+搜索+展开钮+高级筛选面板+按钮组），下方分叉——表格载体上再分单字段（简单列表页）与多字段（基础列表页）；卡片载体是卡片列表页。判断表：只需单关键词/单字段→简单列表页；需要多字段同时查询或筛选方案→本模板；数据更适合卡片呈现→卡片列表页。

**改动清单**（8 类文件，均已验证）：
1. **脚手架页面**：`templates/project-starter/src/pages/FilterList/index.vue`（新建）——页头/筛选/高级筛选面板抄自 `CardList/index.vue`，表格/分页抄自 `Example/index.vue`（class 前缀统一改 `pg-filter-list__`）。
2. **路由与菜单**：脚手架 `src/router/index.ts` 新增 `filter-list` 子路由；`GlobalLayout.vue` 的「列表页」模块菜单里加一项，排在简单列表页之后、卡片列表页之前。
3. **模板文档**：`references/patterns/page-filter-list.md`（新建，含完整 frontmatter meta、页面结构图、三模板关系图、判断表、设计规范、Vue 代码要点、使用要点、对比表）。
4. **文档互链**：`SKILL.md` 决策树 + 索引表新增一行；`requirement-intake.md` 的页型→模板对照表新增一行；`page-card-list.md` / `page-simple-list.md` / `page-tree-table.md` 的「与其他模板区别」对比表补充引用（表单类模板的对比表未动——那些表只用简单列表页做列表类基线参照，不需要每个都列全部列表模板）。
5. **catalog**：重跑 `build-catalog.mjs`，`pageTemplates` 9→10。**踩了生成器一个坑**：`keyStructure` 里写了 `高级筛选面板(可选展开,多字段栅格)`，圆括号内的逗号被 `splitTopLevel`（只识别 `[]{}` 嵌套，不识别 `()`）误当顶层分隔符切开，变成两个数组项。修法是把括号内的逗号换成 `/`（其余模板文档都是这么避开的，如 `page-approval-detail.md` 的"流程处理/流程图占位/传阅记录"），**没有改生成器**——这是已知限制，只需写 meta 时避开。
6. **官网**：`sync-from-skill.mjs` 的 `EXAMPLE_PAGES` 加 `FilterList`；`website/src/router/index.ts` 加 `templates/filter-list` 路由；`Templates/index.vue` 的 `ROUTES` 映射与「列表页」分组 `ids` 加一条。
7. **缩略图**：`shoot_templates.py` 的 `TARGETS` 加一条（`ready: ".pg-filter-list"`）；起了本地 dev server（port 5188）跑 `npm run shoot:templates`，**11/11 张全部成功**（包括重拍其余 10 个旧模板，因为脚本是全量跑的），新图 `page-filter-list.jpg` 20KB，已提交入库。
8. **SKILL.md 顺手清理**：末尾「后续补充」段的「更多页面模板：高级列表页……」这行早就过期（详情页/表单页/仪表盘其实都做完了），改成准确的当前缺口（仅仪表盘未固化为标准模板）。

**CHANGELOG 定版 [1.4.2] - 2026-08-22**：只写「新增基础列表页模板 + 与简单列表页的定位差异」两条，过程细节（命名讨论、生成器坑、抄袭来源）都留在本条台账。

**验证**：脚手架 `vue-tsc --noEmit` 通过、`npm run build` 通过（9.98s）；catalog 重跑 10/10/1，`page-filter-list` 的 `keyStructure` 修正后不再被误切；design.md 锚点引用 27 处全部可达，md/json 死链 0；website `npm run gate` 通过（check-tokens + vue-tsc + build 26.38s）；截图脚本 11/11 成功。

**未做（不在本轮范围）**：筛选方案的保存/回填逻辑只有 TODO 占位（文档已明确说明"骨架未实现具体存取逻辑，接入时按业务补"），这是设计模板的正常边界，不是缺陷。

## 2026-08-29 · 新增通用共享组件层 `components-shared/`，首个组件 FilterBar（复合筛选器）

**起因**：用户发现[基础列表页](skills/pangea-design-vue/references/patterns/page-filter-list.md)与[卡片列表页](skills/pangea-design-vue/references/patterns/page-card-list.md)的页头都用了同一套「筛选方案 + 搜索 + 可展开高级筛选面板」复合筛选器（两个模板文档里各贴了一份几乎相同的完整 Vue 实现），随着后续迭代容易逐渐漂移，要求抽成通用组件；同时页面标题经常要与筛选器同行出现，标题位置未必是纯文字（可能是 tabs 等），要求做成插槽。

**新建了第三层组件目录**：此前只有两层——`references/components/`（Arco 原生镜像）与 `references/components-business/`（产品专属业务组件，默认不用）。这次新加 `references/components-shared/`：本 skill 自己提炼的可复用 UI 片段，**不含任何产品业务假设**、被 2 个以上页面模板共用。判断新组件归属：带具体产品业务假设 → business；否则只是多模板共用的纯 UI 结构 → shared。

**FilterBar 组件设计**：
- 源码 `templates/project-starter/src/components/FilterBar.vue`（无子目录、无产品前缀，与 `components-business/<产品>/` 的命名规则区分开）。
- Props 全部走 `v-model` 风格（`filterPlan`/`searchField`/`searchKeyword`/`advancedForm`/`advancedVisible`），组件内部不持有状态，页面完全受控。
- `show-filter-plan`/`show-search-field` 是**显式**开关（默认 true），**不能靠 options 数组长度自动判断显隐**——筛选方案候选项常是运行时异步拉取的，选项还没到位时用长度判断会误判成"不需要"。
- `advanced-fields` 为空/不传时自动不渲染展开按钮与高级筛选面板，天然支持"仅简单搜索"这种更轻量的用法。
- `#title` 默认插槽承载标题区域（可放纯文字 `<h2>`、也可放 `a-tabs` 等动态元素）；`#actions` 插槽承载操作按钮组。组件自身只画筛选行+高级筛选面板+actions 插槽这一块，**外层 header 的 padding/底部分割线仍由页面自己的容器决定**（不同页面页头留白可能不同，不适合在组件里写死）。

**两个页面同步改造**：`CardList/index.vue`、`FilterList/index.vue` 均改为 `import FilterBar from '@/components/FilterBar.vue'`，删除了原先各自实现的筛选方案下拉/搜索输入组/高级筛选面板模板与对应的 scoped 样式（`__filter`/`__filter-right`/`__filter-panel`/`__adv-*` 全部移除，只保留 `__title` 样式因为标题渲染逻辑还在页面侧）。两个页面的高级筛选相关状态（`advancedVisible`/`advancedFields`/`advancedForm`/`onAdvancedQuery`/`onAdvancedReset`/`onAdvancedSave`）保持不变，只是把渲染委托给 FilterBar。

**文档同步**：
- 新建 `references/components-shared/README.md`（本层定位、与另两层的边界表、新增组件的维护流程）+ `filter-bar.md`（含 `meta` frontmatter，`kind: shared-component`，完整 API/用法/使用要点）。
- `page-card-list.md`/`page-filter-list.md` 的设计规范与代码模板章节都改为"引用 FilterBar"而非重复贴完整实现；frontmatter 的 `composeWith`/`composeBoundary` 加了 `filter-bar` 交叉引用。
- `SKILL.md` 新增「通用共享组件」小节（在「产品专属业务组件」之前）+ 「组件选型元数据」小节补充共享组件条目与 catalog 的 `sharedComponents` 字段。
- `metadata-schema.md` 的 `kind` 字段枚举从 `page-template | component` 扩为 `page-template | component | shared-component | business-component`，并补充每个 kind 对应哪层文档目录。
- `project-structure.md` 文件地图加了 `src/components/FilterBar.vue` 一行。

**生成器改动**：`build-catalog.mjs` 新增 `SHARED_DIR`（`references/components-shared/`）扫描，输出新增 `sharedComponents` 数组与 `counts.sharedComponents`。重跑后：页面模板 10 / 组件 10 / **共享组件 1** / 业务组件 1（1 个产品）。

**website 同步**：`sync-from-skill.mjs` 原先只同步 `LazyChart.vue` 一个组件，这次改为同时同步 `LazyChart.vue` + `FilterBar.vue`（同一批处理逻辑）；`EXAMPLE_PAGES`（`CardList`/`FilterList`）同步时的导入改写逻辑从"只处理 Dashboard 的 LazyChart 导入"扩展为"通用替换 `@/components/LazyChart.vue` 与 `@/components/FilterBar.vue` 两条路径"，改写后验证过官网快照里 `CardList/index.vue` 的导入正确变成 `../../components/FilterBar.vue`。

**验证**：脚手架 `vue-tsc --noEmit` 与 `vite build` 均通过，FilterBar 被 Vite 正确拆分为独立 chunk（约 6.6KB，说明按需加载没被破坏）；website `npm run gate`（check-tokens + vue-tsc + build）通过，FilterBar 同样独立分包（约 4KB）。两处构建产物 `dist/` 已清理，未提交。

**未做**：FilterBar 目前只有 1 个消费方场景（列表页页头），暂未评估是否有第三个页面会用到同一形态；筛选方案的保存/回填逻辑仍是页面侧 TODO（组件本身不管这部分业务逻辑，符合设计边界）。

**CHANGELOG 未动**：按 CONTRIBUTING 第七节口径，这是内部组件抽取/重构，产出的页面行为和视觉对使用者不变（两个模板页面渲染结果一致），不构成"使用者需要知道的新能力"；如果后续把 FilterBar 作为可独立使用的能力对外强调（比如用户直接问"能不能用这个筛选器"），再考虑在下个版本的 CHANGELOG 里提及。

## 2026-08-29 · 修正 FilterBar 组件边界：移除 `#actions` 插槽

**问题**：用户在官网组件详情页看到「交互示例」实际渲染的是通用兜底示例（主要按钮/次要按钮），并进一步指出 FilterBar 本不该包含操作按钮组这个插槽——设计稿里筛选器（标题+筛选方案+搜索+展开钮+高级筛选面板）与下方按钮组（创建/导入/导出/打印）是**并列**的两块，按钮组不属于筛选器职责。

**顺带修的一个 bug**：官网组件详情页 `Detail.vue` 的专属 demo 查找逻辑只把 id 首字母大写（`filter-bar` → `Filter-bar`），找不到对应的 `demos/FilterBar.vue`，静默回退到内联的通用兜底示例（`else` 分支的"主要按钮/次要按钮"），才让用户误以为交互示例展示的不是这个组件。改成按 `-` 分段各自首字母大写再拼接（`toPascalCase`），验证过所有既有单词 id（button/tag/tree/tooltip/steps/dropdown/form）不受影响。

**FilterBar 组件边界修正**：
- 移除 `#actions` 插槽与对应的 `.pg-filter-bar__actions` 样式；组件说明改为「只负责筛选行 + 高级筛选面板，不含操作按钮组——按钮组是页面自己的内容，与筛选器并列」。
- `CardList/index.vue`、`FilterList/index.vue` 的按钮组移出 `<FilterBar>`，改为在 header 容器内与 `<FilterBar>` 并列的 `<a-space>`。
- 文档同步：`filter-bar.md`（frontmatter description/meta 及正文的插槽表、组件结构图、用法示例、使用要点全部去掉 `#actions`）、`page-card-list.md`、`page-filter-list.md`（设计规范与代码模板章节同步改为"按钮组不属于 FilterBar，页面自己渲染"）、`SKILL.md`「通用共享组件」小节措辞同步。
- 官网 `Components/demos/FilterBar.vue` 的三个 demo 也同步去掉 `#actions` 用法，改为在 `<FilterBar>` 外层用独立的 `<a-space>` 演示按钮组与筛选器的并列关系。

**验证**：重跑 `build-catalog.mjs`（页面模板10/组件10/共享组件1/业务组件1，`filter-bar` 的 `keyStructure`/`pitfalls` 已去掉"操作按钮组slot"字样）+ website `sync-from-skill.mjs`；脚手架 `vue-tsc --noEmit` + `vite build` 通过；website `npm run gate`（check-tokens+vue-tsc+build）通过；dev server HMR 正常热更新，两处构建产物已清理。

## 2026-09-01 · FilterBar 三开关化 + 全部 4 个列表模板统一收敛到 FilterBar

**背景**：用户先要求把「筛选方案 + 搜索 + 高级筛选面板」这套显隐逻辑改成三个独立开关（`showFilterPlan`/`showSearch`/`showAdvancedPanel`，均默认全开，不再靠 `advancedFields` 是否为空隐式判断），并明确指出「不推荐关掉搜索框只留筛选面板」这种组合（面板默认折叠，进页面看不到任何筛选条件），website demo 里删掉了这个组合。随后用户要求检查「简单列表页」「左树右表」两个模板的筛选区是不是也该用 FilterBar——发现这两个之前一直是手写的 `a-input-group`（宽 324px，与 FilterBar 收窄后的 256px 不一致），要求统一收敛，宽度不一致问题可忽略（改用组件后自动消失）。

**结果**：**4 个列表类页面模板的搜索/筛选区现在全部统一引用 FilterBar**，不再有任何页面自己实现这套 UI：

| 模板 | 用法 |
|---|---|
| 简单列表页 `Example` | 只开搜索框：`:show-filter-plan="false" :show-advanced-panel="false"` |
| 左树右表 `TreeTable`（右侧子表操作栏） | 同上，只开搜索框 |
| 卡片列表页 `CardList` | 三个开关全开 |
| 基础列表页 `FilterList` | 三个开关全开 |

**FilterBar 组件改动**：
- 移除隐式的 `hasFilterPlan`/`hasAdvanced`（靠 options/fields 长度判断），改为三个显式 boolean prop，直接控制模板里对应区块的 `v-if`。
- 搜索框宽度从 324px 收窄到 256px（前置字段下拉 80px + 剩余归输入框，输入框只做短关键词查询，长条件走筛选面板）。
- `showSearchField`（搜索框内部要不要带字段下拉）保留，属于搜索框内部的细分选项，不算三大开关之一。

**标题插槽的动态元素约定**：官网 demo 之前用 `a-tabs type="capsule"` 演示"标题放动态元素"，用户反馈下面多了一段空白且没居左。排查后发现是 `a-tabs` 本身的问题（nav 占满整行+渲染空内容面板），不是 FilterBar 的锅。改用 `a-radio-group type="button"` 后间距和居左都正常（radio-group 本身是 `inline-flex`）。顺手把这条经验写成设计规则：新增 **design.md 2.5 「行内视图切换用 radio-button，且一律居左」**，并在组件选型速查表的 Tabs 行补充了这条边界（tabs 管"切换成块内容"，radio-button 管"切换同一块内容的数据范围"）。

**文档同步范围**：`filter-bar.md`（开关表、常见组合示例、pitfalls、结构图、frontmatter meta 全部更新为三开关口径，且明确标注"不推荐只留筛选面板"）、`page-simple-list.md`、`page-tree-table.md`、`page-card-list.md`、`page-filter-list.md`（composeWith 加 `filter-bar`）、`SKILL.md`（FilterBar 说明改为"4 个列表类模板全部统一由它实现"）、`design.md`（新增 2.5）。

**website demo 变化**：`Components/demos/FilterBar.vue` 从 4 个 demo 精简为 3 个：①三个开关全开、②只留搜索框、③标题为动态元素（radio-button）。同时之前排查到一个无关但顺手修的 bug：`Detail.vue` 查找专属 demo 文件时用错了大小写转换规则（只大写首字母，`filter-bar`→`Filter-bar` 找不到文件），改成按 `-` 分段各自首字母大写再拼接。

**验证**：脚手架 `vue-tsc --noEmit` + `vite build` 通过（FilterBar 现在被 4 个页面共用，仍是独立 chunk）；website `npm run gate`（check-tokens+vue-tsc+build）通过；`build-catalog.mjs` 重跑确认 `sharedComponents` 计数不变（仍是 1，FilterBar 本身没变多）；website sync 重跑确认 `Example`/`TreeTable` 同步后的导入路径正确改写为相对路径。两处构建产物已清理，改动未提交。
