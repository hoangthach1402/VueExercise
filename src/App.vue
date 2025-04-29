<template>
  <AppProvider>
    <div class="container mx-auto p-4">
      <LanguageNav :activeTab="currentTab" @tab-change="handleTabChange" />
      <router-view />
    </div>
  </AppProvider>
</template>

<script setup>
import { computed } from 'vue'
import { AppProvider } from '@ownego/polaris-vue'
import LanguageNav from './components/LanguageLearning/LanguageNav.vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Xác định tab hiện tại dựa trên route
const currentTab = computed(() => {
  if (route.path.includes('timeline')) return 'timeline'
  if (route.path.includes('habit')) return 'habit'
  return 'learning'
})

// Xử lý khi tab thay đổi
const handleTabChange = (tab) => {
  // Router sẽ được xử lý trong LanguageNav
}
</script>

<style>
/* Các style toàn cục nếu cần */
</style>