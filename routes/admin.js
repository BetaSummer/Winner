var express = require('express');
var router = express.Router();
var category = require('../controller/category');
var commodity = require('../controller/commodity');

router.get('/', function(req, res, next) {
  res.send(' nice to meet you today   : )');
});

// 商品类别操作
router.get('/addCategory', category.showAddCategory);
router.post('/addCategory', category.addCategory);

router.get('/editCategory', category.showEditCategory);
router.post('/editCategory', category.editCategory);

// 商品管理
router.get('/commodities', commodity.showIndex);
router.get('/commodity/:id', commodity.showCommodityDetail);

router.post('/rejectCommodity/:id', commodity.rejectCommodity);

// 用户管理

module.exports = router;
