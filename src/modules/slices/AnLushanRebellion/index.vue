<script setup>
import { ref, computed } from 'vue'
import Overview from './components/Overview.vue'
import Cause from './components/Cause.vue'
import Evolution from './components/Evolution.vue'

// 维度配置
const dimensions = [
  { id: 'overview', name: '事件概览', icon: '📝' },
  { id: 'cause', name: '导火索', icon: '🔥' },
  { id: 'evolution', name: '战争演进', icon: '⚔️' }
]

const currentDimId = ref('overview')

const currentComponent = computed(() => {
  if (currentDimId.value === 'overview') return Overview
  if (currentDimId.value === 'cause') return Cause
  if (currentDimId.value === 'evolution') return Evolution
  return null
})
</script>

<template>
  <div class="anlushan-container">
    <!-- 左侧导航 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>查看维度</h2>
      </div>
      <div class="nav-menu">
        <div
          v-for="dim in dimensions"
          :key="dim.id"
          class="nav-item"
          :class="{ active: currentDimId === dim.id }"
          @click="currentDimId = dim.id"
        >
          <span class="icon">{{ dim.icon }}</span>
          <span class="text">{{ dim.name }}</span>
        </div>
      </div>
    </div>

    <!-- 右侧内容 -->
    <div class="main-content">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<style scoped>
.anlushan-container {
  display: flex;
  height: 100%;
  min-height: 0;
  background: #fff;
  width: 100%;
  max-width: none;
  margin: 0;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  background: #f8f9fa;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.sidebar-header h2 {
  font-size: 1.1rem;
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}

.nav-menu {
  padding: 10px 0;
}

.nav-item {
  padding: 15px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #666;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.nav-item:hover {
  background: #e9ecef;
  color: #333;
}

.nav-item.active {
  background: #e3f2fd;
  color: #3498db;
  border-right: 3px solid #3498db;
  font-weight: 500;
}

.nav-item .icon {
  margin-right: 12px;
  font-size: 1.1rem;
}

.main-content {
  flex: 1;
  padding: 0;
  overflow: hidden;
  background: white;
  position: relative;
}
</style>