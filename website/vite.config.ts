import { fileURLToPath, URL } from 'node:url';
import { createRequire } from 'node:module';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { vitePluginForArco } from '@arco-plugins/vite-vue';

// 可选图表依赖：@visactor/vchart 不在基础依赖里（按需引入，保持 base 轻量）。
// 检测是否已安装：已装则正常打包；未装则标记为外部/排除预构建，保证「没装图表库也能 build」。
// 需要图表时：npm i @visactor/vchart（LazyChart 组件会动态 import 并优雅降级）。
const require = createRequire(import.meta.url);
const OPTIONAL_CHART = '@visactor/vchart';
let chartInstalled = false;
try {
  require.resolve(OPTIONAL_CHART);
  chartInstalled = true;
} catch {
  chartInstalled = false;
}

// Arco 官方插件：组件样式按需加载 + 注入 Pangea 主题包。
// - theme：套用公司主题包（品牌青绿主色等全部 token 生效）
// ⚠️ 不启用 iconBox 全局替换：iconBox 会把 Arco 所有内建图标（Modal/Select/DatePicker
//    等组件的关闭、下拉箭头、日历等【功能性图标】）也一并替换成 Pangea 图标，导致图标类名
//    与 Arco 内部样式（如 icon-hover 圆形背景定位）不匹配而显示异常。
//    正确分工：组件内建的功能性图标用 Arco 默认；业务/内容图标从 Pangea 图标包【命名导入】
//    （`import { IconXxx } from '@arco-iconbox/vue-pangea-mobile'`，不依赖此插件选项）。
export default defineConfig({
  // 相对 base：产物可部署到任意静态托管的任意子路径（Cloudflare Pages 等）
  base: './',
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
  // 未安装图表库时排除预构建，避免 dev 预构建报错
  optimizeDeps: {
    exclude: chartInstalled ? [] : [OPTIONAL_CHART],
  },
  build: {
    rollupOptions: {
      // 未安装时标记为外部依赖，保证「没装图表库也能构建」；装了则正常打包进产物
      external: chartInstalled ? [] : [OPTIONAL_CHART],
    },
  },
});
