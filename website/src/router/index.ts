import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';

// Pangea Design 官网（showcase）路由
// - 全站使用 GlobalLayout 作为骨架，各栏目作为其子路由渲染在 <router-view /> 中。
// - hash 路由：产物可部署到任意静态托管，无需服务端 SPA 回退配置。
// - 页面模板 / 更新日志 为占位（阶段 5 实现），暂用 ComingSoon 页。
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
        path: 'components',
        name: 'components',
        component: () => import('@/pages/Components/index.vue'),
        meta: { title: '组件预览' },
      },
      {
        path: 'templates',
        name: 'templates',
        component: () => import('@/pages/Templates/index.vue'),
        meta: { title: '页面模板' },
      },
      // 页面模板预览：渲染从 skill 脚手架同步过来的真实示例页
      {
        path: 'templates/simple-list',
        component: () => import('@/generated/templates/pages/Example/index.vue'),
        meta: { title: '简单列表页' },
      },
      {
        path: 'templates/card-list',
        component: () => import('@/generated/templates/pages/CardList/index.vue'),
        meta: { title: '卡片列表页' },
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
        path: 'templates/dashboard',
        component: () => import('@/generated/templates/pages/Dashboard/index.vue'),
        meta: { title: '仪表板示例' },
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
