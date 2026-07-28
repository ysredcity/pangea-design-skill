<script setup lang="ts">
import { IconPlus, IconSearch, IconEdit, IconDelete, IconDownload } from '@arco-iconbox/vue-pangea-mobile';
import DemoBlock from '../DemoBlock.vue';
</script>

<template>
  <div>
    <DemoBlock title="按钮类型" desc="primary 主要 / secondary 次要(默认) / dashed 虚线 / outline 线形 / text 文本。一组操作只突出一个主按钮。">
      <a-space wrap>
        <a-button type="primary">主要按钮</a-button>
        <a-button>次要按钮</a-button>
        <a-button type="dashed">虚线按钮</a-button>
        <a-button type="outline">线形按钮</a-button>
        <a-button type="text">文本按钮</a-button>
      </a-space>
    </DemoBlock>

    <DemoBlock title="按钮状态" desc="normal / success / warning / danger，可与类型组合。危险操作用 danger。">
      <a-space direction="vertical" :size="12" fill>
        <a-space wrap>
          <a-button type="primary">正常</a-button>
          <a-button type="primary" status="success">成功</a-button>
          <a-button type="primary" status="warning">警告</a-button>
          <a-button type="primary" status="danger">危险</a-button>
        </a-space>
        <a-space wrap>
          <a-button type="outline">正常</a-button>
          <a-button type="outline" status="success">成功</a-button>
          <a-button type="outline" status="warning">警告</a-button>
          <a-button type="outline" status="danger">危险</a-button>
        </a-space>
      </a-space>
    </DemoBlock>

    <DemoBlock title="按钮尺寸" desc="mini 24 / small 28 / medium 32(默认) / large 36。">
      <a-space wrap align="center">
        <a-button type="primary" size="mini">Mini</a-button>
        <a-button type="primary" size="small">Small</a-button>
        <a-button type="primary" size="medium">Medium</a-button>
        <a-button type="primary" size="large">Large</a-button>
      </a-space>
    </DemoBlock>

    <DemoBlock title="按钮形状" desc="square 长方形(默认) / round 全圆角 / circle 圆形(仅图标)。">
      <a-space wrap align="center">
        <a-button type="primary">长方形</a-button>
        <a-button type="primary" shape="round">全圆角</a-button>
        <a-button type="primary" shape="circle">
          <template #icon><IconSearch /></template>
        </a-button>
      </a-space>
    </DemoBlock>

    <DemoBlock title="图标按钮" desc="通过 #icon 插槽嵌入图标；只放图标时按钮宽高相等。">
      <a-space wrap align="center">
        <a-button type="primary">
          <template #icon><IconPlus /></template>
          新建
        </a-button>
        <a-button>
          <template #icon><IconDownload /></template>
          下载
        </a-button>
        <a-button type="outline" shape="circle">
          <template #icon><IconEdit /></template>
        </a-button>
        <a-button type="outline" status="danger" shape="circle">
          <template #icon><IconDelete /></template>
        </a-button>
      </a-space>
    </DemoBlock>

    <DemoBlock title="加载中" desc="loading 状态下不触发点击。">
      <a-space wrap>
        <a-button type="primary" loading>加载中</a-button>
        <a-button type="outline" loading>加载中</a-button>
        <a-button type="primary" loading shape="circle" />
      </a-space>
    </DemoBlock>

    <DemoBlock title="禁用状态" desc="disabled 禁用各类型按钮。">
      <a-space wrap>
        <a-button type="primary" disabled>主要</a-button>
        <a-button disabled>次要</a-button>
        <a-button type="dashed" disabled>虚线</a-button>
        <a-button type="outline" disabled>线形</a-button>
        <a-button type="text" disabled>文本</a-button>
      </a-space>
    </DemoBlock>

    <DemoBlock title="长按钮" desc="long 宽度随容器自适应，常用于表单底部 / 移动端。">
      <div style="max-width: 320px">
        <a-button type="primary" long>提交</a-button>
      </div>
    </DemoBlock>

    <DemoBlock title="按钮组" desc="用 a-button-group 组合同级多项操作。">
      <a-button-group type="primary">
        <a-button>上一步</a-button>
        <a-button>下一步</a-button>
      </a-button-group>
      <a-button-group type="outline" style="margin-left: 16px">
        <a-button>
          <template #icon><IconEdit /></template>
        </a-button>
        <a-button>
          <template #icon><IconDownload /></template>
        </a-button>
        <a-button>
          <template #icon><IconDelete /></template>
        </a-button>
      </a-button-group>
    </DemoBlock>
  </div>
</template>
