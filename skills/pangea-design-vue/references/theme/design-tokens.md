---
name: pangea-vue-design-tokens
description: "Pangea 3 Linear 主题（@arco-themes/vue-pangea-3-linear）设计 Token 参考。用于品牌青绿主色、语义色（文字/背景/填充/边框/状态）、完整调色板、字体、间距、尺寸、圆角、阴影、过渡、层级、组件级 token（Button/Input/Select/Tag/Popup/Alert 等）、暗黑模式、CSS 变量与 Less 变量速查。"
user-invocable: false
---

# Pangea 3 Linear 主题设计 Token 参考

> 主题包：`@arco-themes/vue-pangea-3-linear` v1.0.11
> 基于：`@arco-design/web-vue ^2.57.0`（由 Arco 官方主题定制工具产出）
> 用途：生成符合 Pangea 主题规范的 UI 代码时，颜色/字体/间距/圆角等取值以本文件为准。**不要使用 Arco 默认蓝色调色板。**

主题包生效后，所有 token 以 CSS 自定义属性形式注入到 `body`（暗黑模式在 `body[arco-theme='dark']` 上覆盖）。接入方式见 [theming.md](../overview/theming.md)。

---

## 一、使用方式

### CSS 变量（运行时，推荐）
所有 token 在 `body` 上以 CSS 自定义属性注入，使用 `var(--token-name)` 引用：
```css
color: var(--color-text-1);
background: var(--color-bg-2);
border: 1px solid var(--color-border-2);
```

### 颜色调色板变量（RGB 分量）
调色板颜色（`primary`/`gray`/`red`/`success` 等）以 **RGB 分量**形式存储，使用时需包裹 `rgb()` / `rgba()`：
```css
color: rgb(var(--primary-6));
background: rgba(var(--primary-6), 0.2);
```

### Less 变量（编译时）
在 Less 文件中通过 `@token-name` 引用（需接入主题包的 Less，见 theming.md）：
```less
color: @color-text-1;
background: @color-bg-2;
border-radius: @border-radius-medium;
```

### ⚠️ 哪些 token 是运行时 CSS 变量（关键区别）
主题包**只把以下两类 token 注入为运行时 CSS 变量**，可在 `.vue` 的 `<style>`（含 scoped）里直接 `var()` 引用：
- **颜色**：`--color-*`、`--primary-*`、`--gray-*` 等全部色板/语义色。
- **圆角**：`--border-radius-none/small/medium/large/circle`。

**字号、字重、行高、间距、尺寸只有 Less 变量**（`@font-size-*`、`@font-weight-*`、`@line-height-*`、`@spacing-*`、`@size-*`），**不存在对应的运行时 CSS 变量**（`var(--font-size-*)` 取不到值）。因此：
- 组件自身字号/字重/间距由主题包内部管控，**优先用组件（`a-typography`、`a-form` 等）而非自定义 CSS**。
- 页面自定义 `<style>` 中：**圆角一律用 `var(--border-radius-*)`**；字号/字重/间距若无法走组件，只能写字面值，且**必须落在 Pangea 档位上**（字号 12/13/14/16/20/24…，字重 400/500/600/700，间距 4 的倍数），不要自造非档位值。

---

## 二、品牌主色（Primary）

Pangea 3 Linear 的品牌色为**青绿色（Teal）**系列，与 Arco Design 默认蓝色不同。

| Token | 亮色值 | 暗色值 | 说明 |
|-------|--------|--------|------|
| `--primary-1` | `rgb(232, 255, 251)` | `rgb(0, 68, 77)` | 最浅，背景色 |
| `--primary-2` | `rgb(173, 238, 228)` | `rgb(4, 92, 100)` | 浅色，hover 背景 |
| `--primary-3` | `rgb(121, 221, 209)` | `rgb(10, 117, 123)` | 浅色 / 禁用主色 |
| `--primary-4` | `rgb(74, 204, 193)` | `rgb(18, 144, 147)` | 中浅色 |
| `--primary-5` | `rgb(34, 187, 179)` | `rgb(27, 170, 167)` | **hover 状态** |
| `--primary-6` | `rgb(0, 170, 166)` = `#00aaa6` | `rgb(37, 187, 179)` | **主色，最常用** |
| `--primary-7` | `rgb(0, 144, 147)` | `rgb(78, 204, 193)` | **active 状态** |
| `--primary-8` | `rgb(0, 117, 123)` | `rgb(124, 221, 209)` | 深色 |
| `--primary-9` | `rgb(0, 92, 100)` | `rgb(176, 238, 228)` | 更深 |
| `--primary-10` | `rgb(0, 68, 77)` | `rgb(235, 255, 251)` | 最深 |

**Less 变量**：`@color-primary-6` = `rgb(var(--primary-6))`。
**链接色（link）与主色一致**：`--link-1` ~ `--link-10` 值与 `--primary-*` 相同。

用法：
```css
background: rgb(var(--primary-6));           /* 主按钮 / 交互主色 */
background: rgb(var(--primary-5));           /* hover */
background: rgb(var(--primary-7));           /* active */
background: var(--color-primary-light-1);    /* 主色浅底（= rgb(var(--primary-1))） */
```

---

## 三、语义色

### 文字颜色
| Token | 亮色值 | 暗色值 | 用途 |
|-------|--------|--------|------|
| `--color-text-1` | `rgb(29, 33, 41)` (gray-10) | `rgba(255,255,255,0.9)` | 主要文字、标题、正文 |
| `--color-text-2` | `rgb(78, 89, 105)` (gray-8) | `rgba(255,255,255,0.7)` | 次要文字 |
| `--color-text-3` | `rgb(134, 144, 156)` (gray-6) | `rgba(255,255,255,0.5)` | 辅助文字、占位符 |
| `--color-text-4` | `rgb(201, 205, 212)` (gray-4) | `rgba(255,255,255,0.3)` | 禁用文字 |

### 背景颜色
| Token | 亮色值 | 暗色值 | 用途 |
|-------|--------|--------|------|
| `--color-bg-1` | `#ffffff` | `#17171a` | 页面底层背景 |
| `--color-bg-2` | `#ffffff` | `#232324` | 卡片/面板背景 |
| `--color-bg-3` | `#ffffff` | `#2a2a2b` | 悬浮背景 |
| `--color-bg-4` | `#ffffff` | `#313132` | 更深层背景 |
| `--color-bg-5` | `#ffffff` | `#373739` | 弹出层背景 |
| `--color-bg-white` | `#ffffff` | `#f6f6f6` | 纯白背景 |
| `--color-bg-popup` | = `--color-bg-5` | = `--color-bg-5` | 弹出层专用（下拉/tooltip/popover） |

> 注意：亮色模式下所有 `bg` 层级均为白色，层次通过 `fill` 与 `border` 区分。

### 填充颜色（Fill）
| Token | 亮色值 | 暗色值 | 用途 |
|-------|--------|--------|------|
| `--color-fill-1` | `rgb(247,248,250)` (gray-1) | `rgba(255,255,255,0.04)` | 最浅填充 |
| `--color-fill-2` | `rgb(242,243,245)` (gray-2) | `rgba(255,255,255,0.08)` | 输入框/选择器背景、text 按钮 hover |
| `--color-fill-3` | `rgb(229,230,235)` (gray-3) | `rgba(255,255,255,0.12)` | hover 填充 |
| `--color-fill-4` | `rgb(201,205,212)` (gray-4) | `rgba(255,255,255,0.16)` | active 填充 |

### 边框颜色
| Token | 亮色值 | 暗色值 | 用途 |
|-------|--------|--------|------|
| `--color-border-1` | `rgb(242,243,245)` (gray-2) | `rgb(46,46,48)` | 最浅边框 |
| `--color-border-2` | `rgb(229,230,235)` (gray-3) | `rgb(72,72,73)` | 常规边框 |
| `--color-border-3` | `rgb(201,205,212)` (gray-4) | `rgb(95,95,96)` | 较深边框 |
| `--color-border-4` | `rgb(134,144,156)` (gray-6) | `rgb(146,146,147)` | 深色边框 |

### 状态色（`*-6` 为主值）
| 状态 | 主色 Token | 亮色值 | 说明 |
|------|-----------|--------|------|
| 成功 | `--success-6` | `rgb(0, 180, 42)` = `#00b42a`（green-6） | 成功状态 |
| 危险/错误 | `--danger-6` | `rgb(245, 63, 63)` = `#f53f3f`（red-6） | 错误/危险状态 |
| 警告 | `--warning-6` | `rgb(255, 125, 0)` = `#ff7d00`（orange-6） | 警告状态 |
| 信息 | `--info-6` | `rgb(22, 93, 255)` = `#165dff`（arcoblue-6） | 信息状态 |

**状态色浅色变体**（`light-1` ~ `light-4`，亮色模式为对应 `*-1`~`*-4`，暗色模式为主色不同透明度）：
`--color-primary-light-1..4`、`--color-danger-light-1..4`、`--color-success-light-1..4`、`--color-warning-light-1..4`、`--color-link-light-1..4`。

> 注意：状态色中，成功=green、危险=red、警告=orange、信息=arcoblue，**这些沿用 Arco 标准色，未被 Pangea 改动**；被改动为青绿的是 `primary` 与 `link`。

---

## 四、基础色板（Base Palette，完整色阶）

基础色板是 Pangea 的**底层原子色**（primitive tier），语义 token（`--color-text-*`、`--primary-*`、`--success-*` 等）都最终引用它们。当组件默认语义色不够用时——**数据可视化、多色标签/分类、图表系列、状态徽标扩展**等场景——直接从这里取色。

每种颜色 **1–10 共 10 级，1 最浅、10 最深**（暗色模式下色阶反转）。所有调色板颜色以 **RGB 分量**注入 CSS 变量，使用时须包 `rgb()` / `rgba()`：

```css
color: rgb(var(--purple-6));          /* 分类色 */
background: rgba(var(--cyan-6), 0.1); /* 浅色底 */
```

> 取值以主题包运行时（`theme.css` / `tokens.less`，即 `rgb(var(--x-n))` 实际解析结果）为准，保证生成代码与组件渲染一致。下表 hex 用于图表等需硬编码的场景；能用 CSS 变量时优先用变量。

### 品牌与中性

| 色系（变量前缀） | 1 | 2 | 3 | 4 | 5 | 6（主值） | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| **primary / link**（青绿·品牌） | `#E8FFFB` | `#ADEEE4` | `#79DDD1` | `#4ACCC1` | `#22BBB3` | **`#00AAA6`** | `#009093` | `#00757B` | `#005C64` | `#00444D` |
| **gray**（中性） | `#F7F8FA` | `#F2F3F5` | `#E5E6EB` | `#C9CDD4` | `#A9AEB8` | `#86909C` | `#6B7785` | `#4E5969` | `#272E3B` | `#1D2129` |

### 状态色底色板

| 色系 | 1 | 2 | 3 | 4 | 5 | 6（主值） | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| **red**（danger） | `#FFECE8` | `#FDCDC5` | `#FBACA3` | `#F98981` | `#F76560` | **`#F53F3F`** | `#CB272D` | `#A1151E` | `#770813` | `#4D000A` |
| **green**（success） | `#E8FFEA` | `#AFF0B5` | `#7BE188` | `#4CD263` | `#23C343` | **`#00B42A`** | `#009A29` | `#008026` | `#006622` | `#004D1C` |
| **orange**（warning） | `#FFF7E8` | `#FFE4BA` | `#FFCF8B` | `#FFB65D` | `#FF9A2E` | **`#FF7D00`** | `#D25F00` | `#A64500` | `#792E00` | `#4D1B00` |
| **arcoblue / info** | `#E8F3FF` | `#BEDAFF` | `#94BFFF` | `#6AA1FF` | `#4080FF` | **`#165DFF`** | `#0E42D2` | `#072CA6` | `#031A79` | `#000D4D` |

> `--success-*` = `green`、`--danger-*` = `red`、`--warning-*` = `orange`、`--info-*` = `arcoblue`（别名，值相同）。

### 扩展色板（用于分类 / 数据可视化）

| 色系 | 1 | 2 | 3 | 4 | 5 | 6（主值） | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| **orangered** | `#FFF3E8` | `#FDDDC3` | `#FCC59F` | `#FAAC7B` | `#F99057` | `#F77234` | `#CC5120` | `#A23511` | `#771F06` | `#4D0E00` |
| **gold** | `#FFFCE8` | `#FDF4BF` | `#FCE996` | `#FADC6D` | `#F9CC45` | `#F7BA1E` | `#CC9213` | `#A26D0A` | `#774B04` | `#4D2D00` |
| **yellow** | `#FEFFE8` | `#FEFEBE` | `#FDFA94` | `#FCF26B` | `#FBE842` | `#FADC19` | `#CFAF0F` | `#A38408` | `#785D03` | `#4D3800` |
| **lime** | `#FCFFE8` | `#EDF8BB` | `#DCF190` | `#C9E968` | `#B5E241` | `#9FDB1D` | `#7EB712` | `#5F940A` | `#437004` | `#2A4D00` |
| **cyan** | `#E8FFFB` | `#B7F4EC` | `#89E9E0` | `#5EDFD6` | `#37D4CF` | `#14C9C9` | `#0DA5AA` | `#07828B` | `#03616C` | `#00424D` |
| **blue** | `#E8F7FF` | `#C3E7FE` | `#9FD4FD` | `#7BC0FC` | `#57A9FB` | `#3491FA` | `#206CCF` | `#114BA3` | `#063078` | `#001A4D` |
| **purple** | `#F5E8FF` | `#DDBEF6` | `#C396ED` | `#A871E3` | `#8D4EDA` | `#722ED1` | `#551DB0` | `#3C108F` | `#27066E` | `#16004D` |
| **bluepurple** | `#F2E8FF` | `#E0C9FF` | `#CBAAFF` | `#B48CFF` | `#9B6DFF` | `#814EFF` | `#5930D2` | `#3819A6` | `#1E0979` | `#0B004D` |
| **pinkpurple** | `#FFE8FB` | `#F7BAEF` | `#F08EE6` | `#E865DF` | `#E13EDB` | `#D91AD9` | `#B010B6` | `#8A0993` | `#650370` | `#42004D` |
| **magenta** | `#FFE8F1` | `#FDC2DB` | `#FB9DC7` | `#F979B7` | `#F754A8` | `#F5319D` | `#CB1E83` | `#A11069` | `#77064F` | `#4D0034` |

**纯黑白**：`--color-white` = `#FFFFFF`、`--color-black` = `#000000`。

### 用法建议（场景扩展）

- **单色系列/进度**：同一色系取 `-3`/`-4`（浅）→ `-6`（主）→ `-8`/`-9`（深）表达程度递进。
- **多类别分类色**（图表系列、标签分组）：优先在扩展色板的 `-6` 之间取高区分度组合，如 `arcoblue-6`、`green-6`、`orange-6`、`purple-6`、`magenta-6`、`cyan-6`、`gold-6`、`lime-6`。
- **浅色底 + 深色字**：底用 `-1`/`-2`，文字/图标用 `-6`/`-7`，保证对比度（如标签、状态块）。
- **暗色模式**：直接用 `rgb(var(--<color>-<n>))` 即可自动切换（色阶已在暗色下反转），不要为暗色单独硬编码。
- 语义优先：能用语义 token（`--color-text-*`、`--color-bg-*`、`--primary-*`、`--success-*`…）就不用基础色板；基础色板仅用于语义 token 未覆盖的扩展场景。

---

## 五、字体 Token

### 字体族
```
Inter, -apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, noto sans, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif
```
主题包会把该字体族应用到 `body`。首选字体为 **Inter**。

### 字号
| Token | 值 | 用途 |
|-------|-----|------|
| `@font-size-display-3` | `56px` | 超大展示标题 |
| `@font-size-display-2` | `48px` | 大展示标题 |
| `@font-size-display-1` | `36px` | 展示标题 |
| `@font-size-title-3` | `24px` | 三级标题 |
| `@font-size-title-2` | `20px` | 二级标题 |
| `@font-size-title-1` | `16px` | 一级标题 |
| `@font-size-body-3` | `14px` | 正文（默认） |
| `@font-size-body-2` | `13px` | 小正文 |
| `@font-size-body-1` | `12px` | 辅助文字 |
| `@font-size-caption` | `12px` | 说明文字 |

### 字重
| Token | 值 |
|-------|-----|
| `@font-weight-400` | `400`（Regular） |
| `@font-weight-500` | `500`（Medium） |
| `@font-weight-600` | `600`（SemiBold） |
| `@font-weight-700` | `700`（Bold） |

### 行高
| Token | 值 |
|-------|-----|
| `@line-height-base` | `1.5715` |

---

## 六、间距 Token（Spacing）

基于 2px 基准，常用为 4px 的倍数：

| Token | 值 | 常用场景 |
|-------|-----|---------|
| `@spacing-none` | `0` | 无间距 |
| `@spacing-1` | `2px` | 极小间距 |
| `@spacing-2` | `4px` | 最小间距 |
| `@spacing-3` | `6px` | 小间距 |
| `@spacing-4` | `8px` | 常用小间距 |
| `@spacing-5` | `10px` | |
| `@spacing-6` | `12px` | 常用中间距 |
| `@spacing-7` | `16px` | 常用大间距 |
| `@spacing-8` | `20px` | |
| `@spacing-9` | `24px` | 区块间距 |
| `@spacing-10` | `32px` | 大区块间距 |
| `@spacing-11` | `36px` | |
| `@spacing-12` | `40px` | |
| `@spacing-13` | `48px` | |
| `@spacing-14` | `56px` | |

（继续到 `@spacing-22` = `120px`。）

---

## 七、尺寸 Token（Size）

### 组件高度（4px 步进）
| Token | 值 |
|-------|-----|
| `@size-mini` | `24px` |
| `@size-small` | `28px` |
| `@size-default` / `@size-medium` | `32px` |
| `@size-large` | `36px` |

### 通用尺寸（4px 步进，1–50）
`@size-1` = `4px`，`@size-2` = `8px`，…，`@size-N` = `N×4px`（最大 `@size-50` = `200px`）。

---

## 八、圆角 Token（Border Radius）

| Token | CSS 变量 | 值 | 用途 |
|-------|---------|-----|------|
| `@border-radius-none` | `--border-radius-none` | `0` | 无圆角 |
| `@border-radius-small` | `--border-radius-small` | `2px` | 小圆角（标签、选择器等） |
| `@border-radius-medium` | `--border-radius-medium` | `4px` | 中圆角（按钮、输入框） |
| `@border-radius-large` | `--border-radius-large` | `8px` | 大圆角（卡片、弹窗、下拉、抽屉） |
| `@border-radius-circle` | `--border-radius-circle` | `50%` | 圆形 |

---

## 九、阴影 Token（Shadow）

三级阴影系统，每级支持 9 个方向（`center`、`up`、`down`、`left`、`right`、`left-up`、`left-down`、`right-up`、`right-down`）：

| 级别 | 方向 | Token | 值 |
|------|------|-------|-----|
| 1 级（轻） | 下 | `@shadow1-down` | `0 2px 5px rgba(0,0,0,0.1)` |
| 2 级（中） | 下 | `@shadow2-down` | `0 4px 10px rgba(0,0,0,0.1)` |
| 3 级（重） | 下 | `@shadow3-down` | `0 8px 20px rgba(0,0,0,0.1)` |

弹出层常用：`@popup-shadow` = `0 4px 10px rgba(0,0,0,0.1)`。

---

## 十、过渡动画 Token（Transition）

### 时长
| Token | 值 | 用途 |
|-------|-----|------|
| `@transition-duration-1` | `0.1s` | 极快 |
| `@transition-duration-2` | `0.2s` | 快速（常用） |
| `@transition-duration-3` | `0.3s` | 标准（常用） |
| `@transition-duration-4` | `0.4s` | 慢速 |
| `@transition-duration-5` | `0.5s` | 极慢 |
| `@transition-duration-loading` | `1s` | 加载动画 |

### 缓动函数
| Token | 值 | 用途 |
|-------|-----|------|
| `@transition-timing-function-linear` | `cubic-bezier(0,0,1,1)` | 线性 |
| `@transition-timing-function-standard` | `cubic-bezier(0.34,0.69,0.1,1)` | 标准（默认） |
| `@transition-timing-function-overshoot` | `cubic-bezier(0.3,1.3,0.3,1)` | 弹性超出 |
| `@transition-timing-function-decelerate` | `cubic-bezier(0.4,0.8,0.74,1)` | 减速进入 |
| `@transition-timing-function-accelerate` | `cubic-bezier(0.26,0,0.6,0.2)` | 加速离开 |

---

## 十一、层级 Token（Z-Index）

| Token | 值 | 用途 |
|-------|-----|------|
| `@z-index-affix` | `999` | 固钉 |
| `@z-index-popup` | `1000` | 弹出层（下拉、tooltip） |
| `@z-index-drawer` | `1001` | 抽屉 |
| `@z-index-modal` | `1001` | 模态框 |
| `@z-index-image-preview` | `1001` | 图片预览 |
| `@z-index-message` | `1003` | 消息提示 |
| `@z-index-notification` | `1003` | 通知 |

---

## 十二、组件级 Token（常用组件）

以下为 Pangea 主题下常用组件级 token，均可用 Less `@token` 引用。生成组件时应优先使用组件自身的 API/class，本节用于理解主题下的默认外观与自定义。

### 按钮（Button）
| Token | 值 | 说明 |
|-------|-----|------|
| `@btn-border-radius` | `4px` | 圆角 |
| `@btn-font-weight` | `400` | 字重 |
| `@btn-size-mini-height` | `24px` | mini 高度 |
| `@btn-size-small-height` | `28px` | small 高度 |
| `@btn-size-default-height` | `32px` | default 高度 |
| `@btn-size-large-height` | `36px` | large 高度 |
| `@btn-size-default-font-size` | `14px` | 默认字号 |
| `@btn-primary-color-bg` | `rgb(var(--primary-6))` | 主按钮背景（青绿） |
| `@btn-primary-color-bg_hover` | `rgb(var(--primary-5))` | 主按钮 hover |
| `@btn-primary-color-bg_active` | `rgb(var(--primary-7))` | 主按钮 active |
| `@btn-outline-color-text` / `@btn-outline-color-border` | `rgb(var(--primary-6))` | 线框按钮文字/边框 |
| `@btn-text-color-text` | `rgb(var(--primary-6))` | 文本按钮文字 |

### 输入框（Input）
| Token | 值 | 说明 |
|-------|-----|------|
| `@input-border-radius` | `4px` | 圆角 |
| `@input-color-bg` | `var(--color-bg-1)` | 背景色 |
| `@input-color-bg_hover` | `var(--color-bg-3)` | hover 背景 |
| `@input-color-bg_focus` | `var(--color-bg-2)` | focus 背景 |
| `@input-color-border` | `var(--color-neutral-4)` | 边框色 |
| `@input-color-border_hover` | `rgb(var(--primary-6))` | hover 边框 |
| `@input-color-border_focus` | `rgb(var(--primary-6))` | focus 边框 |
| `@input-color-text` | `var(--color-text-1)` | 文字色 |
| `@input-color-placeholder-text` | `var(--color-text-3)` | 占位符色 |
| `@input-size-default-height` | `32px` | 默认高度 |
| `@input-padding-horizontal` | `12px` | 水平内边距 |

### 选择器（Select）
| Token | 值 | 说明 |
|-------|-----|------|
| `@select-color-bg_default` | `var(--color-fill-2)` | 默认背景（填充式，无边框） |
| `@select-color-bg_default_hover` | `var(--color-fill-3)` | hover 背景 |
| `@select-color-bg_default_focus` | `var(--color-bg-2)` | focus 背景 |
| `@select-color-border_default` | `transparent` | 默认边框（无边框） |
| `@select-color-border_default_focus` | `rgb(var(--primary-6))` | focus 边框 |
| `@select-border-radius` | `2px`（= `@radius-small`） | 圆角 |
| `@select-popup-option-height` | `36px` | 选项高度 |
| `@select-popup-color-bg` | `var(--color-bg-popup)` | 弹出层背景 |

### 标签（Tag）
| Token | 值 | 说明 |
|-------|-----|------|
| `@tag-border-radius` | `4px` | 圆角 |
| `@tag-size-default` | `24px` | 默认高度 |
| `@tag-size-large` | `32px` | 大号高度 |
| `@tag-size-default-font-size` | `12px` | 默认字号 |
| `@tag-text-font-weight` | `500` | 字重 |
| `@tag-default-color-bg` | `var(--color-fill-2)` | 默认背景 |
| `@tag-default-color-text` | `var(--color-text-1)` | 默认文字 |

### 弹出层（Popup / Dropdown / Popover）
| Token | 值 | 说明 |
|-------|-----|------|
| `@popup-border-radius` | `8px` | 圆角 |
| `@popup-shadow` | `0 4px 10px rgba(0,0,0,0.1)` | 阴影 |
| `@popup-color-content-bg` | `var(--color-bg-popup)` | 背景 |
| `@popup-padding-horizontal` | `16px` | 水平内边距 |
| `@popup-padding-vertical` | `12px` | 垂直内边距 |
| `@popup-font-size` | `14px` | 字号 |

### 卡片（Card）
| Token | 值 | 说明 |
|-------|-----|------|
| `@card-border-radius` | `8px` | 圆角 |
| `@card-color-bg` | `var(--color-bg-2)` | 背景 |
| `@card-color-border` | `var(--color-neutral-3)` | 边框 |
| `@card-color-title` | `var(--color-text-1)` | 标题色 |
| `@card-font-weight-title` | `500` | 标题字重 |
| `@card-size-default-padding-horizontal-body` | `16px` | 内容水平内边距 |

### 弹窗（Modal）
| Token | 值 | 说明 |
|-------|-----|------|
| `@modal-border-radius` | `8px` | 圆角 |
| `@modal-default-size-width` | `520px` | 默认宽度 |
| `@modal-simple-size-width` | `400px` | 简洁型宽度 |
| `@modal-font-header-size` | `16px` | 标题字号 |
| `@modal-default-align-footer` | `right` | 页脚对齐（右对齐） |

### 警告提示（Alert）
| Token | 值 | 说明 |
|-------|-----|------|
| `@alert-border-radius` | `4px` | 圆角 |
| `@alert-min-height` | `40px` | 最小高度 |
| `@alert-info-color-bg` | `rgb(var(--info-1))` | 信息背景 |
| `@alert-warning-color-bg` | `var(--color-warning-light-1)` | 警告背景 |
| `@alert-error-color-bg` | `var(--color-danger-light-1)` | 错误背景 |
| `@alert-success-color-bg` | `var(--color-success-light-1)` | 成功背景 |

### 表格（Table）
| Token | 值 | 说明 |
|-------|-----|------|
| `@table-border-radius` | `4px`（= `--border-radius-medium`） | 圆角 |
| `@table-color-bg-header-cell` | `var(--color-neutral-2)` | 表头背景 |
| `@table-font-weight-header-text` | `600` | 表头字重 |
| `@table-color-bg-body-row_hover` | `var(--color-fill-1)` | 行 hover 背景 |
| `@table-color-border` | `var(--color-neutral-3)` | 边框 |

### 菜单（Menu）
| Token | 值 | 说明 |
|-------|-----|------|
| `@menu-color-label-item-selected` | `rgb(var(--primary-6))` | 选中项标识色（青绿） |
| `@menu-light-color-item_selected` | `rgb(var(--primary-6))` | 亮色选中项文字 |
| `@menu-light-color-bg-item_selected` | `var(--color-fill-2)` | 亮色选中项背景 |
| `@menu-dark-color-bg` | `var(--color-menu-dark-bg)` = `#232324` | 暗色菜单背景 |
| `@menu-border-radius` | `4px` | 圆角 |

> 折叠面板（Collapse）标题字重为 `600`；表头字重、Collapse 标题字重是 Pangea 主题对 Arco 默认的显著微调之一。

---

## 十三、暗黑模式

通过在 `body` 上设置 `arco-theme='dark'` 激活，所有 CSS 变量自动切换（切换机制与 Arco 一致，见 [theming.md](../overview/theming.md)）。

```ts
document.body.setAttribute('arco-theme', 'dark');   // 开启
document.body.removeAttribute('arco-theme');        // 恢复亮色
```

**关键差异**：
- 背景色从白色变为深灰系（`#17171a` ~ `#373739`）。
- 文字色变为白色不同透明度（`rgba(255,255,255,0.9)` ~ `0.3`）。
- 填充色变为白色不同透明度（`0.04` ~ `0.16`）。
- 调色板色阶反转（1 最深、10 最浅）。
- 品牌主色 `--primary-6` 从 `rgb(0,170,166)` 变为 `rgb(37,187,179)`（暗色下更亮，保证对比度）。

**适配要点**：使用语义 token（`--color-text-*`、`--color-bg-*`、`--color-border-*`、`--color-fill-*`）而非调色板直接值，即可自动适配暗黑模式。

---

## 十四、常用 CSS 变量速查

```css
/* 文字 */
var(--color-text-1)    /* 主要文字/标题/正文 */
var(--color-text-2)    /* 次要文字 */
var(--color-text-3)    /* 辅助/占位符 */
var(--color-text-4)    /* 禁用文字 */

/* 背景 */
var(--color-bg-1)      /* 页面背景 */
var(--color-bg-2)      /* 卡片背景 */
var(--color-bg-popup)  /* 弹出层背景（= bg-5） */

/* 填充 */
var(--color-fill-1)    /* 最浅填充 */
var(--color-fill-2)    /* 输入框/选择器背景 */
var(--color-fill-3)    /* hover 填充 */
var(--color-fill-4)    /* active 填充 */

/* 边框 */
var(--color-border-2)  /* 常规边框 */
var(--color-border-3)  /* 较深边框 */

/* 品牌主色（青绿） */
rgb(var(--primary-6))          /* 品牌主色 #00aaa6 */
rgb(var(--primary-5))          /* hover */
rgb(var(--primary-7))          /* active */
var(--color-primary-light-1)   /* 主色浅底 */

/* 状态色 */
rgb(var(--success-6))  /* 成功 #00b42a */
rgb(var(--danger-6))   /* 错误 #f53f3f */
rgb(var(--warning-6))  /* 警告 #ff7d00 */
rgb(var(--info-6))     /* 信息 #165dff */

/* 圆角 */
var(--border-radius-medium)  /* 4px，按钮/输入框 */
var(--border-radius-large)   /* 8px，卡片/弹窗 */
```

---

## 十五、设计规范建议

1. **禁止硬编码颜色**，始终使用 CSS 变量或 Less token。
2. **品牌主色是青绿 `#00aaa6`（`--primary-6`）**，交互元素用 `primary-6`，hover 用 `primary-5`，active 用 `primary-7`；不要用 Arco 默认蓝。
3. **间距使用 4px 倍数**：4、8、12、16、20、24、32px。
4. **字号层级**：正文 14px，辅助 12px，标题 16/20/24px；首选字体 Inter。
5. **圆角规范**：按钮/输入框用 4px，卡片/弹窗/下拉/抽屉用 8px，标签/选择器用 2px，头像/徽标用 50%。
6. **一组操作只突出一个主操作**：主操作用 `primary`，危险操作用 `danger`，其余用次级/文本按钮。
7. **暗色适配**：使用语义 token（`--color-text-*`、`--color-bg-*` 等）而非调色板直接值，自动适配暗黑模式。
8. **不靠颜色单独传达信息**：状态/数据系列除颜色外应有图标或文字；纯图标按钮需可访问名（aria-label）。
