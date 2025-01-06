const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserType = {
    // id会自动生成,roles.json数据文件的格式限制
    "username":String,
    "password": String,
    // role用户权限表会影响user用户列表,所以对user的role区域建立关联字段
    // user表中的role属性根据role表内容来的,通过role表的_id寻找
    // ?? 新知识: 写好类型ObjectId类型,第二个是关联的谁,关联role模型(RoleModel的命名)
    // 把id放进role(users),根据id找到role里面相对应的id
    "role": {type:Schema.Types.ObjectId,ref:"role"},
    "default": Boolean // 禁用功能
}
// user(lib的新json) ---> users
const UserModel = mongoose.model("user",new Schema(UserType))

module.exports = UserModel