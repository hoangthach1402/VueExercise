<template>
  <div class="sentence-manager bg-white rounded-lg shadow-md p-6 mt-8">
    <h2 class="text-xl font-bold mb-4">Quản lý câu học tập</h2>
    <div class="mb-2 text-sm text-gray-600">
      Dung lượng localStorage đang sử dụng: {{ storageUsage }} KB / 5120 KB
    </div>
    
    <!-- Thêm đoạn văn bản tiếng Anh, tự tách câu và dịch -->
    <div class="bg-yellow-50 p-4 rounded-lg mb-6">
      <h3 class="font-medium mb-3">Thêm nhanh từ đoạn văn bản tiếng Anh</h3>
      <textarea v-model="bulkParagraph" rows="4" class="w-full p-2 border border-gray-300 rounded mb-2" placeholder="Paste đoạn văn tiếng Anh, ví dụ: Hello. How are you? ..."></textarea>
      <button 
        @click="handleBulkAdd"
        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        :disabled="!bulkParagraph.trim() || isBulkLoading"
      >
        {{ isBulkLoading ? 'Đang xử lý...' : 'Tách câu, dịch và thêm' }}
      </button>
    </div>

    <!-- Form thêm câu mới -->
    <div class="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 class="font-medium mb-3">Thêm câu mới</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Câu tiếng Anh</label>
          <input 
            v-model="newSentence.eng" 
            type="text" 
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập câu tiếng Anh"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Câu tiếng Việt</label>
          <input 
            v-model="newSentence.vietnamese" 
            type="text" 
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập câu tiếng Việt"
          >
        </div>
      </div>
      <button 
        @click="addSentence" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        :disabled="!isValidSentence"
      >
        Thêm câu
      </button>
    </div>
    
    <!-- Danh sách câu hiện có -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-medium">Danh sách câu ({{ sentences.length }})</h3>
        <button 
          @click="removeAllSentences"
          class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
          :disabled="sentences.length === 0"
        >
          Xóa tất cả
        </button>
      </div>
      <div class="overflow-auto max-h-96">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiếng Anh</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiếng Việt</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(sentence, index) in sentences" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ sentence.eng }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ sentence.vietnamese }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="removeSentence(index)" 
                  class="text-red-600 hover:text-red-900"
                >
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Thống kê -->
    <div class="mt-6 bg-blue-50 p-4 rounded-lg">
      <h3 class="font-medium mb-2">Thống kê học tập</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-3 rounded-md shadow-sm">
          <p class="text-sm text-gray-500">Tổng số câu</p>
          <p class="text-2xl font-bold">{{ sentences.length }}</p>
        </div>
        <div class="bg-white p-3 rounded-md shadow-sm">
          <p class="text-sm text-gray-500">Số lần thử</p>
          <p class="text-2xl font-bold">{{ userStats.totalAttempts }}</p>
        </div>
        <div class="bg-white p-3 rounded-md shadow-sm">
          <p class="text-sm text-gray-500">Tỷ lệ đúng</p>
          <p class="text-2xl font-bold">{{ progressPercentage }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted,watch } from 'vue';

// Tính tổng dung lượng localStorage đang sử dụng (KB)
const storageUsage = computed(() => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      try {
        total += localStorage[key].length * 2; // UTF-16: 2 bytes/char
      } catch {}
    }
  }
  return (total/1024).toFixed(2);
});

import { useLanguageStore } from '../../stores/languageStore';
import { translateText } from '../../services/translateService';

const languageStore = useLanguageStore();

// Bulk add paragraph logic
const bulkParagraph = ref('');
const isBulkLoading = ref(false);

const handleBulkAdd = async () => {
  if (!bulkParagraph.value.trim()) return;
  isBulkLoading.value = true;
  // Tách câu đơn giản theo dấu chấm, chấm hỏi, chấm than
  let sentencesArr = bulkParagraph.value
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  for (const eng of sentencesArr) {
    try {
      // Dịch sang tiếng Việt
      const vi = await translateText(eng, 'vi', 'en');
      languageStore.addSentence(eng, vi);
    } catch (e) {
      languageStore.addSentence(eng, '');
    }
  }
  bulkParagraph.value = '';
  isBulkLoading.value = false;
  saveSentencesToLocal();
};

// LocalStorage sync (bao gồm cả vị trí từ đang học)
const LOCAL_KEY = 'language_sentences';
const LOCAL_INDEX_KEY = 'language_current_index';
const currentIndex = ref(0); // chỉ số từ đang học

const saveSentencesToLocal = () => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(languageStore.sentences));
  localStorage.setItem(LOCAL_INDEX_KEY, String(currentIndex.value));
};
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
  // Load vị trí từ đang học
  const idx = localStorage.getItem(LOCAL_INDEX_KEY);
  if (idx !== null && !isNaN(Number(idx))) {
    currentIndex.value = Number(idx);
  }
};

onMounted(() => {
  loadSentencesFromLocal();
});

// Hook lưu mỗi khi thay đổi
watch(
  () => languageStore.sentences,
  () => saveSentencesToLocal(),
  { deep: true }
);

const removeAllSentences = () => {
  if (confirm('Bạn có chắc chắn muốn xóa tất cả câu hỏi không?')) {
    languageStore.sentences.splice(0, languageStore.sentences.length);
    saveSentencesToLocal();
  }
};

// Lấy dữ liệu từ store
const sentences = computed(() => languageStore.sentences);
const userStats = computed(() => languageStore.userStats);
const progressPercentage = computed(() => languageStore.progressPercentage);

// State cho form thêm câu mới
const newSentence = ref({
  eng: '',
  vietnamese: ''
});

// Kiểm tra câu mới có hợp lệ không
const isValidSentence = computed(() => {
  return newSentence.value.eng.trim() !== '' && 
         newSentence.value.vietnamese.trim() !== '';
});

// Thêm câu mới
const addSentence = () => {
  if (isValidSentence.value) {
    languageStore.addSentence(
      newSentence.value.eng.trim(),
      newSentence.value.vietnamese.trim()
    );
    
    // Reset form
    newSentence.value = {
      eng: '',
      vietnamese: ''
    };
  }
};

// Xóa câu
const removeSentence = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa câu này không?')) {
    languageStore.sentences.splice(index, 1);
  }
};
</script>

<style scoped>
.sentence-manager {
  transition: all 0.3s ease;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  text-align: left;
}

tr:hover {
  background-color: #f9fafb;
}
</style>