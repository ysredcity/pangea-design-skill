<script setup lang="ts">
/**
 * FilterBar 专属 demo
 * ------------------------------------------------------------------
 * 组件本体从 skill 同步而来（src/generated/templates/components/FilterBar.vue），
 * 与脚手架的卡片列表页/基础列表页共用同一份实现。
 */
import { ref, reactive } from 'vue';
import DemoBlock from '../DemoBlock.vue';
import FilterBar from '@/generated/templates/components/FilterBar.vue';

const searchFields = [
  { value: 'name', label: '名称' },
  { value: 'code', label: '编码' },
];
const filterPlanOptions = [
  { value: 'p1', label: '方案一' },
  { value: 'p2', label: '方案二' },
];
const advancedFields = [
  { field: 'f1', label: 'Label' },
  { field: 'f2', label: 'Label' },
  { field: 'f3', label: 'Label' },
];

/** 每个 demo 各自持有一份独立状态，避免相互串扰 */
function createState() {
  const advancedForm = reactive<Record<string, string>>({ f1: '', f2: '', f3: '' });
  return {
    filterPlan: ref<string | number | undefined>(undefined),
    searchField: ref<string | number | undefined>('name'),
    searchKeyword: ref(''),
    advancedVisible: ref(false),
    advancedForm,
    reset: () => advancedFields.forEach((f) => (advancedForm[f.field] = '')),
  };
}

// demo 1：三个开关全开
const s1 = createState();
// demo 2：只留搜索框
const s2 = createState();
// demo 3：标题放 radio-button 切换视图
const s3 = createState();
const view3 = ref('all');
</script>

<template>
  <div>
    <DemoBlock
      title="三个开关全开"
      desc="筛选方案、搜索框、筛选面板三种筛选方式各有独立开关，默认全部开启，这是最完整的形态（基础列表页即用此形态）。标题放在 #title 插槽。"
    >
      <FilterBar
        v-model:filter-plan="s1.filterPlan.value"
        v-model:search-field="s1.searchField.value"
        v-model:search-keyword="s1.searchKeyword.value"
        v-model:advanced-form="s1.advancedForm"
        v-model:advanced-visible="s1.advancedVisible.value"
        :filter-plan-options="filterPlanOptions"
        :search-fields="searchFields"
        :advanced-fields="advancedFields"
        @advanced-reset="s1.reset"
      >
        <template #title>
          <h2 class="demo-title">页面名称</h2>
        </template>
      </FilterBar>
    </DemoBlock>

    <DemoBlock
      title="按场景关闭部分筛选方式：只留搜索框"
      desc="筛选条件很少、也不需要保存筛选方案时，关掉筛选方案与筛选面板两个开关即可。"
    >
      <FilterBar
        v-model:search-field="s2.searchField.value"
        v-model:search-keyword="s2.searchKeyword.value"
        :show-filter-plan="false"
        :show-advanced-panel="false"
        :search-fields="searchFields"
      >
        <template #title>
          <h2 class="demo-title">页面名称</h2>
        </template>
      </FilterBar>
    </DemoBlock>

    <DemoBlock
      title="标题为动态元素"
      desc="#title 插槽不限于纯文字，也可以放 radio-button 等元素——比如用同一套筛选器区分「全部/待处理/已处理」视图。"
    >
      <FilterBar
        v-model:search-field="s3.searchField.value"
        v-model:search-keyword="s3.searchKeyword.value"
        v-model:advanced-form="s3.advancedForm"
        v-model:advanced-visible="s3.advancedVisible.value"
        :show-filter-plan="false"
        :search-fields="searchFields"
        :advanced-fields="advancedFields"
        @advanced-reset="s3.reset"
      >
        <template #title>
          <a-radio-group v-model="view3" type="button" size="small">
            <a-radio value="all">全部</a-radio>
            <a-radio value="todo">待处理</a-radio>
            <a-radio value="done">已处理</a-radio>
          </a-radio-group>
        </template>
      </FilterBar>
    </DemoBlock>
  </div>
</template>

<style scoped>
.demo-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
  color: var(--color-text-1);
}
</style>
