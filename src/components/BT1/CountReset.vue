<template>
    <div class="count-reset-container">
        <h1 class="text-center">Count Reset</h1>
        <h3 class="text-center">{{ countStore.count }}</h3>
        <button class="btn btn-primary" @click="handleIncrement">Increment</button>
        <button class="btn btn-danger" @click="handleReset">Reset</button>
    </div>
</template>

<script setup>
import { useCountStore } from '../stores/countStore'
import { onMounted, onUnmounted, ref } from 'vue'

const countStore = useCountStore()
const resetTimer = ref(null)

const startResetTimer = () => {
    // Xóa timer cũ nếu có
    if (resetTimer.value) {
        clearTimeout(resetTimer.value)
    }
    
    // Đặt timer mới
    resetTimer.value = setTimeout(() => {
        countStore.reset()
    }, 10000) // 10 giây
}

const handleIncrement = () => {
    countStore.increment()
    startResetTimer() // Reset timer mỗi khi nhấn increment
}

const handleReset = () => {
    countStore.reset()
    startResetTimer() // Reset timer khi nhấn reset
}

// Bắt đầu timer khi component được mount
onMounted(() => {
    startResetTimer()
})

// Xóa timer khi component unmount
onUnmounted(() => {
    if (resetTimer.value) {
        clearTimeout(resetTimer.value)
    }
})
</script>

<style scoped>
.count-reset-container {
    text-align: center;
    margin: 20px 0;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
}

.btn {
    padding: 10px 20px;
    margin: 0 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
}

.btn-primary {
    background-color: #4CAF50;
    color: white;
}

.btn-primary:hover {
    background-color: #45a049;
}

.btn-danger {
    background-color: #f44336;
    color: white;
}

.btn-danger:hover {
    background-color: #d32f2f;
}
</style>
