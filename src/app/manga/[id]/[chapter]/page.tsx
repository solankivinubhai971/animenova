'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface ChapterResponse {
  message: string;
  referrer: string;
  results: {
    id: string;
    title: string;
    currentChapter: string;
    nextChapterId?: string;
    prevChapterId?: string;
    chapterList: {
      id: string;
      title: string;
      isCurrent: boolean;
    }[];
    images: {
      title: string;
      image: string;
      page: number;
    }[];
  };
}

function getProxyImageUrl(imageUrl: string, referrer: string) {
  const cleanImageUrl = imageUrl.split('?')[0];
  return `/api/proxy?url=${encodeURIComponent(cleanImageUrl)}&referrer=${encodeURIComponent(referrer)}`;
}

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<ChapterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [params.chapter]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://mangabat-beta.vercel.app/api/manga/read/${params.id}/${params.chapter}`,
          { cache: 'no-store' }
        );

        if (!response.ok) throw new Error('Failed to fetch chapter');
        const result = await response.json();
        setData(result);
      } catch (error) {
        // Removed console.error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, params.chapter]);

  useEffect(() => {
    if (data?.results) {
      document.title = `Chapter ${params.chapter} - ${data.results.title}`;
    } else {
      document.title = 'Loading Chapter...';
    }

    return () => {
      document.title = 'Manga Reader';
    };
  }, [data, params.chapter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="bg-red-900/30 rounded-lg p-4 text-center text-gray-300">
          Unable to load chapter at this time
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black custom-scrollbar">
      {/* Fixed Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-gray-800/50 z-[100] -mt-1">
        <div className="h-20 px-3 sm:px-6 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-5">
            <button
              onClick={() => router.push(`/manga/${params.id}`)}
              className="text-white/90 hover:text-white flex items-center gap-1.5 sm:gap-2.5 transition-colors px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-800/50"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm sm:text-base font-medium hidden xs:inline">Back</span>
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`text-white/90 hover:text-white flex items-center gap-1.5 sm:gap-2.5 transition-colors px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-800/50 ${
                isMenuOpen ? 'bg-gray-800/50' : ''
              }`}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-sm sm:text-base font-medium hidden xs:inline">Chapters</span>
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            {data.results.prevChapterId && (
              <Link
                href={`/manga/${params.id}/${data.results.prevChapterId}`}
                className="flex items-center gap-1 sm:gap-2 text-white/90 hover:text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm sm:text-base font-medium hidden xs:inline">Prev</span>
              </Link>
            )}
            
            <span className="text-white/90 text-sm sm:text-base font-medium px-2 sm:px-3">
              Ch. {params.chapter}
            </span>
            
            {data.results.nextChapterId && (
              <Link
                href={`/manga/${params.id}/${data.results.nextChapterId}`}
                className="flex items-center gap-1 sm:gap-2 text-white/90 hover:text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-sm sm:text-base font-medium hidden xs:inline">Next</span>
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Chapter List Sidebar - Adjusted top position and height to match new nav height */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed top-20 left-0 w-80 h-[calc(100vh-80px)] bg-[#0a0a0a]/95 backdrop-blur-sm z-[90] overflow-y-auto border-r border-gray-800/50 
                scrollbar-thin scrollbar-track-gray-900/50 scrollbar-thumb-gray-800 hover:scrollbar-thumb-gray-700 
                scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
            >
              <div className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-gray-800/50 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-white/90">Chapter List</h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors"
                    aria-label="Close chapter list"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-1">
                {data.results.chapterList.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/manga/${params.id}/${chapter.id}`}
                    className={`block px-4 py-3 rounded-lg transition-all ${
                      chapter.isCurrent
                        ? 'bg-red-900/30 text-white font-medium shadow-sm'
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white hover:translate-x-1'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{chapter.title}</span>
                      {chapter.isCurrent && (
                        <span className="flex-shrink-0 ml-2">
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-7.208l2.793-2.792 1.414 1.414-3.5 3.5a1 1 0 01-1.414 0l-2-2 1.414-1.414L11 12.792z" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[80]"
              onClick={() => setIsMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Content container - Removed default margin and adjusted padding */}
      <div className="max-w-2xl mx-auto -mt-1">
        {data.results.images.map((image, index) => (
          <div key={index} className="relative w-full">
            <img
              src={getProxyImageUrl(image.image, data.referrer)}
              alt={image.title}
              className="w-full h-auto block"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Scroll to top button - Adjusted z-index */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 rounded-full bg-black/80 text-white/90 hover:text-white border border-gray-800/50 shadow-lg backdrop-blur-sm z-[100] transition-colors hover:bg-gray-800/50"
            aria-label="Scroll to top"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
