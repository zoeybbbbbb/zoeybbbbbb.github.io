import { useState } from 'react';
import Lightbox from './Lightbox';

interface Artwork {
  title: string;
  src: string;
  thumb: string;
  type: 'image' | 'video';
  category: string;
}

interface Category {
  name: string;
  count: number;
}

interface GalleryGridProps {
  artworks: Artwork[];
  categories: Category[];
}

export default function GalleryGrid({ artworks, categories }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categoryNames = ['全部', ...categories.map(c => c.name)];

  const filteredArtworks = selectedCategory === '全部'
    ? artworks
    : artworks.filter(art => art.category === selectedCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const navigateLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {categoryNames.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedCategory === cat
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
            }`}
          >
            {cat}
            {cat !== '全部' && ` (${categories.find(c => c.name === cat)?.count || 0})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredArtworks.map((artwork, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => openLightbox(index)}
          >
            {artwork.type === 'video' ? (
              <video
                src={artwork.src}
                className="w-full h-full object-cover"
                muted
                playsInline
                onMouseOver={e => e.currentTarget.play()}
                onMouseOut={e => {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 0;
                }}
              />
            ) : (
              <img
                src={artwork.thumb}
                alt={artwork.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400 text-sm p-4 text-center">${artwork.title}</div>`;
                }}
              />
            )}
          </div>
        ))}
      </div>

      {filteredArtworks.length === 0 && (
        <p className="text-gray-500 text-center py-12">该分类下暂无作品</p>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          artwork={filteredArtworks[lightboxIndex]}
          artworks={filteredArtworks}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      )}
    </div>
  );
}
