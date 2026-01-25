<script setup>
import { ref, computed } from 'vue'
import EmperorTimeline from './EmperorTimeline.vue'
import EventTimeline from './EventTimeline.vue'
import {
  majorDynasties,
  detailedDynasties,
  otherDynasties
} from '../data/dynasties'
import { emperors } from '../data/emperors'

const selectedDynastyKey = ref(null)
const activeTab = ref('rulers') // 'rulers' | 'events'
const timelineContainer = ref(null)

// 配置参数
const PIXELS_PER_YEAR = 10 // 每年占用的像素高度
const PIXELS_PER_DAY_ROC = 0.2 // 民国阶段每天占用的像素高度
const ROC_START_YEAR = 1912 // 民国开始年份
const ROC_END_YEAR = 1949 // 民国结束年份 (用于分段)
const RULER_WIDTH = 80 // 时间轴标尺宽度（主轴在左侧）
const MAJOR_COL_WIDTH = 50 // 正统朝代宽度
const DETAILED_COL_WIDTH = 30 // 详细朝代宽度
const OTHER_COL_WIDTH = 20 // 非正统朝代宽度
const COL_GAP = 10 // 列间距
const START_PADDING = 50 // 起始留白
const END_PADDING = 100 // 结束留白

// 合并计算总的时间范围
const rawAllDynasties = [
  ...majorDynasties,
  ...detailedDynasties,
  ...otherDynasties
]

// 确保每个朝代都有 key，如果没有则使用 name
const allDynasties = rawAllDynasties.map((d) => ({
  ...d,
  key: d.key || d.name
}))

// 辅助函数：解析年份（支持数字和字符串）
const parseYear = (val) => {
  if (typeof val === 'number') return val
  if (typeof val === 'string') {
    // 处理 '-202' 或 '1912-01-01' 或 '-202-02-01'
    const parts = val.split('-')
    // 如果第一部分是空字符串，说明是负数
    if (parts[0] === '') {
      return -parseInt(parts[1], 10)
    }
    return parseInt(parts[0], 10)
  }
  return 0
}

// 下拉框排序逻辑
const sortedDynastiesForSelect = computed(() => {
  // 1. 构建父子关系 Map
  const parentMap = new Map()
  const roots = []

  // 初始化所有朝代为节点
  allDynasties.forEach((d) => {
    // 标记是否有父级
    // 注意：有些 belongTo 的父级本身也是详细朝代或者不存在于列表中（如“十国”在 majorDynasties 中是“五代十国”）
    // 这里需要特殊处理一下“五代十国”和“十国”的关系，或者直接按 belongTo 归类
    // 如果 belongTo 存在，且在列表中能找到对应的父级（或者父级就是 major 中的某一个）
    // 比如“魏” belongTo “三国”，“三国”在 majorDynasties 中
    // “十国”下的朝代 belongTo “十国”，但“十国”不在 majorDynasties 中，major 中只有“五代十国”
    // 所以“十国”本身可能是一个虚拟分组，或者需要把“十国”归到“五代十国”下？
    // 看数据：majorDynasties 有“五代十国”。detailedDynasties 有 belongTo '五代十国' 的，也有 belongTo '十国' 的。
    // 暂时简单处理：按 belongTo 分组，如果 belongTo 的目标在列表中存在，则作为子级；否则作为独立项（或者把 belongTo 当作分组标签）
    // 为了满足“详细朝代要跟到具体belongTo的后面”，我们采用一种平铺的排序策略：
    // 1. 找到所有“顶级”朝代（没有 belongTo，或者 belongTo 的目标不在当前列表中）
    // 2. 对顶级朝代按 start 排序
    // 3. 遍历排序后的顶级朝代，加入结果列表。
    // 4. 查找所有 belongTo 等于当前顶级朝代名称的子朝代，按 start 排序，插入结果列表。
    // 5. 递归？（目前只有一级嵌套，可以简单点）
    // 特殊情况：“十国”下的朝代 belongTo="十国"，但列表中没有 name="十国" 的条目（只有“五代十国”）。
    // 这种情况下，这些“十国”的朝代会变成“孤儿”，如果不处理的话。
    // 我们可以把 belongTo="十国" 的映射到 belongTo="五代十国"？或者直接把它们放在“五代十国”后面。
  })

  // 简化策略：
  // 1. 提取所有没有 belongTo 的朝代作为主干，按 start 排序。
  // 2. 提取所有有 belongTo 的朝代，按 belongTo 分组。
  // 3. 遍历主干，将当前朝代加入结果。然后检查是否有以该朝代名为 belongTo 的子朝代，如果有，按 start 排序后加入结果。
  // 4. 对于那些 belongTo 的目标不存在于主干中的朝代（如 belongTo="十国"），需要特殊处理：
  //    找到它们应该跟随的“逻辑父级”。对于“十国”，逻辑父级是“五代十国”。

  const mainList = allDynasties
    .filter((d) => !d.belongTo)
    .sort((a, b) => a.start - b.start)
  const childrenMap = new Map()

  // 预处理 belongTo 映射关系（解决别名问题）
  const belongToAlias = {
    十国: '五代十国',
    五代: '五代十国'
  }

  allDynasties
    .filter((d) => d.belongTo)
    .forEach((d) => {
      const parentName = belongToAlias[d.belongTo] || d.belongTo
      if (!childrenMap.has(parentName)) {
        childrenMap.set(parentName, [])
      }
      childrenMap.get(parentName).push(d)
    })

  // 对每个组内的子朝代按 start 排序
  // 并处理特殊排序：五代十国中，五代在前，十国在后
  childrenMap.forEach((list, parentName) => {
    if (parentName === '五代十国') {
      // 分离五代和十国
      const fiveDynasties = list
        .filter((d) => d.belongTo === '五代')
        .sort((a, b) => a.start - b.start)
      const tenKingdoms = list
        .filter((d) => d.belongTo === '十国')
        .sort((a, b) => a.start - b.start)

      // 清空原数组并重新填充
      list.length = 0
      // 添加前缀逻辑由模板处理，这里只负责排序
      list.push(...fiveDynasties, ...tenKingdoms)
    } else {
      list.sort((a, b) => a.start - b.start)
    }
  })

  const result = []
  mainList.forEach((parent) => {
    result.push(parent)
    if (childrenMap.has(parent.name)) {
      result.push(...childrenMap.get(parent.name))
    }
  })

  // 检查是否有遗漏的（即 belongTo 的父级不在 mainList 中的，除了已处理的别名）
  // 在当前数据中，应该都覆盖了。
  // 比如 'Liao', 'WesternXia', 'Jin' 在 otherDynasties 中，没有 belongTo，会作为 mainList 的一部分按时间插入。

  return result
})
const minYear = Math.min(...allDynasties.map((d) => parseYear(d.start))) - 10
const maxYear = Math.max(...allDynasties.map((d) => parseYear(d.end))) + 10

// 计算 Y 坐标的辅助函数
const getY = (yearOrDateStr) => {
  // 解析输入，可能是数字年份，也可能是日期字符串
  let year,
    month = 0,
    day = 0

  if (typeof yearOrDateStr === 'string') {
    // 处理字符串日期
    const parts = yearOrDateStr.split('-')
    // 检查是否为负数日期 (例如 "-202-02-28")
    if (parts[0] === '') {
      // 负数：parts[0]是空，parts[1]是年，parts[2]是月，parts[3]是日
      year = -parseInt(parts[1], 10)
      if (parts[2]) month = parseInt(parts[2], 10) - 1
      if (parts[3]) day = parseInt(parts[3], 10)
    } else {
      // 正数：parts[0]是年，parts[1]是月，parts[2]是日
      year = parseInt(parts[0], 10)
      if (parts[1]) month = parseInt(parts[1], 10) - 1
      if (parts[2]) day = parseInt(parts[2], 10)
    }
  } else {
    year = yearOrDateStr
  }

  // 分段计算：
  // 1. 民国之前 (minYear -> ROC_START_YEAR)
  // 2. 民国时期 (ROC_START_YEAR -> ROC_END_YEAR)
  // 3. 民国之后 (ROC_END_YEAR -> maxYear)

  // 基础高度：民国之前的年份
  const preRocYears = ROC_START_YEAR - minYear
  const preRocHeight = preRocYears * PIXELS_PER_YEAR

  if (year < ROC_START_YEAR) {
    return (year - minYear) * PIXELS_PER_YEAR + START_PADDING
  } else if (year <= ROC_END_YEAR) {
    // 民国期间：按天计算
    // 计算从 1912-01-01 到当前日期的总天数
    // 简化：年差 * 365.25 + (当前月日相对于年初的天数)
    const yearDiff = year - ROC_START_YEAR
    const daysInCurrentYear = month * 30.4 + day // 估算
    const totalDays = yearDiff * 365.25 + daysInCurrentYear

    return preRocHeight + totalDays * PIXELS_PER_DAY_ROC + START_PADDING
  } else {
    // 民国之后
    const rocDurationYears = ROC_END_YEAR - ROC_START_YEAR + 1 // 包含1949全年
    const rocDurationDays = rocDurationYears * 365.25
    const rocHeight = rocDurationDays * PIXELS_PER_DAY_ROC

    const postRocYears = year - ROC_END_YEAR
    return (
      preRocHeight + rocHeight + postRocYears * PIXELS_PER_YEAR + START_PADDING
    )
  }
}

// 计算总高度
const totalHeight = getY(maxYear) + END_PADDING

const colors = [
  '#D32F2F', // Red 700
  '#C2185B', // Pink 700
  '#7B1FA2', // Purple 700
  '#512DA8', // Deep Purple 700
  '#303F9F', // Indigo 700
  '#1976D2', // Blue 700
  '#0288D1', // Light Blue 700
  '#0097A7', // Cyan 700
  '#00796B', // Teal 700
  '#388E3C', // Green 700
  '#689F38', // Light Green 700
  '#AFB42B', // Lime 700
  '#FBC02D', // Yellow 700
  '#FFA000', // Amber 700
  '#F57C00', // Orange 700
  '#E64A19', // Deep Orange 700
  '#5D4037', // Brown 700
  '#616161', // Grey 700
  '#455A64' // Blue Grey 700
]

// 通用布局函数：给定一组数据和起始列，返回带布局信息的数组
const calculateLayout = (
  list,
  startLeftOffset,
  colWidth,
  isStrictStacking = false,
  colorOffset = 0
) => {
  const cols = [] // 存储该组每一列的结束时间
  let dispersedCount = 0 // 分散布局计数器，用于紧凑排列
  return list.map((d, index) => {
    let relativeCol = -1

    // 判断是否强制使用严格堆叠（针对十国、春秋五霸、战国七雄）
    // 如果 isStrictStacking 为 true，我们还需要进一步检查该朝代是否属于分散组
    // 用户需求：只有详细中归属字段是十国/春秋五霸/战国七雄的，不需要判断连续都按重叠处理（即强制换列）
    // 其他详细朝代（如东周细分、三国细分等）应还原成原来的逻辑（判断连续和重叠）

    const isDispersedGroup = ['十国', '春秋五霸', '战国七雄'].includes(
      d.belongTo
    )
    const shouldForceNewCol = isStrictStacking && isDispersedGroup

    if (shouldForceNewCol) {
      // 分散模式：强制分散列，且避开第一列（索引0）
      // 使用独立计数器，确保从第1列开始紧凑排列，避免因数组索引导致的空列
      relativeCol = (dispersedCount % 11) + 1
      dispersedCount++
    } else {
      // 默认贪心算法：优先填补空缺
      // 必须将时间转换为统一的数值进行比较 (时间戳)
      const currentStart = parseDate(d.start).getTime()
      const currentEnd = parseDate(d.end).getTime()

      for (let i = 0; i < cols.length; i++) {
        if (cols[i] <= currentStart) {
          relativeCol = i
          break
        }
      }
      if (relativeCol === -1) {
        relativeCol = cols.length
      }

      // 更新该列的结束时间
      cols[relativeCol] = currentEnd
    }

    // 绝对左偏移
    const left = startLeftOffset + relativeCol * (colWidth + COL_GAP)

    // 计算位置和高度
    const top = getY(d.start)
    const bottom = getY(d.end)

    return {
      ...d,
      colIndex: relativeCol, // 仅用于调试或计算最大宽度
      width: colWidth,
      color: colors[(index + colorOffset) % colors.length],
      left: left,
      top: top,
      height: bottom - top
    }
  })
}

const processedDynasties = computed(() => {
  // 1. 正统朝代：第 1-3 列 (索引 0-2)，起始偏移 RULER + 20
  // 宽度 MAJOR_COL_WIDTH
  const startOffset1 = RULER_WIDTH + 20
  const majors = calculateLayout(
    majorDynasties,
    startOffset1,
    MAJOR_COL_WIDTH,
    false
  )

  // 2. 详细朝代：第 4-15 列 (索引 3-14)
  // 起始偏移 = 正统区域结束位置
  // 正统区域占用了多少列？假设最多3列。
  // 为了固定分区，我们按照用户指定的列数来计算偏移。
  // 正统占 3 列：0, 1, 2。
  // 详细从第 3 列（即第4个位置）开始。
  // 偏移 = RULER + 20 + 3 * (MAJOR + GAP) + 间隔?
  // 还是简单点，直接按像素计算各区的起始点。

  // 区块 1 (正统): 3列
  const width1 = 3 * (MAJOR_COL_WIDTH + COL_GAP)

  // 区块 2 (详细): 12列
  const startOffset2 = startOffset1 + width1 + COL_GAP // 额外加点间隔
  const details = calculateLayout(
    detailedDynasties,
    startOffset2,
    DETAILED_COL_WIDTH,
    true
  )

  // 区块 3 (非正统): 5列
  const width2 = 12 * (DETAILED_COL_WIDTH + COL_GAP)
  const startOffset3 = startOffset2 + width2 + COL_GAP
  const others = calculateLayout(
    otherDynasties,
    startOffset3,
    OTHER_COL_WIDTH,
    false
  )

  return [...majors, ...details, ...others]
})

// 计算总宽度
const contentWidth =
  RULER_WIDTH +
  20 +
  3 * (MAJOR_COL_WIDTH + COL_GAP) +
  COL_GAP +
  12 * (DETAILED_COL_WIDTH + COL_GAP) +
  COL_GAP +
  5 * (OTHER_COL_WIDTH + COL_GAP) +
  50

// 背景区块配置
const bgZones = [
  {
    left: RULER_WIDTH + 20 - COL_GAP / 2,
    width: 3 * (MAJOR_COL_WIDTH + COL_GAP) + COL_GAP,
    color: 'rgba(173, 216, 230, 0.2)'
  }, // 浅蓝
  {
    left: RULER_WIDTH + 20 + 3 * (MAJOR_COL_WIDTH + COL_GAP) + COL_GAP / 2,
    width: 12 * (DETAILED_COL_WIDTH + COL_GAP) + COL_GAP,
    color: 'rgba(255, 182, 193, 0.2)'
  }, // 浅红
  {
    left:
      RULER_WIDTH +
      20 +
      3 * (MAJOR_COL_WIDTH + COL_GAP) +
      COL_GAP +
      12 * (DETAILED_COL_WIDTH + COL_GAP) +
      COL_GAP / 2,
    width: 5 * (OTHER_COL_WIDTH + COL_GAP) + COL_GAP,
    color: 'rgba(255, 204, 153, 0.2)'
  } // 浅橙
]

// 生成刻度数据
const ticks = computed(() => {
  const res = []

  for (let year = minYear; year <= maxYear; year++) {
    const isCentury = year % 100 === 0
    const isDecade = year % 10 === 0

    // 特殊处理民国期间 (1912-1949)
    if (year >= ROC_START_YEAR && year <= ROC_END_YEAR) {
      // 每年都显示刻度
      res.push({
        year,
        isCentury: false,
        isDecade: true, // 在民国区域，每年都当作大刻度显示
        top: getY(year),
        label: `${year}`
      })

      // 每月刻度 (1-11月)
      // 注意：这里简单按月均分，或者精确计算？
      // 为了保持视觉均匀，假设每个月大约30.4天
      const yearTop = getY(year)
      const nextYearTop = getY(year + 1)
      const yearHeight = nextYearTop - yearTop

      for (let m = 1; m <= 11; m++) {
        res.push({
          year,
          month: m,
          isMonth: true,
          top: yearTop + (yearHeight * m) / 12
        })
      }
    } else {
      // 正常年份
      if (isCentury || isDecade || true) {
        res.push({
          year,
          isCentury,
          isDecade,
          top: getY(year),
          label: formatYear(year)
        })
      }
    }
  }
  return res
})

// 格式化年份显示
const formatYear = (year) => {
  if (year < 0) return `前${Math.abs(year)}年`
  return `${year}年`
}

const tooltip = ref({
  show: false,
  x: 0,
  y: 0,
  name: '',
  range: '',
  duration: ''
})

// 辅助函数：解析日期（支持数字年份和字符串日期）
const parseDate = (val) => {
  if (typeof val === 'number') {
    const d = new Date(0)
    d.setFullYear(val, 0, 1) // 默认为当年1月1日
    d.setHours(0, 0, 0, 0)
    return d
  }
  if (typeof val === 'string') {
    const parts = val.split('-')
    let y,
      m = 0,
      d = 1
    // 检查是否为负数日期 (例如 "-202-02-28")
    if (parts[0] === '') {
      y = -parseInt(parts[1], 10)
      if (parts[2]) m = parseInt(parts[2], 10) - 1
      if (parts[3]) d = parseInt(parts[3], 10)
    } else {
      y = parseInt(parts[0], 10)
      if (parts[1]) m = parseInt(parts[1], 10) - 1
      if (parts[2]) d = parseInt(parts[2], 10)
    }
    const date = new Date(0)
    date.setFullYear(y, m, d)
    date.setHours(0, 0, 0, 0)
    return date
  }
  return new Date()
}

// 计算历时显示
const getDurationDisplay = (startDate, endDate) => {
  let y = endDate.getFullYear() - startDate.getFullYear()
  let m = endDate.getMonth() - startDate.getMonth()
  let d = endDate.getDate() - startDate.getDate()

  if (d < 0) {
    m--
    const prevMonthDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0)
    d += prevMonthDate.getDate()
  }
  if (m < 0) {
    y--
    m += 12
  }

  if (y > 0) {
    return m > 0 ? `${y}年${m}个月` : `${y}年`
  } else if (m > 0) {
    return `${m}个月`
  } else {
    return `${d}天`
  }
}

const showTooltip = (e, dynasty) => {
  const startDate = parseDate(dynasty.start)
  const endDate = parseDate(dynasty.end)
  const durationDisplay = getDurationDisplay(startDate, endDate)

  // 辅助函数：解析年份（支持数字和字符串）
  const parseYear = (val) => {
    if (typeof val === 'number') return val
    if (typeof val === 'string') {
      const parts = val.split('-')
      if (parts[0] === '') return -parseInt(parts[1], 10)
      return parseInt(parts[0], 10)
    }
    return 0
  }

  const startStr =
    typeof dynasty.start === 'string'
      ? dynasty.start
      : formatYear(dynasty.start)
  const endStr =
    typeof dynasty.end === 'string' ? dynasty.end : formatYear(dynasty.end)

  // 检查开始时间是否为民国之后 (1912+)
  // 注意：dynasty.start 可能是字符串 '1912-01-01' 或数字
  const startYear = parseYear(dynasty.start)
  const isModern = startYear >= 1912

  tooltip.value = {
    show: true,
    x: e.clientX + 15,
    y: e.clientY + 15,
    name: dynasty.name,
    range: `${startStr} - ${endStr}`,
    duration: isModern ? `在职: ${durationDisplay}` : `历时: ${durationDisplay}`
  }
}

const hideTooltip = () => {
  tooltip.value.show = false
}

const handleDynastyClick = (dynasty) => {
  if (dynasty.key && emperors[dynasty.key]) {
    selectedDynastyKey.value = dynasty.key
  }
}

const moveTooltip = (e) => {
  if (!tooltip.value.show) return
  tooltip.value.x = e.clientX + 15
  tooltip.value.y = e.clientY + 15
}

const handleSelectChange = (event) => {
  const key = event.target.value
  if (!key) return

  const dynasty = allDynasties.find((d) => d.key === key)
  if (dynasty) {
    // 滚动到该朝代的起始位置
    // 需要使用 getY 来计算准确的滚动位置，支持年份和日期字符串
    const top = getY(dynasty.start)
    if (timelineContainer.value) {
      timelineContainer.value.scrollTop = top - 100 // 留出一点余量
    }

    // 如果有皇帝数据，则选中该朝代；否则不加载右侧
    if (dynasty.key && emperors[dynasty.key]) {
      selectedDynastyKey.value = dynasty.key
    } else {
      selectedDynastyKey.value = null // 没有数据则关闭右侧
    }
  }
}
</script>

<template>
  <div class="timeline-wrapper">
    <!-- 左侧容器 -->
    <div
      class="timeline-left-container"
      :class="{ 'shrink-0': selectedDynastyKey }"
    >
      <div class="header">
        <h2>历朝时间纪年</h2>
        <select @change="handleSelectChange" class="dynasty-select">
          <option value="">所有朝代</option>
          <option
            v-for="d in sortedDynastiesForSelect"
            :key="d.name + d.start"
            :value="d.key"
          >
            {{
              d.belongTo === '五代'
                ? `　├ 五代-${d.name}`
                : d.belongTo === '十国'
                  ? `　├ 十国-${d.name}`
                  : d.belongTo
                    ? `　├ ${d.name}`
                    : d.name
            }}
          </option>
        </select>
      </div>

      <div class="timeline-scroll-area" ref="timelineContainer">
        <svg
          :width="Math.max(contentWidth, 600)"
          :height="totalHeight"
          class="timeline-svg"
        >
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
              v-for="(zone, index) in bgZones.slice(0, bgZones.length - 1)"
              :key="'line-' + index"
              :x1="zone.left + zone.width"
              y1="0"
              :x2="zone.left + zone.width"
              :y2="totalHeight"
              stroke="#ccc"
              stroke-width="2"
              stroke-dasharray="5 5"
            />
          </g>

          <!-- 背景虚线 (基于十年刻度) -->
          <g class="grid-lines">
            <line
              v-for="tick in ticks.filter((t) => t.isDecade)"
              :key="'grid-' + tick.year"
              :x1="RULER_WIDTH"
              :y1="tick.top"
              :x2="Math.max(contentWidth, 600)"
              :y2="tick.top"
              class="grid-line"
              :class="{ 'grid-line-century': tick.isCentury }"
            />
          </g>

          <!-- 主时间轴标尺 (左侧) -->
          <g class="ruler">
            <!-- 竖线 -->
            <line
              :x1="RULER_WIDTH"
              y1="0"
              :x2="RULER_WIDTH"
              :y2="totalHeight"
              stroke="#333"
              stroke-width="2"
            />
            <g v-for="(tick, idx) in ticks" :key="'tick-' + idx">
              <!-- 刻度线 -->
              <line
                v-if="!tick.isMonth"
                :x1="
                  RULER_WIDTH - (tick.isCentury ? 20 : tick.isDecade ? 12 : 6)
                "
                :y1="tick.top"
                :x2="RULER_WIDTH"
                :y2="tick.top"
                stroke="#333"
                :stroke-width="tick.isCentury ? 2 : 1"
              />
              <!-- 月刻度线 (短一点) -->
              <line
                v-else
                :x1="RULER_WIDTH - 4"
                :y1="tick.top"
                :x2="RULER_WIDTH"
                :y2="tick.top"
                stroke="#999"
                stroke-width="1"
              />

              <!-- 文字 (只显示整10年 或 民国每一年) -->
              <text
                v-if="
                  !tick.isMonth &&
                  (tick.isDecade || (tick.year >= 1912 && tick.year <= 1949))
                "
                :x="RULER_WIDTH - 25"
                :y="tick.top"
                dy="4"
                text-anchor="end"
                font-size="12"
                fill="#666"
                :font-weight="tick.isCentury ? 'bold' : 'normal'"
              >
                {{
                  tick.year >= 1912 && tick.year <= 1949
                    ? `${tick.year}年`
                    : tick.label || formatYear(tick.year)
                }}
              </text>
            </g>
          </g>

          <!-- 朝代区块 -->
          <g class="dynasties">
            <g
              v-for="dynasty in processedDynasties"
              :key="dynasty.name"
              class="dynasty-item"
              :class="{ clickable: dynasty.key && emperors[dynasty.key] }"
              :transform="`translate(${dynasty.left}, ${dynasty.top})`"
              @mouseenter="showTooltip($event, dynasty)"
              @mousemove="moveTooltip($event)"
              @mouseleave="hideTooltip"
              @click="handleDynastyClick(dynasty)"
            >
              <!-- 区块主体 -->
              <rect
                x="0"
                y="0"
                :width="dynasty.width"
                :height="dynasty.height"
                rx="4"
                :fill="dynasty.color"
                opacity="0.9"
                :stroke="dynasty.color"
                stroke-width="0"
              />
              <!-- 朝代名称 (竖排文字) -->
              <text
                :x="dynasty.width / 2"
                :y="dynasty.height / 2"
                dy="4"
                text-anchor="middle"
                fill="white"
                font-size="14"
                font-weight="bold"
                style="writing-mode: vertical-rl; text-orientation: upright"
              >
                {{ dynasty.name }}
              </text>
            </g>
          </g>
        </svg>
        <!-- 自定义 Tooltip -->
        <div
          v-if="tooltip.show"
          class="custom-tooltip"
          :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
        >
          <div class="tooltip-name">{{ tooltip.name }}</div>
          <div class="tooltip-range">{{ tooltip.range }}</div>
          <div class="tooltip-duration">{{ tooltip.duration }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧面板 -->
    <div class="side-panel" v-if="selectedDynastyKey">
      <div class="panel-close" @click="selectedDynastyKey = null">×</div>

      <!-- Tab 切换 -->
      <div class="panel-tabs">
        <div
          class="tab-item"
          :class="{ active: activeTab === 'rulers' }"
          @click="activeTab = 'rulers'"
        >
          执政者
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'events' }"
          @click="activeTab = 'events'"
        >
          大事件
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="panel-content">
        <EmperorTimeline
          v-if="activeTab === 'rulers'"
          :dynastyKey="selectedDynastyKey"
        />
        <EventTimeline
          v-if="activeTab === 'events'"
          :dynastyKey="selectedDynastyKey"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  flex-direction: row;
}

.timeline-left-container {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  transition: all 0.3s ease;
}

.timeline-left-container.shrink-0 {
  flex: 0 0 auto;
  width: auto;
}

.timeline-scroll-area {
  flex: 1;
  overflow: auto;
  position: relative;
  width: 100%;
}

/* 移除原来的 shrink-0 样式，因为现在是在外层容器上控制 */

.header {
  padding: 10px 10px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  z-index: 10;
  height: 50px; /* 固定高度，与右侧保持一致 */
  box-sizing: border-box;
}

.header h2 {
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.dynasty-select {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  width: 200px;
}

.side-panel {
  flex: 1;
  min-width: 400px;
  border-left: 1px solid #ccc;
  background: white;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}

.panel-close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
  cursor: pointer;
  font-size: 24px;
  color: #666;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
}

.panel-close:hover {
  background: #eee;
  color: #333;
}

.timeline-svg {
  display: block;
}

.grid-line {
  stroke: #eee;
  stroke-width: 1;
}

.grid-line-century {
  stroke: #ddd;
  stroke-width: 1;
}

.dynasty-item rect {
  transition: opacity 0.2s;
}

.clickable {
  cursor: pointer;
}

.dynasty-item:hover rect {
  opacity: 1;
  cursor: pointer;
  /* 移除 fill 变化，保持原色，只改变透明度或加描边 */
  /* stroke: #333; */
  /* stroke-width: 2; */
  /* 需求：悬停不要有黑色边框，可以改为加深阴影或微调亮度 */
  filter: brightness(1.1);
}

.custom-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.tooltip-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.tooltip-range {
  font-size: 12px;
  color: #ddd;
}

.panel-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 0 40px 0 10px; /* 右侧留出关闭按钮的空间 */
  background: #f9f9f9;
  height: 40px;
  align-items: center;
}

.tab-item {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  position: relative;
  transition: all 0.3s;
}

.tab-item:hover {
  color: #333;
}

.tab-item.active {
  color: #1976d2;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #1976d2;
}

.panel-content {
  flex: 1;
  overflow: hidden; /* 内容组件自己处理滚动 */
  display: flex;
  flex-direction: column;
}
</style>
