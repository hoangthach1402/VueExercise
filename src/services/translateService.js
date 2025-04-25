import axios from 'axios';

// Google Cloud Translation API key
const API_KEY = 'AIzaSyBtFZsvVmvzkFEpiGMkXOrGCivMGOTkZgw';
const BASE_URL = 'https://translation.googleapis.com/language/translate/v2';

/**
 * Translates text using Google Cloud Translation API
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'en', 'vi')
 * @param {string} sourceLanguage - Source language code (optional)
 * @returns {Promise<string>} - Translated text
 */
export const translateText = async (text, targetLanguage, sourceLanguage = '') => {
  try {
    const params = {
      q: text,
      target: targetLanguage,
      key: API_KEY,
    };
    
    // Add source language if provided
    if (sourceLanguage) {
      params.source = sourceLanguage;
    }
    
    const response = await axios.get(BASE_URL, { params });
    
    if (response.data && 
        response.data.data && 
        response.data.data.translations && 
        response.data.data.translations.length > 0) {
      return response.data.data.translations[0].translatedText;
    }
    
    throw new Error('Translation failed');
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

/**
 * Detect language of text
 * @param {string} text - Text to detect language for
 * @returns {Promise<string>} - Language code
 */
export const detectLanguage = async (text) => {
  try {
    const response = await axios.get(`${BASE_URL}/detect`, {
      params: {
        q: text,
        key: API_KEY
      }
    });
    
    if (response.data && 
        response.data.data && 
        response.data.data.detections && 
        response.data.data.detections.length > 0 &&
        response.data.data.detections[0].length > 0) {
      return response.data.data.detections[0][0].language;
    }
    
    throw new Error('Language detection failed');
  } catch (error) {
    console.error('Language detection error:', error);
    throw error;
  }
};
