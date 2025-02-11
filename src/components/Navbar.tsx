'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect, FormEvent } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/popular', label: 'Popular' },
    { href: '/latest', label: 'Latest' },
    { href: '/newest', label: 'Newest' },
    { href: '/completed', label: 'Completed' },
  ];

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 backdrop-blur-md',
        isScrolled ? 'bg-gray-900/95 shadow-lg' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo, Brand and Navigation Links in one line */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <img
                src="/logo.webp"
                alt="Animenova Logo"
                className="w-50 h-7 group-hover:scale-110 transition-transform"
              />
              {/* <span className="text-xl font-bold text-white tracking-tight group-hover:text-purple-400 transition-colors">
                Animenova
              </span> */}
            </Link>

            {/* Navigation Links directly after brand */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                    pathname === item.href
                      ? 'bg-[#FF5733]/90 text-white shadow-lg shadow-purple-500/20'
                      : 'text-gray-300 hover:bg-[#FF7849]/90 hover:text-white'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar and Profile on the right */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative group">
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search manga..."
                  className="w-48 bg-gray-800/80 text-white rounded-lg pl-8 pr-3 py-1 
                    text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 
                    placeholder:text-gray-400 transition-all duration-300
                    hover:bg-gray-700/80"
                />
                <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </form>

            {/* Profile Button - Updated to link to bookmarks */}
            <Link
              href="/bookmarks"
              className="p-1.5 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white 
                focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </Link>
          </div>

          {/* Mobile menu and search buttons */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 
                hover:text-white hover:bg-gray-700/50 focus:outline-none focus:ring-2 
                focus:ring-purple-500 transition-all duration-200"
            >
              <span className="sr-only">Open search</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 
                hover:text-white hover:bg-gray-700/50 focus:outline-none focus:ring-2 
                focus:ring-purple-500 transition-all duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - improved styling */}
      <div 
        className={cn(
          'md:hidden fixed inset-x-0 top-16 transition-all duration-300 ease-in-out',
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800/95 backdrop-blur-sm shadow-lg">
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} className="px-4 pb-2">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search manga..."
                className="w-full bg-gray-700/80 text-white rounded-lg pl-8 pr-3 py-2 
                  text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 
                  placeholder:text-gray-400"
              />
              <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </form>

          {/* Navigation Links */}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'block px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200',
                pathname === item.href
                  ? 'bg-purple-600/90 text-white shadow-md shadow-purple-500/20'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              )}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile Bookmarks Link */}
          <Link
            href="/bookmarks"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-base font-medium text-gray-300 
              hover:bg-gray-700/50 hover:text-white transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <span>Bookmarks</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
