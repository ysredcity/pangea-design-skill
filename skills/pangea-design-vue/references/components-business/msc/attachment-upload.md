---
name: pangea-msc-attachment-upload
description: "MSC（全球营销云中台）专属业务组件「附件上传」MscAttachmentUpload：表单中的附件上传场景，用一张详细表格（附件名称/文件大小/状态/操作）承载已上传附件，支持预览、下载、删除与批量下载。仅当需求出现 MSC、全球营销云中台、营销云中台、营销中台 等字眼时使用；其他产品用 Arco 原生 a-upload。"
user-invocable: true
meta:
  id: msc-attachment-upload
  kind: business-component
  product: msc
  productName: MSC · 全球营销云中台
  triggers: [MSC, 全球营销云中台, 营销云中台, 营销中台]
  title: MSC 附件上传
  status: stable
  whenToUse: [MSC 表单中的附件上传, 需要详细呈现已上传附件, 需要对已上传附件预览/下载/删除, 需要批量下载附件]
  whenNotToUse: [非 MSC 产品→用原生 a-upload, 只需上传不需要附件明细表→用原生 a-upload, 图片墙/头像裁剪等场景→用 a-upload 的图片模式]
  replaces: a-upload
  keyStructure: [字段名label, 点击上传按钮, 格式与大小提示, 已上传附件表格(附件名称/文件大小/状态/操作), 批量下载]
  variants: [默认态（空列表）, 上传后（含成功/失败行）, 仅查看（readOnly）]
  composeWith: [a-upload, a-table, a-badge, a-link, a-button]
  composeBoundary: [组件只呈现+抛事件不实现真实上传下载, fileList 由宿主受控, size 为展示用字符串不在组件内格式化, 操作列 fixed right 需配 scroll]
  pitfalls: [非 MSC 场景误用, 表格插槽 record 是 any 直接索引会 TS7053, 上传失败行不该出现下载/预览, 仅查看态忘了去掉删除与上传入口, 无成功文件时批量下载要禁用]
  source: src/components/msc/MscAttachmentUpload.vue
  figma: 5926:53694
  tags: [MSC, 业务组件, 附件, 上传, 表单]
---

# MSC 附件上传 · `MscAttachmentUpload`

> ⛔ **使用门槛**：仅当需求命中 MSC 触发词（**MSC / 全球营销云中台 / 营销云中台 / 营销中台**）时使用。
> 其他产品的附件上传请用 Arco 原生 [`a-upload`](../../components/data-entry/upload.md)。门槛的理由见[业务组件总览](../README.md)。

MSC 表单场景中遇到**附件上传**时，优先用本组件替代原生 `a-upload`。

## 为什么不用原生 `a-upload`

原生 upload 的已上传列表是「一行一个文件名 + 一个删除图标」的**轻量列表**；MSC 的表单要求把已上传附件放进一张**详细表格**，并支持逐条与批量操作：

| | 原生 `a-upload` | **MscAttachmentUpload** |
|---|---|---|
| 已上传呈现 | 轻量文件名列表 | **表格**：附件名称 / 文件大小 / 状态 / 操作 |
| 上传状态 | 进度条 | **状态列**（● 上传成功 / ● 上传失败） |
| 单条操作 | 删除 | **下载 · 预览 · 删除** |
| 批量 | 无 | **批量下载** |

## 组件结构

```
上传附件                                          ← 字段名（14px / text-2，可带必填红星）
[⤒ 点击上传]                                      ← 默认按钮；readOnly 时不渲染
Only pdf, png, jpg can be uploaded, and the       ← 格式与大小提示（12px / text-3）
size does not exceed 100MB                           readOnly 时不渲染
┌──────────────────────────┬──────────┬───────────┬────────────────────┐
│ 附件名称                  │ 文件大小  │ 状态       │ 操作                │ ← 表头灰底 fill-2
├──────────────────────────┼──────────┼───────────┼────────────────────┤
│ 附件01-青岛XXX营业执照.pdf │ 1.5m     │ ● 上传失败 │ 删除                │ ← 失败：只有删除
│ 附件01-青岛XXX营业执照.pdf │ 1.5m     │ ● 上传成功 │ 下载 预览 删除      │
└──────────────────────────┴──────────┴───────────┴────────────────────┘
        ↑ 空列表时表格内显示「暂无数据」（a-table 自带 a-empty）
[⤓ 批量下载]                                      ← 无「上传成功」附件时禁用
```

## 三种形态

| 形态 | 表现 | 怎么开 |
|---|---|---|
| **默认态** | 有上传入口与提示；表格空 →「暂无数据」；批量下载**禁用** | `:file-list="[]"` |
| **上传后** | 表格有行；成功行 `下载 预览 删除`，失败行只有 `删除`；批量下载可用 | 宿主把上传结果写回 `fileList` |
| **仅查看** | **不渲染上传入口与提示**；行操作只剩 `下载 预览`（无删除）；批量下载仍可用 | `read-only` |

## 设计规范

- **字段名**：`14px / line-height 22 / --color-text-2`，与 `a-form-item` 的 label 同规格；`required` 时前置红星（`rgb(var(--danger-6))`）。
- **上传按钮**：Arco **默认按钮**（不是主按钮）+ `IconUpload`，文案「点击上传」。
- **提示文案**：`12px / line-height 20 / --color-text-3`，紧跟按钮下方（`gap: 4px`）。**默认由 `accept` + `maxSizeMB` 自动生成**，避免文案与实际校验规则不一致。
- **表格**：`a-table` + `:bordered="{ wrapper: true }"` + `size="medium"` + `:pagination="false"`；**表头底色 `--color-fill-2`**（Arco 默认表头底色偏浅，需覆盖一行）。
  - 列宽：附件名称**不设宽**（吃满剩余 + `ellipsis` + `tooltip`）／文件大小 `120` ／状态 `180` ／**操作 `200` 且 `fixed: 'right'`**（设计稿该列带投影即固定列），配 `:scroll="{ x: '100%' }"` 让窄屏下操作列始终可见。
- **状态列**：`a-badge`——成功 `status="success"`（绿点 + 上传成功）／失败 `status="danger"`（红点 + 上传失败）／上传中 `status="processing"`。**不要用颜色单独表意**，状态点必须带文字。
- **操作列**：`a-link`。下载 / 预览用默认（主色）；**删除用 `status="danger"`**。链接间距 `8px`。
- **批量下载**：默认按钮 + `IconDownload`，位于表格下方 `margin-top: 10px`。

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|---|---|---|:---:|
| `file-list` **(v-model)** | 已上传附件列表（**受控**，由宿主维护） | `MscAttachmentFile[]` | `-` |
| `label` | 字段名 | `string` | `'上传附件'` |
| `required` | label 前显示必填红星 | `boolean` | `false` |
| `accept` | 允许的扩展名，**同时用于生成提示文案与前端校验** | `string[]` | `['pdf','png','jpg']` |
| `max-size-m-b` | 单文件大小上限（MB），同上 | `number` | `100` |
| `hint` | 自定义提示文案；不传则自动生成 | `string` | `''` |
| `read-only` | 仅查看态：隐藏上传入口与提示、行操作去掉删除 | `boolean` | `false` |
| `disabled` | 禁用上传（仍可下载 / 预览 / 删除） | `boolean` | `false` |
| `show-batch-download` | 是否显示批量下载 | `boolean` | `true` |
| `multiple` | 允许多选文件 | `boolean` | `true` |

### Events

| 事件 | 说明 | 参数 |
|---|---|---|
| `update:file-list` | 列表变化（删除时组件会自行剔除该行并抛出） | `MscAttachmentFile[]` |
| `upload` | 选中文件并**通过类型/大小校验**后触发，由宿主执行上传 | `files: File[]` |
| `preview` | 点击「预览」 | `file: MscAttachmentFile` |
| `download` | 点击「下载」 | `file: MscAttachmentFile` |
| `remove` | 点击「删除」 | `file: MscAttachmentFile` |
| `batch-download` | 点击「批量下载」 | `files: MscAttachmentFile[]`（仅上传成功的） |

### 类型

```ts
export interface MscAttachmentFile {
  uid: string;                                  // 行 key，需唯一
  name: string;
  size: string;                                 // 展示用文本，如 '1.5m'（各系统口径不同，组件不做格式化）
  status: 'success' | 'fail' | 'uploading';
  url?: string;                                 // 预览 / 下载地址，上传成功后回填
}
```

## 用法

组件**只负责选择文件 + 呈现列表 + 抛语义事件**，不实现真实上传/下载——所以 demo 可以用 mock、开发交付接真实接口，组件本身不用改。

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import MscAttachmentUpload, {
  type MscAttachmentFile,
} from '@/components/msc/MscAttachmentUpload.vue';

const files = ref<MscAttachmentFile[]>([]);

// 选中文件后由宿主上传；这里演示 mock，开发交付换成真实接口
let seq = 0;
async function handleUpload(rawFiles: File[]) {
  for (const raw of rawFiles) {
    const uid = `f-${++seq}`;
    files.value.push({ uid, name: raw.name, size: formatSize(raw.size), status: 'uploading' });
    try {
      // const { url } = await api.upload(raw);
      const url = URL.createObjectURL(raw);
      patch(uid, { status: 'success', url });
    } catch {
      patch(uid, { status: 'fail' });      // 失败行只会显示「删除」
    }
  }
}
function patch(uid: string, next: Partial<MscAttachmentFile>) {
  files.value = files.value.map((f) => (f.uid === uid ? { ...f, ...next } : f));
}
function formatSize(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)}m` : `${Math.ceil(bytes / 1024)}k`;
}

function handleBatchDownload(list: MscAttachmentFile[]) {
  // 真实项目：调打包下载接口，或逐个触发下载
  Message.success(`开始下载 ${list.length} 个附件`);
}
</script>

<template>
  <!-- 表单里当成一个字段用；必填校验由宿主在提交前判断 files.length -->
  <MscAttachmentUpload
    v-model:file-list="files"
    label="上传附件"
    required
    :accept="['pdf', 'png', 'jpg']"
    :max-size-m-b="100"
    @upload="handleUpload"
    @preview="(f) => window.open(f.url, '_blank')"
    @download="(f) => window.open(f.url, '_blank')"
    @batch-download="handleBatchDownload"
  />

  <!-- 详情 / 审批等只读场景 -->
  <MscAttachmentUpload v-model:file-list="files" read-only />
</template>
```

## 使用要点

1. **先确认是 MSC 场景**：需求未命中触发词就不要用本组件（见[门槛](../README.md#-使用门槛硬规则)）。
2. **`fileList` 是受控的**：组件不自己维护列表（删除除外——它会剔除该行并抛 `update:file-list`）。上传结果、状态流转都由宿主写回。
3. **`size` 传展示文本**，不要传字节数：各系统的大小口径与精度要求不同，组件不做格式化。
4. **必填校验放在宿主**：本组件不是 `a-form-item`，`required` 只画红星。放进 `a-form` 时用一个 `field` 绑定文件数组、在提交前校验 `length`。
5. **失败行不给下载/预览**：上传失败没有可访问的产物，只保留「删除」让用户重传——组件已内置此逻辑，不要再放开。
6. **只读场景务必传 `read-only`**：否则会在详情/审批页暴露删除入口。
7. **批量下载的语义是「仅成功的附件」**：`batch-download` 抛出的已经过滤，宿主直接用即可。

## 常见坑

- **非 MSC 产品误用**：本组件带着 MSC 的业务假设（状态口径、操作集合），搬到别的系统会出现用户看不懂的列。
- **表格插槽 `record` 是 `any`**：直接 `STATUS_MAP[record.status]` 会触发 **TS7053**（`vue-tsc` 报错、`gate` 失败）。组件内已按[表格模式](../../patterns/table-patterns.md)的约定改用接受 `string` 的 helper `statusOf()`——扩展状态时沿用这个写法。
- **只给操作列设 `fixed: 'right'` 但没开 `:scroll`**：窄屏下固定列不生效。
- **忘了禁用批量下载**：列表为空或全部失败时按钮必须是禁用态（设计稿默认态就是禁用）。
- **表头底色**：Arco 默认表头底色比设计稿浅，需要 `--color-fill-2` 覆盖一行；不要写死 hex。
