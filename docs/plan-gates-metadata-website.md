# 实施方案：质量门禁 + 组件/模板元数据 + Showcase 官网

> 状态：**阶段 0–5 全部完成**（2026-07-23 定稿并实施完毕）。剩余仅「部署到 Cloudflare」待正式部署时执行。
> 本文件是持久化的实施蓝图，供后续会话/协作者接手。它是**计划文档**，不属于 `skills/` 或 `website/`，改动它不影响这两个交付物。
> 逐日进展记 `PROJECT_CONTEXT.md`；重要变更记 `CHANGELOG.md`。

---

## 0. 背景与目标

在保持现有 skill 交付能力的前提下，吸收「秘画 Mihua Design」中值得借鉴的两点，并新增一个官网 showcase：

1. **生成后质量门禁**：把「生成后自检」从隐性变成显式、可核销的清单（+ 轻量自动化）。
2. **组件/模板元数据**：为每个页面模板/常用组件标注「适用任务 / 变体 / 组合边界」，服务 AI 选型与官网目录。
3. **Showcase 官网**：一个介绍 + 预览设计系统、引导用户的站点。**不做可视化编辑。**

---

## 1. 不可动摇的原则（边界）

- **Skill = 唯一事实源（SSOT）+ 核心交付物**。所有规则、token、元数据、门禁只在 `skills/pangea-design-vue/` 内编写。
- **Website = showcase，且本身是「用 skill 规则产出的样例」（dogfood）**。用与脚手架同一套技术栈构建，并**必须通过同一套质量门禁**。
- **独立性**：
  - `website/` 是独立 npm 工程，可单独部署；**运行时绝不 import `skills/**` 内部路径**。
  - 数据**单向**流动：`skill → website`（通过同步脚本快照）。**skill 永不依赖 website。**
- **协作约定**：只改文件，不自动 `git commit` / `git push`。

### 数据流与边界示意

```
skills/pangea-design-vue/                 ← 唯一事实源
  ├─ references/patterns/*.md             （含 frontmatter 元数据）
  ├─ references/component-selection/*.md  （组件选型元数据）
  ├─ references/theme/design-tokens.md
  ├─ references/overview/quality-gates.md
  ├─ scripts/build-catalog.mjs  ──►  references/_generated/catalog.json
  └─ templates/project-starter/           （示例页 = 官网基底）
                    │  （单向同步快照，sync-from-skill.mjs）
                    ▼
website/                                  ← 独立工程 / dogfood / 单独部署
  └─ src/(generated)  ← catalog.json + token 数据 + 示例页快照
```

---

## 2. 已锁定的决策

| # | 决策 |
|---|---|
| 1 | **website 以 `templates/project-starter` 为基底 fork**（继承 GlobalLayout / 主题 / skill 约定，天然是 dogfood 样例）。 |
| 2 | **机读索引 `catalog.json` 放 skill 内** `references/_generated/`（同时服务 AI 决策树与官网）。 |
| 3 | **元数据形态 = 文档顶部 YAML frontmatter**（SSOT 与文档同生）+ 生成器汇总成 `catalog.json`。 |
| 4 | **质量门禁 = 清单文档 + 中等自动化**（脚手架 `npm run gate`），不上重 CI。 |
| 5 | **部署暂通用**：产物为纯静态 `dist`，base 路径可配置（后续大概率 Cloudflare Pages，暂不硬编码）。 |
| 6 | **不做可视化编辑能力。** |

---

## 3. 工作流 A —— 生成后质量门禁

### A1 规则文档（skill 内）
新建 `skills/pangea-design-vue/references/overview/quality-gates.md`，SKILL.md 增一节引用。门禁清单（每条给「怎么查」）：

- **G1 编译**：`vue-tsc --noEmit` + `vite build` 无错。
- **G2 Token 规范**：无裸 hex（颜色走语义 token / palette）；圆角用 `var(--border-radius-*)`；间距 4 倍档；字号/字重落档；无自造组件。
- **G3 组件用法**：用 Arco 组件；图标分工正确（功能性用 Arco 默认 / 业务命名导入）。
- **G4 响应式**：表单栅格断点、卡片网格 auto-fill、表格窄屏可用、工具栏 wrap。
- **G5 背景分层**：内容页白底 / 仪表板类透明 + 无边框白卡；不依赖 Layout 背景。
- **G6 交互完整性**：空态/加载/错误/禁用四态；提交与校验二选一；分页 `total` 联动。
- **G7 可访问性**：纯图标按钮有 `aria-label`；正文对比度 ≥ 4.5:1；语义标签。
- **G8 生成层级**：页面是 Layout 子路由、已注册路由 + 菜单、未重写 Layout。

### A2 自动化（脚手架内）
- `package.json` 加 `npm run gate` = `vue-tsc --noEmit && vite build` + `scripts/check-tokens.mjs`（机检裸 hex / 非档位圆角）。
- `pm-compile-check` hook 复用 `gate`。
- website 作为 dogfood 也跑同一 `gate`。

---

## 4. 工作流 B —— 组件/模板元数据

### B1 元数据 schema（YAML frontmatter）
写在每个 `patterns/page-*.md` 与组件选型文档顶部：

```yaml
id: page-card-list
kind: page-template          # page-template | component
title: 卡片列表页
whenToUse: [以卡片呈现数据列表, 图文/资源/应用墙]
whenNotToUse: [规整多列数据→简单列表页, 需录入→表单页]
keyStructure: [页头, 操作栏, 卡片网格(a-card), 分页, 高级筛选面板(可选)]
variants: [基础卡片, 带高级筛选]
composeWith: [a-card, a-pagination, a-input-group]
composeBoundary: [卡片统一 a-card 不自造, 网格 auto-fill 不写死列数]
controls: { size: small }
pitfalls: [卡片操作图标用 icon-hover text 按钮, 不用裸 Icon]
previewRoute: /card-list      # 对应脚手架/官网预览路由（组件可留空）
```

### B2 生成器与索引
- skill 内新增 `scripts/build-catalog.mjs`：扫描所有 frontmatter → 输出 `references/_generated/catalog.json`。
- catalog.json 同时供：① AI「页面生成决策树」；② 官网组件/模板目录。

### B3 回填范围
- **5 个页面模板**：`page-simple-list / page-card-list / page-modal-form / page-form / page-grouped-form`（已有「场景/结构/要点」，标准化为 frontmatter）。
- **高频组件选型元数据**：新建 `references/component-selection/`，先覆盖 Table / Form / Modal / Card / Tabs / Select / Badge / Menu / Pagination / Alert。
- SKILL.md「页面生成决策树」接入 catalog。

> 注：不改动 `references/components/`（那是照搬上游的组件 API 文档）；选型元数据是**另建的一层**。

---

## 5. 工作流 C —— Showcase 官网

### C1 技术与基底
- 目录 `website/`（独立 npm 工程）。**以 `templates/project-starter` 为基底 fork**：Vue3 + Vite + TS + Vue Router + Arco + Pangea 主题包，复用 `GlobalLayout` 与 skill 约定 → 官网本身即 skill 产出样例。
- 独立 `package.json` / 依赖 / 部署；不 import `skills/**`。

### C2 栏目
1. 首页 / 产品介绍（Pangea 定位：海信 B 端/中后台；理念：设计系统 + skill + 可运行工程）。
2. 设计基础 Foundations（颜色/字体/间距/圆角/阴影 token 预览，**运行时读主题包 CSS 变量**）。
3. 组件预览 Components（live 交互，数据读 `catalog.json`）。
4. 页面模板预览（把示例页 Dashboard/列表/表单**作为官网自己的路由**渲染，既预览又是样例）。
5. 使用指南 Getting Started（degit 起项目 / 在 Kiro·Codex·Cursor·Claude 里描述需求 / PM Demo 模式 / 交付流程 / 引用 A 的门禁）。
6. 更新日志（渲染 `CHANGELOG.md`）。

### C3 数据同步（单向 skill → website）
- `website/scripts/sync-from-skill.mjs`：把 `catalog.json` + token 数据 + 示例页快照拷进 `website/src/(generated)/`（标注 generated）。
- skill 变更后重跑同步；website 不反向依赖。

### C4 部署（暂通用）
- 纯静态 `dist`，`npm run build` 出包；base 路径可配置（默认相对路径，便于任意静态托管）。
- 后续大概率 Cloudflare Pages，届时再定项目名/域名与 base。

---

## 6. 分阶段里程碑

| 阶段 | 内容 | 落点 | 风险 |
|---|---|---|---|
| **0 ✅** | 门禁清单 `quality-gates.md` + 元数据 schema 定义（**已完成 2026-07-23**，并接入 SKILL.md） | skill 内，纯文档 | 零，先做（地基） |
| **1 ✅** | 回填 5 模板 + 组件选型元数据 + `build-catalog.mjs` + 决策树接入（**已完成 2026-07-23**：5 模板 meta + 10 组件选型 + catalog.json + SKILL 接入） | skill | 低 |
| **2 ✅** | `npm run gate` + `check-tokens.mjs`（**已完成 2026-07-23**：check:tokens/gate 脚本 + hook 说明 + 正负测试通过） | 脚手架 | 低 |
| **3 ✅** | website 骨架（fork 脚手架）+ `sync-from-skill.mjs` + 首页/使用指南（**已完成 2026-07-23**：全站 GlobalLayout + hash 路由 + Home/Guide/ComingSoon + 同步脚本；独立 gate 通过） | website | 中 |
| **4 ✅** | Foundations（token 预览）+ 组件 live 预览（**已完成 2026-07-23**：颜色/圆角运行时读 CSS 变量 + 组件 live 画廊 + catalog 选型区） | website | 中 |
| **5 ✅** | 页面模板预览（示例页为路由）+ CHANGELOG 页 + 部署（**已完成 2026-07-23**：Templates 索引 + 预览路由 + Changelog 页 + vchart 依赖；部署暂通用 base './'） | website | 中 |

---

## 7. 待定 / 后续确认

- 部署平台细节（Cloudflare 项目名 / 域名 / base 路径）——待准备部署时定。
- 组件选型元数据的覆盖范围是否要超出首批 10 个高频组件。
- 示例页在 website 内是「同步脚本快照」还是「独立镜像手工维护」——倾向快照（保 SSOT）。

---

## 8. 变更记录（本方案自身）

- 2026-07-23 定稿 v1：确定三条工作流、SSOT/独立性边界、6 条锁定决策、分阶段里程碑。基于对 Mihua Design 的调研 + 用户澄清（skill 为 SSOT、website 自建 Vue SPA 且为 dogfood、目录独立、部署通用、不做可视化编辑）。
- 2026-07-23 阶段 0 完成：新增 `references/overview/quality-gates.md`（G1–G8）与 `references/overview/metadata-schema.md`（frontmatter `meta` schema + catalog.json 约定），并接入 SKILL.md（索引 + 决策树）。
- 2026-07-23 阶段 1 完成：5 个 `page-*.md` 回填 `meta`；新建 `references/component-selection/`（10 组件）；零依赖生成器 `scripts/build-catalog.mjs` 生成 `references/_generated/catalog.json`（5 模板 + 10 组件）；SKILL.md 加「组件选型元数据」小节。
- 2026-07-23 阶段 2 完成：脚手架 `scripts/check-tokens.mjs` + `npm run gate` / `check:tokens`；`pm-compile-check` hook 加「交付前跑 gate」说明；quality-gates.md / project-structure.md 同步。正负测试通过。
- 2026-07-23 阶段 3 完成：`website/` 独立工程（fork project-starter，全站 GlobalLayout + hash 路由 + base './'）；首页 Home（读 catalog 统计）+ 使用指南 Guide（参考花叔结构）+ 占位 ComingSoon；`sync-from-skill.mjs` 单向同步 catalog→src/generated（提交 git）；独立 install + gate 通过。
- 2026-07-23 阶段 4 完成：website 设计基础 Foundations（颜色/圆角运行时读 CSS 变量 + 排版/间距/阴影静态档位）+ 组件预览 Components（live 画廊 + 读 catalog 选型元数据）；router 指向真页面；gate 通过。
- 2026-07-23 阶段 5 完成（方案收尾）：sync 扩展同步示例页/LazyChart/CHANGELOG；website 加 @visactor/vchart 正式依赖；新增页面模板 Templates（索引 + 预览子路由渲染同步的示例页）+ 更新日志 Changelog（?raw + 轻量 md 渲染）；菜单子路由高亮；gate（含 vchart 打包）通过。部署暂通用（base './'）。**阶段 0–5 全部完成。**
