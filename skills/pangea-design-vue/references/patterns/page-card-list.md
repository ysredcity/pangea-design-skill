---
name: pangea-page-card-list
description: "卡片列表页模板。适用于以卡片形式呈现数据列表的场景（如应用/项目/资源卡片墙）。卡片统一用 Arco a-card 组件，网格自适应换行排列。结构：页标题 + 操作栏（按钮组+搜索/筛选）+ 卡片网格（a-card）+ 分页。当数据更适合卡片而非表格呈现时使用此模板。"
user-invocable: true
meta:
  id: page-card-list
  kind: page-template
  title: 卡片列表页
  status: stable
  whenToUse: [以卡片形式呈现数据列表, 应用/项目/资源卡片墙, 图文混合每条信息较丰富]
  whenNotToUse: [规整多列数据→简单列表页, 需录入/编辑→表单页]
  keyStructure: [页头, 操作栏(按钮组+搜索/筛选), 卡片网格(a-card), 分页, 筛选面板(可选)]
  variants: [基础卡片, 带筛选面板]
  composeWith: [a-card, a-pagination, filter-bar]
  composeBoundary: [卡片统一用 a-card 不自造, 网格用 auto-fill 不写死列数, 页头筛选区用共享组件 FilterBar 不重新实现]
  pitfalls: [卡片操作图标用 icon-hover 文本按钮而非裸 Icon, 筛选面板栅格用 auto-fit 收敛]
  previewRoute: /card-list
  source: src/pages/CardList/index.vue
  tags: [列表, 卡片, 展示]
---

# 卡片列表页模板

适用场景：以**卡片形式**呈现的数据列表（应用墙、项目卡片、资源/设备卡片、内容卡片等），比表格更适合展示图文混合、每条信息较丰富的列表项。

与[简单列表页](page-simple-list.md)的区别：数据呈现载体不同——列表页用表格，本模板用**卡片网格**（Arco `a-card`）。操作栏、搜索、分页等外围结构基本一致。

## 页面结构

```
┌──────────────────────────────────────────────────────────────┐
│ 此处为页面名称           [筛选方案▾] [名称▾ 请输入搜索]  [⌄]  │  ← 标题 + 筛选/搜索 + 展开钮
│ ┌── 筛选面板（点 [⌄] 展开，条件多时用）───────────────┐  │
│ │ Label [请输入]   Label [请输入]   Label [请输入]        │  │
│ │ Label [请输入]   Label [请输入]        [💾] [↺] [查询]  │  │
│ └────────────────────────────────────────────────────────┘  │
│ [创建] [导入] [导出] [打印]                                     │  ← 按钮组
├──────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │  ← 卡片网格（换行）
│ │Card  More│ │Card  More│ │Card  More│ │Card  More│              │
│ │描述文本…  │ │描述文本…  │ │描述文本…  │ │描述文本…  │              │
│ │👤User ♡↗⋯│ │👤User ♡↗⋯│ │👤User ♡↗⋯│ │👤User ♡↗⋯│              │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                          │
│ │  ...     │ │  ...     │ │  ...     │                          │
│ └─────────┘ └─────────┘ └─────────┘                          │
├──────────────────────────────────────────────────────────────┤
│ 共50条                        ‹ 1 2 3 4 5 … 20 › 20条/页 前往  │  ← 分页
└──────────────────────────────────────────────────────────────┘
```

## 设计规范

### page-header 区域（筛选器用共享组件 [FilterBar](../components-shared/filter-bar.md)）
- 内边距 `16px 16px 12px`
- **底部通栏分割线**：页头有一条 1px 下边框 `border-bottom: 1px solid var(--color-border-2)`（贴合设计稿，通栏、不内缩），与下方卡片区分隔
- 标题放进 `FilterBar` 的 `#title` 插槽：`18px semibold`、`color-text-1`
- 筛选方案下拉 + 搜索框（~256px）+ 展开/折叠按钮 + 筛选面板 —— 均由 `FilterBar` 提供，本模板只传数据与插槽内容，**不重新实现这套 UI**
- 操作按钮组**不属于 `FilterBar`**：创建（`type="primary"`）+ 导入/导出/打印（默认按钮），与 `FilterBar` 是 header 内的并列子元素，页面自己渲染

### 筛选面板（可选，条件多时用；由 FilterBar 内部实现）
- 由筛选行右上角的展开/折叠按钮控制显隐；折叠时只显示基础搜索，展开时在筛选行与按钮组之间插入面板
- 面板样式（贴合设计稿）：灰底 `background: var(--color-fill-1)` + 边框 `1px solid var(--color-border-3)` + 圆角 `var(--border-radius-medium)` + 内边距 `16px`，通栏；响应式栅格 `repeat(auto-fit, minmax(220px, 1fr))`
- 右下角动作组：保存筛选方案（`IconSave`）+ 重置（`IconUndo`）+ 查询（`type="primary"`）
- 不需要筛选面板时传 `:show-advanced-panel="false"`（三个筛选方式各有独立开关，默认全开）

### 卡片网格
- 容器：`flex-wrap`，卡片间距 `gap: 16px`；或用 `a-grid` / CSS grid 自适应列数
- **每张卡片用 `<a-card>`**，圆角 `8px`（`var(--border-radius-large)`）、边框 `1px solid var(--color-border-2)`
- 卡片宽度：响应式，一行约 4 个（可按容器宽度自适应，最小宽度约 260–285px）
- **卡片 header**（`#title` + `#extra`）：标题 `16px semibold`；右上角 More 链接用 `<a-link>`（primary 色）
- **卡片 body**：描述文本（`14px`、`color-text-1`）+ footer
- **卡片 footer**：左侧头像（`a-avatar` mini）+ 用户名；右侧操作图标（点赞/分享/更多，用**业务图标**从图标包命名导入）。操作图标要有可点击的 **icon-hover 悬停态**——用 `<a-button type="text" shape="circle" size="small">` 包裹图标（悬停出现浅灰圆形背景），不要用裸 `<Icon>`

### 分页
- 同[简单列表页](page-simple-list.md)：总数左对齐（`margin-right: auto`）+ 翻页器右对齐，`size="small"`，含 `show-jumper` + `show-page-size`

## Vue 代码模板

完整可运行实现见脚手架 `templates/project-starter/src/pages/CardList/index.vue`，预览路由 `/card-list`。页头筛选区**统一用共享组件 [FilterBar](../components-shared/filter-bar.md)**（见 `src/components/FilterBar.vue`），本页只需持有筛选相关的数据/事件并把标题、按钮组传进对应插槽：

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { IconThumbUp, IconShareInternal, IconMore } from '@arco-iconbox/vue-pangea-mobile';
import FilterBar from '@/components/FilterBar.vue';

const pageTitle = '此处为页面名称';

// 筛选相关的数据/方法与 FilterBar 的 props/events 一一对应，详见 filter-bar.md
const filterPlan = ref();
const searchField = ref('name');
const searchKeyword = ref('');
const searchFields = [{ value: 'name', label: '名称' }, { value: 'code', label: '编码' }];
const advancedVisible = ref(false);
const advancedFields = [{ field: 'f1', label: 'Label' } /* ... */];
const advancedForm = reactive<Record<string, string>>({ f1: '' /* ... */ });

function onSearch() { pagination.current = 1; fetchData(); }
function onAdvancedQuery() { pagination.current = 1; fetchData(); }
function onAdvancedReset() { advancedFields.forEach((f) => (advancedForm[f.field] = '')); }
function onAdvancedSave() { /* TODO: 保存为筛选方案 */ }

// 卡片数据 / 分页 / handleCreate 略，见脚手架完整实现
</script>

<template>
  <div class="pg-card-list">
    <div class="pg-card-list__header">
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
        <template #title><h2 class="pg-card-list__title">{{ pageTitle }}</h2></template>
      </FilterBar>

      <!-- 操作按钮组不属于 FilterBar，页面自己渲染 -->
      <a-space :size="8">
        <a-button type="primary" size="small" @click="handleCreate">创建</a-button>
        <a-button size="small">导入</a-button>
        <a-button size="small">导出</a-button>
        <a-button size="small">打印</a-button>
      </a-space>
    </div>

    <!-- 卡片区 + 分页：卡片统一用 a-card，网格自适应换行；见下方要点 -->
    <div class="pg-card-list__body">
      <!-- ... -->
    </div>
  </div>
</template>

<style scoped>
.pg-card-list { display: flex; flex-direction: column; height: 100%; overflow: hidden; background: var(--color-bg-1); }
.pg-card-list__header {
  display: flex; flex-direction: column; gap: 12px;
  padding: 16px 16px 12px; border-bottom: 1px solid var(--color-border-2); flex-shrink: 0;
}
.pg-card-list__title { font-size: 18px; font-weight: 600; color: var(--color-text-1); margin: 0; line-height: 28px; }
/* 卡片网格 / 分页等样式见脚手架完整实现 */
</style>
```

## 使用要点

1. **复制到 `src/pages/<PageName>/index.vue`**，替换 `pageTitle`、卡片数据结构与字段、卡片内部内容。
2. **页头筛选区直接用 `FilterBar`**（`@/components/FilterBar.vue`），不要重新实现筛选方案/搜索/筛选面板这套 UI；标题放 `#title` 插槽。**操作按钮组不属于 `FilterBar`**，与它并列写在同一个 header 容器里。参数与事件对照见 [filter-bar.md](../components-shared/filter-bar.md)。
3. **卡片统一用 `<a-card>`**，不要用裸 div 拼卡片。header 用 `#title` + `#extra` 插槽（extra 放 More 链接/操作），body 放主体内容。
4. **网格自适应**：用 CSS grid `repeat(auto-fill, minmax(260px, 1fr))` 实现响应式换行，一行数量随容器宽度变化；也可用 `<a-grid>` 组件。
5. **卡片内容按业务定制**：图文卡可在 body 顶部加封面图（`a-card` 的 `#cover` 插槽）；纯信息卡如示例（描述 + footer）。
6. **卡片内的操作图标**属于业务/内容图标，从 Pangea 图标包命名导入（如 `IconThumbUp`）；并用 `<a-button type="text" shape="circle" size="small">` 包裹，获得可点击的 icon-hover 悬停背景。
7. **卡片区滚动**：grid-wrap 容器 `flex: 1; overflow-y: auto`，卡片多时内联滚动，分页固定底部。
8. **分页**：与[简单列表页](page-simple-list.md)一致（总数左对齐 + 翻页器右对齐 + small 尺寸）。
9. **圆角用变量**：卡片圆角用 `var(--border-radius-large)`（8px），不硬编码。
10. **mock 数据**：PM demo 用 `setTimeout` 模拟；开发交付时替换为接口。
11. **三个筛选方式按场景取舍**：`FilterBar` 的 `show-filter-plan` / `show-search` / `show-advanced-panel` 默认全开，不需要哪个就显式传 `false`；条件少的场景别硬塞筛选面板。

## 与其他页面模板的区别

| 场景 | 用什么模板 |
|---|---|
| 表格形式的基础列表，单字段搜索 | [简单列表页](page-simple-list.md) |
| 表格形式，但需多字段筛选/筛选方案（页头与本模板同形态） | [基础列表页](page-filter-list.md) |
| **卡片形式呈现的数据列表** | **本模板（卡片列表页）** |
| 弹窗内轻量录入 | [对话框表单](page-modal-form.md) |
| 独立页面表单 | [基础表单页](page-form.md) / [分组表单页](page-grouped-form.md) |
