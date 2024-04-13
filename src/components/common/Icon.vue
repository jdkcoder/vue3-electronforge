<script setup>
import { Icon as Iconify } from '@iconify/vue';
const props = defineProps({
    name: {
        type: String,
        required: true
    }
})
</script>

<template>
    <template v-if="props.name">
        <Iconify :icon="props.name" />
    </template>
</template>