import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
// 显式引入 Pangea 主题的【运行时 CSS 变量】（body 上的 --primary-6、--color-text-1 等），
// 保证页面里 var(--...) / rgb(var(--primary-6)) 一定可用——不依赖插件是否注入全局变量。
// 组件样式与主题 less 仍由 vite.config.ts 的 vitePluginForArco({ theme, iconBox }) 处理。
import '@arco-themes/vue-pangea-3-linear/theme.css';
// Pangea Layout 侧边栏菜单自定义样式（覆盖 Arco Menu 默认样式以匹配设计稿）
import './layouts/layout-menu.less';
// 跨页面的设计约束级全局覆盖（如确认类对话框 400px 宽度）
import './styles/arco-overrides.less';
import router from './router';
import App from './App.vue';
import { APP_NAME } from './config/app';

// 浏览器标签页标题：取系统名称（APP_NAME），并随路由显示「页面名 · 系统名」
document.title = APP_NAME;
router.afterEach((to) => {
  const pageTitle = to.meta?.title as string | undefined;
  document.title = pageTitle ? `${pageTitle} · ${APP_NAME}` : APP_NAME;
});

const app = createApp(App);
app.use(ArcoVue);
app.use(router);
app.mount('#app');
