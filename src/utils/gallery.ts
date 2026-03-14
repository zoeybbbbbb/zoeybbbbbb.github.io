export function getGalleryStructure() {
  const categories = [
    { name: '动物', path: '/gallery?cat=动物' },
    { name: '风景', path: '/gallery?cat=风景' },
    { name: '人物', path: '/gallery?cat=人物' },
    { name: '创意', path: '/gallery?cat=创意' },
  ];

  const sampleArtworks = {
    '动物': [
      { title: '小猫钓鱼', src: '/gallery/动物/小猫钓鱼.jpg', type: 'image' },
      { title: '大象', src: '/gallery/动物/大象.jpg', type: 'image' },
    ],
    '风景': [
      { title: '日落', src: '/gallery/风景/日落.jpg', type: 'image' },
    ],
    '人物': [],
    '创意': [],
  };

  return { categories, artworks: sampleArtworks };
}
