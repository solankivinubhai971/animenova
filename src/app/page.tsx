import { getMangaList } from '@/services/api';
import MangaCard from '@/components/MangaCard';
import { Manga } from '@/types/manga';
import PopularMangaList from '@/components/PopularMangaList';
import HeroSection from '@/components/HeroSection';
import Link from 'next/link';

export default async function Home() {
  const mangas = await getMangaList(1);
  const popularMangas = await fetch('https://mangabat-beta.vercel.app/api/manga/popular-this-month').then(res => res.json());
  
  return (
    <main className="min-h-screen bg-gray-900">
      <HeroSection mangas={popularMangas} />

      {/* Main Content */}
      <div className="container mx-auto px-3 xs:px-4 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Latest Updates */}
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-4 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                Latest Updates
              </h2>
              <Link 
                href="/latest" 
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium 
                  text-white bg-[#FF5733]/90 rounded-lg hover:bg-[#FF7849]/90 
                  transition-colors duration-200 focus:outline-none 
                  focus:ring-2 focus:ring-purple-500/50"
              >
                View All
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 inline-block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {mangas.map((manga: Manga, index: number) => (
                <MangaCard 
                  key={manga.id} 
                  manga={manga} 
                />
              ))}
            </div>
          </div>

          {/* Popular Manga Sidebar */}
          <div className="lg:w-[380px] flex-shrink-0">
            <PopularMangaList />
          </div>
        </div>
      </div>
    </main>
  );
}
