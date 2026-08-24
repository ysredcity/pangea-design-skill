import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';

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
        meta: { title: '简单列表页' },
      },
      {
        path: 'filter-list',
        name: 'filter-list',
        component: () => import('@/pages/FilterList/index.vue'),
        meta: { title: '基础列表页' },
      },
      {
        path: 'tree-table',
        name: 'tree-table',
        component: () => import('@/pages/TreeTable/index.vue'),
        meta: { title: '左树右表列表页' },
      },
      {
        path: 'card-list',
        name: 'card-list',
        component: () => import('@/pages/CardList/index.vue'),
        meta: { title: '卡片列表页' },
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/Dashboard/index.vue'),
        meta: { title: '仪表板（示例）' },
      },
      {
        path: 'contract-form',
        name: 'contract-form',
        component: () => import('@/pages/ContractForm/index.vue'),
        meta: { title: '基础表单页' },
      },
      {
        path: 'grouped-form',
        name: 'grouped-form',
        component: () => import('@/pages/GroupedForm/index.vue'),
        meta: { title: '分组表单页' },
      },
      {
        path: 'step-form',
        name: 'step-form',
        component: () => import('@/pages/StepForm/index.vue'),
        meta: { title: '分步表单页' },
      },
      {
        path: 'detail',
        name: 'detail',
        component: () => import('@/pages/DetailPage/index.vue'),
        meta: { title: '详情页' },
      },
      {
        path: 'approval-detail',
        name: 'approval-detail',
        component: () => import('@/pages/ApprovalDetail/index.vue'),
        meta: { title: '审批详情页' },
      },
      // 👇 新页面在此追加为子路由
    ],
  },
];

// 路由模式由构建配置决定（.env / .env.<mode>，见 references/overview/deployment.md）：
// - 默认 hash：不需要服务端 SPA fallback，任意静态托管 / 子路径 / iframe 都能直接跑
// - history：URL 无 #，但**要求服务端把未匹配路由回退到 index.html**（npm run build:history）
// 注意：页面组件保持 () => import(...) 懒加载即可——嵌入式单文件构建会用
// inlineDynamicImports 把所有 chunk 合并进单文件，不存在 chunk 路径解析问题。
const useHistory = import.meta.env.VITE_ROUTER_MODE === 'history';

const router = createRouter({
  history: useHistory ? createWebHistory() : createWebHashHistory(),
  routes,
});

export default router;
