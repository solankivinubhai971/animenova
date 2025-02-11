import { Metadata } from 'next';
import MangaGrid from '@/components/MangaGrid';
import Pagination from '@/components/Pagination';
import { Manga } from '@/types/manga';

export const metadata: Metadata = {
  title: 'Newest Manga - Animenova',
  description: 'Browse the newest manga releases on Animenova',
};

interface MangaResponse {
  manga: Manga[];
  totalPages: number;
}

async function getNewestManga(page: number = 1): Promise<MangaResponse> {
  try {
    const res = await fetch(`https://mangabat-beta.vercel.app/api/manga/newest/${page}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error('Failed to fetch manga');
    const data = await res.json();
    
    // If data length is less than 24, we're on the last page
    const isLastPage = data.length < 24;
    const calculatedTotalPages = isLastPage ? page : page + 1;

    return {
      manga: data,
      totalPages: calculatedTotalPages
    };
  } catch (error) {
    console.error('Error fetching newest manga:', error);
    return { manga: [], totalPages: 1 };
  }
}

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function NewestPage({ searchParams }: PageProps) {
  const searchParamsData = await Promise.resolve(searchParams);
  const page = Number(searchParamsData?.page) || 1;
  const { manga, totalPages } = await getNewestManga(page);

  return (
    <main className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6">Newest Manga</h1>
        <MangaGrid manga={manga} />
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          baseUrl="/newest" 
        />
      </div>
    </main>
  );
} 