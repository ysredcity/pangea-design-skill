---
name: pangea-page-form
description: "基础表单页模板。适用于字段较多、需要独立页面进行数据录入/编辑的场景（如创建/编辑业务单据）。结构：顶部操作栏（返回+标题+提交）+ 可选提示 + 垂直表单（多列栅格，含 input/select/switch/datepicker/radio/子表单）。当需要独立页面录入大量表单字段时使用此模板。"
user-invocable: true
---

# 基础表单页模板

适用场景：字段较多、需要**独立页面**进行数据录入或编辑的场景（如"创建合同""编辑商品"等业务单据）。

## 页面结构

```
┌─────────────────────────────────────────────────────────┐
│ ‹ 创建合同              📄帮助文档  [返回]  [提交]         │  ← 顶部操作栏（sticky）
├─────────────────────────────────────────────────────────┤
│ ⚠ 提示信息（可选 Alert）                                   │
│                                                            │
│ 合同编号          * 合同名称        * 合同类型             │  ← 垂直表单（3列）
│ [请输入      ]     [请输入      ]    [请选择      ▾]       │
│                                                            │
│ * 合同密级        * 合同拟定方式      开口合同 ⓘ           │
│ [请选择      ▾]    [请选择      ▾]    [ ○ ]  (switch)      │
│                                                            │
│ 签订依据                                                   │  ← 子表单（整行，可编辑表格）
│ ┌────────────────────────────────────────────────────┐  │
│ │ ⠿ 序号  输入框        下拉单选      开关      操作   │  │
│ │ ⠿ 1    [请输入]      [请选择▾]    ●        ⋯      │  │
│ │ [+ 新增一项]                                        │  │
│ └────────────────────────────────────────────────────┘  │
│                                                            │
│ * 合同起始日期    * 合同终止日期     * 签约日期            │
│ [请选择日期  📅]   [请选择日期 📅]   [请选择日期 📅]      │
└─────────────────────────────────────────────────────────┘
```

## 设计规范

### 顶部操作栏（page-header）
- 内边距：`12px 16px`，下边框 `1px solid var(--color-border-2)`
- 左侧：返回图标按钮（**文本按钮 `type="text"`**，图标 `IconLeft` 自定义颜色为 `var(--color-text-1)`）+ 标题（`18px semibold`，`color: #000` / `color-text-1`）
- 右侧：帮助文档（**文本按钮 `type="text"` + `IconFile` 图标**，可选）+ 返回按钮（默认）+ 提交按钮（`type="primary"`），`gap: 8px`
- **操作栏按钮统一使用默认尺寸**（含返回文本按钮）
- **固定在顶部**：操作栏 `flex-shrink: 0`，只有内容区滚动（全局 Layout 已固定视口高度，顶部导航不参与滚动）

### 表单内容区（content）
- 内边距：`24px`
- Alert 提示（可选）：整宽，`type="warning"`，与表单间距 `12px`
- **表单采用垂直布局**（label 在字段上方）：`layout="vertical"`
- **多列栅格**：默认 3 列，字段间距 `24px`（水平+垂直 gutter）
- 每个字段宽度自适应（栅格 `span`），单字段约 `381px`
- **必填标记**：label 前红色星号（Arco Form 的 required 自动渲染）
- 字段类型齐全：`a-input`、`a-select`、`a-switch`、`a-date-picker`、`a-radio-group`、`a-input-number` 等
- **控件尺寸**：与列表页保持一致，操作栏按钮用默认尺寸；表单内控件用默认尺寸（表单页字段是主体，不需要 small）

### 子表单（可编辑表格，可选）
- 占整行（`span=24`）
- 使用 `<a-table>` + 可编辑单元格（插槽内放 `a-input`/`a-select`/`a-switch`）
- 支持拖拽排序（`draggable`）、行操作（删除等）
- 底部「新增一项」按钮

## Vue 代码模板

```vue
<script setup lang="ts">
/**
 * 基础表单页
 * ------------------------------------------------------------------
 * 字段较多的独立数据录入/编辑页。垂直表单 + 多列栅格 + 子表单。
 * 复制此模板到 src/pages/<PageName>/index.vue，修改字段定义即可。
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
      // TODO: 交付时替换为接口请求
      Message.success('提交成功');
      router.back();
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
            <a-form-item field="openContract" label="开口合同">
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
```

## 使用要点

1. **复制到 `src/pages/<PageName>/index.vue`**，修改 `pageTitle`、`form` 数据模型、`rules` 校验规则、字段定义。
2. **垂直表单**：`<a-form layout="vertical">` — label 在字段上方，适合字段多的录入页。
3. **多列栅格**：用 `<a-row :gutter="24">` + `<a-col :span="8">` 实现 3 列布局。字段较少时可用 `:span="12"`（2列）。
4. **必填标记**：在 `rules` 中定义 `required: true`，Arco Form 会自动在 label 前渲染红色星号，不要手动加。
5. **顶部操作栏固定**：header `flex-shrink: 0`，content `overflow-y: auto`，长表单滚动时操作栏保持可见。
6. **提交校验**：`formRef.value.validate()` 校验通过后再提交。
7. **子表单（可编辑表格）**：用 `<a-table>` + 单元格插槽放输入控件，配合「新增一项」按钮和行删除操作。字段不需要子表单时整块移除。
8. **日期选择器**：`<a-date-picker style="width: 100%">` 让其撑满栅格列宽。
9. **带说明的 label**：用 `#label` 插槽 + `<a-tooltip>` + 问号图标实现（如"开口合同"）。
10. **mock 数据**：PM demo 用内存数据；开发交付时 `handleSubmit` 换成接口请求、下拉选项换成接口拉取。
11. **Layout 无 padding**：全局 Layout 的 content 区不自带 padding，本页通过 header（`12px 16px`）和 content（`24px`）自控内边距。

## 与其他页面模板的区别

| 场景 | 用什么模板 |
|---|---|
| 基础列表，单关键词搜索 | [简单列表页](page-simple-list.md) |
| **字段多、独立页面录入/编辑** | **本模板（基础表单页）** |
| 少量字段的快速录入 | 弹窗表单（见 [modal-patterns.md](modal-patterns.md)） |
