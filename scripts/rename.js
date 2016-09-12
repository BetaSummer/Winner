// 修改文件后缀 .jade => .pug
// 一次性脚本
var fs = require('fs');

function walk(path) {
  var dirList = fs.readdirSync(path);
  dirList.forEach(function(item) {
    var itemPath = path + '/' + item;
    var stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      walk(itemPath);
    } else if (stat.isFile() && /.jade$/.test(itemPath)) {
      var newPath = itemPath.replace(/.jade$/, '.pug')
      fs.renameSync(itemPath, newPath);
    }
  });
}

walk('./views');
