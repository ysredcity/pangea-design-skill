<script setup lang="ts">
/**
 * 图标 Icons
 * ------------------------------------------------------------------
 * 把图标包 @arco-iconbox/vue-pangea-mobile 的全部图标按 Figma 分类可视化。
 * - 分类数据：src/data/icon-catalog.json（由 scripts/build-icon-catalog.mjs 生成，
 *   分类事实源 = Figma「Pangea Icons Library」，图标事实源 = 图标包实际导出）
 * - 点击图标块即复制其组件名（如 IconArrowUp），可直接用于 import
 * - 排列参考 lucide.dev/icons（无左侧筛选栏，仅顶部搜索 + 分类分区）
 */
import { computed, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import * as PangeaIcons from '@arco-iconbox/vue-pangea-mobile';
import { IconSearch, IconCheck } from '@arco-iconbox/vue-pangea-mobile';
import catalog from '@/data/icon-catalog.json';

interface IconItem {
  name: string;
  component: string;
}
interface IconCategory {
  key: string;
  title: string;
  icons: IconItem[];
}

const iconMap = PangeaIcons as unknown as Record<string, unknown>;
const categories = catalog.categories as IconCategory[];
const totalCount = categories.reduce((s, c) => s + c.icons.length, 0);

// ── 搜索（同时匹配 kebab 名与组件名）──
const keyword = ref('');
const filtered = computed<IconCategory[]>(() => {
  const kw = keyword.value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!kw) return categories;
  return categories
    .map((c) => ({
      ...c,
      icons: c.icons.filter(
        (i) =>
          i.name.replace(/[^a-z0-9]/g, '').includes(kw) ||
          i.component.toLowerCase().includes(kw),
      ),
    }))
    .filter((c) => c.icons.length > 0);
});
const matchedCount = computed(() => filtered.value.reduce((s, c) => s + c.icons.length, 0));

// ── 点击复制组件名 ──
const copied = ref('');
let timer: ReturnType<typeof setTimeout> | undefined;

async function copy(item: IconItem) {
  const text = item.component;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // 降级：非安全上下文（http/file）下 clipboard API 不可用
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    copied.value = text;
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = ''), 1200);
    Message.success({ content: `已复制 ${text}`, duration: 1500 });
  } catch {
    Message.error('复制失败，请手动选择文本');
  }
}

function scrollTo(key: string) {
  document.getElementById(`cat-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
</script>

<template>
  <div class="pg-icons">
    <div class="pg-icons__inner">
      <!-- 页头 -->
      <header class="pg-icons__head">
        <h1 class="pg-icons__title">图标 Icons</h1>
        <p class="pg-icons__desc">
          共 <strong>{{ totalCount }}</strong> 个图标，全部来自图标包
          <code>@arco-iconbox/vue-pangea-mobile</code>，按 Figma 图标库分类整理。
          <strong>点击任意图标即复制其组件名</strong>，可直接用于导入。
        </p>
        <div class="pg-icons__usage">
          <code>import { IconArrowUp } from '@arco-iconbox/vue-pangea-mobile'</code>
        </div>
      </header>

      <!-- 搜索 + 分类跳转 -->
      <div class="pg-icons__toolbar">
        <a-input
          v-model="keyword"
          class="pg-icons__search"
          placeholder="搜索图标名，如 arrow / user / file"
          allow-clear
        >
          <template #prefix><IconSearch /></template>
        </a-input>
        <div class="pg-icons__anchors">
          <button
            v-for="c in categories"
            :key="c.key"
            class="pg-icons__anchor"
            type="button"
            @click="scrollTo(c.key)"
          >
            {{ c.title }}
            <span class="pg-icons__anchor-num">{{ c.icons.length }}</span>
          </button>
        </div>
      </div>

      <!-- 搜索结果计数 -->
      <p v-if="keyword.trim()" class="pg-icons__result">
        匹配 <strong>{{ matchedCount }}</strong> 个图标
      </p>

      <!-- 分类分区 -->
      <section v-for="c in filtered" :id="`cat-${c.key}`" :key="c.key" class="pg-icons__section">
        <h2 class="pg-icons__h2">
          {{ c.title }}
          <span class="pg-icons__count">{{ c.icons.length }}</span>
        </h2>
        <div class="pg-icons__grid">
          <button
            v-for="item in c.icons"
            :key="item.component"
            class="pg-icons__cell"
            :class="{ 'is-copied': copied === item.component }"
            type="button"
            :title="`${item.component}（点击复制）`"
            @click="copy(item)"
          >
            <span class="pg-icons__glyph">
              <IconCheck v-if="copied === item.component" />
              <component :is="iconMap[item.component]" v-else />
            </span>
            <span class="pg-icons__name">{{ item.name }}</span>
          </button>
        </div>
      </section>

      <!-- 空结果 -->
      <a-empty v-if="keyword.trim() && matchedCount === 0" class="pg-icons__empty">
        没有匹配「{{ keyword }}」的图标
      </a-empty>
    </div>
  </div>
</template>

<style scoped>
.pg-icons {
  background: var(--color-bg-1);
  min-height: 100%;
}

.pg-icons__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 32px 56px;
}

/* 页头 */
.pg-icons__title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-1);
}

.pg-icons__desc {
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-icons__desc strong {
  color: var(--color-text-1);
}

.pg-icons__desc code,
.pg-icons__usage code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
  color: rgb(var(--primary-7));
  background: var(--color-fill-2);
  border-radius: var(--border-radius-small);
  padding: 1px 6px;
}

.pg-icons__usage {
  margin-top: 12px;
  padding: 10px 14px;
  background: var(--color-fill-1);
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-medium);
}

.pg-icons__usage code {
  background: transparent;
  padding: 0;
  color: var(--color-text-2);
}

/* 工具栏：搜索 + 分类锚点（吸顶） */
.pg-icons__toolbar {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin: 24px 0 8px;
  padding: 12px 0;
  background: var(--color-bg-1);
  border-bottom: 1px solid var(--color-border-2);
}

.pg-icons__search {
  width: 300px;
  max-width: 100%;
}

.pg-icons__anchors {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pg-icons__anchor {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  font-size: 13px;
  color: var(--color-text-2);
  background: var(--color-fill-1);
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

.pg-icons__anchor:hover {
  color: rgb(var(--primary-6));
  background: var(--color-bg-1);
  border-color: rgba(var(--primary-6), 0.5);
}

.pg-icons__anchor-num {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  color: var(--color-text-3);
}

.pg-icons__result {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--color-text-3);
}

.pg-icons__result strong {
  color: rgb(var(--primary-6));
}

/* 分区 */
.pg-icons__section {
  margin-top: 32px;
  scroll-margin-top: 72px;
}

.pg-icons__h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-icons__count {
  padding: 1px 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
  font-weight: 400;
  color: rgb(var(--primary-7));
  background: rgba(var(--primary-6), 0.1);
  border-radius: var(--border-radius-medium);
}

/* 图标网格 */
.pg-icons__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
  gap: 8px;
}

.pg-icons__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 16px 6px 12px;
  background: var(--color-bg-1);
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.15s;
}

.pg-icons__cell:hover {
  background: var(--color-fill-1);
  border-color: rgba(var(--primary-6), 0.6);
  transform: translateY(-2px);
}

.pg-icons__cell:focus-visible {
  outline: 2px solid rgb(var(--primary-6));
  outline-offset: 1px;
}

.pg-icons__cell.is-copied {
  border-color: rgb(var(--primary-6));
  background: rgba(var(--primary-6), 0.08);
}

.pg-icons__glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  font-size: 22px;
  color: var(--color-text-1);
}

.pg-icons__cell:hover .pg-icons__glyph,
.pg-icons__cell.is-copied .pg-icons__glyph {
  color: rgb(var(--primary-6));
}

.pg-icons__name {
  width: 100%;
  font-size: 11px;
  line-height: 1.4;
  color: var(--color-text-3);
  text-align: center;
  overflow-wrap: anywhere;
}

.pg-icons__empty {
  margin-top: 40px;
}

@media (max-width: 768px) {
  .pg-icons__inner {
    padding: 32px 20px 48px;
  }
  .pg-icons__search {
    width: 100%;
  }
  .pg-icons__grid {
    grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
  }
}
</style>
