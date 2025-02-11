const API_BASE_URL = 'https://mangabat-beta.vercel.app/api';

export const getMangaList = async (page: number = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/manga/latest/${page}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch manga list');
    return await response.json();
  } catch (error) {
    console.error('Error fetching manga list:', error);
    return { results: [] }; // Return empty results instead of throwing
  }
};

export const getPopularManga = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/manga/popular-this-month`);
    if (!response.ok) throw new Error('Failed to fetch popular manga');
    return await response.json();
  } catch (error) {
    console.error('Error fetching popular manga:', error);
    return [];
  }
};

export const getMangaDetails = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/manga/details/${id}`);
    if (!response.ok) throw new Error('Failed to fetch manga details');
    return await response.json();
  } catch (error) {
    console.error('Error fetching manga details:', error);
    return null;
  }
}; 