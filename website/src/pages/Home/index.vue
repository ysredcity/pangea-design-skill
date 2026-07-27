<script setup lang="ts">
/**
 * 首页 / 产品介绍
 * 本页本身用 Pangea 设计系统（Arco + Pangea 主题 + GlobalLayout）构建，即 skill 效果的样例。
 * 统计数字来自同步自 skill 的 catalog.json（dogfood）。
 */
import { useRouter } from 'vue-router';
import {
  IconLayout,
  IconPuzzle,
  IconCheckCircle,
  IconDashboard,
  IconThunderbolt,
  IconCode,
  IconRight,
} from '@arco-iconbox/vue-pangea-mobile';
import catalog from '@/generated/catalog.json';

const router = useRouter();

const stats = [
  { label: '页面模板', value: catalog.counts.pageTemplates },
  { label: '组件选型', value: catalog.counts.components },
  { label: '质量门禁', value: 8, suffix: '项' },
];

const templateTitles = catalog.pageTemplates.map((t) => t.title);

const capabilities = [
  { icon: IconLayout, title: '页面模板套用', desc: '列表 / 卡片 / 表单 / 分组表单等场景，按匹配度直接套用或增补，不从零设计。' },
  { icon: IconPuzzle, title: '组件选型元数据', desc: '组件与模板标注「适用任务 / 变体 / 组合边界」，让 AI 与人选型有据可依。' },
  { icon: IconCheckCircle, title: '生成后质量门禁', desc: 'G1–G8 自检：编译、Token 规范、组件与图标分工、响应式、背景分层、交互四态、可访问性、生成层级。' },
  { icon: IconDashboard, title: '响应式 & 背景分层', desc: 'Arco Grid 断点 + 卡片自适应网格；灰底 + 白卡的背景分层，多端一致。' },
  { icon: IconThunderbolt, title: '图表按需引入', desc: 'VChart 不进基础依赖，通过懒加载封装按需启用，保持工程轻量。' },
  { icon: IconCode, title: '可运行工程交付', desc: '产出完整 Vue 3 工程（页面 / 路由 / 组件 / 主题），可 degit 起步、直接开发交付。' },
];
</script>

<template>
  <div class="pg-home">
    <!-- ═══════════ Hero ═══════════ -->
    <section class="pg-home__hero">
      <div class="pg-home__hero-inner">
        <a-tag class="pg-home__eyebrow" color="arcoblue" size="small">海信集团 · B 端 / 中后台设计系统</a-tag>
        <h1 class="pg-home__title">Pangea Design</h1>
        <p class="pg-home__lede">让 AI 按规范生成，产出可交付的 B 端 / 中后台前端工程。</p>
        <p class="pg-home__sub">
          基于 <code>@arco-design/web-vue</code> + 定制主题包 <code>@arco-themes/vue-pangea-3-linear</code>，
          以设计系统约束 AI 生成，让需求落进代码、让结果直接进入开发交付。
        </p>
        <a-space :size="12" class="pg-home__cta">
          <a-button type="primary" @click="router.push('/guide')">
            使用指南
            <template #icon><IconRight /></template>
          </a-button>
          <a-button @click="router.push('/templates')">页面模板</a-button>
          <a-button @click="router.push('/components')">组件预览</a-button>
        </a-space>

        <div class="pg-home__stats">
          <div v-for="s in stats" :key="s.label" class="pg-home__stat">
            <span class="pg-home__stat-value">{{ s.value }}{{ s.suffix || '' }}</span>
            <span class="pg-home__stat-label">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ 能做什么 ═══════════ -->
    <section class="pg-home__section">
      <h2 class="pg-home__h2">能做什么</h2>
      <p class="pg-home__section-desc">从设计系统到真实工程，Pangea Design 覆盖生成、约束与交付的关键环节。</p>
      <div class="pg-home__grid">
        <a-card v-for="c in capabilities" :key="c.title" class="pg-home__card" :bordered="true">
          <div class="pg-home__card-icon"><component :is="c.icon" /></div>
          <h3 class="pg-home__card-title">{{ c.title }}</h3>
          <p class="pg-home__card-desc">{{ c.desc }}</p>
        </a-card>
      </div>
    </section>

    <!-- ═══════════ 页面模板一览 ═══════════ -->
    <section class="pg-home__section">
      <h2 class="pg-home__h2">页面模板</h2>
      <p class="pg-home__section-desc">
        基于 Figma 设计稿沉淀的页面模板（数据取自 skill 的 catalog）。详见
        <a-link @click="router.push('/templates')">页面模板</a-link>。
      </p>
      <a-space wrap :size="8">
        <a-tag v-for="t in templateTitles" :key="t" size="medium" color="arcoblue">{{ t }}</a-tag>
      </a-space>
    </section>

    <!-- ═══════════ 核心机制 ═══════════ -->
    <section class="pg-home__section pg-home__section--muted">
      <h2 class="pg-home__h2">核心机制</h2>
      <ul class="pg-home__mechanism">
        <li><strong>Skill 是唯一事实源</strong>：规则、Token、组件与模板元数据、质量门禁都收敛在 skill 内；本官网只是它的 showcase 快照。</li>
        <li><strong>页面生成决策树</strong>：按场景与模板匹配度决定「套模板 / 增补 / AI 自主设计」，自主设计也必须用设计系统组件 + Token。</li>
        <li><strong>元数据驱动选型</strong>：模板与组件的适用任务、变体、组合边界结构化沉淀，供 AI 与人对照。</li>
        <li><strong>门禁保交付</strong>：生成后按 G1–G8 自检 + <code>npm run gate</code>，保证产出可交付。</li>
        <li><strong>本站即样例</strong>：这个官网就是照着 skill、用同一套 GlobalLayout 与 Pangea 主题构建的（dogfood）。</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.pg-home {
  background: var(--color-bg-1);
  min-height: 100%;
}

/* Hero */
.pg-home__hero {
  padding: 56px 32px 40px;
  background: rgba(var(--primary-6), 0.06);
}

.pg-home__hero-inner {
  max-width: 960px;
  margin: 0 auto;
}

.pg-home__eyebrow {
  margin-bottom: 16px;
}

.pg-home__title {
  margin: 0;
  font-size: 40px;
  font-weight: 700;
  color: var(--color-text-1);
  line-height: 1.2;
}

.pg-home__lede {
  margin: 12px 0 0;
  font-size: 20px;
  font-weight: 500;
  color: var(--color-text-1);
}

.pg-home__sub {
  margin: 12px 0 0;
  max-width: 720px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-home__sub code,
.pg-home__mechanism code {
  padding: 1px 6px;
  font-size: 13px;
  background: var(--color-fill-2);
  border-radius: var(--border-radius-small);
}

.pg-home__cta {
  margin-top: 24px;
}

.pg-home__stats {
  display: flex;
  gap: 40px;
  margin-top: 32px;
}

.pg-home__stat {
  display: flex;
  flex-direction: column;
}

.pg-home__stat-value {
  font-size: 28px;
  font-weight: 700;
  color: rgb(var(--primary-6));
  line-height: 1.2;
}

.pg-home__stat-label {
  font-size: 13px;
  color: var(--color-text-3);
}

/* 通用 section */
.pg-home__section {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 32px;
}

.pg-home__section--muted {
  max-width: none;
  background: var(--color-fill-1);
}

.pg-home__section--muted .pg-home__h2,
.pg-home__section--muted .pg-home__mechanism {
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
}

.pg-home__h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-home__section-desc {
  margin: 8px 0 24px;
  font-size: 14px;
  color: var(--color-text-2);
}

/* 能力网格 */
.pg-home__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.pg-home__card {
  border-radius: var(--border-radius-large);
}

.pg-home__card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-large);
  background: rgba(var(--primary-6), 0.1);
  color: rgb(var(--primary-6));
  font-size: 20px;
}

.pg-home__card-title {
  margin: 12px 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-home__card-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-2);
}

/* 核心机制 */
.pg-home__mechanism {
  margin: 16px 0 0;
  padding-left: 20px;
}

.pg-home__mechanism li {
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-home__mechanism strong {
  color: var(--color-text-1);
}
</style>
