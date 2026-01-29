<script setup>
const allusions = [
  {
    title: '椒房专宠',
    figure: '贾南风 (贾后)',
    story:
      '“椒房”本指皇后住所。贾后相貌丑陋却生性妒忌，手段狠毒，把持朝政，残杀怀孕妃嫔，独占后宫与大权。',
    meaning:
      '原指后妃得宠。在此特指贾后乱政，是八王之乱的直接祸首。后世常用来形容后宫干政或专宠无度。'
  },
  {
    title: '羊车望幸',
    figure: '晋武帝 (司马炎)',
    story:
      '晋武帝灭吴后后宫万人，不知宿处，便坐羊车任其所之。宫人便在门前插竹叶、洒盐水引羊车驻足。',
    meaning:
      '表现统治者荒淫奢靡的生活。后世用以形容帝王后宫生活无度，听天由命。'
  },
  {
    title: '何不食肉糜',
    figure: '晋惠帝 (司马衷)',
    story:
      '天下饥荒，百姓饿死无数。晋惠帝听闻后大惑不解，问大臣：“百姓无粟米充饥，何不食肉糜（肉粥）？”',
    meaning: '表现统治者昏聩无知。后世常用来讽刺身居高位者对民间疾苦一无所知。'
  },
  {
    title: '狗尾续貂',
    figure: '赵王 (司马伦)',
    story:
      '司马伦篡位后滥封官爵，连奴仆杂役都封官。官员帽子上的貂尾不够用，只好用狗尾巴代替。',
    meaning:
      '当时讽刺官爵太滥。后世比喻拿不好的东西接到好的东西后面，显得好坏不相称（多指文学作品）。'
  },
  {
    title: '嵇侍中血',
    figure: '嵇绍 (嵇康之子)',
    story:
      '荡阴之战，百官逃散，只有侍中嵇绍以身护卫惠帝，被杀后血溅帝衣。事后惠帝以此为念，不许浣洗。',
    meaning: '表现忠臣死节，忠烈精神感人至深。后世用以颂扬忠诚与气节。'
  },
  {
    title: '清谈误国',
    figure: '王衍',
    story:
      '太尉王衍身居高位，整日崇尚虚无玄妙的“清谈”，不理政务。被俘临死前悔悟：“若不崇尚浮虚，不至今日。”',
    meaning: '指士大夫只热衷于空谈玄理，不务实事，导致国家衰败。后世引以为戒。'
  },
  {
    title: '衣冠南渡',
    figure: '司马睿、王导等',
    story:
      '永嘉之乱后，中原沦陷。晋朝皇室和北方士族（“衣冠”代指士大夫）大规模渡长江迁往南方建立东晋。',
    meaning:
      '指中原政权与文明南迁。后世用来指代大动荡时期的文化与政权转移，保存华夏火种。'
  },
  {
    title: '新亭对泣',
    figure: '王导、周顗',
    story:
      '南渡士大夫在新亭聚会，感叹山河变色，相对流泪。王导厉声曰：“当共戮力王室，何至作楚囚相对！”',
    meaning:
      '指在国家危难时只知悲泣而无力回天。后世比喻面对国破家亡时的无奈与悲痛，或激励人们振作。'
  },
  {
    title: '闻鸡起舞',
    figure: '祖逖、刘琨',
    story:
      '祖逖和刘琨年轻时同床而卧，半夜听到鸡叫，二人起床舞剑练武，立志报效国家。',
    meaning:
      '表现有志报国的人及时奋起，努力磨砺自己。后世比喻有志之士及时奋发图强。'
  },
  {
    title: '击楫中流',
    figure: '祖逖',
    story:
      '祖逖率部北伐，渡江至中流时，用力拍击船桨发誓：“不清中原而复济者，有如大江！”',
    meaning: '表现收复失地的豪情壮志。后世形容慷慨报国，决心坚定。'
  }
]
</script>

<template>
  <div class="overview-view">
    <div class="header-area">
      <div class="title-block">
        <h2>八王之乱</h2>
        <span class="tag">291年 - 306年</span>
      </div>
      <p class="subtitle">
        西晋皇族内部为争夺中央政权而引发的动乱，导致西晋灭亡与五胡乱华的开端
      </p>
    </div>

    <div class="main-grid">
      <!-- 上部分：事件分析 (3列布局) -->
      <section class="analysis-section">
        <div class="card cause-card">
          <div class="card-header">
            <span class="icon">🔥</span>
            <h3>导火索与起因</h3>
          </div>
          <div class="card-content">
            <p>
              <strong>根本原因：</strong>
              晋武帝分封诸王，赋予实权；门阀制度导致阶层固化。
            </p>
            <p>
              <strong>直接原因：</strong>
              <strong>贾南风（贾后）</strong
              >乱政。她不满杨骏专权，密谋联合汝南王亮、楚王玮发动政变诛杀杨骏，开启了宗室干政的先河。
            </p>
          </div>
        </div>

        <div class="card process-card">
          <div class="card-header">
            <span class="icon">📜</span>
            <h3>过程与结束</h3>
          </div>
          <div class="card-content">
            <p>
              <strong>两个阶段：</strong>
              前期（291年）为宫廷政变，后期（299-306年）演变为大规模军事混战。
            </p>
            <p>
              <strong>核心人物：</strong>
              汝南王亮、楚王玮、赵王伦、齐王冏、长沙王乂、成都王颖、河间王颙、东海王越。
            </p>
            <p>
              <strong>结束标志：</strong>
              306年，<strong>东海王司马越</strong>胜出，迎惠帝回洛阳。惠帝暴崩，晋怀帝继位。
            </p>
          </div>
        </div>

        <div class="card result-card">
          <div class="card-header">
            <span class="icon">💔</span>
            <h3>打击与后果</h3>
          </div>
          <div class="card-content">
            <p>
              <strong>致命打击：</strong>
              中央禁军消耗殆尽，诸王引胡人参战，导致边疆防务崩溃。
            </p>
            <p>
              <strong>连锁反应：</strong>
              <strong>五胡乱华</strong
              >（刘渊、李特起兵）、<strong>永嘉之乱</strong>（洛阳沦陷）、<strong>衣冠南渡</strong>。
            </p>
            <p>
              <strong>最终结果：</strong>
              316年西晋灭亡，北方进入近三百年的“五胡十六国”大分裂时期。
            </p>
          </div>
        </div>
      </section>

      <!-- 下部分：典故赏析 (Grid布局) -->
      <section class="allusion-section">
        <div class="section-title">
          <h3>📖 典故赏析</h3>
          <span class="sub-text">从成语典故看西晋风云</span>
        </div>
        <div class="allusion-grid">
          <div
            v-for="(item, index) in allusions"
            :key="index"
            class="allusion-card"
          >
            <div class="allusion-header">
              <span class="allusion-title">{{ item.title }}</span>
              <span class="allusion-figure">{{ item.figure }}</span>
            </div>
            <div class="allusion-body">
              <p class="story"><strong>典故：</strong>{{ item.story }}</p>
              <p class="meaning"><strong>寓意：</strong>{{ item.meaning }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.overview-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden; /* 整体不滚动，内部滚动 */
}

/* Header */
.header-area {
  flex-shrink: 0;
  margin-bottom: 20px;
}

.title-block {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 8px;
}

.header-area h2 {
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

/* Main Layout */
.main-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0; /* 关键：允许flex子项收缩 */
}

/* Analysis Section */
.analysis-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  flex-shrink: 0; /* 不压缩高度 */
}

.card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
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

.cause-card {
  border-top: 3px solid #e74c3c;
}
.process-card {
  border-top: 3px solid #f39c12;
}
.result-card {
  border-top: 3px solid #34495e;
}

/* Allusion Section */
.allusion-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  min-height: 0; /* 关键：允许内部滚动 */
}

.section-title {
  flex-shrink: 0;
  margin-bottom: 15px;
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.section-title h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.sub-text {
  font-size: 0.9rem;
  color: #95a5a6;
}

.allusion-grid {
  flex: 1;
  overflow-y: auto; /* 内部滚动 */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  padding-right: 5px; /* 滚动条留白 */
}

.allusion-card {
  background: #f9fafb;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 12px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.allusion-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #dcdcdc;
}

.allusion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.allusion-title {
  font-weight: bold;
  font-size: 1rem;
  color: #c0392b;
}

.allusion-figure {
  font-size: 0.85rem;
  background: #e3f2fd;
  color: #2980b9;
  padding: 2px 6px;
  border-radius: 4px;
}

.allusion-body {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.5;
}

.story {
  margin: 0 0 6px 0;
  text-align: justify;
}

.meaning {
  margin: 0;
  color: #555;
  background: #fff;
  padding: 6px;
  border-radius: 4px;
  border-left: 2px solid #bdc3c7;
}

strong {
  color: #333;
}
</style>
