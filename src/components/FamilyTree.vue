<script setup>
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'

// 接收props
const props = defineProps({
  dynastyName: {
    type: String,
    required: true
  },
  royalFamilyTree: {
    type: Object,
    required: true
  },
  width: {
    type: Number,
    default: 1600
  },
  height: {
    type: Number,
    default: 800
  }
})

// SVG元素引用
const svgRef = ref(null)

// 家族树数据
const treeData = ref(null)
const nodeWidth = 180
const nodeHeight = 60
const margin = { top: 50, right: 50, bottom: 50, left: 100 }

// 构建层次数据结构
const buildHierarchy = (members) => {
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

// 生成家族树数据
const generateTreeData = () => {
  const familyTree = props.royalFamilyTree[props.dynastyName]
  if (!familyTree) return null
  
  const members = familyTree.members
  const root = buildHierarchy(members)
  if (!root) return null
  
  // 创建水平方向的tree布局，使用nodeSize控制节点间距
  const treeLayout = d3.tree()
    .nodeSize([60, 300]) // [垂直间距, 水平间距]
    .separation((a, b) => (a.parent === b.parent ? 1.2 : 2)) // 增加节点间距
  
  // 生成层次数据
  const hierarchy = d3.hierarchy(root)
  const tree = treeLayout(hierarchy)
  
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

  return {
    tree,
    members,
    adoptiveRelationships
  }
}

// 计算节点边界
const calculateNodeBounds = (tree) => {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  
  tree.descendants().forEach(node => {
    const x = node.y
    const y = node.x
    
    minX = Math.min(minX, x - nodeWidth / 2)
    maxX = Math.max(maxX, x + nodeWidth / 2)
    minY = Math.min(minY, y - nodeHeight / 2)
    maxY = Math.max(maxY, y + nodeHeight / 2)
  })
  
  return { minX, maxX, minY, maxY }
}

// 绘制家族树
const drawFamilyTree = () => {
  if (!svgRef.value) return
  
  const data = generateTreeData()
  if (!data) return
  
  const { tree, members, adoptiveRelationships } = data
  const { minX, maxX, minY, maxY } = calculateNodeBounds(tree)
  
  // 清除现有内容
  d3.select(svgRef.value).selectAll('*').remove()
  
  // 创建SVG和分组
  const svg = d3.select(svgRef.value)
    .attr('width', props.width)
    .attr('height', props.height)
    .attr('viewBox', `0 0 ${props.width} ${props.height}`)
    .attr('xmlns', 'http://www.w3.org/2000/svg')
  
  // 定义箭头标记
  svg.append('defs')
    .append('marker')
    .attr('id', 'arrowhead')
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('markerWidth', 10)
    .attr('markerHeight', 6)
    .attr('refX', 9)
    .attr('refY', 3)
    .attr('orient', 'auto')
    .append('polygon')
    .attr('points', '0 0, 10 3, 0 6')
    .attr('fill', '#999')
    .attr('stroke', '#999')
    .attr('stroke-width', 0.5)
  
  // 计算内容的中心点，将家族树居中显示在SVG中
  const contentWidthActual = maxX - minX
  const contentHeightActual = maxY - minY
  
  // 计算居中偏移量
  const centerOffsetX = (props.width - contentWidthActual - margin.left - margin.right) / 2 + margin.left
  const centerOffsetY = (props.height - contentHeightActual - margin.top - margin.bottom) / 2 + margin.top
  
  // 创建缩放行为
  const zoom = d3.zoom()
    .scaleExtent([0.1, 3]) // 缩放范围
    .on('zoom', (event) => {
      g.attr('transform', event.transform)
    })
  
  // 应用缩放行为
  svg.call(zoom)
  
  // 创建主分组
  const g = svg.append('g')
    .attr('transform', `translate(${centerOffsetX - minX}, ${centerOffsetY - minY})`)
  
  // 创建节点位置映射，用于绘制过继关系
  const nodePositionMap = new Map()
  tree.descendants().forEach(node => {
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
  const linksGroup = g.append('g').attr('class', 'family-tree-links')
  
  // 绘制亲生关系连线
  linksGroup.selectAll('.link')
    .data(tree.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', (d) => {
      // 绘制从父节点到子节点的连线，水平布局
      const path = `M${d.source.y},${d.source.x} C${(d.source.y + d.target.y) / 2},${d.source.x} ${(d.source.y + d.target.y) / 2},${d.target.x} ${d.target.y},${d.target.x}`
      return path
    })
    .attr('fill', 'none')
    .attr('stroke', '#666')
    .attr('stroke-width', 1.5)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
  
  // 绘制过继关系连线（虚线箭头）
  linksGroup.selectAll('.adoptive-link')
    .data(adoptiveRelationships)
    .enter()
    .append('path')
    .attr('class', 'adoptive-link')
    .attr('d', (d) => {
      const childPos = nodePositionMap.get(d.child)
      const adoptiveFatherPos = nodePositionMap.get(d.adoptiveFather)
      
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
        return path
      }
      return ''
    })
    .attr('fill', 'none')
    .attr('stroke', '#999')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '5,5')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('marker-end', 'url(#arrowhead)')
  
  // 绘制节点
  const nodesGroup = g.append('g').attr('class', 'family-tree-nodes')
  
  const nodes = nodesGroup.selectAll('.family-tree-node')
    .data(tree.descendants())
    .enter()
    .append('g')
    .attr('class', 'family-tree-node')
    .attr('transform', (d) => {
      const x = d.y - nodeWidth / 2
      const y = d.x - nodeHeight / 2
      return `translate(${x},${y})`
    })
  
  // 绘制节点矩形
  nodes.append('rect')
    .attr('width', nodeWidth)
    .attr('height', nodeHeight)
    .attr('rx', 8)
    .attr('fill', '#f0f8ff')
    .attr('stroke', (d) => {
      const isEmperor = d.data.isEmperor
      return isEmperor ? (d.data.emperorColor || '#ff0000') : '#333'
    })
    .attr('stroke-width', (d) => {
      return d.data.isEmperor ? '3' : '1'
    })
  
  // 皇帝皇冠图标
  nodes.filter((d) => d.data.isEmperor)
    .append('text')
    .attr('x', 10)
    .attr('y', 20)
    .attr('font-size', 14)
    .attr('fill', '#ff0000')
    .text('👑')
  
  // 绘制姓名
  nodes.append('text')
    .attr('x', nodeWidth / 2)
    .attr('y', nodeHeight / 2 - 5)
    .attr('font-size', 14)
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .attr('fill', '#333')
    .attr('dominant-baseline', 'middle')
    .text((d) => d.data.name)
  
  // 绘制封号
  nodes.append('text')
    .attr('x', nodeWidth / 2)
    .attr('y', nodeHeight / 2 + 15)
    .attr('font-size', (d) => d.data.isEmperor ? 12 : 11)
    .attr('text-anchor', 'middle')
    .attr('fill', '#666')
    .attr('dominant-baseline', 'middle')
    .text((d) => d.data.title)
  
  // 添加悬停提示
  nodes.append('title')
    .text((d) => {
      const member = d.data
      let tooltip = ''
      
      // 如果数据中有排行信息，则显示第几子
      if (member.rank) {
        tooltip += `第${member.rank}子\n`
      }
      
      // 拼接其他信息
      tooltip += `姓名: ${member.realName}\n封号: ${member.title}\n生卒年: ${member.birthYear ? (member.birthYear < 0 ? `公元前${Math.abs(member.birthYear)}年` : `${member.birthYear}年`) : '未知'} - ${member.deathYear ? (member.deathYear < 0 ? `公元前${Math.abs(member.deathYear)}年` : `${member.deathYear}年`) : '未知'}`
      
      return tooltip
    })
  
  // 计算合适的初始缩放比例，确保全部内容可见
  const contentWidth = maxX - minX + margin.left + margin.right
  const contentHeight = maxY - minY + margin.top + margin.bottom
  
  const scaleX = props.width / contentWidth
  const scaleY = props.height / contentHeight
  const initialScale = Math.min(scaleX, scaleY, 1) // 不超过原始大小
  
  // 计算内容的中心点
  const contentCenterX = (minX + maxX) / 2
  const contentCenterY = (minY + maxY) / 2
  
  // 计算画布的中心点
  const canvasCenterX = props.width / 2
  const canvasCenterY = props.height / 2
  
  // 计算初始平移，确保缩放后的内容居中显示
  const initialTranslateX = canvasCenterX - (contentCenterX * initialScale)
  const initialTranslateY = canvasCenterY - (contentCenterY * initialScale)
  
  // 应用初始缩放和平移
  const initialTransform = d3.zoomIdentity
    .translate(initialTranslateX, initialTranslateY)
    .scale(initialScale)
  
  svg.transition().duration(750).call(
    zoom.transform, 
    initialTransform
  )
}

// 监听数据变化
watch(() => props.dynastyName, () => {
  drawFamilyTree()
})

// 监听尺寸变化
watch([() => props.width, () => props.height], () => {
  drawFamilyTree()
})

// 组件挂载后绘制
onMounted(() => {
  drawFamilyTree()
})
</script>

<template>
  <div class="family-tree-container">
    <svg ref="svgRef"></svg>
  </div>
</template>

<style scoped>
.family-tree-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: move; /* 显示可移动光标 */
}

/* 修复Firefox中SVG元素的鼠标事件问题 */
:deep(svg) {
  width: 100%;
  height: 100%;
}
</style>