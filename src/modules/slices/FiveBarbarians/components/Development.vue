<script setup>
import MermaidChart from '../../../../components/MermaidChart.vue'

const chartCode = `flowchart TD;
    %% 样式定义
    classDef nodeStyle fill:#f9f9f9,stroke:#333,stroke-width:1px,rx:5px,ry:5px;
    classDef titleStyle fill:#e3f2fd,stroke:#3498db,stroke-width:2px,rx:5px,ry:5px,font-weight:bold;
    classDef regionStyle fill:#f3e5f5,stroke:#9c27b0,stroke-width:1px,rx:5px,ry:5px;
    classDef personStyle fill:#e8f5e8,stroke:#4caf50,stroke-width:1px,rx:5px,ry:5px;
    classDef eventStyle fill:#fff3e0,stroke:#ff9800,stroke-width:1px,rx:5px,ry:5px;
    classDef resultStyle fill:#e0f7fa,stroke:#00bcd4,stroke-width:1px,rx:5px,ry:5px;

    %% 顶层节点
    subgraph keyRegimes [关键政权并存时期]
        direction LR
        Liang[前凉<br>汉族张氏政权]:::regionStyle;
        Yan[前燕<br>鲜卑慕容氏]:::regionStyle;
        Qin[前秦<br>氐族苻氏]:::regionStyle;
        Dai[代国<br>鲜卑拓跋部]:::regionStyle;
        Jin[东晋<br>司马氏南朝政权]:::regionStyle;
    end
    subgraph topNodes [对峙双方]
        direction LR
        Q[前秦<br>氐族苻坚统一北方]:::titleStyle;
        D[东晋<br>司马曜控制南方]:::titleStyle;
    end
    F[淝水之战惨败<br>（383年冬）<br>权威崩塌，军队溃散]:::eventStyle;

    %% 中间区域节点
    R1[河北、山东旧地<br>（前燕故地）]:::regionStyle;
    R2[关中核心区<br>（长安周边）]:::regionStyle;
    R3[凉州<br>（远征军师）]:::regionStyle;
    R5[陇西西凉<br>]:::regionStyle;
    R4[代北旧地<br>（拓跋部）]:::regionStyle;

    %% 核心人物节点
    P1[核心人物：前燕皇子 慕容垂]:::personStyle;
    P2[核心人物：羌酋首领 姚苌]:::personStyle;
    P3[核心人物：氐族大将 吕光]:::personStyle;
    P5[核心人物：鲜卑酋长 乞伏国仁]:::personStyle;
    P4[核心势力：代王 拓跋珪]:::personStyle;

    %% 事件节点
    E1[384年正月<br>于荥阳复国]:::eventStyle;
    E2[384年四月叛秦自立]:::eventStyle;
    E3[386年十月<br>闻讯退据姑臧]:::eventStyle;
    E5[385年九月<br>于陇西称大单于]:::eventStyle;
    E4[386年正月复居代王位<br>四月改称魏王]:::eventStyle;

    %% 结果节点
    S1[建立后燕<br>（384-409年）<br>开国君：慕容垂（鲜卑）]:::resultStyle;
    S2[建立后秦<br>（384-417年）<br>开国君：姚苌（羌）]:::resultStyle;
    S3[建立后凉<br>（386-403年）<br>开国君：吕光（氐）]:::resultStyle;
    S5[建立西秦<br>（385-400年，409-431年）<br>开国君：乞伏国仁（鲜卑）]:::resultStyle;
    S4[建立北魏<br>（386-534年）<br>开国君：拓跋珪（鲜卑）]:::resultStyle;

    %% 关系连线
    Qin --> Q;
    Q --> F;
    D --> F;
    Q -. 隔淮河对峙 .-> D;
    F --> R1;
    F --> R2;
    F --> R3;
    F --> R5;
    F --> R4;

    R1 --> P1;
    R2 --> P2;
    R3 --> P3;
    R5 --> P5;
    R4 --> P4;

    P1 --> E1;
    P2 --> E2;
    P3 --> E3;
    P5 --> E5;
    P4 --> E4;

    E1 --> S1;
    E2 --> S2;
    E3 --> S3;
    E5 --> S5;
    E4 --> S4;

    %% 后续节点
    %% 后燕后续
    S1 --> EB1[后燕衰落<br>（398-407年）]:::eventStyle;
    EB1 --> SB1[南燕<br>398-410年<br>慕容德（后燕宗室南迁）]:::resultStyle;
    EB1 --> SB2[北燕<br>407-436年<br>冯跋（汉人将领篡位）]:::resultStyle;

    %% 后秦后续
    S2 --> EB2[后秦衰落<br>（394-407年）]:::eventStyle;
    EB2 --> SB3[胡夏/大夏<br>407-431年<br>赫连勃勃（匈奴将领反叛）]:::resultStyle;

    %% 后凉后续
    S3 --> EB3[后凉内乱<br>（397-403年）]:::eventStyle;
    EB3 --> SB4[北凉<br>397-439年<br>沮渠蒙逊（匈奴部落独立）]:::resultStyle;
    EB3 --> SB5[南凉<br>397-414年<br>秃发乌孤（鲜卑部族独立）]:::resultStyle;
    EB3 --> SB6[西凉<br>400-421年<br>李暠（汉人大族独立）]:::resultStyle;

    %% 北魏后续
    S4 --> EB4[北魏持续扩张]:::eventStyle;

    %% 北方持续混战
    SB1 --> WF[北方持续混战<br>（约410-430年代）]:::eventStyle;
    SB2 --> WF;
    SB3 --> WF;
    SB4 --> WF;
    SB5 --> WF;
    SB6 --> WF;
    S5 --> WF;

    %% 北魏统一北方
    WF --> EU[439年<br>北魏太武帝拓跋焘<br>攻灭北凉，统一华北]:::eventStyle;
    EU --> EC[五胡乱华时代终结<br>北方进入北朝（北魏）时代]:::resultStyle;
    EB4 --> EU;

    %% 应用样式
    class Q,D titleStyle;
    class F eventStyle;
    class R1,R2,R3,R4,R5 regionStyle;
    class P1,P2,P3,P4,P5 personStyle;
    class E1,E2,E3,E4,E5,EB1,EB2,EB3,EB4,WF,EU eventStyle;
    class S1,S2,S3,S4,S5,SB1,SB2,SB3,SB4,SB5,SB6,EC resultStyle;
`
</script>

<template>
  <div class="development-container">
    <div class="development-header">
      <h2>五胡乱华 - 事态发展</h2>
    </div>
    
    <div class="development-content">
      <MermaidChart :code="chartCode" />
    </div>
  </div>
</template>

<style scoped>
.development-container {
  height: 100%;
  overflow-y: auto;
  padding: 10px 30px 30px;
  box-sizing: border-box;
  background: white;
}

.development-header h2 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.5rem;
  text-align: center;
}

.development-content {
  min-height: 600px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10px;
}
</style>