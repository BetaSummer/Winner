var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var CommoditySchema = new Schema({
  title: { type: String }, // 商品标题
  categoryId: { type: ObjectId }, // 商品分类 最细的一个分类
  name: { type: String }, // 商品名称
  hostId: { type: ObjectId }, // 商品主人
  howNew: { type: Number }, // 成色
  price: { type: Number }, // 价格
  coverImage: { type: String, default: '/dist/images/image.png' }, // 封面图片
  gotTime: { type: Date }, // 入手时间
  gotPrice: { type: Number }, // 入手价格
  content: { type: String }, // 商品详情
  createTime: { type: Date, default: Date.now() }, // 创建时间
  updateTime: { type: Date, default: Date.now() }, // 更新时间
  replyCount: { type: Number, default: 0 }, // 回复数量
  reply: [ { type: ObjectId, ref: 'Reply' } ], // 一级评论
  visitedCount: { type: Number, default: 1 }, // 访问次数
  status: { type: Number, default: 0 }, // 0 为审核状态, 1 上架, 2 下架, 3 审核没通过, 4 被删除, 5 为再次审核状态, 6 被卖掉, 7 草稿状态
  qq: { type: Number },
  weChat: { type: String },
  userName: { type: String }, // 用户名, 前台默认控制为 nickname
  phoneNum: { type: Number }, // 默认是登录时的号码可修改
  isBlock: { type: Boolean, default: false } // 是否被禁止
}, { autoIndex: false });

CommoditySchema.index({ updateTime: -1 });

CommoditySchema.index({ hostId: 1, createTime: -1 });

CommoditySchema.index({ status: 1 });

var Commodity = mongoose.model('Commodity', CommoditySchema);

module.exports = Commodity;
