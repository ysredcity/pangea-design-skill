<script setup lang="ts">
// 示例页面：演示「页面 = 全局 Layout 下的一个子路由」这一层级约定。
// 复制本文件到 src/pages/<PageName>/index.vue 即可作为新页面的起点。
//
// 要点：
// - 组件用 Arco Vue（a-*），视觉全部走 Pangea 主题（语义 token / 品牌青绿主色）。
// - 图标从 Pangea 图标包按需导入（命名导入，tree-shakable）。
// - demo（PM）用 mock 数据；开发（工程师）把 mock 换成真实接口即可，页面结构不变。
import { ref } from 'vue';
import { IconPieChart } from '@arco-iconbox/vue-pangea-mobile';

interface Row {
  key: string;
  name: string;
  status: 'running' | 'done';
}

// mock 数据（交付开发时替换为接口请求）
const loading = ref(false);
const columns = [
  { title: '名称', dataIndex: 'name' },
  { title: '状态', slotName: 'status' },
];
const data = ref<Row[]>([
  { key: '1', name: '任务 A', status: 'running' },
  { key: '2', name: '任务 B', status: 'done' },
]);
</script>

<template>
  <a-space direction="vertical" fill :size="16">
    <a-card>
      <template #title>
        <a-space :size="8">
          <IconPieChart style="color: rgb(var(--primary-6))" />
          示例页面
        </a-space>
      </template>
      <template #extra>
        <a-button type="primary">主操作</a-button>
      </template>
      <p style="color: var(--color-text-2); margin: 0">
        这是全局 Layout 内容区中的一个子路由页面。请在此基于 Arco Vue 组件 + Pangea 主题 token 构建业务界面。
      </p>
    </a-card>

    <a-card title="数据列表">
      <a-table :columns="columns" :data="data" :loading="loading" row-key="key">
        <template #status="{ record }">
          <a-tag :color="record.status === 'done' ? 'green' : 'arcoblue'">
            {{ record.status === 'done' ? '已完成' : '进行中' }}
          </a-tag>
        </template>
      </a-table>
    </a-card>
  </a-space>
</template>
