var express = require('express');
var router = express.Router();
var category = require('../controller/category');
var commodity = require('../controller/commodity');

/**
 * 根据标签 id, 获取该标签的所有商品
 * 当然会有一个 query 比如分页的相关值
 * proxy 需要有一个方法, 提供计算查询结果的 total 值，
 * per_page 每个页面展示的数据
 * page 当前展示的页面
 * /category/:id
 */

router.get('/:id', function(req, res, next) {
  req.query.categoryId = req.params.id;
  next();
}, commodity.getCommodities);

/**
 * 获取该标签的相关标签，包括父标签和子标签
 */
// router.get('/parent/:parent', category.getCategories);

module.exports = router;
