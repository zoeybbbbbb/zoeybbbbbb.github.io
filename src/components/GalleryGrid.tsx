import { useState } from 'react';

interface Artwork {
  title: string;
  src: string;
  type: 'image' | 'video';
}

interface GalleryGridProps {
  artworks: Artwork[];
}

export default function GalleryGrid({ artworks }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  const categories = ['全部', '动物', '风景', '人物', '创意'];

  const categoryMap: Record<string, string[]> = {
    '动物': ['小猫钓鱼', '大象', '海底世界'],
    '风景': ['日落', '山川'],
    '人物': ['我的家人'],
    '创意': ['未来城市'],
  };

  const filteredArtworks = selectedCategory === '全部'
    ? artworks
    : artworks.filter(art => categoryMap[selectedCategory]?.includes(art.title));

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
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
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredArtworks.map((artwork, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          >
            <img
              src={artwork.src}
              alt={artwork.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400 text-sm p-4 text-center">${artwork.title}</div>`;
              }}
            />
          </div>
        ))}
      </div>

      {filteredArtworks.length === 0 && (
        <p className="text-gray-500 text-center py-12">该分类下暂无作品</p>
      )}
    </div>
  );
}
