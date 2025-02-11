import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Manga Not Found
        </h2>
        <p className="text-gray-400 mb-6">
          The manga you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 