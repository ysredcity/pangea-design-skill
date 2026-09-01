/**
 * 组件预览清单（website 本地事实源）
 * ------------------------------------------------------------------
 * 驱动左侧「组件」子菜单、路由顺序、组件详情页标题。
 * - 与 skill 的 catalog.json（选型元数据，10 个高频组件）解耦：这里可自由扩充要展示的组件。
 * - 详情页仍会在该组件命中 catalog 时展示「选型要点」卡片。
 * - 菜单按分组顺序平铺为一个长列表（不显示分组标题）。
 */
export interface ComponentEntry {
  id: string;
  title: string;
  group: string;
}

/** 分组 + 组内有序；菜单按此顺序平铺 */
export const componentGroups: { group: string; items: Omit<ComponentEntry, 'group'>[] }[] = [
  {
    group: '通用',
    items: [
      { id: 'button', title: '按钮 Button' },
      { id: 'tag', title: '标签 Tag' },
    ],
  },
  {
    // 本 skill 提炼的可复用 UI 片段（非 Arco 原生组件），与上面的 Arco 组件区分成独立分组，
    // 但仍挂在同一个「通用组件」侧边一级菜单下（分组标题只影响本文件排序，不渲染成菜单层级）。
    group: '共享组件',
    items: [{ id: 'filter-bar', title: '复合筛选器 FilterBar' }],
  },
  {
    group: '数据录入',
    items: [
      { id: 'form', title: '表单 Form' },
      { id: 'select', title: '选择器 Select' },
    ],
  },
  {
    group: '数据展示',
    items: [
      { id: 'table', title: '表格 Table' },
      { id: 'card', title: '卡片 Card' },
      { id: 'badge', title: '徽标 Badge' },
      { id: 'tree', title: '树形 Tree' },
      { id: 'tabs', title: '标签页 Tabs' },
    ],
  },
  {
    group: '反馈',
    items: [
      { id: 'alert', title: '警告提示 Alert' },
      { id: 'modal', title: '对话框 Modal' },
      { id: 'tooltip', title: '文字提示 Tooltip' },
    ],
  },
  {
    group: '导航',
    items: [
      { id: 'menu', title: '菜单 Menu' },
      { id: 'pagination', title: '分页 Pagination' },
      { id: 'steps', title: '步骤条 Steps' },
      { id: 'dropdown', title: '下拉菜单 Dropdown' },
    ],
  },
];

/** 平铺有序列表 */
export const componentList: ComponentEntry[] = componentGroups.flatMap((g) =>
  g.items.map((it) => ({ ...it, group: g.group })),
);

/** 左侧菜单项（平铺，按分组顺序） */
export const componentMenuItems = componentList.map((c) => ({
  key: `/components/${c.id}`,
  title: c.title,
}));

/** 首个组件路由（用于 /components 重定向） */
export const firstComponentPath = `/components/${componentList[0].id}`;

export function findComponent(id: string): ComponentEntry | undefined {
  return componentList.find((c) => c.id === id);
}
