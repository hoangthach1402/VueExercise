// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// @import "tailwindcss";
import '../src/style.css'; // Optional: base styles

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createPinia } from 'pinia'

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

app.use(router);

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app');