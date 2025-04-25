<template>
    <div>
        <h1>Step 1</h1>
        <div class="form-group">
            <label for="name">Name</label>
            <input 
                type="text" 
                v-model="name" 
                @input="handleInput('name', name)"
                placeholder="Enter your name"
                class="form-input"
            />
        </div>
        <div class="form-group">
            <label for="age">Age</label>
            <input 
                type="text" 
                v-model="age" 
                @input="handleInput('age', age)"
                placeholder="Enter your age"
                class="form-input"
            />
        </div>
    </div>
</template>

<script setup>
import { useUserFormStore } from '../../stores/userFormStore'
import { ref, watch } from 'vue'

const userFormStore = useUserFormStore()
const name = ref(userFormStore.name)
const age = ref(userFormStore.age)

// Theo dõi thay đổi từ store
watch(() => userFormStore.name, (newValue) => {
    name.value = newValue
})

watch(() => userFormStore.age, (newValue) => {
    age.value = newValue
})

const handleInput = (field, value) => {
    userFormStore.handleInput(field, value)
}
</script>

<style scoped>
.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

.form-input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}
</style>