<script setup lang="ts">
/**
 * 分组表单页（示例）
 * ------------------------------------------------------------------
 * 字段极多的长表单：折叠分组 + 右侧锚点导航 + 多样表单形态。
 */
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { IconLeft, IconFile } from '@arco-iconbox/vue-pangea-mobile';

const router = useRouter();
const pageTitle = '创建合同';

// 滚动容器引用（锚点定位用）
const scrollContainer = ref<HTMLElement>();

// ====== 表单数据模型 ======
const formRef = ref();
const form = reactive({
  contractNo: '',
  contractName: '',
  contractType: undefined,
  secretLevel: undefined,
  draftMethod: undefined,
  openContract: false,
  isElectronic: true,
  sealType: '合同章',
  legalSeal: false,
  paperNo: '',
  counterpartNo: '',
  remark: '',
  startDate: '',
  endDate: '',
  signDate: '',
  totalAmount: '',
  payMethod: 'A',
});

const rules = {
  contractName: [{ required: true, message: '请输入合同名称' }],
  contractType: [{ required: true, message: '请选择合同类型' }],
  secretLevel: [{ required: true, message: '请选择合同密级' }],
  draftMethod: [{ required: true, message: '请选择合同拟定方式' }],
  sealType: [{ required: true, message: '请选择实体盖章类型' }],
  startDate: [{ required: true, message: '请选择合同起始日期' }],
  endDate: [{ required: true, message: '请选择合同终止日期' }],
  signDate: [{ required: true, message: '请选择签约日期' }],
  totalAmount: [{ required: true, message: '请输入税价合计总金额' }],
  payMethod: [{ required: true, message: '请选择付款方式' }],
};

const typeOptions = [
  { value: 'purchase', label: '采购合同' },
  { value: 'sales', label: '销售合同' },
];

// ====== 子表单（签订依据） ======
const subRows = ref([
  { key: '1', input: 'Pangea', radio: '1', enabled: true },
  { key: '2', input: 'Pangea', radio: '2', enabled: false },
  { key: '3', input: 'Pangea', radio: '3', enabled: true },
]);
const subColumns = [
  { title: '输入框', dataIndex: 'input' },
  { title: '单选', dataIndex: 'radio' },
  { title: '开关', slotName: 'switch' },
];

// ====== 分组展开状态 ======
const activeKeys = ref(['basic', 'basis', 'detail']);

function handleSubmit() {
  formRef.value?.validate((errors: any) => {
    if (!errors) Message.success('提交成功');
  });
}
function handleBack() {
  router.back();
}
</script>

<template>
  <div class="pg-grouped-form">
    <!-- 顶部操作栏 -->
    <div class="pg-grouped-form__header">
      <div class="pg-grouped-form__header-left">
        <a-button type="text" @click="handleBack">
          <template #icon><IconLeft style="color: var(--color-text-1)" /></template>
        </a-button>
        <h2 class="pg-grouped-form__title">{{ pageTitle }}</h2>
      </div>
      <div class="pg-grouped-form__header-right">
        <a-button type="text">
          <template #icon><IconFile /></template>
          帮助文档
        </a-button>
        <a-button @click="handleBack">返回</a-button>
        <a-button type="primary" @click="handleSubmit">提交</a-button>
      </div>
    </div>

    <!-- 内容区：左表单 + 右锚点 -->
    <div class="pg-grouped-form__content">
      <!-- 左侧滚动主区 -->
      <div ref="scrollContainer" class="pg-grouped-form__main">
        <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
          <a-collapse v-model:active-key="activeKeys" :bordered="false" expand-icon-position="left">
            <!-- 分组 1：合同基本信息 -->
            <a-collapse-item key="basic" header="合同基本信息" id="group-basic">
              <a-row :gutter="16">
                <a-col :xs="24" :sm="12" :lg="8">
                  <a-form-item field="contractNo" label="合同编号">
                    <a-input v-model="form.contractNo" placeholder="请输入" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8">
                  <a-form-item field="contractName" label="合同名称">
                    <a-input v-model="form.contractName" placeholder="请输入" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8">
                  <a-form-item field="contractType" label="合同类型">
                    <a-select v-model="form.contractType" placeholder="请选择" :options="typeOptions" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8">
                  <a-form-item field="secretLevel" label="合同密级">
                    <a-select v-model="form.secretLevel" placeholder="请选择" :options="typeOptions" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8">
                  <a-form-item field="draftMethod" label="合同拟定方式">
                    <a-select v-model="form.draftMethod" placeholder="请选择" :options="typeOptions" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8">
                  <a-form-item field="openContract" label="开口合同">
                    <a-switch v-model="form.openContract" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8">
                  <a-form-item field="isElectronic" label="是否电签">
                    <a-switch v-model="form.isElectronic" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8">
                  <a-form-item field="sealType" label="实体盖章类型">
                    <a-select v-model="form.sealType" placeholder="请选择">
                      <a-option value="合同章">合同章</a-option>
                      <a-option value="公章">公章</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8">
                  <a-form-item field="legalSeal" label="加盖法人章">
                    <a-switch v-model="form.legalSeal" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8">
                  <a-form-item field="paperNo" label="纸质合同编号">
                    <a-input v-model="form.paperNo" placeholder="请输入" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8">
                  <a-form-item field="counterpartNo" label="对方合同编号">
                    <a-input v-model="form.counterpartNo" placeholder="请输入" />
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item field="remark" label="合同说明">
                    <a-textarea v-model="form.remark" placeholder="请输入" :auto-size="{ minRows: 2 }" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-collapse-item>

            <!-- 分组 2：签订依据（子表单表格） -->
            <a-collapse-item key="basis" header="签订依据" id="group-basis">
              <a-table
                :columns="subColumns"
                :data="subRows"
                :pagination="false"
                row-key="key"
                :bordered="{ wrapper: true }"
                size="medium"
              >
                <template #switch="{ record }">
                  {{ record.enabled ? '开启' : '关闭' }}
                </template>
              </a-table>
            </a-collapse-item>

            <!-- 分组 3：合同详情 -->
            <a-collapse-item key="detail" header="合同详情" id="group-detail">
              <a-row :gutter="16">
                <a-col :xs="24" :sm="12" :lg="8">
                  <a-form-item field="startDate" label="合同起始日期">
                    <a-date-picker v-model="form.startDate" placeholder="请选择日期" style="width: 100%" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8">
                  <a-form-item field="endDate" label="合同终止日期">
                    <a-date-picker v-model="form.endDate" placeholder="请选择日期" style="width: 100%" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8">
                  <a-form-item field="signDate" label="签约日期">
                    <a-date-picker v-model="form.signDate" placeholder="请选择日期" style="width: 100%" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8">
                  <a-form-item field="totalAmount" label="税价合计总金额">
                    <a-input v-model="form.totalAmount" placeholder="请输入" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :lg="8">
                  <a-form-item field="payMethod" label="付款方式">
                    <a-radio-group v-model="form.payMethod">
                      <a-radio value="A">A</a-radio>
                      <a-radio value="B">B</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-collapse-item>
          </a-collapse>
        </a-form>
      </div>

      <!-- 右侧锚点导航 -->
      <div class="pg-grouped-form__anchor">
        <a-anchor :scroll-container="scrollContainer" :bounds="20">
          <a-anchor-link href="#group-basic" title="合同基本信息" />
          <a-anchor-link href="#group-basis" title="签订依据" />
          <a-anchor-link href="#group-detail" title="合同详情" />
        </a-anchor>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pg-grouped-form {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* 顶部操作栏 */
.pg-grouped-form__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-2);
  flex-shrink: 0;
  background: var(--color-bg-1);
}

.pg-grouped-form__header-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pg-grouped-form__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
  margin: 0;
  line-height: 28px;
}

.pg-grouped-form__header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 内容区：左右布局 */
.pg-grouped-form__content {
  flex: 1;
  display: flex;
  gap: 24px;
  padding: 24px;
  min-height: 0;
  overflow: hidden;
}

/* 左侧主区：可滚动 */
.pg-grouped-form__main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}

/* 分组标题字号 */
.pg-grouped-form__main :deep(.arco-collapse-item-header-title) {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}

/* 隐藏分组头部下方边框线 */
.pg-grouped-form__main :deep(.arco-collapse-item-header) {
  border-bottom: none;
}

/* 分组之间 16px 间距 */
.pg-grouped-form__main :deep(.arco-collapse-item) {
  margin-bottom: 16px;
}

.pg-grouped-form__main :deep(.arco-collapse-item:last-child) {
  margin-bottom: 0;
}

/* 去掉分组内容区左右内边距 */
.pg-grouped-form__main :deep(.arco-collapse-item-content) {
  padding-left: 0;
  padding-right: 0;
}

/* 分组头部左侧内边距（对齐 caret 图标） */
.pg-grouped-form__main :deep(.arco-collapse-item-header-left) {
  padding-left: 20px;
}

/* caret 展开图标定位到最左 */
.pg-grouped-form__main :deep(.arco-collapse-item .arco-collapse-item-icon-hover) {
  left: 0;
}

/* 右侧锚点：固定不滚动 */
.pg-grouped-form__anchor {
  width: 150px;
  flex-shrink: 0;
}

/* 窄屏隐藏锚点导航（辅助导航，主表单纵向铺满） */
@media (max-width: 992px) {
  .pg-grouped-form__anchor {
    display: none;
  }
}
</style>
