// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LanguageApp from '../components/LanguageLearning/LanguageApp.vue';
import TimelineView from '../views/TimelineView.vue';
import HabitView from '../views/HabitView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: LanguageApp,
    // Không cần redirect vì đã trỏ trực tiếp đến LanguageApp
  },
  { 
    path: '/learning', 
    name: 'learning', 
    component: LanguageApp 
  },
  { 
    path: '/timeline', 
    name: 'timeline', 
    component: TimelineView 
  },
  { 
    path: '/habit', 
    name: 'habit', 
    component: HabitView 
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Sử dụng history mode
  routes,
});

export default router;