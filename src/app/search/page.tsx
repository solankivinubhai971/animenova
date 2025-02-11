import { Metadata } from 'next';
import MangaGrid from '@/components/MangaGrid';
import { Manga } from '@/types/manga';

export const metadata: Metadata = {
  title: 'Search Results - Animenova',
  description: 'Search results for manga on Animenova',
};

interface SearchResponse {
  manga: Manga[];
}

async function searchManga(query: string): Promise<SearchResponse> {
  try {
    if (!query) return { manga: [] };

    const res = await fetch(`https://mangabat-beta.vercel.app/api/manga/search/${encodeURIComponent(query)}`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) throw new Error('Failed to fetch search results');
    const data = await res.json();

    return {
      manga: data
    };
  } catch (error) {
    console.error('Error searching manga:', error);
    return { manga: [] };
  }
}

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const searchParamsData = await Promise.resolve(searchParams);
  const query = typeof searchParamsData.q === 'string' ? searchParamsData.q : '';
  const { manga } = await searchManga(query);

  return (
    <main className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-400">
              Showing results for "{query}"
            </p>
          )}
        </div>

        {manga.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-2">
              {query 
                ? `No results found for "${query}"`
                : 'Enter a search term to find manga'
              }
            </p>
            <p className="text-gray-500">
              Try searching for a different term or check your spelling
            </p>
          </div>
        ) : (
          <MangaGrid manga={manga} />
        )}
      </div>
    </main>
  );
} 