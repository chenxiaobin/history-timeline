// 皇室族谱数据集合
// 整合所有朝代的皇室族谱数据

import xia from './xia.js';
import shang from './shang.js';
import zhou from './zhou.js';
import qin from './qin.js';
import han from './han.js';
import jin from './jin.js';
import sui from './sui.js';
import tang from './tang.js';
import song from './song.js';
import yuan from './yuan.js';
import ming from './ming.js';
import qing from './qing.js';

export const royalFamilyTree = {
  夏: xia,
  商: shang,
  周: zhou,
  秦: qin,
  汉: han,
  晋: jin,
  隋: sui,
  唐: tang,
  宋: song,
  元: yuan,
  明: ming,
  清: qing
};

export default royalFamilyTree;