<script setup>
import MermaidChart from '../../../../components/MermaidChart.vue'

const chartCode = `flowchart TB;
    %% 样式定义
    classDef containerStyle fill:#FFF8DC,stroke:#D2B48C,stroke-width:2px,rx:10px,ry:10px;
    classDef personStyle fill:#E6E6FA,stroke:#9370DB,stroke-width:2px,rx:10px,ry:10px;
    classDef redXStyle fill:#ffcccc,stroke:#ff0000,stroke-width:2px,rx:5px,ry:5px,font-weight:bold,color:#ff0000;

    %% 唐廷阵营 - 右上
    subgraph TangCamp[唐廷阵营（整合外力）]
        direction TB
        Suzong[唐肃宗]:::personStyle;
        Li[李光弼]:::personStyle;
        Guo[郭子仪]:::personStyle;
        
        Suzong --> Guo;
        Suzong --> Li;
    end

    
    %% 关键第三方容器 - 左上
    subgraph ThirdParty[第三方势力]
        direction TB
        OtherJiedushi[其他藩镇观望]:::personStyle;
        Uyghur[回纥骑兵]:::personStyle;
    end

    %% 叛军阵营 - 下方（横跨）
    subgraph RebelCamp[叛军阵营内讧加剧]
        direction TB
        AnLushan[安禄山]:::personStyle;
        AnQingxu[安庆绪<br>继位]:::personStyle;
        ShiSiming[史思明<br>成为新核心]:::personStyle;
        ShiChaoyi[史朝义<br>其子]:::personStyle;
        
        AnLushan --x|被弑| AnQingxu;
        AnQingxu <-->|先降唐后复叛<br>弑君夺权| ShiSiming;
        ShiSiming <-->|内部猜忌链| ShiChaoyi;
    end

    %% 外部连接
    Uyghur -->|关键助攻| Guo;
    TangCamp -->|惨烈拉锯战| ShiSiming;

    
    %% 应用样式
    class ThirdParty containerStyle;
    class TangCamp containerStyle;
    class RebelCamp containerStyle;
`
</script>

<template>
  <div class="phase23-flowchart-container">
    <MermaidChart :code="chartCode" />
  </div>
</template>

<style scoped>
.phase23-flowchart-container {
  width: 100%;
  overflow-x: auto;
  padding: 10px;
  box-sizing: border-box;
}
</style>