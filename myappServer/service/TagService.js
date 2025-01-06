const TagModel = require("../model/TagModel")

module.exports = {
    // 下面均为mongodb数据库操作

    getList() {
        // 额外排序工作: 后端返回数据时,按照grade数据进行正序排序,1为正序,-1为倒序
        // 这一步是为了,添加完数据后,更新页面时能够按照顺序来,这个工作不交给前端做了
        return TagModel.find().sort({grade:1})
    },

    addList(data){
        return TagModel.create(data)
    },

    updateList(id,data){
        return TagModel.findByIdAndUpdate(id,data)
    },

    deleteList(id){
        return TagModel.findByIdAndDelete(id)
    }

}