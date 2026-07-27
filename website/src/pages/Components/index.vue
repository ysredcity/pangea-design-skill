<script setup lang="ts">
/**
 * 组件预览 Components
 * ------------------------------------------------------------------
 * 上半：Arco + Pangea 常用组件的 live 交互画廊（分组）。
 * 下半：读同步自 skill 的 catalog，展示组件「选型元数据」（适用任务）。
 */
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import catalog from '@/generated/catalog.json';

// —— 表单示例状态 ——
const switchVal = ref(true);
const radioVal = ref('list');
const selectVal = ref('1');
const checkVal = ref(true);
const dateVal = ref();

// —— 数据展示示例 ——
const tabKey = ref('todo');
const pageCurrent = ref(1);
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

// —— 反馈示例 ——
const modalVisible = ref(false);
function toast() {
  Message.success('操作成功');
}

// —— 选型元数据（来自 catalog）——
const selectionComponents = catalog.components;
</script>

<template>
  <div class="pg-comp">
    <div class="pg-comp__inner">
      <header class="pg-comp__head">
        <h1 class="pg-comp__title">组件预览</h1>
        <p class="pg-comp__lede">Arco Design Vue 组件 + Pangea 主题的真实交互效果。下方「组件选型」为同步自 skill 的元数据。</p>
      </header>

      <!-- 基础 -->
      <section class="pg-comp__section">
        <h2 class="pg-comp__h2">基础</h2>
        <div class="pg-comp__grid">
          <a-card title="按钮 Button" :bordered="true" class="pg-comp__card">
            <a-space wrap :size="8">
              <a-button type="primary">主要</a-button>
              <a-button>次要</a-button>
              <a-button type="outline">线框</a-button>
              <a-button type="text">文本</a-button>
              <a-button type="primary" status="danger">危险</a-button>
              <a-button type="primary" size="small">小号</a-button>
            </a-space>
          </a-card>
          <a-card title="标签 / 徽标 / 头像" :bordered="true" class="pg-comp__card">
            <a-space wrap :size="8">
              <a-tag color="arcoblue">arcoblue</a-tag>
              <a-tag color="green">green</a-tag>
              <a-tag color="orange">orange</a-tag>
              <a-tag color="red">red</a-tag>
              <a-badge :count="5"><a-button>通知</a-button></a-badge>
              <a-badge status="processing" text="进行中" />
              <a-avatar :size="28">U</a-avatar>
              <a-link>链接</a-link>
            </a-space>
          </a-card>
        </div>
      </section>

      <!-- 表单 -->
      <section class="pg-comp__section">
        <h2 class="pg-comp__h2">表单录入</h2>
        <div class="pg-comp__grid">
          <a-card title="输入 / 选择" :bordered="true" class="pg-comp__card">
            <a-space direction="vertical" fill :size="12">
              <a-input placeholder="请输入内容" allow-clear />
              <a-select v-model="selectVal" placeholder="请选择">
                <a-option value="1" label="选项一" />
                <a-option value="2" label="选项二" />
              </a-select>
              <a-date-picker v-model="dateVal" style="width: 100%" />
            </a-space>
          </a-card>
          <a-card title="开关 / 单选 / 勾选" :bordered="true" class="pg-comp__card">
            <a-space direction="vertical" :size="14">
              <a-switch v-model="switchVal" />
              <a-radio-group v-model="radioVal" type="button">
                <a-radio value="list">列表</a-radio>
                <a-radio value="card">卡片</a-radio>
              </a-radio-group>
              <a-checkbox v-model="checkVal">记住选择</a-checkbox>
            </a-space>
          </a-card>
        </div>
      </section>

      <!-- 数据展示 -->
      <section class="pg-comp__section">
        <h2 class="pg-comp__h2">数据展示</h2>
        <a-card title="标签页 + 表格 + 分页" :bordered="true" class="pg-comp__card">
          <a-tabs v-model:active-key="tabKey" type="capsule">
            <a-tab-pane key="todo" title="待处理" />
            <a-tab-pane key="done" title="已处理" />
          </a-tabs>
          <a-table :data="tableData" :columns="tableColumns" :pagination="false" size="small">
            <template #type="{ record }">
              <a-tag :color="record.typeColor" size="small">{{ record.type }}</a-tag>
            </template>
            <template #status="{ record }">
              <a-badge :status="record.status" :text="record.statusText" />
            </template>
          </a-table>
          <div class="pg-comp__pagination">
            <a-pagination v-model:current="pageCurrent" :total="50" size="small" show-total />
          </div>
        </a-card>
      </section>

      <!-- 反馈 -->
      <section class="pg-comp__section">
        <h2 class="pg-comp__h2">反馈</h2>
        <div class="pg-comp__grid">
          <a-card title="警告提示 Alert" :bordered="true" class="pg-comp__card">
            <a-space direction="vertical" fill :size="8">
              <a-alert type="info">信息提示</a-alert>
              <a-alert type="success">成功提示</a-alert>
              <a-alert type="warning">警告提示</a-alert>
              <a-alert type="error">错误提示</a-alert>
            </a-space>
          </a-card>
          <a-card title="消息 / 对话框" :bordered="true" class="pg-comp__card">
            <a-space :size="8">
              <a-button @click="toast">全局消息 Message</a-button>
              <a-button type="primary" @click="modalVisible = true">打开对话框</a-button>
            </a-space>
            <a-modal v-model:visible="modalVisible" title="对话框标题" title-align="start">
              <p>这是一个 Modal 对话框示例，标题左对齐、青绿主色确认按钮。</p>
            </a-modal>
          </a-card>
        </div>
      </section>

      <!-- 组件选型元数据 -->
      <section class="pg-comp__section">
        <h2 class="pg-comp__h2">组件选型（来自 skill catalog）</h2>
        <p class="pg-comp__note">每个组件的「适用任务」帮助选型；完整「变体 / 组合边界 / 常见坑」见 skill 的 component-selection 文档。</p>
        <div class="pg-comp__selection">
          <div v-for="c in selectionComponents" :key="c.id" class="pg-comp__sel-item">
            <div class="pg-comp__sel-title">{{ c.title }}</div>
            <div class="pg-comp__sel-when">{{ (c.whenToUse || []).join(' · ') }}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pg-comp {
  background: var(--color-bg-1);
  min-height: 100%;
}

.pg-comp__inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 32px 56px;
}

.pg-comp__title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-1);
}

.pg-comp__lede {
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-comp__section {
  margin-top: 36px;
}

.pg-comp__h2 {
  margin: 0 0 16px;
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-comp__note {
  margin: -8px 0 16px;
  font-size: 13px;
  color: var(--color-text-3);
}

.pg-comp__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.pg-comp__card {
  border-radius: var(--border-radius-large);
}

.pg-comp__pagination {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.pg-comp__selection {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.pg-comp__sel-item {
  padding: 14px 16px;
  background: var(--color-fill-1);
  border-radius: var(--border-radius-large);
}

.pg-comp__sel-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-comp__sel-when {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--color-text-2);
}
</style>
