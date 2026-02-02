<script setup>
import { ref, onMounted, nextTick } from 'vue';
import Phase1Flowchart from './Phase1Flowchart.vue';
import Phase23Flowchart from './Phase23Flowchart.vue';
import Phase4Flowchart from './Phase4Flowchart.vue';
// 战争阶段和事件数据
const warData = {
  stages: [
    {
      id: 'stage1',
      title: '第一阶段: 安禄山起兵',
      time: '755-756',
      description: '安禄山以讨伐杨国忠为名，率十五万大军南下，迅速攻占洛阳、长安。唐玄宗逃亡蜀地，<br/>太子李亨继位为肃宗。',
      color: '#6c5ce7',
      textColor: 'white',
      events: [
        { time: '755.12', title: '范阳起兵', detail: '安禄山以讨伐杨国忠为名，在范阳起兵，率十五万大军南下，正式发动安史之乱。' },
        { time: '756.01', title: '洛阳沦陷', detail: '安禄山叛军攻占洛阳，建立大燕国，自称雄武皇帝。' },
        { time: '756.06', title: '潼关之战', detail: '哥舒翰率领的唐军在潼关被安禄山叛军击败，潼关失守，长安门户大开。' },
        { time: '756.07', title: '玄宗奔蜀', detail: '唐玄宗带领杨贵妃、杨国忠等亲信逃亡蜀地，途中发生马嵬坡兵变。' },
        { time: '756.07', title: '肃宗继位', detail: '太子李亨在灵武继位，是为唐肃宗，遥尊玄宗为太上皇，开始组织平叛。' }
      ]
    },
    {
      id: 'stage2',
      title: '第二阶段: 唐军反击',
      time: '757-759',
      description: '郭子仪、李光弼等将领率领唐军反击，借回纥兵收复长安、洛阳。<br/>安禄山被其子安庆绪所杀，安庆绪继立。',
      color: '#fdcb6e',
      textColor: 'black',
      events: [
        { time: '757.01', title: '太原之战', detail: '李光弼率领唐军在太原击败史思明叛军，守住了河东战略要地。' },
        { time: '757.01', title: '睢阳之战', detail: '张巡、许远率领唐军坚守睢阳十个月，阻挡了叛军南下，保障了江南安全。' },
        { time: '757.09', title: '收复两京', detail: '郭子仪率领唐军借回纥兵收复长安，随后收复洛阳，安庆绪逃往邺城。' },
        { time: '759.03', title: '相州之战', detail: '唐军九节度使围攻安庆绪于邺城，史思明率军增援，唐军大败，史思明杀安庆绪自立。' }
      ]
    },
    {
      id: 'stage3',
      title: '第三阶段: 史思明叛乱',
      time: '759-761',
      description: '史思明杀安庆绪，自称大燕皇帝，再次攻占洛阳。史思明被其子史朝<br/>义所杀，史朝义继立。',
      color: '#00b894',
      textColor: 'white',
      events: [
        { time: '759.03', title: '史思明杀安庆绪', detail: '史思明在邺城击败唐军后，杀安庆绪，自称大燕皇帝，改元顺天。' },
        { time: '759.09', title: '史思明攻占洛阳', detail: '史思明率军再次攻占洛阳，与唐军形成对峙局面。' },
        { time: '761.02', title: '邙山之战', detail: '李光弼与仆固怀恩在邙山与史思明交战，唐军大败，史思明乘胜西进。' },
        { time: '761.03', title: '史朝义杀史思明', detail: '史思明被其子史朝义所杀，史朝义继位，叛军内部开始分裂。' }
      ]
    },
    {
      id: 'stage4',
      title: '第四阶段: 叛乱平定',
      time: '761-763',
      description: '唐代宗继位，郭子仪等将领再次借回纥兵反击，史朝义众叛亲离，兵<br/>败自杀，叛乱平定。',
      color: '#e17055',
      textColor: 'white',
      events: [
        { time: '762.10', title: '唐军反击', detail: '唐代宗继位后，郭子仪再次借回纥兵反击史朝义叛军。' },
        { time: '762.10', title: '收复洛阳', detail: '唐军收复洛阳，史朝义逃往莫州。' },
        { time: '762.11', title: '史朝义败逃', detail: '史朝义众叛亲离，手下将领纷纷降唐，史朝义逃往范阳。' },
        { time: '763.02', title: '史朝义自杀', detail: '史朝义在范阳走投无路，自杀身亡，持续七年多的安史之乱最终平定。' }
      ]
    }
  ]
};

// 计算布局数据
const eventsPerStage = warData.stages.map(stage => stage.events.length);
const totalEvents = eventsPerStage.reduce((sum, count) => sum + count, 0);
const eventWidth = 110; // 进一步增加事件宽度，确保能容纳完整文字
const eventSpacing = 12; // 适当的事件间距
const stageWidths = eventsPerStage.map(count => count * (eventWidth + eventSpacing) - eventSpacing);

// 计算每个阶段的起始位置
const stagePositions = [];
let currentPosition = 50;
for (let i = 0; i < stageWidths.length; i++) {
  stagePositions.push(currentPosition);
  currentPosition += stageWidths[i] + 20; // 阶段间间距20px
}

// 计算每个事件的位置
const allEvents = [];
warData.stages.forEach((stage, stageIndex) => {
  let stageEventPosition = stagePositions[stageIndex];
  stage.events.forEach(event => {
    allEvents.push({
      ...event,
      stageIndex,
      x: stageEventPosition,
      color: stage.color,
      bgColor: stage.color + '40'
    });
    stageEventPosition += eventWidth + eventSpacing;
  });
});

// 计算SVG总宽度
const totalWidth = currentPosition + 20;

// 基础Y坐标常量，便于统一调整所有元素的垂直位置
const baseY = 20;

// 页签数据
const tabs = [
  { id: 'phase1', name: '第一阶段（755-756）' },
  { id: 'phase2-3', name: '第二三阶段（757-761）' },
  { id: 'phase4', name: '第四阶段（761-763）' }
];

// 当前激活的页签
const activeTab = ref('phase1');

// 时间轴容器引用
const timelineContainer = ref(null);

// 添加自定义tooltip
const addCustomTooltips = () => {
  if (!timelineContainer.value) return;

  // 查找所有带有title属性的事件元素
  const eventsWithTitle = timelineContainer.value.querySelectorAll('.event-rect[title]');
  
  eventsWithTitle.forEach(element => {
    // 移除默认title属性，避免浏览器默认tooltip
    const tooltipText = element.getAttribute('title');
    element.removeAttribute('title');
    
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
      timelineContainer.value.appendChild(tooltip);
      
      // 鼠标悬停事件
      element.addEventListener('mouseenter', (e) => {
        // 计算tooltip位置，靠近鼠标当前位置
        const containerRect = timelineContainer.value.getBoundingClientRect();
        
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
        const containerRect = timelineContainer.value.getBoundingClientRect();
        
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
  <div class="evolution-container">
    
    <div class="evolution-content">
      <!-- 战争阶段时间轴 (动态SVG实现) -->
      <h3>安史之乱进程与关键节点 (755-763)</h3>
      <div class="timeline-section" ref="timelineContainer">
        <svg class="timeline-svg" :viewBox="`0 0 ${totalWidth} 240`" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" style="overflow: visible;">
          <!-- 定义箭头标记 -->
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="2" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,4 L5,2 z" fill="#34495e" />
            </marker>
          </defs>
          
          <!-- 阶段标题行 -->
          <template v-for="(stage, index) in warData.stages" :key="stage.id">
            <rect 
              :x="stagePositions[index]" 
              :y="baseY" 
              :width="stageWidths[index]" 
              height="120" 
              :fill="stage.color" 
              rx="4" 
              ry="4" 
            />
            <text 
              :x="stagePositions[index] + stageWidths[index] / 2" 
              :y="baseY + 40" 
              text-anchor="middle" 
              :fill="stage.textColor" 
              font-size="18"
            >
              {{ stage.title }} ({{ stage.time }})
            </text>
            <text 
              :x="stagePositions[index] + 20" 
              :y="baseY + 70" 
              text-anchor="start" 
              :fill="stage.textColor" 
              font-size="14" 
              letter-spacing="0.5"
            >
              <tspan :x="stagePositions[index] + 20" dy="0">{{ stage.description.split('<br/>')[0] }}</tspan>
              <tspan :x="stagePositions[index] + 20" dy="25">{{ stage.description.split('<br/>')[1] }}</tspan>
            </text>
          </template>
          
          <!-- 时间轴事件行 -->
          <template v-for="(event, index) in allEvents" :key="index">
            <rect 
              :x="event.x" 
              :y="baseY + 140" 
              :width="eventWidth" 
              :height="65" 
              :fill="event.bgColor" 
              rx="4" 
              ry="4" 
              :title="event.detail"
              class="event-rect"
            />
            <!-- 事件文本 -->
            <text 
              :x="event.x + eventWidth / 2" 
              :y="baseY + 165" 
              text-anchor="middle" 
              fill="black" 
              font-size="14" 
              font-weight="bold"
              style="pointer-events: none;"
            >
              {{ event.time }}
            </text>
            <text 
              :x="event.x + eventWidth / 2" 
              :y="baseY + 190" 
              text-anchor="middle" 
              fill="black" 
              font-size="14"
              style="pointer-events: none;"
            >
              {{ event.title }}
            </text>
            <!-- 事件连接线 -->
            <line 
              :x1="event.x + eventWidth / 2" 
              :y1="baseY + 205" 
              :x2="event.x + eventWidth / 2" 
              :y2="baseY + 230" 
              stroke="#34495e" 
              stroke-width="1" 
            />
          </template>
          
          <!-- 时间轴主线 -->
          <line x1="50" :y1="baseY + 230" :x2="totalWidth - 30" :y2="baseY + 230" stroke="#34495e" stroke-width="1" />
          
          <!-- 箭头 -->
          <line :x1="totalWidth - 30" :y1="baseY + 230" :x2="totalWidth - 10" :y2="baseY + 230" stroke="#34495e" stroke-width="1" marker-end="url(#arrow)" />
        
        </svg>
      </div>
      
      <!-- 阵营态势图 -->
      <h3>阵营态势图</h3>
      <div class="map-section">
        <!-- 页签切换 -->
        <div class="tabs">
          <button v-for="tab in tabs" 
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="['tab-btn', { active: activeTab === tab.id }]"
          >
            {{ tab.name }}
          </button>
        </div>
        
        <!-- 页签内容 -->
        <div class="tab-content">
          <!-- 第一阶段内容 -->
          <div v-if="activeTab === 'phase1'" class="tab-pane">
            <div class="phase-flowchart">
              <div class="flowchart-container">
                <Phase1Flowchart />
              </div>
            </div>
          </div>
          
          <!-- 第二三阶段内容 -->
          <div v-if="activeTab === 'phase2-3'" class="tab-pane">
            <div class="phase-flowchart">
              <div class="flowchart-container">
                <Phase23Flowchart />
              </div>
            </div>
          </div>
          
          <!-- 第四阶段内容 -->
          <div v-if="activeTab === 'phase4'" class="tab-pane">
            <div class="phase-flowchart">
              <div class="flowchart-container">
                <Phase4Flowchart />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 关键人物 -->
      <h3>关键人物</h3>
      <div class="characters-section">
        <div class="characters-grid">
          <!-- 叛军人物 -->
          <div class="character-group">
            <h4>叛军人物</h4>
            <div class="character-list">
              <div class="character-item">
                <span class="character-name">安禄山</span>
                <span class="character-role">叛乱首领，范阳节度使</span>
              </div>
              <div class="character-item">
                <span class="character-name">史思明</span>
                <span class="character-role">安禄山部将，后杀安庆绪自立</span>
              </div>
              <div class="character-item">
                <span class="character-name">安庆绪</span>
                <span class="character-role">安禄山之子，杀父继位</span>
              </div>
              <div class="character-item">
                <span class="character-name">史朝义</span>
                <span class="character-role">史思明之子，杀父继位</span>
              </div>
            </div>
          </div>
          
          <!-- 唐军人物 -->
          <div class="character-group">
            <h4>唐军人物</h4>
            <div class="character-list">
              <div class="character-item">
                <span class="character-name">唐玄宗</span>
                <span class="character-role">唐朝皇帝，逃亡蜀地</span>
              </div>
              <div class="character-item">
                <span class="character-name">唐肃宗</span>
                <span class="character-role">唐玄宗之子，继位平叛</span>
              </div>
              <div class="character-item">
                <span class="character-name">郭子仪</span>
                <span class="character-role">唐军主帅，收复两京</span>
              </div>
              <div class="character-item">
                <span class="character-name">李光弼</span>
                <span class="character-role">唐军副帅，屡败叛军</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 战争影响 -->
      <h3>战争影响</h3>
      <div class="impact-section">
        <div class="impact-grid">
          <div class="impact-item">
            <div class="impact-icon">📉</div>
            <div class="impact-info">
              <h4>唐朝衰落</h4>
              <p>安史之乱是唐朝由盛转衰的转折点，人口锐减，经济崩溃，西域控制丧失，边疆危机加剧。</p>
            </div>
          </div>
          <div class="impact-item">
            <div class="impact-icon">🏛️</div>
            <div class="impact-info">
              <h4>藩镇割据</h4>
              <p>平叛过程中崛起的节度使形成新的割据势力，中央集权削弱，形成藩镇割据的局面。</p>
            </div>
          </div>
          <div class="impact-item">
            <div class="impact-icon">🚜</div>
            <div class="impact-info">
              <h4>经济重心南移</h4>
              <p>北方遭战争破坏严重，人口大量南迁，促进了南方经济发展，经济重心开始南移。</p>
            </div>
          </div>
          <div class="impact-item">
            <div class="impact-icon">📚</div>
            <div class="impact-info">
              <h4>文化影响</h4>
              <p>战乱导致许多文化典籍损毁，文化艺术发展受到严重影响，但也催生了一批反映战乱的文学作品。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.evolution-container {
  height: 100%;
  overflow-y: auto;
  padding: 20px 20px 40px 20px;
  box-sizing: border-box;
  background: #f5f7fa;
}

.evolution-header h2 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 1.5rem;
}

.timeline-section,
.map-section,
.characters-section,
.impact-section {
  margin-top: 0;
  margin-bottom: 30px;
  background: white;
  padding: 25px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

h3 {
  color: #34495e;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.2rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

/* 战争阶段 */
.stages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.stage-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stage-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.stage-header {
  background: #3498db;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stage-header h4 {
  margin: 0;
  font-size: 1.1rem;
}

.stage-date {
  font-size: 0.85rem;
  background: rgba(255,255,255,0.2);
  padding: 2px 8px;
  border-radius: 4px;
}

.stage-content {
  padding: 20px;
}

.stage-content p {
  color: #555;
  line-height: 1.6;
  margin-bottom: 15px;
}

.stage-battles h5 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1rem;
}

.stage-battles ul {
  margin: 0;
  padding-left: 20px;
  color: #555;
}

.stage-battles li {
  margin-bottom: 5px;
}

/* 阵营态势图页签样式 */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: #e0e0e0;
  color: #333;
}

.tab-btn.active {
  background: #3498db;
  color: white;
}

.tab-content {
  background: white;
  border-radius: 6px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.tab-pane {
  min-height: 400px;
}

.phase-flowchart h4,
.phase-content h4 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #34495e;
  font-size: 1.2rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

.flowchart-container {
  overflow-x: auto;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 10px;
}

.phase-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  background: #f9f9f9;
  border: 2px dashed #ddd;
  border-radius: 8px;
}

.phase-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #999;
}

.phase-placeholder p {
  margin: 5px 0;
  color: #666;
  text-align: center;
  font-size: 14px;
}

/* 关键人物 */
.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.character-group {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
}

.character-group h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
  font-size: 1.1rem;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}

.character-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.character-item:last-child {
  border-bottom: none;
}

.character-name {
  font-weight: 600;
  color: #333;
}

.character-role {
  color: #666;
  font-size: 0.9rem;
}

/* 战争影响 */
.impact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.impact-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: flex-start;
  gap: 15px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.impact-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.impact-icon {
  font-size: 2rem;
  flex-shrink: 0;
  margin-top: 5px;
}

.impact-info h4 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.impact-info p {
  color: #555;
  line-height: 1.6;
  margin: 0;
}

/* 时间轴样式 */
.timeline-section {
  background: white;
  padding: 0px 25px 25px 25px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  margin-bottom: 25px;
  overflow-x: auto;
  position: relative;
}

.timeline-svg {
  width: 100%;
  height: auto;
  min-height: 240px;
  display: block;
  margin-top: 0;
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .timeline-svg {
    min-height: 280px;
  }
}

@media (max-width: 768px) {
  .timeline-svg {
    min-height: 350px;
  }
  
  .timeline-section {
    padding: 15px;
  }
}

@media (max-width: 992px) {
  .stages-grid {
    grid-template-columns: 1fr;
  }
  
  .map-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .evolution-container {
    padding: 20px;
  }
  
  .impact-grid,
  .characters-grid {
    grid-template-columns: 1fr;
  }
  
  .stage-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>