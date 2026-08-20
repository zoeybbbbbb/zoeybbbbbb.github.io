# Zoey's Art Gallery

Zoey 的作品集，Astro + React + Tailwind，部署在 GitHub Pages：
**https://zoeybbbbbb.github.io**

## 加新作品

把图片/视频放进 `public/gallery/<分类名>/`，**文件夹名就是网站上的分类按钮，文件名就是作品标题**，不需要改任何代码或配置。

```bash
mkdir -p "public/gallery/2026下半年"
cp ~/新照片/*.png "public/gallery/2026下半年/"

npm run thumbs      # 生成缩略图（只处理新增的，已有的会跳过）
git add -A && git commit -m "add: 2026下半年" && git push
```

push 到 `main` 后 GitHub Actions 自动构建部署，约一两分钟生效。

支持的格式：图片 `.jpg .jpeg .png .gif .webp`，视频 `.mp4 .webm .mov`。空文件夹会被忽略。

## 为什么要跑 `npm run thumbs`

原图是相机/扫描件，动辄 5-8MB。如果网格直接用原图当缩略图，访客打开作品集页就得先下几十 MB。

所以每张图有两份，各司其职（就是微信看图的逻辑）：

| 路径 | 用途 | 大小 |
| :--- | :--- | :--- |
| `public/gallery/<分类>/` | Lightbox 全屏看的原图 | 原始大小 |
| `public/thumbs/<分类>/` | 网格缩略图，长边 1000px JPEG | 约 1/50 |

`public/gallery/` 是唯一数据源，`public/thumbs/` 纯粹是 `scripts/generate-thumbs.py` 的生成物。
点开大图时先显示已缓存的缩略图（模糊），原图加载完再淡入替换。

缩略图会一起提交进 git（很小），这样 GitHub Actions 无需安装任何图片库。
忘了跑 `npm run thumbs` 也不会坏 —— 缺缩略图的图会自动回退用原图，只是加载慢些。

## 本地开发

```bash
npm install         # 若报 peer 依赖冲突，用 npm run install:force
npm run dev         # http://localhost:4321
npm run build       # 产物到 ./dist/（会自动先跑 thumbs）
npm run preview     # 预览 dist/，与线上一致
```

需要 Node >= 22.12。`npm run thumbs` 需要 Python 的 Pillow（`pip install Pillow`）。

注意：`scanGallery()` 在**构建时**用 `fs` 扫描文件夹，所以往 `public/gallery/` 加了新图之后，
要重启 dev server 才能看到。

## 结构

```
public/gallery/<分类>/     作品原图（唯一数据源，往这里丢文件）
public/thumbs/<分类>/      缩略图（npm run thumbs 生成）
scripts/generate-thumbs.py 缩略图生成器，增量执行
src/utils/gallery.ts       构建时扫描 gallery/，产出作品列表
src/components/
  GalleryGrid.tsx          分类筛选 + 缩略图网格
  Lightbox.tsx             全屏查看，支持 ← → Esc
src/pages/
  index.astro              首页
  gallery/index.astro      作品集页
.github/workflows/deploy.yml   push 到 main 即自动部署
```

GitHub 仓库的 Settings → Pages → Source 必须设为 **GitHub Actions**。
