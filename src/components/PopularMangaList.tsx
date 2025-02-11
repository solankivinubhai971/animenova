import PopularMangaListClient from './PopularMangaListClient';

interface MangaChapter {
  title: string;
  id: string;
  path: string;
}

interface Manga {
  id: string;
  title: string;
  imageUrl: string;
  anilistId: number | null;
  anilistPoster: string | null;
  anilistBanner: string | null;
  rating: string;
  chapters: MangaChapter[];
  author: string;
  releaseDate: string;
  viewCount: string;
}

export default async function PopularMangaList() {
  try {
    const response = await fetch('https://mangabat-beta.vercel.app/api/manga/popular', {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) throw new Error('Failed to fetch popular manga');
    const data: Manga[] = await response.json();

    // Data is already in the correct format, no need for transformation
    return <PopularMangaListClient popularManga={data} />;
    
  } catch (error) {
    console.error('Error fetching popular manga:', error);
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-center text-gray-400">
        Unable to load popular manga at this time
      </div>
    );
  }
} 