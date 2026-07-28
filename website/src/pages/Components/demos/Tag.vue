<script setup lang="ts">
import { ref, reactive } from 'vue';
import { IconCheckCircleFill, IconUser } from '@arco-iconbox/vue-pangea-mobile';
import DemoBlock from '../DemoBlock.vue';

const colors = [
  'red', 'orangered', 'orange', 'gold', 'lime', 'green', 'cyan',
  'blue', 'arcoblue', 'purple', 'pinkpurple', 'magenta', 'gray',
] as const;

// 可关闭
const closable = ref(['标签一', '标签二', '标签三']);
function removeTag(t: string) {
  closable.value = closable.value.filter((x) => x !== t);
}
function resetClosable() {
  closable.value = ['标签一', '标签二', '标签三'];
}

// 可选中
const checked = reactive<Record<string, boolean>>({ 前端: true, 后端: false, 设计: false });
</script>

<template>
  <div>
    <DemoBlock title="基础用法" desc="默认标签，可通过 #icon 插槽加图标。">
      <a-space wrap>
        <a-tag>默认</a-tag>
        <a-tag>标签一</a-tag>
        <a-tag>
          <template #icon><IconCheckCircleFill /></template>
          已完成
        </a-tag>
        <a-tag>
          <template #icon><IconUser /></template>
          雪梅
        </a-tag>
      </a-space>
    </DemoBlock>

    <DemoBlock title="预设颜色" desc="13 个预设色（color）；也支持自定义色值。分类标注用 Tag，状态用 Badge。">
      <a-space wrap>
        <a-tag v-for="c in colors" :key="c" :color="c">{{ c }}</a-tag>
      </a-space>
    </DemoBlock>

    <DemoBlock title="带边框" desc="bordered 显示描边（浅色/白底场景更清晰）。">
      <a-space wrap>
        <a-tag bordered>默认</a-tag>
        <a-tag color="arcoblue" bordered>arcoblue</a-tag>
        <a-tag color="green" bordered>green</a-tag>
        <a-tag color="orange" bordered>orange</a-tag>
      </a-space>
    </DemoBlock>

    <DemoBlock title="标签尺寸" desc="small / medium(默认) / large。">
      <a-space wrap align="center">
        <a-tag size="small" color="arcoblue">Small</a-tag>
        <a-tag size="medium" color="arcoblue">Medium</a-tag>
        <a-tag size="large" color="arcoblue">Large</a-tag>
      </a-space>
    </DemoBlock>

    <DemoBlock title="可关闭" desc="closable + @close 移除；这里配了重置按钮。">
      <a-space wrap align="center">
        <a-tag v-for="t in closable" :key="t" color="arcoblue" closable @close="removeTag(t)">{{ t }}</a-tag>
        <a-button v-if="closable.length < 3" size="mini" type="outline" @click="resetClosable">重置</a-button>
      </a-space>
    </DemoBlock>

    <DemoBlock title="可选中" desc="checkable + v-model:checked 实现筛选/多选态。">
      <a-space wrap>
        <a-tag v-for="k in Object.keys(checked)" :key="k" checkable v-model:checked="checked[k]" color="arcoblue">
          {{ k }}
        </a-tag>
      </a-space>
    </DemoBlock>

    <DemoBlock title="加载中" desc="loading 表示标签处理中。">
      <a-space wrap>
        <a-tag color="arcoblue" loading>处理中</a-tag>
        <a-tag color="green" loading>同步中</a-tag>
      </a-space>
    </DemoBlock>
  </div>
</template>
