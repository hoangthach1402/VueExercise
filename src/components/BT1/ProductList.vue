<template>
  <div class="products-container">
    <CardProduct 
      v-for="product in products" 
      :key="product.id"
      :product="product"
      @add-to-cart="handleAddToCart"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import CardProduct from './CardProduct.vue'

const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['add-to-cart'])


const handleAddToCart = (product) => {
  // console.log('Thêm vào giỏ hàng: ProductList', product)
  emit('add-to-cart', product)
}
</script>

<style scoped>
.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}
</style> 