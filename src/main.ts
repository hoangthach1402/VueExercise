// src/main.js
import { createApp } from 'vue';
import App from './App.vue';

// @import "tailwindcss";
import '../src/style.css'; // Optional: base styles

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createPinia } from 'pinia'


const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app');