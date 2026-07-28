<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import { IconDown, IconEdit, IconDelete, IconDownload, IconSettings } from '@arco-iconbox/vue-pangea-mobile';
import DemoBlock from '../DemoBlock.vue';

function onSelect(v: string | number | Record<string, any> | undefined) {
  Message.success(`选择了：${typeof v === 'object' ? JSON.stringify(v) : v}`);
}
</script>

<template>
  <div>
    <DemoBlock title="基础用法" desc="默认 slot 是触发元素，#content 放选项；@select 获取选中值，选项可 disabled。">
      <a-space size="large">
        <a-dropdown @select="onSelect">
          <a-button>点我 <IconDown /></a-button>
          <template #content>
            <a-doption value="opt1">选项一</a-doption>
            <a-doption value="opt2" disabled>选项二（禁用）</a-doption>
            <a-doption value="opt3">选项三</a-doption>
          </template>
        </a-dropdown>
        <a-dropdown disabled>
          <a-button disabled>禁用 <IconDown /></a-button>
          <template #content>
            <a-doption>选项一</a-doption>
          </template>
        </a-dropdown>
      </a-space>
    </DemoBlock>

    <DemoBlock title="触发方式" desc="trigger：hover 悬停 / click 点击 / focus 聚焦。">
      <a-space size="large">
        <a-dropdown trigger="hover" @select="onSelect">
          <a-button type="outline">悬停触发 <IconDown /></a-button>
          <template #content>
            <a-doption value="a">选项 A</a-doption>
            <a-doption value="b">选项 B</a-doption>
          </template>
        </a-dropdown>
        <a-dropdown trigger="click" @select="onSelect">
          <a-button type="outline">点击触发 <IconDown /></a-button>
          <template #content>
            <a-doption value="a">选项 A</a-doption>
            <a-doption value="b">选项 B</a-doption>
          </template>
        </a-dropdown>
      </a-space>
    </DemoBlock>

    <DemoBlock title="带图标的选项" desc="通过 a-doption 的 #icon 插槽为选项加图标。">
      <a-dropdown @select="onSelect">
        <a-button type="primary">操作 <IconDown /></a-button>
        <template #content>
          <a-doption value="edit">
            <template #icon><IconEdit /></template>
            编辑
          </a-doption>
          <a-doption value="download">
            <template #icon><IconDownload /></template>
            下载
          </a-doption>
          <a-doption value="settings">
            <template #icon><IconSettings /></template>
            设置
          </a-doption>
          <a-doption value="delete">
            <template #icon><IconDelete /></template>
            删除
          </a-doption>
        </template>
      </a-dropdown>
    </DemoBlock>

    <DemoBlock title="弹出位置" desc="position 控制弹出方位（如 bottom / br / left 等）。">
      <a-space size="large">
        <a-dropdown position="br" @select="onSelect">
          <a-button type="outline">br 右下</a-button>
          <template #content>
            <a-doption value="1">选项一</a-doption>
            <a-doption value="2">选项二</a-doption>
          </template>
        </a-dropdown>
        <a-dropdown position="top" @select="onSelect">
          <a-button type="outline">top 上方</a-button>
          <template #content>
            <a-doption value="1">选项一</a-doption>
            <a-doption value="2">选项二</a-doption>
          </template>
        </a-dropdown>
      </a-space>
    </DemoBlock>

    <DemoBlock title="下拉按钮" desc="a-dropdown-button = 主操作按钮 + 下拉触发。">
      <a-dropdown-button @select="onSelect">
        提交
        <template #icon><IconDown /></template>
        <template #content>
          <a-doption value="save">保存草稿</a-doption>
          <a-doption value="submit">提交审批</a-doption>
        </template>
      </a-dropdown-button>
    </DemoBlock>
  </div>
</template>
