'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Manga } from '@/types/manga';

interface PopularMangaListClientProps {
  popularManga: Manga[];
}

export default function PopularMangaListClient({ popularManga }: PopularMangaListClientProps) {
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const handleImageError = (mangaId: string) => {
    setImageErrors(prev => ({ ...prev, [mangaId]: true }));
  };

  const getImageSource = (manga: Manga) => {
    if (imageErrors[manga.id]) {
      return manga.imageUrl;
    }
    return manga.anilistPoster || manga.imageUrl;
  };

  return (
    <div className="bg-[#282828]/90 rounded-lg p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white">Popular</h2>
        <Link 
          href="/popular" 
          className="text-xs sm:text-sm text-[#FF5733]/90 hover:text-orange-300 transition-colors"
        >
          View All
        </Link>
      </div>
      
      {/* Mobile Scrollable View */}
      <div className="md:hidden -mx-3 px-3">
        <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-none">
          {popularManga.slice(0, 10).map((manga, index) => (
            <Link 
              href={`/manga/${manga.id}`} 
              key={manga.id} 
              className="group flex-shrink-0 w-[120px]"
            >
              <div className="relative aspect-[2/3] w-full">
                <Image
                  src={getImageSource(manga)}
                  alt={manga.title}
                  fill
                  loading="lazy"
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 120px, 50px"
                  onError={() => handleImageError(manga.id)}
                />
                {/* Rating Badge */}
                <div className="absolute top-1 right-1 flex items-center bg-black/60 rounded px-1 py-0.5">
                  <svg className="w-2.5 h-2.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-[10px] text-white ml-0.5">{manga.rating}</span>
                </div>
              </div>
              {/* Title and Chapter */}
              <div className="mt-2">
                <h3 className="text-xs font-medium text-white line-clamp-2 leading-snug">
                  {manga.title}
                </h3>
                {manga.chapters && manga.chapters.length > 0 && (
                  <div className="text-[10px] text-gray-400 mt-1">
                    Chapter {manga.chapters[0].title.split(' ')[1] || manga.chapters[0].id}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop List View */}
      <div className="hidden md:block space-y-3">
        {popularManga.slice(0, 10).map((manga, index) => (
          <Link href={`/manga/${manga.id}`} key={manga.id} className="group">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <div className="w-5 text-center font-bold text-sm">
                <span className={`${index < 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {index + 1}
                </span>
              </div>
              
              <div className="relative w-[50px] h-[70px] flex-shrink-0">
                <Image
                  src={getImageSource(manga)}
                  alt={manga.title}
                  fill
                  loading="lazy"
                  className="object-cover rounded"
                  sizes="50px"
                  onError={() => handleImageError(manga.id)}
                />
              </div>

              <div className="flex-grow min-w-0">
                <h3 className="text-sm font-medium text-white line-clamp-1 group-hover:text-[#FF5733]/90 transition-colors">
                  {manga.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-0.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {manga.rating}
                  </div>
                  <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                  <span className="truncate">{manga.viewCount} views</span>
                </div>
                {manga.chapters && manga.chapters.length > 0 && (
                  <div className="text-xs text-[#FF5733]/90 mt-0.5 truncate">
                    Ch. {manga.chapters[0].title.split(' ')[1] || manga.chapters[0].id}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 