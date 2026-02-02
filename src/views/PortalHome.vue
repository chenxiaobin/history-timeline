<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}
</script>

<template>
  <div class="portal-container">
    <div class="portal-content">
      <header class="portal-header">
        <h1>中华历史时空</h1>
        <p class="subtitle">探索文明的轨迹，触摸历史的温度</p>
      </header>

      <div class="modules-grid">
        <!-- 模块 1: 王朝经纬 -->
        <div class="module-card" @click="navigateTo('/timeline')">
          <div class="card-icon">📜</div>
          <div class="card-content">
            <h2>王朝经纬</h2>
            <p>全景式时间轴，纵览朝代更替、帝王世系与重大历史事件。</p>
          </div>
          <div class="card-arrow">→</div>
        </div>

        <!-- 模块 2: 历史切片 -->
        <div class="module-card" @click="navigateTo('/slice')">
          <div class="card-icon">🔍</div>
          <div class="card-content">
            <h2>历史切片</h2>
            <p>微观视角剖析关键历史断面，深度还原事件原貌与人物关系。</p>
          </div>
          <div class="card-arrow">→</div>
        </div>

        <!-- 模块 3: 皇朝年谱 -->
        <div class="module-card" @click="navigateTo('/dynasty-chronicle')">
          <div class="card-icon">📅</div>
          <div class="card-content">
            <h2>皇朝年谱</h2>
            <p>系统梳理各朝代帝王世系与重大事件，构建完整的历史时间线。</p>
          </div>
          <div class="card-arrow">→</div>
        </div>
      </div>
    </div>
    
    <footer class="portal-footer">
      <p>© 2024 History Timeline Project</p>
    </footer>
  </div>
</template>

<style scoped>
.portal-container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.portal-content {
  max-width: 1200px;
  width: 90%;
  padding: 40px;
}

.portal-header {
  text-align: center;
  margin-bottom: 60px;
}

.portal-header h1 {
  font-size: 3.5rem;
  color: #2c3e50;
  margin-bottom: 16px;
  letter-spacing: 4px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
  font-size: 1.2rem;
  color: #5f6c7b;
  font-weight: 300;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  justify-content: center;
}

.module-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid rgba(255,255,255,0.5);
}

.module-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}

.module-card:not(.placeholder):hover {
  background: linear-gradient(to bottom right, #ffffff, #f8f9fa);
  border-color: #3498db;
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.module-card:hover .card-icon {
  transform: scale(1.1);
}

.card-content h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 12px;
}

.card-content p {
  color: #7f8c8d;
  line-height: 1.6;
  font-size: 0.95rem;
}

.card-arrow {
  margin-top: 20px;
  font-size: 1.5rem;
  color: #3498db;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.module-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
}

.tag-coming-soon {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #95a5a6;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
}

.module-card.placeholder {
  cursor: default;
  opacity: 0.7;
  background: rgba(255,255,255,0.5);
  border: 2px dashed #dcdcdc;
  box-shadow: none;
}

.module-card.placeholder:hover {
  transform: none;
  border-color: #bdc3c7;
}

.portal-footer {
  margin-top: auto;
  padding: 20px;
  color: #95a5a6;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .portal-header h1 {
    font-size: 2.5rem;
  }
  
  .modules-grid {
    grid-template-columns: 1fr;
  }
}
</style>