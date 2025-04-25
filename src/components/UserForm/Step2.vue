<template>
    <div>
        <h1>Step 2</h1>
        <div class="form-group">
            <label for="email">Email</label>
            <input @input="handleInput('email',email)" type="text" v-model="email" />
        </div>
      
    </div>
</template>
<script setup>
import { useUserFormStore } from '../../stores/userFormStore'
import { ref ,watch} from 'vue'
const userFormStore = useUserFormStore()
const email = ref(userFormStore.email)

const handleInput = (field,value)=>{
    userFormStore.handleInput(field,value)
}
watch(() => userFormStore.email, (newValue) => {
    email.value = newValue
})
</script>

<style scoped   >
.form-group{
    margin-bottom: 10px;
}

.form-group label{
    display: block;
    margin-bottom: 5px;
}

.form-group input{
    width: 100%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}



</style>