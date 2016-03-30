// 处理商品的数据库方法
var models = require('../models');
var Commodity = models.Commodity;

/*
 * getCommodityById 通过 id 获取商品
 * @param { String } 商品 id
 * @param { Function } 回调函数
 *  - err
 *  - obj
 */
exports.getCommodityById = function(id, cb) {
  Commodity.findOne({
    _id: id
  }, cb);
};

/*
 * @param { Object } 上传对象
 * - { title:xxx, price:xxx }
 * @param { Function } cb 回调函数
 * - err
 * - commodity { object }
 */
exports.newAndSave = function(obj, cb) {
  var commodity = new Commodity();
  Object.keys(obj).forEach(function(k) {
    commodity[k] = obj[k];
  });
  commodity.save(cb);
};

/*
 *  getCommodities 根据更新时间排序，
 *  然后从第 skip 开始取 limit 个 commodity
 *  @param { Number }  skip 跳过的值
 *  @param { Number }  limit 取的值
 *  @param { String }  categoryId 查询某个 category 下的所有商品(可选)
 *  @param { Function } 回调函数
 *  - err
 *  - commodities { Array }
 */
exports.getCommodities = function(skip, limit, categoryId, cb) {
  if( typeof categoryId === 'function'){
    cb = categoryId;
    categoryId = null;
  }
  var query = categoryId ? {categoryId: categoryId} : {};
  Commodity.find(query)
    .sort({
      updateTime: -1
    })
    .skip(skip)
    .limit(limit)
    .exec(cb);
};

/*
 * getCommodityHoster 根据商品来获取主人的头像，暱称，id
 * @param { Number }  商品 id
 * @param { Number }  回调函数
 *  - err
 *  - doc { object }
 */
exports.getCommodityHoster = function(commodityId, cb) {
  Commodity.findOne({
      _id: commodityId
    })
    .populate({
      path: 'hostId',
      select: {
        _id: 1,
        header: 1,
        nickName: 1
      }
    })
    .exec(cb);
};

/*
 * updateByCommodityId 根据商品 id 更新商品信息
 * @param { String } 商品 id
 * @param { Object } 需要更新的信息内容
 * @param { Function } 回调函数
 *  - err
 *  - info
 */
exports.updateByCommodityId = function(id, obj, cb) {
  Commodity.update({
    _id: id
  }, {
    $set: obj
  }, {
    upsert: true,
    multi: true
  }, cb);
};

/*
 * addCommodityVisited 添加浏览量
 * @param { String } 商品 id
 * @param { Object } 需要更新的信息内容
 * @param { Function } 回调函数
 *  - err
 *  - info
 */
// 这个函数中数据库操作可以优化, 或者直接调用 updateByCommodityId
exports.addCommodityVisited = function(id, visitedCount, cb) {
  Commodity.update({
    _id: id
  }, {
    $set: {
      visitedCount: visitedCount + 1
    }
  }, cb);
};

/*
 * setCommodityStatus 设置商品的状态
 * 0 为审核状态, 1 上架, 2 下架, 3 审核没通过, 4 被删除, 5 为再次审核状态
 * @param { String } 商品 id
 * @param { Number } 商品状态码
 * @param { Function } 回调函数
 */
var setCommodityStatus = exports.setCommodityStatus = function(id, status, cb) {
  Commodity.findByIdAndUpdate(id, {
    $set: {
      status: status
    }
  }, cb);
};

/*
 * hiddenCommodity 下架商品
 * @params { String } 商品 id
 * @params { Function }
 */
exports.hiddenCommodity = function(id, cb) {
  setCommodityStatus(id, 2, cb);
};

/*
 * addedCommodity 上架商品
 * @params { String } 商品 id
 * @params { Function }
 */
exports.addedCommodity = function(id, cb) {
  setCommodityStatus(id, 1, cb);
};

/*
 * blockCommodity 禁止某件商品
 * @param { String } 商品 id
 * @param { Function } 回调
 */
exports.blockCommodity = function(id, cb) {
  setCommodityStatus(id, 3, cb);
  // 标记为审核不通过 并发送响应的理由
};

