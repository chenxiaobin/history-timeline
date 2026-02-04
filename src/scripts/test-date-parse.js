// 测试parseDate函数
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

// 测试isEventInReignPeriod函数
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

// 测试用例
console.log('=== 测试parseDate函数 ===')
console.log('parseDate(290):', parseDate(290)) // 290
console.log('parseDate("290-01"):', parseDate("290-01")) // 290.0
console.log('parseDate("290-12"):', parseDate("290-12")) // 290.9167
console.log('parseDate("290-01-01"):', parseDate("290-01-01")) // 290.0
console.log('parseDate("290-12-31"):', parseDate("290-12-31")) // 290.999
console.log('parseDate("290-02-28"):', parseDate("290-02-28")) // 290.0833 + 27/ (28*12)

console.log('\n=== 测试isEventInReignPeriod函数 ===')

// 测试用例1：皇帝在位时间只有年份
const emperor1 = {
  reignStart: 290,
  reignEnd: 300
}

// 事件1：具体年份
const event1 = { date: 295 }
console.log('皇帝在位290-300，事件295年:', isEventInReignPeriod(event1, emperor1)) // true

// 事件2：具体月份，在范围内
const event2 = { date: "290-06" }
console.log('皇帝在位290-300，事件290-06:', isEventInReignPeriod(event2, emperor1)) // true

// 事件3：具体日期，在范围内
const event3 = { date: "299-12-31" }
console.log('皇帝在位290-300，事件299-12-31:', isEventInReignPeriod(event3, emperor1)) // true

// 事件4：时间范围，在范围内
const event4 = { start: 292, end: 298 }
console.log('皇帝在位290-300，事件292-298:', isEventInReignPeriod(event4, emperor1)) // true

// 测试用例2：皇帝在位时间有月份
const emperor2 = {
  reignStart: "290-03",
  reignEnd: "300-09"
}

// 事件1：具体日期，在范围内
const event5 = { date: "290-06" }
console.log('皇帝在位290-03至300-09，事件290-06:', isEventInReignPeriod(event5, emperor2)) // true

// 事件2：具体日期，在范围外
const event6 = { date: "290-02" }
console.log('皇帝在位290-03至300-09，事件290-02:', isEventInReignPeriod(event6, emperor2)) // false

// 测试用例3：皇帝在位时间有具体日期
const emperor3 = {
  reignStart: "290-03-15",
  reignEnd: "300-09-20"
}

// 事件1：具体日期，在范围内
const event7 = { date: "290-04-01" }
console.log('皇帝在位290-03-15至300-09-20，事件290-04-01:', isEventInReignPeriod(event7, emperor3)) // true

// 事件2：具体日期，在范围外
const event8 = { date: "290-03-14" }
console.log('皇帝在位290-03-15至300-09-20，事件290-03-14:', isEventInReignPeriod(event8, emperor3)) // false

// 测试用例4：用户反馈的情况 - 司马炎（265-290），事件290-05月
console.log('\n=== 测试用户反馈的情况 ===')
const simayan = {
  reignStart: 265,
  reignEnd: 290
}

// 事件1：290-05月事件，应该在范围内
const event9 = { date: "290-05" }
console.log('司马炎在位265-290，事件290-05月:', isEventInReignPeriod(event9, simayan)) // true

// 事件2：290年事件，应该在范围内
const event10 = { date: 290 }
console.log('司马炎在位265-290，事件290年:', isEventInReignPeriod(event10, simayan)) // true

// 事件3：290-12月事件，应该在范围内
const event11 = { date: "290-12" }
console.log('司马炎在位265-290，事件290-12月:', isEventInReignPeriod(event11, simayan)) // true

// 事件4：291年事件，应该在范围外
const event12 = { date: 291 }
console.log('司马炎在位265-290，事件291年:', isEventInReignPeriod(event12, simayan)) // false
