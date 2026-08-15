<script setup lang="ts">
/**
 * MSC 附件上传（MSC / 全球营销云中台 **产品专属业务组件**）
 * ==================================================================
 * ⚠️ 使用门槛：**仅当需求明确属于 MSC（全球营销云中台 / 营销中台）时使用**。
 *    其他产品的附件上传请用 Arco 原生 `a-upload`（见 references/components/data-entry/upload.md）。
 *
 * 与原生 `a-upload` 的差别（也是本组件存在的理由）：
 *   原生 upload 的已上传列表是「一行一个文件名 + 删除」的轻量列表；
 *   MSC 表单要求用**一张详细的附件表格**承载已上传附件——
 *   列：附件名称 / 文件大小 / 状态（成功·失败）/ 操作（下载·预览·删除），
 *   并在表格下方提供**批量下载**。
 *
 * 结构（对齐设计稿 Figma 5926:53694）：
 *   label（上传附件）
 *   [⤒ 点击上传]                     ← readOnly 时不渲染
 *   Only pdf, png, jpg ... 100MB      ← 格式/大小提示，readOnly 时不渲染
 *   ┌ 附件名称 | 文件大小 | 状态 | 操作 ┐  ← 空列表时表格内显示「暂无数据」
 *   [⤓ 批量下载]                      ← 无「上传成功」文件时禁用
 *
 * 数据流：本组件**只负责选择文件 + 呈现列表 + 抛出语义事件**，不实现真实上传/下载。
 *   - 选中文件 → 校验类型与大小 → `emit('upload', files)`，由宿主上传后把结果写回 `fileList`
 *   - 行操作 → `emit('preview' | 'download' | 'remove', file)`
 *   - 批量下载 → `emit('batch-download', 成功文件[])`
 *   这样 demo 可以用 mock、开发交付可以接真实接口，组件本身不用改。
 */
import { computed, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconUpload, IconDownload } from '@arco-iconbox/vue-pangea-mobile';

/** 已上传附件（`size` 是**展示用字符串**，如 '1.5m'——各系统口径不同，不在组件里格式化） */
export interface MscAttachmentFile {
  /** 行 key，需唯一 */
  uid: string;
  name: string;
  /** 展示用文件大小文本，如 '1.5m' / '820k' */
  size: string;
  status: 'success' | 'fail' | 'uploading';
  /** 预览 / 下载地址（由宿主上传后回填） */
  url?: string;
}

const props = withDefaults(
  defineProps<{
    /** 已上传附件列表（v-model） */
    fileList: MscAttachmentFile[];
    /** 字段名 */
    label?: string;
    /** label 前是否显示必填红星 */
    required?: boolean;
    /** 允许的扩展名，同时用于生成提示文案与前端校验 */
    accept?: string[];
    /** 单文件大小上限（MB），同时用于生成提示文案与前端校验 */
    maxSizeMB?: number;
    /** 自定义提示文案；不传则按 accept + maxSizeMB 自动生成 */
    hint?: string;
    /** 仅查看态：隐藏「点击上传」与提示、行操作去掉「删除」 */
    readOnly?: boolean;
    /** 禁用上传（仍可下载 / 预览 / 删除） */
    disabled?: boolean;
    /** 是否显示「批量下载」 */
    showBatchDownload?: boolean;
    /** 是否允许多选文件 */
    multiple?: boolean;
  }>(),
  {
    label: '上传附件',
    required: false,
    accept: () => ['pdf', 'png', 'jpg'],
    maxSizeMB: 100,
    hint: '',
    readOnly: false,
    disabled: false,
    showBatchDownload: true,
    multiple: true,
  },
);

const emit = defineEmits<{
  (e: 'update:fileList', v: MscAttachmentFile[]): void;
  /** 通过校验的待上传文件，由宿主执行上传 */
  (e: 'upload', files: File[]): void;
  (e: 'preview', file: MscAttachmentFile): void;
  (e: 'download', file: MscAttachmentFile): void;
  (e: 'remove', file: MscAttachmentFile): void;
  (e: 'batch-download', files: MscAttachmentFile[]): void;
}>();

// ====== 提示文案 ======
// 与设计稿一致的英文句式；accept / maxSizeMB 变化时自动跟随，避免文案与校验规则不一致
const hintText = computed(() => {
  if (props.hint) return props.hint;
  return `Only ${props.accept.join(', ')} can be uploaded, and the size does not exceed ${props.maxSizeMB}MB`;
});

const acceptAttr = computed(() => props.accept.map((e) => `.${e}`).join(','));

// ====== 表格列 ======
// 「操作」列 fixed right + 表格开横向滚动：窄屏下操作始终可见（设计稿该列带投影即为固定列）
const columns = [
  { title: '附件名称', dataIndex: 'name', ellipsis: true, tooltip: true },
  { title: '文件大小', dataIndex: 'size', width: 120 },
  { title: '状态', slotName: 'status', width: 180 },
  { title: '操作', slotName: 'actions', width: 200, fixed: 'right' as const },
];

const STATUS_MAP: Record<string, { badge: 'success' | 'danger' | 'processing'; text: string }> = {
  success: { badge: 'success', text: '上传成功' },
  fail: { badge: 'danger', text: '上传失败' },
  uploading: { badge: 'processing', text: '上传中' },
};
// 表格插槽的 record 是 any，直接 STATUS_MAP[record.status] 会触发 TS7053
// → 统一走接受 string 的 helper（见 references/patterns/table-patterns.md）
function statusOf(status: string) {
  return STATUS_MAP[status] || STATUS_MAP.uploading;
}

// 只有「上传成功」的附件才能下载 / 预览 / 参与批量下载
const successFiles = computed(() => props.fileList.filter((f) => f.status === 'success'));
const batchDisabled = computed(() => successFiles.value.length === 0);

// ====== 选择文件 → 前端校验 → 交给宿主上传 ======
const uploadRef = ref();
function onFileSelect(_fileList: unknown, fileItem: { file?: File }) {
  const file = fileItem?.file;
  if (!file) return;
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!props.accept.includes(ext)) {
    Message.warning(`只能上传 ${props.accept.join(' / ')} 格式的文件`);
    return;
  }
  if (file.size > props.maxSizeMB * 1024 * 1024) {
    Message.warning(`单个文件不能超过 ${props.maxSizeMB}MB`);
    return;
  }
  emit('upload', [file]);
}

function onPreview(file: MscAttachmentFile) {
  emit('preview', file);
}
function onDownload(file: MscAttachmentFile) {
  emit('download', file);
}
function onRemove(file: MscAttachmentFile) {
  emit('update:fileList', props.fileList.filter((f) => f.uid !== file.uid));
  emit('remove', file);
}
function onBatchDownload() {
  emit('batch-download', successFiles.value);
}

defineExpose({ uploadRef });
</script>

<template>
  <div class="pg-msc-upload">
    <!-- 字段名 -->
    <div class="pg-msc-upload__label">
      <em v-if="required" aria-hidden="true">*</em>
      {{ label }}
    </div>

    <!-- 上传入口 + 格式提示（仅查看态不渲染） -->
    <div v-if="!readOnly" class="pg-msc-upload__entry">
      <a-upload
        ref="uploadRef"
        :accept="acceptAttr"
        :multiple="multiple"
        :auto-upload="false"
        :show-file-list="false"
        :disabled="disabled"
        @change="onFileSelect"
      >
        <template #upload-button>
          <a-button :disabled="disabled">
            <template #icon><IconUpload /></template>
            点击上传
          </a-button>
        </template>
      </a-upload>
      <p class="pg-msc-upload__hint">{{ hintText }}</p>
    </div>

    <!-- 已上传附件列表（本组件的核心：详细表格，而非原生 upload 的轻量列表） -->
    <a-table
      class="pg-msc-upload__table"
      :columns="columns"
      :data="fileList"
      row-key="uid"
      :pagination="false"
      :bordered="{ wrapper: true }"
      size="medium"
      :scroll="{ x: '100%' }"
    >
      <template #status="{ record }">
        <a-badge :status="statusOf(record.status).badge" :text="statusOf(record.status).text" />
      </template>
      <template #actions="{ record }">
        <div class="pg-msc-upload__actions">
          <!-- 上传失败的附件没有可下载/预览的产物，只留「删除」 -->
          <template v-if="record.status === 'success'">
            <a-link @click="onDownload(record)">下载</a-link>
            <a-link @click="onPreview(record)">预览</a-link>
          </template>
          <a-link v-if="!readOnly" status="danger" @click="onRemove(record)">删除</a-link>
        </div>
      </template>
    </a-table>

    <!-- 批量下载：无「上传成功」附件时禁用 -->
    <div v-if="showBatchDownload" class="pg-msc-upload__footer">
      <a-button :disabled="batchDisabled" @click="onBatchDownload">
        <template #icon><IconDownload /></template>
        批量下载
      </a-button>
    </div>
  </div>
</template>

<style scoped>
.pg-msc-upload {
  display: flex;
  flex-direction: column;
}

/* 字段名：与 a-form-item 的 label 同规格（14px / text-2） */
.pg-msc-upload__label {
  margin-bottom: 2px;
  font-size: 14px;
  line-height: 22px;
  color: var(--color-text-2);
}

.pg-msc-upload__label em {
  margin-right: 4px;
  font-style: normal;
  color: rgb(var(--danger-6));
}

.pg-msc-upload__entry {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}

/* 格式与大小提示 */
.pg-msc-upload__hint {
  margin: 0;
  font-size: 12px;
  line-height: 20px;
  color: var(--color-text-3);
}

/* 表头灰底对齐设计稿（Arco 默认表头底色偏浅） */
.pg-msc-upload__table :deep(.arco-table-th) {
  background: var(--color-fill-2);
}

/* 行操作：链接横排 */
.pg-msc-upload__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 去掉 a-link 默认的水平内边距，让首个链接与单元格左边缘对齐 */
.pg-msc-upload__actions :deep(.arco-link) {
  padding: 1px 4px;
}

.pg-msc-upload__footer {
  margin-top: 10px;
}
</style>
