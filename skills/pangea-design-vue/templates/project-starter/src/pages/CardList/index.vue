<script setup lang="ts">
/**
 * 卡片列表页（示例）
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

const pageTitle = '卡片列表页';

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
    cards.value = Array.from({ length: 8 }, (_, i) => ({
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
