<script setup lang="ts">
/**
 * 审批详情页（示例）
 * ------------------------------------------------------------------
 * 公司流程审批场景的**强制模板**。结构：
 *   页头（流程标题 + 状态 tag + 打印/传阅） + 提交人信息行
 *   左侧悬浮「快速审批」入口
 *   灰底 + 白卡分区：① 业务详情（复用详情页的 DetailContent）② 审批流程区（ApprovalProcess）
 *
 * 本版只做「基本页面结构」；快速审批抽屉、流程图、传阅记录、转办/加签选人等交互留待后续迭代（见 TODO）。
 */
import { onBeforeUnmount, ref, watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import {
  IconEdit,
  IconPrinter,
  IconSend,
  IconFullscreen,
  IconFullscreenExit,
} from '@arco-iconbox/vue-pangea-mobile';
// 业务详情区复用「详情页」模板的内容组件（复制本页时请连带 DetailPage/DetailContent.vue，
// 或替换为你自己的业务详情组件）
import DetailContent, { type DetailField, type DetailFile } from '../DetailPage/DetailContent.vue';
import ApprovalProcess, { type ApprovalRecord } from './ApprovalProcess.vue';

// ====== 流程头信息 ======
const flow = ref({
  title: '集团流程IT人人系列技术赋能培训合同',
  status: '审批中',
  applicant: '张益达',
  department: '基础架构与云服务管理部',
  submitTime: '2024-02-02 18:00:00',
});

// ====== 业务详情（开发交付时按流程实例 id 拉取） ======
const fields = ref<DetailField[]>([
  { label: '合同编号', value: 'HT2024020200018' },
  { label: '合同名称', value: 'IT人人系列技术赋能培训合同' },
  { label: '合同类型', value: '采购合同' },
  { label: '对方单位', value: '青岛某某科技有限公司' },
  { label: '合同金额（元）', value: '386,000.00' },
  { label: '签约日期', value: '2024-02-01' },
  { label: '合同起始日期', value: '2024-02-10' },
  { label: '合同终止日期', value: '2024-12-31' },
  { label: '付款方式', value: '分期付款' },
  {
    label: '合同说明',
    full: true,
    value:
      '面向集团全员的 IT 技术赋能培训，共 12 期，涵盖云原生、数据治理与 AI 应用三个方向；' +
      '按期验收付款，验收标准见附件《通用合同模板》。',
  },
]);
const files = ref<DetailFile[]>([{ name: '通用合同模板.docx' }, { name: '培训方案.pdf' }]);

// 业务详情里的只读子表单（指标）——与详情页同构
const detailColumns = [
  { title: '编号', dataIndex: 'no' },
  { title: '指标名称', dataIndex: 'name' },
  { title: '指标说明', dataIndex: 'desc' },
  { title: '达标要求', dataIndex: 'target' },
  { title: '兑现金额', dataIndex: 'amount' },
];
const detailTableData = [
  { key: '1', no: '010226699', name: '培训完成率', desc: '按期完成全部 12 期培训', target: '100%', amount: '4000.50' },
  { key: '2', no: '010226700', name: '参训人数', desc: '累计参训人数达标', target: '2000', amount: '8443.67' },
  { key: '3', no: '010226701', name: '满意度', desc: '课后问卷平均分', target: '≥ 4.5', amount: '4040.50' },
];

// ====== 审批记录 ======
const records = ref<ApprovalRecord[]>([
  { key: '1', time: '2024-04-09 11:22:14', node: '发起节点', operator: '张益达', action: '提交', comment: '提交' },
  {
    key: '2',
    time: '2024-04-14 04:41:11',
    node: '部门长',
    operator: '李鹏',
    action: '同意',
    comment: '同意。使用对方提供合同模板，金额和税额描述符合集团规定。',
    attachment: '通用合同模板.docx',
  },
  { key: '3', time: '2024-04-14 15:46:43', node: '部门副总经理', operator: '赵鹏', action: '同意', comment: '同意' },
  { key: '4', time: '2024-04-20 14:48:40', node: '部门总经理', operator: '周家福', action: '同意', comment: '同意' },
]);

const nextNode = 'LDAP负责人审批：李敏,孙铭阳';
const currentHandler = '项目负责人审批：张益达,吴迪';

// ====== 页头操作（本版占位） ======
function handlePrint() {
  // TODO 后续迭代：调用打印视图 / 导出 PDF
  Message.info('打印（demo）');
}
// 传阅：选人 + 邮件通知说明。对象为**多选**，未选中时「确定」禁用
const circulateVisible = ref(false);
const circulateTargets = ref<string[]>([]);
// TODO 开发交付时替换为组织架构选人接口（远程搜索 / 树选择）
const circulateCandidates = ['张益达', '吴迪', '李鹏', '赵鹏', '周家福', '李敏', '孙铭阳'];
function handleCirculate() {
  circulateTargets.value = [];
  circulateVisible.value = true;
}
function handleCirculateOk() {
  Message.success(`已传阅给 ${circulateTargets.value.join('、')}（demo）`);
  circulateVisible.value = false;
}
// 快速审批：滚动定位到「处理意见」并聚焦（长页面免手动下拉）
const processRef = ref<{ focusComment: () => void }>();
function handleQuickApprove() {
  processRef.value?.focusComment();
}

// ====== 全屏（沉浸）模式 ======
// 审批页常从邮件 / 待办等入口直接打开，此时看不到全局 Layout 的导航。
// 全屏模式用 fixed 铺满视口盖住 Layout，用来预览这类入口下的真实效果。
const isFullscreen = ref(false);
function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') isFullscreen.value = false;
}
watch(isFullscreen, (on) => {
  if (on) document.addEventListener('keydown', onKeydown);
  else document.removeEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
  <!-- 全屏时把整页 teleport 到 body：全局 Layout 的内容区是 position:relative + z-index:1，
       会形成层叠上下文，光靠子元素 z-index 盖不住侧边栏；移出该上下文才可靠。 -->
  <Teleport to="body" :disabled="!isFullscreen">
    <div class="pg-approval" :class="{ 'is-fullscreen': isFullscreen }">
    <!-- ========== 页头：标题 + 状态 + 操作；第二行提交人信息 ========== -->
    <div class="pg-approval__header">
      <div class="pg-approval__head-row">
        <div class="pg-approval__title-wrap">
          <h2 class="pg-approval__title">{{ flow.title }}</h2>
          <a-tag color="arcoblue">{{ flow.status }}</a-tag>
        </div>
        <a-space :size="8">
          <!-- 全屏：预览「从邮件/待办直接进入、看不到全局导航」时的效果（Esc 退出） -->
          <a-button size="small" @click="toggleFullscreen">
            <template #icon>
              <IconFullscreenExit v-if="isFullscreen" />
              <IconFullscreen v-else />
            </template>
            {{ isFullscreen ? '退出全屏' : '全屏' }}
          </a-button>
          <a-button size="small" @click="handlePrint">
            <template #icon><IconPrinter /></template>
            打印
          </a-button>
          <a-button size="small" @click="handleCirculate">
            <template #icon><IconSend /></template>
            传阅
          </a-button>
        </a-space>
      </div>

      <div class="pg-approval__desc">
        <a-avatar :size="24">{{ flow.applicant.charAt(0) }}</a-avatar>
        <span class="pg-approval__applicant">{{ flow.applicant }}</span>
        <span class="pg-approval__dept">{{ flow.department }}</span>
        <span class="pg-approval__divider" aria-hidden="true"></span>
        <span class="pg-approval__submit">提交于 {{ flow.submitTime }}</span>
      </div>
    </div>

    <!-- ========== 内容区：灰底 + 白卡分区（唯一滚动区） ========== -->
    <div class="pg-approval__body">
      <!-- 左侧悬浮「快速审批」入口 -->
      <button class="pg-approval__quick" type="button" aria-label="快速审批" @click="handleQuickApprove">
        <IconEdit />
        <span class="pg-approval__quick-text">快速审批</span>
      </button>

      <div class="pg-approval__main">
        <!-- 白卡 1：业务详情（复用详情页内容组件，含只读子表单「指标」） -->
        <section class="pg-approval__card">
          <DetailContent
            embedded
            class="pg-approval__detail"
            :fields="fields"
            :files="files"
            :table-columns="detailColumns"
            :table-data="detailTableData"
          />
        </section>

        <!-- 白卡 2：审批流程区 -->
        <ApprovalProcess
          ref="processRef"
          :records="records"
          :next-node="nextNode"
          :current-handler="currentHandler"
        />
        </div>
      </div>

      <!-- ========== 传阅对话框 ========== -->
      <a-modal
        v-model:visible="circulateVisible"
        title="传阅"
        title-align="start"
        :width="520"
        ok-text="确定"
        cancel-text="取消"
        :ok-button-props="{ disabled: circulateTargets.length === 0 }"
        @ok="handleCirculateOk"
      >
        <div class="pg-approval__field">
          <span class="pg-approval__field-label">
            <em aria-hidden="true">*</em>
            传阅对象
          </span>
          <a-select
            v-model="circulateTargets"
            multiple
            allow-clear
            :max-tag-count="3"
            placeholder="请选择"
          >
            <a-option v-for="name in circulateCandidates" :key="name" :value="name">
              {{ name }}
            </a-option>
          </a-select>
        </div>
        <a-alert type="info" class="pg-approval__field-tip">
          系统会通过「邮件」告知传阅对象
        </a-alert>
      </a-modal>
    </div>
  </Teleport>
</template>

<style scoped>
.pg-approval {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  /* 本页是「多区块聚合页」：保持内容区透明漏出 body 灰底，区块用白卡区隔 */
}

/* 全屏（沉浸）模式：铺满视口盖住全局 Layout，模拟从邮件/待办直接打开的形态。
 * 脱离 Layout 后拿不到它的灰底，需在这里自己补上 */
.pg-approval.is-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 1000;
  height: 100vh;
  background: var(--color-fill-2);
}

/* ========== 页头（白底，固定不滚动） ========== */
.pg-approval__header {
  flex-shrink: 0;
  padding: 20px 24px 16px;
  background: var(--color-bg-1);
  border-bottom: 1px solid var(--color-border-2);
}

.pg-approval__head-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.pg-approval__title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.pg-approval__title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  color: var(--color-text-1);
  overflow-wrap: anywhere;
}

/* 提交人信息行 */
.pg-approval__desc {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 14px;
  line-height: 22px;
  flex-wrap: wrap;
}

.pg-approval__applicant {
  color: var(--color-text-1);
}

.pg-approval__dept,
.pg-approval__submit {
  color: var(--color-text-3);
}

.pg-approval__divider {
  width: 1px;
  height: 14px;
  background: var(--color-border-3);
}

/* ========== 内容区 ========== */
.pg-approval__body {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px 24px 24px;
}

.pg-approval__main {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 白卡 */
.pg-approval__card {
  background: var(--color-bg-1);
  border-radius: var(--border-radius-large);
  padding: 16px;
}

/* ========== 传阅对话框 ========== */
.pg-approval__field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pg-approval__field-label {
  flex-shrink: 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--color-text-2);
}

.pg-approval__field-label em {
  margin-right: 4px;
  font-style: normal;
  color: rgb(var(--danger-6));
}

.pg-approval__field-tip {
  margin-top: 16px;
}

/* ========== 左侧悬浮「快速审批」 ========== */
.pg-approval__quick {
  position: sticky;
  top: 0;
  float: left;
  /* 内容区左内边距是 24px：抵消 24 再留 8，使书签左右各与边缘/白卡保持 8px */
  margin-left: -16px;
  margin-right: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 32px;
  padding: 8px 6px 12px;
  font-size: 14px;
  color: var(--color-white);
  background: rgb(var(--primary-6));
  border: none;
  /* 下方切角，形成书签形状 */
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), 50% 100%, 0 calc(100% - 8px));
  border-radius: var(--border-radius-small) var(--border-radius-small) 0 0;
  cursor: pointer;
  z-index: 1;
}

.pg-approval__quick:hover {
  background: rgb(var(--primary-5));
}

.pg-approval__quick-text {
  /* 竖排文字 */
  writing-mode: vertical-rl;
  letter-spacing: 2px;
  line-height: 1;
}

/* 窄屏：悬浮入口不占位，改为普通按钮流式排布 */
@media (max-width: 992px) {
  .pg-approval__quick {
    position: static;
    float: none;
    margin: 0 0 12px;
    width: auto;
    flex-direction: row;
    justify-content: center;
    padding: 8px 16px;
    clip-path: none;
    border-radius: var(--border-radius-medium);
  }

  .pg-approval__quick-text {
    writing-mode: horizontal-tb;
    letter-spacing: normal;
  }
}
</style>
