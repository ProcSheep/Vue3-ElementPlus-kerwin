const ClassModel = require("../model/ClassModel")

module.exports = {
    // 下面均为mongodb数据库操作

    getList() {
        return ClassModel.find()
    },

    addList(data){
        // return ClassModel.create(data)
        // 处理重复文件的逻辑: 更新操作,无论有没有,直接更新,有的话即使重复名字也只是覆盖,没有的话就创建
        // 后端解决方式: (针对重复updateOne更新不返回数据信息的问题)
        // findOneAndUpdate相对比单纯的更新updateOne的优势: 可以返回数据的信息,即后者如果发现数据已经存在了,只会返回一个查找结果为true的通知,而相关的信息特别是class的ObjectId不会返回给前端,造成如果重复添加一个班级,除第一次,后面覆盖的学生数据将没有class的ObjectId的值
        return ClassModel.findOneAndUpdate({
            title:data.title, // 根据查询名字
        },{
            $set:data // 查到,更新
        },{
            upsert:true, // 查不到,插入
            returnDocument:"after" // 无论查到与否,都会返回数据库中这个对象的所有信息,用于获取此班级的ObjectId的信息
        }) 
    },

    deleteList(id){
        return ClassModel.findByIdAndDelete(id)
    }

}