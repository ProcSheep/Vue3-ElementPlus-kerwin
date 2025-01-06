const mongoose = require("mongoose")
const Schema = mongoose.Schema

const RoleType = {
    // id会自动生成,roles.json数据文件的格式限制
    "roleName":String,
    "roleType": Number,
    "rights": Array
}
// role ---> roles
const RoleModel = mongoose.model("role",new Schema(RoleType))

module.exports = RoleModel