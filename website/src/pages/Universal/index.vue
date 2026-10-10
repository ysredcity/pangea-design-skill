<script setup lang="ts">
/**
 * 通用版（pangea-design-universal）说明页
 * 只介绍通用版能做什么、怎么接入各技术栈、交付前怎么自检；
 * 文案事实以 skills/pangea-design-universal/ 下的文档为准，修改时同步核对。
 */
import { IconCheck, IconGithub, IconCommand } from '@arco-iconbox/vue-pangea-mobile';

// 通用版提供的内容
const contents = [
  { title: '取值', desc: 'tokens.css / tokens.json：色板、语义色（亮 / 暗）、字号、间距、圆角、阴影、动效、层级与组件级尺寸，全部由主题包生成。' },
  { title: '设计规则', desc: '颜色、排版、间距、圆角、控件密度、布局等通用规则（C1–C10）。' },
  { title: '组件规格', desc: '按钮、输入框、表格、分页、标签页、对话框、消息等的尺寸与状态矩阵，值都落到变量。' },
  { title: '交互要求', desc: '反馈与加载、数据区状态、危险操作、表单、焦点与键盘、命中区、动效、文案等（I1–I12）。' },
  { title: '品牌与图标', desc: '依据海信「标识」规范的 Logo 用法与标准文件；功能性图标统一使用 Lucide。' },
  { title: '适配与机检', desc: '常见技术栈的适配文件、可选参考样式 pangea-ui.css，以及检查字面色值和非档位尺寸的 lint 脚本。' },
];

// 技术栈 → 接入文件
const adapters = [
  { stack: '原生 HTML / 无组件库', file: 'tokens.css + 可选 assets/pangea-ui.css' },
  { stack: 'Tailwind CSS v4', file: 'adapters/pangea.tailwind-v4.css' },
  { stack: 'shadcn/ui（Tailwind v4）', file: 'pangea.tailwind-v4.css + pangea.shadcn.css' },
  { stack: 'Tailwind CSS v3', file: 'adapters/pangea.tailwind-v3.cjs（preset）' },
  { stack: 'Element Plus', file: 'adapters/pangea.element-plus.css' },
  { stack: 'Ant Design v5 / v6', file: 'adapters/pangea.antd-theme.json' },
];

// 与 Vue 版的选择
const choose = [
  { cond: '技术栈是 Vue 3 + Arco，想直接用页面模板和工程脚手架', pick: 'Vue 版（pangea-design-vue）' },
  { cond: 'React、原生 HTML、Element Plus、Ant Design、Tailwind 等其它技术栈', pick: '通用版（pangea-design-universal）' },
];

// 交付前自检
const checks = [
  '颜色、字号、间距、圆角只用 tokens.css 中的变量或档位，不写字面色值',
  '暗色由根元素 data-theme="dark" 切换，亮暗都检查一遍',
  '组件的尺寸与状态（hover / 聚焦 / 禁用 / 错误 / 加载）对照组件规格',
  '空、加载、错误、无权限等数据状态都有呈现',
  '运行 lint-tokens.mjs，ERROR 为 0',
];

const LINT_CMD = 'node scripts/lint-tokens.mjs <项目源码目录>';

function openGithub() {
  window.open('https://github.com/ysredcity/pangea-design-skill/tree/main/skills/pangea-design-universal', '_blank');
}
</script>

<template>
  <div class="pg-uni">
    <div class="pg-uni__inner">
      <header class="pg-uni__head">
        <h1 class="pg-uni__title">通用版</h1>
        <p class="pg-uni__lede">
          <code>pangea-design-universal</code> 不限技术栈，也不规定布局框架和页面模板，只约束
          <strong>视觉语言、品牌与交互体验</strong>。所有取值和档位都来自主题包
          <code>@arco-themes/vue-pangea-3-linear</code>，与 Vue 版一致。
        </p>
      </header>

      <section class="pg-uni__section">
        <h2 class="pg-uni__h2">包含什么</h2>
        <div class="pg-uni__grid">
          <div v-for="c in contents" :key="c.title" class="pg-uni__card">
            <h3 class="pg-uni__card-title">{{ c.title }}</h3>
            <p class="pg-uni__card-desc">{{ c.desc }}</p>
          </div>
        </div>
      </section>

      <section class="pg-uni__section">
        <h2 class="pg-uni__h2">选哪个版本</h2>
        <a-table :data="choose" :pagination="false" :bordered="{ cell: false }" row-key="cond">
          <template #columns>
            <a-table-column title="你的情况" data-index="cond" />
            <a-table-column title="使用" data-index="pick" :width="260" />
          </template>
        </a-table>
      </section>

      <section class="pg-uni__section">
        <h2 class="pg-uni__h2">接入各技术栈</h2>
        <p class="pg-uni__desc">
          先引入 <code>tokens.css</code>（不要放进 CSS <code>@layer</code>），再按技术栈引入对应的适配文件。暗色统一在根元素加
          <code>data-theme="dark"</code>。
        </p>
        <a-table :data="adapters" :pagination="false" :bordered="{ cell: false }" row-key="stack">
          <template #columns>
            <a-table-column title="技术栈" data-index="stack" :width="240" />
            <a-table-column title="引入" data-index="file">
              <template #cell="{ record }"><code>{{ record.file }}</code></template>
            </a-table-column>
          </template>
        </a-table>
        <p class="pg-uni__desc">
          适配只解决取值，组件规格与交互要求仍需遵守。Ant Design 的暗色主色由其算法派生，与规范值略有差异。其它组件库按组件规格把主题变量指向
          <code>tokens.css</code> 中的变量。
        </p>
      </section>

      <section class="pg-uni__section">
        <h2 class="pg-uni__h2">交付前自检</h2>
        <ul class="pg-uni__check">
          <li v-for="c in checks" :key="c">
            <IconCheck class="pg-uni__check-icon" /><span>{{ c }}</span>
          </li>
        </ul>
        <p class="pg-uni__hint">
          <IconCommand class="pg-uni__hint-icon" />
          机检命令（在 skill 目录下）：<code>{{ LINT_CMD }}</code>
        </p>
      </section>

      <section class="pg-uni__section">
        <h2 class="pg-uni__h2">资源</h2>
        <a-button @click="openGithub">
          <template #icon><IconGithub /></template>
          GitHub 上的通用版目录
        </a-button>
        <p class="pg-uni__desc">把该目录下的 <code>SKILL.md</code> 作为入口交给支持 skill 的 agent 即可。</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pg-uni {
  background: var(--color-bg-1);
  min-height: 100%;
}

.pg-uni__inner {
  max-width: 880px;
  margin: 0 auto;
  padding: 40px 32px 56px;
}

.pg-uni__title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-1);
}

.pg-uni__lede {
  margin: 12px 0 0;
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-uni__lede strong {
  color: var(--color-text-1);
}

.pg-uni__section {
  margin-top: 40px;
}

.pg-uni__h2 {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-uni__desc {
  margin: 12px 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-uni code {
  padding: 1px 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
  color: var(--color-text-2);
  background: var(--color-fill-2);
  border-radius: var(--border-radius-small);
}

.pg-uni__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.pg-uni__card {
  padding: 16px;
  background: var(--color-fill-1);
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-large);
}

.pg-uni__card-title {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-uni__card-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-uni__check {
  margin: 0;
  padding: 0;
  list-style: none;
}

.pg-uni__check li {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-1);
}

.pg-uni__check-icon {
  flex: none;
  margin-top: 3px;
  color: rgb(var(--primary-6));
}

.pg-uni__hint {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 16px 0 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-3);
}

.pg-uni__hint-icon {
  flex: none;
  position: relative;
  top: 2px;
}
</style>
