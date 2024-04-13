<script setup lang="ts">
import { definePage } from 'vue-router/auto'

definePage({
  name: 'index',
  meta: {
    // layout: 'z',
    requiresAuth: true,
  },
})

useHead({
  title: 'JDK'
})

onMounted(() => {
  log(1)
})
</script>
<template>
  Home
  <img src="/Untitled.png" />
  <Icon name="mdi-light:home" />
  <RouterLink to="/z">
    Go to
  </RouterLink>
</template>
