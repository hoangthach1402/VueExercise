<template>
  <div class="shopping-cart">
    <h2>Giỏ hàng</h2>
    <div v-if="cartItems.length === 0" class="empty-cart">
      Giỏ hàng trống
    </div>
    <div v-else class="cart-items">
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="item.image" :alt="item.name" class="item-image">
        <div class="item-info">
          <h3>{{ item.name }}</h3>
          <p>{{ formatPrice(item.price) }}</p>
        </div>
        <div class="item-quantity">
          <button @click="decreaseQuantity(item)">-</button>
          <span>{{ item.quantity }}</span>
          <button @click="increaseQuantity(item)">+</button>
        </div>
        <button class="remove-btn" @click="removeItem(item)">Xóa</button>
      </div>
    </div>
    <div class="cart-total" v-if="cartItems.length > 0">
      <p>Tổng tiền: {{ formatPrice(total) }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  cartItems: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['update-cart'])

const total = computed(() => {
  return props.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const increaseQuantity = (item) => {
  const updatedItems = props.cartItems.map(cartItem => {
    if (cartItem.id === item.id) {
      return { ...cartItem, quantity: cartItem.quantity + 1 }
    }
    return cartItem
  })
  emit('update-cart', updatedItems)
}

const decreaseQuantity = (item) => {
  const updatedItems = props.cartItems.map(cartItem => {
    if (cartItem.id === item.id && cartItem.quantity > 1) {
      return { ...cartItem, quantity: cartItem.quantity - 1 }
    }
    return cartItem
  })
  emit('update-cart', updatedItems)
}

const removeItem = (item) => {
  const updatedItems = props.cartItems.filter(cartItem => cartItem.id !== item.id)
  emit('update-cart', updatedItems)
}
</script>

<style scoped>
.shopping-cart {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.empty-cart {
  text-align: center;
  padding: 20px;
  color: #666;
}

.cart-items {
  margin-top: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-right: 15px;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  margin: 0;
  font-size: 16px;
}

.item-quantity {
  display: flex;
  align-items: center;
  margin: 0 20px;
}

.item-quantity button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
}

.item-quantity span {
  margin: 0 10px;
}

.remove-btn {
  padding: 5px 10px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cart-total {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
  text-align: right;
  font-weight: bold;
}
</style>

