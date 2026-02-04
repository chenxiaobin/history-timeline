import fs from 'fs';

// 直接使用绝对路径
const filePath = 'd:\\workspace\\Private\\history-timeline\\src\\data\\dynastyChronicle.js';
let content = fs.readFileSync(filePath, 'utf8');

// 移除所有id字段
content = content.replace(/\s*id:\s*['"][^'"]*['"]\s*,\s*/g, '');

// 写入处理后的内容
fs.writeFileSync(filePath, content, 'utf8');

console.log('所有id字段已移除');


