<script setup lang="ts">
/**
 * 使用指南
 * 结构参考花叔 Design：装上就能用 → 三步跑通 → 示例 prompt → 机制 → 资源。
 */
import {
  IconRocket,
  IconCommand,
  IconCheckCircle,
  IconRight,
  IconGithub,
  IconBook,
} from '@arco-iconbox/vue-pangea-mobile';

const steps = [
  {
    icon: IconRocket,
    title: '1 · 起项目',
    desc: '基于脚手架一键起一个可运行的 Vue 工程（已内置 Pangea 主题、图标、全局 Layout）。',
    code: 'npx degit ysredcity/pangea-design-skill/skills/pangea-design-vue/templates/project-starter my-app\ncd my-app\nnpm install',
  },
  {
    icon: IconCommand,
    title: '2 · 在 AI 工具里描述需求',
    desc: '在 Kiro / Codex / Cursor / Claude Code 等能读改代码的 AI 工具中，直接描述你要的页面。skill 会按决策树选型、套模板、用设计系统组件与 Token 生成。',
    code: '「做一个合同列表页，支持按名称搜索、行选择和分页」\n「做一个创建合同的表单页，字段较多，分成基本信息和条款两组」\n「做一个项目工作台仪表板，含 KPI 卡片和资产占比环形图」',
  },
  {
    icon: IconCheckCircle,
    title: '3 · 预览与交付',
    desc: 'dev server 实时预览；定稿前跑质量门禁；产物是独立前端工程，可进你自己的仓库继续开发、对接接口、部署。',
    code: 'npm run dev      # 本地预览\nnpm run gate     # 生成后质量门禁（token 机检 + 类型检查 + 构建）\nnpm run build    # 交付构建',
  },
];

function openGithub() {
  window.open('https://github.com/ysredcity/pangea-design-skill', '_blank');
}

const prompts = [
  '基础表格列表页，无复杂查询 → 简单列表页',
  '数据以卡片形式呈现（应用/资源墙）→ 卡片列表页',
  '字段少、弹窗内录入不跳转 → 对话框表单',
  '字段多、独立页面录入 → 基础表单页',
  '字段极多、需分组 + 锚点定位 → 分组表单页',
];
</script>

<template>
  <div class="pg-guide">
    <div class="pg-guide__inner">
      <header class="pg-guide__head">
        <h1 class="pg-guide__title">使用指南</h1>
        <p class="pg-guide__lede">打字、描述需求，拿回一份符合 Pangea 规范、可交付的前端工程。</p>
      </header>

      <!-- 三步跑通 -->
      <section class="pg-guide__section">
        <h2 class="pg-guide__h2">三步跑通</h2>
        <div class="pg-guide__steps">
          <a-card v-for="s in steps" :key="s.title" class="pg-guide__step" :bordered="true">
            <div class="pg-guide__step-head">
              <span class="pg-guide__step-icon"><component :is="s.icon" /></span>
              <h3 class="pg-guide__step-title">{{ s.title }}</h3>
            </div>
            <p class="pg-guide__step-desc">{{ s.desc }}</p>
            <pre class="pg-guide__code"><code>{{ s.code }}</code></pre>
          </a-card>
        </div>
      </section>

      <!-- 选型对照 -->
      <section class="pg-guide__section">
        <h2 class="pg-guide__h2">怎么描述最容易命中模板</h2>
        <p class="pg-guide__desc">说清「页面形态 + 字段/列规模 + 是否需要分组/图表」，skill 会按下面的匹配关系选型：</p>
        <ul class="pg-guide__prompts">
          <li v-for="p in prompts" :key="p">{{ p }}</li>
        </ul>
        <p class="pg-guide__desc">匹配度低时 AI 会自主设计，但仍只用设计系统组件 + Token。</p>
      </section>

      <!-- 机制 -->
      <section class="pg-guide__section">
        <h2 class="pg-guide__h2">生成时发生了什么</h2>
        <ol class="pg-guide__mechanism">
          <li>按<strong>页面生成决策树</strong>判断与现有模板的匹配度 → 套用 / 增补 / 自主设计。</li>
          <li>参照<strong>组件选型元数据</strong>（适用任务 / 变体 / 组合边界）挑组件。</li>
          <li>用 <strong>Pangea 主题 Token</strong>（颜色、圆角走 CSS 变量）与 Arco 组件生成，图标按功能性/业务分工。</li>
          <li>生成后按 <strong>G1–G8 质量门禁</strong>自检并跑 <code>npm run gate</code>。</li>
        </ol>
      </section>

      <!-- PM Demo -->
      <section class="pg-guide__section pg-guide__section--card">
        <h2 class="pg-guide__h2">给产品经理：PM Demo 模式</h2>
        <p class="pg-guide__desc">
          不熟悉编译/启动也没关系。脚手架内置 hooks：会话开始自动起 dev server、文件保存自动做编译检查并修复。
          你只需在对话里描述、在浏览器里预览，无需接触终端。
        </p>
      </section>

      <!-- 资源 -->
      <section class="pg-guide__section">
        <h2 class="pg-guide__h2">资源</h2>
        <a-space :size="12" wrap>
          <a-button @click="openGithub">
            <template #icon><IconGithub /></template>
            GitHub 仓库
          </a-button>
          <a-button @click="$router.push('/templates')">
            <template #icon><IconBook /></template>
            页面模板
          </a-button>
          <a-button @click="$router.push('/components')">
            <template #icon><IconRight /></template>
            组件预览
          </a-button>
        </a-space>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pg-guide {
  background: var(--color-bg-1);
  min-height: 100%;
}

.pg-guide__inner {
  max-width: 880px;
  margin: 0 auto;
  padding: 40px 32px 56px;
}

.pg-guide__head {
  margin-bottom: 8px;
}

.pg-guide__title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-1);
}

.pg-guide__lede {
  margin: 12px 0 0;
  font-size: 16px;
  color: var(--color-text-2);
}

.pg-guide__section {
  margin-top: 40px;
}

.pg-guide__section--card {
  padding: 24px;
  background: rgba(var(--primary-6), 0.06);
  border-radius: var(--border-radius-large);
}

.pg-guide__h2 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-guide__desc {
  margin: 8px 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-guide__steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.pg-guide__step {
  border-radius: var(--border-radius-large);
}

.pg-guide__step-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pg-guide__step-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-medium);
  background: rgba(var(--primary-6), 0.1);
  color: rgb(var(--primary-6));
  font-size: 18px;
}

.pg-guide__step-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-guide__step-desc {
  margin: 12px 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-guide__code {
  margin: 0;
  padding: 12px 14px;
  background: var(--color-fill-2);
  border-radius: var(--border-radius-medium);
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-1);
  overflow-x: auto;
  white-space: pre;
}

.pg-guide__code code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.pg-guide__prompts,
.pg-guide__mechanism {
  margin: 12px 0;
  padding-left: 20px;
}

.pg-guide__prompts li,
.pg-guide__mechanism li {
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-guide__mechanism strong {
  color: var(--color-text-1);
}
</style>
