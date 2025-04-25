<template>
    <div>
        <h1>Step 3</h1>
        <div class="form-group">
            <label for="address">Address</label>
            <input @input="handleInput('address',address)" type="text" v-model="address" />
        </div>
   
    </div>
</template>

<script setup>
import { useUserFormStore } from '../../stores/userFormStore'
import { ref , watch} from 'vue'
const userFormStore = useUserFormStore()
const address = ref(userFormStore.address)

const handleInput = (field,value)=>{
    userFormStore.handleInput(field,value)
}
watch(() => userFormStore.address, (newValue) => {
    address.value = newValue
})

</script>
