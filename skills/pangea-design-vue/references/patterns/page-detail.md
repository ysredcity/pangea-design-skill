---
name: pangea-page-detail
description: "详情页模板。适用于查看已录入数据的场景（通常从列表页「查看详情」进入）。特征：只读字段（label 在上 / 值在下）3 列栅格 + 整行长文本 + 只读附件列表（类型图标 + 预览/下载）+ 只读子表单表格，按折叠分组组织。**详情内容抽成独立组件，可被独立页面 / a-drawer 抽屉 / a-modal 对话框三种容器复用**。当需要展示已保存数据、不做录入时使用此模板。"
user-invocable: true
meta:
  id: page-detail
  kind: page-template
  title: 详情页
  status: stable
  whenToUse: [查看已录入数据, 列表页「查看详情」入口, 需在抽屉或弹窗中展示详情, 只读展示含附件与子表单]
  whenNotToUse: [需要录入或编辑→表单类模板, 仅少量键值且无分组→直接用 a-descriptions]
  keyStructure: [页头(返回+标题+删除/编辑), 详情内容组件(可复用), 折叠分组, 只读字段label在上值在下, 整行长文本, 只读附件列表, 只读子表单表格]
  variants: [独立页面, a-drawer 抽屉, a-modal 对话框]
  composeWith: [a-collapse, a-grid, a-table, a-drawer, a-modal, a-tooltip, a-button]
  composeBoundary: [内容组件不含页头由容器提供, embedded 模式去掉外层padding, 栅格断点看视口不看容器宽度需显式传 cols, 空值统一占位]
  controls: { size: default, table: medium }
  pitfalls: [详情页里放录入控件, 抽屉内沿用3列过挤, 空值留白无占位, 附件图标自造SVG]
  previewRoute: /detail
  source: src/pages/DetailPage/index.vue
  tags: [详情, 只读, 抽屉, 弹窗, 附件]
---

# 详情页模板

适用场景：**查看已经录入的数据**，通常由列表页的「查看详情」「查看」入口进入。纯只读呈现，不做录入。

**核心特点：详情内容与容器解耦。** 详情未必是独立页面——也常用**抽屉**或**对话框**承载。因此本模板把详情内容抽成一个组件（`DetailContent.vue`），**同一份内容可被三种容器复用**：

| 容器 | 何时用 |
|---|---|
| 独立页面 | 字段多、需要固定链接（可分享/刷新）、后续可能有二级操作 |
| `a-drawer` 抽屉 | 从列表页快速查看，希望保留列表上下文（不跳走） |
| `a-modal` 对话框 | 字段较少、看完即走的轻量查看 |

## 页面结构

```
┌──────────────────────────────────────────────────────────────────┐
│ ‹ 方案详情                              [🗑删除] [✎编辑]           │  ← 页头（容器提供）
├──────────────────────────────────────────────────────────────────┤
│ ▾ 基本信息                                                        │
│   * 方案编号          * 方案名称           * 活动模板              │  ← 只读字段：label 在上
│   FA2408200002       2024年品牌宣传计划    模板A                   │     值在下，3 列栅格
│   * 开始日期          * 结束日期            活动方案天数            │
│   2024-08-01         2024-09-30           60                     │
│   * 负责人            方案申请金额          申请人                  │
│   张三                1000000              张三                    │
│   创建时间                                                        │
│   2024-08-01                                                     │
│   * 方案说明                                                      │  ← 整行长文本（可换行）
│   24年8月品牌月方案，门店需将签单客户信息在活动有效期内报备……          │
│   附件                                                            │  ← 只读附件列表
│   ┌────────────────────────────────────────────────┐             │
│   │ 📕 123.pdf                          👁  ⤓      │             │
│   │ 📦 download.zip                     👁  ⤓      │             │
│   └────────────────────────────────────────────────┘             │
│ ▾ 指标                                                            │
│   ┌──────────────────────────────────────────────────┐           │  ← 只读子表单表格
│   │ 编号      指标名称  指标说明        达标要求  兑现金额 │           │
│   │ 010226699 播放量   播放量达到…     100000   4000.50 │           │
│   └──────────────────────────────────────────────────┘           │
└──────────────────────────────────────────────────────────────────┘
```

## 设计规范

### 页头（由容器提供，不在内容组件里）
- 单行，`padding: 12px 16px`，底部 `1px solid var(--color-border-2)` 通栏分割线，`flex-shrink: 0`
- 左：返回图标按钮（`a-button type="text"` + `IconLeft`，图标色 `--color-text-1`）+ 标题（`18px semibold`、`line-height: 28px`）
- 右：**删除**（`status="danger"` + `IconDelete`）+ **编辑**（默认按钮 + `IconEdit`），间距 `8px`
  - 删除必须二次确认（`Modal.warning` + `okButtonProps: { status: 'danger' }`）
- 抽屉/弹窗承载时，这一行由 `a-drawer` / `a-modal` 的 `title` + footer 或标题栏操作替代

### 只读字段（label 在上 / 值在下）
这是详情页的主体形态，**不用 `a-descriptions` 的边框表格**——字段多时上下结构更紧凑、更接近录入页的字段位置，便于对照：
- `label`：`14px`、`line-height: 22px`、`--color-text-2`，下间距 `4px`
- `value`：`14px`、`line-height: 22px`、`--color-text-1`；`overflow-wrap: anywhere` 防长串溢出
- 字段块下间距 `20px`
- **必填红星**：与录入页字段对齐时可保留（设计稿保留，`--red-6`）；纯查看场景可关闭，由字段的 `required` 控制
- **空值统一占位 `—`**，不要留空白
- 栅格：默认 3 列 `:xs="24" :sm="12" :lg="8"`

### 整行长文本
- 单独成块、`width: 100%`，值用 `white-space: pre-line` 保留换行

### 只读附件列表
- 每个文件一行：`height: 40px`、`1px solid var(--color-border-2)`、`border-radius: var(--border-radius-medium)`，行间距 `8px`
- 左：**文件类型图标**按扩展名映射，**从图标包命名导入**（`IconUploadPdf` / `IconUploadZip` / `IconUploadPpt` / `IconUploadWord` / `IconUploadExcel` / `IconUploadImage`，兜底 `IconUploadDefault`）——不要自造内联 SVG
- 中：文件名（单行省略）
- 右：预览 / 下载图标按钮（`a-button type="text" shape="circle" size="small"`，**必须有 `aria-label`**，配 `a-tooltip mini`）

### 只读子表单表格
- `a-table` + `:pagination="false"` + `:bordered="{ wrapper: true }"` + `size="medium"`（与分组/分步表单页的只读子表单一致）
- 列多时加 `:scroll="{ x: '100%' }"` 横向滚动，不要压缩列宽

### 折叠分组
与[分组表单页](page-grouped-form.md)完全一致：`:bordered="false"`、`expand-icon-position="left"`、标题 `16px semibold`、隐藏 header 下边框、分组间 `16px`、去 content 左右 padding、caret `left: 0`。

## 内容与容器解耦（本模板关键）

```
DetailContent.vue   ← 只有内容：折叠分组 + 只读字段 + 长文本 + 附件 + 子表单
      ↑ 复用
┌─────┴──────┬──────────────┬──────────────┐
DetailPage    a-drawer        a-modal
（页头+滚动）  （标题栏）       （标题栏）
```

- 内容组件 props：`fields` / `files` / `tableColumns` / `tableData` / `embedded` / `cols`
- **`embedded`**：抽屉/弹窗内传 `true`，去掉内容组件自身的 `padding: 24px`（改由容器控制）
- **`cols`**：⚠️ **Arco 栅格断点按视口宽度判断，不看容器宽度**。所以放进 720px 宽的抽屉时，`:lg="8"` 依然生效 → 3 列会偏挤。容器需**显式**传 `:cols="2"`（或 `1`）降低密度。这是最容易被忽略的一点。
- 抽屉/弹窗都建议加 `unmount-on-close`，避免多条记录间数据串台
- 弹窗需限高滚动：`:body-style="{ maxHeight: '60vh', overflowY: 'auto' }"`

## Vue 代码模板

完整可运行实现见脚手架 `templates/project-starter/src/pages/DetailPage/`（`index.vue` 页面壳 + `DetailContent.vue` 内容组件，预览路由 `/detail`，页头带「抽屉查看 / 弹窗查看」按钮可直接体验复用）。核心骨架：

```vue
<!-- DetailContent.vue：只有内容，不含页头 -->
<script setup lang="ts">
import { computed } from 'vue';
import { IconEye, IconDownload, IconUploadPdf, IconUploadDefault } from '@arco-iconbox/vue-pangea-mobile';

export interface DetailField { label: string; value?: string | number; required?: boolean; full?: boolean }
export interface DetailFile { name: string; url?: string }

const props = withDefaults(defineProps<{
  fields: DetailField[]; files?: DetailFile[];
  tableColumns?: Record<string, unknown>[]; tableData?: Record<string, unknown>[];
  embedded?: boolean; cols?: 1 | 2 | 3;
}>(), { files: () => [], tableColumns: () => [], tableData: () => [], embedded: false, cols: 3 });

// 列数 → 栅格断点（断点看视口，容器窄时由父级显式传 cols）
const colSpan = computed(() => props.cols === 1 ? { xs: 24, sm: 24, lg: 24 }
  : props.cols === 2 ? { xs: 24, sm: 12, lg: 12 } : { xs: 24, sm: 12, lg: 8 });

const display = (v?: string | number) => (v === undefined || v === null || v === '' ? '—' : String(v));
const FILE_ICONS: Record<string, unknown> = { pdf: IconUploadPdf /* zip/ppt/doc/xls/png… */ };
const fileIcon = (n: string) => FILE_ICONS[n.split('.').pop()?.toLowerCase() || ''] || IconUploadDefault;

const normalFields = computed(() => props.fields.filter((f) => !f.full));
const fullFields = computed(() => props.fields.filter((f) => f.full));
</script>

<template>
  <div class="pg-detail-content" :class="{ 'is-embedded': embedded }">
    <a-collapse :default-active-key="['basic', 'metrics']" :bordered="false" expand-icon-position="left">
      <a-collapse-item key="basic" header="基本信息">
        <a-row :gutter="20">
          <a-col v-for="f in normalFields" :key="f.label" :xs="colSpan.xs" :sm="colSpan.sm" :lg="colSpan.lg">
            <div class="pg-detail-item">
              <div class="pg-detail-item__label">
                <span v-if="f.required" class="pg-detail-item__required">*</span>{{ f.label }}
              </div>
              <div class="pg-detail-item__value">{{ display(f.value) }}</div>
            </div>
          </a-col>
        </a-row>

        <div v-for="f in fullFields" :key="f.label" class="pg-detail-item pg-detail-item--full">
          <div class="pg-detail-item__label">{{ f.label }}</div>
          <div class="pg-detail-item__value pg-detail-item__value--multiline">{{ display(f.value) }}</div>
        </div>

        <div v-if="files.length" class="pg-detail-item pg-detail-item--full">
          <div class="pg-detail-item__label">附件</div>
          <ul class="pg-detail-files">
            <li v-for="file in files" :key="file.name" class="pg-detail-files__row">
              <span class="pg-detail-files__icon"><component :is="fileIcon(file.name)" /></span>
              <span class="pg-detail-files__name">{{ file.name }}</span>
              <span class="pg-detail-files__ops">
                <a-tooltip content="预览" mini>
                  <a-button type="text" shape="circle" size="small" :aria-label="`预览 ${file.name}`">
                    <template #icon><IconEye /></template>
                  </a-button>
                </a-tooltip>
                <a-tooltip content="下载" mini>
                  <a-button type="text" shape="circle" size="small" :aria-label="`下载 ${file.name}`">
                    <template #icon><IconDownload /></template>
                  </a-button>
                </a-tooltip>
              </span>
            </li>
          </ul>
        </div>
      </a-collapse-item>

      <a-collapse-item v-if="tableColumns.length" key="metrics" header="指标">
        <a-table :columns="tableColumns" :data="tableData" :pagination="false" row-key="key"
                 :bordered="{ wrapper: true }" size="medium" :scroll="{ x: '100%' }" />
      </a-collapse-item>
    </a-collapse>
  </div>
</template>

<style scoped>
.pg-detail-content { padding: 24px; }
.pg-detail-content.is-embedded { padding: 0; }           /* 抽屉/弹窗内由容器控制内边距 */
.pg-detail-item { margin-bottom: 20px; }
.pg-detail-item--full { width: 100%; }
.pg-detail-item__label { margin-bottom: 4px; font-size: 14px; line-height: 22px; color: var(--color-text-2); }
.pg-detail-item__required { margin-right: 4px; color: rgb(var(--red-6)); }
.pg-detail-item__value { font-size: 14px; line-height: 22px; color: var(--color-text-1); overflow-wrap: anywhere; }
.pg-detail-item__value--multiline { white-space: pre-line; }
.pg-detail-files { margin: 0; padding: 0; list-style: none; }
.pg-detail-files__row {
  display: flex; align-items: center; gap: 12px; height: 40px; padding: 0 8px 0 12px; margin-bottom: 8px;
  border: 1px solid var(--color-border-2); border-radius: var(--border-radius-medium); background: var(--color-bg-1);
}
.pg-detail-files__row:last-child { margin-bottom: 0; }
.pg-detail-files__icon { display: inline-flex; flex: none; font-size: 20px; }
.pg-detail-files__name { flex: 1; min-width: 0; font-size: 14px; color: var(--color-text-1);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pg-detail-files__ops { display: inline-flex; flex: none; align-items: center; gap: 4px; }
/* 折叠分组细节同分组表单页（标题16semibold、隐藏header下边框、分组间16、去content左右padding、caret left:0） */
</style>
```

```vue
<!-- index.vue：页面壳 + 三种容器复用同一内容 -->
<template>
  <div class="pg-detail">
    <div class="pg-detail__header">
      <div class="pg-detail__header-left">
        <a-button type="text" @click="router.back()">
          <template #icon><IconLeft style="color: var(--color-text-1)" /></template>
        </a-button>
        <h2 class="pg-detail__title">{{ pageTitle }}</h2>
      </div>
      <div class="pg-detail__header-right">
        <a-button status="danger" @click="handleDelete"><template #icon><IconDelete /></template>删除</a-button>
        <a-button @click="handleEdit"><template #icon><IconEdit /></template>编辑</a-button>
      </div>
    </div>

    <div class="pg-detail__content">
      <DetailContent :fields="fields" :files="files" :table-columns="tableColumns" :table-data="tableData" />
    </div>

    <!-- 复用：抽屉（较窄 → 显式 2 列） -->
    <a-drawer v-model:visible="drawerVisible" :width="720" :title="pageTitle" :footer="false" unmount-on-close>
      <DetailContent embedded :cols="2" :fields="fields" :files="files"
                     :table-columns="tableColumns" :table-data="tableData" />
    </a-drawer>

    <!-- 复用：对话框（限高滚动） -->
    <!-- 取 1000 档：详情里含只读子表单表格（宽组件）。没有表格时应降到 720 / 520 -->
    <a-modal v-model:visible="modalVisible" :title="pageTitle" title-align="start" :width="1000" :footer="false"
             :body-style="{ maxHeight: '60vh', overflowY: 'auto' }" unmount-on-close>
      <DetailContent embedded :fields="fields" :files="files"
                     :table-columns="tableColumns" :table-data="tableData" />
    </a-modal>
  </div>
</template>
```

## 使用要点

1. **复制 `DetailPage/` 整个目录**（`index.vue` + `DetailContent.vue`）到 `src/pages/<PageName>/`，按业务改 `fields` / `files` / 子表单列与数据。
2. **从列表页进入**：列表行操作「查看详情」→ `router.push('/detail/' + id)`（路由加 `:id` 参数），在详情页 `onMounted` 按 id 拉取；若用抽屉/弹窗，则由列表页直接持有 `DetailContent` 并传入当前行数据，不必跳页。
3. **只读就是只读**：不要在详情里放输入控件；需要修改一律走「编辑」进入表单页（[基础表单页](page-form.md) / [分组表单页](page-grouped-form.md) / [分步表单页](page-step-form.md)）。
4. **抽屉/弹窗复用时**：传 `embedded`（去内边距）+ **显式 `cols`**（栅格断点看视口，不看容器宽度）+ `unmount-on-close`（防数据串台）。
5. **空值占位 `—`**：`display()` 统一处理，避免详情页出现成片空白。
6. **附件图标从图标包导入**：按扩展名映射（`IconUploadPdf` 等），兜底 `IconUploadDefault`；预览/下载图标按钮必须有 `aria-label`（可访问性门禁 G7）。
7. **字段少且无分组时**：不必套本模板，直接用 `a-descriptions bordered` 更轻（如分步表单页的末步复核）。
8. **删除需二次确认**，并用 `status="danger"` 表达危险操作；一组操作只保留一个主操作。
9. **mock 数据**：PM demo 用内存数据；开发交付时换成按 id 拉接口，附件 `url` 换成真实地址。

## 与其他页面模板的区别

| 场景 | 用什么模板 |
|---|---|
| 基础列表，单关键词搜索 | [简单列表页](page-simple-list.md) |
| 数据以卡片呈现 | [卡片列表页](page-card-list.md) |
| 字段少、弹窗内**录入** | [对话框表单](page-modal-form.md) |
| 字段多、单一表单一次填完 | [基础表单页](page-form.md) |
| 字段极多、一次填完 + 分组锚点 | [分组表单页](page-grouped-form.md) |
| 录入拆成阶段、逐步校验 | [分步表单页](page-step-form.md) |
| **查看已录入数据（页面 / 抽屉 / 弹窗）** | **本模板（详情页）** |
| 流程审批的详情与处理（公司强制） | [审批详情页](page-approval-detail.md) |
