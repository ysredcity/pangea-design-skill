<script setup lang="ts">
/**
 * 组件示例块：统一「小标题 + 说明 + live 舞台」的呈现，供各组件 demo 复用。
 */
defineProps<{ title: string; desc?: string }>();
</script>

<template>
  <section class="pg-demo">
    <div class="pg-demo__head">
      <h3 class="pg-demo__title">{{ title }}</h3>
      <p v-if="desc" class="pg-demo__desc">{{ desc }}</p>
    </div>
    <div class="pg-demo__stage">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.pg-demo {
  margin-bottom: 20px;
}

.pg-demo__head {
  margin-bottom: 10px;
}

.pg-demo__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-demo__desc {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-3);
}

.pg-demo__stage {
  padding: 24px 20px;
  background: var(--color-bg-1);
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-large);
}
</style>
