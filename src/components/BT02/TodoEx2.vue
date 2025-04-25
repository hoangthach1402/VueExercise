<template>
    <div class="max-w-md mx-auto p-4 font-sans">
      <h1 class="text-2xl font-bold mb-6 text-center">Todo List</h1>
      
      <!-- Form thêm công việc mới -->
      <div class="flex mb-4">
        <input
          v-model="newTodo"
          @keyup.enter="addTodo"
          placeholder="Thêm công việc mới..."
          class="flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          @click="addTodo"
          class="px-4 py-2 bg-green-500 text-white rounded-r hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Thêm
        </button>
      </div>
  
      <!-- Danh sách công việc -->
      <ul class="space-y-2">
        <li
          v-for="(todo, index) in todos"
          :key="todo.id"
          class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded shadow-sm"
        >
          <!-- Chế độ xem -->
          <div v-if="!todo.isEditing" class="flex items-center flex-1">
            <span :class="{ 'line-through text-gray-400': todo.completed }" class="ml-2">
              {{ todo.text }}
            </span>
          </div>
          
          <!-- Chế độ chỉnh sửa -->
          <input
            v-else
            v-model="todo.text"
            @keyup.enter="saveEdit(todo)"
            @blur="saveEdit(todo)"
            class="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            v-focus
          />
          
          <div class="flex space-x-2 ml-4">
            <!-- Nút hoàn thành -->
            <button
              @click="toggleComplete(todo)"
              :class="todo.completed ? 'bg-gray-500' : 'bg-green-500'"
              class="p-1 text-white rounded hover:opacity-80 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            
            <!-- Nút chỉnh sửa -->
            <button
              @click="startEdit(todo)"
              class="p-1 bg-blue-500 text-white rounded hover:opacity-80 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <!-- Nút xóa -->
            <button
              @click="removeTodo(index)"
              class="p-1 bg-red-500 text-white rounded hover:opacity-80 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </li>
      </ul>
      
      <!-- Thông báo khi không có công việc -->
      <p v-if="todos.length === 0" class="text-center text-gray-500 mt-4">
        Không có công việc nào. Hãy thêm mới!
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue'
  
  // Directive tự động focus khi vào chế độ chỉnh sửa
  const vFocus = {
    mounted: (el) => el.focus()
  }
  
  // Khởi tạo state
  const newTodo = ref('')
  const todos = ref([])
  
  // Thêm công việc mới
  const addTodo = () => {
    if (newTodo.value.trim() === '') return
    
    todos.value.push({
      id: Date.now(),
      text: newTodo.value.trim(),
      completed: false,
      isEditing: false
    })
    
    newTodo.value = ''
  }
  
  // Xóa công việc
  const removeTodo = (index) => {
    todos.value.splice(index, 1)
  }
  
  // Bắt đầu chỉnh sửa
  const startEdit = (todo) => {
    todo.isEditing = true
  }
  
  // Lưu chỉnh sửa
  const saveEdit = (todo) => {
    todo.isEditing = false
    if (todo.text.trim() === '') {
      removeTodo(todos.value.findIndex(t => t.id === todo.id))
    }
  }
  
  // Toggle trạng thái hoàn thành
  const toggleComplete = (todo) => {
    todo.completed = !todo.completed
  }
  
  // Lưu vào localStorage khi todos thay đổi
  watch(todos, (newTodos) => {
    localStorage.setItem('todos', JSON.stringify(newTodos))
  }, { deep: true })
  
  // Load từ localStorage khi component mounted
  onMounted(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      todos.value = JSON.parse(savedTodos)
    }
  })
  </script>
  
  <style>
  /* Animation cho các mục todo */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>