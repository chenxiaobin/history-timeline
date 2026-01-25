import { createRouter, createWebHistory } from 'vue-router'
import HistoryTimeline from '../components/HistoryTimeline.vue'
import EmperorTimeline from '../components/EmperorTimeline.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HistoryTimeline
  },
  {
    path: '/emperors/:key',
    name: 'Emperors',
    component: EmperorTimeline,
    props: (route) => ({ dynastyKey: route.params.key })
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
