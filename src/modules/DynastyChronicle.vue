<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/')
}

// 格式化年份显示
const formatYear = (year, short = false) => {
  if (short) {
    return year < 0 ? `前${Math.abs(year)}年` : `${year}年`
  }
  return year < 0 ? `公元前${Math.abs(year)}年` : `${year}年`
}

// 格式化事件时间
const formatEventTime = (event) => {
  if (event.date) {
    return formatYear(event.date)
  } else if (event.start && event.end) {
    return `${formatYear(event.start)} - ${formatYear(event.end)}`
  }
  return ''
}

// 模拟数据：朝代和帝王信息
const dynastyData = [
  {
    id: 'qin',
    name: '秦朝',
    startYear: -221,
    endYear: -206,
    emperors: [
      { 
        id: 'qin-shihuang', 
        name: '秦始皇', 
        realName: '嬴政',
        reignStart: -221, 
        reignEnd: -210,
        events: [
          { id: 'qin-1', date: -221, name: '统一六国', description: '秦始皇嬴政完成统一大业，建立秦朝，自称始皇帝' },
          { id: 'qin-2', start: -221, end: -210, name: '修建长城', description: '为抵御北方匈奴，秦始皇下令修建万里长城' }
        ]
      },
      { 
        id: 'qin-erhuang', 
        name: '秦二世', 
        realName: '胡亥',
        reignStart: -210, 
        reignEnd: -207,
        events: [
          { id: 'qin-5', date: -210, name: '秦始皇驾崩', description: '秦始皇在东巡途中驾崩，胡亥继位为秦二世' },
          { id: 'qin-6', start: -209, end: -207, name: '陈胜吴广起义', description: '陈胜吴广在大泽乡发动起义，揭开秦末农民起义序幕' }
        ]
      }
    ]
  }
]
</script>

<template>
  <div class="chronicle-page">
    <div class="header">
      <button class="back-home-btn" @click="goBack" title="返回首页">⌂</button>
      <h1>皇朝年谱</h1>
    </div>

    <div class="content-area">
      <!-- 按朝代从上到下排列 -->
      <div class="dynasty-timeline">
        <!-- 每个朝代块 -->
        <div 
          v-for="dynasty in dynastyData" 
          :key="dynasty.id"
          class="dynasty-block"
        >
          <!-- 朝代头部信息 -->
          <div class="dynasty-header">
            <h2>{{ dynasty.name }}</h2>
            <div class="dynasty-years">
              {{ dynasty.startYear < 0 ? `公元前${Math.abs(dynasty.startYear)}年` : `${dynasty.startYear}年` }} - 
              {{ dynasty.endYear < 0 ? `公元前${Math.abs(dynasty.endYear)}年` : `${dynasty.endYear}年` }}
            </div>
          </div>
          
          <!-- 帝王列表：每个帝王一行，分左中右三列 -->
          <div class="emperors-list">
            <div 
              v-for="emperor in dynasty.emperors" 
              :key="emperor.id"
              class="emperor-row"
            >
              <!-- 中间：皇帝信息 -->
              <div class="emperor-column">
                <div class="emperor-item">
                  <div class="emperor-title">
                    <strong>{{ emperor.name }}</strong>
                  </div>
                  <div class="emperor-real-name">
                    {{ emperor.realName }}
                  </div>
                  <div class="emperor-reign">
                    {{ formatYear(emperor.reignStart, true) }} - {{ formatYear(emperor.reignEnd, true) }}
                  </div>
                </div>
              </div>
              
              <!-- 右侧：事件列表 -->
              <div class="year-column">
                <div 
                  v-for="event in emperor.events" 
                  :key="event.id"
                  class="year-item"
                >
                  <div class="event-time">
                    {{ formatEventTime(event) }} 
                    <span v-if="event.name" class="event-name">{{ event.name }}</span>
                  </div>
                  <div class="event-description">
                    {{ event.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chronicle-page {
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.header {
  padding: 10px 10px;
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

.content-area {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

/* 朝代时间轴容器 */
.dynasty-timeline {
  width: 100%;
  margin: 0 auto;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 每个朝代块 */
.dynasty-block {
  margin-bottom: 30px;
  position: relative;
}

/* 朝代头部 */
.dynasty-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #4290ff;
  color: white;
  font-weight: bold;
}

.dynasty-header h2 {
  margin: 0;
  font-size: 18px;
  text-align: left;
}

.dynasty-header .dynasty-years {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  text-align: right;
}

/* 帝王列表 */
.emperors-list {
  display: flex;
  flex-direction: column;
}

/* 每个帝王行 */
.emperor-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 10px;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.emperor-row:hover {
  background-color: #fafafa;
}

.dynasty-marker {
  width: 10px;
  height: 10px;
  background: #3498db;
  border-radius: 50%;
  margin-left: 20px;
  position: relative;
}

/* 中间：皇帝列 */
.emperor-column {
  display: flex;
  align-items: center;
}

.emperor-item {
  background: #f8f9fa;
  border: 2px solid #3498db;
  border-radius: 6px;
  padding: 12px;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.emperor-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.emperor-real-name {
  font-size: 14px;
  color: #666;
  font-weight: normal;
}

.emperor-reign {
  font-size: 12px;
  color: #999;
  font-weight: normal;
}

.emperor-item:hover {
  background: #e3f2fd;
  transform: translateX(5px);
}

/* 右侧：纪年列 */
.year-column {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: column;
}

.year-item {
  background: #f0f8ff;
  border: 1px solid #add8e6;
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
  color: #555;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.event-time {
  font-weight: bold;
  color: #333;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.event-name {
  color: #3498db;
  font-weight: normal;
}

.event-description {
  font-size: 13px;
  color: #666;
  text-align: left;
  line-height: 1.4;
}

.reign-period {
  text-align: center;
}

/* 最后一个朝代块 */
.dynasty-block:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dynasty-header,
  .emperor-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .dynasty-header h2,
  .dynasty-header .dynasty-years {
    grid-column: 1;
  }
  
  .dynasty-marker {
    display: none;
  }
}
</style>