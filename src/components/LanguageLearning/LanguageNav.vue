<template>
  <div class="flex items-center justify-between p-4 border-b">
    <div class="flex gap-2">
      <button 
        @click="navigateTo('learning')"
        :class="activeTab === 'learning' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
        class="px-4 py-2 rounded-md"
      >
        Học tập
      </button>
      <button 
        @click="navigateTo('timeline')"
        :class="activeTab === 'timeline' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
        class="px-4 py-2 rounded-md"
      >
        Timeline
      </button>
      <button 
        @click="navigateTo('habit')"
        :class="activeTab === 'habit' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
        class="px-4 py-2 rounded-md"
      >
        Thói quen
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const props = defineProps({
  activeTab: {
    type: String,
    default: 'learning'
  }
});

const emit = defineEmits(['tab-change']);

const navigateTo = (tab) => {
  emit('tab-change', tab);
  
  // Điều hướng dựa trên tab
  if (tab === 'timeline') {
    router.push('/timeline');
  } else if (tab === 'habit') {
    router.push('/habit');
  } else {
    router.push('/learning');
  }
};
</script>

