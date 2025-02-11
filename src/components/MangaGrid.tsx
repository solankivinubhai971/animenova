import { Manga } from '@/types/manga';
import MangaCard from './MangaCard';

interface MangaGridProps {
  manga?: Manga[];
}

export default function MangaGrid({ manga = [] }: MangaGridProps) {
  if (!manga || manga.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No manga found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {manga.map((item, index) => (
        <MangaCard 
          key={item.id} 
          manga={item} 
          priority={index < 4}
        />
      ))}
    </div>
  );
} 