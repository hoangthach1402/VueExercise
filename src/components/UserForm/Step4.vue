<template>
    <div>
        <h1>Step 4</h1>
        <div class="card">
            <h2>{{ userFormStore.name }}</h2>
            <h2>{{ userFormStore.email }}</h2>
            <h2>{{ userFormStore.address }}</h2>
            <h2>{{ userFormStore.age }}</h2>
        </div> 
    </div>
</template>
<script setup>
import { useUserFormStore } from '../../stores/userFormStore'

const userFormStore = useUserFormStore()


</script>
<style scoped>

</style>
