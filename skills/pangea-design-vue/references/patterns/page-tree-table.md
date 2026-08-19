---
name: pangea-page-tree-table
description: "左树右表列表页模板。适用于**主子表结构**：左侧树选中一条「主表」主数据 → 右侧表格展示其「子表」数据，主子两侧各有独立的增删改查。结构：页头（标题 + 帮助文档）+ 左树面板（新增 + 搜索 + a-tree）+ 右侧子表区（操作栏 + 表格 + 分页）。当数据是层级归属关系（组织/人员、分类/商品、仓库/库存、项目/任务）时使用此模板。"
user-invocable: true
meta:
  id: page-tree-table
  kind: page-template
  title: 左树右表列表页
  status: stable
  whenToUse: [主子表结构的列表页, 数据按层级归属（组织/分类/仓库/项目）, 需先选主数据再看子数据, 主子各自增删改查]
  whenNotToUse: [单表列表→简单列表页, 卡片化呈现→卡片列表页, 层级只用于筛选而非归属→简单列表页加筛选项]
  keyStructure: [页头(标题+帮助文档), 左树面板260px(新增下拉+搜索+a-tree), 右侧子表区(操作栏+表格+分页), 首屏不预选+未选主数据时右侧空状态]
  variants: [已选主数据（展示子表）, 未选主数据（空状态引导）, 树搜索过滤]
  composeWith: [a-tree, a-table, a-pagination, a-input, a-dropdown, a-button, a-empty, a-link]
  composeBoundary: [左树固定260px右侧自适应, 左右各自内部滚动页面不整体滚, 树选中项是右侧数据的唯一来源, 子表创建依赖当前主数据]
  controls: { size: small, table: medium, tree: medium, leftPanel: 260 }
  pitfalls: [切主数据后忘记复位分页与清空勾选, 未选主数据时直接显示空表格让用户困惑, 子表创建没绑定当前主数据产生挂空记录, 删除主数据未提示会级联删除子数据, 树节点操作常驻显示干扰浏览]
  previewRoute: /tree-table
  source: src/pages/TreeTable/index.vue
  figma: 219:4241
  tags: [列表, 主子表, 树, 表格]
---

# 左树右表列表页模板

适用场景：数据是**层级归属**关系的列表页——左侧树选中一条**主表**主数据，右侧表格展示挂在它下面的**子表**数据，两侧各有独立的增删改查。典型如：组织 / 人员、分类 / 商品、仓库 / 库存、项目 / 任务。

**与[简单列表页](page-simple-list.md)的区别**：简单列表页是单表；本模板是**主子两级**，右侧数据必须依附于左侧选中的主数据。
**判断要点**：如果左侧层级只是**筛选维度**（选了也只是过滤同一张表），那不该用本模板——在简单列表页加一个筛选项就够了。只有当子数据**在业务上归属于**某条主数据（新建子数据必须指定父级）时才用左树右表。

## 页面结构

```
┌──────────────────────────────────────────────────────────────────────┐
│ 左树右表列表页                                        📄 帮助文档      │ ← 页头（白底 + 底部分隔线）
├───────────────┬──────────────────────────────────────────────────────┤
│ [+] [搜索   ] │ [创建][导入][导出][打印]        [名称∨][请输入搜索内容] │ ← 左:主表工具条 / 右:子表操作栏
│               ├──────────────────────────────────────────────────────┤
│ ▾ 华东大区 ⋯  │ ☐ 成员名称    │ 工号     │ 岗位 │ 操作              │ ← 子表表格
│   上海分公司  │ ☐ 上海…成员1  │ EMP11001 │ 销售 │ 查看 更多         │
│   杭州分公司  │ ☐ 上海…成员2  │ EMP11002 │ 售前 │ 查看 更多         │
│ ▾ 华北大区    │ …                                                    │
│   北京分公司  │                                                      │
│   天津分公司  ├──────────────────────────────────────────────────────┤
│               │ 共38条                    ‹ 1 2 › [20条/页] 前往 __  │ ← 分页
└───────────────┴──────────────────────────────────────────────────────┘
   ↑ 260px，右侧自适应；左右**各自内部滚动**，页面不整体滚
```

## ⚠️ 联动契约（本模板的核心，改动时勿丢）

这三条是左树右表最容易做错的地方：

1. **树选中项 = 右侧数据的唯一来源**：`selectedNode` 一变，就重新拉子表，并且**把分页复位到第 1 页、清空已勾选行**。
   不复位会出现「切到只有 8 条的主数据，却停在第 3 页 → 右侧空白」；不清空勾选会把上一条主数据的选中项带过来，批量操作时误删。
   ```ts
   watch(selectedNodeKeys, () => {
     pagination.current = 1;
     selectedKeys.value = [];   // 关键：勾选也要清
     fetchChildren();
   });
   ```
2. **首屏不预选任何树节点，且未选主数据时不要显示空表格**，而是给 `a-empty` + 图标 + 文案「先从左侧列表选择」。直接摆一张空表格，用户不知道是没数据还是没选；替用户预选一条则会掩盖"要先选主数据"这件事。
3. **子表「创建」必须依附当前主数据**：没选主数据时该按钮不可用（本模板通过「未选中就不渲染整个子表区」天然满足）；调接口时把主数据 id 一起传，否则会产生挂空的子记录。

## 设计规范

### 页头
标题 `18px / 600 / line-height 28`，右侧「帮助文档」用 `a-link` + `IconFile`；容器 `padding: 12px 16px` + 底部 `1px solid var(--color-border-2)`。

### 左侧树面板（主表）
- 宽 **260px**（`flex: none`），右侧 `1px` 分隔线；窄屏 ≤1100px 收到 220px，≤768px 改为上下堆叠（树区限高 240px）
- 工具条：`+` 图标按钮 + 搜索框（`a-input size="small"`，placeholder「搜索」）
- **新增入口收敛到 `+` 的下拉菜单**（`a-dropdown position="bl"`），两项：「新增根级」始终可用、「新增子级」`:disabled="!selectedNode"`（没选节点就不知道挂在谁下面）。不要把「新增子级」同时放到节点菜单里重复一份。
- ⚠️ **纯图标按钮被 flex 压扁的坑**：只给 `#icon` 插槽时 Arco 会自动加 `.arco-btn-only-icon`（主题里 `small` = 28×28 正方形），但按钮作为工具条 flex 的子项会被撑满的搜索框挤到收缩（实测 28 → 23.9px，看着就"宽高不一致"）。修法是给它 `flex-shrink: 0`；`shape="square"` 在本主题**没有任何 CSS 规则**，加了不解决问题。
- 树：`a-tree` + **`block-node`**（整行可点，选中态才是整行浅底 + 主色文字，与设计稿一致；不加的话只有文字块高亮）
- **树搜索是前端过滤 + 保留命中节点的父链**（只留命中节点会让层级断裂）：
  ```ts
  const walk = (nodes) => nodes.flatMap((n) => {
    const children = n.children ? walk(n.children) : [];
    if (n.title.includes(kw) || children.length) return [{ ...n, children }];
    return [];
  });
  ```
  数据量大时改为后端检索。
- **节点级操作用 `#extra` 插槽 + hover 才显形**（`opacity: 0` → `.arco-tree-node:hover` 时 `1`）：只放 **编辑 / 删除** 两项（新增已收进上方下拉）。常驻显示会让树看起来很吵。图标外层套 `class="arco-icon-hover"` 拿 Arco 标准的圆形悬停底，并且要 `@click.stop`，否则点操作会顺带选中该节点。
- ⚠️ **`#extra` 会跑到高亮区外的坑**：Arco 把 `#extra` 渲染成 `.arco-tree-node` 的直接子元素、**排在 `.arco-tree-node-title` 之后**，而选中/hover 的底色是加在 `title` 上的 —— 不处理的话图标落在高亮块外面，看起来像挂在节点外。修法：
  ```css
  .pg-tree-table__tree-wrap :deep(.arco-tree-node) { position: relative; }
  .pg-tree-table__node-more { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); }
  ```
  `block-node` 下 title 是 block，靠"缩短 title 宽度"腾位置做不到，必须绝对定位。**不用给 title 加 `padding-right` 占位**——图标直接盖在文字上即可，只有超长文案才会被压到，代价比让每个节点都空出一块更小。
- ⚠️ **`arco-icon-hover` 配 iconbox 图标会把图标盖住的坑**：那个圆形悬停底是**绝对定位的 `::before`**，Arco 靠 `.arco-icon-hover .arco-icon { position: relative }` 把图标垫到它上面；而 iconbox 图标的 class 是 `van-icon-*`、**不是 `.arco-icon`**，吃不到这条规则，于是 `--color-fill-2` 的灰底圆直接压在图标上（现象是"hover 时图标变白/不见了"）。修法是自己把图标垫上去：
  ```css
  .pg-tree-table__node-more :deep(svg) { position: relative; }
  ```
  > 设计稿只画了左上角的 `+`，节点级增删改是**增补**——用户需求明确要求「主子表各自增删改查」。

### 右侧子表区
沿用[简单列表页](page-simple-list.md)的形态，不要另造一套：
- 操作栏：左 `创建`(primary) + `导入` / `导出` / `打印`（都 `size="small"`）；右 `a-input-group`（字段选择 80px + 关键词输入，整体 324px）
- 表格：`a-table` + `:bordered="{ wrapper: true }"` + `size="medium"` + `:pagination="false"` + 行选择 checkbox + `:scroll="{ y: '100%' }"`
- 操作列宽 `148`，内容为 `查看` + `更多`（`a-dropdown` 挂 编辑 / 删除）
- 分页：左「共 N 条」（`margin-right: auto` 顶开）+ 右 `a-pagination size="small" show-jumper show-page-size`

### 删除的二次确认
- **删除主数据必须提示会级联删除子数据**：`Modal.warning` 文案写明「删除「X」会同时删除其下所有子数据」，按钮 `status="danger"`
- 删除子数据同样二次确认，但不需要级联提示

## Vue 代码模板

完整可运行实现见脚手架 `templates/project-starter/src/pages/TreeTable/index.vue`，预览路由 `/tree-table`。核心骨架：

```vue
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import { IconPlus, IconFile, IconMore, IconList } from '@arco-iconbox/vue-pangea-mobile';

const treeData = ref([/* 主表树，TODO 换接口 */]);
const treeKeyword = ref('');
const selectedNodeKeys = ref<string[]>([]);
const expandedKeys = ref<string[]>([]);

// 按 key 反查节点（右侧文案、接口参数都要用）
function flatten(nodes, acc = []) { nodes.forEach(n => { acc.push(n); n.children && flatten(n.children, acc); }); return acc; }
const selectedNode = computed(() => flatten(treeData.value).find(n => n.key === selectedNodeKeys.value[0]));

const pagination = reactive({ current: 1, pageSize: 20, total: 0 });
const selectedKeys = ref<string[]>([]);

function fetchChildren() {
  const node = selectedNode.value;
  if (!node) { tableData.value = []; pagination.total = 0; return; }
  // TODO 换接口：必须把 node.key 作为查询条件传给后端
}

// 联动契约：切主数据 → 重拉 + 分页复位 + 清空勾选
watch(selectedNodeKeys, () => {
  pagination.current = 1;
  selectedKeys.value = [];
  fetchChildren();
});
</script>

<template>
  <div class="pg-tree-table">
    <div class="pg-tree-table__header">
      <h2 class="pg-tree-table__title">{{ pageTitle }}</h2>
      <a-link><template #icon><IconFile /></template>帮助文档</a-link>
    </div>

    <div class="pg-tree-table__wrapper">
      <!-- 左：主表 -->
      <aside class="pg-tree-table__left">
        <div class="pg-tree-table__tree-bar">
          <!-- 新增只留这一个入口；「新增子级」没选节点时禁用 -->
          <a-dropdown position="bl" @select="(v) => handleAdd(String(v))">
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
            <!-- 节点操作：hover 才出现；arco-icon-hover 给圆形悬停底；@click.stop 否则会顺带选中节点 -->
            <template #extra="nodeData">
              <a-dropdown position="br" @select="(v) => handleNodeAction(String(v), nodeData)">
                <span class="pg-tree-table__node-more arco-icon-hover" @click.stop><IconMore /></span>
                <template #content>
                  <a-doption value="edit">编辑</a-doption>
                  <a-doption value="delete">删除</a-doption>
                </template>
              </a-dropdown>
            </template>
          </a-tree>
        </div>
      </aside>

      <!-- 右：子表。未选主数据时只给引导，不摆空表格 -->
      <section class="pg-tree-table__right">
        <div v-if="!selectedNode" class="pg-tree-table__placeholder">
          <a-empty>
            <template #image><IconList /></template>
            先从左侧列表选择
          </a-empty>
        </div>
        <template v-else>
          <!-- 操作栏 / 表格 / 分页：同简单列表页 -->
        </template>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pg-tree-table { display: flex; flex-direction: column; height: 100%; overflow: hidden; background: var(--color-bg-1); }
.pg-tree-table__header {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  flex-shrink: 0; padding: 12px 16px; border-bottom: 1px solid var(--color-border-2);
}
/* 左右分栏：各自内部滚动，页面不整体滚 */
.pg-tree-table__wrapper { flex: 1; display: flex; min-height: 0; }
.pg-tree-table__left {
  flex: none; width: 260px; display: flex; flex-direction: column; min-height: 0;
  border-right: 1px solid var(--color-border-2);
}
.pg-tree-table__tree-wrap { flex: 1; min-height: 0; overflow: auto; padding: 8px; }
/* 纯图标按钮 28×28 会被撑满的搜索框压缩，必须不参与收缩 */
.pg-tree-table__tree-bar :deep(.arco-btn) { flex-shrink: 0; }
/* #extra 排在 title 之后、而高亮底色在 title 上 → 绝对定位压回行内右侧 */
.pg-tree-table__tree-wrap :deep(.arco-tree-node) { position: relative; }
/* 节点操作图标：hover 到该节点才出现 */
.pg-tree-table__node-more {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px;
  opacity: 0; transition: opacity 0.2s; color: var(--color-text-3);
}
.pg-tree-table__tree-wrap :deep(.arco-tree-node:hover) .pg-tree-table__node-more { opacity: 1; }
/* iconbox 图标不是 .arco-icon，吃不到 Arco 的垫高规则，会被 icon-hover 的 ::before 圆底盖住 */
.pg-tree-table__node-more :deep(svg) { position: relative; }
.pg-tree-table__right {
  flex: 1; display: flex; flex-direction: column; min-width: 0; min-height: 0; padding: 16px; gap: 16px;
}
.pg-tree-table__placeholder { flex: 1; display: flex; align-items: center; justify-content: center; }
.pg-tree-table__table-wrap { flex: 1; min-height: 0; overflow: hidden; }
.pg-tree-table__table-wrap :deep(.arco-table-container) { height: 100%; display: flex; flex-direction: column; }
.pg-tree-table__table-wrap :deep(.arco-table-body) { flex: 1; min-height: 0; }
@media (max-width: 1100px) { .pg-tree-table__left { width: 220px; } }
@media (max-width: 768px) {
  .pg-tree-table__wrapper { flex-direction: column; }
  .pg-tree-table__left { width: 100%; max-height: 240px; border-right: none; border-bottom: 1px solid var(--color-border-2); }
}
</style>
```

## 使用要点

1. **先确认是「归属」不是「筛选」**：新建子数据时必须指定父级 → 用本模板；层级只用来过滤同一张表 → 用简单列表页加筛选项。
2. **主数据 id 必须进子表查询条件**：`fetchChildren` 里带上 `selectedNode.key`，不要在前端拿全量再过滤。
3. **切主数据的三件套别漏**：重拉数据 + 分页复位 + 清空勾选。
4. **树的展开态**：首次进入可默认展开第一层（`expandedKeys`）；层级很深或节点很多时改用 `load-more` 懒加载，不要一次拉几千个节点。
5. **默认选中**：业务上如果「总有一条主数据」，可在数据加载后自动选中第一个叶子节点，省掉用户一次点击；如果主数据可能为空，保留空状态引导。
6. **删除主数据要提示级联影响**，并考虑后端是否允许（有子数据时可能应禁止删除而不是级联删）。
7. **权限差异**：主表与子表的增删改查权限常常不同（如能看组织但不能改组织），两侧按钮要分别判权，不要共用一个开关。

## 与其他页面模板的区别

| 场景 | 用什么模板 |
|---|---|
| 单表基础列表 | [简单列表页](page-simple-list.md) |
| 卡片形式呈现的列表 | [卡片列表页](page-card-list.md) |
| **主子表结构（先选主数据再看子数据）** | **本模板（左树右表列表页）** |
| 弹窗内轻量录入 | [对话框表单](page-modal-form.md) |
| 查看已录入数据 | [详情页](page-detail.md) |
