<template>
    <div class="container">

        <div class="header">
            <slot name="header"></slot>
        </div>
        <div class="content">
            <slot name="content"></slot>
        </div>
        <div class="footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    variant: {
        type: String,
        default: 'primary'
    }
})
</script>
<style>
.header {
    background-color: #f0f0f0;
    padding: 10px;
}
.content {
    background-color: #f0f0f0;
}
.footer {
    background-color: #f0f0f0;
}
</style>