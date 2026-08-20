import fs from 'node:fs';
import path from 'node:path';

const GALLERY_DIR = 'public/gallery';
const THUMB_DIR = 'public/thumbs';

const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const VIDEO_EXT = ['.mp4', '.webm', '.mov'];

export interface Artwork {
  title: string;
  /** 原图，Lightbox 全屏用 */
  src: string;
  /** 缩略图，网格用；没生成过则回退到原图 */
  thumb: string;
  type: 'image' | 'video';
  category: string;
}

export interface Category {
  name: string;
  count: number;
}

export function scanGallery(): { categories: Category[]; artworks: Artwork[] } {
  const galleryPath = path.join(process.cwd(), GALLERY_DIR);
  
  if (!fs.existsSync(galleryPath)) {
    return { categories: [], artworks: [] };
  }

  const categories: Category[] = [];
  const artworks: Artwork[] = [];

  const dirs = fs.readdirSync(galleryPath, { withFileTypes: true });
  
  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;
    
    const categoryName = dir.name;
    const categoryPath = path.join(galleryPath, categoryName);
    const files = fs.readdirSync(categoryPath);
    
    let count = 0;
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (![...IMAGE_EXT, ...VIDEO_EXT].includes(ext)) {
        continue;
      }

      const title = path.basename(file, ext);
      const src = `/gallery/${categoryName}/${file}`;
      const type: 'image' | 'video' = VIDEO_EXT.includes(ext) ? 'video' : 'image';

      // 缩略图由 scripts/generate-thumbs.py 生成，统一为 .jpg。
      // 视频没有缩略图（网格里直接用 <video>），缺失时一律回退到原图。
      let thumb = src;
      if (type === 'image') {
        const thumbSrc = `/thumbs/${categoryName}/${title}.jpg`;
        if (fs.existsSync(path.join(process.cwd(), THUMB_DIR, categoryName, `${title}.jpg`))) {
          thumb = thumbSrc;
        }
      }

      artworks.push({ title, src, thumb, type, category: categoryName });
      count++;
    }
    
    if (count > 0) {
      categories.push({ name: categoryName, count });
    }
  }

  return { categories, artworks };
}
