---
name: pangea-page-modal-form
description: "对话框表单模板。适用于字段较少、轻量的表单录入/编辑场景（在当前页弹窗内完成，无需跳转独立页面）。结构：a-modal 弹窗 + 标题 + 2 列栅格垂直表单（input/select/switch/textarea 等）+ 取消/确定底部按钮。当录入字段少、希望不离开当前页时使用此模板。"
user-invocable: true
---

# 对话框表单模板

适用场景：字段**较少、轻量**的表单录入 / 编辑，在**弹窗内完成**、不跳转独立页面（如列表页点「新建/编辑」弹出的表单）。

与其他表单模板的区别：字段少、交互轻 → 用弹窗；字段多 → 用[基础表单页](page-form.md)；字段极多需分组 → 用[分组表单页](page-grouped-form.md)。

## 结构与设计规范

```
┌────────────────────────────────────────────┐
│ 创建合同                                 ✕  │  ← header: 16px semibold + 关闭
├────────────────────────────────────────────┤
│ 合同编号            * 合同名称               │  ← body: 2 列栅格，字段间距 24px
│ [请输入      ]       [请输入      ]          │
│ * 合同类型          * 合同密级               │
│ [请选择    ▾]        [请选择    ▾]           │
│ 开口合同 ⓘ           是否电签                │
│ ( ○)                ( ●)  (switch)          │
│ 合同说明（整行 textarea）                     │
│ [                                    ]       │
├────────────────────────────────────────────┤
│                          [取消]  [确定]      │  ← footer: 右对齐
└────────────────────────────────────────────┘
```

- **标题**：`16px semibold`、`color-text-1`，**始终左对齐**（Arco Modal 默认居中，须设 `title-align="start"`）；右上角关闭按钮用 Arco 标准（`IconHover`：圆形 hover 背景 `var(--color-fill-2)`，不要自定义覆盖）。
- **body 内边距**：`24px`。
- **表单**：垂直布局（label 在上），字段间距 `24px`；必填红星由 Arco Form 按 `rules` 自动渲染。
- **textarea 等整行字段**：`:span="24"`。
- **footer**：右对齐，取消（默认按钮）+ 确定（`type="primary"`）；尺寸用默认。
- **控件尺寸**：弹窗内表单控件用默认尺寸。

### 宽度与列数（按字段量动态调整，但守以下原则）
- **列数不超过 3 列**：字段少 → 1 列；中等 → 2 列；较多 → 3 列。**列用响应式断点**而非写死 `:span`：2 列用 `:xs="24" :sm="12"`、3 列用 `:xs="24" :sm="12" :lg="8"`（窄屏自动降为 1 列），整行字段（textarea）用 `:span="24"`。
- **宽度不超过 1000px**：随列数增长，参考 1 列≈`520px`、2 列≈`720px`、3 列≈`960px`，**上限 `1000px`**。
- **弹窗需有最大高度，保证底部按钮始终可见**：给 body 设 `max-height`（如 `60vh`）+ `overflow-y: auto`，内容多时**body 内联滚动**，header/footer 固定不动。用 `:body-style="{ maxHeight: '60vh', overflowY: 'auto' }"` 实现（Arco Modal 的 header/footer 本就在 body 外，不随滚动）。
- **窄屏防溢出（响应式）**：固定 `width` 不能超过视口；窄屏（如 `≤768px`）改用更小宽度或 `fullscreen`。可绑定动态宽度，如 `:width="isNarrow ? '100%' : 712"`（配合窗口宽度监听），或直接用 `fullscreen` 属性。
- 参考选型（可据实际微调）：

  | 字段数 | 列数 | 宽度 |
  |---|---|---|
  | ≤ 4 | 1 | ~520px |
  | 5–10 | 2 | ~720px |
  | > 10 | 3 | ~960px（≤1000） |

> 若字段多到 3 列仍显拥挤或需分组，说明**不适合弹窗**，改用[基础表单页](page-form.md)或[分组表单页](page-grouped-form.md)。

## Vue 代码模板

```vue
<script setup lang="ts">
/**
 * 对话框表单（轻量录入/编辑）
 * ------------------------------------------------------------------
 * 字段较少时在弹窗内完成录入，不跳转独立页面。
 * 通常由列表页「新建/编辑」触发，v-model:visible 控制显隐。
 */
import { ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';

// 弹窗显隐（父级通过 v-model:visible 控制，或本组件内维护）
const visible = defineModel<boolean>('visible', { default: false });

const props = defineProps<{
  /** 编辑时传入初始数据；新建时为空 */
  record?: Record<string, any>;
}>();
const emit = defineEmits<{ (e: 'success', data: any): void }>();

const formRef = ref();
const form = reactive({
  contractNo: '',
  contractName: '',
  contractType: undefined,
  secretLevel: undefined,
  openContract: false,
  isElectronic: true,
  remark: '',
});

const rules = {
  contractName: [{ required: true, message: '请输入合同名称' }],
  contractType: [{ required: true, message: '请选择合同类型' }],
  secretLevel: [{ required: true, message: '请选择合同密级' }],
};

const typeOptions = [
  { value: 'purchase', label: '采购合同' },
  { value: 'sales', label: '销售合同' },
];

const submitting = ref(false);

// 确定：先校验，通过后提交（返回 true 关闭弹窗，false 阻止关闭）
async function handleBeforeOk(): Promise<boolean> {
  const errors = await formRef.value?.validate();
  if (errors) return false;
  submitting.value = true;
  // TODO: 交付时替换为接口请求
  await new Promise((r) => setTimeout(r, 300));
  submitting.value = false;
  Message.success('保存成功');
  emit('success', { ...form });
  return true;
}
</script>

<template>
  <a-modal
    v-model:visible="visible"
    title="创建合同"
    title-align="start"
    :width="712"
    :body-style="{ maxHeight: '60vh', overflowY: 'auto' }"
    :ok-loading="submitting"
    ok-text="确定"
    cancel-text="取消"
    :on-before-ok="handleBeforeOk"
    unmount-on-close
  >
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <a-row :gutter="24">
        <a-col :xs="24" :sm="12">
          <a-form-item field="contractNo" label="合同编号">
            <a-input v-model="form.contractNo" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item field="contractName" label="合同名称">
            <a-input v-model="form.contractName" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item field="contractType" label="合同类型">
            <a-select v-model="form.contractType" placeholder="请选择" :options="typeOptions" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item field="secretLevel" label="合同密级">
            <a-select v-model="form.secretLevel" placeholder="请选择" :options="typeOptions" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item field="openContract" label="开口合同">
            <a-switch v-model="form.openContract" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item field="isElectronic" label="是否电签">
            <a-switch v-model="form.isElectronic" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item field="remark" label="合同说明">
            <a-textarea v-model="form.remark" placeholder="请输入" :auto-size="{ minRows: 2 }" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
```

## 使用要点

1. **触发方式**：通常由列表页「新建 / 编辑」按钮触发，父组件用 `v-model:visible` 控制显隐；编辑时通过 `record` prop 传入初始数据，在 `watch(visible)` 或 `record` 变化时回填 `form`。
2. **标题左对齐**：Arco Modal 标题默认居中，务必设 `title-align="start"`。
3. **宽度/列数动态但有上限**：列数 ≤ 3、宽度 ≤ 1000px（见上「宽度与列数」表）；列用响应式断点（2 列 `:xs="24" :sm="12"`、3 列 `:xs="24" :sm="12" :lg="8"`），不写死 `:span`。窄屏 modal 宽度不超视口，必要时改小宽或 `fullscreen`。
4. **底部按钮始终可见**：`:body-style="{ maxHeight: '60vh', overflowY: 'auto' }"` 让内容多时 body 内联滚动，header/footer 不动。
5. **关闭按钮**：用 Arco 标准（`IconHover` 圆形 hover，背景 `--color-fill-2`），**不要自定义覆盖**关闭按钮样式。
6. **校验 + 关闭时机**：用 `:on-before-ok="handleBeforeOk"` 返回 `Promise<boolean>`——校验/提交成功返回 `true` 关闭，失败返回 `false` 阻止关闭。不要在校验未过时就关弹窗。
4. **提交反馈**：`:ok-loading` 绑定提交中状态；成功后 `Message.success` + `emit('success')` 通知父级刷新列表。
5. **unmount-on-close**：弹窗关闭时销毁内部表单，避免残留上次输入；再次打开是干净状态（编辑场景在打开时回填）。
6. **必填红星**：定义在 `rules` 里，Arco 自动渲染，不手动加。
7. **mock 数据**：PM demo 用 `setTimeout` 模拟；开发交付时 `handleBeforeOk` 换成接口请求。
8. **何时不用弹窗**：字段多、需分步/分组、或需要页面级 URL（可分享/刷新保留）时，改用[基础表单页](page-form.md) / [分组表单页](page-grouped-form.md)。

## 与其他页面模板的区别

| 场景 | 用什么模板 |
|---|---|
| 基础列表，单关键词搜索 | [简单列表页](page-simple-list.md) |
| **字段少、轻量、弹窗内录入/编辑** | **本模板（对话框表单）** |
| 字段多、单一表单、独立页面 | [基础表单页](page-form.md) |
| 字段极多、需分组 + 锚点 | [分组表单页](page-grouped-form.md) |
