<script setup lang="ts">
import DemoBlock from '../DemoBlock.vue';

const positions = [
  { p: 'tl', label: '上左' }, { p: 'top', label: '上' }, { p: 'tr', label: '上右' },
  { p: 'lt', label: '左上' }, { p: 'rt', label: '右上' },
  { p: 'left', label: '左' }, { p: 'right', label: '右' },
  { p: 'lb', label: '左下' }, { p: 'rb', label: '右下' },
  { p: 'bl', label: '下左' }, { p: 'bottom', label: '下' }, { p: 'br', label: '下右' },
] as const;
</script>

<template>
  <div>
    <DemoBlock title="基础用法" desc="鼠标移入触发；content 为文字内容。">
      <a-space>
        <a-tooltip content="这是一段文字提示">
          <a-button>移入显示提示</a-button>
        </a-tooltip>
        <a-tooltip content="较长的提示内容会自动换行，这是第二行示例文本。">
          <a-button>多行提示</a-button>
        </a-tooltip>
      </a-space>
    </DemoBlock>

    <DemoBlock title="12 个方位" desc="position 支持 12 个方位。">
      <div class="pg-tt-grid">
        <a-tooltip v-for="it in positions" :key="it.p" :content="`position=${it.p}`" :position="it.p">
          <a-button>{{ it.label }}</a-button>
        </a-tooltip>
      </div>
    </DemoBlock>

    <DemoBlock title="迷你尺寸" desc="mini 适用于小场景或数字气泡。">
      <a-tooltip content="迷你提示" mini>
        <a-button>迷你 Tooltip</a-button>
      </a-tooltip>
    </DemoBlock>

    <DemoBlock title="自定义背景色" desc="background-color 自定义气泡背景（此处用品牌主色）。">
      <a-tooltip content="品牌主色气泡" background-color="rgb(var(--primary-6))">
        <a-button type="primary">主色提示</a-button>
      </a-tooltip>
    </DemoBlock>

    <DemoBlock title="富文本内容" desc="用 #content 插槽放自定义内容。">
      <a-tooltip position="right">
        <template #content>
          <div style="line-height: 1.6">
            <div style="font-weight: 600">标题</div>
            <div>可放多行说明或操作提示。</div>
          </div>
        </template>
        <a-button>自定义内容</a-button>
      </a-tooltip>
    </DemoBlock>
  </div>
</template>

<style scoped>
.pg-tt-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 120px));
  gap: 12px;
}
</style>
