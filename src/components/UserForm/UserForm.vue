<template>
    <div class="user-form-container">
        <h1>User Form</h1>
        
        <CountReset />
        
        <div class="step-navigation">
            <ul class="step-list">
                <li v-for="(step, index) in steps" 
                    :key="index"
                >
                    <button 
                        @click="goToStep(index + 1)"
                        class="step-button"
                        :class="{ 'active': userFormStore.currentStep === index + 1 }"
                    >
                        {{ step.label }}
                        <span class="step-counter">({{ index + 1 }}/{{ steps.length }})</span>
                    </button>
                </li>
            </ul>
        </div>

        <div class="step-content">
            <component :is="steps[userFormStore.currentStep - 1].component" />
        </div>

        <div class="form-actions">
            <button 
                @click="userFormStore.prevStep" 
                class="action-button"
                :disabled="userFormStore.currentStep === 1"
            >
                Previous
            </button>
            <button 
                @click="userFormStore.nextStep" 
                class="action-button"
                :disabled="userFormStore.currentStep === steps.length"
            >
                Next
            </button>
            <button 
                @click="userFormStore.reset" 
                class="action-button reset-button"
            >
                Reset
            </button>
        </div>
        <button class="action-button" @click="submitForm">Submit</button>
    </div>
</template>

<script setup>
import { ref, watch, markRaw } from 'vue'
import Step1 from './Step1.vue'
import Step2 from './Step2.vue'
import Step3 from './Step3.vue'
import Step4 from './Step4.vue'
import CountReset from '../CountReset.vue'
import { useUserFormStore } from '../../stores/userFormStore'

const userFormStore = useUserFormStore()


const submitForm = () => {
    // console.log('Submit form')
    // console.log(userFormStore.name, userFormStore.age, userFormStore.address)
    localStorage.setItem('userForm', JSON.stringify(userFormStore))
    alert('Form submitted')
}   

const steps = ref([
    {
        component: markRaw(Step1),
        label: 'Step 1'
    },
    {
        component: markRaw(Step2),
        label: 'Step 2'
    },
    {
        component: markRaw(Step3),
        label: 'Step 3'
    },
    {
        component: markRaw(Step4),
        label: 'Step 4'
    }
])

const goToStep = (stepNumber) => {
    console.log('Going to step:', stepNumber)
    userFormStore.setCurrentStep(stepNumber)
}

const getUserForm = () => { 
    const userForm = localStorage.getItem('userForm')
    // console.log(userForm)
    if(userForm){

        const userFormData = JSON.parse(userForm)
       console.log(userFormData) 
        userFormStore.name = userFormData.name
        userFormStore.email = userFormData.email
        userFormStore.address = userFormData.address
        userFormStore.age = userFormData.age
        
    }
}
getUserForm()
</script>

<style scoped>
.user-form-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.step-navigation {
    margin-bottom: 30px;
}

.step-list {
    display: flex;
    justify-content: center;
    list-style: none;
    padding: 0;
    gap: 10px;
}

.step-button {
    padding: 10px 20px;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    gap: 5px;
}

.step-button:hover {
    background-color: #e0e0e0;
}

.step-counter {
    font-size: 12px;
    opacity: 0.8;
}

.step-button.active {
    background-color: #4CAF50;
    color: white;
    border-color: #4CAF50;
}

.step-button.active .step-counter {
    color: white;
    opacity: 1;
}

.step-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.form-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.action-button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
}

.action-button:hover:not(:disabled) {
    background-color: #45a049;
}

.action-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.reset-button {
    background-color: #f44336;
}

.reset-button:hover {
    background-color: #d32f2f;
}
</style>
