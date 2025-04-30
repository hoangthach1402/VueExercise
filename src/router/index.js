// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LanguageApp from '../components/LanguageLearning/LanguageApp.vue';
import TimelineView from '../views/TimelineView.vue';
import HabitView from '../views/HabitView.vue';
import LoginView from '../views/LoginView.vue'; // Import LoginView
import ProfileView from '../views/ProfileView.vue'; // Import ProfileView
import { useAuthStore } from '../stores/authStore'; // Import auth store

const routes = [
  {
    path: '/login', // Route cho trang đăng nhập
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true } // Chỉ cho phép truy cập nếu chưa đăng nhập
  },
  {
    path: '/',
    name: 'home',
    component: LanguageApp,
    meta: { requiresAuth: true } // Yêu cầu đăng nhập
  },
  {
    path: '/learning',
    name: 'learning',
    component: LanguageApp,
    meta: { requiresAuth: true } // Yêu cầu đăng nhập
  },
  {
    path: '/timeline',
    name: 'timeline',
    component: TimelineView,
    meta: { requiresAuth: true } // Yêu cầu đăng nhập
  },
  {
    path: '/habit',
    name: 'habit',
    component: HabitView,
    meta: { requiresAuth: true } // Yêu cầu đăng nhập
  },
  {
    path: '/profile', // Route cho trang profile
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true } // Yêu cầu đăng nhập
  },
  // Thêm các route khác nếu cần
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation Guard để kiểm tra xác thực
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // Lấy store trong guard

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

  if (requiresAuth && !authStore.isAuthenticated) {
    // Nếu route yêu cầu đăng nhập và user chưa đăng nhập -> chuyển về trang login
    next({ name: 'login' });
  } else if (requiresGuest && authStore.isAuthenticated) {
    // Nếu route yêu cầu là khách (trang login) và user đã đăng nhập -> chuyển về trang chủ
    next({ name: 'home' });
  } else {
    // Các trường hợp khác cho phép đi tiếp
    next();
  }
});


export default router;