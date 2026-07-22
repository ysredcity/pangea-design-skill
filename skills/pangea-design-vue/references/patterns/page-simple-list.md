---
name: pangea-page-simple-list
description: "简单列表页模板。适用于基础的表格列表场景，无复杂查询条件。结构：页标题 + 操作栏（按钮组 + 简单搜索） + 表格（带行选择） + 分页。当页面是基础 CRUD 列表、没有多条件筛选需求时使用此模板。"
user-invocable: true
---

# 简单列表页模板

适用场景：基础的表格列表页，**没有复杂查询条件**（只需要一个关键词搜索或单字段筛选）。

## 页面结构

```
┌─────────────────────────────────────────────────────────┐
│ 页标题（18px semibold）                                   │
├─────────────────────────────────────────────────────────┤
│ [创建] [导入] [导出] [打印]          [名称 ▾] [搜索输入框] │
├─────────────────────────────────────────────────────────┤
│ ☐ │ Title    │ Title    │ Title    │ Title   │ 操作  [⚙]│
│ ☐ │ Pangea   │ Pangea   │ Pangea   │ 👤 Pangea│ 查看 查看│
│ ☐ │ ...      │ ...      │ ...      │ ...     │ ...     │
│   │          │          │          │         │         │
├─────────────────────────────────────────────────────────┤
│ 共50条                    ‹ 1 2 3 4 5 … 20 › 20条/页 前往│
└─────────────────────────────────────────────────────────┘
```

## 设计规范

### page-header 区域
- 内边距：`16px`
- 页标题：`18px`、`font-weight: 600`、`color: var(--color-text-1)`

### 操作栏（filter）
- 与标题间距：`12px`（gap）
- 左侧按钮组：第一个为 `type="primary"`（主操作），其余为默认按钮，`gap: 8px`，**所有按钮 `size="small"`**
- 右侧搜索：`<a-input-group>` 前缀为 `<a-select size="small">`（字段选择）+ `<a-input size="small">` placeholder "请输入搜索内容"，总宽约 `324px`
- 操作栏内部使用 `justify-content: space-between`

### 表格区域
- 外层容器内边距：`16px`，gap `16px`（与分页的间距）
- **表格高度撑满父级容器**（`flex: 1; min-height: 0`），通过 `:scroll="{ y: '100%' }"` 实现内部滚动
- 表格圆角：`4px`，带 `1px solid var(--color-border-2)` 外边框
- 行选择：开启 `row-selection`（checkbox）
- 表头：背景 `var(--color-fill-2)`，文字 `14px semibold color-text-1`
- 单元格：padding `16px` 水平、`7px` 垂直，`14px regular color-text-1`
- 操作列：使用 `<a-link>` 组件，颜色 `primary-6`，多个操作间 `gap: 8px`
- 状态列：使用 `<a-badge :status="..." :text="..." />`（独立使用，不包裹子元素）
- 右上角可选：列设置图标按钮（齿轮图标）

### 分页
- 尺寸：`size="small"`
- 位置：表格下方，与表格 gap `16px`
- **布局**：总条数左对齐（`margin-right: auto`），分页器自然靠右
- 右侧功能：页码 + `show-jumper` + `show-page-size`（`20条/页`）

## Vue 代码模板

```vue
<script setup lang="ts">
/**
 * 简单列表页
 * ------------------------------------------------------------------
 * 基础表格列表：操作栏（按钮组 + 简单搜索）+ 表格（行选择）+ 分页。
 * 复制此模板到 src/pages/<PageName>/index.vue，修改列定义和数据即可。
 */
import { ref, reactive } from 'vue';

// ====== 页面标题（按实际业务替换） ======
const pageTitle = '简单列表页';

// ====== 搜索 ======
const searchField = ref('name');  // 搜索字段
const searchKeyword = ref('');    // 搜索关键词
const searchFields = [
  { value: 'name', label: '名称' },
  { value: 'code', label: '编码' },
];

// ====== 表格列定义（按实际业务替换） ======
const columns = [
  { title: '列标题A', dataIndex: 'colA' },
  { title: '列标题B', dataIndex: 'colB' },
  { title: '列标题C', dataIndex: 'colC' },
  { title: '状态', dataIndex: 'status', slotName: 'status', width: 140 },
  { title: '操作', slotName: 'actions', width: 180 },
];

// ====== 表格数据与状态 ======
const loading = ref(false);
const tableData = ref<Record<string, any>[]>([]);
const selectedKeys = ref<string[]>([]);

// ====== 分页 ======
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
});

// ====== 状态映射（badge status 类型） ======
type StatusType = 'success' | 'processing' | 'warning' | 'danger' | 'normal';
const statusMap: Record<string, { label: string; value: StatusType }> = {
  active: { label: '已启用', value: 'success' },
  inactive: { label: '未启用', value: 'normal' },
  pending: { label: '审核中', value: 'processing' },
  error: { label: '异常', value: 'danger' },
};

// ====== 数据加载（mock 示例，交付时替换为接口请求） ======
function fetchData() {
  loading.value = true;
  setTimeout(() => {
    const statuses = ['active', 'inactive', 'pending', 'error'];
    tableData.value = Array.from({ length: 10 }, (_, i) => ({
      key: String(i + 1),
      colA: `数据 ${i + 1}`,
      colB: `内容 ${i + 1}`,
      colC: `描述 ${i + 1}`,
      status: statuses[i % statuses.length],
    }));
    pagination.total = 50;
    loading.value = false;
  }, 300);
}
fetchData();

// ====== 分页切换 ======
function onPageChange(page: number) {
  pagination.current = page;
  fetchData();
}
function onPageSizeChange(size: number) {
  pagination.pageSize = size;
  pagination.current = 1;
  fetchData();
}

// ====== 搜索 ======
function onSearch() {
  pagination.current = 1;
  fetchData();
}

// ====== 操作按钮 ======
function handleCreate() {
  // TODO: 跳转到新建页 or 打开弹窗
}
</script>

<template>
  <div class="pg-simple-list">
    <!-- page-header -->
    <div class="pg-simple-list__header">
      <h2 class="pg-simple-list__title">{{ pageTitle }}</h2>

      <!-- 操作栏 -->
      <div class="pg-simple-list__filter">
        <!-- 左侧按钮组 -->
        <a-space :size="8">
          <a-button type="primary" size="small" @click="handleCreate">创建</a-button>
          <a-button size="small">导入</a-button>
          <a-button size="small">导出</a-button>
          <a-button size="small">打印</a-button>
        </a-space>

        <!-- 右侧搜索 -->
        <a-input-group style="width: 324px">
          <a-select v-model="searchField" size="small" :style="{ width: '80px' }">
            <a-option
              v-for="f in searchFields"
              :key="f.value"
              :value="f.value"
              :label="f.label"
            />
          </a-select>
          <a-input
            v-model="searchKeyword"
            size="small"
            placeholder="请输入搜索内容"
            allow-clear
            @press-enter="onSearch"
          />
        </a-input-group>
      </div>
    </div>

    <!-- 表格 + 分页 -->
    <div class="pg-simple-list__body">
      <div class="pg-simple-list__table-wrap">
        <a-table
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="false"
          :row-selection="{ type: 'checkbox', showCheckedAll: true }"
          v-model:selected-keys="selectedKeys"
          row-key="key"
          :bordered="{ wrapper: true }"
          size="medium"
          :scroll="{ y: '100%' }"
          class="pg-simple-list__table"
        >
          <!-- 状态列（badge status） -->
          <template #status="{ record }">
            <a-badge
              :status="statusMap[record.status]?.value || 'normal'"
              :text="statusMap[record.status]?.label || record.status"
            />
          </template>

          <!-- 操作列 -->
          <template #actions>
            <a-space :size="8">
              <a-link>查看</a-link>
              <a-link>编辑</a-link>
            </a-space>
          </template>
        </a-table>
      </div>

      <!-- 分页 -->
      <div class="pg-simple-list__pagination">
        <span class="pg-simple-list__total">共{{ pagination.total }}条</span>
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
.pg-simple-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.pg-simple-list__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 16px 0;
  flex-shrink: 0;
}

.pg-simple-list__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
  margin: 0;
  line-height: 28px;
}

.pg-simple-list__filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pg-simple-list__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  min-height: 0;
  overflow: hidden;
}

.pg-simple-list__table-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.pg-simple-list__table {
  height: 100%;
}

/* 让 arco table 内部撑满容器高度 */
.pg-simple-list__table-wrap :deep(.arco-table-container) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.pg-simple-list__table-wrap :deep(.arco-table-body) {
  flex: 1;
  min-height: 0;
}

.pg-simple-list__pagination {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.pg-simple-list__total {
  font-size: 14px;
  color: var(--color-text-1);
  white-space: nowrap;
  margin-right: auto;
}
</style>
```

## 使用要点

1. **复制到 `src/pages/<PageName>/index.vue`**，修改 `pageTitle`、`columns`、`searchFields`、`statusMap` 和数据加载逻辑。
2. **控件尺寸全部 `size="small"`**：按钮、select、input 等操作栏控件统一使用小尺寸。
3. **按钮组**：第一个按钮为主操作（`type="primary"`），其余为次要操作。按钮数量按业务实际调整，一般不超过 4 个。
4. **搜索区域**：使用 `<a-input-group>` 组合前缀下拉 + 输入框。如果只需要纯关键词搜索（无字段选择），直接用 `<a-input-search size="small">` 替代。
5. **表格行选择**：默认开启 checkbox，如不需要可移除 `:row-selection` 属性。
6. **表格撑满高度**：table-wrap 容器 `flex: 1; min-height: 0`，配合 `:scroll="{ y: '100%' }"` 和 `:deep()` 样式让表格体内滚动。
7. **状态列**：使用 `<a-badge :status :text>` 独立展示状态点+文字，定义 `statusMap` 映射业务状态到 badge 类型（success/processing/warning/danger/normal）。
8. **操作列**：使用 `<a-link>` 组件（品牌色链接），不要用 `<a-button type="text">`。多操作间 `gap: 8px`。
9. **分页**：与表格分离（`:pagination="false"` + 独立 `<a-pagination>`），总条数 `margin-right: auto` 左对齐，分页器靠右。`size="small"` 对应设计稿的小尺寸分页。
10. **mock 数据**：PM demo 用 `setTimeout` 模拟；开发交付时替换为 `fetch`/`axios` 接口调用。
11. **表格边框**：使用 `:bordered="{ wrapper: true }"` 只加外层圆角边框，不加单元格竖线。
12. **Layout 无 padding**：全局 Layout 的 content 区域不自带 padding，由页面自身通过 `pg-simple-list__header`（padding 16px）和 `pg-simple-list__body`（padding 16px）控制。

## 与其他页面模板的区别

| 场景 | 用什么模板 |
|---|---|
| 基础列表，单关键词搜索 | **本模板（简单列表页）** |
| 多条件筛选（日期范围、状态、类型等） | 高级列表页（待补充） |
| 纯信息展示，无 CRUD | 数据展示页（待补充） |
