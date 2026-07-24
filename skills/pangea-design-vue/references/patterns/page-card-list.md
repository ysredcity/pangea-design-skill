---
name: pangea-page-card-list
description: "卡片列表页模板。适用于以卡片形式呈现数据列表的场景（如应用/项目/资源卡片墙）。卡片统一用 Arco a-card 组件，网格自适应换行排列。结构：页标题 + 操作栏（按钮组+搜索/筛选）+ 卡片网格（a-card）+ 分页。当数据更适合卡片而非表格呈现时使用此模板。"
user-invocable: true
---

# 卡片列表页模板

适用场景：以**卡片形式**呈现的数据列表（应用墙、项目卡片、资源/设备卡片、内容卡片等），比表格更适合展示图文混合、每条信息较丰富的列表项。

与[简单列表页](page-simple-list.md)的区别：数据呈现载体不同——列表页用表格，本模板用**卡片网格**（Arco `a-card`）。操作栏、搜索、分页等外围结构基本一致。

## 页面结构

```
┌──────────────────────────────────────────────────────────────┐
│ 此处为页面名称           [筛选方案▾] [名称▾ 请输入搜索]  [⌄]  │  ← 标题 + 筛选/搜索 + 展开钮
│ ┌── 高级筛选面板（点 [⌄] 展开，条件多时用）───────────────┐  │
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

### page-header 区域
- 内边距 `16px 16px 12px`
- **底部通栏分割线**：页头有一条 1px 下边框 `border-bottom: 1px solid var(--color-border-2)`（贴合设计稿，通栏、不内缩），与下方卡片区分隔
- 标题：`18px semibold`、`color-text-1`
- 右侧（筛选行）：筛选方案下拉（可选）+ 搜索输入组（`a-input-group`，宽 ~324px）+ **展开/折叠按钮**（`size="small"` 图标按钮，`IconDown`/`IconUp` 切换）
- 下方按钮组：创建（`type="primary"`）+ 导入/导出/打印（默认按钮），`gap: 8px`

### 高级筛选面板（可选，条件多时用）
- 由筛选行右上角的**展开/折叠按钮**控制显隐（`advancedVisible`）；折叠时只显示基础搜索，展开时在筛选行与按钮组之间插入面板
- 面板样式（贴合设计稿）：灰底 `background: var(--color-fill-1)` + 边框 `1px solid var(--color-border-3)` + 圆角 `var(--border-radius-medium)` + 内边距 `16px`，通栏（与内容区同宽）
- 面板为 **3 列栅格**（`grid-template-columns: repeat(3, 1fr)`，`gap: 12px 24px`），每个字段为 `label + input`（label 右对齐、`color-text-2`）
- 右下角动作组（落在栅格最后一格，右下对齐）：保存筛选方案（`IconSave` 图标按钮）+ 重置（`IconUndo` 图标按钮）+ 查询（`type="primary"`）
- 控件统一 `size="small"`；字段与列数按业务增减（超过 3 个自动换行到下一栅格行）

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

```vue
<script setup lang="ts">
/**
 * 卡片列表页
 * ------------------------------------------------------------------
 * 以卡片形式呈现数据列表。卡片统一用 Arco a-card；网格自适应换行。
 * 复制此模板到 src/pages/<PageName>/index.vue，替换卡片字段与数据。
 */
import { ref, reactive } from 'vue';
import {
  IconThumbUp,
  IconShareInternal,
  IconMore,
  IconUp,
  IconDown,
  IconSave,
  IconUndo,
} from '@arco-iconbox/vue-pangea-mobile';

const pageTitle = '此处为页面名称';

// ====== 搜索 / 筛选 ======
const searchField = ref('name');
const searchKeyword = ref('');
const filterPlan = ref();

// ====== 高级筛选面板（展开/折叠） ======
// 当筛选条件较多时，点右上角按钮展开更多筛选项。字段按业务替换。
const advancedVisible = ref(false);
const advancedFields = [
  { field: 'f1', label: 'Label' },
  { field: 'f2', label: 'Label' },
  { field: 'f3', label: 'Label' },
  { field: 'f4', label: 'Label' },
  { field: 'f5', label: 'Label' },
];
const advancedForm = reactive<Record<string, string>>({
  f1: '', f2: '', f3: '', f4: '', f5: '',
});
function onAdvancedQuery() {
  pagination.current = 1;
  fetchData();
}
function onAdvancedReset() {
  advancedFields.forEach((f) => (advancedForm[f.field] = ''));
}
function onAdvancedSave() {
  // TODO: 保存为筛选方案
}

// ====== 卡片数据（mock） ======
interface CardItem {
  id: string;
  title: string;
  desc: string;
  user: string;
}
const loading = ref(false);
const cards = ref<CardItem[]>([]);

const pagination = reactive({ current: 1, pageSize: 20, total: 0 });

function fetchData() {
  loading.value = true;
  setTimeout(() => {
    cards.value = Array.from({ length: 7 }, (_, i) => ({
      id: String(i + 1),
      title: 'Pangea Card',
      desc: 'Aspiring to become the most reliable brand in the world with more than a century of brand.',
      user: 'Username',
    }));
    pagination.total = 50;
    loading.value = false;
  }, 300);
}
fetchData();

function onPageChange(page: number) {
  pagination.current = page;
  fetchData();
}
function onPageSizeChange(size: number) {
  pagination.pageSize = size;
  pagination.current = 1;
  fetchData();
}
function onSearch() {
  pagination.current = 1;
  fetchData();
}
function handleCreate() {
  // TODO: 打开创建弹窗 or 跳转
}
</script>

<template>
  <div class="pg-card-list">
    <!-- page-header -->
    <div class="pg-card-list__header">
      <div class="pg-card-list__filter">
        <h2 class="pg-card-list__title">{{ pageTitle }}</h2>
        <div class="pg-card-list__filter-right">
          <a-select
            v-model="filterPlan"
            placeholder="筛选方案"
            size="small"
            allow-clear
            :style="{ width: '128px' }"
          />
          <a-input-group style="width: 324px">
            <a-select v-model="searchField" size="small" :style="{ width: '80px' }">
              <a-option value="name" label="名称" />
              <a-option value="code" label="编码" />
            </a-select>
            <a-input
              v-model="searchKeyword"
              size="small"
              placeholder="请输入搜索内容"
              allow-clear
              @press-enter="onSearch"
            />
          </a-input-group>

          <!-- 展开/折叠高级筛选面板 -->
          <a-button
            size="small"
            class="pg-card-list__adv-toggle"
            @click="advancedVisible = !advancedVisible"
          >
            <template #icon>
              <IconUp v-if="advancedVisible" />
              <IconDown v-else />
            </template>
          </a-button>
        </div>
      </div>

      <!-- 高级筛选面板：展开时显示更多筛选条件 -->
      <div v-show="advancedVisible" class="pg-card-list__filter-panel">
        <div
          v-for="f in advancedFields"
          :key="f.field"
          class="pg-card-list__adv-item"
        >
          <span class="pg-card-list__adv-label">{{ f.label }}</span>
          <a-input
            v-model="advancedForm[f.field]"
            size="small"
            placeholder="请输入"
            allow-clear
          />
        </div>
        <div class="pg-card-list__adv-actions">
          <a-button size="small" @click="onAdvancedSave">
            <template #icon><IconSave /></template>
          </a-button>
          <a-button size="small" @click="onAdvancedReset">
            <template #icon><IconUndo /></template>
          </a-button>
          <a-button type="primary" size="small" @click="onAdvancedQuery">查询</a-button>
        </div>
      </div>

      <a-space :size="8">
        <a-button type="primary" size="small" @click="handleCreate">创建</a-button>
        <a-button size="small">导入</a-button>
        <a-button size="small">导出</a-button>
        <a-button size="small">打印</a-button>
      </a-space>
    </div>

    <!-- 卡片区 + 分页 -->
    <div class="pg-card-list__body">
      <a-spin :loading="loading" class="pg-card-list__grid-wrap">
        <div class="pg-card-list__grid">
          <a-card
            v-for="item in cards"
            :key="item.id"
            class="pg-card-list__card"
            :bordered="true"
          >
            <template #title>{{ item.title }}</template>
            <template #extra>
              <a-link>More</a-link>
            </template>

            <p class="pg-card-list__desc">{{ item.desc }}</p>

            <div class="pg-card-list__card-footer">
              <a-space :size="8">
                <a-avatar :size="24">{{ item.user[0] }}</a-avatar>
                <span class="pg-card-list__user">{{ item.user }}</span>
              </a-space>
              <a-space :size="4">
                <a-button type="text" shape="circle" size="small" class="pg-card-list__action-btn">
                  <template #icon><IconThumbUp /></template>
                </a-button>
                <a-button type="text" shape="circle" size="small" class="pg-card-list__action-btn">
                  <template #icon><IconShareInternal /></template>
                </a-button>
                <a-button type="text" shape="circle" size="small" class="pg-card-list__action-btn">
                  <template #icon><IconMore /></template>
                </a-button>
              </a-space>
            </div>
          </a-card>
        </div>
      </a-spin>

      <!-- 分页 -->
      <div class="pg-card-list__pagination">
        <span class="pg-card-list__total">共{{ pagination.total }}条</span>
        <a-pagination
          v-model:current="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          size="small"
          show-jumper
          show-page-size
          @change="onPageChange"
          @page-size-change="onPageSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.pg-card-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.pg-card-list__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* 与设计稿一致：页头底部有一条 1px 分割线（页头下边框，通栏） */
  padding: 16px 16px 12px;
  border-bottom: 1px solid var(--color-border-2);
  flex-shrink: 0;
}

.pg-card-list__filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pg-card-list__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
  margin: 0;
  line-height: 28px;
}

.pg-card-list__filter-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 高级筛选面板：灰底 + 边框，3 列栅格，字段 label + input；右下角保存/重置/查询 */
.pg-card-list__filter-panel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px 24px;
  padding: 16px;
  background: var(--color-fill-1);
  border: 1px solid var(--color-border-3);
  border-radius: var(--border-radius-medium);
}

.pg-card-list__adv-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pg-card-list__adv-label {
  flex-shrink: 0;
  min-width: 40px;
  text-align: right;
  font-size: 14px;
  color: var(--color-text-2);
}

.pg-card-list__adv-item :deep(.arco-input-wrapper) {
  flex: 1;
}

/* 动作组：落在栅格最后一格，右下对齐 */
.pg-card-list__adv-actions {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 8px;
}

.pg-card-list__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  min-height: 0;
  overflow: hidden;
}

.pg-card-list__grid-wrap {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: block;
}

/* 卡片网格：自适应换行，一行约 4 个 */
.pg-card-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.pg-card-list__card {
  border-radius: var(--border-radius-large);
}

.pg-card-list__desc {
  margin: 0 0 10px;
  font-size: 14px;
  line-height: 22px;
  color: var(--color-text-1);
}

.pg-card-list__card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pg-card-list__user {
  font-size: 14px;
  color: var(--color-text-1);
}

/* 卡片底部操作图标：text 圆形按钮，带 icon-hover 悬停背景 */
.pg-card-list__action-btn {
  color: var(--color-text-2);
  font-size: 16px;
}

.pg-card-list__pagination {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.pg-card-list__total {
  font-size: 14px;
  color: var(--color-text-1);
  white-space: nowrap;
  margin-right: auto;
}
</style>
```

## 使用要点

1. **复制到 `src/pages/<PageName>/index.vue`**，替换 `pageTitle`、卡片数据结构与字段、卡片内部内容。
2. **卡片统一用 `<a-card>`**，不要用裸 div 拼卡片。header 用 `#title` + `#extra` 插槽（extra 放 More 链接/操作），body 放主体内容。
3. **网格自适应**：用 CSS grid `repeat(auto-fill, minmax(260px, 1fr))` 实现响应式换行，一行数量随容器宽度变化；也可用 `<a-grid>` 组件。
4. **卡片内容按业务定制**：图文卡可在 body 顶部加封面图（`a-card` 的 `#cover` 插槽）；纯信息卡如示例（描述 + footer）。
5. **卡片内的操作图标**属于业务/内容图标，从 Pangea 图标包命名导入（如 `IconThumbUp`）；并用 `<a-button type="text" shape="circle" size="small">` 包裹，获得可点击的 icon-hover 悬停背景。
6. **卡片区滚动**：grid-wrap 容器 `flex: 1; overflow-y: auto`，卡片多时内联滚动，分页固定底部。
7. **分页**：与[简单列表页](page-simple-list.md)一致（总数左对齐 + 翻页器右对齐 + small 尺寸）。
8. **控件尺寸**：操作栏按钮、搜索控件用 `size="small"`。
9. **圆角用变量**：卡片圆角用 `var(--border-radius-large)`（8px），不硬编码。
10. **mock 数据**：PM demo 用 `setTimeout` 模拟；开发交付时替换为接口。
11. **高级筛选面板**：筛选条件多时用筛选行右上角的展开/折叠按钮（`IconDown`/`IconUp`）控制显隐；面板为 3 列 label+input 栅格，右下角放保存/重置/查询。条件少时可整段删除面板与按钮，只保留基础搜索。

## 与其他页面模板的区别

| 场景 | 用什么模板 |
|---|---|
| 表格形式的基础列表 | [简单列表页](page-simple-list.md) |
| **卡片形式呈现的数据列表** | **本模板（卡片列表页）** |
| 弹窗内轻量录入 | [对话框表单](page-modal-form.md) |
| 独立页面表单 | [基础表单页](page-form.md) / [分组表单页](page-grouped-form.md) |
