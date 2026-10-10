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
 *
 * 用法：node scripts/lint-tokens.mjs <文件或目录...>
 * 退出码：有 ERROR 为 1，否则 0。
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
const report = (level, file, line, rule, msg) => findings.push({ level, file, line, rule, msg });

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
  if (colors) report('ERROR', file, line, 'E1', `${prop}: 字面颜色 ${colors.join(' ')} → 改用 var(--color-*) 或 rgb(var(--primary-6)) 等变量`);

  if (/calc\(/i.test(value)) return;
  const nums = [...value.replace(/var\([^)]*\)/g, '').matchAll(/(-?\d*\.?\d+)(px|rem|em)\b/g)];

  if (prop === 'font-size') {
    for (const [, n, unit] of nums) {
      if (unit !== 'px') report('WARN', file, line, 'W4', `font-size: ${n}${unit} → 用 px 档位或 var(--font-size-*)`);
      else if (!FONT.has(Number(n))) report('ERROR', file, line, 'E2', `font-size: ${n}px 不在字号档位（${fmt(FONT)}）`);
    }
  } else if (/^border(-(top|bottom)-(left|right))?-radius$/.test(prop)) {
    for (const [, n, unit] of nums) {
      if (unit === 'px' && !RADIUS.has(Number(n))) report('ERROR', file, line, 'E3', `${prop}: ${n}px 不在圆角档位（${fmt(RADIUS)}）→ var(--border-radius-*)`);
    }
  } else if (/^(margin|padding)(-(top|right|bottom|left|inline|block)(-(start|end))?)?$|^(row-|column-)?gap$/.test(prop)) {
    for (const [, n, unit] of nums) {
      const a = Math.abs(Number(n));
      if (unit === 'px' && a >= 2 && !SPACING.has(a)) report('ERROR', file, line, 'E4', `${prop}: ${n}px 不在间距档位（${fmt(SPACING)}）→ var(--spacing-*)，组件内边距用 --btn-size-* / --table-size-* 等组件级变量`);
    }
  } else if (/^(transition|animation)(-duration)?$/.test(prop)) {
    for (const [, n, unit] of value.matchAll(/(\d*\.?\d+)(ms|s)\b/g)) {
      const ms = unit === 'ms' ? Number(n) : Number(n) * 1000;
      if (ms > 0 && !DURATION.has(ms)) report('WARN', file, line, 'W1', `${prop}: ${n}${unit} 不在动效时长档位 → var(--transition-duration-*)`);
    }
  } else if (prop === 'z-index' && /^-?\d+$/.test(value) && Number(value) >= 100 && !ZINDEX.has(Number(value))) {
    report('WARN', file, line, 'W2', `z-index: ${value} 不在层级档位（${fmt(ZINDEX)}）`);
  }

  // W5 transition: all（interaction.md I8）
  if ((prop === 'transition' || prop === 'transition-property') && /(^|[\s,])all(\s|,|$)/.test(value)) {
    report('WARN', file, line, 'W5', `${prop}: ${value} → 只列出需要过渡的属性（通常是 opacity / transform），不写 all`);
  }
  // W6 去掉焦点样式（interaction.md I5）：提示确认已有 :focus-visible 替代样式
  if (prop === 'outline' && /^(none|0)(\s|$)/.test(value)) {
    report('WARN', file, line, 'W6', `outline: ${value} → 确认已为 :focus-visible 提供可见的替代焦点样式`);
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
  for (const m of clean.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+)/g)) {
    const colors = m[2].match(LITERAL_COLOR);
    if (colors) {
      const line = startLine + clean.slice(0, m.index).split('\n').length - 1;
      report('ERROR', file, line, 'E1', `${m[1]}: 自定义变量里写了字面颜色 ${colors.join(' ')} → 引用 Pangea 变量，不要自造色`);
    }
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
    report('WARN', file, lineAt(code, m.index), 'W3', `脚本中的字面颜色 ${m[1]}：图表等确需字面值时，优先用 getComputedStyle 读取 CSS 变量`);
  }
}

/** Tailwind 任意值（脚本与标记里的 class 都查） */
function scanTailwind(file, code) {
  for (const m of code.matchAll(/\b[a-z-]+-\[(#[0-9a-fA-F]{3,8})\]/g)) {
    report('ERROR', file, lineAt(code, m.index), 'E1', `${m[0]}：Tailwind 任意值写了字面颜色 → 映射到 Pangea 变量（见 adapters）`);
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
  const src = readFileSync(file, 'utf8');
  if (STYLE_EXT.has(ext)) scanCss(file, src);
  else if (MARKUP_EXT.has(ext)) {
    scanMarkup(file, src);
    if (ext === '.vue' || ext === '.svelte') {
      for (const m of src.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)) scanScript(file, m[1]);
    }
  } else if (SCRIPT_EXT.has(ext)) scanScript(file, src);
}

function walk(p) {
  const st = statSync(p);
  if (st.isDirectory()) {
    if (SKIP_DIR.has(basename(p))) return;
    for (const name of readdirSync(p)) walk(join(p, name));
  } else scanFile(p);
}

const targets = process.argv.slice(2);
if (!targets.length) {
  console.error('用法：node scripts/lint-tokens.mjs <文件或目录...>');
  process.exit(2);
}
for (const p of targets) {
  if (!existsSync(p)) {
    console.error(`✗ 路径不存在：${p}`);
    process.exit(2);
  }
  walk(p);
}

const errors = findings.filter((f) => f.level === 'ERROR');
const warns = findings.filter((f) => f.level === 'WARN');
for (const f of [...errors, ...warns]) {
  console.log(`${f.level === 'ERROR' ? '✗' : '!'} ${relative(process.cwd(), f.file)}:${f.line}  [${f.rule}] ${f.msg}`);
}
console.log(`\n${errors.length ? '✗' : '✓'} ERROR ${errors.length} / WARN ${warns.length}（档位来自 tokens.json，主题包 v${t.$meta.sourceVersion}）`);
process.exit(errors.length ? 1 : 0);
