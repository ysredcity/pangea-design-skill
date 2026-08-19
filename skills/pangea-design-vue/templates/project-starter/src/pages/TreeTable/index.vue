<script setup lang="ts">
/**
 * 左树右表列表页（示例）
 * ------------------------------------------------------------------
 * 适用**主子表结构**：左侧树选中「主表」某条主数据 → 右侧表格展示其「子表」数据，
 * 主子两侧各有独立的增删改查。典型场景：组织/人员、分类/商品、仓库/库存、项目/任务。
 *
 * 结构（对齐 Figma 219:4241）：
 *   page-header：页面标题 + 帮助文档
 *   wrapper：左侧树面板（260px，新增 + 搜索 + 树）│ 右侧子表区（操作栏 + 表格 + 分页）
 *
 * 联动契约（本模板的核心，改动时勿丢）：
 *   · 树选中项 = 右侧数据的**唯一数据源**：`selectedNode` 变了就重新拉子表并把分页复位到第 1 页
 *   · **未选中任何节点时右侧不展示表格**，给空状态引导（否则用户不知道表格为什么是空的）
 *   · 子表的「创建」必须依附于当前主数据（没选主数据时禁用），避免产生挂空的子记录
 */
import { computed, reactive, ref, watch } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import { IconPlus, IconFile, IconMore, IconList } from '@arco-iconbox/vue-pangea-mobile';

const pageTitle = '左树右表列表页';

// ====== 主表：树 ======
interface TreeNode {
  key: string;
  title: string;
  children?: TreeNode[];
}

// TODO 开发交付时替换为接口数据（树通常一次性拉全量，或按层懒加载 load-more）
const treeData = ref<TreeNode[]>([
  {
    key: 'g-1',
    title: '华东大区',
    children: [
      { key: 'g-1-1', title: '上海分公司' },
      { key: 'g-1-2', title: '杭州分公司' },
    ],
  },
  {
    key: 'g-2',
    title: '华北大区',
    children: [
      { key: 'g-2-1', title: '北京分公司' },
      { key: 'g-2-2', title: '天津分公司' },
    ],
  },
]);

const treeKeyword = ref('');
const selectedNodeKeys = ref<string[]>([]);
const expandedKeys = ref<string[]>(['g-1', 'g-2']);

/** 扁平化用于按 key 反查节点标题（右侧标题、空状态文案都要用） */
function flatten(nodes: TreeNode[], acc: TreeNode[] = []): TreeNode[] {
  nodes.forEach((n) => {
    acc.push(n);
    if (n.children) flatten(n.children, acc);
  });
  return acc;
}
const selectedNode = computed(() =>
  flatten(treeData.value).find((n) => n.key === selectedNodeKeys.value[0]),
);

/** 搜索：仅前端过滤（保留命中节点的父链），数据量大时应改为后端检索 */
const filteredTree = computed<TreeNode[]>(() => {
  const kw = treeKeyword.value.trim();
  if (!kw) return treeData.value;
  const walk = (nodes: TreeNode[]): TreeNode[] =>
    nodes.flatMap((n) => {
      const children = n.children ? walk(n.children) : [];
      if (n.title.includes(kw) || children.length) return [{ ...n, children }];
      return [];
    });
  return walk(treeData.value);
});

// ====== 主表 CRUD ======
// 新增走左上角下拉：「新增根级」始终可用；「新增子级」需要先选中一个节点（否则不知道挂在哪）
function handleAdd(kind: string) {
  if (kind === 'root') {
    Message.info('新增根级主数据（demo）');
    return;
  }
  Message.info(`在「${selectedNode.value?.title}」下新增子级（demo）`);
}
// 节点级只留 编辑 / 删除（新增子级已收进上方下拉，不重复提供）
function handleNodeAction(action: string, node: TreeNode) {
  if (action === 'delete') {
    Modal.warning({
      title: '确认删除',
      content: `删除「${node.title}」会同时删除其下所有子数据，确认删除吗？`,
      hideCancel: false,
      okButtonProps: { status: 'danger' },
      onOk: () => Message.success('已删除（demo）'),
    });
    return;
  }
  Message.info(`编辑：${node.title}（demo）`);
}

// ====== 子表：表格 ======
const searchField = ref('name');
const searchKeyword = ref('');
const searchFields = [
  { value: 'name', label: '名称' },
  { value: 'code', label: '编码' },
];

const columns = [
  { title: '成员名称', dataIndex: 'name' },
  { title: '工号', dataIndex: 'code' },
  { title: '岗位', dataIndex: 'post' },
  { title: '操作', slotName: 'actions', width: 148 },
];

const loading = ref(false);
const tableData = ref<Record<string, any>[]>([]);
const selectedKeys = ref<string[]>([]);
const pagination = reactive({ current: 1, pageSize: 20, total: 0 });

// TODO 开发交付时替换为接口：必须把当前主数据 id 作为查询条件传给后端
function fetchChildren() {
  const node = selectedNode.value;
  if (!node) {
    tableData.value = [];
    pagination.total = 0;
    return;
  }
  loading.value = true;
  setTimeout(() => {
    tableData.value = Array.from({ length: 8 }, (_, i) => ({
      key: `${node.key}-${i + 1}`,
      name: `${node.title}成员${i + 1}`,
      code: `EMP${node.key.replace(/\D/g, '')}${String(i + 1).padStart(3, '0')}`,
      post: ['销售', '售前', '交付', '管理'][i % 4],
    }));
    pagination.total = 38;
    loading.value = false;
  }, 300);
}

/** 切主数据 → 子表重拉 + 分页复位 + 清空已勾选（否则会把上一主数据的选中带过来） */
watch(selectedNodeKeys, () => {
  pagination.current = 1;
  selectedKeys.value = [];
  fetchChildren();
});

function onPageChange(page: number) {
  pagination.current = page;
  fetchChildren();
}
function onPageSizeChange(size: number) {
  pagination.pageSize = size;
  pagination.current = 1;
  fetchChildren();
}
function onSearch() {
  pagination.current = 1;
  fetchChildren();
}

// ====== 子表 CRUD ======
function handleCreateChild() {
  Message.info(`在「${selectedNode.value?.title}」下新建子数据（demo）`);
}
function handleRowAction(action: string, record: Record<string, any>) {
  if (action === 'delete') {
    Modal.warning({
      title: '确认删除',
      content: `确认删除「${record.name}」吗？`,
      hideCancel: false,
      okButtonProps: { status: 'danger' },
      onOk: () => Message.success('已删除（demo）'),
    });
    return;
  }
  Message.info(`${action}：${record.name}（demo）`);
}
</script>

<template>
  <div class="pg-tree-table">
    <!-- ========== page-header ========== -->
    <div class="pg-tree-table__header">
      <h2 class="pg-tree-table__title">{{ pageTitle }}</h2>
      <a-link>
        <template #icon><IconFile /></template>
        帮助文档
      </a-link>
    </div>

    <!-- ========== 左树 + 右表 ========== -->
    <div class="pg-tree-table__wrapper">
      <!-- 左：主表（树） -->
      <aside class="pg-tree-table__left">
        <div class="pg-tree-table__tree-bar">
          <!-- 新增：一个入口承载「新增根级 / 新增子级」；未选中节点时「新增子级」禁用。
               ⚠️ 只给 #icon 插槽时 Arco 会自动加 .arco-btn-only-icon（主题里 small=28×28 正方形），
               但按钮是这一行 flex 的子项，会被撑满的搜索框挤到 flex-shrink 变扁 —— 必须给它 flex-shrink:0。 -->
          <a-dropdown position="bl" @select="(v: any) => handleAdd(String(v))">
            <a-button size="small"><template #icon><IconPlus /></template></a-button>
            <template #content>
              <a-doption value="root">新增根级</a-doption>
              <a-doption value="child" :disabled="!selectedNode">新增子级</a-doption>
            </template>
          </a-dropdown>
          <a-input v-model="treeKeyword" size="small" placeholder="搜索" allow-clear />
        </div>

        <div class="pg-tree-table__tree-wrap">
          <a-tree
            v-model:selected-keys="selectedNodeKeys"
            v-model:expanded-keys="expandedKeys"
            :data="filteredTree"
            block-node
size="medium"
          >
            <!-- 节点级操作（编辑 / 删除）：hover 才出现，不干扰浏览。
                 用 Arco 的 .arco-icon-hover 拿标准的圆形悬停底；@click.stop 防止点它顺带选中节点。 -->
            <template #extra="nodeData">
              <a-dropdown
                position="br"
                @select="(v: any) => handleNodeAction(String(v), nodeData as any)"
              >
                <span class="pg-tree-table__node-more arco-icon-hover" @click.stop>
                  <IconMore />
                </span>
                <template #content>
                  <a-doption value="edit">编辑</a-doption>
                  <a-doption value="delete">删除</a-doption>
                </template>
              </a-dropdown>
            </template>
          </a-tree>
          <a-empty v-if="!filteredTree.length" description="没有匹配的主数据" />
        </div>
      </aside>

      <!-- 右：子表 -->
      <section class="pg-tree-table__right">
        <!-- 未选主数据时不展示表格，给明确引导 -->
        <div v-if="!selectedNode" class="pg-tree-table__placeholder">
          <a-empty>
            <template #image><IconList /></template>
            先从左侧列表选择
          </a-empty>
        </div>

        <template v-else>
          <div class="pg-tree-table__filter">
            <a-space :size="8">
              <!-- 子数据必须挂在某条主数据下，所以「创建」依赖左侧选中项 -->
              <a-button type="primary" size="small" @click="handleCreateChild">创建</a-button>
              <a-button size="small">导入</a-button>
              <a-button size="small">导出</a-button>
              <a-button size="small">打印</a-button>
            </a-space>

            <a-input-group style="width: 324px">
              <a-select v-model="searchField" size="small" :style="{ width: '80px' }">
                <a-option v-for="f in searchFields" :key="f.value" :value="f.value" :label="f.label" />
              </a-select>
              <a-input
                v-model="searchKeyword"
                size="small"
                placeholder="请输入搜索内容"
                allow-clear
                @press-enter="onSearch"
              />
            </a-input-group>
          </div>

          <div class="pg-tree-table__table-wrap">
            <a-table
              v-model:selected-keys="selectedKeys"
              class="pg-tree-table__table"
              :columns="columns"
              :data="tableData"
              :loading="loading"
              :pagination="false"
              :row-selection="{ type: 'checkbox', showCheckedAll: true }"
              row-key="key"
              :bordered="{ wrapper: true }"
              size="medium"
              :scroll="{ y: '100%' }"
            >
              <template #actions="{ record }">
                <a-space :size="8">
                  <a-link @click="handleRowAction('查看', record)">查看</a-link>
                  <a-dropdown @select="(v: any) => handleRowAction(String(v), record)">
                    <a-link>更多</a-link>
                    <template #content>
                      <a-doption value="编辑">编辑</a-doption>
                      <a-doption value="delete">删除</a-doption>
                    </template>
                  </a-dropdown>
                </a-space>
              </template>
            </a-table>
          </div>

          <div class="pg-tree-table__pagination">
            <span class="pg-tree-table__total">共{{ pagination.total }}条</span>
            <a-pagination
              v-model:current="pagination.current"
              v-model:page-size="pagination.pageSize"
              :total="pagination.total"
              size="small"
              show-jumper
              show-page-size
              @change="onPageChange"
              @page-size-change="onPageSizeChange"
            />
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pg-tree-table {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--color-bg-1);
}

/* ===== page-header ===== */
.pg-tree-table__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-shrink: 0;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-2);
}

.pg-tree-table__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
  color: var(--color-text-1);
}

/* ===== 左右分栏：只有各自内部滚动，页面不整体滚 ===== */
.pg-tree-table__wrapper {
  flex: 1;
  display: flex;
  min-height: 0;
}

.pg-tree-table__left {
  flex: none;
  width: 260px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-right: 1px solid var(--color-border-2);
}

.pg-tree-table__tree-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 16px 16px 8px;
}

/* 纯图标按钮的 28×28 会被撑满的搜索框压缩，必须显式不参与收缩 */
.pg-tree-table__tree-bar :deep(.arco-btn) {
  flex-shrink: 0;
}

.pg-tree-table__tree-wrap {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 8px;
}

/* ⚠️ #extra 被 Arco 渲染成 .arco-tree-node 的直接子元素，排在 .arco-tree-node-title 之后；
   而选中/hover 的高亮底色是加在 title 上的 —— 不处理的话操作图标会落在高亮区外面，
   看起来像挂在节点外。所以把节点设为定位父级，图标绝对定位压回行内右侧。 */
.pg-tree-table__tree-wrap :deep(.arco-tree-node) {
  position: relative;
}

/* 节点操作图标：默认隐藏，hover 到该节点才出现。
   图标直接盖在文字上，不给 title 留 padding —— 只有超长文案才会被压到，代价可接受。 */
.pg-tree-table__node-more {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: var(--color-text-3);
  opacity: 0;
  transition: opacity 0.2s;
}

/* ⚠️ .arco-icon-hover 的灰底圆是绝对定位的 ::before，Arco 靠 `.arco-icon-hover .arco-icon`
   加 position:relative 把图标垫到它上面；但 iconbox 图标的 class 是 van-icon-* 而非 .arco-icon，
   拿不到这条规则，圆底就会盖住图标（看起来像图标变白消失）。这里自己把 svg 垫上去。 */
.pg-tree-table__node-more :deep(svg) {
  position: relative;
}

.pg-tree-table__tree-wrap :deep(.arco-tree-node:hover) .pg-tree-table__node-more {
  opacity: 1;
}

.pg-tree-table__node-more:hover {
  color: rgb(var(--primary-6));
}

/* ===== 右侧子表 ===== */
.pg-tree-table__right {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: 16px;
  gap: 16px;
}

.pg-tree-table__placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pg-tree-table__placeholder :deep(.arco-empty-image) {
  font-size: 48px;
  color: var(--color-text-4);
}

.pg-tree-table__filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.pg-tree-table__table-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.pg-tree-table__table {
  height: 100%;
}

.pg-tree-table__table-wrap :deep(.arco-table-container) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.pg-tree-table__table-wrap :deep(.arco-table-body) {
  flex: 1;
  min-height: 0;
}

.pg-tree-table__pagination {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.pg-tree-table__total {
  margin-right: auto;
  font-size: 14px;
  color: var(--color-text-1);
  white-space: nowrap;
}

/* 窄屏：左树收窄；再窄则堆叠为上下两段 */
@media (max-width: 1100px) {
  .pg-tree-table__left {
    width: 220px;
  }
}

@media (max-width: 768px) {
  .pg-tree-table__wrapper {
    flex-direction: column;
  }

  .pg-tree-table__left {
    width: 100%;
    max-height: 240px;
    border-right: none;
    border-bottom: 1px solid var(--color-border-2);
  }
}
</style>
