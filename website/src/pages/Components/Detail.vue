<script setup lang="ts">
/**
 * 组件详情页（组件预览模块下，每个组件一页）
 * ------------------------------------------------------------------
 * 路由 /components/:id。上方展示该组件的选型元数据（来自同步的 catalog），
 * 下方是 Arco + Pangea 的 live 交互示例（按 id 渲染）。
 */
import { ref, computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import catalog from '@/generated/catalog.json';
import { findComponent } from './registry';

const route = useRoute();
const id = computed(() => String(route.params.id || ''));
const meta = computed(() => catalog.components.find((c) => c.id === id.value));
const entry = computed(() => findComponent(id.value));
const title = computed(() => entry.value?.title || meta.value?.title || id.value);

// 专属 demo 文件（demos/<Id>.vue）优先；没有则回退到下方内联示例
const demoModules = import.meta.glob('./demos/*.vue');
const demoComp = computed(() => {
  const cap = id.value.charAt(0).toUpperCase() + id.value.slice(1);
  const loader = demoModules[`./demos/${cap}.vue`];
  return loader ? defineAsyncComponent(loader as never) : null;
});

// —— demo 状态 ——
const switchVal = ref(true);
const radioVal = ref('list');
const selectVal = ref('1');
const multiVal = ref<string[]>(['1']);
const checkVal = ref(true);
const dateVal = ref();
const tabKey = ref('todo');
const pageCurrent = ref(1);
const modalVisible = ref(false);
const menuSelected = ref(['m-1']);

const tableColumns = [
  { title: '单据编号', dataIndex: 'code' },
  { title: '类型', slotName: 'type', width: 96 },
  { title: '发起人', dataIndex: 'user', width: 90 },
  { title: '状态', slotName: 'status', width: 96 },
];
const tableData = [
  { code: 'RK-001', type: '入库单', typeColor: 'arcoblue', user: '雪梅', status: 'processing', statusText: '进行中' },
  { code: 'BG-002', type: '变更单', typeColor: 'orange', user: '海峰', status: 'success', statusText: '已完成' },
  { code: 'CK-003', type: '出库单', typeColor: 'green', user: '建国', status: 'warning', statusText: '待处理' },
];

function toast() {
  Message.success('操作成功');
}
</script>

<template>
  <div class="pg-cd">
    <div class="pg-cd__inner">
      <template v-if="entry || meta">
        <header class="pg-cd__head">
          <h1 class="pg-cd__title">{{ title }}</h1>
          <p class="pg-cd__id"><code>{{ id }}</code></p>
        </header>

        <!-- 选型元数据（命中 skill catalog 时展示）-->
        <a-card v-if="meta" class="pg-cd__card" :bordered="true" title="选型要点">
          <div class="pg-cd__meta">
            <div v-if="meta.whenToUse?.length" class="pg-cd__meta-row">
              <span class="pg-cd__meta-label">适用</span>
              <div class="pg-cd__meta-val">
                <a-tag v-for="t in meta.whenToUse" :key="t" color="green" size="small">{{ t }}</a-tag>
              </div>
            </div>
            <div v-if="meta.whenNotToUse?.length" class="pg-cd__meta-row">
              <span class="pg-cd__meta-label">不适用</span>
              <div class="pg-cd__meta-val">
                <a-tag v-for="t in meta.whenNotToUse" :key="t" size="small">{{ t }}</a-tag>
              </div>
            </div>
            <div v-if="meta.variants?.length" class="pg-cd__meta-row">
              <span class="pg-cd__meta-label">变体</span>
              <div class="pg-cd__meta-val">
                <a-tag v-for="t in meta.variants" :key="t" color="arcoblue" size="small">{{ t }}</a-tag>
              </div>
            </div>
            <div v-if="meta.composeBoundary?.length" class="pg-cd__meta-row">
              <span class="pg-cd__meta-label">组合边界</span>
              <ul class="pg-cd__meta-list">
                <li v-for="t in meta.composeBoundary" :key="t">{{ t }}</li>
              </ul>
            </div>
            <div v-if="meta.pitfalls?.length" class="pg-cd__meta-row">
              <span class="pg-cd__meta-label">常见坑</span>
              <ul class="pg-cd__meta-list">
                <li v-for="t in meta.pitfalls" :key="t">{{ t }}</li>
              </ul>
            </div>
          </div>
        </a-card>

        <!-- 专属 demo（全面示例） -->
        <component :is="demoComp" v-if="demoComp" />

        <!-- live 交互示例（内联回退，用于尚无专属 demo 的组件） -->
        <a-card v-else class="pg-cd__card" :bordered="true" title="交互示例">
          <!-- table -->
          <template v-if="id === 'table'">
            <a-table :data="tableData" :columns="tableColumns" :pagination="false" size="small">
              <template #type="{ record }"><a-tag :color="record.typeColor" size="small">{{ record.type }}</a-tag></template>
              <template #status="{ record }"><a-badge :status="record.status" :text="record.statusText" /></template>
            </a-table>
          </template>

          <!-- form -->
          <template v-else-if="id === 'form'">
            <a-form :model="{}" layout="vertical" style="max-width: 420px">
              <a-form-item label="名称"><a-input placeholder="请输入名称" allow-clear /></a-form-item>
              <a-form-item label="类型">
                <a-select v-model="selectVal" placeholder="请选择">
                  <a-option value="1" label="类型一" /><a-option value="2" label="类型二" />
                </a-select>
              </a-form-item>
              <a-form-item label="启用"><a-switch v-model="switchVal" /></a-form-item>
            </a-form>
          </template>

          <!-- modal -->
          <template v-else-if="id === 'modal'">
            <a-button type="primary" @click="modalVisible = true">打开对话框</a-button>
            <a-modal v-model:visible="modalVisible" title="对话框标题" title-align="start">
              <p>标题左对齐、青绿主色确认按钮的 Modal 示例。</p>
            </a-modal>
          </template>

          <!-- card -->
          <template v-else-if="id === 'card'">
            <a-space :size="16" wrap>
              <a-card title="带边框卡片" :bordered="true" :style="{ width: '220px' }">白底页面上用边框区隔。</a-card>
              <a-card title="无边框卡片" :bordered="false" :style="{ width: '220px', background: 'var(--color-fill-1)' }">
                灰底/仪表板上用无边框白卡区隔。
              </a-card>
            </a-space>
          </template>

          <!-- tabs -->
          <template v-else-if="id === 'tabs'">
            <a-tabs v-model:active-key="tabKey" type="capsule">
              <a-tab-pane key="todo" title="待处理"><div class="pg-cd__pane">待处理内容</div></a-tab-pane>
              <a-tab-pane key="done" title="已处理"><div class="pg-cd__pane">已处理内容</div></a-tab-pane>
            </a-tabs>
          </template>

          <!-- select -->
          <template v-else-if="id === 'select'">
            <a-space direction="vertical" :size="12" fill>
              <a-select v-model="selectVal" placeholder="单选" :style="{ width: '260px' }">
                <a-option value="1" label="选项一" /><a-option value="2" label="选项二" /><a-option value="3" label="选项三" />
              </a-select>
              <a-select v-model="multiVal" multiple placeholder="多选" :style="{ width: '260px' }">
                <a-option value="1" label="选项一" /><a-option value="2" label="选项二" /><a-option value="3" label="选项三" />
              </a-select>
            </a-space>
          </template>

          <!-- badge -->
          <template v-else-if="id === 'badge'">
            <a-space :size="24" wrap>
              <a-badge :count="5"><a-button>通知</a-button></a-badge>
              <a-badge status="processing" text="进行中" />
              <a-badge status="success" text="已完成" />
              <a-badge status="warning" text="待处理" />
              <a-badge status="danger" text="已停用" />
            </a-space>
          </template>

          <!-- menu -->
          <template v-else-if="id === 'menu'">
            <div :style="{ width: '220px', border: '1px solid var(--color-border-2)', borderRadius: 'var(--border-radius-medium)' }">
              <a-menu v-model:selected-keys="menuSelected" :style="{ width: '100%' }">
                <a-menu-item key="m-1">菜单项一</a-menu-item>
                <a-menu-item key="m-2">菜单项二</a-menu-item>
                <a-sub-menu key="m-3">
                  <template #title>子菜单</template>
                  <a-menu-item key="m-3-1">子项 A</a-menu-item>
                  <a-menu-item key="m-3-2">子项 B</a-menu-item>
                </a-sub-menu>
              </a-menu>
            </div>
          </template>

          <!-- pagination -->
          <template v-else-if="id === 'pagination'">
            <a-pagination v-model:current="pageCurrent" :total="120" size="small" show-total show-jumper show-page-size />
          </template>

          <!-- alert -->
          <template v-else-if="id === 'alert'">
            <a-space direction="vertical" fill :size="8">
              <a-alert type="info">信息提示</a-alert>
              <a-alert type="success">成功提示</a-alert>
              <a-alert type="warning">警告提示</a-alert>
              <a-alert type="error">错误提示</a-alert>
            </a-space>
          </template>

          <template v-else>
            <a-space :size="8"><a-button type="primary" @click="toast">主要按钮</a-button><a-button>次要按钮</a-button></a-space>
          </template>
        </a-card>

        <p class="pg-cd__api-note">完整属性 / 事件 / 插槽以 Arco Design Vue 官方文档为准；本页展示 Pangea 主题下的选型与交互。</p>
      </template>

      <a-result v-else status="404" title="未找到该组件" subtitle="请从左侧菜单选择组件。" />
    </div>
  </div>
</template>

<style scoped>
.pg-cd {
  background: var(--color-bg-1);
  min-height: 100%;
}

.pg-cd__inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px;
}

.pg-cd__head {
  margin-bottom: 20px;
}

.pg-cd__title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-1);
}

.pg-cd__id {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--color-text-3);
}

.pg-cd__id code {
  padding: 1px 6px;
  background: var(--color-fill-2);
  border-radius: var(--border-radius-small);
}

.pg-cd__card {
  margin-bottom: 16px;
  border-radius: var(--border-radius-large);
}

.pg-cd__meta {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.pg-cd__meta-row {
  display: flex;
  gap: 12px;
}

.pg-cd__meta-label {
  flex-shrink: 0;
  width: 64px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-3);
  padding-top: 2px;
}

.pg-cd__meta-val {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pg-cd__meta-list {
  margin: 0;
  padding-left: 18px;
}

.pg-cd__meta-list li {
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-cd__pane {
  padding: 16px 4px;
  font-size: 14px;
  color: var(--color-text-2);
}

.pg-cd__api-note {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--color-text-3);
}
</style>
