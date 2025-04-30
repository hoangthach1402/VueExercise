<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Thông tin cá nhân</h1>
    <div v-if="authStore.isLoading" class="text-center">
      Đang tải...
    </div>
    <div v-else-if="authStore.user" class="bg-white p-6 rounded-lg shadow">
      <p><strong>Tên:</strong> {{ authStore.user.name }}</p>
      <p><strong>Email:</strong> {{ authStore.user.email }}</p>
      <!-- Thêm các thông tin khác nếu có từ API -->
      <!-- Ví dụ: <p><strong>Điện thoại:</strong> {{ authStore.user.phone }}</p> -->
    </div>
    <div v-else class="text-red-500">
      Không thể tải thông tin người dùng.
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { onMounted } from 'vue';

const authStore = useAuthStore();

// Đảm bảo thông tin user được fetch khi component được mount (nếu chưa có)
onMounted(() => {
  if (!authStore.user && authStore.isAuthenticated) {
    authStore.fetchUser();
  }
});
</script>

<style scoped>
/* Thêm style nếu cần */
</style>