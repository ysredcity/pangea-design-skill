---
name: pangea-icons
description: "Pangea 通用场景的图标规则：功能性图标统一使用 Lucide（线宽、尺寸、颜色、点击区），与 Pangea 图标的语义对照表；品牌标识只用标准文件。"
---

# 图标

## 规则

1. **功能性图标统一使用 [Lucide](https://lucide.dev)**（ISC 许可，可商用）。同一产品内不混用多个图标库。
2. **品牌标识**（Hisense Logo 等）只用 `assets/brand/` 中的标准文件，见 [brand.md](brand.md)；不要用 Lucide 或其它图形代替。
3. **线宽保持 Lucide 默认的 2**，不开启 `absoluteStrokeWidth`。实测在 24px 下，Pangea 图标的线宽约 2px，与 Lucide 默认一致；两者都随尺寸等比缩放。
4. **尺寸**：跟随文字时用 `1em`（与所在文字同高，如按钮内 14px）；单独出现时用 16 / 20 / 24px。不使用其它尺寸。
5. **颜色**：`currentColor`，跟随文字颜色；需要强调时用语义色（如 `rgb(var(--primary-6))`、`rgb(var(--danger-6))`），不写死色值。
6. **可点击图标**分两种：
   - **裸图标**（没有按钮外框，如表格行内的「更多」、卡片角落的操作）：点击区至少 24×24px（[I6](interaction.md#i6-点击区与指针)），hover 时出现**圆形**浅底 `--color-fill-2`；
   - **图标按钮**（有按钮外观，只是不带文字）：沿用按钮的样式与 4px 圆角，宽 = 高（[components.md](components.md) 第 1 节）；
   - 两种都
     必须有 `aria-label` 或文字提示（[C6](design-core.md#c6-状态不只靠颜色传达)）；
   - 纯装饰图标加 `aria-hidden="true"`。
   - 组件库自带的功能性图标（对话框关闭、分页箭头、清除按钮等）保持组件库原样，不算「混用图标库」；自己添加的图标统一用 Lucide。
7. 图标与文字并排时间距 4–8px（`--spacing-2` ～ `--spacing-4`），并垂直居中。

## 安装

| 技术栈 | 包 |
|---|---|
| React | `lucide-react` |
| Vue 3 | `@lucide/vue` |
| Svelte | `@lucide/svelte` |
| Angular | `@lucide/angular` |
| 原生 HTML / 其它 | `lucide-static`：优先把需要的 SVG 内联到页面（`stroke="currentColor"`，便于跟随文字色），图标多时用其 SVG sprite；不用图标字体 |

> 安装时固定版本号。

## 与 Pangea 图标的语义对照

同一含义在不同产品中用同一个图形。下表左列是 Pangea 图标包中的名称，右列是对应的 Lucide 名称（两边均已核对存在）。

| 含义 | Pangea | Lucide |
|---|---|---|
| 搜索 | IconSearch | `search` |
| 新增 / 减少 | IconPlus / IconMinus | `plus` / `minus` |
| 编辑 | IconEdit | `pencil` |
| 删除 | IconDelete | `trash-2` |
| 复制 | IconCopy | `copy` |
| 下载 / 上传 | IconDownload / IconUpload | `download` / `upload` |
| 刷新 | IconRefresh | `refresh-cw` |
| 设置 | IconSettings | `settings` |
| 筛选 | IconFilter | `funnel` |
| 更多（横 / 竖） | IconMore / IconMoreVertical | `ellipsis` / `ellipsis-vertical` |
| 关闭 / 确认 | IconClose / IconCheck | `x` / `check` |
| 方向（折叠、翻页） | IconLeft / IconRight / IconUp / IconDown | `chevron-left` / `chevron-right` / `chevron-up` / `chevron-down` |
| 返回 | IconArrowLeft | `arrow-left` |
| 首页 | IconHome | `house` |
| 用户 / 用户组 | IconUser / IconUserGroup | `user` / `users` |
| 文件 / 文件夹 | IconFile / IconFolder | `file` / `folder` |
| 日期 / 时间 | IconCalendar / IconClockCircle | `calendar` / `clock` |
| 显示 / 隐藏 | IconEye / IconEyeInvisible | `eye` / `eye-off` |
| 锁定 / 解锁 | IconLock / IconUnlock | `lock` / `lock-open` |
| 链接 / 分享 | IconLink / IconShareInternal | `link` / `share-2` |
| 收藏 / 喜欢 / 点赞 | IconStar / IconHeart / IconThumbUp | `star` / `heart` / `thumbs-up` |
| 信息 / 帮助 | IconInfoCircle / IconQuestionCircle | `info` / `circle-help` |
| 警告 / 成功 / 错误 | IconExclamationCircle / IconCheckCircle / IconCloseCircle | `circle-alert` / `circle-check` / `circle-x` |
| 通知 / 邮件 | IconNotification / IconEmail | `bell` / `mail` |
| 打印 / 保存 / 撤销 | IconPrinter / IconSave / IconUndo | `printer` / `save` / `undo-2` |
| 菜单 / 列表 / 应用 | IconMenu / IconList / IconApps | `menu` / `list` / `layout-grid` |
| 全屏 / 退出全屏 | IconFullscreen / IconFullscreenExit | `maximize` / `minimize` |
| 导出 / 导入 | IconExport / IconImport | `log-out` / `log-in`（与 Pangea 图形一致；若同一产品还有「退出登录」，退出登录用文字或 `power`，避免与导出混淆） |
| 语言 | IconLanguage | `languages` |

表中没有的含义，在 Lucide 中按名称搜索，选用最直接表达该含义的图形；同一产品内同一含义始终用同一个图标。
