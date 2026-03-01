/*
皇室族谱数据结构说明

数据组织方式：
- 按朝代划分，每个朝代包含name和members数组
- members数组包含该朝代所有皇室成员

成员字段含义：
- id: 唯一标识符，格式为 "朝代-姓氏-名字" 或 "朝代-谥号"
- name: 显示名称，可包含子女人数，如 "司马懿 (9子)"
- realName: 真实姓名，不带任何附加信息
- zi: 字（可选），如 "延龄"
- title: 封号或谥号，如 "晋宣帝"、"秦献王"
- isEmperor: 是否为皇帝，true/false
- emperorColor: 皇帝的颜色标识（可选），默认不填，如果有朝代分支，如东晋和南宋，用"#1E90FF"（蓝色）
- generation: 世代，从1开始计数
- father: 父亲的id，null表示无父节点（开国皇帝或第一代）
- mother: 母亲的id（可选）
- children: 子女的id数组
- birthYear: 出生年份，公元前为负数
- deathYear: 死亡年份，公元前为负数
- reignStart: 在位开始年份，只有皇帝才有
- reignEnd: 在位结束年份，只有皇帝才有
- reignTitle: 年号（可选），如 "太和"
- rank: 在兄弟中的排行，从1开始计数
- adoptiveFather: 嗣父的id（可选），用于过继关系

数据维护注意事项：
1. 新增成员时，确保id唯一，避免重复
2. 父子关系必须正确，father字段指向正确的父节点id
3. 世代数(generation)需要正确计算，每一代递增1
4. 皇帝成员必须设置isEmperor为true，并填写reignStart和reignEnd
5. 过继关系通过adoptiveFather字段表示，同时保持原father字段不变
6. 子女人数更新时，需要同步修改name字段中的显示
7. 历史人物的生卒年和在位时间需基于可靠历史资料

示例数据结构：
{
  朝代名称: {
    name: "朝代名称",
    members: [
      {
        id: "dynasty-surname-name",
        name: "姓名 (子女人数)",
        realName: "真实姓名",
        title: "封号/谥号",
        isEmperor: true/false,
        generation: 1,
        father: null, // 开国皇帝或第一代
        children: ["child-id1", "child-id2"],
        birthYear: -2070, // 公元前为负数
        deathYear: -2061,
        reignStart: -2070, // 只有皇帝才有
        reignEnd: -2061, // 只有皇帝才有
        rank: 1 // 兄弟排行
      }
    ]
  }
}
*/
// 从royalFamily目录导入整合后的数据
import { royalFamilyTree as familyTree } from './royalFamily/index.js';

export const royalFamilyTree = familyTree;