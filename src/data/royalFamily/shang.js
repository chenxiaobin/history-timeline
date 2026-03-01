// 商皇室族谱
const shang = {
  name: "商",
  members: [
    {
      id: "shang-tang",
      name: "汤",
      realName: "子履",
      title: "1-商汤",
      isEmperor: true,
      generation: 1,
      father: null,
      mother: null,
      children: ["shang-wai-bian"],
      birthYear: -1670,
      deathYear: -1587,
      reignStart: -1600,
      reignEnd: -1587,
      rank: 1
    },
    {
      id: "shang-wai-bian",
      name: "外丙",
      realName: "子胜",
      title: "2-外丙",
      isEmperor: true,
      generation: 2,
      father: "shang-tang",
      mother: null,
      children: ["shang-zhong-ren"],
      birthYear: -1650,
      deathYear: -1586,
      reignStart: -1587,
      reignEnd: -1586,
      rank: 1
    },
    {
      id: "shang-zhong-ren",
      name: "仲壬",
      realName: "子庸",
      title: "3-仲壬",
      isEmperor: true,
      generation: 2,
      father: "shang-tang",
      mother: null,
      children: ["shang-tai-jia"],
      birthYear: -1646,
      deathYear: -1583,
      reignStart: -1586,
      reignEnd: -1583,
      rank: 2
    },
    {
      id: "shang-tai-jia",
      name: "太甲",
      realName: "子至",
      title: "4-太甲",
      isEmperor: true,
      generation: 3,
      father: "shang-wai-bian",
      mother: null,
      children: ["shang-wu-ding"],
      birthYear: -1630,
      deathYear: -1557,
      reignStart: -1583,
      reignEnd: -1557,
      rank: 1
    },
    {
      id: "shang-wu-ding",
      name: "武丁",
      realName: "子昭",
      title: "5-武丁",
      isEmperor: true,
      generation: 4,
      father: "shang-tai-jia",
      mother: null,
      children: ["shang-zhao-ge"],
      birthYear: -1250,
      deathYear: -1192,
      reignStart: -1250,
      reignEnd: -1192,
      rank: 1
    },
    {
      id: "shang-zhao-ge",
      name: "纣",
      realName: "子受德",
      title: "6-纣王",
      isEmperor: true,
      generation: 5,
      father: "shang-wu-ding",
      mother: null,
      children: [],
      birthYear: -1087,
      deathYear: -1046,
      reignStart: -1075,
      reignEnd: -1046,
      rank: 1
    }
  ]
};

export default shang;