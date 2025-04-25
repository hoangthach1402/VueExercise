<template>
    <div class="home-view">
      <h2>Danh sách công việc</h2>
      <div class="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
  <!-- <img class="size-12 shrink-0" src="/img/logo.svg" alt="ChitChat Logo" /> -->
  <div>
    <div class="text-xl font-medium text-red dark:text-white">ChitChat</div>
    <p class="text-gray-500 dark:text-gray-400">You have a new message!</p>
  </div>
  <div class="flex flex-col gap-2 p-8 sm:flex-row sm:items-center sm:gap-6 sm:py-4 ...">
  <!-- <img class="mx-auto block h-24 rounded-full sm:mx-0 sm:shrink-0" src="/img/erin-lindford.jpg" alt="" /> -->
  <div class="space-y-2 text-center sm:text-left">
    <div class="space-y-0.5">
      <p class="text-lg font-semibold text-black">Erin Lindford</p>
      <p class="font-medium text-gray-500">Product Engineer</p>
    </div>
    <button class="border-purple-200 text-purple-600 hover:border-transparent hover:bg-purple-600 hover:text-white active:bg-purple-700 ...">
      Message
    </button>
  </div>
</div>
</div>
      <form @submit.prevent="handleAddTask" class="add-task-form">
        <input
          type="text"
          v-model="newTaskTitle"
          placeholder="Nhập tiêu đề công việc..."
          required
        />
        <button type="submit" :disabled="taskStore.isLoading">
          {{ taskStore.isLoading ? 'Đang thêm...' : 'Thêm Task' }}
        </button>
      </form>
  
      <p v-if="taskStore.isLoading && !taskStore.tasks.length">Đang tải danh sách...</p>
      <p v-if="taskStore.error" class="error-message">{{ taskStore.error }}</p>
  
      <ul v-if="taskStore.tasks.length > 0" class="task-list">
        <li
          v-for="task in taskStore.tasks"
          :key="task.id"
          :class="{ completed: task.completed }"
        >
          <input
            type="checkbox"
            :checked="task.completed"
            @change="taskStore.toggleTaskCompletion(task)"
            :disabled="taskStore.isLoading"
           />
          <span @click="goToDetails(task.id)" class="task-title">
            {{ task.title }}
          </span>
           <button @click="taskStore.deleteTask(task.id)" :disabled="taskStore.isLoading" class="delete-btn">
             Xóa
           </button>
        </li>
      </ul>
       <p v-else-if="!taskStore.isLoading">Chưa có công việc nào.</p>
  
      <div class="task-stats" v-if="taskStore.totalTasks > 0">
          <p>Tổng số công việc: {{ taskStore.totalTasks }}</p>
          <p>Đã hoàn thành: {{ taskStore.completedTasks }}</p>
          <p>Chưa hoàn thành: {{ taskStore.incompleteTasks }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useTaskStore } from '../stores/taskStore.js';
  import { useRouter } from 'vue-router'; // Import useRouter
  
  const taskStore = useTaskStore();
  const router = useRouter(); // Khởi tạo router
  const newTaskTitle = ref('');
  
  // Fetch tasks khi component được mount
  onMounted(() => {
    // Chỉ fetch nếu danh sách chưa có hoặc cần cập nhật lại
    if (taskStore.tasks.length === 0) {
        taskStore.fetchTasks();
    }
  });
  
  const handleAddTask = () => {
    taskStore.addTask(newTaskTitle.value);
    newTaskTitle.value = ''; // Reset input sau khi thêm
  };
  
  // Chuyển đến trang chi tiết
  const goToDetails = (taskId) => {
      router.push({ name: 'TaskDetails', params: { id: taskId } });
  };
  
  </script>
  
  <style scoped>
@import "tailwindcss";
  
  .home-view {
    /* Styles cho trang chủ */
  }
  .add-task-form {
    display: flex;
    margin-bottom: 20px;
  }
  .add-task-form input {
    flex-grow: 1;
    padding: 8px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
   .add-task-form button {
     padding: 8px 15px;
      background-color: #42b983;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
   }
    .add-task-form button:disabled {
       background-color: #aaa;
       cursor: not-allowed;
    }
  
  .task-list {
    list-style: none;
    padding: 0;
  }
  .task-list li {
    display: flex;
    align-items: center;
    padding: 10px 5px;
    border-bottom: 1px solid #eee;
  }
  .task-list li:last-child {
      border-bottom: none;
  }
  .task-list li.completed .task-title {
    text-decoration: line-through;
    color: #aaa;
  }
   .task-list li input[type="checkbox"] {
      margin-right: 10px;
      cursor: pointer;
   }
   .task-title {
      flex-grow: 1;
      cursor: pointer; /* Cho người dùng biết có thể click */
      margin-right: 10px;
   }
    .delete-btn {
      background-color: #e74c3c;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8em;
    }
     .delete-btn:disabled {
       background-color: #aaa;
       cursor: not-allowed;
     }
  .error-message {
      color: red;
      margin-bottom: 15px;
  }
   .task-stats {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px dashed #ccc;
      font-size: 0.9em;
      color: #555;
   }
  </style>