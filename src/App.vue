<script setup>

</script>
<template>
  <RouterView v-slot="{ Component, route }">
    <component :is="Component" :key="route" />
  </RouterView>
</template>