<script setup>
import MermaidChart from '../../../../components/MermaidChart.vue'

const chartCode = `flowchart LR;
    %% 样式定义
    classDef containerStyle fill:#FFF8DC,stroke:#D2B48C,stroke-width:2px,rx:10px,ry:10px;
    classDef personStyle fill:#E6E6FA,stroke:#9370DB,stroke-width:2px,rx:10px,ry:10px;
    
    %% 关键第三方容器 - 左上角
    subgraph ThirdParty[关键第三方]
        direction TB
        Huihe[回纥汗国]:::personStyle;
    end

    %% 新兴平叛核心容器 - 左下角
    subgraph NewCore[新兴平叛核心]
        direction TB
        LiHeng[太子李亨<br>肃宗]:::personStyle;
        GuoZiyi[郭子仪<br>平叛主帅]:::personStyle;
        LiGuangbi[李光弼<br>平叛主帅]:::personStyle;
        
        GuoZiyi -->|受命平叛| LiHeng;
        LiGuangbi -->|受命平叛| LiHeng;
    end

    %% 唐廷中枢容器 - 右上角
    subgraph Court[唐廷中枢]
        direction TB
        Emperor[唐玄宗<br>皇帝]:::personStyle;
        Yang[杨国忠<br>宰相]:::personStyle;
        Ge[哥舒翰<br>守潼关大将]:::personStyle;
        
        Emperor --x|马嵬坡兵变| Yang;
        Emperor --> Ge;
    end

    %% 安史叛军集团容器 - 右下角
    subgraph Rebels[安史叛军集团]
        direction TB
        AnLushan[安禄山<br>叛军核心]:::personStyle;
        ShiSiming[史思明<br>核心大将]:::personStyle;
        AnQingxu[安庆绪<br>其子]:::personStyle;
        
        AnLushan --> ShiSiming;
        AnLushan --> AnQingxu;
    end

    %% 外部关系
    Emperor -->|灵武即位新核心| LiHeng;
    Yang -->|激烈政争| AnLushan;
    Ge --x|兵败被俘| AnLushan;
    Huihe -->|借兵| LiHeng;
    
    %% 应用样式
    class Court containerStyle;
    class Rebels containerStyle;
    class NewCore containerStyle;
    class ThirdParty containerStyle;
`
</script>

<template>
  <div class="phase1-flowchart-container">
    <MermaidChart :code="chartCode" />
  </div>
</template>

<style scoped>
.phase1-flowchart-container {
  width: 100%;
  overflow-x: auto;
  padding: 10px;
  box-sizing: border-box;
}
</style>