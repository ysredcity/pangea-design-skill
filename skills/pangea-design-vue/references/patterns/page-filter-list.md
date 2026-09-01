---
name: pangea-page-filter-list
description: "基础列表页模板。适用于筛选能力较强的表格列表场景：筛选方案 + 简单搜索 + 可展开的筛选面板，支持多字段同时查询。结构：页头（标题 + 筛选方案 + 搜索 + 展开钮 + 筛选面板 + 按钮组）+ 表格（带行选择）+ 分页。与简单列表页的区别只在筛选复杂度：简单列表页每次只能单字段查询，本模板支持多字段同时查询与筛选方案保存。"
user-invocable: true
meta:
  id: page-filter-list
  kind: page-template
  title: 基础列表页
  status: stable
  whenToUse: [表格列表且筛选条件较多, 需要多字段同时查询, 需要保存/复用筛选方案, 基础 CRUD 列表但单字段搜索不够用]
  whenNotToUse: [只需单关键词或单字段筛选→简单列表页, 图文卡片呈现→卡片列表页, 主子表结构→左树右表列表页]
  keyStructure: [页头(标题+筛选方案+搜索+展开钮), 筛选面板(可选展开/多字段栅格), 按钮组, 表格(行选择+撑满高度), 分页]
  variants: [筛选面板收起, 筛选面板展开(多字段查询)]
  composeWith: [a-table, a-pagination, a-badge, filter-bar]
  composeBoundary: [页头筛选区用共享组件 FilterBar 不重新实现, 表格/分页沿用简单列表页的形态, 控件统一 size=small, 状态列用 a-badge 不只靠颜色]
  pitfalls: [条件很少时不要硬套筛选面板改用简单列表页, 筛选面板查询后忘记复位分页到第1页, 筛选方案与筛选面板表单值不同步]
  previewRoute: /filter-list
  source: src/pages/FilterList/index.vue
  tags: [列表, 表格, 筛选]
---

# 基础列表页模板

适用场景：表格列表页，但**筛选能力比简单列表页更强** —— 需要多字段同时查询、或需要保存/复用筛选方案。

**与[简单列表页](page-simple-list.md)的区别只在筛选复杂度，不在数据呈现**：两者都用表格展示数据；简单列表页每次只能**单字段**查询（一个下拉选字段 + 一个输入框），本模板的筛选面板支持**多字段同时**查询，并带筛选方案下拉。

**与[卡片列表页](page-card-list.md)的关系**：本模板的页头区域（筛选方案 + 搜索 + 展开钮 + 筛选面板 + 按钮组）与卡片列表页**共用同一个共享组件 [FilterBar](../components-shared/filter-bar.md)**，唯一区别是下方列表载体——卡片列表页用卡片网格，本模板用表格（同[简单列表页](page-simple-list.md)的表格 + 分页形态）。三者关系：

```
                 页头（筛选方案 + 搜索 + 展开钮 + 筛选面板 + 按钮组）
                            ┌──────────────┴──────────────┐
                       表格载体                         卡片载体
                  ┌────────┴────────┐                        │
            单字段搜索           多字段筛选              [卡片列表页]
          [简单列表页]         [基础列表页]（本模板）
```

## 判断要点

| 条件 | 用哪个模板 |
|---|---|
| 只需要一个关键词搜索，或"字段下拉 + 输入框"选一个字段查 | [简单列表页](page-simple-list.md) |
| 需要**同时**按多个字段查询（如"名称 + 状态 + 创建时间"一起过滤） | **本模板** |
| 需要**保存/切换筛选方案**（下次进来直接套用一组条件） | **本模板** |
| 数据更适合卡片呈现而非表格 | [卡片列表页](page-card-list.md) |

条件很少（1–2 个）时不要硬套筛选面板——那是给多字段场景用的，条件少时改用简单列表页更轻。

## 页面结构

```
┌──────────────────────────────────────────────────────────────┐
│ 此处为页面名称           [筛选方案▾] [名称▾ 请输入搜索]  [⌄]  │  ← 标题 + 筛选/搜索 + 展开钮
│ ┌── 筛选面板（点 [⌄] 展开，多字段同时查询）───────────┐  │
│ │ Label [请输入]   Label [请输入]   Label [请输入]        │  │
│ │ Label [请输入]   Label [请输入]        [💾] [↺] [查询]  │  │
│ └────────────────────────────────────────────────────────┘  │
│ [创建] [导入] [导出] [打印]                                     │  ← 按钮组
├──────────────────────────────────────────────────────────────┤
│ ☐ │ Title    │ Title    │ Title    │ Title   │ 操作  [⚙]      │  ← 表格（同简单列表页）
│ ☐ │ Pangea   │ Pangea   │ Pangea   │ 👤 Pangea│ 查看 编辑       │
│ ☐ │ ...      │ ...      │ ...      │ ...     │ ...             │
├──────────────────────────────────────────────────────────────┤
│ 共50条                        ‹ 1 2 3 4 5 … 20 › 20条/页 前往  │  ← 分页
└──────────────────────────────────────────────────────────────┘
```

## 设计规范

### page-header 区域（用共享组件 [FilterBar](../components-shared/filter-bar.md)，不要另造一套）
- 内边距 `16px 16px 12px`；**底部通栏分割线** `border-bottom: 1px solid var(--color-border-2)`
- 标题放进 `FilterBar` 的 `#title` 插槽：`18px semibold`、`color-text-1`
- 筛选方案下拉 + 搜索框 + 展开/折叠按钮 + 筛选面板均由 `FilterBar` 提供（三者各有独立开关，默认全开）
- 操作按钮组**不属于 `FilterBar`**：创建（`type="primary"`）+ 导入/导出/打印（默认按钮），与 `FilterBar` 是 header 内的并列子元素，页面自己渲染

### 筛选面板（本模板的核心区别，由 FilterBar 内部实现）
- 由展开/折叠按钮控制显隐；折叠时只显示基础搜索，展开时在筛选行与按钮组之间插入面板
- 面板样式：灰底 `var(--color-fill-1)` + 边框 `1px solid var(--color-border-3)` + 圆角 `var(--border-radius-medium)` + 内边距 `16px`，通栏；响应式栅格 `repeat(auto-fit, minmax(220px, 1fr))`
- 右下角动作组：保存筛选方案（`IconSave`）+ 重置（`IconUndo`）+ 查询（`type="primary"`）
- 控件统一 `size="small"`；字段数通过 `FilterBar` 的 `advanced-fields` 按业务增减，整个面板的启停由 `show-advanced-panel` 控制

### 表格区域（沿用[简单列表页](page-simple-list.md)，不要另造一套）
- 表格高度撑满父容器（`flex: 1; min-height: 0`），`:scroll="{ y: '100%' }"` 内部滚动
- `size="medium"`（见 [design.md 2.2](../design.md#22-控件密度)）、`:bordered="{ wrapper: true }"`、行选择 checkbox
- 状态列用 `<a-badge :status :text>`（[不只靠颜色](../design.md#23-状态不只靠颜色传达)）；操作列用 `<a-link>`

### 分页
- 同简单列表页：总数左对齐（`margin-right: auto`）+ 翻页器右对齐，`size="small"`，含 `show-jumper` + `show-page-size`

## Vue 代码模板

完整可运行实现见脚手架 `templates/project-starter/src/pages/FilterList/index.vue`，预览路由 `/filter-list`。结构上就是「共享组件 [FilterBar](../components-shared/filter-bar.md)」+「[简单列表页](page-simple-list.md)的表格/分页」拼接，字段与列按业务替换即可，此处不重复贴全量代码。

关键点：

```vue
<template>
  <div class="pg-filter-list__header">
    <FilterBar
      v-model:filter-plan="filterPlan"
      v-model:search-field="searchField"
      v-model:search-keyword="searchKeyword"
      v-model:advanced-form="advancedForm"
      v-model:advanced-visible="advancedVisible"
      :search-fields="searchFields"
      :advanced-fields="advancedFields"
      @search="onSearch"
      @advanced-query="onAdvancedQuery"
      @advanced-reset="onAdvancedReset"
      @advanced-save="onAdvancedSave"
    >
      <template #title><h2 class="pg-filter-list__title">{{ pageTitle }}</h2></template>
    </FilterBar>

    <!-- 操作按钮组不属于 FilterBar，页面自己渲染 -->
    <a-space :size="8">
      <a-button type="primary" size="small" @click="handleCreate">创建</a-button>
      <a-button size="small">导入</a-button>
      <a-button size="small">导出</a-button>
      <a-button size="small">打印</a-button>
    </a-space>
  </div>
</template>
```

```ts
// 筛选面板查询后必须复位分页，否则可能停在筛选前的页码上看到空列表
function onAdvancedQuery() {
  pagination.current = 1;
  fetchData();
}
```

## 使用要点

1. **复制到 `src/pages/<PageName>/index.vue`**，替换 `pageTitle`、`columns`、`advancedFields`、`statusMap` 和数据加载逻辑。
2. **页头筛选区直接用 `FilterBar`**（`@/components/FilterBar.vue`），不要重新实现；标题放 `#title` 插槽。**操作按钮组不属于 `FilterBar`**，与它并列写在同一个 header 容器里。参数与事件对照见 [filter-bar.md](../components-shared/filter-bar.md)。**表格/分页直接照抄简单列表页**——已是稳定实现，不要重新设计。
3. **筛选方案与筛选面板表单的关系**：切换筛选方案下拉时，应把对应的保存值回填进 `advancedForm` 各字段；反之点"保存"时把当前 `advancedForm` 存为一个新方案。本模板骨架未实现具体存取逻辑（TODO 标注），接入时按业务补。
4. **控件尺寸**：`FilterBar` 内部控件已固定 `size="small"`；表格自身 `size="medium"`（见 [design.md 2.2](../design.md#22-控件密度)）。
5. **筛选面板查询后复位分页**：与简单搜索一致，`onAdvancedQuery`/`onSearch` 都要把 `pagination.current` 设回 1。
6. **mock 数据**：PM demo 用 `setTimeout` 模拟；开发交付时替换为接口。

## 与其他页面模板的区别

| 场景 | 用什么模板 |
|---|---|
| 单字段/单关键词搜索的表格列表 | [简单列表页](page-simple-list.md) |
| **多字段同时筛选 / 需要筛选方案的表格列表** | **本模板（基础列表页）** |
| 数据以卡片形式呈现 | [卡片列表页](page-card-list.md) |
| 主子表结构 | [左树右表列表页](page-tree-table.md) |
| 弹窗内轻量录入 | [对话框表单](page-modal-form.md) |
