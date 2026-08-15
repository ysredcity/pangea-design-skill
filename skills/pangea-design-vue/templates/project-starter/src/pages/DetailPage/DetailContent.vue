<script setup lang="ts">
/**
 * 详情内容（可复用）
 * ------------------------------------------------------------------
 * 只负责「详情内容」本身：折叠分组 + 只读字段（label 在上 / 值在下）+ 长文本
 * + 附件列表 + 只读子表单表格。**不含页头与页面外壳**，因此可被三种容器复用：
 *   1) 独立详情页（DetailPage/index.vue）
 *   2) a-drawer 抽屉详情
 *   3) a-modal 对话框详情
 * 容器只负责标题栏与操作按钮，内容一份、不重复实现。
 */
import { computed } from 'vue';
import { Message } from '@arco-design/web-vue';
import {
  IconEye,
  IconDownload,
  IconUploadPdf,
  IconUploadZip,
  IconUploadPpt,
  IconUploadWord,
  IconUploadExcel,
  IconUploadImage,
  IconUploadDefault,
} from '@arco-iconbox/vue-pangea-mobile';

export interface DetailField {
  label: string;
  value?: string | number;
  /** 是否显示必填红星：与录入页字段对齐时可开启；纯查看场景建议不开 */
  required?: boolean;
  /** 整行展示（长文本、说明等） */
  full?: boolean;
}
export interface DetailFile {
  name: string;
  url?: string;
}

const props = withDefaults(
  defineProps<{
    fields: DetailField[];
    files?: DetailFile[];
    tableColumns?: Record<string, unknown>[];
    tableData?: Record<string, unknown>[];
    /** 容器为抽屉/弹窗时传 true：去掉外层内边距，交由容器控制 */
    embedded?: boolean;
    /**
     * 字段列数（桌面下）。默认 3 列。
     * ⚠️ Arco 栅格断点按**视口宽度**判断，不看容器宽度——放进较窄的抽屉/弹窗时，
     * 栅格不会自动收敛，需由容器显式传 `:cols="2"` 或 `1` 降低密度。
     */
    cols?: 1 | 2 | 3;
  }>(),
  { files: () => [], tableColumns: () => [], tableData: () => [], embedded: false, cols: 3 },
);

// 列数 → 栅格断点（窄屏一律 1 列）
const colSpan = computed(() => {
  if (props.cols === 1) return { xs: 24, sm: 24, lg: 24 };
  if (props.cols === 2) return { xs: 24, sm: 12, lg: 12 };
  return { xs: 24, sm: 12, lg: 8 };
});

const activeKeys = ['basic', 'metrics'];

// 空值统一占位，避免详情页出现空白单元格
const EMPTY = '—';
function display(v?: string | number) {
  return v === undefined || v === null || v === '' ? EMPTY : String(v);
}

// 按扩展名匹配文件类型图标（业务/内容图标从图标包命名导入）
const FILE_ICONS: Record<string, unknown> = {
  pdf: IconUploadPdf,
  zip: IconUploadZip,
  rar: IconUploadZip,
  ppt: IconUploadPpt,
  pptx: IconUploadPpt,
  doc: IconUploadWord,
  docx: IconUploadWord,
  xls: IconUploadExcel,
  xlsx: IconUploadExcel,
  png: IconUploadImage,
  jpg: IconUploadImage,
  jpeg: IconUploadImage,
  gif: IconUploadImage,
};
function fileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  return FILE_ICONS[ext] || IconUploadDefault;
}

const normalFields = computed(() => props.fields.filter((f) => !f.full));
const fullFields = computed(() => props.fields.filter((f) => f.full));

function preview(file: DetailFile) {
  if (file.url) window.open(file.url, '_blank', 'noopener');
  else Message.info(`预览 ${file.name}（demo 无真实文件）`);
}
function download(file: DetailFile) {
  if (file.url) window.open(file.url, '_blank', 'noopener');
  else Message.info(`下载 ${file.name}（demo 无真实文件）`);
}
</script>

<template>
  <div class="pg-detail-content" :class="{ 'is-embedded': embedded }">
    <a-collapse :default-active-key="activeKeys" :bordered="false" expand-icon-position="left">
      <!-- ===== 分组 1：基本信息（只读字段 + 长文本 + 附件） ===== -->
      <a-collapse-item key="basic" header="基本信息">
        <!-- 只读字段：3 列响应式；label 在上、值在下 -->
        <a-row :gutter="20">
          <a-col v-for="f in normalFields" :key="f.label" :xs="colSpan.xs" :sm="colSpan.sm" :lg="colSpan.lg">
            <div class="pg-detail-item">
              <div class="pg-detail-item__label">
                <span v-if="f.required" class="pg-detail-item__required">*</span>{{ f.label }}
              </div>
              <div class="pg-detail-item__value">{{ display(f.value) }}</div>
            </div>
          </a-col>
        </a-row>

        <!-- 整行长文本（说明等）：值可换行 -->
        <div v-for="f in fullFields" :key="f.label" class="pg-detail-item pg-detail-item--full">
          <div class="pg-detail-item__label">
            <span v-if="f.required" class="pg-detail-item__required">*</span>{{ f.label }}
          </div>
          <div class="pg-detail-item__value pg-detail-item__value--multiline">{{ display(f.value) }}</div>
        </div>

        <!-- 附件：只读文件列表（类型图标 + 文件名 + 预览/下载） -->
        <div v-if="files.length" class="pg-detail-item pg-detail-item--full">
          <div class="pg-detail-item__label">附件</div>
          <ul class="pg-detail-files">
            <li v-for="file in files" :key="file.name" class="pg-detail-files__row">
              <span class="pg-detail-files__icon"><component :is="fileIcon(file.name)" /></span>
              <span class="pg-detail-files__name">{{ file.name }}</span>
              <span class="pg-detail-files__ops">
                <a-tooltip content="预览" mini>
                  <a-button type="text" shape="circle" size="small" :aria-label="`预览 ${file.name}`" @click="preview(file)">
                    <template #icon><IconEye /></template>
                  </a-button>
                </a-tooltip>
                <a-tooltip content="下载" mini>
                  <a-button type="text" shape="circle" size="small" :aria-label="`下载 ${file.name}`" @click="download(file)">
                    <template #icon><IconDownload /></template>
                  </a-button>
                </a-tooltip>
              </span>
            </li>
          </ul>
        </div>
      </a-collapse-item>

      <!-- ===== 分组 2：指标（只读子表单表格） ===== -->
      <a-collapse-item v-if="tableColumns.length" key="metrics" header="指标">
        <a-table
          :columns="tableColumns"
          :data="tableData"
          :pagination="false"
          row-key="key"
          :bordered="{ wrapper: true }"
          size="medium"
          :scroll="{ x: '100%' }"
        />
      </a-collapse-item>
    </a-collapse>
  </div>
</template>

<style scoped>
.pg-detail-content {
  padding: 24px;
}

/* 抽屉 / 弹窗内使用：内边距交给容器 */
.pg-detail-content.is-embedded {
  padding: 0;
}

/* ===== 只读字段：label 在上、值在下 ===== */
.pg-detail-item {
  margin-bottom: 20px;
}

.pg-detail-item--full {
  width: 100%;
}

.pg-detail-item__label {
  margin-bottom: 4px;
  font-size: 14px;
  line-height: 22px;
  color: var(--color-text-2);
}

.pg-detail-item__required {
  margin-right: 4px;
  color: rgb(var(--red-6));
}

.pg-detail-item__value {
  font-size: 14px;
  line-height: 22px;
  color: var(--color-text-1);
  overflow-wrap: anywhere;
}

/* 长文本：保留换行 */
.pg-detail-item__value--multiline {
  white-space: pre-line;
}

/* ===== 附件列表 ===== */
.pg-detail-files {
  margin: 0;
  padding: 0;
  list-style: none;
}

.pg-detail-files__row {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  padding: 0 8px 0 12px;
  margin-bottom: 8px;
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-medium);
  background: var(--color-bg-1);
}

.pg-detail-files__row:last-child {
  margin-bottom: 0;
}

.pg-detail-files__icon {
  display: inline-flex;
  flex: none;
  font-size: 20px;
}

.pg-detail-files__name {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  color: var(--color-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pg-detail-files__ops {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 4px;
}

/* ===== 折叠分组细节（与表单类模板一致） ===== */
.pg-detail-content :deep(.arco-collapse-item-header-title) {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-detail-content :deep(.arco-collapse-item-header) {
  border-bottom: none;
}

.pg-detail-content :deep(.arco-collapse-item) {
  margin-bottom: 16px;
}

.pg-detail-content :deep(.arco-collapse-item:last-child) {
  margin-bottom: 0;
}

.pg-detail-content :deep(.arco-collapse-item-content) {
  padding-left: 0;
  padding-right: 0;
}

.pg-detail-content :deep(.arco-collapse-item-header-left) {
  padding-left: 20px;
}

.pg-detail-content :deep(.arco-collapse-item .arco-collapse-item-icon-hover) {
  left: 0;
}
</style>
