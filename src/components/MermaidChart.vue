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
    } catch (error) {
      console.error('Mermaid render error:', error)
      containerRef.value.innerHTML = `<div class="error">图表渲染失败: ${error.message}</div>`
    }
  }
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
