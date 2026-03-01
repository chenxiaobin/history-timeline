// 秦朝皇室族谱
const qin = {
  name: "秦朝",
  members: [
    {
      id: "qin-shi-huang",
      name: "嬴政",
      realName: "嬴政",
      title: "1-秦始皇",
      isEmperor: true,
      generation: 1,
      father: null,
      mother: null,
      children: ["qin-er-shi", "qin-zi-ying"],
      birthYear: -259,
      deathYear: -210,
      reignStart: -221,
      reignEnd: -210,
      rank: 1
    },
    {
      id: "qin-er-shi",
      name: "胡亥",
      realName: "胡亥",
      title: "2-秦二世",
      isEmperor: true,
      generation: 2,
      father: "qin-shi-huang",
      mother: null,
      children: [],
      birthYear: -230,
      deathYear: -207,
      reignStart: -210,
      reignEnd: -207,
      rank: 2
    },
    {
      id: "qin-zi-ying",
      name: "子婴",
      realName: "子婴",
      title: "3-秦王子婴",
      isEmperor: true,
      generation: 2,
      father: "qin-shi-huang",
      mother: null,
      children: [],
      birthYear: -240,
      deathYear: -206,
      reignStart: -207,
      reignEnd: -206,
      rank: 1
    }
  ]
};

export default qin;