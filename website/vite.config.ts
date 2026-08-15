import { fileURLToPath, URL } from 'node:url';
import { createRequire } from 'node:module';
import { defineConfig, type Plugin } from 'vite';
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

// 未安装图表库时，dev 下把它解析到一个「一 import 就抛错」的虚拟模块。
// 为什么必须这么做：`optimizeDeps.exclude` 只是跳过预构建，**dev 的 import 分析仍会去解析
// 这个裸包名**，解析不到就直接给整个模块返回 HTTP 500 —— LazyChart 里的 try/catch 根本没机会执行，
// 结果是「引用了图表的页面整页加载失败」（表现为对应菜单点了没反应）。
// 换成抛错的虚拟模块后，await import() 会 reject → 被 catch 捕获 → 正常显示「图表未启用」占位。
// build 侧已由 rollupOptions.external 兜住，所以这个插件只在 serve 生效。
// 与脚手架 templates/project-starter/vite.config.ts 保持一致。
function optionalChartDevFallback(): Plugin {
  const VIRTUAL_ID = '\0virtual:pangea-optional-chart-missing';
  return {
    name: 'pangea-optional-chart-fallback',
    apply: 'serve',
    enforce: 'pre',
    resolveId(id) {
      return id === OPTIONAL_CHART ? VIRTUAL_ID : null;
    },
    load(id) {
      if (id !== VIRTUAL_ID) return null;
      return `throw new Error('[pangea] 未安装 ${OPTIONAL_CHART}：运行 \`npm i ${OPTIONAL_CHART}\` 后图表才会渲染');`;
    },
  };
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
    // 图表库未安装时才需要 dev 解析兜底；已安装则不注册（走真实包）
    ...(chartInstalled ? [] : [optionalChartDevFallback()]),
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
