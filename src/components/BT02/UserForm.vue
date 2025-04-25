<template>
  <!-- <div></div> -->
    <h1>User Form</h1>
    <form @submit.prevent="submitForm">
      <label for="name">Name:</label>
      <input type="text" id="name" v-model="name" required>
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required>
      <button type="submit">Submit</button>
      <LoginStatus ref="loginStatusRef" />
      <div v-if="errors.length > 0">
        <ul class="errors">
          <li class="error" v-for="error in errors">{{ error }}</li>
        </ul>
      </div>
      </form>

</template>

<script setup>
import { ref } from 'vue';
import LoginStatus from './LoginStatus.vue';

const name = ref('');
const loginStatusRef = ref(null);
const email = ref('');
const errors = ref([]);

function submitForm() {
  errors.value = [];
  if (!name.value ) {
    errors.value.push('Name is required');
  }
  if(!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
    errors.value.push('Email is not valid');
  }
  if (name.value.length < 5 ) {
   errors.value.push('Name must be at least 5 characters long');
  }
  if (!email.value) {
    errors.value.push('Email is required'); 
}
 if (errors.value.length === 0) {
    console.log('Form submitted successfully');
    loginStatusRef.value.showLoginStatus(name.value);
  } else {
    console.log('Form submission failed');
  }
 }      
 
</script>
<style>
.errors {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.error {
  color: red;
}
input {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 16px;
  width: 100%;
  box-sizing: border-box;
}
button{
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
