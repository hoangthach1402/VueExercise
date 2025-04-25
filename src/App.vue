<template>
  <AppProvider>
    <PaginationEx02 
      v-model:current-page="currentPage" 
      @page-changed="handlePageChange" 
    />
  </AppProvider>
</template>

<script setup>
import TabEx from './components/BT02/TabEx.vue'
import TodoEx2 from './components/BT02/TodoEx2.vue'
import UserForm from './components/BT02/UserForm.vue'
import { ref } from 'vue'
import { AppProvider } from '@ownego/polaris-vue'
import PaginationEx02 from './components/BT02/PaginationEx02.vue'

const currentPage = ref(1)
const handlePageChange = (newPage) => {
  currentPage.value = newPage
}
</script>

<style>
.header-content {
  padding: 1rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-link {
  margin: 0 1rem;
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.nav-link:hover {
  color: #4CAF50;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  padding: 2rem;
  background-color: #f8f9fa;
}

.footer-section {
  padding: 1rem;
}

.footer-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>
<PaginationEx02 v-model:current-page="currentPage" @page-changed="handlePageChange" />