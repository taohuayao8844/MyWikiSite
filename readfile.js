const fs = require('fs');
const path = 'e:/Doc_Log/BlogBok/blog/有关现在大学上课的一些感受.md';
const content = fs.readFileSync(path, 'utf8');
console.log('=== File Content ===');
console.log(content);
console.log('=== End ===');
