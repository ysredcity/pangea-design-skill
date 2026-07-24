---
name: pangea-vue-project-structure
description: "Pangea 工程结构与生成层级约定。用于项目脚手架初始化、Vite/Vue Router 结构、主题包 @arco-themes/vue-pangea-3-linear 接入、图标分工（功能性图标用 Arco 默认、业务图标从 @arco-iconbox/vue-pangea-mobile 命名导入）、全局 Layout 下的路由页面生成层级，以及 PM demo 与开发交付两类产物的差异。"
user-invocable: false
---

# 工程结构与生成层级

本 skill 的产出物是一个 **Vue 工程**。本文件约定工程的技术栈、依赖引用、目录结构，以及最关键的**页面生成层级**。可运行的样例工程见 `templates/project-starter/`（脚手架，已实测 `npm install && npm run build && npm run dev` 通过、Pangea 青绿主题变量生效）。起步方式见下方「快速开始」。

## 核心目的与双受众

同一套工程约定同时服务两类使用者，产物结构一致，**差别只在数据来源**：

| 受众 | 场景 | 数据 |
|---|---|---|
| **产品经理（PM）** | 快速产出**高保真 demo 原型**，用于评审、对齐、演示 | mock 数据 |
| **开发工程师** | 基于 **PRD 直接产出符合设计规范的 UI 界面** | 真实接口 |

因此生成页面时：结构、组件、主题 token 完全一致；PM demo 用内联 mock 数据，开发交付把 mock 换成接口请求即可，**页面骨架与路由层级不变**。

> **纯前端铁律**：产出**始终是一个完整的 Vue 纯前端工程**，范围仅限前端（页面 / 路由 / 组件 / 前端状态 / mock 或调用既有接口）。**不产出、不涉及任何后端代码或服务**。需要数据时：demo 用前端 mock，开发对接既有后端接口（前端 `fetch`/`axios` 调用），但不实现后端。

## 技术栈

Vue 3 + Vite + TypeScript + Vue Router + `@arco-design/web-vue` + Pangea 主题包/图标包。

## 快速开始（从零到可运行）

产出的**页面组件不能独立运行**——它依赖一个完整工程（`main.ts`/`vite.config.ts`/`router`/全局 Layout/已装依赖）。请始终基于脚手架 `templates/project-starter/` 起步，不要只交付孤立的 `.vue` 文件。

**方式一：degit 一键起项目（推荐）**

```bash
npx degit ysredcity/pangea-design-skill/skills/pangea-design-vue/templates/project-starter my-pangea-app
cd my-pangea-app
npm install
npm run dev        # 本地预览；npm run build 产出生产包
```

**方式二：直接复制** `templates/project-starter/` 目录，再 `npm install && npm run dev`。

起项目后，**新增页面 = 两步**（见下方「生成层级约定」）：新建 `src/pages/<PageName>/index.vue` + 在路由 `children` 追加子路由。PM demo 用 mock 数据；开发交付把 mock 换成接口请求，结构与路由不变。

> 脚手架已实测：`npm install`（含 `less`）→ `vue-tsc` 类型检查 → `vite build` 均通过，产物 CSS 含 Pangea 青绿主题变量（`--primary-6: 0, 170, 166`）。

## 依赖与引用约定

`package.json` 关键依赖（样例见 `templates/project-starter/package.json`）：

```jsonc
{
  "dependencies": {
    "@arco-design/web-vue": "^2.57.0",
    "@arco-themes/vue-pangea-3-linear": "^1.0.11",  // Pangea 主题包
    "@arco-iconbox/vue-pangea-mobile": "^1.0.24",   // Pangea 图标包
    "vue": "^3.4.0",
    "vue-router": "^4.3.0"
  },
  "devDependencies": {
    "@arco-plugins/vite-vue": "^1.4.5",
    "@vitejs/plugin-vue": "^5.0.0",
    "less": "^4.2.0",                                // 必需：arco 组件/主题为 less，Vite 需 less 预处理器
    "vite": "^5.2.0",
    "typescript": "^5.4.0",
    "vue-tsc": "^2.0.0"
  }
}
```

> ⚠️ `less` 是**必需**的 devDependency：`@arco-plugins/vite-vue`（默认 `style: true`）会加载 `.less`，缺 `less` 时 `vite build` 会报 `Preprocessor dependency "less" not found`。

### 主题包 + 图标包接入（推荐：Vite 插件）

在 `vite.config.ts` 用 `@arco-plugins/vite-vue` 一次性接入主题包与图标包：

```ts
import { vitePluginForArco } from '@arco-plugins/vite-vue';

export default defineConfig({
  plugins: [
    vue(),
    vitePluginForArco({
      theme: '@arco-themes/vue-pangea-3-linear',   // 注入品牌主题（全部 token 生效）
      // ⚠️ 不启用 iconBox：它会全局替换 Arco 所有内建图标（含 Modal/Select/DatePicker
      //    等组件的关闭、下拉箭头、日历等【功能性图标】），替换后图标类名与 Arco 内部样式
      //    （如 icon-hover 圆形背景定位）不匹配而显示异常。功能性图标用 Arco 默认即可。
    }),
  ],
});
```

插件负责组件样式按需加载与主题 less 处理，因此**无需**手动 `import '@arco-design/web-vue/dist/arco.css'`。

但页面里大量使用**运行时 CSS 变量**（`var(--color-text-1)`、`rgb(var(--primary-6))`），这些变量定义在主题包的 `theme.css`（`body{...}` 块）里，仅靠插件注入并不可靠（arco 有相关 issue）。因此**在 `main.ts` 显式引入主题 CSS**，确保变量一定可用：

```ts
// main.ts
import ArcoVue from '@arco-design/web-vue';
import '@arco-themes/vue-pangea-3-linear/theme.css'; // 运行时 CSS 变量，必须显式引入
```

主题接入的其它方式（手动引入 Less、`modifyVars`、暗黑模式）见 [theming.md](theming.md)。

### 图标使用（分工铁律）

**两类图标各司其职，不要用图标包全局替换 Arco 内建图标：**

- **功能性 / 组件内建图标**（Modal 关闭、Select 下拉箭头、DatePicker 日历、Table 排序箭头、Message/Tag 关闭等）：**用 Arco 组件自带的默认图标，不替换**。它们是组件的一部分，替换会破坏组件内部样式（如 icon-hover 圆形背景定位）导致显示异常。
- **业务 / 内容图标**（页面里由你放置的返回、Logo、功能入口、状态图标等）：从 Pangea 图标包 `@arco-iconbox/vue-pangea-mobile` **命名导入**（tree-shakable），用 `font-size` 控制大小、`color` 控制颜色（默认继承 `currentColor`）：

```vue
<script setup lang="ts">
import { IconGlobal } from '@arco-iconbox/vue-pangea-mobile';
</script>

<template>
  <IconGlobal style="font-size: 20px; color: rgb(var(--primary-6))" />
</template>
```

> 命名导入不依赖 `vitePluginForArco` 的 `iconBox` 选项，因此**脚手架已去掉 iconBox 全局替换**，业务图标照常命名导入即可。图标名不确定时向用户确认，不要臆造图标；优先复用 Pangea 图标包中的图标。

## 目录结构

```
project/
├── .kiro/
│   └── hooks/
│       ├── pm-dev-server.json      # SessionStart: 自动启动开发环境
│       └── pm-compile-check.json   # PostFileSave: 自动编译检查与修复
├── index.html
├── package.json
├── vite.config.ts            # 接入主题包 + 图标包
├── tsconfig.json
└── src/
    ├── main.ts               # createApp + ArcoVue + router + import 主题 theme.css + layout-menu.less
    ├── App.vue               # 仅挂载 <router-view/>
    ├── vite-env.d.ts         # *.vue 类型 shim + vite/client + 图标包模块声明（TS 必需）
    ├── router/
    │   └── index.ts          # 路由：全局 Layout + 子路由页面
    ├── layouts/
    │   ├── GlobalLayout.vue   # 全局 Layout（标准版：header + sidebar + content）
    │   └── layout-menu.less   # 侧边栏菜单自定义样式（覆盖 Arco Menu 默认）
    └── pages/
        └── <PageName>/
            └── index.vue      # 具体页面（全局 Layout 下的子路由）
```

## 生成层级约定（重要）

**全局 Layout 是稳定骨架，具体页面是它内部的路由子页面。**

- 应用外壳 = `App.vue`（挂载路由出口）+ `layouts/GlobalLayout.vue`（页头/侧边栏/导航等骨架）。
- **全局 Layout 已标准化实现**（基于 Figma「Pangea Design PC Templates / 菜单-展开」）。结构：顶部 Header（48px）+ 左侧可折叠侧边栏（200px）+ 右侧内容区（白背景 + 左上圆角 8px）。**不要重写/替换全局 Layout**（除非明确被要求）。
- 侧边栏使用 Arco `<a-menu>` 组件 + 自定义样式覆盖（`src/layouts/layout-menu.less`），选中态为白背景 + `primary-7` 文字 + medium 字重。菜单数据通过 `GlobalLayout.vue` 的 `menuItems` ref 配置。
- **具体页面**放在 `src/pages/<PageName>/index.vue`，作为全局 Layout 路由的**子路由**，渲染在其 `<router-view/>` 中。

### 新增一个页面 = 三步

1. 新建页面组件 `src/pages/<PageName>/index.vue`；
2. 在 `src/router/index.ts` 中，把它追加为全局 Layout 路由的 `children` 子路由；
3. 在 `GlobalLayout.vue` 的 `menuItems` 中追加对应菜单项（`key` 为路由 path）。

```ts
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/GlobalLayout.vue'),
    children: [
      { path: '', name: 'example', component: () => import('@/pages/Example/index.vue') },
      // 👇 新页面追加在此
      { path: 'orders', name: 'orders', component: () => import('@/pages/Orders/index.vue') },
    ],
  },
];
```

页面组件本身只负责「内容区」的业务 UI，不重复实现页头/导航等 Layout 职责。

## 接入既有工程（最小清单）

开发工程师若不使用脚手架、要把 Pangea 接进已有 Vue 3 + Vite 工程，按此勾选：

- [ ] 装依赖：`@arco-design/web-vue`、`@arco-themes/vue-pangea-3-linear`、`@arco-iconbox/vue-pangea-mobile`；devDep：`@arco-plugins/vite-vue`、**`less`**。
- [ ] `vite.config.ts` 加 `vitePluginForArco({ theme: '@arco-themes/vue-pangea-3-linear', iconBox: '@arco-iconbox/vue-pangea-mobile' })`。
- [ ] `main.ts`：`app.use(ArcoVue)` + `import '@arco-themes/vue-pangea-3-linear/theme.css'`（运行时 CSS 变量）。
- [ ] TS 工程确保有 `*.vue` 类型 shim 与 `vite/client` 引用；图标包无类型，补 `declare module '@arco-iconbox/vue-pangea-mobile';`（参考脚手架 `src/vite-env.d.ts`）。
- [ ] 页面遵循生成层级：放 `src/pages/`，作为全局 Layout 路由子页面；颜色用 Pangea token、图标用图标包命名导入。

## 页面编写要点

- 组件用 Arco Vue（`a-*`），遵循 skill「关键约定」（Vue 3 `<script setup lang="ts">`、kebab-case、`v-model`、`dayjs`、禁用 React API）。
- 视觉全部走 Pangea 主题 token（语义 token / 品牌青绿主色），不硬编码颜色；取值见 [design-tokens.md](../theme/design-tokens.md)。
- 图标用 Pangea 图标包命名导入。
- **PM demo**：页面内用 mock 数据（`ref`/常量）；**开发交付**：把 mock 换成接口请求，页面结构与路由不变。

## PM Demo 模式（多轮迭代体验）

当使用者是产品经理时，agent 全权托管工程生命周期，PM 只需**对话 + 浏览器预览**。

### 脚手架内置 Kiro Hooks

`templates/project-starter/` 已内置以下 hooks（位于 `.kiro/hooks/`），用 `degit` 或复制脚手架后即生效：

| Hook | 触发时机 | 作用 |
|---|---|---|
| `pm-dev-server` | SessionStart | 会话开始时自动检查 `node_modules`、执行 `npm install`（如需）、启动 `npm run dev`、告知预览地址 |
| `pm-compile-check` | PostFileSave（`.vue/.ts/.tsx/.less/.css`） | 文件保存后检查 dev server 输出，如有编译错误自动修复，不打扰 PM |

### PM 的操作流程

```
PM 打开 Kiro → 自动启动 dev server → PM 说需求 → agent 生成/修改代码
→ 自动编译检查 → PM 刷新浏览器看效果 → 继续下一轮
```

PM 全程不需要：
- 执行任何终端命令
- 理解编译错误
- 手动启动/重启 dev server
- 知道 npm / Node.js 的具体用法

### 前提条件

PM 的机器上需要提前安装 **Node.js**（≥18）。这是唯一的环境要求，安装一次即可（下载地址：https://nodejs.org/）。安装后所有后续操作均由 agent + hooks 自动完成。

### 目录结构（含 hooks）

```
project/
├── .kiro/
│   └── hooks/
│       ├── pm-dev-server.json      # SessionStart: 自动启动开发环境
│       └── pm-compile-check.json   # PostFileSave: 自动编译检查与修复
├── index.html
├── package.json
├── vite.config.ts
└── src/
    ├── main.ts
    ├── App.vue
    ├── router/index.ts
    ├── layouts/GlobalLayout.vue
    └── pages/...
```
