<template>
    <div>
        <h1>List Student</h1>
        <ul>
               <li v-for="student in students" :key="student.id">
                {{ student.name }} - {{ student.age }}
                <button @click="handleDelete(student.id)">Delete</button>
                </li>
                
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const students = ref([
    { id: 1, name: 'John', age: 20 },
    { id: 2, name: 'Jane', age: 21 },
])
</script>   

<style scoped>

</style>

