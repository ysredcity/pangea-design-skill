---
name: pangea-vue-theming
description: "Pangea 主题接入指南。用于安装并应用 @arco-themes/vue-pangea-3-linear 主题包、样式引入顺序、@arco-plugins/vite-vue / webpack 配置、Less 变量定制、暗黑模式。"
user-invocable: false
---

# 主题接入（Pangea 3 Linear）

Pangea 在 `@arco-design/web-vue` 之上套用定制主题包 **`@arco-themes/vue-pangea-3-linear`**（由 Arco 官方主题定制工具产出，`depLibrary` = `@arco-design/web-vue`，peer `@arco-design/web-vue ^2.57.0`）。

主题包只改变**视觉 token**（品牌青绿主色、语义色、字体、间距、圆角、阴影、组件级 token），**不改变组件 API**。全部 token 取值见 [design-tokens.md](../theme/design-tokens.md)。

## 安装

```bash
npm install @arco-design/web-vue @arco-themes/vue-pangea-3-linear
# 或 yarn add / pnpm add
```

## 接入方式一：@arco-plugins/vite-vue（推荐）

用官方 Vite 插件的 `theme` 选项自动注入主题包，无需手动引入组件库 CSS（插件负责样式按需加载 + 主题注入）。

```bash
npm i @arco-plugins/vite-vue -D
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { vitePluginForArco } from '@arco-plugins/vite-vue';

export default defineConfig({
  plugins: [
    vue(),
    vitePluginForArco({
      theme: '@arco-themes/vue-pangea-3-linear',
      // style: 'css', // 可选，默认 true（引入 less）
    }),
  ],
});
```

```ts
// main.ts —— 使用插件时无需手动 import '@arco-design/web-vue/dist/arco.css'
import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import App from './App.vue';

const app = createApp(App);
app.use(ArcoVue);
app.mount('#app');
```

> 图标不再注册默认的 `ArcoVueIcon`：`iconBox` 选项已把默认 Arco 图标替换为 Pangea 图标包 `@arco-iconbox/vue-pangea-mobile`。业务图标从该包**命名导入**使用（见 [project-structure.md](project-structure.md)）。

`vitePluginForArco` 常用选项：

| 参数 | 类型 | 说明 |
|---|---|---|
| `theme` | string | 主题包名，此处填 `@arco-themes/vue-pangea-3-linear` |
| `modifyVars` | object | 额外覆盖的 Less 变量（在主题包之上再定制） |
| `style` | `'css' \| boolean` | 样式引入方式，默认 `true`（引入 less）；`'css'` 引入编译后的 css；`false` 不引入 |
| `iconBox` | string | 图标库包名 |
| `componentPrefix` | string | 组件前缀，默认 `a` |

Webpack 项目可用等价的 `@arco-plugins/webpack-vue`，同样通过 `theme` 选项指定主题包名。

## 接入方式二：直接引入主题包样式

不使用插件时，**在组件库样式之后**引入主题包，确保主题变量覆盖默认值。

运行时 CSS（最简单，主题包已把所有 CSS 变量注入 `body`）：

```ts
import '@arco-design/web-vue/dist/arco.css';
import '@arco-themes/vue-pangea-3-linear/theme.css';
```

或使用主题包的 Less 入口（需要在 Less 层定制变量时）：

```less
// 主题包 index.less 内部已依次引入 arco.less + 主题变量 + 组件覆盖
@import '@arco-themes/vue-pangea-3-linear/index.less';
```

主题包提供的入口文件：

| 文件 | 用途 |
|---|---|
| `theme.css` | 运行时 CSS 变量（注入 `body` 及 `body[arco-theme='dark']`） |
| `index.less` | Less 总入口（arco.less + `theme.less` + `variables.less` + `component.less`） |
| `theme.less` | 主题变量定义与 CSS 变量映射 |
| `tokens.less` | 全量 token（颜色/字体/间距/尺寸/组件…） |
| `component.less` | 组件级样式覆盖 |

## Less 变量定制（在 Pangea 之上再调整）

全局 Less 变量位于 `@arco-design/web-vue/es/style/theme/global.less`，组件级 token 位于类似 `@arco-design/web-vue/es/button/style/token.less` 的路径。若需在 Pangea 主题之上再覆盖变量，用插件的 `modifyVars`：

```ts
vitePluginForArco({
  theme: '@arco-themes/vue-pangea-3-linear',
  modifyVars: {
    // 例：在 Pangea 主色之外再微调（一般不需要，优先沿用主题包取值）
    // 'primary-6': '0, 170, 166',
  },
});
```

> 优先直接使用主题包提供的 token（见 design-tokens.md），不要为了改色而绕过主题包硬编码颜色。

## 暗黑模式

主题包同时定义了亮/暗两套变量，暗色通过在 `body` 上的 `arco-theme` 属性切换（与 Arco 一致）。

```ts
// 开启暗色
document.body.setAttribute('arco-theme', 'dark');
// 恢复亮色
document.body.removeAttribute('arco-theme');
```

把主题状态集中在布局 store 或 `useTheme` composable 中，不要让多个无关组件直接修改 `body` 属性。暗色下 token 的具体变化见 [design-tokens.md](../theme/design-tokens.md) 第十三节。
