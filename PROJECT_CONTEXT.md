# 项目上下文台账（PROJECT_CONTEXT）

> **这是本项目的单一事实源（Single Source of Truth）。** 每次新会话开始时先读它；完成里程碑、做出重要决策、或新增/移动文件后**及时更新它**。
> 它是跨软件、跨电脑、防突发丢失的锚点——**提交并推送到 Git 后**即可在任何机器/工具上恢复上下文。维护协议见文末「■ 更新协议」。最后更新：2026-07-23。

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
- ✅ **可运行脚手架**：`skills/pangea-design-vue/templates/project-starter/`，已内置并接入主题包（`vitePluginForArco({ theme })`，**不再启用 `iconBox` 全局替换**，图标改命名导入），含**标准化 `GlobalLayout.vue`**（基于 Figma 设计稿实现：Header 48px + 左侧可折叠侧边栏 200px + 内容区白背景左上圆角 8px）+ 自定义菜单样式 `layout-menu.less` + `pages/Example` + 子路由示例。
- ✅ **治理框架**：`README.md`、`CONTRIBUTING.md`、`CHANGELOG.md`（根目录）。
- ✅ **已上传 GitHub**：`main` 分支，初始提交 + README。
- ✅ **图标引用已统一**：定制文档全部指向图标包命名导入，清理了默认 Arco 图标/iconfont 残留。
- ✅ **脚手架已实测可运行**（A+D+C）：修复 3 处缺口后 `npm install`→`vue-tsc`→`vite build`→`npm run dev` 全通过，产物 CSS 含青绿 `--primary-6: 0,170,166`；加了 `package-lock.json`；支持 `npx degit …/templates/project-starter my-app` 一键起项目。
- ✅ **模式文档增补**：form-patterns（提交/校验二选一）、table-patterns（分页 total 联动）本地补充。
- ✅ **PM Demo 模式**：SKILL.md 新增「PM Demo 模式」章节（agent 全托管工程生命周期），脚手架内置 2 个 Kiro hooks（`pm-dev-server` SessionStart / `pm-compile-check` PostFileSave），`project-structure.md` 新增对应说明。PM 只需对话+浏览器预览，无需接触终端或处理编译错误。
- ✅ **5 个页面模板已建**（`references/patterns/`）：`page-simple-list.md`（简单列表页）、`page-card-list.md`（卡片列表页，a-card 网格）、`page-modal-form.md`（对话框表单）、`page-form.md`（基础表单页）、`page-grouped-form.md`（分组表单页）。均基于 Figma 设计稿。脚手架 `src/pages/` 内有部分示例页（Example=简单列表 / ContractForm / GroupedForm），已注册路由 + 菜单。

## 3. 关键结论与决策（不要重复踩坑）
- **视觉 token 唯一事实源 = 主题包运行时**（`@arco-themes/vue-pangea-3-linear` 的 `theme.css`/`tokens.less`/`theme.less`，即 `rgb(var(--x-n))` 实际解析值）。Figma/设计稿/记忆都不是权威，**冲突以主题包为准**。
- **品牌主色 = 青绿 `#00aaa6`（`--primary-6`）**，不是 Arco 默认蓝；`link` 与 primary 同色。状态色（success=green / danger=red / warning=orange / info=arcoblue）沿用 Arco 标准。
- **Figma 与主题包的 Cyan 色系（及 red-7）不一致** → 已统一以主题包为准（Figma 由 @维护者 手动对齐）。`design-tokens.md` 中已删除该差异说明。
- **图标分工（重要，勿再走 iconBox 全局替换）**：① **功能性/组件内建图标**（Modal 关闭、Select 箭头、DatePicker 日历、Collapse caret 等）用 **Arco 默认，不替换**——**已移除 `@arco-plugins/vite-vue` 的 `iconBox` 全局替换选项**，因为它会连带替换 Arco 组件内建图标、破坏组件内部样式（根因）。② **业务/内容图标**从图标包 `@arco-iconbox/vue-pangea-mobile` **命名导入**（如 `import { IconGlobal } from '@arco-iconbox/vue-pangea-mobile'`，517 个命名导出，继承 `currentColor`、`font-size` 控大小）。**不要**用 `@arco-design/web-vue/es/icon` 或 iconfont.cn，不启用 iconBox。（曾用 `src/styles/arco-fixes.less` 全局 CSS 修 hover 变白问题，属治标——已删除，根因是 iconBox。）
- **生成层级**：具体页面是**全局 Layout 下的路由子页面**（`src/pages/<PageName>/index.vue` + 注册为 Layout 路由 children + 在 menuItems 中追加菜单项）。全局 Layout 已按 Figma 设计稿标准化（Header + 可折叠侧边栏 + 内容区），**不要重写/替换全局 Layout**（除非明确要求）。
- **侧边栏菜单自定义样式**（`src/layouts/layout-menu.less`）：覆盖 Arco Menu 默认样式——透明背景、13px 一级 / 12px 二级、**默认态透明 / 选中态白背景 + `primary-7` 文字 + medium 字重（选中+hover 仍保持白色）**、hover 用 `rgba(0,0,0,0.06)`、圆角用 `var(--border-radius-*)`、28px 二级缩进、无左侧竖条指示器。在 `main.ts` 中全局 import。⚠️ Arco 组件样式**懒加载注入在全局 less 之后**，覆盖选中态背景等需加 `!important` 才生效。
- **非颜色 token 的 CSS 变量可用性**：主题包**只把颜色 + 圆角注入为运行时 CSS 变量**（`var(--color-*)`、`var(--border-radius-*)`）；字号/字重/行高/间距/尺寸**只有 Less 变量**（`@font-size-*` 等），无对应 CSS 变量。故 scoped `<style>` 里：圆角一律用 `var(--border-radius-*)`；字号/字重优先走组件，确需自定义只能写字面值且必须落在 Pangea 档位（字号 12/13/14/16/20、字重 400/500/600、间距 4 的倍数）。详见 design-tokens.md「哪些 token 是运行时 CSS 变量」。
- **照搬 vs 定制**：组件/模式文档 + architecture/config-provider/i18n 为「照搬」上游，仅上游 API 变化时才动；主题/工程结构相关为「定制」。（例外：form-patterns/table-patterns 末尾带「本地补充」小节，同步上游时保留。）
- **脚手架可运行性三要点（勿破坏）**：① `less` 必需 devDep；② `main.ts` 显式 `import '@arco-themes/vue-pangea-3-linear/theme.css'`（运行时 CSS 变量，只靠插件注入不可靠）；③ `src/vite-env.d.ts` 提供 `*.vue`/`vite/client`/图标包类型声明。改依赖或配置后须重跑 install/build/dev 并更新 lockfile。
- **纯前端铁律**：产出始终是完整的 Vue 纯前端工程，只做前端（页面/路由/组件/前端状态/mock 或调用既有接口），**不产出、不涉及任何后端代码或服务**。demo 用 mock；开发对接既有后端接口但不实现后端。
- **skill 定位 = 海信集团 B 端 / 中后台产品**（管理后台、业务系统、数据平台、内部工具），以「规范执行」为先，不做规范外自由发挥。SKILL.md 开头有「定位与适用范围」章节。
- **页面生成决策树**（SKILL.md「页面生成决策树」章节）：先判断场景与现有页面模板匹配度——高匹配直接套模板、部分匹配以模板为骨架增补、低匹配才 AI 自主设计；但自主设计也必须只用 Arco Vue 组件 + Pangea token（颜色/圆角变量、字号字重间距落档位），不自造组件、不引其它 UI 库。
- **图表 = VChart**（VisActor，https://github.com/VisActor/VChart ，`@visactor/vchart`）：需数据可视化时优先用；系列配色接入 Pangea 调色板（主色 primary-6），容器用 a-card 承载，数据 mock 或对接既有接口。
- **响应式适配 = 全局准则**（SKILL.md「响应式适配（全局准则）」+ 各页面模板已落地）：每个页面都必须响应式，内容区宽度会随侧边栏折叠/分屏/小屏变化。铁律——**表单多列栅格用 Arco Grid 断点、不写死 `:span`**：3 列表单 `:xs="24" :sm="12" :lg="8"`、2 列 `:xs="24" :sm="12"`，整行字段保持 `:span="24"`（断点 xs<576/sm≥576/md≥768/lg≥992/xl≥1200/xxl≥1600）；卡片/磁贴网格用 CSS `repeat(auto-fill|auto-fit, minmax(...))`；表格窄屏用 `:scroll={x}`/隐藏次要列；工具栏/筛选行 `flex-wrap`；固定像素宽度（modal/面板）不超视口、辅助区（锚点/侧栏）窄屏隐藏。优先用 Grid 断点，能不写媒体查询就不写。详见 responsive-design.md。
- **协作约定**：❗**不要替用户自动 `git commit` / `git push`**，只改文件，提交推送由用户手动操作（用户 2026-07-21 明确要求）。

## 4. 文件地图（File Map）
```
pangea-design-skill/
├── PROJECT_CONTEXT.md            # 本台账（单一事实源）
├── README.md                     # 仓库首页
├── CONTRIBUTING.md               # 贡献/维护规则、事实源约定、提交检查
├── CHANGELOG.md                  # 变更记录
├── .kiro/steering/context-management.md   # Kiro 常驻规则：自动注入本台账
└── skills/pangea-design-vue/
    ├── SKILL.md                  # skill 入口
    ├── references/
    │   ├── theme/design-tokens.md          # 全部设计 token（核心）
    │   ├── overview/project-structure.md   # 工程结构 + 生成层级
    │   ├── overview/theming.md · getting-started.md   # 定制
    │   ├── overview/architecture.md · config-provider.md · internationalization.md  # 照搬
    │   ├── components/ (72)  # 照搬
    │   └── patterns/  (10)   # 5 照搬 + 5 页面模板
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
- [ ] 清理脚手架 `src/pages/` 里的示例页（Example/ContractForm/GroupedForm）——它们是本轮预览调试用，是否保留为脚手架自带示例需定夺；保留则更新 router/menu 说明，移除则恢复单 Example。

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
