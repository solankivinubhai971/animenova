'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaTelegram, FaPinterestP } from 'react-icons/fa';
import { IoCopyOutline } from 'react-icons/io5';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { BsBookmarkPlus, BsBookmarkCheckFill } from 'react-icons/bs';
import { usePathname } from 'next/navigation';

interface MangaProps {
  manga: {
    id: string;
    title: string;
    description: string;
    authors: string[];
    status: string;
    views: string;
    updated: string;
    coverImage: string;
    anilistPoster: string | null;
    chapterList: Array<{
      id: string;
      title: string;
      updated: string;
    }>;
  };
}

export default function ClientMangaDetails({ manga }: MangaProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const imageSource = manga.anilistPoster || manga.coverImage;
  const reversedChapterList = [...manga.chapterList].reverse();
  const pathname = usePathname();
  
  const filteredChapters = reversedChapterList.filter((chapter) => {
    if (!searchTerm) return true;
    const searchNumber = parseInt(searchTerm);
    const chapterId = parseInt(chapter.id);
    return isNaN(searchNumber) 
      ? chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
      : chapterId === searchNumber;
  });

  const handleBookmark = () => {
    const mangaData = {
      id: manga.id,
      title: manga.title,
      coverImage: manga.coverImage,
      anilistPoster: manga.anilistPoster,
      chapters: manga.chapterList.slice(-2) // Save last 2 chapters
    };
    
    if (isBookmarked(manga.id)) {
      removeBookmark(manga.id);
    } else {
      addBookmark(mangaData);
    }
  };

  // Get the full URL for sharing
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${pathname}`;
    }
    return '';
  };

  // Social media sharing functions
  const handleShare = {
    facebook: () => {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
      window.open(url, '_blank', 'width=600,height=400');
    },
    
    twitter: () => {
      const text = `Check out ${manga.title} on Animenova!`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getShareUrl())}`;
      window.open(url, '_blank', 'width=600,height=400');
    },
    
    whatsapp: () => {
      const text = `Check out ${manga.title} on Animenova: ${getShareUrl()}`;
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'width=600,height=400');
    },
    
    telegram: () => {
      const text = `Check out ${manga.title} on Animenova: ${getShareUrl()}`;
      const url = `https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'width=600,height=400');
    },
    
    pinterest: () => {
      const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(getShareUrl())}&media=${encodeURIComponent(imageSource)}&description=${encodeURIComponent(manga.title)}`;
      window.open(url, '_blank', 'width=600,height=400');
    },
    
    copyLink: async () => {
      try {
        await navigator.clipboard.writeText(getShareUrl());
        // You might want to add a toast notification here
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  return (
    <>
      {/* Manga Details Section */}
      <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Cover Image and Bookmark */}
          <div className="w-full sm:w-[180px] lg:w-[200px] flex-shrink-0">
            <div className="relative w-full max-w-[200px] mx-auto sm:mx-0">
              <div className="relative aspect-[3/4]">
                <Image
                  src={imageSource}
                  alt={manga.title}
                  fill
                  className="object-cover rounded-lg"
                  priority
                  sizes="(max-width: 640px) 100vw, 200px"
                />
              </div>
              <button 
                onClick={handleBookmark}
                className={`w-full flex items-center justify-center gap-2 py-2 mt-1 
                  text-sm bg-gray-800/95 rounded-md transition-colors duration-200
                  ${isBookmarked(manga.id) 
                    ? 'text-[#FF5733]/90 hover:text-orange-300' 
                    : 'text-white hover:text-orange-300'}`}
              >
                {isBookmarked(manga.id) ? (
                  <>
                    <BsBookmarkCheckFill className="w-4 h-4" />
                    <span>Bookmarked</span>
                  </>
                ) : (
                  <>
                    <BsBookmarkPlus className="w-4 h-4" />
                    <span>Bookmark</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Details Content */}
          <div className="flex-grow">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              {manga.title}
            </h1>

            {/* Info Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-y-2 text-xs sm:text-sm mb-3 sm:mb-4">
              <div>
                <span className="text-gray-400">First:</span>
                <span className="text-white ml-2">Chapter {manga.chapterList[0]?.id || '1'}</span>
              </div>
              <div>
                <span className="text-gray-400">Latest:</span>
                <span className="text-white ml-2">Chapter {manga.chapterList[manga.chapterList.length - 1]?.id || '?'}</span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="text-white ml-2">{manga.status}</span>
              </div>
              <div>
                <span className="text-gray-400">Type:</span>
                <span className="text-white ml-2">Manga</span>
              </div>
              <div>
                <span className="text-gray-400">Posted By:</span>
                <span className="text-white ml-2">{manga.authors.join(', ')}</span>
              </div>
              <div>
                <span className="text-gray-400">Posted On:</span>
                <span className="text-white ml-2">{manga.updated}</span>
              </div>
              <div>
                <span className="text-gray-400">Updated On:</span>
                <span className="text-white ml-2">{manga.updated}</span>
              </div>
              <div>
                <span className="text-gray-400">Views:</span>
                <span className="text-white ml-2">{manga.views || '?'}</span>
              </div>
            </div>

            {/* Rating and Followers */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm mb-3 sm:mb-4">
              <div className="flex items-center text-yellow-400">
                <span className="mr-1">★</span>
                <span>7</span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">Followed by 612 people</span>
            </div>

            {/* Description with Toggle */}
            <div className="relative">
              <p className={`text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6 
                ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}>
                {manga.description}
              </p>
              {manga.description.length > 100 && (
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-[#FF5733]/90 hover:text-orange-300 text-xs sm:text-sm"
                >
                  {isDescriptionExpanded ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>

            {/* Share Buttons and Read Buttons Section */}
            <div className="space-y-3 sm:space-y-4">
              {/* Share Buttons */}
              <div className="grid grid-cols-3 xs:grid-cols-4 sm:flex sm:flex-wrap gap-2">
                <button 
                  onClick={handleShare.facebook}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 bg-[#1877f2] text-white rounded flex items-center justify-center gap-1 sm:gap-2 hover:opacity-90 transition-opacity text-xs sm:text-sm sm:min-w-[100px]"
                >
                  <FaFacebookF size={12} className="sm:text-[14px]" /> Share
                </button>
                
                <button 
                  onClick={handleShare.twitter}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 bg-[#1da1f2] text-white rounded flex items-center justify-center gap-1 sm:gap-2 hover:opacity-90 transition-opacity text-xs sm:text-sm sm:min-w-[100px]"
                >
                  <FaTwitter size={12} className="sm:text-[14px]" /> Tweet
                </button>
                
                <button 
                  onClick={handleShare.whatsapp}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 bg-[#25d366] text-white rounded flex items-center justify-center gap-1 sm:gap-2 hover:opacity-90 transition-opacity text-xs sm:text-sm sm:min-w-[100px]"
                >
                  <FaWhatsapp size={12} className="sm:text-[14px]" /> Share
                </button>
                
                <button 
                  onClick={handleShare.telegram}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 bg-[#0088cc] text-white rounded flex items-center justify-center gap-1 sm:gap-2 hover:opacity-90 transition-opacity text-xs sm:text-sm sm:min-w-[100px]"
                >
                  <FaTelegram size={12} className="sm:text-[14px]" /> Share
                </button>
                
                <button 
                  onClick={handleShare.pinterest}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 bg-[#e60023] text-white rounded flex items-center justify-center gap-1 sm:gap-2 hover:opacity-90 transition-opacity text-xs sm:text-sm sm:min-w-[100px]"
                >
                  <FaPinterestP size={12} className="sm:text-[14px]" /> Pin
                </button>
                
                <button 
                  onClick={handleShare.copyLink}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-700 text-white rounded flex items-center justify-center gap-1 sm:gap-2 hover:opacity-90 transition-opacity text-xs sm:text-sm sm:min-w-[100px]"
                >
                  <IoCopyOutline size={12} className="sm:text-[14px]" /> Copy Link
                </button>
              </div>

              {/* Read Buttons */}
              <div className="flex gap-2 sm:gap-3">
                <Link
                  href={`/manga/${manga.id}/${manga.chapterList[0]?.id || '1'}`}
                  className="flex-1 py-1.5 sm:py-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
                >
                  Read First: Ch.1
                </Link>
                <Link
                  href={`/manga/${manga.id}/${manga.chapterList[manga.chapterList.length - 1]?.id}`}
                  className="flex-1 py-1.5 sm:py-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
                >
                  Latest: Ch.{manga.chapterList[manga.chapterList.length - 1]?.id}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter List Section */}
      <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white">Chapter List</h2>
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search Chapter (e.g., 23)"
              className="w-full sm:w-[280px] bg-gray-800/50 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg 
                        text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 
                        focus:ring-blue-500/50 focus:bg-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="bg-gray-800/30 rounded-lg">
          <div className="max-h-[400px] sm:max-h-[600px] overflow-y-auto custom-scrollbar">
            {filteredChapters.length > 0 ? (
              filteredChapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/manga/${manga.id}/${chapter.id}`}
                  className="flex justify-between items-center p-3 sm:p-4 hover:bg-gray-700/50 
                           transition-colors border-b border-gray-700/50 last:border-0"
                >
                  <span className="text-white text-xs sm:text-sm">Chapter {chapter.id}</span>
                  <span className="text-gray-400 text-[10px] sm:text-xs">{chapter.updated}</span>
                </Link>
              ))
            ) : (
              <div className="p-3 sm:p-4 text-center text-gray-400 text-xs sm:text-sm">
                No chapters found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 