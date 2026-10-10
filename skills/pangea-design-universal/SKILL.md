---
name: pangea-design-universal
description: "Pangea 设计系统（海信）的视觉语言与交互约束，不限技术栈（React / 原生 HTML / Vue / 任意组件库 / 小程序等），也不限定页面布局，让界面在配色、字号、间距、圆角、Logo、状态表达和交互上与 Pangea 保持一致。当用户要「做个页面/组件/原型」「按 Pangea / 海信规范出界面」「统一颜色字号间距」「接入 Pangea 主题变量」「检查样式是否符合规范」时使用。"
metadata:
  version: 0.1.0
  theme: "@arco-themes/vue-pangea-3-linear v1.0.11"
---

# Pangea Design · 通用版

让任何技术栈做出的界面**看起来是 Pangea、用起来像 Pangea**。本 skill 只约束视觉语言与交互行为，不规定技术栈和页面布局。

> 所有取值以主题包 `@arco-themes/vue-pangea-3-linear` 为唯一事实源，`references/tokens.*` 由它生成。

## 三档约束

| 档位 | 内容 | 违反时 |
|---|---|---|
| **硬约束** | 颜色只用 Pangea 变量；字号 / 间距 / 圆角 / 阴影 / 动效 / 层级只用档位；Logo 规范；状态「颜色 + 文字」双通道；正文对比度 ≥ 4.5:1；同组最多 1 个主按钮；危险操作用 danger 且二次确认；对话框宽度档位；[interaction.md](references/interaction.md) 中标【硬】的条目（操作有反馈、数据区各状态、键盘可达、焦点可见、表单标签与错误位置、不禁粘贴、不禁缩放、支持减弱动效） | `lint-tokens.mjs` 报 ERROR 或自检不过 → **不交付** |
| **推荐约束** | 控件密度分档、按钮组排序、表单容器选择、页面背景分层、组件选型、视图切换用分段控件、响应式断点 | 偏离时在交付说明里写明理由 |
| **自由** | 技术栈、组件库、布局组合、导航形态 | 不检查 |

## 动手前先读（按序）

1. [references/adapters.md](references/adapters.md) —— **先确定接入方式**：原生 CSS（`tokens.css` + 可选 `pangea-ui.css`）、Tailwind v4 / v3、shadcn/ui、Element Plus、Ant Design。变量清单见 [tokens.css](references/tokens.css) / [tokens.json](references/tokens.json)（生成物，勿手改）。
2. [references/design-core.md](references/design-core.md) —— 设计规则正文 C1–C10（容器、宽度、背景、按钮组、密度、状态、选型、视图切换、取值、响应式）。
3. [references/components.md](references/components.md) —— 12 类高频组件的尺寸、各状态取值与行为（按钮、输入框、选择器、复选/单选/开关、分段控件、标签与状态点、表格、分页、标签页、对话框与抽屉、浮层、消息与警告提示）。**做组件或调组件库主题时必读。**
4. [references/interaction.md](references/interaction.md) —— 交互规则 I1–I12（反馈与加载、数据区状态、危险操作、表单、焦点与键盘、命中区、状态保留、动效、内容、文案、视觉细节、性能）。
5. [references/brand.md](references/brand.md) —— Logo、页签图标、主色用法、字体。**出现品牌标识时必读。**
6. [references/icons.md](references/icons.md) —— 图标用 Lucide：线宽、尺寸、颜色、点击区，与 Pangea 图标的语义对照。

## 接入取值

```html
<!-- 把 references/tokens.css 复制进项目后引入 -->
<link rel="stylesheet" href="./tokens.css" />
```

```css
.card   { background: var(--color-bg-2); border-radius: var(--border-radius-large); padding: var(--spacing-7); }
.title  { font-size: var(--font-size-title-1); color: var(--color-text-1); }
.btn    { height: var(--size-default); background: rgb(var(--primary-6)); }
.btn:hover { background: rgb(var(--primary-5)); }
.tag    { background: rgba(var(--primary-6), 0.1); color: rgb(var(--primary-6)); }
```

- **语义色**（`--color-text-*`、`--color-bg-*`、`--color-fill-*`、`--color-border-*`）是完整颜色值，直接 `var()`。
- **色板**（`--primary-*`、`--success-*`、`--warning-*`、`--danger-*`、`--gray-*` 及 15 个扩展色系）是 RGB 三元组，要包 `rgb()` / `rgba()`。
- **暗色**：在根元素加 `data-theme="dark"`。只用语义变量即自动适配，不为暗色单独写颜色。
- **已有组件库或 Tailwind**：使用 [adapters.md](references/adapters.md) 中对应的适配文件，不要保留组件库默认主色；没有现成适配的组件库，按 [components.md](references/components.md) 把它的主题变量指向 Pangea 变量。
- **没有组件库**：可引入 `assets/pangea-ui.css`（`pg-` 前缀的参考样式，只有外观与状态，不含 JS 行为）。
- 变量名与主题包一致，和 Arco 工程同名同值，可安全共存。

## 多页需求先出结构说明

需求涉及 **2 个及以上页面**时，先输出一份简要结构说明，**用户确认后再写代码**：

1. 页面清单（每页一句话用途）
2. 页面间关系（导航方式、从哪进入、跳转到哪）
3. 每页的信息层级：主要区块从上到下 / 从左到右是什么，主操作是什么
4. 关键交互：新建 / 编辑用什么容器（按 [C1](references/design-core.md#c1-表单承载容器决策路径)）、危险操作怎么确认、空 / 加载 / 错误态怎么呈现

单页或单个组件不需要这一步，直接做。

## 组件与交互

- 组件选型按 [C7](references/design-core.md#c7-组件选型速查)；尺寸按 [C5](references/design-core.md#c5-控件密度) 的密度档（控件高 24 / 28 / 32 / 36px = `--size-mini / small / default / large`）；每个组件各状态的具体取值见 [components.md](references/components.md)。用现成组件库时，按该文件把组件库的主题变量调到 Pangea 取值。
- 交互细则见 [interaction.md](references/interaction.md)。最容易漏的几条：每个数据区都设计空 / 无结果 / 加载 / 失败 / 无权限状态（I2）；危险操作二次确认或可撤销（I3）；错误显示在字段旁并聚焦第一个错误（I4）；对话框焦点进出与 `Esc` 关闭（I5）；筛选、分页等状态写进 URL（I7）。
- 纯图标按钮要有可访问名（`aria-label` 或 tooltip）。
- 功能性图标统一用 Lucide，线宽保持默认 2、尺寸 1em 或 16 / 20 / 24px，同一产品内不混用多个图标库（[icons.md](references/icons.md)）；品牌标识只用 `assets/brand/` 中的标准文件。

## 交付前自检

1. **机检**：对改动过的文件跑
   ```bash
   node <本 skill 目录>/scripts/lint-tokens.mjs <用户项目的源码目录或文件>
   ```
   **ERROR 必须为 0**；WARN 逐条确认（确有必要的写进交付说明）。
2. **人工自检**（机检覆盖不到）：
   - [ ] Logo 是标准文件、颜色是海信绿或反白、没有变形
   - [ ] 状态都有文字，不只靠颜色
   - [ ] 同组按钮最多 1 个主按钮，危险操作是 danger 样式
   - [ ] 对话框宽度在 520 / 720 / 1000 档，确认类 400
   - [ ] 焦点可见，正文对比度 ≥ 4.5:1（亮暗两套）
   - [ ] 只用键盘能走完主流程；对话框关闭后焦点回到触发处
   - [ ] 每个数据区的空 / 无结果 / 加载 / 失败状态都做了，且都有下一步
   - [ ] 危险操作有确认或撤销；有未保存修改时离开会提醒
   - [ ] `prefers-reduced-motion` 下没有明显的位移 / 缩放动画
   - [ ] 在约 1024px 宽度下不溢出、不挤压
3. 交付说明里列出：偏离推荐约束的地方及理由、本规范暂缺而自行处理的地方。

## 文件索引

| 文件 | 内容 |
|---|---|
| [references/tokens.css](references/tokens.css) / [tokens.json](references/tokens.json) | 全部变量（生成物） |
| [references/design-core.md](references/design-core.md) | 设计规则正文 C1–C10 |
| [references/components.md](references/components.md) | 组件规格 |
| [references/interaction.md](references/interaction.md) | 交互规则 I1–I12 |
| [references/brand.md](references/brand.md) | 品牌要素 |
| [references/adapters.md](references/adapters.md) / [adapters/](references/adapters/) | 各技术栈接入方式与适配文件（生成物） |
| [references/icons.md](references/icons.md) | 图标规则与 Lucide 对照 |
| [assets/pangea-ui.css](assets/pangea-ui.css) | 可选参考样式（原生 HTML / 原型） |
| [assets/brand/](assets/brand/) | Logo 与页签图标标准文件 |
| [scripts/lint-tokens.mjs](scripts/lint-tokens.mjs) | 取值机检（零依赖，Node ≥ 18） |
