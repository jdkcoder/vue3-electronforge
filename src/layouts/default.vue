<template>
    Header
    <RouterView v-slot="{ Component, route }">
        <component :is="Component" :key="route" />
    </RouterView>
    Footer
</template>