<template>
  <div class="box" :class="{ 'dark-theme': isDark }">
    <h3>Thẻ Box</h3>
    <p>Nội dung thẻ box sẽ thay đổi màu sắc khi toggle theme</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  isDark: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.box {
  padding: 20px;
  border-radius: 8px;
  background-color: #ffffff;
  color: #333333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.box.dark-theme {
  background-color: #1a1a1a;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
}
</style> 