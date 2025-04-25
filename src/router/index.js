// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TaskDetailsView from '../views/TaskDetailsView.vue'; // Sẽ tạo sau

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    // :id là tham số động, chứa ID của task
    path: '/task/:id',
    name: 'TaskDetails',
    component: TaskDetailsView,
    props: true, // Tự động truyền route params (id) thành props cho component
  },
  // Optional: Redirect nếu route không khớp
  // { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Sử dụng history mode
  routes,
});

export default router;