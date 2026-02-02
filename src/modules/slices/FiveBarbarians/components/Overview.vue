<template>
  <div class="overview-container">
    <!-- 头部区域 -->
    <div class="header-area">
      <div class="title-block">
        <h2>五胡乱华</h2>
        <span class="tag">304年 - 439年</span>
      </div>
      <p class="subtitle">
        西晋末年北方游牧民族趁乱建立政权，与南方汉人政权对峙的历史时期
      </p>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 基本信息表格 -->
      <section class="info-section">
        <div class="section-title">
          <span class="icon">📋</span>
          <h3>基本信息</h3>
        </div>
        <div class="info-table">
          <div class="info-row">
            <div class="info-cell">
              <span class="info-label">时间范围</span>
              <span class="info-value">约304年-439年</span>
            </div>
            <div class="info-cell">
              <span class="info-label">历史背景</span>
              <span class="info-value">西晋八王之乱后国力衰弱</span>
            </div>
            <div class="info-cell">
              <span class="info-label">主要民族</span>
              <span class="info-value">匈奴、鲜卑、羯、羌、氐</span>
            </div>
            <div class="info-cell">
              <span class="info-label">影响范围</span>
              <span class="info-value">中国北方地区</span>
            </div>
            <div class="info-cell">
              <span class="info-label">开始标志</span>
              <span class="info-value">304年刘渊建立汉赵政权</span>
            </div>
            <div class="info-cell">
              <span class="info-label">结束标志</span>
              <span class="info-value">439年北魏统一北方</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 事件分析区域 -->
      <section class="analysis-section">
        <div class="analysis-grid">
          <div class="analysis-card">
            <div class="card-header">
              <span class="icon">📜</span>
              <h3>历史背景</h3>
            </div>
            <div class="card-content">
              <p>
                <strong>直接原因：</strong>
                西晋八王之乱导致国力空虚，边防废弛。
              </p>
              <p>
                <strong>深层原因：</strong>
                魏晋时期北方游牧民族内迁，与汉族杂居，民族矛盾加剧。
              </p>
              <p>
                <strong>根本原因：</strong>
                西晋统治阶级腐败，社会矛盾尖锐。
              </p>
            </div>
          </div>

          <div class="analysis-card">
            <div class="card-header">
              <span class="icon">⚡</span>
              <h3>发展过程</h3>
            </div>
            <div class="card-content">
              <p>
                <strong>初期（304-317年）：</strong>
                刘渊建立汉赵，永嘉之乱，西晋灭亡，东晋建立。
              </p>
              <p>
                <strong>中期（317-383年）：</strong>
                各民族政权割据北方，前秦一度统一北方。
              </p>
              <p>
                <strong>后期（383-439年）：</strong>
                淝水之战后前秦崩溃，北魏逐渐崛起并统一北方。
              </p>
            </div>
          </div>

          <div class="analysis-card">
            <div class="card-header">
              <span class="icon">🌊</span>
              <h3>历史影响</h3>
            </div>
            <div class="card-content">
              <p>
                <strong>民族融合：</strong>
                促进了北方各民族的融合，为隋唐统一奠定了基础。
              </p>
              <p>
                <strong>文化交流：</strong>
                游牧文化与中原文化相互影响，丰富了中华文化。
              </p>
              <p>
                <strong>人口迁徙：</strong>
                大量汉族南迁，促进了江南地区的开发。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 主要政权区域 -->
      <section class="regimes-section">
        <div class="section-title">
          <span class="icon">🏛️</span>
          <h3>主要政权</h3>
        </div>
        <div class="regimes-table">
          <div class="regime-row">
            <div class="regime-cell">
              <h4>前赵（304年-329年）</h4>
              <div class="regime-info">
                <span class="ethnic-tag">匈奴族</span>
                <span class="regime-founder">建立者：刘渊</span>
              </div>
            </div>
            <div class="regime-cell">
              <h4>后赵（319年-351年）</h4>
              <div class="regime-info">
                <span class="ethnic-tag">羯族</span>
                <span class="regime-founder">建立者：石勒</span>
              </div>
            </div>
            <div class="regime-cell">
              <h4>前秦（351年-394年）</h4>
              <div class="regime-info">
                <span class="ethnic-tag">氐族</span>
                <span class="regime-founder">建立者：苻健</span>
              </div>
            </div>
            <div class="regime-cell">
              <h4>后秦（384年-417年）</h4>
              <div class="regime-info">
                <span class="ethnic-tag">羌族</span>
                <span class="regime-founder">建立者：姚苌</span>
              </div>
            </div>
            <div class="regime-cell">
              <h4>北魏（386年-534年）</h4>
              <div class="regime-info">
                <span class="ethnic-tag">鲜卑族</span>
                <span class="regime-founder">建立者：拓跋珪</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.overview-container {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}

/* 头部区域 */
.header-area {
  margin-bottom: 30px;
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

/* 主要内容区域 */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* 通用区块标题 */
.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
}

.section-title .icon {
  font-size: 1.2rem;
}

.section-title h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #2c3e50;
}

/* 基本信息表格 */
.info-section {
  padding: 0;
}

.info-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.info-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  border-bottom: 1px solid #f0f0f0;
}

.info-cell {
  padding: 16px;
  border-right: 1px solid #f0f0f0;
}

.info-cell:last-child {
  border-right: none;
}

.info-label {
  display: block;
  font-weight: 600;
  color: #555;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.info-value {
  display: block;
  color: #333;
  font-size: 1rem;
  line-height: 1.4;
}

/* 事件分析区域 */
.analysis-section {
  padding: 0;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.analysis-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s, box-shadow 0.2s;
}

.analysis-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
}

.card-header .icon {
  font-size: 1.3rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.card-content {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.6;
}

.card-content p {
  margin: 0 0 8px 0;
}

.card-content p:last-child {
  margin-bottom: 0;
}

.card-content strong {
  color: #333;
}

/* 主要政权区域 */
.regimes-section {
  padding: 0;
}

.regimes-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.regime-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border-bottom: 1px solid #f0f0f0;
}

.regime-cell {
  padding: 16px;
  border-right: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.regime-cell:last-child {
  border-right: none;
}

.regime-cell:hover {
  background-color: #f9f9f9;
}

.regime-cell h4 {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.regime-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ethnic-tag {
  background: #e3f2fd;
  color: #2980b9;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.85rem;
  align-self: flex-start;
}

.regime-founder {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .info-row {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .info-cell {
    border-bottom: 1px solid #f0f0f0;
  }
  
  .info-cell:nth-child(3n) {
    border-right: none;
  }
  
  .analysis-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .regime-row {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .regime-cell {
    border-bottom: 1px solid #f0f0f0;
  }
  
  .regime-cell:nth-child(3n) {
    border-right: none;
  }
}

@media (max-width: 768px) {
  .overview-container {
    padding: 15px;
  }
  
  .title-block h2 {
    font-size: 1.5rem;
  }
  
  .info-row {
    grid-template-columns: 1fr;
  }
  
  .info-cell {
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
  }
  
  .regime-row {
    grid-template-columns: 1fr;
  }
  
  .regime-cell {
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .section-title h3 {
    font-size: 1.2rem;
  }
}
</style>