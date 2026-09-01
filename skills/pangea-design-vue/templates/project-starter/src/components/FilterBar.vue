<script setup lang="ts">
/**
 * FilterBar —— 复合筛选器（通用组件）
 * ------------------------------------------------------------------
 * 「筛选方案 + 搜索框 + 可展开的筛选面板」这套页头形态在卡片列表页 / 基础列表页
 * 中重复出现，抽成本组件统一维护，避免每个页面各写一份、逐渐漂移。
 *
 * 三种筛选方式各有独立开关（showFilterPlan / showSearch / showAdvancedPanel，
 * 均默认开启），按场景自由组合启停——不存在"某种固定的简化形态"，都是开关组合。
 *
 * 布局职责划分：
 * - 本组件只负责「筛选行 + 高级筛选面板」这一块内容；**不包含操作按钮组**
 *   （创建/导入/导出/打印等）——按钮组是页面自己的内容，与筛选器是并列关系，
 *   不属于本组件职责，由各页面在自己的 header 里另行渲染。
 * - 外层 header 的内边距 / 底部分割线等仍由各页面自己的容器决定
 *   （因为不同页面的页头留白可能不同，不适合在这里写死）。
 * - 左上角标题区域用 #title 插槽（默认插槽），可放纯文字、也可放 a-radio-group
 *   等元素（用于切换视图）。
 *
 * 用法见 references/components-shared/filter-bar.md。
 */
import { computed } from 'vue';
import { IconUp, IconDown, IconSave, IconUndo } from '@arco-iconbox/vue-pangea-mobile';

export interface FilterOption {
  value: string | number;
  label: string;
}

export interface AdvancedField {
  /** 字段 key，对应 advancedForm 里的属性名 */
  field: string;
  /** 字段 label */
  label: string;
}

const props = withDefaults(
  defineProps<{
    // ===== 三个筛选方式的开关：按场景独立控制「筛选方案 / 搜索框 / 筛选面板」的启停 =====
    // 均默认开启（最完整形态 = 基础列表页）。不需要哪个就显式传 false。
    // 注意：不能靠对应的 options/fields 是否为空来自动判断显隐——候选项常是运行时
    // 异步拉取的，数据还没到位时会被误判成"这个场景不需要该控件"。
    /** 开关①：筛选方案下拉 */
    showFilterPlan?: boolean;
    /** 开关②：搜索框 */
    showSearch?: boolean;
    /** 开关③：可展开的筛选面板（含筛选行右侧的展开/折叠按钮） */
    showAdvancedPanel?: boolean;

    /** 筛选方案下拉的当前值 */
    filterPlan?: string | number;
    /** 筛选方案候选项 */
    filterPlanOptions?: FilterOption[];
    filterPlanPlaceholder?: string;

    /** 搜索框是否带前置的字段下拉（搜索框内部的细分选项，默认带）；传 false 则为单纯关键词搜索 */
    showSearchField?: boolean;
    /** 搜索框：当前搜索字段 */
    searchField?: string | number;
    /** 搜索框：可选字段 */
    searchFields?: FilterOption[];
    /** 搜索框：关键词 */
    searchKeyword?: string;
    searchPlaceholder?: string;

    /** 筛选面板的字段定义 */
    advancedFields?: AdvancedField[];
    /** 筛选面板表单的当前值，key 对应 advancedFields[].field */
    advancedForm?: Record<string, string>;
    /** 筛选面板展开/折叠状态 */
    advancedVisible?: boolean;
  }>(),
  {
    showFilterPlan: true,
    showSearch: true,
    showAdvancedPanel: true,
    filterPlan: undefined,
    filterPlanOptions: () => [],
    filterPlanPlaceholder: '筛选方案',
    showSearchField: true,
    searchField: undefined,
    searchFields: () => [],
    searchKeyword: '',
    searchPlaceholder: '请输入搜索内容',
    advancedFields: () => [],
    advancedForm: () => ({}),
    advancedVisible: false,
  }
);

const emit = defineEmits<{
  (e: 'update:filterPlan', value: string | number | undefined): void;
  (e: 'update:searchField', value: string | number | undefined): void;
  (e: 'update:searchKeyword', value: string): void;
  (e: 'update:advancedForm', value: Record<string, string>): void;
  (e: 'update:advancedVisible', value: boolean): void;
  /** 简单搜索框回车 */
  (e: 'search'): void;
  /** 高级筛选面板点击「查询」 */
  (e: 'advanced-query'): void;
  /** 高级筛选面板点击「重置」 */
  (e: 'advanced-reset'): void;
  /** 高级筛选面板点击「保存」（保存为筛选方案） */
  (e: 'advanced-save'): void;
}>();

// 搜索框内的字段下拉：既要开关为真，也要真的有候选字段才有意义
const hasSearchFields = computed(
  () => props.showSearchField && (props.searchFields?.length ?? 0) > 0
);

function updateAdvancedField(field: string, value: string) {
  emit('update:advancedForm', { ...props.advancedForm, [field]: value });
}

function toggleAdvanced() {
  emit('update:advancedVisible', !props.advancedVisible);
}
</script>

<template>
  <div class="pg-filter-bar">
    <!-- 筛选行：标题 slot + 筛选方案 + 简单搜索 + 展开/折叠按钮 -->
    <div class="pg-filter-bar__row">
      <div class="pg-filter-bar__title">
        <slot name="title" />
      </div>
      <div class="pg-filter-bar__controls">
        <a-select
          v-if="showFilterPlan"
          :model-value="filterPlan"
          :placeholder="filterPlanPlaceholder"
          size="small"
          allow-clear
          :style="{ width: '128px' }"
          @update:model-value="(v) => emit('update:filterPlan', v as string | number | undefined)"
        >
          <a-option v-for="o in filterPlanOptions" :key="o.value" :value="o.value" :label="o.label" />
        </a-select>

        <a-input-group v-if="showSearch" class="pg-filter-bar__search-group">
          <a-select
            v-if="hasSearchFields"
            :model-value="searchField"
            size="small"
            :style="{ width: '80px' }"
            @update:model-value="(v) => emit('update:searchField', v as string | number | undefined)"
          >
            <a-option v-for="f in searchFields" :key="f.value" :value="f.value" :label="f.label" />
          </a-select>
          <a-input
            :model-value="searchKeyword"
            size="small"
            :placeholder="searchPlaceholder"
            allow-clear
            @update:model-value="(v) => emit('update:searchKeyword', v)"
            @press-enter="emit('search')"
          />
        </a-input-group>

        <!-- 展开/折叠筛选面板 -->
        <a-button
          v-if="showAdvancedPanel"
          size="small"
          class="pg-filter-bar__adv-toggle"
          @click="toggleAdvanced"
        >
          <template #icon>
            <IconUp v-if="advancedVisible" />
            <IconDown v-else />
          </template>
        </a-button>
      </div>
    </div>

    <!-- 筛选面板：展开时显示更多筛选条件，支持多字段同时查询 -->
    <div v-if="showAdvancedPanel" v-show="advancedVisible" class="pg-filter-bar__panel">
      <div v-for="f in advancedFields" :key="f.field" class="pg-filter-bar__adv-item">
        <span class="pg-filter-bar__adv-label">{{ f.label }}</span>
        <a-input
          :model-value="advancedForm[f.field]"
          size="small"
          placeholder="请输入"
          allow-clear
          @update:model-value="(v) => updateAdvancedField(f.field, v)"
        />
      </div>
      <div class="pg-filter-bar__adv-actions">
        <a-button size="small" @click="emit('advanced-save')">
          <template #icon><IconSave /></template>
        </a-button>
        <a-button size="small" @click="emit('advanced-reset')">
          <template #icon><IconUndo /></template>
        </a-button>
        <a-button type="primary" size="small" @click="emit('advanced-query')">查询</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pg-filter-bar {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pg-filter-bar__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.pg-filter-bar__title {
  min-width: 0;
  flex: 1;
}

.pg-filter-bar__controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* 搜索框整体宽度：带字段下拉时前置 select 占 80px，剩余归输入框。
   输入框只用于关键词短查询，不需要很宽——多字段/长条件走筛选面板。 */
.pg-filter-bar__search-group {
  width: 256px;
}

/* 高级筛选面板：灰底 + 边框，响应式栅格，字段 label + input；右下角保存/重置/查询 */
.pg-filter-bar__panel {
  display: grid;
  /* 响应式：列随宽度自适应收敛，窄屏自动减列 */
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px 24px;
  padding: 16px;
  background: var(--color-fill-1);
  border: 1px solid var(--color-border-3);
  border-radius: var(--border-radius-medium);
}

.pg-filter-bar__adv-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pg-filter-bar__adv-label {
  flex-shrink: 0;
  min-width: 40px;
  text-align: right;
  font-size: 14px;
  color: var(--color-text-2);
}

.pg-filter-bar__adv-item :deep(.arco-input-wrapper) {
  flex: 1;
}

/* 动作组：独占整行、右对齐（窄屏收列时仍稳定落在最后一行右下） */
.pg-filter-bar__adv-actions {
  grid-column: 1 / -1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 8px;
}

</style>
