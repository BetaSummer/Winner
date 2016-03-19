var express = require('express');
var router = express.Router();
var category = require('../controller/category');
var commodity = require('../controller/commodity');
var user = require('../controller/user');

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
router.post('/searchCommodities', commodity.searchCommodities);
router.post('/blockCommodity/:id', commodity.blockCommodity);
router.post('/blockCommodities', commodity.blockCommodities);


// 审核商品
router.get('/showCheckCommodityList', commodity.showCheckCommodityList);
router.post('/rejectCommodity/:id', commodity.rejectCommodity);
router.post('/passCommodity/:id', commodity.passCommodity);

// 用户管理
router.get('/showUserList', user.showUserList);
router.get('/user/:id', user.showUser);
router.post('/searchUsers', user.searchUsers);
router.post('/blockUser/:id', user.blockUser);
router.post('/unBlockUser/:id', user.unBlockUser);

module.exports = router;
