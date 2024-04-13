import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { createHead } from '@unhead/vue'
import App from '../App.vue';
const app = createApp(App)
const head = createHead()

const router = createRouter({
    history: createWebHistory(),
    extendRoutes: (routes) => setupLayouts(routes),
})

app
    .use(router)
    .use(head)
    .mount('#app');