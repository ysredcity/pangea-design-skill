#!/usr/bin/env node
/**
 * check-tokens.mjs —— 质量门禁 G2 的机检部分
 * ------------------------------------------------------------------
 * 扫描 src，报告三类违规：
 *   1) 裸 hex 颜色：样式里出现 #RGB/#RRGGBB（应改用语义 token / 调色板变量 var(--color-*)）。
 *   2) 非 token 圆角：border-radius 写死 px/数字（应改用 var(--border-radius-*)）。
 *   3) 非档位对话框宽度：<a-modal> 的 width 必须落在 520 / 720 / 1000 三档，且不得超过 1000
 *      （1000 档只在弹窗内含表格等宽组件时使用）。确认类弹窗用 Modal.*（simple 模式）走 400，无需传 width。
 *
 * 说明：
 *   - 规则 1/2：.vue 只扫 <style> 块（<script> 里的图表调色板 hex 是允许的例外——canvas 需字面色值）。
 *   - 规则 3：只扫 .vue 的 <a-modal> 开标签里的**字面数字** width；`width="auto"`、`fullscreen`、
 *     绑定表达式（如 `:width="isNarrow ? '100%' : 720"`）无法静态判定，跳过。
 *   - .less / .css 整文件扫描（仅规则 1/2）。
 *   - 有违规则退出码 1（供 `npm run gate` 用 && 串联时中断）。
 *
 * 运行：node scripts/check-tokens.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');

const HEX_IN_VALUE = /:\s*[^;{}]*#[0-9a-fA-F]{3,8}\b/;
const HEX_CAPTURE = /#[0-9a-fA-F]{3,8}\b/;
const RADIUS = /border-radius\s*:\s*([^;]+)/i;

/** 对话框宽度档位（设计约束：只有这三档，且不得超过 1000） */
const MODAL_WIDTHS = [520, 720, 1000];

/** 收集待扫描文件 */
function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (['.vue', '.less', '.css'].includes(extname(full))) acc.push(full);
  }
  return acc;
}

function stripLineComment(line) {
  return line.replace(/\/\*.*?\*\//g, '');
}

/** 圆角值是否违规（写死而非 var） */
function radiusViolation(value) {
  const v = value.trim();
  if (v.includes('var(')) return false; // 用了变量
  if (v === '0' || v === 'none') return false;
  if (v.includes('%')) return false; // 50% 之类（圆形）允许
  return /\d/.test(v); // 含数字且未用变量 → 违规
}

/**
 * 扫 <a-modal> 开标签里的字面 width，返回违规项。
 * 逐个 `<a-modal` 起点向后截到该标签的结束 `>`，再在这段属性文本里找 width。
 */
function modalWidthViolations(source) {
  const out = [];
  const openTag = /<a-modal\b/g;
  let m;
  while ((m = openTag.exec(source))) {
    const start = m.index;
    // 标签属性区结束于第一个未被引号包裹的 '>'
    let end = start;
    let quote = null;
    while (end < source.length) {
      const ch = source[end];
      if (quote) {
        if (ch === quote) quote = null;
      } else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '>') break;
      end += 1;
    }
    const attrs = source.slice(start, end);
    if (/\bfullscreen\b/.test(attrs)) continue; // 全屏弹窗不受档位约束
    // :width="720" / width="720" / :width='720'；只认纯数字字面量
    const wm = attrs.match(/:?width\s*=\s*["']\s*(\d+)\s*["']/);
    if (!wm) continue;
    const px = Number(wm[1]);
    if (MODAL_WIDTHS.includes(px)) continue;
    out.push({
      // 定位到 width 属性所在行（而不是 <a-modal 开标签行），多行标签更好改
      line: source.slice(0, start + wm.index).split(/\r?\n/).length,
      px,
      reason: px > 1000 ? '超过 1000 上限' : '不在 520 / 720 / 1000 档位',
    });
  }
  return out;
}

const violations = [];

for (const file of walk(SRC)) {
  const isVue = extname(file) === '.vue';
  const source = readFileSync(file, 'utf8');
  const lines = source.split(/\r?\n/);
  if (isVue) {
    const rel = relative(ROOT, file);
    for (const v of modalWidthViolations(source)) {
      violations.push({
        rel,
        line: v.line,
        type: '非档位对话框宽度',
        snippet: `${v.px}px（${v.reason}）`,
        text: (lines[v.line - 1] || '').trim(),
      });
    }
  }
  let inStyle = !isVue; // .less/.css 全程视为样式
  lines.forEach((raw, i) => {
    if (isVue) {
      if (/<style[\s>]/.test(raw)) {
        inStyle = true;
        return; // 开标签行不含声明
      }
      if (/<\/style>/.test(raw)) {
        inStyle = false;
        return;
      }
    }
    if (!inStyle) return;
    const line = stripLineComment(raw);
    const rel = relative(ROOT, file);
    if (HEX_IN_VALUE.test(line)) {
      violations.push({ rel, line: i + 1, type: '裸 hex 颜色', snippet: (line.match(HEX_CAPTURE) || [''])[0], text: raw.trim() });
    }
    const rm = line.match(RADIUS);
    if (rm && radiusViolation(rm[1])) {
      violations.push({ rel, line: i + 1, type: '非 token 圆角', snippet: rm[1].trim(), text: raw.trim() });
    }
  });
}

if (violations.length === 0) {
  console.log('✓ check-tokens 通过：样式中无裸 hex 颜色、无写死圆角，对话框宽度均在档位内。');
  process.exit(0);
}

console.error(`✗ check-tokens 发现 ${violations.length} 处违规（G2 Token 规范）：\n`);
for (const v of violations) {
  console.error(`  ${v.rel}:${v.line}  [${v.type}] ${v.snippet}`);
  console.error(`      ${v.text}`);
}
console.error(
  '\n修复建议：颜色改用 var(--color-*) / rgb(var(--x-n))（图表 canvas 例外）；' +
    '圆角改用 var(--border-radius-small|medium|large)；' +
    '对话框宽度收到 520 / 720 / 1000 三档（1000 仅当弹窗内含表格等宽组件），确认类弹窗用 Modal.* 走默认 400、不传 width。',
);
process.exit(1);
