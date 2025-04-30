<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-full max-w-md">
      <h3 class="text-2xl font-bold text-center mb-6">Đăng nhập</h3>
      <form @submit.prevent="handleLogin">
        <div class="mt-4">
          <div>
            <label class="block" for="email">Email</label>
            <input
              type="email"
              placeholder="Email"
              id="email"
              v-model="email"
              required
              class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div class="mt-4">
            <label class="block" for="password">Mật khẩu</label>
            <input
              type="password"
              placeholder="Mật khẩu"
              id="password"
              v-model="password"
              required
              class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div class="flex items-baseline justify-between mt-6">
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900 disabled:opacity-50"
            >
              {{ authStore.isLoading ? 'Đang xử lý...' : 'Đăng nhập' }}
            </button>
            <!-- <a href="#" class="text-sm text-blue-600 hover:underline">Quên mật khẩu?</a> -->
          </div>
          <div v-if="authStore.loginError" class="mt-4 text-red-600 text-sm">
            {{ authStore.loginError }}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');

const handleLogin = () => {
  if (email.value && password.value) {
    authStore.login({ email: email.value, password: password.value });
  }
};
</script>

<style scoped>
/* Thêm style nếu cần */
</style>