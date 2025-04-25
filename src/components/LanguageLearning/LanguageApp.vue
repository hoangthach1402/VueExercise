<template>
  <div class="language-app bg-gray-100 min-h-screen p-4">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Nút chuyển đổi giữa học tập và quản lý câu -->
      <div class="bg-gray-200 p-2 flex justify-end">
        <button 
          @click="showSentenceManager = !showSentenceManager" 
          class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
        >
          {{ showSentenceManager ? 'Quay lại học tập' : 'Quản lý câu' }}
        </button>
      </div>
      <header class="bg-blue-600 text-white p-4">
        <h1 class="text-2xl font-bold">Học Ngôn Ngữ Qua Typing</h1>
        <p class="text-sm opacity-80">Luyện tập Anh-Việt thông qua kỹ năng gõ phím</p>
      </header>

      <div class="p-6">
        <!-- Hiển thị SentenceManager hoặc giao diện học tập -->
        <SentenceManager v-if="showSentenceManager" />
        
        <div v-else>
        <!-- Chọn chế độ học -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-3">Chọn chế độ học:</h2>
          <div class="flex flex-wrap gap-2">
  <button 
    v-for="(mode, idx) in learningModes" 
    :key="mode.id"
    @click="selectMode(mode.id)"
    :class="[
      'px-4 py-2 rounded-md transition-colors border-2',
      currentMode === mode.id 
        ? 'bg-blue-700 text-white border-blue-900 shadow font-bold' 
        : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-300'
    ]"
  >
    <span class="font-bold mr-1">{{ idx + 1 }}</span> {{ mode.name }}
  </button>
</div>
        </div>

        <!-- Chọn độ khó -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-3">Độ khó:</h2>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="level in difficultyLevels" 
              :key="level.id"
              @click="selectDifficulty(level.id)"
              :class="[
                'px-4 py-2 rounded-md transition-colors border-2',
                currentDifficulty === level.id 
                  ? 'bg-green-700 text-white border-green-900 shadow font-bold' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-300'
              ]"
            >
              {{ level.name }} ({{ level.maskPercentage }}%)
            </button>
          </div>
        </div>

        <!-- Gợi ý hình ảnh minh họa -->
        <div v-if="imageHintUrl" class="flex justify-center mb-4">
          <img :src="imageHintUrl" alt="Gợi ý hình ảnh" class="max-h-40 rounded-xl shadow border-2 border-blue-300 object-contain bg-white p-1"/>
        </div>
        <!-- Hiển thị câu và bài tập -->
        <div class="p-4 rounded-lg mb-6 transition-colors duration-700"
  :class="[
    feedbackBg === 'success' ? 'bg-blue-100' : '',
    feedbackBg === 'fail' ? 'bg-red-100' : '',
    !feedbackBg ? 'bg-gray-50' : ''
  ]"
>
          <div v-if="currentSentence" class="mb-4">
            <!-- Hiển thị câu gốc hoặc phát âm thanh tùy theo chế độ -->
            <div class="mb-4">
              <div v-if="showSourceText" class="text-lg font-medium mb-2">
                {{ isVietnameseSource ? currentSentence.vietnamese : currentSentence.eng }}
              </div>
              <div v-if="shouldPlayAudio" class="flex items-center gap-2 relative">
  <button @click="playAudio" class="bg-blue-500 text-white p-2 rounded-full" @mouseenter="showAudioHint = true" @mouseleave="showAudioHint = false">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  </button>
  <span class="text-sm text-gray-600">Nhấn để nghe</span>
  <transition name="fade">
    <div v-if="showAudioHint" class="absolute left-1/2 top-full mt-2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 z-20 shadow-lg whitespace-nowrap">
      Ctrl+Q để nghe lại
    </div>
  </transition>
</div>
            </div>

            <!-- Khu vực typing -->
            <div class="typing-area relative" @click="focusInput">
              <h3 class="text-md font-medium mb-2">{{ typingPrompt }}</h3>
              <div 
                class="p-4 bg-white border-2 border-gray-300 rounded-md font-mono text-lg"
                :class="{'border-green-500': isCompleted && isCorrect, 'border-red-500': isCompleted && !isCorrect}"
              >
                <template v-if="currentMode === 'readVietnameseTypeEnglish' || currentMode === 'listenEnglishTypeEnglish' || currentMode === 'listenVietnameseTypeEnglish'">
                  <div class="flex flex-wrap">
                    <template v-for="(char, index) in maskedTargetText" :key="index">
  <!-- Render space as a visible gap -->
  <span v-if="targetText[index] === ' '" class="inline-block w-4"></span>
  <span 
    v-else-if="char !== '_'"
    class="inline-block mr-1"
  >{{ char }}</span>
  <span 
    v-else
    class="inline-block min-w-6 border-b-2 border-gray-400 mx-1 px-1 text-center"
    :class="{
      'border-green-500 bg-green-100': userInput[index] && userInput[index] === targetText[index],
      'border-red-500 bg-red-100': userInput[index] && userInput[index] !== targetText[index],
      'border-blue-500 bg-blue-50': userInput[index] === ' '
    }"
  >{{ userInput[index] || '' }}</span>
</template>
                  </div>
                  <div class="text-xs text-gray-500 mt-2">
                    <span>Sử dụng <span class="font-mono bg-gray-100 px-1 rounded">← →</span> để di chuyển, <span class="font-mono bg-gray-100 px-1 rounded">Enter</span> để kiểm tra hoặc chuyển câu</span>
                  </div>
                </template>
                <template v-else-if="currentMode === 'readEnglishTranslate'">
                  <textarea 
                    v-model="userTranslation" 
                    class="w-full p-2 border border-gray-300 rounded" 
                    rows="3"
                    placeholder="Nhập bản dịch của bạn..."
                  ></textarea>
                </template>
              </div>
              <input ref="hiddenInput" v-model="mobileInput" @keydown="handleKeyInput" type="text"
                class="absolute inset-0 w-full h-full opacity-0"
                inputmode="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
            </div>

            <!-- Nút kiểm tra và chuyển câu -->
            <div class="mt-4 flex justify-between">
              <button 
                @click="checkAnswer" 
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                :disabled="isCompleted"
              >
                Kiểm tra
              </button>
              <button 
                @click="nextSentence" 
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                :disabled="!isCompleted"
              >
                Câu tiếp theo
              </button>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-gray-600">Đang tải câu hỏi...</p>
          </div>
        </div>

        <!-- Kết quả và đánh giá -->
        <div v-if="isCompleted" class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-semibold text-lg mb-2">Kết quả:</h3>
          <div v-if="isCorrect" class="text-green-600 font-medium">
            Chính xác! Rất tốt.
          </div>
          <div v-else class="text-red-600 font-medium mb-2">
            Chưa chính xác. Hãy thử lại.
          </div>
          <div v-if="!isCorrect" class="mt-2">
            <p class="font-medium">Đáp án đúng:</p>
            <p class="bg-green-50 p-2 rounded border border-green-200 mt-1">{{ targetText }}</p>
          </div>
        </div>
        
        <!-- Thống kê học tập -->
        <div class="mt-6 bg-blue-50 p-4 rounded-lg">
          <h3 class="font-semibold text-lg mb-2">Tiến độ học tập:</h3>
          <div class="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div 
              class="bg-blue-600 h-4 rounded-full transition-all duration-500" 
              :style="{ width: `${languageStore.progressPercentage}%` }"
            ></div>
          </div>
          <div class="text-sm text-gray-600">
            Tỷ lệ đúng: {{ languageStore.progressPercentage }}% ({{ languageStore.userStats.correctAnswers }}/{{ languageStore.userStats.totalAttempts }})
          </div>
        </div>
        </div> <!-- Đóng thẻ div cho v-else -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { fetchImageForKeyword } from '../../services/imageSearchService';

// Hiển thị tooltip/toast cho nút âm thanh
const showAudioHint = ref(false);

// Toast UI
const toastMsg = ref("");
const showToast = ref(false);
function triggerToast(msg) {
  toastMsg.value = msg;
  showToast.value = true;
  setTimeout(() => showToast.value = false, 1200);
}


import { useLanguageStore } from '../../stores/languageStore';
import SentenceManager from './SentenceManager.vue';
import { translateText } from '../../services/translateService';
import soundService from '../../services/soundService';

// Sử dụng store
const languageStore = useLanguageStore();

// Các chế độ học
const learningModes = [
  { id: 'listenVietnameseTypeEnglish', name: 'Nghe Việt → Type Anh' },
  { id: 'listenEnglishTypeEnglish', name: 'Nghe Anh → Type Anh' },
  { id: 'readVietnameseTypeEnglish', name: 'Đọc Việt → Type Anh' },
  { id: 'readEnglishTranslate', name: 'Đọc Anh → Giải nghĩa' },
];

// Các mức độ khó
const difficultyLevels = [
  { id: 'easy', name: 'Dễ', maskPercentage: 25 },
  { id: 'medium', name: 'Trung bình', maskPercentage: 50 },
  { id: 'hard', name: 'Khó', maskPercentage: 75 },
];

// State
const userInput = ref([]);
const userTranslation = ref('');
const isCompleted = ref(false);
const isCorrect = ref(false);
const showSentenceManager = ref(false);
const autoAdvance = ref(true); // Auto-advance to next sentence when correct

// Computed properties
const currentSentence = computed(() => {
  return languageStore.currentSentence;
});

const currentMode = computed({
  get: () => languageStore.currentMode,
  set: (value) => languageStore.setMode(value)
});

const currentDifficulty = computed({
  get: () => languageStore.currentDifficulty,
  set: (value) => languageStore.setDifficulty(value)
});

const targetText = computed(() => {
  if (currentMode.value === 'readEnglishTranslate') {
    return currentSentence.value.vietnamese;
  } else {
    return currentSentence.value.eng;
  }
});

const maskedTargetText = computed(() => {
  if (currentMode.value === 'readEnglishTranslate') {
    return targetText.value;
  }
  
  const text = targetText.value;
  const maskPercentage = difficultyLevels.find(level => level.id === currentDifficulty.value).maskPercentage;
  
  // Masking text for typing exercises
  const maskText = (text, maskPercentage) => {
    const chars = text.split('');
    const totalChars = chars.length;
    
    // Không che những ký tự đặc biệt và khoảng trắng
    const maskableIndices = [];
    for (let i = 0; i < chars.length; i++) {
      if (/[a-zA-Z0-9]/.test(chars[i])) {
        maskableIndices.push(i);
      }
    }
    
    const charsToMask = Math.min(Math.floor(totalChars * (maskPercentage / 100)), maskableIndices.length);
    
    // Shuffle the maskable indices and select the first 'charsToMask'
    const shuffled = [...maskableIndices].sort(() => 0.5 - Math.random());
    const indicesToMask = shuffled.slice(0, charsToMask);
    
    // Create masked text
    const maskedChars = [...chars];
    indicesToMask.forEach(index => {
      maskedChars[index] = '_';
    });
    
    return maskedChars.join('');
  };
  
  return maskText(text, maskPercentage);
});

const showSourceText = computed(() => {
  return currentMode.value === 'readVietnameseTypeEnglish' || 
         currentMode.value === 'readEnglishTranslate';
});

const shouldPlayAudio = computed(() => {
  return currentMode.value === 'listenVietnameseTypeEnglish' || 
         currentMode.value === 'listenEnglishTypeEnglish';
});

const isVietnameseSource = computed(() => {
  return currentMode.value === 'readVietnameseTypeEnglish' || 
         currentMode.value === 'listenVietnameseTypeEnglish';
});

const typingPrompt = computed(() => {
  switch (currentMode.value) {
    case 'readVietnameseTypeEnglish':
      return 'Điền vào chỗ trống để hoàn thành câu tiếng Anh:';
    case 'listenVietnameseTypeEnglish':
      return 'Điền vào chỗ trống sau khi nghe câu tiếng Việt:';
    case 'listenEnglishTypeEnglish':
      return 'Điền vào chỗ trống sau khi nghe câu tiếng Anh:';
    case 'readEnglishTranslate':
      return 'Dịch câu tiếng Anh sang tiếng Việt:';
    default:
      return 'Hoàn thành bài tập:';
  }
});

// Methods
const selectMode = (modeId) => {
  currentMode.value = modeId;
  resetExercise();
};

const selectDifficulty = (difficultyId) => {
  currentDifficulty.value = difficultyId;
  resetExercise();
};

const resetExercise = () => {
  userInput.value = [];
  userTranslation.value = '';
  isCompleted.value = false;
  isCorrect.value = false;
};

const checkAnswer = async () => {
  if (isCompleted.value) return;
  
  let correct = false;
  
  if (currentMode.value === 'readEnglishTranslate') {
    // Kiểm tra tương đồng văn bản đối với bản dịch
    const cleanedInput = userTranslation.value.trim().toLowerCase();
    const cleanedTarget = currentSentence.value.vietnamese.trim().toLowerCase();
    
    try {
      // Sử dụng Google Translate API để so sánh với bản dịch chuẩn
      const translatedInput = await translateText(userTranslation.value, 'vi', 'en');
      const normalizedTranslation = translatedInput.trim().toLowerCase();
      
      // Áp dụng thuật toán đo lường tương đồng
      const similarity = calculateSimilarity(normalizedTranslation, cleanedTarget);
      correct = similarity > 0.7; // Ngưỡng tương đồng 70%
    } catch (error) {
      console.error('Translate error:', error);
      // Fallback nếu API lỗi
      const similarity = calculateSimilarity(cleanedInput, cleanedTarget);
      correct = similarity > 0.7;
    }
  } else {
    // Đối với các chế độ typing
    let isAllCorrect = true;
    const maskedChars = maskedTargetText.value.split('');
    
    // Kiểm tra từng vị trí bị che, bỏ qua khoảng trắng
    for (let i = 0; i < maskedChars.length; i++) {
      if (targetText.value[i] === ' ') continue; // Bỏ qua vị trí là khoảng trắng
      if (maskedChars[i] === '_') {
        // Nếu vị trí này cần điền nhưng không có giá trị hoặc sai giá trị
        if (!userInput.value[i] || userInput.value[i] !== targetText.value[i]) {
          isAllCorrect = false;
          break;
        }
      }
    }
    
    correct = isAllCorrect;
  }
  
  isCompleted.value = true;
  isCorrect.value = correct;
  
  // Phát âm thanh phản hồi
  try {
    if (correct) {
      soundService.playCorrect();
    } else {
      soundService.playIncorrect();
    }
  } catch (error) {
    console.error('Error playing sound:', error);
  }
  
  // Cập nhật thống kê
  languageStore.recordAttempt(correct);
  
  // Tự động chuyển câu tiếp theo sau 2 giây nếu đúng
  if (correct && autoAdvance.value) {
    setTimeout(() => {
      nextSentence();
    }, 2000);
  }
};

// Hàm tính toán độ tương đồng văn bản
const calculateSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;
  
  // Phân tách thành các từ và chuẩn hóa
  const words1 = text1.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  const words2 = text2.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  
  // Tìm số từ trùng khớp
  const commonWords = words1.filter(word => words2.includes(word));
  
  // Tính tỷ lệ
  return commonWords.length / Math.max(words1.length, words2.length, 1);
};

const LOCAL_INDEX_KEY = 'language_current_index';
const feedbackBg = ref("");
const imageHintUrl = ref("");
const mobileInput = ref('');

const getImageHintKeyword = () => {
  // Ưu tiên lấy câu tiếng Anh hiện tại làm từ khóa gợi ý
  if (languageStore.currentSentence && languageStore.currentSentence.eng) {
    return languageStore.currentSentence.eng;
  }
  return '';
};

const updateImageHint = async () => {
  const keyword = getImageHintKeyword();
  if (!keyword) {
    imageHintUrl.value = '';
    return;
  }
  const url = await fetchImageForKeyword(keyword);
  imageHintUrl.value = url || '';
};
const nextSentence = async () => {

  // Hiệu ứng màu nền theo kết quả câu trước
  if (isCompleted.value) {
    feedbackBg.value = isCorrect.value ? 'success' : 'fail';
    setTimeout(() => {
      feedbackBg.value = '';
    }, 700);
  }
  languageStore.nextSentence();
  localStorage.setItem(LOCAL_INDEX_KEY, String(languageStore.currentSentenceIndex));
  resetExercise();
  await updateImageHint();
};

import { synthesizeSpeech } from '../../services/ttsService';

const playAudio = async () => {
  const textToSpeak = currentMode.value.startsWith('listen') ?
    (currentMode.value === 'listenVietnameseTypeEnglish' ? currentSentence.value.vietnamese : currentSentence.value.eng) : '';

  if (!textToSpeak) return;

  // Xác định ngôn ngữ
  const languageCode = currentMode.value === 'listenVietnameseTypeEnglish' ? 'vi-VN' : 'en-US';

  try {
    // Sử dụng Google Cloud TTS
    const audioSrc = await synthesizeSpeech(textToSpeak, languageCode);
    const audio = new Audio(audioSrc);
    audio.volume = 1.0;
    audio.play();
  } catch (error) {
    // Nếu lỗi, fallback về Web Speech API
    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = languageCode;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis failed:', err);
    }
  }
};

// Xử lý sự kiện nhập liệu
const handleKeyInput = (event) => {
  if (isCompleted.value) return;
  
  // Xử lý phím Enter để kiểm tra hoặc chuyển câu tiếp theo
  if (event.key === 'Enter') {
    if (isCompleted.value) {
      nextSentence();
    } else {
      checkAnswer();
    }
    return;
  }
  
  if (currentMode.value !== 'readEnglishTranslate') {
    const maskedChars = maskedTargetText.value.split('');
    const key = event.key;
    
    // Tìm các vị trí cần điền (chỉ những vị trí có '_')
    const emptyPositions = [];
    for (let i = 0; i < maskedChars.length; i++) {
      if (maskedChars[i] === '_') {
        emptyPositions.push(i);
      }
    }
    
    // Khởi tạo mảng userInput nếu cần
    if (!userInput.value.length) {
      userInput.value = new Array(maskedChars.length).fill('');
    }
    
    // Tìm vị trí con trỏ hiện tại
    let currentPosition = -1;
    for (let i = 0; i < emptyPositions.length; i++) {
      const pos = emptyPositions[i];
      if (!userInput.value[pos]) {
        currentPosition = pos;
        break;
      }
    }
    
    // Nếu không tìm thấy vị trí trống, gắn vị trí cuối cùng
    if (currentPosition === -1 && emptyPositions.length > 0) {
      const filledPositions = emptyPositions.filter(pos => userInput.value[pos]);
      if (filledPositions.length > 0) {
        currentPosition = filledPositions[filledPositions.length - 1];
      } else if (emptyPositions.length > 0) {
        currentPosition = emptyPositions[0];
      }
    }
    
    // Xử lý phím
    if (key.length === 1) {
      // Chỉ xử lý phím gõ khi có vị trí trống cần điền
      if (currentPosition !== -1) {
        // Phát âm thanh khi gõ
        try {
          soundService.playTypingSound();
        } catch (err) {
          console.error('Error playing typing sound:', err);
        }
        
        const newInputArray = [...userInput.value];
        newInputArray[currentPosition] = key;
        userInput.value = newInputArray;
      }
    } else if (key === 'Backspace') {
      // Tìm vị trí cần xóa (vị trí đã điền gần nhất)
      let posToDelete = -1;
      for (let i = emptyPositions.length - 1; i >= 0; i--) {
        const pos = emptyPositions[i];
        if (userInput.value[pos]) {
          posToDelete = pos;
          break;
        }
      }
      
      if (posToDelete !== -1) {
        const newInputArray = [...userInput.value];
        newInputArray[posToDelete] = '';
        userInput.value = newInputArray;
      }
    } else if (key === ' ') {
      // Xử lý khoảng trắng
      if (currentPosition !== -1) {
        const newInputArray = [...userInput.value];
        newInputArray[currentPosition] = ' ';
        userInput.value = newInputArray;
      }
    } else if (key === 'ArrowRight') {
      // Tìm vị trí trống tiếp theo sau vị trí hiện tại
      if (currentPosition !== -1) {
        let nextPos = -1;
        for (let i = 0; i < emptyPositions.length; i++) {
          if (emptyPositions[i] > currentPosition) {
            nextPos = emptyPositions[i];
            break;
          }
        }
        
        if (nextPos !== -1) {
          // Di chuyển đến vị trí tiếp theo bằng cách đặt giá trị trống
          const newInputArray = [...userInput.value];
          for (let i = currentPosition + 1; i < nextPos; i++) {
            if (maskedChars[i] === '_' && !newInputArray[i]) {
              newInputArray[i] = '';
            }
          }
          userInput.value = newInputArray;
        }
      }
    } else if (key === 'ArrowLeft') {
      // Tìm vị trí trống trước vị trí hiện tại
      if (currentPosition !== -1) {
        let prevPos = -1;
        for (let i = emptyPositions.length - 1; i >= 0; i--) {
          if (emptyPositions[i] < currentPosition) {
            prevPos = emptyPositions[i];
            break;
          }
        }
        
        if (prevPos !== -1) {
          // Xóa giá trị ở vị trí hiện tại để di chuyển con trỏ
          const newInputArray = [...userInput.value];
          if (newInputArray[currentPosition]) {
            newInputArray[currentPosition] = '';
            userInput.value = newInputArray;
          }
        }
      }
    }
  }
};

const focusInput = () => {
  const hiddenInput = $refs.hiddenInput;
  hiddenInput.focus();
};

// LocalStorage sync cho câu hỏi
import { onMounted as onMountedVue } from 'vue';
const LOCAL_KEY = 'language_sentences';
const loadSentencesFromLocal = () => {
  const data = localStorage.getItem(LOCAL_KEY);
  if (data) {
    try {
      const arr = JSON.parse(data);
      if (Array.isArray(arr)) {
        languageStore.sentences.splice(0, languageStore.sentences.length, ...arr);
      }
    } catch {}
  }
  // Khôi phục vị trí câu đang học
  const idx = localStorage.getItem(LOCAL_INDEX_KEY);
  if (idx !== null && !isNaN(Number(idx))) {
    languageStore.currentSentenceIndex = Number(idx);
  }
};

onMountedVue(() => {
  loadSentencesFromLocal();
});

// Lắng nghe phím tắt
onMounted(() => {
  updateImageHint();
  // Lắng nghe phím tắt
  window.addEventListener('keydown', (e) => {
    // Ctrl+1,2,3,4 để chuyển chế độ học
    if (e.ctrlKey && !e.shiftKey && !e.altKey) {
      if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4') {
        const idx = Number(e.key) - 1;
        if (learningModes[idx]) {
          selectMode(learningModes[idx].id);
          triggerToast(`Chế độ: ${idx+1} - ${learningModes[idx].name}`);
          e.preventDefault();
        }
      }
      // Ctrl+E để phát lại âm thanh
      if ((e.key === 'q' || e.key === 'Q') && shouldPlayAudio.value) {
        playAudio();
        showAudioHint.value = true;
        setTimeout(() => showAudioHint.value = false, 1200);
        e.preventDefault();
        e.stopImmediatePropagation(); // Ngăn gọi playAudio lần 2
      }
      // Ctrl+Space để kiểm tra hoặc qua câu mới
      if (e.code === 'Space' && e.ctrlKey) {
        if (!isCompleted.value) {
          checkAnswer();
          triggerToast('Đã kiểm tra đáp án (Ctrl+Space)');
        } else {
          nextSentence();
          triggerToast('Đã chuyển sang câu tiếp theo (Ctrl+Space)');
        }
        e.preventDefault();
      }
      // Ctrl+S để chuyển tab Quản lý câu/học tập
      if ((e.key === 's' || e.key === 'S')) {
        showSentenceManager.value = !showSentenceManager.value;
        triggerToast(showSentenceManager.value ? 'Chuyển sang Quản lý câu (Ctrl+S)' : 'Quay lại Học tập (Ctrl+S)');
        e.preventDefault();
      }
    }
  });
  // Lắng nghe phím nhập liệu thông thường
  window.addEventListener('keydown', handleKeyInput);

  // Cleanup khi component unmount
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyInput);
  });
});
</script>

<style scoped>
.typing-area {
  font-family: 'Courier New', monospace;
}

/* Animation cho feedback */
@keyframes correctPulse {
  0% { box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(72, 187, 120, 0); }
  100% { box-shadow: 0 0 0 0 rgba(72, 187, 120, 0); }
}

@keyframes incorrectShake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.border-green-500 {
  animation: correctPulse 1.5s;
}

.border-red-500 {
  animation: incorrectShake 0.5s;
}
</style>