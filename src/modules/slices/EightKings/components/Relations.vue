<script setup>
import MermaidChart from '../../../../components/MermaidChart.vue'

const chartCode = `flowchart TD;
    %% 样式定义
    classDef subgraphTitle fill: #00000000,stroke:none,font-weight:bold,font-size:14px,color:#333;
    classDef emperor fill:#ffcc66;
    classDef eight_kings stroke:#ff0000,stroke-width:2px;
    classDef deceased stroke:#000000,stroke-width:2px;
    classDef yangjun stroke:#000000,stroke-width:2px,stroke-dasharray:5 5;
    classDef default fill:#ffffff,stroke:none;

    %% 第一代
    subgraph G1 [第一代]
        direction LR
        A["司马懿<br>宣帝（追封）"]
        B["司马孚<br>安平王"]
        C["司马馗<br>东武公"]
    end

    %% 第二代
    subgraph G2 [第二代]
        direction LR
        A1["司马师<br>景帝（追封）"]
        A2["司马昭<br>文帝（追封）"]
        A3((司马亮（60）<br>汝南王))
        A4((司马伦（51）<br>赵王))
    end

    %% 第三代
    subgraph G3 [第三代]
        direction LR
        A2_1["晋武帝<br>司马炎（称帝）"]
        M1["杨艳<br>武元皇后"]
        M2["杨芷<br>武悼皇后<br>（杨骏之女）"]
        Y["杨骏<br>车骑将军"]
        A2_2["司马攸<br>齐献王"]
        B1((司马颙（27）<br>河间王))
        C1((司马越（30）<br>东海王))
    end

    %% 第四代
    subgraph G4 [第四代]
        direction LR
        A2_1_1["晋惠帝<br>司马衷（32）"]
        J["贾南风<br>皇后"]
        A2_1_2((司马玮（20）<br>楚王))
        A2_1_3((司马乂（14）<br>长沙王))
        A2_1_4((司马颖（12）<br>成都王))
        A2_2_1((司马冏（25）<br>齐王))
    end

    %% 第五代
    subgraph G5 [第五代]
        direction LR
        A2_1_1_1["司马遹（13）<br>愍怀太子"]
    end

    %% 关系连线
    A --> A1;
    A --> A2;
    A --> A3;
    A --> A4;
    B --> B_s["司马邕"] --> B1;
    C --> C_s["司马权"] --> C1;
    A2 --> A2_1;
    A2 --> A2_2;
    A2_1 --> A2_1_2;
    A2_1 --> A2_1_3;
    A2_1 --> A2_1_4;
    A2_2 --> A2_2_1;
    A2_1 -- 夫妇 --> M1;
    M1 -- 生 --> A2_1_1;
    A2_1 -- 夫妇 --> M2;
    Y -- 父女 --> M2;
    A2_1_1 -- 夫妇 --> J;
    A2_1_1 --> A2_1_1_1;

    %% 应用样式
    class A2_1,A2_1_1 emperor;
    class A3,A4,B1,C1,A2_1_2,A2_1_3,A2_1_4,A2_2_1 eight_kings;
    class A,A1,A2,B,C,M1,A2_2 deceased;
    class Y yangjun;

    %% 图例
    L1["皇帝：橙黄背景"] --> L2["八王：红色圆圈"];
    L2 --> L3["291年前已逝：黑色实线边框（年龄）"];
    L3 --> L4["杨骏：黑色虚线边框<br>291年被杀"];
`
</script>

<template>
  <div class="relations-view">
    <MermaidChart :code="chartCode" />
  </div>
</template>

<style scoped>
.relations-view {
  background: white;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box; /* 确保 padding 不会撑开高度 */
}

.desc {
  color: #666;
  font-size: 0.9rem;
}
</style>
