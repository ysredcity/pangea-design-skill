---
name: pangea-design-rules
description: "Pangea 全局设计规则的 Vue + Arco 落地写法（跨页型/跨组件生效）。规则正文在 design-core.md（技术栈无关、与通用版共用），本文件给出每条规则在 Arco 组件、脚手架与页面模板中的具体写法。"
user-invocable: false
---

# Pangea 全局设计规则（Vue + Arco 写法）

**规则正文在 [design-core.md](design-core.md)**——技术栈无关，与通用版 skill `pangea-design-universal` 共用同一份（源文件为仓库 `shared/design-core.md`，同步生成，勿在此手改）。**本文件只写「在 Arco / 本脚手架里怎么落地」**，两份要一起读：先看 core 的规则，再看这里的写法。

| 边界 | 归属 |
|---|---|
| 跨 2 个以上页型/组件生效的规则正文 | [design-core.md](design-core.md)（共享） |
| 这些规则的 Arco / 脚手架写法 | **本文件** |
| 单个组件的适用边界与独有坑 | [component-selection/](component-selection/)（frontmatter `meta` 喂 `_generated/catalog.json`） |
| 单个页型的区块结构与示例代码 | [patterns/page-*.md](patterns/) |
| 组件 API（属性/事件/插槽） | [components/](components/)——**上游 Arco 镜像，不改** |
| token 取值表 | [theme/design-tokens.md](theme/design-tokens.md) |

## 速查

| 本文件 | 规则正文 |
|---|---|
| [1.1 表单承载容器决策路径](#11-表单承载容器决策路径) | [C1](design-core.md#c1-表单承载容器决策路径) |
| [1.2 对话框宽度档位（硬约束）](#12-对话框宽度档位硬约束) | [C2](design-core.md#c2-对话框宽度档位硬约束) |
| [1.3 页面背景分层](#13-页面背景分层) | [C3](design-core.md#c3-页面背景分层) |
| [2.1 按钮组规范](#21-按钮组规范) | [C4](design-core.md#c4-按钮组规范) |
| [2.2 控件密度](#22-控件密度) | [C5](design-core.md#c5-控件密度) |
| [2.3 状态不只靠颜色传达](#23-状态不只靠颜色传达) | [C6](design-core.md#c6-状态不只靠颜色传达) |
| [2.4 单组件选型速查](#24-单组件选型速查) | [C7](design-core.md#c7-组件选型速查) |
| [2.5 行内视图切换用 radio-button，且一律居左](#25-行内视图切换用-radio-button且一律居左) | [C8](design-core.md#c8-行内视图切换用分段控件且一律居左) |
| [3.1 主题取值铁律](#31-主题取值铁律) | [C9](design-core.md#c9-取值铁律) |
| [3.2 响应式适配](#32-响应式适配) | [C10](design-core.md#c10-响应式适配) |

---

# 一、容器与布局

## 1.1 表单承载容器决策路径

规则（完成时间 + 特定场景两步判定）见 [C1](design-core.md#c1-表单承载容器决策路径)。判定出容器后，落到本 skill 的模板：

| 结论 | 用哪个模板 |
|---|---|
| 对话框 | [page-modal-form.md](patterns/page-modal-form.md)（宽度必须落在档位上，见 [1.2](#12-对话框宽度档位硬约束)） |
| 抽屉 | **暂无固化模板**——用 `a-drawer` 承载，字段组织参照 [page-form.md](patterns/page-form.md)；需要持续参考页面数据时用非模态（`:mask="false"`） |
| 表单页（字段较多，一次填完） | [page-form.md](patterns/page-form.md) |
| 表单页（分组 ≥ 3 + 锚点定位） | [page-grouped-form.md](patterns/page-grouped-form.md) |
| 表单页（多步骤 / 含分支） | [page-step-form.md](patterns/page-step-form.md) |

## 1.2 对话框宽度档位（硬约束）

档位 520 / 720 / 1000、确认类 400 的规则见 [C2](design-core.md#c2-对话框宽度档位硬约束)。Arco 写法：

- **520 是 `a-modal` 的默认宽度**，不传 `width` 即可；720 / 1000 传 `:width="720"` / `:width="1000"`。
- **确认类弹窗**用 `Modal.confirm / warning / info / error / success`（simple 模式），**不要传 `width`**。
  - ⚠️ 脚手架已内置全局覆盖 `.arco-modal-simple { box-sizing: border-box }`（`src/styles/arco-overrides.less`）。原因：`.arco-modal` 是 **content-box**，simple 模式把 `padding: 24px 32px 32px` 加在**根节点**上，Arco 自带的 `width: 400px` 实际渲染成 **464px**；改 border-box 后才是规范的 400。**复制脚手架时勿丢这个文件与 `main.ts` 里的引入。**
- 窄屏防溢出：改小宽度或 `fullscreen`。
- **机检**：`npm run check:tokens`（含在 `npm run gate`）会扫 `<a-modal>` 的字面 `width`，非档位或 >1000 直接报错；`width="auto"`、`fullscreen`、绑定表达式跳过。

## 1.3 页面背景分层

规则见 [C3](design-core.md#c3-页面背景分层)。在本脚手架中：

- 全局 Layout 的**内容区默认透明**，漏出 body 层灰色（`--color-fill-2`）；**不要依赖 Layout 提供背景**，新页面务必显式设置自己的背景。
- 常规内容页：页面根元素 `background: var(--color-bg-1)`。内容区的左上圆角 + overflow 会把白底裁出圆角。
- 仪表板类聚合页：页面根保持透明，区块用 `<a-card :bordered="false">`（白底），圆角 `var(--border-radius-large)` + 极轻阴影。

---

# 二、组件与交互

## 2.1 按钮组规范

规则见 [C4](design-core.md#c4-按钮组规范)。Arco 写法：

- 主按钮 `type="primary"`，其余默认按钮；超过 3 个时用 `a-dropdown` 折叠次要项；危险操作 `status="danger"`。
- 落地参考：[page-simple-list.md](patterns/page-simple-list.md) 操作栏（左侧按钮组首个为 `type="primary"`、`gap: 8px`、所有按钮 `size="small"`）。
- 「同一组最多 1 个主按钮」同时是质量门禁 G6 的检查项，见 [quality-gates.md](overview/quality-gates.md)。

## 2.2 控件密度

分档规则见 [C5](design-core.md#c5-控件密度)。档位与 Arco `size` 的对应：

| 区域 | Arco 写法 |
|---|---|
| 浏览类页面的**操作栏按钮、搜索控件、树内搜索框** | `size="small"` |
| **表格本身** | `size="medium"` |
| **分页器** | `size="small"` |
| **表单页的表单控件与操作栏按钮**（含返回文本按钮） | **默认尺寸**（不传 `size`） |
| 表格单元格内的**内联控件**（`a-switch`、文本按钮等） | `size="small"` / `size="mini"` |

事实源是脚手架实现：`src/pages/Example/index.vue`（表格 `medium`、分页 `small`、操作栏按钮 `small`）、`src/pages/TreeTable/index.vue`、以及 [page-form.md](patterns/page-form.md)「操作栏按钮统一使用默认尺寸 / 表单内控件用默认尺寸」。

> ⚠️ `a-steps` 的小尺寸**没有 `size` 属性**，要用布尔属性 `small`；写 `size="small"` 静默无效。

## 2.3 状态不只靠颜色传达

规则见 [C6](design-core.md#c6-状态不只靠颜色传达)。Arco 写法：

- 表格状态列用 `<a-badge :status="..." :text="..." />`（独立使用，不包裹子元素），不允许只给一个色点。
- 归属组件见 [badge.md](component-selection/badge.md)（状态点首选，分类标注改用 `a-tag`）。**检查项**：质量门禁 G7，见 [quality-gates.md](overview/quality-gates.md)。

## 2.4 单组件选型速查

通用结论见 [C7](design-core.md#c7-组件选型速查)。对应的 Arco 组件与详情页：

| 组件 | 一句话结论 | 详情 |
|---|---|---|
| Table 表格 | 规整多列结构化数据用它；每条信息图文混合且丰富时改用卡片 | [table.md](component-selection/table.md) |
| Card 卡片 | 内容分块、卡片网格、仪表板区块用它；**仅需分隔就用间距，别为分隔套卡片** | [card.md](component-selection/card.md) |
| Form 表单 | 结构化字段录入 + 校验用它；**提交与校验二选一**，声明式与命令式不混用 | [form.md](component-selection/form.md) |
| Modal 对话框 | 轻量确认与不跳转的临时任务用它；字段极多的长流程改表单页，侧向持久面板改抽屉。宽度见 [1.2](#12-对话框宽度档位硬约束)，容器选择见 [1.1](#11-表单承载容器决策路径) | [modal.md](component-selection/modal.md) |
| Select 选择器 | 有限选项单选/多选用它；**选项 2–3 个改 `a-radio-group`**，布尔改 `a-switch`，层级数据改 `a-tree-select` | [select.md](component-selection/select.md) |
| Tabs 标签页 | 同一区域切换多组**成块内容**用它；页面级导航用菜单/路由，步骤流程用 `a-steps`，**工具栏内切换数据视图用 `a-radio-group type="button"`**（见 [2.5](#25-行内视图切换用-radio-button且一律居左)） | [tabs.md](component-selection/tabs.md) |
| Menu 菜单 | 侧边/顶部导航用它；**全局 Layout 已封装侧边菜单，新增页面只在 `menuItems` 追加，不要重写 Layout** | [menu.md](component-selection/menu.md) |
| Badge 徽标 | 状态点 + 文字、未读计数用它，表格状态列首选；分类标注改 `a-tag`。**状态不只靠颜色传达，必须带文字** | [badge.md](component-selection/badge.md) |
| Alert 警告提示 | 页内**持久**提示用它；操作后**瞬时**反馈用 `Message`，需确认用 `Modal`/`Popconfirm`，全局富内容用 `Notification` | [alert.md](component-selection/alert.md) |
| Pagination 分页 | 列表/表格分页用它；`total` 与真实数据联动**不写死**，筛选后复位 `current=1` | [pagination.md](component-selection/pagination.md) |

**产品专属业务组件优先级更高**：需求命中某产品触发词时，该场景优先用 [components-business/](components-business/README.md) 下的业务组件；未命中一律用上表通用组件。

## 2.5 行内视图切换用 radio-button，且一律居左

规则见 [C8](design-core.md#c8-行内视图切换用分段控件且一律居左)。Arco 中「分段控件」= `<a-radio-group type="button">`，**不要用 `a-tabs`**（`a-tabs` 的 nav 会占满整行、并渲染一块空的内容面板）。

落地参考：[FilterBar](components-shared/filter-bar.md) 的 `#title` 插槽放 radio-button 切换视图。

---

# 三、取值与适配

## 3.1 主题取值铁律

规则见 [C9](design-core.md#c9-取值铁律)。在本脚手架中：

- 变量由主题包 `@arco-themes/vue-pangea-3-linear` 在运行时注入，**颜色与圆角**可直接用 CSS 变量；字号、间距等是 Less 变量（`@font-size-body-3`、`@spacing-7`），在 scoped 样式里按 [design-tokens.md](theme/design-tokens.md) 取值。
- 暗色由 `body[arco-theme='dark']` 触发，组件只用语义变量即可自动适配。
- 完整取值见 [design-tokens.md](theme/design-tokens.md)。

## 3.2 响应式适配

规则见 [C10](design-core.md#c10-响应式适配)。Arco 写法：

- **多列表单用 Arco Grid 断点，不写死 `:span`**：3 列表单 `:xs="24" :sm="12" :lg="8"`，2 列表单 `:xs="24" :sm="12"`；整行字段保持 `:span="24"`。
- **表格窄屏**设 `:scroll="{ x }"` 横向滚动。
- **对话框窄屏**改小宽度或 `fullscreen`。
- 优先用 Arco Grid 的断点属性表达响应式，能不写媒体查询就不写；确需媒体查询时放在组件 scoped 样式里。详见 [responsive-design.md](patterns/responsive-design.md)。
