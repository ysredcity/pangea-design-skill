---
name: arco-vue-table-patterns
description: "Arco Design Vue 表格模式。用于 `a-table`、列配置、数据源、行选择、分页、远程加载、插槽、排序和筛选。"
user-invocable: false
---

# 表格模式

完整表格 API 参考 [table.md](../components/data-display/table.md)。

## 基础表格

```vue
<script setup lang="ts">
const columns = [
  { title: '名称', dataIndex: 'name' },
  { title: '状态', dataIndex: 'status', slotName: 'status' },
  { title: '操作', slotName: 'actions' },
];

const data = [
  { key: '1', name: '任务 A', status: 'running' },
  { key: '2', name: '任务 B', status: 'done' },
];
</script>

<template>
  <a-table :columns="columns" :data="data" row-key="key">
    <template #status="{ record }">
      <a-tag :color="record.status === 'done' ? 'green' : 'blue'">
        {{ record.status }}
      </a-tag>
    </template>
    <template #actions="{ record }">
      <a-button type="text" size="small">查看 {{ record.name }}</a-button>
    </template>
  </a-table>
</template>
```

## 远程数据

- 将分页、筛选、排序状态放在本地响应式状态中。
- 用一个请求函数统一拉取数据，在 `onMounted` 和表格变更事件中复用。
- 请求中给表格设置加载状态，避免重复操作和空白反馈。
- 不要在每次渲染时重新创建列配置；列应定义一次，或由稳定输入计算得到。

## 分页：客户端 vs 服务端

> Pangea 本地补充（非上游照搬）：明确两种分页方式，`total` 必须与真实数据联动，不要写死。

### 客户端分页（数据量小、一次性拉全量）

数据全部在前端，交给 `a-table` 自带分页即可；不要手写固定 `total`。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';

const keyword = ref('');
const all = ref<Row[]>([/* ... */]);
// 过滤后的数据；total 跟随它的长度，翻页由 a-table 内部处理
const filtered = computed(() => all.value.filter((r) => r.name.includes(keyword.value)));
</script>

<template>
  <!-- 传 pageSize；total 不写死，交由表格按 data 长度分页 -->
  <a-table :columns="columns" :data="filtered" row-key="id" :pagination="{ pageSize: 10 }" />
</template>
```

### 服务端分页（数据量大、按页请求）

分页状态（`current`/`pageSize`/`total`）放本地响应式对象；`total` **来自接口返回**，不要写死。监听翻页/改页大小事件 → 更新状态 → 重新请求；用 `loading` 包裹请求。

```vue
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

const loading = ref(false);
const data = ref<Row[]>([]);
const pagination = reactive({ current: 1, pageSize: 10, total: 0 });

async function fetchList() {
  loading.value = true;
  try {
    // demo：mock；交付时替换为接口，例如 api.list({ page, pageSize, keyword })
    const res = await mockApi(pagination.current, pagination.pageSize);
    data.value = res.list;
    pagination.total = res.total; // total 来自服务端
  } finally {
    loading.value = false;
  }
}

function onPageChange(current: number) {
  pagination.current = current;
  fetchList();
}
function onPageSizeChange(pageSize: number) {
  pagination.pageSize = pageSize;
  pagination.current = 1; // 改页大小回到第 1 页
  fetchList();
}

onMounted(fetchList);
</script>

<template>
  <a-table
    :columns="columns"
    :data="data"
    :loading="loading"
    :pagination="pagination"
    row-key="id"
    @page-change="onPageChange"
    @page-size-change="onPageSizeChange"
  />
</template>
```

### 要点
- `total` 必须与真实数据一致：客户端分页由 `data` 长度决定（不传 `total`），服务端分页由接口返回。**不要写死 `total`**。
- 筛选/搜索变化后把 `current` 复位到第 1 页，避免停留在越界页码。
- 请求期间 `:loading`；避免每次渲染重建 `columns`（应定义一次或由稳定输入计算）。

## 插槽 record 的类型（TS strict 下的坑）

> Pangea 本地补充（非上游照搬）：`a-table` 列插槽作用域里的 `record` 是**无类型的**（`any`）。在 `strict` TS 下，用它去索引**强类型映射**会报 `TS7053: ... can't be used to index type 'Record<...>'`。

反例（会编译失败）：

```vue
<script setup lang="ts">
type Status = 'on' | 'off';
const STATUS_META: Record<Status, { label: string; color: string }> = { on: {/*...*/}, off: {/*...*/} };
</script>
<template>
  <template #status="{ record }">
    <!-- ❌ record.status 是 any，索引 Record<Status,...> → TS7053 -->
    <a-tag :color="STATUS_META[record.status].color">{{ STATUS_META[record.status].label }}</a-tag>
  </template>
</template>
```

推荐做法：定义一个**接受 `string` 的 helper** 查表（顺带兜底未知值），模板调用 helper：

```ts
export const statusMeta = (s: string) =>
  STATUS_META[s as Status] ?? { label: s, color: 'gray' };
```

```vue
<template #status="{ record }">
  <a-tag :color="statusMeta(record.status).color">{{ statusMeta(record.status).label }}</a-tag>
</template>
```

- helper 方式最省事，且能集中处理「未知状态」兜底。
- 或者对 record 做类型断言：`(record as Row).status`（较啰嗦，逐处都要写）。
- 注意：只读 ref（如详情页 `getById()` 返回的强类型对象）不受影响，只有**表格/列插槽的 `record`** 需要这样处理。
