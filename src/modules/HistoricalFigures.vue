<script setup>
// 历史人物数据结构示例
const historicalFigures = [
  {
    id: 'yue-fei',
    name: '岳飞',
    period: '南宋',
    birthYear: 1103,
    deathYear: 1142,
    type: '武将',
    title: '抗金名将',
    description: '岳飞是南宋著名的抗金将领，民族英雄，他率领岳家军抗击金兵，收复失地，精忠报国的精神传颂千古。'
  },
  {
    id: 'bao-zheng',
    name: '包拯',
    period: '北宋',
    birthYear: 999,
    deathYear: 1062,
    type: '文臣',
    title: '包青天',
    description: '包拯是北宋著名的清官，以铁面无私、公正执法著称，被称为"包青天"，成为中国古代清官的典范。'
  },
  {
    id: 'li-bai',
    name: '李白',
    period: '唐朝',
    birthYear: 701,
    deathYear: 762,
    type: '文人',
    title: '诗仙',
    description: '李白是唐代伟大的浪漫主义诗人，被誉为"诗仙"，他的诗歌豪放飘逸，充满想象力，对后世影响深远。'
  },
  {
    id: 'zhu-ge-liang',
    name: '诸葛亮',
    period: '三国',
    birthYear: 181,
    deathYear: 234,
    type: '文臣',
    title: '智圣',
    description: '诸葛亮是三国时期蜀汉的丞相，杰出的政治家、军事家、发明家，以智慧和忠诚著称，被誉为"智圣"。'
  },
  {
    id: 'guan-yu',
    name: '关羽',
    period: '三国',
    birthYear: 160,
    deathYear: 220,
    type: '武将',
    title: '武圣',
    description: '关羽是三国时期蜀汉的名将，以忠诚、义气和武艺高强著称，被后世尊为"武圣"，成为中国传统文化中的重要符号。'
  },
  {
    id: 'du-fu',
    name: '杜甫',
    period: '唐朝',
    birthYear: 712,
    deathYear: 770,
    type: '文人',
    title: '诗圣',
    description: '杜甫是唐代伟大的现实主义诗人，被誉为"诗圣"，他的诗歌反映了社会现实，被称为"诗史"。'
  }
]
</script>

<template>
  <div class="historical-figures-container">
    <header class="page-header">
      <h1>历史人物</h1>
      <p>汇聚武将、文臣、文人等各类历史人物，展现中华历史的人物群像</p>
    </header>
    
    <main class="content-area">
      <div class="category-tabs">
        <button class="tab-btn active">全部人物</button>
        <button class="tab-btn">武将</button>
        <button class="tab-btn">文臣</button>
        <button class="tab-btn">文人</button>
      </div>
      
      <div class="figures-grid">
        <div 
          v-for="figure in historicalFigures" 
          :key="figure.id" 
          class="figure-card"
          :class="figure.type"
        >
          <div class="card-badge">{{ figure.type }}</div>
          <div class="card-content">
            <h3 class="figure-name">{{ figure.name }}</h3>
            <div class="figure-period">{{ figure.period }}</div>
            <div class="figure-life">{{ figure.birthYear }} - {{ figure.deathYear }}</div>
            <h4 class="figure-title">{{ figure.title }}</h4>
            <p class="figure-description">{{ figure.description }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.historical-figures-container {
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

.category-tabs {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 35px;
}

.tab-btn {
  padding: 12px 25px;
  background: #ecf0f1;
  color: #34495e;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: #bdc3c7;
}

.tab-btn.active {
  background: #27ae60;
  color: white;
}

.figures-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

.figure-card {
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.figure-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.figure-card.武将 {
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
}

.figure-card.文臣 {
  background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
}

.figure-card.文人 {
  background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
}

.card-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255,255,255,0.9);
  color: #2c3e50;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
}

.card-content {
  color: #2c3e50;
}

.figure-name {
  font-size: 1.6rem;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.figure-period {
  background: rgba(255,255,255,0.8);
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.figure-life {
  font-size: 0.9rem;
  margin-bottom: 15px;
  opacity: 0.9;
}

.figure-title {
  font-size: 1.2rem;
  margin: 0 0 12px 0;
  font-style: italic;
}

.figure-description {
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.95;
}
</style>