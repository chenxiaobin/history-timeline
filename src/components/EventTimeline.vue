<script setup>
import { ref, computed } from 'vue'
import { majorEvents } from '../data/events'
import { useDynastyTimeline } from '../composables/useDynastyTimeline'
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
const eventList = computed(() =>
  props.dynastyKey ? majorEvents[props.dynastyKey] || [] : []
)

// 使用 Composable 提取公共逻辑
const {
  PIXELS_PER_DAY,
  RULER_WIDTH,
  START_PADDING,
  parseDate,
  formatDate,
  minDate,
  totalHeight,
  ticks
} = useDynastyTimeline(eventList, dynastyInfo)

// 配置参数
const COL_WIDTH = 130
const COL_GAP = 10

const colors = [
  '#E65100', // Orange 900
  '#1B5E20', // Green 900
  '#0D47A1', // Blue 900
  '#B71C1C' // Red 900
]

const processedEvents = computed(() => {
  if (!eventList.value.length) return []

  const startOffset = RULER_WIDTH + 20
  const cols = [] // 记录每列的结束时间 (天数)

  // 先对事件按时间排序，确保贪心算法正确工作
  const sortedEvents = [...eventList.value].sort((a, b) => {
    const dateA = parseDate(a.start || a.date)
    const dateB = parseDate(b.start || b.date)
    return dateA - dateB
  })

  return sortedEvents.map((item, index) => {
    const startDate = parseDate(item.start || item.date)
    const endDate = item.end ? parseDate(item.end) : startDate

    const startDays = (startDate - minDate.value) / (1000 * 60 * 60 * 24)
    const endDays = (endDate - minDate.value) / (1000 * 60 * 60 * 24)

    // 如果是单点事件，给一点高度
    const isPoint = !item.end
    const durationDays = isPoint ? 0 : endDays - startDays
    const height = Math.max(durationDays * PIXELS_PER_DAY, 10) // 最小高度10px

    // 贪心布局
    let colIndex = -1
    // 为防止文字重叠，如果是点事件，占用空间稍微大一点；如果是范围事件，也要考虑圆点和文字的占用
    // 文字在上方起始点旁边，结束点只有一个圆点。
    // 但是为了视觉美观，避免紧贴，多留一些空间。
    // 之前加了 20/PIXELS_PER_DAY，对于民国 (0.2) 来说是 100 天，大约 3 个月。
    // 国民党一大(1924-01) 和 黄埔军校(1924-06) 相差 5 个月。
    // 理论上 1924-01 + 3个月 = 1924-04 < 1924-06，应该不重叠。
    // 但是下面 cols 更新时又加了一次间距，导致变成了 +6个月。
    const occupyEndDays =
      endDays + (isPoint ? 20 / PIXELS_PER_DAY : 5 / PIXELS_PER_DAY)

    for (let i = 0; i < cols.length; i++) {
      if (cols[i] <= startDays) {
        colIndex = i
        break
      }
    }
    if (colIndex === -1) {
      colIndex = cols.length
    }
    // 更新该列的结束时间，不再额外叠加间距，因为 occupyEndDays 已经包含缓冲了
    // 稍微加一点点 (1px) 防止精度误差即可
    cols[colIndex] = occupyEndDays + 1 / PIXELS_PER_DAY

    // 颜色处理：战争红色，政变紫色，其他深蓝
    let color
    if (item.type === 'war') {
      color = '#D32F2F' // Red 700
    } else if (item.type === 'coup') {
      color = '#7B1FA2' // Purple 700
    } else {
      color = '#0D47A1' // Blue 900
    }

    return {
      ...item,
      isPoint,
      colIndex,
      color,
      left: startOffset + colIndex * (COL_WIDTH + COL_GAP),
      top: startDays * PIXELS_PER_DAY + START_PADDING,
      height
    }
  })
})

const contentWidth = computed(() => {
  if (!processedEvents.value.length) return RULER_WIDTH + 200
  const maxCol = Math.max(...processedEvents.value.map((e) => e.colIndex))
  return RULER_WIDTH + 20 + (maxCol + 1) * (COL_WIDTH + COL_GAP) + 50
})

// Tooltip
const tooltip = ref({ show: false, x: 0, y: 0, content: '' })
const showTooltip = (e, item) => {
  const startDate = parseDate(item.start || item.date)
  const startStr = formatDate(startDate)
  let timeStr = startStr

  if (item.end) {
    const endDate = parseDate(item.end)
    const endStr = formatDate(endDate)
    timeStr = `${startStr} - ${endStr}`
  }

  tooltip.value = {
    show: true,
    x: e.clientX + 15,
    y: e.clientY + 15,
    content: `<strong>${item.name}</strong><br><span style="color: #ccc; font-size: 12px;">${timeStr}</span><br>${item.description || ''}`
  }
}
const hideTooltip = () => {
  tooltip.value.show = false
}
const moveTooltip = (e) => {
  if (tooltip.value.show) {
    tooltip.value.x = e.clientX + 15
    tooltip.value.y = e.clientY + 15
  }
}
</script>

<template>
  <div class="timeline-container">
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

        <!-- 事件 -->
        <g class="events">
          <g
            v-for="ev in processedEvents"
            :key="ev.name"
            class="event-item"
            :transform="`translate(${ev.left}, ${ev.top})`"
            @mouseenter="showTooltip($event, ev)"
            @mousemove="moveTooltip($event)"
            @mouseleave="hideTooltip"
          >
            <!-- 连线到时间轴 -->
            <line
              :x1="-(ev.left - RULER_WIDTH)"
              y1="0"
              x2="5"
              y2="0"
              stroke="#ddd"
              stroke-dasharray="2 2"
            />

            <template v-if="ev.isPoint">
              <circle cx="5" cy="0" r="3" :fill="ev.color" />
              <text
                x="15"
                y="0"
                dy="4"
                font-size="12"
                :fill="ev.color"
                font-weight="bold"
              >
                {{ ev.name }}
              </text>
            </template>
            <template v-else>
              <!-- 垂直连接线 (虚线) -->
              <line
                x1="5"
                y1="0"
                x2="5"
                :y2="ev.height"
                :stroke="ev.color"
                stroke-width="1"
                stroke-dasharray="4 4"
              />
              <!-- 起始点 -->
              <circle cx="5" cy="0" r="3" :fill="ev.color" />
              <!-- 结束点 -->
              <circle cx="5" :cy="ev.height" r="3" :fill="ev.color" />
              <!-- 文本标签 -->
              <text
                x="15"
                y="0"
                dy="4"
                font-size="12"
                :fill="ev.color"
                font-weight="bold"
              >
                {{ ev.name }}
              </text>
            </template>
          </g>
        </g>
      </svg>
    </div>

    <div
      v-if="tooltip.show"
      class="custom-tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      v-html="tooltip.content"
    ></div>
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
  text-align: center;
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
.event-item:hover {
  cursor: pointer;
  opacity: 0.8;
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
  max-width: 300px;
}
</style>
