<script setup lang="ts">
// ⚠️ 占位版全局 Layout（PLACEHOLDER）
// ------------------------------------------------------------------
// 团队后续会提供【标准化的全局 Layout】来替换本文件。生成页面时：
//   - 不要重写本文件的骨架结构（页头/侧边栏/导航）；
//   - 具体页面通过 <router-view /> 作为子路由渲染在内容区；
//   - 需要新增页面时只改路由与 src/pages/，不动这里。
// 本占位版仅提供一个最小外壳，保证脚手架可直接运行、可预览页面。
import { IconGlobal } from '@arco-iconbox/vue-pangea-mobile';
</script>

<template>
  <a-layout class="global-layout">
    <a-layout-header class="global-layout__header">
      <div class="global-layout__brand">
        <IconGlobal class="global-layout__logo" />
        <span class="global-layout__title">Pangea App</span>
      </div>
      <!-- 占位：标准化 Layout 将在此放置全局导航 / 用户信息等 -->
    </a-layout-header>

    <a-layout-content class="global-layout__content">
      <!-- 具体页面（子路由）渲染在这里 -->
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.global-layout {
  min-height: 100vh;
  background: var(--color-bg-1);
}

.global-layout__header {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 20px;
  background: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border-2);
}

.global-layout__brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.global-layout__logo {
  font-size: 22px;
  color: rgb(var(--primary-6));
}

.global-layout__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}

.global-layout__content {
  padding: 20px;
}
</style>
