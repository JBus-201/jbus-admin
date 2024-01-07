import { createRouter, createWebHistory } from 'vue-router'
// import MainLayout from '../layout/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { name: 'login', path: '/', component: () => import('../views/log-in.vue') },
    {
      name: 'Home',
      path: '/home',
      component: () => import('../views/track-buses.vue'),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next('/') // redirect to login if there's no token
        } else {
          next() // proceed to /add-passenger
        }
      }
    },
    {
      name: 'Add Passenger',
      path: '/add-passenger',
      component: () => import('../views/add-passenger.vue'),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next('/') // redirect to login if there's no token
        } else {
          next() // proceed to /add-passenger
        }
      }
    },
    {
      name: 'edit Passenger',
      path: '/edit-passenger/:passengerID',
      component: () => import('../views/edit-passenger.vue'),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next('/') // redirect to login if there's no token
        } else {
          next() // proceed to /add-passenger
        }
      }
    },
    {
      name: 'Add Driver',
      path: '/add-driver',
      component: () => import('../views/add-driver.vue'),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next('/') // redirect to login if there's no token
        } else {
          next() // proceed to /add-passenger
        }
      }
    },
    {
      name: 'edit Driver',
      path: '/edit-driver/:driverID',
      component: () => import('../views/edit-driver.vue'),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next('/') // redirect to login if there's no token
        } else {
          next() // proceed to /add-passenger
        }
      }
    },
    {
      name: 'Add Admin',
      path: '/add-admin',
      component: () => import('../views/add-admin.vue'),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next('/') // redirect to login if there's no token
        } else {
          next() // proceed to /add-passenger
        }
      }
    },
    {
      name: 'edit Admin',
      path: '/edit-admin/:adminID',
      component: () => import('../views/edit-admin.vue'),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next('/') // redirect to login if there's no token
        } else {
          next() // proceed to /add-passenger
        }
      }
    },
    {
      name: 'Add-Edit Bus',
      path: '/add-edit-bus',
      component: () => import('../views/add-edit-bus.vue'),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next('/') // redirect to login if there's no token
        } else {
          next() // proceed to /add-passenger
        }
      }
    },
    {
      name: 'Add Route',
      path: '/add-route',
      component: () => import('../views/add-route.vue'),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next('/') // redirect to login if there's no token
        } else {
          next() // proceed to /add-passenger
        }
      }
    },
    {
      name: 'Manage Loyalty Points',
      path: '/manage-loyalty-points',
      component: () => import('../views/manage-loyalty-points.vue'),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next('/') // redirect to login if there's no token
        } else {
          next() // proceed to /add-passenger
        }
      }
    },
    {
      name: 'Manage Notifications',
      path: '/manage-notifications',
      component: () => import('../views/manage-notifications.vue'),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next('/') // redirect to login if there's no token
        } else {
          next() // proceed to /add-passenger
        }
      }
    },
    {
      name: 'Generate Report',
      path: '/generate-reports',
      component: () => import('../views/generate-reports.vue'),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next('/') // redirect to login if there's no token
        } else {
          next() // proceed to /add-passenger
        }
      }
    }
  ]
})

export default router
