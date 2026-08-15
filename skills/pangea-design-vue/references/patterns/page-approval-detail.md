---
name: pangea-page-approval-detail
description: "审批详情页模板（流程审批场景的公司强制模板）。结构：页头（流程标题 + 状态 tag + 全屏/打印/传阅）+ 提交人信息行 + 左侧悬浮「快速审批」入口 + 灰底白卡分区（① 业务详情，可复用详情页的 DetailContent ② 审批流程区：Tabs 流程处理/流程图/传阅记录 + 显示审批记录开关 + 以发起人身份操作 + 审批记录表格 + 处理区，处理区的行组成与顺序随所选操作变化）。含传阅对话框与以发起人身份操作对话框。凡是流程审批的详情页面必须套用此模板。"
user-invocable: true
meta:
  id: page-approval-detail
  kind: page-template
  title: 审批详情页
  status: stable
  whenToUse: [流程审批详情, 待我审批打开的单据, 需展示审批记录与处理意见, 公司流程审批场景（强制）]
  whenNotToUse: [无审批流的普通数据查看→详情页, 录入/编辑→表单类模板]
  keyStructure: [页头(流程标题+状态tag+全屏/打印/传阅), 提交人信息行(头像/姓名/部门/提交时间), 左侧悬浮快速审批, 灰底+白卡分区, 业务详情卡(复用DetailContent含只读子表单), 审批流程卡(Tabs：流程处理/流程图占位/传阅记录 + 显示审批记录与以发起人身份操作同行 + 记录表格 + 处理区(行序随操作变化)), 传阅对话框, 以发起人身份操作对话框]
  variants: [可处理（显示处理区）, 只读查看（actionable=false 隐藏处理区）, 全屏沉浸（模拟邮件/待办入口）, 六种操作各自的处理区行序（通过/转办/沟通/驳回/不通过/加签）]
  composeWith: [a-tabs, a-checkbox, a-table, a-radio-group, a-textarea, a-upload, a-tag, a-avatar, a-link, a-modal, a-select, a-dropdown, a-tooltip, a-alert]
  composeBoundary: [页面用灰底白卡不设白底, 业务详情复用 DetailContent 需 embedded, 处理区为左label右内容边框网格, 记录表最后一列承载意见+附件链接, 两个对话框复用同一套 pg-approval-grid 样式]
  controls: { size: default, headerButtons: small, table: medium, circulateModal: 520, originModal: 720 }
  pitfalls: [页面根设白底导致白卡失去区隔, 处理区用 a-descriptions 难放 textarea+按钮, 审批记录表格列宽未固定导致意见列被压缩, 快速审批悬浮标在窄屏挡内容, 全屏只靠 z-index 盖不住Layout需Teleport到body, tab下边框自己再加一条会与Arco的::before重复, 处理区不同操作行的顺序不同不能用固定超集+v-if显隐, 处理意见行在v-for内模板ref会变数组须用函数ref, 传阅对象未选中时确定必须禁用]
  previewRoute: /approval-detail
  source: src/pages/ApprovalDetail/index.vue
  tags: [审批, 流程, 详情, 强制模板]
---

# 审批详情页模板

> **公司在流程审批场景强制要求的设计模板**：凡是「待我审批 / 我已处理」打开的单据详情，都必须套用本模板，不要自行设计审批页。

适用场景：从审批中心 / 待办列表进入某个流程实例，查看业务内容 + 审批流转记录，并在有权限时做出处理（通过 / 转办 / 沟通 / 驳回 / 不通过 / 加签）。

**与[详情页](page-detail.md)的区别**：详情页只是"看数据"；本模板在此之上叠加了**流程语义**——状态、提交人、审批记录、处理动作、流向。业务详情部分**直接复用详情页的 `DetailContent` 组件**，不重复实现。

> ⚠️ 当前实现范围：**页面结构 + 主要交互骨架**。选人（转办/沟通/加签/传阅）用候选人下拉模拟、流程图为占位区、附件不真实上传、接口以 `TODO` 标注，接入时替换。

## 页面结构

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 集团流程IT人人系列技术赋能培训合同  [审批中]            [⎙打印] [➤传阅]      │ ← 页头（白底）
│ (张)张益达  基础架构与云服务管理部 │ 提交于 2024-02-02 18:00:00            │ ← 提交人信息行
├──────────────────────────────────────────────────────────────────────────┤
│┌──┐ ┌────────────────────────────────────────────────────────────────┐   │ ← 灰底
││快│ │ ▾ 基本信息                                                      │   │
││速│ │   合同编号            合同名称             合同类型              │   │ ← 白卡①业务详情
││审│ │   HT2024020200018    IT人人系列…          采购合同              │   │   (复用 DetailContent)
││批│ │   合同说明 / 附件列表 …                                          │   │
│└──┘ └────────────────────────────────────────────────────────────────┘   │
│ ↑悬浮 ┌───────────────────────────────────────────────────────────────┐  │
│      │ 流程处理 │ 流程图 │ 传阅记录                                    │  │ ← 白卡②审批流程
│      │ ☑ 显示审批记录                          以发起人身份操作 ↗      │  │ ← 同行两端对齐
│      │ ┌───────────────────────────────────────────────────────────┐ │  │
│      │ │ 时间        节点名称   操作者  操作  处理意见                │ │  │ ← 审批记录表格
│      │ │ 2024-04-09 发起节点   张益达  提交  提交                    │ │  │
│      │ │ 2024-04-14 部门长     李鹏    同意  同意。使用对方…          │ │  │
│      │ │                                    🔗通用合同模板.docx      │ │  │
│      │ └───────────────────────────────────────────────────────────┘ │  │
│      │ ┌──────────┬────────────────────────────────────────────────┐│  │
│      │ │ 操作      │ ◉通过 ○转办 ○沟通 ○驳回 ○不通过 ○加签         ││  │ ← 处理区
│      │ │ 处理意见  │ [同意                        ]      [提交]     ││  │   左label+右内容
│      │ │ 附件      │ [⤒点击上传]                                    ││  │   ⚠️ 行的组成与顺序
│      │ │ 即将流向  │ LDAP负责人审批：李敏,孙铭阳                      ││  │   随「操作」变化
│      │ │ 当前处理人│ 项目负责人审批：张益达,吴迪                       ││  │   （见下表）
│      │ └──────────┴────────────────────────────────────────────────┘│  │
│      └───────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

## 设计规范

### 背景分层（本模板要点）
本页是**多区块聚合页**：页面根**不设白底**，让 body 灰底（`--color-fill-2`）漏出，各区块用**白卡**区隔（`background: var(--color-bg-1)` + `border-radius: var(--border-radius-large)`），卡片间距 `12px`。与[仪表板示例](../../SKILL.md)同一套背景准则。页头是白底、固定不滚动。

### 页头（两行，白底，固定）
- 容器 `padding: 20px 24px 16px`，底部 `1px solid var(--color-border-2)`
- 第一行：**流程标题**（`20px semibold`、`line-height: 28px`，长标题 `overflow-wrap: anywhere`）+ **状态 tag**（`a-tag`，审批中用 `color="arcoblue"`；按业务映射：已通过 `green`、已驳回/不通过 `red`、草稿 `gray`）；右侧操作 **全屏 / 打印 / 传阅**（`size="small"` 默认按钮 + 图标）

### 全屏（沉浸）模式
审批页在实际业务里**常从邮件、待办、IM 卡片等入口直接打开**，此时看不到全局 Layout 的顶部/侧边导航。模板内置「全屏」按钮用来**预览这种入口下的真实效果**（按钮切换为「退出全屏」，`Esc` 也可退出）：

- 状态类 `is-fullscreen`：`position: fixed; inset: 0; z-index: 1000; height: 100vh`
- **脱离 Layout 后拿不到它的灰底**，必须自己补 `background: var(--color-fill-2)`，否则白卡与背景同色
- ⚠️ **必须用 `<Teleport to="body" :disabled="!isFullscreen">` 把整页移出 Layout**：全局 Layout 的内容区是 `position: relative; z-index: 1`，**会形成层叠上下文**——子元素无论把 `z-index` 写多大都盖不住侧边栏（实测侧边栏仍压在全屏页面之上）。Teleport 到 `body` 才能真正覆盖；组件状态不会丢失。
- 图标用 `IconFullscreen` / `IconFullscreenExit`
- 第二行：`a-avatar :size="24"` + 姓名（`--color-text-1`）+ 部门（`--color-text-3`）+ `1px` 竖分隔线（`--color-border-3`、高 `14px`）+ 「提交于 时间」（`--color-text-3`）；`flex-wrap: wrap` 防窄屏溢出

### 左侧悬浮「快速审批」
- 书签形状：宽 `32px`、主色底（`rgb(var(--primary-6))`）、白字**竖排**（`writing-mode: vertical-rl`）、下方切角用 `clip-path`
- `position: sticky; top: 0` 跟随滚动；内容区左内边距是 `24px`，用 **`margin-left: -16px`**（抵消 24 再留 8）+ **`margin-right: 8px`**，让书签**左右各留 8px**（左贴内容区边缘、右贴白卡都不留白会显得挤）
- **点击行为 = 滚动定位到「处理意见」并聚焦**：审批页通常很长，此入口的价值是"免手动下拉直接给意见"。实现上由 `ApprovalProcess` 用 `defineExpose({ focusComment })` 暴露方法，页面通过 `ref` 调用；`focusComment` 内先把 Tabs 切回「流程处理」（可能停在流程图/传阅记录），再 `scrollIntoView({ behavior: 'smooth', block: 'center' })` + `focus()`
- **窄屏（≤992px）退化为普通横向按钮**（`position: static` + 取消 `clip-path` + 横排文字），避免遮挡内容
- 必须有 `aria-label="快速审批"`（纯图标/竖排文字对读屏不友好）

### 白卡 ① 业务详情
- 直接复用[详情页](page-detail.md)的 `DetailContent.vue`，传 `embedded`（内边距由白卡控制）
- 字段、附件、**只读子表单（如「指标」）** 的规范完全沿用详情页：把子表单的列与数据用 `:table-columns` / `:table-data` 传进去，会自动作为第二个折叠分组呈现

### 白卡 ② 审批流程区（`ApprovalProcess.vue`）
- **Tabs**：`a-tabs` 默认 line 型，`流程处理 / 流程图 / 传阅记录`
  - **分隔线只要一条，且用 Arco 自带的那条**：Arco 的 tab 下边框来自 `.arco-tabs-nav::before`（通栏 1px）。**不要再自己给 `.arco-tabs-nav` 加 `border-bottom`**，否则两条线叠在一起；也不要把 `::before` 关掉，否则线就没了。
  - `.arco-tabs-nav { padding: 0; }` ← 只去掉左右内边距，让线与 tab 通栏对齐
  - `.arco-tabs-content { padding-top: 0; }` ← Arco 默认 `padding-top: 16px`，会与面板自身内边距叠加
  - 内容留白统一交给面板容器（`__pane { padding: 16px }`）
- **顶部一行（两端对齐）**：左「显示审批记录」`a-checkbox`（默认勾选，勾掉后隐藏记录表，长流程时聚焦处理区）；右「以发起人身份操作」`a-link`（打开对话框，见下）。容器 `display: flex; justify-content: space-between; margin-bottom: 16px`
- **审批记录表格**：`a-table` + `:pagination="false"` + `:bordered="{ wrapper: true }"` + `size="medium"`
  - 列：时间 `180` / 节点名称 `140` / 操作者 `128` / 操作 `120` / **处理意见（不固定宽，占满剩余）**
  - **前四列必须固定宽度**，否则意见列会被压缩换行
  - 处理意见列用 slot：意见文本 + 可选**附件链接**（`a-link` + `IconLink`），竖排 `gap: 2px`
  - 列多时 `:scroll="{ x: '100%' }"`
- **处理区**：**左 label 列 + 右内容列的边框网格**（不要用 `a-descriptions`——它难以在单元格里放 textarea + 提交按钮并控制对齐）
  - 外框 `1px solid var(--color-border-2)` + `border-radius: var(--border-radius-medium)` + `overflow: hidden`
  - label 列：宽 `136px`、`padding: 11px 16px`、`--color-text-2`、**灰底 `--color-fill-1`**、右侧 `1px` 分隔线
  - 内容列：`padding: 11px 16px`、`--color-text-1`
  - 第一行固定为 **操作**（`a-radio-group`：通过/转办/沟通/驳回/不通过/加签），**其余行随所选操作变化**（见下）
  - **提交按钮高度始终与 textarea 一致**：容器 `align-items: stretch` + 覆盖 Arco 按钮固定高度 `:deep(.arco-btn) { height: auto }`（textarea 自适应高度会变，写死 32px 会错位）
  - **切换操作时清空上一次的输入**：`watch(form.action)` → 处理意见回填该操作的默认值（仅「通过」有默认「同意」，其余置空）、已选人员/驳回节点/驳回方式/加签方式一并复位。避免把「同意」误带到驳回/不通过，逼审批人写明理由
  - 窄屏（≤768px）label 列上移为整行（`flex-direction: column`），处理意见的按钮换行到下方

#### ⚠️ 处理区的行**组成与顺序**随操作变化（本模板最容易做错的地方）

不同操作不只是"多几行少几行"——**行的先后顺序也不同**（转办/沟通/加签把「即将流向」提到「处理意见」**之上**，因为要先选人再写意见；驳回把「即将流向」压到附件**之后**）。所以**不能用「固定超集 + `v-if` 显隐」**实现，必须**数据驱动行序**：

| 操作 | 行顺序（操作行之后） | 处理意见 | 即将流向 |
|---|---|---|---|
| **通过** | 处理意见 → 附件 → 即将流向 → 当前处理人 | 选填，默认「同意」 | 只读文本 = 下一节点 |
| **转办** | **即将流向** → 处理意见 → 附件 → 当前处理人 | 选填 | 可编辑，入口「添加转办人」 |
| **沟通** | **即将流向** → 处理意见(必填) → 附件 → 当前处理人 | **必填** | 可编辑，入口「添加沟通人」 |
| **驳回** | 驳回到 → 驳回节点通过后 → 处理意见(必填) → 附件 → **即将流向** → 当前处理人 | **必填** | 只读文本 `—` |
| **不通过** | 处理意见(必填) → 附件 → 即将流向 → 当前处理人 | **必填** | 只读文本「结束节点」 |
| **加签** | 加签方式 → **即将流向** → 处理意见 → 附件 → 当前处理人 | 选填 | 可编辑，入口「添加审批人」 |

实现方式：两张表 + 一个 `v-for`。
- `ROW_LAYOUT: Record<action, string[]>` —— 每种操作的**行 key 有序数组**
- `ACTION_CONFIG: Record<action, { commentRequired, pickLabel?, nextText?, defaultComment? }>` —— 每种操作的差异化配置
- 模板 `<template v-for="row in rows" :key="row">` + 一串 `v-if / v-else-if` 按 row key 渲染对应行

行类型（8 种）：

| row key | 内容 |
|---|---|
| `comment` | 处理意见：`a-textarea`（自适应高度）+ 右侧 `primary` 提交按钮，`gap: 12px`；必填时 label 显示 **「处理意见(必填)」** |
| `attach` | 附件：`a-upload` 自定义 `#upload-button` |
| `pickNext` | 即将流向（**需选人**）：`a-link`（`IconPlus` + 「添加转办人 / 添加沟通人 / 添加审批人」）。模板里这是**纯占位入口，点击不触发任何效果**——实际项目接入**组织架构的标准人员选择器**，选完把人员回填本行（通常渲染为可删除的 `a-tag`）；容器已备 `flex-wrap: wrap; gap: 8px` |
| `nextText` | 即将流向（只读文本）：通过取下一节点、驳回 `—`、不通过「结束节点」 |
| `rejectTo` | 驳回到：`a-select`，placeholder「请选择节点」，`max-width: 220px`，选项为可回退的历史节点 |
| `rejectMode` | 驳回节点通过后：`a-radio-group`「按顺序流转 / 返回这个节点所有人」，默认前者 |
| `signMode` | 加签方式：`a-radio-group`「前加签 / 后加签」，每项后跟 `a-tooltip mini` + `IconInfoCircle`——前加签「加签人先处理，之后我处理」、后加签「审核通过，之后让加签人处理」 |
| `handler` | 当前处理人（只读文本，空值 `—`） |

- **提交前校验按操作分支**：必填意见为空 → `请填写处理意见`；驳回未选节点 → `请选择驳回到的节点`。**接入人员选择器后需补「未选人拦截提交」**（模板里选人是占位入口，故暂未加该校验）
- **`ref` 陷阱**：处理意见行在 `v-for` 内渲染，Vue 3 会把同名模板 `ref` **收集成数组**，`commentRow.value.scrollIntoView` 会报错。用**函数 ref**（`:ref="setCommentRow"`）单独接住，才能让「快速审批」正常滚动定位。
- 会签节点是另一种变体（操作只有「同意 / 不同意」、无「即将流向」），当前模板未内置，按同一套 `ROW_LAYOUT` 追加即可。
- **无处理权限时**：传 `actionable=false` 隐藏整个处理区（只读查看）

#### 「流程图」页签
放一个**占位嵌入区**即可，接入时把流程引擎返回的图渲染进来：虚线框（`1px dashed var(--color-border-3)`）+ 浅灰底（`--color-fill-1`）+ 图标 + 「流程图嵌入区域」说明，`min-height: 320px` 固定高度避免切换页签时布局跳动；容器带 `role="img"` + `aria-label`。

#### 「传阅记录」页签
一个带分页的**纯只读**表格（参照 Figma `344:28409`）：
- 列只有三列：**传阅时间 / 传阅发起人 / 传阅对象**，**不设「操作」列**（传阅是既成事实的记录，不支持在此撤回/重发）
- 分页用 `a-table` 内置 `:pagination`（`showTotal` + `showPageSize`，Arco 默认右下角），分页参数由业务层维护、翻页时按页拉取

### 对话框

两个对话框都**复用处理区的 `.pg-approval-grid` / 表单样式**，不要另写一套。

#### 「传阅」对话框（页头传阅按钮，Figma `4889:612531`）
- `a-modal`：`title="传阅"`、**`title-align="start"`**（左对齐）、`:width="520"`，footer 取消 + 确定
- body 一行：`必填星号 + 「传阅对象」` label + **多选 `a-select`**（`multiple` `allow-clear` `:max-tag-count="3"`，placeholder「请选择」）
- 下方 `a-alert type="info"`：「系统会通过「邮件」告知传阅对象」（`margin-top: 16px`）
- **未选择传阅对象时「确定」必须禁用**：`:ok-button-props="{ disabled: circulateTargets.length === 0 }"`
- 每次打开先清空已选（`circulateTargets = []`），避免上次残留

#### 「以发起人身份操作」对话框（Figma `344:28366`）
- 入口是「显示审批记录」同一行**右侧**的 `a-link`；供发起人本人在流程中途催办 / 撤回
- `a-modal`：`title-align="start"`、**`:width="720"`**（无表格，走 720 档；不要用 800——不在 520/720/1000 档位）、`ok-text="提交"`、`unmount-on-close`
- body 用 `.pg-approval-grid` 三行：**操作**（`a-radio-group`「催办 / 撤回」，默认撤回）、**处理意见**（`a-textarea`）、**当前处理人**（只读）

### 提交前校验
- 必填的处理意见为空 → `Message.warning('请填写处理意见')`，不提交
- 需要选人的操作未选人 → `Message.warning('请' + pickLabel)`
- 驳回未选目标节点 → `Message.warning('请选择驳回到的节点')`
- 提交按钮 `loading` 防重复提交

## Vue 代码模板

完整可运行实现见脚手架 `templates/project-starter/src/pages/ApprovalDetail/`（`index.vue` 页面 + `ApprovalProcess.vue` 审批流程区；业务详情复用 `../DetailPage/DetailContent.vue`），预览路由 `/approval-detail`。核心骨架：

```vue
<!-- index.vue：页头 + 灰底白卡分区 -->
<script setup lang="ts">
import { ref } from 'vue';
import { IconEdit, IconPrinter, IconSend } from '@arco-iconbox/vue-pangea-mobile';
import DetailContent, { type DetailField, type DetailFile } from '../DetailPage/DetailContent.vue';
import ApprovalProcess, { type ApprovalRecord } from './ApprovalProcess.vue';

const flow = ref({ title: '…', status: '审批中', applicant: '张益达', department: '…', submitTime: '…' });
const fields = ref<DetailField[]>([/* 业务字段，同详情页 */]);
const files = ref<DetailFile[]>([/* 附件 */]);
const detailColumns = [/* 指标列：编号/指标名称/指标说明/达标要求/兑现金额 */];
const detailTableData = [/* 指标行 */];
const records = ref<ApprovalRecord[]>([/* 审批记录 */]);

// 快速审批：滚动定位到「处理意见」并聚焦
const processRef = ref<{ focusComment: () => void }>();
function handleQuickApprove() {
  processRef.value?.focusComment();
}

// 传阅：多选对象 + 邮件通知说明；未选中时「确定」禁用
const circulateVisible = ref(false);
const circulateTargets = ref<string[]>([]);
const circulateCandidates = ['张益达', '吴迪', '李鹏']; // TODO 换成组织架构选人
function handleCirculate() {
  circulateTargets.value = [];
  circulateVisible.value = true;
}
</script>

<template>
  <div class="pg-approval">
    <div class="pg-approval__header">
      <div class="pg-approval__head-row">
        <div class="pg-approval__title-wrap">
          <h2 class="pg-approval__title">{{ flow.title }}</h2>
          <a-tag color="arcoblue">{{ flow.status }}</a-tag>
        </div>
        <a-space :size="8">
          <!-- 脚手架里还有一个「全屏 / 退出全屏」按钮，见上文「全屏（沉浸）模式」 -->
          <a-button size="small"><template #icon><IconPrinter /></template>打印</a-button>
          <a-button size="small" @click="handleCirculate"><template #icon><IconSend /></template>传阅</a-button>
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

    <div class="pg-approval__body">
      <button class="pg-approval__quick" type="button" aria-label="快速审批" @click="handleQuickApprove">
        <IconEdit /><span class="pg-approval__quick-text">快速审批</span>
      </button>
      <div class="pg-approval__main">
        <section class="pg-approval__card">
          <!-- 业务详情：字段 + 附件 + 只读子表单（指标） -->
          <DetailContent embedded :fields="fields" :files="files"
                         :table-columns="detailColumns" :table-data="detailTableData" />
        </section>
        <ApprovalProcess ref="processRef" :records="records" next-node="LDAP负责人审批：李敏,孙铭阳"
                         current-handler="项目负责人审批：张益达,吴迪" />
      </div>

      <!-- 传阅对话框：多选对象 + 邮件提示；未选中禁用「确定」 -->
      <a-modal v-model:visible="circulateVisible" title="传阅" title-align="start" :width="520"
               ok-text="确定" cancel-text="取消"
               :ok-button-props="{ disabled: circulateTargets.length === 0 }">
        <div class="pg-approval__field">
          <span class="pg-approval__field-label"><em aria-hidden="true">*</em>传阅对象</span>
          <a-select v-model="circulateTargets" multiple allow-clear :max-tag-count="3" placeholder="请选择">
            <a-option v-for="name in circulateCandidates" :key="name" :value="name">{{ name }}</a-option>
          </a-select>
        </div>
        <a-alert type="info" class="pg-approval__field-tip">系统会通过「邮件」告知传阅对象</a-alert>
      </a-modal>
    </div>
  </div>
</template>

<style scoped>
/* 页面根不设白底：漏出 body 灰底，用白卡区隔 */
.pg-approval { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
.pg-approval__header {
  flex-shrink: 0; padding: 20px 24px 16px;
  background: var(--color-bg-1); border-bottom: 1px solid var(--color-border-2);
}
.pg-approval__head-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.pg-approval__title-wrap { display: flex; align-items: center; gap: 8px; min-width: 0; }
.pg-approval__title { margin: 0; font-size: 20px; font-weight: 600; line-height: 28px; color: var(--color-text-1); overflow-wrap: anywhere; }
.pg-approval__desc { display: flex; align-items: center; gap: 8px; margin-top: 8px; font-size: 14px; line-height: 22px; flex-wrap: wrap; }
.pg-approval__applicant { color: var(--color-text-1); }
.pg-approval__dept, .pg-approval__submit { color: var(--color-text-3); }
.pg-approval__divider { width: 1px; height: 14px; background: var(--color-border-3); }
.pg-approval__body { position: relative; flex: 1; min-height: 0; overflow-y: auto; padding: 12px 24px 24px; }
.pg-approval__main { display: flex; flex-direction: column; gap: 12px; }
.pg-approval__card { background: var(--color-bg-1); border-radius: var(--border-radius-large); padding: 16px; }
/* 悬浮「快速审批」书签 */
.pg-approval__quick {
  /* 内容区左内边距 24px：-16 = 抵消 24 再留 8，使书签左右各留 8px */
  position: sticky; top: 0; float: left; margin-left: -16px; margin-right: 8px;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  width: 32px; padding: 8px 6px 12px; font-size: 14px;
  color: var(--color-white); background: rgb(var(--primary-6)); border: none; cursor: pointer; z-index: 1;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), 50% 100%, 0 calc(100% - 8px));
  border-radius: var(--border-radius-small) var(--border-radius-small) 0 0;
}
.pg-approval__quick:hover { background: rgb(var(--primary-5)); }
.pg-approval__quick-text { writing-mode: vertical-rl; letter-spacing: 2px; line-height: 1; }
/* 传阅对话框：label + 控件同行 */
.pg-approval__field { display: flex; align-items: center; gap: 8px; }
.pg-approval__field-label { flex-shrink: 0; font-size: 14px; line-height: 22px; color: var(--color-text-2); }
.pg-approval__field-label em { margin-right: 4px; font-style: normal; color: rgb(var(--danger-6)); }
.pg-approval__field-tip { margin-top: 16px; }
@media (max-width: 992px) {
  .pg-approval__quick { position: static; float: none; margin: 0 0 12px; width: auto;
    flex-direction: row; justify-content: center; padding: 8px 16px; clip-path: none;
    border-radius: var(--border-radius-medium); }
  .pg-approval__quick-text { writing-mode: horizontal-tb; letter-spacing: normal; }
}
</style>
```

```vue
<!-- ApprovalProcess.vue：Tabs + 记录表 + 处理区（核心片段） -->
<script setup lang="ts">
/**
 * 处理区的行**顺序与组成**随操作变化 → 用两张表数据驱动，不要写「固定超集 + v-if 显隐」
 */
const ROW_LAYOUT: Record<string, string[]> = {
  approve:     ['comment', 'attach', 'nextText', 'handler'],
  transfer:    ['pickNext', 'comment', 'attach', 'handler'],
  communicate: ['pickNext', 'comment', 'attach', 'handler'],
  reject:      ['rejectTo', 'rejectMode', 'comment', 'attach', 'nextText', 'handler'],
  refuse:      ['comment', 'attach', 'nextText', 'handler'],
  countersign: ['signMode', 'pickNext', 'comment', 'attach', 'handler'],
};
const ACTION_CONFIG: Record<string, { commentRequired: boolean; pickLabel?: string; nextText?: string; defaultComment?: string }> = {
  approve:     { commentRequired: false, defaultComment: '同意', nextText: '' },
  transfer:    { commentRequired: false, pickLabel: '添加转办人' },
  communicate: { commentRequired: true,  pickLabel: '添加沟通人' },
  reject:      { commentRequired: true,  nextText: '—' },
  refuse:      { commentRequired: true,  nextText: '结束节点' },
  countersign: { commentRequired: false, pickLabel: '添加审批人' },
};
const cfg = computed(() => ACTION_CONFIG[form.value.action]);
const rows = computed(() => ROW_LAYOUT[form.value.action] || []);
const commentLabel = computed(() => (cfg.value.commentRequired ? '处理意见(必填)' : '处理意见'));

// 切换操作 → 清空上一操作的输入（通过回填默认「同意」）
watch(() => form.value.action, (action) => {
  form.value.comment = ACTION_CONFIG[action].defaultComment || '';
  form.value.picked = [];
  form.value.rejectTo = undefined;
  form.value.rejectMode = 'sequence';
  form.value.signMode = 'before';
});

// 处理意见行在 v-for 内 → 模板 ref 会变数组，必须用函数 ref
const commentRow = ref<HTMLElement>();
const commentInput = ref<{ focus?: () => void }>();
function setCommentRow(el: unknown) { commentRow.value = (el as HTMLElement) || undefined; }
function setCommentInput(el: unknown) { commentInput.value = (el as { focus?: () => void }) || undefined; }
</script>

<template>
  <div class="pg-approval-process">
    <a-tabs v-model:active-key="activeTab" class="pg-approval-process__tabs">
      <a-tab-pane key="process" title="流程处理">
        <div class="pg-approval-process__pane">
          <!-- 同一行两端对齐：显示审批记录 / 以发起人身份操作 -->
          <div class="pg-approval-process__bar">
            <a-checkbox v-model="showRecords">显示审批记录</a-checkbox>
            <a-link @click="openOrigin">以发起人身份操作</a-link>
          </div>

          <a-table v-if="showRecords" class="pg-approval-process__table" :columns="columns" :data="records"
                   :pagination="false" row-key="key" :bordered="{ wrapper: true }" size="medium" :scroll="{ x: '100%' }">
            <template #comment="{ record }">
              <div class="pg-approval-process__comment">
                <span>{{ record.comment }}</span>
                <a-link v-if="record.attachment"><template #icon><IconLink /></template>{{ record.attachment }}</a-link>
              </div>
            </template>
          </a-table>

          <!-- 处理区：操作行固定在最上，其余行按 ROW_LAYOUT 的顺序渲染 -->
          <div v-if="actionable" class="pg-approval-grid">
            <div class="pg-approval-grid__row">
              <div class="pg-approval-grid__label">操作</div>
              <div class="pg-approval-grid__value">
                <a-radio-group v-model="form.action">
                  <a-radio v-for="a in ACTIONS" :key="a.value" :value="a.value">{{ a.label }}</a-radio>
                </a-radio-group>
              </div>
            </div>

            <template v-for="row in rows" :key="row">
              <!-- 加签方式（带说明 tooltip） -->
              <div v-if="row === 'signMode'" class="pg-approval-grid__row">
                <div class="pg-approval-grid__label">加签方式</div>
                <div class="pg-approval-grid__value">
                  <a-radio-group v-model="form.signMode">
                    <a-radio value="before">前加签
                      <a-tooltip content="加签人先处理，之后我处理" mini><IconInfoCircle class="pg-approval-grid__tip" /></a-tooltip>
                    </a-radio>
                    <a-radio value="after">后加签
                      <a-tooltip content="审核通过，之后让加签人处理" mini><IconInfoCircle class="pg-approval-grid__tip" /></a-tooltip>
                    </a-radio>
                  </a-radio-group>
                </div>
              </div>

              <!-- 驳回到 / 驳回节点通过后 -->
              <div v-else-if="row === 'rejectTo'" class="pg-approval-grid__row">
                <div class="pg-approval-grid__label">驳回到</div>
                <div class="pg-approval-grid__value">
                  <a-select v-model="form.rejectTo" placeholder="请选择节点" :options="NODE_OPTIONS" style="max-width: 220px" />
                </div>
              </div>
              <div v-else-if="row === 'rejectMode'" class="pg-approval-grid__row">
                <div class="pg-approval-grid__label">驳回节点通过后</div>
                <div class="pg-approval-grid__value">
                  <a-radio-group v-model="form.rejectMode">
                    <a-radio value="sequence">按顺序流转</a-radio>
                    <a-radio value="all">返回这个节点所有人</a-radio>
                  </a-radio-group>
                </div>
              </div>

              <!-- 即将流向：选人入口（转办/沟通/加签）。
                   占位入口，点击不触发任何效果；TODO 接入组织架构的标准人员选择器 -->
              <div v-else-if="row === 'pickNext'" class="pg-approval-grid__row">
                <div class="pg-approval-grid__label">即将流向</div>
                <div class="pg-approval-grid__value pg-approval-grid__value--pick">
                  <a-link><template #icon><IconPlus /></template>{{ cfg.pickLabel }}</a-link>
                </div>
              </div>

              <!-- 处理意见（函数 ref 供「快速审批」滚动定位） -->
              <div v-else-if="row === 'comment'" :ref="setCommentRow" class="pg-approval-grid__row">
                <div class="pg-approval-grid__label">{{ commentLabel }}</div>
                <div class="pg-approval-grid__value pg-approval-grid__value--comment">
                  <a-textarea :ref="setCommentInput" v-model="form.comment" placeholder="请输入"
                              :auto-size="{ minRows: 2, maxRows: 5 }" />
                  <a-button type="primary" :loading="submitting" @click="handleSubmit">提交</a-button>
                </div>
              </div>

              <!-- 附件 / 即将流向(只读) / 当前处理人 同构，此处省略 -->
            </template>
          </div>
        </div>
      </a-tab-pane>
      <!-- 流程图：占位嵌入区；传阅记录：三列只读表格 + 分页 -->
    </a-tabs>

    <!-- 以发起人身份操作：复用 .pg-approval-grid 三行（操作/处理意见/当前处理人） -->
    <a-modal v-model:visible="originVisible" title="以发起人身份操作" title-align="start"
             :width="720" ok-text="提交" unmount-on-close @ok="submitOrigin">
      <div class="pg-approval-grid"><!-- … --></div>
    </a-modal>
  </div>
</template>

<style scoped>
.pg-approval-process { background: var(--color-bg-1); border-radius: var(--border-radius-large); }
/* 只去 nav 内边距，保留 Arco 自带的 ::before 分隔线（别再自己加 border-bottom，会变两条） */
.pg-approval-process__tabs :deep(.arco-tabs-nav) { padding: 0; }
.pg-approval-process__tabs :deep(.arco-tabs-content) { padding-top: 0; }
.pg-approval-process__pane { padding: 16px; }
/* 流程图占位区 */
.pg-approval-chart {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  min-height: 320px; padding: 24px; color: var(--color-text-3);
  background: var(--color-fill-1); border: 1px dashed var(--color-border-3);
  border-radius: var(--border-radius-medium);
}
/* 显示审批记录 + 以发起人身份操作：同一行两端对齐 */
.pg-approval-process__bar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
.pg-approval-process__table { margin-bottom: 16px; }
.pg-approval-process__comment { display: flex; flex-direction: column; gap: 2px; align-items: flex-start; }
.pg-approval-grid { border: 1px solid var(--color-border-2); border-radius: var(--border-radius-medium); overflow: hidden; }
.pg-approval-grid__row { display: flex; align-items: stretch; border-bottom: 1px solid var(--color-border-2); }
.pg-approval-grid__row:last-child { border-bottom: none; }
.pg-approval-grid__label {
  flex: none; width: 136px; padding: 11px 16px; font-size: 14px; line-height: 22px;
  color: var(--color-text-2); background: var(--color-fill-1); border-right: 1px solid var(--color-border-2);
}
.pg-approval-grid__value { flex: 1; min-width: 0; padding: 11px 16px; font-size: 14px; line-height: 22px; color: var(--color-text-1); }
/* stretch + height:auto → 提交按钮高度始终等于自适应高度的 textarea */
.pg-approval-grid__value--comment { display: flex; align-items: stretch; gap: 12px; }
.pg-approval-grid__value--comment :deep(.arco-textarea-wrapper) { flex: 1; min-width: 0; }
.pg-approval-grid__value--comment :deep(.arco-btn) { height: auto; }
/* 选人行：入口 link + 已选人员标签 */
.pg-approval-grid__value--pick { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.pg-approval-grid__tip { margin-left: 4px; color: var(--color-text-3); }
@media (max-width: 768px) {
  .pg-approval-grid__row { flex-direction: column; }
  .pg-approval-grid__label { width: 100%; border-right: none; border-bottom: 1px solid var(--color-border-2); }
  .pg-approval-grid__value--comment { flex-direction: column; align-items: stretch; }
}
</style>
```

## 使用要点

1. **复制 `ApprovalDetail/` 目录**（`index.vue` + `ApprovalProcess.vue`）到 `src/pages/<PageName>/`；业务详情区依赖 `DetailPage/DetailContent.vue`，**请连带复制**，或替换为你自己的业务详情组件。
2. **从待办列表进入**：路由带流程实例 id（如 `/approval-detail/:id`），`onMounted` 按 id 拉取「业务字段 + 审批记录 + 当前节点 + 我的处理权限」。
3. **状态 tag 按业务映射颜色**：审批中 `arcoblue`、已通过 `green`、驳回/不通过 `red`、草稿 `gray`；文案取后端状态字典，不要写死。
4. **处理权限**：无权处理时传 `actionable=false` 隐藏处理区，只保留记录（同一页面同时服务「待我审批」和「我已处理/我发起的」）。
5. **审批记录表格前四列固定宽度**，让「处理意见」列吃掉剩余空间；意见里的附件用 `a-link`。
6. **背景分层**：页面根不要设白底，否则白卡与背景同色、区隔消失（这是最容易犯的错）。
7. **提交后刷新**：真实接口成功后要重新拉取记录与当前节点（审批完可能流转到下一节点或结束），并根据结果更新状态 tag。
8. **处理区行序由 `ROW_LAYOUT` / `ACTION_CONFIG` 两张表驱动**：要增删操作、调整某个操作的行序，只改这两张表，不要在模板里堆 `v-if`。新增行类型时同步加一个 `v-else-if` 分支。
9. **交互细节（已内置，改动时勿丢）**：
   - 「全屏」用于预览「从邮件/待办直接进入」的形态；**必须 Teleport 到 body**（Layout 内容区的层叠上下文会挡住），且自补灰底；`Esc` 退出
   - 「快速审批」点击 = 切回「流程处理」页签 + 平滑滚动到处理意见 + 聚焦输入框（`defineExpose({ focusComment })`）；处理意见行在 `v-for` 内，**必须用函数 ref** 否则拿到数组；书签左右各留 `8px`（`margin-left: -16px` + `margin-right: 8px`）
   - 「添加转办人 / 沟通人 / 审批人」是**占位入口，点击无任何效果**——接入时替换为组织架构的标准人员选择器，并补上「未选人拦截提交」
   - 切换操作时清空上一次输入（意见回填该操作默认值、已选人员/驳回节点/驳回方式/加签方式复位）
   - 提交按钮高度跟随 textarea（`align-items: stretch` + `.arco-btn { height: auto }`）
   - 必填意见为空 / 该选人没选 / 驳回未选节点，都拦截提交；提交中按钮 `loading`
   - 传阅对话框未选对象时「确定」禁用；每次打开清空已选
10. **后续迭代（当前为 TODO）**：把候选人下拉替换为组织架构选人组件、流程图接入流程引擎、附件真实上传与预览、会签节点变体、批量审批。

## 与其他页面模板的区别

| 场景 | 用什么模板 |
|---|---|
| 基础列表 / 卡片列表 | [简单列表页](page-simple-list.md) / [卡片列表页](page-card-list.md) |
| 录入 / 编辑 | [基础表单页](page-form.md) · [分组表单页](page-grouped-form.md) · [分步表单页](page-step-form.md) · [对话框表单](page-modal-form.md) |
| 查看已录入数据（无审批流） | [详情页](page-detail.md) |
| **流程审批的详情与处理（公司强制）** | **本模板（审批详情页）** |
