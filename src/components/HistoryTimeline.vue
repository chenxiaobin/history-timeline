<script setup>
import { ref, computed, onMounted } from 'vue'
import EmperorTimeline from './EmperorTimeline.vue'
import EventTimeline from './EventTimeline.vue'
import { useDynastyTimeline } from '../composables/useDynastyTimeline'
import {
  majorDynasties,
  detailedDynasties,
  otherDynasties,
  specialPeriods
} from '../data/dynasties'
import { emperors } from '../data/emperors'

const selectedDynastyKey = ref(null)
const activeTab = ref('rulers') // 'rulers' | 'events'
const timelineContainer = ref(null)
const emperorTimelineRef = ref(null)
const eventTimelineRef = ref(null)
const isSyncingLeft = ref(false)

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

const allDynastiesRef = ref(allDynasties)

// 使用 Composable
const {
  // PIXELS_PER_DAY, // 移除，不再提供单一比例
  RULER_WIDTH,
  START_PADDING,
  END_PADDING,
  parseDate,
  formatDate,
  minDate,
  maxDate,
  totalHeight,
  ticks,
  getTop,
  getHeight // 新增：用于替代 PIXELS_PER_DAY 计算高度
} = useDynastyTimeline(allDynastiesRef)

// 配置参数
const MAJOR_COL_WIDTH = 50 // 正统朝代宽度
const DETAILED_COL_WIDTH = 30 // 详细朝代宽度
const OTHER_COL_WIDTH = 20 // 非正统朝代宽度
const COL_GAP = 10 // 列间距

// 悬停虚线相关
const hoverLine = ref({
  show: false,
  top: 0,
  text: ''
})

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
    .sort((a, b) => parseDate(a.start) - parseDate(b.start))
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
        .sort((a, b) => parseDate(a.start) - parseDate(b.start))
      const tenKingdoms = list
        .filter((d) => d.belongTo === '十国')
        .sort((a, b) => parseDate(a.start) - parseDate(b.start))

      // 清空原数组并重新填充
      list.length = 0
      // 添加前缀逻辑由模板处理，这里只负责排序
      list.push(...fiveDynasties, ...tenKingdoms)
    } else {
      list.sort((a, b) => parseDate(a.start) - parseDate(b.start))
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

const colors = [
  // 暂时保留，以防未来需要，或删除
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

  // 预先对列表按时间排序，确保贪心算法正确处理连续性
  const sortedList = [...list].sort(
    (a, b) => parseDate(a.start) - parseDate(b.start)
  )

  const listWithRelativeCol = sortedList.map((d, index) => {
    let relativeCol = -1

    // 判断是否强制使用严格堆叠（针对十国、春秋五霸、战国七雄）
    // 如果 isStrictStacking 为 true，我们还需要进一步检查该朝代是否属于分散组
    // 用户需求：只有详细中归属字段是十国/春秋五霸/战国七雄的，不需要判断连续都按重叠处理（即强制换列）
    // 其他详细朝代（如东周细分、三国细分等）应还原成原来的逻辑（判断连续和重叠）
    // 修改：用户反馈春秋没有重叠却另起一列，说明春秋五霸不应强制分散，应允许贪心复用

    const isDispersedGroup = ['十国', '战国七雄'].includes(d.belongTo)
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
        // 修改重叠判定逻辑：
        // 如果 cols[i] (前一个的结束时间) <= currentStart (当前的开始时间)，则不重叠，可以复用该列。
        // 这满足“结束时间和下一个的开始时间相同的话，不算做重叠”的要求。
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

    return {
      ...d,
      relativeCol, // 暂存原始相对列，稍后反转
      colWidth
      // ...其他属性稍后计算
    }
  })

  // 计算该组数据的最大列数
  const maxRelativeCol = Math.max(
    -1,
    ...listWithRelativeCol.map((d) => d.relativeCol)
  )
  const totalCols = maxRelativeCol + 1

  return listWithRelativeCol.map((d) => {
    // 反转列索引：实现“默认先从最右端开始绘制”
    // 原来的第 0 列（最优先）变成第 totalCols - 1 列（最右）
    const reversedCol = totalCols - 1 - d.relativeCol

    // 绝对左偏移
    const left = startLeftOffset + reversedCol * (colWidth + COL_GAP)

    // 计算位置和高度
    const top = getTop(d.start)
    const bottom = getTop(d.end)
    const height = Math.max(bottom - top, 2) // 最小高度2px

    // 颜色逻辑：优先使用数据中配置的 color，否则使用默认浅蓝色 #E0F0FF
    // 不再使用 colors 数组循环
    const color = d.color || '#E0F0FF'

    // 计算反色文字颜色
    const getContrastColor = (hexColor) => {
      // 移除 #
      const hex = hexColor.replace('#', '')
      // 解析 RGB
      let r, g, b
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16)
        g = parseInt(hex[1] + hex[1], 16)
        b = parseInt(hex[2] + hex[2], 16)
      } else if (hex.length === 6 || hex.length === 8) {
        // 支持 6位 或 8位 (带alpha，忽略alpha)
        r = parseInt(hex.substring(0, 2), 16)
        g = parseInt(hex.substring(2, 4), 16)
        b = parseInt(hex.substring(4, 6), 16)
      } else {
        return '#333' // 默认黑色
      }

      // 计算亮度 (YIQ公式)
      const yiq = (r * 299 + g * 587 + b * 114) / 1000
      return yiq >= 128 ? '#333' : '#fff' // 浅色背景用黑字，深色背景用白字
    }

    const textColor = getContrastColor(color)

    return {
      ...d,
      colIndex: reversedCol, // 使用反转后的索引
      width: colWidth,
      color: color,
      textColor: textColor,
      left: left,
      top: top,
      height: height
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

// 计算灭亡/取代关系的连线
const destroyedRelationships = computed(() => {
  const relationships = []
  // 遍历所有处理后的朝代数据
  processedDynasties.value.forEach((source) => {
    if (source.destroyed) {
      // 标准化 destroyed 为数组，统一处理
      const targets = Array.isArray(source.destroyed)
        ? source.destroyed
        : [source.destroyed]

      targets.forEach((targetName) => {
        // 查找目标朝代（通过 name 或 key 匹配）
        const target = processedDynasties.value.find(
          (d) => d.name === targetName || d.key === targetName
        )

        if (target) {
          // 起点：源朝代底部中心
          const startX = source.left + source.width / 2
          const startY = source.top + source.height

          // 终点：目标朝代顶部中心
          const endX = target.left + target.width / 2

          // 计算目标 Y 坐标：
          // 1. 获取源朝代灭亡时间
          const sourceEndTime = parseDate(source.end).getTime()
          // 2. 获取目标朝代建立时间
          const targetStartTime = parseDate(target.start).getTime()

          // 3. 比较时间：如果灭亡时间早于建立时间（sourceEnd < targetStart），则指向 targetStart
          //    否则（灭亡时间 >= 建立时间），指向灭亡时间（sourceEnd）
          //    注意：getTop 接受年份或日期字符串，这里我们用 source.end 或 target.start

          let endY
          if (sourceEndTime < targetStartTime) {
            endY = target.top // 也就是 getTop(target.start)
          } else {
            endY = getTop(source.end)
          }

          // 计算贝塞尔曲线控制点
          // 控制点垂直偏移量，根据垂直距离动态调整，但至少有一些偏移
          const distY = Math.max(Math.abs(endY - startY), 50)
          const controlY = distY * 0.5

          const cp1x = startX
          const cp1y = startY + controlY
          const cp2x = endX
          const cp2y = endY - controlY

          const path = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`

          relationships.push({
            id: `${source.name}-${target.name}`,
            startX,
            startY,
            endX,
            endY,
            path,
            color: '#555' // 连线颜色，可以使用固定深灰色
          })
        }
      })
    }
  })
  return relationships
})

// 预计算箭头布局信息，不依赖 contentWidth
const specialPeriodLayouts = computed(() => {
  // 箭头布局管理：计算每一列的占用情况
  const arrowCols = [] // 存储每一列的结束位置

  // 必须按时间排序，否则贪心算法在处理乱序数据时会产生不必要的换列
  const sortedPeriods = [...specialPeriods].sort(
    (a, b) => parseDate(a.start) - parseDate(b.start)
  )

  const layouts = sortedPeriods.map((p) => {
    const top = getTop(p.start)
    const bottom = getTop(p.end)
    const height = bottom - top

    // 格式化起止时间
    const startDate = parseDate(p.start)
    const endDate = parseDate(p.end)
    const startYear = startDate.getFullYear()
    const endYear = endDate.getFullYear()

    const startStr = startYear < 0 ? `前${Math.abs(startYear)}` : `${startYear}`
    const endStr = endYear < 0 ? `前${Math.abs(endYear)}` : `${endYear}`

    // 计算箭头列索引
    let arrowColIndex = 0
    // 简单的贪心算法：找到第一个不冲突的列

    for (let i = 0; i < arrowCols.length; i++) {
      if (arrowCols[i] <= top + 1) {
        // 稍微加一点容差 (1px)，允许紧密衔接
        // 当前列的结束位置 <= 当前时期的开始位置，说明该列空闲
        arrowColIndex = i
        break
      }
    }

    // 如果没有找到合适列 (arrowColIndex 保持为 0 但第0列其实被占用了，或者遍历完都没找到)
    // 需要严谨判断：如果 arrowCols[arrowColIndex] > top，说明冲突，需要新开一列
    if (arrowCols[arrowColIndex] > top + 1) {
      arrowColIndex = arrowCols.length
    }

    // 更新该列的结束位置
    arrowCols[arrowColIndex] = bottom

    return {
      ...p,
      top,
      height,
      startStr,
      endStr,
      timeRange: `${startStr}年 - ${endStr}年`,
      arrowColIndex // 0, 1, 2...
    }
  })

  // 计算最大列数，用于反转索引
  const maxCol = arrowCols.length

  // 反转 arrowColIndex，实现“整体靠右”
  // 原来的第0列（最左/最优先）变成 maxCol - 1 (最右)
  return layouts.map((item) => ({
    ...item,
    // 如果 maxCol 是 1 (只有1列)，0 -> 0
    // 如果 maxCol 是 2，0 -> 1, 1 -> 0
    // 这样最优先填满的列（原本是0）会变成最右边的一列
    arrowColIndex: Math.max(0, maxCol - 1 - item.arrowColIndex)
  }))
})

// 计算总宽度
const contentWidth = computed(() => {
  // 基础宽度：RULER + 正统 + 详细 + 非正统
  const baseWidth =
    RULER_WIDTH +
    20 +
    3 * (MAJOR_COL_WIDTH + COL_GAP) +
    COL_GAP +
    12 * (DETAILED_COL_WIDTH + COL_GAP) +
    COL_GAP +
    5 * (OTHER_COL_WIDTH + COL_GAP)

  // 加上箭头所需的额外宽度
  // 最大 arrowColIndex
  let maxArrowCol = -1
  specialPeriodLayouts.value.forEach((p) => {
    if (p.arrowColIndex > maxArrowCol) {
      maxArrowCol = p.arrowColIndex
    }
  })

  // 箭头总占用宽度：(maxArrowCol + 1) * 12 + 10
  const arrowsWidth = (maxArrowCol + 1) * 12 + 10

  return baseWidth + arrowsWidth
})

const arrowBaseX = computed(() => {
  return (
    RULER_WIDTH +
    20 +
    3 * (MAJOR_COL_WIDTH + COL_GAP) +
    COL_GAP +
    12 * (DETAILED_COL_WIDTH + COL_GAP) +
    COL_GAP +
    5 * (OTHER_COL_WIDTH + COL_GAP)
  )
})

const scrollTop = ref(0)
const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop
}

// 处理特殊时期数据 (最终渲染用)
const processedSpecialPeriods = computed(() => {
  return specialPeriodLayouts.value.map((layout) => {
    // 这里的 contentWidth.value 已经可以安全访问了，因为它依赖于 specialPeriodLayouts (计算 maxArrowCol)，
    // 而 specialPeriodLayouts 不依赖 contentWidth。
    const width = Math.max(contentWidth.value, 600) - RULER_WIDTH

    return {
      ...layout,
      left: RULER_WIDTH,
      width
    }
  })
})

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

const tooltip = ref({
  show: false,
  x: 0,
  y: 0,
  name: '',
  range: '',
  duration: ''
})

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

  // 辅助格式化函数
  const formatTooltipDate = (date, originalInput) => {
    // 如果原始输入是数字（仅年份），或者字符串不包含月日（如 "1912"）
    // 则只显示年份
    // 我们的 parseDate 会把数字解析为当年1月1日

    const y = date.getFullYear()
    const yearStr = y < 0 ? `前${Math.abs(y)}` : `${y}`
    const yearDisplay = `${yearStr}年`

    // 判断是否需要显示月日
    // 如果原始输入是数字，肯定只显示年
    if (typeof originalInput === 'number') {
      return yearDisplay
    }

    // 如果是字符串，检查是否包含 '-'，简单判断精度
    // 比如 "1912-01-01" -> 包含
    // "-221" -> 不包含
    if (typeof originalInput === 'string' && originalInput.includes('-')) {
      // 进一步检查是否真的有月日部分，有些可能是 "-221" 这种负数年份
      // 正则检查 YYYY-MM-DD
      if (/^\-?\d+-\d+-\d+$/.test(originalInput)) {
        return formatDate(date) // 使用原来的全格式
      }
    }

    return yearDisplay
  }

  const startStr = formatTooltipDate(startDate, dynasty.start)
  const endStr = formatTooltipDate(endDate, dynasty.end)

  // 检查开始时间是否为民国之后 (1912+)
  const startYear = startDate.getFullYear()
  const isModern = startYear >= 1912
  const durationText = isModern
    ? `在职: ${durationDisplay}`
    : `(历时${durationDisplay})`

  tooltip.value = {
    show: true,
    x: e.clientX + 15,
    y: e.clientY + 15,
    name: `${dynasty.name} ${durationText}`,
    range: `${startStr} - ${endStr}`,
    duration: '' // 不再单独显示 duration 行，如果需要可以移除该字段或留空
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

const scrollToAndSelectDynasty = (key) => {
  if (!key) {
    selectedDynastyKey.value = null
    return
  }

  const dynasty = allDynasties.find((d) => d.key === key)
  if (dynasty) {
    // 滚动到该朝代的起始位置
    const top = getTop(dynasty.start)
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

const handleSelectChange = (event) => {
  scrollToAndSelectDynasty(event.target.value)
}

onMounted(() => {
  if (sortedDynastiesForSelect.value.length > 0) {
    scrollToAndSelectDynasty(sortedDynastiesForSelect.value[0].key)
  }
})
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
        <select
          :value="selectedDynastyKey || ''"
          @change="handleSelectChange"
          class="dynasty-select"
        >
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

      <div
        class="timeline-scroll-area"
        ref="timelineContainer"
        @scroll="handleScroll"
      >
        <!-- 特殊时期文字层 (HTML + Sticky) -->
        <div
          class="special-periods-layer"
          :style="{ height: totalHeight + 'px' }"
        >
          <div
            v-for="period in processedSpecialPeriods"
            :key="period.name"
            class="special-period-item"
            :style="{
              top: period.top + 'px',
              left: period.left + 'px',
              width: period.width + 'px',
              height: period.height + 'px'
            }"
          >
            <div class="period-name-sticky">
              <div class="period-title">{{ period.name }}</div>
              <div class="period-time">{{ period.timeRange }}</div>
            </div>
          </div>
        </div>

        <svg :width="contentWidth" :height="totalHeight" class="timeline-svg">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" fill="#ff0000" />
            </marker>
          </defs>
          <!-- 分区背景底色 -->
          <g class="bg-zones">
            <!-- 特殊时期色块 (最底层) -->
            <g v-for="period in processedSpecialPeriods" :key="period.name">
              <rect
                :x="period.left"
                :y="period.top"
                :width="period.width"
                :height="period.height"
                :fill="period.color"
                style="pointer-events: none"
              />
            </g>
            <!-- 垂直分隔线 -->
            <line
              v-for="(zone, index) in bgZones.slice(0, bgZones.length - 1)"
              :key="'line-' + index"
              :x1="zone.left + zone.width"
              y1="0"
              :x2="zone.left + zone.width"
              :y2="totalHeight"
              stroke="#ccc"
              stroke-width="1"
              stroke-dasharray="5 5"
            />
          </g>

          <!-- 背景虚线 (基于十年刻度) -->
          <g class="grid-lines">
            <line
              v-for="tick in ticks.filter((t) => t.isLarge)"
              :key="'grid-' + tick.year"
              :x1="RULER_WIDTH"
              :y1="tick.top"
              :x2="contentWidth"
              :y2="tick.top"
              stroke-dasharray="5 5"
              class="grid-line"
              :class="{ 'grid-line-century': tick.year % 100 === 0 }"
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
              <!-- 大刻度 (10年) -->
              <template v-if="tick.isLarge && tick.config.length > 0">
                <line
                  :x1="RULER_WIDTH - tick.config.length"
                  :y1="tick.top"
                  :x2="RULER_WIDTH"
                  :y2="tick.top"
                  stroke="#333"
                  :stroke-width="tick.config.width"
                />
                <text
                  v-if="tick.showLabel"
                  :x="RULER_WIDTH - tick.config.length - 5"
                  :y="tick.top"
                  dy="5"
                  text-anchor="end"
                  font-size="14"
                  fill="#333"
                  :font-weight="tick.year % 100 === 0 ? 'bold' : 'normal'"
                >
                  {{ tick.fullLabel }}
                </text>
              </template>

              <!-- 中刻度 (5年) -->
              <template v-else-if="tick.isMedium && tick.config.length > 0">
                <line
                  :x1="RULER_WIDTH - tick.config.length"
                  :y1="tick.top"
                  :x2="RULER_WIDTH"
                  :y2="tick.top"
                  stroke="#444"
                  :stroke-width="tick.config.width"
                />
                <text
                  v-if="tick.showLabel"
                  :x="RULER_WIDTH - tick.config.length - 5"
                  :y="tick.top"
                  dy="4"
                  text-anchor="end"
                  font-size="10"
                  fill="#555"
                >
                  {{ tick.label }}
                </text>
              </template>

              <!-- 小刻度 (1年) -->
              <template v-else-if="tick.isSmall && tick.config.length > 0">
                <line
                  :x1="RULER_WIDTH - tick.config.length"
                  :y1="tick.top"
                  :x2="RULER_WIDTH"
                  :y2="tick.top"
                  stroke="#666"
                  :stroke-width="tick.config.width"
                />
              </template>

              <!-- 微刻度 (1月) -->
              <template v-else-if="tick.isMicro && tick.config.length > 0">
                <line
                  :x1="RULER_WIDTH - tick.config.length"
                  :y1="tick.top"
                  :x2="RULER_WIDTH"
                  :y2="tick.top"
                  stroke="#888"
                  :stroke-width="tick.config.width"
                />
              </template>
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
                :fill="dynasty.textColor"
                font-size="14"
                font-weight="bold"
                style="writing-mode: vertical-rl; text-orientation: upright"
              >
                {{ dynasty.name }}
              </text>
            </g>
          </g>

          <!-- 灭亡/取代关系连线 -->
          <g class="relationships">
            <g v-for="rel in destroyedRelationships" :key="rel.id">
              <!-- 连线 -->
              <path
                :d="rel.path"
                fill="none"
                :stroke="rel.color"
                stroke-width="1"
                stroke-dasharray="4 2"
                marker-end="url(#arrowhead)"
              />
              <!-- 起点圆点 -->
              <circle :cx="rel.startX" :cy="rel.startY" r="3" fill="#000000" />
            </g>
          </g>

          <!-- 特殊时期侧边箭头标注 (SVG 内部，跟随横向滚动) -->
          <g class="special-arrows">
            <defs>
              <marker
                id="arrow-start"
                markerWidth="10"
                markerHeight="6"
                refX="4"
                refY="3"
                orient="auto"
              >
                <!-- 修改 refX=4 使尖端 (4,3) 对准起点 -->
                <polygon points="10 0, 4 3, 10 6" fill="#999" />
              </marker>
              <marker
                id="arrow-end"
                markerWidth="10"
                markerHeight="6"
                refX="6"
                refY="3"
                orient="auto"
              >
                <!-- 修改 refX=6 使尖端 (6,3) 对准终点 -->
                <polygon points="0 0, 6 3, 0 6" fill="#999" />
              </marker>
            </defs>

            <g
              v-for="period in specialPeriodLayouts"
              :key="period.name + '-arrow'"
            >
              <!-- 计算 X 坐标：紧贴内容右侧 -->
              <g
                :transform="`translate(${arrowBaseX + 10 + period.arrowColIndex * 15}, 0)`"
              >
                <!-- 上短横线 -->
                <line
                  x1="-5"
                  :y1="period.top"
                  x2="5"
                  :y2="period.top"
                  stroke="#999"
                  stroke-width="1"
                />

                <!-- 下短横线 -->
                <line
                  x1="-5"
                  :y1="period.top + period.height"
                  x2="5"
                  :y2="period.top + period.height"
                  stroke="#999"
                  stroke-width="1"
                />

                <!-- 中间双向箭头竖线 -->
                <!-- 调整 y1 和 y2，让竖线稍微缩进一点，给箭头留出空间，或者直接连接 -->
                <!-- 如果箭头看起来离线太远，是因为 marker 的 refX 设置问题。-->
                <!-- 原来 refX=0 (start) 和 refX=10 (end)，这意味着箭头尖端正好在端点。-->
                <!-- 如果用户觉得“不够接近”，可能是视觉上的。-->
                <!-- 我们尝试把 refX 调整为 5，让箭头中心对准端点，或者微调。-->
                <!-- 这里我们直接调整竖线的长度，让它稍微延伸出一点点，或者缩短一点点。-->
                <!-- 实际上，如果箭头尖端在横线上，就是最接近的。-->
                <!-- 用户说“两头的箭头不够接近横线”，意思是箭头和横线之间有空隙？-->
                <!-- 可能是 marker 的定义导致。refX 是 marker 坐标系中与宿主坐标系重合的点。-->
                <!-- 对于 arrow-start (上箭头)，尖端在 (5, 0)？不，points="10 0, 4 3, 10 6"。尖端在 (4,3)。-->
                <!-- 如果 refX=0，那么 (0,3) 对准线端。尖端 (4,3) 离线端有 4px 距离。-->
                <!-- 所以 arrow-start 应该把 refX 设为 4 左右。-->
                <!-- 对于 arrow-end (下箭头)，points="0 0, 6 3, 0 6"。尖端在 (6,3)。-->
                <!-- 如果 refX=10，那么 (10,3) 对准线端。尖端 (6,3) 离线端有 4px 距离。-->
                <!-- 所以 arrow-end 应该把 refX 设为 6 左右。-->

                <line
                  x1="0"
                  :y1="period.top"
                  x2="0"
                  :y2="period.top + period.height"
                  stroke="#999"
                  stroke-width="1"
                  marker-start="url(#arrow-start)"
                  marker-end="url(#arrow-end)"
                />
              </g>
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
        </div>
      </div>

      <!-- 悬浮箭头层 (固定在视口右侧，跟随垂直滚动) -->
      <!-- <div class="arrow-overlay-container"> ... </div> -->
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
  background: white;
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
/* 移除 arrow-overlay-container 相关样式 */

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
  position: relative;
  z-index: 2;
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
  height: 50px;
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

.special-periods-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 1; /* 确保在 SVG 内容之下 (SVG z-index: 2) */
}

.special-period-item {
  position: absolute;
  display: flex;
  justify-content: flex-end; /* 内容靠右 */
}

.period-name-sticky {
  position: sticky;
  top: 20px; /* 吸顶距离 */
  margin-right: 20px; /* 右边距 */
  text-align: right;
  height: fit-content;
}

.period-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  opacity: 0.5;
  white-space: nowrap;
}

.period-time {
  font-size: 12px;
  color: #333;
  opacity: 0.5;
  white-space: nowrap;
  margin-top: 4px;
}
</style>
