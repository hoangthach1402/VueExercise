<template>
  <div class="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen font-sans">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">Theo Dõi Thói Quen</h1>

    <div class="mb-8 p-4 bg-white rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-3 text-gray-700">Thêm Thói Quen Mới</h2>
      <div class="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          v-model="newHabit.name"
          placeholder="Tên thói quen (ví dụ: Chạy bộ)"
          class="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        <input
          type="number"
          v-model.number="newHabit.targetDays"
          placeholder="Mục tiêu (ngày)"
          min="1"
          class="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
         <input
          type="date"
          v-model="newHabit.startDate"
          :max="todayIsoDate"
          title="Ngày bắt đầu (không thể chọn ngày tương lai)"
          class="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          @click="addHabit"
          :disabled="!newHabit.name || !newHabit.targetDays || !newHabit.startDate"
          class="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Thêm
        </button>
      </div>
    </div>

    <div class="space-y-6 mb-12">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">Đang Thực Hiện</h2>
       <p v-if="activeHabits.length === 0" class="text-gray-500 italic">Chưa có thói quen nào đang theo dõi.</p>
      <div v-for="habit in activeHabits" :key="habit.id" class="bg-white rounded-lg shadow p-4 transition-all duration-300 hover:shadow-md">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">{{ habit.name }}</h3>
            <p class="text-sm text-gray-500">
              Bắt đầu: {{ formatDate(habit.startDate) }} | Mục tiêu: {{ habit.targetDays }} ngày
            </p>
          </div>
          <button @click="confirmDeleteHabit(habit.id)" class="text-red-500 hover:text-red-700 transition-colors" title="Xóa thói quen">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div class="mb-3">
           <div class="text-sm text-gray-600 mb-1 flex justify-between">
             <span>Tiến độ: {{ habit.checkedDays.length }} / {{ habit.targetDays }} ngày</span>
             <span>{{ calculateProgress(habit).toFixed(0) }}%</span>
           </div>
           <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
             <div
               class="bg-gradient-to-r from-blue-400 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
               :style="{ width: `${calculateProgress(habit)}%` }"
             ></div>
           </div>
        </div>

        <div class="flex flex-wrap gap-2 items-center">
          <span class="text-sm font-medium mr-2">Ngày:</span>
          <div v-for="dayNum in habit.targetDays" :key="dayNum" class="flex flex-col items-center">
             <button
               @click="toggleCheckDay(habit.id, dayNum)"
               :disabled="!isCheckable(habit, dayNum)"
               :class="[
                 'w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200 text-xs',
                 getDayStatusClass(habit, dayNum),
                 isCheckable(habit, dayNum) ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-60'
               ]"
               :title="getDayTitle(habit, dayNum)"
             >
                <span v-if="isDayChecked(habit, dayNum)">✔</span>
                <span v-else>&nbsp;</span>
             </button>
             <span class="text-[10px] mt-0.5 text-gray-500">{{ dayNum }}</span>
          </div>
        </div>

        <p class="text-xs text-gray-500 mt-2 italic">
           Hôm nay là ngày thứ {{ calculateCurrentDayNumber(habit) }} của hành trình (nếu đã bắt đầu).
        </p>

      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">Thành Tựu Đã Đạt Được</h2>
       <p v-if="achievements.length === 0" class="text-gray-500 italic">Chưa có thành tựu nào được ghi nhận.</p>
      <div v-for="achievement in achievements" :key="achievement.id" class="bg-green-50 border border-green-200 rounded-lg shadow-sm p-3 flex justify-between items-center">
        <div>
          <p class="font-semibold text-green-800">{{ achievement.name }}</p>
          <p class="text-sm text-green-700">
            Hoàn thành mục tiêu {{ achievement.targetDays }} ngày vào {{ formatDate(achievement.completionDate) }}.
          </p>
           <p class="text-xs text-gray-500">Bắt đầu: {{ formatDate(achievement.startDate) }}</p>
        </div>
         <button @click="deleteAchievement(achievement.id)" class="text-gray-400 hover:text-red-500 transition-colors text-xs" title="Xóa thành tựu này">
            Xóa
          </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';

// --- State ---
const habits = ref([]);
const achievements = ref([]);
const newHabit = reactive({
  name: '',
  startDate: '', // Will be set to today initially
  targetDays: 7,
});

const today = new Date();
today.setHours(0, 0, 0, 0); // Normalize today's date
const todayIsoDate = today.toISOString().split('T')[0];

// --- Persistence (localStorage) ---
const HABIT_STORAGE_KEY = 'habitTrackerData_v1';
const ACHIEVEMENT_STORAGE_KEY = 'habitAchievements_v1';

function loadData() {
  const storedHabits = localStorage.getItem(HABIT_STORAGE_KEY);
  const storedAchievements = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY);
  habits.value = storedHabits ? JSON.parse(storedHabits) : [];
  achievements.value = storedAchievements ? JSON.parse(storedAchievements) : [];

  // Add default habits if empty (first load example)
  if (habits.value.length === 0 && achievements.value.length === 0) {
     habits.value.push({
         id: Date.now() + '_smoke', name: 'Bỏ thuốc', startDate: '2025-04-27', targetDays: 7, checkedDays: [], completed: false
     });
     habits.value.push({
         id: Date.now() + '_mast', name: 'Bỏ thủ dâm', startDate: '2025-04-27', targetDays: 7, checkedDays: [], completed: false
     });
     saveData(); // Save defaults
  }

  // Set default start date for new habit form
  newHabit.startDate = todayIsoDate;
}

function saveData() {
  localStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(habits.value));
  localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(achievements.value));
}

// --- Lifecycle Hook ---
onMounted(() => {
  loadData();
});

// --- Computed Properties ---
const activeHabits = computed(() => {
    return habits.value.filter(h => !h.completed).sort((a,b) => new Date(a.startDate) - new Date(b.startDate));
});

// --- Date & Calculation Helpers ---
function parseDate(dateString) {
  const date = new Date(dateString);
  // Adjust for potential timezone offset by adding it back IF the dateString doesn't contain timezone info
  // This assumes dateString is like "YYYY-MM-DD" and should represent local date
   const offset = date.getTimezoneOffset() * 60000;
   const localDate = new Date(date.getTime() + offset);
   localDate.setHours(0, 0, 0, 0); // Normalize
  return localDate;
}

function calculateDaysBetween(date1, date2) {
  const msPerDay = 24 * 60 * 60 * 1000;
  // Calculate the difference in milliseconds and convert to days
  return Math.round((date2 - date1) / msPerDay);
}

function calculateCurrentDayNumber(habit) {
  const startDate = parseDate(habit.startDate);
  if (today < startDate) {
    return 0; // Habit hasn't started yet
  }
  // Add 1 because day 1 is the start date itself
  return calculateDaysBetween(startDate, today) + 1;
}

function calculateDaysPassed(habit) {
   const startDate = parseDate(habit.startDate);
   if (today < startDate) return 0;
   return calculateDaysBetween(startDate, today); // Number of full days passed
}

function calculateProgress(habit) {
  if (!habit.targetDays) return 0;
  return (habit.checkedDays.length / habit.targetDays) * 100;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = parseDate(dateString);
    // Ensure we format based on the intended local date
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
}


// --- Habit Management ---
function addHabit() {
  if (!newHabit.name || !newHabit.targetDays || !newHabit.startDate || newHabit.targetDays < 1) return;

  const newHabitData = {
    id: Date.now() + '_' + Math.random().toString(16).slice(2), // More unique ID
    name: newHabit.name.trim(),
    startDate: newHabit.startDate,
    targetDays: newHabit.targetDays,
    checkedDays: [],
    completed: false,
  };
  habits.value.push(newHabitData);

  // Reset form
  newHabit.name = '';
  newHabit.targetDays = 7;
  newHabit.startDate = todayIsoDate;

  saveData();
}

function confirmDeleteHabit(id) {
    const habitToDelete = habits.value.find(h => h.id === id);
    if (habitToDelete && confirm(`Bạn có chắc muốn xóa thói quen "${habitToDelete.name}" không? Hành động này không thể hoàn tác.`)) {
        deleteHabit(id);
    }
}

function deleteHabit(id) {
  habits.value = habits.value.filter(h => h.id !== id);
  saveData();
}

function deleteAchievement(id) {
    if (confirm(`Bạn có chắc muốn xóa thành tựu này không?`)) {
       achievements.value = achievements.value.filter(a => a.id !== id);
       saveData();
    }
}


function toggleCheckDay(habitId, dayNumber) {
  const habit = habits.value.find(h => h.id === habitId);
  if (!habit || !isCheckable(habit, dayNumber)) return;

  const dayIndex = habit.checkedDays.indexOf(dayNumber);

  if (dayIndex > -1) {
    // Uncheck day
    habit.checkedDays.splice(dayIndex, 1);
  } else {
    // Check day
    habit.checkedDays.push(dayNumber);
    habit.checkedDays.sort((a, b) => a - b); // Keep checked days sorted
  }

  // Check for completion after toggling
  checkForCompletion(habit);

  saveData();
}

function checkForCompletion(habit) {
    // Check if ALL required days are checked (up to targetDays)
    const allTargetDaysChecked = habit.checkedDays.length >= habit.targetDays;
    // Or simpler: check if the target day itself is checked
    // const targetDayChecked = habit.checkedDays.includes(habit.targetDays);

    if (allTargetDaysChecked && !achievements.value.some(a => a.id === habit.id)) {
        markAsCompleted(habit);
    }
}

function markAsCompleted(habit) {
    // Move from habits to achievements
    const achievementData = {
        id: habit.id,
        name: habit.name,
        startDate: habit.startDate,
        targetDays: habit.targetDays,
        completionDate: todayIsoDate // Mark completed today
    };
    achievements.value.push(achievementData);

    // Remove from active habits (or mark as completed)
    // Option 1: Remove completely
    // habits.value = habits.value.filter(h => h.id !== habit.id);
    // Option 2: Mark as completed (keeps it in main list but filters via computed)
     const habitIndex = habits.value.findIndex(h => h.id === habit.id);
     if (habitIndex > -1) {
         habits.value[habitIndex].completed = true;
     }

     // Sort achievements by completion date (most recent first)
     achievements.value.sort((a,b) => new Date(b.completionDate) - new Date(a.completionDate));

    console.log(`Habit "${habit.name}" marked as completed!`);
    // Maybe add a success message/toast later
}

// --- UI Helpers ---
function isDayChecked(habit, dayNumber) {
  return habit.checkedDays.includes(dayNumber);
}

function isCheckable(habit, dayNumber) {
    const currentDayNum = calculateCurrentDayNumber(habit);
    // Allow checking only for days up to and including today, provided the habit has started
    return dayNumber <= currentDayNum && currentDayNum > 0;
}

function getDayStatus(habit, dayNumber) {
    const currentDayNum = calculateCurrentDayNumber(habit);

    if (isDayChecked(habit, dayNumber)) return 'checked';
    if (dayNumber === currentDayNum && currentDayNum > 0) return 'current';
    if (dayNumber > currentDayNum || currentDayNum <= 0) return 'future';
    // If it's a past day and not checked
    if (dayNumber < currentDayNum && currentDayNum > 0) return 'past-unchecked';

    return 'future'; // Default fallback
}

function getDayStatusClass(habit, dayNumber) {
  const status = getDayStatus(habit, dayNumber);
  switch (status) {
    case 'checked':
      return 'bg-green-500 border-green-600 text-white';
    case 'current':
      return 'bg-blue-100 border-blue-400 ring-1 ring-blue-500 text-blue-700'; // Highlight current day
    case 'past-unchecked':
      return 'bg-gray-100 border-gray-300 text-gray-400'; // Indicate missed past day
    case 'future':
    default:
      return 'bg-white border-gray-300 text-gray-400'; // Future or not started
  }
}

function getDayTitle(habit, dayNumber) {
    const status = getDayStatus(habit, dayNumber);
    const startDate = parseDate(habit.startDate);
    // Calculate the actual date for this day number
    const dayDate = new Date(startDate.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000);
    const formattedDayDate = formatDate(dayDate.toISOString().split('T')[0]);

    switch (status) {
    case 'checked':
      return `Ngày ${dayNumber} (${formattedDayDate}): Đã hoàn thành`;
    case 'current':
      return `Ngày ${dayNumber} (${formattedDayDate}): Hôm nay`;
    case 'past-unchecked':
      return `Ngày ${dayNumber} (${formattedDayDate}): Đã bỏ lỡ?`;
    case 'future':
    default:
      return `Ngày ${dayNumber} (${formattedDayDate}): Chưa tới`;
    }
}

</script>

<style scoped>
/* Add any specific styles here if needed, although Tailwind should cover most */
/* Example: Slightly larger checkmark */
/* .text-xs span { font-size: 0.8rem; } */
</style>