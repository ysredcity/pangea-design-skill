<script setup lang="ts">
/**
 * 设计基础 Foundations
 * ------------------------------------------------------------------
 * 颜色 / 圆角是【运行时 CSS 变量】——直接用变量渲染色块，并在挂载后读 getComputedStyle
 * 把解析后的真实值显示出来（体现「颜色 + 圆角是运行时变量」这一事实）。
 * 字号 / 字重 / 间距 / 阴影仅 Less 变量（无运行时 CSS 变量），此处按 Pangea 档位做静态参考预览。
 */
import { reactive, onMounted } from 'vue';

// —— 颜色 token（用法即渲染表达式）——
const colorGroups = [
  {
    group: '品牌主色 Primary（rgb(var(--primary-n))）',
    items: Array.from({ length: 10 }, (_, i) => ({
      name: `--primary-${i + 1}`,
      expr: `rgb(var(--primary-${i + 1}))`,
    })),
  },
  {
    group: '文字 Text',
    items: [
      { name: '--color-text-1', expr: 'var(--color-text-1)' },
      { name: '--color-text-2', expr: 'var(--color-text-2)' },
      { name: '--color-text-3', expr: 'var(--color-text-3)' },
      { name: '--color-text-4', expr: 'var(--color-text-4)' },
    ],
  },
  {
    group: '背景 / 填充 Bg & Fill',
    items: [
      { name: '--color-bg-1', expr: 'var(--color-bg-1)' },
      { name: '--color-bg-2', expr: 'var(--color-bg-2)' },
      { name: '--color-fill-1', expr: 'var(--color-fill-1)' },
      { name: '--color-fill-2', expr: 'var(--color-fill-2)' },
      { name: '--color-fill-3', expr: 'var(--color-fill-3)' },
    ],
  },
  {
    group: '边框 Border',
    items: [
      { name: '--color-border-1', expr: 'var(--color-border-1)' },
      { name: '--color-border-2', expr: 'var(--color-border-2)' },
      { name: '--color-border-3', expr: 'var(--color-border-3)' },
      { name: '--color-border-4', expr: 'var(--color-border-4)' },
    ],
  },
  {
    group: '状态色 Status',
    items: [
      { name: 'success / green-6', expr: 'rgb(var(--green-6))' },
      { name: 'danger / red-6', expr: 'rgb(var(--red-6))' },
      { name: 'warning / orange-6', expr: 'rgb(var(--orange-6))' },
      { name: 'info / arcoblue-6', expr: 'rgb(var(--arcoblue-6))' },
    ],
  },
  {
    group: '扩展调色板（图表/分类，-6 阶）',
    items: [
      { name: 'arcoblue-6', expr: 'rgb(var(--arcoblue-6))' },
      { name: 'green-6', expr: 'rgb(var(--green-6))' },
      { name: 'orange-6', expr: 'rgb(var(--orange-6))' },
      { name: 'gold-6', expr: 'rgb(var(--gold-6))' },
      { name: 'purple-6', expr: 'rgb(var(--purple-6))' },
      { name: 'cyan-6', expr: 'rgb(var(--cyan-6))' },
      { name: 'magenta-6', expr: 'rgb(var(--magenta-6))' },
      { name: 'lime-6', expr: 'rgb(var(--lime-6))' },
    ],
  },
];

// —— 圆角 token（运行时 CSS 变量）——
const radii = [
  { name: '--border-radius-small', expr: 'var(--border-radius-small)' },
  { name: '--border-radius-medium', expr: 'var(--border-radius-medium)' },
  { name: '--border-radius-large', expr: 'var(--border-radius-large)' },
];

// —— 排版档位（Less 变量，静态参考）——
const typography = [
  { label: '标题 / 24px', px: 24, weight: 600 },
  { label: '标题 / 20px', px: 20, weight: 600 },
  { label: '副标题 / 16px', px: 16, weight: 600 },
  { label: '正文 / 14px', px: 14, weight: 400 },
  { label: '小正文 / 13px', px: 13, weight: 400 },
  { label: '辅助 / 12px', px: 12, weight: 400 },
];
const weights = [
  { label: 'Regular 400', weight: 400 },
  { label: 'Medium 500', weight: 500 },
  { label: 'Semibold 600', weight: 600 },
  { label: 'Bold 700', weight: 700 },
];

// —— 间距档位（4 的倍数，Less 变量，静态参考）——
const spacings = [2, 4, 6, 8, 12, 16, 24, 32];

// 挂载后读取解析值
const resolved = reactive<Record<string, string>>({});
onMounted(() => {
  document.querySelectorAll<HTMLElement>('[data-token]').forEach((el) => {
    const name = el.getAttribute('data-token') as string;
    const cs = getComputedStyle(el);
    resolved[name] = el.getAttribute('data-kind') === 'radius' ? cs.borderTopLeftRadius : cs.backgroundColor;
  });
});
</script>

<template>
  <div class="pg-foundations">
    <div class="pg-foundations__inner">
      <header class="pg-foundations__head">
        <h1 class="pg-foundations__title">设计基础</h1>
        <p class="pg-foundations__lede">
          Pangea 主题的设计 Token。<strong>颜色与圆角</strong>是运行时 CSS 变量（下方色值为页面实时解析）；
          字号 / 字重 / 间距仅 Less 变量，按档位静态参考。
        </p>
      </header>

      <!-- 颜色 -->
      <section class="pg-foundations__section">
        <h2 class="pg-foundations__h2">颜色 Color</h2>
        <div v-for="g in colorGroups" :key="g.group" class="pg-foundations__group">
          <div class="pg-foundations__group-title">{{ g.group }}</div>
          <div class="pg-foundations__swatches">
            <div v-for="it in g.items" :key="it.name" class="pg-foundations__swatch">
              <div class="pg-foundations__chip" :data-token="it.name" :style="{ background: it.expr }" />
              <div class="pg-foundations__swatch-name">{{ it.name }}</div>
              <div class="pg-foundations__swatch-val">{{ resolved[it.name] || '—' }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 圆角 -->
      <section class="pg-foundations__section">
        <h2 class="pg-foundations__h2">圆角 Radius</h2>
        <div class="pg-foundations__radii">
          <div v-for="r in radii" :key="r.name" class="pg-foundations__radius">
            <div class="pg-foundations__radius-box" data-kind="radius" :data-token="r.name" :style="{ borderRadius: r.expr }" />
            <div class="pg-foundations__swatch-name">{{ r.name }}</div>
            <div class="pg-foundations__swatch-val">{{ resolved[r.name] || '—' }}</div>
          </div>
        </div>
      </section>

      <!-- 排版 -->
      <section class="pg-foundations__section">
        <h2 class="pg-foundations__h2">排版 Typography</h2>
        <p class="pg-foundations__note">字号 / 字重是 Less 变量（无运行时 CSS 变量）；自定义样式时只写档位字面值。</p>
        <div class="pg-foundations__type-list">
          <div v-for="t in typography" :key="t.label" class="pg-foundations__type-row">
            <span class="pg-foundations__type-label">{{ t.label }}</span>
            <span class="pg-foundations__type-sample" :style="{ fontSize: t.px + 'px', fontWeight: t.weight }">
              海信 Pangea 设计系统 Aa 123
            </span>
          </div>
        </div>
        <div class="pg-foundations__weights">
          <span v-for="w in weights" :key="w.label" class="pg-foundations__weight" :style="{ fontWeight: w.weight }">
            {{ w.label }}
          </span>
        </div>
      </section>

      <!-- 间距 -->
      <section class="pg-foundations__section">
        <h2 class="pg-foundations__h2">间距 Spacing</h2>
        <p class="pg-foundations__note">4 的倍数档位（Less 变量）。</p>
        <div class="pg-foundations__spacings">
          <div v-for="s in spacings" :key="s" class="pg-foundations__spacing">
            <div class="pg-foundations__spacing-bar" :style="{ width: s + 'px' }" />
            <span class="pg-foundations__spacing-label">{{ s }}px</span>
          </div>
        </div>
      </section>

      <!-- 阴影 -->
      <section class="pg-foundations__section">
        <h2 class="pg-foundations__h2">阴影 Shadow</h2>
        <p class="pg-foundations__note">灰底上白卡的区隔用极轻阴影（示例）。</p>
        <div class="pg-foundations__shadow-demo">
          <div class="pg-foundations__shadow-card">极轻阴影 · 0 1px 4px rgba(0,0,0,0.05)</div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pg-foundations {
  background: var(--color-bg-1);
  min-height: 100%;
}

.pg-foundations__inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 32px 56px;
}

.pg-foundations__title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-1);
}

.pg-foundations__lede {
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-foundations__lede strong {
  color: var(--color-text-1);
}

.pg-foundations__section {
  margin-top: 40px;
}

.pg-foundations__h2 {
  margin: 0 0 4px;
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-foundations__note {
  margin: 4px 0 16px;
  font-size: 13px;
  color: var(--color-text-3);
}

.pg-foundations__group {
  margin-top: 20px;
}

.pg-foundations__group-title {
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-2);
}

.pg-foundations__swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.pg-foundations__chip {
  height: 56px;
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--color-border-2);
}

.pg-foundations__swatch-name {
  margin-top: 6px;
  font-size: 12px;
  color: var(--color-text-1);
}

.pg-foundations__swatch-val {
  font-size: 11px;
  color: var(--color-text-3);
}

.pg-foundations__radii {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.pg-foundations__radius-box {
  width: 96px;
  height: 64px;
  background: rgba(var(--primary-6), 0.12);
  border: 1px solid rgb(var(--primary-6));
}

.pg-foundations__type-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.pg-foundations__type-row {
  display: flex;
  align-items: baseline;
  gap: 20px;
}

.pg-foundations__type-label {
  flex-shrink: 0;
  width: 120px;
  font-size: 12px;
  color: var(--color-text-3);
}

.pg-foundations__type-sample {
  color: var(--color-text-1);
}

.pg-foundations__weights {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 20px;
}

.pg-foundations__weight {
  font-size: 16px;
  color: var(--color-text-1);
}

.pg-foundations__spacings {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pg-foundations__spacing {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pg-foundations__spacing-bar {
  height: 16px;
  background: rgb(var(--primary-6));
  border-radius: var(--border-radius-small);
}

.pg-foundations__spacing-label {
  font-size: 12px;
  color: var(--color-text-3);
}

.pg-foundations__shadow-demo {
  padding: 24px;
  background: var(--color-fill-2);
  border-radius: var(--border-radius-large);
}

.pg-foundations__shadow-card {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88px;
  background: var(--color-bg-1);
  border-radius: var(--border-radius-large);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  font-size: 13px;
  color: var(--color-text-2);
}
</style>
