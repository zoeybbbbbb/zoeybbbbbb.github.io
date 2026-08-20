#!/usr/bin/env python3
"""为 public/gallery/ 下的图片生成缩略图到 public/thumbs/。

设计原则：public/gallery/ 是唯一数据源，缩略图是纯生成物。
网格用缩略图（快），Lightbox 全屏用原图（清晰）——即微信的浏览体验。

增量执行：缩略图比原图新就跳过，所以重复运行几乎零成本。
生成结果会提交进 git，因此 CI 上这一步是空操作，无需安装图片库。

用法：npm run thumbs
"""

import sys
from pathlib import Path

GALLERY_DIR = Path("public/gallery")
THUMB_DIR = Path("public/thumbs")

# 与 src/utils/gallery.ts 的 IMAGE_EXT 保持一致
IMAGE_EXT = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

MAX_SIZE = 1000  # 长边上限；网格格子最大约 300px，2x 高清屏够用
QUALITY = 82


def main() -> int:
    try:
        from PIL import Image
    except ImportError:
        # 缩略图已提交进 git，CI 上跑到这里无事可做，不该让构建失败
        print("⚠  未安装 Pillow，跳过缩略图生成（已有的缩略图仍然可用）")
        print("   如需生成： pip install Pillow")
        return 0

    if not GALLERY_DIR.is_dir():
        print(f"⚠  找不到 {GALLERY_DIR}/，跳过")
        return 0

    made = skipped = failed = 0
    src_bytes = out_bytes = 0

    for category in sorted(p for p in GALLERY_DIR.iterdir() if p.is_dir()):
        for src in sorted(category.iterdir()):
            if src.suffix.lower() not in IMAGE_EXT or not src.is_file():
                continue

            dest = THUMB_DIR / category.name / f"{src.stem}.jpg"

            # 增量：缩略图比原图新就跳过
            if dest.exists() and dest.stat().st_mtime >= src.stat().st_mtime:
                skipped += 1
                continue

            try:
                with Image.open(src) as im:
                    im = im.convert("RGB")
                    im.thumbnail((MAX_SIZE, MAX_SIZE), Image.LANCZOS)
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    im.save(dest, "JPEG", quality=QUALITY,
                            optimize=True, progressive=True)
            except Exception as exc:
                print(f"✗ {src}: {exc}")
                failed += 1
                continue

            s, o = src.stat().st_size, dest.stat().st_size
            src_bytes += s
            out_bytes += o
            made += 1
            print(f"✓ {category.name}/{src.name}"
                  f"  {s / 1048576:.1f}MB → {o / 1024:.0f}KB")

    parts = [f"生成 {made}"]
    if skipped:
        parts.append(f"跳过 {skipped}")
    if failed:
        parts.append(f"失败 {failed}")
    print(f"\n缩略图：{'，'.join(parts)}")

    if made:
        print(f"体积：{src_bytes / 1048576:.1f}MB → {out_bytes / 1048576:.2f}MB"
              f"（缩小 {src_bytes / out_bytes:.0f}倍）")

    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
