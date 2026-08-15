<script setup lang="ts">
/**
 * 审批流程区（可复用）
 * ------------------------------------------------------------------
 * 审批详情页的下半部分：
 *   Tabs（流程处理 / 流程图 / 传阅记录）
 *   + 「显示审批记录」开关 & 「以发起人身份操作」入口
 *   + 审批记录表格
 *   + 处理区：**行的组成与顺序随「操作」不同而变化**（见 ROW_LAYOUT / ACTION_CONFIG）
 *
 * 说明：选人（转办/沟通/加签/传阅）用候选人下拉模拟，真实项目应替换为组织架构选人组件。
 */
import { computed, nextTick, ref, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconLink, IconUpload, IconFlow, IconPlus, IconInfoCircle } from '@arco-iconbox/vue-pangea-mobile';

export interface ApprovalRecord {
  key: string;
  time: string;
  node: string;
  operator: string;
  action: string;
  comment: string;
  attachment?: string;
}

const props = withDefaults(
  defineProps<{
    records: ApprovalRecord[];
    /** 即将流向（通过时展示的下一节点） */
    nextNode?: string;
    /** 当前处理人 */
    currentHandler?: string;
    /** 是否可处理（无处理权限时隐藏处理区） */
    actionable?: boolean;
  }>(),
  { nextNode: '', currentHandler: '', actionable: true },
);

const activeTab = ref('process');
const showRecords = ref(true);

// ====== 审批操作定义 ======
const ACTIONS = [
  { value: 'approve', label: '通过' },
  { value: 'transfer', label: '转办' },
  { value: 'communicate', label: '沟通' },
  { value: 'reject', label: '驳回' },
  { value: 'refuse', label: '不通过' },
  { value: 'countersign', label: '加签' },
];

/**
 * 每种操作的**行顺序与组成**（这是本区块的核心：不同操作不是简单显隐，行序也不同）
 *   comment    处理意见（+ 提交按钮）
 *   attach     附件
 *   pickNext   即将流向 = 可编辑选人（+ 添加xx人 + 人员标签）
 *   nextText   即将流向 = 只读文本
 *   rejectTo   驳回到（选择节点）
 *   rejectMode 驳回节点通过后（按顺序流转 / 返回这个节点所有人）
 *   signMode   加签方式（前加签 / 后加签）
 *   handler    当前处理人
 */
const ROW_LAYOUT: Record<string, string[]> = {
  approve: ['comment', 'attach', 'nextText', 'handler'],
  transfer: ['pickNext', 'comment', 'attach', 'handler'],
  communicate: ['pickNext', 'comment', 'attach', 'handler'],
  reject: ['rejectTo', 'rejectMode', 'comment', 'attach', 'nextText', 'handler'],
  refuse: ['comment', 'attach', 'nextText', 'handler'],
  countersign: ['signMode', 'pickNext', 'comment', 'attach', 'handler'],
};

/** 每种操作的差异化配置：意见是否必填、选人入口文案、即将流向文本、默认意见 */
const ACTION_CONFIG: Record<
  string,
  { commentRequired: boolean; pickLabel?: string; nextText?: string; defaultComment?: string }
> = {
  approve: { commentRequired: false, defaultComment: '同意', nextText: '' },
  transfer: { commentRequired: false, pickLabel: '添加转办人' },
  communicate: { commentRequired: true, pickLabel: '添加沟通人' },
  reject: { commentRequired: true, nextText: '—' },
  refuse: { commentRequired: true, nextText: '结束节点' },
  countersign: { commentRequired: false, pickLabel: '添加审批人' },
};

// ====== 处理表单 ======
const form = ref({
  action: 'approve',
  comment: '同意',
  files: [] as any[],
  rejectTo: undefined as string | undefined,
  rejectMode: 'sequence',
  signMode: 'before',
});

const cfg = computed(() => ACTION_CONFIG[form.value.action]);
const rows = computed(() => ROW_LAYOUT[form.value.action] || []);
const commentLabel = computed(() => (cfg.value.commentRequired ? '处理意见(必填)' : '处理意见'));
const nextText = computed(() => cfg.value.nextText || props.nextNode || '—');

// 切换操作：清空上一操作的输入（通过回填默认「同意」），避免串台
watch(
  () => form.value.action,
  (action) => {
    form.value.comment = ACTION_CONFIG[action].defaultComment || '';
    form.value.rejectTo = undefined;
    form.value.rejectMode = 'sequence';
    form.value.signMode = 'before';
  },
);

// 驳回目标节点
const NODE_OPTIONS = [
  { value: 'start', label: '发起节点' },
  { value: 'dept', label: '部门长' },
  { value: 'deputy', label: '部门副总经理' },
];

const SIGN_TIPS = {
  before: '加签人先处理，之后我处理',
  after: '审核通过，之后让加签人处理',
};

// ====== 审批记录表格 ======
const columns = [
  { title: '时间', dataIndex: 'time', width: 180 },
  { title: '节点名称', dataIndex: 'node', width: 140 },
  { title: '操作者', dataIndex: 'operator', width: 128 },
  { title: '操作', dataIndex: 'action', width: 120 },
  { title: '处理意见', slotName: 'comment' },
];

// ====== 传阅记录（无操作列） ======
const circulateColumns = [
  { title: '传阅时间', dataIndex: 'time' },
  { title: '传阅发起人', dataIndex: 'from' },
  { title: '传阅对象', dataIndex: 'to' },
];
const circulateRows = ref([
  { key: '1', time: '2024-07-16 05:23:25', from: '何安其', to: '赵天宇' },
  { key: '2', time: '2024-07-17 01:52:07', from: '何引琪', to: '赵家宝' },
]);
const circulatePage = ref({ current: 1, pageSize: 10, total: 50 });
const circulatePagination = computed(() => ({
  current: circulatePage.value.current,
  pageSize: circulatePage.value.pageSize,
  total: circulatePage.value.total,
  showTotal: true,
  showPageSize: true,
}));
function onCirculatePageChange(page: number) {
  circulatePage.value.current = page;
  // TODO 开发交付时按页拉取传阅记录
}
function onCirculatePageSizeChange(size: number) {
  circulatePage.value.pageSize = size;
  circulatePage.value.current = 1;
}

// ====== 提交 ======
const submitting = ref(false);
async function handleSubmit() {
  if (cfg.value.commentRequired && !form.value.comment.trim()) {
    Message.warning('请填写处理意见');
    return;
  }
  // 注：选人为占位入口（真实项目接标准人员选择器），接入后此处应补「未选人拦截提交」
  if (form.value.action === 'reject' && !form.value.rejectTo) {
    Message.warning('请选择驳回到的节点');
    return;
  }
  submitting.value = true;
  try {
    // TODO 开发交付时替换为审批提交接口
    await new Promise((r) => setTimeout(r, 300));
    Message.success(`已提交：${ACTIONS.find((a) => a.value === form.value.action)?.label}`);
  } finally {
    submitting.value = false;
  }
}
function openAttachment(name: string) {
  Message.info(`打开附件 ${name}（demo）`);
}

// ====== 以发起人身份操作（对话框） ======
const originVisible = ref(false);
const originForm = ref({ action: 'revoke', comment: '' });
const ORIGIN_ACTIONS = [
  { value: 'urge', label: '催办' },
  { value: 'revoke', label: '撤回' },
];
function openOrigin() {
  originForm.value = { action: 'revoke', comment: '' };
  originVisible.value = true;
}
function submitOrigin() {
  const label = ORIGIN_ACTIONS.find((a) => a.value === originForm.value.action)?.label;
  Message.success(`已${label}（demo）`);
  originVisible.value = false;
}

// ====== 供父级调用 ======
// 处理意见行在 v-for 内渲染，模板 ref 会被收集成数组 → 这里用**函数 ref** 单独接住
const commentRow = ref<HTMLElement>();
const commentInput = ref<{ focus?: () => void }>();
function setCommentRow(el: unknown) {
  commentRow.value = (el as HTMLElement) || undefined;
}
function setCommentInput(el: unknown) {
  commentInput.value = (el as { focus?: () => void }) || undefined;
}
function focusComment() {
  activeTab.value = 'process';
  nextTick(() => {
    commentRow.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    commentInput.value?.focus?.();
  });
}
defineExpose({ focusComment });
</script>

<template>
  <div class="pg-approval-process">
    <a-tabs v-model:active-key="activeTab" class="pg-approval-process__tabs">
      <a-tab-pane key="process" title="流程处理">
        <div class="pg-approval-process__pane">
          <!-- 顶部一行：显示审批记录开关 + 以发起人身份操作 -->
          <div class="pg-approval-process__bar">
            <a-checkbox v-model="showRecords">显示审批记录</a-checkbox>
            <a-link @click="openOrigin">以发起人身份操作</a-link>
          </div>

          <a-table
            v-if="showRecords"
            class="pg-approval-process__table"
            :columns="columns"
            :data="records"
            :pagination="false"
            row-key="key"
            :bordered="{ wrapper: true }"
            size="medium"
            :scroll="{ x: '100%' }"
          >
            <template #comment="{ record }">
              <div class="pg-approval-process__comment">
                <span>{{ record.comment }}</span>
                <a-link v-if="record.attachment" @click="openAttachment(record.attachment)">
                  <template #icon><IconLink /></template>
                  {{ record.attachment }}
                </a-link>
              </div>
            </template>
          </a-table>

          <!-- 处理区：操作行固定在最上，其余行按 ROW_LAYOUT 的顺序渲染 -->
          <div v-if="actionable" class="pg-approval-grid">
            <div class="pg-approval-grid__row">
              <div class="pg-approval-grid__label">操作</div>
              <div class="pg-approval-grid__value">
                <a-radio-group v-model="form.action">
                  <a-radio v-for="a in ACTIONS" :key="a.value" :value="a.value">{{ a.label }}</a-radio>
                </a-radio-group>
              </div>
            </div>

            <template v-for="row in rows" :key="row">
              <!-- 加签方式 -->
              <div v-if="row === 'signMode'" class="pg-approval-grid__row">
                <div class="pg-approval-grid__label">加签方式</div>
                <div class="pg-approval-grid__value">
                  <a-radio-group v-model="form.signMode">
                    <a-radio value="before">
                      前加签
                      <a-tooltip :content="SIGN_TIPS.before" mini>
                        <IconInfoCircle class="pg-approval-grid__tip" />
                      </a-tooltip>
                    </a-radio>
                    <a-radio value="after">
                      后加签
                      <a-tooltip :content="SIGN_TIPS.after" mini>
                        <IconInfoCircle class="pg-approval-grid__tip" />
                      </a-tooltip>
                    </a-radio>
                  </a-radio-group>
                </div>
              </div>

              <!-- 驳回到 -->
              <div v-else-if="row === 'rejectTo'" class="pg-approval-grid__row">
                <div class="pg-approval-grid__label">驳回到</div>
                <div class="pg-approval-grid__value">
                  <a-select
                    v-model="form.rejectTo"
                    placeholder="请选择节点"
                    :options="NODE_OPTIONS"
                    style="max-width: 220px"
                  />
                </div>
              </div>

              <!-- 驳回节点通过后 -->
              <div v-else-if="row === 'rejectMode'" class="pg-approval-grid__row">
                <div class="pg-approval-grid__label">驳回节点通过后</div>
                <div class="pg-approval-grid__value">
                  <a-radio-group v-model="form.rejectMode">
                    <a-radio value="sequence">按顺序流转</a-radio>
                    <a-radio value="all">返回这个节点所有人</a-radio>
                  </a-radio-group>
                </div>
              </div>

              <!-- 即将流向：选人入口。
                   这里只是**占位入口，点击不触发任何效果**——真实项目接入组织架构的
                   标准人员选择器（选完把人员回填到本行，通常渲染为可删除的 a-tag）。 -->
              <div v-else-if="row === 'pickNext'" class="pg-approval-grid__row">
                <div class="pg-approval-grid__label">即将流向</div>
                <div class="pg-approval-grid__value pg-approval-grid__value--pick">
                  <!-- TODO 开发交付时替换为标准人员选择器 -->
                  <a-link>
                    <template #icon><IconPlus /></template>
                    {{ cfg.pickLabel }}
                  </a-link>
                </div>
              </div>

              <!-- 处理意见 + 提交 -->
              <div v-else-if="row === 'comment'" :ref="setCommentRow" class="pg-approval-grid__row">
                <div class="pg-approval-grid__label">{{ commentLabel }}</div>
                <div class="pg-approval-grid__value pg-approval-grid__value--comment">
                  <a-textarea
                    :ref="setCommentInput"
                    v-model="form.comment"
                    placeholder="请输入"
                    :auto-size="{ minRows: 2, maxRows: 5 }"
                  />
                  <a-button type="primary" :loading="submitting" @click="handleSubmit">提交</a-button>
                </div>
              </div>

              <!-- 附件 -->
              <div v-else-if="row === 'attach'" class="pg-approval-grid__row">
                <div class="pg-approval-grid__label">附件</div>
                <div class="pg-approval-grid__value">
                  <a-upload v-model:file-list="form.files" :auto-upload="false" :limit="5" multiple>
                    <template #upload-button>
                      <a-button>
                        <template #icon><IconUpload /></template>
                        点击上传
                      </a-button>
                    </template>
                  </a-upload>
                </div>
              </div>

              <!-- 即将流向：只读文本 -->
              <div v-else-if="row === 'nextText'" class="pg-approval-grid__row">
                <div class="pg-approval-grid__label">即将流向</div>
                <div class="pg-approval-grid__value">{{ nextText }}</div>
              </div>

              <!-- 当前处理人 -->
              <div v-else-if="row === 'handler'" class="pg-approval-grid__row">
                <div class="pg-approval-grid__label">当前处理人</div>
                <div class="pg-approval-grid__value">{{ currentHandler || '—' }}</div>
              </div>
            </template>
          </div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="chart" title="流程图">
        <div class="pg-approval-process__pane">
          <!-- 流程图嵌入区域：占位容器，接入时把流程引擎的图渲染进来（保持等高避免布局跳动） -->
          <div class="pg-approval-chart" role="img" aria-label="流程图嵌入区域">
            <IconFlow class="pg-approval-chart__icon" />
            <p class="pg-approval-chart__title">流程图嵌入区域</p>
            <p class="pg-approval-chart__desc">
              接入时在此渲染流程引擎返回的流程图（节点 / 连线 / 当前位置高亮）
            </p>
          </div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="circulate" title="传阅记录">
        <div class="pg-approval-process__pane">
          <a-table
            :columns="circulateColumns"
            :data="circulateRows"
            row-key="key"
            :bordered="{ wrapper: true }"
            size="medium"
            :pagination="circulatePagination"
            :scroll="{ x: '100%' }"
            @page-change="onCirculatePageChange"
            @page-size-change="onCirculatePageSizeChange"
          />
        </div>
      </a-tab-pane>
    </a-tabs>

    <!-- ========== 以发起人身份操作 ========== -->
    <a-modal
      v-model:visible="originVisible"
      title="以发起人身份操作"
      title-align="start"
      :width="720"
      ok-text="提交"
      unmount-on-close
      @ok="submitOrigin"
    >
      <div class="pg-approval-grid">
        <div class="pg-approval-grid__row">
          <div class="pg-approval-grid__label">操作</div>
          <div class="pg-approval-grid__value">
            <a-radio-group v-model="originForm.action">
              <a-radio v-for="a in ORIGIN_ACTIONS" :key="a.value" :value="a.value">{{ a.label }}</a-radio>
            </a-radio-group>
          </div>
        </div>
        <div class="pg-approval-grid__row">
          <div class="pg-approval-grid__label">处理意见</div>
          <div class="pg-approval-grid__value">
            <a-textarea
              v-model="originForm.comment"
              placeholder="请输入"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
          </div>
        </div>
        <div class="pg-approval-grid__row">
          <div class="pg-approval-grid__label">当前处理人</div>
          <div class="pg-approval-grid__value">{{ currentHandler || '—' }}</div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.pg-approval-process {
  background: var(--color-bg-1);
  border-radius: var(--border-radius-large);
}

/* Tabs：只去掉 nav 的内边距，**保留 Arco 自带的下边框**（来自 .arco-tabs-nav::before，通栏一条）。
 * 注意不要再自己加 border-bottom，否则与 ::before 重复成两条线。 */
.pg-approval-process__tabs :deep(.arco-tabs-nav) {
  padding: 0;
}

/* 去掉 Arco 内容区默认的 padding-top: 16px（内边距由 __pane 统一控制） */
.pg-approval-process__tabs :deep(.arco-tabs-content) {
  padding-top: 0;
}

.pg-approval-process__pane {
  padding: 16px;
}

/* 显示审批记录 + 以发起人身份操作：同一行两端对齐 */
.pg-approval-process__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.pg-approval-process__table {
  margin-bottom: 16px;
}

/* 处理意见列：文本 + 附件链接竖排 */
.pg-approval-process__comment {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-start;
}

/* ===== 流程图嵌入区域（占位） ===== */
.pg-approval-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 320px;
  padding: 24px;
  color: var(--color-text-3);
  background: var(--color-fill-1);
  border: 1px dashed var(--color-border-3);
  border-radius: var(--border-radius-medium);
}

.pg-approval-chart__icon {
  font-size: 32px;
  color: var(--color-text-4);
}

.pg-approval-chart__title {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-2);
}

.pg-approval-chart__desc {
  margin: 0;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
}

/* ===== 处理区网格：左 label（灰底）+ 右内容 ===== */
.pg-approval-grid {
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-medium);
  overflow: hidden;
}

.pg-approval-grid__row {
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid var(--color-border-2);
}

.pg-approval-grid__row:last-child {
  border-bottom: none;
}

.pg-approval-grid__label {
  flex: none;
  width: 136px;
  padding: 11px 16px;
  font-size: 14px;
  line-height: 22px;
  color: var(--color-text-2);
  background: var(--color-fill-1);
  border-right: 1px solid var(--color-border-2);
}

.pg-approval-grid__value {
  flex: 1;
  min-width: 0;
  padding: 11px 16px;
  font-size: 14px;
  line-height: 22px;
  color: var(--color-text-1);
}

/* 处理意见行：textarea 占满 + 右侧提交按钮
 * align-items: stretch 让提交按钮高度始终与 textarea 一致（textarea 自适应高度会变化） */
.pg-approval-grid__value--comment {
  display: flex;
  align-items: stretch;
  gap: 12px;
}

.pg-approval-grid__value--comment :deep(.arco-textarea-wrapper) {
  flex: 1;
  min-width: 0;
}

/* 覆盖 Arco 按钮固定高度，交给 flex 拉伸 */
.pg-approval-grid__value--comment :deep(.arco-btn) {
  height: auto;
}

/* 选人行：入口 link + 已选人员标签 */
.pg-approval-grid__value--pick {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

/* 加签方式说明图标 */
.pg-approval-grid__tip {
  margin-left: 4px;
  color: var(--color-text-3);
}

/* 窄屏：label 列上移、处理意见换行 */
@media (max-width: 768px) {
  .pg-approval-grid__row {
    flex-direction: column;
  }

  .pg-approval-grid__label {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--color-border-2);
  }

  .pg-approval-grid__value--comment {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
