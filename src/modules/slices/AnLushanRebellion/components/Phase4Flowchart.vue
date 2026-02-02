<script setup>
import MermaidChart from '../../../../components/MermaidChart.vue'

const chartCode = `flowchart TB
    %% 样式定义
    classDef containerStyle fill:#FFF8DC,stroke:#D2B48C,stroke-width:2px,rx:10px,ry:10px
    classDef boxStyle fill:#E6E6FA,stroke:#9370DB,stroke-width:2px,rx:10px,ry:10px
    classDef personStyle fill:#E6E6FA,stroke:#9370DB,stroke-width:2px,rx:10px,ry:10px
    classDef redXStyle fill:#ffcccc,stroke:#ff0000,stroke-width:2px,rx:5px,ry:5px,font-weight:bold,color:#ff0000

    %% 左侧：最终形成的长期格局
    subgraph LongTerm[最终形成的长期格局]
        direction TB
        Central[唐朝中央]:::boxStyle
        Hedong[河朔三镇等藩镇]:::boxStyle
        Southeast[东南财赋区]:::boxStyle
        Eunuchs[宦官集团]:::boxStyle
        
        Central -->|"名义统辖"| Hedong
        Central -->|"依赖"| Southeast
        Central -->|"受制于"| Eunuchs
        Hedong -.->|"割据自治"| Hedong
    end

    %% 时间标记
    Year["763年"]

    %% 右侧：叛军覆灭与转化
    subgraph RebelEnd[叛军覆灭与转化]
        direction TB
        
        %% 唐代宗与新秩序子图
        subgraph NewOrder[唐代宗与新秩序]
            Daizong[唐代宗]:::boxStyle
            Puguhuanen[仆固怀恩<br>后期主帅]:::boxStyle
            
            Daizong --> Puguhuanen
        end
        
        TianChengshi[旧部：田承嗣]:::boxStyle
        LiBaochen[旧部：李宝臣]:::boxStyle
        ShiChaoyi[史朝义]:::boxStyle
        
        %% 关系连线
        Daizong -->|"姑息任命"| TianChengshi
        Daizong -->|"姑息任命"| LiBaochen
        Puguhuanen -.->|"主导受降"| TianChengshi
        Puguhuanen -.->|"主导受降"| LiBaochen
        TianChengshi -->|"投降"| Daizong
        LiBaochen -->|"投降"| Daizong
        LiBaochen -->|"投降"| ShiChaoyi
        ShiChaoyi -->|"众叛亲离，自杀"| ShiChaoyi
        Daizong -.->|"主导受降"| ShiChaoyi
    end

    %% 左右连接
    LongTerm --- Year --- RebelEnd

    %% 应用样式
    class LongTerm containerStyle
    class RebelEnd containerStyle
    class NewOrder containerStyle
`
</script>

<template>
  <div class="phase4-flowchart-container">
    <MermaidChart :code="chartCode" />
  </div>
</template>

<style scoped>
.phase4-flowchart-container {
  width: 100%;
  overflow-x: auto;
  padding: 10px;
  box-sizing: border-box;
}
</style>