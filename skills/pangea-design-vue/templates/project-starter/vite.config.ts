import { fileURLToPath, URL } from 'node:url';
import { createRequire } from 'node:module';
import { defineConfig, loadEnv, type PluginOption } from 'vite';
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
//
// 部署模式（详见 references/overview/deployment.md）——由 .env / .env.<mode> 驱动，
// 不用 `VAR=x cmd` 这种 shell 前缀（跨平台不可靠，且 `&&` 后的命令拿不到变量）：
//   npm run build         默认：hash 路由 + 相对 base + 正常分包
//   npm run build:embed   嵌入式：hash + 相对 base + 全部内联为单个 HTML（aily / 妙搭 / iframe）
//   npm run build:history History：需服务端 SPA fallback
export default defineConfig(({ mode }) => {
  // 第三个参数传 '' 表示不做前缀过滤，便于读取自定义变量
  const env = loadEnv(mode, process.cwd(), '');
  const isEmbed = env.VITE_BUILD_TARGET === 'embed';

  const plugins: PluginOption[] = [
    vue(),
    vitePluginForArco({
      theme: '@arco-themes/vue-pangea-3-linear',
    }),
  ];
  // 未安装图表库时，dev 下把它解析到一个「一 import 就抛错」的虚拟模块。
  // 为什么必须这么做：`optimizeDeps.exclude` 只是跳过预构建，**dev 的 import 分析仍会去解析
  // 这个裸包名**，解析不到就直接给整个模块返回 HTTP 500 —— LazyChart 里的 try/catch 根本没机会执行，
  // 结果是「引用了图表的页面整页加载失败」（表现为该菜单点了没反应）。
  // 换成抛错的虚拟模块后，await import() 会 reject → 被 catch 捕获 → 正常显示「图表未启用」占位。
  // build 侧已由 rollupOptions.external 兜住，所以这个插件只在 serve 生效。
  if (!chartInstalled) {
    const VIRTUAL_ID = '\0virtual:pangea-optional-chart-missing';
    plugins.push({
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
    });
  }

  // 嵌入式模式：把 JS/CSS 全部内联进 index.html
  // 用 require 动态取，保证未安装该插件时（非 embed 构建）不影响其他命令
  if (isEmbed) {
    const { viteSingleFile } = require('vite-plugin-singlefile');
    plugins.push(viteSingleFile());
  }

  return {
    base: env.VITE_BASE || './',
    plugins,
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
      // 嵌入式：CSS 不拆分 + 资源全部内联（base64），彻底去掉外部资源请求
      ...(isEmbed ? { cssCodeSplit: false, assetsInlineLimit: 100_000_000 } : {}),
      rollupOptions: {
        // 未安装时标记为外部依赖，保证「没装图表库也能构建」；装了则正常打包进产物
        external: chartInstalled ? [] : [OPTIONAL_CHART],
        output: {
          // 嵌入式：合并所有动态 import 的 chunk 到单个 bundle。
          // 这是 iframe / 子路径 / 动态 <base> 环境下白屏的关键修复——
          // 页面组件可以继续用 () => import(...) 懒加载写法，无需改成静态导入。
          ...(isEmbed ? { inlineDynamicImports: true } : {}),
        },
      },
    },
  };
});
