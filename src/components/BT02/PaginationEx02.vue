<template>
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div class="text-sm text-gray-600">
        Hiển thị {{ rangeStart }} - {{ rangeEnd }} của {{ totalItems }} sản phẩm
      </div>
      
      <div class="flex items-center gap-1">
        <!-- Nút Previous -->
        <button
          @click="goToPrevPage"
          :disabled="currentPage === 1"
          :class="{
            'bg-gray-200 cursor-not-allowed': currentPage === 1,
            'bg-white hover:bg-gray-100': currentPage > 1
          }"
          class="px-3 py-1 border rounded"
        >
          &lt;
        </button>
        
        <!-- Các nút trang -->
        <template v-for="page in pages" :key="page">
          <button
            @click="goToPage(page)"
            :class="{
              'bg-blue-500 text-white': page === currentPage,
              'bg-white hover:bg-gray-100': page !== currentPage
            }"
            class="w-10 h-10 border rounded flex items-center justify-center"
          >
            {{ page }}
          </button>
        </template>
        
        <!-- Nút Next -->
        <button
          @click="goToNextPage"
          :disabled="currentPage === totalPages"
          :class="{
            'bg-gray-200 cursor-not-allowed': currentPage === totalPages,
            'bg-white hover:bg-gray-100': currentPage < totalPages
          }"
          class="px-3 py-1 border rounded"
        >
          &gt;
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    totalItems: {
      type: Number,
      default: 120
    },
    itemsPerPage: {
      type: Number,
      default: 5
    },
    currentPage: {
      type: Number,
      default: 2
    },
    maxVisiblePages: {
      type: Number,
      default: 5
    }
  })
  
  const emit = defineEmits(['page-changed'])
  
  // Tính toán tổng số trang
  const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))
  
  // Tính toán range hiển thị
  const rangeStart = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)
  const rangeEnd = computed(() => {
    const end = props.currentPage * props.itemsPerPage
    return end > props.totalItems ? props.totalItems : end
  })
  
  // Tạo danh sách các trang cần hiển thị
  const pages = computed(() => {
    const half = Math.floor(props.maxVisiblePages / 2)
    let start = props.currentPage - half
    let end = props.currentPage + half
  
    if (start < 1) {
      start = 1
      end = props.maxVisiblePages
    }
  
    if (end > totalPages.value) {
      end = totalPages.value
      start = Math.max(1, end - props.maxVisiblePages + 1)
    }
  
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  })
  
  // Điều hướng trang
  const goToPage = (page) => {
    if (page !== props.currentPage) {
      emit('page-changed', page)
    }
  }
  
  const goToPrevPage = () => {
    if (props.currentPage > 1) {
      emit('page-changed', props.currentPage - 1)
    }
  }
  
  const goToNextPage = () => {
    if (props.currentPage < totalPages.value) {
      emit('page-changed', props.currentPage + 1)
    }
  }
  </script>