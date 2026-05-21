import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../pages/Login.vue')
  },
  {
    path: '/app',
    component: DashboardLayout,
    children: [
      {
        path: 'connect',
        name: 'Connect WhatsApp',
        component: () => import('../pages/ConnectWhatsApp.vue')
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../pages/Dashboard.vue')
      },
      {
        path: 'feed',
        name: 'Live Feed',
        component: () => import('../pages/LiveFeed.vue')
      },
      {
        path: 'rules',
        name: 'Rules Config',
        component: () => import('../pages/Rules.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
