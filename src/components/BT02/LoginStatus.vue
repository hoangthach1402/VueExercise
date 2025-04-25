<template>
  <div v-if="loginStore.showStatus" class="login-status">
    <p>Chào mừng {{ loginStore.userName }} đã đăng nhập thành công!</p>
  </div>
</template>

<script setup>
import { useLoginStore } from '../../stores/loginStore';
const loginStore = useLoginStore();
</script>

<style scoped>
.login-status {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>