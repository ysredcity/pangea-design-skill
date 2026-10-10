#!/usr/bin/env node
/**
 * sync-shared.mjs —— 把仓库 shared/ 下的共享正文同步到各 skill
 * ------------------------------------------------------------------
 * 共享正文只在 shared/ 维护一份；每个 skill 随包带一份副本，保证各自能独立上传平台。
 * 副本在 frontmatter 之后插入一行「生成物」注释，其余内容与源文件逐字一致。
 *
 * 用法：
 *   node scripts/sync-shared.mjs           写入副本
 *   node scripts/sync-shared.mjs --check   只校验副本是否与源一致（不一致退出码 1）
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');

/** 源文件 → 目标副本（相对仓库根） */
const MAPPINGS = [
  {
    source: 'shared/design-core.md',
    targets: [
      'skills/pangea-design-universal/references/design-core.md',
      'skills/pangea-design-vue/references/design-core.md',
    ],
  },
];

function render(sourceRel, content) {
  const note = `<!-- 本文件为生成物，请勿直接修改。 -->`;
  const m = content.match(/^---\n[\s\S]*?\n---\n/);
  return m ? `${m[0]}\n${note}\n${content.slice(m[0].length)}` : `${note}\n\n${content}`;
}

let stale = 0;
let written = 0;
for (const { source, targets } of MAPPINGS) {
  const src = join(ROOT, source);
  if (!existsSync(src)) {
    console.error(`✗ 缺少源文件 ${source}`);
    process.exit(1);
  }
  const expected = render(source, readFileSync(src, 'utf8'));
  for (const target of targets) {
    const dst = join(ROOT, target);
    const same = existsSync(dst) && readFileSync(dst, 'utf8') === expected;
    if (CHECK) {
      if (!same) {
        console.error(`✗ 副本与源不一致：${target}（源 ${source}）`);
        stale++;
      }
    } else if (!same) {
      mkdirSync(dirname(dst), { recursive: true });
      writeFileSync(dst, expected, 'utf8');
      console.log(`✓ ${relative(ROOT, dst)}`);
      written++;
    }
  }
}

if (CHECK) {
  if (stale) {
    console.error('  运行 node scripts/sync-shared.mjs 重新同步');
    process.exit(1);
  }
  console.log('✓ 共享副本全部与源一致');
} else {
  console.log(written ? `同步完成：${written} 个副本已更新` : '✓ 共享副本已是最新');
}
