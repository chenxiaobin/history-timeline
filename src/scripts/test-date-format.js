// 测试formatDate函数
const formatDate = (dateStr) => {
  if (typeof dateStr === 'number') {
    // 只有年份
    return dateStr < 0 ? `公元前${Math.abs(dateStr)}年` : `${dateStr}年`
  }
  
  // 处理字符串格式，支持负数年份
  let year, month, day
  if (dateStr.startsWith('-')) {
    // 负数年份
    const match = dateStr.match(/-([0-9]+)-?([0-9]+)?-?([0-9]+)?/)
    if (match) {
      year = -parseInt(match[1], 10)
      month = match[2] ? parseInt(match[2], 10) : undefined
      day = match[3] ? parseInt(match[3], 10) : undefined
    } else {
      return dateStr
    }
  } else {
    // 正数年份
    const parts = dateStr.split('-').map(Number)
    year = parts[0]
    month = parts[1]
    day = parts[2]
  }
  
  const isNegative = year < 0
  const absYear = Math.abs(year)
  const yearStr = isNegative ? `公元前${absYear}年` : `${year}年`
  
  if (month === undefined) {
    // 只有年份
    return yearStr
  } else if (day === undefined) {
    // 年份-月份
    return `${yearStr}${month}月`
  } else {
    // 年份-月份-日期
    return `${yearStr}${month}月${day}日`
  }
  
  return dateStr
}

// 测试formatEventTime函数
const formatEventTime = (event) => {
  if (event.date) {
    return formatDate(event.date)
  } else if (event.start && event.end) {
    return `${formatDate(event.start)} - ${formatDate(event.end)}`
  }
  return ''
}

// 测试用例
console.log('=== 测试formatDate函数 ===')
// 只有年份
console.log('formatDate(217):', formatDate(217)) // 217年
console.log('formatDate(-2070):', formatDate(-2070)) // 公元前2070年
console.log('formatDate("265"):', formatDate("265")) // 265年
console.log('formatDate("-2070"):', formatDate("-2070")) // 公元前2070年

// 年份-月份
console.log('formatDate("249-02"):', formatDate("249-02")) // 249年2月
console.log('formatDate("290-05"):', formatDate("290-05")) // 290年5月
console.log('formatDate("-2070-01"):', formatDate("-2070-01")) // 公元前2070年1月

// 年份-月份-日期
console.log('formatDate("290-05-16"):', formatDate("290-05-16")) // 290年5月16日
console.log('formatDate("-2070-01-01"):', formatDate("-2070-01-01")) // 公元前2070年1月1日

console.log('\n=== 测试formatEventTime函数 ===')
// 具体日期事件
const event1 = { date: 217 } // 217年
console.log('event1:', formatEventTime(event1)) // 217年

const event2 = { date: "249-02" } // 249年2月
console.log('event2:', formatEventTime(event2)) // 249年2月

const event3 = { date: "290-05-16" } // 290年5月16日
console.log('event3:', formatEventTime(event3)) // 290年5月16日

const event4 = { date: "-2070-01-01" } // 公元前2070年1月1日
console.log('event4:', formatEventTime(event4)) // 公元前2070年1月1日

// 时间范围事件
const event5 = { start: 217, end: 239 } // 217年 - 239年
console.log('event5:', formatEventTime(event5)) // 217年 - 239年

const event6 = { start: "249-02", end: "249-02" } // 249年2月 - 249年2月
console.log('event6:', formatEventTime(event6)) // 249年2月 - 249年2月

const event7 = { start: "280", end: "290" } // 280年 - 290年
console.log('event7:', formatEventTime(event7)) // 280年 - 290年

const event8 = { start: "-2070-01", end: "-2061-12" } // 公元前2070年1月 - 公元前2061年12月
console.log('event8:', formatEventTime(event8)) // 公元前2070年1月 - 公元前2061年12月
