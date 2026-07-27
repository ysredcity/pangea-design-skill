<script setup lang="ts">
/**
 * 仪表板页（示例，非固化模板）
 * ------------------------------------------------------------------
 * 演示如何在 Pangea 设计系统内组装一个工作台/仪表板：
 * - 全部使用 Arco Vue 组件 + Pangea token（颜色/圆角变量、控件 small、字号档位）
 * - 页面区域是白底，卡片区块一律用【边框线】区隔（a-card 默认 bordered、无阴影），不使用灰底/投影
 * - 图表遵循 skill 约定优先用 VChart（@visactor/vchart），系列配色接入 Pangea 调色板
 * - 布局响应式：KPI 用自适应网格、主区在窄屏堆叠为单列
 *
 * 这是「示例」而非模板：结构可整体改动，但组件/变量/配色须继续遵循设计系统约定。
 */
import { ref } from 'vue';
import LazyChart from '../../components/LazyChart.vue';
import {
  IconSend,
  IconCheckCircle,
  IconWarning,
  IconSchedule,
  IconQuestionCircle,
  IconLayout,
  IconPlus,
  IconRight,
  IconArrowRise,
} from '@arco-iconbox/vue-pangea-mobile';

// ============ Pangea 调色板（图表在 canvas 上渲染，需字面色值，取自 design-tokens 基础色板 -6 阶） ============
const PALETTE = {
  blue: '#165dff', // arcoblue-6
  teal: '#00aaa6', // primary-6（主色）
  gold: '#f7ba1e', // gold-6
  purple: '#722ed1', // purple-6
  gray: '#86909c', // gray-6
};

// ============ 顶部欢迎信息 ============
const userName = '张建国';

// ============ KPI 指标卡 ============
// accent = 每张卡的强调色（取自 Pangea 调色板 -6 阶），用于图标底色芯片；'1a' 为 10% 透明度
const kpis = [
  { label: '我发起的流程', value: '14', icon: IconSend, accent: PALETTE.blue, trend: '本周 +3', trendType: 'up', desc: '本周工作节奏' },
  { label: '待我审批', value: '7', icon: IconCheckCircle, accent: PALETTE.teal, trend: '超时 2 项', trendType: 'warn', desc: '需优先处理' },
  { label: '我负责的工作项', value: '23', icon: IconWarning, accent: PALETTE.purple, trend: '本周完成 6', trendType: 'up', desc: '本周工作节奏' },
  { label: '本周工时', value: '42.5h', icon: IconSchedule, accent: PALETTE.gold, trend: '目标 45h', trendType: 'flat', desc: '本周工作节奏' },
];

// ============ 流程中心 ============
const processTab = ref('todo');
const processTabs = [
  { key: 'todo', title: '待我审批' },
  { key: 'done', title: '我已处理' },
  { key: 'mine', title: '我发起的' },
];

interface FlowRow {
  code: string;
  type: string;
  typeColor: string;
  applicant: string;
  deadline: string;
  overtime?: boolean;
}
const flowRows: FlowRow[] = [
  { code: 'GFX-GNC-RK-20260418-001', type: '入库单', typeColor: 'arcoblue', applicant: '雪梅', deadline: '2h' },
  { code: 'GFX-GNC-BG-20260416-002', type: '变更单', typeColor: 'orange', applicant: '雪梅', deadline: '1d' },
  { code: 'TX-BUS-RK-20260415-001', type: '入库单', typeColor: 'arcoblue', applicant: '海峰', deadline: '3d' },
  { code: 'GFX-PL-JX-20260414-001', type: '基线', typeColor: 'red', applicant: '美丽', deadline: '超时', overtime: true },
  { code: 'GFX-GNC-CK-20260413-005', type: '出库单', typeColor: 'green', applicant: '建国', deadline: '5d' },
];
const flowColumns = [
  { title: '单据编号', dataIndex: 'code' },
  { title: '类型', slotName: 'type', width: 96 },
  { title: '发起人', dataIndex: 'applicant', width: 96 },
  { title: '时限', slotName: 'deadline', width: 96 },
  { title: '操作', slotName: 'action', width: 88, align: 'center' as const },
];
function flowRowClass(record: FlowRow) {
  return record.overtime ? 'pg-dash__row--overtime' : '';
}

// ============ 我的项目 ============
type BadgeStatus = 'normal' | 'processing' | 'success' | 'warning' | 'danger';
interface ProjectRow {
  name: string;
  level: string;
  levelColor: string;
  role: string;
  status: string;
  statusType: BadgeStatus;
}
const projectRows: ProjectRow[] = [
  { name: 'Edge-X 边缘设备平台', level: '机密', levelColor: 'orange', role: '项目经理', status: '进行中', statusType: 'processing' },
  { name: 'TX-9 数据总线平台', level: '秘密', levelColor: 'arcoblue', role: '软件经理', status: '进行中', statusType: 'processing' },
  { name: 'SY-3 智能巡检系统', level: '绝密', levelColor: 'red', role: '参与者', status: '已上线', statusType: 'success' },
];
const projectColumns = [
  { title: '项目', dataIndex: 'name' },
  { title: '密级', slotName: 'level', width: 80 },
  { title: '我的角色', slotName: 'role', width: 100 },
  { title: '项目状态', slotName: 'status', width: 96 },
  { title: '操作', slotName: 'action', width: 88, align: 'center' as const },
];

// ============ 项目总体情况：分段占比条 ============
const projectSegments = [
  { label: '边缘设备', value: 4, color: PALETTE.blue },
  { label: '数据总线', value: 3, color: PALETTE.teal },
  { label: '智能巡检', value: 2, color: PALETTE.gold },
  { label: '商业', value: 2, color: PALETTE.purple },
  { label: '其他', value: 1, color: PALETTE.gray },
];
const projectStats = [
  { label: '配置项', value: 48 },
  { label: '已放款', value: 4 },
  { label: '待审', value: 3 },
  { label: '变更中', value: 6 },
];

// ============ 组织资产库统计：环形图（VChart） ============
const assetData = [
  { type: '文档模板', value: 40, color: PALETTE.blue },
  { type: '检查单', value: 24, color: PALETTE.teal },
  { type: '评审规范', value: 18, color: PALETTE.gold },
  { type: '其他', value: 18, color: PALETTE.purple },
];
// 环形图 spec（配色取 assetData 里的 Pangea 调色板色值）；通过 LazyChart 按需渲染
const donutSpec = {
  type: 'pie',
  background: 'transparent',
  data: [{ id: 'asset', values: assetData }],
  valueField: 'value',
  categoryField: 'type',
  outerRadius: 0.95,
  innerRadius: 0.68,
  padAngle: 0.8,
  color: assetData.map((d) => d.color),
  pie: { style: { cornerRadius: 4 } },
  legends: { visible: false },
  label: { visible: false },
  tooltip: {
    mark: {
      content: [{ key: (d: any) => d.type, value: (d: any) => `${d.value}%` }],
    },
  },
};

function trendTagColor(type: string) {
  if (type === 'up') return 'green';
  if (type === 'warn') return 'orange';
  return 'gray';
}
</script>

<template>
  <div class="pg-dash">
    <!-- ═══════════ 欢迎信息 ═══════════ -->
    <div class="pg-dash__welcome">
      <div class="pg-dash__welcome-text">
        <div class="pg-dash__hello">
          👋 欢迎回来，{{ userName }}
          <IconQuestionCircle class="pg-dash__hello-help" />
        </div>
        <div class="pg-dash__subtitle">周五愉快，别忘了收尾本周计划：软件中心项目经理</div>
      </div>
      <a-space :size="12">
        <a-button>
          <template #icon><IconLayout /></template>
          自定义布局
        </a-button>
        <a-button type="primary">
          <template #icon><IconPlus /></template>
          快速新建
        </a-button>
      </a-space>
    </div>

    <!-- ═══════════ KPI 指标卡 ═══════════ -->
    <div class="pg-dash__kpis">
      <a-card v-for="kpi in kpis" :key="kpi.label" class="pg-dash__kpi" :bordered="false">
        <div class="pg-dash__kpi-head">
          <span class="pg-dash__kpi-label">{{ kpi.label }}</span>
          <span
            class="pg-dash__kpi-chip"
            :style="{ backgroundColor: kpi.accent + '1a', color: kpi.accent }"
          >
            <component :is="kpi.icon" />
          </span>
        </div>
        <div class="pg-dash__kpi-value">{{ kpi.value }}</div>
        <div class="pg-dash__kpi-foot">
          <a-tag :color="trendTagColor(kpi.trendType)" size="small" :bordered="false">
            <template v-if="kpi.trendType === 'up'" #icon><IconArrowRise /></template>
            {{ kpi.trend }}
          </a-tag>
          <span class="pg-dash__kpi-desc">{{ kpi.desc }}</span>
        </div>
      </a-card>
    </div>

    <!-- ═══════════ 主区：左右两栏 ═══════════ -->
    <div class="pg-dash__main">
      <!-- 左栏 -->
      <div class="pg-dash__col">
        <!-- 流程中心 -->
        <a-card class="pg-dash__panel" :bordered="false">
          <template #title>
            <span class="pg-dash__panel-title">流程中心</span>
            <IconQuestionCircle class="pg-dash__panel-help" />
          </template>
          <template #extra>
            <a-link>查看全部 <IconRight /></a-link>
          </template>

          <a-tabs v-model:active-key="processTab" type="capsule">
            <a-tab-pane v-for="t in processTabs" :key="t.key" :title="t.title" />
          </a-tabs>

          <a-table
            :data="flowRows"
            :columns="flowColumns"
            :pagination="false"
            :row-class="flowRowClass"
            size="small"
          >
            <template #type="{ record }">
              <a-tag :color="record.typeColor" size="small">{{ record.type }}</a-tag>
            </template>
            <template #deadline="{ record }">
              <a-tag v-if="record.overtime" color="red" size="small">超时</a-tag>
              <span v-else>{{ record.deadline }}</span>
            </template>
            <template #action>
              <a-button type="text" size="small">审批</a-button>
            </template>
          </a-table>
        </a-card>

        <!-- 我的项目 -->
        <a-card class="pg-dash__panel" :bordered="false">
          <template #title>
            <span class="pg-dash__panel-title">我的项目</span>
            <IconQuestionCircle class="pg-dash__panel-help" />
          </template>

          <a-table
            :data="projectRows"
            :columns="projectColumns"
            :pagination="false"
            size="small"
          >
            <template #level="{ record }">
              <a-tag :color="record.levelColor" size="small">{{ record.level }}</a-tag>
            </template>
            <template #role="{ record }">
              {{ record.role }}
            </template>
            <template #status="{ record }">
              <a-badge :status="record.statusType" :text="record.status" />
            </template>
            <template #action>
              <a-link>进入</a-link>
            </template>
          </a-table>
        </a-card>
      </div>

      <!-- 右栏 -->
      <div class="pg-dash__col pg-dash__col--side">
        <!-- 项目总体情况 -->
        <a-card class="pg-dash__panel" :bordered="false">
          <template #title>
            <span class="pg-dash__panel-title">项目总体情况</span>
          </template>
          <template #extra>
            <a-link>项目列表 <IconRight /></a-link>
          </template>

          <div class="pg-dash__desc-line">汇总当前组织内进行中的项目、配置项、基线和变更状态。</div>

          <div class="pg-dash__total">
            <span class="pg-dash__total-label">进行中项目总数</span>
          </div>
          <div class="pg-dash__total-row">
            <span class="pg-dash__total-num">12</span>
            <a-tag color="green" size="small"><template #icon><IconArrowRise /></template>本月 +1</a-tag>
          </div>

          <!-- 分段占比条 -->
          <div class="pg-dash__seg-bar">
            <span
              v-for="s in projectSegments"
              :key="s.label"
              class="pg-dash__seg"
              :style="{ flexGrow: s.value, background: s.color }"
            />
          </div>
          <div class="pg-dash__legend">
            <span v-for="s in projectSegments" :key="s.label" class="pg-dash__legend-item">
              <i class="pg-dash__dot" :style="{ background: s.color }" />
              {{ s.label }}
            </span>
          </div>

          <a-divider :margin="16" />

          <div class="pg-dash__stats">
            <div v-for="st in projectStats" :key="st.label" class="pg-dash__stat">
              <div class="pg-dash__stat-label">{{ st.label }}</div>
              <div class="pg-dash__stat-value">{{ st.value }}</div>
            </div>
          </div>
        </a-card>

        <!-- 组织资产库统计 -->
        <a-card class="pg-dash__panel" :bordered="false">
          <template #title>
            <span class="pg-dash__panel-title">组织资产库统计</span>
          </template>

          <div class="pg-dash__desc-line">按资产类型统计当前组织资产库占比。</div>

          <div class="pg-dash__donut-wrap">
            <LazyChart :spec="donutSpec" height="100%" class="pg-dash__donut" />
            <div class="pg-dash__donut-center">
              <div class="pg-dash__donut-center-label">总占比</div>
              <div class="pg-dash__donut-center-value">100%</div>
            </div>
          </div>

          <div class="pg-dash__asset-legend">
            <span v-for="a in assetData" :key="a.type" class="pg-dash__legend-item">
              <i class="pg-dash__dot" :style="{ background: a.color }" />
              {{ a.type }} {{ a.value }}%
            </span>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pg-dash {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  min-height: 100%;
  /* 仪表板类页面：本页保持透明，漏出 body 灰底；区块用白底卡片区隔 */
  background: transparent;
}

/* ═══════════ 欢迎信息 ═══════════ */
.pg-dash__welcome {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.pg-dash__hello {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-dash__hello-help {
  font-size: 14px;
  color: var(--color-text-3);
}

.pg-dash__subtitle {
  margin-top: 6px;
  font-size: 13px;
  color: var(--color-text-3);
}

/* ═══════════ KPI ═══════════ */
.pg-dash__kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

/* 白卡：大圆角 + 极轻阴影（灰底上做区隔，无边框） */
.pg-dash__kpi,
.pg-dash__panel {
  border-radius: var(--border-radius-large);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.pg-dash__kpi :deep(.arco-card-body) {
  padding: 20px;
}

.pg-dash__kpi-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pg-dash__kpi-label {
  font-size: 13px;
  color: var(--color-text-3);
}

/* 图标芯片：强调色浅底 + 同色图标 */
.pg-dash__kpi-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-large);
  font-size: 20px;
  flex-shrink: 0;
}

.pg-dash__kpi-value {
  margin: 16px 0 12px;
  font-size: 30px;
  font-weight: 600;
  line-height: 1;
  color: var(--color-text-1);
}

.pg-dash__kpi-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-2);
}

.pg-dash__kpi-desc {
  font-size: 12px;
  color: var(--color-text-3);
}

/* ═══════════ 主区两栏 ═══════════ */
.pg-dash__main {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.pg-dash__col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

/* 窄屏堆叠为单列 */
@media (max-width: 1100px) {
  .pg-dash__main {
    grid-template-columns: 1fr;
  }
}

/* ═══════════ 面板通用 ═══════════ */
.pg-dash__panel :deep(.arco-card-header) {
  border-bottom: 1px solid var(--color-border-2);
  padding: 12px 16px;
}

.pg-dash__panel-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-dash__panel-help {
  margin-left: 6px;
  font-size: 13px;
  color: var(--color-text-3);
}

/* 胶囊 tabs 默认右对齐（Arco flex-end），改为左对齐 */
.pg-dash__panel :deep(.arco-tabs-nav-type-capsule .arco-tabs-nav-tab) {
  justify-content: flex-start;
}

/* 超时行高亮 */
.pg-dash :deep(.pg-dash__row--overtime) .arco-table-td {
  background: var(--color-danger-light-1);
}

/* ═══════════ 项目总体情况 ═══════════ */
.pg-dash__desc-line {
  font-size: 12px;
  color: var(--color-text-3);
  margin-bottom: 16px;
}

.pg-dash__total-label {
  font-size: 13px;
  color: var(--color-text-2);
}

.pg-dash__total-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0 16px;
}

.pg-dash__total-num {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-dash__seg-bar {
  display: flex;
  gap: 4px;
  height: 8px;
  margin-bottom: 12px;
}

.pg-dash__seg {
  border-radius: var(--border-radius-small);
}

.pg-dash__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.pg-dash__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-2);
}

.pg-dash__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.pg-dash__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.pg-dash__stat-label {
  font-size: 12px;
  color: var(--color-text-3);
  margin-bottom: 4px;
}

.pg-dash__stat-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-1);
}

/* ═══════════ 环形图 ═══════════ */
.pg-dash__donut-wrap {
  position: relative;
  height: 180px;
  margin-bottom: 12px;
}

.pg-dash__donut {
  width: 100%;
  height: 100%;
}

.pg-dash__donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.pg-dash__donut-center-label {
  font-size: 12px;
  color: var(--color-text-3);
}

.pg-dash__donut-center-value {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-dash__asset-legend {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 16px;
}
</style>
