---
name: pangea-vue-deployment
description: "Pangea Vue 工程的部署配置指南。覆盖默认（Hash + 相对 base）、嵌入式单文件（飞书 aily / 妙搭 / Coze / iframe）、History（需服务端 SPA fallback）三种模式；含环境识别信号表、构建命令、白屏排错速查与体积权衡。生成/交付工程时据此选择构建命令。"
user-invocable: false
---

# 部署配置指南

> **用户不需要在部署模式里做选择**——由 agent 按下方「环境识别信号表」自动判断并选用对应构建命令。默认那条覆盖绝大多数场景。

## 三种模式

| 模式 | 命令 | 路由 | base | 打包 | 适用 |
|---|---|---|---|---|---|
| **默认** | `npm run build` | Hash | `./` | 正常分包 | 绝大多数交付：本地预览、常规静态托管、部署在任意子路径 |
| **嵌入式单文件** | `npm run build:embed` | Hash | `./` | 全部内联进单个 HTML | **飞书 aily / 妙搭 Miaoda / Coze / 任何 iframe 嵌入**；或"给一个 HTML 双击就能打开" |
| **History**（可选） | `npm run build:history` | History | `/` | 正常分包 | 仅当需要干净 URL（无 `#`）**且服务端已配 SPA fallback** |

配置由 `.env` / `.env.embed` / `.env.history` 驱动（Vite `--mode`），`vite.config.ts` 用 `loadEnv` 读取，`src/router/index.ts` 读 `VITE_ROUTER_MODE`。

> ⚠️ 不要用 `VAR=x npm run build` 这类 shell 前缀传参：Windows cmd/PowerShell 不支持，且 `A=1 vue-tsc && vite build` 中变量**只作用于前半句**，`vite build` 拿不到 → 会静默构建出错误产物。统一用 `--mode`。

## 环境识别信号表（agent 用）

| 信号 | 判定 | 动作 |
|---|---|---|
| 宿主平台是**飞书 aily**（通用智能体；执行开发类任务时会**转交妙搭**执行） | 嵌入式 | `npm run build:embed`，交付单个 `dist/index.html` |
| 宿主/目标是**妙搭 Miaoda**、Coze，或其他 iframe 嵌入型智能体平台 | 嵌入式 | 同上 |
| 用户说"给我一个 HTML 就能打开"、"发个链接给别人看"、"传到平台上" | 嵌入式 | 同上 |
| 预览地址形如 `/page/<token>/` 等**子路径**，或产物运行在 **iframe** 内 | 嵌入式 | 同上 |
| 交付给开发团队接入自有工程 / 有 nginx 等可配服务端 | 默认（需干净 URL 时用 History） | `npm run build`（或 `build:history`） |
| 无任何信号 | 默认 | `npm run build` |

**判定为嵌入式时**：把需求文档「全局约定 → 部署目标」记为「嵌入式 iframe」，交付时说明产物是单个 HTML 文件。

## 为什么嵌入式模式能治白屏（三层根因逐一消除）

实测（妙搭）曾出现「类型检查、构建都通过，但部署后白屏」，根因有三层，`build:embed` 逐一消除：

| 层 | 根因 | 消除方式 |
|---|---|---|
| 1 · 路由模式 | History 模式要求服务端把未匹配路由回退到 `index.html`；纯静态托管做不到 → 直接访问 `/booking/mine` 返回 404 | **Hash 路由**：路由信息在 `#` 后，服务端只需返回同一个 HTML |
| 2 · 资源路径 | `base: '/'` 产出绝对路径 `/assets/x.js`；部署在 `/page/<token>/` 子路径下指向服务器根 → 资源 404。平台还可能注入动态 `<base>`，让相对路径解析更混乱 | **全部内联**：产物没有任何外部 JS/CSS 请求，`<base>` 注入也无影响 |
| 3 · 代码分割 | 路由懒加载会生成多个 chunk，主包用 `import('./chunk-x.js')` 动态加载；在「iframe + 动态 base + 子路径」组合下路径解析失败 → 组件加载不出来，应用挂不上 | **`inlineDynamicImports: true`** 把所有 chunk 合并进单 bundle；**页面组件仍可保持 `() => import(...)` 懒加载写法，不需要改成静态导入** |

## 体积权衡

- 嵌入式产物为**单个 HTML**，脚手架当前基线约 **1.2 MB（gzip ≈ 320 KB）**。
- **若安装了 `@visactor/vchart`（图表），单文件会显著增大（+2 MB 量级）**。嵌入式场景建议：图表页尽量不进嵌入式产物，或接受体积，或图表页走默认/History 模式单独部署。
- `assetsInlineLimit` 被设为极大值，字体/图片会以 base64 内联——这是"零外部请求"的代价。

## 交付前必做（对应质量门禁 G1）

1. 按目标模式构建：`npm run build` / `build:embed` / `build:history`（都会先跑 `vue-tsc --noEmit`）。
2. **实测产物能渲染**，不要只看"构建成功"：
   - 嵌入式：直接用浏览器打开 `dist/index.html`（`file://`）逐个路由点一遍；
   - 默认模式：用静态服务器**放到子路径**下访问（如 `python3 -m http.server` + `/page/xxx/`）；
   - History：需在配好 fallback 的服务器上验证，并**刷新子路由页面**确认不 404。
3. 嵌入式交付时明确告知用户："产物是单个 `dist/index.html`，可直接上传/双击打开"。

## 白屏排错速查

| 现象（浏览器控制台） | 根因 | 修法 |
|---|---|---|
| 资源 404（`/assets/*.js` 找不到） | base 与实际部署路径不匹配 | 改相对 base（默认模式已是 `./`）或用 `build:embed` |
| 路由地址本身 404 / 刷新后白屏 | History 模式缺服务端 fallback | 换默认（Hash）或 `build:embed` |
| 无 404 但页面空白、chunk 请求失败或被拦 | 动态 chunk 在 iframe / 动态 `<base>` 下路径解析失败 | `build:embed`（内联所有 chunk） |
| 无 404、无 chunk 报错，控制台有 Vue 运行时报错 | 代码问题（非部署），如模板内 TS 注解 | 见 [quality-gates.md](quality-gates.md) G1 / G9，先跑 `vue-tsc --noEmit` |
