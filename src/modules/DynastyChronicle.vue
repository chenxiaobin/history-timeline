<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { dynastyData } from '../data/dynastyChronicle'
import { royalFamilyTree } from '../data/royalFamilyTree'
import * as d3 from 'd3'

const router = useRouter()

const goBack = () => {
  router.push('/')
}

// 格式化年份显示
const formatYear = (year, short = false) => {
  if (short) {
    return year < 0 ? `前${Math.abs(year)}年` : `${year}年`
  }
  return year < 0 ? `公元前${Math.abs(year)}年` : `${year}年`
}

// 格式化日期显示，根据精度显示不同格式
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

// 格式化事件时间
const formatEventTime = (event) => {
  if (event.date) {
    return formatDate(event.date)
  } else if (event.start && event.end) {
    return `${formatDate(event.start)} - ${formatDate(event.end)}`
  }
  return ''
}

// 解析不同格式的时间为数字年份（支持：年份、年份-月份、年份-月份-日期）
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

// 判断事件时间是否在皇帝在位时间范围内
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

// 响应式变量：当前选中的朝代
const selectedDynasty = ref('西晋')

// 响应式变量：族谱弹出框
const showFamilyTree = ref(false)
const currentDynasty = ref(null)
const familyTreeSvg = ref('')

// 滚动到选中的朝代
const scrollToDynasty = () => {
  const dynastyIndex = dynastyData.findIndex(dynasty => dynasty.name === selectedDynasty.value)
  if (dynastyIndex !== -1) {
    const dynastyBlock = document.querySelectorAll('.dynasty-block')[dynastyIndex]
    if (dynastyBlock) {
      dynastyBlock.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

// 监听选中朝代变化，滚动到对应位置
watch(selectedDynasty, scrollToDynasty)

// 组件挂载时，默认滚动到西晋
onMounted(() => {
  nextTick(() => {
    scrollToDynasty()
  })
})

// 显示族谱弹出框
const showFamilyTreePopup = (dynasty) => {
  currentDynasty.value = dynasty
  
  // 先显示弹出框
  showFamilyTree.value = true
  
  // 等待DOM更新后，获取弹出框的实际宽高
  nextTick(() => {
    const popupContent = document.querySelector('.popup-content')
    if (popupContent) {
      // 获取弹出框内容区域的实际宽高
      const contentWidth = popupContent.clientWidth - 40 // 减去padding（20px * 2）
      const contentHeight = popupContent.clientHeight - 40 // 减去padding（20px * 2）
      
      // 根据弹出框实际宽高生成SVG
      familyTreeSvg.value = drawFamilyTree(dynasty.name, contentWidth, contentHeight)
      
      // 再次等待DOM更新后，添加D3.js的zoom功能
      nextTick(() => {
        const svgElement = document.querySelector('.popup-content svg')
        if (svgElement) {
          // 添加D3.js的zoom功能
          const svg = d3.select(svgElement)
          const g = svg.select('g')
          
          // 获取SVG和内容的尺寸
          const svgRect = svgElement.getBoundingClientRect()
          const contentRect = g.node().getBBox()
          
          // 计算初始缩放比例，让内容完整显示在SVG中
          const scaleX = (svgRect.width - 100) / contentRect.width // 减去边距
          const scaleY = (svgRect.height - 100) / contentRect.height // 减去边距
          const initialScale = Math.min(scaleX, scaleY, 1) // 最大不超过1倍
          
          // 计算居中偏移量
          const translateX = (svgRect.width - contentRect.width * initialScale) / 2 - contentRect.x * initialScale
          const translateY = (svgRect.height - contentRect.height * initialScale) / 2 - contentRect.y * initialScale
          
          // 创建zoom行为
          const zoom = d3.zoom()
            .scaleExtent([0.5, 3]) // 缩放范围：最小0.5倍，最大3倍
            .on('zoom', (event) => {
              g.attr('transform', event.transform)
            })
          
          // 添加zoom行为到SVG
          svg.call(zoom)
          
          // 设置初始缩放状态，让内容完整显示
          svg.call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(initialScale))
          
          // 添加鼠标拖动功能
          svg.style('cursor', 'move')
          
          // 修复滚动冲突：当鼠标悬停在SVG上时，禁用页面滚动
          svg.on('mouseenter', () => {
            document.body.style.overflow = 'hidden'
          })
          
          svg.on('mouseleave', () => {
            document.body.style.overflow = 'auto'
          })
        }
      })
    }
  })
}

// 关闭族谱弹出框
const closeFamilyTreePopup = () => {
  showFamilyTree.value = false
  currentDynasty.value = null
  familyTreeSvg.value = ''
}

// 绘制族谱组织架构图（使用D3.js tree布局，水平思维导图风格）
const drawFamilyTree = (dynastyName, contentWidth, contentHeight) => {
  const familyTree = royalFamilyTree[dynastyName]
  if (!familyTree) return ''
  
  const members = familyTree.members
  
  // 构建层次数据结构
  const buildHierarchy = () => {
    const nodeMap = new Map()
    
    // 创建所有节点
    members.forEach(member => {
      nodeMap.set(member.id, {
        ...member,
        children: []
      })
    })
    
    // 构建父子关系
    let rootNode = null
    members.forEach(member => {
      const currentNode = nodeMap.get(member.id)
      if (member.father === null) {
        rootNode = currentNode
      } else {
        const fatherNode = nodeMap.get(member.father)
        if (fatherNode) {
          fatherNode.children.push(currentNode)
        }
      }
    })
    
    return rootNode
  }
  
  const root = buildHierarchy()
  if (!root) return ''
  
  // 创建水平方向的tree布局，使用nodeSize控制节点间距
  const treeLayout = d3.tree()
    .nodeSize([60, 300]) // [垂直间距, 水平间距]
    .separation((a, b) => (a.parent === b.parent ? 1.2 : 2)) // 增加节点间距
  
  // 生成层次数据
  const hierarchy = d3.hierarchy(root)
  const treeData = treeLayout(hierarchy)
  
  // 计算实际需要的SVG尺寸
  const nodeWidth = 150
  const nodeHeight = 60
  const margin = { top: 50, right: 50, bottom: 50, left: 100 }
  
  // 计算节点的边界
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  
  treeData.descendants().forEach(node => {
    const x = node.y
    const y = node.x
    
    minX = Math.min(minX, x - nodeWidth / 2)
    maxX = Math.max(maxX, x + nodeWidth / 2)
    minY = Math.min(minY, y - nodeHeight / 2)
    maxY = Math.max(maxY, y + nodeHeight / 2)
  })
  
  // 使用弹出框的实际宽高作为SVG尺寸，如果没有传入则使用默认值
  const svgWidth = contentWidth || 1600
  const svgHeight = contentHeight || 800
  
  // 创建SVG字符串，添加viewBox确保内容正确显示
  let svg = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">`
  
  // 定义箭头标记（小尺寸灰色，确保箭头尖端准确指向目标）
  svg += `<defs>`
  svg += `<marker id="arrowhead" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="6" refX="9" refY="3" orient="auto">`
  svg += `<polygon points="0 0, 10 3, 0 6" fill="#999" stroke="#999" stroke-width="0.5" />`
  svg += `</marker>`
  svg += `</defs>`
  
  // 计算内容的中心点，将家族树居中显示在SVG中
  const contentWidthActual = maxX - minX
  const contentHeightActual = maxY - minY
  
  // 计算居中偏移量
  const centerOffsetX = (svgWidth - contentWidthActual - margin.left - margin.right) / 2 + margin.left
  const centerOffsetY = (svgHeight - contentHeightActual - margin.top - margin.bottom) / 2 + margin.top
  
  svg += `<g transform="translate(${centerOffsetX - minX}, ${centerOffsetY - minY})">`
  
  // 收集过继关系
  const adoptiveRelationships = []
  members.forEach(member => {
    if (member.adoptiveFather) {
      adoptiveRelationships.push({
        child: member.id,
        adoptiveFather: member.adoptiveFather
      })
    }
  })

  // 创建节点位置映射，用于绘制过继关系
  const nodePositionMap = new Map()
  treeData.descendants().forEach(node => {
    nodePositionMap.set(node.data.id, {
      x: node.y, // 水平位置
      y: node.x  // 垂直位置
    })
  })
  
  // 确保所有过继关系中的成员都有位置
  adoptiveRelationships.forEach(rel => {
    // 确保被过继人有位置
    if (!nodePositionMap.has(rel.child)) {
      nodePositionMap.set(rel.child, {
        x: 100, // 默认水平位置
        y: 100  // 默认垂直位置
      })
    }
    
    // 确保过继人有位置
    if (!nodePositionMap.has(rel.adoptiveFather)) {
      nodePositionMap.set(rel.adoptiveFather, {
        x: 200, // 默认水平位置
        y: 100  // 默认垂直位置
      })
    }
  })

  // 绘制连接线
  svg += `<g class="family-tree-links">`
  // 绘制亲生关系连线
  treeData.links().forEach(link => {
    // 绘制从父节点到子节点的连线，水平布局
    const path = `M${link.source.y},${link.source.x} C${(link.source.y + link.target.y) / 2},${link.source.x} ${(link.source.y + link.target.y) / 2},${link.target.x} ${link.target.y},${link.target.x}`
    svg += `<path d="${path}" fill="none" stroke="#666" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />`
  })
  
  // 绘制过继关系连线（虚线箭头）
  adoptiveRelationships.forEach(rel => {
    const childPos = nodePositionMap.get(rel.child)
    const adoptiveFatherPos = nodePositionMap.get(rel.adoptiveFather)
    
    if (childPos && adoptiveFatherPos) {
      // 计算矩形的半宽和半高
      const nodeHalfWidth = 75 // 矩形半宽
      const nodeHalfHeight = 30 // 矩形半高
      
      // 对于水平树形布局：
      // - 被过继人：箭头从其矩形右边缘出发
      // - 过继人：箭头指向其矩形右边缘
      // 被过继人矩形的右边缘
      const startX = childPos.x + nodeHalfWidth
      const startY = childPos.y
      
      // 过继人矩形的右边缘（箭头准确指向这里）
      const endX = adoptiveFatherPos.x + nodeHalfWidth
      const endY = adoptiveFatherPos.y
      
      // 绘制从被过继人矩形边缘到过继人矩形边缘的虚线箭头
      const path = `M${startX},${startY} C${(startX + endX) / 2},${startY} ${(startX + endX) / 2},${endY} ${endX},${endY}`
      svg += `<path d="${path}" fill="none" stroke="#999" stroke-width="1.5" stroke-dasharray="5,5" stroke-linejoin="round" stroke-linecap="round" marker-end="url(#arrowhead)" />`
    }
  })
  svg += `</g>`
  
  // 绘制节点
  svg += `<g class="family-tree-nodes">`
  treeData.descendants().forEach(node => {
    const member = node.data
    
    // 计算节点位置
    const x = node.y - nodeWidth / 2
    const y = node.x - nodeHeight / 2
    
    // 节点样式
    const isEmperor = member.isEmperor
    const borderColor = isEmperor ? (member.emperorColor || '#ff0000') : '#333' // 皇帝边框改为红色
    const borderWidth = isEmperor ? '3' : '1'
    
    // 悬停提示信息
    let tooltip = ''
    
    // 如果数据中有排行信息，则显示第几子
    if (member.rank) {
      tooltip += `第${member.rank}子\n`
    }
    
    // 拼接其他信息
    tooltip += `姓名: ${member.realName}\n封号: ${member.title}\n生卒年: ${member.birthYear ? (member.birthYear < 0 ? `公元前${Math.abs(member.birthYear)}年` : `${member.birthYear}年`) : '未知'} - ${member.deathYear ? (member.deathYear < 0 ? `公元前${Math.abs(member.deathYear)}年` : `${member.deathYear}年`) : '未知'}`
    
    // 绘制节点组
    svg += `<g class="family-tree-node" transform="translate(${x},${y})"><title>${tooltip}</title>`
    
    // 绘制节点矩形（固定大小，确保所有节点一致）
    svg += `<rect width="${nodeWidth}" height="${nodeHeight}" rx="8" fill="#f0f8ff" stroke="${borderColor}" stroke-width="${borderWidth}" />`
    
    // 皇帝皇冠图标
    if (isEmperor) {
      svg += `<text x="10" y="20" font-size="14" fill="#ff0000">👑</text>` // 皇冠图标颜色改为红色
    }
    
    // 绘制姓名和封号，确保垂直居中
    const nameFontSize = 14
    const titleFontSize = isEmperor ? 12 : 11
    
    // 计算文字位置，确保垂直居中
    const nameY = nodeHeight / 2 - 5 // 姓名垂直居中位置
    const titleY = isEmperor ? nodeHeight / 2 + 15 : nodeHeight / 2 + 15 // 封号垂直居中位置
    
    svg += `<text x="${nodeWidth / 2}" y="${nameY}" font-size="${nameFontSize}" font-weight="bold" text-anchor="middle" fill="#333" dominant-baseline="middle">${member.name}</text>`
    svg += `<text x="${nodeWidth / 2}" y="${titleY}" font-size="${titleFontSize}" text-anchor="middle" fill="#666" dominant-baseline="middle">${member.title}</text>`
    
    svg += `</g>`
  })
  svg += `</g>`
  
  svg += `</g>`
  svg += `</svg>`
  
  return svg
}


</script>

<template>
  <div class="chronicle-page">
    <div class="header">
      <button class="back-home-btn" @click="goBack" title="返回首页">⌂</button>
      <h1>皇朝年谱</h1>
      <div class="dynasty-selector">
        <select v-model="selectedDynasty" class="dynasty-dropdown">
          <option v-for="dynasty in dynastyData" :key="dynasty.name" :value="dynasty.name">
            {{ dynasty.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="content-area">
      <!-- 按朝代从上到下排列 -->
      <div class="dynasty-timeline">
        <!-- 每个朝代块 -->
        <div 
          v-for="(dynasty, index) in dynastyData" 
          :key="index"
          class="dynasty-block"
        >
          <!-- 朝代头部信息 -->
          <div class="dynasty-header">
            <h2>
              <span class="dynasty-name-link" @click="showFamilyTreePopup(dynasty)">{{ dynasty.name }}</span>
            </h2>
            <div class="dynasty-years">
              {{ dynasty.startYear < 0 ? `公元前${Math.abs(dynasty.startYear)}年` : `${dynasty.startYear}年` }} - 
              {{ dynasty.endYear < 0 ? `公元前${Math.abs(dynasty.endYear)}年` : `${dynasty.endYear}年` }}
            </div>
          </div>
          
          <!-- 帝王列表：每个帝王一行，分左中右三列 -->
          <div class="emperors-list">
            <div 
              v-for="(emperor, index) in dynasty.emperors" 
              :key="index"
              class="emperor-row"
            >
              <!-- 中间：皇帝信息 -->
              <div class="emperor-column">
                <div class="emperor-item">
                  <div class="emperor-title">
                    <strong>{{ emperor.name }}</strong>
                  </div>
                  <div class="emperor-real-name">
                    {{ emperor.realName }}
                  </div>
                  <div class="emperor-reign">
                    {{ formatYear(emperor.reignStart, true) }} - {{ formatYear(emperor.reignEnd, true) }}
                  </div>
                </div>
              </div>
              
              <!-- 右侧：事件列表 -->
              <div class="year-column">
                <div 
                  v-for="(event, index) in emperor.events" 
                  :key="index"
                  class="year-item"
                  :class="{ 'out-of-reign': !isEventInReignPeriod(event, emperor) }"
                >
                  <div class="event-time">
                    {{ formatEventTime(event) }} 
                    <span v-if="event.name" class="event-name">{{ event.name }}</span>
                  </div>
                  <div class="event-description">
                    {{ event.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 族谱弹出框 -->
  <div v-if="showFamilyTree" class="family-tree-popup-overlay" @click="closeFamilyTreePopup">
    <div class="family-tree-popup" @click.stop>
      <div class="popup-header">
        <h3>{{ currentDynasty?.name }}皇室族谱</h3>
        <button class="close-btn" @click="closeFamilyTreePopup">×</button>
      </div>
      <div class="popup-content">
        <div v-html="familyTreeSvg"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chronicle-page {
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.header {
  padding: 10px 10px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 10;
  height: 50px;
  box-sizing: border-box;
}

.dynasty-selector {
  display: flex;
  align-items: center;
}

.dynasty-dropdown {
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #333;
  cursor: pointer;
  min-width: 120px;
  transition: all 0.3s ease;
}

.dynasty-dropdown:hover {
  border-color: #4290ff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dynasty-dropdown:focus {
  outline: none;
  border-color: #4290ff;
  box-shadow: 0 0 0 2px rgba(66, 144, 255, 0.2);
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
  margin-left: 10px;
}

.back-home-btn:hover {
  background: #f5f5f5;
  color: #333;
  border-color: #ccc;
}

.header h1 {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
  letter-spacing: 1px;
}

.content-area {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

/* 朝代时间轴容器 */
.dynasty-timeline {
  width: 100%;
  margin: 0 auto;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 每个朝代块 */
.dynasty-block {
  margin-bottom: 30px;
  position: relative;
}

/* 朝代头部 */
.dynasty-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #4290ff;
  color: white;
  font-weight: bold;
}

.dynasty-header h2 {
  margin: 0;
  font-size: 18px;
  text-align: left;
}

/* 朝代名称超链接样式 */
.dynasty-name-link {
  cursor: pointer;
  color: #ffffff;
  text-decoration: underline;
  transition: all 0.3s ease;
}

.dynasty-name-link:hover {
  text-decoration: none;
}

/* 族谱弹出框样式 */
.family-tree-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  /* 移除overflow: auto，避免与内部滚动条冲突 */
}

.family-tree-popup {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 1400px;
  height: 90vh;
  /* 移除max-height，使用固定height */
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 8px 8px 0 0;
  flex-shrink: 0;
}

.popup-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #333;
}

.popup-content {
  overflow: auto;
  flex: 1;
  white-space: nowrap;
  /* 添加内边距避免内容被滚动条遮挡 */
  box-sizing: border-box;
}

.popup-content svg {
  display: block;
  width: auto;
  height: auto;
  max-width: none;
  max-height: none;
  overflow: visible;
}

.dynasty-header .dynasty-years {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  text-align: right;
}

/* 帝王列表 */
.emperors-list {
  display: flex;
  flex-direction: column;
}

/* 每个帝王行 */
.emperor-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 10px;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.emperor-row:hover {
  background-color: #fafafa;
}

.dynasty-marker {
  width: 10px;
  height: 10px;
  background: #3498db;
  border-radius: 50%;
  margin-left: 20px;
  position: relative;
}

/* 中间：皇帝列 */
.emperor-column {
  display: flex;
  align-items: center;
}

.emperor-item {
  background: #f8f9fa;
  border: 2px solid #3498db;
  border-radius: 6px;
  padding: 12px;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.emperor-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.emperor-real-name {
  font-size: 14px;
  color: #666;
  font-weight: normal;
}

.emperor-reign {
  font-size: 12px;
  color: #999;
  font-weight: normal;
}

.emperor-item:hover {
  background: #e3f2fd;
  transform: translateX(5px);
}

/* 右侧：纪年列 */
.year-column {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: column;
}

.year-item {
  background: #f0f8ff;
  border: 1px solid #add8e6;
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
  color: #555;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 超出皇帝在位时间的事件样式 */
.year-item.out-of-reign {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  color: #999;
}

.year-item.out-of-reign .event-time {
  color: #999;
}

.year-item.out-of-reign .event-name {
  color: #999;
}

.year-item.out-of-reign .event-description {
  color: #999;
}

.event-time {
  font-weight: bold;
  color: #333;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.event-name {
  color: #3498db;
  font-weight: normal;
}

.event-description {
  font-size: 13px;
  color: #666;
  text-align: left;
  line-height: 1.4;
}

.reign-period {
  text-align: center;
}

/* 最后一个朝代块 */
.dynasty-block:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dynasty-header,
  .emperor-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .dynasty-header h2,
  .dynasty-header .dynasty-years {
    grid-column: 1;
  }
  
  .dynasty-marker {
    display: none;
  }
}
</style>