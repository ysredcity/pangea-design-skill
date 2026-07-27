#!/usr/bin/env node
/**
 * check-tokens.mjs —— 质量门禁 G2 的机检部分
 * ------------------------------------------------------------------
 * 扫描 src 下样式，报告两类违规：
 *   1) 裸 hex 颜色：样式里出现 #RGB/#RRGGBB（应改用语义 token / 调色板变量 var(--color-*)）。
 *   2) 非 token 圆角：border-radius 写死 px/数字（应改用 var(--border-radius-*)）。
 *
 * 说明：
 *   - .vue 只扫 <style> 块（<script> 里的图表调色板 hex 是允许的例外——canvas 需字面色值）。
 *   - .less / .css 整文件扫描。
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

const violations = [];

for (const file of walk(SRC)) {
  const isVue = extname(file) === '.vue';
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
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
  console.log('✓ check-tokens 通过：样式中无裸 hex 颜色、无写死圆角。');
  process.exit(0);
}

console.error(`✗ check-tokens 发现 ${violations.length} 处违规（G2 Token 规范）：\n`);
for (const v of violations) {
  console.error(`  ${v.rel}:${v.line}  [${v.type}] ${v.snippet}`);
  console.error(`      ${v.text}`);
}
console.error('\n修复建议：颜色改用 var(--color-*) / rgb(var(--x-n))（图表 canvas 例外）；圆角改用 var(--border-radius-small|medium|large)。');
process.exit(1);
