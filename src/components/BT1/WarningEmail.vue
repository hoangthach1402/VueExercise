<template>
    <div>
        <h1>Warning Email</h1>
        <p>Current Email: {{ email }}</p>
        <input 
            type="email" 
            v-model="newEmail" 
            placeholder="Enter your email"
            @keyup.enter="handleWarningEmail"
        >
        <BaseButton 
            variant="primary"
            size="medium"
            @click="handleWarningEmail"
        >
            Submit New Email
        </BaseButton>
        <p v-if="error" class="error">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import BaseButton from './BaseButton.vue'

const email = ref('vuhoangthach1402@gmail.com')
const newEmail = ref('')
const error = ref('')

// Watch email changes
watch(email, (newVal) => {
    console.log('Email changed to:', newVal)
    alert('Email is changed')
})

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

const handleWarningEmail = () => {
    if (!newEmail.value) {
        error.value = 'Email is required'
        return
    }
    
    if (!validateEmail(newEmail.value)) {
        error.value = 'Please enter a valid email'
        return
    }
    
    email.value = newEmail.value
    newEmail.value = ''
    error.value = ''
}
</script>

<style scoped>
.error {
    color: red;
    font-size: 12px;
    margin-top: 5px;
}

input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 10px;
    width: 200px;
}

input:focus {
    outline: none;
    border-color: #4CAF50;
}
</style>
