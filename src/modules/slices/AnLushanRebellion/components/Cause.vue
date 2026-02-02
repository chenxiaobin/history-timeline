<script setup>
import MermaidChart from '../../../../components/MermaidChart.vue'

const chartCode = `flowchart TD;
    %% 样式定义
    classDef titleStyle fill:#e3f2fd,stroke:#3498db,stroke-width:2px,rx:5px,ry:5px,font-weight:bold;
    classDef causeStyle fill:#f3e5f5,stroke:#9c27b0,stroke-width:1px,rx:5px,ry:5px;
    classDef processStyle fill:#e8f5e8,stroke:#4caf50,stroke-width:1px,rx:5px,ry:5px;
    classDef eventStyle fill:#fff3e0,stroke:#ff9800,stroke-width:1px,rx:5px,ry:5px;
    classDef resultStyle fill:#e0f7fa,stroke:#00bcd4,stroke-width:1px,rx:5px,ry:5px;
    classDef keyNode fill:#ffebee,stroke:#f44336,stroke-width:1px,rx:5px,ry:5px;

    %% 顶层节点
    A[开元盛世<br>制度性矛盾积累]
    
    %% 三个主要分支
    %% 军事失衡分支
    B1[军事失衡]
    B11[府兵制瓦解]
    B12[募兵制兴起]
    B13[节度使权力膨胀<br>外重内轻，尾大不掉]
    
    %% 社会危机分支
    B3[社会危机]
    B31[均田制破坏]
    B32[土地兼并]
    B33[中央财政与控制力基础被侵蚀]
    
    %% 政治腐败分支
    B2[政治腐败]
    B21[李林甫专权<br>重用胡将，阻塞言路]
    B22[杨国忠乱政<br>激化矛盾]
    B23[中枢失能，决策混乱]
    
    %% 核心节点
    C5[关键人物：安禄山]
    C1[结构性火药桶]
    C2[杨国忠与安禄山<br>激烈纷争]
    C4[叛乱核心实力]
    C6[身兼三镇，掌控精兵]
    C3[积蓄力量<br>形成个人军事集团]
    
    %% 结果
    D[755年冬<br>安禄山于范阳起兵<br>安史之乱爆发]
    
    %% 关系连线
    A --> B1;
    A --> B3;
    A --> B2;
    
    B1 --> B11;
    B1 --> B12;
    B11 --> B13;
    B12 --> B13;
    B13 --> C5;
    B13 --> C1;
    
    B3 --> B31;
    B3 --> B32;
    B31 --> B33;
    B32 --> B33;
    B33 --> C1;
    
    B2 --> B21;
    B2 --> B22;
    B21 --> B23;
    B22 --> B23;
    B23 --> C1;
    B23 -- 直接引爆 --> C2;
    
    %% 子图：安禄山军事准备
    subgraph militaryPrep [安禄山军事准备]
        style militaryPrep fill:#e3f2fd,stroke:#3498db,stroke-width:1px,rx:5px,ry:5px,font-weight:bold;
        C6 & C3;
    end
    
    C1 --> D;
    C5 --> militaryPrep;
    militaryPrep --> C4;
    C2 --> D;
    C4 --> D;
    
    %% 应用样式
    class A titleStyle;
    class B1,B2,B3 causeStyle;
    class B11,B12,B13,B21,B22,B23,B31,B32,B33,C2,C3 processStyle;
    class C1,C4,C5 keyNode;
    class C6 processStyle;
    class D eventStyle;
`
</script>

<template>
  <div class="cause-container">
    
    <div class="cause-content">
      <!-- 直接原因 -->
      <div class="cause-section">
        <h3>直接原因</h3>
        <div class="cause-grid">
          <div class="cause-item">
            <div class="cause-icon">👑</div>
            <div class="cause-info">
              <h4>权力斗争</h4>
              <p>安禄山与宰相杨国忠之间的权力斗争日益激烈，杨国忠多次向唐玄宗进谗言，声称安禄山谋反。</p>
            </div>
          </div>
          <div class="cause-item">
            <div class="cause-icon">🛡️</div>
            <div class="cause-info">
              <h4>节度使权力膨胀</h4>
              <p>安禄山身兼范阳、平卢、河东三镇节度使，掌控北方军事大权，兵力达十五万之多，形成尾大不掉之势。</p>
            </div>
          </div>
          <div class="cause-item">
            <div class="cause-icon">💰</div>
            <div class="cause-info">
              <h4>经济利益冲突</h4>
              <p>安禄山通过控制河北地区的经济命脉，积累了大量财富，与中央政府的经济利益产生冲突。</p>
            </div>
          </div>
          <div class="cause-item">
            <div class="cause-icon">⚖️</div>
            <div class="cause-info">
              <h4>民族矛盾</h4>
              <p>安禄山作为胡人将领，与唐朝中央的汉族官员之间存在深刻的民族矛盾，感到受到歧视。</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 下方左右两栏（等高） -->
      <div class="bottom-section">
        <!-- 左侧：深层原因（四宫格） -->
        <div class="left-bottom">
          <div class="deep-cause-section">
            <h3>深层原因</h3>
            <div class="deep-cause-grid">
              <div class="deep-cause-card">
                <h4>政治制度缺陷</h4>
                <p>节度使制度设计初衷是为了应对边疆危机，但在唐玄宗时期逐渐变质。节度使集军权、财权、行政权于一身，形成"既有其土地，又有其人民，又有其甲兵，又有其财赋"的独立王国。特别是安禄山身兼范阳、平卢、河东三镇节度使，掌控兵力达十五万之多，占唐朝边军总数的三分之一，形成尾大不掉之势。</p>
              </div>
              <div class="deep-cause-card">
                <h4>中央政治腐败</h4>
                <p>唐玄宗后期沉迷于享乐，将朝政交由李林甫、杨国忠等奸臣把持。李林甫为巩固相位，推行"以胡制胡"政策，大量任用胡人将领担任节度使，认为他们不会威胁自己的相位。杨国忠上台后，与安禄山矛盾激化，多次向唐玄宗进谗言，声称安禄山谋反，进一步加剧了局势的紧张。</p>
              </div>
              <div class="deep-cause-card">
                <h4>社会矛盾尖锐</h4>
                <p>唐朝中期，土地兼并日益严重，均田制逐渐瓦解，大量农民失去土地，沦为流民或佃农。同时，边疆战争频繁，军费开支巨大，政府不得不加重税收，进一步加重了人民负担。统治阶级的奢侈浪费和官僚机构的腐败，也加剧了社会的不满情绪。</p>
              </div>
              <div class="deep-cause-card">
                <h4>民族政策失误</h4>
                <p>唐朝虽然实行开明的民族政策，但在处理胡汉关系上存在深层次问题。大量胡人内迁后，与汉族杂居，文化差异和经济利益冲突逐渐显现。安禄山等胡人将领虽然身居高位，但仍受到汉族官员的歧视和排挤，心理上产生了强烈的不安全感。中央政府未能有效调和胡汉矛盾，为叛乱埋下了隐患。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：导火索事件时间轴 -->
        <div class="right-bottom">
          <div class="trigger-section">
            <h3>导火索事件</h3>
            <div class="trigger-timeline">
              <!-- 事件1 -->
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>杨国忠构陷</h4>
                  <div class="timeline-date">754年</div>
                  <p>杨国忠多次向唐玄宗进言，声称安禄山有谋反之心，建议召安禄山入朝，试探其意图。</p>
                </div>
              </div>
              <!-- 事件2 -->
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>安禄山入朝</h4>
                  <div class="timeline-date">755年2月</div>
                  <p>安禄山被迫入朝，向唐玄宗哭诉自己受到杨国忠的迫害，唐玄宗安抚并加官进爵。</p>
                </div>
              </div>
              <!-- 事件3 -->
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>安禄山离京</h4>
                  <div class="timeline-date">755年6月</div>
                  <p>安禄山担心被杨国忠谋害，以讨伐契丹为名，迅速返回范阳，开始准备叛乱。</p>
                </div>
              </div>
              <!-- 事件4 -->
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>杨国忠挑衅</h4>
                  <div class="timeline-date">755年11月</div>
                  <p>杨国忠派人包围安禄山在长安的府邸，逮捕其门客，进一步激化矛盾。</p>
                </div>
              </div>
              <!-- 事件5 -->
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h4>安禄山起兵</h4>
                  <div class="timeline-date">755年12月</div>
                  <p>安禄山以"讨伐奸臣杨国忠"为名，在范阳起兵，率十五万大军南下，正式发动叛乱。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 盛世为何崩塌流程图 -->
      <div class="collapse-section">
        <h3>盛世为何崩塌</h3>
        <div class="mermaid-container">
          <MermaidChart :code="chartCode" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cause-container {
  height: 100%;
  overflow-y: auto;
  padding: 20px 20px 40px 20px;
  box-sizing: border-box;
  background: #f5f7fa;
}

/* 主要内容布局 */
.cause-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* 下方左右两栏布局（等高） */
.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  align-items: stretch;
}

/* 通用区块样式 */
.cause-section,
.trigger-section,
.deep-cause-section {
  background: none;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
  height: 100%;
  box-sizing: border-box;
}

.cause-section,
.trigger-section {
  margin-bottom: 0;
}

h3 {
  color: #34495e;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.2rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

/* 直接原因网格 */
.cause-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.cause-item {
  background: white;
  padding: 16px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.cause-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.cause-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.cause-info h4 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 1rem;
}

.cause-info p {
  color: #555;
  line-height: 1.4;
  margin: 0;
  font-size: 0.9rem;
}

/* 导火索时间线 */
.trigger-timeline {
  position: relative;
  padding-left: 0;
  height: calc(100% - 45px);
  overflow-y: auto;
}

.trigger-timeline::before {
  content: '';
  position: absolute;
  left: 40px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #3498db;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
  padding-left: 80px;
}

.timeline-marker {
  position: absolute;
  left: 29px;
  top: 5px;
  width: 24px;
  height: 24px;
  background: #3498db;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  z-index: 1;
}

.timeline-content {
  background: white;
  padding: 16px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  border-left: 3px solid #3498db;
}

.timeline-content h4 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.1rem;
  display: inline-block;
  margin-right: 12px;
}

.timeline-date {
  display: inline-block;
  background: #e3f2fd;
  color: #2980b9;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 10px;
  vertical-align: middle;
}

.timeline-content p {
  color: #555;
  line-height: 1.5;
  margin: 0;
  font-size: 0.9rem;
}

/* 深层原因网格 - 四宫格布局 */
.deep-cause-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  height: calc(100% - 45px);
  overflow-y: auto;
}

.deep-cause-card {
  background: white;
  padding: 16px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  /* 去掉顶部边框线 */
}

.deep-cause-card h4 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1rem;
}

.deep-cause-card p {
  color: #555;
  line-height: 1.5;
  margin: 0;
  font-size: 0.9rem;
}

/* 盛世为何崩塌章节样式 */
.collapse-section {
  margin-top: 25px;
}

.mermaid-container {
  background: white;
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow-x: auto;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .bottom-section {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .cause-grid,
  .deep-cause-grid {
    grid-template-columns: 1fr;
  }
  
  .mermaid-container {
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .cause-container {
    padding: 15px;
  }
  
  .cause-section,
  .trigger-section,
  .deep-cause-section {
    padding: 0;
  }
  
  .trigger-timeline {
    padding-left: 30px;
  }
  
  .timeline-marker {
    left: 29px;
  }
  
  .mermaid-container {
    padding: 10px;
  }
}
</style>