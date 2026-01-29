// 1. 正统朝代 (主要时间线)
export const majorDynasties = [
  {
    name: '夏朝',
    start: -2070,
    end: -1600,
    key: 'Xia',
    color: '#501010',
    destroyed: '商朝'
  },
  {
    name: '商朝',
    start: -1600,
    end: -1046,
    key: 'Shang',
    color: '#EAE8E8',
    destroyed: '西周'
  },
  {
    name: '西周',
    start: -1046,
    end: -771,
    key: 'WesternZhou',
    color: '#C00000',
    destroyed: '犬戎'
  },
  {
    name: '东周',
    start: -770,
    end: -256,
    key: 'EasternZhou',
    color: '#C00000',
    destroyed: '秦国'
  },
  { name: '秦朝', start: -221, end: -206, key: 'Qin', color: '#101010' },
  {
    name: '西汉',
    start: -202,
    end: 9,
    key: 'WesternHan',
    color: '#FFD700',
    destroyed: '新朝'
  },
  {
    name: '新朝',
    start: 9,
    end: 23,
    key: 'Xin',
    color: '#C00000',
    destroyed: '东汉'
  },
  {
    name: '东汉',
    start: 25,
    end: 220,
    key: 'EasternHan',
    color: '#C00000',
    destroyed: '魏'
  },
  {
    name: '西晋',
    start: 265,
    end: 316,
    key: 'WesternJin',
    color: '#C00000',
    destroyed: '匈奴'
  },
  {
    name: '东晋',
    start: 317,
    end: 420,
    key: 'EasternJin',
    color: '#C00000',
    cdestroyed: '刘宋'
  },
  { name: '南朝', start: 420, end: 589 },
  { name: '北朝', start: 439, end: 581 },
  {
    name: '隋朝',
    start: 581,
    end: 618,
    key: 'Sui',
    color: '#FFD700',
    destroyed: '唐朝'
  },
  {
    name: '唐朝',
    start: 618,
    end: 907,
    key: 'Tang',
    color: '#FFD700',
    destroyed: '后梁'
  },
  { name: '五代十国', start: 907, end: 979 },
  {
    name: '北宋',
    start: 960,
    end: 1127,
    key: 'NorthernSong',
    color: '#C00000',
    destroyed: '金朝'
  },
  {
    name: '南宋',
    start: 1127,
    end: 1279,
    key: 'SouthernSong',
    color: '#C00000',
    destroyed: '元朝'
  },
  {
    name: '元朝',
    start: 1271,
    end: 1368,
    key: 'Yuan',
    color: '#0055A4',
    destroyed: '明朝'
  },
  {
    name: '明朝',
    start: 1368,
    end: '1644-04-25',
    key: 'Ming',
    color: '#BE0032 ',
    destroyed: '李自成'
  },
  {
    name: '后金',
    start: 1616,
    end: 1636,
    key: 'HouJin',
    belongTo: '少数民族政权'
  },
  {
    name: '清朝',
    start: 1636,
    end: '1912-02-12',
    key: 'Qing',
    color: '#FFD700 ',
    destroyed: '中华民国'
  },
  {
    name: '中华民国',
    start: '1912-01-01',
    end: '1949-10-01',
    key: 'ROC',
    color: '#1C3C8C'
  }
]

// 2. 详细朝代 (细分时期)
export const detailedDynasties = [
  // 东周细分
  // { name: '春秋', start: -770, end: -476, belongTo: '东周' },
  // { name: '战国', start: -475, end: -221, belongTo: '东周' },
  {
    name: '秦国',
    start: -770,
    end: -221,
    belongTo: ['春秋', '战国'],
    key: 'QinGuo',
    color: '#101010',
    destroyed: '秦朝'
  },
  {
    name: '晋国',
    start: -1033,
    end: -376,
    belongTo: '春秋',
    color: '#8B0000',
    destroyed: ['韩国', '魏国', '赵国']
  },
  {
    name: '韩国',
    start: -403,
    end: -230,
    belongTo: '战国',
    color: '#808080',
    destroyed: '秦国'
  },
  {
    name: '赵国',
    start: -403,
    end: -228,
    belongTo: '战国',
    color: '#808080',
    destroyed: '秦国'
  },
  {
    name: '魏国',
    start: -403,
    end: -225,
    belongTo: '战国',
    color: '#808080',
    destroyed: '秦国'
  },
  {
    name: '楚国',
    start: -1042,
    end: -223,
    belongTo: ['春秋', '战国'],
    color: '#C00000',
    destroyed: '秦国'
  },
  {
    name: '燕国',
    start: -1044,
    end: -222,
    belongTo: '战国',
    color: '#101010',
    destroyed: '秦国'
  },
  {
    name: '齐国（姜）',
    start: -1046,
    end: -386,
    color: '#800080',
    belongTo: '春秋',
    destroyed: '齐国（田）'
  },
  {
    name: '齐国（田）',
    start: -386,
    end: -221,
    color: '#006400',
    belongTo: '战国',
    destroyed: '秦国'
  },
  {
    name: '宋国',
    start: -1040,
    end: -286,
    color: '#B22222',
    belongTo: '春秋',
    destroyed: '齐国（田）'
  },
  // 三国细分
  {
    name: '魏',
    start: 220,
    end: 265,
    belongTo: '三国',
    key: 'CaoWei',
    color: '#FFD700',
    destroyed: '西晋'
  },
  {
    name: '蜀',
    start: 221,
    end: 263,
    belongTo: '三国',
    key: 'ShuHan',
    color: '#C00000',
    destroyed: '魏'
  },
  {
    name: '吴',
    start: 222,
    end: 280,
    belongTo: '三国',
    key: 'EasternWu',
    color: '#008080',
    destroyed: '西晋'
  },
  {
    name: '成汉（氐）',
    start: 304,
    end: 347,
    belongTo: '五胡乱华',
    color: '#DAA520',
    destroyed: '东晋'
  },
  {
    name: '汉赵（匈奴）',
    start: 304,
    end: 329,
    belongTo: '五胡乱华',
    color: '#2C3E50',
    destroyed: '后赵（羯）'
  },
  {
    name: '后赵（羯）',
    start: 319,
    end: 351,
    belongTo: '五胡乱华',
    color: '#B22222',
    destroyed: '冉魏'
  },
  {
    name: '前凉',
    start: 317,
    end: 376,
    belongTo: '五胡乱华',
    destroyed: '前秦（氐）'
  },
  {
    name: '前燕（鲜卑）',
    start: 337,
    end: 370,
    belongTo: '五胡乱华',
    color: '#228B22',
    destroyed: '前秦（氐）'
  },
  {
    name: '前秦（氐）',
    start: 351,
    end: 394,
    belongTo: '五胡乱华',
    color: '#DAA520',
    destroyed: '后秦（羌）'
  },
  {
    name: '后秦（羌）',
    start: 384,
    end: 417,
    belongTo: '五胡乱华',
    color: '#dddddd',
    destroyed: '东晋'
  },
  {
    name: '后凉（氐）',
    start: 386,
    end: 403,
    belongTo: '五胡乱华',
    color: '#DAA520',
    destroyed: '后秦（羌）'
  },
  {
    name: '南燕（鲜卑）',
    start: 398,
    end: 410,
    belongTo: '五胡乱华',
    color: '#228B22',
    destroyed: '东晋'
  },
  {
    name: '后燕（鲜卑）',
    start: 384,
    end: 409,
    belongTo: '五胡乱华',
    color: '#228B22',
    destroyed: '北燕'
  },
  {
    name: '西凉',
    start: 400,
    end: 420,
    belongTo: '五胡乱华',
    destroyed: '北凉（匈奴）'
  },
  {
    name: '北凉（匈奴）',
    start: 397,
    end: 439,
    belongTo: '五胡乱华',
    color: '#2C3E50',
    destroyed: '北魏'
  },
  {
    name: '北燕',
    start: 407,
    end: 436,
    belongTo: '五胡乱华',
    destroyed: '北魏'
  },
  {
    name: '南凉（鲜卑）',
    start: 397,
    end: 414,
    belongTo: '五胡乱华',
    destroyed: '西秦（鲜卑）'
  },
  {
    name: '西秦（鲜卑）',
    start: 385,
    end: 431,
    belongTo: '五胡乱华',
    color: '#228B22',
    destroyed: '胡夏（匈奴）'
  },
  {
    name: '胡夏（匈奴）',
    start: 407,
    end: 431,
    belongTo: '五胡乱华',
    color: '#2C3E50',
    destroyed: '吐谷浑'
  },
  // 南北朝 - 南朝
  {
    name: '刘宋',
    start: 420,
    end: 479,
    belongTo: '南朝',
    key: 'LiuSong',
    color: '#C00000',
    destroyed: '南齐'
  },
  {
    name: '南齐',
    start: 479,
    end: 502,
    belongTo: '南朝',
    key: 'SouthernQi',
    color: '#C00000',
    destroyed: '梁'
  },
  {
    name: '梁',
    start: 502,
    end: 557,
    belongTo: '南朝',
    key: 'Liang',
    color: '#C00000',
    destroyed: '陈'
  },
  {
    name: '陈',
    start: 557,
    end: 589,
    belongTo: '南朝',
    key: 'Chen',
    color: '#C00000',
    destroyed: '隋朝'
  },
  // 南北朝 - 北朝
  {
    name: '北魏',
    start: 386,
    end: 534,
    belongTo: '北朝',
    key: 'NorthernWei',
    color: '#101010',
    destroyed: ['东魏', '西魏']
  },
  {
    name: '东魏',
    start: 534,
    end: 550,
    belongTo: '北朝',
    key: 'EasternWei',
    color: '#101010',
    destroyed: '北齐'
  },
  {
    name: '西魏',
    start: 535,
    end: 557,
    belongTo: '北朝',
    key: 'WesternWei',
    color: '#101010',
    destroyed: '北周'
  },
  {
    name: '北齐',
    start: 550,
    end: 577,
    belongTo: '北朝',
    key: 'NorthernQi',
    color: '#101010',
    destroyed: '北周'
  },
  {
    name: '北周',
    start: 557,
    end: 581,
    belongTo: '北朝',
    key: 'NorthernZhou',
    color: '#101010',
    destroyed: '隋朝'
  },
  // 五代
  {
    name: '后梁',
    start: 907,
    end: 923,
    belongTo: '五代',
    key: 'LaterLiang',
    color: '#C00000',
    destroyed: '后唐'
  },
  {
    name: '后唐',
    start: 923,
    end: 936,
    belongTo: '五代',
    key: 'LaterTang',
    color: '#EAE8E8',
    destroyed: '后晋'
  },
  {
    name: '后晋',
    start: 936,
    end: 947,
    belongTo: '五代',
    key: 'LaterJin',
    color: '#EAE8E8',
    destroyed: '辽朝'
  },
  {
    name: '后汉',
    start: 947,
    end: 951,
    belongTo: '五代',
    key: 'LaterHan',
    color: '#C00000',
    destroyed: '后周'
  },
  {
    name: '后周',
    start: 951,
    end: 960,
    belongTo: '五代',
    key: 'LaterZhou',
    color: '#C00000',
    destroyed: '北宋'
  },
  // 十国
  {
    name: '前蜀',
    start: 907,
    end: 925,
    belongTo: '十国',
    key: 'TenKingdoms_FormerShu',
    color: '#FFA500',
    destroyed: '后唐'
  },
  {
    name: '荆南',
    start: 924,
    end: 963,
    belongTo: '十国',
    key: 'TenKingdoms_Jingnan',
    color: '#FFA500',
    destroyed: '北宋'
  },
  {
    name: '后蜀',
    start: 934,
    end: 965,
    belongTo: '十国',
    key: 'TenKingdoms_LaterShu',
    color: '#FFA500',
    destroyed: '北宋'
  },
  {
    name: '南汉',
    start: 917,
    end: 971,
    belongTo: '十国',
    key: 'TenKingdoms_SouthernHan',
    color: '#FFA500',
    destroyed: '北宋'
  },
  {
    name: '南唐',
    start: 937,
    end: 975,
    belongTo: '十国',
    key: 'TenKingdoms_SouthernTang',
    color: '#FFA500',
    destroyed: '北宋'
  },
  {
    name: '南吴',
    start: 902,
    end: 937,
    belongTo: '十国',
    key: 'TenKingdoms_Wu',
    color: '#FFA500',
    destroyed: '南唐'
  },
  {
    name: '闽',
    start: 909,
    end: 945,
    belongTo: '十国',
    key: 'TenKingdoms_Min',
    color: '#FFA500',
    destroyed: '南唐'
  },
  {
    name: '楚',
    start: 907,
    end: 951,
    belongTo: '十国',
    key: 'TenKingdoms_Chu',
    color: '#FFA500',
    destroyed: '南唐'
  },
  {
    name: '吴越',
    start: 907,
    end: 978,
    belongTo: '十国',
    key: 'TenKingdoms_Wuyue',
    color: '#FFA500',
    destroyed: '北宋'
  },
  {
    name: '北汉',
    start: 951,
    end: 979,
    belongTo: '十国',
    key: 'TenKingdoms_NorthernHan',
    color: '#FFA500',
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
  { name: '冉魏', start: 350, end: 352 },
  { name: '吐谷浑', start: 329, end: 663 },
  { name: '吐蕃', start: 618, end: 842 },
  { name: '辽朝', start: 907, end: 1125, key: 'Liao' },
  { name: '西夏', start: 1038, end: 1227, key: 'WesternXia' },
  { name: '金朝', start: 1115, end: 1234, key: 'Jin' },
  { name: '李自成', start: 1606, end: 1645 }
]

// 4. 特殊历史时期
export const specialPeriods = [
  // 纷争时期
  { name: '楚汉争霸', start: -206, end: -202, color: '#FFD70030' },
  {
    name: '春秋',
    start: -770,
    end: -476,
    color: '#FFD70030',
    merged: true,
    belongTo: '东周'
  },
  {
    name: '战国',
    start: -475,
    end: -221,
    color: '#FFA50030',
    merged: true,
    belongTo: '东周'
  },
  { name: '三国', start: 220, end: 280, color: '#FFD70030', merged: true },
  {
    name: '五胡乱华',
    start: 304,
    end: 439,
    color: '#FFD70030',
    merged: true,
    belongTo: '西晋'
  },
  {
    name: '军阀割据',
    start: '1916-06-06',
    end: '1928-12-29',
    color: '#FFD70030'
  },
  // 兴盛时期
  { name: '（夏）少康中兴', start: -1900, end: -1850, color: '#FFA50030' },
  { name: '（商）成汤之治', start: -1600, end: -1589, color: '#FFA50030' },
  { name: '（商）武丁盛世', start: -1250, end: -1192, color: '#FFA50030' },
  { name: '（西周）成康之治', start: -1042, end: -996, color: '#FFA50030' },
  { name: '（西周）宣王中兴', start: -827, end: -782, color: '#FFA50030' },
  { name: '（西汉）文景之治', start: -180, end: -141, color: '#FFA50030' },
  { name: '（西汉）汉武盛世', start: -141, end: -87, color: '#FFA50030' },
  { name: '（西汉）昭宣中兴', start: -87, end: -48, color: '#FFA50030' },
  { name: '（东汉）光武中兴', start: 25, end: 57, color: '#FFA50030' },
  { name: '（东汉）明章之治', start: 57, end: 88, color: '#FFA50030' },
  { name: '（西晋）太康之治', start: 280, end: 290, color: '#FFA50030' },
  { name: '（刘宋）元嘉之治', start: 424, end: 453, color: '#FFA50030' },
  { name: '（北魏）孝文中兴', start: 471, end: 499, color: '#FFA50030' },
  { name: '（隋）开皇之治', start: 581, end: 600, color: '#FFA50030' },
  { name: '（唐）贞观之治', start: 627, end: 649, color: '#FFA50030' },
  { name: '（唐）永徽之治', start: 649, end: 655, color: '#FFA50030' },
  { name: '（唐）开元盛世', start: 713, end: 741, color: '#FFA50030' },
  { name: '（唐）元和中兴', start: 805, end: 820, color: '#FFA50030' },
  { name: '（唐）会昌中兴', start: 840, end: 846, color: '#FFA50030' },
  { name: '（唐）大中之治', start: 847, end: 860, color: '#FFA50030' },
  { name: '（北宋）建隆之治', start: 960, end: 976, color: '#FFA50030' },
  { name: '（北宋）咸平之治', start: 998, end: 1003, color: '#FFA50030' },
  { name: '（北宋）仁宗盛治', start: 1022, end: 1063, color: '#FFA50030' },
  { name: '（南宋）乾淳之治', start: 1165, end: 1189, color: '#FFA50030' },
  { name: '（元）至元之治', start: 1260, end: 1294, color: '#FFA50030' },
  { name: '（明）洪武之治', start: 1368, end: 1398, color: '#FFA50030' },
  { name: '（明）永乐盛世', start: 1402, end: 1424, color: '#FFA50030' },
  { name: '（明）仁宣之治', start: 1424, end: 1435, color: '#FFA50030' },
  { name: '（明）弘治中兴', start: 1487, end: 1505, color: '#FFA50030' },
  { name: '（明）万历中兴', start: 1572, end: 1582, color: '#FFA50030' },
  { name: '（清）康乾盛世', start: 1661, end: 1796, color: '#FFA50030' },
  { name: '（清）同光中兴', start: 1861, end: 1875, color: '#FFA50030' }
]
