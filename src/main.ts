// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// @import "tailwindcss";
import '../src/style.css'; // Optional: base styles

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createPinia } from 'pinia';
import { useAuthStore } from '../src/stores/authStore'; // Import auth store

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

// Khởi tạo auth store sau khi pinia được sử dụng
const authStore = useAuthStore();

// Kiểm tra trạng thái xác thực khi ứng dụng tải
// Sử dụng Promise để đảm bảo checkAuth hoàn thành trước khi mount app
authStore.checkAuth().then(() => {
  app.use(router);
  app.component('font-awesome-icon', FontAwesomeIcon);
  app.mount('#app');
});