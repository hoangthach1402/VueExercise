import axios from 'axios';

// Google Custom Search API
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CX = import.meta.env.VITE_GOOGLE_CSE_ID;

/**
 * Tìm kiếm ảnh minh họa từ Google Custom Search
 * @param {string} query - Từ khóa tìm kiếm ảnh
 * @returns {Promise<string|null>} - Link ảnh đầu tiên hoặc null nếu không tìm được
 */
export async function fetchImageForKeyword(query) {
  try {
    const params = {
      key: API_KEY,
      cx: CX,
      searchType: 'image',
      q: query,
      num: 1,
      safe: 'active',
    };
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', { params });
    if (
      response.data &&
      response.data.items &&
      response.data.items.length > 0 &&
      response.data.items[0].link
    ) {
      return response.data.items[0].link;
    }
    return null;
  } catch (error) {
    console.error('Image search error:', error);
    return null;
  }
}
