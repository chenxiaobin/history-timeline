import { createRouter, createWebHistory } from 'vue-router'
import PortalHome from '../views/PortalHome.vue'
import HistoryTimeline from '../modules/HistoryTimeline.vue'
import HistorySlice from '../modules/HistorySlice.vue'
import DynastyChronicle from '../modules/DynastyChronicle.vue'
import RoyalFamily from '../modules/RoyalFamily.vue'
import WomenInHistory from '../modules/WomenInHistory.vue'
import HistoricalFigures from '../modules/HistoricalFigures.vue'

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
  },
  {
    path: '/dynasty-chronicle',
    name: 'DynastyChronicle',
    component: DynastyChronicle
  },
  {
    path: '/royal-family',
    name: 'RoyalFamily',
    component: RoyalFamily
  },
  {
    path: '/women-in-history',
    name: 'WomenInHistory',
    component: WomenInHistory
  },
  {
    path: '/historical-figures',
    name: 'HistoricalFigures',
    component: HistoricalFigures
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
