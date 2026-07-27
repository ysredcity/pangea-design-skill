---
name: pangea-metadata-schema
description: "页面模板 / 组件选型元数据的 frontmatter schema 定义。规定 patterns/page-*.md 与 component-selection/*.md 顶部 frontmatter 中 meta 字段的结构（适用任务、变体、组合边界等），以及由此生成机读索引 catalog.json 的约定。供 AI 选型与官网目录消费。"
user-invocable: false
---

# 元数据 Schema（页面模板 / 组件选型）

> **目的**：为每个页面模板与常用组件标注「适用任务 / 变体 / 组合边界」，让 **AI 选型（决策树）** 和 **官网目录** 使用同一份结构化依据。
> **单一事实源**：元数据写在各文档**顶部 frontmatter 的 `meta` 字段**（与文档同生）；生成器汇总成机读的 `references/_generated/catalog.json`。

## 为什么放在 `meta` 命名空间下

patterns 文档 frontmatter 已有 skill 自身使用的键（`name`、`description`、`user-invocable`）。机读元数据统一放在 **`meta:` 对象**下，与这些键隔离，避免混淆 skill 加载语义。

---

## 字段规范

| 字段 | 类型 | 必填 | 适用 kind | 说明 |
|---|---|---|---|---|
| `id` | string | 是 | 全部 | 全局唯一，kebab-case（如 `page-card-list`、`table`） |
| `kind` | `page-template` \| `component` | 是 | 全部 | 元数据类别 |
| `title` | string | 是 | 全部 | 中文名（如「卡片列表页」） |
| `status` | `stable` \| `draft` | 否 | 全部 | 默认 `stable` |
| `whenToUse` | string[] | 是 | 全部 | 适用任务 / 场景（正向） |
| `whenNotToUse` | string[] | 荐 | 全部 | 不适用场景 + 更合适的替代（如「规整多列数据→简单列表页」） |
| `keyStructure` | string[] | 荐 | page-template | 关键结构区块（页头/操作栏/表格/分页…） |
| `variants` | string[] | 否 | 全部 | 可选变体（如「基础卡片 / 带高级筛选」） |
| `composeWith` | string[] | 否 | 全部 | 常配合使用的组件（`a-card`、`a-pagination`…） |
| `composeBoundary` | string[] | 荐 | 全部 | 组合 / 嵌套边界与禁忌（如「卡片统一 a-card 不自造」） |
| `controls` | object | 否 | 全部 | 控件规格约定（如 `{ size: small }`） |
| `pitfalls` | string[] | 荐 | 全部 | 常见错误 / 反例 |
| `previewRoute` | string | 否 | 全部 | 脚手架/官网可预览的路由（如 `/card-list`），组件可留空 |
| `source` | string | 否 | 全部 | 对应脚手架示例文件（如 `src/pages/CardList/index.vue`） |
| `tags` | string[] | 否 | 全部 | 检索/过滤标签（官网筛选用） |

字段命名用 camelCase；数组元素为简短中文短语，能被人和 AI 直接读。

---

## 示例 A：页面模板（page-template）

`references/patterns/page-card-list.md` 顶部：

```yaml
---
name: pangea-page-card-list
description: "卡片列表页模板。……"
user-invocable: true
meta:
  id: page-card-list
  kind: page-template
  title: 卡片列表页
  status: stable
  whenToUse: [以卡片形式呈现数据列表, 应用/项目/资源卡片墙, 图文混合每条信息较丰富]
  whenNotToUse: [规整多列数据→简单列表页, 需录入/编辑→表单页]
  keyStructure: [页头, 操作栏(按钮组+搜索/筛选), 卡片网格(a-card), 分页, 高级筛选面板(可选)]
  variants: [基础卡片, 带高级筛选面板]
  composeWith: [a-card, a-pagination, a-input-group, a-tabs]
  composeBoundary: [卡片统一用 a-card 不自造, 网格用 auto-fill 不写死列数]
  controls: { size: small }
  pitfalls: [卡片操作图标用 icon-hover 文本按钮而非裸 Icon, 高级筛选面板栅格用 auto-fit 收敛]
  previewRoute: /card-list
  source: src/pages/CardList/index.vue
  tags: [列表, 卡片, 展示]
---
```

## 示例 B：组件选型（component）

`references/component-selection/table.md` 顶部：

```yaml
---
name: pangea-select-table
description: "a-table 选型元数据……"
user-invocable: false
meta:
  id: table
  kind: component
  title: 表格 Table
  whenToUse: [规整多列结构化数据, 需要行选择/排序/分页]
  whenNotToUse: [图文混合每条信息丰富→卡片, 少量键值展示→描述列表]
  variants: [基础表格, 行选择, 可编辑子表格, 撑满高度]
  composeWith: [a-pagination, a-badge, a-input-group]
  composeBoundary: [分页独立于表格、total 与真实数据联动, 状态列用 a-badge 不只靠颜色]
  controls: { size: small }
  pitfalls: [插槽 record 为 any 用 helper 查表避免 TS7053]
  tags: [数据展示, 列表]
---
```

> 组件的**完整 API**仍以照搬的 `references/components/**` 为准；本层只补「选型/组合」知识，不重复 API。

---

## 生成产物：`references/_generated/catalog.json`

- **生成器**：`scripts/build-catalog.mjs`（已实现，零依赖）——扫描 `references/patterns/*.md` 与 `references/component-selection/*.md` 的 frontmatter `meta`，按 `kind` 归组输出。运行：在 `skills/pangea-design-vue/` 下 `node scripts/build-catalog.mjs`。
- **消费方**：① AI「页面生成决策树」快速选型；② 官网组件/模板目录（通过同步脚本快照到 website，见 `docs/plan-gates-metadata-website.md`）。
- **形态**（约定）：

```json
{
  "generatedAt": "2026-07-23T00:00:00Z",
  "pageTemplates": [
    {
      "id": "page-card-list",
      "kind": "page-template",
      "title": "卡片列表页",
      "whenToUse": ["以卡片形式呈现数据列表", "..."],
      "previewRoute": "/card-list",
      "doc": "references/patterns/page-card-list.md"
    }
  ],
  "components": [
    {
      "id": "table",
      "kind": "component",
      "title": "表格 Table",
      "whenToUse": ["规整多列结构化数据", "..."],
      "doc": "references/component-selection/table.md"
    }
  ]
}
```

- 每条自动补 `doc` 字段（来源文档相对路径）。`_generated/` 为生成目录，**勿手改**；改元数据请改各文档 frontmatter 后重跑生成器。

---

## 维护约定

- 新增/修改页面模板或组件选型 → 改对应文档的 `meta` → 重跑 `build-catalog.mjs`。
- schema 变更（增删字段）→ 更新本文件 + 生成器 + 已回填文档，保持一致。
- 字段务必精炼、可复述；`whenToUse`/`whenNotToUse`/`composeBoundary`/`pitfalls` 是选型质量的关键，优先写清。
