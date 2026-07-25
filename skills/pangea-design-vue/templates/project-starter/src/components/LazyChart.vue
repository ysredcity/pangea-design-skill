<script setup lang="ts">
/**
 * LazyChart —— VChart 懒加载封装（可选依赖，按需引入）
 * ------------------------------------------------------------------
 * `@visactor/vchart` 不在脚手架基础依赖里，保持 base 轻量。
 * 需要图表时安装：  npm i @visactor/vchart
 *
 * 本组件在 onMounted 里**动态 import** vchart：
 * - 已安装 → 正常渲染图表；
 * - 未安装 → 显示占位提示，且不影响 dev / build（vite.config 已把该包按可选处理）。
 *
 * 用法：<LazyChart :spec="chartSpec" height="240px" />
 * spec 为 VChart 的图表配置对象（配色请取 Pangea 调色板色值，见 design-tokens.md）。
 */
import { ref, shallowRef, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  /** VChart spec（图表配置对象） */
  spec: Record<string, any>;
  /** 容器高度，默认 240px */
  height?: string;
}>();

const el = ref<HTMLDivElement | null>(null);
const chart = shallowRef<any>(null);
const unavailable = ref(false);

onMounted(async () => {
  if (!el.value) return;
  try {
    // @ts-ignore 可选依赖：未安装 @visactor/vchart 时忽略类型解析，运行时由 catch 兜底
    const mod: any = await import('@visactor/vchart');
    const VChart = mod.default ?? mod.VChart;
    chart.value = new VChart(props.spec, { dom: el.value });
    chart.value.renderSync();
  } catch {
    // 未安装 @visactor/vchart 或加载失败 → 占位降级
    unavailable.value = true;
  }
});

onBeforeUnmount(() => {
  chart.value?.release?.();
  chart.value = null;
});
</script>

<template>
  <div class="pg-lazy-chart" :style="{ height: height || '240px' }">
    <div v-show="!unavailable" ref="el" class="pg-lazy-chart__canvas" />
    <div v-if="unavailable" class="pg-lazy-chart__placeholder">
      <span>图表未启用</span>
      <span class="pg-lazy-chart__hint">运行 <code>npm i @visactor/vchart</code> 后显示</span>
    </div>
  </div>
</template>

<style scoped>
.pg-lazy-chart {
  position: relative;
  width: 100%;
}

.pg-lazy-chart__canvas {
  width: 100%;
  height: 100%;
}

.pg-lazy-chart__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px dashed var(--color-border-3);
  border-radius: var(--border-radius-medium);
  color: var(--color-text-3);
  font-size: 13px;
}

.pg-lazy-chart__hint {
  font-size: 12px;
  color: var(--color-text-3);
}

.pg-lazy-chart__hint code {
  padding: 0 4px;
  background: var(--color-fill-2);
  border-radius: var(--border-radius-small);
}
</style>
