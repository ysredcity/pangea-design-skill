# pangea-design-skill

**Pangea 设计体系的 Vue 3 skill** —— 给 AI agent 消费的知识库，让 agent 产出「组件用法正确 + 视觉符合 Pangea 主题」的前端代码。

Pangea = 开源组件库 [`@arco-design/web-vue`](https://arco.design/) + 公司定制主题包 [`@arco-themes/vue-pangea-3-linear`](https://www.npmjs.com/package/@arco-themes/vue-pangea-3-linear) + 图标包 [`@arco-iconbox/vue-pangea-mobile`](https://www.npmjs.com/package/@arco-iconbox/vue-pangea-mobile)。

## 核心目的与受众

产出物是一个 **Vue 工程**，同时服务两类使用者（产物结构一致，**差别只在数据来源**）：

- **产品经理（PM）**：快速产出高保真 demo 原型（mock 数据），用于评审、对齐、演示。
- **开发工程师**：基于 PRD 直接产出符合设计规范的 UI 界面（真实接口）。

## 特点

- **组件 API 与开源 Arco 一致**：组件文档逐字沿用官方，Pangea 只换主题、不改 API。
- **视觉 token 以主题包运行时为唯一事实源**：品牌主色为青绿 `#00aaa6`，含完整基础色板（15 色系 × 10 阶）、语义色、字体、间距、圆角、阴影、组件级 token 与暗黑模式。
- **开箱即用的工程脚手架**：已内置并接入主题包 + 图标包。
- **明确的生成层级**：具体页面是全局 Layout 下的路由子页面。

## 目录结构

```
pangea-design-skill/
├── README.md                     # 本文件
├── CONTRIBUTING.md               # 贡献与维护规则、事实源约定
├── CHANGELOG.md                  # 变更记录
└── skills/
    └── pangea-design-vue/
        ├── SKILL.md              # skill 入口：约定 + 主题铁律 + 完整索引
        ├── references/
        │   ├── theme/design-tokens.md      # Pangea 全部设计 token（核心）
        │   ├── overview/                    # 工程结构 / 主题接入 / 安装 / 架构 / 配置 / i18n
        │   ├── components/  (72 篇)         # 组件 API（照搬上游）
        │   └── patterns/    (5 篇)          # 组合模式（照搬上游）
        └── templates/
            └── project-starter/            # 可运行脚手架（已接入主题包/图标包）
```

## 快速开始

### 作为 skill 使用
把 `skills/pangea-design-vue/SKILL.md` 作为入口交给支持 skill 的 agent；agent 按需加载 `references/` 下的文档。不支持 skill 的工具，可把 `SKILL.md` + `references/theme/design-tokens.md` 喂进上下文。

### 运行脚手架样例
```bash
cd skills/pangea-design-vue/templates/project-starter
npm install
npm run dev
```

## 技术基线

| 项 | 版本 |
|---|---|
| `@arco-design/web-vue` | `^2.57.0` |
| `@arco-themes/vue-pangea-3-linear`（主题包） | `v1.0.11` |
| `@arco-iconbox/vue-pangea-mobile`（图标包） | `v1.0.24` |

## 相关文档

- 贡献与维护规则：[CONTRIBUTING.md](./CONTRIBUTING.md)
- 变更记录：[CHANGELOG.md](./CHANGELOG.md)
- 设计 token：[skills/pangea-design-vue/references/theme/design-tokens.md](./skills/pangea-design-vue/references/theme/design-tokens.md)
- 工程结构与生成层级：[skills/pangea-design-vue/references/overview/project-structure.md](./skills/pangea-design-vue/references/overview/project-structure.md)

## 后续规划

- 提供标准化全局 Layout 替换脚手架中的占位版。
- 补充定制业务组件与页面模板文档。
