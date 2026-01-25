import { computed } from 'vue'

export function useDynastyTimeline(dataList, dynastyInfo = null) {
  // 配置参数
  const PIXELS_PER_DAY = 0.2 // 每天占用的像素高度 (5天1px)
  const RULER_WIDTH = 80
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
      const match = dateStr.match(/^(-?)(\d+)-(\d+)-(\d+)$/)
      if (match) {
        const isBC = match[1] === '-'
        const year = parseInt(match[2], 10) * (isBC ? -1 : 1)
        const month = parseInt(match[3], 10) - 1 // 月份从0开始
        const day = parseInt(match[4], 10)

        const date = new Date(year, month, day)
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
      if (dynastyInfo.value.start) dates.push(parseDate(dynastyInfo.value.start))
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

  const totalDays = computed(
    () => (maxDate.value - minDate.value) / (1000 * 60 * 60 * 24)
  )
  
  const totalHeight = computed(
    () => totalDays.value * PIXELS_PER_DAY + START_PADDING + END_PADDING
  )

  // 刻度生成
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
          label: y < 0 ? `前${Math.abs(y)}年` : `${y}年`,
          top: yearDays * PIXELS_PER_DAY + START_PADDING,
          isFirst: y === startYear
        })
      }

      // 月刻度
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

  return {
    PIXELS_PER_DAY,
    RULER_WIDTH,
    START_PADDING,
    END_PADDING,
    parseDate,
    formatDate,
    minDate,
    maxDate,
    totalHeight,
    ticks
  }
}
