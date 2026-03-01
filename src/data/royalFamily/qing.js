// 清朝皇室族谱
const qing = {
    name: "清",
    members: [
      // 清太祖 努尔哈赤
      {
        id: "qing-nurhachi",
        name: "努尔哈赤 (16子)",
        realName: "爱新觉罗·努尔哈赤",
        title: "1-清太祖",
        isEmperor: false,
        generation: 1,
        father: null,
        mother: null,
        children: ["qing-hongtaiji"],
        birthYear: 1559,
        deathYear: 1626,
        reignStart: 1616,
        reignEnd: 1626,
        reignTitle: "天命",
        rank: 1
      },
      // 清太宗 皇太极
      {
        id: "qing-hongtaiji",
        name: "皇太极 (11子)",
        realName: "爱新觉罗·皇太极",
        title: "2-清太宗",
        isEmperor: true,
        generation: 2,
        father: "qing-nurhachi",
        mother: null,
        children: ["qing-fulin"],
        birthYear: 1592,
        deathYear: 1643,
        reignStart: 1626,
        reignEnd: 1643,
        reignTitle: "天聪,崇德",
        rank: 8
      },
      // 清世祖 福临
      {
        id: "qing-fulin",
        name: "福临 (8子)",
        realName: "爱新觉罗·福临",
        title: "3-清世祖",
        isEmperor: true,
        generation: 3,
        father: "qing-hongtaiji",
        mother: null,
        children: ["qing-xuanye"],
        birthYear: 1638,
        deathYear: 1661,
        reignStart: 1643,
        reignEnd: 1661,
        reignTitle: "顺治",
        rank: 9
      },
      // 清圣祖 玄烨
      {
        id: "qing-xuanye",
        name: "玄烨 (35子)",
        realName: "爱新觉罗·玄烨",
        title: "4-清圣祖",
        isEmperor: true,
        generation: 4,
        father: "qing-fulin",
        mother: null,
        children: ["qing-yinzhen", "qing-yinzhi", "qing-yinreng", "qing-yinzhi2", "qing-yinsi", "qing-yintang", "qing-yin'e", "qing-yinxiang", "qing-yinyou"],
        birthYear: 1654,
        deathYear: 1722,
        reignStart: 1661,
        reignEnd: 1722,
        reignTitle: "康熙",
        rank: 3
      },
      // 胤禔 大阿哥
      {
        id: "qing-yinzhi",
        name: "胤禔",
        realName: "爱新觉罗·胤禔",
        title: "直郡王",
        isEmperor: false,
        generation: 5,
        father: "qing-xuanye",
        mother: null,
        children: [],
        birthYear: 1672,
        deathYear: 1735,
        rank: 1
      },
      // 胤礽 二阿哥（废太子）
      {
        id: "qing-yinreng",
        name: "胤礽",
        realName: "爱新觉罗·胤礽",
        title: "废太子",
        isEmperor: false,
        generation: 5,
        father: "qing-xuanye",
        mother: null,
        children: [],
        birthYear: 1674,
        deathYear: 1725,
        rank: 2
      },
      // 胤祉 三阿哥
      {
        id: "qing-yinzhi2",
        name: "胤祉",
        realName: "爱新觉罗·胤祉",
        title: "诚郡王",
        isEmperor: false,
        generation: 5,
        father: "qing-xuanye",
        mother: null,
        children: [],
        birthYear: 1677,
        deathYear: 1732,
        rank: 3
      },
      // 清世宗 胤禛
      {
        id: "qing-yinzhen",
        name: "胤禛 (10子)",
        realName: "爱新觉罗·胤禛",
        title: "5-清世宗",
        isEmperor: true,
        generation: 5,
        father: "qing-xuanye",
        mother: null,
        children: ["qing-hongli"],
        birthYear: 1678,
        deathYear: 1735,
        reignStart: 1722,
        reignEnd: 1735,
        reignTitle: "雍正",
        rank: 4
      },
      // 胤禩 八阿哥
      {
        id: "qing-yinsi",
        name: "胤禩",
        realName: "爱新觉罗·胤禩",
        title: "廉亲王",
        isEmperor: false,
        generation: 5,
        father: "qing-xuanye",
        mother: null,
        children: [],
        birthYear: 1681,
        deathYear: 1726,
        rank: 8
      },
      // 胤禟 九阿哥
      {
        id: "qing-yintang",
        name: "胤禟",
        realName: "爱新觉罗·胤禟",
        title: "贝子",
        isEmperor: false,
        generation: 5,
        father: "qing-xuanye",
        mother: null,
        children: [],
        birthYear: 1683,
        deathYear: 1726,
        rank: 9
      },
      // 胤䄉 十阿哥
      {
        id: "qing-yin'e",
        name: "胤䄉",
        realName: "爱新觉罗·胤䄉",
        title: "敦郡王",
        isEmperor: false,
        generation: 5,
        father: "qing-xuanye",
        mother: null,
        children: [],
        birthYear: 1683,
        deathYear: 1741,
        rank: 10
      },
      // 胤祥 十三阿哥
      {
        id: "qing-yinxiang",
        name: "胤祥",
        realName: "爱新觉罗·胤祥",
        title: "怡亲王",
        isEmperor: false,
        generation: 5,
        father: "qing-xuanye",
        mother: null,
        children: [],
        birthYear: 1686,
        deathYear: 1730,
        rank: 13
      },
      // 胤禵 十四阿哥
      {
        id: "qing-yinyou",
        name: "胤禵",
        realName: "爱新觉罗·胤禵",
        title: "恂郡王",
        isEmperor: false,
        generation: 5,
        father: "qing-xuanye",
        mother: null,
        children: [],
        birthYear: 1688,
        deathYear: 1755,
        rank: 14
      },
      // 清高宗 弘历
      {
        id: "qing-hongli",
        name: "弘历 (17子)",
        realName: "爱新觉罗·弘历",
        title: "6-清高宗",
        isEmperor: true,
        generation: 6,
        father: "qing-yinzhen",
        mother: null,
        children: ["qing-yongyan"],
        birthYear: 1711,
        deathYear: 1799,
        reignStart: 1735,
        reignEnd: 1796,
        reignTitle: "乾隆",
        rank: 4
      },
      // 清仁宗 颙琰
      {
        id: "qing-yongyan",
        name: "颙琰 (5子)",
        realName: "爱新觉罗·颙琰",
        title: "7-清仁宗",
        isEmperor: true,
        generation: 7,
        father: "qing-hongli",
        mother: null,
        children: ["qing-mianning"],
        birthYear: 1760,
        deathYear: 1820,
        reignStart: 1796,
        reignEnd: 1820,
        reignTitle: "嘉庆",
        rank: 15
      },
      // 清宣宗 旻宁
      {
        id: "qing-mianning",
        name: "旻宁 (9子)",
        realName: "爱新觉罗·旻宁",
        title: "8-清宣宗",
        isEmperor: true,
        generation: 8,
        father: "qing-yongyan",
        mother: null,
        children: ["qing-yizhu", "qing-yixin"],
        birthYear: 1782,
        deathYear: 1850,
        reignStart: 1820,
        reignEnd: 1850,
        reignTitle: "道光",
        rank: 2
      },
      // 清文宗 奕詝
      {
        id: "qing-yizhu",
        name: "奕詝 (2子)",
        realName: "爱新觉罗·奕詝",
        title: "9-清文宗",
        isEmperor: true,
        generation: 9,
        father: "qing-mianning",
        mother: null,
        children: ["qing-zaichun"],
        birthYear: 1831,
        deathYear: 1861,
        reignStart: 1850,
        reignEnd: 1861,
        reignTitle: "咸丰",
        rank: 4
      },
      // 恭亲王 奕䜣（鬼子六）
      {
        id: "qing-yixin",
        name: "奕䜣",
        realName: "爱新觉罗·奕䜣",
        title: "恭亲王",
        isEmperor: false,
        generation: 9,
        father: "qing-mianning",
        mother: null,
        children: [],
        birthYear: 1833,
        deathYear: 1898,
        rank: 6
      },
      // 清穆宗 载淳
      {
        id: "qing-zaichun",
        name: "载淳",
        realName: "爱新觉罗·载淳",
        title: "10-清穆宗",
        isEmperor: true,
        generation: 10,
        father: "qing-yizhu",
        mother: null,
        children: [],
        birthYear: 1856,
        deathYear: 1875,
        reignStart: 1861,
        reignEnd: 1875,
        reignTitle: "同治",
        rank: 1
      },
      // 清德宗 载湉
      {
        id: "qing-zaitian",
        name: "载湉",
        realName: "爱新觉罗·载湉",
        title: "11-清德宗",
        isEmperor: true,
        generation: 10,
        father: "qing-yixuan",
        mother: null,
        children: [],
        birthYear: 1871,
        deathYear: 1908,
        reignStart: 1875,
        reignEnd: 1908,
        reignTitle: "光绪",
        rank: 1
      },
      // 宣统帝 溥仪
      {
        id: "qing-puyi",
        name: "溥仪",
        realName: "爱新觉罗·溥仪",
        title: "12-宣统帝",
        isEmperor: true,
        generation: 11,
        father: "qing-zaifeng",
        mother: null,
        children: [],
        birthYear: 1906,
        deathYear: 1967,
        reignStart: 1908,
        reignEnd: 1912,
        reignTitle: "宣统",
        rank: 1
      },
      // 醇亲王 奕譞
      {
        id: "qing-yixuan",
        name: "奕譞 (7子)",
        realName: "爱新觉罗·奕譞",
        title: "醇亲王",
        isEmperor: false,
        generation: 9,
        father: "qing-mianning",
        mother: null,
        children: ["qing-zaitian", "qing-zaifeng"],
        birthYear: 1840,
        deathYear: 1891,
        rank: 7
      },
      // 醇亲王 载沣
      {
        id: "qing-zaifeng",
        name: "载沣 (3子)",
        realName: "爱新觉罗·载沣",
        title: "醇亲王",
        isEmperor: false,
        generation: 10,
        father: "qing-yixuan",
        mother: null,
        children: ["qing-puyi"],
        birthYear: 1883,
        deathYear: 1951,
        rank: 5
      }
    ]
  }

export default qing;