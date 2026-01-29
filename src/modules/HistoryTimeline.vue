<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
// import EmperorTimeline from './EmperorTimeline.vue' // 移除
// import EventTimeline from './EventTimeline.vue' // 移除
import { useDynastyTimeline } from '../composables/useDynastyTimeline'
import { useDetailedLayout } from '../composables/useDetailedLayout' // 新增
import {
  majorDynasties,
  detailedDynasties,
  otherDynasties,
  specialPeriods
} from '../data/dynasties'
import { emperors } from '../data/emperors'
import { majorEvents, turningPointEvent } from '../data/events' // 新增

const selectedDynastyKey = ref(null)
const activeTab = ref('rulers') // 'rulers' | 'events'
const timelineContainer = ref(null)
const containerWidth = ref(0) // 新增容器宽度

const router = useRouter()
const goHome = () => {
  router.push('/')
}

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
  getDateFromY,
  getHeight // 新增：用于替代 PIXELS_PER_DAY 计算高度
} = useDynastyTimeline(allDynastiesRef)

// 引入详细布局计算
const { calculateEmperorLayout, calculateEventLayout } = useDetailedLayout(
  getTop,
  getHeight,
  parseDate,
  formatDate
)

// 配置参数
const MAJOR_COL_WIDTH = 50 // 正统朝代宽度
const DETAILED_COL_WIDTH = 30 // 详细朝代宽度
const OTHER_COL_WIDTH = 20 // 非正统朝代宽度
const TURNING_POINT_COL_WIDTH = 130 // 转折点事件宽度 (新增)
const COL_GAP = 10 // 列间距

// 悬停虚线相关
const hoverLine = ref({
  show: false,
  top: 0,
  text: ''
})

// 下拉框排序逻辑
const sortedDynastiesForSelect = computed(() => {
  // 1. 准备特殊时期数据，并处理东周层级
  const processedSpecialPeriods = specialPeriods
    .filter((p) => p.merged)
    .map((p) => {
      return {
        ...p,
        key: p.name, // 确保有 key
        belongTo: p.belongTo
      }
    })

  // 2. 准备所有节点池
  const minorityNames = new Set(
    otherDynasties.filter((d) => !d.belongTo).map((d) => d.name)
  )

  const nodePool = []

  // 处理 allDynasties
  allDynasties.forEach((d) => {
    if (minorityNames.has(d.name) && !d.belongTo) {
      // 归类为少数民族政权
      nodePool.push({ ...d, belongTo: '少数民族政权' })
    } else {
      nodePool.push(d)
    }
  })

  // 加入特殊时期
  nodePool.push(...processedSpecialPeriods)

  // 3. 构建树 Map<Name, Node>
  const nodeMap = new Map()
  nodePool.forEach((d) => {
    // 创建节点对象，添加 children 数组
    nodeMap.set(d.name, { ...d, children: [] })
  })

  // 建立“少数民族政权”虚拟根节点
  const minorityRoot = {
    name: '少数民族政权',
    key: 'MinorityRegimes',
    start: 0,
    children: [],
    isVirtual: true
  }
  nodeMap.set('少数民族政权', minorityRoot)

  // 建立“五代”和“十国”虚拟节点
  const fiveDynastiesNode = {
    name: '五代',
    key: 'FiveDynasties',
    belongTo: '五代十国',
    children: [],
    isVirtual: true
  }
  const tenKingdomsNode = {
    name: '十国',
    key: 'TenKingdoms',
    belongTo: '五代十国',
    children: [],
    isVirtual: true
  }
  nodeMap.set('五代', fiveDynastiesNode)
  nodeMap.set('十国', tenKingdomsNode)

  // 4. 挂载子节点
  const roots = []
  // 移除 alias 映射，让子节点直接挂载到“五代”或“十国”虚拟节点上

  nodeMap.forEach((node) => {
    if (node.isVirtual && node.belongTo === undefined) return // 根节点最后处理（如少数民族政权）

    let belongToArray = []
    if (Array.isArray(node.belongTo)) {
      belongToArray = node.belongTo
    } else if (node.belongTo) {
      belongToArray = [node.belongTo]
    }

    if (belongToArray.length > 0) {
      let added = false
      belongToArray.forEach((parentName, index) => {
        const parent = nodeMap.get(parentName)
        if (parent) {
          // 如果属于多个父节点，克隆节点以避免同一个对象引用出现在多个位置（导致 v-for key 重复或结构问题）
          // 只对第二个及之后的父节点使用克隆对象，或者对所有都克隆
          // 为了简单和一致性，如果有多个父节点，我们克隆
          const childNode = belongToArray.length > 1 ? { ...node } : node

          // 如果是克隆的或者属于多个父节点，生成一个 v-for 专用的唯一 key
          if (belongToArray.length > 1) {
            childNode._vForId = `${childNode.key || childNode.name}_${parentName}`
          }

          parent.children.push(childNode)
          added = true
        }
      })

      if (!added) {
        // 所有父节点都找不到？放入 roots
        if (!roots.includes(node)) roots.push(node)
      }
    } else {
      // 没有 belongTo，是根节点
      roots.push(node)
    }
  })

  // 5. 递归排序函数
  const sortNodes = (nodes) => {
    // 先递归处理子节点，确保子节点已排序且 start 时间准确
    nodes.forEach((node) => {
      if (node.children.length > 0) {
        sortNodes(node.children)
        // 如果节点是虚拟的且没有 start，取第一个子节点的 start
        if (node.isVirtual && !node.start) {
          node.start = node.children[0].start
        }
      }
    })

    nodes.sort((a, b) => {
      // 1. 五代十国特殊排序：五代(priority 0) < 十国(priority 1) < 其他(priority 2)
      // 注意：现在的五代和十国节点是“五代十国”的子节点，name 分别为“五代”和“十国”
      const getGroupPriority = (node) => {
        if (node.name === '五代') return 0
        if (node.name === '十国') return 1
        return 2
      }

      const pA = getGroupPriority(a)
      const pB = getGroupPriority(b)

      if (pA !== pB) return pA - pB

      // 2. 默认按时间排序
      // 如果 start 不存在（比如空的虚拟节点），当做无穷大或0处理
      const timeA = a.start ? parseDate(a.start) : 0
      const timeB = b.start ? parseDate(b.start) : 0
      return timeA - timeB
    })
  }

  sortNodes(roots)

  // 处理少数民族政权位置
  if (minorityRoot.children.length > 0) {
    // minorityRoot 的 start 已经在 sortNodes 中计算过了（因为它是 root 之一，会被 sortNodes(roots) 里的 forEach 递归处理吗？
    // 不，minorityRoot 如果不在 roots 里（因为它没有 belongTo，所以它在 roots 里吗？是的，nodeMap.forEach 时 push 进去了）
    // 等等，之前的代码里 nodeMap.forEach 有一句 if (node.isVirtual) return
    // 所以 minorityRoot 没进 roots。我们需要手动处理。

    // 手动触发一次 sortNodes 给 minorityRoot
    sortNodes(minorityRoot.children)
    minorityRoot.start = minorityRoot.children[0].start

    // 确保在 roots 中
    if (!roots.includes(minorityRoot)) {
      roots.push(minorityRoot)
    }
    // 移到最后
    const idx = roots.indexOf(minorityRoot)
    if (idx > -1) {
      roots.splice(idx, 1)
      roots.push(minorityRoot)
    }
  } else {
    // 如果没有子项，移除
    const idx = roots.indexOf(minorityRoot)
    if (idx > -1) roots.splice(idx, 1)
  }

  // 6. 扁平化输出并生成 displayName
  const result = []
  const flatten = (nodes, level = 0) => {
    nodes.forEach((node) => {
      let displayName = node.name

      // 生成缩进
      if (level > 0) {
        const indent = '　'.repeat(level) + '├ '
        displayName = indent + displayName
      }

      node.displayName = displayName
      node.level = level
      result.push(node)

      if (node.children.length > 0) {
        flatten(node.children, level + 1)
      }
    })
  }

  flatten(roots)

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
  // 修改：用户要求按数据顺序绘制，移除强制时间排序
  // const sortedList = [...list].sort(
  //   (a, b) => parseDate(a.start) - parseDate(b.start)
  // )
  const sortedList = list

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
    // 修改：用户反馈希望最上方的在最左边（即最早开始的在左边），因此不再反转
    // const reversedCol = totalCols - 1 - d.relativeCol
    const reversedCol = d.relativeCol

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

const processedTurningPoints = computed(() => {
  // 放在 Major (3列) 之后
  const startLeftOffset =
    RULER_WIDTH + 20 + 3 * (MAJOR_COL_WIDTH + COL_GAP) + COL_GAP

  return turningPointEvent.map((e) => {
    const date = parseDate(e.date)
    const top = getTop(date)

    // 格式化日期字符串
    const year = date.getFullYear()
    const dateStr = year < 0 ? `前${Math.abs(year)}年` : `${year}年`
    // 如果有具体的月日，可以更详细，但为了简洁，先用年份

    return {
      ...e,
      top,
      left: startLeftOffset,
      width: TURNING_POINT_COL_WIDTH,
      iconColor: '#FF0000', // 鲜红
      textColor: '#FF0000',
      dateStr
    }
  })
})

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

  // 2. 转折点列占用第 4 列
  // 计算 Detailed 的起始偏移
  const width1 = 3 * (MAJOR_COL_WIDTH + COL_GAP)
  const turningPointSpace = TURNING_POINT_COL_WIDTH + COL_GAP

  // 3. 详细朝代：从第 5 列开始
  // 起始偏移 = 正统区域结束 + 间隔 + 转折点区域 + 间隔
  const startOffset2 = startOffset1 + width1 + COL_GAP + turningPointSpace

  const details = calculateLayout(
    detailedDynasties,
    startOffset2,
    DETAILED_COL_WIDTH,
    true
  )

  // 4. 非正统：接在 Detailed 之后 (Detailed 占 12 列)
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
  const sortedPeriods = [...specialPeriods].sort((a, b) => {
    // 直接比较年份数字，避免依赖 parseDate 可能带来的问题
    return a.start - b.start
  })

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

// 0. 箭头布局信息
const arrowLayoutInfo = computed(() => {
  let maxArrowCol = -1
  if (specialPeriodLayouts.value) {
    specialPeriodLayouts.value.forEach((p) => {
      if (p.arrowColIndex > maxArrowCol) {
        maxArrowCol = p.arrowColIndex
      }
    })
  }

  const colWidth = 8
  const padding = 0 // 减少右侧留白，让箭头更靠右
  // 总宽度 = 列数 * 列宽 + 额外留白
  const totalWidth = (maxArrowCol + 1) * colWidth + padding

  return {
    maxArrowCol,
    colWidth,
    padding,
    totalWidth
  }
})

// 1. 计算基础区域宽度 (标尺 + 朝代列 + 箭头)
const baseAreaWidth = computed(() => {
  // 固定列宽度
  const columnsWidth =
    RULER_WIDTH +
    20 +
    3 * (MAJOR_COL_WIDTH + COL_GAP) +
    COL_GAP +
    (TURNING_POINT_COL_WIDTH + COL_GAP) + // 新增转折点
    12 * (DETAILED_COL_WIDTH + COL_GAP) +
    COL_GAP +
    5 * (OTHER_COL_WIDTH + COL_GAP)

  return columnsWidth + arrowLayoutInfo.value.totalWidth
})

// 2. 计算详情区域宽度 (皇帝/皇后/事件)
const detailsAreaWidth = computed(() => {
  if (!selectedDynastyKey.value) return 0

  // 辅助函数：找到一组元素中最右边的位置
  const findMaxRight = (items) => {
    if (!items.length) return 0
    return items.reduce((max, cur) => Math.max(max, cur.left + cur.width), 0)
  }

  // 辅助函数：事件比较特殊，宽度固定
  const findEventMaxRight = (items) => {
    if (!items.length) return 0
    return items.reduce(
      (max, cur) => Math.max(max, cur.left + EVENT_COL_WIDTH),
      0
    )
  }

  let currentMaxRight = 0

  if (activeTab.value === 'rulers') {
    const empRight = findMaxRight(processedEmperors.value)
    const queenRight = findMaxRight(processedQueens.value)
    currentMaxRight = Math.max(empRight, queenRight)
  } else if (activeTab.value === 'events') {
    currentMaxRight = findEventMaxRight(processedEvents.value)
  }

  // 如果详情内容的最右边超过了基础区域，计算超出的部分
  if (currentMaxRight > baseAreaWidth.value) {
    // 额外加 100px 留白
    return currentMaxRight - baseAreaWidth.value + 100
  }

  return 0
})

// 3. 最终画布总宽度 (核心：取 内容宽度 和 屏幕宽度 的最大值)
const contentWidth = computed(() => {
  const contentTotalWidth = baseAreaWidth.value + detailsAreaWidth.value
  // 确保背景至少填满屏幕，如果内容更多则跟随内容
  return Math.max(contentTotalWidth, containerWidth.value)
})

const arrowBaseX = computed(() => {
  return (
    RULER_WIDTH +
    20 +
    3 * (MAJOR_COL_WIDTH + COL_GAP) +
    COL_GAP +
    (TURNING_POINT_COL_WIDTH + COL_GAP) + // 新增转折点
    12 * (DETAILED_COL_WIDTH + COL_GAP) +
    COL_GAP +
    5 * (OTHER_COL_WIDTH + COL_GAP)
  )
})

// 详情区域配置
const EMP_COL_WIDTH = 30
const QUEEN_COL_WIDTH = 30
const EVENT_COL_WIDTH = 130
const DETAIL_GAP = 50 // 朝代和详情之间的间距

const selectedEmperorsData = computed(() => {
  if (!selectedDynastyKey.value || !emperors[selectedDynastyKey.value])
    return []
  return emperors[selectedDynastyKey.value]
})

const selectedEventsData = computed(() => {
  if (!selectedDynastyKey.value || !majorEvents[selectedDynastyKey.value])
    return []
  return majorEvents[selectedDynastyKey.value]
})

const selectedDynastyRange = computed(() => {
  if (!selectedDynastyKey.value) return null
  const dynasty = allDynasties.find((d) => d.key === selectedDynastyKey.value)
  if (!dynasty) return null

  return {
    top: getTop(dynasty.start),
    bottom: getTop(dynasty.end)
  }
})

// 皇帝布局
const processedEmperors = computed(() => {
  if (activeTab.value !== 'rulers') return [] // 只在 rulers tab 下计算
  if (!selectedEmperorsData.value.length) return []
  // 起始位置：朝代区域结束 + 间距
  const startOffset = arrowBaseX.value + DETAIL_GAP
  return calculateEmperorLayout(
    selectedEmperorsData.value,
    EMP_COL_WIDTH,
    startOffset,
    0 // colorOffset
  )
})

// 皇后布局
const processedQueens = computed(() => {
  if (activeTab.value !== 'rulers') return [] // 只在 rulers tab 下计算
  if (!selectedEmperorsData.value.length) return []

  const allQueens = []
  selectedEmperorsData.value.forEach((emp) => {
    if (emp.queens && emp.queens.length) {
      emp.queens.forEach((q) => {
        allQueens.push({
          ...q,
          isQueen: true,
          emperorName: emp.name
        })
      })
    }
  })

  if (!allQueens.length) return []

  // 皇帝占用的列数
  const empMaxCol = Math.max(
    -1,
    ...processedEmperors.value.map((e) => e.colIndex)
  )
  const empWidth = (empMaxCol + 1) * (EMP_COL_WIDTH + 20) // 20是colGap (默认)

  const startOffset = arrowBaseX.value + DETAIL_GAP + empWidth + 20
  return calculateEmperorLayout(allQueens, QUEEN_COL_WIDTH, startOffset, 5) // 复用皇帝布局逻辑，颜色偏移5
})

// 事件布局
const processedEvents = computed(() => {
  if (activeTab.value !== 'events') return [] // 只在 events tab 下计算
  if (!selectedEventsData.value.length) return []

  // 事件起始位置：朝代区域结束 + 间距 (复用同一位置)
  let offset = arrowBaseX.value + DETAIL_GAP

  return calculateEventLayout(selectedEventsData.value, EVENT_COL_WIDTH, offset)
})

const scrollTop = ref(0)
const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop
}

let rafId = null

const handleMouseMove = (e) => {
  if (rafId) return

  const clientY = e.clientY
  const rect = e.currentTarget.getBoundingClientRect()
  const scrollTopValue = e.currentTarget.scrollTop

  rafId = requestAnimationFrame(() => {
    // 仅在 timeline-scroll-area 区域内有效
    // 计算相对于 SVG 内容顶部的 Y 坐标
    const y = clientY - rect.top + scrollTopValue

    // 限制 y 在有效范围内
    if (y < 0 || y > totalHeight.value) {
      hoverLine.value.show = false
      rafId = null
      return
    }

    hoverLine.value.show = true
    hoverLine.value.top = y

    const date = getDateFromY(y)
    const year = date.getFullYear()
    hoverLine.value.text = year < 0 ? `前${Math.abs(year)}` : `${year}`

    rafId = null
  })
}

const handleMouseLeave = () => {
  hoverLine.value.show = false
}

// 处理特殊时期数据 (最终渲染用)
const processedSpecialPeriods = computed(() => {
  if (!specialPeriodLayouts.value) return []
  return specialPeriodLayouts.value.map((layout) => {
    // 标尺宽度
    const currentRulerW = RULER_WIDTH || 100

    return {
      ...layout,
      left: currentRulerW,
      // 宽度直接等于：画布总宽 - 起始位置
      // 这样无论画布是因为内容被撑大，还是因为屏幕被撑大，背景永远铺满
      width: (contentWidth.value || 1200) - currentRulerW
    }
  })
})

// 背景区块配置
const bgZones = computed(() => {
  const majorStart = RULER_WIDTH + 20 - COL_GAP / 2
  const majorWidth = 3 * (MAJOR_COL_WIDTH + COL_GAP) + COL_GAP

  const tpStart = majorStart + majorWidth
  const tpWidth = TURNING_POINT_COL_WIDTH + COL_GAP

  const detailStart = tpStart + tpWidth
  const detailWidth = 12 * (DETAILED_COL_WIDTH + COL_GAP) + COL_GAP

  const otherStart = detailStart + detailWidth
  const otherWidth = 5 * (OTHER_COL_WIDTH + COL_GAP) + COL_GAP

  return [
    {
      left: majorStart,
      width: majorWidth,
      color: 'rgba(173, 216, 230, 0.2)'
    }, // 浅蓝
    {
      left: tpStart,
      width: tpWidth,
      color: 'rgba(255, 255, 224, 0.3)'
    }, // 淡黄 (转折点)
    {
      left: detailStart,
      width: detailWidth,
      color: 'rgba(255, 182, 193, 0.2)'
    }, // 浅红
    {
      left: otherStart,
      width: otherWidth,
      color: 'rgba(255, 204, 153, 0.2)'
    } // 浅橙
  ]
})

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

const showTooltip = (e, item) => {
  // 1. 皇帝/皇后
  if (item.durationDisplay !== undefined || item.isQueen) {
    const startDate = parseDate(item.start)
    const startYear = startDate.getFullYear()
    const isModern = startYear >= 1912

    tooltip.value = {
      show: true,
      x: e.clientX + 15,
      y: e.clientY + 15,
      name: item.isQueen
        ? `${item.name} (${item.emperorName}皇后)`
        : `${item.name} (${isModern ? '在职' : '在位'}${item.durationDisplay})`,
      range: `${item.startDateStr} - ${item.endDateStr}`,
      duration: item.templeName ? `庙号：${item.templeName}` : ''
    }
    return
  }

  // 2. 转折点事件 (新增)
  if (item.dateStr && item.iconColor) {
    tooltip.value = {
      show: true,
      x: e.clientX + 15,
      y: e.clientY + 15,
      name: item.name,
      range: item.dateStr,
      description: item.description
    }
    return
  }

  // 3. 事件
  if (item.type || (item.date && !item.end && !item.start)) {
    const startDate = parseDate(item.start || item.date)
    const startStr = formatDate(startDate)
    let timeStr = startStr
    if (item.end) {
      timeStr = `${startStr} - ${formatDate(parseDate(item.end))}`
    }

    tooltip.value = {
      show: true,
      x: e.clientX + 15,
      y: e.clientY + 15,
      name: item.name,
      range: timeStr,
      duration: item.description || ''
    }
    return
  }

  // 3. 朝代 (原有逻辑)
  const startDate = parseDate(item.start)
  const endDate = parseDate(item.end)
  const durationDisplay = getDurationDisplay(startDate, endDate)

  // 辅助格式化函数
  const formatTooltipDate = (date, originalInput) => {
    const y = date.getFullYear()
    const yearStr = y < 0 ? `前${Math.abs(y)}` : `${y}`
    const yearDisplay = `${yearStr}年`

    if (typeof originalInput === 'number') {
      return yearDisplay
    }

    if (typeof originalInput === 'string' && originalInput.includes('-')) {
      if (/^\-?\d+-\d+-\d+$/.test(originalInput)) {
        return formatDate(date)
      }
    }

    return yearDisplay
  }

  const startStr = formatTooltipDate(startDate, item.start)
  const endStr = formatTooltipDate(endDate, item.end)

  const startYear = startDate.getFullYear()
  const isModern = startYear >= 1912
  const durationText = isModern
    ? `在职: ${durationDisplay}`
    : `(历时${durationDisplay})`

  tooltip.value = {
    show: true,
    x: e.clientX + 15,
    y: e.clientY + 15,
    name: `${item.name} ${durationText}`,
    range: `${startStr} - ${endStr}`,
    duration: ''
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

const hasEmperors = computed(() => {
  return selectedEmperorsData.value.length > 0
})

const hasEvents = computed(() => {
  return selectedEventsData.value.length > 0
})

// 监听朝代选择变化，重置 activeTab
const scrollToAndSelectDynasty = (key) => {
  if (!key) {
    selectedDynastyKey.value = null
    return
  }

  // 1. 尝试在 allDynasties 中找
  let dynasty = allDynasties.find((d) => d.key === key)

  // 2. 如果没找到，尝试在 specialPeriods 中找
  if (!dynasty) {
    const sp = specialPeriods.find((p) => p.name === key)
    if (sp) {
      dynasty = { ...sp, key: sp.name }
    }
  }

  // 3. 如果还没找到，看看是不是 'MinorityRegimes'
  if (!dynasty && key === 'MinorityRegimes') {
    const mr = sortedDynastiesForSelect.value.find(
      (d) => d.key === 'MinorityRegimes'
    )
    if (mr) {
      dynasty = mr
    }
  }

  if (dynasty) {
    const top = getTop(dynasty.start)
    if (timelineContainer.value) {
      timelineContainer.value.scrollTop = top - 100
    }

    if (dynasty.key) {
      selectedDynastyKey.value = dynasty.key
      // 默认选中逻辑：优先皇帝，其次事件
      // 由于 hasEmperors 和 hasEvents 是 computed，依赖 selectedDynastyKey，
      // 这里需要先赋值 selectedDynastyKey，然后在 nextTick 或直接判断数据源
      const hasEmp = emperors[dynasty.key] && emperors[dynasty.key].length > 0
      const hasEvt =
        majorEvents[dynasty.key] && majorEvents[dynasty.key].length > 0

      if (hasEmp) {
        activeTab.value = 'rulers'
      } else if (hasEvt) {
        activeTab.value = 'events'
      }
    } else {
      selectedDynastyKey.value = null
    }
  }
}

const handleSelectChange = (event) => {
  scrollToAndSelectDynasty(event.target.value)
}

// 使用 ResizeObserver 监听容器宽度变化，比 window.resize 更准确
let resizeObserver = null

onMounted(() => {
  if (sortedDynastiesForSelect.value.length > 0) {
    scrollToAndSelectDynasty(sortedDynastiesForSelect.value[0].key)
  }

  if (timelineContainer.value) {
    // 初始化一次
    containerWidth.value = timelineContainer.value.clientWidth

    // 启动监听
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // 使用 contentRect.width 获取精确宽度
        containerWidth.value = entry.contentRect.width
      }
    })
    resizeObserver.observe(timelineContainer.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
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
        <button class="back-home-btn" @click="goHome" title="返回首页">
          ⌂
        </button>
        <h2>历朝时间纪年</h2>
        <select
          :value="selectedDynastyKey || ''"
          @change="handleSelectChange"
          class="dynasty-select"
        >
          <option
            v-for="d in sortedDynastiesForSelect"
            :key="d._vForId || d.name + d.start"
            :value="d.key"
          >
            {{ d.displayName }}
          </option>
        </select>

        <!-- 顶部右侧 Tab -->
        <div class="header-tabs" v-if="selectedDynastyKey">
          <div
            v-if="hasEmperors"
            class="header-tab-item"
            :class="{ active: activeTab === 'rulers' }"
            @click="activeTab = 'rulers'"
          >
            执政者
          </div>
          <div
            v-if="hasEvents"
            class="header-tab-item"
            :class="{ active: activeTab === 'events' }"
            @click="activeTab = 'events'"
          >
            大事记
          </div>
        </div>
      </div>

      <div
        class="timeline-scroll-area"
        ref="timelineContainer"
        @scroll="handleScroll"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <!-- 特殊时期文字层 (HTML + Sticky) -->
        <div
          class="special-periods-layer"
          :style="{ height: totalHeight + 'px', width: contentWidth + 'px' }"
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

          <!-- 详情区域时间轴 (第21列附近) -->
          <g
            class="detail-ruler"
            v-if="selectedDynastyKey && selectedDynastyRange"
          >
            <!-- 竖线位置：arrowBaseX + DETAIL_GAP - 20 (稍微左一点，作为分隔) -->
            <!-- 限制竖线高度：只绘制在朝代范围内 -->
            <line
              :x1="arrowBaseX + DETAIL_GAP - 20"
              :y1="selectedDynastyRange.top"
              :x2="arrowBaseX + DETAIL_GAP - 20"
              :y2="selectedDynastyRange.bottom"
              stroke="#666"
              stroke-width="1"
              stroke-dasharray="5 5"
            />

            <!-- 也可以绘制一套刻度，复用 ticks -->
            <g v-for="(tick, idx) in ticks" :key="'detail-tick-' + idx">
              <!-- 只绘制大刻度，且在朝代范围内 -->
              <template
                v-if="
                  tick.isLarge &&
                  tick.top >= selectedDynastyRange.top &&
                  tick.top <= selectedDynastyRange.bottom
                "
              >
                <line
                  :x1="arrowBaseX + DETAIL_GAP - 20 - 5"
                  :y1="tick.top"
                  :x2="arrowBaseX + DETAIL_GAP - 20"
                  :y2="tick.top"
                  stroke="#666"
                  stroke-width="1"
                />
                <text
                  :x="arrowBaseX + DETAIL_GAP - 30"
                  :y="tick.top"
                  dy="5"
                  text-anchor="end"
                  font-size="10"
                  fill="#666"
                >
                  {{
                    tick.year < 0
                      ? `前${Math.abs(tick.year)}年`
                      : `${tick.year}年`
                  }}
                </text>
              </template>
            </g>
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

          <!-- 转折点事件区块 -->
          <g class="turning-points">
            <g
              v-for="tp in processedTurningPoints"
              :key="tp.name + tp.date"
              class="turning-point-item"
              :transform="`translate(${tp.left}, ${tp.top})`"
              @mouseenter="showTooltip($event, tp)"
              @mousemove="moveTooltip($event)"
              @mouseleave="hideTooltip"
            >
              <g transform="translate(5, 0)">
                <text y="0" dy="5" text-anchor="start" font-size="12">
                  <tspan :fill="tp.iconColor" font-size="14">★</tspan>
                  <tspan :fill="tp.textColor" font-weight="bold" dx="2">
                    {{ tp.name }}
                  </tspan>
                </text>
              </g>
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
              <!-- 计算 X 坐标：紧贴最右侧 -->
              <g
                :transform="`translate(${contentWidth - arrowLayoutInfo.totalWidth + period.arrowColIndex * arrowLayoutInfo.colWidth + arrowLayoutInfo.padding / 2}, 0)`"
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

          <!-- 皇帝区块 -->
          <g class="emperors" v-if="processedEmperors.length">
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
                :width="emp.width || 30"
                :height="emp.height"
                rx="4"
                :fill="emp.color || '#E0F0FF'"
                stroke="#fff"
                stroke-width="1"
                opacity="0.9"
              />
              <text
                :x="emp.width / 2"
                :y="emp.height / 2"
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
                  (() => {
                    if (emp.height < 12) return ''
                    const CHAR_H = 14
                    const PADDING = 8
                    const maxChars = Math.floor((emp.height - PADDING) / CHAR_H)
                    if (emp.name.length <= maxChars) return emp.name
                    if (emp.height < 30)
                      return (
                        emp.name.substring(0, 1) + (emp.height > 20 ? '.' : '')
                      )
                    const keep = Math.max(1, maxChars - 1)
                    return emp.name.substring(0, keep) + '..'
                  })()
                }}
              </text>
            </g>
          </g>

          <!-- 皇后区块 -->
          <g class="queens" v-if="processedQueens.length">
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
                :width="queen.width"
                :height="queen.height"
                rx="4"
                :fill="queen.color"
                stroke="#fff"
                stroke-width="1"
                opacity="0.9"
              />
              <text
                :x="queen.width / 2"
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
                  queen.height < 12
                    ? ''
                    : queen.height < 30 && queen.name.length > 1
                      ? queen.name.substring(0, 1) + '~'
                      : queen.height < 50 && queen.name.length > 2
                        ? queen.name.substring(0, 2) + '~'
                        : queen.name
                }}
              </text>
            </g>
          </g>

          <!-- 事件区块 -->
          <g class="events" v-if="processedEvents.length">
            <g
              v-for="ev in processedEvents"
              :key="ev.name"
              class="event-item"
              :transform="`translate(${ev.left}, ${ev.top})`"
              @mouseenter="showTooltip($event, ev)"
              @mousemove="moveTooltip($event)"
              @mouseleave="hideTooltip"
            >
              <template v-if="ev.isPoint">
                <text
                  v-if="ev.isStar"
                  x="5"
                  y="0"
                  dy="3"
                  text-anchor="middle"
                  font-size="10"
                  :fill="ev.iconColor"
                >
                  ★
                </text>
                <circle v-else cx="5" cy="0" r="3" :fill="ev.iconColor" />
                <text
                  x="15"
                  y="0"
                  dy="4"
                  font-size="12"
                  :fill="ev.textColor"
                  font-weight="bold"
                >
                  {{ ev.name }}
                </text>
              </template>
              <template v-else>
                <line
                  x1="5"
                  y1="0"
                  x2="5"
                  :y2="ev.height"
                  :stroke="ev.iconColor"
                  stroke-width="1"
                  stroke-dasharray="4 4"
                />
                <text
                  v-if="ev.isStar"
                  x="5"
                  y="0"
                  dy="3"
                  text-anchor="middle"
                  font-size="10"
                  :fill="ev.iconColor"
                >
                  ★
                </text>
                <circle v-else cx="5" cy="0" r="3" :fill="ev.iconColor" />

                <text
                  v-if="ev.isStar"
                  x="5"
                  :y="ev.height"
                  dy="3"
                  text-anchor="middle"
                  font-size="10"
                  :fill="ev.iconColor"
                >
                  ★
                </text>
                <circle
                  v-else
                  cx="5"
                  :cy="ev.height"
                  r="3"
                  :fill="ev.iconColor"
                />
                <text
                  x="15"
                  y="0"
                  dy="4"
                  font-size="12"
                  :fill="ev.textColor"
                  font-weight="bold"
                >
                  {{ ev.name }}
                </text>
              </template>
            </g>
          </g>
          <!-- 悬停辅助线 -->
          <g
            class="hover-guide"
            v-if="hoverLine.show"
            style="pointer-events: none"
          >
            <line
              :x1="0"
              :y1="hoverLine.top"
              :x2="contentWidth"
              :y2="hoverLine.top"
              stroke="#666666"
              stroke-width="0.5"
              stroke-dasharray="4 4"
            />
            <!-- 标签背景 -->
            <rect
              :x="contentWidth - 60"
              :y="hoverLine.top - 10"
              width="50"
              height="20"
              rx="2"
              fill="#1976d2"
            />
            <text
              :x="contentWidth - 35"
              :y="hoverLine.top"
              dy="5"
              text-anchor="middle"
              fill="white"
              font-size="12"
            >
              {{ hoverLine.text }}
            </text>
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
          <div v-if="tooltip.duration" class="tooltip-duration">
            {{ tooltip.duration }}
          </div>
          <div
            v-if="tooltip.description"
            class="tooltip-description"
            style="
              max-width: 300px;
              font-size: 12px;
              margin-top: 5px;
              color: #eee;
              line-height: 1.4;
            "
          >
            {{ tooltip.description }}
          </div>
        </div>
      </div>

      <!-- 悬浮箭头层 (固定在视口右侧，跟随垂直滚动) -->
      <!-- <div class="arrow-overlay-container"> ... </div> -->
    </div>

    <!-- 右侧面板 (已整合到主 SVG 中) -->
  </div>
</template>

<style scoped>
.timeline-wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: white;
  display: flex;
  flex-direction: column; /* 垂直排列 header 和 scroll-area */
}

/* 移除 timeline-left-container，直接由 timeline-wrapper 管理 */
.timeline-left-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  width: 100%;
}

.timeline-scroll-area {
  flex: 1;
  overflow: auto;
  position: relative;
  width: 100%;
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

.header h2 {
  flex: 0 0 auto; /* 改为不伸缩 */
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
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
}

.back-home-btn:hover {
  background: #f5f5f5;
  color: #333;
  border-color: #ccc;
}

.dynasty-select {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  width: 200px;
  margin-left: 20px; /* 增加左边距 */
}

.header-tabs {
  display: flex;
  margin-left: auto; /* 推到右侧 */
  height: 100%;
}

.header-tab-item {
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  position: relative;
  transition: all 0.3s;
}

.header-tab-item:hover {
  color: #333;
  background: #f5f5f5;
}

.header-tab-item.active {
  color: #1976d2;
  font-weight: bold;
  background: #e3f2fd;
}

.header-tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #1976d2;
}

/* 移除 side-panel 相关样式 */

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
  filter: brightness(1.1);
}

.emperor-item:hover rect,
.queen-item:hover rect {
  opacity: 1;
  filter: brightness(1.1);
  cursor: pointer;
}

.event-item:hover {
  opacity: 0.8;
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

/* 特殊时期文字层 */
.special-periods-layer {
  position: absolute;
  top: 0;
  left: 0;
  /* width 由 js 动态控制 */
  pointer-events: none;
  z-index: 1; /* 在 SVG (z-index: 2) 之下 */
}

.special-period-item {
  position: absolute;
  /* 确保宽度占满，以便右对齐 */
  display: flex;
  justify-content: flex-end; /* 内容靠右 */
  box-sizing: border-box; /* 防止 padding 撑破 */
  padding-right: 20px; /* 右侧留白 */
}

.period-name-sticky {
  position: sticky;
  top: 60px; /* 吸顶距离，避开 header */
  text-align: right;
  height: fit-content;
  max-width: 200px; /* 限制宽度，防止过长 */
  background: rgba(255, 255, 255, 0.9); /* 增加半透明背景 */
  padding: 4px 8px; /* 增加内边距 */
  border-radius: 4px; /* 圆角 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
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
