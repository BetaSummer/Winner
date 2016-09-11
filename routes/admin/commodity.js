var express = require('express');
var router = express.Router();
var commodity = require('../../controller/commodity');


router.get('/', commodity.showCheckCommoditiesList);
router.get('/:id', commodity.showCheckCommodity);
router.put('/:id/reject', commodity.rejectCommodity);
router.put('/:id/pass', commodity.passCommodity);
// 查封
// router.put('/:id/block', commodity.blockCommodities);


module.exports = router;