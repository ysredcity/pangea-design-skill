# Pangea App Starter

Pangea 前端工程脚手架样例：Vue 3 + Vite + TypeScript + Vue Router + Arco Design Vue + **Pangea 主题包/图标包**。

同时服务两类使用者：
- **产品经理**：快速产出高保真 demo 原型（用 mock 数据）。
- **开发工程师**：基于 PRD 直接产出符合设计规范的 UI 界面（把 mock 换成真实接口）。

两者产物结构一致，差别只在数据来源。

## 已内置的依赖

| 包 | 作用 |
|---|---|
| `@arco-design/web-vue` | 组件库（组件 API） |
| `@arco-themes/vue-pangea-3-linear` | **Pangea 主题包**（品牌青绿主色等全部视觉 token） |
| `@arco-iconbox/vue-pangea-mobile` | **Pangea 图标包**（命名导入的图标组件） |
| `@arco-plugins/vite-vue` | 注入主题包 + 图标包 + 组件样式按需加载 |
| `less`（devDep） | arco 组件/主题为 less，Vite 处理 `.less` 必需 |

主题包与图标包已在 `vite.config.ts` 通过 `vitePluginForArco({ theme, iconBox })` 接入；`main.ts` 显式 `import '@arco-themes/vue-pangea-3-linear/theme.css'` 以保证运行时 CSS 变量。开箱即用。

## 起步

一键起项目（degit）：

```bash
npx degit ysredcity/pangea-design-skill/skills/pangea-design-vue/templates/project-starter my-pangea-app
cd my-pangea-app
npm install
npm run dev        # 本地预览；npm run build 产出生产包
```

或直接复制本目录后 `npm install && npm run dev`。

> 已实测：`npm install` → `vue-tsc` 类型检查 → `vite build` 通过，产物含 Pangea 青绿主题变量。

## 生成层级约定（重要）

```
src/
├── App.vue                 # 仅挂载 <router-view/>
├── main.ts                 # createApp + ArcoVue + router
├── router/index.ts         # 路由：全局 Layout + 子路由页面
├── layouts/
│   └── GlobalLayout.vue     # ⚠️ 占位版全局 Layout（后续由团队标准化替换，勿重写）
└── pages/
    └── Example/index.vue    # 具体页面 = 全局 Layout 下的一个子路由
```

- **全局 Layout 是稳定骨架**，具体页面渲染在其 `<router-view/>` 中。
- **新增一个页面 = 两步**：
  1. 在 `src/pages/<PageName>/index.vue` 新建页面组件；
  2. 在 `src/router/index.ts` 的 `children` 中追加子路由。
- 不要重写/替换 `GlobalLayout.vue`（除非明确被要求）。

## 使用 Pangea 图标

图标从图标包按需导入（tree-shakable），用 `font-size` 控制大小、`color` 控制颜色（默认继承 `currentColor`）：

```vue
<script setup lang="ts">
import { IconGlobal } from '@arco-iconbox/vue-pangea-mobile';
</script>

<template>
  <IconGlobal style="font-size: 20px; color: rgb(var(--primary-6))" />
</template>
```

## 主题取值

颜色/间距/圆角等一律用 Pangea token（CSS 变量或 Less token），不要硬编码。取值见 skill 的
`references/theme/design-tokens.md`。品牌主色为青绿 `rgb(var(--primary-6))`（`#00aaa6`）。
