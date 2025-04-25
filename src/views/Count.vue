<template>
    <div>
        <h3>Count</h3>
        <p>{{ countStore.count }}</p>
        <button @click="countStore.increment" class="btn">
            <font-awesome-icon :icon="['fas', 'plus']" />
        </button>
        <button @click="countStore.decrement" class="btn">
            <font-awesome-icon :icon="['fas', 'minus']" />
        </button>
    </div>
</template>

<script setup>
import { useCountStore } from '../stores/countStore'

const countStore = useCountStore()
</script>

<style scoped>
.btn {
     padding: 8px 16px;
    margin: 0 4px;


    border: black 1px solid;
    border-radius: 5px;
    cursor: pointer;
}

.btn:hover {
    background-color: #45a049;
}
</style>


