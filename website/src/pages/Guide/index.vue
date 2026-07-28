<script setup lang="ts">
/**
 * 使用指南
 * 重心：用户只需把「需求」说清楚——起项目、预览、交付都由 skill 自动处理。
 * 因此本页弱化「起项目 / 预览交付」（描述其为自动化以降低心理负担），
 * 着重讲「如何更明确地澄清需求」。
 */
import {
  IconRocket,
  IconCheckCircle,
  IconCommand,
  IconBulb,
  IconCheck,
  IconClose,
  IconRight,
  IconGithub,
  IconBook,
} from '@arco-iconbox/vue-pangea-mobile';

// skill 自动处理、用户几乎不用关注的环节
const autoItems = [
  {
    icon: IconRocket,
    title: '起项目',
    desc: '在能读改代码的 AI 工具（Kiro / Codex / Cursor / Claude Code 等）里，skill 会基于脚手架自动初始化工程、安装依赖、启动本地预览——你不需要敲命令。',
  },
  {
    icon: IconCheckCircle,
    title: '预览与交付',
    desc: '改动实时热更新预览；编译报错由 skill 自动修复；定稿自动跑质量门禁。产物是一个独立的前端工程，可放进你自己的仓库继续开发、对接接口、部署。',
  },
];

// 你要说清的点（决定界面架构）
const clarifyChecklist = [
  '目标用户 / 角色，是否有权限差异',
  '大致分哪几块业务域（模块），还是单模块即可',
  '要哪些页面，每个页面主要做什么',
  '每页大致形态：列表 / 卡片 / 表单 / 详情 / 仪表盘',
  '列表的主要列、表单的主要字段（主干即可，不必穷举）',
  '数据来源：demo（mock）还是对接既有接口',
  '特殊交互：分组 / 锚点 / 图表 / 审批流 / 多步骤等',
];

// 澄清流程
const flow = [
  { step: '你', text: '给一句话或一段需求，例如「做一个请假管理」。' },
  { step: 'skill 追问', text: '把关键模糊点一次性打包问你（有哪些角色？要哪些页面？数据 mock 还是接口？），最多 1–2 轮。' },
  { step: 'skill 产出', text: '一份「界面架构需求文档」：模块划分、菜单结构、每个页面的页型 / 布局 / 关键内容 / 交互。' },
  { step: '你确认', text: '确认或直接改文档（模块、菜单、页面结构）。' },
  { step: 'skill 生成', text: '按确认的文档逐页生成，并跑质量门禁。' },
];

const templateMap = [
  '基础表格列表页，无复杂查询 → 简单列表页',
  '数据以卡片形式呈现（应用 / 资源墙）→ 卡片列表页',
  '字段少、弹窗内录入不跳转 → 对话框表单',
  '字段多、独立页面录入 → 基础表单页',
  '字段极多、需分组 + 锚点定位 → 分组表单页',
];

function openGithub() {
  window.open('https://github.com/ysredcity/pangea-design-skill', '_blank');
}
</script>

<template>
  <div class="pg-guide">
    <div class="pg-guide__inner">
      <header class="pg-guide__head">
        <h1 class="pg-guide__title">使用指南</h1>
        <p class="pg-guide__lede">
          你只管把<strong>需求</strong>说清楚——起项目、预览、交付都由 skill 自动处理。
          说得越明确，澄清越少、生成越准。
        </p>
      </header>

      <!-- 你几乎不用管的（自动处理） -->
      <section class="pg-guide__section">
        <h2 class="pg-guide__h2">这些 skill 自动处理，你不用操心</h2>
        <p class="pg-guide__desc">起项目和预览交付都是自动化的，不必担心命令、环境或编译报错。</p>
        <div class="pg-guide__auto">
          <div v-for="a in autoItems" :key="a.title" class="pg-guide__auto-card">
            <span class="pg-guide__auto-icon"><component :is="a.icon" /></span>
            <div>
              <h3 class="pg-guide__auto-title">{{ a.title }}<span class="pg-guide__auto-tag">自动</span></h3>
              <p class="pg-guide__auto-desc">{{ a.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 你要关注的：把需求说清楚 -->
      <section class="pg-guide__section pg-guide__section--focus">
        <div class="pg-guide__focus-badge"><IconBulb /> 你真正要关注的</div>
        <h2 class="pg-guide__h2">把需求说清楚</h2>
        <p class="pg-guide__desc">
          skill 在写代码前，会先把你的输入转成一份<strong>面向界面架构的需求文档</strong>并请你确认。
          你把下面这些点说清楚，就能少几轮澄清、更快拿到贴合预期的结果：
        </p>
        <ul class="pg-guide__check">
          <li v-for="c in clarifyChecklist" :key="c">
            <IconCheck class="pg-guide__check-icon" /><span>{{ c }}</span>
          </li>
        </ul>
      </section>

      <!-- 好 vs 模糊 示例 -->
      <section class="pg-guide__section">
        <h2 class="pg-guide__h2">同一个需求，两种说法</h2>
        <div class="pg-guide__cmp">
          <div class="pg-guide__cmp-col pg-guide__cmp-col--bad">
            <div class="pg-guide__cmp-head"><IconClose /> 偏模糊（要多轮澄清）</div>
            <p>「做个管理后台。」</p>
          </div>
          <div class="pg-guide__cmp-col pg-guide__cmp-col--good">
            <div class="pg-guide__cmp-head"><IconCheck /> 更明确（一步到位）</div>
            <p>
              「做个合同管理后台：分「合同」「统计」两个模块；合同模块有<strong>合同列表</strong>（按名称/状态搜索、行选择、分页）和<strong>创建合同表单页</strong>（分基本信息、条款两组，字段较多）；数据先用 mock。」
            </p>
          </div>
        </div>
      </section>

      <!-- 澄清与确认流程 -->
      <section class="pg-guide__section">
        <h2 class="pg-guide__h2">澄清与确认流程</h2>
        <ol class="pg-guide__flow">
          <li v-for="(f, i) in flow" :key="i">
            <span class="pg-guide__flow-step">{{ f.step }}</span>
            <span class="pg-guide__flow-text">{{ f.text }}</span>
          </li>
        </ol>
        <p class="pg-guide__desc">确认后才进入生成——避免边写边猜、来回返工。</p>
      </section>

      <!-- 选型对照 -->
      <section class="pg-guide__section">
        <h2 class="pg-guide__h2">说清「形态」，更容易命中模板</h2>
        <p class="pg-guide__desc">点明「页面形态 + 字段/列规模 + 是否需要分组/图表」，skill 会按下面的关系选型：</p>
        <ul class="pg-guide__prompts">
          <li v-for="p in templateMap" :key="p">{{ p }}</li>
        </ul>
        <p class="pg-guide__desc">匹配度低时 AI 会自主设计，但仍只用设计系统组件 + Token。</p>
      </section>

      <!-- PM Demo -->
      <section class="pg-guide__section pg-guide__section--card">
        <h2 class="pg-guide__h2">给产品经理</h2>
        <p class="pg-guide__desc">
          不熟悉编译 / 启动也没关系：会话开始自动起本地预览、文件保存自动做编译检查并修复。
          你只需在对话里描述需求、在浏览器里看效果，全程不碰终端。
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
        <p class="pg-guide__hint">
          <IconCommand class="pg-guide__hint-icon" />
          想手动起项目也可以（可选）：<code>npx degit ysredcity/pangea-design-skill/skills/pangea-design-vue/templates/project-starter my-app</code>，然后 <code>npm install &amp;&amp; npm run dev</code>。
        </p>
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
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-guide__lede strong {
  color: var(--color-text-1);
}

.pg-guide__section {
  margin-top: 40px;
}

.pg-guide__section--card {
  padding: 24px;
  background: rgba(var(--primary-6), 0.06);
  border-radius: var(--border-radius-large);
}

/* 重点区块：需求澄清 */
.pg-guide__section--focus {
  padding: 24px;
  background: rgba(var(--primary-6), 0.06);
  border: 1px solid rgba(var(--primary-6), 0.2);
  border-radius: var(--border-radius-large);
}

.pg-guide__focus-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  padding: 3px 10px;
  font-size: 12px;
  color: rgb(var(--primary-7));
  background: var(--color-bg-1);
  border: 1px solid rgba(var(--primary-6), 0.3);
  border-radius: var(--border-radius-medium);
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

.pg-guide__desc strong,
.pg-guide__check strong {
  color: var(--color-text-1);
}

/* 自动处理卡片 */
.pg-guide__auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.pg-guide__auto-card {
  display: flex;
  gap: 12px;
  padding: 18px;
  background: var(--color-fill-1);
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-large);
}

.pg-guide__auto-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: var(--border-radius-medium);
  background: rgba(var(--primary-6), 0.1);
  color: rgb(var(--primary-6));
  font-size: 18px;
}

.pg-guide__auto-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 2px 0 6px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-guide__auto-tag {
  padding: 1px 8px;
  font-size: 11px;
  font-weight: 400;
  color: rgb(var(--primary-7));
  background: rgba(var(--primary-6), 0.1);
  border-radius: var(--border-radius-small);
}

.pg-guide__auto-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-2);
}

/* 澄清清单 */
.pg-guide__check {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.pg-guide__check li {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-1);
}

.pg-guide__check-icon {
  flex: none;
  margin-top: 3px;
  color: rgb(var(--primary-6));
}

/* 好 vs 模糊 */
.pg-guide__cmp {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.pg-guide__cmp-col {
  padding: 18px;
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-large);
}

.pg-guide__cmp-col p {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-guide__cmp-col strong {
  color: var(--color-text-1);
}

.pg-guide__cmp-head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 600;
}

.pg-guide__cmp-col--bad .pg-guide__cmp-head {
  color: var(--color-text-3);
}

.pg-guide__cmp-col--good {
  background: rgba(var(--primary-6), 0.05);
  border-color: rgba(var(--primary-6), 0.3);
}

.pg-guide__cmp-col--good .pg-guide__cmp-head {
  color: rgb(var(--primary-7));
}

/* 流程 */
.pg-guide__flow {
  margin: 14px 0;
  padding: 0;
  list-style: none;
  counter-reset: flow;
}

.pg-guide__flow li {
  display: flex;
  gap: 12px;
  align-items: baseline;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border-2);
}

.pg-guide__flow li:last-child {
  border-bottom: none;
}

.pg-guide__flow-step {
  flex: none;
  width: 76px;
  font-size: 13px;
  font-weight: 600;
  color: rgb(var(--primary-6));
}

.pg-guide__flow-text {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-2);
}

/* 选型对照 */
.pg-guide__prompts {
  margin: 12px 0;
  padding-left: 20px;
}

.pg-guide__prompts li {
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-2);
}

/* 手动命令提示 */
.pg-guide__hint {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 20px 0 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-3);
}

.pg-guide__hint-icon {
  flex: none;
  position: relative;
  top: 2px;
}

.pg-guide__hint code {
  padding: 1px 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
  color: var(--color-text-2);
  background: var(--color-fill-2);
  border-radius: var(--border-radius-small);
}
</style>
