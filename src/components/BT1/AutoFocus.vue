<template>
    <div>
        <h1>Auto Focus</h1>
        <input autofocus type="text" ref="inputRef" placeholder="Enter your name">
        <input  type="text" ref="inputRef" placeholder="Enter your password">
  
        <button @click="handleAutoFocus">Auto Focus</button>
        <Box />
</div>
</template>

<script setup>
import Box from './Box.vue'
import { ref } from 'vue'
const inputRef = ref(null)

</script>
