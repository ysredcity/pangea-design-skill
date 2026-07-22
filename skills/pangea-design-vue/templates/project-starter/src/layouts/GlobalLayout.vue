<script setup lang="ts">
/**
 * 全局 Layout（Pangea 标准版）
 * ------------------------------------------------------------------
 * 基于 Figma 设计稿「Pangea Design PC Templates / 菜单-展开」实现。
 * 结构：顶部 Header(48px) + 下方 [Sidebar(200px, 可折叠) | Content(flex:1)]
 *
 * 使用约定：
 * - 具体页面通过 <router-view /> 作为子路由渲染在内容区；
 * - 需要新增页面时只改路由与 src/pages/，不动这里；
 * - 侧边栏菜单数据通过 menuItems 配置，新增页面后同步加菜单项即可。
 */
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IconGeneral, IconHisense, IconLeft } from '@arco-iconbox/vue-pangea-mobile';

// ------ 侧边栏折叠状态 ------
const collapsed = ref(false);
const sidebarWidth = computed(() => (collapsed.value ? 0 : 200));

// ------ 应用名称（生成时替换为当前产品名称） ------
const appName = ref('低代码开发平台');

// ------ 路由 ------
const router = useRouter();
const route = useRoute();

// ------ 菜单数据（示例，实际项目按需配置） ------
interface MenuItem {
  key: string;
  title: string;
  icon?: string;
  children?: MenuItem[];
}

const menuItems = ref<MenuItem[]>([
  { key: '/', title: '示例页面' },
]);

// 菜单选中
const selectedKeys = computed(() => [route.path]);

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

      <!-- 中间：应用页签（占位） -->
      <div class="pg-layout__header-center">
        <!-- 实际项目在此放置应用级 tabs -->
      </div>

      <!-- 右侧：头像 -->
      <div class="pg-layout__header-right">
        <a-avatar :size="32" class="pg-layout__avatar">
          <span>U</span>
        </a-avatar>
      </div>
    </header>

    <!-- ═══════════ Body（Sidebar + Content） ═══════════ -->
    <div class="pg-layout__body">
      <!-- Sidebar -->
      <aside
        class="pg-layout__sidebar"
        :class="{ 'pg-layout__sidebar--collapsed': collapsed }"
        :style="{ width: sidebarWidth + 'px' }"
      >
        <!-- 侧边栏 Head：应用名 -->
        <div v-show="!collapsed" class="pg-layout__sidebar-head">
          <span class="pg-layout__sidebar-title">应用名称</span>
        </div>

        <!-- 菜单 -->
        <div v-show="!collapsed" class="pg-layout__menu-wrap">
          <a-menu
            :selected-keys="selectedKeys"
            :default-open-keys="[]"
            :style="{ width: '100%' }"
            @menu-item-click="onMenuItemClick"
          >
            <template v-for="item in menuItems" :key="item.key">
              <!-- 有子菜单 -->
              <a-sub-menu v-if="item.children && item.children.length" :key="item.key">
                <template #title>{{ item.title }}</template>
                <a-menu-item v-for="child in item.children" :key="child.key">
                  {{ child.title }}
                </a-menu-item>
              </a-sub-menu>
              <!-- 无子菜单 -->
              <a-menu-item v-else :key="item.key">
                {{ item.title }}
              </a-menu-item>
            </template>
          </a-menu>
        </div>

        <!-- 展开/折叠按钮：始终可见 -->
        <div class="pg-layout__collapse-btn" @click="collapsed = !collapsed">
          <IconLeft
            :style="{
              fontSize: '12px',
              transform: collapsed ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s',
              color: 'var(--color-text-3)',
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
  min-height: 100vh;
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
  padding: 0 32px;
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

/* 折叠按钮：紧贴侧边栏右缘外侧，始终可见 */
.pg-layout__collapse-btn {
  position: absolute;
  right: -14px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  padding: 24px 0;
  background: var(--color-fill-2);
  border-radius: 0 8px 8px 0;
  box-shadow: 1px 0 1px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  z-index: 10;
}

.pg-layout__sidebar--collapsed .pg-layout__collapse-btn {
  right: auto;
  left: 0;
  transform: translateY(-50%);
  border-radius: 0 8px 8px 0;
}

/* ═══════════ Content ═══════════ */
.pg-layout__content {
  flex: 1;
  min-width: 0;
  background: var(--color-bg-1);
  border-top-left-radius: 8px;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}
</style>
