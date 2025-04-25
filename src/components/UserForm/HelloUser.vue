<template>
  <div class="hello-user">
    <div class="input-group">
      <input 
        type="text" 
        v-model="name" 
        @input="handleInputChange('name', name)"
        placeholder="Nhập tên của bạn"
        class="form-input"
      />
      <input 
        type="text" 
        v-model="age" 
        @input="handleInputChange('age', age)"
        placeholder="Nhập tuổi của bạn"
        class="form-input"
      />
      <input 
        type="text" 
        v-model="email" 
        @input="handleInputChange('email', email)"
        placeholder="Nhập email của bạn"
        class="form-input"
      />
      <input 
        type="text" 
        v-model="address" 
        @input="handleInputChange('address', address)"
        placeholder="Nhập địa chỉ của bạn"
        class="form-input"
      />
      
      <div class="info-display">
        <p v-if="userStore.name" class="info-item">Tên: {{ userStore.name }}</p>
        <p v-if="userStore.age" class="info-item">Tuổi: {{ userStore.age }}</p>
        <p v-if="userStore.email" class="info-item">Email: {{ userStore.email }}</p>
        <p v-if="userStore.address" class="info-item">Địa chỉ: {{ userStore.address }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/userStore';
import { ref } from 'vue';

const userStore = useUserStore();
const name = ref('');
const age = ref('');
const email = ref('');
const address = ref('');

const handleInputChange = (field, value) => {
  userStore.setField(field, value);
};
</script>

<style scoped>
.hello-user {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
}

.form-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}

.info-display {
  margin-top: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #eee;
}

.info-item {
  color: #333;
  font-size: 16px;
  margin: 5px 0;
  padding: 5px;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
  border-bottom: none;
}
</style>