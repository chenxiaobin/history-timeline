<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { dynastyData } from '../data/dynastyChronicle'

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

// 格式化日期显示，根据精度显示不同格式
const formatDate = (dateStr) => {
  if (typeof dateStr === 'number') {
    // 只有年份
    return dateStr < 0 ? `公元前${Math.abs(dateStr)}年` : `${dateStr}年`
  }
  
  // 处理字符串格式，支持负数年份
  let year, month, day
  if (dateStr.startsWith('-')) {
    // 负数年份
    const match = dateStr.match(/-([0-9]+)-?([0-9]+)?-?([0-9]+)?/)
    if (match) {
      year = -parseInt(match[1], 10)
      month = match[2] ? parseInt(match[2], 10) : undefined
      day = match[3] ? parseInt(match[3], 10) : undefined
    } else {
      return dateStr
    }
  } else {
    // 正数年份
    const parts = dateStr.split('-').map(Number)
    year = parts[0]
    month = parts[1]
    day = parts[2]
  }
  
  const isNegative = year < 0
  const absYear = Math.abs(year)
  const yearStr = isNegative ? `公元前${absYear}年` : `${year}年`
  
  if (month === undefined) {
    // 只有年份
    return yearStr
  } else if (day === undefined) {
    // 年份-月份
    return `${yearStr}${month}月`
  } else {
    // 年份-月份-日期
    return `${yearStr}${month}月${day}日`
  }
  
  return dateStr
}

// 格式化事件时间
const formatEventTime = (event) => {
  if (event.date) {
    return formatDate(event.date)
  } else if (event.start && event.end) {
    return `${formatDate(event.start)} - ${formatDate(event.end)}`
  }
  return ''
}

// 解析不同格式的时间为数字年份（支持：年份、年份-月份、年份-月份-日期）
// isEnd参数表示是否为结束时间，如果是结束时间且只有年份，则按该年12月31日处理
const parseDate = (dateStr, isEnd = false) => {
  if (typeof dateStr === 'number') {
    if (isEnd) {
      // 结束时间只有年份，按12月31日处理，返回接近下一年的小数（如290 → 290.999）
      return dateStr + 0.9999
    }
    // 开始时间只有年份，按1月1日处理，返回整数年份
    return dateStr
  }
  
  const parts = dateStr.split('-').map(Number)
  
  if (parts.length === 1) {
    // 只有年份
    if (isEnd) {
      // 结束时间，按12月31日处理
      return parts[0] + 0.9999
    }
    // 开始时间，按1月1日处理
    return parts[0]
  } else if (parts.length === 2) {
    // 年份-月份
    const year = parts[0]
    const month = parts[1]
    
    if (isEnd) {
      // 结束时间，按该月最后一天处理
      // 计算该月的天数
      const daysInMonth = new Date(year, month, 0).getDate()
      // 返回该月最后一天的小数年份
      return year + (month - 1) / 12 + (daysInMonth - 1) / (daysInMonth * 12)
    }
    // 开始时间，按该月第一天处理
    return year + (month - 1) / 12
  } else if (parts.length === 3) {
    // 年份-月份-日期，直接转换
    const year = parts[0]
    const month = parts[1]
    const day = parts[2]
    
    // 计算该月的天数
    const daysInMonth = new Date(year, month, 0).getDate()
    
    return year + (month - 1) / 12 + (day - 1) / (daysInMonth * 12)
  }
  
  return dateStr
}

// 判断事件时间是否在皇帝在位时间范围内
const isEventInReignPeriod = (event, emperor) => {
  // 解析皇帝在位时间范围：开始时间按1月1日，结束时间按12月31日
  const emperorStart = parseDate(emperor.reignStart, false)
  const emperorEnd = parseDate(emperor.reignEnd, true)
  
  if (event.date) {
    // 事件是具体日期
    const eventDate = parseDate(event.date)
    return eventDate >= emperorStart && eventDate <= emperorEnd
  } else if (event.start && event.end) {
    // 事件是时间范围，判断是否与皇帝在位时间有交集
    const eventStart = parseDate(event.start)
    const eventEnd = parseDate(event.end)
    
    return eventEnd >= emperorStart && eventStart <= emperorEnd
  }
  return false
}

// 响应式变量：当前选中的朝代
const selectedDynasty = ref('西晋')

// 滚动到选中的朝代
const scrollToDynasty = () => {
  const dynastyIndex = dynastyData.findIndex(dynasty => dynasty.name === selectedDynasty.value)
  if (dynastyIndex !== -1) {
    const dynastyBlock = document.querySelectorAll('.dynasty-block')[dynastyIndex]
    if (dynastyBlock) {
      dynastyBlock.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

// 监听选中朝代变化，滚动到对应位置
watch(selectedDynasty, scrollToDynasty)

// 组件挂载时，默认滚动到西晋
onMounted(() => {
  nextTick(() => {
    scrollToDynasty()
  })
})


</script>

<template>
  <div class="chronicle-page">
    <div class="header">
      <button class="back-home-btn" @click="goBack" title="返回首页">⌂</button>
      <h1>皇朝年谱</h1>
      <div class="dynasty-selector">
        <select v-model="selectedDynasty" class="dynasty-dropdown">
          <option v-for="dynasty in dynastyData" :key="dynasty.name" :value="dynasty.name">
            {{ dynasty.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="content-area">
      <!-- 按朝代从上到下排列 -->
      <div class="dynasty-timeline">
        <!-- 每个朝代块 -->
        <div 
          v-for="(dynasty, index) in dynastyData" 
          :key="index"
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
              v-for="(emperor, index) in dynasty.emperors" 
              :key="index"
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
                  v-for="(event, index) in emperor.events" 
                  :key="index"
                  class="year-item"
                  :class="{ 'out-of-reign': !isEventInReignPeriod(event, emperor) }"
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
  gap: 20px;
  z-index: 10;
  height: 50px;
  box-sizing: border-box;
}

.dynasty-selector {
  display: flex;
  align-items: center;
}

.dynasty-dropdown {
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #333;
  cursor: pointer;
  min-width: 120px;
  transition: all 0.3s ease;
}

.dynasty-dropdown:hover {
  border-color: #4290ff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dynasty-dropdown:focus {
  outline: none;
  border-color: #4290ff;
  box-shadow: 0 0 0 2px rgba(66, 144, 255, 0.2);
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

/* 超出皇帝在位时间的事件样式 */
.year-item.out-of-reign {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  color: #999;
}

.year-item.out-of-reign .event-time {
  color: #999;
}

.year-item.out-of-reign .event-name {
  color: #999;
}

.year-item.out-of-reign .event-description {
  color: #999;
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