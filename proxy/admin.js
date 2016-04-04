var models = require('../models');
var Admin = models.Admin;

/*
 newAndSave 创建新的管理员用户
 */
exports.newAndSave = function(obj, cb) {
  var admin = new Admin();
  Object.keys(obj).forEach(function(k) {
    admin[ k ] = obj[ k ];
  });
  admin.save(cb);
};

/*
 * 获取审核商品的管理员
 */
exports.getCommodityAdmin = function(cb) {
  Admin.find({ root: 1, isBlock: false }, cb);
};

/*
 * addMyCommodity 用户发布新商品之后 管理员将商品 id 更新到 myCommodity 字段里面来
 * @param { String } 用户的 id
 * @param { String } 新添加商品的 id
 * @param { Function } 回调函数
 */
exports.addMyCommodity = function(userId, commodityId, cb) {
  Admin.update({ _id: userId }, {
    $addToSet: { myCommodity: commodityId }
  }, cb);
};

/*
 * rmMyCommodity 从 myCommodity 中,删除某个 id
 * @param { String } 用户的 id
 * @param { String } 需要删除的商品 id
 * @param { Function } 回调函数
 */
exports.rmMyCommodity = function(userId, commodityId, cb) {
  Admin.update({ _id: userId }, {
    $pull: { myCommodity: commodityId }
  }, cb);
};

/*
 * addPassCommodity 商品审核通过之后 管理员将商品 id 添加到 passCommodity 字段里面来
 * @param { String } 用户的 id
 * @param { String } 新添加商品的 id
 * @param { Function } 回调函数
 */
exports.addPassCommodity = function(userId, commodityId, cb) {
  Admin.update({ _id: userId }, {
    $addToSet: { passCommodity: commodityId }
  }, cb);
};
