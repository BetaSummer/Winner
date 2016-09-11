var models = require('../models');
var Commodity = models.Commodity;

/**
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

/**
 * getCommodityById 通过 id 获取商品
 * @param { String } 商品 id
 * @param { Function } 回调函数
 *  - err
 *  - obj
 */
exports.getCommodityById = function(id, cb) {
  Commodity.findOne({ _id: id }, cb);
};

/**
 *  getCommodities 根据更新时间排序，
 *  然后从第 skip 开始取 limit 个 commodity
 *  @param { Number }  page 第几页
 *  @param { Number }  limit 每页的数量
 *  @param { Object }  查询条件，如 status, categoryId ...
 *  @param { Function } 回调函数
 *  - err
 *  - commodities { Array }
 */
exports.getCommodities = function(page, limit, query, cb) {
  var skip = limit * page
  if (typeof query === 'function') {
    cb = query;
    query = {};
  }
  Commodity.find(query)
    .sort({
      updateTime: -1
    })
    .skip(skip)
    .limit(limit)
    .exec(cb);
};


/**
 * getCommodityHosterById 根据商品来获取主人的头像，暱称，id
 * @param { Number }  商品 id
 * @param { Number }  回调函数
 *  - err
 *  - doc { object }
 */
exports.getCommodityHosterById = function(commodityId, cb) {
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

/**
 * updateCommodityById 根据商品 id 更新商品信息
 * @param { String } 商品 id
 * @param { Object } 需要更新的信息内容
 * @param { Function } 回调函数
 *  - err
 *  - info
 */
exports.updateCommodityById = function(id, obj, cb) {
  Commodity.update({
    _id: id
  }, {
    $set: obj
  }, {
    upsert: true,
    multi: true
  }, cb);
};

/**
 * addCommodityVisited 添加浏览量
 * @param { String } 商品 id
 * @param { Object } 需要更新的信息内容
 * @param { Function } 回调函数
 *  - err
 *  - info
 */
// 可以直接调用 updateByCommodityId
// mongodb 提供自增的方法 
exports.addCommodityVisited = function(id, visitedCount, cb) {
  Commodity.findByIdAndUpdate(id, {
    $set: {
      visitedCount: visitedCount + 1
    }
  }, cb);
};

/**
 * updateCommodityStatus 设置商品的状态
 * 0 为审核状态, 1 上架, 2 下架, 3 审核没通过, 4 被删除, 5 为再次审核状态, 6 为被卖掉
 * @param { String } 商品 id
 * @param { Number } 商品状态码
 * @param { Function } 回调函数
 */
var updateCommodityStatus = exports.updateCommodityStatus = function(id, status, cb) {
  Commodity.findByIdAndUpdate(id, {
    $set: {
      status: status
    }
  }, cb);
};

/**
 * onlineCommodity 上架商品
 * @params { String } 商品 id
 * @params { Function }
 */
exports.onlineCommodity = function(id, cb) {
  updateCommodityStatus(id, 1, cb);
};

/**
 * offlineCommodity 下架商品
 * @params { String } 商品 id
 * @params { Function }
 */
exports.offlineCommodity = function(id, cb) {
  updateCommodityStatus(id, 2, cb);
};

/**
 * blockCommodity 禁止某件商品
 * @param { String } 商品 id
 * @param { Function } 回调
 */
exports.blockCommodity = function(id, cb) {
  updateCommodityStatus(id, 3, cb);
  // 标记为审核不通过 并发送响应的理由
};
