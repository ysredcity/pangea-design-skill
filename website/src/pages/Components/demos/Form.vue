<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconUser, IconLock, IconEmail } from '@arco-iconbox/vue-pangea-mobile';
import DemoBlock from '../DemoBlock.vue';

// —— 控件总览表单模型 ——
const form = reactive({
  name: '',
  desc: '',
  amount: 100,
  type: '',
  tags: [] as string[],
  region: [] as string[],
  date: '',
  time: '',
  range: [] as string[],
  enable: true,
  gender: 'male',
  hobbies: ['read'] as string[],
  level: 4,
  score: 4,
  files: [] as any[],
});

const typeOptions = [
  { value: 'a', label: '类型一' },
  { value: 'b', label: '类型二' },
  { value: 'c', label: '类型三' },
];
const tagOptions = [
  { value: 'urgent', label: '紧急' },
  { value: 'important', label: '重要' },
  { value: 'normal', label: '普通' },
];
const regionOptions = [
  {
    value: 'east',
    label: '华东',
    children: [
      { value: 'sh', label: '上海' },
      { value: 'hz', label: '杭州' },
    ],
  },
  {
    value: 'south',
    label: '华南',
    children: [
      { value: 'sz', label: '深圳' },
      { value: 'gz', label: '广州' },
    ],
  },
];

// —— 布局切换 ——
const layout = ref<'vertical' | 'horizontal' | 'inline'>('vertical');
const lform = reactive({ keyword: '', status: '' });

// —— 校验表单 ——
const vFormRef = ref();
const vform = reactive({ username: '', email: '', password: '' });
const vrules: Record<string, any> = {
  username: [{ required: true, message: '请输入用户名' }],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '邮箱格式不正确' },
  ],
  password: [
    { required: true, message: '请输入密码' },
    { minLength: 6, message: '密码至少 6 位' },
  ],
};
function onSubmitSuccess() {
  Message.success('校验通过，已提交');
}
function resetVForm() {
  vFormRef.value?.resetFields();
}

// —— 尺寸 ——
const sizeVal = ref('');
</script>

<template>
  <div>
    <DemoBlock title="常用录入控件" desc="一个垂直表单里铺开主要录入控件：输入 / 数字 / 文本域 / 选择 / 多选 / 级联 / 日期时间 / 开关 / 单选 / 多选框 / 滑块 / 评分 / 上传。多列用响应式栅格。">
      <a-form :model="form" layout="vertical">
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12" :lg="8">
            <a-form-item field="name" label="名称">
              <a-input v-model="form.name" placeholder="请输入名称" allow-clear>
                <template #prefix><IconUser /></template>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :lg="8">
            <a-form-item field="amount" label="数量 InputNumber">
              <a-input-number v-model="form.amount" :min="0" :max="9999" mode="button" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :lg="8">
            <a-form-item field="type" label="类型 Select">
              <a-select v-model="form.type" placeholder="请选择" allow-clear>
                <a-option v-for="o in typeOptions" :key="o.value" :value="o.value" :label="o.label" />
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :lg="8">
            <a-form-item field="tags" label="标签 多选">
              <a-select v-model="form.tags" multiple placeholder="可多选" allow-clear>
                <a-option v-for="o in tagOptions" :key="o.value" :value="o.value" :label="o.label" />
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :lg="8">
            <a-form-item field="region" label="区域 Cascader">
              <a-cascader v-model="form.region" :options="regionOptions" placeholder="请选择区域" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :lg="8">
            <a-form-item field="date" label="日期 DatePicker">
              <a-date-picker v-model="form.date" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :lg="8">
            <a-form-item field="time" label="时间 TimePicker">
              <a-time-picker v-model="form.time" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :lg="8">
            <a-form-item field="range" label="日期范围 RangePicker">
              <a-range-picker v-model="form.range" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :lg="8">
            <a-form-item field="gender" label="性别 Radio">
              <a-radio-group v-model="form.gender">
                <a-radio value="male">男</a-radio>
                <a-radio value="female">女</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :lg="8">
            <a-form-item field="hobbies" label="爱好 Checkbox">
              <a-checkbox-group v-model="form.hobbies">
                <a-checkbox value="read">阅读</a-checkbox>
                <a-checkbox value="sport">运动</a-checkbox>
                <a-checkbox value="music">音乐</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :lg="8">
            <a-form-item field="enable" label="启用 Switch">
              <a-switch v-model="form.enable" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :lg="8">
            <a-form-item field="score" label="评分 Rate">
              <a-rate v-model="form.score" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :lg="8">
            <a-form-item field="level" label="等级 Slider">
              <a-slider v-model="form.level" :max="10" show-ticks />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item field="desc" label="描述 Textarea">
              <a-textarea v-model="form.desc" placeholder="请输入描述" :auto-size="{ minRows: 2, maxRows: 5 }" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item field="files" label="附件 Upload">
              <a-upload v-model:file-list="form.files" :auto-upload="false" :limit="3" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </DemoBlock>

    <DemoBlock title="表单布局" desc="layout：vertical 垂直（label 在上）/ horizontal 水平 / inline 行内。按场景切换。">
      <a-radio-group v-model="layout" type="button" style="margin-bottom: 16px">
        <a-radio value="vertical">vertical</a-radio>
        <a-radio value="horizontal">horizontal</a-radio>
        <a-radio value="inline">inline</a-radio>
      </a-radio-group>
      <a-form :model="lform" :layout="layout">
        <a-form-item field="keyword" label="关键词">
          <a-input v-model="lform.keyword" placeholder="请输入" allow-clear />
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-select v-model="lform.status" placeholder="请选择" allow-clear style="min-width: 160px">
            <a-option value="on" label="启用" />
            <a-option value="off" label="停用" />
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary">查询</a-button>
        </a-form-item>
      </a-form>
    </DemoBlock>

    <DemoBlock title="校验与提交" desc="rules 声明式校验 + @submit-success 提交（校验通过才触发）；required / 邮箱格式 / 最小长度。">
      <a-form ref="vFormRef" :model="vform" :rules="vrules" layout="vertical" style="max-width: 420px" @submit-success="onSubmitSuccess">
        <a-form-item field="username" label="用户名">
          <a-input v-model="vform.username" placeholder="必填">
            <template #prefix><IconUser /></template>
          </a-input>
        </a-form-item>
        <a-form-item field="email" label="邮箱">
          <a-input v-model="vform.email" placeholder="需为合法邮箱">
            <template #prefix><IconEmail /></template>
          </a-input>
        </a-form-item>
        <a-form-item field="password" label="密码">
          <a-input-password v-model="vform.password" placeholder="至少 6 位">
            <template #prefix><IconLock /></template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit">提交</a-button>
            <a-button @click="resetVForm">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </DemoBlock>

    <DemoBlock title="控件尺寸 / 禁用 / 只读" desc="size：mini / small / medium(默认) / large；disabled 禁用；readonly 只读。">
      <a-space direction="vertical" :size="12" fill>
        <a-space wrap align="center">
          <a-input v-model="sizeVal" size="mini" placeholder="mini" style="width: 130px" />
          <a-input v-model="sizeVal" size="small" placeholder="small" style="width: 130px" />
          <a-input v-model="sizeVal" size="medium" placeholder="medium" style="width: 130px" />
          <a-input v-model="sizeVal" size="large" placeholder="large" style="width: 130px" />
        </a-space>
        <a-space wrap>
          <a-input placeholder="禁用" disabled style="width: 180px" />
          <a-input model-value="只读内容" readonly style="width: 180px" />
        </a-space>
      </a-space>
    </DemoBlock>
  </div>
</template>
