var express = require('express');
var router = express.Router();
var commodity = require('../controller/commodity');
var auth = require('../middlewares/auth');

router.get('/', commodity.getCommodities);

module.exports = router;
