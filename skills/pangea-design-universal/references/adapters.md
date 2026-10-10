---
name: pangea-adapters
description: "把 Pangea 取值接入常见技术栈：原生 CSS、Tailwind CSS v4 / v3、shadcn/ui、Element Plus、Ant Design v5/v6，以及可选的参考样式 pangea-ui.css。"
---

# 接入与适配

所有适配文件都在 `references/adapters/`，由主题包生成，**勿手改**。共同前提：

- 先引入 `references/tokens.css`，且**不要放进 CSS `@layer`**（适配文件依赖它的变量优先生效）。
- 暗色统一在根元素加 `data-theme="dark"`。组件库自带的暗色切换方式见各节。
- 用了适配后仍需遵守 [components.md](components.md) 与 [interaction.md](interaction.md)；适配只解决「取值」，不替代组件规格与交互要求。

| 场景 | 用什么 |
|---|---|
| 原生 HTML / 原型 / 没有组件库 | `tokens.css` + 可选的 `assets/pangea-ui.css` |
| Tailwind CSS v4（含 shadcn/ui） | `adapters/pangea.tailwind-v4.css`（+ `pangea.shadcn.css`） |
| Tailwind CSS v3 | `adapters/pangea.tailwind-v3.cjs` |
| Element Plus | `adapters/pangea.element-plus.css` |
| Ant Design v5 / v6 | `adapters/pangea.antd-theme.json` |
| 其它组件库 | 按 [components.md](components.md) 把它的主题变量指向 `tokens.css` 中的变量 |

---

## 原生 CSS

```html
<link rel="stylesheet" href="tokens.css" />
<!-- 可选：现成的组件样式 -->
<link rel="stylesheet" href="pangea-ui.css" />
```

`pangea-ui.css` 按 [components.md](components.md) 实现了按钮、输入框、复选 / 单选 / 开关、分段控件、标签、状态点、表格、分页、标签页、对话框、抽屉、浮层、消息、警告提示的外观与状态，类名统一 `pg-` 前缀，最外层容器加 `pg-root`。它**只有样式，没有 JS 行为**：弹层定位、焦点管理、键盘交互需要项目自己实现（见 [interaction.md](interaction.md)）。用状态属性表达状态：`aria-invalid="true"`（错误）、`aria-pressed` / `aria-checked`（分段选中）、`aria-selected`（标签页）、`aria-current="page"`（当前页）、`aria-busy="true"`（加载中）。

已有组件库的项目**不要**引入 `pangea-ui.css`，改用下面对应的适配。

## Tailwind CSS v4

```css
@import "tailwindcss";
@import "./tokens.css";
@import "./pangea.tailwind-v4.css";
```

- 项目中需安装 `tailwindcss`（及所用的 CLI / 构建插件），固定版本。
- 适配文件清空了 Tailwind 默认的颜色、圆角、字号、阴影，**只留 Pangea 档位**，规范外的 `bg-red-500`、`text-lg`、`rounded-md` 不会生成样式。
- 已内置暗色变体：`dark:` 以根元素 `data-theme="dark"` 为准（如 `dark:hidden` 切换亮 / 反白 Logo）。
- 类名与 Pangea 变量同名：
  - 语义色：`bg-bg-1`、`text-text-1`、`border-border-2`、`bg-fill-2`
  - 色板：`bg-primary-6`、`text-danger-6`，支持透明度 `bg-primary-6/20`
  - 圆角 `rounded-small / medium / large / circle`；字号 `text-body-3`、`text-title-1`；阴影 `shadow-2-down`
- 间距沿用 Tailwind 默认的 4px 基数（`p-4` = 16px、`p-1.5` = 6px），Pangea 间距档位都能表达；只写档位内的值，不用任意值 `p-[13px]`（lint 会报错）。
- 控件高度和组件级内边距没有生成专门的工具类，用 v4 的变量写法直接引用：`h-(--size-small)`、`px-(--btn-size-small-padding-horizontal)`、`py-(--table-size-medium-padding-vertical)`。
- 为什么 `tokens.css` 不能放进 `@layer`：适配文件中的主题变量与 Pangea 变量同名（如 `--color-bg-1: var(--color-bg-1)`），编译后位于 Tailwind 的 theme 层；不分层的 `tokens.css` 优先级更高，同名变量才取到真实值。放进 layer 会形成循环引用、颜色失效。

## shadcn/ui（Tailwind v4 版）

在上面 Tailwind v4 的基础上，于 shadcn 生成的变量**之后**引入：

```css
@import "./pangea.shadcn.css";
```

它把 shadcn 的 `--primary`、`--background`、`--border`、`--ring`、`--radius` 等指向 Pangea 变量。暗色时**同时**给根元素加 `class="dark"` 与 `data-theme="dark"`。基于 HSL 三元组的旧版 shadcn（Tailwind v3 时代）不适用。

## Tailwind CSS v3

```js
// tailwind.config.js
module.exports = {
  presets: [require('./pangea.tailwind-v3.cjs')],
  content: ['./src/**/*.{html,js,ts,jsx,tsx,vue}'],
};
```

preset 整体替换 Tailwind 的颜色、圆角、字号、阴影（同样只留 Pangea 档位），并把 `dark:` 设为以 `data-theme="dark"` 为准。色板支持透明度修饰（`bg-primary-6/20`）；语义色（`text-text-1` 等）不支持透明度修饰。

## Element Plus

```js
import 'element-plus/dist/index.css';
import './tokens.css';
import './pangea.element-plus.css'; // 必须在 element-plus 样式之后
```

- 覆盖 `--el-color-*`、文字 / 边框 / 填充 / 背景色、圆角、字号、控件高度；另外单独对齐了 Element 写死在组件里的小 / 大按钮尺寸、输入与选择器尺寸，以及默认按钮的配色（Pangea 默认按钮为浅灰底）。
- 暗色：**不要**再引入 `element-plus/theme-chalk/dark/css-vars.css`，由 `tokens.css` 切换；根元素同时加 `class="dark"` 与 `data-theme="dark"`。

## Ant Design v5 / v6

```jsx
import { ConfigProvider, theme } from 'antd';
import pangea from './pangea.antd-theme.json';

const isDark = false;
<ConfigProvider
  theme={
    isDark
      ? { algorithm: theme.darkAlgorithm, token: pangea.dark.token, components: pangea.dark.components }
      : { token: pangea.light.token, components: pangea.light.components }
  }
>
  <App />
</ConfigProvider>;
```

- Ant Design 的主题只接受字面值，适配文件里是从主题包算好的具体颜色与尺寸；主题包升级后需重新生成。
- **已知差异**：Ant Design 用算法派生色阶。亮色主色的 hover / active 已精确指定；暗色下主色由 `darkAlgorithm` 派生（约 `#22a29b`，Pangea 为 `#25bbb3`），其余派生色与 Pangea 也会有细微差别。对一致性要求高的场景优先选能用 CSS 变量的方案。

---

## 验证情况

以下在浏览器中实测过（亮 / 暗两套，对照 Pangea 主题在 Arco 中的实际渲染）：

| 方案 | 实测内容 | 结果 |
|---|---|---|
| `pangea-ui.css` | 主 / 次 / 线框 / 文本 / 危险 / 小按钮、输入框、标签、表头、分段控件选中、分页当前页，共 152 项计算样式 | 与 Arco 一致（差异仅为无边框元素的边框色，不可见） |
| Tailwind v4 + shadcn | 语义色、色板及透明度、圆角、字号、阴影；默认工具类已移除 | 一致 |
| Tailwind v3 | 同上 | 一致 |
| Element Plus | 主按钮及 hover、默认按钮及 hover、小按钮高度与圆角、输入框、标签 | 一致 |
| Ant Design v6 | 亮色主按钮及 hover、默认按钮及 hover、小按钮、输入框；暗色默认按钮 | 一致；暗色主色为算法派生，见上 |
