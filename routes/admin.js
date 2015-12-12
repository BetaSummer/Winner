var express = require('express');
var router = express.Router();
var category = require('../controller/category');
var auth = require('../middlewares/auth');
var user = require('../controller/user');
var commodity = require('../controller/commodity');

/* GET users listing. */
router.get('/',function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/addCategory',category.showAddCategory);
// 创建目录 如果数据库没有
// router.post('/createCategory',category.createCategory);
router.post('/addFirstNav',function(req,res){
  console.log(req.body)
});
// 添加目录
// router.post('/addCategory',category.addCategory)

module.exports = router;
