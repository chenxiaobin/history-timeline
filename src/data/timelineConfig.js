// 时间轴刻度配置
export const timelineScales = [
  {
    name: 'ancient',
    startYear: -99999, // 无穷远起点
    endYear: 1911, // 1911年及之前使用粗分
    pixelsPerDay: 0.02, // 粗分比例：1天=0.02px (1年 ≈ 7.3px)，保证一年一刻度不拥挤
    tickStrategy: 'coarse', // 粗分策略
    ticks: {
      large: { length: 15, width: 2, showLabel: true }, // 10年
      medium: { length: 12, width: 1.5, showLabel: false }, // 5年
      small: { length: 8, width: 1.2 }, // 1年 (不显示)
      micro: { length: 0, width: 0 } // 1月 (不显示)
    }
  },
  {
    name: 'modern',
    startYear: 1912, // 1912年(民国元年)开始使用细分
    endYear: 99999, // 无穷远终点
    pixelsPerDay: 0.2, // 细分比例：1天=0.2px (1年 ≈ 73px)
    tickStrategy: 'fine', // 细分策略
    ticks: {
      large: { length: 15, width: 2, showLabel: true }, // 10年
      medium: { length: 12, width: 1.8, showLabel: true }, // 5年
      small: { length: 8, width: 1.2 }, // 1年
      micro: { length: 5, width: 0.8 } // 1月
    }
  }
]
