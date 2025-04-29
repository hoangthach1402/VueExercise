<template>
  <div class="flex h-screen bg-gray-100">
    <div class="flex-grow relative border-r border-gray-300 overflow-y-auto h-full">
      <div class="relative h-[calc(24*var(--hour-height))]"> <div
          v-for="hour in hours"
          :key="`hour-${hour}`"
          class="absolute left-0 w-full border-b border-gray-200 pointer-events-none"
          :style="{ top: `${hour * hourHeight}px`, height: `${hourHeight}px` }"
        >
          <span class="absolute -left-1 top-[-0.7em] text-xs text-gray-500 pr-2 text-right w-12">
            {{ hour.toString().padStart(2, '0') }}:00
          </span>
        </div>

        <div
          class="absolute left-12 right-0 h-0.5 bg-red-500 z-30 pointer-events-none"
          :style="{ top: `${currentTimePixelOffset}px` }"
          aria-label="Current time"
        >
          <div class="absolute -left-1.5 -top-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </div>

        <div
          v-for="taskLayout in processedTasks"
          :key="taskLayout.task.id"
          class="absolute rounded-lg p-2 text-white text-xs shadow overflow-hidden z-20 cursor-pointer hover:ring-2 hover:ring-offset-1"
          :style="{
            top: `${taskLayout.top}px`,
            height: `${taskLayout.height}px`,
            left: `calc(3rem + ${taskLayout.left}%)`,
            width: `calc(${taskLayout.width}% - 2px)`,
            backgroundColor: taskLayout.task.color,
            borderColor: darkenColor(taskLayout.task.color),
            borderWidth: '1px',
            opacity: isPastTask(taskLayout.task) ? 0.7 : 1,
            zIndex: isCurrentTask(taskLayout.task) ? 25: taskLayout.zIndex, // Bring current task slightly more forward
            ringColor: taskLayout.task.color // For hover effect
          }"
          @click="editTask(taskLayout.task)"
        >
          <div class="font-semibold truncate">{{ taskLayout.task.name }}</div>
          <div class="opacity-80">{{ taskLayout.task.startTime }} - {{ getEndTime(taskLayout.task) }}</div>
          <div class="opacity-70 italic truncate">{{ taskLayout.task.type }}</div>
          <div v-if="isCurrentTask(taskLayout.task)" class="absolute bottom-1 right-1 text-xs bg-black/40 px-1 rounded pointer-events-none">
            {{ formatTimeRemaining(taskLayout.task) }} còn lại
          </div>
        </div>
      </div>
    </div>

    <div class="w-80 p-4 bg-white shadow-lg flex-shrink-0 h-full overflow-y-auto flex flex-col space-y-6">
      <div>
        <h3 class="text-lg font-semibold mb-4">{{ editingTask ? 'Sửa công việc' : 'Đăng ký công việc' }}</h3>
        <form @submit.prevent="submitTask" class="space-y-4">
          <div v-if="overlapError" class="p-2 text-sm text-red-700 bg-red-100 rounded border border-red-300">
             {{ overlapError }}
          </div>

          <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">Tên công việc:</label>
             <input :value="currentEditTask.name" @input="updateTaskField('name', $event.target.value)" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
           </div>
           <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">Loại công việc:</label>
             <select :value="currentEditTask.type" @change="updateTaskField('type', $event.target.value)" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
               <option value="học">Học</option>
               <option value="giải trí tốt">Giải trí tốt</option>
               <option value="giải trí xấu">Giải trí xấu</option>
               <option value="thay thế">Thay thế</option>
               <option value="công việc">Công việc</option>
               <option value="cá nhân">Cá nhân</option>
             </select>
           </div>
           <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu:</label>
             <input :value="currentEditTask.startTime" @input="updateTaskField('startTime', $event.target.value)" type="time" required step="900" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
           </div>
           <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">Thời lượng (phút):</label>
             <input :value="currentEditTask.duration" @input="updateTaskField('duration', parseInt($event.target.value) || 0)" type="number" min="5" step="5" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
           </div>
           <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">Màu sắc:</label>
             <input :value="currentEditTask.color" @input="updateTaskField('color', $event.target.value)" type="color" class="w-full h-10 px-1 py-1 border border-gray-300 rounded-md shadow-sm" />
           </div>
           <div class="flex space-x-2">
             <button type="submit" class="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
               {{ editingTask ? 'Cập nhật' : 'Thêm' }}
             </button>
             <button v-if="editingTask" @click="cancelEdit" type="button" class="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
               Hủy
             </button>
           </div>
        </form>
      </div>

      <div class="border-t pt-4 mt-4">
        <h3 class="text-lg font-semibold mb-2">Tóm Tắt Công Việc</h3>
        <div class="max-h-60 overflow-y-auto text-sm border rounded-md">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TG</th>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th> </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="sortedTasksForSummary.length === 0">
                 <td colspan="4" class="px-3 py-4 text-center text-gray-500">Chưa có công việc nào.</td>
              </tr>
              <tr v-for="task in sortedTasksForSummary" :key="`summary-${task.id}`" class="hover:bg-gray-50">
                <td class="px-3 py-2 whitespace-nowrap truncate max-w-[100px]" :title="task.name">{{ task.name }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ task.type }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ task.startTime }} ({{ task.duration }}m)</td>
                <td class="px-3 py-2 whitespace-nowrap text-right">
                   <button @click="editTask(task)" class="text-indigo-600 hover:text-indigo-900 mr-2 text-xs">Sửa</button>
                   <button @click="deleteTask(task.id)" class="text-red-600 hover:text-red-900 text-xs">Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
         <p class="text-xs text-gray-500 mt-1">Tổng số: {{ tasks.length }} công việc.</p>
      </div>

      <div class="border-t pt-4 mt-4">
        <h3 class="text-lg font-semibold mb-2">Thống Kê Theo Loại (Giờ)</h3>
        <div v-if="taskStats.totalDuration > 0" class="w-full h-64 flex justify-center items-center" aria-label="Biểu đồ thống kê loại công việc">
            <Pie :data="chartData" :options="chartOptions" />
        </div>
         <p v-else class="text-sm text-gray-500 text-center">Chưa có dữ liệu thống kê.</p>
      </div>

      <div class="border-t pt-4 mt-4">
        <h3 class="text-lg font-semibold mb-2">Nhập nhiều công việc (JSON)</h3>
        <textarea 
          v-model="jsonInput" 
          class="w-full p-2 border rounded-md text-sm mb-2 h-32" 
          placeholder='[{"name":"Học Vue","type":"học","startTime":"08:00","duration":60},...]'
        ></textarea>
        <button 
          @click="importFromJson" 
          class="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Nhập công việc
        </button>
        <p v-if="jsonError" class="text-red-500 text-sm mt-2">{{ jsonError }}</p>
        <div class="text-xs text-gray-500 mt-1">
          <div class="flex justify-between items-center">
            <p class="font-medium">Hướng dẫn nhập JSON:</p>
            <button 
              @click="copyExample"
              class="text-blue-500 hover:text-blue-700 text-xs flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy mẫu
            </button>
          </div>
          <ul class="list-disc pl-4 space-y-1 mt-1">
            <li><span class="font-semibold">Các loại công việc:</span> học, giải trí tốt, giải trí xấu, thay thế, công việc, cá nhân</li>
            <li><span class="font-semibold">Trường bắt buộc:</span> name (string), startTime ("HH:MM"), duration (number - phút)</li>
            <li><span class="font-semibold">Trường tùy chọn:</span> type (string), color (hex color)</li>
            <li><span class="font-semibold">Yêu cầu:</span> 
              <ul class="list-disc pl-4">
                <li>Thời gian không trùng lặp</li>
                <li>Định dạng JSON hợp lệ</li>
                <li>Sắp xếp theo thời gian tăng dần</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
// Google Translate Service
import { useGoogleTranslate } from '../services/googleTranslateService'; // MAKE SURE PATH IS CORRECT

// Chart.js imports
import { Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  Colors // Import Colors plugin
} from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, Colors);

const { speak } = useGoogleTranslate();

// --- Configuration ---
const hourHeight = ref(60); // px height for one hour block
const taskTypeColors = { // Define consistent colors for types
    'học': '#3b82f6', // blue-500
    'giải trí tốt': '#22c55e', // green-500
    'giải trí xấu': '#ef4444', // red-500
    'thay thế': '#eab308', // yellow-500
    'công việc': '#a855f7', // purple-500
    'cá nhân': '#ec4899', // pink-500
    'default': '#6b7280' // gray-500
};

// --- State ---
const editingTask = ref(null);
const tasks = ref(JSON.parse(localStorage.getItem('timelineTasks_v3')) || []); // Use new key v3
const currentTime = ref(new Date());
const currentEditTask = ref(createDefaultTask());
const previousNotifiedTask = ref(null);
const notificationPermission = ref('default'); // Initialize as default
const overlapError = ref(''); // Error message for form
const jsonInput = ref('');
const jsonError = ref('');

// --- Computed Properties ---
const hours = computed(() => Array.from({ length: 24 }, (_, i) => i));

const currentTimePixelOffset = computed(() => {
  const now = currentTime.value;
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  return (totalMinutes / 60) * hourHeight.value;
});

// Processed tasks for rendering (handles layout - less critical now but kept)
const processedTasks = computed(() => {
    const sorted = [...tasks.value]
        .map(task => ({ task, startMinutes: timeToMinutes(task.startTime), endMinutes: timeToMinutes(task.startTime) + task.duration }))
        .sort((a, b) => a.startMinutes - b.startMinutes || (b.endMinutes - b.startMinutes) - (a.endMinutes - a.startMinutes));

    const layout = [];
    // Basic layout: since overlaps are prevented, tasks generally take full width
    sorted.forEach(item => {
        layout.push({
            task: item.task,
            top: (item.startMinutes / 60) * hourHeight.value,
            height: (item.task.duration / 60) * hourHeight.value,
            // Simplified layout: take full width (minus small gap) as overlaps are prevented by validation
            left: 0.5, // Small percentage gap from left
            width: 99, // Almost full width
            zIndex: 20
        });
    });
    return layout;
});

// Tasks sorted for the summary table
const sortedTasksForSummary = computed(() => {
    return [...tasks.value].sort((a, b) => {
        const startA = timeToMinutes(a.startTime);
        const startB = timeToMinutes(b.startTime);
        return startA - startB;
    });
});


const currentTask = computed(() => {
  const nowMinutes = timeToMinutes(currentTime.value);
  // Find the first task that includes the current minute
  return tasks.value.find(task => {
    const startMinutes = timeToMinutes(task.startTime);
    const endMinutes = startMinutes + task.duration;
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  });
});

// Calculate statistics for the pie chart
const taskStats = computed(() => {
  const stats = tasks.value.reduce((acc, task) => {
    const type = task.type || 'không xác định';
    const durationHours = task.duration / 60; // Calculate duration in hours
    if (!acc[type]) {
      acc[type] = { totalHours: 0, count: 0 };
    }
    acc[type].totalHours += durationHours;
    acc[type].count += 1;
    return acc;
  }, {});

  const totalDuration = Object.values(stats).reduce((sum, typeStat) => sum + typeStat.totalHours, 0);

  return { stats, totalDuration };
});

// Data for the Pie chart component
const chartData = computed(() => {
  const labels = Object.keys(taskStats.value.stats);
  const data = labels.map(label => parseFloat(taskStats.value.stats[label].totalHours.toFixed(2))); // Use hours, rounded
  const backgroundColors = labels.map(label => taskTypeColors[label] || taskTypeColors.default);

  return {
    labels: labels,
    datasets: [
      {
        backgroundColor: backgroundColors,
        data: data,
      },
    ],
  };
});

// Options for the Pie chart
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top', // Or 'bottom', 'left', 'right'
    },
    tooltip: {
        callbacks: {
            label: function(context) {
                let label = context.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed !== null) {
                    // Display hours with 1 decimal place
                    label += context.parsed.toFixed(1) + ' giờ';
                }
                return label;
            }
        }
    },
    title: { // Optional chart title
        display: false,
        // text: 'Thời Gian Theo Loại Công Việc'
    }
  },
});

// --- Methods ---
function createDefaultTask() {
  return {
    id: null, name: '', type: 'học', startTime: '', duration: 30,
    color: taskTypeColors['học'] || taskTypeColors.default // Default color based on type
  };
}

function timeToMinutes(time) {
  if (time instanceof Date) {
    return time.getHours() * 60 + time.getMinutes();
  }
  if (typeof time === 'string' && time.includes(':')) {
    const [hours, minutes] = time.split(':').map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
         return hours * 60 + minutes;
    }
  }
  return -1; // Indicate invalid time format
}

// Check if a NEW or UPDATED task overlaps with EXISTING tasks
function checkForOverlap(taskToCheck) {
    const newStart = timeToMinutes(taskToCheck.startTime);
    const newEnd = newStart + taskToCheck.duration;

    if (newStart < 0 || taskToCheck.duration <= 0) return false; // Invalid input

    return tasks.value.some(existingTask => {
        // Skip comparing task to itself if editing
        if (editingTask.value && existingTask.id === editingTask.value.id) {
            return false;
        }
        const existingStart = timeToMinutes(existingTask.startTime);
        const existingEnd = existingStart + existingTask.duration;

        // Check for overlap condition:
        // (New task starts before existing ends) AND (New task ends after existing starts)
        return newStart < existingEnd && newEnd > existingStart;
    });
}

function getEndTime(task) {
    const startMinutes = timeToMinutes(task.startTime);
    if (startMinutes < 0) return '??:??';
    const endMinutes = startMinutes + task.duration;
    const endHour = Math.floor(endMinutes / 60) % 24;
    const endMinute = endMinutes % 60;
    return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
}


function isCurrentTask(task) {
  const nowMinutes = timeToMinutes(currentTime.value);
  const startMinutes = timeToMinutes(task.startTime);
  if(startMinutes < 0) return false;
  const endMinutes = startMinutes + task.duration;
  return nowMinutes >= startMinutes && nowMinutes < endMinutes;
}

function isPastTask(task) {
    const nowMinutes = timeToMinutes(currentTime.value);
    const endMinutes = timeToMinutes(task.startTime) + task.duration;
    return nowMinutes >= endMinutes;
}


function formatTimeRemaining(task) {
  const nowMinutes = timeToMinutes(currentTime.value);
  const startMinutes = timeToMinutes(task.startTime);
   if(startMinutes < 0) return 0;
  const endMinutes = startMinutes + task.duration;
  const diff = endMinutes - nowMinutes;
  return Math.max(0, Math.ceil(diff));
}

async function requestNotificationPermission() {
    // (Same implementation as before)
    if (!("Notification" in window)) {
      console.error("Browser does not support notifications.");
      notificationPermission.value = 'denied'; return false;
    }
    if (Notification.permission === "granted") {
      notificationPermission.value = 'granted'; return true;
    }
    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      notificationPermission.value = permission;
      return permission === "granted";
    }
    notificationPermission.value = 'denied';
    return false;
}

// CRUD and Form Handling
function editTask(task) {
  overlapError.value = ''; // Clear error when starting edit
  editingTask.value = task;
  currentEditTask.value = { ...task };
}

function deleteTask(id) {
  overlapError.value = ''; // Clear error
  tasks.value = tasks.value.filter(t => t.id !== id);
  saveTasks();
  if (editingTask.value?.id === id) {
      cancelEdit();
  }
}

// Update form field and also update color based on type if type changes
function updateTaskField(field, value) {
    currentEditTask.value[field] = value;
    // Auto-update color when type changes, if not editing (or if user hasn't manually set color)
    if (field === 'type' && (!editingTask.value || currentEditTask.value.color === taskTypeColors[editingTask.value.type])) {
         currentEditTask.value.color = taskTypeColors[value] || taskTypeColors.default;
    }
    overlapError.value = ''; // Clear error on input change
}


function submitTask() {
  overlapError.value = ''; // Reset error message

  // --- Overlap Validation ---
  if (checkForOverlap(currentEditTask.value)) {
      overlapError.value = 'Lỗi: Công việc này bị trùng thời gian với công việc khác!';
      // Optionally speak the error
      try { speak(overlapError.value, 'vi'); } catch(e) { console.warn("Speak error failed"); }
      return; // Stop submission
  }

  // --- Add or Update Task ---
  if (editingTask.value) {
    const index = tasks.value.findIndex(t => t.id === editingTask.value.id);
    if (index !== -1) {
      tasks.value[index] = { ...currentEditTask.value, id: editingTask.value.id }; // Keep original ID
      saveTasks();
    }
    cancelEdit();
  } else {
    const newTask = { ...currentEditTask.value, id: Date.now() };
    tasks.value.push(newTask);
    saveTasks();
    currentEditTask.value = createDefaultTask(); // Reset form
  }
}

function cancelEdit() {
  editingTask.value = null;
  currentEditTask.value = createDefaultTask();
  overlapError.value = ''; // Clear error on cancel
}

function saveTasks() {
  localStorage.setItem('timelineTasks_v3', JSON.stringify(tasks.value));
}

function darkenColor(hex, percent = 20) {
    // (Same implementation as before)
    if (!hex || typeof hex !== 'string' || hex.length < 6) return '#cccccc'; // Fallback color
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.max(0, Math.floor(r * (1 - percent / 100)));
    g = Math.max(0, Math.floor(g * (1 - percent / 100)));
    b = Math.max(0, Math.floor(b * (1 - percent / 100)));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function importFromJson() {
  try {
    const newTasks = JSON.parse(jsonInput.value);
    if (!Array.isArray(newTasks)) {
      throw new Error('Invalid JSON format. Expected an array of tasks.');
    }
    newTasks.forEach(task => {
      if (!task.name || !task.type || !task.startTime || !task.duration) {
        throw new Error('Invalid task format. Each task must have name, type, startTime, and duration.');
      }
      const existingTask = tasks.value.find(t => t.name === task.name && t.startTime === task.startTime);
      if (existingTask) {
        throw new Error(`Task with name "${task.name}" and start time "${task.startTime}" already exists.`);
      }
      tasks.value.push({ ...task, id: Date.now() });
    });
    saveTasks();
    jsonInput.value = '';
    jsonError.value = '';
  } catch (error) {
    jsonError.value = error.message;
  }
}

function copyExample() {
  const example = `[
  {
    "name": "Học Vue",
    "type": "học",
    "startTime": "10:00",
    "duration": 30,
    "color": "#3b82f6"
  },
  {
    "name": "Nghỉ ngắn",
    "type": "cá nhân",
    "startTime": "10:30",
    "duration": 10,
    "color": "#6b7280"
  },
  {
    "name": "Đọc sách",
    "type": "giải trí tốt",
    "startTime": "10:40",
    "duration": 25,
    "color": "#22c55e"
  },
  {
    "name": "Ăn trưa",
    "type": "cá nhân",
    "startTime": "12:00",
    "duration": 60,
    "color": "#ec4899"
  },
  {
    "name": "Học JavaScript",
    "type": "học",
    "startTime": "13:00",
    "duration": 30,
    "color": "#3b82f6"
  },
  {
    "name": "Nghỉ ngắn",
    "type": "cá nhân",
    "startTime": "13:30",
    "duration": 10,
    "color": "#6b7280"
  },
  {
    "name": "Làm bài tập",
    "type": "học",
    "startTime": "13:40",
    "duration": 30,
    "color": "#3b82f6"
  },
  {
    "name": "Nghỉ chiều",
    "type": "cá nhân",
    "startTime": "14:10",
    "duration": 20,
    "color": "#6b7280"
  },
  {
    "name": "Đọc sách kỹ thuật",
    "type": "giải trí tốt",
    "startTime": "14:30",
    "duration": 25,
    "color": "#22c55e"
  },
  {
    "name": "Học CSS",
    "type": "học",
    "startTime": "15:00",
    "duration": 30,
    "color": "#3b82f6"
  },
  {
    "name": "Nghỉ ngắn",
    "type": "cá nhân",
    "startTime": "15:30",
    "duration": 10,
    "color": "#6b7280"
  },
  {
    "name": "Ôn tập",
    "type": "học",
    "startTime": "15:40",
    "duration": 25,
    "color": "#3b82f6"
  },
  {
    "name": "Kết thúc ngày",
    "type": "cá nhân",
    "startTime": "16:05",
    "duration": 5,
    "color": "#ec4899"
  }
]`;
  
  navigator.clipboard.writeText(example)
    .then(() => {
      jsonError.value = 'Đã copy lịch mẫu vào clipboard!';
      setTimeout(() => jsonError.value = '', 3000);
    })
    .catch(err => {
      jsonError.value = 'Lỗi khi copy: ' + err.message;
    });
}

// --- Lifecycle Hooks and Watchers ---
let timerInterval = null;

onMounted(() => {
  timerInterval = setInterval(() => { currentTime.value = new Date(); }, 1000);
  requestNotificationPermission();
  document.documentElement.style.setProperty('--hour-height', `${hourHeight.value}px`);

  // Get initial permission status
  if ("Notification" in window) {
      notificationPermission.value = Notification.permission;
  }
});

onUnmounted(() => {
  clearInterval(timerInterval);
});

watch(currentTask, (newTask) => {
  if (newTask && newTask.id !== previousNotifiedTask.value?.id) {
    const notificationText = `Bắt đầu công việc: ${newTask.name}`;
    const notificationBody = `Thời gian: ${newTask.startTime} - ${getEndTime(newTask)} (${newTask.duration} phút)`;
    const speechText = `Bắt đầu công việc ${newTask.name} lúc ${newTask.startTime}, thời lượng ${newTask.duration} phút`;

    if (notificationPermission.value === 'granted') {
        try {
            new Notification(notificationText, { 
                body: notificationBody,
                tag: `task-${newTask.id}`
            });
        } catch(e) { console.error("Lỗi thông báo:", e); }
    }

    try {
      speak(speechText, 'vi');
    } catch (error) {
      console.warn('Không thể đọc thông báo:', error);
    }

    previousNotifiedTask.value = newTask;
  } else if (!newTask && previousNotifiedTask.value) {
    previousNotifiedTask.value = null;
  }
});

</script>

<style>
/* Minimal global styles if needed */
/* Ensure chart container has relative position if needed for tooltips */
/* canvas { max-width: 100%; height: auto; } */
</style>