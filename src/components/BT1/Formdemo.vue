<template>
    <div>
        <h1>Form Demo</h1>
        <div class="error" v-if="errors.length > 0">
            <p v-for="error in errors" :key="error">{{ error }}</p>
        </div>
        <form @submit.prevent="handleSubmit">
            <input type="text" v-model="form.name" placeholder="Name">
            <input type="text" v-model="form.age" placeholder="Age">
            <button type="submit">Submit</button>
            
            <p>Skill</p>
            <div>   
                <input type="checkbox" v-model="form.skill" value="html">
                <label>HTML</label>
                <input type="checkbox" v-model="form.skill" value="css">
                <label>CSS</label>
                <input type="checkbox" v-model="form.skill" value="javascript">
                <label>Javascript</label>
            </div>
            <p>Gender</p>
            <div>
                <input type="radio" v-model="form.gender" value="male">
                <label>Male</label>
                <input type="radio" v-model="form.gender" value="female">
                <label>Female</label>
            </div>
            <p>City</p>
            <select v-model="form.city">
                <option value="hanoi">Hanoi</option>
                <option value="danang">Danang</option>
                <option value="hochiminh">Hochiminh</option>
            </select>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const form = ref({
    name: '',
    age: '',
    skill: [],
    gender: '',
    city: ''
})
const errors = ref([])

const clearErrors = () => {
    errors.value = []
}

const handleSubmit = () => {
    // Xóa errors cũ trước khi kiểm tra
    clearErrors()
    
    if (form.value.name === '' ) {
        errors.value.push('Name is required')
    }
    if (form.value.age === '') {
        errors.value.push('Age is required')
    }
    
    // Nếu có lỗi, tự động xóa sau 5 giây
    if (errors.value.length > 0) {
        setTimeout(() => {
            clearErrors()
        }, 5000)
    }
    
    console.log(form.value)
}
</script>

<style scoped>
.error {
    color: red;
    font-size: 12px;
    margin-bottom: 10px;
}
</style>


