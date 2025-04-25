<template>
  <div class="product-card">
    <div class="product-image">
      <img :src="product.image" :alt="product.name">
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-price">{{ formatPrice(product.price) }}</p>
      <p class="product-description">{{ product.description }}</p>
      <Button variant="primary" @click="handleAddToCart">
        Thêm vào giỏ hàng
      </Button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { Button } from '@ownego/polaris-vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const handleAddToCart = () => {
  console.log('Thêm vào giỏ hàng: CardProduct', props.product)
  emit('add-to-cart', props.product)
}
</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.product-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
}

.product-name {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: bold;
}

.product-price {
  color: #e44d26;
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 10px;
}

.product-description {
  color: #666;
  margin: 0 0 15px;
  font-size: 14px;
}
</style>
