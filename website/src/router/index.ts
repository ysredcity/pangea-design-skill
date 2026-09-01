import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';

// Pangea Design 官网（showcase）路由
// - 全站使用 GlobalLayout（混合菜单）作为骨架，各页作为其子路由渲染在 <router-view /> 中。
// - 两个模块（顶部横向菜单切换）：说明文档（介绍/使用指南/更新日志）、
//   设计系统（Design Tokens/图标/页面模板/组件/MSC 组件——后者是产品专属业务组件）。
// - hash 路由：产物可部署到任意静态托管，无需服务端 SPA 回退配置。
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/GlobalLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/Home/index.vue'),
        meta: { title: '介绍' },
      },
      {
        path: 'guide',
        name: 'guide',
        component: () => import('@/pages/Guide/index.vue'),
        meta: { title: '使用指南' },
      },
      {
        path: 'foundations',
        name: 'foundations',
        component: () => import('@/pages/Foundations/index.vue'),
        meta: { title: '设计基础' },
      },
      {
        path: 'icons',
        name: 'icons',
        component: () => import('@/pages/Icons/index.vue'),
        meta: { title: '图标' },
      },
      // 组件预览模块：每个组件一页
      {
        path: 'components',
        redirect: '/components/button',
      },
      {
        path: 'components/:id',
        name: 'component-detail',
        component: () => import('@/pages/Components/Detail.vue'),
        meta: { title: '组件预览' },
      },
      {
        path: 'templates',
        name: 'templates',
        component: () => import('@/pages/Templates/index.vue'),
        meta: { title: '页面模板' },
      },
      {
        // 对话框表单没有独立页面形态（靠列表页「创建」触发），给一个中转页直接打开真实弹窗
        path: 'templates/modal-form',
        component: () => import('@/pages/Templates/ModalFormPreview.vue'),
        meta: { title: '对话框表单' },
      },
      // 页面模板预览：渲染从 skill 脚手架同步过来的真实示例页
      {
        path: 'templates/simple-list',
        component: () => import('@/generated/templates/pages/Example/index.vue'),
        meta: { title: '简单列表页' },
      },
      {
        path: 'templates/filter-list',
        component: () => import('@/generated/templates/pages/FilterList/index.vue'),
        meta: { title: '基础列表页' },
      },
      {
        path: 'templates/card-list',
        component: () => import('@/generated/templates/pages/CardList/index.vue'),
        meta: { title: '卡片列表页' },
      },
      {
        path: 'templates/tree-table',
        component: () => import('@/generated/templates/pages/TreeTable/index.vue'),
        meta: { title: '左树右表列表页' },
      },
      {
        path: 'templates/basic-form',
        component: () => import('@/generated/templates/pages/ContractForm/index.vue'),
        meta: { title: '基础表单页' },
      },
      {
        path: 'templates/grouped-form',
        component: () => import('@/generated/templates/pages/GroupedForm/index.vue'),
        meta: { title: '分组表单页' },
      },
      {
        path: 'templates/step-form',
        component: () => import('@/generated/templates/pages/StepForm/index.vue'),
        meta: { title: '分步表单页' },
      },
      {
        path: 'templates/detail',
        component: () => import('@/generated/templates/pages/DetailPage/index.vue'),
        meta: { title: '详情页' },
      },
      {
        path: 'templates/approval-detail',
        component: () => import('@/generated/templates/pages/ApprovalDetail/index.vue'),
        meta: { title: '审批详情页' },
      },
      {
        path: 'templates/dashboard',
        component: () => import('@/generated/templates/pages/Dashboard/index.vue'),
        meta: { title: '仪表板示例' },
      },
      // MSC 组件：产品专属业务组件，挂在「设计系统」模块的侧边菜单下（默认不用，命中 MSC 才用）
      {
        path: 'msc',
        redirect: '/msc/attachment-upload',
      },
      {
        path: 'msc/attachment-upload',
        name: 'msc-attachment-upload',
        component: () => import('@/pages/Msc/AttachmentUpload.vue'),
        meta: { title: 'MSC 附件上传' },
      },
      {
        path: 'changelog',
        name: 'changelog',
        component: () => import('@/pages/Changelog/index.vue'),
        meta: { title: '更新日志' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
