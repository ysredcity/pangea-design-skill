<script setup lang="ts">
/**
 * 模板预览页的「返回模板列表」悬浮按钮（**仅官网使用**）
 * ------------------------------------------------------------------
 * 预览页渲染的是从 skill 脚手架同步过来的示例页（`src/generated/templates/pages/**`），
 * 那些文件是 `npm run sync` 的**快照**——在里面加返回入口会被下次同步覆盖，
 * 而且会把「官网导航」这种与模板无关的东西混进交付给用户的模板代码里。
 * 所以这个按钮放在官网侧、由 GlobalLayout 渲染，模板文件零改动。
 *
 * 只在**模板预览路由**（/templates/<某个模板>）出现；模板索引页 /templates 本身不显示。
 */
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IconLeft } from '@arco-iconbox/vue-pangea-mobile';

const props = withDefaults(defineProps<{ /** 侧边栏当前宽度，用于横向避让 */ offsetLeft?: number }>(), {
  offsetLeft: 0,
});

const route = useRoute();
const router = useRouter();

// /templates 是索引页本身，不显示；/templates/xxx 才是预览页
const visible = computed(() => /^\/templates\/.+/.test(route.path));
</script>

<template>
  <button
    v-if="visible"
    class="pg-tpl-back"
    type="button"
    :style="{ left: offsetLeft + 24 + 'px' }"
    @click="router.push('/templates')"
  >
    <IconLeft class="pg-tpl-back__icon" />
    返回
  </button>
</template>

<style scoped>
/* fixed 定位 + 跟随侧边栏宽度左移，避免压在侧边菜单上（侧边栏折叠时 offsetLeft 为 0） */
.pg-tpl-back {
  position: fixed;
  bottom: 24px;
  z-index: 90; /* 高于页面内容，低于 Arco 弹窗(1000) 与审批页全屏预览(1000) */
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 14px;
  height: 34px;
  font-size: 14px;
  /* 半透明黑底 + 白字：悬浮在任意模板页（白底/灰底）上都能看清，且不抢戏 */
  color: var(--color-white);
  background: var(--color-mask-bg);
  border: none;
  /* 注意：不能用 --border-radius-circle，它是 50%，会把这个宽按钮拉成椭圆 */
  border-radius: var(--border-radius-large);
  cursor: pointer;
  transition: background 0.2s, left 0.2s ease;
}

.pg-tpl-back:hover {
  /* hover 加深不透明度，给出可点反馈 */
  background: rgba(29, 33, 41, 0.85);
}

.pg-tpl-back__icon {
  font-size: 14px;
}
</style>
