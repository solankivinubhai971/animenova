import { Metadata } from 'next';
import MangaGrid from '@/components/MangaGrid';
import Pagination from '@/components/Pagination';
import { Manga } from '@/types/manga';
import Popunder from '@/ads/Popunder';
import SocialBar from '@/ads/SocialBar';

export const metadata: Metadata = {
  title: 'Popular Manga - Animenova',
  description: 'Browse popular manga on Animenova',
};

interface MangaResponse {
  manga: Manga[];
  totalPages: number;
}

async function getPopularManga(page: number = 1): Promise<MangaResponse> {
  try {
    const res = await fetch(`https://mangabat-beta.vercel.app/api/manga/popular/${page}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error('Failed to fetch manga');
    const data = await res.json();
    
    // If data length is less than 20, we're on the last page
    const isLastPage = data.length < 20;
    const calculatedTotalPages = isLastPage ? page : page + 1;

    return {
      manga: data,
      totalPages: calculatedTotalPages
    };
  } catch (error) {
    console.error('Error fetching popular manga:', error);
    return { manga: [], totalPages: 1 };
  }
}

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function PopularPage({ searchParams }: PageProps) {
  const searchParamsData = await Promise.resolve(searchParams);
  const page = Number(searchParamsData?.page) || 1;
  const { manga, totalPages } = await getPopularManga(page);

  return (
    <>
    <Popunder />
    <SocialBar />
    <main className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6">Popular Manga</h1>
        <MangaGrid manga={manga} />
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          baseUrl="/popular" 
        />
      </div>
    </main>
    </>
  );
} 