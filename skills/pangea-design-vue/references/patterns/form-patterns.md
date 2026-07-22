---
name: arco-vue-form-patterns
description: "Arco Design Vue 表单模式。用于 `a-form`、`a-form-item`、`field`、`model`、校验规则、动态字段、提交成功或失败，以及弹窗内表单。"
user-invocable: false
---

# 表单模式

完整表单 API 参考 [form.md](../components/data-entry/form.md)。

## 基础组合式表单

```vue
<script setup lang="ts">
import { reactive } from 'vue';
import { Message } from '@arco-design/web-vue';

const form = reactive({
  username: '',
  role: '',
});

const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  role: [{ required: true, message: '请选择角色' }],
};

const handleSubmit = (values: unknown) => {
  Message.success('提交成功');
  console.log(values);
};
</script>

<template>
  <a-form :model="form" :rules="rules" layout="vertical" @submit-success="handleSubmit">
    <a-form-item field="username" label="用户名">
      <a-input v-model="form.username" placeholder="请输入用户名" />
    </a-form-item>
    <a-form-item field="role" label="角色">
      <a-select v-model="form.role" :options="['admin', 'user']" placeholder="请选择角色" />
    </a-form-item>
    <a-button type="primary" html-type="submit">提交</a-button>
  </a-form>
</template>
```

## 使用要点

- `:model` 始终绑定到同一个响应式对象，避免字段分散在多个来源。
- `a-form-item` 使用 `field` 标识字段路径，不使用 `name`。
- 提交按钮使用 `html-type="submit"`，并在表单上监听 `@submit-success` 和 `@submit-failed`。
- 简单表单可将校验规则放在模型附近；复杂表单可抽到组合函数中统一维护。
- 嵌套对象和动态字段使用 Form 文档支持的字段路径，例如 `people[1].id`。

## 提交与校验：二选一，避免重复校验

> Pangea 本地补充（非上游照搬）：明确「声明式」与「命令式」两种提交方式，**不要混用**。

Arco 的 `a-form` 有两条提交路径，各自已包含校验，**混用会导致重复校验**：

### 方式 A —— 声明式（推荐，表单本身即提交源）

按钮用 `html-type="submit"`，监听 `@submit-success` / `@submit-failed`。**Arco 内部校验通过后才触发 `@submit-success`**，因此处理函数里**不要**再调用 `validate()`。

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Message } from '@arco-design/web-vue';

const form = reactive({ name: '' });
const rules = { name: [{ required: true, message: '请输入名称' }] };
const submitting = ref(false);

// @submit-success 只在校验通过时触发，这里直接提交即可
async function handleSubmit() {
  submitting.value = true;
  try {
    // demo：mock；交付时替换为接口请求
    await new Promise((r) => setTimeout(r, 400));
    Message.success('保存成功');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <a-form :model="form" :rules="rules" layout="vertical" @submit-success="handleSubmit">
    <a-form-item field="name" label="名称" required>
      <a-input v-model="form.name" />
    </a-form-item>
    <a-button type="primary" html-type="submit" :loading="submitting">提交</a-button>
  </a-form>
</template>
```

### 方式 B —— 命令式（提交由外部触发，或提交前需额外逻辑）

普通按钮 `@click`，在处理函数里手动 `await formRef.value?.validate()`（返回 `undefined` 表示通过）。适用于：提交按钮在表单外（如弹窗页脚）、或提交前要做二次确认等。

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { FormInstance } from '@arco-design/web-vue';

const formRef = ref<FormInstance>();

async function handleSubmit() {
  const errors = await formRef.value?.validate(); // 通过时为 undefined
  if (errors) return;
  // ...提交
}
</script>

<template>
  <a-form ref="formRef" :model="form" :rules="rules">
    <!-- 字段... 注意：命令式提交时按钮不要用 html-type="submit" -->
  </a-form>
  <a-button type="primary" @click="handleSubmit">提交</a-button>
</template>
```

### 要点
- **不要**同时用 `@submit-success="handleSubmit"` 又在 `handleSubmit` 内再 `validate()` —— 这会校验两次。
- 方式 A 用 `@submit-success`；方式 B 用 `@click` + `validate()`。二选一。
- 提交中用 `:loading` 禁用按钮防重复提交；成功用 `Message.success`；失败时 Arco 会自动滚动/聚焦到首个错误项。
