---
name: pangea-page-step-form
description: "分步表单页模板。适用于大型、复杂的数据录入场景：页头步骤条（a-steps）驱动分步录入，每步内部再用折叠分组（a-collapse）承载多种录入交互（input/select/switch/datepicker/radio/textarea/只读子表单表格/可编辑子表单/上传），逐步校验、最后一步复核提交。当录入内容多到需要拆成阶段、且同时存在多种录入交互时使用此模板。"
user-invocable: true
meta:
  id: page-step-form
  kind: page-template
  title: 分步表单页
  status: stable
  whenToUse: [大型复杂数据录入, 录入需拆成多个阶段, 同时存在多种录入交互, 需逐步校验与最终复核]
  whenNotToUse: [字段较少→基础表单页, 一屏可填完但需分组定位→分组表单页, 弹窗轻量→对话框表单]
  keyStructure: [页头两行(操作栏+步骤条), 步骤条居中最大900px, 每步内折叠分组, 最多3列响应式栅格, 只读/可编辑子表单表格, 末步复核(a-descriptions)]
  variants: [三步(信息→明细附件→确认), 步数可增减]
  composeWith: [a-steps, a-collapse, a-form, a-grid, a-table, a-upload, a-descriptions]
  composeBoundary: [步骤条放页头不随内容滚动, 分步用 v-show 保留已填状态, 每步只校验本步字段, 末步为只读复核不放录入]
  pitfalls: [用 v-if 会丢失已填数据与校验, 一次校验全表单会误报后续步骤, 步骤条不要放进滚动区]
  previewRoute: /step-form
  source: src/pages/StepForm/index.vue
  tags: [表单, 分步, 步骤条, 大型录入, 子表单]
---

# 分步表单页模板

适用场景：**大型、复杂的数据录入**——录入内容多到需要拆成若干**阶段**推进，且同一页面内**同时存在多种录入交互**（基础控件 + 只读子表单 + 可编辑子表单 + 上传）。典型如复杂合同/项目/工单的创建向导。

与[分组表单页](page-grouped-form.md)的区别：分组表单页是**一次性**填完的长表单，用右侧**锚点**定位；本模板把录入拆成**多个步骤**，用页头**步骤条**指示进度，**逐步校验**、最后一步**复核提交**。两者的"折叠分组 + 多样控件"部分是一致的。

## 页面结构

```
┌───────────────────────────────────────────────────────────────────┐
│ ‹ 创建合同                       📄帮助文档 [上一步] [下一步]        │  ← 操作栏
│        ①─────────────②──────────────③                            │  ← 步骤条（居中，≤900px）
│      合同信息        明细与附件      确认提交                        │
│    填写基本信息      录入明细上传    核对后提交                       │
├───────────────────────────────────────────────────────────────────┤
│ ▾ 合同基本信息                                          （步骤 1）   │
│   合同编号      * 合同名称     * 合同类型     * 合同密级             │  ← 最多 3 列栅格
│   [请输入]      [请输入]       [请选择▾]     [请选择▾]              │
│   * 合同拟定方式  开口合同 ⓘ    是否电签      * 实体盖章类型          │
│   [请选择▾]      ( ○)          (●)          [合同章▾]              │
│   合同说明                                                         │
│   [                                                    ]          │  ← textarea 整行
│ ────────────────────────────────────────────────────────          │
│ ▾ 签订依据                                                         │
│   ┌───────────────────────────────────────────────┐               │
│   │ 输入框     单选     开关                        │               │  ← 只读子表单表格
│   │ Pangea     1        开启                       │               │
│   └───────────────────────────────────────────────┘               │
│ ────────────────────────────────────────────────────────          │
│ ▾ 合同详情                                                         │
│   * 合同起始日期 * 合同终止日期 * 签约日期   * 税价合计总金额          │
│   [请选择日期📅] [请选择日期📅] [请选择日期📅] [请输入]              │
│   * 付款方式  ◉A ○B                                                │
└───────────────────────────────────────────────────────────────────┘
   步骤 2：合同明细（可编辑子表单：行内 input/select/数字 + 增删行）+ 附件上传
   步骤 3：确认提交（a-descriptions 只读复核）
```

## 设计规范

### 页头（两行，固定不滚动）
- 容器：`padding: 12px 16px`，两行之间 `gap: 16px`，底部 `1px solid var(--color-border-2)` 通栏分割线，`flex-shrink: 0`
- **第一行 · 操作栏**
  - 左：返回图标按钮（`a-button type="text"` + `IconLeft`，图标色 `--color-text-1`）+ 标题（`18px semibold`、`line-height: 28px`、`--color-text-1`），间距 `4px`
  - 右：帮助文档（`type="text"` + `IconFile`，主色文字）+ **上一步**（默认按钮，**首步不渲染**——用 `v-if="!isFirst"` 而不是 `disabled`，避免出现一个永远点不动的按钮）+ **下一步 / 提交**（`type="primary"`，末步文案换成「提交」），间距 `8px`
  - 窄屏 `flex-wrap: wrap` 防溢出
- **第二行 · 步骤条**：`a-steps` **小尺寸**（布尔属性 `small`；⚠️ Arco Steps **没有 `size` 属性**，写 `size="small"` 不生效）、**只留标题不带描述**（页头要克制，描述文字会把页头撑高、挤压内容区）、**整体水平居中**，`width: 100%; max-width: 900px`
  - 每步 = 标题（`14px`）+ 描述（`12px`、`--color-text-3`）
  - 状态由 `current` 驱动：已完成（✓ 主色）/ 进行中（主色实心 + 序号）/ 未进行（灰底 + 序号）；连接线已完成段为主色
  - **不开启 `changeable`**：步骤只作进度指示，跳转统一走「上一步 / 下一步」，避免绕过校验

### 内容区（唯一滚动区）
- `flex: 1; min-height: 0; overflow-y: auto; padding: 24px`
- 只有内容区滚动；页头与步骤条常驻可见

### 每步内部：折叠分组
与[分组表单页](page-grouped-form.md)一致：
- `<a-collapse :bordered="false" expand-icon-position="left">`，默认全部展开
- 分组标题 `16px semibold`、`--color-text-1`；隐藏 header 下边框；分组间 `16px`
- 去掉 content 左右 padding；header 左 padding `20px`，caret 图标 `left: 0`

### 字段栅格（**最多 3 列**，响应式）
- 垂直布局（label 在上），`<a-row :gutter="20">`
- **断点**：`:xs="24" :sm="12" :lg="8"`（窄屏 1 列 / 平板 2 列 / 桌面及以上 3 列），**不写死 `:span`**
- **列数上限 3**：不要再加 `:xl="6"` 铺到 4 列——大屏下 4 列会让每列过窄、label 与控件都被压缩，且一行信息过多反而更难扫读
- 整行字段（textarea、子表单表格、上传）用 `:span="24"`
- 必填红星由 Arco Form 按 `rules` 自动渲染；带解释的字段用 `a-form-item` 的 `tooltip`

### 多种录入交互（本模板的核心）
| 形态 | 用法 |
|---|---|
| 基础控件 | `a-input` / `a-select` / `a-switch` / `a-date-picker` / `a-radio-group` / `a-textarea` |
| **只读子表单** | `a-table` + `:pagination="false"` + `:bordered="{ wrapper: true }"`，单元格纯文本（如开关列渲染「开启/关闭」文案） |
| **可编辑子表单** | `a-table` 的列用 `slotName`，单元格内放 `a-input` / `a-select` / `a-input-number`；底部 `a-button type="dashed" long` 添加行，行尾放删除按钮（`type="text" status="danger"`），**至少保留一行** |
| 附件 | `a-upload`（demo 用 `:auto-upload="false"`，`:limit` 限制数量） |
| 复核 | `a-descriptions bordered` + `:column="{ xs: 1, sm: 2, lg: 3 }"` |

### 分步状态与校验（关键）
- **用 `v-show` 切换步骤，不要用 `v-if`**：`v-if` 会卸载表单项 → 已填数据与校验状态丢失，最终提交时校验也会失效
- **每步只校验本步字段**：为每个步骤声明 `fields`，`await formRef.validate(fields)`；一次校验整表会把后续步骤的必填项一起报错
- 校验不通过：`Message.warning` 提示并停在当前步
- 最后一步提交前 `await formRef.validate()` 做**全量**校验

## Vue 代码模板

完整可运行实现见脚手架 `templates/project-starter/src/pages/StepForm/index.vue`（预览路由 `/step-form`）。核心骨架：

```vue
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { IconLeft, IconFile, IconPlus, IconDelete } from '@arco-iconbox/vue-pangea-mobile';

const router = useRouter();
const pageTitle = '创建合同';

// ① 步骤定义：fields = 该步需要校验的字段
const steps = [
  { key: 'basic', title: '合同信息', fields: ['contractName', 'contractType'] },
  { key: 'detail', title: '明细与附件', fields: [] },
  { key: 'confirm', title: '确认提交', fields: [] },
];
const current = ref(1); // a-steps 从 1 开始
const isFirst = computed(() => current.value === 1);
const isLast = computed(() => current.value === steps.length);

const formRef = ref();
const form = reactive({ contractNo: '', contractName: '', contractType: undefined, remark: '', attachments: [] as any[] });
const rules = { contractName: [{ required: true, message: '请输入合同名称' }] };

// ② 可编辑子表单
let seq = 2;
const itemRows = ref([{ key: '1', name: '', qty: 1 }]);
function addItem() { itemRows.value.push({ key: String(seq++), name: '', qty: 1 }); }
function removeItem(key: string) {
  if (itemRows.value.length === 1) return Message.warning('至少保留一行明细');
  itemRows.value = itemRows.value.filter((r) => r.key !== key);
}

// ③ 步骤流转：只校验当前步
async function next() {
  const fields = steps[current.value - 1].fields;
  if (fields.length) {
    const errors = await formRef.value?.validate(fields);
    if (errors) return Message.warning('请先补全当前步骤的必填项');
  }
  if (current.value < steps.length) current.value += 1;
}
function prev() { if (current.value > 1) current.value -= 1; }
async function handleSubmit() {
  const errors = await formRef.value?.validate(); // 末步全量校验
  if (errors) return Message.warning('存在未填写完整的必填项');
  Message.success('提交成功');
}
</script>

<template>
  <div class="pg-step-form">
    <!-- 页头：操作栏 + 步骤条 -->
    <div class="pg-step-form__header">
      <div class="pg-step-form__bar">
        <div class="pg-step-form__bar-left">
          <a-button type="text" @click="router.back()">
            <template #icon><IconLeft style="color: var(--color-text-1)" /></template>
          </a-button>
          <h2 class="pg-step-form__title">{{ pageTitle }}</h2>
        </div>
        <div class="pg-step-form__bar-right">
          <a-button type="text"><template #icon><IconFile /></template>帮助文档</a-button>
          <!-- 首步不渲染「上一步」，而不是渲染成禁用态 -->
          <a-button v-if="!isFirst" @click="prev">上一步</a-button>
          <a-button v-if="!isLast" type="primary" @click="next">下一步</a-button>
          <a-button v-else type="primary" @click="handleSubmit">提交</a-button>
        </div>
      </div>
      <div class="pg-step-form__steps">
        <!-- 小尺寸用布尔属性 small（Arco Steps 无 size 属性）；不带描述 -->
        <a-steps :current="current" small class="pg-step-form__steps-inner">
          <a-step v-for="s in steps" :key="s.key">{{ s.title }}</a-step>
        </a-steps>
      </div>
    </div>

    <!-- 内容区：v-show 切换步骤（保留已填状态） -->
    <div class="pg-step-form__content">
      <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
        <a-collapse v-show="current === 1" :bordered="false" expand-icon-position="left" :default-active-key="['basic']">
          <a-collapse-item key="basic" header="合同基本信息">
            <a-row :gutter="20">
              <a-col :xs="24" :sm="12" :lg="8">
                <a-form-item field="contractName" label="合同名称">
                  <a-input v-model="form.contractName" placeholder="请输入" />
                </a-form-item>
              </a-col>
              <!-- …其余字段同上，最多 3 列断点 -->
              <a-col :span="24">
                <a-form-item field="remark" label="合同说明">
                  <a-textarea v-model="form.remark" placeholder="请输入" :auto-size="{ minRows: 2 }" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-collapse-item>
        </a-collapse>

        <!-- 步骤 2：可编辑子表单 + 上传 -->
        <a-collapse v-show="current === 2" :bordered="false" expand-icon-position="left" :default-active-key="['items']">
          <a-collapse-item key="items" header="合同明细">
            <a-table :columns="itemColumns" :data="itemRows" :pagination="false" row-key="key" :bordered="{ wrapper: true }">
              <template #name="{ record }"><a-input v-model="record.name" placeholder="请输入" /></template>
              <template #qty="{ record }"><a-input-number v-model="record.qty" :min="1" /></template>
              <template #op="{ record }">
                <a-button type="text" status="danger" size="mini" @click="removeItem(record.key)">
                  <template #icon><IconDelete /></template>
                </a-button>
              </template>
            </a-table>
            <a-button long type="dashed" style="margin-top: 12px" @click="addItem">
              <template #icon><IconPlus /></template>添加明细
            </a-button>
          </a-collapse-item>
        </a-collapse>

        <!-- 步骤 3：只读复核 -->
        <div v-show="current === 3">
          <a-descriptions title="合同基本信息" :column="{ xs: 1, sm: 2, lg: 3 }" bordered>
            <a-descriptions-item label="合同名称">{{ form.contractName || '—' }}</a-descriptions-item>
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
  background: var(--color-bg-1); /* 内容区默认透明，背景由页面自设 */
}
.pg-step-form__header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-2);
  flex-shrink: 0;
  background: var(--color-bg-1);
}
.pg-step-form__bar { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.pg-step-form__bar-left { display: flex; align-items: center; gap: 4px; }
.pg-step-form__title { margin: 0; font-size: 18px; font-weight: 600; line-height: 28px; color: var(--color-text-1); }
.pg-step-form__bar-right { display: flex; align-items: center; gap: 8px; }
/* 步骤条居中，最大 900px */
.pg-step-form__steps { display: flex; justify-content: center; }
.pg-step-form__steps-inner { width: 100%; max-width: 900px; }
/* 内容区：唯一滚动区 */
.pg-step-form__content { flex: 1; min-height: 0; overflow-y: auto; padding: 24px; }
/* 折叠分组细节（与分组表单页一致） */
.pg-step-form__content :deep(.arco-collapse-item-header-title) { font-size: 16px; font-weight: 600; color: var(--color-text-1); }
.pg-step-form__content :deep(.arco-collapse-item-header) { border-bottom: none; }
.pg-step-form__content :deep(.arco-collapse-item) { margin-bottom: 16px; }
.pg-step-form__content :deep(.arco-collapse-item:last-child) { margin-bottom: 0; }
.pg-step-form__content :deep(.arco-collapse-item-content) { padding-left: 0; padding-right: 0; }
.pg-step-form__content :deep(.arco-collapse-item-header-left) { padding-left: 20px; }
.pg-step-form__content :deep(.arco-collapse-item .arco-collapse-item-icon-hover) { left: 0; }
</style>
```

## 使用要点

1. **复制到 `src/pages/<PageName>/index.vue`**，按业务改 `steps`（步数、标题、描述、每步 `fields`）、`form`、`rules` 与各步分组内容。
2. **步数按录入体量定**：2~4 步为宜；步骤过多说明该拆成多个页面或引入草稿保存。
3. **`fields` 必须与该步实际字段一致**：漏写 → 该步必填项不被拦截；多写 → 会误报下一步字段。
4. **切换用 `v-show`**（见「分步状态与校验」）；若确有性能顾虑，可对**纯展示的末步**用 `v-if`，录入步骤一律 `v-show`。
5. **可编辑子表单**：行数据用 `ref([])` + 唯一 `key`；删除时保底一行；行内控件直接 `v-model="record.xxx"`。若子表单也要校验，把行校验逻辑放在 `next()` 里手动检查并提示。
6. **末步只做复核**：用 `a-descriptions` 只读呈现，不要在末步放录入控件（否则"确认"语义失效）。**复核要显示选项的 label 而非原始码值**——用 `labelOf(options, value)` 之类的辅助函数反查（否则用户看到的是 `purchase`/`public` 这种码值）；日期、布尔同理格式化为「是/否」等可读文案。
7. **草稿/回填**：编辑态进入时先拉取详情填充 `form` 与子表单行，再把 `current` 设为 1；跨会话草稿可在 `next()` 里顺带保存。
8. **mock 数据**：PM demo 用内存数据；开发交付时把 `handleSubmit`、选项、上传地址换成接口。
9. **Layout 无 padding**：全局 Layout 内容区不自带 padding，本页由页头 + 内容区自控内边距。

## 与其他页面模板的区别

| 场景 | 用什么模板 |
|---|---|
| 基础列表，单关键词搜索 | [简单列表页](page-simple-list.md) |
| 字段少、弹窗内录入不跳转 | [对话框表单](page-modal-form.md) |
| 字段多、单一表单一次填完 | [基础表单页](page-form.md) |
| 字段极多、一次填完但需分组 + 锚点定位 | [分组表单页](page-grouped-form.md) |
| **录入需拆成多个阶段、逐步校验、含多种录入交互（含可编辑子表单）** | **本模板（分步表单页）** |
| 查看已录入数据（只读，页面/抽屉/弹窗） | [详情页](page-detail.md) |
