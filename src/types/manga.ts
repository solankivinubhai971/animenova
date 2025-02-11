interface Chapter {
  title: string;
  id: string;
  path: string;
}

export interface Manga {
  id: string;
  title: string;
  imageUrl: string;
  anilistId: number | null;
  anilistPoster: string | null;
  anilistBanner: string | null;
  rating: string;
  chapters?: Chapter[];
  author: string;
  releaseDate: string;
  viewCount: string;
}

export interface MangaResponse {
  manga: Manga[];
  totalPages: number;
} 