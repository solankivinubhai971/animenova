'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const router = useRouter();

  // Generate array of page numbers to display
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (currentPage <= 3) return i + 1;
    if (currentPage >= totalPages - 2) return totalPages - 4 + i;
    return currentPage - 2 + i;
  });

  const handlePageChange = (page: number) => {
    router.push(`${baseUrl}?page=${page}`);
  };

  return (
    <div className="flex justify-center gap-2 mt-8">
      {currentPage > 1 && (
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Previous
        </button>
      )}
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={cn(
            'px-4 py-2 rounded transition-colors',
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          )}
        >
          {page}
        </button>
      ))}
      
      {currentPage < totalPages && (
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Next
        </button>
      )}
    </div>
  );
} 