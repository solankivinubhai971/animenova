'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface Manga {
  id: string;
  title: string;
  imageUrl?: string;
  coverImage?: string;
  anilistPoster?: string | null;
  dateAdded?: string;
}

interface BookmarkContextType {
  bookmarks: Manga[];
  addBookmark: (manga: Manga) => void;
  removeBookmark: (mangaId: string) => void;
  isBookmarked: (mangaId: string) => boolean;
  isLoading: boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

interface IndexedDBErrorEvent extends Event {
  target: IDBRequest;
}

const DB_NAME = 'MangaBookmarksDB';
const STORE_NAME = 'bookmarks';
const DB_VERSION = 2;
const CHUNK_SIZE = 5242880; // 5MB chunks

interface ChunkedManga extends Manga {
  chunks: string[];
  totalSize: number;
}

// Enhanced database initialization with blob storage support
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database error:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      const db = request.result;
      if (db.version !== DB_VERSION) {
        console.warn('Database version mismatch');
      }
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create or update main bookmark store
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('title', 'title', { unique: false });
        store.createIndex('dateAdded', 'dateAdded', { unique: false });
      }

      // Create blob chunks store
      if (!db.objectStoreNames.contains('chunks')) {
        db.createObjectStore('chunks', { keyPath: 'id' });
      }
    };
  });
};

// Helper function to chunk large data
const chunkData = (data: string): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    chunks.push(data.slice(i, i + CHUNK_SIZE));
  }
  return chunks;
};

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced bookmark loading with chunk handling
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setIsLoading(true);
        const db = await initDB();
        const transaction = db.transaction([STORE_NAME, 'chunks'], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        
        return new Promise<Manga[]>((resolve, reject) => {
          const request = store.getAll();
          
          request.onsuccess = async () => {
            const bookmarks = request.result;
            // Reconstruct any chunked data
            for (const bookmark of bookmarks) {
              const chunkedBookmark = bookmark as ChunkedManga;
              if ('chunks' in chunkedBookmark && Array.isArray(chunkedBookmark.chunks)) {
                const chunksStore = transaction.objectStore('chunks');
                const chunks = await Promise.all(
                  chunkedBookmark.chunks.map(chunkId => 
                    new Promise<string>((resolve) => {
                      const chunkRequest = chunksStore.get(chunkId);
                      chunkRequest.onsuccess = () => resolve(chunkRequest.result.data);
                    })
                  )
                );
                // Reconstruct the original data
                const fullData = chunks.join('');
                // Update the bookmark with the reconstructed data
                Object.assign(bookmark, JSON.parse(fullData));
              }
            }
            resolve(bookmarks);
          };
          
          request.onerror = () => reject(request.error);
          transaction.oncomplete = () => db.close();
        });
      } catch (error) {
        console.error('Error loading bookmarks:', error);
        return [];
      } finally {
        setIsLoading(false);
      }
    };

    loadBookmarks().then(setBookmarks);
  }, []);

  const updateBookmarkInDB = async (manga: Manga) => {
    try {
      const db = await initDB();
      const transaction = db.transaction([STORE_NAME, 'chunks'], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const chunksStore = transaction.objectStore('chunks');

      return new Promise<void>((resolve, reject) => {
        const mangaData = JSON.stringify(manga);
        
        if (mangaData.length > CHUNK_SIZE) {
          const chunks = chunkData(mangaData);
          const chunkIds = chunks.map((_, index) => `${manga.id}_chunk_${index}`);
          
          chunks.forEach((chunk, index) => {
            chunksStore.put({ id: chunkIds[index], data: chunk });
          });

          const chunkedManga: ChunkedManga = {
            ...manga,
            chunks: chunkIds,
            totalSize: mangaData.length,
            dateAdded: new Date().toISOString()
          };
          store.put(chunkedManga);
        } else {
          store.put({ 
            ...manga, 
            dateAdded: new Date().toISOString() 
          });
        }

        transaction.oncomplete = () => {
          db.close();
          resolve();
        };
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (error) {
      console.error('Error updating bookmark:', error);
      throw error;
    }
  };

  // Enhanced delete operation to clean up chunks
  const deleteBookmarkFromDB = async (mangaId: string) => {
    try {
      const db = await initDB();
      const transaction = db.transaction([STORE_NAME, 'chunks'], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const chunksStore = transaction.objectStore('chunks');
      
      return new Promise<void>((resolve, reject) => {
        const getRequest = store.get(mangaId);
        
        getRequest.onsuccess = () => {
          const bookmark = getRequest.result as ChunkedManga;
          if (bookmark && 'chunks' in bookmark && Array.isArray(bookmark.chunks)) {
            // Delete all chunks
            bookmark.chunks.forEach(chunkId => {
              chunksStore.delete(chunkId);
            });
          }
          // Delete the main bookmark
          store.delete(mangaId);
        };

        transaction.oncomplete = () => {
          db.close();
          resolve();
        };
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      throw error;
    }
  };

  const addBookmark = async (manga: Manga) => {
    try {
      if (!bookmarks.some(item => item.id === manga.id)) {
        await updateBookmarkInDB(manga);
        setBookmarks(prev => [...prev, manga]);
      }
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const removeBookmark = async (mangaId: string) => {
    try {
      await deleteBookmarkFromDB(mangaId);
      setBookmarks(prev => prev.filter(manga => manga.id !== mangaId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const isBookmarked = (mangaId: string) => {
    return bookmarks.some(manga => manga.id === mangaId);
  };

  return (
    <BookmarkContext.Provider 
      value={{ 
        bookmarks, 
        addBookmark, 
        removeBookmark, 
        isBookmarked,
        isLoading 
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
} 
