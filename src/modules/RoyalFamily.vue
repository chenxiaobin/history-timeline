<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { royalFamilyTree } from '../data/royalFamilyTree.js'
import FamilyTree from '../components/FamilyTree.vue'

const router = useRouter()
const route = useRoute()

// 返回首页
const goBack = () => {
  router.push('/')
}

// 获取所有朝代名称
const dynasties = Object.keys(royalFamilyTree)
const selectedDynasty = ref(dynasties[0] || '')

// 监听容器大小变化，动态调整家族树尺寸
const containerRef = ref(null)
const treeWidth = ref(1600)
const treeHeight = ref(800)

const updateTreeSize = () => {
  if (containerRef.value) {
    const container = containerRef.value.getBoundingClientRect()
    treeWidth.value = container.width
    treeHeight.value = container.height
  }
}

// 从URL参数获取朝代
const getDynastyFromParams = () => {
  const dynastyParam = route.query.dynasty
  if (dynastyParam && dynasties.includes(dynastyParam)) {
    return dynastyParam
  }
  return null
}

// 初始化时从URL参数获取朝代
onMounted(() => {
  updateTreeSize()
  window.addEventListener('resize', updateTreeSize)
  
  // 从URL参数获取朝代
  const dynastyFromParams = getDynastyFromParams()
  if (dynastyFromParams) {
    selectedDynasty.value = dynastyFromParams
  }
})

// 监听selectedDynasty变化，更新路由参数
watch(selectedDynasty, (newDynasty) => {
  router.push({
    path: '/royal-family',
    query: { dynasty: newDynasty }
  })
})

// 监听路由参数变化，更新selectedDynasty
watch(() => route.query.dynasty, (newDynasty) => {
  if (newDynasty && dynasties.includes(newDynasty) && newDynasty !== selectedDynasty.value) {
    selectedDynasty.value = newDynasty
  }
})
</script>

<template>
  <div class="royal-family-container">
    <div class="header">
      <button class="back-home-btn" @click="goBack" title="返回首页">⌂</button>
      <h1>帝王家脉</h1>
    </div>
    
    <div class="dynasty-selector">
      <span class="selector-title">选择朝代</span>
      <div class="dynasty-buttons">
        <button 
          v-for="dynasty in dynasties" 
          :key="dynasty" 
          class="dynasty-btn"
          :class="{ active: selectedDynasty === dynasty }"
          @click="selectedDynasty = dynasty"
        >
          {{ dynasty }}
        </button>
      </div>
    </div>
    
    <div class="family-tree-display" ref="containerRef">
      <FamilyTree 
        v-if="selectedDynasty" 
        :dynasty-name="selectedDynasty" 
        :royal-family-tree="royalFamilyTree"
        :width="treeWidth"
        :height="treeHeight"
      />
    </div>
  </div>
</template>

<style scoped>
.royal-family-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  overflow: hidden;
}

.header {
  padding: 0 10px;
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

.header h1 {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
  letter-spacing: 1px;
}

.dynasty-selector {
  padding: 15px 20px;
  background: white;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.selector-title {
  font-size: 1rem;
  color: #34495e;
  white-space: nowrap;
}

.dynasty-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-start;
}

.dynasty-btn {
  padding: 8px 16px;
  background: #ecf0f1;
  color: #34495e;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.dynasty-btn:hover {
  background: #bdc3c7;
  transform: translateY(-1px);
}

.dynasty-btn.active {
  background: #3498db;
  color: white;
}

.dynasty-btn.active:hover {
  background: #2980b9;
}

.family-tree-display {
  flex: 1;
  width: calc(100% - 40px);
  height: calc(100vh - 120px);
  overflow: hidden;
  position: relative;
  background: rgba(248, 249, 250, 0.7); /* 淡灰色背景 */
  margin: 20px; /* 四边留白 */
  border-radius: 8px;
  box-sizing: border-box;
}
</style>