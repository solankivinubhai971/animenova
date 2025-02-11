import { Metadata } from 'next';
import MangaGrid from '@/components/MangaGrid';
import Pagination from '@/components/Pagination';
import { Manga } from '@/types/manga';

export const metadata: Metadata = {
  title: 'Completed Manga - Animenova',
  description: 'Browse completed manga on Animenova',
};

interface MangaResponse {
  manga: Manga[];
  totalPages: number;
}

async function getCompletedManga(page: number = 1): Promise<MangaResponse> {
  try {
    const res = await fetch(`https://mangabat-beta.vercel.app/api/manga/completed/${page}`, {
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
    console.error('Error fetching completed manga:', error);
    return { manga: [], totalPages: 1 };
  }
}

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CompletedPage({ searchParams }: PageProps) {
  const searchParamsData = await Promise.resolve(searchParams);
  const page = Number(searchParamsData?.page) || 1;
  const { manga, totalPages } = await getCompletedManga(page);

  return (
    <main className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-6">Completed Manga</h1>
        <MangaGrid manga={manga} />
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          baseUrl="/completed" 
        />
      </div>
    </main>
  );
} 