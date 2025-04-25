import axios from 'axios';

// Google Cloud Text-to-Speech API key (dùng chung với translateService)
const API_KEY = 'AIzaSyBtFZsvVmvzkFEpiGMkXOrGCivMGOTkZgw';
const BASE_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

/**
 * Sử dụng Google Cloud Text-to-Speech API để chuyển văn bản thành âm thanh
 * @param {string} text - Văn bản cần đọc
 * @param {string} languageCode - Mã ngôn ngữ (ví dụ: 'en-US', 'vi-VN')
 * @param {string} voiceName - Tên giọng đọc (tùy chọn)
 * @returns {Promise<string>} - Đường dẫn base64 của file âm thanh mp3
 */
export const synthesizeSpeech = async (text, languageCode = 'en-US', voiceName = '') => {
  try {
    const data = {
      input: { text },
      voice: {
        languageCode,
        name: voiceName || undefined,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0,
      },
    };
    const response = await axios.post(`${BASE_URL}?key=${API_KEY}`, data);
    if (response.data && response.data.audioContent) {
      return `data:audio/mp3;base64,${response.data.audioContent}`;
    }
    throw new Error('TTS failed');
  } catch (error) {
    console.error('TTS error:', error);
    throw error;
  }
};
