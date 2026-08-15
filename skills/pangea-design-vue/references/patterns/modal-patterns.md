---
name: arco-vue-modal-patterns
description: "Arco Design Vue 弹窗与反馈模式。用于 `a-modal`、`v-model:visible`、确认流程、弹窗表单、Message、Notification 和 Drawer。"
user-invocable: false
---

# 弹窗与反馈模式

详细 API 参考 [modal.md](../components/feedback/modal.md)、[drawer.md](../components/feedback/drawer.md) 和 [message.md](../components/feedback/message.md)。

## 宽度档位（硬约束，先看这条）

| 场景 | 宽度 | 写法 |
|---|---|---|
| 确认类（删除确认 / 操作确认 / 风险提示） | **400** | `Modal.confirm / warning / info / error / success`，**不传 `width`** |
| 轻量录入、单选/单输入、简单信息展示 | **520** | `<a-modal>` 不传 `width`（默认即 520） |
| 字段较多需 2 列栅格、内容较长 | **720** | `:width="720"` |
| **弹窗内含表格等宽组件**（只读子表单、可编辑明细、宽列表） | **1000** | `:width="1000"` |

- **只有这三档 + 确认类 400，且不允许超过 1000**。不要写 712 / 800 / 960 / 1200；装不进 1000 的内容不该待在弹窗里 → 改独立页面（[page-form.md](page-form.md)）。
- **1000 档要能说出理由**：没有表格就降到 720 / 520。
- ⚠️ 确认类那 400 需要一条全局覆盖才是真实宽度：`.arco-modal` 是 **content-box**，simple 模式把 `padding: 24px 32px 32px` 加在根节点上，Arco 自带 `width: 400px` 实际渲染成 **464px**。脚手架已内置 `.arco-modal-simple { box-sizing: border-box }`（`src/styles/arco-overrides.less`，在 `main.ts` 引入），复制模板时勿丢。
- **机检**：`npm run check:tokens`（含在 `npm run gate`）会扫 `<a-modal>` 字面 `width`，非档位或 >1000 报错；`width="auto"` / `fullscreen` / 绑定表达式跳过。

## 受控弹窗

```vue
<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
</script>

<template>
  <a-button type="primary" @click="visible = true">打开</a-button>
  <a-modal v-model:visible="visible" title="编辑">
    <p>内容</p>
  </a-modal>
</template>
```

## 弹窗内表单

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Message } from '@arco-design/web-vue';

const visible = ref(false);
const form = reactive({ name: '' });

const handleBeforeOk = async () => {
  if (!form.name) {
    Message.error('请输入名称');
    return false;
  }
  Message.success('保存成功');
  return true;
};
</script>

<template>
  <a-modal v-model:visible="visible" title="编辑" :on-before-ok="handleBeforeOk">
    <a-form :model="form" layout="vertical">
      <a-form-item field="name" label="名称" required>
        <a-input v-model="form.name" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
```

## 使用要点

- 弹窗和抽屉的可见性使用 `v-model:visible`。
- 异步确认、表单校验、关闭拦截使用文档中的 `on-before-ok` 或关闭前钩子。
- 轻量结果反馈使用 `Message`；需要标题、正文或更复杂内容时使用 `Notification`。
- `Message` 和 `Notification` 是全局服务 API，不是 `<a-message>` 或 `<a-notification>` 组件标签。
