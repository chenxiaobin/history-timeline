// 1. 正统朝代 (主要时间线)
export const majorDynasties = [
  { name: '夏朝', start: -2070, end: -1600, key: 'Xia', destroyed: '商朝' },
  { name: '商朝', start: -1600, end: -1046, key: 'Shang', destroyed: '西周' },
  {
    name: '西周',
    start: -1046,
    end: -771,
    key: 'WesternZhou',
    destroyed: '犬戎'
  },
  {
    name: '东周',
    start: -770,
    end: -256,
    key: 'EasternZhou',
    destroyed: '秦国'
  },
  { name: '秦朝', start: -221, end: -206, key: 'Qin' },
  { name: '楚汉之争', start: -206, end: -202 },
  { name: '西汉', start: -202, end: 9, key: 'WesternHan', destroyed: '新朝' },
  { name: '新朝', start: 9, end: 23, key: 'Xin', destroyed: '东汉' },
  { name: '东汉', start: 25, end: 220, key: 'EasternHan', destroyed: '魏' },
  { name: '三国', start: 220, end: 280 },
  { name: '西晋', start: 265, end: 316, key: 'WesternJin', destroyed: '匈奴' },
  { name: '东晋', start: 317, end: 420, key: 'EasternJin', destroyed: '刘宋' },
  { name: '南朝', start: 420, end: 589 },
  { name: '北朝', start: 386, end: 581 },
  { name: '隋朝', start: 581, end: 618, key: 'Sui', destroyed: '唐朝' },
  { name: '唐朝', start: 618, end: 907, key: 'Tang', destroyed: '后梁' },
  { name: '五代十国', start: 907, end: 960 },
  {
    name: '北宋',
    start: 960,
    end: 1127,
    key: 'NorthernSong',
    destroyed: '金朝'
  },
  {
    name: '南宋',
    start: 1127,
    end: 1279,
    key: 'SouthernSong',
    destroyed: '元朝'
  },
  { name: '元朝', start: 1271, end: 1368, key: 'Yuan', destroyed: '明朝' },
  {
    name: '明朝',
    start: 1368,
    end: '1644-04-25',
    key: 'Ming',
    destroyed: '李自成'
  },
  { name: '后金', start: 1616, end: 1636, key: 'HouJin' },
  {
    name: '清朝',
    start: 1636,
    end: '1912-02-12',
    key: 'Qing',
    destroyed: '中华民国'
  },
  { name: '中华民国', start: '1912-01-01', end: '1949-10-01', key: 'ROC' }
]

// 2. 详细朝代 (细分时期)
export const detailedDynasties = [
  // 东周细分
  { name: '春秋', start: -770, end: -476, belongTo: '东周' },
  { name: '战国', start: -475, end: -221, belongTo: '东周' },
  {
    name: '秦国',
    start: -770,
    end: -221,
    belongTo: '春秋',
    key: 'QinGuo',
    destroyed: '秦朝'
  },
  { name: '韩国', start: -403, end: -230, belongTo: '战国', destroyed: '秦国' },
  { name: '赵国', start: -403, end: -228, belongTo: '战国', destroyed: '秦国' },
  { name: '魏国', start: -403, end: -225, belongTo: '战国', destroyed: '秦国' },
  {
    name: '楚国',
    start: -1042,
    end: -223,
    belongTo: '战国',
    destroyed: '秦国'
  },
  {
    name: '燕国',
    start: -1044,
    end: -222,
    belongTo: '战国',
    destroyed: '秦国'
  },
  {
    name: '齐国',
    start: -1046,
    end: -221,
    belongTo: '战国',
    destroyed: '秦国'
  },
  // 三国细分
  {
    name: '魏',
    start: 220,
    end: 265,
    belongTo: '三国',
    key: 'CaoWei',
    destroyed: '西晋'
  },
  {
    name: '蜀',
    start: 221,
    end: 263,
    belongTo: '三国',
    key: 'ShuHan',
    destroyed: '魏'
  },
  {
    name: '吴',
    start: 222,
    end: 280,
    belongTo: '三国',
    key: 'EasternWu',
    destroyed: '西晋'
  },
  // 南北朝 - 南朝
  {
    name: '刘宋',
    start: 420,
    end: 479,
    belongTo: '南朝',
    key: 'LiuSong',
    destroyed: '南齐'
  },
  {
    name: '南齐',
    start: 479,
    end: 502,
    belongTo: '南朝',
    key: 'SouthernQi',
    destroyed: '梁'
  },
  {
    name: '梁',
    start: 502,
    end: 557,
    belongTo: '南朝',
    key: 'Liang',
    destroyed: '陈'
  },
  {
    name: '陈',
    start: 557,
    end: 589,
    belongTo: '南朝',
    key: 'Chen',
    destroyed: '隋朝'
  },
  // 南北朝 - 北朝
  {
    name: '北魏',
    start: 386,
    end: 534,
    belongTo: '北朝',
    key: 'NorthernWei',
    destroyed: ['东魏', '西魏']
  },
  {
    name: '东魏',
    start: 534,
    end: 550,
    belongTo: '北朝',
    key: 'EasternWei',
    destroyed: '北齐'
  },
  {
    name: '西魏',
    start: 535,
    end: 557,
    belongTo: '北朝',
    key: 'WesternWei',
    destroyed: '北周'
  },
  {
    name: '北齐',
    start: 550,
    end: 577,
    belongTo: '北朝',
    key: 'NorthernQi',
    destroyed: '北周'
  },
  {
    name: '北周',
    start: 557,
    end: 581,
    belongTo: '北朝',
    key: 'NorthernZhou',
    destroyed: '隋朝'
  },
  // 五代 (十国略，太碎了)
  {
    name: '后梁',
    start: 907,
    end: 923,
    belongTo: '五代',
    key: 'LaterLiang',
    destroyed: '后唐'
  },
  {
    name: '后唐',
    start: 923,
    end: 936,
    belongTo: '五代',
    key: 'LaterTang',
    destroyed: '后晋'
  },
  {
    name: '后晋',
    start: 936,
    end: 947,
    belongTo: '五代',
    key: 'LaterJin',
    destroyed: '辽朝'
  },
  {
    name: '后汉',
    start: 947,
    end: 951,
    belongTo: '五代',
    key: 'LaterHan',
    destroyed: '后周'
  },
  {
    name: '后周',
    start: 951,
    end: 960,
    belongTo: '五代',
    key: 'LaterZhou',
    destroyed: '北宋'
  },
  // 十国
  {
    name: '吴',
    start: 902,
    end: 937,
    belongTo: '十国',
    key: 'TenKingdoms_Wu',
    destroyed: '南唐'
  },
  {
    name: '吴越',
    start: 907,
    end: 978,
    belongTo: '十国',
    key: 'TenKingdoms_Wuyue',
    destroyed: '北宋'
  },
  {
    name: '闽',
    start: 909,
    end: 945,
    belongTo: '十国',
    key: 'TenKingdoms_Min',
    destroyed: '南唐'
  },
  {
    name: '楚',
    start: 907,
    end: 951,
    belongTo: '十国',
    key: 'TenKingdoms_Chu',
    destroyed: '南唐'
  },
  {
    name: '南汉',
    start: 917,
    end: 971,
    belongTo: '十国',
    key: 'TenKingdoms_SouthernHan',
    destroyed: '北宋'
  },
  {
    name: '前蜀',
    start: 907,
    end: 925,
    belongTo: '十国',
    key: 'TenKingdoms_FormerShu',
    destroyed: '后唐'
  },
  {
    name: '后蜀',
    start: 934,
    end: 965,
    belongTo: '十国',
    key: 'TenKingdoms_LaterShu',
    destroyed: '北宋'
  },
  {
    name: '荆南',
    start: 924,
    end: 963,
    belongTo: '十国',
    key: 'TenKingdoms_Jingnan',
    destroyed: '北宋'
  },
  {
    name: '南唐',
    start: 937,
    end: 975,
    belongTo: '十国',
    key: 'TenKingdoms_SouthernTang',
    destroyed: '北宋'
  },
  {
    name: '北汉',
    start: 951,
    end: 979,
    belongTo: '十国',
    key: 'TenKingdoms_NorthernHan',
    destroyed: '北宋'
  },
  // 中华民国
  {
    name: '南京临时政府时期',
    start: '1912-01-01',
    end: '1912-04-02',
    belongTo: '中华民国'
  },
  {
    name: '北洋政府时期',
    start: '1912-03-12',
    end: '1928-12-29',
    belongTo: '中华民国'
  },
  {
    name: '国民政府时期‌',
    start: '1927-04-18',
    end: '1949-10-01',
    belongTo: '中华民国'
  }
]

// 3. 非正统朝代 (旁支/并立)
export const otherDynasties = [
  { name: '犬戎', start: -780, end: -771 },
  { name: '匈奴', start: 306, end: 316 },
  { name: '辽朝', start: 907, end: 1125, key: 'Liao' },
  { name: '西夏', start: 1038, end: 1227, key: 'WesternXia' },
  { name: '金朝', start: 1115, end: 1234, key: 'Jin' },
  { name: '李自成', start: 1606, end: 1645 }
]
