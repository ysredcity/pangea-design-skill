/**
 * 生成图标分类目录：src/data/icon-catalog.json
 * ------------------------------------------------------------------
 * 分类事实源 = Figma「Pangea Icons Library」的 8 个分类画布（下方 FIGMA_CATEGORIES，
 * 名称为 Figma 中的 kebab-case 图标名）。
 * 图标事实源 = 图标包 @arco-iconbox/vue-pangea-mobile 的实际导出（PascalCase `IconXxx`）。
 *
 * 做法：把两侧名称都归一化（去掉非字母数字、转小写）后比对，避免大小写/连字符差异
 * （如 Figma 的 `faceBook-circle-fill` 对应导出 `IconFacebookCircleFill`）。
 * - Figma 有、包里没有 → 报告为「未匹配」并跳过（不产生坏引用）
 * - 包里有、Figma 未分类 → 归入「其他」分类，保证 517 个图标一个不漏
 *
 * 运行：node scripts/build-icon-catalog.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PKG_ESM = resolve(ROOT, 'node_modules/@arco-iconbox/vue-pangea-mobile/esm/index.js');
const OUT = resolve(ROOT, 'src/data/icon-catalog.json');

// ── 分类（顺序即页面展示顺序），名称取自 Figma 各分类画布 ──
const FIGMA_CATEGORIES = [
  {
    key: 'general',
    title: '通用',
    names: `column-setting transaction trademark select pull-request pound percentage monitor key gold
      gateway euro dollar deployment-unit coffee cluster ci barcode usb switcher shop rocket rest
      reconciliation money-collect medicine-box hourglass flag crown contacts carry-out car build
      red-envelope folder-open shopping border project control calculator inbox security-scan
      property-safety insurance block number table shopping-cart solution audit container wallet
      credit-card laptop file-sync file-protect file-done exception cloud-server account-book
      file-search apartment alert explore bank heat-map english-fill fund chinese-fill box-plot
      face-smile-fill radar-chart face-meh-fill line-chart face-frown-fill dot-chart bar-chart
      area-chart bookmark dash calendar-clock computer layers relation palette snippets language
      diff archive form old-version issues-close dice moon-fill moon sun-fill sun wifi branch
      loading location schedule unlock email user-group dashboard compass command cloud camera
      calendar bulb user-add trophy tool thunderbolt common upload-default subscribed upload-image
      subscribe upload-zip subscribe-add upload-pdf storage upload-excel stamp upload-word skin
      upload-ppt drive-file drag-dot upload-markdown upload-txt drag-dot-vertical desktop copyright
      woman video-camera experiment ear empty var user api tags js tag jira shake global bug
      pie-chart book general file subordinates file-video reference file-image hierarchy file-pdf
      flow file-audio dev-process mosaic puzzle safe robot mobile apps gift folder folder-delete
      folder-add fire mind-mapping menu man loop lock layout interaction image image-close idcard
      robot-add qrcode pushpin public printer phone pen-fill pen notification notification-close
      nav mind-map`,
  },
  {
    key: 'edit',
    title: '编辑',
    names: `bg-colors h1 h2 h3 h4 h5 h6 h7 find-replace filter edit eraser bold ordered-list
      unordered-list font-colors formula strikethrough original-size brush align-center align-left
      align-right highlight italic line-height copy delete sort-ascending sort-descending
      oblique-line paste quote redo undo scissor zoom-in zoom-out sort underline link circular
      attachment display-inline-block display-inline display-flex display-block
      justify-space-between-row justify-space-between-column justify-space-around-row
      justify-space-around-column justify-flex-start-row justify-flex-start-column
      justify-flex-end-row justify-flex-end-column justify-center-row justify-center-column
      direction-row-reverse direction-row direction-column-reverse direction-column
      align-stretch-row align-stretch-column align-flex-start-row align-flex-start-column
      align-flex-end-row align-flex-end-column align-center-row align-center-column
      align-baseline-row align-baseline-column card-view border-bottom border-horizontal
      border-outer border-left border-top border-inner vertical-align-middle border-verticle
      border-right pic-left pic-right radius-upleft radius-upright radius-bottomleft
      radius-bottomright column-height column-width font-size radius-setting`,
  },
  {
    key: 'direction',
    title: '方向',
    names: `double-left double-up double-right double-down expand shrink right left down up
      menu-fold menu-unfold rotate-left rotate-right drag-arrow left-circle up-circle right-circle
      down-circle up-circle-fill down-circle-fill left-circle-fill right-circle-fill swap to-bottom
      to-left to-right to-top caret-down caret-left caret-right caret-up arrow-fall arrow-rise
      arrow-down arrow-left arrow-right arrow-up arrow-multiple multiple right-square up-square
      down-square left-square`,
  },
  {
    key: 'media',
    title: '影音',
    names: `music backward forward fullscreen-exit fullscreen live-broadcast play-arrow
      play-arrow-fill pause skip-next skip-next-fill skip-previous skip-previous-fill sound
      sound-fill mute mute-fill play-circle play-circle-fill pause-circle pause-circle-fill
      record-stop stop-independent record`,
  },
  {
    key: 'interaction',
    title: '交互',
    names: `star star-fill heart heart-fill thumb-down thumb-down-fill thumb-up thumb-up-fill at
      cloud-download cloud-upload cloud-sync code-block code-square code customer-service home
      import list message message-add message-banned more more-vertical poweroff refresh reply scan
      search select-all select-area settings share-alt share-external share-internal send send-fill
      download export translate sync upload voice eye eye-invisible save history launch keyboard
      enter add-child move user-delete usergroup-add usergroup-delete disconnect cast-screen`,
  },
  {
    key: 'tip',
    title: '提示',
    names: `exclamation-circle exclamation-circle-fill exclamation-polygon-fill exclamation
      info-circle info-circle-fill info minus-circle minus-circle-fill minus minus-square
      plus-circle plus-circle-fill plus plus-square question-circle question-circle-fill question
      check-circle check-circle-fill check check-square clock-circle close-circle close-circle-fill
      close close-square stop warning`,
  },
  {
    key: 'brand',
    title: '商标',
    names: `pangea hisense hichat lark-color tiktok-color xigua-color faceBook-circle-fill
      facebook-square-fill facebook google-circle-fill google google-plus qq-circle-fill qq qq-zone
      twitter-circle-fill twitter weibo-circle-fill weibo alipay-circle wechat wechatpay
      code-sandbox codepen github gitlab android windows ie chrome aliwangwang dingding taobao
      html5 youtube skype medium medium-workmark linkedin dropbox amazon ant-design ant-cloud
      aliyun zhihu slack slack-square behance behance-square dribbble dribbble-square instagram
      yuque alibaba yahoo reddit sketch`,
  },
  {
    key: 'ai',
    title: 'AI',
    names: `ai-assistant ai-assistant-fill search-ai edit-ai book-ai code-ai global-ai folder-ai
      image-ai file-ai audio-ai video-ai question-ai academic-ai summary-ai mcp`,
  },
];

// ── 归一化：去掉所有非字母数字并转小写 ──
const norm = (s) => s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

// ── 读取图标包实际导出 ──
const esm = readFileSync(PKG_ESM, 'utf8');
const exportNames = [...esm.matchAll(/export\s*\{\s*default as (Icon[A-Za-z0-9]+)\s*\}/g)].map(
  (m) => m[1],
);
if (exportNames.length === 0) {
  console.error('✗ 未从图标包解析到任何导出，请检查包路径/版本：' + PKG_ESM);
  process.exit(1);
}

// 归一化后的导出查找表：normKey -> IconXxx
const byNorm = new Map();
for (const name of exportNames) {
  byNorm.set(norm(name.slice(4)), name); // 去掉前缀 Icon
}

const used = new Set();
const missing = [];
const categories = [];

for (const cat of FIGMA_CATEGORIES) {
  const kebabs = cat.names.split(/\s+/).map((s) => s.trim()).filter(Boolean);
  const icons = [];
  const seen = new Set();

  for (const kebab of kebabs) {
    const key = norm(kebab);
    if (seen.has(key)) continue; // 同分类内去重
    seen.add(key);

    const component = byNorm.get(key);
    if (!component) {
      missing.push(`${cat.title}/${kebab}`);
      continue;
    }
    if (used.has(component)) continue; // 跨分类去重，先出现的分类保留
    used.add(component);
    icons.push({ name: kebab, component });
  }

  categories.push({ key: cat.key, title: cat.title, icons });
}

// ── 包里有但 Figma 未分类的 → 归入「其他」，保证不漏 ──
const rest = exportNames
  .filter((n) => !used.has(n))
  .sort()
  .map((component) => ({
    // 由 PascalCase 反推 kebab-case 展示名
    name: component
      .slice(4)
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
      .toLowerCase(),
    component,
  }));
if (rest.length) categories.push({ key: 'other', title: '其他', icons: rest });

const total = categories.reduce((s, c) => s + c.icons.length, 0);
const payload = {
  $meta: {
    generatedBy: 'scripts/build-icon-catalog.mjs',
    iconPackage: '@arco-iconbox/vue-pangea-mobile',
    categorySource: 'Figma · Pangea Icons Library',
    totalExports: exportNames.length,
    totalListed: total,
  },
  categories,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n', 'utf8');

// ── 报告 ──
console.log(`图标包导出：${exportNames.length} 个`);
for (const c of categories) console.log(`  ${c.title.padEnd(4, '　')} ${String(c.icons.length).padStart(4)}`);
console.log(`合计收录：${total} / ${exportNames.length}`);
if (missing.length) {
  console.log(`\nⓘ Figma 有但图标包中不存在（已跳过，${missing.length} 个）：`);
  console.log('  ' + missing.join(', '));
}
if (total !== exportNames.length) {
  console.error(`\n✗ 收录数与导出数不一致，请检查生成逻辑`);
  process.exit(1);
}
console.log(`\n✓ 已生成 src/data/icon-catalog.json`);
