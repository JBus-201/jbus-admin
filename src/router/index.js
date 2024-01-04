import { createRouter, createWebHistory } from 'vue-router'
// import MainLayout from '../layout/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { name: 'login', path: '/', component: () => import('../views/log-in.vue') },
    { name: 'Home', path: '/Home', component: () => import('../views/track-buses.vue') },
    {
      name: 'Add Passenger',
      path: '/add-passenger',
      component: () => import('../views/add-passenger.vue')
    },
    { name: 'Add Driver', path: '/add-driver', component: () => import('../views/add-driver.vue') },
    {
      name: 'Add Admin',
      path: '/add-admin',
      component: () => import('../views/add-admin.vue')
    },
    {
      name: 'Add-Edit Bus',
      path: '/add-edit-bus',
      component: () => import('../views/add-edit-bus.vue')
    },
    { name: 'Add Route', path: '/add-route', component: () => import('../views/add-route.vue') },
    {
      name: 'Manage Loyalty Points',
      path: '/manage-loyalty-points',
      component: () => import('../views/manage-loyalty-points.vue')
    },
    {
      name: 'Manage Notifications',
      path: '/manage-notifications',
      component: () => import('../views/manage-notifications.vue')
    },
    {
      name: 'Generate Report',
      path: '/generate-reports',
      component: () => import('../views/generate-reports.vue')
    }
  ]
})

export default router
