#!/usr/bin/env bash
#
# 把 skill 打成可上传平台（飞书 aily / 妙搭 等）的 zip。
#
# 用法：
#   ./scripts/pack-skill.sh              # 版本号自动取 CHANGELOG.md 最新已发布版本
#   ./scripts/pack-skill.sh 1.2.1        # 手动指定版本号
#
# 产物：releases/pangea-design-vue_<版本>.zip（releases/ 已 gitignore，不入库）
#
# ⚠️ 关键：打的是【工作区当前状态】，不是 git HEAD。
#    新增但未提交的文件（如新写的 references 文档、.env）必须进包，
#    用 `git archive HEAD` 会静默漏掉它们、打出旧版本内容。
#    这里用 `git ls-files --cached --others --exclude-standard`：
#    = 已跟踪 + 新增未忽略的文件，且自动遵守 .gitignore（node_modules / dist / .DS_Store 等被排除）。

set -euo pipefail

SKILL_NAME="pangea-design-vue"

# —— 定位仓库根，允许从任意目录调用 ——
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# —— 版本号：参数优先，否则取 CHANGELOG 里第一个形如 ## [x.y.z] 的版本 ——
if [[ $# -ge 1 ]]; then
  VERSION="$1"
else
  VERSION="$(grep -m1 -oE '^## \[[0-9]+\.[0-9]+\.[0-9]+\]' CHANGELOG.md | tr -d '#[] ')"
fi

if [[ -z "${VERSION:-}" ]]; then
  echo "✗ 无法确定版本号：CHANGELOG.md 未找到 '## [x.y.z]'，请手动传入，如 ./scripts/pack-skill.sh 1.2.0" >&2
  exit 1
fi

OUT_DIR="$REPO_ROOT/releases"
OUT="$OUT_DIR/${SKILL_NAME}_${VERSION}.zip"
mkdir -p "$OUT_DIR"

echo "▸ 打包 $SKILL_NAME v$VERSION"

# —— 提示未提交改动（打包用工作区状态，属预期行为，仅告知）——
if ! git diff --quiet -- "skills/$SKILL_NAME" || \
   [[ -n "$(git ls-files --others --exclude-standard "skills/$SKILL_NAME")" ]]; then
  echo "  ⓘ skill 存在未提交改动，将按【工作区当前状态】打包（这是预期行为）"
fi

[[ -f "$OUT" ]] && echo "  ⓘ 覆盖已存在的 $(basename "$OUT")"
rm -f "$OUT"

# —— 收集文件并打包（从 skills/ 下执行，使包内根目录为 <SKILL_NAME>/）——
FILE_LIST="$(mktemp)"
trap 'rm -f "$FILE_LIST"' EXIT

cd "$REPO_ROOT/skills"
# ⚠️ 必须过滤「索引里还在、但工作区已删且未暂存」的条目：
#    git ls-files --cached 读的是 index，删文件后若没 `git add`，它仍会被列出，
#    结果是 zip 静默跳过（-q 把 "name not matched" 警告也吞了）、而文件数按列表算 → 报告数虚高。
git ls-files --cached --others --exclude-standard "$SKILL_NAME" \
  | while IFS= read -r f; do [[ -f "$f" ]] && printf '%s\n' "$f"; done > "$FILE_LIST"
COUNT="$(wc -l < "$FILE_LIST" | tr -d ' ')"

if [[ "$COUNT" -eq 0 ]]; then
  echo "✗ 没有收集到任何文件，请检查 skills/$SKILL_NAME 是否存在" >&2
  exit 1
fi

# -X 不写入额外的时间戳/属性，产物更干净稳定
zip -q -X "$OUT" -@ < "$FILE_LIST"
cd "$REPO_ROOT"

# —— 入包条目数必须与待打包列表一致，否则说明有文件被静默跳过 ——
ZIP_COUNT="$(unzip -Z1 "$OUT" | wc -l | tr -d ' ')"
if [[ "$ZIP_COUNT" -ne "$COUNT" ]]; then
  echo "✗ 入包条目数不符：待打包 $COUNT，实际入包 $ZIP_COUNT（有文件被跳过）" >&2
  exit 1
fi

# —— 自检：该进的必须在，不该进的必须没有 ——
echo "▸ 自检包内容"
FAILED=0

MUST_HAVE=(
  "$SKILL_NAME/SKILL.md"
  "$SKILL_NAME/references/overview/project-structure.md"
  "$SKILL_NAME/references/overview/quality-gates.md"
  "$SKILL_NAME/references/overview/requirement-intake.md"
  "$SKILL_NAME/references/overview/deployment.md"
  "$SKILL_NAME/references/_generated/catalog.json"
  # 产品专属业务组件（这一层是新增未提交文件的高发区，务必自检）
  "$SKILL_NAME/references/components-business/README.md"
  "$SKILL_NAME/references/components-business/msc/attachment-upload.md"
  "$SKILL_NAME/templates/project-starter/src/components/msc/MscAttachmentUpload.vue"
  "$SKILL_NAME/templates/project-starter/package.json"
  "$SKILL_NAME/templates/project-starter/vite.config.ts"
  "$SKILL_NAME/templates/project-starter/.env"
  "$SKILL_NAME/templates/project-starter/.env.embed"
  "$SKILL_NAME/templates/project-starter/src/config/app.ts"
  "$SKILL_NAME/templates/project-starter/src/layouts/GlobalLayout.vue"
)

ENTRIES="$(unzip -Z1 "$OUT")"

for f in "${MUST_HAVE[@]}"; do
  if ! grep -qxF "$f" <<< "$ENTRIES"; then
    echo "  ✗ 缺失：$f"
    FAILED=1
  fi
done

# 不该出现的内容（构建产物 / 本地测试用例 / 系统垃圾文件）
for pattern in "node_modules" "/dist/" ".DS_Store" "_tests"; do
  n="$(grep -cF "$pattern" <<< "$ENTRIES" || true)"
  if [[ "$n" -ne 0 ]]; then
    echo "  ✗ 不该包含 $pattern（$n 处）"
    FAILED=1
  fi
done

if [[ "$FAILED" -ne 0 ]]; then
  echo "✗ 自检未通过，已保留产物供排查：$OUT" >&2
  exit 1
fi

SIZE="$(du -h "$OUT" | cut -f1 | tr -d ' ')"
echo "  ✓ 必需文件齐全；无 node_modules / dist / .DS_Store / _tests"
echo ""
echo "✓ 完成：releases/$(basename "$OUT")（${SIZE}，${COUNT} 个文件）"
echo "  包内根目录为 ${SKILL_NAME}/，可直接上传平台。"
