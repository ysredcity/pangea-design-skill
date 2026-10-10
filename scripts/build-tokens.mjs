#!/usr/bin/env node
/**
 * build-tokens.mjs —— 从 Pangea 主题包生成技术栈无关的 token 文件
 * ------------------------------------------------------------------
 * 唯一取值来源：@arco-themes/vue-pangea-3-linear（与 pangea-design-vue 同一个主题包）
 *   - theme.css   运行时 CSS 变量：色板（RGB 三元组）+ 语义色 + 圆角，含亮 / 暗两套
 *   - tokens.less 编译期 Less 变量：字体、尺寸、间距、边框、阴影、透明度、动效、层级
 *
 * 产物（生成物，勿手改）：
 *   skills/pangea-design-universal/references/tokens.json   机读，含 light/dark 与引用血缘
 *   skills/pangea-design-universal/references/tokens.css    任何技术栈可直接引入的 CSS 变量
 *
 * 命名约定：变量名与主题包保持一致（--primary-6、--color-text-1、--border-radius-medium…），
 * 主题包只在编译期提供的值以同名 CSS 变量补出（--font-size-body-3、--spacing-7…）。
 * 这样同一条规则在 Arco 工程和非 Arco 工程里写法相同。
 *
 * 用法：
 *   node scripts/build-tokens.mjs           生成
 *   node scripts/build-tokens.mjs --check   只校验产物是否与主题包一致（不一致退出码 1）
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const THEME_DIR = join(
  ROOT,
  'skills/pangea-design-vue/templates/project-starter/node_modules/@arco-themes/vue-pangea-3-linear'
);
const OUT_DIR = join(ROOT, 'skills/pangea-design-universal/references');
const OUT_JSON = join(OUT_DIR, 'tokens.json');
const OUT_CSS = join(OUT_DIR, 'tokens.css');
const CHECK = process.argv.includes('--check');

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

if (!existsSync(join(THEME_DIR, 'theme.css'))) {
  fail(
    `找不到主题包：${relative(ROOT, THEME_DIR)}\n` +
      '  先在 skills/pangea-design-vue/templates/project-starter/ 下执行 npm install'
  );
}

// Arco 基础样式：主题包只覆盖它的大部分变量，个别变量（如暗色 --color-white）仅在这里定义。
// 运行时 = 基础样式 + 主题包覆盖，所以生成时按同样顺序叠加，保证与 Vue 工程实际渲染一致。
const ARCO_BASE_CSS = join(THEME_DIR, '../../@arco-design/web-vue/dist/arco.css');
if (!existsSync(ARCO_BASE_CSS)) fail(`找不到 Arco 基础样式：${relative(ROOT, ARCO_BASE_CSS)}`);

const themeVersion = JSON.parse(readFileSync(join(THEME_DIR, 'package.json'), 'utf8')).version;
const arcoVersion = JSON.parse(
  readFileSync(join(THEME_DIR, '../../@arco-design/web-vue/package.json'), 'utf8')
).version;
const baseCss = readFileSync(ARCO_BASE_CSS, 'utf8');
const themeCss = readFileSync(join(THEME_DIR, 'theme.css'), 'utf8');
const tokensLess = readFileSync(join(THEME_DIR, 'tokens.less'), 'utf8');

// ====================================================================
// 1. 解析 CSS 变量：所有 body { } 归入 light，body[arco-theme='dark'] { } 归入 dark
// ====================================================================
function parseVars(css) {
  const out = { light: {}, dark: {} };
  const blockRe = /(body(?:\[arco-theme='dark'\])?)\s*\{([^}]*)\}/g;
  for (const [, selector, body] of css.matchAll(blockRe)) {
    const mode = selector.includes('dark') ? 'dark' : 'light';
    for (const [, name, value] of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
      out[mode][name] = value.trim();
    }
  }
  return out;
}
const base = parseVars(baseCss);
const theme = parseVars(themeCss);
const raw = {
  light: { ...base.light, ...theme.light },
  // 暗色只覆盖部分变量，其余沿用亮色定义（与运行时 CSS 层叠一致）
  dark: { ...base.light, ...theme.light, ...base.dark, ...theme.dark },
};

const fontFamilyMatch = themeCss.match(/font-family:\s*([^;]+);/);

const hex2 = (n) => Math.round(n).toString(16).padStart(2, '0');
const toHex = (r, g, b) => `#${hex2(r)}${hex2(g)}${hex2(b)}`;
const isTriplet = (v) => /^\d+\s*,\s*\d+\s*,\s*\d+$/.test(v);

/**
 * 取色板变量的 RGB 三元组。语义色板是别名（--danger-1: var(--red-1)），需沿引用找到三元组。
 * 返回 null 表示该变量不是色板变量。
 */
function triplet(mode, name, depth = 0) {
  if (depth > 10) fail(`色板引用过深：--${name}`);
  const v = raw[mode][name];
  if (v === undefined) return null;
  if (isTriplet(v)) return v;
  const m = v.match(/^var\(--([\w-]+)\)$/);
  return m ? triplet(mode, m[1], depth + 1) : null;
}

/** 把一个 CSS 变量值解析成最终颜色（hex 或 rgba），记录引用链 */
function resolve(mode, value, depth = 0) {
  if (depth > 10) fail(`变量引用过深：${value}`);
  const vars = raw[mode];
  let m;
  if ((m = value.match(/^rgb\(var\(--([\w-]+)\)\)$/))) {
    const t = triplet(mode, m[1]);
    if (!t) fail(`无法解析 ${value}（${mode}）`);
    const [r, g, b] = t.split(',').map(Number);
    return { value: toHex(r, g, b), ref: m[1] };
  }
  if ((m = value.match(/^rgba\(var\(--([\w-]+)\),\s*([\d.]+)\)$/))) {
    const t = triplet(mode, m[1]);
    if (!t) fail(`无法解析 ${value}（${mode}）`);
    const [r, g, b] = t.split(',').map(Number);
    return { value: `rgba(${r}, ${g}, ${b}, ${Number(m[2])})`, ref: m[1] };
  }
  if ((m = value.match(/^var\(--([\w-]+)\)$/))) {
    const next = vars[m[1]];
    if (next === undefined) fail(`未定义的变量 --${m[1]}（${mode}）`);
    const r = resolve(mode, next, depth + 1);
    return { value: r.value, ref: m[1] };
  }
  return { value: value.toLowerCase() === '#fff' ? '#ffffff' : value.toLowerCase() };
}

// ---- 色板：--red-1 … --primary-10，值为 RGB 三元组 ----
const palette = { light: {}, dark: {} };
for (const mode of ['light', 'dark']) {
  for (const name of Object.keys(raw[mode])) {
    const m = name.match(/^([a-z]+)-(\d+)$/);
    const t = m && triplet(mode, name);
    if (!t) continue;
    const [r, g, b] = t.split(',').map(Number);
    (palette[mode][m[1]] ??= {})[m[2]] = toHex(r, g, b);
  }
}

// ---- 语义色：--color-*（不含色板）----
const color = {};
for (const name of Object.keys(raw.light)) {
  if (!name.startsWith('color-')) continue;
  const l = resolve('light', raw.light[name]);
  const d = resolve('dark', raw.dark[name]);
  color[name] = { light: l.value, dark: d.value };
  if (l.ref) color[name].ref = l.ref;
}

// ---- 圆角：运行时 CSS 变量 ----
const radius = {};
for (const [name, v] of Object.entries(raw.light)) {
  if (name.startsWith('border-radius-')) radius[name.replace('border-radius-', '')] = v;
}

// ====================================================================
// 2. 解析 tokens.less：只取全局刻度，不取组件级变量（btn-* / input-* …）
// ====================================================================
const less = {};
for (const [, name, value] of tokensLess.matchAll(/^@([\w-]+)\s*:\s*([^;]+);/gm)) {
  less[name] = value.trim();
}
const pick = (re) =>
  Object.fromEntries(
    Object.entries(less)
      .filter(([k]) => re.test(k))
      .map(([k, v]) => [k, v])
  );
const strip = (obj, prefix) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.replace(prefix, ''), v]));

const font = {
  family: less['font-family'] ?? (fontFamilyMatch && fontFamilyMatch[1].trim()),
  codeFamily: less['code-family'],
  size: strip(pick(/^font-size-/), 'font-size-'),
  weight: strip(pick(/^font-weight-\d+$/), 'font-weight-'),
  lineHeight: { base: less['line-height-base'] },
};
const size = strip(pick(/^size-(none|\d+|mini|small|default|medium|large)$/), 'size-');
const spacing = strip(pick(/^spacing-(none|\d+)$/), 'spacing-');
const borderWidth = strip(pick(/^border-(none|\d)$/), 'border-');
const shadow = {
  ...strip(pick(/^shadow[123]-/), 'shadow'),
  special: less['shadow-special'],
};
const opacity = strip(pick(/^opacity-(none|\d+)$/), 'opacity-');
const transition = {
  duration: strip(pick(/^transition-duration-/), 'transition-duration-'),
  easing: strip(pick(/^transition-timing-function-/), 'transition-timing-function-'),
};
const zIndex = strip(pick(/^z-index-/), 'z-index-');

// 少量组件级 token：设计规则里直接引用、但不在全局刻度内的值（如表格单元格上下内边距 7px）。
// 只收规则用得到的，名字与主题包 Less 变量一致；其余组件 token 不导出，避免变成「第二套组件库」。
const COMPONENT_KEYS = [
  /^table-size-(small|medium|default|large)-padding-(vertical|horizontal)$/,
  /^table-size-(small|medium|default|large)-font-size$/,
  /^btn-size-(mini|small|default|large)-(height|padding-horizontal|font-size)$/,
  /^btn-primary-color-text$/,
  /^input-size-(mini|small|default|large)-height$/,
  /^alert-padding-(horizontal|vertical)(_with_title)?$/,
  /^modal-(default|simple)-padding-[a-z-]+$/,
  /^modal-(default|simple)-size-width$/,
  /^drawer-padding-[a-z-]+$/,
  /^message-padding-(top|bottom|left|right)$/,
  /^tooltip-padding-(horizontal|vertical)$/,
  /^popup-padding-(horizontal|vertical)$/,
];
const component = {};
for (const [k, v] of Object.entries(less)) {
  if (!COMPONENT_KEYS.some((re) => re.test(k))) continue;
  // 值可能引用其它 Less 变量（如 @font-size-body-3），解析到字面值
  let val = v;
  for (let i = 0; i < 5 && /^@[\w-]+$/.test(val); i++) val = less[val.slice(1)] ?? val;
  component[k] = val;
}
if (!component['table-size-medium-padding-vertical']) fail('主题包中缺少 table-size-medium-padding-vertical');

// ---- 必需项自检：主题包结构若有变化，宁可报错也不静默生成残缺产物 ----
const required = [
  [palette.light.primary?.['6'], '色板 primary-6'],
  [palette.dark.primary?.['6'], '暗色色板 primary-6'],
  [color['color-text-1'], '语义色 color-text-1'],
  [color['color-border-2'], '语义色 color-border-2'],
  [radius.medium, '圆角 medium'],
  [font.size['body-3'], '字号 body-3'],
  [size.default, '尺寸 default'],
  [spacing['7'], '间距 7'],
  [transition.duration['2'], '动效时长 2'],
];
for (const [v, label] of required) if (!v) fail(`主题包中缺少 ${label}，请检查主题包结构是否变化`);

// ====================================================================
// 3. 组装产物
// ====================================================================
const tokens = {
  $meta: {
    source: '@arco-themes/vue-pangea-3-linear',
    sourceVersion: themeVersion,
    baseLayer: `@arco-design/web-vue v${arcoVersion} dist/arco.css（主题包未覆盖的变量）`,
    note: '生成物，勿手改。值与档位以主题包为唯一事实源；变量名与主题包一致，CSS 用法见 tokens.css。',
    modes: ['light', 'dark'],
    darkSelector: "[data-theme='dark'], body[arco-theme='dark']",
  },
  palette,
  color,
  font,
  size,
  spacing,
  borderWidth,
  radius,
  shadow,
  opacity,
  transition,
  zIndex,
  component,
};

const hexToTriplet = (hex) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ');

function cssBlock(mode) {
  const lines = [];
  lines.push('  /* ---- 色板（RGB 三元组，用法：rgb(var(--primary-6)) / rgba(var(--primary-6), 0.2)） ---- */');
  for (const [fam, steps] of Object.entries(palette[mode])) {
    for (const [i, hex] of Object.entries(steps)) lines.push(`  --${fam}-${i}: ${hexToTriplet(hex)};`);
  }
  lines.push('  /* ---- 语义色（组件与页面只引这一组） ---- */');
  for (const [name, v] of Object.entries(color)) lines.push(`  --${name}: ${v[mode]};`);
  return lines;
}

function cssScales() {
  const lines = [];
  const emit = (title, prefix, obj) => {
    lines.push(`  /* ---- ${title} ---- */`);
    for (const [k, v] of Object.entries(obj)) lines.push(`  --${prefix}${k}: ${v};`);
  };
  lines.push(`  --font-family: ${font.family};`);
  lines.push(`  --code-family: ${font.codeFamily};`);
  emit('字号', 'font-size-', font.size);
  emit('字重', 'font-weight-', font.weight);
  lines.push(`  --line-height-base: ${font.lineHeight.base};`);
  emit('尺寸（4px 步进；mini/small/default/large = 控件高度档）', 'size-', size);
  emit('间距', 'spacing-', spacing);
  emit('边框宽度', 'border-', borderWidth);
  emit('圆角', 'border-radius-', radius);
  emit('阴影', 'shadow', Object.fromEntries(Object.entries(shadow).filter(([k]) => k !== 'special')));
  lines.push(`  --shadow-special: ${shadow.special};`);
  emit('透明度', 'opacity-', opacity);
  emit('动效时长', 'transition-duration-', transition.duration);
  emit('动效缓动', 'transition-timing-function-', transition.easing);
  emit('层级', 'z-index-', zIndex);
  emit('组件级（仅设计规则引用的少量值，名与主题包 Less 变量一致）', '', component);
  return lines;
}

const css = [
  '/**',
  ' * Pangea Design Tokens —— 生成物，勿手改',
  ` * 来源：@arco-themes/vue-pangea-3-linear v${themeVersion} + @arco-design/web-vue v${arcoVersion} 基础层`,
  ' * 引入方式：任何技术栈直接引入本文件；暗色在根元素加 data-theme="dark"。',
  ' * 变量名与主题包一致，Arco 工程中同名变量值相同，可安全共存。',
  ' */',
  ':root {',
  ...cssScales(),
  ...cssBlock('light'),
  '}',
  '',
  "[data-theme='dark'],",
  "body[arco-theme='dark'] {",
  ...cssBlock('dark'),
  '}',
  '',
].join('\n');

const json = JSON.stringify(tokens, null, 2) + '\n';

// ====================================================================
// 4. 组件库 / 框架适配（生成物）
//    规则：凡是能用 CSS 变量的，一律引用 tokens.css 里的变量（暗色随之切换）；
//    只有要求字面值的（Ant Design 主题 token）才写死值。
// ====================================================================
const ADAPTER_DIR = join(OUT_DIR, 'adapters');
const header = (comment, what) => {
  const lines = [
    `Pangea × ${what} 适配 —— 生成物，勿手改`,
    `来源：@arco-themes/vue-pangea-3-linear v${themeVersion}`,
    '前提：页面已引入 tokens.css（不放进 @layer）。用法见 references/adapters.md',
  ];
  return comment === '/*'
    ? ['/**', ...lines.map((l) => ` * ${l}`), ' */'].join('\n')
    : lines.map((l) => `// ${l}`).join('\n');
};
const semanticNames = Object.keys(color).map((n) => n.replace(/^color-/, ''));

// ---- Tailwind CSS v4：@theme inline，清空默认色板 / 圆角 / 字号，只留 Pangea 档位 ----
const tw4 = [
  header('/*', 'Tailwind CSS v4'),
  '/* 暗色变体与 tokens.css 一致：以根元素 data-theme="dark" 为准（dark:hidden 等可直接用） */',
  '@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));',
  '',
  '@theme inline {',
  '  /* 清空 Tailwind 默认值，避免误用规范外的颜色、圆角、字号、阴影 */',
  '  --color-*: initial;',
  '  --radius-*: initial;',
  '  --text-*: initial;',
  '  --shadow-*: initial;',
  '  --font-sans: var(--font-family);',
  '  --font-mono: var(--code-family);',
  '  --color-transparent: transparent;',
  '  --color-current: currentColor;',
  '  /* 语义色：bg-bg-1、text-text-1、border-border-2、bg-fill-2 … */',
  ...semanticNames.map((n) => `  --color-${n}: var(--color-${n});`),
  '  /* 色板：bg-primary-6、text-danger-6、bg-primary-6/20 … */',
  ...Object.entries(palette.light).flatMap(([fam, steps]) =>
    Object.keys(steps).map((i) => `  --color-${fam}-${i}: rgb(var(--${fam}-${i}));`)
  ),
  '  /* 圆角：rounded-small / medium / large / circle */',
  ...Object.keys(radius).filter((k) => k !== 'none').map((k) => `  --radius-${k}: var(--border-radius-${k});`),
  '  /* 字号：text-body-3（14px）、text-title-1（16px）… */',
  ...Object.keys(font.size).map((k) => `  --text-${k}: var(--font-size-${k});`),
  '  /* 阴影：shadow-2-down … */',
  ...Object.keys(shadow)
    .filter((k) => k !== 'special')
    .map((k) => `  --shadow-${k}: var(--shadow${k});`),
  '}',
  '',
].join('\n');

// ---- Tailwind CSS v3：preset（theme 整体替换，不 extend） ----
const tw3Colors = {
  transparent: 'transparent',
  current: 'currentColor',
  ...Object.fromEntries(semanticNames.map((n) => [n, `var(--color-${n})`])),
  ...Object.fromEntries(
    Object.entries(palette.light).flatMap(([fam, steps]) =>
      Object.keys(steps).map((i) => [`${fam}-${i}`, `rgba(var(--${fam}-${i}), <alpha-value>)`])
    )
  ),
};
const tw3 = [
  header('//', 'Tailwind CSS v3'),
  '// 用法：tailwind.config.js 中 presets: [require("./pangea.tailwind-v3.cjs")]',
  '// 语义色（text-1、bg-1 …）不支持 /50 透明度修饰；需要透明度时用色板（primary-6/20）。',
  `module.exports = ${JSON.stringify(
    {
      darkMode: ['selector', '[data-theme="dark"]'],
      theme: {
        colors: tw3Colors,
        borderRadius: Object.fromEntries(
          Object.keys(radius).map((k) => [k === 'medium' ? 'DEFAULT' : k, `var(--border-radius-${k})`]).concat([['medium', 'var(--border-radius-medium)']])
        ),
        fontSize: Object.fromEntries(Object.keys(font.size).map((k) => [k, `var(--font-size-${k})`])),
        fontFamily: { sans: ['var(--font-family)'], mono: ['var(--code-family)'] },
        boxShadow: Object.fromEntries(
          Object.keys(shadow).filter((k) => k !== 'special').map((k) => [k, `var(--shadow${k})`]).concat([['none', 'none']])
        ),
      },
    },
    null,
    2
  )};`,
  '',
].join('\n');

// ---- shadcn/ui（Tailwind v4 版）：覆盖 shadcn 的语义变量 ----
const shadcnMap = {
  background: 'var(--color-bg-1)',
  foreground: 'var(--color-text-1)',
  card: 'var(--color-bg-2)',
  'card-foreground': 'var(--color-text-1)',
  popover: 'var(--color-bg-popup)',
  'popover-foreground': 'var(--color-text-1)',
  primary: 'rgb(var(--primary-6))',
  'primary-foreground': 'var(--color-white)',
  secondary: 'var(--color-fill-2)',
  'secondary-foreground': 'var(--color-text-1)',
  muted: 'var(--color-fill-2)',
  'muted-foreground': 'var(--color-text-3)',
  accent: 'var(--color-fill-2)',
  'accent-foreground': 'var(--color-text-1)',
  destructive: 'rgb(var(--danger-6))',
  border: 'var(--color-border-2)',
  input: 'var(--color-border-3)',
  ring: 'rgb(var(--primary-6))',
  radius: 'var(--border-radius-medium)',
};
const shadcn = [
  header('/*', 'shadcn/ui'),
  '/* 放在 shadcn 生成的 :root / .dark 变量之后，覆盖其默认值。暗色同时加 class="dark" 与 data-theme="dark"。 */',
  ':root,',
  ':root.dark {',
  ...Object.entries(shadcnMap).map(([k, v]) => `  --${k}: ${v};`),
  '}',
  '',
].join('\n');

// ---- Element Plus：CSS 变量覆盖 ----
const elMap = {
  'color-primary': 'rgb(var(--primary-6))',
  'color-primary-light-3': 'rgb(var(--primary-5))',
  'color-primary-light-5': 'rgb(var(--primary-4))',
  'color-primary-light-7': 'rgb(var(--primary-3))',
  'color-primary-light-8': 'rgb(var(--primary-2))',
  'color-primary-light-9': 'rgb(var(--primary-1))',
  'color-primary-dark-2': 'rgb(var(--primary-7))',
};
for (const [el, pg] of [['success', 'success'], ['warning', 'warning'], ['danger', 'danger'], ['error', 'danger']]) {
  elMap[`color-${el}`] = `rgb(var(--${pg}-6))`;
  for (const [lv, step] of [['3', 5], ['5', 4], ['7', 3], ['8', 2], ['9', 1]]) elMap[`color-${el}-light-${lv}`] = `rgb(var(--${pg}-${step}))`;
  elMap[`color-${el}-dark-2`] = `rgb(var(--${pg}-7))`;
}
Object.assign(elMap, {
  'text-color-primary': 'var(--color-text-1)',
  'text-color-regular': 'var(--color-text-2)',
  'text-color-secondary': 'var(--color-text-3)',
  'text-color-placeholder': 'var(--color-text-3)',
  'text-color-disabled': 'var(--color-text-4)',
  'border-color': 'var(--color-border-3)',
  'border-color-light': 'var(--color-border-2)',
  'border-color-lighter': 'var(--color-border-2)',
  'border-color-extra-light': 'var(--color-border-1)',
  'border-color-dark': 'var(--color-border-4)',
  'border-color-darker': 'var(--color-border-4)',
  'fill-color': 'var(--color-fill-2)',
  'fill-color-light': 'var(--color-fill-1)',
  'fill-color-lighter': 'var(--color-fill-1)',
  'fill-color-extra-light': 'var(--color-fill-1)',
  'fill-color-dark': 'var(--color-fill-3)',
  'fill-color-darker': 'var(--color-fill-4)',
  'fill-color-blank': 'var(--color-bg-2)',
  'bg-color': 'var(--color-bg-2)',
  'bg-color-page': 'var(--color-fill-2)',
  'bg-color-overlay': 'var(--color-bg-popup)',
  'mask-color': 'var(--color-mask-bg)',
  'disabled-bg-color': 'var(--color-fill-2)',
  'disabled-text-color': 'var(--color-text-4)',
  'disabled-border-color': 'var(--color-fill-4)',
  'border-radius-small': 'var(--border-radius-small)',
  'border-radius-base': 'var(--border-radius-medium)',
  'font-family': 'var(--font-family)',
  'font-size-extra-small': 'var(--font-size-body-1)',
  'font-size-small': 'var(--font-size-body-2)',
  'font-size-base': 'var(--font-size-body-3)',
  'font-size-medium': 'var(--font-size-title-1)',
  'font-size-large': 'var(--font-size-title-1)',
  'font-size-extra-large': 'var(--font-size-title-2)',
  'component-size-small': 'var(--size-small)',
  'component-size': 'var(--size-default)',
  'component-size-large': 'var(--size-large)',
  'box-shadow-light': 'var(--shadow2-down)',
});
const elementPlus = [
  header('/*', 'Element Plus'),
  '/* 在 element-plus 样式之后引入；不要再引入 element-plus 的 dark/css-vars.css，暗色由 tokens.css 切换。 */',
  ':root,',
  ':root.dark {',
  ...Object.entries(elMap).map(([k, v]) => `  --el-${k}: ${v};`),
  '}',
  '',
  '/* Element Plus 把以下尺寸写死在组件里，全局变量改不到，单独对齐 Pangea 档位 */',
  '.el-button--small {',
  '  --el-button-size: var(--size-small);',
  '  padding: 0 var(--btn-size-small-padding-horizontal);',
  '  font-size: var(--btn-size-small-font-size);',
  '  border-radius: var(--border-radius-medium);',
  '}',
  '.el-button--large {',
  '  --el-button-size: var(--size-large);',
  '  padding: 0 var(--btn-size-large-padding-horizontal);',
  '}',
  '.el-input--small,',
  '.el-input--large {',
  '  font-size: var(--font-size-body-3);',
  '}',
  '.el-select--small .el-select__wrapper {',
  '  min-height: var(--size-small);',
  '  font-size: var(--font-size-body-3);',
  '}',
  '.el-select--large .el-select__wrapper {',
  '  min-height: var(--size-large);',
  '}',
  '/* 组件级变量：Element 把它们定义在组件自身的类上，:root 覆盖不到，需写在同一类上 */',
  '/* 输入类默认底色：Pangea 为 --color-bg-1（暗色比卡片底更深），Element 默认用 fill-color-blank */',
  '.el-input,',
  '.el-textarea {',
  '  --el-input-bg-color: var(--color-bg-1);',
  '}',
  '.el-select__wrapper {',
  '  background-color: var(--color-bg-1);',
  '}',
  '.el-table {',
  '  --el-table-header-bg-color: var(--color-neutral-2);',
  '  --el-table-header-text-color: var(--color-neutral-10);',
  '  --el-table-text-color: var(--color-text-1);',
  '  --el-table-row-hover-bg-color: var(--color-fill-1);',
  '  --el-table-border-color: var(--color-border-2);',
  '  --el-table-tr-bg-color: var(--color-bg-2);',
  '  --el-table-bg-color: var(--color-bg-2);',
  '}',
  '.el-table .el-table__cell {',
  '  padding: var(--table-size-medium-padding-vertical) 0;',
  '}',
  '.el-table .cell {',
  '  padding: 0 var(--table-size-medium-padding-horizontal);',
  '}',
  '.el-table th.el-table__cell {',
  '  font-weight: var(--font-weight-600);',
  '}',
  '.el-pagination {',
  '  --el-pagination-button-height: var(--size-small);',
  '  --el-pagination-button-width: var(--size-small);',
  '  --el-pagination-border-radius: var(--border-radius-medium);',
  '  --el-pagination-font-size: var(--font-size-body-3);',
  '  --el-pagination-button-color: var(--color-text-2);',
  '}',
  '.el-pager li {',
  '  border-radius: var(--border-radius-medium);',
  '}',
  '.el-pager li.is-active {',
  '  color: rgb(var(--primary-6));',
  '  background-color: var(--color-primary-light-1);',
  '  font-weight: var(--font-weight-400);',
  '}',
  '.el-dialog {',
  '  --el-dialog-border-radius: var(--border-radius-large);',
  '  --el-dialog-padding-primary: var(--modal-default-padding-horizontal);',
  '  --el-dialog-title-font-size: var(--font-size-title-1);',
  '  --el-dialog-bg-color: var(--color-bg-3);',
  '}',
  '.el-overlay {',
  '  --el-overlay-color-lighter: var(--color-mask-bg);',
  '}',
  '.el-message-box {',
  '  --el-messagebox-width: var(--modal-simple-size-width);',
  '  --el-messagebox-border-radius: var(--border-radius-large);',
  '}',
  '.el-message {',
  '  --el-message-bg-color: var(--color-bg-popup);',
  '  --el-message-border-color: var(--color-border-2);',
  '  border-radius: var(--border-radius-large);',
  '  box-shadow: var(--shadow2-down);',
  '}',
  '.el-segmented {',
  '  --el-segmented-bg-color: var(--color-fill-2);',
  '  --el-segmented-color: var(--color-text-2);',
  '  --el-segmented-item-selected-bg-color: var(--color-bg-5);',
  '  --el-segmented-item-selected-color: rgb(var(--primary-6));',
  '  --el-segmented-item-hover-bg-color: transparent;',
  '  --el-segmented-item-hover-color: var(--color-text-1);',
  '}',
  "[data-theme='dark'] .el-segmented {",
  '  --el-segmented-item-selected-bg-color: var(--color-fill-3);',
  '}',
  '/* 默认（次）按钮：Pangea 为浅灰底，hover 变白底、文字加深（Element 默认 hover 变主色） */',
  '.el-button:not(.el-button--primary, .el-button--success, .el-button--warning, .el-button--danger, .el-button--info, .is-text, .is-link, .is-plain) {',
  '  --el-button-bg-color: var(--color-neutral-1);',
  '  --el-button-border-color: var(--color-border-3);',
  '  --el-button-text-color: var(--color-text-2);',
  '  --el-button-hover-bg-color: var(--color-bg-3);',
  '  --el-button-hover-border-color: var(--color-border-4);',
  '  --el-button-hover-text-color: var(--color-neutral-10);',
  '  --el-button-active-bg-color: var(--color-neutral-2);',
  '  --el-button-active-border-color: var(--color-border-4);',
  '  --el-button-active-text-color: var(--color-neutral-10);',
  '}',
  '',
].join('\n');

// ---- Ant Design v5 / v6：ConfigProvider theme（只能用字面值） ----
const C = (mode, n) => color[n][mode];
const P = (mode, fam, i) => palette[mode][fam][String(i)];
const antdToken = (mode) => ({
  colorPrimary: P(mode, 'primary', 6),
  // 亮色可精确指定 hover / active；暗色由 darkAlgorithm 派生主色色阶（Ant Design 限制）
  ...(mode === 'light'
    ? { colorPrimaryHover: P(mode, 'primary', 5), colorPrimaryActive: P(mode, 'primary', 7) }
    : {}),
  colorSuccess: P(mode, 'success', 6),
  colorWarning: P(mode, 'warning', 6),
  colorError: P(mode, 'danger', 6),
  colorInfo: P(mode, 'primary', 6),
  colorLink: P(mode, 'link', 6),
  colorText: C(mode, 'color-text-1'),
  colorTextSecondary: C(mode, 'color-text-2'),
  colorTextTertiary: C(mode, 'color-text-3'),
  colorTextQuaternary: C(mode, 'color-text-4'),
  colorBorder: C(mode, 'color-border-3'),
  colorBorderSecondary: C(mode, 'color-border-2'),
  colorBgContainer: C(mode, 'color-bg-2'),
  colorBgElevated: C(mode, 'color-bg-popup'),
  colorBgLayout: C(mode, 'color-fill-2'),
  colorBgMask: C(mode, 'color-mask-bg'),
  borderRadius: px4(radius.medium),
  borderRadiusSM: px4(radius.small),
  borderRadiusLG: px4(radius.large),
  fontSize: px4(font.size['body-3']),
  fontSizeSM: px4(font.size['body-1']),
  fontSizeLG: px4(font.size['title-1']),
  fontFamily: font.family,
  fontFamilyCode: font.codeFamily,
  controlHeight: px4(size.default),
  controlHeightSM: px4(size.small),
  controlHeightLG: px4(size.large),
  motionDurationFast: transition.duration['1'],
  motionDurationMid: transition.duration['2'],
  motionDurationSlow: transition.duration['3'],
});
// 组件级：默认（次）按钮对齐 Pangea（浅灰底、hover 白底 + 文字加深）；小按钮圆角仍为 4px
const antdComponents = (mode) => ({
  Button: {
    borderRadiusSM: px4(radius.medium),
    defaultBg: C(mode, 'color-neutral-1'),
    defaultColor: C(mode, 'color-text-2'),
    defaultBorderColor: C(mode, 'color-border-3'),
    defaultHoverBg: C(mode, 'color-bg-3'),
    defaultHoverColor: C(mode, 'color-neutral-10'),
    defaultHoverBorderColor: C(mode, 'color-border-4'),
    defaultActiveBg: C(mode, 'color-neutral-2'),
    defaultActiveColor: C(mode, 'color-neutral-10'),
    defaultActiveBorderColor: C(mode, 'color-border-4'),
  },
});
function px4(v) {
  return parseFloat(v);
}
const antd =
  JSON.stringify(
    {
      $comment:
        `Pangea × Ant Design v5/v6 主题 —— 生成物，勿手改（主题包 v${themeVersion}）。` +
        ' <ConfigProvider theme={{ token: light.token, components: light.components }}>；暗色：{ algorithm: theme.darkAlgorithm, token: dark.token, components: dark.components }。' +
        ' Ant Design 只接受字面值，且由算法派生 hover / 暗色色阶，与 Pangea 色阶会有细微差异。',
      light: { token: antdToken('light'), components: antdComponents('light') },
      dark: { algorithm: 'darkAlgorithm', token: antdToken('dark'), components: antdComponents('dark') },
    },
    null,
    2
  ) + '\n';

const OUTPUTS = [
  [OUT_JSON, json],
  [OUT_CSS, css],
  [join(ADAPTER_DIR, 'pangea.tailwind-v4.css'), tw4],
  [join(ADAPTER_DIR, 'pangea.tailwind-v3.cjs'), tw3],
  [join(ADAPTER_DIR, 'pangea.shadcn.css'), shadcn],
  [join(ADAPTER_DIR, 'pangea.element-plus.css'), elementPlus],
  [join(ADAPTER_DIR, 'pangea.antd-theme.json'), antd],
];

// ====================================================================
// 5. 写出 / 校验
// ====================================================================
if (CHECK) {
  const stale = OUTPUTS.filter(([p, c]) => !existsSync(p) || readFileSync(p, 'utf8') !== c);
  if (stale.length) {
    fail(
      `token 产物与主题包 v${themeVersion} 不一致：${stale.map(([p]) => relative(ROOT, p)).join(', ')}\n` +
        '  运行 node scripts/build-tokens.mjs 重新生成'
    );
  }
  console.log(`✓ token 产物与主题包 v${themeVersion} 一致`);
} else {
  mkdirSync(ADAPTER_DIR, { recursive: true });
  for (const [p, c] of OUTPUTS) writeFileSync(p, c, 'utf8');
  const famCount = Object.keys(palette.light).length;
  console.log(
    `✓ 生成完成（主题包 v${themeVersion}）：色板 ${famCount} 组 / 语义色 ${Object.keys(color).length} 个 / ` +
      `字号 ${Object.keys(font.size).length} / 间距 ${Object.keys(spacing).length} / 尺寸 ${Object.keys(size).length}\n` +
      OUTPUTS.map(([p]) => `  → ${relative(ROOT, p)}`).join('\n')
  );
}
