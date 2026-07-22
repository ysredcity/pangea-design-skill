<script setup lang="ts">
/**
 * 简单列表页（示例）
 * ------------------------------------------------------------------
 * 基础表格列表：操作栏（按钮组 + 简单搜索）+ 表格（行选择）+ 分页。
 */
import { ref, reactive } from 'vue';

// ====== 页面标题 ======
const pageTitle = '简单列表页';

// ====== 搜索 ======
const searchField = ref('name');
const searchKeyword = ref('');
const searchFields = [
  { value: 'name', label: '名称' },
  { value: 'code', label: '编码' },
];

// ====== 表格列定义 ======
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

// ====== 状态映射 ======
type StatusType = 'success' | 'processing' | 'warning' | 'danger' | 'normal';
const statusMap: Record<string, { label: string; value: StatusType }> = {
  active: { label: '已启用', value: 'success' },
  inactive: { label: '未启用', value: 'normal' },
  pending: { label: '审核中', value: 'processing' },
  error: { label: '异常', value: 'danger' },
};

// ====== 数据加载（mock） ======
function fetchData() {
  loading.value = true;
  setTimeout(() => {
    const statuses = ['active', 'inactive', 'pending', 'error'];
    tableData.value = Array.from({ length: 10 }, (_, i) => ({
      key: String(i + 1),
      colA: `Pangea`,
      colB: `Pangea`,
      colC: `Pangea`,
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

// ====== 操作 ======
function handleCreate() {
  // TODO
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
          <!-- 状态列 -->
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
              <a-link>查看</a-link>
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
