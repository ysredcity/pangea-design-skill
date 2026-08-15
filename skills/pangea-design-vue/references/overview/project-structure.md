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

**方式一：复制 skill 自带的模板目录（推荐，不依赖外网）**

skill 包里已经带了 `templates/project-starter/`，直接复制即可：

```bash
cp -R <skill 目录>/skills/pangea-design-vue/templates/project-starter my-pangea-app
cd my-pangea-app
npm install
npm run dev          # 本地预览
# 交付构建（按部署目标选一条，详见 deployment.md）：
# npm run build        默认：Hash + 相对 base，适配任意静态托管/子路径
# npm run build:embed  嵌入式单文件：飞书 aily / 妙搭 / Coze / iframe
# npm run build:history History：需服务端 SPA fallback
```

**方式二（备选，仅当拿不到本地模板时）：degit 从 GitHub 拉**

```bash
npx degit ysredcity/pangea-design-skill/skills/pangea-design-vue/templates/project-starter my-pangea-app
```

> ⚠️ `degit` 需要访问 GitHub，**在无外网出口的沙箱 / 内网环境会失败**——而这种环境下本地模板其实就在 skill 包里，所以**不要把 degit 当默认路径**。

### 关于 `npm install`（不需要私有 registry）

三个核心包都在**公共 npm registry** 上，**无需配置任何私有源 / `.npmrc`**：

| 包 | 说明 |
|---|---|
| `@arco-design/web-vue` | 组件库（开源） |
| `@arco-themes/vue-pangea-3-linear` | Pangea 主题包（已发布到公共 npm） |
| `@arco-iconbox/vue-pangea-mobile` | Pangea 图标包（已发布到公共 npm） |

`npm install` 失败时先排查**网络 / 代理 / Node 版本**（Vue 3 + Vite 5 需 Node ≥ 18），**不要去改 registry**——改了反而更容易装不上。

起项目后，**新增页面 = 两步**（见下方「生成层级约定」）：新建 `src/pages/<PageName>/index.vue` + 在路由 `children` 追加子路由。PM demo 用 mock 数据；开发交付把 mock 换成接口请求，结构与路由不变。

> 脚手架已实测：`npm install`（含 `less`）→ `vue-tsc` 类型检查 → `vite build` 均通过，产物 CSS 含 Pangea 青绿主题变量（`--primary-6: 0, 170, 166`）。
>
> 三种部署构建也已实测：**默认**（Hash + 相对 base）放到静态服务器**子路径** `/page/<token>/` 下 5 个路由正常渲染；**`build:embed`** 产出单个 `dist/index.html`（约 1.2MB，无任何外部 JS/CSS 引用），直接 `file://` 打开 5 个路由全部正常；**`build:history`** 产出绝对路径资源（需服务端 fallback）。详见 [deployment.md](deployment.md)。

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

> **可选：图表库 `@visactor/vchart`（按需引入，不在基础依赖里）。** 保持 base 轻量，需要图表时才装：`npm i @visactor/vchart`。脚手架已提供 `src/components/LazyChart.vue`（动态 import vchart，装了渲染、没装占位），并在 `vite.config.ts` 把它按可选依赖处理（未装时 build 走 `external` + `optimizeDeps.exclude`，dev 走 `apply: 'serve'` 的解析兜底插件把它指到抛错的虚拟模块）。**两侧都要处理**：只做 `optimizeDeps.exclude` 的话 dev 的 import 分析仍会去解析裸包名并对整个模块返回 500，导致引用图表的页面整页打不开。用法 `<LazyChart :spec="spec" height="240px" />`。详见 SKILL.md「图表（VChart）」。

> **质量门禁命令**：生成/定稿页面后运行 `npm run gate`（= `check-tokens` 裸值机检 + `vue-tsc --noEmit` + `vite build`），并对照 [quality-gates.md](quality-gates.md) 的 G0–G9 自检（**G0：动手前需求文档须已经用户确认**）；`npm run check:tokens` 可单跑裸 hex / 写死圆角 / **对话框宽度档位**机检。

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
│       └── pm-compile-check.json   # PostFileSave: 保存后校验编译/类型错误并修复
├── index.html
├── package.json
├── vite.config.ts            # 接入主题包 + 图标包
├── tsconfig.json
└── src/
    ├── main.ts               # createApp + ArcoVue + router + import 主题 theme.css + layout-menu.less + arco-overrides.less
    ├── App.vue               # 仅挂载 <router-view/>
    ├── vite-env.d.ts         # *.vue 类型 shim + vite/client + 图标包模块声明（TS 必需）
    ├── router/
    │   └── index.ts          # 路由：全局 Layout + 子路由页面
    ├── config/
    │   └── app.ts            # APP_NAME：系统名称单一来源（Header 品牌名 + 浏览器 title）
    │
    │   （工程根目录还有部署配置：.env 默认 / .env.embed 嵌入式单文件 / .env.history）
    ├── layouts/
    │   ├── GlobalLayout.vue   # 全局 Layout（标准版：header + sidebar + content）
    │   └── layout-menu.less   # 侧边栏菜单自定义样式（覆盖 Arco Menu 默认）
    ├── styles/
    │   └── arco-overrides.less # 跨页面的**设计约束级**全局覆盖（当前：确认类对话框 400px 宽）
    └── pages/
        └── <PageName>/
            └── index.vue      # 具体页面（全局 Layout 下的子路由）
```

## 生成层级约定（重要）

**全局 Layout 是稳定骨架，具体页面是它内部的路由子页面。**

- 应用外壳 = `App.vue`（挂载路由出口）+ `layouts/GlobalLayout.vue`（页头/侧边栏/导航等骨架）。
- **全局 Layout 已标准化实现**（基于 Figma「Pangea Design PC Templates / 菜单-展开」）。结构：顶部 Header（48px）+ 左侧可折叠侧边栏（200px）+ 右侧内容区（左上圆角 8px）。**不要重写/替换全局 Layout**（除非明确被要求）。
- **混合菜单结构**：顶部 Header 中间是**横向模块菜单**（一个模块 = 一块业务域），左侧侧边栏是**当前模块下的多级菜单**，切换顶部模块 → 左侧菜单随之切换。数据模型 = `GlobalLayout.vue` 的 `modules` ref：`{ key, title, menu: MenuItem[] }[]`，每个模块有独立菜单。
- **单模块 vs 多模块（按场景判断）**：系统层级简单时把 `modules` 配成**只 1 个** → **自动隐藏顶部模块菜单**，左侧直接展示该模块菜单，且 **Sidebar 左上角模块名整块隐藏**（单模块下它与 Header 的系统名重复）；层级复杂需按业务域分区时配**多个** `modules` → 顶部显示模块菜单、Sidebar 头显示「当前模块」名。当前模块由当前路由所属菜单自动推导。
- **路由与部署模式**：默认 **Hash 路由 + 相对 base `./`**（产物可丢到任意静态托管的任意子路径，**不需要服务端 SPA fallback**）。另有 `npm run build:embed`（嵌入式单文件，用于飞书 aily / 妙搭 / Coze / iframe）与 `npm run build:history`（干净 URL，**需服务端 fallback**）。配置由根目录 `.env` / `.env.embed` / `.env.history` 驱动（Vite `--mode`），路由读 `VITE_ROUTER_MODE`；**页面组件保持 `() => import(...)` 懒加载即可**，嵌入式构建会用 `inlineDynamicImports` 合并 chunk。详见 [deployment.md](deployment.md)。
- **系统名称单一来源 `src/config/app.ts` 的 `APP_NAME`**：Header 品牌名与**浏览器标签页 title** 都取它（`main.ts` 里 `document.title = APP_NAME`，并用 `router.afterEach` 随路由 `meta.title` 显示「页面名 · 系统名」）。**生成工程时替换 `APP_NAME`（以及 `index.html` 的首屏占位 `<title>`）为实际产品名**，不要在别处硬编码系统名。
- **页面背景由页面自己设置**：内容区默认**透明**，漏出 body 层灰底（`--color-fill-2`）。常规内容页（列表/表单/详情）在页面根设白底 `background: var(--color-bg-1)`（内容区左上圆角会自动把白底裁成圆角，复现「白面板浮在灰底」）；仪表板/工作台类聚合页保持透明、用白底无边框卡片区隔区块。详见 SKILL.md「页面背景（全局准则）」。
- 侧边栏与顶部模块菜单都用 Arco `<a-menu>` + 自定义样式覆盖（`src/layouts/layout-menu.less`）：侧边选中态为白背景 + `primary-7` + medium；顶部模块选中态为 `primary-6` 文字。
- **`src/styles/arco-overrides.less`**：只放**跨页面的设计约束级**全局覆盖（非 scoped）。当前只有一条——`.arco-modal-simple { box-sizing: border-box }`，让确认类对话框的真实宽度等于规范的 **400px**（`.arco-modal` 是 content-box，simple 模式的根节点 `padding: 24px 32px 32px` 会把 Arco 自带的 `width: 400px` 撑成 464px）。**复制脚手架时勿丢该文件与 `main.ts` 里的引入。** 页面局部样式仍写在各组件 `<style scoped>` 里。
- **具体页面**放在 `src/pages/<PageName>/index.vue`，作为全局 Layout 路由的**子路由**，渲染在其 `<router-view/>` 中。

### 新增一个页面 = 三步

1. 新建页面组件 `src/pages/<PageName>/index.vue`；
2. 在 `src/router/index.ts` 中，把它追加为全局 Layout 路由的 `children` 子路由；
3. 在 `GlobalLayout.vue` 的 `modules` 中，把它加进**所属模块**的 `menu`（`key` 为路由 path）；多模块时选对模块，单模块时加到唯一模块即可。

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

`templates/project-starter/` 已内置以下 hooks（位于 `.kiro/hooks/`），复制脚手架（或 `degit`）后即生效：

| Hook | 触发时机 | 作用 |
|---|---|---|
| `pm-compile-check` | PostFileSave（`.vue/.ts/.tsx/.less/.css`） | 文件保存后检查 dev server 输出，如有编译错误自动修复，不打扰 PM |

### PM 的操作流程

```
PM 说需求 → agent 出需求文档并请 PM 确认（硬停止）
→ PM 确认 → agent 建工程 / 装依赖 / 生成页面 / 起 dev server → 给出预览地址
→ 之后每轮：PM 说改动 → agent 改 + 自动编译检查 → PM 刷新浏览器看效果
```

PM 全程不需要：
- 执行任何终端命令
- 理解编译错误
- 手动启动/重启 dev server（agent 在需要预览时代为执行）
- 知道 npm / Node.js 的具体用法

### 前提条件

PM 的机器上需要提前安装 **Node.js**（≥18）。这是唯一的环境要求，安装一次即可（下载地址：https://nodejs.org/）。安装后所有后续操作都由 agent 代为执行——PM 不需要碰终端。

> ⛔ **注意：不提供「会话开始即自动装依赖/起服务」的 hook。** 原先的 `pm-dev-server`（`SessionStart`）已移除：它绕过「用户确认后再执行」基线（平台安全扫描判定为**指令覆盖 P0**、拒绝分发），也与 SKILL.md 的两阶段门冲突（阶段一禁止 `npm install` / 起 dev server）。装依赖与起 dev server 改为**在 PM 要求预览时于当轮执行**。

### 目录结构（含 hooks）

```
project/
├── .kiro/
│   └── hooks/
│       └── pm-compile-check.json   # PostFileSave: 保存后校验编译/类型错误并修复
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
