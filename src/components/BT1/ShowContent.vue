<template>
    <div>
        <h1>Show Content</h1>
        <p v-if="content">day la content</p>
        <button @click="toggleContent">Toggle Content</button>
    </div>  
</template>

<script setup>
import { ref } from 'vue'
// const props = defineProps({
//     content: {
//         type: String,
//         required: true
//     }
// })
const content = ref(props.content)
const toggleContent = () => {
    content.value = !content.value
}
</script>

<style scoped>
button {
    background-color: #000;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
}
p {
    color: #000;
}
h1 {
    color: #000;
}

</style>