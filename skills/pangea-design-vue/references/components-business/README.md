---
name: pangea-business-components
description: "产品专属业务组件总览：Pangea 是企业通用设计系统，部分产品在其之上延展了自己的业务组件/模板。本层按产品隔离存放这些组件，并规定「默认不用、命中产品触发词才用」的使用门槛。"
user-invocable: false
---

# 产品专属业务组件（Business Components）

## 这一层是什么

Pangea 是**面向企业的通用设计系统**。部分产品在 Pangea 之上延展出了**只属于自己**的业务组件或模板——它们通常是把某个业务场景的复杂交互固化成一个组件，比通用组件更重、更具体。

本目录按**产品**隔离存放这些组件：

```
references/components-business/
├── README.md          ← 本文件（这一层是什么 + 使用门槛）
└── <产品 key>/
    ├── README.md      ← 该产品说明 + 触发词 + 组件清单
    └── <组件>.md      ← 组件文档（含 meta frontmatter，供 catalog 收录）
```

组件**源码**统一放在脚手架的 `templates/project-starter/src/components/<产品 key>/`，命名带产品前缀（如 `MscAttachmentUpload.vue`），避免与通用组件混淆。

## ⛔ 使用门槛（硬规则）

> **默认不用。** 只有在**需求明确属于该产品**时才允许使用它的业务组件。

判定方式：**看用户需求里是否命中该产品的触发词**（每个产品的触发词见其 `README.md`）。

- ✅ 命中触发词 → 该场景**优先使用**该产品的业务组件（这是产品内的既定规范，不要再用通用组件另做一套）。
- ❌ 未命中 → **一律用 Pangea 通用组件**（`references/components/` + `references/component-selection/`）。不要因为"这个业务组件功能更全"就拿去给别的产品用——那会把某个产品的业务假设扩散到不相关的系统里。
- 🤔 拿不准（例如需求里只出现一次产品名、或同时提到多个产品）→ **问用户**，不要自行推断。

### 为什么要设这道门

业务组件承载了**特定产品的业务约定**（字段口径、状态语义、操作权限、交互流程）。放到别的产品里会造成：
- 出现该产品用不到的字段与状态，用户看不懂；
- 与该产品自己的规范冲突，后期返工；
- 让"通用设计系统"和"产品定制"的边界糊掉，后续无法维护。

## 现有产品

| 产品 | key | 触发词 | 组件清单 |
|---|---|---|---|
| MSC · 全球营销云中台 | `msc` | MSC / 全球营销云中台 / 营销云中台 / 营销中台 | [msc/README.md](msc/README.md) |

## 新增一个产品的业务组件（维护者）

1. 建目录 `references/components-business/<产品 key>/`，写 `README.md`（产品说明 + **触发词** + 组件清单）。
2. 写组件文档 `<组件>.md`，frontmatter 的 `meta` 块必须带：
   - `kind: business-component`
   - `product: <产品 key>`、`productName`、`triggers: [触发词...]`
   - 其余字段沿用[元数据规范](../overview/metadata-schema.md)（`whenToUse` / `whenNotToUse` / `composeBoundary` / `pitfalls` / `source` 等）
3. 组件源码放 `templates/project-starter/src/components/<产品 key>/`，文件名带产品前缀。
4. 重跑 `node scripts/build-catalog.mjs`（catalog 会把它收进 `businessComponents`）。
5. 在本文件「现有产品」表里加一行；在 `SKILL.md`「产品专属业务组件」章节的表里加一行。
