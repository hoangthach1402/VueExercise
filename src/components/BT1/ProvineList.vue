<template>  
<Popover 
    :active="isActive"
    @close="toggleActive"
>
    <template #activator>
        <Button @click="toggleActive" variant="primary" size="large" disclosure>
                    <!-- {{ selectedProvince ? provinceList.find(p => p.value === selectedProvince)?.label : 'Chọn tỉnh thành' }} -->
                show province
                </Button>
    </template>
    <OptionList
   :selected="[selectedProvince]"
    :options="provinceList"   

    
     @change="handleChange"
    
    />

</Popover>
<ModalShow />

</template>
<script setup>
import { ref } from 'vue';
import { Popover, Button , OptionList } from '@ownego/polaris-vue';

const isActive = ref(false);
const toggleActive = () => {
    isActive.value = !isActive.value;
}
const handleSelect = (selected) => {
    console.log(selected);
}
const handleChange = (selected) => {
    console.log(selected);
}
const selectedProvince = ref('');   
const provinceList = [
    {
      
        value: 'Province 1', label: 'Province 1'    
    },
    {
       
        value: 'Province 2', label: 'Province 2'
    },
    {
     
        value: 'Province 3', label: 'Province 3'
    },
    {
     
        value: 'Province 4', label: 'Province 4'
    },
    
]

</script>
<style scoped>

</style>