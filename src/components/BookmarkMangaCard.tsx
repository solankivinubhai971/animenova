'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useBookmarks } from '@/contexts/BookmarkContext';

interface MangaCardProps {
  manga: {
    id: string;
    title: string;
    imageUrl?: string;
    coverImage?: string;
    anilistPoster?: string | null;
  };
  priority?: boolean;
}

export default function BookmarkMangaCard({ manga, priority = false }: MangaCardProps) {
  const { removeBookmark } = useBookmarks();
  const initialImage = manga.anilistPoster || manga.coverImage || manga.imageUrl || '';
  const [imgSrc, setImgSrc] = useState<string>(initialImage);

  const handleImageError = () => {
    setImgSrc('/placeholder-manga.jpg');
  };

  return (
    <div className="group relative">
      {/* Remove Button */}
      <button
        onClick={() => removeBookmark(manga.id)}
        className="absolute top-2 right-2 z-10 p-2 bg-red-500/90 rounded-full 
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/50"
        aria-label="Remove from bookmarks"
      >
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <Link href={`/manga/${manga.id}`}>
        <div className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:bg-gray-700">
          <div className="relative w-full pb-[145%]">
            <Image
              src={imgSrc}
              alt={manga.title}
              fill
              priority={priority}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={handleImageError}
            />
          </div>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-white line-clamp-2">
              {manga.title}
            </h3>
          </div>
        </div>
      </Link>
    </div>
  );
} 