<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import mermaid from 'mermaid'

const props = defineProps({
  code: {
    type: String,
    required: true
  }
})

const containerRef = ref(null)

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true
  }
})

const renderChart = async () => {
  if (containerRef.value && props.code) {
    try {
      // 清空容器
      containerRef.value.innerHTML = ''

      // 生成唯一的 ID
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`

      // 渲染
      const { svg } = await mermaid.render(id, props.code)
      containerRef.value.innerHTML = svg

      // 添加自定义tooltip支持
      addCustomTooltips()
    } catch (error) {
      console.error('Mermaid render error:', error)
      containerRef.value.innerHTML = `<div class="error">图表渲染失败: ${error.message}</div>`
    }
  }
}

// 添加自定义tooltip
const addCustomTooltips = () => {
  if (!containerRef.value) return

  // 查找所有带有title属性的元素
  const elementsWithTitle = containerRef.value.querySelectorAll('[title]')
  
  elementsWithTitle.forEach(element => {
    // 移除默认title属性，避免浏览器默认tooltip
    const tooltipText = element.getAttribute('title')
    element.removeAttribute('title')
    
    if (tooltipText) {
      // 创建自定义tooltip元素
      const tooltip = document.createElement('div')
      tooltip.className = 'custom-tooltip'
      tooltip.textContent = tooltipText
      tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
        max-width: 300px;
        word-wrap: break-word;
      `
      
      // 添加到容器
      containerRef.value.appendChild(tooltip)
      
      // 鼠标悬停事件
      element.addEventListener('mouseenter', (e) => {
        // 计算tooltip位置，靠近鼠标当前位置
        const containerRect = containerRef.value.getBoundingClientRect()
        
        tooltip.style.left = `${e.clientX - containerRect.left}px`
        tooltip.style.top = `${e.clientY - containerRect.top - tooltip.offsetHeight - 5}px`
        tooltip.style.transform = 'translateX(-50%)'
        tooltip.style.opacity = '1'
      })
      
      // 鼠标离开事件
      element.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0'
      })
      
      // 鼠标移动事件（跟随鼠标）
      element.addEventListener('mousemove', (e) => {
        const containerRect = containerRef.value.getBoundingClientRect()
        
        tooltip.style.left = `${e.clientX - containerRect.left}px`
        tooltip.style.top = `${e.clientY - containerRect.top - tooltip.offsetHeight - 5}px`
        tooltip.style.transform = 'translateX(-50%)'
      })
    }
  })
}

onMounted(() => {
  nextTick(() => {
    renderChart()
  })
})

watch(
  () => props.code,
  () => {
    renderChart()
  }
)
</script>

<template>
  <div ref="containerRef" class="mermaid-chart"></div>
</template>

<style scoped>
.mermaid-chart {
  width: 100%;
  overflow-x: auto;
  display: flex;
  justify-content: center;
}

:deep(.error) {
  color: red;
  padding: 20px;
  border: 1px solid red;
  border-radius: 4px;
}
</style>
