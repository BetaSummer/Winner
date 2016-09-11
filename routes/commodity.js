var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var commodity = require('../controller/commodity');
var auth = require('../middlewares/auth');

router.all('*', auth.loginRequired);
// 新商品发布， 详情页， 编辑页
router.get('/', commodity.showPublish);
router.get('/:id', commodity.showCommodityDetail);
router.get('/:id/edit', commodity.showCommodityEdit);
// 发布商品
router.post('/', multipartMiddleware, commodity.publish);
// 编辑更新商品信息
// 商品描述自动保存
router.put('/:id', multipartMiddleware, commodity.edit);
// 商品信息
router.put('/:id/info', commodity.editInfo);
// 商品封面
router.put('/:id/img', multipartMiddleware, commodity.editImg);
// 商品主人联系方式
router.put('/:id/connect', commodity.editConnect);
router.delete('/:id', commodity.unPublish);

// 举报商品 -> 理由 -> 发送给管理员
// router.post('/:id/')

// // 添加评论 // 包括回复评论
// router.post('/:id/reply', )

module.exports = router;