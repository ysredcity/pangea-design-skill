/// <reference types="vite/client" />

// Vue 单文件组件类型声明（否则 TS/vue-tsc 找不到 `*.vue` 模块）
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

// Pangea 图标包未随包提供类型声明，这里补一个环境声明，避免 TS 报「找不到声明文件」。
declare module '@arco-iconbox/vue-pangea-mobile';
