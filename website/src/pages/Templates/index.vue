<script setup lang="ts">
/**
 * 页面模板 Templates（索引）
 * 读同步自 skill 的 catalog.pageTemplates，列出模板并链到各自的预览路由。
 * 预览路由渲染的是从 skill 脚手架同步过来的真实示例页（dogfood）。
 */
import { useRouter } from 'vue-router';
import { IconRight, IconDashboard } from '@arco-iconbox/vue-pangea-mobile';
import catalog from '@/generated/catalog.json';

const router = useRouter();

// catalog 模板 id → website 预览路由
const routeMap: Record<string, string> = {
  'page-simple-list': '/templates/simple-list',
  'page-card-list': '/templates/card-list',
  'page-modal-form': '/templates/simple-list', // 弹窗表单在列表页中触发
  'page-form': '/templates/basic-form',
  'page-grouped-form': '/templates/grouped-form',
  'page-step-form': '/templates/step-form',
  'page-detail': '/templates/detail',
  'page-approval-detail': '/templates/approval-detail',
};

const templates = catalog.pageTemplates;

function preview(id: string) {
  const to = routeMap[id];
  if (to) router.push(to);
}
</script>

<template>
  <div class="pg-tpl">
    <div class="pg-tpl__inner">
      <header class="pg-tpl__head">
        <h1 class="pg-tpl__title">页面模板</h1>
        <p class="pg-tpl__lede">
          基于 Figma 设计稿沉淀的页面模板（数据取自 skill 的 catalog）。点击预览的是从脚手架同步的真实示例页。
        </p>
      </header>

      <div class="pg-tpl__grid">
        <a-card v-for="t in templates" :key="t.id" class="pg-tpl__card" :bordered="true">
          <div class="pg-tpl__card-head">
            <h3 class="pg-tpl__card-title">{{ t.title }}</h3>
            <a-tag v-if="t.status" size="small" color="green">{{ t.status }}</a-tag>
          </div>
          <p class="pg-tpl__card-when">{{ (t.whenToUse || []).join(' · ') }}</p>
          <div v-if="t.variants && t.variants.length" class="pg-tpl__variants">
            <a-tag v-for="v in t.variants" :key="v" size="small">{{ v }}</a-tag>
          </div>
          <div class="pg-tpl__card-foot">
            <a-button type="primary" size="small" @click="preview(t.id)">
              预览
              <template #icon><IconRight /></template>
            </a-button>
          </div>
        </a-card>

        <!-- 仪表板示例（非固化模板，图表用 VChart 按需渲染） -->
        <a-card class="pg-tpl__card" :bordered="true">
          <div class="pg-tpl__card-head">
            <h3 class="pg-tpl__card-title">仪表板（示例）</h3>
            <a-tag size="small" color="arcoblue">示例</a-tag>
          </div>
          <p class="pg-tpl__card-when">工作台聚合页 · KPI 卡 + 表格 + 占比条 + VChart 环形图 · 灰底无边框白卡</p>
          <div class="pg-tpl__variants">
            <a-tag size="small">非固化模板</a-tag>
            <a-tag size="small">图表按需</a-tag>
          </div>
          <div class="pg-tpl__card-foot">
            <a-button type="primary" size="small" @click="router.push('/templates/dashboard')">
              预览
              <template #icon><IconDashboard /></template>
            </a-button>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pg-tpl {
  background: var(--color-bg-1);
  min-height: 100%;
}

.pg-tpl__inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 32px 56px;
}

.pg-tpl__title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-1);
}

.pg-tpl__lede {
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-tpl__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 28px;
}

.pg-tpl__card {
  border-radius: var(--border-radius-large);
}

.pg-tpl__card-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pg-tpl__card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-tpl__card-when {
  margin: 10px 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-tpl__variants {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.pg-tpl__card-foot {
  display: flex;
  justify-content: flex-end;
}
</style>
