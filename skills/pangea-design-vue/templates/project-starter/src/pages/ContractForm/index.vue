<script setup lang="ts">
/**
 * 基础表单页（示例）
 * ------------------------------------------------------------------
 * 字段较多的独立数据录入/编辑页。垂直表单 + 多列栅格 + 子表单。
 */
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { IconLeft, IconQuestionCircle, IconFile, IconPlus, IconMore } from '@arco-iconbox/vue-pangea-mobile';

const router = useRouter();

// ====== 页面标题 ======
const pageTitle = '创建合同';

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
  startDate: '',
  endDate: '',
  signDate: '',
  totalAmount: '',
  payMethod: 'A',
});

// ====== 校验规则 ======
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

// ====== 下拉选项（mock） ======
const contractTypeOptions = [
  { value: 'purchase', label: '采购合同' },
  { value: 'sales', label: '销售合同' },
];
const secretOptions = [
  { value: 'public', label: '公开' },
  { value: 'internal', label: '内部' },
  { value: 'secret', label: '机密' },
];

// ====== 子表单（签订依据） ======
interface SubRow {
  key: string;
  input: string;
  select?: string;
  enabled: boolean;
}
let subRowSeq = 0;
const subRows = ref<SubRow[]>([
  { key: String(++subRowSeq), input: '', select: undefined, enabled: true },
  { key: String(++subRowSeq), input: '', select: undefined, enabled: true },
  { key: String(++subRowSeq), input: '', select: undefined, enabled: true },
]);
const subColumns = [
  { title: '序号', slotName: 'index', width: 80 },
  { title: '输入框', slotName: 'input' },
  { title: '下拉单选', slotName: 'select' },
  { title: '开关', slotName: 'switch', width: 120 },
  { title: '操作', slotName: 'actions', width: 80, align: 'center' as const },
];
function addSubRow() {
  subRows.value.push({ key: String(++subRowSeq), input: '', select: undefined, enabled: true });
}
function removeSubRow(key: string) {
  subRows.value = subRows.value.filter((r) => r.key !== key);
}

// ====== 提交 / 返回 ======
function handleSubmit() {
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      Message.success('提交成功');
    }
  });
}
function handleBack() {
  router.back();
}
</script>

<template>
  <div class="pg-form-page">
    <!-- 顶部操作栏 -->
    <div class="pg-form-page__header">
      <div class="pg-form-page__header-left">
        <a-button type="text" class="pg-form-page__back-btn" @click="handleBack">
          <template #icon>
            <IconLeft style="color: var(--color-text-1)" />
          </template>
        </a-button>
        <h2 class="pg-form-page__title">{{ pageTitle }}</h2>
      </div>
      <div class="pg-form-page__header-right">
        <a-button type="text">
          <template #icon><IconFile /></template>
          帮助文档
        </a-button>
        <a-button @click="handleBack">返回</a-button>
        <a-button type="primary" @click="handleSubmit">提交</a-button>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="pg-form-page__content">
      <!-- 提示（可选） -->
      <a-alert type="warning" style="margin-bottom: 12px">
        这里是提示信息，说明填写规则或注意事项。
      </a-alert>

      <!-- 表单 -->
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        layout="vertical"
      >
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item field="contractNo" label="合同编号">
              <a-input v-model="form.contractNo" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="contractName" label="合同名称">
              <a-input v-model="form.contractName" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="contractType" label="合同类型">
              <a-select v-model="form.contractType" placeholder="请选择" :options="contractTypeOptions" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item field="secretLevel" label="合同密级">
              <a-select v-model="form.secretLevel" placeholder="请选择" :options="secretOptions" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="draftMethod" label="合同拟定方式">
              <a-select v-model="form.draftMethod" placeholder="请选择" :options="contractTypeOptions" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="openContract">
              <template #label>
                开口合同
                <a-tooltip content="开口合同说明">
                  <IconQuestionCircle style="margin-left: 4px; color: var(--color-text-3)" />
                </a-tooltip>
              </template>
              <a-switch v-model="form.openContract" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item field="isElectronic" label="是否电签">
              <a-switch v-model="form.isElectronic" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="sealType" label="实体盖章类型">
              <a-select v-model="form.sealType" placeholder="请选择">
                <a-option value="合同章">合同章</a-option>
                <a-option value="公章">公章</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="legalSeal" label="加盖法人章">
              <a-switch v-model="form.legalSeal" />
            </a-form-item>
          </a-col>

          <!-- 子表单：整行 -->
          <a-col :span="24">
            <a-form-item label="签订依据">
              <div style="width: 100%">
                <a-table
                  :columns="subColumns"
                  :data="subRows"
                  :pagination="false"
                  row-key="key"
                  :bordered="{ wrapper: true }"
                  size="medium"
                >
                  <template #index="{ rowIndex }">{{ rowIndex + 1 }}</template>
                  <template #input="{ record }">
                    <a-input v-model="record.input" placeholder="请输入" />
                  </template>
                  <template #select="{ record }">
                    <a-select v-model="record.select" placeholder="请选择" :options="contractTypeOptions" />
                  </template>
                  <template #switch="{ record }">
                    <a-switch v-model="record.enabled" size="small" />
                  </template>
                  <template #actions="{ record }">
                    <a-dropdown>
                      <a-button type="text" size="mini">
                        <template #icon><IconMore /></template>
                      </a-button>
                      <template #content>
                        <a-doption @click="removeSubRow(record.key)">删除</a-doption>
                      </template>
                    </a-dropdown>
                  </template>
                </a-table>
                <a-button style="margin-top: 8px" @click="addSubRow">
                  <template #icon><IconPlus /></template>
                  新增一项
                </a-button>
              </div>
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item field="startDate" label="合同起始日期">
              <a-date-picker v-model="form.startDate" placeholder="请选择日期" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="endDate" label="合同终止日期">
              <a-date-picker v-model="form.endDate" placeholder="请选择日期" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="signDate" label="签约日期">
              <a-date-picker v-model="form.signDate" placeholder="请选择日期" style="width: 100%" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item field="totalAmount" label="税价合计总金额">
              <a-input v-model="form.totalAmount" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="payMethod" label="付款方式">
              <a-radio-group v-model="form.payMethod">
                <a-radio value="A">A</a-radio>
                <a-radio value="B">B</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<style scoped>
.pg-form-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* 顶部操作栏 */
.pg-form-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-2);
  flex-shrink: 0;
  background: var(--color-bg-1);
}

.pg-form-page__header-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pg-form-page__back-btn {
  padding: 0;
}

.pg-form-page__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
  margin: 0;
  line-height: 28px;
}

.pg-form-page__header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 内容区 */
.pg-form-page__content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>
