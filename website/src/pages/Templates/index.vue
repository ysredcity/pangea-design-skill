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

/**
 * 展示顺序 = **使用顺序**（列表 → 表单 → 详情 → 审批 → 仪表板），
 * 不是 catalog 的 id 字母序（那会让审批详情页排第一、简单列表页排第七）。
 */
const ORDER: { id: string; route: string }[] = [
  { id: 'page-simple-list', route: '/templates/simple-list' },
  { id: 'page-card-list', route: '/templates/card-list' },
  // 对话框表单没有独立页面：在简单列表页点「创建」弹出（缩略图只截对话框本体）
  { id: 'page-modal-form', route: '/templates/simple-list' },
  { id: 'page-form', route: '/templates/basic-form' },
  { id: 'page-grouped-form', route: '/templates/grouped-form' },
  { id: 'page-step-form', route: '/templates/step-form' },
  { id: 'page-detail', route: '/templates/detail' },
  { id: 'page-approval-detail', route: '/templates/approval-detail' },
];

/** 仪表板不是固化模板，不在 catalog 里，手工补一条挂在最后 */
const DASHBOARD = {
  id: 'dashboard',
  route: '/templates/dashboard',
  title: '仪表板（示例）',
  status: '示例',
  statusColor: 'arcoblue',
  when: '工作台聚合页 · KPI 卡 + 表格 + 占比条 + VChart 环形图 · 灰底无边框白卡',
  variants: ['非固化模板', '图表按需'],
};

const MAX_TAGS = 2; // 标签只留一行，超出用「+N」收起，避免换行把卡片顶高

const cards = computed(() => {
  const byId = new Map(catalog.pageTemplates.map((t) => [t.id, t]));
  const list = ORDER.flatMap((o) => {
    const t = byId.get(o.id);
    if (!t) return []; // catalog 里没有就跳过，不产生坏卡片
    const variants = t.variants || [];
    return [
      {
        id: t.id,
        route: o.route,
        title: t.title,
        status: t.status,
        statusColor: 'green',
        when: (t.whenToUse || []).join(' · '),
        tags: variants.slice(0, MAX_TAGS),
        more: Math.max(0, variants.length - MAX_TAGS),
      },
    ];
  });
  return [
    ...list,
    { ...DASHBOARD, tags: DASHBOARD.variants.slice(0, MAX_TAGS), more: 0 },
  ];
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

      <div class="pg-tpl__grid">
        <a-card
          v-for="c in cards"
          :key="c.id"
          class="pg-tpl__card"
          :bordered="true"
          hoverable
          @click="router.push(c.route)"
        >
          <template #cover>
            <div class="pg-tpl__shot">
              <img :src="shots[c.id]" :alt="`${c.title} 预览缩略图`" loading="lazy" />
            </div>
          </template>

          <div class="pg-tpl__card-head">
            <h3 class="pg-tpl__card-title">{{ c.title }}</h3>
            <a-tag v-if="c.status" size="small" :color="c.statusColor">{{ c.status }}</a-tag>
          </div>

          <p class="pg-tpl__card-when">{{ c.when }}</p>

          <div class="pg-tpl__variants">
            <a-tag v-for="v in c.tags" :key="v" size="small">{{ v }}</a-tag>
            <a-tag v-if="c.more" size="small">+{{ c.more }}</a-tag>
          </div>

          <div class="pg-tpl__card-foot">
            <!-- 整张卡也可点；按钮保留为可聚焦的正式控件（键盘可达） -->
            <a-button type="primary" size="small">
              预览
              <template #icon><IconRight /></template>
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

.pg-tpl__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 28px;
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

/* ② card body 吃掉剩余高度，内部同样竖向 flex，好让 footer 吸底 */
.pg-tpl__card :deep(.arco-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ③ 截图区用固定宽高比，不用固定 px，窄屏也等比 */
.pg-tpl__shot {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--color-fill-2);
  border-bottom: 1px solid var(--color-border-2);
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

/* 说明锁 2 行：line-clamp 截断 + min-height 占位，短文本也占满两行 */
.pg-tpl__card-when {
  margin: 8px 0 10px;
  font-size: 13px;
  line-height: 22px;
  min-height: 44px;
  color: var(--color-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 标签锁 1 行 */
.pg-tpl__variants {
  display: flex;
  gap: 6px;
  min-height: 24px;
  margin-bottom: 16px;
  overflow: hidden;
}

/* footer 吸底 → 同行/跨行的「预览」按钮都在同一水平线 */
.pg-tpl__card-foot {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
}
</style>
