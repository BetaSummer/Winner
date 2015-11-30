var express = require('express');
var router = express.Router();
var sign = require('../controller/sign');
var auth = require('../middlewares/auth');
var commodity = require('../controller/commodity');
var user = require('../controller/user');

router.get('/',commodity.showIndex);
router.get('/userTop',user.showTopUser);

router.get('/reg',sign.showReg);
router.get('/login',sign.showLogin);

router.get('/forgetPass',function(req,res,next){
	res.render('index',{title:'忘记密码界面'})
});
// 个人中心i
router.get('/user/:id',user.showUserCenterIndex);
router.get('/user/:id/myFollows',user.showMyFollows);
router.get('/user/:id/myFocus',user.showMyFocus);
router.get('/user/:id/myCommodity',user.showMyCommodity);

// 用户信息设置
router.get('/setting',user.showSettingIndex);
router.get('/settingHeader',user.showSettingHeader);
router.get('/settingPass',user.showSettingPass);
router.get('/settingBind',user.showSettingBind);

// 商品
router.get('/publish',commodity.showPublish);
router.get('/edit/:id',commodity.editCommodity);
router.get('/commodity/:id',commodity.commodityDetail);



module.exports = router;
