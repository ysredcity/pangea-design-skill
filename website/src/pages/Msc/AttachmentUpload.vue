<script setup lang="ts">
/**
 * MSC 业务组件预览：附件上传
 * ------------------------------------------------------------------
 * 组件本体从 skill 同步而来（src/generated/business/msc/），官网只负责演示外壳。
 * 三个 demo 对应设计稿的三种形态：默认态（空）/ 上传后（含成功+失败）/ 仅查看。
 */
import { computed, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import catalog from '@/generated/catalog.json';
import DemoBlock from '../Components/DemoBlock.vue';
import MscAttachmentUpload, {
  type MscAttachmentFile,
} from '@/generated/business/msc/MscAttachmentUpload.vue';

const meta = computed(() =>
  (catalog.businessComponents || []).find((c: { id: string }) => c.id === 'msc-attachment-upload'),
);
const product = computed(() =>
  (catalog.businessProducts || []).find((p: { product: string }) => p.product === 'msc'),
);

// ====== demo 1：默认态（空列表，可真实选文件 → mock 上传）======
const emptyFiles = ref<MscAttachmentFile[]>([]);
let seq = 0;
function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)}m`
    : `${Math.max(1, Math.ceil(bytes / 1024))}k`;
}
function patch(uid: string, next: Partial<MscAttachmentFile>) {
  emptyFiles.value = emptyFiles.value.map((f) => (f.uid === uid ? { ...f, ...next } : f));
}
/** mock 上传：先入列为「上传中」，600ms 后置为成功（第 3 个起随机失败一次，方便看失败态） */
function handleUpload(files: File[]) {
  for (const raw of files) {
    const uid = `u-${++seq}`;
    emptyFiles.value = [
      ...emptyFiles.value,
      { uid, name: raw.name, size: formatSize(raw.size), status: 'uploading' },
    ];
    const willFail = seq % 3 === 0;
    setTimeout(() => {
      if (willFail) {
        patch(uid, { status: 'fail' });
        Message.error(`${raw.name} 上传失败（demo）`);
      } else {
        patch(uid, { status: 'success', url: URL.createObjectURL(raw) });
      }
    }, 600);
  }
}

// ====== demo 2 / 3：预置数据 ======
function seed(): MscAttachmentFile[] {
  return [
    { uid: 's-1', name: '附件01 -青岛XXX营业执照-20241011.pdf', size: '1.5m', status: 'fail' },
    { uid: 's-2', name: '附件02 -青岛XXX营业执照-20241011.pdf', size: '1.5m', status: 'success', url: '#' },
    { uid: 's-3', name: '附件03 -青岛XXX营业执照-20241011.pdf', size: '1.5m', status: 'success', url: '#' },
  ];
}
const uploadedFiles = ref<MscAttachmentFile[]>(seed());
const readOnlyFiles = ref<MscAttachmentFile[]>(seed().filter((f) => f.status === 'success'));

function resetUploaded() {
  uploadedFiles.value = seed();
}
function onPreview(f: MscAttachmentFile) {
  Message.info(`预览 ${f.name}`);
}
function onDownload(f: MscAttachmentFile) {
  Message.info(`下载 ${f.name}`);
}
function onRemove(f: MscAttachmentFile) {
  Message.success(`已删除 ${f.name}`);
}
function onBatch(list: MscAttachmentFile[]) {
  Message.success(`批量下载 ${list.length} 个附件`);
}

// ====== API 表 ======
const propRows = [
  { name: 'file-list (v-model)', desc: '已上传附件列表（受控，由宿主维护）', type: 'MscAttachmentFile[]', def: '-' },
  { name: 'label', desc: '字段名', type: 'string', def: "'上传附件'" },
  { name: 'required', desc: 'label 前显示必填红星', type: 'boolean', def: 'false' },
  { name: 'accept', desc: '允许的扩展名，同时用于生成提示文案与前端校验', type: 'string[]', def: "['pdf','png','jpg']" },
  { name: 'max-size-m-b', desc: '单文件大小上限（MB），同上', type: 'number', def: '100' },
  { name: 'hint', desc: '自定义提示文案；不传则自动生成', type: 'string', def: "''" },
  { name: 'read-only', desc: '仅查看态：隐藏上传入口与提示、行操作去掉删除', type: 'boolean', def: 'false' },
  { name: 'disabled', desc: '禁用上传（仍可下载 / 预览 / 删除）', type: 'boolean', def: 'false' },
  { name: 'show-batch-download', desc: '是否显示批量下载', type: 'boolean', def: 'true' },
  { name: 'multiple', desc: '允许多选文件', type: 'boolean', def: 'true' },
];
const eventRows = [
  { name: 'update:file-list', desc: '列表变化（删除时组件会剔除该行并抛出）', args: 'MscAttachmentFile[]' },
  { name: 'upload', desc: '选中文件并通过类型/大小校验后触发，由宿主执行上传', args: 'files: File[]' },
  { name: 'preview', desc: '点击「预览」', args: 'file: MscAttachmentFile' },
  { name: 'download', desc: '点击「下载」', args: 'file: MscAttachmentFile' },
  { name: 'remove', desc: '点击「删除」', args: 'file: MscAttachmentFile' },
  { name: 'batch-download', desc: '点击「批量下载」（仅上传成功的）', args: 'files: MscAttachmentFile[]' },
];
const propColumns = [
  { title: '参数', dataIndex: 'name', width: 200 },
  { title: '说明', dataIndex: 'desc' },
  { title: '类型', dataIndex: 'type', width: 200 },
  { title: '默认值', dataIndex: 'def', width: 160 },
];
const eventColumns = [
  { title: '事件', dataIndex: 'name', width: 200 },
  { title: '说明', dataIndex: 'desc' },
  { title: '参数', dataIndex: 'args', width: 240 },
];
</script>

<template>
  <div class="pg-msc">
    <div class="pg-msc__inner">
      <header class="pg-msc__head">
        <div class="pg-msc__title-row">
          <h1 class="pg-msc__title">MSC 附件上传</h1>
          <a-tag color="arcoblue">MscAttachmentUpload</a-tag>
        </div>
        <p class="pg-msc__sub">
          MSC 表单场景中遇到附件上传时优先使用本组件，替代原生 <code>a-upload</code>：用一张详细表格承载已上传附件，
          支持预览、下载、删除与批量下载。
        </p>
      </header>

      <!-- 使用门槛：这是业务组件最重要的信息，放最显眼处 -->
      <a-alert type="warning" class="pg-msc__gate">
        <template #title>使用门槛：默认不用，命中 MSC 才用</template>
        需求中出现
        <a-tag v-for="t in product?.triggers || []" :key="t" size="small" color="orange">{{ t }}</a-tag>
        等字眼时，该场景才优先使用本组件；其他产品的附件上传请用 Arco 原生 <code>a-upload</code>。拿不准时问用户，不要自行推断。
      </a-alert>

      <!-- 选型元数据（来自 skill catalog 的 businessComponents） -->
      <a-card v-if="meta" class="pg-msc__card" :bordered="true" title="选型要点">
        <div class="pg-msc__meta">
          <div v-if="meta.whenToUse?.length" class="pg-msc__meta-row">
            <span class="pg-msc__meta-label">适用</span>
            <div class="pg-msc__meta-val">
              <a-tag v-for="t in meta.whenToUse" :key="t" color="green" size="small">{{ t }}</a-tag>
            </div>
          </div>
          <div v-if="meta.whenNotToUse?.length" class="pg-msc__meta-row">
            <span class="pg-msc__meta-label">不适用</span>
            <div class="pg-msc__meta-val">
              <a-tag v-for="t in meta.whenNotToUse" :key="t" size="small">{{ t }}</a-tag>
            </div>
          </div>
          <div v-if="meta.variants?.length" class="pg-msc__meta-row">
            <span class="pg-msc__meta-label">形态</span>
            <div class="pg-msc__meta-val">
              <a-tag v-for="t in meta.variants" :key="t" color="arcoblue" size="small">{{ t }}</a-tag>
            </div>
          </div>
          <div v-if="meta.pitfalls?.length" class="pg-msc__meta-row">
            <span class="pg-msc__meta-label">常见坑</span>
            <ul class="pg-msc__meta-list">
              <li v-for="t in meta.pitfalls" :key="t">{{ t }}</li>
            </ul>
          </div>
        </div>
      </a-card>

      <!-- ===== 三种形态 ===== -->
      <DemoBlock
        title="默认态（空列表）"
        desc="有上传入口与格式提示；列表为空时表格内显示「暂无数据」，「批量下载」为禁用态。可以真的选文件试试（mock 上传，每第 3 个会失败以便查看失败态）。"
      >
        <MscAttachmentUpload
          v-model:file-list="emptyFiles"
          label="上传附件"
          required
          @upload="handleUpload"
          @preview="onPreview"
          @download="onDownload"
          @remove="onRemove"
          @batch-download="onBatch"
        />
      </DemoBlock>

      <DemoBlock
        title="上传后状态"
        desc="上传成功的行有「下载 · 预览 · 删除」；上传失败的行只有「删除」（失败没有可访问产物）。「批量下载」只作用于上传成功的附件。"
      >
        <div class="pg-msc__demo-bar">
          <a-button size="small" @click="resetUploaded">重置示例数据</a-button>
        </div>
        <MscAttachmentUpload
          v-model:file-list="uploadedFiles"
          label="上传附件"
          @preview="onPreview"
          @download="onDownload"
          @remove="onRemove"
          @batch-download="onBatch"
        />
      </DemoBlock>

      <DemoBlock
        title="仅查看（read-only）"
        desc="详情 / 审批等只读场景：不渲染上传入口与格式提示，行操作只剩「下载 · 预览」，「批量下载」仍可用。"
      >
        <MscAttachmentUpload
          v-model:file-list="readOnlyFiles"
          label="上传附件"
          read-only
          @preview="onPreview"
          @download="onDownload"
          @batch-download="onBatch"
        />
      </DemoBlock>

      <!-- ===== API ===== -->
      <a-card class="pg-msc__card" :bordered="true" title="Props">
        <a-table :columns="propColumns" :data="propRows" :pagination="false" size="small" row-key="name" />
      </a-card>
      <a-card class="pg-msc__card" :bordered="true" title="Events">
        <a-table :columns="eventColumns" :data="eventRows" :pagination="false" size="small" row-key="name" />
      </a-card>
      <a-card class="pg-msc__card" :bordered="true" title="数据结构">
        <pre class="pg-msc__code">export interface MscAttachmentFile {
  uid: string;                                  // 行 key，需唯一
  name: string;
  size: string;                                 // 展示用文本，如 '1.5m'（组件不做格式化）
  status: 'success' | 'fail' | 'uploading';
  url?: string;                                 // 预览 / 下载地址，上传成功后回填
}</pre>
      </a-card>

      <p class="pg-msc__foot">
        源码：<code>{{ meta?.source }}</code> ·
        文档：<code>{{ meta?.doc }}</code>
      </p>
    </div>
  </div>
</template>

<style scoped>
.pg-msc {
  min-height: 100%;
  padding: 24px;
  background: var(--color-bg-1);
}

.pg-msc__inner {
  max-width: 1120px;
  margin: 0 auto;
}

.pg-msc__head {
  margin-bottom: 16px;
}

.pg-msc__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pg-msc__title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-msc__sub {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--color-text-3);
}

.pg-msc__gate {
  margin-bottom: 20px;
}

.pg-msc__card {
  margin-bottom: 20px;
}

.pg-msc__meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pg-msc__meta-row {
  display: flex;
  gap: 12px;
}

.pg-msc__meta-label {
  flex: none;
  width: 72px;
  font-size: 13px;
  color: var(--color-text-3);
}

.pg-msc__meta-val {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pg-msc__meta-list {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  line-height: 22px;
  color: var(--color-text-2);
}

.pg-msc__demo-bar {
  margin-bottom: 12px;
}

.pg-msc__code {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 20px;
  color: var(--color-text-2);
  background: var(--color-fill-1);
  border-radius: var(--border-radius-medium);
}

.pg-msc__foot {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-3);
}
</style>
