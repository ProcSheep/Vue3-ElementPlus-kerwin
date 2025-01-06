const RoleModel = require("../model/RoleModel")


module.exports = {
    // 下面均为mongodb数据库操作

    getList() {
        // 操作模型model的RightModel,返回的是一个promise对象(异步)
        // 返回一个模型.find() mongoose基本语法操作 查询全部, RightModel是我们写的一个模型
        return RoleModel.find()
    },

    updateList(id,{roleName,rights}){
        // 更新,根据id更新
        return RoleModel.findByIdAndUpdate(id,{
            roleName, // 简写
            rights
        })
    },

    deleteList(id){
        return RoleModel.findByIdAndDelete(id)
    }


}