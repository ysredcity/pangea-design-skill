#!/usr/bin/env node
/**
 * build-catalog.mjs —— 生成机读元数据索引
 * ------------------------------------------------------------------
 * 扫描 references/patterns/*.md 与 references/component-selection/*.md 顶部
 * frontmatter 中的 `meta:` 块，按 kind 归组，输出 references/_generated/catalog.json。
 *
 * 消费方：① AI「页面生成决策树」选型；② 官网 showcase 目录（经同步脚本快照）。
 * 无第三方依赖：内置一个针对本项目 meta 子集（内联数组/内联对象/标量）的解析器。
 *
 * 运行：node scripts/build-catalog.mjs   （在 skills/pangea-design-vue/ 下）
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = join(__dirname, '..');
const PATTERNS_DIR = join(SKILL_ROOT, 'references', 'patterns');
const SELECTION_DIR = join(SKILL_ROOT, 'references', 'component-selection');
// 产品专属业务组件：按产品分子目录（components-business/<产品>/<组件>.md），需递归扫
const BUSINESS_DIR = join(SKILL_ROOT, 'references', 'components-business');
const OUT_DIR = join(SKILL_ROOT, 'references', '_generated');
const OUT_FILE = join(OUT_DIR, 'catalog.json');

/** 在 depth 0 处按分隔符切分（识别 [] 与 {} 嵌套） */
function splitTopLevel(s, sep) {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '[' || ch === '{') depth++;
    else if (ch === ']' || ch === '}') depth--;
    if (ch === sep && depth === 0) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur.trim() !== '') out.push(cur);
  return out;
}

function trimQuotes(v) {
  const t = v.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

/** 解析标量 / 内联数组 [a, b] / 内联对象 { k: v } */
function parseValue(raw) {
  const v = raw.trim();
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim();
    if (inner === '') return [];
    return splitTopLevel(inner, ',').map((x) => trimQuotes(x));
  }
  if (v.startsWith('{') && v.endsWith('}')) {
    const inner = v.slice(1, -1).trim();
    const obj = {};
    if (inner === '') return obj;
    for (const pair of splitTopLevel(inner, ',')) {
      const idx = pair.indexOf(':');
      if (idx === -1) continue;
      obj[pair.slice(0, idx).trim()] = trimQuotes(pair.slice(idx + 1));
    }
    return obj;
  }
  return trimQuotes(v);
}

/** 从文件文本提取 frontmatter 里的 meta 块（meta 子项统一 2 空格缩进） */
function extractMeta(text) {
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return null;
  const lines = fm[1].split(/\r?\n/);
  const start = lines.findIndex((l) => /^meta:\s*$/.test(l));
  if (start === -1) return null;
  const meta = {};
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') continue;
    if (!/^\s{2,}\S/.test(line)) break; // 缩进回到 0 → meta 块结束
    const m = line.match(/^\s{2,}([A-Za-z0-9_]+):\s?(.*)$/);
    if (m) meta[m[1]] = parseValue(m[2]);
  }
  return Object.keys(meta).length ? meta : null;
}

/** 收集目录下带 meta 的 md；recursive=true 时递归子目录（业务组件按产品分子目录） */
function collect(dir, recursive = false) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (recursive) out.push(...collect(full, true));
      continue;
    }
    if (!e.name.endsWith('.md')) continue;
    // 无 meta 块的文件（如各层 README）自然被跳过
    const meta = extractMeta(readFileSync(full, 'utf8'));
    if (!meta) continue;
    meta.doc = relative(SKILL_ROOT, full).split('\\').join('/'); // 统一正斜杠
    out.push(meta);
  }
  return out;
}

const all = [...collect(PATTERNS_DIR), ...collect(SELECTION_DIR), ...collect(BUSINESS_DIR, true)];
const pageTemplates = all.filter((m) => m.kind === 'page-template');
const components = all.filter((m) => m.kind === 'component');
// 产品专属业务组件单独成组，并按产品聚合，便于 agent「先判断产品线、再取组件」
const businessComponents = all.filter((m) => m.kind === 'business-component');
const businessProducts = [];
for (const c of businessComponents) {
  let p = businessProducts.find((x) => x.product === c.product);
  if (!p) {
    p = { product: c.product, productName: c.productName || c.product, triggers: c.triggers || [], components: [] };
    businessProducts.push(p);
  }
  p.components.push(c.id);
}

const catalog = {
  generatedAt: new Date().toISOString(),
  counts: {
    pageTemplates: pageTemplates.length,
    components: components.length,
    businessComponents: businessComponents.length,
  },
  pageTemplates,
  components,
  /** ⛔ 业务组件默认不用：仅当需求命中对应产品的 triggers 时才允许使用 */
  businessProducts,
  businessComponents,
};

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
console.log(
  `catalog.json 生成完成：页面模板 ${pageTemplates.length} 个 / 组件 ${components.length} 个 / ` +
    `业务组件 ${businessComponents.length} 个（${businessProducts.length} 个产品）→ ${relative(SKILL_ROOT, OUT_FILE)}`
);
