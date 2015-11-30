var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommoditySchema = new Schema({
	title: { type: String},
	category: { type: String},
	host_id: { type: ObjectId},
	howOld: { type: Number},
	price: { type: Number},
	coverImg: { type:String},
	gotTime: { type: Date},
	gotPrice: { type:Number},
	content: { type: String},
	isSaled: { type: Boolean},
	createTime: {type: Date, default:Date.now()},
	updateTime: {type: Date, default:Date.now()},
	replyCount:{ type:Number,default:0},
	visitedCount: {type:Number,default:0},
	status:{ type:Number,default:0},  // 0 为审核状态， 1上架 2下架 3 审核没通过 4 被删除
},{autoIndex: false});

CommoditySchema.index({createTime:-1});
CommoditySchema.index({host_id:1,createTime:-1});

mongoose.model('Commodity',CommoditySchema);
