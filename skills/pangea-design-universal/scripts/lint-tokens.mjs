#!/usr/bin/env node
/**
 * lint-tokens.mjs —— Pangea 取值铁律的机检（技术栈无关）
 * ------------------------------------------------------------------
 * 档位全部读自同目录上一级的 references/tokens.json（由主题包生成），不在脚本里写死。
 *
 * ERROR（硬约束，必须为 0 才能交付）
 *   E1 样式里出现字面颜色（#hex / rgb() / rgba() / hsl() 且未用 var()）
 *      例外：box-shadow / text-shadow 里的纯黑 / 纯白半透明（rgba(0,0,0,a) / rgba(255,255,255,a)）
 *   E2 font-size 不在字号档位
 *   E3 border-radius 不在圆角档位
 *   E4 margin / padding / gap 的 px 值不在间距档位（< 2px 的细微偏移与档位值的负数不检查）
 *   E5 viewport 禁用浏览器缩放（maximum-scale=1 / user-scalable=no）
 * WARN（提示，需说明理由）
 *   W1 动效时长不在档位（transition / animation）
 *   W2 z-index 字面值 ≥ 100 且不在层级档位（< 100 视为组件内局部层叠，不检查）
 *   W3 脚本中的字面颜色（图表等需字面色值时允许，优先运行时读取 CSS 变量）
 *   W4 font-size 用 rem / em（档位以 px 定义）
 *   W5 transition: all
 *   W6 outline: none / 0（需确认有 :focus-visible 替代焦点样式）
 *
 * 扫描：.css .scss .less 全文；.html .vue .svelte 的 <style> 块、style="" 与 class 中的 Tailwind 任意值；
 *       .js .jsx .ts .tsx 的内联样式对象与 Tailwind 任意值（如 text-[#333]、p-[13px]）。
 * 跳过：node_modules、dist、build、.git，以及原样复制的 tokens.css、pangea-ui.css、pangea.*.css / .cjs 适配文件。
 * 计算式（含 calc()）跳过数值检查。
 * 豁免区：注释 pangea-lint-disable 与 pangea-lint-enable 之间的内容不检查，只用于已确认的例外（须在交付说明列出）。
 * 被检查代码自己定义的变量（如 --text-xs: 11px）在数值检查时展开，非档位值不会因为藏在变量里而漏检；
 * Pangea 自身的变量（tokens.css 中的名字）不展开。
 *
 * 用法：node scripts/lint-tokens.mjs [--summary | --inventory] <文件或目录...>
 *   （默认）    逐条列出问题
 *   --summary   按规则与取值汇总：次数、出现的属性、示例位置、就近档位建议（颜色不给建议，按角色映射）
 *   --inventory 列出被检查代码自己定义的 CSS 变量（变量层），按类型分组并统计引用次数，用于改造时在定义处映射
 * 退出码：有 ERROR 为 1，否则 0（--inventory 恒为 0）。
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, extname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOKENS = join(dirname(fileURLToPath(import.meta.url)), '../references/tokens.json');
if (!existsSync(TOKENS)) {
  console.error(`✗ 找不到 ${TOKENS}`);
  process.exit(2);
}
const t = JSON.parse(readFileSync(TOKENS, 'utf8'));

const px = (v) => (typeof v === 'string' && /^-?\d+(\.\d+)?px$/.test(v) ? parseFloat(v) : v === '0' ? 0 : null);
const setOf = (obj) => new Set(Object.values(obj).map(px).filter((n) => n !== null));
const FONT = setOf(t.font.size);
const RADIUS = setOf(t.radius);
const SPACING = setOf(t.spacing);
const DURATION = new Set(
  Object.values(t.transition.duration).map((v) => (v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000))
);
const ZINDEX = new Set(Object.values(t.zIndex).map(Number));
const fmt = (s) => [...s].sort((a, b) => a - b).join(' / ');

const STYLE_EXT = new Set(['.css', '.scss', '.less']);
const MARKUP_EXT = new Set(['.html', '.htm', '.vue', '.svelte']);
const SCRIPT_EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs']);
const SKIP_DIR = new Set(['node_modules', 'dist', 'build', '.git', '.next', '.nuxt', 'coverage']);

const findings = [];
const defs = []; // 自定义属性定义（--inventory 用）
const sources = []; // 已扫描文件的原文（统计变量引用次数用）
const disabled = []; // 豁免区
const normColor = (c) => c.toLowerCase().replace(/\s+/g, '');
// 被检查代码自己定义的变量（--x: 11px），数值检查时展开，避免把非档位值藏在变量里
const LOCAL = new Map();
const TOKENS_CSS = join(dirname(TOKENS), 'tokens.css');
const PANGEA = new Set(existsSync(TOKENS_CSS) ? [...readFileSync(TOKENS_CSS, 'utf8').matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]) : []);
function resolveLocal(value, depth = 0) {
  if (depth > 5) return value;
  return value.replace(/var\(\s*(--[\w-]+)\s*(?:,[^)]*)?\)/g, (m, name) =>
    LOCAL.has(name) && !PANGEA.has(name) ? resolveLocal(LOCAL.get(name), depth + 1) : m);
}
const report = (level, file, line, rule, msg, val = '', prop = '') => findings.push({ level, file, line, rule, msg, val, prop });

// ---------- 颜色 ----------
const LITERAL_COLOR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\((?!\s*var\()\s*[\d.][^)]*\)/g;
const BW_SHADOW = /rgba\(\s*(0\s*,\s*0\s*,\s*0|255\s*,\s*255\s*,\s*255)\s*,\s*[\d.]+\s*\)/g;

/** 检查一条 CSS 声明 */
function checkDecl(file, line, prop, value) {
  prop = prop.trim().toLowerCase();
  value = value.trim();
  if (!value) return;

  // E1 字面颜色
  let v = value;
  if (prop === 'box-shadow' || prop === 'text-shadow') v = v.replace(BW_SHADOW, '');
  const colors = v.match(LITERAL_COLOR);
  if (colors) for (const c of colors) report('ERROR', file, line, 'E1', `${prop}: 字面颜色 ${c} → 改用 var(--color-*) 或 rgb(var(--primary-6)) 等变量`, normColor(c), prop);

  let label = prop;
  const resolved = /var\(/.test(value) ? resolveLocal(value) : value;
  if (resolved !== value) {
    const names = [...value.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]).filter((n) => LOCAL.has(n) && !PANGEA.has(n) && /\d(px|rem|em|ms|s)\b/.test(resolveLocal(`var(${n})`)));
    if (names.length) label = `${prop} ← ${[...new Set(names)].join(' ')}`;
    value = resolved;
  }
  if (/calc\(/i.test(value)) return;
  const nums = [...value.replace(/var\([^)]*\)/g, '').matchAll(/(-?\d*\.?\d+)(px|rem|em)\b/g)];

  if (prop === 'font-size') {
    for (const [, n, unit] of nums) {
      if (unit !== 'px') report('WARN', file, line, 'W4', `font-size: ${n}${unit} → 用 px 档位或 var(--font-size-*)`, `${n}${unit}`, label);
      else if (!FONT.has(Number(n))) report('ERROR', file, line, 'E2', `font-size: ${n}px 不在字号档位（${fmt(FONT)}）`, `${Number(n)}px`, label);
    }
  } else if (/^border(-(top|bottom)-(left|right))?-radius$/.test(prop)) {
    for (const [, n, unit] of nums) {
      if (unit === 'px' && !RADIUS.has(Number(n))) report('ERROR', file, line, 'E3', `${prop}: ${n}px 不在圆角档位（${fmt(RADIUS)}）→ var(--border-radius-*)`, `${Number(n)}px`, label);
    }
  } else if (/^(margin|padding)(-(top|right|bottom|left|inline|block)(-(start|end))?)?$|^(row-|column-)?gap$/.test(prop)) {
    for (const [, n, unit] of nums) {
      const a = Math.abs(Number(n));
      if (unit === 'px' && a >= 2 && !SPACING.has(a)) report('ERROR', file, line, 'E4', `${prop}: ${n}px 不在间距档位（${fmt(SPACING)}）→ var(--spacing-*)，组件内边距用 --btn-size-* / --table-size-* 等组件级变量`, `${a}px`, label);
    }
  } else if (/^(transition|animation)(-duration)?$/.test(prop)) {
    // 简写里每一项的第一个时间是时长，第二个是 delay（delay 不检查）
    const times = prop.endsWith('-duration')
      ? [...value.matchAll(/(\d*\.?\d+)(ms|s)\b/g)]
      : value.split(/,(?![^(]*\))/).map((item) => {
          const m = item.match(/(\d*\.?\d+)(ms|s)\b/);
          // 时长已用 var() 写在前面时，后面的字面时间是 delay
          return m && !/var\(/.test(item.slice(0, m.index)) ? m : null;
        }).filter(Boolean);
    for (const [, n, unit] of times) {
      const ms = unit === 'ms' ? Number(n) : Number(n) * 1000;
      if (ms >= 1 && !DURATION.has(ms)) report('WARN', file, line, 'W1', `${prop}: ${n}${unit} 不在动效时长档位 → var(--transition-duration-*)`, `${ms}ms`, label);
    }
  } else if (prop === 'z-index' && /^-?\d+$/.test(value) && Number(value) >= 100 && !ZINDEX.has(Number(value))) {
    report('WARN', file, line, 'W2', `z-index: ${value} 不在层级档位（${fmt(ZINDEX)}）`, value, label);
  }

  // W5 transition: all（interaction.md I8）
  if ((prop === 'transition' || prop === 'transition-property') && /(^|[\s,])all(\s|,|$)/.test(value)) {
    report('WARN', file, line, 'W5', `${prop}: ${value} → 只列出需要过渡的属性（通常是 opacity / transform），不写 all`, 'all', label);
  }
  // W6 去掉焦点样式（interaction.md I5）：提示确认已有 :focus-visible 替代样式
  if (prop === 'outline' && /^(none|0)(\s|$)/.test(value)) {
    report('WARN', file, line, 'W6', `outline: ${value} → 确认已为 :focus-visible 提供可见的替代焦点样式`, value, label);
  }
}

/** 扫描一段 CSS 文本（startLine 为它在文件中的起始行） */
function scanCss(file, css, startLine = 1) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  for (const m of clean.matchAll(/(^|[;{\s])([a-zA-Z-]+)\s*:\s*([^;{}]+)(?=;|}|$)/gm)) {
    if (m[2].startsWith('--')) continue;
    const line = startLine + clean.slice(0, m.index).split('\n').length - 1 + (m[1] === '\n' ? 1 : 0);
    checkDecl(file, line, m[2], m[3]);
  }
  // 自定义属性：只查颜色（自造色同样不允许）
  for (const m of clean.matchAll(/(?<![\w-])(--[\w-]+)\s*:\s*([^;{}]+)/g)) {
    const line = startLine + clean.slice(0, m.index).split('\n').length - 1;
    defs.push({ file, line, name: m[1], value: m[2].trim() });
    if (PANGEA.has(m[1])) report('WARN', file, line, 'W7', `${m[1]} 与 Pangea 变量同名，接入 tokens.css 后会互相覆盖 → 原型变量改名`, m[1], m[1]);
    const colors = m[2].match(LITERAL_COLOR);
    if (colors) for (const c of colors) report('ERROR', file, line, 'E1', `${m[1]}: 自定义变量里写了字面颜色 ${c} → 引用 Pangea 变量，不要自造色`, normColor(c), m[1]);
  }
}

const lineAt = (src, idx) => src.slice(0, idx).split('\n').length;

function scanMarkup(file, src) {
  // E5 禁用缩放（interaction.md I7）
  for (const m of src.matchAll(/<meta[^>]+name=["']viewport["'][^>]*>/gi)) {
    if (/maximum-scale\s*=\s*1(\.0)?\b|user-scalable\s*=\s*(no|0)/i.test(m[0])) {
      report('ERROR', file, lineAt(src, m.index), 'E5', 'viewport 禁用了缩放（maximum-scale=1 / user-scalable=no）→ 删除；防 iOS 输入放大请把输入框字号设为 ≥ 16px');
    }
  }
  for (const m of src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) {
    scanCss(file, m[1], lineAt(src, m.index + m[0].indexOf('>') + 1));
  }
  for (const m of src.matchAll(/\sstyle\s*=\s*"([^"]*)"/gi)) scanCss(file, m[1], lineAt(src, m.index));
  // class 属性中的 Tailwind 任意值（如 text-[#333]、p-[13px]）
  const classText = src.replace(/<script[\s\S]*?<\/script>/gi, (m) => m.replace(/[^\n]/g, ' '));
  for (const m of classText.matchAll(/\sclass(?:Name)?\s*=\s*"([^"]*)"/gi)) {
    const prefix = classText.slice(0, m.index).replace(/[^\n]/g, ' ');
    scanTailwind(file, prefix + ' ' + m[1]);
  }
}

const camelToKebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

function scanScript(file, src) {
  const code = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).replace(/\/\/[^\n]*/g, '');
  // 内联样式对象：fontSize: 13 / borderRadius: '6px' / padding: '13px'
  for (const m of code.matchAll(/\b(fontSize|borderRadius|padding\w*|margin\w*|gap|rowGap|columnGap)\s*:\s*(['"`]?)(-?\d*\.?\d+)(px)?\2/g)) {
    checkDecl(file, lineAt(code, m.index), camelToKebab(m[1]), `${m[3]}px`);
  }
  scanTailwind(file, code);
  // 其余字面颜色：脚本里常见于图表配置，只提示
  for (const m of code.matchAll(/['"`](#[0-9a-fA-F]{3,8})['"`]/g)) {
    report('WARN', file, lineAt(code, m.index), 'W3', `脚本中的字面颜色 ${m[1]}：图表等确需字面值时，优先用 getComputedStyle 读取 CSS 变量`, normColor(m[1]), 'script');
  }
}

/** Tailwind 任意值（脚本与标记里的 class 都查） */
function scanTailwind(file, code) {
  for (const m of code.matchAll(/\b[a-z-]+-\[(#[0-9a-fA-F]{3,8})\]/g)) {
    report('ERROR', file, lineAt(code, m.index), 'E1', `${m[0]}：Tailwind 任意值写了字面颜色 → 映射到 Pangea 变量（见 adapters）`, normColor(m[1]), m[0].split('-[')[0]);
  }
  const TW = { text: 'font-size', rounded: 'border-radius', p: 'padding', px: 'padding', py: 'padding', pt: 'padding', pb: 'padding', pl: 'padding', pr: 'padding', m: 'margin', mx: 'margin', my: 'margin', mt: 'margin', mb: 'margin', ml: 'margin', mr: 'margin', gap: 'gap' };
  for (const m of code.matchAll(/(?<![\w-])(text|rounded|p[xytblr]?|m[xytblr]?|gap)-\[(-?\d*\.?\d+px)\]/g)) {
    checkDecl(file, lineAt(code, m.index), TW[m[1]], m[2]);
  }
}

function scanFile(file) {
  // skill 自带的生成物 / 参考样式原样复制进项目时不重复检查
  if (basename(file) === 'tokens.css' || basename(file) === 'pangea-ui.css' || /^pangea\..+\.(css|cjs)$/.test(basename(file))) return;
  const ext = extname(file).toLowerCase();
  // 豁免区：pangea-lint-disable … pangea-lint-enable 之间不检查（用于模拟第三方界面等已确认的例外）
  const src = readFileSync(file, 'utf8').replace(/pangea-lint-disable[\s\S]*?(pangea-lint-enable|$)/g, (m) => {
    disabled.push({ file, lines: m.split('\n').length });
    return m.replace(/[^\n]/g, ' ');
  });
  sources.push(src);
  if (STYLE_EXT.has(ext)) scanCss(file, src);
  else if (MARKUP_EXT.has(ext)) {
    scanMarkup(file, src);
    if (ext === '.vue' || ext === '.svelte' || ext === '.html' || ext === '.htm') {
      for (const m of src.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)) scanScript(file, m[1]);
    }
  } else if (SCRIPT_EXT.has(ext)) scanScript(file, src);
}

function walk(p) {
  const st = statSync(p);
  if (st.isDirectory()) {
    if (SKIP_DIR.has(basename(p))) return;
    for (const name of readdirSync(p)) walk(join(p, name));
  } else FILES.push(p);
}
const FILES = [];

const args = process.argv.slice(2);
const MODE = args.includes('--summary') ? 'summary' : args.includes('--inventory') ? 'inventory' : 'list';
const targets = args.filter((a) => !a.startsWith('--'));
if (!targets.length) {
  console.error('用法：node scripts/lint-tokens.mjs [--summary | --inventory] <文件或目录...>');
  process.exit(2);
}
for (const p of targets) {
  if (!existsSync(p)) {
    console.error(`✗ 路径不存在：${p}`);
    process.exit(2);
  }
  walk(p);
}
// 第一遍：收集被检查代码自己定义的变量（后定义覆盖先定义）
const SKIP_FILE = (f) => basename(f) === 'tokens.css' || basename(f) === 'pangea-ui.css' || /^pangea\..+\.(css|cjs)$/.test(basename(f));
for (const f of FILES) {
  if (SKIP_FILE(f)) continue;
  for (const m of readFileSync(f, 'utf8').matchAll(/(?<![\w-])(--[\w-]+)\s*:\s*([^;{}"'`]+)/g)) LOCAL.set(m[1], m[2].trim());
}
// 第二遍：检查
for (const f of FILES) scanFile(f);

const errors = findings.filter((f) => f.level === 'ERROR');
const warns = findings.filter((f) => f.level === 'WARN');
const where = (f) => `${relative(process.cwd(), f.file)}:${f.line}`;

// ---------- 就近档位建议 ----------
const nameOf = (obj, prefix) => {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const n = px(v);
    if (n !== null) out[n] = out[n] ? `${out[n]} / ${prefix}${k}` : `${prefix}${k}`;
  }
  return out;
};
const FONT_NAME = nameOf(t.font.size, '--font-size-');
const RADIUS_NAME = nameOf(t.radius, '--border-radius-');
const SPACING_NAME = nameOf(t.spacing, '--spacing-');
function nearest(set, n) {
  const arr = [...set].sort((a, b) => a - b);
  const d = Math.min(...arr.map((x) => Math.abs(x - n)));
  return arr.filter((x) => Math.abs(x - n) === d);
}
function suggest(rule, val) {
  const n = parseFloat(val);
  if (rule === 'E2') {
    if (n < 12) return `12px（${FONT_NAME[12]}），低于 12px 一律取 12px`;
    const c = nearest(FONT, n);
    return c.length > 1 ? `${c[0]}px 或 ${c[1]}px（等距：正文取小、标题取大）` : `${c[0]}px（${FONT_NAME[c[0]]}）`;
  }
  if (rule === 'E3') {
    if (n >= 999) return '胶囊形：圆形元素用 --border-radius-circle，其它按组件规格（标签 / 按钮用 medium）';
    if (n > 8) return '8px（--border-radius-large），卡片 / 面板 / 弹窗';
    const c = nearest(RADIUS, n);
    return c.length > 1 ? `${c[0]}px 或 ${c[1]}px（等距：控件取 medium 4px，容器取 large 8px）` : `${c[0]}px（${RADIUS_NAME[c[0]]}）`;
  }
  if (rule === 'E4') {
    const c = nearest(SPACING, n);
    return `${c[0]}px（${SPACING_NAME[c[0]]}）${c.length > 1 ? `，与 ${c[1]}px 等距时取小` : ''}`;
  }
  if (rule === 'W1') {
    if (n > 500) return '超过 500ms：环境动画默认去掉；加载类循环用 --transition-duration-loading；「在线 / 进行中」类状态呼吸可保留原周期（在交付说明解释）';
    const c = nearest(DURATION, n);
    const key = (ms) => (Object.entries(t.transition.duration).find(([, v]) => (v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000) === ms) || [''])[0];
    return c.length > 1
      ? `${c[0]}ms 或 ${c[1]}ms（等距：颜色 / 透明度取小，位移 / 展开取大）`
      : `${c[0]}ms（--transition-duration-${key(c[0])}）`;
  }
  if (rule === 'E1' || rule === 'W3') return '按角色映射（retrofit.md R3）';
  if (rule === 'W2') return n < 1000 ? '页面骨架层级可保留原值与顺序；弹层用 --z-index-popup / modal / drawer / message' : '弹层用 --z-index-popup / modal / drawer / message';
  if (rule === 'W7') return '原型变量改名';
  return '';
}

const RULE_TITLE = { E1: '字面颜色', E2: '字号', E3: '圆角', E4: '间距', E5: '禁用缩放', W1: '动效时长', W2: '层级', W3: '脚本字面颜色', W4: 'rem / em 字号', W5: 'transition: all', W6: 'outline: none', W7: '与 Pangea 变量同名' };

if (MODE === 'summary') {
  const groups = new Map();
  for (const f of [...errors, ...warns]) {
    if (!groups.has(f.rule)) groups.set(f.rule, new Map());
    const g = groups.get(f.rule);
    const key = f.val || '(其它)';
    if (!g.has(key)) g.set(key, { n: 0, viaVar: 0, props: new Set(), at: [] });
    const e = g.get(key);
    e.n++;
    if (!['W5', 'W6'].includes(f.rule) && (f.prop.startsWith('--') || f.prop.includes('←'))) e.viaVar++;
    if (f.prop) e.props.add(f.prop);
    if (e.at.length < 2) e.at.push(where(f));
  }
  for (const [rule, g] of [...groups].sort()) {
    const total = [...g.values()].reduce((s, e) => s + e.n, 0);
    const viaVar = [...g.values()].reduce((s, e) => s + e.viaVar, 0);
    console.log(`\n[${rule}] ${RULE_TITLE[rule] || ''}：${total} 处（来自变量 ${viaVar}，散写 ${total - viaVar}），${g.size} 个不同取值`);
    for (const [val, e] of [...g].sort((a, b) => b[1].n - a[1].n)) {
      const props = [...e.props].slice(0, 6).join(', ') + (e.props.size > 6 ? ' …' : '');
      const sug = suggest(rule, val);
      console.log(`  ${val.padEnd(26)} ×${String(e.n).padEnd(4)}${e.viaVar ? `（变量 ${e.viaVar}）` : ''} ${sug ? `→ ${sug}` : ''}`);
      console.log(`  ${''.padEnd(26)}       属性：${props || '-'}；例：${e.at.join('  ')}`);
    }
  }
} else if (MODE === 'inventory') {
  const all = sources.join('\n');
  const uses = (name) => (all.match(new RegExp(`var\\(\\s*${name.replace(/[-]/g, '\\-')}\\s*[,)]`, 'g')) || []).length;
  const kind = (v) =>
    /^var\(/.test(v) && !/[#]|rgba?\((?!\s*var)/.test(v) ? '引用其它变量'
    : v.match(LITERAL_COLOR) ? '颜色 / 含颜色'
    : /^-?\d*\.?\d+px$/.test(v) ? '尺寸（px）'
    : /^\d*\.?\d+m?s$/.test(v) ? '时长'
    : '其它';
  const byName = new Map();
  for (const d of defs) {
    if (!byName.has(d.name)) byName.set(d.name, []);
    const list = byName.get(d.name);
    if (!list.some((x) => x.value === d.value)) list.push(d);
  }
  const byKind = new Map();
  for (const [name, list] of byName) {
    const k = kind(list[0].value);
    if (!byKind.has(k)) byKind.set(k, []);
    byKind.get(k).push({ name, list, uses: uses(name) });
  }
  console.log(`共 ${byName.size} 个变量（${defs.length} 处定义）`);
  for (const [k, items] of byKind) {
    console.log(`\n■ ${k}（${items.length}）`);
    for (const { name, list, uses: u } of items.sort((a, b) => b.uses - a.uses)) {
      const short = (v) => (v.length > 70 ? v.slice(0, 67) + '…' : v);
      const clash = PANGEA.has(name) ? '  ⚠ 与 Pangea 同名' : '';
      console.log(`  ${name.padEnd(28)} 引用 ${String(u).padEnd(4)} ${short(list[0].value)}${clash}`);
      if (list.length > 1) for (const d of list) console.log(`  ${''.padEnd(28)}   定义于 ${where(d)}：${short(d.value)}`);
    }
  }
  console.log('\n改造时在这些定义处改为指向 Pangea 变量（retrofit.md R2 / R3），引用处不动。');
  process.exit(0);
} else {
  for (const f of [...errors, ...warns]) {
    const via = f.prop.includes('←') ? `（值来自 ${f.prop.split('← ')[1]}，在其定义处修改）` : '';
    console.log(`${f.level === 'ERROR' ? '✗' : '!'} ${where(f)}  [${f.rule}] ${f.msg}${via}`);
  }
}
if (disabled.length) {
  const files = new Set(disabled.map((d) => relative(process.cwd(), d.file)));
  console.log(`\n! 豁免区 ${disabled.length} 段（共 ${disabled.reduce((n, d) => n + d.lines, 0)} 行，${[...files].join('、')}）未检查，须在交付说明列出`);
}
console.log(`\n${errors.length ? '✗' : '✓'} ERROR ${errors.length} / WARN ${warns.length}（档位来自 tokens.json，主题包 v${t.$meta.sourceVersion}）`);
process.exit(errors.length ? 1 : 0);
