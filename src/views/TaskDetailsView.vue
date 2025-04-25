<template>
    <div class="task-details-view">
       <button @click="goBack" class="back-button">&lt; Quay lại danh sách</button>
  
      <div v-if="task">
        <h2>Chi tiết công việc: {{ task.title }}</h2>
        <p><strong>ID:</strong> {{ task.id }}</p>
        <p><strong>Trạng thái:</strong> {{ task.completed ? '✅ Hoàn thành' : '⏳ Chưa hoàn thành' }}</p>
        <p><strong>Mô tả:</strong></p>
        <p class="description">{{ task.description || 'Không có mô tả.' }}</p>
  
        <button @click="toggleStatus" :disabled="taskStore.isLoading" class="toggle-button">
          {{ task.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành' }}
        </button>
      </div>
      <div v-else-if="taskStore.isLoading">
          <p>Đang tải chi tiết công việc...</p>
      </div>
      <div v-else>
        <p class="error-message">Không tìm thấy công việc với ID này.</p>
      </div>
  
      <p v-if="taskStore.error" class="error-message">{{ taskStore.error }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useTaskStore } from '../stores/taskStore.js';
  import { useRoute, useRouter } from 'vue-router';
  
  // Props được truyền từ router do 'props: true' trong định nghĩa route
  const props = defineProps({
    id: {
      type: [String, Number],
      required: true,
    }
  });
  
  const taskStore = useTaskStore();
  const route = useRoute();
  const router = useRouter();
  
  // Lấy task từ store dựa vào ID từ props/route params
  // Dùng computed để nó tự cập nhật nếu state trong store thay đổi
  const task = computed(() => taskStore.getTaskById(props.id));
  
  // Hàm để quay lại trang trước (trang chủ)
  const goBack = () => {
    router.back(); // Hoặc router.push('/');
  };
  
  // Hàm để thay đổi trạng thái hoàn thành
  const toggleStatus = () => {
      if(task.value) {
          taskStore.toggleTaskCompletion(task.value);
      }
  }
  
  // Xử lý trường hợp người dùng truy cập trực tiếp vào trang detail
  // mà store chưa có dữ liệu tasks (ví dụ: refresh trang detail)
  onMounted(() => {
      if (taskStore.tasks.length === 0 && !taskStore.isLoading) {
          console.log('Task list empty on details mount, fetching...');
          // Fetch lại toàn bộ list hoặc chỉ fetch task cụ thể nếu API hỗ trợ
          // Ở đây ta fetch lại toàn bộ list cho đơn giản
          taskStore.fetchTasks();
      }
      // Nếu muốn fetch chỉ task này:
      // if (!task.value && !taskStore.isLoading) {
      //    fetchSingleTaskDetails(props.id); // Cần tạo action fetchSingleTaskDetails trong store
      // }
  });
  
   // Theo dõi nếu ID thay đổi (dù ít xảy ra trong TH này)
   // và fetch lại nếu cần
  // watch(() => props.id, (newId) => {
  //     if (!taskStore.getTaskById(newId) && !taskStore.isLoading) {
  //         taskStore.fetchTasks(); // Hoặc fetch task cụ thể
  //     }
  // });
  
  
  </script>
  
  <style scoped>
  .task-details-view {
    /* Styles cho trang chi tiết */
     border: 1px solid #eee;
     padding: 20px;
     border-radius: 5px;
     background-color: #f9f9f9;
  }
   .back-button {
      margin-bottom: 20px;
      padding: 8px 15px;
      background-color: #ddd;
      border: none;
      border-radius: 4px;
      cursor: pointer;
   }
   .back-button:hover {
       background-color: #ccc;
   }
  .description {
      background-color: #fff;
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 4px;
      min-height: 50px;
      white-space: pre-wrap; /* Giữ định dạng xuống dòng nếu có */
  }
  .error-message {
      color: red;
      margin-top: 15px;
  }
  .toggle-button {
      margin-top: 15px;
       padding: 8px 15px;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
  }
  .toggle-button:disabled {
      background-color: #aaa;
      cursor: not-allowed;
  }
  </style>