const UserModel = require("../model/UserModel")

module.exports = {
    // 下面均为mongodb数据库操作

    getList() {
        // 连表查询 ?? ,连role表
        return UserModel.find().populate("role")
    },

    login(data){
        // 查询是否有这个用户数据
        return UserModel.find(data).populate("role")
    },

    addList(data){
        // 添加数据
        return UserModel.create(data)
    },

    updateList(id,data){
        // 直接覆盖更新,自动覆盖user表内的同字段的username,password和role的内容
        return UserModel.findByIdAndUpdate(id,data)
    },

    deleteList(id){
        return UserModel.findByIdAndDelete(id)
    }

}