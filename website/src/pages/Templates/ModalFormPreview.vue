<script setup lang="ts">
/**
 * 对话框表单模板 —— 独立中转页
 * ------------------------------------------------------------------
 * 对话框表单本身没有独立路由（它靠列表页「创建」触发），之前把预览路由直接指向
 * 简单列表页，用户得先找到「创建」按钮才能看到，藏得太深。
 * 改为一个轻量中转页：说明 + 一个醒目按钮，直接打开真实的 ContractModal（从
 * skill 脚手架同步来的同一份组件），点完关掉即回到本页，不用先经过列表页。
 */
import { ref } from 'vue';
import { IconLeft } from '@arco-iconbox/vue-pangea-mobile';
import { useRouter } from 'vue-router';
import ContractModal from '@/generated/templates/pages/Example/ContractModal.vue';

const router = useRouter();
const visible = ref(false);

function onSuccess() {
  // demo 页面不需要真的刷新列表，弹窗自身已给出成功提示
}
</script>

<template>
  <div class="pg-mfp">
    <div class="pg-mfp__inner">
      <button class="pg-mfp__back" type="button" @click="router.push('/templates')">
        <IconLeft />
        返回
      </button>

      <div class="pg-mfp__card">
        <h1 class="pg-mfp__title">对话框表单</h1>
        <p class="pg-mfp__desc">
          适用于字段较少、轻量的表单录入/编辑场景：在当前页弹窗内完成，无需跳转独立页面。
          实际使用中通常由列表页的「创建 / 编辑」按钮触发；这里直接给出一个入口，
          点击即可查看真实效果。
        </p>
        <a-button type="primary" size="large" @click="visible = true">打开对话框表单</a-button>
      </div>
    </div>

    <ContractModal v-model:visible="visible" @success="onSuccess" />
  </div>
</template>

<style scoped>
.pg-mfp {
  position: relative;
  min-height: 100%;
  background: var(--color-bg-1);
}

.pg-mfp__inner {
  max-width: 640px;
  margin: 0 auto;
  padding: 80px 32px;
}

.pg-mfp__back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 32px;
  padding: 6px 12px;
  font-size: 13px;
  color: var(--color-text-2);
  background: transparent;
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-medium);
  cursor: pointer;
}

.pg-mfp__back:hover {
  color: var(--color-text-1);
  background: var(--color-fill-1);
}

.pg-mfp__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 40px;
  text-align: left;
  background: var(--color-fill-1);
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-large);
}

.pg-mfp__title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-1);
}

.pg-mfp__desc {
  margin: 0;
  font-size: 14px;
  line-height: 24px;
  color: var(--color-text-2);
}
</style>
