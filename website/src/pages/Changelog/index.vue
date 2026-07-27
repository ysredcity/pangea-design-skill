<script setup lang="ts">
/**
 * 更新日志 Changelog
 * 渲染同步自仓库根 CHANGELOG.md 的内容（?raw 导入 + 轻量 Markdown 渲染，无第三方依赖）。
 * 内容为仓库自有、可信；渲染前统一转义 HTML，再套用 **加粗** 与 `代码` 内联样式。
 */
import { computed } from 'vue';
import raw from '@/generated/CHANGELOG.md?raw';

type Block =
  | { type: 'h1' | 'h2' | 'h3' | 'p' | 'note'; html: string }
  | { type: 'hr' }
  | { type: 'ul'; items: { html: string; level: number }[] };

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function inline(s: string): string {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

const blocks = computed<Block[]>(() => {
  const out: Block[] = [];
  let list: { html: string; level: number }[] | null = null;
  const flush = () => {
    if (list) {
      out.push({ type: 'ul', items: list });
      list = null;
    }
  };
  for (const line of raw.split(/\r?\n/)) {
    if (/^#\s+/.test(line)) {
      flush();
      out.push({ type: 'h1', html: inline(line.replace(/^#\s+/, '')) });
    } else if (/^##\s+/.test(line)) {
      flush();
      out.push({ type: 'h2', html: inline(line.replace(/^##\s+/, '')) });
    } else if (/^###\s+/.test(line)) {
      flush();
      out.push({ type: 'h3', html: inline(line.replace(/^###\s+/, '')) });
    } else if (/^\s*[-*]\s+/.test(line)) {
      const indent = (line.match(/^(\s*)/)?.[1].length ?? 0);
      const text = line.replace(/^\s*[-*]\s+/, '');
      (list ||= []).push({ html: inline(text), level: Math.floor(indent / 2) });
    } else if (/^>\s?/.test(line)) {
      flush();
      out.push({ type: 'note', html: inline(line.replace(/^>\s?/, '')) });
    } else if (/^---+\s*$/.test(line)) {
      flush();
      out.push({ type: 'hr' });
    } else if (line.trim() === '') {
      flush();
    } else {
      flush();
      out.push({ type: 'p', html: inline(line) });
    }
  }
  flush();
  return out;
});
</script>

<template>
  <div class="pg-log">
    <div class="pg-log__inner">
      <template v-for="(b, i) in blocks" :key="i">
        <hr v-if="b.type === 'hr'" class="pg-log__hr" />
        <h1 v-else-if="b.type === 'h1'" class="pg-log__h1" v-html="b.html" />
        <h2 v-else-if="b.type === 'h2'" class="pg-log__h2" v-html="b.html" />
        <h3 v-else-if="b.type === 'h3'" class="pg-log__h3" v-html="b.html" />
        <p v-else-if="b.type === 'note'" class="pg-log__note" v-html="b.html" />
        <ul v-else-if="b.type === 'ul'" class="pg-log__ul">
          <li
            v-for="(it, j) in b.items"
            :key="j"
            :style="{ marginLeft: it.level * 16 + 'px' }"
            v-html="it.html"
          />
        </ul>
        <p v-else class="pg-log__p" v-html="b.html" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.pg-log {
  background: var(--color-bg-1);
  min-height: 100%;
}

.pg-log__inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 32px 56px;
}

.pg-log__h1 {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-1);
}

.pg-log__h2 {
  margin: 32px 0 8px;
  padding-bottom: 8px;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-1);
  border-bottom: 1px solid var(--color-border-2);
}

.pg-log__h3 {
  margin: 20px 0 6px;
  font-size: 15px;
  font-weight: 600;
  color: rgb(var(--primary-6));
}

.pg-log__p {
  margin: 8px 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-log__note {
  margin: 8px 0;
  padding: 8px 12px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-3);
  background: var(--color-fill-1);
  border-radius: var(--border-radius-medium);
}

.pg-log__ul {
  margin: 8px 0;
  padding-left: 20px;
}

.pg-log__ul li {
  margin-bottom: 6px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-2);
}

.pg-log__hr {
  margin: 24px 0;
  border: none;
  border-top: 1px solid var(--color-border-2);
}

.pg-log__inner :deep(code) {
  padding: 1px 6px;
  font-size: 13px;
  background: var(--color-fill-2);
  border-radius: var(--border-radius-small);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.pg-log__inner :deep(strong) {
  color: var(--color-text-1);
}

.pg-log__inner :deep(a) {
  color: rgb(var(--primary-6));
}
</style>
