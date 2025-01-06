const mongoose = require("mongoose")
const Schema = mongoose.Schema

const RightType = {
    // 对myapp的rights.js(public/lib)的格式进行限制
    "title":String,
    "path": String,
    "icon": String,
    "children": Array
}
// 编译第一个模型，您需要调用 mongoose.model() 方法，并传入模型名称和 Schema
// 创建一个right模型,它映射的数据库表的名字就是rights
// new Schema()是对模型的数据进行约束限制
const RightModel = mongoose.model("right",new Schema(RightType))

module.exports = RightModel