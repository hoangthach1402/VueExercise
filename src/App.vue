<template>
  <AppProvider>
    <div class="container mx-auto p-4">
      <!-- <h1 class="text-3xl font-bold text-center mb-6">Ứng Dụng Học Ngôn Ngữ</h1> -->
      <LanguageApp />
    </div>
  </AppProvider>
</template>

<script setup>
import { ref } from 'vue'
import { AppProvider } from '@ownego/polaris-vue'
import LanguageApp from './components/LanguageLearning/LanguageApp.vue'


</script>

<style>

</style>