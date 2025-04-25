// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import router
// @import "tailwindcss";
import '../src/style.css'; // Optional: base styles

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


const app = createApp(App);

app.use(router); // Sử dụng router
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app');