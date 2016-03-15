var express = require('express');
var router = express.Router();
var category = require('../controller/category');

router.get('/', function(req, res, next) {
  res.send(' nice to meet you today   : )');
});

// 商品类别操作
router.get('/addCategory', category.showAddCategory);
router.post('/addCategory', category.addCategory);

router.get('/editCategory', category.showEditCategory);
router.post('/editCategory', category.editCategory);

module.exports = router;
