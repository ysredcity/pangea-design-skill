# 实施方案：通用版 skill `pangea-design-universal`（技术栈无关）

> 状态：**第 1–4 期已完成**（2026-10-10；第 4 期暂不含品牌补充图标），第 5 期待开始。skill 名与目录为 `pangea-design-universal`。图标方案（第五节）按推荐执行，实施到第 4 期时再细化。
> 本文件是计划文档，不属于 `skills/` 或 `website/`，改动它不影响交付物。逐日进展记 `PROJECT_CONTEXT.md`。

## 一、目标与边界

面向通用场景的 UI 与交互约束：**不要求 Vue / Arco，不要求套用全局布局框架和页面模板**，但产出要在视觉一致性、品牌辨识度和交互体验上与 Pangea 保持一致。

| | `pangea-design-vue`（现有） | `pangea-design`（新） |
|---|---|---|
| 技术栈 | Vue 3 + Arco + 主题包 | 不限（React / 原生 HTML / Vue + 其它库…） |
| 布局 / 页面模板 | 强制 GlobalLayout，命中模板须照抄 | 结构原型仅作推荐，可自由组合 |
| 交付物 | 可运行脚手架工程 | 符合规范的界面代码 / 原型 |
| 需求闸门 | 两阶段强制门 | **仅多页需求**先出简要结构说明；单页 / 单组件直接做 |
| 管什么 | 长什么样 + 怎么拼 + 用什么组件 | 长什么样 + 用起来什么感觉 |

## 二、已确认的决策（2026-10-10）

1. **与 hisense-design-md 的 `pangea-design` 合并**：新 skill 命名为 `pangea-design-universal`（目录同名），承接其定位；所有颜色、文字、间距、圆角等**值与档位以本仓主题包为准**（`@arco-themes/vue-pangea-3-linear` 运行时 / Less 变量，即 `pangea-design-vue` 的事实源）。hisense-design-md 中与主题包不一致的值（如主色 `#009689`）一律作废，不迁移。该仓库本身不由本方案修改，迁移完成后由用户决定是否下线。
2. **新 skill 放本仓 `skills/pangea-design-universal/`**，与 Vue 版共享规则。
3. **需求闸门降级**：多页需求先出简要结构说明（页面清单 + 每页信息层级 + 关键交互），确认后再做；单页 / 单组件不设闸门。
4. 图标：见第五节（推荐 Lucide + 品牌补充包，待确认）。

## 三、单一事实源与同步

```
主题包 @arco-themes/vue-pangea-3-linear（唯一取值来源）
   │  scripts/build-tokens.mjs（新增，仓库工具）
   ▼
skills/pangea-design-universal/references/tokens.json + tokens.css   ← 生成物，勿手改
   
共享设计规则（唯一正文）
   ▼  scripts/sync-shared.mjs --write / --check（新增，含 SHA-256 manifest）
pangea-design-vue  ←→  pangea-design   各自随包带一致副本，可独立上传
```

- **取值来源**：颜色、圆角是运行时 CSS 变量（`theme.css`）；字号、字重、行高、间距、阴影、尺寸、动效是 Less 变量（`tokens.less`）。生成器两处都要读，输出与主题包一一对应的 token 名与值，记录主题包版本。
- **规则共享**：现 `references/design.md` 拆成两部分——技术栈无关的共享正文（颜色语义、密度档、按钮组、状态双通道、容器决策、对话框宽度、背景分层、响应式）与 Vue 专属附录（Arco 属性写法、组件名）。共享正文改成通用术语（如「紧凑档：控件高 28px」而不是 `size="small"`；「分段控件」而不是 `a-radio-group type="button"`），Vue 版附录给出对照。
- **防漂移**：`scripts/sync-shared.mjs --check` 逐字比对副本与源（副本只多一行「生成物」注释），`scripts/build-tokens.mjs --check` 比对 token 产物与主题包；改共享规则或升级主题包后两边都要跑。逐字比对已足够，暂不另做 hash manifest。

## 四、约束分三档

| 档位 | 内容 | 检查方式 |
|---|---|---|
| **硬约束** | 只用语义色 token；字号 / 间距 / 圆角 / 阴影 / 动效时长只用档位；状态不只靠颜色；正文对比度 ≥ 4.5:1；一组最多一个主按钮；危险操作用 danger；对话框宽度档位；焦点可见 | 脚本报 ERROR，不允许交付 |
| **推荐约束** | 控件密度分档、按钮组排序、表单容器决策路径、页面结构原型（列表 / 表单 / 详情的信息层级）、空 / 加载 / 错误态 | 交付前自检清单，偏离须说明理由 |
| **自由** | 技术栈、组件库、布局组合、导航形态、是否使用页面模板 | 不检查 |

## 五、图标方案（待确认）

### 现状

- Pangea 图标包 `@arco-iconbox/vue-pangea-mobile` v1.0.24：**518 个**，48×48 网格，描边已转为填充路径（`fill-rule="evenodd"`），只有 Vue 包。
- 含 Lucide **没有**的专属图标：品牌（`IconHisense`、`IconGeneral`）、AI 系列（`IconAiAssistant`、`IconSearchAi`、`IconSummaryAi` 等约 16 个）、部分业务图标（如 `IconWechatpay`）。
- Lucide：约 1,500 个，24×24 网格、2px 描边、圆角端点，ISC 许可（可商用），React / Vue / Svelte / Angular / 原生 SVG / 图标字体都有官方包。

### 只用 Lucide 是否可行

**功能性图标层面可行，品牌层面有缺口：**

| 方面 | 判断 |
|---|---|
| 覆盖面 | ✅ 功能性图标（搜索、编辑、删除、方向、状态等）覆盖足够，比 Pangea 包多 |
| 技术栈 | ✅ 正好解决通用版的核心诉求，任何栈都能直接用 |
| 风格一致 | ⚠️ 与 Pangea 图标的线宽、端点、网格不同。**同一产品内**只用 Lucide 是一致的；但与 Vue 版产出的产品放在一起会有「同族不同脸」的差异 |
| 品牌 / AI 图标 | ❌ 没有海信 Logo、General 应用图标、AI 系列。这些恰恰是品牌辨识度最强的部分 |

### 推荐：Lucide 为主 + 小型品牌补充包

1. **功能性图标统一用 Lucide**，写死一个 `stroke-width` token（实施时对照 Pangea 图标实测线宽后定，避免 Lucide 默认 2px 显得偏粗），尺寸只用 16 / 20 / 24 档。
2. **品牌补充包**：从 Figma 导出 SVG，只收 Lucide 没有的——品牌 Logo、AI 系列、少量业务专属图标（预计 30 个以内），放 `references/icons/`，附使用说明。
3. **对照表**：Pangea 常用图标 → Lucide 名称（前 100 个左右），让 Vue 版与通用版表达同一语义时用同一个隐喻。
4. **规则**：同一产品的功能性图标只用一个图标库，不混用；品牌 / AI 图标始终用补充包。

> 如果后续更看重跨产品的图标一致性，可再把 518 个全部导出为 SVG sprite 取代 Lucide；这一步可以独立进行，不影响其它部分。

## 六、目录结构

```
skills/pangea-design-universal/
├── SKILL.md                    # 定位 + 三档约束 + 多页闸门 + 消费顺序
├── core-manifest.json          # 共享副本哈希
├── references/
│   ├── tokens.json / tokens.css      # 生成物（来自主题包）
│   ├── adapters/                     # Tailwind / shadcn / Element / Ant 等变量映射
│   ├── design.md                     # 共享设计规则（与 Vue 版同源）
│   ├── brand.md                      # 主色用量、签名元素、文案语气
│   ├── interaction.md                # 反馈时效、四态、危险操作、表单校验、焦点键盘、动效
│   ├── components/*.md               # 约 10 个高频组件规格（解剖 / 尺寸 / 状态矩阵 / 行为）
│   ├── patterns/*.md                 # 页面结构原型（只讲信息层级，不给代码）
│   └── icons/                        # 品牌补充 SVG + Lucide 对照表
├── assets/pangea-ui.css              # 可选参考样式（原生 HTML / 原型用，不强制）
└── scripts/lint-tokens.mjs / check-contrast.mjs
```

## 七、分期

| 期 | 内容 | 完成标准 |
|---|---|---|
| 1 | `build-tokens.mjs` 从主题包生成 tokens.json / tokens.css；拆分 design.md 共享正文与 Vue 附录；`sync-shared.mjs` | 生成值与主题包逐项一致；Vue 版行为不变，其 gate 通过 |
| 2 | 最小可用：SKILL.md + tokens + design.md + brand.md + `lint-tokens.mjs` | 能拦截裸色值、非档位尺寸；能在任意栈引用 tokens.css |
| 3 | 10 个组件规格 + interaction.md + 页面结构原型 | 每个组件的尺寸 / 状态都落到 token |
| 4 | 图标（Lucide 规则 + 品牌补充包 + 对照表）、`pangea-ui.css`、适配器 | 原生 HTML 原型可只靠本 skill 产出 |
| 5 | 跨栈验证：同一需求分别用 React + shadcn、原生 HTML、Vue + Element 实现 | 三份产出视觉与交互一致，lint 0 ERROR；website 增加通用版入口 |

## 八、风险

- **约束过松即无约束**：没有模板和组件库兜底，硬约束必须可被脚本检查，不能只写在文档里。
- **双 skill 维护成本**：靠同步脚本 + manifest 控制；共享规则的改动需两边验证。
- **组件规格无参照实现**：Arco 之外没有现成样子可对照，规格必须具体到 token 和状态，第 5 期跨栈验证用来暴露写得不够具体的地方。
- **Lucide 与 Pangea 图标风格差异**：通过固定线宽、尺寸档和对照表缩小，不能完全消除。

## 九、实施记录

### 第 1 期（2026-10-10 完成）

- `scripts/build-tokens.mjs [--check]`：读主题包 `theme.css`（运行时变量）+ `tokens.less`（编译期刻度），并叠加 Arco 基础样式 `dist/arco.css` 作为底层（主题包未覆盖的变量只有暗色 `--color-white` 一个）。产出 `skills/pangea-design-universal/references/tokens.json` / `tokens.css`：色板 21 组 × 10 阶、语义色 63 个（亮 / 暗）、字号 11、间距 23、尺寸 56，另含字重、行高、边框、圆角、阴影、透明度、动效、层级。变量名与主题包一致。
- 验证：在官网 dev server（真实 Vue + Arco 运行时）逐个比对 63 个语义色的亮 / 暗计算值，126 项全部一致；`tokens.css` 单独放进空白页（无 Arco），126 项同样一致，刻度变量与 `rgba(var(--primary-6), 0.2)` 写法可用，暗色由 `data-theme="dark"` 触发。
- `shared/design-core.md`：规则正文 C1–C10，技术栈无关（通用术语 + 变量名）。`scripts/sync-shared.mjs [--check]` 同步到 `skills/pangea-design-universal/references/` 与 `skills/pangea-design-vue/references/`。
- Vue 版 `design.md` 改为「Arco 写法」：标题与锚点全部保留（49 个指向 `design*.md` 的锚点链接检查无断链），每节先链到 core 规则再写 Arco 落地；Vue 专属内容（模板映射、`.arco-modal-simple` 修正、`check:tokens`、`a-steps small`、Grid 断点属性）保留在这里。`SKILL.md`、`CONTRIBUTING.md`、`README.md`、`pack-skill.sh` 必需文件清单同步。
- 尚无 `skills/pangea-design-universal/SKILL.md`，该目录目前只是第 2 期的输入，不能单独使用。

### 改名（2026-10-10）

按用户要求，skill 名与目录由 `pangea-design` 改为 **`pangea-design-universal`**；脚本、规则正文、Vue 版文档中的引用一并更新。

### 第 2 期（2026-10-10 完成）

- `SKILL.md`（通过 skill-creator quick_validate）：适用分工、三档约束、接入方式、多页结构说明闸门、组件与交互要点、交付前自检。版本 0.1.0，未打包。
- `references/brand.md`：依据飞书「标识」规范——标准版 Hisense 标识、只用海信绿 / 反白、不可变形（宽高比 3.81:1）、非联合项目不出现其它品牌标识、默认 favicon；海信绿 `#00AAA6` 与 `--primary-6` 一致。插画 / 文案语气 / 品牌动效列为「尚未定义」，不自行补充。
- `assets/brand/`：官方 `hisenselogo.svg`、两张 PNG、128 ico；反白 SVG 由官方 SVG 只改填充色得到。
- `scripts/lint-tokens.mjs`：档位全部读 tokens.json。E1 字面颜色（含自造变量、Tailwind 任意色；阴影允许黑 / 白半透明）、E2 字号、E3 圆角、E4 间距；W1 动效时长、W2 全局层级（≥100）、W3 脚本字面色、W4 rem 字号。扫描 CSS/SCSS/Less、HTML/Vue/Svelte 的 style、JS/TS/JSX 内联样式与 Tailwind 任意值。正反例夹具 ERROR 0 / 15，按预期全部命中，node_modules 跳过。
- 生成器补少量组件级 token（表格单元格内边距、按钮 / 输入高度等，名与主题包 Less 变量一致），C5 表格行改用 `--table-size-medium-padding-*`。
- 原生 HTML 演示（tokens.css + Logo，亮 / 暗）：lint 0 ERROR，Logo 宽高比实测 3.81。暗色发现 `--color-fill-*` 是半透明叠加色，单独铺底会透出白画布 → 已在 C3 补「先铺 `--color-bg-1` 再叠灰」。

### 待决问题

- ~~页面标题 18px 不在主题字号档位~~：属于 Vue 版页面模板的问题，与通用版无关。通用版只以主题包档位为准，不处理模板；Vue 模板是否调整另议。
- ~~通用版的打包~~：第 5 期已补 `pack-skill.sh --skill universal`。

### 独立性约定（2026-10-10，用户指出）

通用版是**独立 skill**：不提页面模板、脚手架、应用外壳，也不提及或引导到 `pangea-design-vue`。共享正文 `design-core.md` 同样不出现任何 skill 名；生成物注释只写「本文件为生成物，请勿直接修改」，不写仓库内的脚本路径。两个 skill 之间的关系只在仓库层面（本文件、CONTRIBUTING、台账）说明。第二节表格中「与 Vue 版对比」仅用于本方案说明，不进入 skill 内容。

### 第 3 期（2026-10-10 完成）

- **不做「页面结构原型」**（用户确认）：按页面类型写结构容易变成换个说法的模板；其中有价值的状态与交互要求并入 `interaction.md`，对任何页面都适用。
- `references/interaction.md`（I1–I12）：反馈与加载、数据区状态、危险操作、表单、焦点与键盘、命中区、状态保留与导航、动效、内容与可读性、可用性文案、视觉细节、性能体验。吸收 [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines) 中与技术栈无关的条目，中文改写；与 Pangea 冲突或仅属 Vercel 品牌的条目列在文末「未采纳」（双层阴影、APCA、hover 提高对比、占位符省略号、英文 Title Case、`maximum-scale=1`、React 专属）。标【硬】的条目进入硬约束。
- `references/components.md`：12 类组件的尺寸、状态矩阵与行为。取值来自官网 dev server 中 Arco + 主题包的**实际计算样式**（按钮 4 类型 × hover/active、输入 hover/聚焦/禁用、表格、标签、分页、标签页、分段控件等），另以主题 CSS 核对错误态、复选框、开关、下拉选项、指示条；初稿中 4 处凭印象写的值（复选框边框、已选选项颜色、分页 hover、菜单项内边距）核对后已更正。文档中出现的所有具体变量均在 `tokens.css` 中有定义。
- 生成器补导出对话框、抽屉、消息、警告提示、浮层、文字提示的内边距变量（名与主题包一致）。
- `lint-tokens.mjs` 新增 E5（禁用缩放）、W5（`transition: all`）、W6（`outline: none` 需有替代焦点样式）。
- SKILL.md：阅读顺序与索引加入两份新文档，硬约束与人工自检补充交互条目。

### 第 4 期（2026-10-10 完成，暂不含品牌补充图标）

- **图标 `references/icons.md`**：功能性图标统一 Lucide。实测 24px 下 Pangea 图标线宽约 2px，与 Lucide 默认一致，故保持默认线宽、不开 `absoluteStrokeWidth`；尺寸 1em 或 16/20/24；30 组常用含义的 Pangea ↔ Lucide 对照（两边名称均在图标包中核对存在）；各技术栈的 Lucide 包名经 npm 核对。品牌补充图标（AI 系列等）按用户要求暂缓。
- **适配 `references/adapters/`（由 build-tokens.mjs 生成）+ `adapters.md`**：Tailwind v4（清空默认色板 / 圆角 / 字号 / 阴影）、Tailwind v3 preset、shadcn/ui（v4 版）、Element Plus（变量覆盖 + 写死尺寸的组件单独对齐）、Ant Design v5/v6（字面值主题 + Button 组件 token）。
  - 实测：Tailwind v4 4.3.3 / v3 3.4.17 编译后在浏览器中亮暗取值一致、默认工具类已移除；Element Plus 2.14.7、antd 6.6.5（SSR 渲染）的主 / 默认按钮及 hover、小按钮、输入框与 Pangea 一致。已知限制：antd 暗色主色由 darkAlgorithm 派生（约 #22a29b），已写入文档。
- **参考样式 `assets/pangea-ui.css`**：`pg-` 前缀，只有外观与状态。与官网 Arco 实际渲染逐项对照 152 项计算样式（亮 / 暗），差异仅为无边框元素的边框色。
- **对照中发现并修正**：`--color-neutral-*` 与 `--color-fill-*` 亮色相同、暗色不同（fill 为半透明），初版 components.md 把次按钮、表头、输入禁用等写成 fill，暗色会偏；次按钮 hover 底应为 `--color-bg-3`（不是 bg-white，暗色差异明显）；主按钮文字是纯白（新增 `--btn-primary-color-text`），不是暗色下 0.9 透明的 `--color-white`；分段控件选中项暗色为 `--color-fill-3`。均已改正，适配文件同步修正。

### 第 5 期（2026-10-10，跨栈验证与打包完成；website 入口待定）

- **打包**：`scripts/pack-skill.sh --skill universal` 先跑 `build-tokens --check` 与 `sync-shared --check`，再打包并自检；默认仍打 Vue 版。产物 `releases/pangea-design-universal_0.1.0.zip`（21 文件，SHA-256 `152a7ddc…485320f1`），不入 Git。
- **跨栈验证**：三个独立子智能体只拿到本 skill，按同一需求（「项目列表」页：筛选、表格、状态、分页、确认删除、亮暗切换）分别用原生 HTML、Vue + Element Plus、Tailwind v4 实现。三份源码 lint 均 ERROR 0 / WARN 0；原生与 Element 截图对比配色与布局一致。原计划中的 React + shadcn 改为 Tailwind v4（shadcn 适配基于同一套变量）。
- **按反馈补充的规格**：分段控件尺寸与小号、`[hidden]` 被样式覆盖的修正、危险文字按钮、分页细节、确认对话框、页头与页面标题（暂定 `--font-size-title-2` 20px / 600，待用户确认）、状态点颜色映射、加载指示（components §12）；图标按钮与裸图标的区分、导出图标说明、数据状态演示提示。
- **工具与适配修正**：lint 跳过复制进项目的 `tokens.css` / `pangea-ui.css` / 适配文件，允许 2px 以下间距，新增 HTML `class` / `className` 中 Tailwind 任意值检查；Tailwind v4 / v3 适配加入 `[data-theme="dark"]` 暗色变体并说明 `@layer` 与组件变量用法；Element Plus 适配补表格、分页、对话框、遮罩、消息框、消息、分段控件的组件级变量，输入框底色改为 `--color-bg-1`。
- **复核**：最后一批修改后重跑 quick_validate、`build-tokens --check`、`sync-shared --check`、61 个文档锚点（0 断链）、文档变量引用核对、`pangea-ui.css` 与 Arco 152 项计算样式对照（差异仍仅为无边框元素的边框色），均通过。
- **已知限制**：antd 暗色主色由 darkAlgorithm 派生（约 #22a29b，规范为 #25bbb3）。Tailwind 编译产物中有框架自带的 `#0000` 等字面值，lint 只针对源码，不扫编译产物。
- **收尾（用户确认按建议）**：页面标题定为 `--font-size-title-2` 20px / 600；website「说明文档」下新增「通用版」页（`/universal`：包含内容、选哪个版本、各技术栈接入、交付前自检、GitHub 目录），gate 通过，1440 / 375 无横向溢出；CHANGELOG 新增 1.4.4（design-core 拆分 + 通用版 0.1.0），重新打包 `pangea-design-vue_1.4.4.zip`。第 5 期完成。
- **暂缓**：品牌补充图标（用户决定）。
