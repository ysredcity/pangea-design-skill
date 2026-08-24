<script setup lang="ts">
/**
 * 基础列表页（示例）
 * ------------------------------------------------------------------
 * 表格列表 + 更强的筛选能力：筛选方案 + 简单搜索 + 可展开的高级筛选面板（多字段同时查询）。
 * 页头/筛选区复用卡片列表页的形态，列表载体换成表格（同简单列表页）。
 */
import { ref, reactive } from 'vue';
import { IconUp, IconDown, IconSave, IconUndo } from '@arco-iconbox/vue-pangea-mobile';

// ====== 页面标题 ======
const pageTitle = '基础列表页';

// ====== 筛选方案 + 简单搜索 ======
const filterPlan = ref();
const searchField = ref('name');
const searchKeyword = ref('');
const searchFields = [
  { value: 'name', label: '名称' },
  { value: 'code', label: '编码' },
];

// ====== 高级筛选面板（展开/折叠，支持多字段同时查询） ======
const advancedVisible = ref(false);
const advancedFields = [
  { field: 'f1', label: 'Label' },
  { field: 'f2', label: 'Label' },
  { field: 'f3', label: 'Label' },
  { field: 'f4', label: 'Label' },
  { field: 'f5', label: 'Label' },
];
const advancedForm = reactive<Record<string, string>>({
  f1: '',
  f2: '',
  f3: '',
  f4: '',
  f5: '',
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
const pagination = reactive({ current: 1, pageSize: 20, total: 0 });

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
  <div class="pg-filter-list">
    <!-- page-header：与卡片列表页同形态（筛选方案 + 搜索 + 展开钮 + 高级筛选面板 + 按钮组） -->
    <div class="pg-filter-list__header">
      <div class="pg-filter-list__filter">
        <h2 class="pg-filter-list__title">{{ pageTitle }}</h2>
        <div class="pg-filter-list__filter-right">
          <a-select
            v-model="filterPlan"
            placeholder="筛选方案"
            size="small"
            allow-clear
            :style="{ width: '128px' }"
          />
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

          <!-- 展开/折叠高级筛选面板 -->
          <a-button
            size="small"
            class="pg-filter-list__adv-toggle"
            @click="advancedVisible = !advancedVisible"
          >
            <template #icon>
              <IconUp v-if="advancedVisible" />
              <IconDown v-else />
            </template>
          </a-button>
        </div>
      </div>

      <!-- 高级筛选面板：展开时显示更多筛选条件，支持多字段同时查询 -->
      <div v-show="advancedVisible" class="pg-filter-list__filter-panel">
        <div
          v-for="f in advancedFields"
          :key="f.field"
          class="pg-filter-list__adv-item"
        >
          <span class="pg-filter-list__adv-label">{{ f.label }}</span>
          <a-input
            v-model="advancedForm[f.field]"
            size="small"
            placeholder="请输入"
            allow-clear
          />
        </div>
        <div class="pg-filter-list__adv-actions">
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

    <!-- 表格 + 分页：与简单列表页同形态 -->
    <div class="pg-filter-list__body">
      <div class="pg-filter-list__table-wrap">
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
          class="pg-filter-list__table"
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
      <div class="pg-filter-list__pagination">
        <span class="pg-filter-list__total">共{{ pagination.total }}条</span>
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
.pg-filter-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  /* 本页背景：白底（Layout 内容区默认透明，背景由页面自己设置） */
  background: var(--color-bg-1);
}

.pg-filter-list__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* 与卡片列表页一致：页头底部有一条 1px 分割线（页头下边框，通栏） */
  padding: 16px 16px 12px;
  border-bottom: 1px solid var(--color-border-2);
  flex-shrink: 0;
}

.pg-filter-list__filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pg-filter-list__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
  margin: 0;
  line-height: 28px;
}

.pg-filter-list__filter-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 高级筛选面板：灰底 + 边框，响应式栅格，字段 label + input；右下角保存/重置/查询 */
.pg-filter-list__filter-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px 24px;
  padding: 16px;
  background: var(--color-fill-1);
  border: 1px solid var(--color-border-3);
  border-radius: var(--border-radius-medium);
}

.pg-filter-list__adv-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pg-filter-list__adv-label {
  flex-shrink: 0;
  min-width: 40px;
  text-align: right;
  font-size: 14px;
  color: var(--color-text-2);
}

.pg-filter-list__adv-item :deep(.arco-input-wrapper) {
  flex: 1;
}

.pg-filter-list__adv-actions {
  grid-column: 1 / -1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 8px;
}

.pg-filter-list__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  min-height: 0;
  overflow: hidden;
}

.pg-filter-list__table-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.pg-filter-list__table {
  height: 100%;
}

/* 让 arco table 内部撑满容器高度 */
.pg-filter-list__table-wrap :deep(.arco-table-container) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.pg-filter-list__table-wrap :deep(.arco-table-body) {
  flex: 1;
  min-height: 0;
}

.pg-filter-list__pagination {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.pg-filter-list__total {
  font-size: 14px;
  color: var(--color-text-1);
  white-space: nowrap;
  margin-right: auto;
}
</style>
