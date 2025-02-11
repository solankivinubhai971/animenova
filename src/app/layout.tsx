import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { Metadata } from 'next';
import { BookmarkProvider } from '@/contexts/BookmarkContext';
import NextTopLoader from 'nextjs-toploader';
import { Analytics } from '@vercel/analytics/react';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://mangaclan.online'),
  title: {
    default: 'Animenova - Read Manga Online Free | Best Manga Reading Experience',
    template: '%s | Animenova - Free Manga Reading'
  },
  description: 'Animenova is your go-to platform for reading manga online. Explore a vast library of manga across all genres, from action and romance to fantasy and slice-of-life. With a user-friendly design, high-quality visuals, and regular updates, MangaClan offers a seamless and immersive reading experience. Join the community, discover your favorite series, and dive into the world of manga today!',
  keywords: [
    'manga', 'read manga', 'manga online', 'free manga', 'latest manga',
    'manga scans', 'manga updates', 'popular manga', 'manga reader',
    'manga chapters', 'manga site', 'manga clan', 'english manga',
    'action manga', 'romance manga', 'fantasy manga', 'slice of life manga',
    'manga community', 'manga library', 'high quality manga', 'manga series',
    'best manga site', 'manga reading', 'free manga reading'
  ],
  authors: [{ name: 'Animenova' }],
  creator: 'Animenova',
  publisher: 'Animenova',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mangaclan.online',
    siteName: 'Animenova',
    title: 'Animenova - Best Free Manga Reading Platform Online',
    description: 'Animenova is your go-to platform for reading manga online. Explore a vast library of manga across all genres, from action and romance to fantasy and slice-of-life. With a user-friendly design, high-quality visuals, and regular updates, MangaClan offers a seamless and immersive reading experience. Join the community, discover your favorite series, and dive into the world of manga today!',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Animenova - Your Ultimate Manga Reading Platform',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 600,
        height: 600,
        alt: 'Animenova - Read Manga Online',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Animenova - Best Free Manga Reading Platform Online',
    description: 'Explore a vast library of manga across all genres. High-quality visuals, regular updates, and a seamless reading experience await you at Animenova. Start reading manga for free today!',
    creator: '@mangaclan',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'entertainment',
  classification: 'manga, comics, reading, digital library, entertainment',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#6D28D9',
      },
    ],
  },
  manifest: '/manifest.json',
  themeColor: '#6D28D9',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Animenova - Read Manga Online',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  applicationName: 'Animenova',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gray-900">
        <NextTopLoader 
          color="#ef4444"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #ef4444,0 0 5px #ef4444"
        />
        <BookmarkProvider>
          <Navbar />
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </BookmarkProvider>
        <Analytics />
      </body>
    </html>
  );
}
