// 商品类目管理

var express = require('express');
var router = express.Router();
var category = require('../../controller/category');
var commodity = require('../../controller/commodity');

// 标签查询商品
router.get('/:id', commodity.showIndex);
router.get('/add', category.showAddCategory);
router.post('/add', category.showAddCategory);
router.get('/:id/edit', category.showEditCategory);
router.put('/:id', category.editCategory)
module.exports = router;