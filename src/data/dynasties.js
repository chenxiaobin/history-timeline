// 1. 正统朝代 (主要时间线)
export const majorDynasties = [
  { name: '夏朝', start: -2070, end: -1600, key: 'Xia' },
  { name: '商朝', start: -1600, end: -1046, key: 'Shang' },
  { name: '西周', start: -1046, end: -771, key: 'WesternZhou' },
  { name: '东周', start: -770, end: -256, key: 'EasternZhou' },
  { name: '秦朝', start: -221, end: -206, key: 'Qin' },
  { name: '西汉', start: -202, end: 9, key: 'WesternHan' },
  { name: '新朝', start: 9, end: 23, key: 'Xin' },
  { name: '东汉', start: 25, end: 220, key: 'EasternHan' },
  { name: '三国', start: 220, end: 280 },
  { name: '西晋', start: 265, end: 316, key: 'WesternJin' },
  { name: '东晋', start: 317, end: 420, key: 'EasternJin' },
  { name: '南朝', start: 420, end: 589 },
  { name: '北朝', start: 439, end: 581 },
  { name: '隋朝', start: 581, end: 618, key: 'Sui' },
  { name: '唐朝', start: 618, end: 907, key: 'Tang' },
  { name: '五代十国', start: 907, end: 960 },
  { name: '北宋', start: 960, end: 1127, key: 'NorthernSong' },
  { name: '南宋', start: 1127, end: 1279, key: 'SouthernSong' },
  { name: '元朝', start: 1271, end: 1368, key: 'Yuan' },
  { name: '明朝', start: 1368, end: 1644, key: 'Ming' },
  { name: '清朝', start: 1644, end: 1912, key: 'Qing' },
  { name: '中华民国', start: 1912, end: 1949 }
]

// 2. 详细朝代 (细分时期)
export const detailedDynasties = [
  // 东周细分
  { name: '春秋', start: -770, end: -476, belongTo: '东周' },
  { name: '战国', start: -475, end: -221, belongTo: '东周' },
  // 三国细分
  { name: '魏', start: 220, end: 265, belongTo: '三国', key: 'CaoWei' },
  { name: '蜀', start: 221, end: 263, belongTo: '三国', key: 'ShuHan' },
  { name: '吴', start: 222, end: 280, belongTo: '三国', key: 'EasternWu' },
  // 南北朝 - 南朝
  { name: '刘宋', start: 420, end: 479, belongTo: '南朝', key: 'LiuSong' },
  { name: '南齐', start: 479, end: 502, belongTo: '南朝', key: 'SouthernQi' },
  { name: '梁', start: 502, end: 557, belongTo: '南朝', key: 'Liang' },
  { name: '陈', start: 557, end: 589, belongTo: '南朝', key: 'Chen' },
  // 南北朝 - 北朝
  { name: '北魏', start: 386, end: 534, belongTo: '北朝', key: 'NorthernWei' },
  { name: '东魏', start: 534, end: 550, belongTo: '北朝', key: 'EasternWei' },
  { name: '西魏', start: 535, end: 557, belongTo: '北朝', key: 'WesternWei' },
  { name: '北齐', start: 550, end: 577, belongTo: '北朝', key: 'NorthernQi' },
  { name: '北周', start: 557, end: 581, belongTo: '北朝', key: 'NorthernZhou' },
  // 五代 (十国略，太碎了)
  {
    name: '后梁',
    start: 907,
    end: 923,
    belongTo: '五代',
    key: 'LaterLiang'
  },
  {
    name: '后唐',
    start: 923,
    end: 936,
    belongTo: '五代',
    key: 'LaterTang'
  },
  { name: '后晋', start: 936, end: 947, belongTo: '五代', key: 'LaterJin' },
  { name: '后汉', start: 947, end: 951, belongTo: '五代', key: 'LaterHan' },
  {
    name: '后周',
    start: 951,
    end: 960,
    belongTo: '五代',
    key: 'LaterZhou'
  },
  // 十国
  { name: '吴', start: 902, end: 937, belongTo: '十国', key: 'TenKingdoms_Wu' },
  {
    name: '吴越',
    start: 907,
    end: 978,
    belongTo: '十国',
    key: 'TenKingdoms_Wuyue'
  },
  {
    name: '闽',
    start: 909,
    end: 945,
    belongTo: '十国',
    key: 'TenKingdoms_Min'
  },
  {
    name: '楚',
    start: 907,
    end: 951,
    belongTo: '十国',
    key: 'TenKingdoms_Chu'
  },
  {
    name: '南汉',
    start: 917,
    end: 971,
    belongTo: '十国',
    key: 'TenKingdoms_SouthernHan'
  },
  {
    name: '前蜀',
    start: 907,
    end: 925,
    belongTo: '十国',
    key: 'TenKingdoms_FormerShu'
  },
  {
    name: '后蜀',
    start: 934,
    end: 965,
    belongTo: '十国',
    key: 'TenKingdoms_LaterShu'
  },
  {
    name: '荆南',
    start: 924,
    end: 963,
    belongTo: '十国',
    key: 'TenKingdoms_Jingnan'
  },
  {
    name: '南唐',
    start: 937,
    end: 975,
    belongTo: '十国',
    key: 'TenKingdoms_SouthernTang'
  },
  {
    name: '北汉',
    start: 951,
    end: 979,
    belongTo: '十国',
    key: 'TenKingdoms_NorthernHan'
  }
]

// 3. 非正统朝代 (旁支/并立)
export const otherDynasties = [
  { name: '辽朝', start: 907, end: 1125, key: 'Liao' },
  { name: '西夏', start: 1038, end: 1227, key: 'WesternXia' },
  { name: '金朝', start: 1115, end: 1234, key: 'Jin' }
]
