import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

// ⚑ 生成层级约定（重要）
// 全局 Layout 是稳定骨架（基于 Pangea 设计稿标准化实现）。所有「具体页面」都作为
// GlobalLayout 路由的【子路由】渲染在其 <router-view /> 中。
//
// 生成一个新页面 = 两步：
//   1. 在 src/pages/<PageName>/index.vue 新建页面组件；
//   2. 在下方 children 数组中追加一条子路由；
//   3. （可选）在 GlobalLayout.vue 的 menuItems 中追加对应菜单项。
// 不要重写/替换 GlobalLayout（除非明确被要求）。
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/GlobalLayout.vue'),
    children: [
      {
        path: '',
        name: 'example',
        component: () => import('@/pages/Example/index.vue'),
        meta: { title: '示例页面' },
      },
      // 👇 新页面在此追加为子路由，例如：
      // {
      //   path: 'orders',
      //   name: 'orders',
      //   component: () => import('@/pages/Orders/index.vue'),
      //   meta: { title: '订单列表' },
      // },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
