<script setup lang="ts">
/**
 * 对话框表单（示例）
 * ------------------------------------------------------------------
 * 字段较少的轻量录入/编辑，在弹窗内完成，不跳转独立页面。
 * 由父级通过 v-model:visible 控制显隐，提交成功后 emit('success')。
 */
import { ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';

const visible = defineModel<boolean>('visible', { default: false });
const emit = defineEmits<{ (e: 'success', data: any): void }>();

const formRef = ref();
const form = reactive({
  contractNo: '',
  contractName: '',
  contractType: undefined,
  secretLevel: undefined,
  openContract: false,
  isElectronic: true,
  remark: '',
});

const rules = {
  contractName: [{ required: true, message: '请输入合同名称' }],
  contractType: [{ required: true, message: '请选择合同类型' }],
  secretLevel: [{ required: true, message: '请选择合同密级' }],
};

const typeOptions = [
  { value: 'purchase', label: '采购合同' },
  { value: 'sales', label: '销售合同' },
];
const secretOptions = [
  { value: 'public', label: '公开' },
  { value: 'internal', label: '内部' },
  { value: 'secret', label: '机密' },
];

const submitting = ref(false);

async function handleBeforeOk(): Promise<boolean> {
  const errors = await formRef.value?.validate();
  if (errors) return false;
  submitting.value = true;
  await new Promise((r) => setTimeout(r, 300));
  submitting.value = false;
  Message.success('保存成功');
  emit('success', { ...form });
  return true;
}
</script>

<template>
  <a-modal
    v-model:visible="visible"
    title="创建合同"
    title-align="start"
    :width="712"
    :body-style="{ maxHeight: '60vh', overflowY: 'auto' }"
    :ok-loading="submitting"
    ok-text="确定"
    cancel-text="取消"
    :on-before-ok="handleBeforeOk"
    unmount-on-close
  >
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item field="contractNo" label="合同编号">
            <a-input v-model="form.contractNo" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="contractName" label="合同名称">
            <a-input v-model="form.contractName" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="contractType" label="合同类型">
            <a-select v-model="form.contractType" placeholder="请选择" :options="typeOptions" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="secretLevel" label="合同密级">
            <a-select v-model="form.secretLevel" placeholder="请选择" :options="secretOptions" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="openContract" label="开口合同">
            <a-switch v-model="form.openContract" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="isElectronic" label="是否电签">
            <a-switch v-model="form.isElectronic" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item field="remark" label="合同说明">
            <a-textarea v-model="form.remark" placeholder="请输入" :auto-size="{ minRows: 2 }" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
