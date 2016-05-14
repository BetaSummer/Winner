// 封装了一些帮助函数

/*
 randomArrIndex 根据数组长度随机返回一个不小于 0 但小于数组长度的整数
 */
exports.randomArrIndex = function(len) {
  return Math.floor(Math.random() * len);
};
