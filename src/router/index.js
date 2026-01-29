import { createRouter, createWebHistory } from 'vue-router'
import PortalHome from '../views/PortalHome.vue'
import HistoryTimeline from '../modules/HistoryTimeline.vue'
import HistorySlice from '../modules/HistorySlice.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: PortalHome
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: HistoryTimeline
  },
  {
    path: '/slice',
    name: 'Slice',
    component: HistorySlice
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
