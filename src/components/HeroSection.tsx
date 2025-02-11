'use client';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Manga {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  anilistId?: number | null;
  anilistPoster?: string | null;
  anilistBanner?: string | null;
  latestChapter: {
    title: string;
    path: string;
  };
}

interface HeroSectionProps {
  mangas: Manga[];
}

export default function HeroSection({ mangas }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const genres = ['Action', 'Comedy', 'Magic', 'Parody', 'Shounen', 'Supernatural'];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % mangas.length);
  }, [mangas.length]);

  const handlePrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + mangas.length) % mangas.length);
  }, [mangas.length]);

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        handleNext();
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [handleNext, isPaused]);

  const currentManga = mangas[currentIndex];

  return (
    <section 
      className="relative h-[500px] xs:h-[550px] sm:h-[600px] md:h-[650px] lg:h-[500px] w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0"
        >
          {/* Background Image with Gradient */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent z-10" />
            <img
              src={currentManga.anilistBanner || currentManga.imageUrl}
              alt={currentManga.title}
              className="w-full h-full object-cover object-center opacity-80"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="relative h-full z-20">
            <div className="container mx-auto px-4 h-full">
              {/* Mobile Layout (centered) for small screens, Side-by-side for lg+ */}
              <div className="flex h-full">
                {/* Left Content - Full width on mobile, half on lg+ */}
                <div className="w-full lg:w-1/2 h-full flex flex-col items-center lg:items-start justify-center">
                  {/* Card visible only on mobile/tablet */}
                  <div className="lg:hidden w-[180px] xs:w-[200px] sm:w-[240px] md:w-[280px]
                    h-[260px] xs:h-[280px] sm:h-[340px] md:h-[400px]
                    relative mb-4 sm:mb-6 transition-transform hover:scale-105">
                    <img
                      src={currentManga.anilistPoster || currentManga.imageUrl}
                      alt={currentManga.title}
                      className="w-full h-full object-cover rounded-lg shadow-xl"
                      loading="lazy"
                    />
                  </div>

                  {/* Info Section - Centered on mobile, left-aligned on lg+ */}
                  <div className="flex flex-col items-center lg:items-start text-center lg:text-left 
                    max-w-[280px] xs:max-w-[320px] sm:max-w-[400px] md:max-w-xl px-2">
                    <div className="text-white/90 text-xs xs:text-sm sm:text-base md:text-lg mb-1.5 sm:mb-2">
                      <span className="font-semibold line-clamp-1">
                        {currentManga.latestChapter.title}
                      </span>
                    </div>

                    <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl 
                      font-bold text-white mb-2 sm:mb-3 line-clamp-2">
                      {currentManga.title}
                    </h1>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-1 sm:gap-2 mb-3 sm:mb-4">
                      {genres.map((genre) => (
                        <span
                          key={genre}
                          className={cn(
                            "px-2 sm:px-4 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm",
                            "bg-white/10 text-white/90 backdrop-blur-sm"
                          )}
                        >
                          {genre}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 sm:gap-3">
                      <Link
                        href={`/manga/${currentManga.id}/${currentManga.latestChapter.path.split('-chap-')[1]}`}
                        className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 
                          bg-[#FF5733]/90 hover:bg-orange-300 text-black rounded-md 
                          text-xs sm:text-sm md:text-base font-medium transition-all 
                          hover:scale-105 active:scale-95"
                      >
                        Read Now
                      </Link>
                      <Link
                        href={`/manga/${currentManga.id}`}
                        className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 
                          bg-white/10 hover:bg-white/20 text-white rounded-md 
                          text-xs sm:text-sm md:text-base font-medium transition-all
                          hover:scale-105 active:scale-95"
                      >
                        View Info
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Side Card - Only visible on lg+ screens */}
                <div className="hidden lg:flex lg:w-1/2 h-full items-center justify-end">
                  <div className="w-[260px] h-[360px] relative transform -translate-y-6">
                    <img
                      src={currentManga.anilistPoster || currentManga.imageUrl}
                      alt={currentManga.title}
                      className="w-full h-full object-cover rounded-lg shadow-xl"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800/50">
            <motion.div
              className="h-full bg-yellow-400"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, repeat: isPaused ? 0 : Infinity }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute bottom-4 right-4 flex gap-1.5 sm:gap-2 z-30">
        <button 
          onClick={() => {
            setIsPaused(true);
            handlePrevious();
          }}
          className="p-1.5 sm:p-2 rounded-lg bg-black/50 backdrop-blur-sm text-white/90 
            hover:bg-black/70 hover:text-white transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button 
          onClick={() => {
            setIsPaused(true);
            handleNext();
          }}
          className="p-1.5 sm:p-2 rounded-lg bg-black/50 backdrop-blur-sm text-white/90 
            hover:bg-black/70 hover:text-white transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </section>
  );
}
