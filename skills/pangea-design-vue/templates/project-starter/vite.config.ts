import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { vitePluginForArco } from '@arco-plugins/vite-vue';

// Arco 官方插件负责三件事：组件样式按需加载、注入 Pangea 主题包、替换/自动导入 Pangea 图标包。
// - theme：套用公司主题包（品牌青绿主色等全部 token 生效，无需在 main.ts 手动 import 主题 CSS）
// - iconBox：把默认 Arco 图标替换为 Pangea 图标集，并支持在模板中直接使用图标组件
export default defineConfig({
  plugins: [
    vue(),
    vitePluginForArco({
      theme: '@arco-themes/vue-pangea-3-linear',
      iconBox: '@arco-iconbox/vue-pangea-mobile',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
