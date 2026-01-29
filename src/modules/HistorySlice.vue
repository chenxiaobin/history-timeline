<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="slice-container">
    <div class="content">
      <div class="icon">🔍</div>
      <h1>历史切片</h1>
      <p class="desc">功能开发中，敬请期待...</p>
      <button @click="goBack" class="back-btn">返回首页</button>
    </div>
  </div>
</template>

<style scoped>
.slice-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  color: #333;
}

.content {
  text-align: center;
  background: white;
  padding: 60px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.icon {
  font-size: 5rem;
  margin-bottom: 20px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 15px;
  color: #2c3e50;
}

.desc {
  color: #7f8c8d;
  margin-bottom: 30px;
}

.back-btn {
  padding: 10px 25px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.back-btn:hover {
  background: #2980b9;
}
</style>