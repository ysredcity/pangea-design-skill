<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { IconTool } from '@arco-iconbox/vue-pangea-mobile';

const route = useRoute();
const title = computed(() => (route.meta.title as string) || '敬请期待');
</script>

<template>
  <div class="pg-coming">
    <div class="pg-coming__box">
      <IconTool class="pg-coming__icon" />
      <h2 class="pg-coming__title">{{ title }}</h2>
      <p class="pg-coming__desc">该栏目正在建设中，将在后续阶段上线。</p>
      <a-space :size="8">
        <a-button type="primary" @click="$router.push('/')">返回介绍</a-button>
        <a-button @click="$router.push('/guide')">看使用指南</a-button>
      </a-space>
    </div>
  </div>
</template>

<style scoped>
.pg-coming {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 48px 16px;
  background: var(--color-bg-1);
}

.pg-coming__box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.pg-coming__icon {
  font-size: 40px;
  color: var(--color-text-3);
}

.pg-coming__title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-coming__desc {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--color-text-3);
}
</style>
