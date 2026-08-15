<script setup lang="ts">
/**
 * 详情页（示例）
 * ------------------------------------------------------------------
 * 查看已录入数据的场景（通常从列表页「查看详情」进入）。
 * 详情内容抽成 DetailContent.vue，**同一份内容可被三种容器复用**：
 *   ① 独立页面（本页）  ② a-drawer 抽屉  ③ a-modal 对话框
 * 页面壳只负责页头（返回 / 标题 / 删除·编辑）与滚动区。
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Message, Modal } from '@arco-design/web-vue';
import { IconLeft, IconEdit, IconDelete } from '@arco-iconbox/vue-pangea-mobile';
import DetailContent, { type DetailField, type DetailFile } from './DetailContent.vue';

const router = useRouter();
const pageTitle = '方案详情';

// ====== 详情数据（开发交付时改为按 id 拉接口） ======
const fields = ref<DetailField[]>([
  { label: '方案编号', value: 'FA2408200002', required: true },
  { label: '方案名称', value: '2024年品牌宣传计划', required: true },
  { label: '活动模板', value: '模板A', required: true },
  { label: '开始日期', value: '2024-08-01', required: true },
  { label: '结束日期', value: '2024-09-30', required: true },
  { label: '活动方案天数', value: 60 },
  { label: '负责人', value: '张三', required: true },
  { label: '方案申请金额', value: '1000000' },
  { label: '申请人', value: '张三' },
  { label: '创建时间', value: '2024-08-01' },
  {
    label: '方案说明',
    required: true,
    full: true,
    value:
      '24年8月品牌月方案，门店需将签单客户信息在活动有效期内报备至CRM系统中，必须管理总部品牌月活动方案，且报备状态为预签约或成单（含预签约、成单、安装中、安装完成状态订单），总部将在活动结束后导出7月20日–8月18日签单数据核算。',
  },
]);

const files = ref<DetailFile[]>([
  { name: '123.pdf' },
  { name: 'download.zip' },
  { name: '456.pptx' },
]);

const tableColumns = [
  { title: '编号', dataIndex: 'no' },
  { title: '指标名称', dataIndex: 'name' },
  { title: '指标说明', dataIndex: 'desc' },
  { title: '达标要求', dataIndex: 'target' },
  { title: '兑现金额', dataIndex: 'amount' },
];
const tableData = [
  { key: '1', no: '010226699', name: '播放量', desc: '播放量达到一定数量', target: '100000', amount: '4000.50' },
  { key: '2', no: '010226699', name: '播放量', desc: '播放量达到一定数量', target: '100000', amount: '8443.67' },
  { key: '3', no: '010226699', name: '播放量', desc: '播放量达到一定数量', target: '100000', amount: '4040.50' },
];

// ====== 页头操作 ======
function handleBack() {
  router.back();
}
function handleEdit() {
  Message.info('跳转编辑页（demo）');
}
function handleDelete() {
  // 确认类弹窗（删除确认 / 操作确认 / 风险提示）：Modal.* 默认 simple 模式，
  // Arco 已内置 `.arco-modal-simple { width: 400px }` —— 400 就是规范宽度，**不要再传 width 覆盖**。
  Modal.warning({
    title: '确认删除',
    content: '删除后不可恢复，确认删除该方案吗？',
    hideCancel: false,
    okButtonProps: { status: 'danger' },
    onOk: () => Message.success('已删除'),
  });
}

// ====== 同一份内容在抽屉 / 弹窗中复用（演示可复用性） ======
const drawerVisible = ref(false);
const modalVisible = ref(false);
</script>

<template>
  <div class="pg-detail">
    <!-- ========== 页头：返回 + 标题 + 删除/编辑 ========== -->
    <div class="pg-detail__header">
      <div class="pg-detail__header-left">
        <a-button type="text" @click="handleBack">
          <template #icon><IconLeft style="color: var(--color-text-1)" /></template>
        </a-button>
        <h2 class="pg-detail__title">{{ pageTitle }}</h2>
      </div>
      <div class="pg-detail__header-right">
        <!-- 演示：同一份详情内容也可用抽屉 / 弹窗承载 -->
        <a-button type="text" @click="drawerVisible = true">抽屉查看</a-button>
        <a-button type="text" @click="modalVisible = true">弹窗查看</a-button>
        <a-button status="danger" @click="handleDelete">
          <template #icon><IconDelete /></template>
          删除
        </a-button>
        <a-button @click="handleEdit">
          <template #icon><IconEdit /></template>
          编辑
        </a-button>
      </div>
    </div>

    <!-- ========== 内容区：唯一滚动区 ========== -->
    <div class="pg-detail__content">
      <DetailContent
        :fields="fields"
        :files="files"
        :table-columns="tableColumns"
        :table-data="tableData"
      />
    </div>

    <!-- ========== 复用容器 1：抽屉 ========== -->
    <a-drawer v-model:visible="drawerVisible" :width="720" :title="pageTitle" :footer="false" unmount-on-close>
      <!-- 抽屉较窄：显式降为 2 列（栅格断点看视口、不看容器宽度） -->
      <DetailContent
        embedded
        :cols="2"
        :fields="fields"
        :files="files"
        :table-columns="tableColumns"
        :table-data="tableData"
      />
    </a-drawer>

    <!-- ========== 复用容器 2：对话框 ==========
         宽度取 1000 档：详情内含**只读子表单表格**（宽组件），符合「只有含表格等宽组件时才用 1000」的约束。
         若弹窗里没有表格，应降到 720 或 520。 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="pageTitle"
      title-align="start"
      :width="1000"
      :footer="false"
      :body-style="{ maxHeight: '60vh', overflowY: 'auto' }"
      unmount-on-close
    >
      <DetailContent
        embedded
        :fields="fields"
        :files="files"
        :table-columns="tableColumns"
        :table-data="tableData"
      />
    </a-modal>
  </div>
</template>


<style scoped>
.pg-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  /* 本页背景：白底（Layout 内容区默认透明，背景由页面自己设置） */
  background: var(--color-bg-1);
}

/* 页头：单行，固定不滚动 */
.pg-detail__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-2);
  flex-shrink: 0;
  background: var(--color-bg-1);
}

.pg-detail__header-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pg-detail__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
  color: var(--color-text-1);
}

.pg-detail__header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 内容区：唯一滚动区（内边距由 DetailContent 自带） */
.pg-detail__content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
</style>
