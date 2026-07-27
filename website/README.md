# Pangea Design 官网（showcase）

Pangea Design 设计系统的介绍与预览站点。它本身用 skill 的同一套技术栈（Vue 3 + Arco + Pangea 主题 + GlobalLayout）构建，即 skill 效果的样例（dogfood）。

## 定位与边界

- **Skill 是唯一事实源**（`../skills/pangea-design-vue/`）。本站只是它的 showcase。
- 本工程**独立**：有自己的依赖与构建，可单独部署；**运行时不 import `skills/**` 内部路径**。
- 数据**单向**从 skill 同步：`npm run sync` 把 skill 的 `catalog.json` 等快照进 `src/generated/`（已提交进 git）。skill 变更后重跑同步。

## 开发

```bash
npm install
npm run sync    # 从 skill 同步 catalog.json 等到 src/generated/
npm run dev     # 本地预览（hash 路由）
npm run gate    # 质量门禁：token 机检 + 类型检查 + 构建
npm run build   # 构建产物到 dist/（base: './'，可部署任意静态托管）
```

## 结构

```
website/
├── src/
│   ├── layouts/GlobalLayout.vue   # 复用 skill 的全局 Layout（全站骨架）
│   ├── pages/                     # 介绍 Home / 使用指南 Guide / 占位 ComingSoon
│   └── generated/                 # 从 skill 同步的快照（勿手改，提交 git）
└── scripts/sync-from-skill.mjs    # 单向同步 skill → website
```

设计基础 / 组件预览 / 页面模板 / 更新日志栏目为后续阶段补充。
