<script setup lang="ts">
/**
 * 首页 / 产品介绍（科技感重构）
 * ------------------------------------------------------------------
 * 本页本身用 Pangea 设计系统（Arco + Pangea 主题 + GlobalLayout）构建，即 skill 效果的样例（dogfood）。
 * 统计数字 / 页面模板列表来自同步自 skill 的 catalog.json。
 * 视觉：企业级 Swiss 栅格 + 克制的科技感（等宽 kicker、网格/光晕背景、玻璃卡+强调线、
 *       流程 stepper、终端块、能力对比矩阵）。所有颜色/圆角均走 Pangea Token，可过 gate。
 */
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IconLayout,
  IconPuzzle,
  IconCheckCircle,
  IconDashboard,
  IconThunderbolt,
  IconCode,
  IconRight,
  IconCheck,
  IconClose,
  IconCommand,
  IconApps,
  IconPalette,
  IconGithub,
  IconFile,
} from '@arco-iconbox/vue-pangea-mobile';
import catalog from '@/generated/catalog.json';

const router = useRouter();

const SKILL_URL = 'https://github.com/ysredcity/pangea-design-skill/tree/main/skills/pangea-design-vue';

// ── Hero 统计 ──
const stats = [
  { value: String(catalog.counts.pageTemplates), label: '页面模板' },
  { value: String(catalog.counts.components), label: '组件选型' },
  { value: '8', label: '质量门禁' },
  { value: '72', label: '组件文档' },
];

// ── 为什么需要（痛点 → 解法）──
const pains = [
  {
    icon: IconPalette,
    problem: 'AI 直接生成的界面风格各异，难符合海信企业规范',
    solution: '主题包运行时为唯一 Token 事实源，青绿品牌一致',
  },
  {
    icon: IconPuzzle,
    problem: '组件随意堆砌甚至自造，交接后难以维护',
    solution: '只用 Arco Vue 组件 + 选型元数据，选型有据可依',
  },
  {
    icon: IconCode,
    problem: '产出停在「看着像」的 demo，无法直接进开发',
    solution: '产出可运行 Vue 工程 + G1–G8 质量门禁，直接交付',
  },
];

// ── 能做什么 ──
const capabilities = [
  { icon: IconLayout, title: '页面模板套用', desc: '列表 / 卡片 / 表单 / 分组表单等场景，按匹配度直接套用或增补，不从零设计。' },
  { icon: IconPuzzle, title: '组件选型元数据', desc: '组件与模板标注「适用任务 / 变体 / 组合边界」，让 AI 与人选型有据可依。' },
  { icon: IconCheckCircle, title: '生成后质量门禁', desc: 'G1–G8 自检：编译、Token、组件与图标分工、响应式、背景分层、交互四态、可访问性、生成层级。' },
  { icon: IconDashboard, title: '响应式 & 背景分层', desc: 'Arco Grid 断点 + 卡片自适应网格；灰底 + 白卡的背景分层，多端一致。' },
  { icon: IconThunderbolt, title: '图表按需引入', desc: 'VChart 不进基础依赖，通过懒加载封装按需启用，保持工程轻量。' },
  { icon: IconCode, title: '可运行工程交付', desc: '产出完整 Vue 3 工程（页面 / 路由 / 组件 / 主题），可 degit 起步、直接开发交付。' },
];

// ── 它是怎么工作的（流程）──
const steps = [
  { icon: IconCommand, title: '描述需求', desc: '用自然语言说明页面 / 业务，或直接给出 PRD。' },
  { icon: IconFile, title: '需求规格化', desc: '先把输入转成界面架构需求文档，少量澄清后由你确认。' },
  { icon: IconApps, title: '决策树匹配', desc: '按场景与模板匹配度决定「套用 / 增补 / 自主设计」。' },
  { icon: IconCode, title: '规范生成', desc: '只用 Pangea 组件 + Token 生成可运行页面与路由。' },
  { icon: IconCheckCircle, title: '门禁自检', desc: 'G1–G8 + npm run gate 通过后再交付。' },
];

// 终端演示行
const termLines = [
  { kind: 'cmd', text: '描述：新建「合同列表」页面' },
  { kind: 'note', text: '规格化需求 → 确认界面架构（模块 / 菜单 / 页面）' },
  { kind: 'note', text: '匹配「简单列表页」模板（决策树）' },
  { kind: 'note', text: '生成 src/pages/ContractList + 注册路由 / 菜单' },
  { kind: 'ok', text: 'gate 通过：Token / 组件 / 响应式 / 可访问性' },
];

// ── 适合谁（双受众）──
const audiences = [
  {
    icon: IconThunderbolt,
    role: '产品经理',
    title: '高保真 Demo',
    tag: 'mock 数据',
    points: ['用 mock 数据快速出原型，评审 / 对齐 / 演示', 'PM Demo 模式：Kiro hooks 全托管', '只需对话 + 浏览器预览，不碰终端'],
  },
  {
    icon: IconCode,
    role: '开发工程师',
    title: '可交付 UI',
    tag: '真实接口',
    points: ['基于 PRD 产出符合规范的界面', '对接真实接口（纯前端，不含后端）', 'degit 一键起工程，直接开发交付'],
  },
];

// ── 页面模板一览 ──
const templates = catalog.pageTemplates.map((t) => ({
  title: t.title,
  desc: t.whenToUse?.[0] ?? '',
  tags: t.tags ?? [],
}));

// ── 与直接让 AI 写前端的区别 ──
const compareRows = [
  { dim: '视觉一致性', plain: '每次风格不同、容易跑偏', pangea: '主题包 Token 唯一事实源，稳定一致' },
  { dim: '规范符合度', plain: '取决于模型发挥', pangea: '强制 Arco + Pangea，字号字重间距落档位' },
  { dim: '组件选型', plain: '随机使用甚至自造组件', pangea: '选型元数据标注适用 / 边界，有据可依' },
  { dim: '可交付性', plain: 'demo 感重、难以落地', pangea: '可运行工程 + G1–G8 质量门禁' },
  { dim: '可维护性', plain: '一次性代码、结构随意', pangea: '标准工程结构 + 固定生成层级' },
  { dim: '响应式 / 多端', plain: '常被忽略', pangea: '全局准则：Grid 断点 + 自适应网格' },
];

// ── 核心机制 ──
const mechanisms = [
  { k: '需求先规格化', v: '任意颗粒度输入先转成界面架构需求文档、少量澄清并经你确认后再逐页生成，降低输入差异带来的质量波动。' },
  { k: 'Skill 是唯一事实源', v: '规则、Token、组件与模板元数据、质量门禁都收敛在 skill 内；本官网只是它的 showcase 快照。' },
  { k: '页面生成决策树', v: '按场景与模板匹配度决定「套模板 / 增补 / AI 自主设计」，自主设计也必须用设计系统组件 + Token。' },
  { k: '元数据驱动选型', v: '模板与组件的适用任务、变体、组合边界结构化沉淀，供 AI 与人对照。' },
  { k: '门禁保交付', v: '生成后按 G1–G8 自检 + npm run gate，保证产出可交付。' },
  { k: '本站即样例', v: '这个官网就是照着 skill、用同一套 GlobalLayout 与 Pangea 主题构建的（dogfood）。' },
];

// ── 轻量滚动进场（无 JS 依赖，降级安全；尊重 prefers-reduced-motion）──
onMounted(() => {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const els = Array.from(document.querySelectorAll('.pg-reveal')) as HTMLElement[];
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('pg-reveal--in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('pg-reveal--in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  els.forEach((el) => io.observe(el));
});

function go(path: string) {
  router.push(path);
}
function openSkill() {
  window.open(SKILL_URL, '_blank', 'noopener');
}
</script>

<template>
  <div class="pg-home">
    <!-- ═══════════ Hero ═══════════ -->
    <section class="pg-home__hero">
      <div class="pg-home__grid-bg" aria-hidden="true"></div>
      <div class="pg-home__glow pg-home__glow--a" aria-hidden="true"></div>
      <div class="pg-home__glow pg-home__glow--b" aria-hidden="true"></div>

      <div class="pg-home__hero-inner pg-reveal">
        <span class="pg-home__kicker">
          <i class="pg-home__kicker-dot" aria-hidden="true"></i>
          海信集团 · B 端 / 中后台设计系统
        </span>
        <h1 class="pg-home__title">Pangea&nbsp;Design</h1>
        <p class="pg-home__lede">让 AI 按规范生成，产出可交付的 B 端 / 中后台前端工程。</p>
        <p class="pg-home__sub">
          基于 <code>@arco-design/web-vue</code> + 定制主题包 <code>@arco-themes/vue-pangea-3-linear</code>，
          以设计系统约束 AI 生成，让需求落进代码、让结果直接进入开发交付。
        </p>

        <a-space :size="12" class="pg-home__cta" wrap>
          <a-button type="primary" size="large" @click="openSkill">
            获取 Skill
            <template #icon><IconGithub /></template>
          </a-button>
          <a-button size="large" @click="go('/guide')">使用指南</a-button>
        </a-space>

        <div class="pg-home__stats">
          <div v-for="s in stats" :key="s.label" class="pg-home__stat">
            <span class="pg-home__stat-value">{{ s.value }}</span>
            <span class="pg-home__stat-label">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ 为什么需要 ═══════════ -->
    <section class="pg-home__section pg-reveal">
      <span class="pg-home__eyebrow">// 01 &nbsp;为什么需要</span>
      <h2 class="pg-home__h2">别再让 AI「凭感觉」写前端</h2>
      <p class="pg-home__section-desc">直接让大模型生成界面，往往踩中三类问题——Pangea Design 用设计系统逐一约束。</p>
      <div class="pg-home__pain-grid">
        <article v-for="p in pains" :key="p.problem" class="pg-home__pain">
          <div class="pg-home__pain-icon"><component :is="p.icon" /></div>
          <div class="pg-home__pain-row pg-home__pain-row--bad">
            <IconClose class="pg-home__pain-mark pg-home__pain-mark--bad" />
            <span>{{ p.problem }}</span>
          </div>
          <div class="pg-home__pain-row pg-home__pain-row--good">
            <IconCheck class="pg-home__pain-mark pg-home__pain-mark--good" />
            <span>{{ p.solution }}</span>
          </div>
        </article>
      </div>
    </section>

    <!-- ═══════════ 能做什么 ═══════════ -->
    <section class="pg-home__section pg-reveal">
      <span class="pg-home__eyebrow">// 02 &nbsp;能做什么</span>
      <h2 class="pg-home__h2">从设计系统到真实工程</h2>
      <p class="pg-home__section-desc">覆盖生成、约束与交付的关键环节。</p>
      <div class="pg-home__grid">
        <article v-for="(c, i) in capabilities" :key="c.title" class="pg-home__card">
          <span class="pg-home__card-index">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="pg-home__card-icon"><component :is="c.icon" /></div>
          <h3 class="pg-home__card-title">{{ c.title }}</h3>
          <p class="pg-home__card-desc">{{ c.desc }}</p>
        </article>
      </div>
    </section>

    <!-- ═══════════ 它是怎么工作的 ═══════════ -->
    <section class="pg-home__section pg-home__section--muted">
      <div class="pg-home__section-wrap pg-reveal">
        <span class="pg-home__eyebrow">// 03 &nbsp;怎么工作</span>
        <h2 class="pg-home__h2">从一句话到可交付</h2>
        <p class="pg-home__section-desc">「先规格化需求、再按规范生成」是贯穿始终的主线。</p>

        <ol class="pg-home__steps">
          <li v-for="(s, i) in steps" :key="s.title" class="pg-home__step">
            <div class="pg-home__step-node">
              <component :is="s.icon" />
              <span class="pg-home__step-no">{{ i + 1 }}</span>
            </div>
            <h3 class="pg-home__step-title">{{ s.title }}</h3>
            <p class="pg-home__step-desc">{{ s.desc }}</p>
          </li>
        </ol>

        <div class="pg-home__terminal" role="img" aria-label="生成流程示意终端输出">
          <div class="pg-home__terminal-bar">
            <span class="pg-home__terminal-dot"></span>
            <span class="pg-home__terminal-dot"></span>
            <span class="pg-home__terminal-dot"></span>
            <span class="pg-home__terminal-name">pangea-design · agent</span>
          </div>
          <div class="pg-home__terminal-body">
            <p v-for="(l, i) in termLines" :key="i" class="pg-home__term-line" :class="`pg-home__term-line--${l.kind}`">
              <span class="pg-home__term-sign">{{ l.kind === 'cmd' ? '$' : l.kind === 'ok' ? '✓' : '›' }}</span>
              {{ l.text }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ 适合谁 ═══════════ -->
    <section class="pg-home__section pg-reveal">
      <span class="pg-home__eyebrow">// 04 &nbsp;适合谁</span>
      <h2 class="pg-home__h2">同一套产物，服务两类使用者</h2>
      <p class="pg-home__section-desc">产物结构一致，差别只在数据来源。</p>
      <div class="pg-home__audience">
        <article v-for="a in audiences" :key="a.role" class="pg-home__aud-card">
          <div class="pg-home__aud-head">
            <div class="pg-home__aud-icon"><component :is="a.icon" /></div>
            <div>
              <p class="pg-home__aud-role">{{ a.role }}</p>
              <h3 class="pg-home__aud-title">{{ a.title }}</h3>
            </div>
            <span class="pg-home__aud-tag">{{ a.tag }}</span>
          </div>
          <ul class="pg-home__aud-list">
            <li v-for="pt in a.points" :key="pt">
              <IconCheck class="pg-home__aud-check" />
              <span>{{ pt }}</span>
            </li>
          </ul>
        </article>
      </div>
    </section>

    <!-- ═══════════ 页面模板一览 ═══════════ -->
    <section class="pg-home__section pg-reveal">
      <span class="pg-home__eyebrow">// 05 &nbsp;页面模板</span>
      <div class="pg-home__h2-row">
        <h2 class="pg-home__h2">开箱即用的页面模板</h2>
        <a-link @click="go('/templates')">全部模板 <IconRight /></a-link>
      </div>
      <p class="pg-home__section-desc">基于 Figma 设计稿沉淀，数据取自 skill 的 catalog。</p>
      <div class="pg-home__tpl-grid">
        <article v-for="t in templates" :key="t.title" class="pg-home__tpl">
          <div class="pg-home__tpl-mark"><IconLayout /></div>
          <h3 class="pg-home__tpl-title">{{ t.title }}</h3>
          <p class="pg-home__tpl-desc">{{ t.desc }}</p>
          <div class="pg-home__tpl-tags">
            <span v-for="tag in t.tags" :key="tag" class="pg-home__chip">{{ tag }}</span>
          </div>
        </article>
      </div>
    </section>

    <!-- ═══════════ 与普通 AI 生成的区别 ═══════════ -->
    <section class="pg-home__section pg-home__section--muted">
      <div class="pg-home__section-wrap pg-reveal">
        <span class="pg-home__eyebrow">// 06 &nbsp;有何不同</span>
        <h2 class="pg-home__h2">和直接让 AI 写前端的区别</h2>
        <p class="pg-home__section-desc">同样是 AI 生成，约束与交付质量是两回事。</p>
        <div class="pg-home__compare">
          <table class="pg-home__compare-table">
            <thead>
              <tr>
                <th scope="col">维度</th>
                <th scope="col">普通 AI 生成</th>
                <th scope="col" class="pg-home__compare-hl">
                  <span class="pg-home__compare-hl-dot" aria-hidden="true"></span>Pangea Design
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in compareRows" :key="r.dim">
                <th scope="row">{{ r.dim }}</th>
                <td class="pg-home__compare-plain">
                  <IconClose class="pg-home__compare-x" />{{ r.plain }}
                </td>
                <td class="pg-home__compare-hl">
                  <IconCheck class="pg-home__compare-c" />{{ r.pangea }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ═══════════ 核心机制 ═══════════ -->
    <section class="pg-home__section pg-reveal">
      <span class="pg-home__eyebrow">// 07 &nbsp;核心机制</span>
      <h2 class="pg-home__h2">设计理念</h2>
      <ul class="pg-home__mech">
        <li v-for="(m, i) in mechanisms" :key="m.k" class="pg-home__mech-item">
          <span class="pg-home__mech-no">{{ String(i + 1).padStart(2, '0') }}</span>
          <div>
            <strong class="pg-home__mech-k">{{ m.k }}</strong>
            <span class="pg-home__mech-v">{{ m.v }}</span>
          </div>
        </li>
      </ul>
    </section>

  </div>
</template>

<style scoped>
.pg-home {
  --pg-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  background: var(--color-bg-1);
  min-height: 100%;
}

/* ═══════════ 通用装饰：网格底 & 光晕 ═══════════ */
.pg-home__grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(var(--primary-6), 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--primary-6), 0.05) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 100%);
  pointer-events: none;
}

.pg-home__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  pointer-events: none;
}

.pg-home__glow--a {
  top: -120px;
  left: -80px;
  width: 420px;
  height: 420px;
  background: rgba(var(--primary-6), 0.18);
}

.pg-home__glow--b {
  top: 40px;
  right: -120px;
  width: 360px;
  height: 360px;
  background: rgba(var(--primary-6), 0.1);
}

/* ═══════════ Hero ═══════════ */
.pg-home__hero {
  position: relative;
  overflow: hidden;
  padding: 88px 32px 72px;
  border-bottom: 1px solid var(--color-border-2);
}

.pg-home__hero-inner {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
}

.pg-home__kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  font-family: var(--pg-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: rgb(var(--primary-7));
  background: rgba(var(--primary-6), 0.08);
  border: 1px solid rgba(var(--primary-6), 0.24);
  border-radius: var(--border-radius-medium);
}

.pg-home__kicker-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgb(var(--primary-6));
  box-shadow: 0 0 0 3px rgba(var(--primary-6), 0.2);
}

.pg-home__title {
  margin: 20px 0 0;
  font-size: 52px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.1;
  color: var(--color-text-1);
}

.pg-home__lede {
  margin: 16px 0 0;
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

.pg-home__sub code {
  padding: 1px 6px;
  font-family: var(--pg-mono);
  font-size: 12px;
  color: rgb(var(--primary-7));
  background: var(--color-fill-2);
  border-radius: var(--border-radius-small);
}

.pg-home__cta {
  margin-top: 28px;
}

.pg-home__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1px;
  margin-top: 44px;
  max-width: 640px;
  background: var(--color-border-2);
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-large);
  overflow: hidden;
}

.pg-home__stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 20px;
  background: var(--color-bg-1);
}

.pg-home__stat-value {
  font-family: var(--pg-mono);
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
  color: rgb(var(--primary-6));
}

.pg-home__stat-label {
  font-size: 13px;
  color: var(--color-text-3);
}

/* ═══════════ 通用 section ═══════════ */
.pg-home__section {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 64px 32px;
}

.pg-home__section--muted {
  max-width: none;
  margin: 0;
  padding: 0;
  background: var(--color-fill-1);
  border-top: 1px solid var(--color-border-2);
  border-bottom: 1px solid var(--color-border-2);
}

.pg-home__section-wrap {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 64px 32px;
}

.pg-home__eyebrow {
  display: block;
  font-family: var(--pg-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: rgb(var(--primary-6));
}

.pg-home__h2 {
  margin: 10px 0 0;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-text-1);
}

.pg-home__h2-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.pg-home__section-desc {
  margin: 10px 0 28px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-2);
}

/* ═══════════ 为什么需要（痛点/解法）═══════════ */
.pg-home__pain-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.pg-home__pain {
  position: relative;
  padding: 22px 20px;
  background: var(--color-bg-1);
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-large);
  overflow: hidden;
}

.pg-home__pain::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: rgb(var(--primary-6));
}

.pg-home__pain-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-bottom: 16px;
  font-size: 20px;
  color: rgb(var(--primary-6));
  background: rgba(var(--primary-6), 0.1);
  border-radius: var(--border-radius-medium);
}

.pg-home__pain-row {
  display: flex;
  gap: 8px;
  font-size: 13px;
  line-height: 1.6;
}

.pg-home__pain-row--bad {
  color: var(--color-text-3);
}

.pg-home__pain-row--good {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--color-border-2);
  color: var(--color-text-1);
}

.pg-home__pain-mark {
  flex: none;
  margin-top: 2px;
  font-size: 14px;
}

.pg-home__pain-mark--bad {
  color: var(--color-text-4);
}

.pg-home__pain-mark--good {
  color: rgb(var(--primary-6));
}

/* ═══════════ 能力网格 ═══════════ */
.pg-home__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.pg-home__card {
  position: relative;
  padding: 24px 22px;
  background: var(--color-bg-1);
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-large);
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.pg-home__card::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  background: linear-gradient(90deg, rgb(var(--primary-6)), transparent);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.pg-home__card:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--primary-6), 0.5);
  box-shadow: 0 12px 32px rgba(var(--primary-6), 0.12);
}

.pg-home__card:hover::after {
  opacity: 1;
}

.pg-home__card-index {
  position: absolute;
  top: 18px;
  right: 20px;
  font-family: var(--pg-mono);
  font-size: 13px;
  color: var(--color-text-4);
}

.pg-home__card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  font-size: 22px;
  color: rgb(var(--primary-6));
  background: rgba(var(--primary-6), 0.1);
  border-radius: var(--border-radius-large);
}

.pg-home__card-title {
  margin: 14px 0 6px;
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

/* ═══════════ 流程 stepper ═══════════ */
.pg-home__steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin: 0 0 40px;
  padding: 0;
  list-style: none;
  counter-reset: step;
}

.pg-home__step {
  position: relative;
  padding-top: 8px;
}

.pg-home__step::before {
  content: '';
  position: absolute;
  top: 32px;
  left: 64px;
  right: -24px;
  height: 1px;
  background: repeating-linear-gradient(90deg, var(--color-border-1) 0 6px, transparent 6px 12px);
}

.pg-home__step:last-child::before {
  display: none;
}

.pg-home__step-node {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-size: 22px;
  color: rgb(var(--primary-6));
  background: var(--color-bg-1);
  border: 1px solid rgba(var(--primary-6), 0.4);
  border-radius: var(--border-radius-large);
  box-shadow: 0 0 0 5px rgba(var(--primary-6), 0.06);
}

.pg-home__step-no {
  position: absolute;
  top: -8px;
  right: -8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-family: var(--pg-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--color-bg-1);
  background: rgb(var(--primary-6));
  border-radius: 50%;
}

.pg-home__step-title {
  margin: 18px 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-home__step-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-2);
}

/* ═══════════ 终端块 ═══════════ */
.pg-home__terminal {
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-large);
  background: var(--color-bg-1);
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(var(--primary-6), 0.06);
}

.pg-home__terminal-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--color-fill-2);
  border-bottom: 1px solid var(--color-border-2);
}

.pg-home__terminal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-fill-4);
}

.pg-home__terminal-name {
  margin-left: 8px;
  font-family: var(--pg-mono);
  font-size: 12px;
  color: var(--color-text-3);
}

.pg-home__terminal-body {
  padding: 18px 20px;
}

.pg-home__term-line {
  margin: 0 0 8px;
  font-family: var(--pg-mono);
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-home__term-line:last-child {
  margin-bottom: 0;
}

.pg-home__term-sign {
  display: inline-block;
  width: 16px;
  color: var(--color-text-4);
}

.pg-home__term-line--cmd {
  color: var(--color-text-1);
}

.pg-home__term-line--cmd .pg-home__term-sign {
  color: rgb(var(--primary-6));
}

.pg-home__term-line--ok {
  color: rgb(var(--primary-7));
}

.pg-home__term-line--ok .pg-home__term-sign {
  color: rgb(var(--primary-6));
}

/* ═══════════ 适合谁 ═══════════ */
.pg-home__audience {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.pg-home__aud-card {
  padding: 24px;
  background: var(--color-bg-1);
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-large);
}

.pg-home__aud-head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.pg-home__aud-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex: none;
  font-size: 24px;
  color: rgb(var(--primary-6));
  background: rgba(var(--primary-6), 0.1);
  border-radius: var(--border-radius-large);
}

.pg-home__aud-role {
  margin: 0;
  font-family: var(--pg-mono);
  font-size: 12px;
  color: var(--color-text-3);
}

.pg-home__aud-title {
  margin: 2px 0 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-home__aud-tag {
  margin-left: auto;
  align-self: flex-start;
  padding: 3px 10px;
  font-family: var(--pg-mono);
  font-size: 11px;
  color: rgb(var(--primary-7));
  background: rgba(var(--primary-6), 0.1);
  border: 1px solid rgba(var(--primary-6), 0.2);
  border-radius: var(--border-radius-medium);
}

.pg-home__aud-list {
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.pg-home__aud-list li {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-2);
}

.pg-home__aud-list li:last-child {
  margin-bottom: 0;
}

.pg-home__aud-check {
  flex: none;
  margin-top: 3px;
  font-size: 14px;
  color: rgb(var(--primary-6));
}

/* ═══════════ 页面模板一览 ═══════════ */
.pg-home__tpl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.pg-home__tpl {
  padding: 20px;
  background: var(--color-bg-1);
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-large);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.pg-home__tpl:hover {
  transform: translateY(-3px);
  border-color: rgba(var(--primary-6), 0.5);
}

.pg-home__tpl-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 18px;
  color: rgb(var(--primary-6));
  background: rgba(var(--primary-6), 0.1);
  border-radius: var(--border-radius-medium);
}

.pg-home__tpl-title {
  margin: 12px 0 6px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-home__tpl-desc {
  margin: 0 0 12px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-2);
}

.pg-home__tpl-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pg-home__chip {
  padding: 2px 8px;
  font-family: var(--pg-mono);
  font-size: 11px;
  color: var(--color-text-3);
  background: var(--color-fill-2);
  border-radius: var(--border-radius-small);
}

/* ═══════════ 对比矩阵 ═══════════ */
.pg-home__compare {
  overflow-x: auto;
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-large);
}

.pg-home__compare-table {
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  font-size: 14px;
}

.pg-home__compare-table th,
.pg-home__compare-table td {
  padding: 14px 18px;
  text-align: left;
  border-bottom: 1px solid var(--color-border-2);
  vertical-align: top;
}

.pg-home__compare-table thead th {
  font-weight: 600;
  color: var(--color-text-1);
  background: var(--color-fill-2);
  white-space: nowrap;
}

.pg-home__compare-table tbody th {
  font-weight: 500;
  color: var(--color-text-1);
  white-space: nowrap;
}

.pg-home__compare-table tr:last-child th,
.pg-home__compare-table tr:last-child td {
  border-bottom: none;
}

.pg-home__compare-plain {
  color: var(--color-text-3);
}

.pg-home__compare-x {
  margin-right: 8px;
  color: var(--color-text-4);
}

.pg-home__compare-c {
  margin-right: 8px;
  color: rgb(var(--primary-6));
}

th.pg-home__compare-hl {
  color: rgb(var(--primary-7));
}

td.pg-home__compare-hl {
  color: var(--color-text-1);
  background: rgba(var(--primary-6), 0.05);
}

.pg-home__compare-hl-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 8px;
  border-radius: 50%;
  background: rgb(var(--primary-6));
  box-shadow: 0 0 0 3px rgba(var(--primary-6), 0.2);
}

/* ═══════════ 核心机制 ═══════════ */
.pg-home__mech {
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--color-border-2);
}

.pg-home__mech-item {
  display: flex;
  gap: 16px;
  padding: 18px 4px;
  border-bottom: 1px solid var(--color-border-2);
}

.pg-home__mech-no {
  flex: none;
  font-family: var(--pg-mono);
  font-size: 13px;
  color: rgb(var(--primary-6));
  padding-top: 2px;
}

.pg-home__mech-k {
  display: block;
  margin-bottom: 4px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-home__mech-v {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-2);
}

/* ═══════════ 滚动进场动画 ═══════════ */
.pg-reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.pg-reveal--in {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .pg-reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .pg-home__card,
  .pg-home__tpl {
    transition: none;
  }
}

/* ═══════════ 响应式 ═══════════ */
@media (max-width: 768px) {
  .pg-home__hero {
    padding: 56px 20px 48px;
  }
  .pg-home__title {
    font-size: 38px;
  }
  .pg-home__lede {
    font-size: 18px;
  }
  .pg-home__section,
  .pg-home__section-wrap {
    padding: 48px 20px;
  }
  .pg-home__step::before {
    display: none;
  }
}
</style>
