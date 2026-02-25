<script setup>
// 历史女性数据结构示例
const womenData = [
  {
    id: 'wu-zetian',
    name: '武则天',
    period: '唐朝',
    birthYear: 624,
    deathYear: 705,
    title: '中国历史上唯一的女皇帝',
    description: '武则天是中国历史上唯一的正统女皇帝，她在位期间政治清明，经济发展，文化繁荣。'
  },
  {
    id: 'ban-zhou',
    name: '班昭',
    period: '东汉',
    birthYear: 49,
    deathYear: 120,
    title: '女史学家、文学家',
    description: '班昭是东汉著名的女史学家和文学家，她续写了《汉书》，并著有《女诫》等作品。'
  },
  {
    id: 'yang-guifei',
    name: '杨贵妃',
    period: '唐朝',
    birthYear: 719,
    deathYear: 756,
    title: '四大美女之一',
    description: '杨贵妃是中国古代四大美女之一，她的美貌和悲惨命运成为了许多文学作品的题材。'
  },
  {
    id: 'cao-cao-daughter',
    name: '蔡文姬',
    period: '东汉末年',
    birthYear: 177,
    deathYear: 249,
    title: '女诗人、音乐家',
    description: '蔡文姬是东汉末年著名的女诗人和音乐家，她的《悲愤诗》和《胡笳十八拍》流传千古。'
  }
]
</script>

<template>
  <div class="women-in-history-container">
    <header class="page-header">
      <h1>红颜青史</h1>
      <p>讲述历史上杰出女性的故事，无论功过是非，都在历史长河中留下印记</p>
    </header>
    
    <main class="content-area">
      <div class="filter-section">
        <h2>筛选条件</h2>
        <div class="filter-options">
          <div class="filter-group">
            <label>朝代筛选</label>
            <select class="filter-select">
              <option value="all">全部朝代</option>
              <option value="tang">唐朝</option>
              <option value="song">宋朝</option>
              <option value="ming">明朝</option>
              <option value="qing">清朝</option>
            </select>
          </div>
          <div class="filter-group">
            <label>类型筛选</label>
            <select class="filter-select">
              <option value="all">全部类型</option>
              <option value="politics">政治人物</option>
              <option value="literature">文学艺术</option>
              <option value="military">军事人物</option>
              <option value="legendary">传奇人物</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="women-grid">
        <div 
          v-for="woman in womenData" 
          :key="woman.id" 
          class="woman-card"
        >
          <div class="card-header">
            <h3>{{ woman.name }}</h3>
            <span class="period-tag">{{ woman.period }}</span>
          </div>
          <div class="card-body">
            <div class="life-span">
              <span>{{ woman.birthYear }} - {{ woman.deathYear }}</span>
            </div>
            <h4 class="title">{{ woman.title }}</h4>
            <p class="description">{{ woman.description }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.women-in-history-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.page-header p {
  font-size: 1.1rem;
  color: #5f6c7b;
  font-weight: 300;
}

.content-area {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.filter-section {
  margin-bottom: 40px;
}

.filter-section h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #34495e;
}

.filter-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
}

.women-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.woman-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.woman-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-header h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0;
}

.period-tag {
  background: #e74c3c;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.life-span {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.title {
  font-size: 1.1rem;
  color: #3498db;
  margin-bottom: 12px;
}

.description {
  color: #555;
  line-height: 1.6;
  font-size: 0.95rem;
}
</style>