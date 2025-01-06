const CompanyModel = require("../model/CompanyModel")

module.exports = {
    // 下面均为mongodb数据库操作

    getList() {
        return CompanyModel.find()
    },

    async addList(data) {
        // 处理重复文件的逻辑: 更新操作,无论有没有,直接更新,有的话即使重复名字也只是覆盖,没有的话就创建
        // data是公司数据,是一个数组,有多个数据,所以要遍历
        for (let i of data) {
            await CompanyModel.findOneAndUpdate({
                title: i.title, // 根据查询名字
            }, {
                $set: i // 查到,更新
            }, {
                upsert: true, // 查不到,插入
            })
        }
        return []
    },

    async updateList(id,data){
        return CompanyModel.findByIdAndUpdate(id,data) // 根据id找到对应数据,更新数据为data
    }

}