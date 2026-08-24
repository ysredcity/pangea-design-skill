#!/usr/bin/env python3
"""
shoot_templates.py —— 生成「页面模板」列表页的卡片缩略图
==================================================================
产出：website/src/assets/template-shots/<模板 id>.jpg（JPEG q85，2x 像素密度）
这些图**提交入库**，所以官网构建 / 部署完全不需要 playwright。

为什么是 Python 而不是 Node：
  本仓库 website 的 devDependencies 里没有 playwright，加进去会让 Cloudflare
  等部署环境每次 `npm install` 都下载 ~150MB 浏览器。截图只有维护者在
  「模板 UI 变了」时才需要跑一次，所以用机器上已有的 Python playwright，
  npm 侧只留一个 `npm run shoot:templates` 包装，不动依赖。

前置条件（一次性）：
    pip install playwright pillow && playwright install chromium

用法：
    # 另开一个终端先跑 dev server（或 vite preview）
    npm run dev -- --port 5188
    # 然后
    npm run shoot:templates                 # 默认 http://localhost:5173
    SITE=http://localhost:5188 npm run shoot:templates

关键实现点：
  · 预览路由是**挂在官网 GlobalLayout 下的子路由**，整页截图会把官网自己的
    header / sidebar 拍进去 → 只截 `.pg-layout__content` 这个元素。
  · 「对话框表单」没有独立页面：它在简单列表页点「创建」弹出 →
    先点开，再**只截 `.arco-modal`** 本身。
"""
import os
import sys
import glob
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sys.exit("✗ 缺少 playwright：pip install playwright && playwright install chromium")

BASE = os.environ.get("SITE", "http://localhost:5173").rstrip("/")
OUT_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "template-shots"
VIEWPORT = {"width": 1440, "height": 900}
QUALITY = 85
# 卡片列宽约 309px，2x 即 ~620 → 缩到 640 宽足够清晰；不缩的话 2x 原图是 2480 宽、合计 1.6MB
THUMB_W = 640
THUMB_RATIO = (16, 10)  # 与卡片 aspect-ratio 一致，先按比例裁再缩，避免 CSS cover 二次裁切失控

# 顺序 = 列表页展示顺序（列表 → 表单 → 详情 → 审批 → 仪表板），与 Templates/index.vue 的 ORDER 一致
# kind : "content" 截内容区 / "modal" 先点开对话框再只截对话框
# pre_click: 可选，截图前先点一下（用于默认态不适合当缩略图的页面）
# ready: **该页独有**的根类名。⚠️ 不能等 `.pg-layout__content`——它在所有路由下都存在，
#        毫无区分度；曾因此把探活时打开的首页当成「简单列表页」拍了下来。
TARGETS = [
    {"id": "page-simple-list", "route": "/templates/simple-list", "kind": "content", "ready": ".pg-simple-list"},
    {"id": "page-filter-list", "route": "/templates/filter-list", "kind": "content", "ready": ".pg-filter-list"},
    {"id": "page-card-list", "route": "/templates/card-list", "kind": "content", "ready": ".pg-card-list"},
    # 左树右表默认未选主数据、右侧是空状态引导 → 先点一个树节点，缩略图才体现「左树+右表」
    {"id": "page-tree-table", "route": "/templates/tree-table", "kind": "content",
     "ready": ".pg-tree-table", "pre_click": ".arco-tree-node-title"},
    {"id": "page-modal-form", "route": "/templates/simple-list", "kind": "modal", "ready": ".pg-simple-list", "trigger": "创建"},
    {"id": "page-form", "route": "/templates/basic-form", "kind": "content", "ready": ".pg-form-page"},
    {"id": "page-grouped-form", "route": "/templates/grouped-form", "kind": "content", "ready": ".pg-grouped-form"},
    {"id": "page-step-form", "route": "/templates/step-form", "kind": "content", "ready": ".pg-step-form"},
    {"id": "page-detail", "route": "/templates/detail", "kind": "content", "ready": ".pg-detail"},
    {"id": "page-approval-detail", "route": "/templates/approval-detail", "kind": "content", "ready": ".pg-approval"},
    {"id": "dashboard", "route": "/templates/dashboard", "kind": "content", "ready": ".pg-dash"},
]


def launch(p):
    """优先用默认 chromium；装的是 headless-shell 时回退到缓存里的可执行文件。"""
    try:
        return p.chromium.launch()
    except Exception:
        exe = os.environ.get("PW_CHROMIUM_PATH") or next(
            iter(
                sorted(
                    glob.glob(
                        os.path.expanduser(
                            "~/Library/Caches/ms-playwright/chromium_headless_shell-*/"
                            "chrome-headless-shell-*/chrome-headless-shell"
                        )
                    )
                    + sorted(
                        glob.glob(
                            os.path.expanduser(
                                "~/.cache/ms-playwright/chromium_headless_shell-*/"
                                "chrome-headless-shell-*/chrome-headless-shell"
                            )
                        )
                    ),
                    reverse=True,
                )
            ),
            None,
        )
        if not exe:
            sys.exit("✗ 找不到 chromium：先跑 `playwright install chromium`，或用 PW_CHROMIUM_PATH 指定")
        return p.chromium.launch(executable_path=exe)


def to_thumb(path: Path) -> None:
    """按 16:10 从顶部裁切 + 缩到 THUMB_W 宽 + 重存 JPEG。

    从**顶部**裁：页面的信息密度集中在上半部分（页头、操作栏、表格前几行），
    居中裁会把页头切掉、缩略图认不出是哪个模板。
    """
    from PIL import Image

    with Image.open(path) as im:
        im = im.convert("RGB")
        w, h = im.size
        target_h = round(w * THUMB_RATIO[1] / THUMB_RATIO[0])
        if target_h <= h:
            im = im.crop((0, 0, w, target_h))          # 高了 → 从顶部裁
        else:
            target_w = round(h * THUMB_RATIO[0] / THUMB_RATIO[1])
            left = (w - target_w) // 2
            im = im.crop((left, 0, left + target_w, h))  # 窄了（如对话框）→ 水平居中裁
        im = im.resize((THUMB_W, round(THUMB_W * THUMB_RATIO[1] / THUMB_RATIO[0])), Image.LANCZOS)
        im.save(path, "JPEG", quality=QUALITY, optimize=True, progressive=True)


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    failed, rows = [], []

    with sync_playwright() as p:
        browser = launch(p)
        page = browser.new_page(viewport=VIEWPORT, device_scale_factor=2)

        # 先探活，避免 9 次超时
        try:
            page.goto(BASE + "/", wait_until="domcontentloaded", timeout=8000)
        except Exception:
            browser.close()
            sys.exit(f"✗ 打不开 {BASE}\n  请先启动 dev server，或用 SITE=<url> 指定端口")

        for t in TARGETS:
            url = f"{BASE}/#{t['route']}"
            out = OUT_DIR / f"{t['id']}.jpg"
            try:
                # 只改 hash 时浏览器不会重新加载文档，Playwright 的 goto 会立刻 resolve、
                # networkidle 也早已满足 → 必须 reload 一次，让等待真正等到这一页渲染完。
                page.goto(url, wait_until="domcontentloaded")
                page.reload(wait_until="networkidle")
                page.wait_for_selector(t["ready"], timeout=15000)  # 该页独有的根类名
                # 图表 / 表格渲染留出时间；仪表板等 canvas 出现
                page.wait_for_timeout(1200)
                if t["id"] == "dashboard":
                    try:
                        page.wait_for_selector(".pg-lazy-chart canvas", timeout=8000)
                        page.wait_for_timeout(600)
                    except Exception:
                        pass  # 没装图表库时是占位图，也照样截

                # 某些页面的默认态不适合当缩略图（如左树右表未选主数据时右侧是空状态）
                if t.get("pre_click"):
                    page.click(t["pre_click"])
                    page.wait_for_timeout(900)

                if t["kind"] == "modal":
                    page.click(f"button:has-text('{t['trigger']}')")
                    page.wait_for_selector(".arco-modal", state="visible", timeout=8000)
                    page.wait_for_timeout(700)  # 等入场动画结束，否则会拍到半透明
                    target = page.locator(".arco-modal").first
                else:
                    target = page.locator(".pg-layout__content").first

                target.screenshot(path=str(out), type="jpeg", quality=QUALITY)
                to_thumb(out)
                rows.append((t["id"], f"{out.stat().st_size / 1024:.0f}KB"))
            except Exception as e:  # 单个失败不影响其余
                failed.append((t["id"], str(e).split("\n")[0]))

        browser.close()

    for tid, size in rows:
        print(f"  ✓ {tid:<22} {size}")
    for tid, err in failed:
        print(f"  ✗ {tid:<22} {err}")

    total = sum(f.stat().st_size for f in OUT_DIR.glob("*.jpg")) / 1024
    print(f"\n{'✓' if not failed else '✗'} 共 {len(rows)}/{len(TARGETS)} 张，合计 {total:.0f}KB → {OUT_DIR}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
