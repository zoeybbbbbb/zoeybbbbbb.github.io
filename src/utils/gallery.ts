import fs from 'node:fs';
import path from 'node:path';

const GALLERY_DIR = 'public/gallery';

export interface Artwork {
  title: string;
  src: string;
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
      if (!['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.mov'].includes(ext)) {
        continue;
      }
      
      const title = path.basename(file, ext);
      const src = `/gallery/${categoryName}/${file}`;
      const type: 'image' | 'video' = ['.mp4', '.webm', '.mov'].includes(ext) ? 'video' : 'image';
      
      artworks.push({ title, src, type, category: categoryName });
      count++;
    }
    
    if (count > 0) {
      categories.push({ name: categoryName, count });
    }
  }

  return { categories, artworks };
}

export function getGalleryStructure() {
  return scanGallery();
}
