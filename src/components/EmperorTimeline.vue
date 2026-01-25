<script setup>
import { ref, computed, onMounted } from 'vue'
import { emperors } from '../data/emperors'
import {
  majorDynasties,
  detailedDynasties,
  otherDynasties
} from '../data/dynasties'

const props = defineProps({
  dynastyKey: String
})

// 查找朝代信息
const allDynasties = [
  ...majorDynasties,
  ...detailedDynasties,
  ...otherDynasties
]

const dynastyInfo = computed(() =>
  allDynasties.find((d) => d.key === props.dynastyKey)
)
const emperorList = computed(() =>
  props.dynastyKey ? emperors[props.dynastyKey] || [] : []
)

// 配置参数
const PIXELS_PER_DAY = 0.2 // 每天占用的像素高度 (5天1px)
const RULER_WIDTH = 80
const COL_WIDTH = 50
const COL_GAP = 20
const START_PADDING = 40
const END_PADDING = 100

// 日期解析工具
const parseDate = (dateStr) => {
  // 如果是数字年份 (如 -221 或 1368)
  if (typeof dateStr === 'number') {
    return new Date(dateStr, 0, 1) // 默认为当年1月1日
  }

  // 处理字符串日期
  if (typeof dateStr === 'string') {
    dateStr = dateStr.trim()
    // 尝试手动解析 YYYY-MM-DD 或 -YYYY-MM-DD
    // 正则匹配：可选的负号，年份，月份，日期
    const match = dateStr.match(/^(-?)(\d+)-(\d+)-(\d+)$/)
    if (match) {
      const isBC = match[1] === '-'
      const year = parseInt(match[2], 10) * (isBC ? -1 : 1)
      const month = parseInt(match[3], 10) - 1 // 月份从0开始
      const day = parseInt(match[4], 10)

      const date = new Date(year, month, day)
      // 修正年份：JS Date构造函数对于 0-99 的年份会处理为 1900-1999
      // 如果原本就是 0-99 (公元后) 或 负数，需要用 setFullYear 修正
      date.setFullYear(year)
      return date
    }
  }

  // 兜底
  return new Date(dateStr)
}

// 格式化日期显示
const formatDate = (date) => {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const yearStr = y < 0 ? `前${Math.abs(y)}年` : `${y}年`
  return `${yearStr}年${m}月${d}日`
}

// 计算时间范围
// 获取所有皇帝的起止时间，找出最早和最晚的日期
const allDates = computed(() =>
  emperorList.value.flatMap((e) => [parseDate(e.start), parseDate(e.end)])
)

const minDate = computed(() => {
  if (!allDates.value.length) return new Date()
  const d = new Date(Math.min(...allDates.value))
  d.setFullYear(d.getFullYear() - 1)
  return d
})

const maxDate = computed(() => {
  if (!allDates.value.length) return new Date()
  const d = new Date(Math.max(...allDates.value))
  d.setFullYear(d.getFullYear() + 1)
  return d
})

const totalDays = computed(
  () => (maxDate.value - minDate.value) / (1000 * 60 * 60 * 24)
)
const totalHeight = computed(
  () => totalDays.value * PIXELS_PER_DAY + START_PADDING + END_PADDING
)

const colors = [
  '#b71c1c', // Red 900
  '#880e4f', // Pink 900
  '#4a148c', // Purple 900
  '#311b92', // Deep Purple 900
  '#1a237e', // Indigo 900
  '#0d47a1', // Blue 900
  '#01579b', // Light Blue 900
  '#006064', // Cyan 900
  '#004d40', // Teal 900
  '#1b5e20', // Green 900
  '#33691e', // Light Green 900
  '#827717', // Lime 900
  '#e65100', // Orange 900
  '#bf360c', // Deep Orange 900
  '#3e2723', // Brown 900
  '#212121', // Grey 900
  '#263238' // Blue Grey 900
]

// 布局计算
const processedEmperors = computed(() => {
  if (!emperorList.value.length) return []

  const cols = []
  return emperorList.value.map((emp, index) => {
    const startDate = parseDate(emp.start)
    const endDate = parseDate(emp.end)
    const startDays = (startDate - minDate.value) / (1000 * 60 * 60 * 24)
    const endDays = (endDate - minDate.value) / (1000 * 60 * 60 * 24)
    const durationDays = endDays - startDays

    // 计算精确的在位时间显示
    let y = endDate.getFullYear() - startDate.getFullYear()
    let m = endDate.getMonth() - startDate.getMonth()
    let d = endDate.getDate() - startDate.getDate()

    if (d < 0) {
      m--
      const prevMonthDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        0
      )
      d += prevMonthDate.getDate()
    }
    if (m < 0) {
      y--
      m += 12
    }

    let durationDisplay = ''
    if (y > 0) {
      durationDisplay = m > 0 ? `${y}年${m}个月` : `${y}年`
    } else if (m > 0) {
      durationDisplay = `${m}个月`
    } else {
      durationDisplay = `${d}天`
    }

    let colIndex = -1
    // 简单贪心算法 (基于天数)
    for (let i = 0; i < cols.length; i++) {
      if (cols[i] <= startDays) {
        colIndex = i
        break
      }
    }
    if (colIndex === -1) {
      colIndex = cols.length
    }
    cols[colIndex] = endDays

    return {
      ...emp,
      colIndex,
      color: colors[index % colors.length],
      left: RULER_WIDTH + 20 + colIndex * (COL_WIDTH + COL_GAP),
      top: startDays * PIXELS_PER_DAY + START_PADDING,
      height: Math.max(durationDays * PIXELS_PER_DAY, 20), // 最小高度20px
      durationDisplay,
      startDateStr: formatDate(startDate),
      endDateStr: formatDate(endDate)
    }
  })
})

const maxCol = computed(() => {
  if (!processedEmperors.value.length) return 0
  return Math.max(...processedEmperors.value.map((e) => e.colIndex))
})

const contentWidth = computed(() => {
  return RULER_WIDTH + 20 + (maxCol.value + 1) * (COL_WIDTH + COL_GAP) + 50
})

// 刻度生成 (按年和月生成)
const ticks = computed(() => {
  const arr = []
  const startYear = minDate.value.getFullYear()
  const endYear = maxDate.value.getFullYear()

  for (let y = startYear; y <= endYear; y++) {
    // 年刻度
    const yearDate = new Date(y, 0, 1)
    const yearDays = (yearDate - minDate.value) / (1000 * 60 * 60 * 24)
    if (yearDays >= 0 && yearDays <= totalDays.value) {
      arr.push({
        type: 'year',
        label: y < 0 ? `前${Math.abs(y)}年` : `${y}年`, // 格式化年份显示
        top: yearDays * PIXELS_PER_DAY + START_PADDING,
        isFirst: y === startYear // 标记是否为第一个刻度
      })
    }

    // 月刻度 (1-11月，因为1月和年刻度重合，这里只画2-12月)
    for (let m = 1; m < 12; m++) {
      const monthDate = new Date(y, m, 1)
      const monthDays = (monthDate - minDate.value) / (1000 * 60 * 60 * 24)
      if (monthDays >= 0 && monthDays <= totalDays.value) {
        arr.push({
          type: 'month',
          top: monthDays * PIXELS_PER_DAY + START_PADDING
        })
      }
    }
  }
  return arr
})

// Tooltip
const tooltip = ref({
  show: false,
  x: 0,
  y: 0,
  name: '',
  range: ''
})

const showTooltip = (e, emp) => {
  tooltip.value = {
    show: true,
    x: e.clientX + 15,
    y: e.clientY + 15,
    name: `${emp.name} (在位${emp.durationDisplay})`,
    range: `${emp.startDateStr} - ${emp.endDateStr}`,
    era: emp.era && emp.era.length ? emp.era.join('、') : '无',
    temple: emp.templeName || '无',
    posthumous: emp.posthumousName || '无'
  }
}

const moveTooltip = (e) => {
  if (tooltip.value.show) {
    tooltip.value.x = e.clientX + 15
    tooltip.value.y = e.clientY + 15
  }
}

const hideTooltip = () => {
  tooltip.value.show = false
}
</script>

<template>
  <div class="timeline-container">
    <div class="header">
      <h2 v-if="dynastyInfo">{{ dynastyInfo.name }} - 皇帝/君主时间线</h2>
      <h2 v-else>未找到朝代信息</h2>
    </div>

    <div class="timeline-scroll" v-if="dynastyInfo">
      <svg :width="contentWidth" :height="totalHeight" class="timeline-svg">
        <!-- 标尺线 -->
        <line
          :x1="RULER_WIDTH"
          y1="0"
          :x2="RULER_WIDTH"
          :y2="totalHeight"
          stroke="#333"
          stroke-width="2"
        />

        <!-- 刻度 -->
        <g v-for="(tick, idx) in ticks" :key="idx">
          <!-- 年刻度 -->
          <template v-if="tick.type === 'year'">
            <line
              :x1="RULER_WIDTH - 10"
              :y1="tick.top"
              :x2="RULER_WIDTH"
              :y2="tick.top"
              stroke="#666"
              stroke-width="1.5"
            />
            <text
              :x="RULER_WIDTH - 15"
              :y="tick.top"
              dy="4"
              text-anchor="end"
              font-size="12"
              fill="#666"
            >
              {{ tick.label }}
            </text>
          </template>
          <!-- 月刻度 -->
          <template v-else>
            <line
              :x1="RULER_WIDTH - 5"
              :y1="tick.top"
              :x2="RULER_WIDTH"
              :y2="tick.top"
              stroke="#999"
              stroke-width="1"
            />
          </template>
        </g>

        <!-- 皇帝区块 -->
        <g
          v-for="emp in processedEmperors"
          :key="emp.name"
          class="emperor-item"
          :transform="`translate(${emp.left}, ${emp.top})`"
          @mouseenter="showTooltip($event, emp)"
          @mousemove="moveTooltip($event)"
          @mouseleave="hideTooltip"
        >
          <rect
            x="0"
            y="0"
            :width="COL_WIDTH"
            :height="emp.height"
            rx="4"
            :fill="emp.color"
            stroke="#fff"
            stroke-width="1"
            opacity="0.9"
          />
          <!-- 名字 -->
          <text
            :x="COL_WIDTH / 2"
            :y="emp.height / 2"
            dy="4"
            text-anchor="middle"
            fill="#fff"
            font-size="12"
            font-weight="bold"
            style="
              writing-mode: vertical-rl;
              text-orientation: upright;
              pointer-events: none;
            "
          >
            {{ emp.name }}
          </text>
        </g>
      </svg>
    </div>

    <!-- Tooltip -->
    <div
      v-if="tooltip.show"
      class="custom-tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="tooltip-name">{{ tooltip.name }}</div>
      <div class="tooltip-range">{{ tooltip.range }}</div>
      <div class="tooltip-detail">年号：{{ tooltip.era }}</div>
      <div class="tooltip-detail">庙号：{{ tooltip.temple }}</div>
      <div class="tooltip-detail">谥号：{{ tooltip.posthumous }}</div>
    </div>
  </div>
</template>

<style scoped>
.timeline-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.header {
  padding: 10px 10px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  z-index: 10;
  height: 50px; /* 固定高度，与左侧保持一致 */
  box-sizing: border-box;
}

.header h2 {
  flex: 1;
  /* text-align: center; */
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.timeline-scroll {
  flex: 1;
  overflow: auto;
  position: relative;
}

.emperor-item:hover rect {
  opacity: 1;
  filter: brightness(1.1);
  cursor: pointer;
}

.custom-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: none;
  z-index: 100;
  white-space: nowrap;
}

.tooltip-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.tooltip-range {
  font-size: 12px;
  color: #ddd;
  margin-bottom: 4px;
}

.tooltip-detail {
  font-size: 12px;
  color: #ccc;
  margin-top: 2px;
}
</style>
