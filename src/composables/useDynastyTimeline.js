import { computed } from 'vue'
import { timelineScales } from '../data/timelineConfig'

export function useDynastyTimeline(dataList, dynastyInfo = null) {
  // 配置参数
  // PIXELS_PER_DAY 不再是常数，而是根据时间段动态变化
  // const PIXELS_PER_DAY = 0.1
  const RULER_WIDTH = 100
  const START_PADDING = 40
  const END_PADDING = 100

  // 日期解析工具
  const parseDate = (dateStr) => {
    // 如果是数字年份 (如 -221 或 1368)
    if (typeof dateStr === 'number') {
      const d = new Date(0) // 初始化为 1970-01-01
      d.setFullYear(dateStr, 0, 1) // 显式设置完整年份
      d.setHours(0, 0, 0, 0)
      return d
    }

    // 处理字符串日期
    if (typeof dateStr === 'string') {
      dateStr = dateStr.trim()

      // 0. 尝试匹配纯数字字符串（可能带负号），视为年份
      if (/^-?\d+$/.test(dateStr)) {
        const year = parseInt(dateStr, 10)
        const d = new Date(0)
        d.setFullYear(year, 0, 1)
        d.setHours(0, 0, 0, 0)
        return d
      }

      // 尝试手动解析 YYYY-MM-DD 或 -YYYY-MM-DD
      const match = dateStr.match(/^(-?)(\d+)-(\d+)-(\d+)$/)
      if (match) {
        const isBC = match[1] === '-'
        const year = parseInt(match[2], 10) * (isBC ? -1 : 1)
        const month = parseInt(match[3], 10) - 1 // 月份从0开始
        const day = parseInt(match[4], 10)

        const date = new Date(0) // 初始化为 1970-01-01
        date.setFullYear(year, month, day) // 显式设置完整年份
        date.setHours(0, 0, 0, 0)
        return date
      }

      // 尝试匹配 YYYY-MM 或 -YYYY-MM (如 '23-10')
      const matchMonth = dateStr.match(/^(-?)(\d+)-(\d+)$/)
      if (matchMonth) {
        const isBC = matchMonth[1] === '-'
        const year = parseInt(matchMonth[2], 10) * (isBC ? -1 : 1)
        const month = parseInt(matchMonth[3], 10) - 1

        const date = new Date(0)
        date.setFullYear(year, month, 1)
        date.setHours(0, 0, 0, 0)
        return date
      }
    }

    // 兜底：虽然 new Date(dateStr) 很方便，但对于负年份支持不好，且两分位数年份（0-99）会被解析为 19xx
    // 这里我们假设如果上面的正则没匹配，可能是其他格式，但暂时只支持上面的格式或数字
    // 如果必须兜底，也要手动处理年份，避免 0-99 被解析为 19xx
    const d = new Date(dateStr)
    // 简单的修正尝试：如果 dateStr 是纯数字字符串 '25'，new Date('25') 会 Invalid Date
    // 如果是 '0025-01-01'，new Date 会解析正确吗？
    // 为了保险，建议所有输入都规范化。
    // 这里保留原有的 new Date 作为最后的 fallback，但风险自负
    return d
  }

  // 格式化日期显示
  const formatDate = (date) => {
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    const yearStr = y < 0 ? `前${Math.abs(y)}` : `${y}`
    return `${yearStr}年${m}月${d}日`
  }

  // 计算时间范围
  const allDates = computed(() => {
    const dates = []

    // 从数据列表提取
    if (dataList.value) {
      dataList.value.forEach((item) => {
        if (item.start) dates.push(parseDate(item.start))
        if (item.end) dates.push(parseDate(item.end))
        if (item.date) dates.push(parseDate(item.date))
      })
    }

    // 包含朝代起止时间 (确保时间轴覆盖整个朝代)
    if (dynastyInfo && dynastyInfo.value) {
      if (dynastyInfo.value.start)
        dates.push(parseDate(dynastyInfo.value.start))
      if (dynastyInfo.value.end) dates.push(parseDate(dynastyInfo.value.end))
    }

    return dates
  })

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

  // 预计算每个时间段的起始高度
  // 我们需要根据实际的 minDate 来动态计算每个段的有效起始高度
  const processedScales = computed(() => {
    const min = minDate.value.getFullYear()
    // const max = maxDate.value.getFullYear()

    let currentTop = START_PADDING

    return timelineScales.map((scale) => {
      // 确定该段在当前数据中的有效起始年份
      // 如果段的结束时间早于 minDate，则该段完全在可视范围外之前（但我们从 minDate 开始画，所以这种情况高度为0）
      // 如果段的开始时间晚于 minDate，则该段从自己的 startYear 开始
      // 如果段包含了 minDate，则从 minDate 开始

      const effectiveStartYear = Math.max(scale.startYear, min)
      const startTimestamp = new Date(0).setFullYear(effectiveStartYear, 0, 1)

      const segment = {
        ...scale,
        startTop: currentTop,
        startTimestamp
      }

      // 计算该段的高度贡献（如果该段在当前范围内）
      // 注意：这里只是为了计算下一段的 startTop，并不代表该段的实际总高度（因为最后一段可能延伸到 maxDate）
      // 实际上我们只需要知道每一段的“结束高度”

      // 但由于时间是连续的，我们可以用一个函数来计算任意时间点的 top，不需要预先算出总高度
      // 只要确保段与段之间是连续的即可
      // 这里的 startTop 指的是该段 startYear (或者 minDate，如果更晚) 对应的高度
      // 但为了简单，我们可以定义 startTop 为该段标准 startYear 对应的高度？
      // 不行，因为 minDate 之前的区域不渲染，top=START_PADDING 应该对应 minDate

      // 重新设计：
      // top = START_PADDING + sum(previous_segments_height) + (date - segment_start) * rate
      // 必须以 minDate 为基准。

      return segment
    })
  })

  // 获取任意日期的 Y 坐标 (核心逻辑)
  const getTop = (dateOrStr) => {
    const date =
      typeof dateOrStr === 'object' ? dateOrStr : parseDate(dateOrStr)
    const year = date.getFullYear()
    const timestamp = date.getTime()
    const minTime = minDate.value.getTime()

    // 如果日期早于 minDate，返回 padding (或者负值，视需求而定，这里统一钳制)
    if (timestamp < minTime) return START_PADDING

    let accumulatedHeight = START_PADDING

    // 找到包含该日期的配置段，以及之前的所有段
    // 注意：这里的段是按照时间顺序排列的
    for (let i = 0; i < timelineScales.length; i++) {
      const scale = timelineScales[i]
      const scaleStartYear = scale.startYear
      const scaleEndYear = scale.endYear

      // 当前段的有效时间范围（在 minDate 之后的部分）
      // 段的开始时间：取段定义开始时间和 minDate 的较晚者
      // 段的结束时间：取段定义结束时间和 date 的较早者

      // 将年份转换为时间戳进行比较
      // 注意：这里需要精确到毫秒，特别是跨年的时候
      // 简化处理：我们假设 scale 的分界点是当年的 1月1日 00:00:00

      const scaleStartTime = new Date(0).setFullYear(scaleStartYear, 0, 1)
      // 结束时间是次年的 1月1日 (不含)，或者简单的认为 endYear 的 12月31日
      // 为了连续性，endYear 应该是下一段的 startYear - 1ms
      // 配置里是 1911 和 1912。所以 1911段结束于 1911-12-31 23:59:59，1912段开始于 1912-01-01 00:00:00
      const scaleEndTime = new Date(0).setFullYear(scaleEndYear + 1, 0, 1) // 次年年初

      // 1. 如果该段完全在 minDate 之前，忽略
      if (scaleEndTime <= minTime) continue

      // 2. 该段的有效起始时间
      const effectiveStartTime = Math.max(scaleStartTime, minTime)

      // 3. 检查 date 是否在该段内，或者该段在 date 之前
      if (timestamp >= effectiveStartTime) {
        // 计算该段内的时间跨度
        // 如果 date 在该段内，只计算到 date
        // 如果 date 在该段之后，计算整个有效段
        const effectiveEndTime = Math.min(scaleEndTime, timestamp)

        const duration = effectiveEndTime - effectiveStartTime
        if (duration > 0) {
          const days = duration / (1000 * 60 * 60 * 24)
          accumulatedHeight += days * scale.pixelsPerDay
        }

        // 如果 date 在该段内（包括边界），则计算结束
        if (timestamp < scaleEndTime) break
      }
    }

    return accumulatedHeight
  }

  // 根据 Y 坐标反推日期
  const getDateFromY = (y) => {
    const minTime = minDate.value.getTime()

    // 如果 y 小于起始 padding，返回 minDate
    if (y < START_PADDING) return minDate.value

    let currentTop = START_PADDING

    for (let i = 0; i < timelineScales.length; i++) {
      const scale = timelineScales[i]
      const scaleStartYear = scale.startYear
      const scaleEndYear = scale.endYear

      const scaleStartTime = new Date(0).setFullYear(scaleStartYear, 0, 1)
      const scaleEndTime = new Date(0).setFullYear(scaleEndYear + 1, 0, 1)

      if (scaleEndTime <= minTime) continue

      const effectiveStartTime = Math.max(scaleStartTime, minTime)
      const duration = scaleEndTime - effectiveStartTime

      if (duration <= 0) continue

      const days = duration / (1000 * 60 * 60 * 24)
      const segmentHeight = days * scale.pixelsPerDay

      // 检查 y 是否在当前段内
      if (y <= currentTop + segmentHeight) {
        // 在当前段内
        const deltaY = y - currentTop
        const deltaDays = deltaY / scale.pixelsPerDay
        const targetTime =
          effectiveStartTime + deltaDays * (1000 * 60 * 60 * 24)
        return new Date(targetTime)
      }

      currentTop += segmentHeight
    }

    return maxDate.value
  }

  // 计算总高度
  const totalHeight = computed(() => {
    return getTop(maxDate.value) + END_PADDING
  })

  // 刻度生成
  const ticks = computed(() => {
    const arr = []
    if (!minDate.value || !maxDate.value) return arr

    const startYear = minDate.value.getFullYear()
    const endYear = maxDate.value.getFullYear()

    for (let y = startYear; y <= endYear; y++) {
      // 确定当前年份使用的配置
      const scale = timelineScales.find(
        (s) => y >= s.startYear && y <= s.endYear
      )
      if (!scale) continue // 理论上不应该发生，除非配置没覆盖全

      // const isCoarse = scale.tickStrategy === 'coarse'

      // 使用配置的 ticks 参数
      const tickConfig = scale.ticks

      // 通用逻辑：判断是否是大/中刻度
      const isLarge = y % 10 === 0
      const isMedium = y % 5 === 0 && !isLarge
      const isSmall = !isLarge && !isMedium

      // 检查是否需要显示该层级的刻度 (width > 0 表示显示)
      let currentTickConfig = null
      let tickType = ''

      if (isLarge) {
        currentTickConfig = tickConfig.large
        tickType = 'large'
      } else if (isMedium) {
        currentTickConfig = tickConfig.medium
        tickType = 'medium'
      } else {
        currentTickConfig = tickConfig.small
        tickType = 'small'
      }

      // 如果配置了不显示（width=0 或 length=0），则跳过
      if (
        !currentTickConfig ||
        currentTickConfig.width === 0 ||
        currentTickConfig.length === 0
      ) {
        // 如果是小刻度不显示，那就不添加
        // 但如果大刻度不显示？通常大刻度都会显示
      } else {
        // 年刻度
        const yearDate = new Date(0)
        yearDate.setFullYear(y, 0, 1)
        yearDate.setHours(0, 0, 0, 0)

        // 使用新的 getTop 计算位置
        const top = getTop(yearDate)

        // 只有当刻度在有效范围内时才添加
        if (y >= startYear && y <= endYear) {
          arr.push({
            type: 'year',
            year: y,
            label: y < 0 ? `前${Math.abs(y)}年` : `${y}年`,
            fullLabel: y < 0 ? `前${Math.abs(y)}年` : `${y}年`,
            top: top,
            isLarge,
            isMedium,
            isSmall,
            showLabel: currentTickConfig.showLabel,
            // 传递样式配置给组件
            config: currentTickConfig
          })
        }
      }

      // 月刻度 (仅当配置了 micro 且 width > 0 时显示)
      if (
        tickConfig.micro &&
        tickConfig.micro.width > 0 &&
        tickConfig.micro.length > 0
      ) {
        // 计算这一年的天数 (处理闰年)
        for (let m = 1; m < 12; m++) {
          const monthDate = new Date(0)
          monthDate.setFullYear(y, m, 1)
          monthDate.setHours(0, 0, 0, 0)

          const monthTop = getTop(monthDate)

          // 只要在范围内
          if (monthDate >= minDate.value && monthDate <= maxDate.value) {
            arr.push({
              type: 'month',
              top: monthTop,
              isMicro: true,
              config: tickConfig.micro
            })
          }
        }
      }
    }
    return arr
  })

  // 为了兼容现有组件，PIXELS_PER_DAY 仍然需要暴露，但它不再是一个常量
  // 组件中用它来计算高度 (height = duration * PIXELS_PER_DAY)
  // 如果这里不暴露，组件里的 height 计算会报错
  // 我们需要给组件提供一个 helper 来计算高度差
  const getHeight = (startDate, endDate) => {
    return getTop(endDate) - getTop(startDate)
  }

  return {
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
    getDateFromY, // 导出新函数
    getHeight // 新增：用于替代 PIXELS_PER_DAY 计算高度
  }
}
