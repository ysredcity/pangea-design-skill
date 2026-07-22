import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
// 显式引入 Pangea 主题的【运行时 CSS 变量】（body 上的 --primary-6、--color-text-1 等），
// 保证页面里 var(--...) / rgb(var(--primary-6)) 一定可用——不依赖插件是否注入全局变量。
// 组件样式与主题 less 仍由 vite.config.ts 的 vitePluginForArco({ theme, iconBox }) 处理。
import '@arco-themes/vue-pangea-3-linear/theme.css';
import router from './router';
import App from './App.vue';

const app = createApp(App);
app.use(ArcoVue);
app.use(router);
app.mount('#app');
