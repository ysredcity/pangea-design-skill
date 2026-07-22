import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import router from './router';
import App from './App.vue';

// 说明：
// - Pangea 主题包与图标包由 vite.config.ts 的 vitePluginForArco({ theme, iconBox }) 注入，
//   因此这里无需手动 import '@arco-design/web-vue/dist/arco.css' 或主题 CSS。
// - 若不使用插件，请改为手动引入（顺序：先组件库样式，再主题包样式）：
//     import '@arco-design/web-vue/dist/arco.css';
//     import '@arco-themes/vue-pangea-3-linear/theme.css';

const app = createApp(App);
app.use(ArcoVue);
app.use(router);
app.mount('#app');
