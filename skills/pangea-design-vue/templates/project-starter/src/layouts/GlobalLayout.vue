<script setup lang="ts">
/**
 * 全局 Layout（Pangea 标准版 · 混合菜单）
 * ------------------------------------------------------------------
 * 基于 Figma「Pangea Design PC Templates / 菜单-展开」实现。
 * 结构：顶部 Header(48px) + 下方 [Sidebar(200px, 可折叠) | Content]
 *
 * 【混合菜单结构】
 * - 顶部 Header 中间是**横向模块菜单**（一个模块 = 一块业务域）；
 * - 左侧 Sidebar 是**当前模块下的菜单**（支持多级），每个模块有自己独立的菜单；
 * - Sidebar 左上角显示模块名称，下面是该模块的菜单；切换顶部模块 → 左侧菜单随之切换。
 *
 * 【单模块 vs 多模块】
 * - 系统层级简单时视为「单模块」：`modules` 只配 1 个 → **自动隐藏顶部模块菜单**，
 *   左侧直接展示该模块菜单，Sidebar 左上角显示应用名。
 * - 层级复杂、需要按业务域分区时配多个 `modules` → 顶部显示模块菜单，
 *   Sidebar 左上角显示当前模块名。
 * 根据实际场景在下方 `modules` 配置即可，无需改结构。
 *
 * 使用约定：
 * - 具体页面通过 <router-view /> 作为子路由渲染在内容区；
 * - 新增页面 = 建页面组件 + 注册子路由 + 在对应模块的 menu 里加一项；不改本文件结构。
 */
import { ref, computed, type Component } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IconGeneral, IconHisense, IconLeft } from '@arco-iconbox/vue-pangea-mobile';
import { APP_NAME } from '@/config/app';

// ------ 应用名称（单一来源：src/config/app.ts；浏览器 title 也取它）------
const appName = ref(APP_NAME);

// ------ 菜单数据模型 ------
interface MenuItem {
  key: string; // 路由路径
  title: string;
  icon?: Component; // 仅一级菜单可选配图标；二级菜单不使用图标
  children?: MenuItem[];
}
interface ModuleDef {
  key: string;
  title: string;
  menu: MenuItem[];
}

// 顶部模块 + 各模块的左侧菜单（示例，按实际业务配置）。
// 只配 1 个模块 → 自动进入单模块模式（隐藏顶部模块菜单）。
const modules = ref<ModuleDef[]>([
  {
    key: 'workbench',
    title: '工作台',
    menu: [{ key: '/dashboard', title: '仪表板' }],
  },
  {
    key: 'list',
    title: '列表页',
    menu: [
      { key: '/', title: '简单列表页' },
      { key: '/card-list', title: '卡片列表页' },
    ],
  },
  {
    key: 'form',
    title: '表单页',
    menu: [
      { key: '/contract-form', title: '基础表单页' },
      { key: '/grouped-form', title: '分组表单页' },
    ],
  },
]);

// 多模块才展示顶部模块菜单
const isMultiModule = computed(() => modules.value.length > 1);

// ------ 侧边栏折叠 ------
const collapsed = ref(false);
const sidebarWidth = computed(() => (collapsed.value ? 0 : 200));

// ------ 路由 ------
const router = useRouter();
const route = useRoute();

function menuContainsPath(items: MenuItem[], path: string): boolean {
  return items.some((it) => it.key === path || (it.children ? menuContainsPath(it.children, path) : false));
}
function firstLeaf(items: MenuItem[]): MenuItem | undefined {
  for (const it of items) {
    if (it.children && it.children.length) {
      const leaf = firstLeaf(it.children);
      if (leaf) return leaf;
    } else {
      return it;
    }
  }
  return undefined;
}

// 当前模块 = 拥有当前路由的模块，回退到第一个
const activeModule = computed<ModuleDef>(() => {
  return modules.value.find((m) => menuContainsPath(m.menu, route.path)) || modules.value[0];
});
const activeModuleKey = computed(() => activeModule.value.key);
const sidebarMenu = computed(() => activeModule.value.menu);
// Sidebar 左上角标题：仅多模块时显示当前模块名；单模块时整块隐藏（避免与 Header 的系统名重复）
const sidebarTitle = computed(() => activeModule.value.title);

// 侧边栏选中 / 展开
function flattenKeys(items: MenuItem[]): string[] {
  return items.flatMap((it) => (it.children && it.children.length ? flattenKeys(it.children) : [it.key]));
}
// 精确匹配优先；否则让子路由（如 /x/detail）高亮其父菜单项（/x）
const selectedKeys = computed(() => {
  const p = route.path;
  const keys = flattenKeys(sidebarMenu.value);
  if (keys.includes(p)) return [p];
  const prefix = keys
    .filter((k) => k !== '/' && (p === k || p.startsWith(k + '/')))
    .sort((a, b) => b.length - a.length)[0];
  return [prefix || p];
});
const defaultOpenKeys = computed(() => {
  const keys: string[] = [];
  const walk = (items: MenuItem[]) =>
    items.forEach((it) => {
      if (it.children && it.children.length) {
        if (menuContainsPath(it.children, route.path)) keys.push(it.key);
        walk(it.children);
      }
    });
  walk(sidebarMenu.value);
  return keys;
});

function onModuleClick(key: string) {
  const m = modules.value.find((x) => x.key === key);
  const leaf = m && firstLeaf(m.menu);
  if (leaf) router.push(leaf.key);
}
function onMenuItemClick(key: string) {
  router.push(key);
}
</script>

<template>
  <div class="pg-layout">
    <!-- ═══════════ Header ═══════════ -->
    <header class="pg-layout__header">
      <!-- 左侧：App Drawer + Logo + 平台名 -->
      <div class="pg-layout__header-left">
        <div class="pg-layout__app-trigger">
          <IconGeneral style="font-size: 20px; color: var(--color-text-2)" />
        </div>
        <div class="pg-layout__brand">
          <IconHisense class="pg-layout__brand-logo" />
          <span class="pg-layout__brand-name">{{ appName }}</span>
        </div>
      </div>

      <!-- 中间：横向模块菜单（单模块时隐藏） -->
      <div class="pg-layout__header-center">
        <a-menu
          v-if="isMultiModule"
          mode="horizontal"
          class="pg-layout__module-menu"
          :selected-keys="[activeModuleKey]"
          @menu-item-click="onModuleClick"
        >
          <a-menu-item v-for="m in modules" :key="m.key">{{ m.title }}</a-menu-item>
        </a-menu>
      </div>

      <!-- 右侧：头像 -->
      <div class="pg-layout__header-right">
        <a-avatar :size="32" class="pg-layout__avatar"><span>U</span></a-avatar>
      </div>
    </header>

    <!-- ═══════════ Body（Sidebar + Content） ═══════════ -->
    <div class="pg-layout__body">
      <aside
        class="pg-layout__sidebar"
        :class="{ 'pg-layout__sidebar--collapsed': collapsed }"
        :style="{ width: sidebarWidth + 'px' }"
      >
        <!-- Sidebar Head：左上角显示当前模块名；单模块时不显示（与 Header 系统名重复） -->
        <div v-if="isMultiModule" v-show="!collapsed" class="pg-layout__sidebar-head">
          <span class="pg-layout__sidebar-title">{{ sidebarTitle }}</span>
        </div>

        <!-- 当前模块的菜单（多级）；切换模块时用 key 重挂载以复位展开态 -->
        <div v-show="!collapsed" class="pg-layout__menu-wrap">
          <a-menu
            :key="activeModuleKey"
            :selected-keys="selectedKeys"
            :default-open-keys="defaultOpenKeys"
            :style="{ width: '100%' }"
            @menu-item-click="onMenuItemClick"
          >
            <template v-for="item in sidebarMenu" :key="item.key">
              <a-sub-menu v-if="item.children && item.children.length" :key="item.key">
                <template v-if="item.icon" #icon><component :is="item.icon" /></template>
                <template #title>{{ item.title }}</template>
                <!-- 二级菜单项：不配图标 -->
                <a-menu-item v-for="child in item.children" :key="child.key">
                  {{ child.title }}
                </a-menu-item>
              </a-sub-menu>
              <a-menu-item v-else :key="item.key">
                <template v-if="item.icon" #icon><component :is="item.icon" /></template>
                {{ item.title }}
              </a-menu-item>
            </template>
          </a-menu>
        </div>

        <!-- 展开/折叠按钮 -->
        <div class="pg-layout__collapse-btn" @click="collapsed = !collapsed">
          <IconLeft
            :style="{
              fontSize: '12px',
              transform: collapsed ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s',
            }"
          />
        </div>
      </aside>

      <!-- Content -->
      <main class="pg-layout__content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ═══════════ Layout 根 ═══════════ */
.pg-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--color-fill-2);
}

/* ═══════════ Header ═══════════ */
.pg-layout__header {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0;
  background: var(--color-fill-2);
  flex-shrink: 0;
}

.pg-layout__header-left {
  display: flex;
  align-items: center;
  height: 100%;
}

.pg-layout__app-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  cursor: pointer;
}

.pg-layout__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 12px;
  padding-right: 24px;
  height: 100%;
}

.pg-layout__brand-logo {
  font-size: 108px;
  color: rgb(var(--primary-6));
  display: flex;
  align-items: center;
  justify-content: center;
}

.pg-layout__brand-name {
  font-size: 14px;
  color: var(--color-text-1);
  white-space: nowrap;
}

.pg-layout__header-center {
  flex: 1;
  display: flex;
  align-items: center;
  height: 100%;
  min-width: 0;
}

.pg-layout__header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 20px;
  height: 100%;
}

.pg-layout__avatar {
  cursor: pointer;
}

/* ═══════════ Body ═══════════ */
.pg-layout__body {
  display: flex;
  flex: 1;
  min-height: 0;
  position: relative;
}

/* ═══════════ Sidebar ═══════════ */
.pg-layout__sidebar {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 200px;
  flex-shrink: 0;
  background: var(--color-fill-2);
  transition: width 0.2s ease;
  overflow: visible;
  z-index: 2;
}

.pg-layout__sidebar--collapsed {
  width: 0 !important;
}

.pg-layout__sidebar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
}

.pg-layout__sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-1);
  white-space: nowrap;
}

.pg-layout__menu-wrap {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 8px;
  min-width: 0;
}

/* 展开/折叠按钮
   - 展开：完整胶囊（16×62），跨在侧边栏右缘上（一半压内容区）；
   - 折叠：贴左侧屏幕边，只右侧圆角的半胶囊。
   宽 16 + 圆角 large(8px) = 上下端全圆 → 胶囊形。 */
.pg-layout__collapse-btn {
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 62px;
  background: var(--color-fill-2);
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-large);
  color: var(--color-text-2);
  cursor: pointer;
  z-index: 10;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

/* 悬停：描边 + 箭头变青绿主色，底色转白，明显可点 */
.pg-layout__collapse-btn:hover {
  background: var(--color-bg-1);
  border-color: rgb(var(--primary-6));
  color: rgb(var(--primary-6));
}

.pg-layout__sidebar--collapsed .pg-layout__collapse-btn {
  right: auto;
  left: 0;
  border-left: none;
  border-radius: 0 var(--border-radius-large) var(--border-radius-large) 0;
}

/* ═══════════ Content ═══════════ */
.pg-layout__content {
  flex: 1;
  min-width: 0;
  /* 内容区默认透明，漏出 body 灰底；具体背景由各页面自己设置。
     左上圆角 + overflow 会把页面白底裁出圆角，复现「白面板浮在灰底」。 */
  background: transparent;
  border-top-left-radius: var(--border-radius-large);
  overflow-y: auto;
  position: relative;
  z-index: 1;
}
</style>
