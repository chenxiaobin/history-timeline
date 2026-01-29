<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import EightKingsChaos from './slices/EightKings/index.vue'
import FiveBarbarians from './slices/FiveBarbarians/index.vue'

const router = useRouter()

const goBack = () => {
  router.push('/')
}

const tabs = [
  { id: 'eight-kings', name: '八王之乱', component: EightKingsChaos },
  { id: 'five-barbarians', name: '五胡乱华', component: FiveBarbarians }
]

const currentTabId = ref(tabs[0].id)

const currentComponent = computed(() => {
  const tab = tabs.find((t) => t.id === currentTabId.value)
  return tab ? tab.component : null
})
</script>

<template>
  <div class="slice-page">
    <div class="header">
      <button class="back-home-btn" @click="goBack" title="返回首页">⌂</button>

      <div class="tabs">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-item"
          :class="{ active: currentTabId === tab.id }"
          @click="currentTabId = tab.id"
        >
          {{ tab.name }}
        </div>
      </div>
    </div>

    <div class="content-area">
      <component :is="currentComponent" v-if="currentComponent" />
      <div v-else class="empty-state">专题内容建设中...</div>
    </div>
  </div>
</template>

<style scoped>
.slice-page {
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.header {
  /* padding: 10px 10px; */
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  z-index: 10;
  height: 50px;
  box-sizing: border-box;
}

.back-home-btn {
  background: none;
  border: 1px solid #ddd;
  color: #666;
  font-size: 20px;
  cursor: pointer;
  margin-right: 15px;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  padding-bottom: 4px; /* 微调图标垂直位置 */
  margin-left: 10px;
}

.back-home-btn:hover {
  background: #f5f5f5;
  color: #333;
  border-color: #ccc;
}

.tabs {
  display: flex;
  gap: 10px;
  height: 100%;
}

.tab-item {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
  cursor: pointer;
  color: #666;
  font-weight: 500;
  position: relative;
  transition: color 0.2s;
}

.tab-item:hover {
  color: #3498db;
}

.tab-item.active {
  color: #3498db;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #3498db;
  border-radius: 3px 3px 0 0;
}

.content-area {
  flex: 1;
  padding: 0; /* 移除 padding，由子组件控制 */
  overflow: hidden; /* 禁止父级滚动，由子组件控制 */
  position: relative;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 1.2rem;
  padding: 20px;
}
</style>
