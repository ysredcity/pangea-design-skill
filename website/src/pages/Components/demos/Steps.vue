<script setup lang="ts">
import { ref } from 'vue';
import DemoBlock from '../DemoBlock.vue';

const current = ref(2);
</script>

<template>
  <div>
    <DemoBlock title="基础用法" desc="current 指定当前步骤（1 起）。已完成 / 进行中 / 待处理三态自动着色。">
      <a-steps :current="2">
        <a-step>提交申请</a-step>
        <a-step>部门审批</a-step>
        <a-step>财务复核</a-step>
        <a-step>完成</a-step>
      </a-steps>
    </DemoBlock>

    <DemoBlock title="带描述" desc="每步可加 description 说明。">
      <a-steps :current="2">
        <a-step description="用户发起单据">提交申请</a-step>
        <a-step description="主管审批中">部门审批</a-step>
        <a-step description="等待财务处理">财务复核</a-step>
        <a-step description="流程结束">完成</a-step>
      </a-steps>
    </DemoBlock>

    <DemoBlock title="可点击切换" desc="changeable + v-model:current，点击步骤切换（当前：第 {{ current }} 步）。">
      <a-steps v-model:current="current" changeable>
        <a-step>第一步</a-step>
        <a-step>第二步</a-step>
        <a-step>第三步</a-step>
      </a-steps>
    </DemoBlock>

    <DemoBlock title="小型步骤条" desc="small 更紧凑，适合空间有限处。">
      <a-steps :current="2" small>
        <a-step>提交</a-step>
        <a-step>审批</a-step>
        <a-step>完成</a-step>
      </a-steps>
    </DemoBlock>

    <DemoBlock title="点状 / 箭头 / 导航" desc="type：dot 点状 / arrow 箭头 / navigation 导航。">
      <a-space direction="vertical" :size="24" fill>
        <a-steps :current="2" type="dot">
          <a-step description="步骤一说明">步骤一</a-step>
          <a-step description="步骤二说明">步骤二</a-step>
          <a-step description="步骤三说明">步骤三</a-step>
        </a-steps>
        <a-steps :current="2" type="arrow">
          <a-step>步骤一</a-step>
          <a-step>步骤二</a-step>
          <a-step>步骤三</a-step>
        </a-steps>
        <a-steps :current="2" type="navigation">
          <a-step>步骤一</a-step>
          <a-step>步骤二</a-step>
          <a-step>步骤三</a-step>
        </a-steps>
      </a-space>
    </DemoBlock>

    <DemoBlock title="错误状态" desc="status='error' 标记当前步骤失败。">
      <a-steps :current="2" status="error">
        <a-step>提交申请</a-step>
        <a-step>部门审批</a-step>
        <a-step>财务复核</a-step>
      </a-steps>
    </DemoBlock>

    <DemoBlock title="垂直方向" desc="direction='vertical' 竖直排列，适合详情侧栏 / 时间线式流程。">
      <div style="max-width: 320px">
        <a-steps :current="2" direction="vertical">
          <a-step description="2026-07-20 10:00">提交申请</a-step>
          <a-step description="2026-07-20 14:30">部门审批</a-step>
          <a-step description="等待处理">财务复核</a-step>
        </a-steps>
      </div>
    </DemoBlock>
  </div>
</template>
