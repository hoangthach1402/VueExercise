<template>
  <div class="language-app bg-gray-100 min-h-screen p-4">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Menu điều hướng mới -->
      <div class="flex items-center justify-between p-4 border-b">
        <div class="flex gap-2">
          <button 
            @click="activeTab = 'learning'"
            :class="activeTab === 'learning' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
            class="px-4 py-2 rounded-md"
          >
            Học tập
          </button>
          <button 
            @click="activeTab = 'timeline'"
            :class="activeTab === 'timeline' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
            class="px-4 py-2 rounded-md"
          >
            Timeline
          </button>
        </div>
        
        <!-- Các nút khác -->
        <div class="flex gap-4">
          <button 
            @click="showHelp = true"
            class="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Help
          </button>
          <button 
            @click="showSentenceManager = !showSentenceManager"
            class="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {{ showSentenceManager ? 'Quay lại học tập' : 'Quản lý câu' }}
          </button>
        </div>
      </div>
      
      <!-- Nội dung theo tab -->
      <div class="p-6">
        <div v-if="activeTab === 'learning'">
          <!-- Nút chuyển đổi giữa học tập và quản lý câu -->
          <!-- Header với nút Quản lý câu nổi bật -->
          <div class="flex items-center justify-end gap-4 mb-6">
            <button 
              @click="showHelp = true"
              @mouseenter="triggerToast('Phím tắt: H')"
              class="px-5 py-3 text-lg font-bold bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl shadow hover:from-green-500 hover:to-green-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-200"
            >
              Help
            </button>
            <button 
              @click="showSentenceManager = !showSentenceManager"
              @mouseenter="triggerToast('Phím tắt: Ctrl+M')"
              class="px-6 py-3 text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              {{ showSentenceManager ? 'Quay lại học tập' : 'Quản lý câu' }}
            </button>
          </div>
          <!-- Sheet Help -->
          <div v-if="showHelp" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div class="bg-white rounded-xl shadow-lg max-w-lg w-full p-8 relative animate-fade-in">
              <button @click="showHelp = false" class="absolute top-2 right-2 text-2xl text-gray-500 hover:text-red-500">&times;</button>
              <h2 class="text-2xl font-bold mb-4 text-blue-700">Hướng dẫn sử dụng</h2>
              <ul class="list-disc pl-6 space-y-2 text-base text-gray-700">
                <li><b>Phím tắt chuyển chế độ học:</b> <span class="font-mono bg-gray-100 px-2 rounded">Ctrl+1</span> (Nghe Việt), <span class="font-mono bg-gray-100 px-2 rounded">Ctrl+2</span> (Nghe Anh)</li>
                <li><b>Phím tắt chuyển mức độ khó:</b> <span class="font-mono bg-gray-100 px-2 rounded">Ctrl+3</span> (25%), <span class="font-mono bg-gray-100 px-2 rounded">Ctrl+4</span> (50%), <span class="font-mono bg-gray-100 px-2 rounded">Ctrl+5</span> (75%)</li>
                <li><b>Phím nghe lại câu:</b> <span class="font-mono bg-gray-100 px-2 rounded">Ctrl+Q</span></li>
                <li><b>Phím chuyển tab Quản lý câu:</b> <span class="font-mono bg-gray-100 px-2 rounded">Ctrl+M</span></li>
                <li><b>Phím qua câu tiếp theo:</b> <span class="font-mono bg-gray-100 px-2 rounded">Ctrl+Enter</span> hoặc <span class="font-mono bg-gray-100 px-2 rounded">Ctrl+Space</span></li>
                <li><b>Thêm từ nhanh:</b> Khi nhập từ mới, dùng dấu <span class="font-mono">.</span> để phân tách tiếng Anh và tiếng Việt, ví dụ: <span class="font-mono bg-gray-100 px-2 rounded">hello.xin chào</span> sẽ tự động thêm "hello" (Anh) và "xin chào" (Việt).</li>
                <li><b>Phím tắt điều chỉnh tốc độ âm thanh:</b> <span class="font-mono bg-gray-100 px-2 rounded">Ctrl+D</span> (giảm tốc độ), <span class="font-mono bg-gray-100 px-2 rounded">Ctrl+F</span> (tăng tốc độ)</li>
              </ul>
            </div>
          </div>
          <div class="p-6">

            <!-- Hiển thị SentenceManager hoặc giao diện học tập -->
            <SentenceManager v-if="showSentenceManager" />
            
            <div v-else>
            <!-- Layout chia 2 bên: trái là chế độ học + độ khó, phải là hình ảnh -->
            <div class="flex flex-row gap-8 items-start mb-6">
              <!-- Bên trái: chế độ học + độ khó -->
              <div class="flex flex-col gap-6 flex-1 min-w-0">
                <!-- Chọn chế độ học -->
                <div>
                  <h2 class="text-lg font-semibold mb-3">Chọn chế độ học:</h2>
                  <div class="flex flex-wrap gap-2">
                    <button 
                      v-for="(mode, idx) in learningModes" 
                      :key="mode.id"
                      @click="selectMode(mode.id)"
                      @mouseenter="triggerToast('Phím tắt: Ctrl+' + (idx+1))"
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
                <div>
                  <h2 class="text-lg font-semibold mb-3">Độ khó:</h2>
                  <div class="flex flex-wrap gap-2">
                    <button 
                      v-for="(level, idx) in difficultyLevels" 
                      :key="level.id"
                      @click="selectDifficulty(level.id)"
                      @mouseenter="triggerToast('Phím tắt: Ctrl+' + (idx+3))"
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
              </div>
              <!-- Bên phải: hình ảnh minh họa -->
              <div v-if="imageHintUrl" class="flex-1 flex justify-center items-start min-w-[120px] max-w-[220px]">
                <img :src="imageHintUrl" alt="Gợi ý hình ảnh" class="w-full max-h-40 rounded-xl shadow border-2 border-blue-300 object-contain bg-white p-1"/>
              </div>
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
                  <div v-if="shouldPlayAudio" class="flex items-center gap-4 relative">
  <button @click="playAudio" class="bg-blue-500 text-white p-2 rounded-full" @mouseenter="showAudioHint = true" @mouseleave="showAudioHint = false">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  </button>
  <span class="text-sm text-gray-600">Nhấn để nghe</span>
  <!-- Thanh trượt tốc độ phát âm -->
  <div class="flex items-center gap-2 ml-2">
    <input 
      type="range" 
      min="0" 
      max="3" 
      step="1"
      v-model="speechSpeedIndex"
      class="w-[100px] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      style="vertical-align: middle;"
    />
    <span class="text-xs font-medium min-w-[36px]">{{ speechSpeed }}x</span>
  </div>
  <transition name="fade">
    <div v-if="showAudioHint" class="absolute left-1/2 top-full mt-2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 z-20 shadow-lg whitespace-nowrap">
      Ctrl+Q để nghe lại
    </div>
  </transition>
</div>
            </div>

            <!-- Khu vực typing -->
            <div class="typing-area relative pointer-events-none" @click="focusInput">
              <h3 class="text-md font-medium mb-2">{{ typingPrompt }}</h3>
               <div 
                 class="p-4 bg-white border-2 border-gray-300 rounded-md font-mono text-lg select-none"
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
            <div class="mt-2 text-base text-green-800 bg-green-50 rounded p-2 border border-green-200">
              Nghĩa tiếng Việt: <span class="font-semibold">{{ currentSentence.vietnamese }}</span>
            </div>
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

        
      </div>
    </div>
    
  </div>
  <div v-if="activeTab === 'timeline'">
    <!-- Giao diện timeline -->
    <TimelineView />
  </div>
  </div>
  </div>  
  </div>
</template>

<script setup>
import { ref, computed , onMounted, onUnmounted} from 'vue';
import TimelineView from '../../views/TimelineView.vue';
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
  { id: 'listenEnglishTypeEnglish', name: 'Nghe Anh → Type Anh' }
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

const speechSpeed = ref(1); // 1 = bình thường
const SPEED_LEVELS = [0.25, 0.5, 0.75, 1];

const speechSpeedIndex = computed({
  get: () => SPEED_LEVELS.indexOf(speechSpeed.value),
  set: (val) => { speechSpeed.value = SPEED_LEVELS[val]; }
});

const adjustSpeed = (direction) => {
  const currentIdx = SPEED_LEVELS.indexOf(speechSpeed.value);
  let newIdx = currentIdx + (direction === 'up' ? 1 : -1);
  newIdx = Math.max(0, Math.min(newIdx, SPEED_LEVELS.length - 1));
  speechSpeed.value = SPEED_LEVELS[newIdx];
  triggerToast(`Tốc độ: ${speechSpeed.value}x`);
};

const playAudio = async () => {
  const textToSpeak = currentMode.value.startsWith('listen') ?
    (currentMode.value === 'listenVietnameseTypeEnglish' ? currentSentence.value.vietnamese : currentSentence.value.eng) : '';

  if (!textToSpeak) return;

  const languageCode = currentMode.value === 'listenVietnameseTypeEnglish' ? 'vi-VN' : 'en-US';

  try {
    const audioSrc = await synthesizeSpeech(textToSpeak, languageCode);
    const audio = new Audio(audioSrc);
    audio.volume = 1.0;
    audio.playbackRate = speechSpeed.value; // Áp dụng tốc độ
    audio.play();
  } catch (error) {
    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = languageCode;
      utterance.rate = 0.9 * speechSpeed.value; // Điều chỉnh rate theo tốc độ
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
  // Chặn tất cả phím Ctrl khi đang typing
  if (event.ctrlKey) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

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
  // Mặc định mở chức năng Ctrl+2 khi vào
  selectMode('listenEnglishTypeEnglish');
  // Tự phát âm thanh khi vào
  setTimeout(() => {
    playAudio();
  }, 500);
});

// Lắng nghe phím tắt
onMounted(() => {
  updateImageHint();
  // Lắng nghe phím tắt
  window.addEventListener('keydown', (e) => {
    // Ignore global shortcuts when focus is in an input or textarea
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    
    // Ctrl+1,2 để chuyển chế độ học, Ctrl+3,4,5 để chuyển mức độ khó
    if (e.ctrlKey && !e.shiftKey && !e.altKey) {
      if (e.key === '1' || e.key === '2') {
        const idx = Number(e.key) - 1;
        if (learningModes[idx]) {
          selectMode(learningModes[idx].id);
          triggerToast(`Chế độ: ${idx+1} - ${learningModes[idx].name}`);
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
      // Ctrl+3,4,5 để chuyển mức độ khó
      if (e.key === '3' || e.key === '4' || e.key === '5') {
        const levelIdx = { '3': 0, '4': 1, '5': 2 }[e.key];
        if (difficultyLevels[levelIdx]) {
          selectDifficulty(difficultyLevels[levelIdx].id);
          triggerToast(`Độ khó: ${difficultyLevels[levelIdx].name} (${difficultyLevels[levelIdx].maskPercentage}%)`);
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
      // Ctrl+M để chuyển tab Quản lý câu
      if ((e.key === 'm' || e.key === 'M')) {
        showSentenceManager.value = !showSentenceManager.value;
        triggerToast('Chuyển tab Quản lý câu (Ctrl+M)');
        e.preventDefault();
        return;
      }
      // Ctrl+B để quay lại màn hình chính
      if ((e.key === 'b' || e.key === 'B')) {
        if (showSentenceManager.value) {
          showSentenceManager.value = false;
          triggerToast('Quay lại màn hình chính (Ctrl+B)');
          e.preventDefault();
          return;
        }
      }
      // Ctrl+Q để phát lại âm thanh
      if ((e.key === 'q' || e.key === 'Q') && shouldPlayAudio.value) {
        playAudio();
        showAudioHint.value = true;
        setTimeout(() => showAudioHint.value = false, 1200);
        e.preventDefault();
        e.stopImmediatePropagation(); // Ngăn không cho ký tự Q dính vào input
        return;
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
      // Ctrl+D để giảm tốc độ âm thanh
      if ((e.key === 'd' || e.key === 'D')) {
        adjustSpeed('down');
        e.preventDefault();
      }
      // Ctrl+F để tăng tốc độ âm thanh
      if ((e.key === 'f' || e.key === 'F')) {
        adjustSpeed('up');
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

const activeTab = ref('learning');
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