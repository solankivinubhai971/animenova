'use client';

import { useBookmarks } from '@/contexts/BookmarkContext';
import BookmarkMangaCard from '@/components/BookmarkMangaCard';

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();

  return (
    <main className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">My Bookmarks</h1>
          <span className="text-gray-400 text-sm">
            {bookmarks.length} manga bookmarked
          </span>
        </div>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {bookmarks.map((manga) => (
              <BookmarkMangaCard
                key={manga.id}
                manga={manga}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No bookmarks yet</h2>
            <p className="text-sm">Start adding manga to your bookmarks!</p>
          </div>
        )}
      </div>
    </main>
  );
} 