<script setup>
import { ref, computed } from 'vue'
import { emperors } from '../data/emperors'
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
const emperorList = computed(() =>
  props.dynastyKey ? emperors[props.dynastyKey] || [] : []
)

// 使用 Composable 提取公共逻辑
const {
  // PIXELS_PER_DAY, // 移除
  RULER_WIDTH,
  START_PADDING,
  parseDate,
  formatDate,
  minDate,
  totalHeight,
  ticks,
  getTop, // 确保解构出 getTop
  getHeight // 新增
} = useDynastyTimeline(emperorList, dynastyInfo)

// 配置参数
const COL_GAP = 20

// 皇帝列配置
const EMP_COL_WIDTH = 50
const EMP_COL_COUNT = 4 // 预留4列给皇帝

// 皇后列配置
const QUEEN_COL_WIDTH = 30
const QUEEN_COL_COUNT = 4 // 预留4列给皇后

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

// 通用布局计算函数
const calculateLayout = (items, colWidth, startOffset, colorOffset = 0) => {
  const cols = []
  return items.map((item, index) => {
    const startDate = parseDate(item.start)
    const endDate = parseDate(item.end)
    // const startDays = (startDate - minDate.value) / (1000 * 60 * 60 * 24)
    // const endDays = (endDate - minDate.value) / (1000 * 60 * 60 * 24)
    // const durationDays = endDays - startDays

    // 使用新的 getTop 和 getHeight
    const top = getTop(startDate)
    const height = Math.max(getHeight(startDate, endDate), 20) // 最小高度20px

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
    // 如果是民国 (1912年及以后)，则使用特殊的分列逻辑
    if (startDate.getFullYear() >= 1912) {
      const year = startDate.getFullYear()
      const title = item.templeName || ''
      const name = item.name

      // 1. 南京临时政府
      if (title.includes('南京临时政府')) {
        colIndex = 0
      }
      // 2. 国民政府
      else if (title.includes('国民政府')) {
        // 国民政府使用第3列(index 2)和第4列(index 3)
        // 使用 epsilon 处理浮点数精度问题，允许无缝衔接
        const EPSILON = 0.001
        const col2End = cols[2] !== undefined ? cols[2] : -Infinity
        const col3End = cols[3] !== undefined ? cols[3] : -Infinity

        // 优先尝试第3列 (index 2)
        if (top >= col2End - EPSILON) {
          // 使用 top 比较
          colIndex = 2
        }
        // 如果冲突，尝试第4列 (index 3)
        else if (top >= col3End - EPSILON) {
          colIndex = 3
        }
        // 如果都冲突，强制放入第4列（或根据需要放入更后面的列，但目前只有4列）
        else {
          colIndex = 3
        }
      }
      // 3. 北洋政府 (兜底)
      else {
        colIndex = 1
      }
    } else {
      // 传统朝代：贪心算法
      for (let i = 0; i < cols.length; i++) {
        if (cols[i] <= top) {
          // 使用 top 比较
          colIndex = i
          break
        }
      }
      if (colIndex === -1) {
        colIndex = cols.length
      }
    }

    // 更新列的结束时间 (取最大值以处理重叠情况)
    if (colIndex !== -1) {
      const currentEnd =
        cols[colIndex] !== undefined ? cols[colIndex] : -Infinity
      cols[colIndex] = Math.max(currentEnd, top + height) // 更新为结束的 Y 坐标
    }

    return {
      ...item,
      colIndex,
      color: colors[(index + colorOffset) % colors.length],
      left: startOffset + colIndex * (colWidth + COL_GAP),
      top: top, // 使用计算好的 top
      height: height, // 使用计算好的 height
      durationDisplay,
      startDateStr: formatDate(startDate),
      endDateStr: formatDate(endDate)
    }
  })
}

// 皇帝布局计算
const processedEmperors = computed(() => {
  if (!emperorList.value.length) return []
  const startOffset = RULER_WIDTH + 20
  return calculateLayout(emperorList.value, EMP_COL_WIDTH, startOffset, 0)
})

// 皇后布局计算
const processedQueens = computed(() => {
  if (!emperorList.value.length) return []

  // 提取所有皇后
  const allQueens = []
  emperorList.value.forEach((emp) => {
    if (emp.queens && emp.queens.length) {
      emp.queens.forEach((q) => {
        allQueens.push({
          ...q,
          isQueen: true,
          emperorName: emp.name // 关联皇帝名字
        })
      })
    }
  })

  if (!allQueens.length) return []

  // 皇后区域起始位置：标尺 + 边距 + 皇帝区宽度(固定3列) + 间隔
  const startOffset =
    RULER_WIDTH + 20 + EMP_COL_COUNT * (EMP_COL_WIDTH + COL_GAP) + COL_GAP
  // 皇后颜色偏移一点，避免和皇帝颜色完全同步重复
  return calculateLayout(allQueens, QUEEN_COL_WIDTH, startOffset, 5)
})

const contentWidth = computed(() => {
  // 总宽度 = 标尺 + 边距 + 皇帝区(3列) + 间隔 + 皇后区(3列) + 边距
  // 这里皇后区也预留3列的宽度，或者根据实际皇后列数动态计算？
  // 用户需求是“皇后占4-6列”，暗示也是3列空间。
  // 为了保险，我们取 (实际皇后最大列数 和 3) 的最大值
  let queenMaxCol = 0
  if (processedQueens.value.length) {
    queenMaxCol = Math.max(...processedQueens.value.map((q) => q.colIndex))
  }
  const actualQueenCols = Math.max(queenMaxCol + 1, QUEEN_COL_COUNT)

  return (
    RULER_WIDTH +
    20 +
    EMP_COL_COUNT * (EMP_COL_WIDTH + COL_GAP) +
    COL_GAP +
    actualQueenCols * (QUEEN_COL_WIDTH + COL_GAP) +
    50
  )
})

// 背景区域配置
const bgZones = computed(() => {
  const empZoneWidth = EMP_COL_COUNT * (EMP_COL_WIDTH + COL_GAP) + COL_GAP / 2
  const queenStart =
    RULER_WIDTH + 20 + EMP_COL_COUNT * (EMP_COL_WIDTH + COL_GAP) + COL_GAP / 2
  // 皇后区宽度：剩余空间或者固定3列
  // 暂时按预留空间画背景
  const queenZoneWidth = QUEEN_COL_COUNT * (QUEEN_COL_WIDTH + COL_GAP) + COL_GAP

  return [
    {
      left: RULER_WIDTH + 20 - COL_GAP / 2,
      width: empZoneWidth,
      color: 'rgba(173, 216, 230, 0.1)' // 极淡蓝 (皇帝)
    },
    {
      left: queenStart,
      width: queenZoneWidth,
      color: 'rgba(255, 182, 193, 0.1)' // 极淡红 (皇后)
    }
  ]
})

// Tooltip
const tooltip = ref({
  show: false,
  x: 0,
  y: 0,
  name: '',
  range: ''
})

const showTooltip = (e, item) => {
  const startYear = parseDate(item.start).getFullYear()
  const isModern = startYear >= 1912

  tooltip.value = {
    show: true,
    x: e.clientX + 15,
    y: e.clientY + 15,
    name: item.isQueen
      ? `${item.name} (${item.emperorName}皇后)`
      : `${item.name} (${isModern ? '在职' : '在位'}${item.durationDisplay})`,
    range: `${item.startDateStr} - ${item.endDateStr}`,
    era: item.era && item.era.length ? item.era.join('、') : '无',
    temple: item.templeName || '无',
    posthumous: item.posthumousName || '无',
    isQueen: item.isQueen,
    isModern
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
    <div class="timeline-scroll" v-if="dynastyInfo">
      <svg :width="contentWidth" :height="totalHeight" class="timeline-svg">
        <!-- 分区背景底色 -->
        <g class="bg-zones">
          <rect
            v-for="(zone, index) in bgZones"
            :key="'zone-' + index"
            :x="zone.left"
            y="0"
            :width="zone.width"
            :height="totalHeight"
            :fill="zone.color"
          />
          <!-- 垂直分隔线 -->
          <line
            v-if="bgZones.length > 1"
            :x1="bgZones[0].left + bgZones[0].width"
            y1="0"
            :x2="bgZones[0].left + bgZones[0].width"
            :y2="totalHeight"
            stroke="#ccc"
            stroke-width="1"
            stroke-dasharray="5 5"
          />
        </g>

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
          <template v-if="tick.isLarge">
            <line
              :x1="RULER_WIDTH - 20"
              :y1="tick.top"
              :x2="RULER_WIDTH"
              :y2="tick.top"
              stroke="#333"
              stroke-width="2"
            />
            <text
              :x="RULER_WIDTH - 25"
              :y="tick.top"
              dy="5"
              text-anchor="end"
              font-size="13"
              fill="#333"
              :font-weight="tick.year % 100 === 0 ? 'bold' : 'normal'"
            >
              {{ tick.fullLabel || tick.label }}
            </text>
          </template>
          <template v-else-if="tick.isMedium">
            <line
              :x1="RULER_WIDTH - 15"
              :y1="tick.top"
              :x2="RULER_WIDTH"
              :y2="tick.top"
              stroke="#444"
              stroke-width="1.8"
            />
            <text
              :x="RULER_WIDTH - 20"
              :y="tick.top"
              dy="4"
              text-anchor="end"
              font-size="12"
              fill="#555"
            >
              {{ tick.label }}
            </text>
          </template>
          <template v-else-if="tick.isSmall">
            <line
              :x1="RULER_WIDTH - 10"
              :y1="tick.top"
              :x2="RULER_WIDTH"
              :y2="tick.top"
              stroke="#666"
              stroke-width="1.2"
            />
          </template>
          <template v-else-if="tick.isMicro">
            <line
              :x1="RULER_WIDTH - 6"
              :y1="tick.top"
              :x2="RULER_WIDTH"
              :y2="tick.top"
              stroke="#888"
              stroke-width="0.8"
            />
          </template>
        </g>

        <!-- 皇帝区块 -->
        <g class="emperors">
          <g
            v-for="emp in processedEmperors"
            :key="emp.name + emp.start"
            class="emperor-item"
            :transform="`translate(${emp.left}, ${emp.top})`"
            @mouseenter="showTooltip($event, emp)"
            @mousemove="moveTooltip($event)"
            @mouseleave="hideTooltip"
          >
            <rect
              x="0"
              y="0"
              :width="EMP_COL_WIDTH"
              :height="emp.height"
              rx="4"
              :fill="emp.color"
              stroke="#fff"
              stroke-width="1"
              opacity="0.9"
            />
            <!-- 名字 -->
            <text
              :x="EMP_COL_WIDTH / 2"
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
              {{
                (() => {
                  // 预估每个字符的高度 (字体12px + 间距)
                  const CHAR_H = 14
                  const PADDING = 8
                  const maxChars = Math.floor((emp.height - PADDING) / CHAR_H)

                  if (emp.name.length <= maxChars) {
                    return emp.name
                  }

                  // 需要截断
                  // 如果高度特别小 (如 < 30px)，只显示第一个字
                  if (emp.height < 30) {
                    return (
                      emp.name.substring(0, 1) + (emp.height > 20 ? '.' : '')
                    )
                  }

                  // 否则显示尽可能多的字 + ..
                  const keep = Math.max(1, maxChars - 1)
                  return emp.name.substring(0, keep) + '..'
                })()
              }}
            </text>
          </g>
        </g>

        <!-- 皇后区块 -->
        <g class="queens">
          <g
            v-for="queen in processedQueens"
            :key="queen.name + queen.start"
            class="queen-item"
            :transform="`translate(${queen.left}, ${queen.top})`"
            @mouseenter="showTooltip($event, queen)"
            @mousemove="moveTooltip($event)"
            @mouseleave="hideTooltip"
          >
            <rect
              x="0"
              y="0"
              :width="QUEEN_COL_WIDTH"
              :height="queen.height"
              rx="4"
              :fill="queen.color"
              stroke="#fff"
              stroke-width="1"
              opacity="0.9"
            />
            <!-- 名字 (小一点) -->
            <text
              :x="QUEEN_COL_WIDTH / 2"
              :y="queen.height / 2"
              dy="4"
              text-anchor="middle"
              fill="#fff"
              font-size="10"
              style="
                writing-mode: vertical-rl;
                text-orientation: upright;
                pointer-events: none;
              "
            >
              {{
                queen.height < 30 && queen.name.length > 1
                  ? queen.name.substring(0, 1) + '~'
                  : queen.height < 50 && queen.name.length > 2
                    ? queen.name.substring(0, 2) + '~'
                    : queen.name
              }}
            </text>
          </g>
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
      <template v-if="!tooltip.isQueen">
        <template v-if="tooltip.isModern">
          <div class="tooltip-detail">职务：{{ tooltip.temple }}</div>
        </template>
        <template v-else>
          <div class="tooltip-detail">年号：{{ tooltip.era }}</div>
          <div class="tooltip-detail">庙号：{{ tooltip.temple }}</div>
        </template>
      </template>
      <div class="tooltip-detail" v-if="!tooltip.isModern">
        谥号：{{ tooltip.posthumous }}
      </div>
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

.emperor-item:hover rect {
  opacity: 1;
  filter: brightness(1.1);
  cursor: pointer;
}

.queen-item:hover rect {
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
