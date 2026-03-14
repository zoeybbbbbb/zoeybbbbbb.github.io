import { useEffect, useCallback } from 'react';

interface Artwork {
  title: string;
  src: string;
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
          <img
            src={artwork.src}
            alt={artwork.title}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
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
