import { Metadata, ResolvingMetadata } from 'next';

// Define the manga data interface
interface MangaDetails {
  id: string;
  title: string;
  altTitles?: string[];
  description: string;
  authors: string[];
  status: string;
  genres: string[];
  views: string;
  updated: string;
  coverImage: string;
  anilistId?: number;
  anilistPoster: string | null;
  anilistBanner: string | null;
  chapterList: {
    id: string;
    title: string;
    updated: string;
  }[];
}

async function getMangaDetails(id: string): Promise<MangaDetails | null> {
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

interface MetadataProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: MetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const manga = await getMangaDetails(resolvedParams.id);
  
  if (!manga) {
    return { 
      title: 'Manga Not Found | MangaClan',
      description: 'The requested manga could not be found. Browse our vast collection of other manga series at MangaClan.',
    };
  }

  // Format alternative titles for description
  const altTitlesText = manga.altTitles?.length 
    ? `Also known as: ${manga.altTitles.join(', ')}. ` 
    : '';

  // Create a rich description
  const description = manga.description === 'Updating'
    ? `Read ${manga.title} manga online for free at Animenova. ${altTitlesText}A ${manga.genres.join(', ')} manga by ${manga.authors.join(', ')}. ${manga.chapterList.length} chapters available.`
    : `${manga.description} ${altTitlesText}Read ${manga.title} manga online for free at Animenova.`;

  // Get latest chapter number and title
  const latestChapter = manga.chapterList[manga.chapterList.length - 1];
  const title = `${manga.title} - Read Online Free | Chapter 1-${latestChapter.id} | Animenova`;

  return {
    metadataBase: new URL('https://mangaclan.online'),
    title: {
      absolute: `${manga.title} - Read Online Free | Chapter 1-${latestChapter.id} | MangaClan`,
      template: '%s | MangaClan',
      default: manga.title,
    },
    description: description,
    openGraph: {
      title: `${manga.title} - Read Free Online | Animenova`,
      description: description,
      type: 'article',
      images: [
        {
          url: manga.anilistPoster || manga.coverImage,
          width: 1200,
          height: 630,
          alt: `${manga.title} Manga Cover`,
        }
      ],
      authors: manga.authors,
      publishedTime: manga.updated,
      modifiedTime: manga.updated,
      section: 'Manga',
      tags: ['manga', ...manga.genres],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${manga.title} Manga - Read Online Free`,
      description: `Read ${manga.title} (${manga.altTitles?.[0] || ''}) manga online. ${manga.genres.join(', ')}. Updated to chapter ${latestChapter.id}.`,
      images: [manga.anilistPoster || manga.coverImage],
    },
    alternates: {
      canonical: `/manga/${resolvedParams.id}`,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    keywords: [
      manga.title,
      ...(manga.altTitles || []),
      ...manga.genres,
      'read manga online',
      'free manga',
      'manga clan',
      ...manga.authors.map((author: string) => `${author} manga`),
      `chapter 1-${latestChapter.id}`,
      'manga online',
      `read ${manga.title}`,
      `${manga.title} manga`,
      manga.status.toLowerCase(),
      ...manga.genres.map((genre: string) => `${genre.toLowerCase()} manga`),
    ].filter(Boolean),
  };
} 