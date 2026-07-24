import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { vitePluginForArco } from '@arco-plugins/vite-vue';

// Arco 官方插件：组件样式按需加载 + 注入 Pangea 主题包。
// - theme：套用公司主题包（品牌青绿主色等全部 token 生效）
// ⚠️ 不启用 iconBox 全局替换：iconBox 会把 Arco 所有内建图标（Modal/Select/DatePicker
//    等组件的关闭、下拉箭头、日历等【功能性图标】）也一并替换成 Pangea 图标，导致图标类名
//    与 Arco 内部样式（如 icon-hover 圆形背景定位）不匹配而显示异常。
//    正确分工：组件内建的功能性图标用 Arco 默认；业务/内容图标从 Pangea 图标包【命名导入】
//    （`import { IconXxx } from '@arco-iconbox/vue-pangea-mobile'`，不依赖此插件选项）。
export default defineConfig({
  plugins: [
    vue(),
    vitePluginForArco({
      theme: '@arco-themes/vue-pangea-3-linear',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
