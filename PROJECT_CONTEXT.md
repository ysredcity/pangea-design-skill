# 项目上下文台账（PROJECT_CONTEXT）

> **这是本项目的单一事实源（Single Source of Truth）。** 每次新会话开始时先读它；完成里程碑、做出重要决策、或新增/移动文件后**及时更新它**。
> 它是跨软件、跨电脑、防突发丢失的锚点——**提交并推送到 Git 后**即可在任何机器/工具上恢复上下文。维护协议见文末「■ 更新协议」。最后更新：2026-07-21。

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
- ✅ **可运行脚手架**：`skills/pangea-design-vue/templates/project-starter/`，已内置并接入主题包 + 图标包（`vitePluginForArco({ theme, iconBox })`），含占位版 `GlobalLayout.vue` + `pages/Example` + 子路由示例。
- ✅ **治理框架**：`README.md`、`CONTRIBUTING.md`、`CHANGELOG.md`（根目录）。
- ✅ **已上传 GitHub**：`main` 分支，初始提交 + README。
- ✅ **图标引用已统一**：定制文档全部指向图标包命名导入，清理了默认 Arco 图标/iconfont 残留。
- ✅ **脚手架已实测可运行**（A+D+C）：修复 3 处缺口后 `npm install`→`vue-tsc`→`vite build`→`npm run dev` 全通过，产物 CSS 含青绿 `--primary-6: 0,170,166`；加了 `package-lock.json`；支持 `npx degit …/templates/project-starter my-app` 一键起项目。
- ✅ **模式文档增补**：form-patterns（提交/校验二选一）、table-patterns（分页 total 联动）本地补充。

## 3. 关键结论与决策（不要重复踩坑）
- **视觉 token 唯一事实源 = 主题包运行时**（`@arco-themes/vue-pangea-3-linear` 的 `theme.css`/`tokens.less`/`theme.less`，即 `rgb(var(--x-n))` 实际解析值）。Figma/设计稿/记忆都不是权威，**冲突以主题包为准**。
- **品牌主色 = 青绿 `#00aaa6`（`--primary-6`）**，不是 Arco 默认蓝；`link` 与 primary 同色。状态色（success=green / danger=red / warning=orange / info=arcoblue）沿用 Arco 标准。
- **Figma 与主题包的 Cyan 色系（及 red-7）不一致** → 已统一以主题包为准（Figma 由 @维护者 手动对齐）。`design-tokens.md` 中已删除该差异说明。
- **图标 = 图标包 `@arco-iconbox/vue-pangea-mobile`**（517 个命名导出组件，无默认 install 插件；继承 `currentColor`、`font-size` 控大小）；经 `@arco-plugins/vite-vue` 的 `iconBox` 替换默认 Arco 图标。**不要**用 `@arco-design/web-vue/es/icon` 或 iconfont.cn。
- **生成层级**：具体页面是**全局 Layout 下的路由子页面**（`src/pages/<PageName>/index.vue` + 注册为 Layout 路由 children）。全局 Layout 是稳定骨架、当前为**占位版**，标准化版本待团队提供——**不要重写/替换全局 Layout**（除非明确要求）。
- **照搬 vs 定制**：组件/模式文档 + architecture/config-provider/i18n 为「照搬」上游，仅上游 API 变化时才动；主题/工程结构相关为「定制」。（例外：form-patterns/table-patterns 末尾带「本地补充」小节，同步上游时保留。）
- **脚手架可运行性三要点（勿破坏）**：① `less` 必需 devDep；② `main.ts` 显式 `import '@arco-themes/vue-pangea-3-linear/theme.css'`（运行时 CSS 变量，只靠插件注入不可靠）；③ `src/vite-env.d.ts` 提供 `*.vue`/`vite/client`/图标包类型声明。改依赖或配置后须重跑 install/build/dev 并更新 lockfile。
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
    │   └── patterns/   (5)   # 照搬
    └── templates/project-starter/          # 可运行脚手架（含主题包/图标包）
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
- [ ] 团队提供**标准化全局 Layout** → 替换脚手架占位版 `GlobalLayout.vue`，同步更新 `project-structure.md` 与 `CHANGELOG.md`。
- [ ] 补充**定制业务组件**文档（建议 `references/components-custom/`）。
- [ ] 补充**页面模板**文档（建议 `references/templates/`，或脚手架内页型样例）。
- [ ] （可选）为 `icon.md` 出一份 Pangea 专属图标使用文档（图标包 + iconBox），不动其他照搬文档。

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
