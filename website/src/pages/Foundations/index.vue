<script setup lang="ts">
/**
 * 设计基础 Foundations
 * ------------------------------------------------------------------
 * 颜色 / 圆角是【运行时 CSS 变量】——直接用变量渲染色块，并在挂载后读 getComputedStyle
 * 把解析后的真实值显示出来（体现「颜色 + 圆角是运行时变量」这一事实）。
 * 字号 / 字重 / 间距 / 阴影仅 Less 变量（无运行时 CSS 变量），此处按 Pangea 档位做静态参考预览。
 */
import { reactive, onMounted } from 'vue';

// —— 完整调色板（品牌主色 + 全部 14 个基础色系，每系 10 阶）——
// 这些都是主题包注入的运行时 CSS 变量 rgb(var(--<hue>-<n>))；-6 阶为标准色。
const paletteHues = [
  { hue: 'primary', label: '品牌主色 Primary' },
  { hue: 'red', label: '红 Red' },
  { hue: 'orangered', label: '橙红 OrangeRed' },
  { hue: 'orange', label: '橙 Orange' },
  { hue: 'gold', label: '金 Gold' },
  { hue: 'yellow', label: '黄 Yellow' },
  { hue: 'lime', label: '黄绿 Lime' },
  { hue: 'green', label: '绿 Green' },
  { hue: 'cyan', label: '青 Cyan' },
  { hue: 'blue', label: '蓝 Blue' },
  { hue: 'arcoblue', label: '极客蓝 ArcoBlue' },
  { hue: 'purple', label: '紫 Purple' },
  { hue: 'pinkpurple', label: '粉紫 PinkPurple' },
  { hue: 'magenta', label: '洋红 Magenta' },
  { hue: 'gray', label: '中性灰 Gray' },
];
const paletteSteps = Array.from({ length: 10 }, (_, i) => i + 1);

// —— 语义色 token ——
const semanticGroups = [
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
      { name: '--color-fill-4', expr: 'var(--color-fill-4)' },
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
    group: '状态色 Status（语义映射）',
    items: [
      { name: 'success / green-6', expr: 'rgb(var(--green-6))' },
      { name: 'danger / red-6', expr: 'rgb(var(--red-6))' },
      { name: 'warning / orange-6', expr: 'rgb(var(--orange-6))' },
      { name: 'info / arcoblue-6', expr: 'rgb(var(--arcoblue-6))' },
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

// 挂载后读取解析值（颜色转 hex 展示；并按亮度决定文字色，浅色块用深字、深色块用浅字）
const resolved = reactive<Record<string, string>>({});
const isDark = reactive<Record<string, boolean>>({});

function parseRgb(str: string): [number, number, number] | null {
  const m = str.match(/(\d+(?:\.\d+)?)/g);
  if (!m || m.length < 3) return null;
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}
function toHex(str: string): string {
  const rgb = parseRgb(str);
  if (!rgb) return str;
  return '#' + rgb.map((x) => Math.round(x).toString(16).padStart(2, '0')).join('').toUpperCase();
}
function luminance(str: string): number {
  const rgb = parseRgb(str);
  if (!rgb) return 255;
  return 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
}

onMounted(() => {
  document.querySelectorAll<HTMLElement>('[data-token]').forEach((el) => {
    const name = el.getAttribute('data-token') as string;
    const cs = getComputedStyle(el);
    if (el.getAttribute('data-kind') === 'radius') {
      resolved[name] = cs.borderTopLeftRadius;
    } else {
      const bg = cs.backgroundColor;
      resolved[name] = toHex(bg);
      isDark[name] = luminance(bg) < 150;
    }
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

      <!-- 完整调色板 -->
      <section class="pg-foundations__section">
        <h2 class="pg-foundations__h2">调色板 Palette</h2>
        <p class="pg-foundations__note">
          品牌主色 + 14 个基础色系，每系 10 阶（由浅到深，<strong>第 6 阶为标准色</strong>，标「主」）。
          均为主题包注入的运行时变量 <code>rgb(var(--&lt;hue&gt;-&lt;n&gt;))</code>；色值为页面实时解析。
        </p>
        <div class="pg-foundations__palette">
          <div v-for="h in paletteHues" :key="h.hue" class="pg-foundations__pal-row">
            <div class="pg-foundations__pal-label">
              <span class="pg-foundations__pal-name">{{ h.label }}</span>
              <span class="pg-foundations__pal-var">--{{ h.hue }}</span>
            </div>
            <div class="pg-foundations__pal-scale">
              <div
                v-for="n in paletteSteps"
                :key="n"
                class="pg-foundations__pal-cell"
                :class="{ 'is-std': n === 6 }"
                :data-token="`${h.hue}-${n}`"
                :style="{ background: `rgb(var(--${h.hue}-${n}))` }"
                :title="`--${h.hue}-${n}  ${resolved[`${h.hue}-${n}`] || ''}`"
              >
                <span
                  class="pg-foundations__pal-cell-inner"
                  :style="{ color: isDark[`${h.hue}-${n}`] ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.82)' }"
                >
                  <span class="pg-foundations__pal-step">{{ n }}<template v-if="n === 6"> 主</template></span>
                  <span class="pg-foundations__pal-hex">{{ resolved[`${h.hue}-${n}`] || '' }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 语义色 -->
      <section class="pg-foundations__section">
        <h2 class="pg-foundations__h2">语义色 Semantic</h2>
        <p class="pg-foundations__note">界面与组件只引用语义 token；下方色值为页面实时解析。</p>
        <div v-for="g in semanticGroups" :key="g.group" class="pg-foundations__group">
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

.pg-foundations__note code {
  padding: 1px 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
  color: rgb(var(--primary-7));
  background: var(--color-fill-2);
  border-radius: var(--border-radius-small);
}

/* 调色板：每系一行连续色块（1px 分隔线保证浅色也可见），块内显示阶数 + 实时 hex */
.pg-foundations__palette {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pg-foundations__pal-row {
  display: flex;
  align-items: stretch;
  gap: 16px;
}

.pg-foundations__pal-label {
  flex: none;
  width: 132px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.pg-foundations__pal-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-1);
}

.pg-foundations__pal-var {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  color: var(--color-text-3);
}

/* gap:1px + 底色 = 每格之间 1px 分隔线，浅色块也不会与白底/邻格糊在一起 */
.pg-foundations__pal-scale {
  display: flex;
  flex: 1;
  min-width: 0;
  gap: 1px;
  background: var(--color-border-2);
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-medium);
  overflow: hidden;
}

.pg-foundations__pal-cell {
  flex: 1;
  min-width: 0;
}

.pg-foundations__pal-cell-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 60px;
  padding: 4px 2px;
  white-space: nowrap;
  overflow: hidden;
}

.pg-foundations__pal-step {
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
}

.is-std .pg-foundations__pal-step {
  font-weight: 700;
}

.pg-foundations__pal-hex {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10px;
  line-height: 1;
  opacity: 0.85;
}

@media (max-width: 900px) {
  .pg-foundations__pal-hex {
    display: none;
  }
  .pg-foundations__pal-cell-inner {
    height: 44px;
  }
}

@media (max-width: 640px) {
  .pg-foundations__pal-row {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }
  .pg-foundations__pal-label {
    width: auto;
    flex-direction: row;
    gap: 8px;
    align-items: baseline;
  }
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
