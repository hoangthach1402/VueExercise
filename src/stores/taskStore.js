// src/stores/taskStore.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { ref, computed } from 'vue';

const API_URL = 'http://localhost:3001/tasks'; // URL của json-server

export const useTaskStore = defineStore('taskStore', () => {
  // --- State ---
  const tasks = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // --- Getters (Computed) ---
  const totalTasks = computed(() => tasks.value.length);
  const completedTasks = computed(() => tasks.value.filter(task => task.completed).length);
  const incompleteTasks = computed(() => totalTasks.value - completedTasks.value);

  // --- Actions ---
  async function fetchTasks() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await axios.get(API_URL);
      tasks.value = response.data; // Cập nhật state
    } catch (err) {
      console.error('Error fetching tasks:', err);
      error.value = 'Không thể tải danh sách công việc.';
    } finally {
      isLoading.value = false;
    }
  }

  async function addTask(newTaskTitle, newTaskDescription = '') {
    if (!newTaskTitle || !newTaskTitle.trim()) {
      error.value = 'Tiêu đề công việc không được để trống.';
      return; // Không thêm task nếu title rỗng
    }
    isLoading.value = true;
    error.value = null;
    const newTask = {
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      completed: false
      // id sẽ được json-server tự động tạo
    };
    try {
      const response = await axios.post(API_URL, newTask);
      tasks.value.push(response.data); // Thêm task mới vào state
    } catch (err) {
      console.error('Error adding task:', err);
      error.value = 'Không thể thêm công việc mới.';
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTask(taskId) {
    isLoading.value = true;
    error.value = null;
    try {
        await axios.delete(`${API_URL}/${taskId}`);
      // Xóa task khỏi state cục bộ
      tasks.value = tasks.value.filter(task => task.id !== taskId);
    } catch (err) {
      console.error('Error deleting task:', err);
      error.value = 'Không thể xóa công việc.';
    } finally {
      isLoading.value = false;
    }
  }

  async function toggleTaskCompletion(task) {
    isLoading.value = true;
    error.value = null;
    const updatedTask = { ...task, completed: !task.completed };
    try {
        const response = await axios.put(`${API_URL}/${task.id}`, updatedTask);
      // Cập nhật task trong state cục bộ
      const index = tasks.value.findIndex(t => t.id === task.id);
      if (index !== -1) {
        tasks.value[index] = response.data;
      }
    } catch (err) {
      console.error('Error updating task:', err);
      error.value = 'Không thể cập nhật trạng thái công việc.';
       // Optional: Rollback local state if API call fails
       const index = tasks.value.findIndex(t => t.id === task.id);
       if (index !== -1) {
         tasks.value[index].completed = !updatedTask.completed; // Revert change
       }
    } finally {
      isLoading.value = false;
    }
  }

  // Lấy chi tiết một task (có thể dùng cho trang details nếu cần fetch riêng)
  // Hoặc có thể lấy trực tiếp từ state tasks đã fetch ở trang Home
  function getTaskById(id) {
       // Chuyển id sang number nếu cần (route params là string)
      const taskId = typeof id === 'string' ? parseInt(id, 10) : id;
      return tasks.value.find(task => task.id === taskId);
  }


  return {
    // State
    tasks,
    isLoading,
    error,
    // Getters
    totalTasks,
    completedTasks,
    incompleteTasks,
    // Actions
    fetchTasks,
    addTask,
    deleteTask,
    toggleTaskCompletion,
    getTaskById,
  };
});