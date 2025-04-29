import { ref } from 'vue';

export function useGoogleTranslate() {
  const speak = (text) => {
    try {
      // First try browser's built-in speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set Vietnamese voice if available
        const voices = window.speechSynthesis.getVoices();
        const vietnameseVoice = voices.find(voice => 
          voice.lang === 'vi-VN' || voice.lang.startsWith('vi-')
        );
        
        if (vietnameseVoice) {
          utterance.voice = vietnameseVoice;
          utterance.lang = 'vi-VN';
        } else {
          console.warn('Vietnamese voice not available, using default');
        }
        
        window.speechSynthesis.speak(utterance);
        return;
      }
      
      // Fallback to Google Translate if available
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'vi',
          includedLanguages: 'vi,en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        window.speechSynthesis.speak(utterance);
      } else {
        console.warn('Speech synthesis not available');
      }
    } catch (error) {
      console.error('Error in speech synthesis:', error);
    }
  };

  return { speak };
}
