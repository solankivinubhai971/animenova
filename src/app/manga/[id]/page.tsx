import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ClientMangaDetails from './ClientMangaDetails';
import PopularMangaListClient from '@/components/PopularMangaListClient';
import Link from 'next/link';
import { generateMetadata } from './metadata';

async function getMangaDetails(id: string) {
  try {
    const res = await fetch(`https://mangabat-beta.vercel.app/api/manga/details/${id}`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch manga details');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching manga details:', error);
    throw error;
  }
}

async function getPopularManga() {
  const res = await fetch('https://mangabat-beta.vercel.app/api/manga/popular');
  return res.json();
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MangaDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const [manga, popularManga] = await Promise.all([
    getMangaDetails(resolvedParams.id),
    getPopularManga()
  ]);
  
  if (!manga) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-900 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left side - Main content */}
          <div className="flex-grow w-full lg:max-w-[900px]">
            <ClientMangaDetails manga={manga} />
          </div>

          {/* Right side - Popular Manga List (Desktop only) */}
          <div className="hidden lg:block w-[300px] flex-shrink-0">
            <PopularMangaListClient popularManga={popularManga} />
          </div>
        </div>

        {/* Popular Manga List (Mobile only) */}
        <div className="mt-4 sm:mt-6 lg:hidden">
          <PopularMangaListClient popularManga={popularManga} />
        </div>
      </div>
    </main>
  );
}

// Export the metadata generator
export { generateMetadata }; 