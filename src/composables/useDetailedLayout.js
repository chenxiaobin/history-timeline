import { computed } from 'vue'

// 颜色配置
export const EMPEROR_COLORS = [
  '#b71c1c',
  '#880e4f',
  '#4a148c',
  '#311b92',
  '#1a237e',
  '#0d47a1',
  '#01579b',
  '#006064',
  '#004d40',
  '#1b5e20',
  '#33691e',
  '#827717',
  '#e65100',
  '#bf360c',
  '#3e2723',
  '#212121',
  '#263238'
]

export const EVENT_COLORS = ['#E65100', '#1B5E20', '#0D47A1', '#B71C1C']

export function useDetailedLayout(getTop, getHeight, parseDate, formatDate) {
  // 皇帝布局计算
  const calculateEmperorLayout = (
    items,
    colWidth,
    startOffset,
    colorOffset = 0,
    colGap = 20
  ) => {
    const cols = []
    return items.map((item, index) => {
      const startDate = parseDate(item.start)
      const endDate = parseDate(item.end)

      const top = getTop(startDate)
      const height = Math.max(getHeight(startDate, endDate), 2)

      // 计算在位时间显示
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
      // 民国特殊处理
      if (startDate.getFullYear() >= 1912) {
        const title = item.templeName || ''

        // 1. 南京临时政府
        if (title.includes('南京临时政府')) {
          colIndex = 0
        }
        // 2. 国民政府
        else if (title.includes('国民政府')) {
          const EPSILON = 0.001
          const col2End = cols[2] !== undefined ? cols[2] : -Infinity
          const col3End = cols[3] !== undefined ? cols[3] : -Infinity

          if (top >= col2End - EPSILON) colIndex = 2
          else if (top >= col3End - EPSILON) colIndex = 3
          else colIndex = 3
        }
        // 3. 北洋政府
        else {
          colIndex = 1
        }
      } else {
        // 贪心算法
        for (let i = 0; i < cols.length; i++) {
          if (cols[i] <= top) {
            colIndex = i
            break
          }
        }
        if (colIndex === -1) {
          colIndex = cols.length
        }
      }

      if (colIndex !== -1) {
        const currentEnd =
          cols[colIndex] !== undefined ? cols[colIndex] : -Infinity
        cols[colIndex] = Math.max(currentEnd, top + height)
      }

      return {
        ...item,
        colIndex,
        color: EMPEROR_COLORS[(index + colorOffset) % EMPEROR_COLORS.length],
        left: startOffset + colIndex * (colWidth + colGap),
        top,
        height,
        durationDisplay,
        startDateStr: formatDate(startDate),
        endDateStr: formatDate(endDate),
        width: colWidth
      }
    })
  }

  // 事件布局计算
  const calculateEventLayout = (items, colWidth, startOffset, colGap = 10) => {
    // 先排序
    const sortedEvents = [...items].sort((a, b) => {
      const dateA = parseDate(a.start || a.date)
      const dateB = parseDate(b.start || b.date)
      return dateA - dateB
    })

    const cols = []

    return sortedEvents.map((item) => {
      const startDate = parseDate(item.start || item.date)
      const endDate = item.end ? parseDate(item.end) : startDate

      const isPoint = !item.end
      const top = getTop(startDate)
      let height = 10
      if (!isPoint) {
        height = Math.max(getHeight(startDate, endDate), 10)
      }

      // 贪心布局
      let colIndex = -1
      const occupyHeight = height + (isPoint ? 20 : 10)
      const occupyEndTop = top + occupyHeight

      for (let i = 0; i < cols.length; i++) {
        if (cols[i] <= top) {
          colIndex = i
          break
        }
      }
      if (colIndex === -1) {
        colIndex = cols.length
      }
      cols[colIndex] = occupyEndTop + 1

      // 颜色和形状处理
      const types = Array.isArray(item.type)
        ? item.type
        : item.type
          ? [item.type]
          : []

      const isPointType = types.includes('point')
      const isWar = types.includes('war')
      const isCoup = types.includes('coup')

      let iconColor, textColor
      let isStar = false

      const COLOR_ORANGE = '#FF9800' // point 默认色
      const COLOR_RED = '#D32F2F' // war
      const COLOR_PURPLE = '#7B1FA2' // coup
      const COLOR_BLUE = '#0D47A1' // default

      if (isPointType) {
        isStar = true
        iconColor = COLOR_ORANGE

        if (isWar) textColor = COLOR_RED
        else if (isCoup) textColor = COLOR_PURPLE
        else textColor = COLOR_ORANGE
      } else {
        isStar = false
        // 默认逻辑
        if (isWar) {
          iconColor = textColor = COLOR_RED
        } else if (isCoup) {
          iconColor = textColor = COLOR_PURPLE
        } else {
          iconColor = textColor = COLOR_BLUE
        }
      }

      return {
        ...item,
        isPoint, // 布局用 (是否单点)
        isStar, // 形状用
        colIndex,
        iconColor,
        textColor,
        color: iconColor, // 兼容旧代码，作为默认颜色
        left: startOffset + colIndex * (colWidth + colGap),
        top,
        height,
        width: colWidth
      }
    })
  }

  return {
    calculateEmperorLayout,
    calculateEventLayout
  }
}
