---
name: pangea-design-rules
description: "Pangea 全局设计规则（跨页型/跨组件生效）。用于表单承载容器决策（对话框/抽屉/表单页）、按钮组排列与主次、对话框宽度档位、页面背景分层、主题取值铁律、响应式适配、单组件选型速查。"
user-invocable: false
---

# Pangea 全局设计规则

**本文件是跨对象设计规则的唯一事实源。** 收录标准：一条规则要在**2 个以上页型或组件**上生效。

| 边界 | 归属 |
|---|---|
| 跨 2 个以上页型/组件生效的规则正文 | **本文件** |
| 单个组件的适用边界与独有坑 | [component-selection/](component-selection/)（frontmatter `meta` 喂 `_generated/catalog.json`） |
| 单个页型的区块结构与示例代码 | [patterns/page-*.md](patterns/) |
| 组件 API（属性/事件/插槽） | [components/](components/)——**上游 Arco 镜像，不改** |
| token 取值表 | [theme/design-tokens.md](theme/design-tokens.md) |

## 速查

- [1.1 表单承载容器决策路径](#11-表单承载容器决策路径)
- [1.2 对话框宽度档位（硬约束）](#12-对话框宽度档位硬约束)
- [1.3 页面背景分层](#13-页面背景分层)
- [2.1 按钮组规范](#21-按钮组规范)
- [2.2 控件密度](#22-控件密度)
- [2.3 状态不只靠颜色传达](#23-状态不只靠颜色传达)
- [2.4 单组件选型速查](#24-单组件选型速查)
- [3.1 主题取值铁律](#31-主题取值铁律)
- [3.2 响应式适配](#32-响应式适配)

---

# 一、容器与布局

## 1.1 表单承载容器决策路径

出现「新建 / 编辑」等表单场景时，用于判断该用**对话框 / 抽屉 / 表单页**中的哪一种容器。决策分两步:**先估完成时间，再看是否命中特定场景**。

### 第一步：预估完成时间

| 时间档 | 容器 | 用户心理模型 |
|---|---|---|
| **≤ 30 秒** | 对话框 | "快速处理一下，马上回来" |
| **30 秒 ~ 3 分钟** | 抽屉 | "需要花点时间填写，但我还在这个页面的语境里" |
| **> 3 分钟** | 表单页 | "这是一项独立的任务，我要集中精力完成" |

### 第二步：特定场景（命中则覆盖第一步结论）

| 条件 | 直接结论 | 原因 |
|---|---|---|
| 短步骤（2 步）且每步均为短字段 | → **对话框**（分步） | 总时长仍在 30s 内，对话框可承载 |
| 多步骤（≥ 3 步）或含分支逻辑 | → **抽屉 / 表单页** | 步骤导航 + 内容量需要完整页面 |
| 多个分组（≥ 3 组） | → **抽屉** | 内容量较大，需更大的竖向空间 |
| 多个分组（≥ 3 组）+ 锚点导航 | → **表单页** | 内容结构化程度高，且有左右布局情况，需独立空间 |
| 填写时必须持续参考页面数据 | → **抽屉（非模态）** | 对话框遮挡页面，无法参考 |

### 第三步：落到模板

| 结论 | 用哪个模板 |
|---|---|
| 对话框 | [page-modal-form.md](patterns/page-modal-form.md)（宽度必须落在档位上，见 [1.2](#12-对话框宽度档位硬约束)） |
| 抽屉 | **暂无固化模板**——用 `a-drawer` 承载，字段组织参照 [page-form.md](patterns/page-form.md)；需要持续参考页面数据时用非模态（`:mask="false"`） |
| 表单页（字段较多，一次填完） | [page-form.md](patterns/page-form.md) |
| 表单页（分组 ≥ 3 + 锚点定位） | [page-grouped-form.md](patterns/page-grouped-form.md) |
| 表单页（多步骤 / 含分支） | [page-step-form.md](patterns/page-step-form.md) |

> 装不进对话框最大档位（1000）的内容，说明它不该待在对话框里 → 按上表升级到抽屉或表单页。

## 1.2 对话框宽度档位（硬约束）

对话框宽度**只有三个档位**，且**不允许超过 1000**：

| 档位 | 用在什么场景 |
|---|---|
| **520** | 默认档。字段少的轻量录入、单个选择/输入、简单信息展示（`a-modal` 不传 `width` 就是 520） |
| **720** | 字段较多需要 2 列栅格、或内容较长需要更多横向空间 |
| **1000** | **仅当弹窗内含表格等宽组件时**（只读子表单表格、可编辑明细表格、宽数据列表）才允许使用 |

- **不得写 712 / 800 / 960 / 1200 这类非档位值**，也**不得超过 1000**（更宽的内容说明它不该待在弹窗里 → 改用独立页面，见 [page-form.md](patterns/page-form.md)）。
- **1000 档要能说出理由**：弹窗里没有表格就不要用 1000，降到 720 或 520。
- **确认类弹窗固定 400**：删除确认、操作确认、风险提示等用 `Modal.confirm / warning / info / error / success`（simple 模式），规范宽度 **400px**，**不要传 `width`**。
  - ⚠️ 脚手架已内置一条全局覆盖 `.arco-modal-simple { box-sizing: border-box }`（`src/styles/arco-overrides.less`）。原因：`.arco-modal` 是 **content-box**，simple 模式把 `padding: 24px 32px 32px` 加在**根节点**上，Arco 自带的 `width: 400px` 在 content-box 下实际渲染成 **464px**；改 border-box 后 400 才是真实视觉宽度。**复制脚手架时勿丢这个文件与 `main.ts` 里的引入。**
- 窄屏仍要防溢出：固定宽度不能超过视口，窄屏改小宽度或 `fullscreen`。
- **机检**：`npm run check:tokens`（含在 `npm run gate`）会扫 `<a-modal>` 的字面 `width`，非档位或 >1000 直接报错；`width="auto"`、`fullscreen`、绑定表达式跳过。

## 1.3 页面背景分层

全局 Layout 的**内容区默认透明**，漏出 body 层灰色（`--color-fill-2`）。**具体背景色由每个页面自己决定**，不要依赖 Layout 提供背景——新页面务必显式设置自己的背景：

- **常规内容页**（列表页、表单页、详情页等，页面本身是一整块内容）：页面根元素设白底 `background: var(--color-bg-1)`，铺满内容区。内容区的左上圆角 + overflow 会把白底裁出圆角，自动复现「白面板悬浮在灰底」的观感。
- **仪表板 / 工作台类聚合页**（多个独立区块拼合）：页面根**保持透明**（露出灰底），页内每个区块用**白底卡片**承载（`a-card` 白底、**去边框** `:bordered="false"`）——灰底 + 无边框白卡是这类页的标准做法，靠底色差异而非边框线区隔区块。卡片建议用**大圆角** `var(--border-radius-large)` + **极轻阴影**（如 `box-shadow: 0 1px 4px rgba(0,0,0,0.05)`）增强区隔与层次；卡内强调图标可用「浅底色芯片」（强调色 10% 透明度做底、同色图标）提升设计感。
- 灰底取 `--color-fill-2`（与 Layout body 一致），白底取 `--color-bg-1`，均用变量，不写死 hex。

---

# 二、组件与交互

## 2.1 按钮组规范

在列表页、表单页等场景中，按钮经常成组出现，多个按钮的排列、主次遵循以下约定：

1. **按钮组在父级容器左侧时，按重要性从左至右排列**（最重要的在最左）。例：表格顶部操作栏。
2. **按钮组在父级容器右侧时，按重要性从右至左排列**（最重要的在最右）。例：页面顶部操作栏。
3. **一组按钮超过 3 个时**，视情况增加 `a-dropdown`，把次要按钮折叠进下拉菜单。
4. **同一组按钮中最多只能有 1 个主按钮**（`type="primary"`），其余用默认按钮。

> 规则 1、2 的方向差异来自阅读起点：靠左的按钮组从左边缘起读，靠右的按钮组视线落点在右边缘。两者都是「最重要的离容器边缘最近」。

落地参考：[page-simple-list.md](patterns/page-simple-list.md) 操作栏（左侧按钮组首个为 `type="primary"`、`gap: 8px`、所有按钮 `size="small"`）。规则 4 同时是质量门禁 G6 的检查项，见 [quality-gates.md](overview/quality-gates.md)。

## 2.2 控件密度

中后台默认紧凑，但**密度按区域性质分档，不是全局一律 `small`**：

| 区域 | 尺寸 |
|---|---|
| 浏览类页面（列表页 / 卡片列表 / 左树右表）的**操作栏按钮、搜索控件、树内搜索框** | `size="small"` |
| **表格本身** | `size="medium"` |
| **分页器** | `size="small"` |
| **表单页的表单控件与操作栏按钮**（含返回文本按钮） | **默认尺寸**——表单字段是页面主体，不需要 small |
| 表格单元格内的**内联控件**（`a-switch`、文本按钮等） | `size="small"` / `size="mini"` |

事实源是脚手架实现：`src/pages/Example/index.vue`（表格 `medium`、分页 `small`、操作栏按钮 `small`）、`src/pages/TreeTable/index.vue`、以及 [page-form.md](patterns/page-form.md)「操作栏按钮统一使用默认尺寸 / 表单内控件用默认尺寸」。

> ⚠️ `a-steps` 的小尺寸**没有 `size` 属性**，要用布尔属性 `small`；写 `size="small"` 静默无效。

## 2.3 状态不只靠颜色传达

- **状态必须「颜色 + 文字」双通道**：表格状态列用 `<a-badge :status="..." :text="..." />`（独立使用，不包裹子元素），不允许只给一个色点。
- **图表系列、多色标签/分类**除颜色外要有图例文字或图标区分。
- **纯图标按钮必须有可访问名**（`aria-label` 或 tooltip 文本）。
- 正文对比度 **≥ 4.5:1**。
- 归属组件见 [badge.md](component-selection/badge.md)（状态点首选，分类标注改用 `a-tag`）。**检查项**：质量门禁 G7，见 [quality-gates.md](overview/quality-gates.md)。

## 2.4 单组件选型速查

一句话结论用于快速排除误用；完整的适用边界、变体、组合边界与常见坑见各自详情页。

| 组件 | 一句话结论 | 详情 |
|---|---|---|
| Table 表格 | 规整多列结构化数据用它；每条信息图文混合且丰富时改用卡片 | [table.md](component-selection/table.md) |
| Card 卡片 | 内容分块、卡片网格、仪表板区块用它；**仅需分隔就用间距，别为分隔套卡片** | [card.md](component-selection/card.md) |
| Form 表单 | 结构化字段录入 + 校验用它；**提交与校验二选一**，声明式与命令式不混用 | [form.md](component-selection/form.md) |
| Modal 对话框 | 轻量确认与不跳转的临时任务用它；字段极多的长流程改表单页，侧向持久面板改抽屉。宽度见 [1.2](#12-对话框宽度档位硬约束)，容器选择见 [1.1](#11-表单承载容器决策路径) | [modal.md](component-selection/modal.md) |
| Select 选择器 | 有限选项单选/多选用它；**选项 2–3 个改 `a-radio-group`**，布尔改 `a-switch`，层级数据改 `a-tree-select` | [select.md](component-selection/select.md) |
| Tabs 标签页 | 同一区域切换多组内容用它；页面级导航用菜单/路由，步骤流程用 `a-steps` | [tabs.md](component-selection/tabs.md) |
| Menu 菜单 | 侧边/顶部导航用它；**全局 Layout 已封装侧边菜单，新增页面只在 `menuItems` 追加，不要重写 Layout** | [menu.md](component-selection/menu.md) |
| Badge 徽标 | 状态点 + 文字、未读计数用它，表格状态列首选；分类标注改 `a-tag`。**状态不只靠颜色传达，必须带文字** | [badge.md](component-selection/badge.md) |
| Alert 警告提示 | 页内**持久**提示用它；操作后**瞬时**反馈用 `Message`，需确认用 `Modal`/`Popconfirm`，全局富内容用 `Notification` | [alert.md](component-selection/alert.md) |
| Pagination 分页 | 列表/表格分页用它；`total` 与真实数据联动**不写死**，筛选后复位 `current=1` | [pagination.md](component-selection/pagination.md) |

**产品专属业务组件优先级更高**：需求命中某产品触发词时，该场景优先用 [components-business/](components-business/README.md) 下的业务组件；未命中一律用上表通用组件。

---

# 三、取值与适配

## 3.1 主题取值铁律

- **颜色只用语义 token 或 Pangea 调色板变量**，绝不硬编码 hex：
  - 语义色：`var(--color-text-1)`、`var(--color-bg-2)`、`var(--color-border-2)`、`var(--color-fill-2)` 等。
  - 品牌/状态色以 RGB 分量存储，需包 `rgb()`：`rgb(var(--primary-6))`、`rgba(var(--primary-6), 0.2)`、`rgb(var(--success-6))`。
- **品牌主色是青绿色 `#00aaa6`（`--primary-6`）**，不是 Arco 默认蓝。交互主色用 `primary-6`，hover 用 `primary-5`，active 用 `primary-7`。
- 间距用 4px 倍数档位，圆角按钮/输入框 4px、卡片/弹窗 8px，正文字号 14px。
- 使用语义 token 而非调色板直接值，可自动适配暗黑模式（`body[arco-theme='dark']`）。
- **数据可视化、多色标签/分类、图表系列等语义色不够用的场景**，从 design-tokens.md「基础色板」取扩展色（15 个色系 × 10 级，如 `rgb(var(--purple-6))`、`rgb(var(--cyan-6))`），仍用 `rgb(var(--x-n))` 变量而非硬编码。
- 完整取值见 [design-tokens.md](theme/design-tokens.md)。

## 3.2 响应式适配

生成的**每个页面都必须做响应式适配**。中后台工作区常见 1280–1920，但内容区实际宽度会随侧边栏展开/折叠、浏览器分屏、笔记本小屏而变化，也要兼容约 1024 的窄屏——**不允许固定死宽导致字段挤压、内容溢出或非预期横向滚动**。

- **表单多列栅格用 Arco Grid 断点，不写死 `:span`**：多列表单的 `a-col` 用响应式断点让列数随宽度收敛。标准配方——3 列表单用 `:xs="24" :sm="12" :lg="8"`（窄屏 1 列 / 平板 2 列 / 桌面 3 列），2 列表单用 `:xs="24" :sm="12"`；整行字段（textarea、子表单等）保持 `:span="24"`。断点：xs<576 / sm≥576 / md≥768 / lg≥992 / xl≥1200 / xxl≥1600。
- **卡片 / 磁贴网格用 CSS grid 自适应**：`grid-template-columns: repeat(auto-fill, minmax(<最小宽>, 1fr))`，随容器宽度自动增减列数，不写死列数。
- **表格窄屏保可用**：设 `:scroll="{ x }"` 横向滚动，或隐藏次要列、改卡片/列表展示。
- **操作栏 / 筛选行允许换行**：工具栏用 `flex-wrap`，避免按钮组与搜索框在窄屏互相挤压溢出。
- **固定像素宽度需设上限并防溢出**：弹窗、面板等固定宽度必须 `≤` 视口宽度（如 modal 在窄屏改用更小宽度或全屏）；侧栏、锚点等辅助区在窄屏可隐藏或下移。对话框宽度另有**硬性档位约束**，见 [1.2](#12-对话框宽度档位硬约束)。
- 优先用 Arco Grid 的断点属性表达响应式，能不写媒体查询就不写；确需媒体查询时放在组件 scoped 样式里。详见 [responsive-design.md](patterns/responsive-design.md)。
