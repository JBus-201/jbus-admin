import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { name: 'Welcome', path: '/Welcome', component: () => import('../views/WelcomeHome.vue') },
    { name: 'Home', path: '/', component: () => import('../views/HomeView.vue') },
  ]
})

export default router
