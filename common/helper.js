var crypto = require('crypto');
/*
 randomArrIndex 根据数组长度随机返回一个不小于 0 但小于数组长度的整数
 */
exports.randomArrIndex = function(len) {
  return Math.floor(Math.random() * len);
};

exports.hash = function(psw) {
  return crypto.createHash('sha1').update(psw).digest('hex');
};
