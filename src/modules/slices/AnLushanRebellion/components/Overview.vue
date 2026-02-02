<script setup>
import { ref, onMounted, nextTick } from 'vue';

// 自定义tooltip容器引用
const tooltipContainer = ref(null);

// 添加自定义tooltip
const addCustomTooltips = () => {
  if (!tooltipContainer.value) return;

  // 查找所有带有data-tooltip属性的元素
  const itemsWithTooltip = document.querySelectorAll('[data-tooltip]');
  
  itemsWithTooltip.forEach(element => {
    // 获取tooltip文本
    const tooltipText = element.getAttribute('data-tooltip');
    
    if (tooltipText) {
      // 创建自定义tooltip元素
      const tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      tooltip.textContent = tooltipText;
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
      `;
      
      // 添加到容器
      tooltipContainer.value.appendChild(tooltip);
      
      // 鼠标悬停事件
      element.addEventListener('mouseenter', (e) => {
        const containerRect = tooltipContainer.value.getBoundingClientRect();
        
        tooltip.style.left = `${e.clientX - containerRect.left}px`;
        tooltip.style.top = `${e.clientY - containerRect.top - tooltip.offsetHeight - 5}px`;
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.opacity = '1';
      });
      
      // 鼠标离开事件
      element.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
      });
      
      // 鼠标移动事件（跟随鼠标）
      element.addEventListener('mousemove', (e) => {
        const containerRect = tooltipContainer.value.getBoundingClientRect();
        
        tooltip.style.left = `${e.clientX - containerRect.left}px`;
        tooltip.style.top = `${e.clientY - containerRect.top - tooltip.offsetHeight - 5}px`;
        tooltip.style.transform = 'translateX(-50%)';
      });
    }
  });
};

// 页面挂载后添加tooltip
onMounted(() => {
  nextTick(() => {
    addCustomTooltips();
  });
});
</script>

<template>
  <div class="overview-container">
    <!-- 头部区域 -->
    <div class="header-area">
      <div class="title-block">
        <h2>安史之乱</h2>
        <span class="tag">755年 - 763年</span>
      </div>
      <p class="subtitle">
        唐朝中期由安禄山和史思明发动的大规模叛乱，是唐朝由盛转衰的转折点
      </p>
    </div>
    
    <!-- 自定义tooltip容器 -->
    <div ref="tooltipContainer" class="tooltip-container"></div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 核心信息卡片 -->
      <div class="core-info">
        <div class="info-card timeline-card">
          <div class="card-icon">📅</div>
          <div class="card-content">
            <h3>时间范围</h3>
            <p>755年12月16日 - 763年2月17日</p>
            <p class="duration">持续时间：7年2个月</p>
          </div>
        </div>
        
        <div class="info-card people-card">
          <div class="card-icon">👑</div>
          <div class="card-content">
            <h3>主要人物</h3>
            <div class="people-list">
              <span class="person-tag">安禄山</span>
              <span class="person-tag">史思明</span>
              <span class="person-tag">唐玄宗</span>
              <span class="person-tag">唐肃宗</span>
              <span class="person-tag">郭子仪</span>
              <span class="person-tag">李光弼</span>
            </div>
          </div>
        </div>
        
        <div class="info-card scope-card">
          <div class="card-icon">🌍</div>
          <div class="card-content">
            <h3>影响范围</h3>
            <p>河北、河南、陕西、山西等北方地区</p>
            <p class="impact">涉及今天的多个省份，影响人口达数千万</p>
          </div>
        </div>
      </div>

      <!-- 名词解释模块 -->
      <section class="glossary-section">
        <div class="section-header">
          <h3>名词解释</h3>
          <div class="decorative-line"></div>
        </div>
        
        <div class="glossary-grid">
          <div class="glossary-item" data-tooltip="均田制是中国古代北魏至唐前期实行的一种土地制度，政府将无主土地按人口分配给农民耕作，农民向政府缴纳赋税并承担徭役。">
            <span class="glossary-term">均田制</span>
          </div>
          <div class="glossary-item" data-tooltip="府兵制是中国古代西魏至唐前期实行的一种兵制，士兵平时务农，战时从军，兵农合一。">
            <span class="glossary-term">府兵制</span>
          </div>
          <div class="glossary-item" data-tooltip="募兵制是中国古代唐玄宗时期开始实行的一种兵制，政府以雇佣方式招募士兵，士兵成为职业军人，由国家供给衣食。">
            <span class="glossary-term">募兵制</span>
          </div>
          <div class="glossary-item" data-tooltip="节度使是唐朝设立的地方军事长官，最初负责边防军事，后逐渐集军权、财权、行政权于一身，形成地方割据势力。">
            <span class="glossary-term">节度使</span>
          </div>
          <div class="glossary-item" data-tooltip="藩镇是唐朝中后期设立的地方行政区划，由节度使管辖，拥有独立的军事、财政和行政权力。">
            <span class="glossary-term">藩镇</span>
          </div>
          <div class="glossary-item" data-tooltip="胡将是指唐朝时期担任军事将领的少数民族将领，如安禄山、史思明等。">
            <span class="glossary-term">胡将</span>
          </div>
        </div>
      </section>

      <!-- 事件背景与过程 -->
      <section class="background-section">
        <div class="section-header">
          <h3>事件背景与过程</h3>
          <div class="decorative-line"></div>
        </div>
        
        <div class="background-content">
          <div class="background-left">
            <h4>叛乱背景</h4>
            <ul class="background-list">
              <li>
                <span class="list-icon">🎯</span>
                <span class="list-text">节度使权力过大，集军权、财权、行政权于一身</span>
              </li>
              <li>
                <span class="list-icon">💀</span>
                <span class="list-text">中央政治腐败，唐玄宗后期沉迷享乐，朝政混乱</span>
              </li>
              <li>
                <span class="list-icon">⚖️</span>
                <span class="list-text">民族矛盾尖锐，胡人节度使与汉族官员关系紧张</span>
              </li>
              <li>
                <span class="list-icon">🌾</span>
                <span class="list-text">社会矛盾激化，土地兼并严重，<span class="glossary-link" data-tooltip="均田制是中国古代北魏至唐前期实行的一种土地制度，政府将无主土地按人口分配给农民耕作，农民向政府缴纳赋税并承担徭役。">均田制</span>瓦解</span>
              </li>
              <li>
                <span class="list-icon">🏛️</span>
                <span class="list-text">兵制变革，<span class="glossary-link" data-tooltip="府兵制是中国古代西魏至唐前期实行的一种兵制，士兵平时务农，战时从军，兵农合一。">府兵制</span>崩溃，<span class="glossary-link" data-tooltip="募兵制是中国古代唐玄宗时期开始实行的一种兵制，政府以雇佣方式招募士兵，士兵成为职业军人，由国家供给衣食。">募兵制</span>兴起，军队私有化</span>
              </li>
            </ul>
          </div>
          
          <div class="background-right">
            <h4>叛乱过程</h4>
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h5>范阳起兵</h5>
                  <p class="timeline-date">755年12月</p>
                  <p>安禄山以讨伐奸臣为名，率十五万大军南下</p>
                </div>
              </div>
              
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h5>攻占洛阳</h5>
                  <p class="timeline-date">756年1月</p>
                  <p>安禄山攻占洛阳，称大燕皇帝</p>
                </div>
              </div>
              
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h5>长安失守</h5>
                  <p class="timeline-date">756年6月</p>
                  <p>唐军兵败潼关，唐玄宗逃亡蜀地</p>
                </div>
              </div>
              
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h5>叛乱平定</h5>
                  <p class="timeline-date">763年2月</p>
                  <p>史朝义兵败自杀，安史之乱结束</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 历史影响与评价 -->
      <div class="combined-section">
        <!-- 历史影响 -->
        <section class="impact-section">
          <div class="section-header">
            <h3>历史影响</h3>
            <div class="decorative-line"></div>
          </div>
          
          <div class="impact-grid">
            <div class="impact-card decline-card">
              <h4>唐朝由盛转衰</h4>
              <p>叛乱使唐朝人口锐减，经济崩溃，西域控制丧失，边疆危机加剧</p>
            </div>
            
            <div class="impact-card separatism-card">
              <h4>藩镇割据形成</h4>
              <p>平叛过程中崛起的<span class="glossary-link" data-tooltip="节度使是唐朝设立的地方军事长官，最初负责边防军事，后逐渐集军权、财权、行政权于一身，形成地方割据势力。">节度使</span>形成新的割据势力，中央集权削弱</p>
            </div>
            
            <div class="impact-card economy-card">
              <h4>经济重心南移</h4>
              <p>北方遭战争破坏严重，人口大量南迁，促进了南方经济发展</p>
            </div>
            
            <div class="impact-card culture-card">
              <h4>文化艺术受创</h4>
              <p>战乱导致许多文化典籍损毁，文化艺术发展受到严重影响</p>
            </div>
          </div>
        </section>

        <!-- 历史评价 -->
        <section class="evaluation-section">
          <div class="section-header">
            <h3>历史评价</h3>
            <div class="decorative-line"></div>
          </div>
          
          <div class="evaluation-content">
            <div class="quote-card">
              <div class="quote-icon">"</div>
              <p class="quote-text">
                安史之乱是唐朝由盛转衰的转折点，它不仅导致了唐朝的衰落，也对中国历史的发展产生了深远的影响。
              </p>
              <div class="quote-author">— 历史学者评价</div>
            </div>
            
            <div class="key-lessons">
              <h4>历史教训</h4>
              <ul class="lessons-list">
                <li>中央集权与地方分权的平衡至关重要</li>
                <li>政治腐败是导致国家衰落的重要原因</li>
                <li>民族关系的和谐对国家稳定具有重要意义</li>
                <li>经济发展与社会公平是国家长治久安的基础</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overview-container {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  background: #f5f7fa;
}

/* 头部区域 */
.header-area {
  margin-bottom: 20px;
}

.title-block {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 8px;
}

.title-block h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #2c3e50;
}

.tag {
  background: #e74c3c;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
}

.subtitle {
  margin: 0;
  color: #7f8c8d;
  font-size: 1rem;
}

/* 核心信息卡片 */
.core-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.info-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.timeline-card {
  border-left: 4px solid #3498db;
}

.people-card {
  border-left: 4px solid #e74c3c;
}

.scope-card {
  border-left: 4px solid #27ae60;
}

.card-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.card-content h3 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 600;
}

.card-content p {
  margin: 0 0 8px 0;
  color: #555;
  line-height: 1.4;
  font-size: 0.9rem;
}

.duration, .impact {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-style: italic;
}

.people-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.person-tag {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #333;
}

/* 通用区块样式 */
section {
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
}

.section-header h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #2c3e50;
  font-weight: 600;
}

.decorative-line {
  display: none;
}

/* 名词解释模块 */
.glossary-section {
  margin-bottom: 20px;
}

.glossary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.glossary-item {
  background: #f0f8ff;
  padding: 12px 16px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e0f0ff;
}

.glossary-item:hover {
  background: #e0f0ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.glossary-term {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 600;
}

/* 文本内的名词链接 */
.glossary-link {
  color: #3498db;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-style: dotted;
}

.glossary-link:hover {
  color: #2980b9;
}

/* 自定义tooltip */
.tooltip-container {
  position: relative;
  z-index: 1000;
}

.custom-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  max-width: 300px;
  word-wrap: break-word;
  z-index: 1000;
}

/* 事件背景与过程 */
.background-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.background-left h4, .background-right h4 {
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 600;
}

.background-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.background-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.background-list li:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.list-icon {
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.list-text {
  color: #555;
  line-height: 1.4;
  font-size: 0.9rem;
}

/* 时间线 */
.timeline {
  position: relative;
  padding-left: 25px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #3498db;
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
}

.timeline-marker {
  position: absolute;
  left: -25px;
  top: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3498db;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #3498db;
}

.timeline-content {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.timeline-content h5 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 600;
}

.timeline-date {
  font-size: 0.85rem;
  color: #3498db;
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
}

.timeline-content p {
  margin: 0;
  color: #555;
  line-height: 1.4;
  font-size: 0.9rem;
}

/* 组合区域布局 */
.combined-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

/* 历史影响 */
.impact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.impact-card {
  background: #f9f9f9;
  border-radius: 6px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  border-top: 3px solid;
}

.impact-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.decline-card {
  border-top-color: #e74c3c;
}

.separatism-card {
  border-top-color: #9b59b6;
}

.economy-card {
  border-top-color: #27ae60;
}

.culture-card {
  border-top-color: #f39c12;
}

.impact-card h4 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 600;
}

.impact-card p {
  margin: 0;
  color: #555;
  line-height: 1.4;
  font-size: 0.9rem;
}

/* 历史评价 */
.evaluation-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.quote-card {
  background: #f9f9f9;
  border-radius: 6px;
  padding: 16px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.quote-icon {
  font-size: 2.5rem;
  color: #3498db;
  opacity: 0.3;
  position: absolute;
  top: 5px;
  left: 10px;
}

.quote-text {
  font-size: 0.9rem;
  color: #2c3e50;
  line-height: 1.4;
  font-style: italic;
  margin: 30px 0 15px 0;
  position: relative;
  z-index: 1;
}

.quote-author {
  text-align: right;
  color: #7f8c8d;
  font-size: 0.85rem;
}

.key-lessons h4 {
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 600;
}

.lessons-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.lessons-list li {
  padding: 12px 15px;
  background: #f9f9f9;
  border-radius: 6px;
  margin-bottom: 10px;
  color: #555;
  font-size: 0.9rem;
  line-height: 1.3;
  transition: all 0.2s ease;
}

.lessons-list li:hover {
  background: #f0f0f0;
  transform: translateX(3px);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .core-info {
    grid-template-columns: 1fr;
  }
  
  .info-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .background-content {
    grid-template-columns: 1fr;
  }
  
  .combined-section {
    grid-template-columns: 1fr;
  }
  
  .impact-grid {
    grid-template-columns: 1fr;
  }
  
  .evaluation-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .overview-container {
    padding: 15px;
  }
  
  .header-area {
    padding: 15px;
  }
  
  .title-block h2 {
    font-size: 1.5rem;
  }
  
  section {
    padding: 20px;
  }
  
  .card-icon {
    font-size: 2rem;
  }
  
  .info-card {
    padding: 20px;
  }
  
  .quote-card {
    padding: 20px;
  }
  
  .quote-text {
    font-size: 1rem;
  }
}
</style>