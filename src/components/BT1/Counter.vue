<template>
  <div>
    <button @click="decrement">-</button>
    <span>{{ count }}</span>
    <button @click="increment">+</button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
const count = ref(0)
const emit = defineEmits(['update'])

onMounted(() => {
  console.log('Counter mounted, initial count:', count.value)
  emit('update', count.value)
})

watch(count, (newVal, oldVal) => {
  console.log(`count changed from ${oldVal} to ${newVal}`)
  emit('update', newVal)
})

function increment() {
  count.value++
}
function decrement() {
  count.value--
}
</script>

<style scoped>
button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
}
span {
  font-size: 1.2rem;
  margin: 0 0.5rem;
}
</style>