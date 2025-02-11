'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Chapter {
  title: string;
  id: string;
  path: string;
}

interface MangaCardProps {
  manga: {
    id: string;
    title: string;
    imageUrl?: string;
    image?: string;
    anilistId: number | null;
    anilistPoster: string | null;
    anilistBanner: string | null;
    rating: string;
    chapters?: Chapter[];
    author: string;
    releaseDate?: string;
    updated?: string;
    viewCount?: string;
    views?: string;
  };
  priority?: boolean;
}

export default function MangaCard({ manga, priority = false }: MangaCardProps) {
  // Handle both imageUrl and image fields
  const initialImage = manga.anilistPoster || manga.imageUrl || manga.image || '';
  const [imgSrc, setImgSrc] = useState<string>(initialImage);
  
  // Handle both viewCount and views fields
  const views = manga.viewCount || manga.views?.trim() || '0';
  
  // Handle both releaseDate and updated fields
  const dateUpdated = manga.releaseDate || manga.updated || '';

  // Handle image error by trying alternative sources
  const handleImageError = () => {
    if (imgSrc === manga.anilistPoster && (manga.imageUrl || manga.image)) {
      setImgSrc(manga.imageUrl || manga.image || '');
    } else if ((imgSrc === manga.imageUrl || imgSrc === manga.image) && manga.anilistPoster) {
      setImgSrc(manga.anilistPoster);
    } else {
      setImgSrc('/placeholder-manga.jpg');
    }
  };

  return (
    <div className="group">
      <div className="bg-[#282828]/90 rounded-lg overflow-hidden transition-all duration-300 hover:bg-[#1E1E1E]/90">
        <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
          {/* Image Container - Bigger sizes */}
          <Link 
            href={`/manga/${manga.id}`} 
            className="relative w-[120px] h-[170px] sm:w-[140px] sm:h-[200px] flex-shrink-0"
          >
            {imgSrc ? (
              <div className="relative w-full h-full">
                <img
                  src={imgSrc}
                  alt={manga.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-md"
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-700 rounded-md flex items-center justify-center">
                <span className="text-gray-500 text-xs sm:text-sm">No Image</span>
              </div>
            )}
            {/* Language Tag */}
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs 
              px-2 py-0.5 rounded">
              EN
            </div>
          </Link>

          {/* Content Container */}
          <div className="flex flex-col flex-grow min-w-0">
            {/* Title */}
            <Link href={`/manga/${manga.id}`}>
              <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-2 mb-2">
                {manga.title}
              </h3>
            </Link>

            {/* Author */}
            <div className="text-xs sm:text-sm text-gray-400 mb-2 line-clamp-1">
              {manga.author === 'N/A' ? 'Unknown Author' : manga.author}
            </div>

            {/* Chapters */}
            {manga.chapters && manga.chapters.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-auto mb-2">
                {manga.chapters.slice(0, 2).map((chapter, index) => (
                  <Link
                    key={`${manga.id}-chapter-${chapter.id}-${index}`}
                    href={`/manga/${manga.id}/${chapter.id}`}
                    className="flex items-center text-xs sm:text-sm text-[#FF5733]/90 hover:text-orange-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="truncate">{chapter.title}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Updated Date */}
            <div className="text-xs sm:text-sm text-gray-500 mb-auto">
              Updated: {dateUpdated}
            </div>

            {/* Views & Rating */}
            <div className="flex items-center gap-2 sm:gap-3 mt-2 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400" 
                  fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {manga.rating}
              </div>
              <span>•</span>
              <span>{views} views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
