---
name: pangea-shared-components
description: "通用共享组件总览：从多个页面模板中提炼出的可复用 UI 片段（非 Arco 原生组件，也非某产品的业务组件）。当前收录 FilterBar 复合筛选器。"
user-invocable: false
---

# 通用共享组件（Shared Components）

## 这一层是什么

有些 UI 片段**不是** Arco 原生组件（`references/components/`），也**不属于**某个产品的业务组件（`references/components-business/`），而是本 skill 自己在多个页面模板里反复出现、抽出来统一维护的**复合组件**。

典型例子：卡片列表页与基础列表页共用的「筛选方案 + 简单搜索 + 可展开高级筛选面板 + 操作按钮组」这套页头——原先两个页面模板各写一份几乎相同的实现，容易在迭代中逐渐漂移（字段、样式、交互不再一致）。抽成组件后两个模板改为**引用同一份源码**。

本目录按组件分文件存放说明文档：

```
references/components-shared/
├── README.md          ← 本文件
└── filter-bar.md       ← FilterBar 组件文档
```

组件**源码**统一放在脚手架 `templates/project-starter/src/components/`（与产品专属业务组件的 `src/components/<产品 key>/` 区分：本层组件不带产品前缀、不带子目录）。

## 与其他两层的边界

| 层 | 目录 | 什么放这里 |
|---|---|---|
| Arco 原生组件 | `references/components/` | 上游镜像，不改；API 参考 |
| **通用共享组件（本层）** | `references/components-shared/` | 本 skill 提炼的可复用 UI 片段，任何产品都能用，不含产品业务假设 |
| 产品专属业务组件 | `references/components-business/` | 承载特定产品业务约定，默认不用，命中触发词才用 |

判断新组件该放哪层：**带有具体产品的字段口径/状态语义/业务规则** → 业务组件；**只是多个页面模板共用的纯 UI 结构**（不含任何产品假设） → 本层。

## 现有组件

| 组件 | 说明 | 被谁使用 |
|---|---|---|
| [FilterBar](filter-bar.md) `FilterBar.vue` | 复合筛选器：筛选方案 + 简单搜索 + 可展开高级筛选面板 + 操作按钮组；标题区域为插槽 | [卡片列表页](../patterns/page-card-list.md)、[基础列表页](../patterns/page-filter-list.md) |

## 新增一个共享组件（维护者）

1. 确认它**不含产品业务假设**、且被 **2 个以上**页面模板/场景使用（只有 1 处用不必抽，抽了反而多一层间接）。
2. 组件源码放 `templates/project-starter/src/components/<Name>.vue`。
3. 写文档 `references/components-shared/<name>.md`，frontmatter 的 `meta` 块带：
   - `kind: shared-component`
   - 其余字段沿用[元数据规范](../overview/metadata-schema.md)（`whenToUse` / `whenNotToUse` / `composeBoundary` / `pitfalls` / `source` 等）
4. 重跑 `node scripts/build-catalog.mjs`（catalog 会把它收进 `sharedComponents`）。
5. 在本文件「现有组件」表里加一行；在改用该组件的页面模板文档里把原本重复的代码换成引用说明。
6. 若官网需要展示，`website/scripts/sync-from-skill.mjs` 同步组件源码。
