# 贡献指南（CONTRIBUTING）

本工程维护 **Pangea 设计体系的 Vue 3 skill**（`skills/pangea-design-vue/`）。Pangea = 开源组件库 `@arco-design/web-vue` + 公司定制主题包 `@arco-themes/vue-pangea-3-linear`。

本 skill 是**给 AI agent 消费的知识库**，目标是让 agent 产出「组件用法正确 + 视觉符合 Pangea 主题」的前端代码。改动前请先读完本指南。

---

## 一、核心原则（改动铁律）

1. **组件 API 照搬开源 Arco，不改。** `references/components/` 与 `references/patterns/` 下的文档是从官方 arco-design-vue skill 逐字复制的。Pangea 只换主题、不改组件 API，因此这些文件应与上游保持一致——除非上游组件库升级带来 API 变化。
2. **视觉 token 以主题包运行时为唯一事实源。** 颜色/字体/间距/圆角/阴影/组件 token 的权威值来自 `@arco-themes/vue-pangea-3-linear` 的产物（`theme.css` / `tokens.less` / `theme.less`），即 `rgb(var(--x-n))` 在应用中实际解析出的值。Figma、设计稿、记忆都不是权威——**冲突时以主题包为准**。
3. **不臆造取值。** 所有 token 数值必须能在主题包源文件中找到出处；拿不准就回到主题包核对，不要近似或猜测。
4. **区分「照搬」与「定制」**：
   - **照搬（verbatim）**：组件文档、模式文档、`architecture.md`、`config-provider.md`、`internationalization.md`（纯开发用法，无主题内容）。
   - **定制（Pangea 专属）**：`SKILL.md`、`references/theme/design-tokens.md`、`references/overview/theming.md`、`references/overview/getting-started.md`、`references/overview/project-structure.md`、`templates/project-starter/`（工程脚手架）。
5. **双受众目的不变**：产物是一个 Vue 工程，同时服务 PM 出高保真 demo（mock 数据）与开发基于 PRD 产出 UI（真实接口）；两者结构/组件/主题一致，仅数据来源不同。改动不得破坏这一双受众定位。
6. **生成层级不可乱**：具体页面是全局 Layout 下的路由子页面；全局 Layout 是稳定骨架（后续团队标准化提供），不得在生成页面时重写/替换。

---

## 二、目录结构与职责

```
pangea-design-skill/
├── CONTRIBUTING.md                # 本文件：治理与贡献规则
├── CHANGELOG.md                   # 变更记录
└── skills/
    └── pangea-design-vue/
        ├── SKILL.md               # 入口：约定 + 主题铁律 + 完整索引（定制）
        ├── references/
        │   ├── theme/
        │   │   └── design-tokens.md   # Pangea 全部设计 token（定制，核心）
        │   ├── overview/
        │   │   ├── project-structure.md # 工程结构 + 生成层级（定制）
        │   │   ├── theming.md          # 主题包接入（定制）
        │   │   ├── getting-started.md  # 安装 + 主题接入（定制）
        │   │   ├── architecture.md     # 照搬
        │   │   ├── config-provider.md  # 照搬
        │   │   └── internationalization.md  # 照搬
        │   ├── components/  (72 篇)    # 组件 API，照搬
        │   └── patterns/    (5 篇)     # 组合模式，照搬
        └── templates/
            └── project-starter/       # 可运行脚手架样例（已内置主题包/图标包）
```

---

## 三、常见改动的操作规范

### A. 更新主题 token（颜色/尺寸/组件样式变化）

触发场景：主题包 `@arco-themes/vue-pangea-3-linear` 发布新版本，或主题设计有调整。

1. 取主题包最新产物（`theme.css` / `tokens.less` / `theme.less`）作为事实源。
2. 更新 `references/theme/design-tokens.md` 中受影响的取值；基础色板/语义色以 `theme.css` 的运行时 RGB 分量（即 `rgb(var(--x-n))` 解析值）为准。
3. 若主色/品牌色调整，同步更新 `SKILL.md` 的「主题取值铁律」和 `theming.md` 中的示例。
4. 在 `CHANGELOG.md` 记录：主题包版本号 + 变更的 token。

### B. 组件库升级（Arco 版本变化）

1. 只有当上游 Arco 组件 **API 有增删改** 时才动 `references/components/`、`references/patterns/`。
2. 优先从官方 arco-design-vue skill 同步对应文件，保持「照搬」属性。
3. 记录升级到的 `@arco-design/web-vue` 版本区间。

### C. 新增定制业务组件 / 页面模板（后续规划）

公司自研的二次封装组件与页型模板将放在（建议）：
- 业务组件：`references/components-custom/`
- 页面模板：`references/templates/`

新增时：
1. 每个组件/模板一个文档，front-matter 含 `name` 与 `description`，`user-invocable: false`。
2. 文档结构对齐现有组件文档：简介 → 基本用法 → API（属性/事件/插槽）→ 常用模式 → 最佳实践。
3. 组件应基于标准 Arco Vue + Pangea token 实现，示例遵循「关键约定」（Vue 3、`<script setup>`、kebab-case、`v-model`、禁用 React API）。
4. 在 `SKILL.md` 索引表中登记新文件，并更新「后续补充」小节。

### D. 修改 SKILL.md 索引

任何新增/移动/删除 `references/` 下的文件，都必须同步更新 `SKILL.md` 的索引表，保证链接可达（见「提交前检查」）。

### E. 工程脚手架与全局 Layout（生成层级）

- **脚手架 `templates/project-starter/` 与 `references/overview/project-structure.md` 必须保持一致**：改依赖版本、主题/图标包接入方式、目录结构或生成层级时，两处同步更新。
- 依赖引用固定为：主题包 `@arco-themes/vue-pangea-3-linear`、图标包 `@arco-iconbox/vue-pangea-mobile`，经 `@arco-plugins/vite-vue` 的 `theme` / `iconBox` 选项接入。
- 脚手架内的 `src/layouts/GlobalLayout.vue` 是**占位版**：团队后续会提供标准化全局 Layout 来替换。替换时同步更新脚手架、`project-structure.md` 与 `CHANGELOG.md`，并保持「页面是 Layout 路由子页面」的层级约定不变。
- 图标包为**命名导出**（无默认 install 插件），文档示例用命名导入；升级图标包时留意图标名增删。

---

## 四、编写规范

- 文档语言：简体中文为主，代码示例保留英文标识符。
- 代码示例遵循 skill 的「关键约定」：Vue 3 + `<script setup lang="ts">`、模板属性 kebab-case、事件 `@event`、`v-model`、`dayjs`；不使用 React 专属 API。
- 颜色一律用 CSS 变量或 Less token，**禁止硬编码 hex**（图表等确需硬编码时，值须与主题包一致，并优先仍用变量）。
- front-matter：参考文档用 `name` + `description` + `user-invocable: false`；`SKILL.md` 用 `name` + `description`（可被触发）。

---

## 五、提交前检查（Checklist）

- [ ] 改动的 token 值能在主题包源文件（`theme.css`/`tokens.less`/`theme.less`）中找到出处。
- [ ] 未擅自修改「照搬」类文档的组件 API（除非上游升级）。
- [ ] 新增/移动/删除文件后，`SKILL.md` 索引已同步、链接可达。
  - 可用：`grep -oE '\]\(references/[^)]+\)' SKILL.md | sed -E 's/\]\(|\)//g' | while read f; do [ -f "skills/pangea-design-vue/$f" ] || echo "MISSING: $f"; done`
- [ ] 示例代码符合「关键约定」，无硬编码颜色、无 React API。
- [ ] 已在 `CHANGELOG.md` 追加条目（含主题包/组件库版本信息）。

---

## 六、版本与事实源速查

| 事项 | 事实源 |
|---|---|
| 视觉 token（颜色/尺寸/圆角/阴影/组件样式） | `@arco-themes/vue-pangea-3-linear`（`theme.css`/`tokens.less`/`theme.less`） |
| 组件 API（属性/事件/插槽） | `@arco-design/web-vue` 官方文档 / arco-design-vue skill |
| 图标 | `@arco-iconbox/vue-pangea-mobile`（命名图标组件） |
| 工程结构 / 生成层级 | `references/overview/project-structure.md` + `templates/project-starter/` |
| 当前基线 | 主题包 `@arco-themes/vue-pangea-3-linear` v1.0.11、图标包 `@arco-iconbox/vue-pangea-mobile` v1.0.24、peer `@arco-design/web-vue ^2.57.0` |

拿不准就回到主题包和 `design-tokens.md`，不要猜。
