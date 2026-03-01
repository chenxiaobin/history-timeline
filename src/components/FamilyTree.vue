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

const nodeWidth = 180
const nodeHeight = 60
const margin = { top: 50, right: 50, bottom: 50, left: 100 }

// 构建层次数据结构
const buildHierarchy = (members) => {
  const nodeMap = new Map()
  const spouseNodes = new Map()
  
  // 创建所有节点
  members.forEach(member => {
    if (!member.isSpouseOnly) {
      nodeMap.set(member.id, {
        ...member,
        children: [],
        spouse: member.spouse || null
      })
    } else {
      spouseNodes.set(member.id, {
        ...member,
        isSpouseNode: true  // 添加配偶节点标记
      })
    }
  })
  
  // 构建父子关系
  let rootNode = null
  members.forEach(member => {
    // 跳过配偶节点
    if (member.isSpouseOnly) return
    
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
  
  // 将配偶添加为丈夫的第一个子节点
  members.forEach(member => {
    // 跳过配偶节点
    if (member.isSpouseOnly) return
    
    if (member.spouse) {
      const husbandNode = nodeMap.get(member.id)
      const spouseNode = spouseNodes.get(member.spouse)
      
      if (husbandNode && spouseNode) {
        // 将配偶节点作为第一个子节点插入
        husbandNode.children.unshift(spouseNode)
      }
    }
  })
  
  // 对所有节点的children数组按照rank字段进行升序排序
  nodeMap.forEach(node => {
    if (node.children.length > 0) {
      // 排序时忽略配偶节点（已经在第一个位置）
      const spouseChild = node.children.find(child => child.isSpouseNode)
      const otherChildren = node.children.filter(child => !child.isSpouseNode)
      
      // 对其他子节点按rank排序
      otherChildren.sort((a, b) => {
        // 如果rank不存在，将其视为0
        const rankA = a.rank || 0
        const rankB = b.rank || 0
        return rankA - rankB
      })
      
      // 重新组合children数组，配偶节点始终在第一位
      if (spouseChild) {
        node.children = [spouseChild, ...otherChildren]
      } else {
        node.children = otherChildren
      }
    }
  })
  
  return {
    root: rootNode,
    spouseNodes
  }
}

// 生成家族树数据
const generateTreeData = () => {
  const familyTree = props.royalFamilyTree[props.dynastyName]
  if (!familyTree) return null
  
  const members = familyTree.members
  const { root: hierarchyRoot, spouseNodes } = buildHierarchy(members)
  if (!hierarchyRoot) return null
  
  // 创建水平方向的tree布局，使用nodeSize控制节点间距
  const treeLayout = d3.tree()
    .nodeSize([60, 300]) // [垂直间距, 水平间距]
    .separation((a, b) => (a.parent === b.parent ? 1.2 : 2)) // 增加节点间距
  
  // 生成层次数据
  const hierarchy = d3.hierarchy(hierarchyRoot)
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
  
  // 收集配偶关系
  const spouseRelationships = []
  members.forEach(member => {
    if (member.spouse) {
      spouseRelationships.push({
        person: member.id,
        spouse: member.spouse
      })
    }
  })

  return {
    tree,
    members,
    adoptiveRelationships,
    spouseRelationships,
    spouseNodes
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
  
  const { tree, members, adoptiveRelationships, spouseRelationships, spouseNodes } = data
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
    .attr('fill', '#f00')
    .attr('stroke', '#f00')
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
      // 计算节点宽度的一半
      const halfNodeWidth = nodeWidth / 2
      
      let sourceX, targetX
      const sourceY = d.source.x
      const targetY = d.target.x
      
      // 根据节点位置自动判断连线方向
      if (d.source.y < d.target.y) {
        // 从左到右：父节点右侧中点 → 子节点左侧中点
        sourceX = d.source.y + halfNodeWidth
        targetX = d.target.y - halfNodeWidth
      } else {
        // 从右到左：父节点左侧中点 → 子节点右侧中点
        sourceX = d.source.y - halfNodeWidth
        targetX = d.target.y + halfNodeWidth
      }
      
      // 绘制曲线
      const path = `M${sourceX},${sourceY} C${(sourceX + targetX) / 2},${sourceY} ${(sourceX + targetX) / 2},${targetY} ${targetX},${targetY}`
      return path
    })
    .attr('fill', 'none')
    .attr('stroke', (d) => {
      // 如果目标节点是配偶节点，连线颜色为红色
      return d.target.data.isSpouseNode ? '#f00' : '#666'
    })
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
        // 计算节点宽度的一半
        const halfNodeWidth = nodeWidth / 2
        
        let sourceX, targetX
        const sourceY = childPos.y
        const targetY = adoptiveFatherPos.y
        
        // 根据节点位置自动判断连线方向
        if (childPos.x < adoptiveFatherPos.x) {
          // 从左到右：子节点右侧中点 → 父节点左侧中点
          sourceX = childPos.x + halfNodeWidth
          targetX = adoptiveFatherPos.x - halfNodeWidth
        } else {
          // 从右到左：子节点左侧中点 → 父节点右侧中点
          sourceX = childPos.x - halfNodeWidth
          targetX = adoptiveFatherPos.x + halfNodeWidth
        }
        
        // 绘制曲线
        const path = `M${sourceX},${sourceY} C${(sourceX + targetX) / 2},${sourceY} ${(sourceX + targetX) / 2},${targetY} ${targetX},${targetY}`
        return path
      }
      return ''
    })
    .attr('fill', 'none')
    .attr('stroke', '#f00')
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
    .attr('fill', (d) => {
      // 临朝称制的节点使用浅红色背景
      if (d.data.title && d.data.title.includes('临朝称制')) {
        return '#ffecec' // 浅红色
      }
      return '#f0f8ff' // 默认浅蓝色
    })
    .attr('stroke', (d) => {
      if (d.data.isSpouseNode) {
        return '#f00' // 配偶节点边框为红色
      }
      const isEmperor = d.data.isEmperor
      return isEmperor ? (d.data.emperorColor || '#FF8433') : '#333'
    })
    .attr('stroke-width', (d) => {
      if (d.data.isSpouseNode) {
        return '3' // 配偶节点边框宽度
      }
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
  
  // 皇后王冠图标（临朝称制的配偶）
  nodes.filter((d) => d.data.isSpouseNode)
    .append('text')
    .attr('x', 10)
    .attr('y', 20)
    .attr('font-size', 14)
    .attr('fill', '#FFD700') // 使用金色区分
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
  
  // 配偶节点现在作为丈夫的子节点处理，不再需要单独绘制
  
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