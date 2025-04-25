<template>
  <button @click="toggleTheme">Toggle Theme</button>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['toggle-theme'])
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  emit('toggle-theme', isDark.value)
}
</script>
<style scoped>
button {
  background-color: #000;
  color: #fff;
}
</style>
