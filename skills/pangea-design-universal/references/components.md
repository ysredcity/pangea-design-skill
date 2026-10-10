---
name: pangea-components
description: "Pangea 高频组件规格（技术栈无关）：按钮、输入框、选择器、复选/单选/开关、分段控件、标签与状态点、表格、分页、标签页、对话框与抽屉、浮层、消息与警告提示。每个组件给出尺寸、各状态取值与交互要求，全部引用 tokens.css 变量。"
---

# 组件规格

> 本文件描述 Pangea 组件**长什么样、各状态怎么变**，不规定用哪个组件库实现。用现成组件库时，把它的主题变量调到这里的取值；手写组件时直接照着实现。
>
> 取值来源：主题包 `@arco-themes/vue-pangea-3-linear` 在浏览器中的实际渲染结果，以及主题 CSS。
>
> 写法约定：`--xxx` 指 `tokens.css` 中的变量。注意 `--color-neutral-*` 与 `--color-fill-*` 亮色值相同、暗色不同（neutral 为不透明色，fill 为半透明叠加色），按表中写的用，不要互换。语义色直接 `var(--color-*)`；色板要包 `rgb()`，表中写作 `primary-6` 即 `rgb(var(--primary-6))`。尺寸档见 [C5](design-core.md#c5-控件密度)，交互通则见 [interaction.md](interaction.md)。

## 通用

| 项 | 取值 |
|---|---|
| 控件高度档 | mini 24 / small 28 / default 32 / large 36（`--size-mini` … `--size-large`） |
| 控件圆角 | `--border-radius-medium`（4px）；浮层、消息、卡片、对话框 `--border-radius-large`（8px） |
| 控件字号 | `--font-size-body-3`（14px）；mini 档按钮 12px |
| 边框 | 1px |
| 浮层阴影 | `--shadow2-down`（`0 4px 10px rgba(0,0,0,0.1)`） |
| 状态过渡 | 颜色类变化 `--transition-duration-1`（0.1s）；不写 `transition: all` |
| 禁用 | 不响应交互、`cursor: not-allowed`；颜色见各组件 |

---

## 0. 页面标题与头部

- **页面标题**：`--font-size-title-2`（20px）、字重 600、`--color-text-1`，与下方内容间距 16px。同一产品所有页面一致。
- **应用头部**（若有）：见 [brand.md](brand.md)「头部导航中的 Logo」。

## 1. 按钮

**尺寸**

| 档 | 高 | 左右内边距 | 字号 | 图标与文字间距 |
|---|---|---|---|---|
| mini | 24 | `--btn-size-mini-padding-horizontal`（11px） | 12px | 4px |
| small | 28 | `--btn-size-small-padding-horizontal`（15px） | 14px | 6px |
| default | 32 | `--btn-size-default-padding-horizontal`（15px） | 14px | 8px |
| large | 36 | `--btn-size-large-padding-horizontal`（19px） | 14px | 8px |

> 内边距 15px 加 1px 边框，视觉上是 16px。手写时直接用上面的变量，不要写 15px 字面值。纯图标按钮为正方形（宽 = 高）。

**类型与状态**

| 类型 | 默认 | hover | active | 禁用 |
|---|---|---|---|---|
| 主按钮 | 底 `primary-6`，字 `--btn-primary-color-text`（纯白），无边框 | 底 `primary-5` | 底 `primary-7` | 底 `--color-primary-light-3`，字纯白 |
| 次按钮 | 底 `--color-neutral-1`，字 `--color-text-2`，边框 `--color-border-3` | 底 `--color-bg-3`，字 `--color-neutral-10`，边框 `--color-border-4` | 底 `--color-neutral-2`，字 `--color-neutral-10`，边框 `--color-border-4` | 底 `--color-neutral-1`，字 `--color-text-4` |
| 线框按钮 | 透明底，字与边框 `primary-6` | 字与边框 `primary-5` | 字与边框 `primary-7` | 字与边框 `--color-primary-light-3` |
| 文本按钮 | 透明底，字 `primary-6` | 底 `--color-fill-2` | 底 `--color-fill-3` | 字 `--color-primary-light-3` |
| 危险（主） | 底 `danger-6`，字 `--btn-primary-color-text` | 底 `danger-5` | 底 `danger-7` | 底 `--color-danger-light-3` |
| 危险文本 | 透明底，字 `danger-6` | 底 `--color-fill-2` | 底 `--color-fill-2` | 字 `--color-danger-light-3` |

**键盘焦点**：按钮外圈 `0 0 0 0.25em` 的 `primary-3` 光环（危险按钮用 `danger-3`）。

**行为**：主按钮每组最多 1 个（[C4](design-core.md#c4-按钮组规范)）；加载时保留文字并显示加载指示、禁止重复点击（[I1](interaction.md#i1-反馈与加载)）；危险按钮不做默认焦点（[I3](interaction.md#i3-危险操作)）。

## 2. 输入框 / 多行文本

| 项 | 取值 |
|---|---|
| 高度 | 随档位（default 32）；多行文本最小 32 |
| 左右内边距 | 12px（`--spacing-6`） |
| 圆角 | `--border-radius-medium` |
| 占位文字 | `--color-text-3` |

| 状态 | 背景 | 边框 | 文字 |
|---|---|---|---|
| 默认 | `--color-bg-1` | `--color-border-3` | `--color-text-1` |
| hover | `--color-bg-3` | `primary-6` | — |
| 聚焦 | `--color-bg-2` | `primary-6` | — |
| 错误 | `danger-1`（浅红底） | 无边框色（透明） | — |
| 错误 + hover / 聚焦 | `--color-bg-3` / `--color-bg-2` | `danger-6` | — |
| 禁用 | `--color-neutral-2` | `--color-neutral-4` | `--color-text-4` |

**行为**：错误提示文字放在字段下方，用 `danger-6`；标签、占位、校验时机见 [I4](interaction.md#i4-表单)。多行文本的字数统计用 12px、`--color-text-3`，放右下角。

## 3. 选择器（下拉选择）

- 触发框的尺寸、圆角、各状态与**输入框完全一致**。
- 下拉面板：底 `--color-bg-popup`，圆角 `--border-radius-medium`，阴影 `--shadow2-down`，最大高度 200px 后内部滚动。
- 选项高 36px，左右内边距 12px；hover 底 `--color-fill-2`；已选项文字 `--color-text-1`、字重 500。
- 选项 2–3 个时改用单选组或分段控件（[C7](design-core.md#c7-组件选型速查)）。
- 键盘：上下键移动、回车选中、`Esc` 关闭并把焦点还给触发框。

## 4. 复选框 / 单选框 / 开关

| 组件 | 规格 |
|---|---|
| 复选框 | 14×14，圆角 `--border-radius-small`（2px）；未选中底 `--color-bg-2`、2px 边框 `--color-fill-4`；选中填充 `primary-6` + 白色勾；禁用选中 `--color-primary-light-3` |
| 单选框 | 14×14 圆形；选中时边框与圆点 `primary-6` |
| 开关 | 默认档 40×24，全圆角；开 `primary-6`，关 `--color-fill-4`；禁用开 `--color-primary-light-3`；small 档 28×16 |

**行为**：标签和控件共用一个点击区（[I6](interaction.md#i6-点击区与指针)）；开关只用于**立即生效**的布尔设置，需要提交才生效的用复选框。

## 5. 分段控件

用于工具栏中切换同一块内容的数据范围（[C8](design-core.md#c8-行内视图切换用分段控件且一律居左)）。

| 项 | 取值 |
|---|---|
| 容器 | 底 `--color-fill-2`，圆角 `--border-radius-medium`，内边距 1.5px；总高随档位：default 32 / small 28 |
| 选项 | 高 = 总高 − 6px（default 26 / small 22），外边距 1.5px（相邻选项间距 3px），左右内边距 12px；未选中透明底、字 `--color-text-2` |
| 选中项 | 底 `--color-bg-5`（暗色为 `--color-fill-3`），字 `primary-6`，圆角 `--border-radius-medium` |
| 未选中 hover | 字 `--color-text-1`（底不变） |
| 位置 | 一律居左；工具栏中与其它控件同用紧凑档（small） |

## 6. 标签 / 状态点

**标签**（分类、属性）：高 24，字号 12px、字重 500，左右内边距 8px（`--spacing-4`），圆角 `--border-radius-medium`；默认底 `--color-fill-2`、字 `--color-text-1`。彩色标签用对应色板的 `1` 阶做底、`6` 阶做字（如底 `primary-1`、字 `primary-6`）。

**状态点**（状态、进度）：6×6 圆点 + 状态文字，间距 6px（`--spacing-3`），**必须带文字**（[C6](design-core.md#c6-状态不只靠颜色传达)）。颜色按语义：

| 语义 | 颜色 | 例 |
|---|---|---|
| 成功 / 完成 | `success-6` | 已完成、已启用、已通过 |
| 进行中 / 处理中 | `primary-6` | 进行中、审核中 |
| 警告 / 有风险 | `warning-6` | 有风险、即将到期 |
| 错误 / 失败 | `danger-6` | 异常、已驳回、失败 |
| 中性 / 停用 | `--color-text-4` | 已暂停、未启用、草稿 |

## 7. 表格

| 项 | 取值 |
|---|---|
| 外框 | 1px `--color-border-2`，圆角 `--border-radius-medium` |
| 表头 | 底 `--color-neutral-2`，字 `--color-neutral-10`、字重 600 |
| 单元格 | 底 `--color-bg-2`，字 `--color-text-1` 14px；中密度上下内边距 `--table-size-medium-padding-vertical`（7px），左右 `--table-size-medium-padding-horizontal`（16px） |
| 行分隔 | 底部 1px `--color-border-2`，不加竖线 |
| 行 hover | 底 `--color-fill-1` |
| 数值列 | 右对齐 + 等宽数字（[I9](interaction.md#i9-内容与可读性)） |
| 操作列 | 文本按钮 / 链接 `primary-6`；**删除等危险操作用危险文本按钮 `danger-6`**；多个操作间距 8px；超过 3 个折叠进「更多」 |
| 状态列 | 状态点 + 文字（第 6 节） |

**行为**：表格区高度撑满可用空间，内部滚动、表头固定；窄屏横向滚动（[C10](design-core.md#c10-响应式适配)）；空 / 无结果 / 加载 / 失败状态见 [I2](interaction.md#i2-数据区状态)；批量操作在勾选后才可用。

## 8. 分页

- 页码项最小 28×28（small 档），左右内边距 8px，项间距 8px，圆角 `--border-radius-medium`；当前页底 `--color-primary-light-1`、字 `primary-6`；其余透明底、字 `--color-text-2`，hover 底 `--color-fill-2`；不可用（首页的上一页等）字 `--color-text-4`。
- 页码两侧为「上一页 / 下一页」箭头（同页码项尺寸）；每页条数用 small 档选择器，跳转用 small 档输入框。
- 布局：总条数居左，页码、每页条数、跳转居右。固定每页条数的场景可不放每页条数。
- 筛选或改变每页条数后回到第 1 页；总数与真实数据联动，不写死。

## 9. 标签页

- 标签文字 14px，默认 `--color-text-2`；选中 `primary-6`、字重 500，下方 2px 指示条 `primary-6`（切换时滑动，0.2s）；禁用 `--color-text-4`。
- 用于切换**成块内容**；工具栏中切换数据范围用分段控件（第 5 节）。
- 当前标签写进 URL（[I7](interaction.md#i7-状态保留与导航)）；左右方向键切换。

## 10. 对话框 / 抽屉

**对话框**

| 项 | 取值 |
|---|---|
| 宽度 | 520 / 720 / 1000 三档；确认类 400（[C2](design-core.md#c2-对话框宽度档位硬约束)） |
| 圆角 / 底色 | `--border-radius-large`（8px），底 `--color-bg-3`，无边框 |
| 头部 | 高 48px，左右内边距 20px，底部 1px `--color-border-2` 分隔线 |
| 标题 | 16px（`--font-size-title-1`）、字重 500、`--color-text-1`，**左对齐** |
| 内边距 | 左右 `--modal-default-padding-horizontal`（20px）；内容上下 `--modal-default-padding-content-vertical`（24px）；底部按钮区上下 `--modal-default-padding-footer-vertical`（16px） |
| 确认类 | 宽 400（含内边距），内边距上 24 / 左右 32 / 下 32（`--modal-simple-padding-*`）；标题前放状态图标（提示 `primary-6`、警告 `warning-6`、危险 `danger-6`）；不显示右上角关闭；底部「取消 + 确认」，危险确认用危险主按钮并写具体动作；点遮罩不关闭（避免误操作），`Esc` 等同取消 |
| 遮罩 | `--color-mask-bg` |
| 底部按钮 | 右对齐，主按钮在最右（[C4](design-core.md#c4-按钮组规范)）；顶部 1px `--color-border-2` 分隔线 |
| 内容过长 | 内容区设最大高度并内部滚动，标题与底部按钮始终可见 |

**抽屉**：从右侧滑出；内边距 16px（`--drawer-padding-*`）；需要边填边参考页面时用非模态（无遮罩）。

**行为**（对话框与抽屉通用）：打开时焦点移入并限制在内部，`Esc` 关闭，关闭后焦点回到触发元素（[I5](interaction.md#i5-焦点与键盘)）；内部滚动不带动背景（[I7](interaction.md#i7-状态保留与导航)）。

## 11. 浮层（下拉菜单 / 气泡卡片 / 文字提示）

| 组件 | 规格 |
|---|---|
| 下拉菜单 | 底 `--color-bg-popup`，1px 边框 `--color-fill-3`，圆角 `--border-radius-large`，阴影 `--shadow2-down`，上下内边距 4px；菜单项高 36px、左右内边距 12px、字 `--color-text-1`，hover 底 `--color-fill-2`；危险项文字 `danger-6` |
| 气泡卡片 | 底 `--color-bg-popup`，圆角 `--border-radius-large`，阴影 `--shadow2-down`，内边距 12px / 16px（`--popup-padding-*`）；标题 16px `--color-text-1`，正文 14px `--color-text-2` |
| 文字提示 | 底 `--color-tooltip-bg`，字白 14px，圆角 `--border-radius-medium`，内边距 8px / 12px（`--tooltip-padding-*`），最大宽 350px |

**行为**：浮层从触发元素所在方向展开；文字提示只放补充信息，不放必须看到的内容（[I6](interaction.md#i6-点击区与指针)）。

## 12. 加载指示

| 形式 | 规格 | 用在 |
|---|---|---|
| 旋转圈 | 1em，2px `currentColor` 圆环、缺一段，`--transition-duration-loading`（1s）线性匀速旋转 | 按钮内、小区域加载 |
| 骨架屏 | 底 `--color-fill-2`，圆角 `--border-radius-small`，形状与最终内容一致 | 列表、表格、卡片的首次加载 |

出现时机与最短显示时间见 [I1](interaction.md#i1-反馈与加载)；减弱动效时旋转圈可保留（不是位移 / 缩放动画）。

## 13. 消息与警告提示

| 组件 | 用途 | 规格 |
|---|---|---|
| 全局消息 | 操作后的**瞬时**结果反馈，几秒后自动消失 | 底 `--color-bg-popup`，1px 边框 `--color-border-2`，圆角 `--border-radius-large`，阴影 `--shadow2-down`，内边距 10px / 16px（`--message-padding-*`）；左侧状态图标 |
| 警告提示 | 页内**持久**提示 | 圆角 `--border-radius-medium`，内边距 8px / 16px（`--alert-padding-*`，含边框）；底用对应色板 `1` 阶，图标用 `6` 阶；带标题时标题 16px、字重 500 |

**行为**：成功、警告、错误都要有图标 + 文字，不只靠颜色；错误消息说明怎么解决（[I10](interaction.md#i10-可用性文案)）；消息用 `aria-live="polite"` 播报。
