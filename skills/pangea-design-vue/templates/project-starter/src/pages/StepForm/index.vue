<script setup lang="ts">
/**
 * 分步表单页（示例）
 * ------------------------------------------------------------------
 * 大型、复杂数据录入场景：页头步骤条（a-steps）驱动分步录入，每步内部再用折叠分组
 * （a-collapse）承载多种录入交互（输入/选择/开关/日期/单选/文本域/子表单表格/上传），
 * 逐步校验、最后一步复核提交。
 */
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { IconLeft, IconFile, IconPlus, IconDelete } from '@arco-iconbox/vue-pangea-mobile';

const router = useRouter();
const pageTitle = '创建合同';

// ====== 步骤定义 ======
// fields：该步需要校验的字段（进入下一步前只校验当前步，避免误报后续步骤）
const steps = [
  { key: 'basic', title: '合同信息', description: '填写合同基本信息', fields: ['contractName', 'contractType', 'secretLevel', 'draftMethod', 'sealType', 'startDate', 'endDate', 'signDate', 'totalAmount', 'payMethod'] },
  { key: 'detail', title: '明细与附件', description: '录入明细、上传附件', fields: ['attachments'] },
  { key: 'confirm', title: '确认提交', description: '核对信息后提交', fields: [] },
];
const current = ref(1); // a-steps 从 1 开始
const isFirst = computed(() => current.value === 1);
const isLast = computed(() => current.value === steps.length);

// ====== 表单数据模型 ======
const formRef = ref();
const form = reactive({
  // 步骤 1
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
  // 步骤 2
  attachments: [] as any[],
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
const levelOptions = [
  { value: 'public', label: '公开' },
  { value: 'secret', label: '秘密' },
];

// 复核步骤展示用：把选项 value 反查成 label（复核要给人看文案，不是原始码值）
function labelOf(options: { value: string; label: string }[], value?: string) {
  return options.find((o) => o.value === value)?.label || value || '—';
}

// ====== 分组展开状态（每步独立） ======
const activeKeys = ref(['basic', 'basis', 'detail']);
const activeKeys2 = ref(['items', 'files']);

// ====== 只读子表单（签订依据） ======
const basisRows = ref([
  { key: '1', input: 'Pangea', radio: '1', enabled: true },
  { key: '2', input: 'Pangea', radio: '2', enabled: false },
  { key: '3', input: 'Pangea', radio: '3', enabled: true },
]);
const basisColumns = [
  { title: '输入框', dataIndex: 'input' },
  { title: '单选', dataIndex: 'radio' },
  { title: '开关', slotName: 'enabled' },
];

// ====== 可编辑子表单（合同明细，行内录入） ======
let seq = 2;
const itemRows = ref([{ key: '1', name: '', spec: undefined, qty: 1, amount: '' }]);
const itemColumns = [
  { title: '物料名称', slotName: 'name' },
  { title: '规格', slotName: 'spec' },
  { title: '数量', slotName: 'qty', width: 140 },
  { title: '金额（元）', slotName: 'amount' },
  { title: '操作', slotName: 'op', width: 90, align: 'center' as const },
];
function addItem() {
  itemRows.value.push({ key: String(seq++), name: '', spec: undefined, qty: 1, amount: '' });
}
function removeItem(key: string) {
  if (itemRows.value.length === 1) {
    Message.warning('至少保留一行明细');
    return;
  }
  itemRows.value = itemRows.value.filter((r) => r.key !== key);
}

// ====== 步骤流转 ======
async function next() {
  const fields = steps[current.value - 1].fields;
  if (fields.length) {
    const errors = await formRef.value?.validate(fields);
    if (errors) {
      Message.warning('请先补全当前步骤的必填项');
      return;
    }
  }
  if (current.value < steps.length) current.value += 1;
}
function prev() {
  if (current.value > 1) current.value -= 1;
}
async function handleSubmit() {
  const errors = await formRef.value?.validate();
  if (errors) {
    Message.warning('存在未填写完整的必填项');
    return;
  }
  Message.success('提交成功');
}
function handleBack() {
  router.back();
}
</script>

<template>
  <div class="pg-step-form">
    <!-- ========== 页头：操作栏 + 步骤条 ========== -->
    <div class="pg-step-form__header">
      <div class="pg-step-form__bar">
        <div class="pg-step-form__bar-left">
          <a-button type="text" @click="handleBack">
            <template #icon><IconLeft style="color: var(--color-text-1)" /></template>
          </a-button>
          <h2 class="pg-step-form__title">{{ pageTitle }}</h2>
        </div>
        <div class="pg-step-form__bar-right">
          <a-button type="text">
            <template #icon><IconFile /></template>
            帮助文档
          </a-button>
          <!-- 第一步没有「上一步」可去 → 直接不渲染（而不是渲染成禁用态，避免出现永远点不动的按钮） -->
          <a-button v-if="!isFirst" @click="prev">上一步</a-button>
          <a-button v-if="!isLast" type="primary" @click="next">下一步</a-button>
          <a-button v-else type="primary" @click="handleSubmit">提交</a-button>
        </div>
      </div>

      <!-- 步骤条：小尺寸、只留标题（不带描述），居中最大 900px -->
      <div class="pg-step-form__steps">
        <!-- 小尺寸用布尔属性 `small`（Arco Steps 没有 size 属性，写 size="small" 不生效） -->
        <a-steps :current="current" small class="pg-step-form__steps-inner">
          <a-step v-for="s in steps" :key="s.key">{{ s.title }}</a-step>
        </a-steps>
      </div>
    </div>

    <!-- ========== 内容区：仅渲染当前步骤 ========== -->
    <div class="pg-step-form__content">
      <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
        <!-- ---------- 步骤 1：合同信息 ---------- -->
        <a-collapse
          v-show="current === 1"
          v-model:active-key="activeKeys"
          :bordered="false"
          expand-icon-position="left"
        >
          <a-collapse-item key="basic" header="合同基本信息">
            <a-row :gutter="20">
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
                  <a-select v-model="form.secretLevel" placeholder="请选择" :options="levelOptions" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12" :lg="8">
                <a-form-item field="draftMethod" label="合同拟定方式">
                  <a-select v-model="form.draftMethod" placeholder="请选择" :options="typeOptions" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12" :lg="8">
                <a-form-item field="openContract" label="开口合同" tooltip="开口合同：金额或数量可后续追加">
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

          <!-- 只读子表单表格 -->
          <a-collapse-item key="basis" header="签订依据">
            <a-table
              :columns="basisColumns"
              :data="basisRows"
              :pagination="false"
              row-key="key"
              :bordered="{ wrapper: true }"
              size="medium"
            >
              <template #enabled="{ record }">{{ record.enabled ? '开启' : '关闭' }}</template>
            </a-table>
          </a-collapse-item>

          <a-collapse-item key="detail" header="合同详情">
            <a-row :gutter="20">
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

        <!-- ---------- 步骤 2：明细与附件（可编辑子表单 + 上传） ---------- -->
        <a-collapse
          v-show="current === 2"
          v-model:active-key="activeKeys2"
          :bordered="false"
          expand-icon-position="left"
        >
          <a-collapse-item key="items" header="合同明细">
            <a-table
              :columns="itemColumns"
              :data="itemRows"
              :pagination="false"
              row-key="key"
              :bordered="{ wrapper: true }"
            >
              <template #name="{ record }">
                <a-input v-model="record.name" placeholder="请输入" />
              </template>
              <template #spec="{ record }">
                <a-select v-model="record.spec" placeholder="请选择" :options="typeOptions" />
              </template>
              <template #qty="{ record }">
                <a-input-number v-model="record.qty" :min="1" />
              </template>
              <template #amount="{ record }">
                <a-input v-model="record.amount" placeholder="请输入" />
              </template>
              <template #op="{ record }">
                <a-button type="text" status="danger" size="mini" @click="removeItem(record.key)">
                  <template #icon><IconDelete /></template>
                </a-button>
              </template>
            </a-table>
            <a-button class="pg-step-form__add" long type="dashed" @click="addItem">
              <template #icon><IconPlus /></template>
              添加明细
            </a-button>
          </a-collapse-item>

          <a-collapse-item key="files" header="附件">
            <a-form-item field="attachments" label="合同附件" :show-colon="false">
              <a-upload v-model:file-list="form.attachments" :auto-upload="false" :limit="5" multiple />
            </a-form-item>
          </a-collapse-item>
        </a-collapse>

        <!-- ---------- 步骤 3：确认提交（只读复核） ---------- -->
        <div v-show="current === 3" class="pg-step-form__confirm">
          <a-descriptions title="合同基本信息" :column="{ xs: 1, sm: 2, lg: 3 }" bordered>
            <a-descriptions-item label="合同编号">{{ form.contractNo || '—' }}</a-descriptions-item>
            <a-descriptions-item label="合同名称">{{ form.contractName || '—' }}</a-descriptions-item>
            <a-descriptions-item label="合同类型">{{ labelOf(typeOptions, form.contractType) }}</a-descriptions-item>
            <a-descriptions-item label="合同密级">{{ labelOf(levelOptions, form.secretLevel) }}</a-descriptions-item>
            <a-descriptions-item label="是否电签">{{ form.isElectronic ? '是' : '否' }}</a-descriptions-item>
            <a-descriptions-item label="实体盖章类型">{{ form.sealType || '—' }}</a-descriptions-item>
          </a-descriptions>
          <a-descriptions
            class="pg-step-form__confirm-block"
            title="合同详情"
            :column="{ xs: 1, sm: 2, lg: 3 }"
            bordered
          >
            <a-descriptions-item label="合同起始日期">{{ form.startDate || '—' }}</a-descriptions-item>
            <a-descriptions-item label="合同终止日期">{{ form.endDate || '—' }}</a-descriptions-item>
            <a-descriptions-item label="签约日期">{{ form.signDate || '—' }}</a-descriptions-item>
            <a-descriptions-item label="税价合计总金额">{{ form.totalAmount || '—' }}</a-descriptions-item>
            <a-descriptions-item label="付款方式">{{ form.payMethod }}</a-descriptions-item>
            <a-descriptions-item label="明细行数">{{ itemRows.length }}</a-descriptions-item>
          </a-descriptions>
        </div>
      </a-form>
    </div>
  </div>
</template>

<style scoped>
.pg-step-form {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  /* 本页背景：白底（内容区默认透明，需页面自己设置） */
  background: var(--color-bg-1);
}

/* ========== 页头（操作栏 + 步骤条），固定不滚动 ========== */
.pg-step-form__header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-2);
  flex-shrink: 0;
  background: var(--color-bg-1);
}

.pg-step-form__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.pg-step-form__bar-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pg-step-form__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
  color: var(--color-text-1);
}

.pg-step-form__bar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 步骤条：整体居中，最大 900px */
.pg-step-form__steps {
  display: flex;
  justify-content: center;
}

.pg-step-form__steps-inner {
  width: 100%;
  max-width: 900px;
}

/* ========== 内容区：唯一滚动区 ========== */
.pg-step-form__content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 24px;
}

/* 分组标题 16px semibold */
.pg-step-form__content :deep(.arco-collapse-item-header-title) {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}

/* 隐藏分组头部下方边框线 */
.pg-step-form__content :deep(.arco-collapse-item-header) {
  border-bottom: none;
}

/* 分组之间 16px 间距 */
.pg-step-form__content :deep(.arco-collapse-item) {
  margin-bottom: 16px;
}

.pg-step-form__content :deep(.arco-collapse-item:last-child) {
  margin-bottom: 0;
}

/* 去掉分组内容区左右内边距 */
.pg-step-form__content :deep(.arco-collapse-item-content) {
  padding-left: 0;
  padding-right: 0;
}

/* 分组头部左侧内边距（对齐 caret 图标） */
.pg-step-form__content :deep(.arco-collapse-item-header-left) {
  padding-left: 20px;
}

/* caret 展开图标定位到最左 */
.pg-step-form__content :deep(.arco-collapse-item .arco-collapse-item-icon-hover) {
  left: 0;
}

/* 可编辑子表单：添加行按钮 */
.pg-step-form__add {
  margin-top: 12px;
}

/* 确认步骤 */
.pg-step-form__confirm-block {
  margin-top: 24px;
}
</style>
