// 隋朝皇室族谱
const sui = {
    name: "隋",
    members: [
      // 隋文帝 杨坚
      {
        id: "sui-yang-jian",
        name: "杨坚 (5子)",
        realName: "杨坚",
        zi: "那罗延",
        title: "1-隋文帝",
        isEmperor: true,
        generation: 1,
        father: null,
        mother: null,
        children: ["sui-yang-di", "sui-zhang-shun", "sui-liu-shan", "sui-liu-yan", "sui-liu-wei"],
        birthYear: 541,
        deathYear: 604,
        reignStart: 581,
        reignEnd: 604,
        reignTitle: "开皇,仁寿",
        rank: 1
      },
      // 隋炀帝 杨广
      {
        id: "sui-yang-di",
        name: "杨广 (4子)",
        realName: "杨广",
        zi: "阿摐",
        title: "2-隋炀帝",
        isEmperor: true,
        generation: 2,
        father: "sui-yang-jian",
        mother: null,
        children: ["sui-yan-gong", "sui-cheng-gong", "sui-shang-gong", "sui-yi-gong"],
        birthYear: 569,
        deathYear: 618,
        reignStart: 604,
        reignEnd: 618,
        reignTitle: "大业",
        rank: 2
      },
      // 房陵王 杨勇
      {
        id: "sui-zhang-shun",
        name: "杨勇",
        realName: "杨勇",
        zi: "睍地伐",
        title: "房陵王",
        isEmperor: false,
        generation: 2,
        father: "sui-yang-jian",
        mother: null,
        children: [],
        birthYear: 566,
        deathYear: 604,
        rank: 1
      },
      // 秦孝王 杨俊
      {
        id: "sui-liu-shan",
        name: "杨俊 (2子)",
        realName: "杨俊",
        zi: "阿祗",
        title: "秦孝王",
        isEmperor: false,
        generation: 2,
        father: "sui-yang-jian",
        mother: null,
        children: ["sui-yang-hao", "sui-yang-ming"],
        birthYear: 571,
        deathYear: 600,
        rank: 3
      },
      // 蜀王 杨秀
      {
        id: "sui-liu-yan",
        name: "杨秀",
        realName: "杨秀",
        zi: "阿摩",
        title: "蜀王",
        isEmperor: false,
        generation: 2,
        father: "sui-yang-jian",
        mother: null,
        children: [],
        birthYear: 573,
        deathYear: 618,
        rank: 4
      },
      // 汉王 杨谅
      {
        id: "sui-liu-wei",
        name: "杨谅",
        realName: "杨谅",
        zi: "德章",
        title: "汉王",
        isEmperor: false,
        generation: 2,
        father: "sui-yang-jian",
        mother: null,
        children: [],
        birthYear: 575,
        deathYear: 605,
        rank: 5
      },
      // 元德太子 杨昭（追谥隋成帝）
      {
        id: "sui-yan-gong",
        name: "杨昭 (3子)",
        realName: "杨昭",
        zi: "世明",
        title: "元德太子（追谥隋成帝）",
        isEmperor: false,
        generation: 3,
        father: "sui-yang-di",
        mother: null,
        children: ["sui-gong-di-you"],
        birthYear: 584,
        deathYear: 606,
        rank: 1
      },
      // 齐王 杨暕
      {
        id: "sui-cheng-gong",
        name: "杨暕",
        realName: "杨暕",
        zi: "世朏",
        title: "齐王",
        isEmperor: false,
        generation: 3,
        father: "sui-yang-di",
        mother: null,
        children: [],
        birthYear: 585,
        deathYear: 618,
        rank: 2
      },
      // 赵王 杨杲
      {
        id: "sui-shang-gong",
        name: "杨杲",
        realName: "杨杲",
        zi: "世明",
        title: "赵王",
        isEmperor: false,
        generation: 3,
        father: "sui-yang-di",
        mother: null,
        children: [],
        birthYear: 607,
        deathYear: 618,
        rank: 3
      },
      // 隋恭帝 杨侗
      {
        id: "sui-yi-gong",
        name: "杨侗",
        realName: "杨侗",
        zi: "仁谨",
        title: "5-隋恭帝（王世充立）",
        isEmperor: true,
        generation: 4,
        father: "sui-yan-gong",
        mother: null,
        children: [],
        birthYear: 605,
        deathYear: 619,
        reignStart: 618,
        reignEnd: 619,
        reignTitle: "皇泰",
        rank: 2
      },
      // 隋恭帝 杨侑
      {
        id: "sui-gong-di-you",
        name: "杨侑",
        realName: "杨侑",
        zi: "仁辅",
        title: "3-隋恭帝（李渊立）",
        isEmperor: true,
        generation: 4,
        father: "sui-yan-gong",
        mother: null,
        children: [],
        birthYear: 605,
        deathYear: 619,
        reignStart: 617,
        reignEnd: 618,
        reignTitle: "义宁",
        rank: 1
      },
      // 秦王 杨浩（宇文化及所立）
      {
        id: "sui-yang-hao",
        name: "杨浩",
        realName: "杨浩",
        title: "4-秦王（宇文化及所立）",
        isEmperor: true,
        generation: 3,
        father: "sui-liu-shan",
        mother: null,
        children: [],
        birthYear: 586,
        deathYear: 619,
        reignStart: 618,
        reignEnd: 619,
        rank: 1
      },
      // 秦王 杨明
      {
        id: "sui-yang-ming",
        name: "杨明",
        realName: "杨明",
        title: "秦王",
        isEmperor: false,
        generation: 3,
        father: "sui-liu-shan",
        mother: null,
        children: [],
        birthYear: 590,
        deathYear: 619,
        rank: 2
      }
    ]
  }

export default sui;