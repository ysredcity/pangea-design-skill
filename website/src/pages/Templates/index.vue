<script setup lang="ts">
/**
 * 页面模板 Templates（索引）
 * ------------------------------------------------------------------
 * 数据取自同步的 catalog.pageTemplates；缩略图取 src/assets/template-shots/<id>.jpg
 * （由 `npm run shoot:templates` 生成并提交入库，见 scripts/shoot_templates.py）。
 * 点「预览」进入的是从 skill 脚手架同步过来的真实示例页（dogfood）。
 *
 * 卡片**严格等高**：不靠内容自然撑开（catalog 的 whenToUse 26–50 字、variants 0–85 字，
 * 长短不一），而是把每个区块的行数写死 ——
 *   截图 aspect-ratio 16/10 → 标题 1 行 → 说明 2 行(line-clamp) → 标签 1 行 → 底部按钮吸底。
 */
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { IconRight } from '@arco-iconbox/vue-pangea-mobile';
import catalog from '@/generated/catalog.json';

const router = useRouter();

// 缩略图：文件名即模板 id
const shotModules = import.meta.glob<string>('../../assets/template-shots/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
});
const shots: Record<string, string> = {};
for (const [path, url] of Object.entries(shotModules)) {
  shots[path.split('/').pop()!.replace('.jpg', '')] = url;
}

/** catalog 模板 id → 官网预览路由 */
const ROUTES: Record<string, string> = {
  'page-simple-list': '/templates/simple-list',
  'page-card-list': '/templates/card-list',
  'page-tree-table': '/templates/tree-table',
  // 对话框表单没有独立页面：在简单列表页点「创建」弹出（缩略图只截对话框本体）
  'page-modal-form': '/templates/simple-list',
  'page-filter-list': '/templates/filter-list',
  'page-form': '/templates/basic-form',
  'page-grouped-form': '/templates/grouped-form',
  'page-step-form': '/templates/step-form',
  'page-detail': '/templates/detail',
  'page-approval-detail': '/templates/approval-detail',
  dashboard: '/templates/dashboard',
};

/**
 * 按**页面类型**分组展示；组内顺序 = 使用顺序（由简到繁）。
 * 不用 catalog 的 id 字母序（那会让审批详情页排第一、简单列表页排第七）。
 */
const GROUPS: { key: string; title: string; desc: string; ids: string[] }[] = [
  {
    key: 'list',
    title: '列表页',
    desc: '数据的浏览、检索与批量操作入口',
    ids: ['page-simple-list', 'page-filter-list', 'page-card-list', 'page-tree-table'],
  },
  {
    key: 'form',
    title: '表单页',
    desc: '数据录入与编辑，按字段规模与流程复杂度递进',
    ids: ['page-modal-form', 'page-form', 'page-grouped-form', 'page-step-form'],
  },
  {
    key: 'detail',
    title: '详情页',
    desc: '查看已录入数据，以及带流程语义的审批处理',
    ids: ['page-detail', 'page-approval-detail'],
  },
  { key: 'other', title: '其他', desc: '非固化模板，作为组装参考', ids: ['dashboard'] },
];

/** 仪表板不是固化模板，不在 catalog 里，手工补一条挂在最后 */
const DASHBOARD = {
  id: 'dashboard',
  route: '/templates/dashboard',
  title: '仪表板（示例）',
  status: '示例',
  statusColor: 'arcoblue',
  when: '工作台聚合页 · KPI 卡 + 表格 + 占比条 + VChart 环形图 · 灰底无边框白卡',
};

// 说明：卡片为了压缩尺寸，不再展示 variants 标签行（那一行 + 间距约占 40px）。
// variants 属于次要元数据，完整信息在 skill 的模板文档里；这里只保留 标题 + 适用场景 + 预览。

/** 分组 + 组内卡片；catalog 里没有的 id 直接跳过，不产生坏卡片 */
const groups = computed(() => {
  const byId = new Map(catalog.pageTemplates.map((t) => [t.id, t]));
  return GROUPS.map((g) => ({
    ...g,
    cards: g.ids.flatMap((id) => {
      if (id === 'dashboard') return [DASHBOARD];
      const t = byId.get(id);
      if (!t) return [];
      return [
        {
          id: t.id,
          route: ROUTES[t.id],
          title: t.title,
          status: t.status,
          statusColor: 'green',
          when: (t.whenToUse || []).join(' · '),
        },
      ];
    }),
  })).filter((g) => g.cards.length);
});
</script>

<template>
  <div class="pg-tpl">
    <div class="pg-tpl__inner">
      <header class="pg-tpl__head">
        <h1 class="pg-tpl__title">页面模板</h1>
        <p class="pg-tpl__lede">
          基于 Figma 设计稿沉淀的页面模板（数据取自 skill 的 catalog），按使用顺序排列。
          缩略图与预览都来自从脚手架同步的真实示例页。
        </p>
      </header>

      <section v-for="g in groups" :key="g.key" class="pg-tpl__group">
        <div class="pg-tpl__group-head">
          <h2 class="pg-tpl__group-title">{{ g.title }}</h2>
          <span class="pg-tpl__group-count">{{ g.cards.length }}</span>
          <span class="pg-tpl__group-desc">{{ g.desc }}</span>
        </div>

        <div class="pg-tpl__grid">
        <a-card
          v-for="c in g.cards"
          :key="c.id"
          class="pg-tpl__card"
          :bordered="true"
          hoverable
          @click="router.push(c.route)"
        >
          <template #cover>
            <div class="pg-tpl__shot">
              <img :src="shots[c.id]" :alt="`${c.title} 预览缩略图`" loading="lazy" />
              <!-- 悬停遮罩：预览按钮收进这里，省掉卡片底部一整行
                   focus-within 一并触发，否则键盘 Tab 到按钮时它是不可见的 -->
              <div class="pg-tpl__overlay">
                <a-button type="primary" size="small">
                  预览
                  <template #icon><IconRight /></template>
                </a-button>
              </div>
            </div>
          </template>

          <div class="pg-tpl__card-head">
            <h3 class="pg-tpl__card-title">{{ c.title }}</h3>
            <a-tag v-if="c.status" size="small" :color="c.statusColor">{{ c.status }}</a-tag>
          </div>

          <p class="pg-tpl__card-when">{{ c.when }}</p>
        </a-card>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pg-tpl {
  background: var(--color-bg-1);
  min-height: 100%;
}

.pg-tpl__inner {
  max-width: 1120px;
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

/* ===== 分组 ===== */
.pg-tpl__group {
  margin-top: 32px;
}

.pg-tpl__group-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border-2);
}

.pg-tpl__group-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
}

/* 组内数量：轻量计数，不用 tag 免得抢标题的视觉重量 */
.pg-tpl__group-count {
  font-size: 13px;
  color: var(--color-text-3);
}

.pg-tpl__group-desc {
  margin-left: 4px;
  font-size: 13px;
  color: var(--color-text-3);
}

/* 列宽收窄（原 300 → 240）：1120 容器下由 3 列变 4 列，卡片整体更小、一屏能看全 */
.pg-tpl__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 16px;
  align-items: stretch;
}

/* ===== 等高的三个要点 ===== */
/* ① 卡片撑满网格单元 + 自身竖向 flex */
.pg-tpl__card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius-large);
  overflow: hidden;
  cursor: pointer;
}

/* ② card body 吃掉剩余高度；内边距收紧（Arco 默认 16px 上下偏松） */
.pg-tpl__card :deep(.arco-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 14px 14px;
}

/* ③ 截图区用固定宽高比，不用固定 px，窄屏也等比
 *    16/9 比原来的 16/10 更矮（图是 16:10 拍的，靠 object-fit: cover 裁掉底部一点，不用重拍） */
.pg-tpl__shot {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--color-fill-2);
  border-bottom: 1px solid var(--color-border-2);
}

/* 悬停遮罩：默认透明且不吃鼠标事件，hover / 键盘聚焦时浮现 */
.pg-tpl__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-mask-bg);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.pg-tpl__card:hover .pg-tpl__overlay,
.pg-tpl__card:focus-within .pg-tpl__overlay {
  opacity: 1;
  pointer-events: auto;
}

.pg-tpl__shot img {
  display: block;
  width: 100%;
  height: 100%;
  /* 从顶部裁：页头/操作栏在上半部分，居中裁会把最能辨识模板的区域切掉 */
  object-fit: cover;
  object-position: top center;
}

.pg-tpl__card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

/* 标题锁 1 行 */
.pg-tpl__card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 说明锁 2 行：line-clamp 截断 + min-height 占位，短文本也占满两行 → 卡片等高 */
.pg-tpl__card-when {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 20px;
  min-height: 40px;
  color: var(--color-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
