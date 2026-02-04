// 皇朝年谱数据
export const dynastyData = [
  {
    name: '夏朝',
    startYear: -2070,
    endYear: -1600,
    emperors: [
      {
        name: '夏禹',
        realName: '姒文命',
        reignStart: -2070,
        reignEnd: -2061,
        events: [
          {
            date: -2070,
            name: '建立夏朝',
            description: '大禹建立夏朝，开启中国历史上第一个王朝'
          },
          {
            start: -2070,
            end: -2061,
            name: '治水成功',
            description: '大禹治水成功，划分九州，制定贡赋制度'
          }
        ]
      },
      {
        name: '太康',
        realName: '姒太康',
        reignStart: -2060,
        reignEnd: -2048,
        events: [
          {
            start: -2059,
            end: -2048,
            name: '太康失国',
            description: '太康沉迷狩猎，被后羿所逐，夏朝中衰'
          }
        ]
      },
      {
        name: '少康',
        realName: '姒少康',
        reignStart: -1905,
        reignEnd: -1885,
        events: [
          {
            date: -1905,
            name: '少康中兴',
            description: '少康恢复夏朝统治，实现夏朝中兴'
          }
        ]
      }
    ]
  },
  {
    name: '商朝',
    startYear: -1600,
    endYear: -1046,
    emperors: [
      {
        name: '商汤',
        realName: '子履',
        reignStart: -1600,
        reignEnd: -1587,
        events: [
          {
            date: -1600,
            name: '建立商朝',
            description: '商汤灭夏，建立商朝，定都亳'
          },
          {
            start: -1600,
            end: -1587,
            name: '成汤之治',
            description: '商汤实行仁政，商朝初期政治清明'
          }
        ]
      },
      {
        name: '武丁',
        realName: '子昭',
        reignStart: -1250,
        reignEnd: -1192,
        events: [
          {
            start: -1250,
            end: -1192,
            name: '武丁盛世',
            description: '武丁在位期间，商朝达到鼎盛，疆域扩大'
          },
          {
            start: -1249,
            end: -1240,
            name: '征伐四方',
            description: '武丁大规模征伐土方、鬼方等方国，巩固商朝统治'
          }
        ]
      },
      {
        name: '商纣王',
        realName: '子受德',
        reignStart: -1075,
        reignEnd: -1046,
        events: [
          {
            start: -1075,
            end: -1046,
            name: '商纣暴政',
            description: '商纣王荒淫无道，朝政腐败'
          },
          {
            date: -1046,
            name: '商朝灭亡',
            description: '周武王伐纣，牧野之战商朝灭亡'
          }
        ]
      }
    ]
  },
  {
    name: '西周',
    startYear: -1046,
    endYear: -771,
    emperors: [
      {
        name: '周武王',
        realName: '姬发',
        reignStart: -1046,
        reignEnd: -1043,
        events: [
          {
            date: -1046,
            name: '建立西周',
            description: '周武王灭商，建立西周，定都镐京'
          },
          {
            date: -1045,
            name: '分封诸侯',
            description: '周武王实行分封制，建立诸侯国'
          }
        ]
      },
      {
        name: '周成王',
        realName: '姬诵',
        reignStart: -1042,
        reignEnd: -1021,
        events: [
          {
            start: -1042,
            end: -1021,
            name: '成康之治',
            description: '周成王和周康王统治时期，西周政治清明，经济繁荣'
          }
        ]
      },
      {
        name: '周幽王',
        realName: '姬宫湦',
        reignStart: -781,
        reignEnd: -771,
        events: [
          {
            date: -771,
            name: '烽火戏诸侯',
            description: '周幽王为博褒姒一笑，烽火戏诸侯，犬戎攻破镐京'
          },
          {
            date: -771,
            name: '西周灭亡',
            description: '犬戎攻破镐京，周幽王被杀，西周灭亡'
          }
        ]
      }
    ]
  },
  {
    name: '东周',
    startYear: -770,
    endYear: -256,
    emperors: [
      {
        name: '周平王',
        realName: '姬宜臼',
        reignStart: -770,
        reignEnd: -720,
        events: [
          {
            date: -770,
            name: '建立东周',
            description: '周平王东迁洛邑，建立东周'
          },
          {
            start: -770,
            end: -256,
            name: '春秋战国',
            description: '东周分为春秋和战国两个时期，诸侯争霸'
          }
        ]
      },
      {
        name: '周宣王',
        realName: '姬静',
        reignStart: -827,
        reignEnd: -782,
        events: [
          {
            start: -827,
            end: -782,
            name: '宣王中兴',
            description: '周宣王在位期间，周朝国力有所恢复'
          }
        ]
      }
    ]
  },
  {
    name: '秦朝',
    startYear: -221,
    endYear: -206,
    emperors: [
      {
        name: '秦始皇',
        realName: '嬴政',
        reignStart: -221,
        reignEnd: -210,
        events: [
          {
            date: -221,
            name: '统一六国',
            description: '秦始皇嬴政完成统一大业，建立秦朝，自称始皇帝'
          },
          {
            start: -221,
            end: -210,
            name: '修建长城',
            description: '为抵御北方匈奴，秦始皇下令修建万里长城'
          },
          { date: -214, name: '', description: '南征百越，扩大秦朝疆域' },
          {
            date: -213,
            name: '焚书坑儒',
            description: '秦始皇采纳李斯建议，焚烧诗书，坑杀儒生'
          }
        ]
      },
      {
        name: '秦二世',
        realName: '胡亥',
        reignStart: -210,
        reignEnd: -207,
        events: [
          {
            date: -210,
            name: '秦始皇驾崩',
            description: '秦始皇在东巡途中驾崩，胡亥继位为秦二世'
          },
          {
            start: -209,
            end: -207,
            name: '陈胜吴广起义',
            description: '陈胜吴广在大泽乡发动起义，揭开秦末农民起义序幕'
          }
        ]
      },
      {
        name: '秦王子婴',
        realName: '子婴',
        reignStart: -207,
        reignEnd: -206,
        events: [
          {
            date: -207,
            name: '赵高被杀',
            description: '秦王子婴设计诛杀赵高，铲除权臣'
          },
          {
            date: -206,
            name: '秦朝灭亡',
            description: '刘邦率军攻入咸阳，秦王子婴投降，秦朝灭亡'
          }
        ]
      }
    ]
  },
  {
    name: '西汉',
    startYear: -202,
    endYear: 9,
    emperors: [
      {
        name: '汉高祖',
        realName: '刘邦',
        reignStart: -202,
        reignEnd: -195,
        events: [
          {
            date: -202,
            name: '建立西汉',
            description: '刘邦击败项羽，建立汉朝，定都长安'
          },
          {
            start: -202,
            end: -196,
            name: '剪除异姓王',
            description: '汉高祖刘邦剪除韩信、彭越等异姓诸侯王'
          }
        ]
      },
      {
        name: '汉文帝',
        realName: '刘恒',
        reignStart: -180,
        reignEnd: -157,
        events: [
          {
            start: -180,
            end: -157,
            name: '文景之治',
            description:
              '汉文帝与汉景帝统治时期，实行休养生息政策，国家繁荣富强'
          }
        ]
      },
      {
        name: '汉武帝',
        realName: '刘彻',
        reignStart: -141,
        reignEnd: -87,
        events: [
          {
            start: -133,
            end: -119,
            name: '北击匈奴',
            description: '汉武帝派卫青、霍去病多次出击匈奴，取得重大胜利'
          },
          {
            date: -138,
            name: '张骞出使西域',
            description: '汉武帝派张骞出使西域，开辟丝绸之路'
          },
          {
            start: -136,
            end: -124,
            name: '罢黜百家',
            description: '汉武帝采纳董仲舒建议，罢黜百家，独尊儒术'
          }
        ]
      },
      {
        name: '汉昭帝',
        realName: '刘弗陵',
        reignStart: -87,
        reignEnd: -74,
        events: [
          {
            start: -87,
            end: -74,
            name: '昭宣中兴',
            description: '汉昭帝与汉宣帝统治时期，汉朝国力恢复'
          }
        ]
      }
    ]
  },
  {
    name: '新朝',
    startYear: 9,
    endYear: 23,
    emperors: [
      {
        name: '王莽',
        realName: '王莽',
        reignStart: 9,
        reignEnd: 23,
        events: [
          { date: 9, name: '建立新朝', description: '王莽篡汉，建立新朝' },
          {
            start: 9,
            end: 23,
            name: '王莽改制',
            description: '王莽推行一系列改革措施，试图解决社会矛盾'
          },
          {
            date: 23,
            name: '绿林赤眉起义',
            description: '绿林赤眉起义爆发，王莽被杀，新朝灭亡'
          }
        ]
      }
    ]
  },
  {
    name: '东汉',
    startYear: 25,
    endYear: 220,
    emperors: [
      {
        name: '光武帝',
        realName: '刘秀',
        reignStart: 25,
        reignEnd: 57,
        events: [
          {
            date: 25,
            name: '建立东汉',
            description: '刘秀称帝，建立东汉，定都洛阳'
          },
          {
            start: 25,
            end: 57,
            name: '光武中兴',
            description: '光武帝刘秀恢复汉朝统治，实现中兴'
          }
        ]
      },
      {
        name: '汉明帝',
        realName: '刘庄',
        reignStart: 57,
        reignEnd: 75,
        events: [
          {
            start: 57,
            end: 88,
            name: '明章之治',
            description: '汉明帝与汉章帝统治时期，东汉经济文化繁荣'
          },
          {
            date: 68,
            name: '白马驮经',
            description: '佛教传入中国，汉明帝在洛阳建立白马寺'
          }
        ]
      },
      {
        name: '汉灵帝',
        realName: '刘宏',
        reignStart: 168,
        reignEnd: 189,
        events: [
          {
            start: 184,
            end: 205,
            name: '黄巾起义',
            description: '黄巾军起义爆发，东汉政权名存实亡'
          },
          {
            date: 189,
            name: '董卓之乱',
            description: '董卓进京，废立皇帝，东汉陷入军阀混战'
          }
        ]
      }
    ]
  },
  {
    name: '西晋',
    startYear: 265,
    endYear: 316,
    emperors: [
      {
        name: '晋武帝',
        realName: '司马炎',
        reignStart: 265,
        reignEnd: 290,
        events: [
          {
            start: 217,
            end: 239,
            name: '司马懿崛起',
            description: '217年被曹操征为文学掾，后辅佐曹丕。曹丕称帝后任尚书右仆射，成为顾命大臣，229年任大将军，都督荆豫二州军事，235年升太尉，成为军中最高统帅。'
          },
          {
            date: '249-02', name: '高平陵之变', description: '司马懿趁曹爽兄弟陪曹芳祭陵，以郭太后诏令关闭洛阳城门，占领武库，控制洛水浮桥，说服桓范归顺，蒋济写信劝降，曹爽投降后被夷三族'
          },
          { date: 264, name: '司马昭进晋王', description: '司马昭进晋王，建天子旌旗，制定《泰始律》，改革官制，265年八月司马昭卒，司马炎继晋王位' },
          { date: 265, name: '建立西晋', description: '设坛于南郊，曹奂禅让，司马炎即皇帝位，封宗室二十七王，始行五等爵制' },
          { date: 268, name: '《泰始律》颁布', description: '张斐、杜预作注，共620条，"准五服以制罪"首次入律' },
          { date: 280, name: '平吴之役，统一全国', description: '西晋灭吴，统一全国' },
          {
            start: 280,
            end: 290,
            name: '太康之治',
            description: '晋武帝统治时期，西晋经济繁荣。占田制：男子70亩，女子30亩；官员依品级占田；户调式：丁男岁输绢3匹、绵3斤；人口恢复：太康三年（282）户籍达377万户，较263年增100万户'
          },
          {
            date: '290-05',
            name: '司马炎去世',
            description: '司马炎在290年去世，晋惠帝即位'
          }
        ]
      },
      {
        name: '晋惠帝',
        realName: '司马衷',
        reignStart: 290,
        reignEnd: 306,
        events: [
          { date: 291, name: '贾南风宫廷政变', description: '三月，贾后诛杨骏，六月，贾后使玮杀汝南王亮、卫瓘，又以矫诏罪杀玮，一箭双雕' },
          {
            start: 291,
            end: 306,
            name: '八王之乱',
            description: '西晋皇族内部发生八王之乱，国力大损'
          },
          {
            date: '306-11',
            name: '晋惠帝暴毙',
            description: '晋惠帝突然死亡（传言被司马越毒杀），司马越需要扶植一个便于控制的新皇帝 Capture，被人 Kill，死在洛阳'
          }
        ]
      },
      {
        name: '晋怀帝',
        realName: '司马炽',
        reignStart: 306,
        reignEnd: 311,
        events: [
          {
            date: '306-11',
            name: '晋怀帝继位',
            description: '306年十一月，晋惠帝暴毙后，司马越拥立司马炽即位，改元永嘉'
          },
          {
            start: 307,
            end: 313,
            name: '永嘉之乱',
            description: '311年洛阳陷落，刘曜、王弥、石勒会攻洛阳，城内大饥，人相食，怀帝欲逃长安，被汉军追获，313年被杀，百官士庶死者3万余人，陵墓尽毁，宫殿焚烧'
          }
        ]
      },
      {
        name: '晋愍帝',
        realName: '司马邺',
        reignStart: 313,
        reignEnd: 316,
        events: [
          {
            date: 313,
            name: '司马邺继位',
            description: '313年怀帝在平阳被弑,司马邺在长安即位（愍帝）'
          },
          {
            date: '316-11',
            name: '西晋灭亡',
            description: '316年八月，刘曜围长安，十一月，愍帝出降，西晋亡，后受辱被杀'
          }
        ]
      }
    ]
  },
  {
    name: '东晋',
    startYear: 317,
    endYear: 420,
    emperors: [
      {
        name: '晋元帝',
        realName: '司马睿',
        reignStart: 317,
        reignEnd: 322,
        events: [
          {
            date: 317,
            name: '建立东晋',
            description: '司马睿在建康称帝，建立东晋'
          }
        ]
      },
      {
        name: '晋明帝',
        realName: '司马绍',
        reignStart: 322,
        reignEnd: 325,
        events: [
          {
            date: 324,
            name: '平定王敦之乱',
            description: '晋明帝平定王敦叛乱，巩固东晋政权'
          }
        ]
      },
      {
        name: '晋安帝',
        realName: '司马德宗',
        reignStart: 397,
        reignEnd: 418,
        events: [
          {
            start: 403,
            end: 404,
            name: '桓玄之乱',
            description: '桓玄篡晋，建立桓楚政权，后被刘裕平定'
          },
          {
            start: 405,
            end: 415,
            name: '刘裕北伐',
            description: '刘裕北伐，收复洛阳、长安等失地'
          }
        ]
      }
    ]
  },
  {
    name: '隋朝',
    startYear: 581,
    endYear: 618,
    emperors: [
      {
        name: '隋文帝',
        realName: '杨坚',
        reignStart: 581,
        reignEnd: 604,
        events: [
          {
            date: 581,
            name: '建立隋朝',
            description: '杨坚篡周，建立隋朝，定都长安'
          },
          { date: 589, name: '统一全国', description: '隋朝灭陈，统一全国' },
          {
            start: 581,
            end: 604,
            name: '开皇之治',
            description: '隋文帝统治时期，隋朝经济繁荣，国力强盛'
          }
        ]
      },
      {
        name: '隋炀帝',
        realName: '杨广',
        reignStart: 604,
        reignEnd: 618,
        events: [
          {
            start: 605,
            end: 610,
            name: '开凿大运河',
            description: '隋炀帝下令开凿大运河，加强南北交通'
          },
          {
            start: 611,
            end: 618,
            name: '隋末农民起义',
            description: '隋末农民起义爆发，隋朝统治崩溃'
          },
          {
            date: 618,
            name: '隋朝灭亡',
            description: '宇文化及发动政变，隋炀帝被杀，隋朝灭亡'
          }
        ]
      }
    ]
  },
  {
    name: '唐朝',
    startYear: 618,
    endYear: 907,
    emperors: [
      {
        name: '唐高祖',
        realName: '李渊',
        reignStart: 618,
        reignEnd: 626,
        events: [
          {
            date: 618,
            name: '建立唐朝',
            description: '李渊在长安称帝，建立唐朝'
          }
        ]
      },
      {
        name: '唐太宗',
        realName: '李世民',
        reignStart: 626,
        reignEnd: 649,
        events: [
          {
            date: 626,
            name: '玄武门之变',
            description: '李世民发动玄武门之变，杀死太子李建成和齐王李元吉'
          },
          {
            start: 627,
            end: 649,
            name: '贞观之治',
            description: '唐太宗统治时期，政治清明，经济繁荣，史称贞观之治'
          },
          {
            date: 641,
            name: '文成公主入藏',
            description: '唐太宗将文成公主嫁给吐蕃松赞干布，加强汉藏关系'
          }
        ]
      },
      {
        name: '唐高宗',
        realName: '李治',
        reignStart: 649,
        reignEnd: 683,
        events: [
          {
            date: 655,
            name: '废王立武',
            description: '唐高宗废黜王皇后，立武则天为皇后'
          },
          {
            start: 670,
            end: 676,
            name: '唐与吐蕃战争',
            description: '唐朝与吐蕃发生多次战争，争夺西域'
          }
        ]
      },
      {
        name: '武则天',
        realName: '武曌',
        reignStart: 690,
        reignEnd: 705,
        events: [
          {
            date: 690,
            name: '称帝建周',
            description: '武则天称帝，改国号为周，成为中国历史上唯一的女皇帝'
          }
        ]
      },
      {
        name: '唐玄宗',
        realName: '李隆基',
        reignStart: 712,
        reignEnd: 756,
        events: [
          {
            start: 713,
            end: 741,
            name: '开元盛世',
            description: '唐玄宗统治前期，唐朝达到鼎盛，经济文化繁荣'
          },
          {
            start: 755,
            end: 763,
            name: '安史之乱',
            description: '安禄山、史思明发动叛乱，唐朝由盛转衰'
          }
        ]
      },
      {
        name: '唐德宗',
        realName: '李适',
        reignStart: 779,
        reignEnd: 805,
        events: [
          {
            start: 781,
            end: 786,
            name: '藩镇割据',
            description: '唐朝藩镇势力崛起，割据一方'
          }
        ]
      },
      {
        name: '唐宪宗',
        realName: '李纯',
        reignStart: 805,
        reignEnd: 820,
        events: [
          {
            start: 805,
            end: 820,
            name: '元和中兴',
            description: '唐宪宗在位期间，唐朝国力有所恢复'
          }
        ]
      }
    ]
  },
  {
    name: '北宋',
    startYear: 960,
    endYear: 1127,
    emperors: [
      {
        name: '宋太祖',
        realName: '赵匡胤',
        reignStart: 960,
        reignEnd: 976,
        events: [
          {
            date: 960,
            name: '建立北宋',
            description: '赵匡胤发动陈桥兵变，建立北宋，定都开封'
          },
          {
            start: 960,
            end: 976,
            name: '杯酒释兵权',
            description: '宋太祖通过杯酒释兵权，解除武将兵权'
          },
          {
            start: 963,
            end: 976,
            name: '统一南方',
            description: '宋太祖统一南方各国，结束五代十国分裂局面'
          }
        ]
      },
      {
        name: '宋太宗',
        realName: '赵光义',
        reignStart: 976,
        reignEnd: 997,
        events: [
          {
            date: 979,
            name: '统一全国',
            description: '宋太宗灭北汉，基本统一全国'
          },
          {
            start: 979,
            end: 986,
            name: '宋辽战争',
            description: '宋朝与辽国发生多次战争，争夺幽云十六州'
          }
        ]
      },
      {
        name: '宋真宗',
        realName: '赵恒',
        reignStart: 997,
        reignEnd: 1022,
        events: [
          {
            date: 1004,
            name: '澶渊之盟',
            description: '宋朝与辽国签订澶渊之盟，结束长期战争'
          },
          {
            start: 997,
            end: 1022,
            name: '咸平之治',
            description: '宋真宗统治时期，北宋经济繁荣'
          }
        ]
      },
      {
        name: '宋仁宗',
        realName: '赵祯',
        reignStart: 1022,
        reignEnd: 1063,
        events: [
          {
            start: 1022,
            end: 1063,
            name: '仁宗盛治',
            description: '宋仁宗统治时期，北宋达到鼎盛'
          },
          {
            start: 1038,
            end: 1044,
            name: '宋夏战争',
            description: '宋朝与西夏发生战争，后签订庆历和议'
          },
          {
            start: 1043,
            end: 1045,
            name: '庆历新政',
            description: '范仲淹推行庆历新政，试图改革北宋政治'
          }
        ]
      },
      {
        name: '宋神宗',
        realName: '赵顼',
        reignStart: 1067,
        reignEnd: 1085,
        events: [
          {
            start: 1069,
            end: 1085,
            name: '王安石变法',
            description: '宋神宗支持王安石推行变法，试图富国强兵'
          }
        ]
      },
      {
        name: '宋徽宗',
        realName: '赵佶',
        reignStart: 1100,
        reignEnd: 1125,
        events: [
          {
            start: 1114,
            end: 1125,
            name: '宋金灭辽',
            description: '宋朝与金国联合灭辽'
          },
          {
            date: 1125,
            name: '金兵南下',
            description: '金国南下攻宋，北宋面临危机'
          }
        ]
      },
      {
        name: '宋钦宗',
        realName: '赵桓',
        reignStart: 1125,
        reignEnd: 1127,
        events: [
          {
            date: 1127,
            name: '靖康之变',
            description: '金兵攻破开封，宋徽宗、宋钦宗被俘，北宋灭亡'
          }
        ]
      }
    ]
  },
  {
    name: '南宋',
    startYear: 1127,
    endYear: 1279,
    emperors: [
      {
        name: '宋高宗',
        realName: '赵构',
        reignStart: 1127,
        reignEnd: 1162,
        events: [
          {
            date: 1127,
            name: '建立南宋',
            description: '宋高宗在临安称帝，建立南宋'
          },
          {
            start: 1130,
            end: 1141,
            name: '岳飞抗金',
            description: '岳飞率领岳家军抗击金兵，取得郾城大捷'
          },
          {
            date: 1141,
            name: '绍兴和议',
            description: '南宋与金国签订绍兴和议，向金称臣纳贡'
          },
          {
            date: 1142,
            name: '岳飞被害',
            description: '宋高宗以莫须有罪名杀害岳飞'
          }
        ]
      },
      {
        name: '宋孝宗',
        realName: '赵昚',
        reignStart: 1162,
        reignEnd: 1189,
        events: [
          {
            start: 1162,
            end: 1189,
            name: '乾淳之治',
            description: '宋孝宗统治时期，南宋经济文化繁荣'
          },
          {
            start: 1163,
            end: 1164,
            name: '隆兴北伐',
            description: '宋孝宗发动隆兴北伐，试图收复失地'
          }
        ]
      },
      {
        name: '宋理宗',
        realName: '赵昀',
        reignStart: 1224,
        reignEnd: 1264,
        events: [
          {
            start: 1234,
            end: 1279,
            name: '宋蒙战争',
            description: '蒙古灭金后，开始进攻南宋'
          },
          {
            date: 1234,
            name: '端平入洛',
            description: '南宋军队进入洛阳，后被蒙古军击败'
          }
        ]
      },
      {
        name: '宋度宗',
        realName: '赵禥',
        reignStart: 1264,
        reignEnd: 1274,
        events: [
          {
            start: 1267,
            end: 1273,
            name: '襄樊之战',
            description: '蒙古军围攻襄阳、樊城，南宋坚守六年'
          }
        ]
      },
      {
        name: '宋恭帝',
        realName: '赵显',
        reignStart: 1274,
        reignEnd: 1276,
        events: [
          {
            date: 1276,
            name: '临安投降',
            description: '蒙古军攻破临安，宋恭帝投降'
          }
        ]
      },
      {
        name: '宋末帝',
        realName: '赵昺',
        reignStart: 1278,
        reignEnd: 1279,
        events: [
          {
            date: 1279,
            name: '崖山海战',
            description:
              '南宋与蒙古军在崖山决战，南宋战败，陆秀夫背着宋末帝跳海自尽，南宋灭亡'
          }
        ]
      }
    ]
  },
  {
    name: '元朝',
    startYear: 1271,
    endYear: 1368,
    emperors: [
      {
        name: '元世祖',
        realName: '忽必烈',
        reignStart: 1271,
        reignEnd: 1294,
        events: [
          {
            date: 1271,
            name: '建立元朝',
            description: '忽必烈定国号为元，建立元朝'
          },
          { date: 1279, name: '统一中国', description: '元朝灭南宋，统一中国' },
          {
            start: 1271,
            end: 1294,
            name: '至元之治',
            description: '元世祖在位期间，元朝经济文化发展'
          }
        ]
      },
      {
        name: '元成宗',
        realName: '铁穆耳',
        reignStart: 1294,
        reignEnd: 1307,
        events: [
          {
            start: 1294,
            end: 1307,
            name: '守成之治',
            description: '元成宗在位期间，元朝社会相对稳定'
          }
        ]
      },
      {
        name: '元顺帝',
        realName: '妥懽帖睦尔',
        reignStart: 1333,
        reignEnd: 1368,
        events: [
          {
            start: 1351,
            end: 1368,
            name: '元末农民起义',
            description: '元末红巾军起义爆发，元朝统治崩溃'
          },
          {
            date: 1368,
            name: '明朝建立',
            description: '朱元璋在南京称帝，建立明朝'
          },
          {
            date: 1368,
            name: '元朝灭亡',
            description: '明军攻占大都，元顺帝北逃，元朝在中原的统治结束'
          }
        ]
      }
    ]
  },
  {
    name: '明朝',
    startYear: 1368,
    endYear: 1644,
    emperors: [
      {
        name: '明太祖',
        realName: '朱元璋',
        reignStart: 1368,
        reignEnd: 1398,
        events: [
          {
            date: 1368,
            name: '建立明朝',
            description: '朱元璋在南京称帝，建立明朝'
          },
          {
            start: 1368,
            end: 1387,
            name: '统一全国',
            description: '朱元璋统一全国，结束元朝在中原的统治'
          },
          {
            start: 1368,
            end: 1398,
            name: '洪武之治',
            description: '明太祖统治时期，明朝经济恢复，国力强盛'
          },
          {
            start: 1370,
            end: 1393,
            name: '废除丞相',
            description: '明太祖废除丞相制度，加强中央集权'
          }
        ]
      },
      {
        name: '明成祖',
        realName: '朱棣',
        reignStart: 1402,
        reignEnd: 1424,
        events: [
          {
            date: 1402,
            name: '靖难之役',
            description: '明成祖发动靖难之役，夺取皇位'
          },
          { date: 1403, name: '迁都北京', description: '明成祖下令迁都北京' },
          {
            start: 1405,
            end: 1433,
            name: '郑和下西洋',
            description: '郑和七次下西洋，加强中外交流'
          },
          {
            start: 1402,
            end: 1424,
            name: '永乐盛世',
            description: '明成祖统治时期，明朝达到鼎盛'
          }
        ]
      },
      {
        name: '明仁宗',
        realName: '朱高炽',
        reignStart: 1424,
        reignEnd: 1425,
        events: [
          {
            start: 1424,
            end: 1435,
            name: '仁宣之治',
            description: '明仁宗与明宣宗统治时期，明朝经济文化繁荣'
          }
        ]
      },
      {
        name: '明宪宗',
        realName: '朱见深',
        reignStart: 1464,
        reignEnd: 1487,
        events: [
          {
            start: 1464,
            end: 1477,
            name: '成化犁庭',
            description: '明朝对建州女真进行军事打击'
          }
        ]
      },
      {
        name: '明孝宗',
        realName: '朱祐樘',
        reignStart: 1487,
        reignEnd: 1505,
        events: [
          {
            start: 1487,
            end: 1505,
            name: '弘治中兴',
            description: '明孝宗在位期间，明朝国力有所恢复'
          }
        ]
      },
      {
        name: '明武宗',
        realName: '朱厚照',
        reignStart: 1505,
        reignEnd: 1521,
        events: [
          {
            start: 1517,
            end: 1519,
            name: '宁王之乱',
            description: '宁王朱宸濠发动叛乱，被王阳明平定'
          }
        ]
      },
      {
        name: '明世宗',
        realName: '朱厚熜',
        reignStart: 1521,
        reignEnd: 1566,
        events: [
          {
            start: 1542,
            end: 1566,
            name: '壬寅宫变',
            description: '宫女杨金英等人试图刺杀明世宗'
          },
          {
            start: 1553,
            end: 1567,
            name: '倭患',
            description: '倭寇侵扰明朝东南沿海'
          },
          {
            date: 1553,
            name: '葡萄牙租借澳门',
            description: '葡萄牙获得澳门居住权'
          }
        ]
      },
      {
        name: '明穆宗',
        realName: '朱载坖',
        reignStart: 1566,
        reignEnd: 1572,
        events: [
          {
            date: 1570,
            name: '隆庆和议',
            description: '明朝与蒙古俺答汗达成和议，结束长期战争'
          }
        ]
      },
      {
        name: '明神宗',
        realName: '朱翊钧',
        reignStart: 1572,
        reignEnd: 1620,
        events: [
          {
            start: 1572,
            end: 1582,
            name: '万历新政',
            description: '张居正推行万历新政，改革明朝政治经济'
          },
          {
            start: 1592,
            end: 1598,
            name: '万历援朝',
            description: '明朝援助朝鲜抗击日本侵略'
          },
          {
            start: 1618,
            end: 1620,
            name: '萨尔浒之战',
            description: '明朝与后金在萨尔浒决战，明朝战败'
          }
        ]
      },
      {
        name: '明思宗',
        realName: '朱由检',
        reignStart: 1627,
        reignEnd: 1644,
        events: [
          {
            start: 1627,
            end: 1644,
            name: '明末农民起义',
            description: '李自成、张献忠领导农民起义，明朝统治崩溃'
          },
          {
            date: 1644,
            name: '李自成入京',
            description: '李自成率军攻入北京，明思宗自缢，明朝灭亡'
          }
        ]
      }
    ]
  },
  {
    name: '清朝',
    startYear: 1636,
    endYear: 1912,
    emperors: [
      {
        name: '清太宗',
        realName: '皇太极',
        reignStart: 1636,
        reignEnd: 1643,
        events: [
          {
            date: 1636,
            name: '建立清朝',
            description: '皇太极改国号为清，建立清朝'
          },
          {
            date: 1642,
            name: '松锦之战',
            description: '清朝与明朝在松锦决战，明朝战败'
          }
        ]
      },
      {
        name: '清世祖',
        realName: '福临',
        reignStart: 1643,
        reignEnd: 1661,
        events: [
          { date: 1644, name: '清军入关', description: '清军入关，占领北京' },
          {
            start: 1644,
            end: 1661,
            name: '统一全国',
            description: '清朝统一全国，结束明朝统治'
          }
        ]
      },
      {
        name: '清圣祖',
        realName: '玄烨',
        reignStart: 1661,
        reignEnd: 1722,
        events: [
          {
            date: 1669,
            name: '平定三藩',
            description: '康熙帝平定吴三桂等三藩叛乱'
          },
          {
            start: 1683,
            end: 1689,
            name: '收复台湾',
            description: '康熙帝派施琅收复台湾'
          },
          {
            start: 1685,
            end: 1688,
            name: '雅克萨之战',
            description: '清朝与沙俄在雅克萨进行两次战役'
          },
          {
            date: 1689,
            name: '尼布楚条约',
            description: '清朝与沙俄签订尼布楚条约，划定边界'
          },
          {
            start: 1661,
            end: 1722,
            name: '康乾盛世',
            description: '康熙帝、雍正帝、乾隆帝统治时期，清朝达到鼎盛'
          }
        ]
      },
      {
        name: '清世宗',
        realName: '胤禛',
        reignStart: 1722,
        reignEnd: 1735,
        events: [
          {
            start: 1723,
            end: 1735,
            name: '雍正新政',
            description: '雍正帝推行一系列改革，加强中央集权'
          },
          {
            date: 1727,
            name: '恰克图条约',
            description: '清朝与沙俄签订恰克图条约'
          }
        ]
      },
      {
        name: '清高宗',
        realName: '弘历',
        reignStart: 1735,
        reignEnd: 1796,
        events: [
          {
            start: 1755,
            end: 1759,
            name: '平定准噶尔',
            description: '乾隆帝平定准噶尔叛乱，统一新疆'
          },
          {
            start: 1773,
            end: 1782,
            name: '四库全书',
            description: '乾隆帝下令编纂四库全书'
          },
          {
            start: 1793,
            end: 1796,
            name: '白莲教起义',
            description: '白莲教起义爆发，清朝由盛转衰'
          }
        ]
      },
      {
        name: '清仁宗',
        realName: '颙琰',
        reignStart: 1796,
        reignEnd: 1820,
        events: [
          {
            start: 1796,
            end: 1804,
            name: '平定白莲教',
            description: '嘉庆帝平定白莲教起义'
          },
          {
            date: 1813,
            name: '天理教起义',
            description: '天理教起义军攻入紫禁城'
          }
        ]
      },
      {
        name: '清宣宗',
        realName: '旻宁',
        reignStart: 1820,
        reignEnd: 1850,
        events: [
          {
            start: 1839,
            end: 1842,
            name: '鸦片战争',
            description:
              '清朝与英国发生鸦片战争，中国开始沦为半殖民地半封建社会'
          },
          {
            date: 1842,
            name: '南京条约',
            description: '清朝与英国签订南京条约，割让香港岛'
          }
        ]
      },
      {
        name: '清文宗',
        realName: '奕詝',
        reignStart: 1850,
        reignEnd: 1861,
        events: [
          {
            start: 1851,
            end: 1864,
            name: '太平天国运动',
            description: '洪秀全领导太平天国运动，席卷大半个中国'
          },
          {
            start: 1856,
            end: 1860,
            name: '第二次鸦片战争',
            description: '清朝与英法联军发生第二次鸦片战争'
          },
          {
            date: 1860,
            name: '北京条约',
            description: '清朝与英法联军签订北京条约，割让九龙半岛'
          }
        ]
      },
      {
        name: '清穆宗',
        realName: '载淳',
        reignStart: 1861,
        reignEnd: 1875,
        events: [
          {
            start: 1861,
            end: 1894,
            name: '洋务运动',
            description: '清朝开展洋务运动，学习西方技术'
          },
          {
            date: 1864,
            name: '平定太平天国',
            description: '清朝镇压太平天国运动'
          }
        ]
      },
      {
        name: '清德宗',
        realName: '载湉',
        reignStart: 1875,
        reignEnd: 1908,
        events: [
          {
            start: 1883,
            end: 1885,
            name: '中法战争',
            description: '清朝与法国发生中法战争'
          },
          {
            start: 1894,
            end: 1895,
            name: '甲午战争',
            description: '清朝与日本发生甲午战争，中国战败'
          },
          {
            date: 1895,
            name: '马关条约',
            description: '清朝与日本签订马关条约，割让台湾岛'
          },
          {
            date: 1898,
            name: '戊戌变法',
            description: '光绪帝推行戊戌变法，试图改革清朝政治'
          },
          {
            start: 1900,
            end: 1901,
            name: '义和团运动',
            description: '义和团运动爆发，八国联军侵华'
          },
          {
            date: 1901,
            name: '辛丑条约',
            description:
              '清朝与列强签订辛丑条约，中国完全沦为半殖民地半封建社会'
          },
          {
            date: 1905,
            name: '废除科举',
            description: '清朝废除科举制度，推行新学'
          }
        ]
      },
      {
        name: '宣统帝',
        realName: '溥仪',
        reignStart: 1908,
        reignEnd: 1912,
        events: [
          {
            start: 1911,
            end: 1912,
            name: '辛亥革命',
            description: '辛亥革命爆发，清朝统治崩溃'
          },
          {
            date: 1912,
            name: '清朝灭亡',
            description: '宣统帝退位，清朝灭亡，中国结束封建帝制'
          }
        ]
      }
    ]
  },
  {
    name: '中华民国',
    startYear: 1912,
    endYear: 1949,
    emperors: [
      {
        name: '孙中山',
        realName: '孙文',
        reignStart: 1912,
        reignEnd: 1912,
        events: [
          {
            date: 1912,
            name: '建立中华民国',
            description: '孙中山在南京就任临时大总统，建立中华民国'
          },
          {
            date: 1912,
            name: '颁布临时约法',
            description: '中华民国颁布临时约法'
          }
        ]
      },
      {
        name: '袁世凯',
        realName: '袁世凯',
        reignStart: 1912,
        reignEnd: 1916,
        events: [
          {
            date: 1913,
            name: '二次革命',
            description: '孙中山发动二次革命，反对袁世凯独裁'
          },
          {
            date: 1915,
            name: '袁世凯称帝',
            description: '袁世凯复辟帝制，改国号为中华帝国'
          },
          {
            start: 1915,
            end: 1916,
            name: '护国运动',
            description: '蔡锷等发动护国运动，反对袁世凯称帝'
          }
        ]
      },
      {
        name: '北洋军阀',
        realName: '',
        reignStart: 1916,
        reignEnd: 1928,
        events: [
          {
            start: 1916,
            end: 1928,
            name: '军阀割据',
            description: '北洋军阀割据，中国陷入分裂'
          },
          {
            date: 1919,
            name: '五四运动',
            description: '五四运动爆发，中国新民主主义革命开始'
          }
        ]
      },
      {
        name: '蒋介石',
        realName: '蒋中正',
        reignStart: 1928,
        reignEnd: 1949,
        events: [
          {
            date: 1928,
            name: '北伐胜利',
            description: '国民革命军北伐胜利，统一中国'
          },
          {
            date: 1927,
            name: '四一二政变',
            description: '蒋介石发动四一二政变，国共第一次合作破裂'
          },
          {
            start: 1931,
            end: 1945,
            name: '抗日战争',
            description: '中国人民进行抗日战争，抗击日本侵略'
          },
          {
            date: 1937,
            name: '七七事变',
            description: '七七事变爆发，全面抗日战争开始'
          },
          {
            start: 1945,
            end: 1949,
            name: '解放战争',
            description: '中国共产党领导解放战争，推翻国民党统治'
          },
          {
            date: 1949,
            name: '中华人民共和国成立',
            description:
              '毛泽东在天安门宣布中华人民共和国成立，中华民国在大陆的统治结束'
          }
        ]
      }
    ]
  }
]
