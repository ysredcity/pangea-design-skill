---
name: pangea-shared-filter-bar
description: "通用共享组件 FilterBar：复合筛选器，封装筛选方案下拉 + 搜索框 + 可展开的筛选面板三种筛选方式，各有独立开关（showFilterPlan / showSearch / showAdvancedPanel）默认全开、按场景启停。标题区域为插槽，可放纯文字或 radio-button 等元素。不含操作按钮组（创建/导入/导出等），由页面自己在旁边渲染。用于卡片列表页与基础列表页共用的页头形态，避免两个模板各写一份逐渐漂移。"
user-invocable: true
meta:
  id: filter-bar
  kind: shared-component
  title: 复合筛选器 FilterBar
  status: stable
  whenToUse: [任何列表类页面模板的搜索/筛选区都应引用本组件, 只需筛选方案/搜索框/筛选面板中的任意组合, 标题位置需要放置动态内容而非纯文字]
  whenNotToUse: [页头结构与本组件差异较大→不要硬套]
  keyStructure: [标题slot, 筛选方案下拉(开关), 搜索框(开关，内含可选字段下拉), 筛选面板展开按钮+面板(开关)]
  variants: [三个开关全开(基础列表页), 只留搜索框, 标题为纯文本, 标题为radio-button切换视图]
  composeWith: [a-select, a-input-group, a-button, a-radio-group]
  composeBoundary: [组件只管筛选行与面板本身, 外层header的padding/分割线由页面容器决定, 筛选面板表单值的存取逻辑由页面实现]
  pitfalls: [显隐只能走三个开关不能靠options/fields长度自动判断否则异步数据未到位时会误判, 三个开关默认全开不需要的要显式传false, 筛选面板查询后要记得复位分页, 不推荐关掉搜索框只留筛选面板因为面板默认折叠会导致进页面看不到任何筛选条件]
  source: src/components/FilterBar.vue
  tags: [列表, 筛选, 共享组件]
---

# 复合筛选器 `FilterBar`

封装「筛选方案 + 搜索框 + 可展开的筛选面板」这套页头形态（**不含操作按钮组**）。所有列表类页面模板的搜索/筛选区**统一引用本组件**，不允许各自重新实现——目前 [简单列表页](../patterns/page-simple-list.md)、[卡片列表页](../patterns/page-card-list.md)、[基础列表页](../patterns/page-filter-list.md)、[左树右表列表页](../patterns/page-tree-table.md) 均已改用，按各自场景只开启需要的筛选方式（见下方开关表）。

## 为什么标题区域是插槽

页面标题经常需要**与筛选器同行出现**，且标题位置不一定是纯文字——有的页面会在这个位置放 `a-tabs` 切换视图、或其它动态元素。因此 FilterBar 把左上角标题区域做成 `#title` 插槽，由页面决定放什么，组件本身不关心。

## 组件结构

```
┌──────────────────────────────────────────────────────────────┐
│ #title（标题/radio-button/…）  [筛选方案▾] [名称▾ 搜索]  [⌄]  │  ← 筛选行
│                                    ①          ②         ③   │
│ ┌── ③ 筛选面板 ────────────────────────────────────────────┐ │
│ │ Label [请输入]   Label [请输入]   Label [请输入]         │ │
│ │ Label [请输入]   Label [请输入]        [💾] [↺] [查询]   │ │
│ └───────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘

① showFilterPlan  ② showSearch  ③ showAdvancedPanel —— 三个开关默认全开，按场景关闭
（操作按钮组不属于本组件，与 FilterBar 是并列关系，由页面自己在旁边渲染）
```

组件**只负责**筛选行与高级筛选面板这一块内容；**不包含操作按钮组**（创建/导入/导出/打印等）——按钮组是页面自己的内容，与筛选器是并列关系，不属于本组件职责。外层 `header` 容器的内边距、底部分割线等仍由页面自己决定（不同页面的页头留白可能不同，不适合在组件里写死）。

## API

### 三个筛选方式的开关

三种筛选方式**各有独立开关，默认全部开启**，按场景自由组合启停。不存在"某种固定的简化形态"——都是这三个开关的组合。

| 开关 | 控制的筛选方式 | 类型 | 默认值 |
|---|---|---|:---:|
| `show-filter-plan` | 筛选方案下拉 | `boolean` | `true` |
| `show-search` | 搜索框 | `boolean` | `true` |
| `show-advanced-panel` | 可展开的筛选面板（含筛选行右侧的展开/折叠按钮） | `boolean` | `true` |

> ⚠️ 显隐**必须走这三个开关**，不能靠对应的 `options`/`fields` 是否为空来自动判断——候选项常是运行时异步拉取的，数据还没到位时会被误判成"这个场景不需要该控件"。

常见组合示例：

| 场景 | 传参 |
|---|---|
| 基础列表页（最完整） | 三个都不传，默认全开 |
| 条件很少、无需保存方案 | `:show-filter-plan="false" :show-advanced-panel="false"` |

> ⚠️ **不推荐关掉搜索框只留筛选面板**（`:show-search="false"`，仅留筛选方案+筛选面板）：筛选面板默认折叠，用户进页面看不到任何筛选条件，还要先点展开才能操作，体验比"至少留一个搜索框"差。多字段场景请保留搜索框做最常用字段的快查，筛选面板承载其余条件。

### 其余 Props（`v-model` 风格，受控）

| 参数 | 说明 | 类型 | 默认值 |
|---|---|---|:---:|
| `filter-plan` **(v-model)** | 筛选方案当前值 | `string \| number` | `-` |
| `filter-plan-options` | 筛选方案候选项 | `{ value, label }[]` | `[]` |
| `filter-plan-placeholder` | 筛选方案 placeholder | `string` | `'筛选方案'` |
| `show-search-field` | 搜索框是否带前置字段下拉（搜索框内部的细分选项，非上面三大开关）；传 `false` 则为单纯关键词搜索 | `boolean` | `true` |
| `search-field` **(v-model)** | 当前搜索字段 | `string \| number` | `-` |
| `search-fields` | 搜索字段候选项 | `{ value, label }[]` | `[]` |
| `search-keyword` **(v-model)** | 搜索关键词 | `string` | `''` |
| `search-placeholder` | 搜索框 placeholder | `string` | `'请输入搜索内容'` |
| `advanced-fields` | 筛选面板字段定义 | `{ field, label }[]` | `[]` |
| `advanced-form` **(v-model)** | 筛选面板表单值，key 对应 `advanced-fields[].field` | `Record<string, string>` | `{}` |
| `advanced-visible` **(v-model)** | 筛选面板展开/折叠状态 | `boolean` | `false` |

### Slots

| 插槽 | 说明 |
|---|---|
| `#title` | 标题区域（筛选行左侧）。可放 `<h2>` 纯文字，也可放 `a-radio-group type="button"`（切换视图）、状态标签等动态元素。**切换视图用 radio-button 不要用 `a-tabs`**，见 [design.md 2.5](../design.md#25-行内视图切换用-radio-button且一律居左) |

> 组件**不提供**操作按钮组插槽——创建/导入/导出/打印等按钮组是页面自己的内容，与筛选器是并列关系，直接在页面 `header` 里、`<FilterBar>` 旁边渲染即可（见下方用法）。

### Events

| 事件 | 触发时机 |
|---|---|
| `search` | 搜索输入框按下 Enter |
| `advanced-query` | 高级筛选面板点击「查询」 |
| `advanced-reset` | 高级筛选面板点击「重置」 |
| `advanced-save` | 高级筛选面板点击「保存」（保存为筛选方案） |

## 用法

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue';
import FilterBar from '@/components/FilterBar.vue';

const filterPlan = ref();
const searchField = ref('name');
const searchKeyword = ref('');
const searchFields = [
  { value: 'name', label: '名称' },
  { value: 'code', label: '编码' },
];

const advancedVisible = ref(false);
const advancedFields = [
  { field: 'f1', label: 'Label' },
  { field: 'f2', label: 'Label' },
];
const advancedForm = reactive<Record<string, string>>({ f1: '', f2: '' });

function onSearch() {
  pagination.current = 1;
  fetchData();
}
function onAdvancedQuery() {
  // 高级筛选查询后必须复位分页，否则可能停在筛选前的页码上看到空列表
  pagination.current = 1;
  fetchData();
}
function onAdvancedReset() {
  advancedFields.forEach((f) => (advancedForm[f.field] = ''));
}
function onAdvancedSave() {
  // TODO: 保存为筛选方案
}
</script>

<template>
  <!-- header 容器：FilterBar 与操作按钮组是页面 header 内的两个并列子元素 -->
  <div class="pg-xxx__header">
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
      <template #title>
        <h2 class="pg-xxx__title">此处为页面名称</h2>
      </template>
    </FilterBar>

    <!-- 操作按钮组不属于 FilterBar，页面自己渲染 -->
    <a-space :size="8">
      <a-button type="primary" size="small">创建</a-button>
      <a-button size="small">导入</a-button>
    </a-space>
  </div>
</template>
```

## 使用要点

1. **标题样式仍由页面自己写**（组件只提供插槽位置，不管字号/字重）：`18px semibold`、`color-text-1`，见各页面模板的 `__title` 样式。
2. **操作按钮组不属于本组件**：创建/导入/导出/打印等按钮组与筛选器是并列关系，在页面 `header` 容器里、`<FilterBar>` 组件旁边直接写，不要往组件里塞插槽。
3. **三个筛选方式按场景取舍**：`show-filter-plan` / `show-search` / `show-advanced-panel` 默认全开，不需要哪个就显式传 `false`。条件少的场景不要硬塞筛选面板；**不推荐关掉搜索框只留筛选面板**——面板默认折叠，会导致用户进页面看不到任何筛选条件。
4. **显隐只走开关，不靠数据长度判断**：候选项常是运行时异步拉取的，用 `options.length > 0` 判断会在数据到位前把控件误判成"不需要"。
5. **筛选面板查询后复位分页**：`onAdvancedQuery`/`onSearch` 都要把 `pagination.current` 设回 1（同[简单列表页](../patterns/page-simple-list.md)约定）。
6. **筛选方案与筛选面板表单的联动**（切换方案回填表单、保存当前表单为新方案）不在组件职责内，由页面自己实现。
7. 控件密度：组件内所有控件固定 `size="small"`，与[控件密度约定](../design.md#22-控件密度)一致，页面无需也不应覆盖。
8. 组件源码见 `templates/project-starter/src/components/FilterBar.vue`；改动它会同时影响卡片列表页与基础列表页的示例效果。
