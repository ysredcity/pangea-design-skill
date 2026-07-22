---
name: pangea-vue-getting-started
description: "Pangea 安装与接入指南。用于安装 `@arco-design/web-vue` 与主题包 `@arco-themes/vue-pangea-3-linear`、注册 ArcoVue、引入样式、接入 Pangea 主题、配置 Vite 按需加载、图标和 TypeScript。"
user-invocable: false
---

# 快速开始（Pangea）

Pangea = `@arco-design/web-vue`（组件库）+ `@arco-themes/vue-pangea-3-linear`（公司定制主题包）。本页覆盖安装与接入；主题 token 取值见 [design-tokens.md](../theme/design-tokens.md)，主题接入细节见 [theming.md](theming.md)。

来源文档（组件库部分）：
- 上游 `packages/web-vue/README.zh-CN.md`
- 上游 `packages/arco-vue-docs/docs/start.zh-CN.md`

## 版本

Arco Design Vue 面向 Vue 3。主题包 `@arco-themes/vue-pangea-3-linear`（v1.0.11）声明 peer dependency `@arco-design/web-vue ^2.57.0`。官方快速上手文档建议 Vue `>=3.2.0`。

Vue 3 不再支持 IE，Arco Design Vue 也不支持 IE。

## 安装

```bash
npm install @arco-design/web-vue @arco-themes/vue-pangea-3-linear
yarn add @arco-design/web-vue @arco-themes/vue-pangea-3-linear
pnpm add @arco-design/web-vue @arco-themes/vue-pangea-3-linear
```

## 完整引入 + 接入 Pangea 主题

推荐用 `@arco-plugins/vite-vue` 的 `theme` 选项接入主题包（自动注入主题并处理样式按需加载）：

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { vitePluginForArco } from '@arco-plugins/vite-vue';

export default defineConfig({
  plugins: [
    vue(),
    vitePluginForArco({ theme: '@arco-themes/vue-pangea-3-linear' }),
  ],
});
```

```ts
// main.ts（使用插件时无需手动 import arco.css）
import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import App from './App.vue';

const app = createApp(App);
app.use(ArcoVue);
app.mount('#app');
```

不使用插件时，手动在组件库样式**之后**引入主题包（顺序很重要）：

```ts
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import '@arco-themes/vue-pangea-3-linear/theme.css'; // 在 arco.css 之后
```

完整注册后，默认使用 `a-` 前缀的全局组件标签。

```vue
<template>
  <a-space>
    <a-button type="primary">提交</a-button>
    <a-input v-model="keyword" placeholder="搜索" />
  </a-space>
</template>
```

> 更多主题接入方式（Less 入口、`modifyVars`、暗黑模式）见 [theming.md](theming.md)。

## 全局配置

`app.use(ArcoVue, options)` 可以接收全局配置对象。通过 `componentPrefix` 可修改全局组件前缀。

```ts
app.use(ArcoVue, {
  componentPrefix: 'arco',
});
```

设置后，`<a-button>` 会变成 `<arco-button>`。同一个应用中不要混用多个前缀。

## 按需加载

模板开发场景优先使用 `unplugin-vue-components` 和 `ArcoResolver`。

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ArcoResolver()],
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true,
        }),
      ],
    }),
  ],
});
```

如果在 `<script>` 中手动导入组件或服务，也需要手动导入对应样式。

```ts
import { Message } from '@arco-design/web-vue';
import '@arco-design/web-vue/es/message/style/css.js';
```

## Arco Vite 插件

也可以使用 `@arco-plugins/vite-vue` 完成按需加载、组件库样式配置**以及主题包接入**（见上文「完整引入 + 接入 Pangea 主题」）。

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { vitePluginForArco } from '@arco-plugins/vite-vue';

export default defineConfig({
  plugins: [
    vue(),
    vitePluginForArco({
      theme: '@arco-themes/vue-pangea-3-linear',
      style: 'css',
    }),
  ],
});
```

## 组件和图标导入

组件和全局服务从根包导入。

```ts
import { Button, Table, Form, Message, Modal } from '@arco-design/web-vue';
```

图标从 **Pangea 图标包**命名导入（tree-shakable），`font-size` 控制大小、`color` 控制颜色（默认继承 `currentColor`）。

```ts
import { IconGlobal, IconPieChart } from '@arco-iconbox/vue-pangea-mobile';
```

配置了 `@arco-plugins/vite-vue` 的 `iconBox` 选项后，默认 Arco 图标会被替换为 Pangea 图标集，无需再从 `@arco-design/web-vue/es/icon` 引入。图标接入详见 [project-structure.md](project-structure.md)。

## TypeScript

组件库使用 TypeScript 编写。业务代码中优先使用有类型的 `ref`、`reactive`、`computed`、`defineProps` 和 `defineEmits`。
