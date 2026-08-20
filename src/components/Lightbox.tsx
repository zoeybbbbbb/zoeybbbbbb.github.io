import { useEffect, useCallback, useState } from 'react';

interface Artwork {
  title: string;
  src: string;
  thumb: string;
  type: 'image' | 'video';
  category: string;
}

interface LightboxProps {
  artwork: Artwork;
  artworks: Artwork[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ artwork, currentIndex, onClose, onNavigate, artworks }: LightboxProps) {
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < artworks.length - 1;

  // 原图较大，加载完成前先顶着缩略图，避免黑屏
  const [fullLoaded, setFullLoaded] = useState(false);

  useEffect(() => {
    setFullLoaded(false);
  }, [artwork.src]);

  const handlePrev = useCallback(() => {
    if (hasPrev) onNavigate(currentIndex - 1);
  }, [hasPrev, currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) onNavigate(currentIndex + 1);
  }, [hasNext, currentIndex, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, handlePrev, handleNext]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white text-4xl w-12 h-12 flex items-center justify-center z-10"
        onClick={onClose}
      >
        ×
      </button>

      {/* Previous button */}
      {hasPrev && (
        <button
          className="absolute left-4 text-white/70 hover:text-white text-5xl w-16 h-16 flex items-center justify-center"
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
        >
          ‹
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          className="absolute right-4 text-white/70 hover:text-white text-5xl w-16 h-16 flex items-center justify-center"
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
        >
          ›
        </button>
      )}

      {/* Content */}
      <div
        className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {artwork.type === 'video' ? (
          <video
            src={artwork.src}
            controls
            autoPlay
            className="max-w-full max-h-[90vh] rounded-lg"
          />
        ) : (
          <div className="relative">
            {/* 缩略图网格里已经加载过，这里立刻就有画面；它同时撑开布局尺寸 */}
            <img
              src={artwork.thumb}
              alt=""
              aria-hidden="true"
              className={`max-w-full max-h-[90vh] object-contain rounded-lg ${
                fullLoaded ? 'invisible' : 'blur-lg'
              }`}
            />
            <img
              src={artwork.src}
              alt={artwork.title}
              onLoad={() => setFullLoaded(true)}
              onError={() => setFullLoaded(true)}
              className={`absolute inset-0 w-full h-full object-contain rounded-lg transition-opacity duration-500 ${
                fullLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {!fullLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white/90 animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Title & Counter */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/80">
        <p className="text-lg font-medium">{artwork.title}</p>
        <p className="text-sm mt-1">{currentIndex + 1} / {artworks.length}</p>
      </div>
    </div>
  );
}
