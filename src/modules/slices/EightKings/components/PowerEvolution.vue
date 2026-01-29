<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const containerRef = ref(null)
const width = ref(1000)
const height = ref(600)

const START_YEAR = 290
const END_YEAR = 307
const TOTAL_MONTHS = (END_YEAR - START_YEAR + 1) * 12

const AXIS_HEIGHT = 60 // 增加时间轴高度
const BAR_HEIGHT = 20

const EIGHT_KINGS_START = '291-01'
const EIGHT_KINGS_END = '306-12'

// Resize Observer
let resizeObserver = null
onMounted(() => {
  if (containerRef.value) {
    const updateSize = () => {
      width.value = containerRef.value.clientWidth
      height.value = containerRef.value.clientHeight
    }
    updateSize()
    resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(containerRef.value)
  }
})
onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect()
})

// Helper to parse 'YYYY-MM'
const parseDate = (str) => {
  if (Array.isArray(str)) return { year: str[0], month: str[1] }
  const [y, m] = str.split('-').map(Number)
  return { year: y, month: m }
}

// 计算位置 (像素)
const getX = (yearOrStr, month = 1) => {
  let y, m
  if (typeof yearOrStr === 'string') {
    const d = parseDate(yearOrStr)
    y = d.year
    m = d.month
  } else {
    y = yearOrStr
    m = month
  }
  const totalMonths = (y - START_YEAR) * 12 + (m - 1)
  return (totalMonths / TOTAL_MONTHS) * width.value
}

const getWidth = (startStr, endStr) => {
  const start = getX(startStr)
  const end = getX(endStr)
  return Math.max(end - start, 1)
}

// 模拟数据
const rows = [
  {
    id: 'stage1',
    label: '第一阶段',
    items: [
      {
        name: '杨骏专权',
        start: '290-04',
        end: '291-03',
        color: '#e0e0e0',
        desc: '晋武帝临终托孤于杨骏，杨骏排斥异己，大肆封赏，引发宗室不满。'
      },
      {
        name: '诛杨骏',
        start: '291-03',
        end: '291-04',
        color: '#ff6b6b',
        desc: '贾后联合楚王司马玮发动政变，杀杨骏及其三族，杨氏覆灭。'
      },
      {
        name: '汝南王亮/卫瓘辅政',
        start: '291-04',
        end: '291-06',
        color: '#ffe66d',
        desc: '杨骏死后，汝南王司马亮与卫瓘共同辅政，试图稳定局势，但与贾后不和。'
      },
      {
        name: '诛二王(亮/玮)',
        start: '291-06',
        end: '291-07',
        color: '#ff6b6b',
        desc: '贾后利用楚王司马玮杀司马亮与卫瓘，随即以矫诏罪名杀司马玮，独揽大权。'
      }
    ]
  },
  {
    id: 'stage2',
    label: '第二阶段',
    items: [
      {
        name: '贾后专权时期',
        start: '291-07',
        end: '299-12',
        color: '#a8dadc',
        desc: '贾后掌权九年，重用张华等名臣，海内晏然，但种下祸根。'
      },
      {
        name: '废杀愍怀太子',
        start: '299-12',
        end: '300-03',
        color: '#ff6b6b',
        desc: '贾后设计陷害太子司马遹谋反，将其废黜并杀害，激怒赵王司马伦。'
      }
    ]
  },
  {
    id: 'stage3',
    label: '第三阶段',
    items: [
      {
        name: '赵王政变',
        start: '300-04',
        end: '300-05',
        color: '#ff9f43',
        desc: '司马伦以"为太子报仇"名义发动政变，并伪造诏书，废黜并毒杀贾后，铲除贾氏外戚势力。'
      },
      {
        name: '赵王伦篡位称帝',
        start: '301-01',
        end: '301-04',
        color: '#d35400',
        desc: '司马伦逼迫晋惠帝退位，自立为帝，引起诸王不满，天下大乱。'
      }
    ]
  },
  {
    id: 'stage4',
    label: '第四阶段',
    items: [
      {
        name: '三王伐伦',
        start: '301-03',
        end: '301-04',
        color: '#c0392b',
        desc: '齐王司马冏、成都王司马颖、河间王司马颙起兵讨伐司马伦，司马伦兵败被杀。'
      },
      {
        name: '齐王冏辅政',
        start: '301-04',
        end: '302-12',
        color: '#f1c40f',
        desc: '司马冏迎惠帝复位，辅政后骄奢淫逸，大兴土木，失去民心。'
      },
      {
        name: '长沙王乂掌权',
        start: '302-12',
        end: '304-01',
        color: '#3498db',
        desc: '长沙王司马乂击败司马冏，掌权期间试图维持皇室尊严，但遭二王围攻。'
      },
      {
        name: '二王伐乂',
        start: '303-08',
        end: '304-01',
        color: '#e74c3c',
        desc: '成都王司马颖与河间王司马颙联军进攻洛阳，司马乂苦战后被东海王司马越出卖并杀害。'
      }
    ]
  },
  {
    id: 'stage5',
    label: '第五阶段',
    items: [
      {
        name: '荡阴之败',
        start: '304-07',
        end: '304-08',
        color: '#2c3e50',
        textColor: '#fff',
        desc: '司马越挟持惠帝讨伐司马颖，在荡阴战败，惠帝面部中箭，被俘至邺城。'
      },
      {
        name: '成都王颖/河间王颙掌权',
        start: '304-02',
        end: '305-12',
        color: '#9b59b6',
        desc: '司马颖成为皇太弟，后势力衰退；司马颙控制关中，挟持惠帝至长安。'
      },
      {
        name: '东海王越迎帝还都',
        start: '305-07',
        end: '306-06',
        color: '#2ecc71',
        desc: '司马越集结兵力击败河间王势力，迎惠帝回洛阳，确立霸权。'
      },
      {
        name: '司马越专权',
        start: '306-06',
        end: '307-12',
        color: '#27ae60',
        desc: '司马越毒杀惠帝（疑），立司马炽（晋怀帝），独揽朝政，西晋走向灭亡。'
      }
    ]
  },
  {
    id: 'ruler',
    label: '掌权者',
    items: [
      {
        name: '杨骏',
        start: '290-04',
        end: '291-03',
        color: '#bdc3c7',
        desc: '依靠女儿皇太后身份专权，缺乏政治才能。'
      },
      {
        name: '贾后/二王',
        start: '291-03',
        end: '291-06',
        color: '#95a5a6',
        desc: '贾后通过政变清除辅政大臣，短暂利用二王。'
      },
      {
        name: '贾后',
        start: '291-06',
        end: '300-04',
        color: '#7f8c8d',
        desc: '淫虐暴戾，但重用张华，维持了短暂稳定。'
      },
      {
        name: '赵王伦',
        start: '300-04',
        end: '301-04',
        color: '#e67e22',
        desc: '篡逆之徒，任用孙秀，朝政混乱，“貂不足，狗尾续”。'
      },
      {
        name: '齐王冏',
        start: '301-04',
        end: '302-12',
        color: '#f39c12',
        desc: '拥兵自重，沉溺酒色，最终败亡。'
      },
      {
        name: '长沙王乂',
        start: '302-12',
        end: '304-01',
        color: '#3498db',
        desc: '虽有忠心，但孤立无援，死于火烤。'
      },
      {
        name: '成都王颖',
        start: '304-01',
        end: '304-08',
        color: '#8e44ad',
        desc: '坐镇邺城，遥控朝政，后众叛亲离。'
      },
      {
        name: '河间王颙',
        start: '304-08',
        end: '306-06',
        color: '#9b59b6',
        desc: '坐镇关中，阴险狡诈，最终被杀。'
      },
      {
        name: '东海王越',
        start: '306-06',
        end: '307-12',
        color: '#2ecc71',
        desc: '八王之乱最终胜利者，但无力回天，忧惧而死。'
      }
    ],
    markers: [{ date: '290-05-16', label: '晋武帝病逝', color: '#e74c3c' }]
  },
  {
    id: 'emperor',
    label: '晋惠帝',
    items: [
      {
        name: '继位(傻皇帝)',
        start: '290-04',
        end: '301-01',
        color: '#f1c40f',
        desc: '“何不食肉糜？”的痴呆皇帝，成为傀儡。'
      },
      {
        name: '太上皇(被废)',
        start: '301-01',
        end: '301-04',
        color: '#95a5a6',
        desc: '被司马伦逼迫退位，囚禁于金墉城。'
      },
      {
        name: '复位',
        start: '301-04',
        end: '304-07',
        color: '#f1c40f',
        desc: '司马伦败亡后复位，继续充当傀儡。'
      },
      {
        name: '被俘(邺城)',
        start: '304-07',
        end: '304-11',
        color: '#e74c3c',
        desc: '荡阴战败，身中三矢，侍中嵇绍血溅帝衣。'
      },
      {
        name: '挟持至长安',
        start: '304-11',
        end: '306-06',
        color: '#d35400',
        desc: '被张方强行劫持至长安，饱受流离之苦。'
      },
      {
        name: '归洛阳',
        start: '306-06',
        end: '306-11',
        color: '#f1c40f',
        desc: '被司马越迎回洛阳，仅仅半年后去世。'
      },
      {
        name: '被毒杀/驾崩',
        start: '306-11',
        end: '307-01',
        color: '#2c3e50',
        textColor: '#fff',
        desc: '食饼中毒暴崩，疑为司马越所害。'
      }
    ]
  }
]

// 动态计算行高布局
const isExpandedRow = (rowId) => rowId.startsWith('stage')

const getRowSlots = (row) => {
  if (isExpandedRow(row.id)) return row.items.length
  // 掌权者和晋惠帝行增加高度权重
  if (['ruler', 'emperor'].includes(row.id)) return 1.8
  return 1
}

const totalSlots = computed(() => {
  return rows.reduce((acc, row) => {
    return acc + getRowSlots(row)
  }, 0)
})

const slotHeight = computed(() => {
  const availableHeight = height.value - AXIS_HEIGHT
  // 保证最小高度，避免太挤
  return Math.max(availableHeight / totalSlots.value, 24)
})

const getRowHeight = (row) => {
  return getRowSlots(row) * slotHeight.value
}

const positionedRows = computed(() => {
  let currentY = 0
  return rows.map((row) => {
    const h = getRowHeight(row)
    const y = currentY
    currentY += h
    return { ...row, y, height: h }
  })
})

const getItemY = (row, index) => {
  if (isExpandedRow(row.id)) {
    return index * slotHeight.value + (slotHeight.value - BAR_HEIGHT) / 2
  }
  // 对于非展开行（掌权者/皇帝），居中显示
  const h = getRowHeight(row)
  return (h - BAR_HEIGHT) / 2
}

const getItemTextY = (row, index) => {
  if (isExpandedRow(row.id)) {
    return index * slotHeight.value + slotHeight.value / 2
  }
  const h = getRowHeight(row)
  return h / 2
}

const isTextOverflow = (item, w) => {
  // 估算：每个汉字约 12px，两边留白 4px
  const estimatedWidth = item.name.length * 12
  return estimatedWidth > w - 4
}

const getContrastColor = (hex) => {
  if (!hex) return '#333'
  const c = hex.substring(1)
  const rgb = parseInt(c, 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
  // 调高阈值到 160 (原 128)，让中等亮度的背景(如浅蓝)也显示白色文字，增加对比度
  return luma < 160 ? '#fff' : '#333'
}

// Tooltip logic
const tooltip = ref({ visible: false, x: 0, y: 0, content: null })

const showTooltip = (e, item) => {
  tooltip.value = {
    visible: true,
    x: e.clientX,
    y: e.clientY,
    content: item
  }
}

const hideTooltip = () => {
  tooltip.value.visible = false
}

// Guide Line Logic
const hoverX = ref(-1)
const hoverTime = ref('')

const onSvgMouseMove = (e) => {
  const rect = containerRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left

  if (x < 0 || x > width.value) {
    hoverX.value = -1
    return
  }
  hoverX.value = x

  const totalMonths = (x / width.value) * TOTAL_MONTHS
  const yearsPassed = Math.floor(totalMonths / 12)
  const monthsPassed = Math.floor(totalMonths % 12)

  const currentYear = START_YEAR + yearsPassed
  const currentMonth = monthsPassed + 1
  hoverTime.value = `${currentYear}年${currentMonth}月`
}

const onSvgMouseLeave = () => {
  hoverX.value = -1
}

// 年份刻度数据
const years = computed(() => {
  const list = []
  for (let y = START_YEAR; y <= END_YEAR; y++) {
    list.push({
      year: y,
      x: getX(y)
    })
  }
  return list
})
</script>

<template>
  <div class="evolution-view">
    <!-- 左侧 Y 轴 (HTML) -->
    <div class="y-axis">
      <!-- 头部留白 -->
      <div class="y-label-header"></div>
      <div
        v-for="row in positionedRows"
        :key="row.id"
        class="y-label"
        :style="{ height: `${row.height}px` }"
      >
        <span class="vertical-text">{{ row.label }}</span>
      </div>
      <!-- 底部留白对应时间轴 -->
      <div class="y-label-footer" :style="{ height: `${AXIS_HEIGHT}px` }"></div>
    </div>

    <!-- 右侧 SVG -->
    <div
      class="svg-container"
      ref="containerRef"
      @mousemove="onSvgMouseMove"
      @mouseleave="onSvgMouseLeave"
    >
      <svg :width="width" :height="height" v-if="width > 0">
        <!-- 1. 背景网格 (年份线) -->
        <g class="grid">
          <line
            v-for="y in years"
            :key="y.year"
            :x1="y.x"
            :y1="0"
            :x2="y.x"
            :y2="height - AXIS_HEIGHT"
            stroke="#f5f5f5"
            stroke-width="1"
          />
        </g>

        <!-- 2. 行内容 -->
        <g class="rows">
          <g
            v-for="row in positionedRows"
            :key="row.id"
            :transform="`translate(0, ${row.y})`"
          >
            <!-- 行底部分隔线 -->
            <line
              x1="0"
              :y1="row.height"
              :x2="width"
              :y2="row.height"
              stroke="#f0f0f0"
              stroke-dasharray="4 4"
            />

            <!-- 阶段内部分隔线 (如果展开) -->
            <g v-if="isExpandedRow(row.id)">
              <line
                v-for="i in row.items.length - 1"
                :key="i"
                x1="0"
                :y1="i * slotHeight"
                :x2="width"
                :y2="i * slotHeight"
                stroke="#f9f9f9"
                stroke-dasharray="2 2"
              />
            </g>

            <!-- 事件色块 -->
            <g
              v-for="(item, i) in row.items"
              :key="i"
              @mouseenter="showTooltip($event, item)"
              @mousemove="showTooltip($event, item)"
              @mouseleave="hideTooltip"
              style="cursor: pointer"
            >
              <rect
                :x="getX(item.start)"
                :y="getItemY(row, i)"
                :width="getWidth(item.start, item.end)"
                :height="BAR_HEIGHT"
                :fill="item.color"
                rx="2"
                ry="2"
                opacity="0.9"
              />

              <!-- 情况1：阶段行 (每个事件一行) -->
              <template v-if="isExpandedRow(row.id)">
                <!-- 内部文字 (如果不溢出) -->
                <text
                  v-if="!isTextOverflow(item, getWidth(item.start, item.end))"
                  :x="getX(item.start) + getWidth(item.start, item.end) / 2"
                  :y="getItemTextY(row, i)"
                  dy="0.35em"
                  text-anchor="middle"
                  font-size="12"
                  :fill="getContrastColor(item.color)"
                  style="user-select: none"
                >
                  {{ item.name }}
                </text>
                <!-- 溢出文字：跟随在色块尾部 -->
                <text
                  v-else
                  :x="getX(item.end) + 6"
                  :y="getItemTextY(row, i)"
                  dy="0.35em"
                  text-anchor="start"
                  font-size="12"
                  fill="#333"
                  style="user-select: none"
                >
                  {{ item.name }}
                </text>
              </template>

              <!-- 情况2：掌权者/皇帝行 (连续绘制) -->
              <template v-else>
                <!-- 内部文字 (如果不溢出) -->
                <text
                  v-if="!isTextOverflow(item, getWidth(item.start, item.end))"
                  :x="getX(item.start) + getWidth(item.start, item.end) / 2"
                  :y="getItemTextY(row, i)"
                  dy="0.35em"
                  text-anchor="middle"
                  font-size="12"
                  :fill="getContrastColor(item.color)"
                  style="user-select: none"
                >
                  {{ item.name }}
                </text>

                <!-- 溢出文字处理：引导线 + 外部文字 (上下交替) -->
                <g v-else>
                  <!-- 偶数索引：向上引导 -->
                  <template v-if="i % 2 === 0">
                    <line
                      :x1="
                        getX(item.start) + getWidth(item.start, item.end) / 2
                      "
                      :y1="getItemY(row, i)"
                      :x2="
                        getX(item.start) + getWidth(item.start, item.end) / 2
                      "
                      :y2="getItemY(row, i) - 5"
                      stroke="#999"
                      stroke-width="1"
                      stroke-dasharray="2 2"
                    />
                    <text
                      :x="getX(item.start) + getWidth(item.start, item.end) / 2"
                      :y="getItemY(row, i) - 8"
                      text-anchor="middle"
                      font-size="12"
                      fill="#333"
                      style="user-select: none"
                    >
                      {{ item.name }}
                    </text>
                  </template>

                  <!-- 奇数索引：向下引导 -->
                  <template v-else>
                    <line
                      :x1="
                        getX(item.start) + getWidth(item.start, item.end) / 2
                      "
                      :y1="getItemY(row, i) + BAR_HEIGHT"
                      :x2="
                        getX(item.start) + getWidth(item.start, item.end) / 2
                      "
                      :y2="getItemY(row, i) + BAR_HEIGHT + 5"
                      stroke="#999"
                      stroke-width="1"
                      stroke-dasharray="2 2"
                    />
                    <text
                      :x="getX(item.start) + getWidth(item.start, item.end) / 2"
                      :y="getItemY(row, i) + BAR_HEIGHT + 16"
                      text-anchor="middle"
                      font-size="12"
                      fill="#333"
                      style="user-select: none"
                    >
                      {{ item.name }}
                    </text>
                  </template>
                </g>
              </template>
            </g>
            <!-- 特殊标记 (Markers) -->
            <g v-if="row.markers">
              <g v-for="(marker, mi) in row.markers" :key="mi">
                <!-- 引导线 (向上) -->
                <line
                  :x1="getX(marker.date)"
                  :y1="row.height / 2"
                  :x2="getX(marker.date)"
                  :y2="row.height / 2 - 25"
                  :stroke="marker.color"
                  stroke-width="1"
                />
                <!-- 文字 -->
                <text
                  :x="getX(marker.date)"
                  :y="row.height / 2 - 28"
                  text-anchor="middle"
                  font-size="11"
                  :fill="marker.color"
                  font-weight="bold"
                >
                  {{ marker.label }}
                </text>

                <!-- 菱形标记 (旋转矩形) -->
                <rect
                  :x="getX(marker.date) - 4"
                  :y="row.height / 2 - 4"
                  width="8"
                  height="8"
                  :fill="marker.color"
                  :transform="`rotate(45, ${getX(marker.date)}, ${row.height / 2})`"
                  stroke="#fff"
                  stroke-width="1"
                />
              </g>
            </g>
          </g>
        </g>

        <!-- 3. 垂直引导线 -->
        <g v-if="hoverX > 0" class="guide-line">
          <line
            :x1="hoverX"
            y1="0"
            :x2="hoverX"
            :y2="height - AXIS_HEIGHT"
            stroke="#c0392b"
            stroke-width="1"
            stroke-dasharray="4 2"
          />
          <!-- 顶部时间标签 -->
          <rect
            :x="hoverX - 35"
            y="0"
            width="70"
            height="20"
            rx="4"
            fill="#c0392b"
            opacity="0.9"
          />
          <text
            :x="hoverX"
            y="14"
            text-anchor="middle"
            fill="#fff"
            font-size="11"
            font-weight="bold"
            pointer-events="none"
          >
            {{ hoverTime }}
          </text>
        </g>

        <!-- 4. 底部时间轴 -->
        <g class="axis" :transform="`translate(0, ${height - AXIS_HEIGHT})`">
          <!-- 主轴线 -->
          <line
            x1="0"
            y1="0"
            :x2="width"
            y2="0"
            stroke="#333"
            stroke-width="1"
          />

          <!-- 八王之乱 标记 -->
          <g>
            <!-- 中间横线 -->
            <line
              :x1="getX(EIGHT_KINGS_START)"
              y1="38"
              :x2="getX(EIGHT_KINGS_END)"
              y2="38"
              stroke="#d4a017"
              stroke-width="2"
            />

            <!-- 两端竖线 -->
            <line
              :x1="getX(EIGHT_KINGS_START)"
              y1="34"
              :x2="getX(EIGHT_KINGS_START)"
              y2="42"
              stroke="#d4a017"
              stroke-width="2"
            />
            <line
              :x1="getX(EIGHT_KINGS_END)"
              y1="34"
              :x2="getX(EIGHT_KINGS_END)"
              y2="42"
              stroke="#d4a017"
              stroke-width="2"
            />

            <!-- 箭头 (左 <, 右 >) -->
            <path
              :d="`M ${getX(EIGHT_KINGS_START) + 6} 34 L ${getX(EIGHT_KINGS_START)} 38 L ${getX(EIGHT_KINGS_START) + 6} 42`"
              fill="none"
              stroke="#d4a017"
              stroke-width="2"
            />
            <path
              :d="`M ${getX(EIGHT_KINGS_END) - 6} 34 L ${getX(EIGHT_KINGS_END)} 38 L ${getX(EIGHT_KINGS_END) - 6} 42`"
              fill="none"
              stroke="#d4a017"
              stroke-width="2"
            />

            <!-- 文字背景 (白色矩形遮挡横线) -->
            <rect
              :x="
                getX(EIGHT_KINGS_START) +
                getWidth(EIGHT_KINGS_START, EIGHT_KINGS_END) / 2 -
                40
              "
              y="28"
              width="80"
              height="20"
              fill="white"
            />

            <!-- 文字 -->
            <text
              :x="
                getX(EIGHT_KINGS_START) +
                getWidth(EIGHT_KINGS_START, EIGHT_KINGS_END) / 2
              "
              y="43"
              text-anchor="middle"
              font-size="14"
              font-weight="bold"
              fill="#d4a017"
            >
              八王之乱
            </text>
          </g>

          <g
            v-for="(y, index) in years"
            :key="y.year"
            :transform="`translate(${y.x}, 0)`"
          >
            <!-- 大刻度 (年) -->
            <line y1="0" y2="10" stroke="#333" stroke-width="1" />
            <text
              y="24"
              :text-anchor="
                index === 0
                  ? 'start'
                  : index === years.length - 1
                    ? 'end'
                    : 'middle'
              "
              font-size="12"
              fill="#666"
            >
              {{ y.year }}
            </text>

            <!-- 小刻度 (月) -->
            <g
              v-for="m in 11"
              :key="m"
              :transform="`translate(${getX(y.year, m + 1) - y.x}, 0)`"
            >
              <line y1="0" y2="6" stroke="#ccc" stroke-width="1" />
            </g>
          </g>
        </g>
      </svg>
    </div>

    <!-- 自定义 Tooltip -->
    <div
      v-if="tooltip.visible"
      class="custom-tooltip"
      :style="{ top: `${tooltip.y + 15}px`, left: `${tooltip.x + 15}px` }"
    >
      <div class="tooltip-title">{{ tooltip.content.name }}</div>
      <div class="tooltip-time">
        {{ tooltip.content.start }} 至 {{ tooltip.content.end }}
      </div>
      <div class="tooltip-desc" v-if="tooltip.content.desc">
        {{ tooltip.content.desc }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.evolution-view {
  display: flex;
  height: 100%;
  width: 100%;
  background: #fff;
  border-top: 1px solid #eee;
  box-sizing: border-box;
  overflow: hidden;
}

.y-axis {
  width: 40px;
  flex-shrink: 0;
  border-right: 1px solid #ccc;
  background: #fdfdfd;
  z-index: 2;
  display: flex;
  flex-direction: column;
}

.y-label-header {
  height: 10px; /* 顶部微调留白 */
  flex-shrink: 0;
}

.y-label {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px dashed #eee;
  font-size: 0.85rem;
  font-weight: 500;
  color: #2c3e50;
  background: #f9f9f9;
}

.y-label-footer {
  flex-shrink: 0;
  background: #fff;
  border-top: 1px solid #333; /* 对齐 SVG 轴线 */
}

.vertical-text {
  writing-mode: vertical-lr;
  letter-spacing: 2px;
}

/* 特殊处理最后两行 */
.y-label:nth-last-child(2), /* ruler */
.y-label:nth-last-child(3) {
  /* emperor (倒数第二个数据行，footer是倒数第一个元素) */
  background: #fff0d4;
  font-weight: bold;
}

/* 修正 nth-last-child 选择器，因为加了 footer */
/* rows 倒数第一行是 emperor，倒数第二行是 ruler */
/* 在 y-axis div 中，它们是倒数第2个和第3个子元素 (footer 是倒数第1个) */

.svg-container {
  flex: 1;
  height: 100%;
  overflow: hidden;
  position: relative;
}

/* Guide Line */
.guide-line {
  pointer-events: none;
}

.custom-tooltip {
  position: fixed;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.tooltip-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.tooltip-time {
  font-size: 0.75rem;
  opacity: 0.8;
}

.tooltip-desc {
  font-size: 0.75rem;
  margin-top: 6px;
  color: #ddd;
  max-width: 250px;
  white-space: normal;
  line-height: 1.4;
  text-align: justify;
}
</style>
