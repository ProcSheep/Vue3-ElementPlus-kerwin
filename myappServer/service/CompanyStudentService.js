const CompanyStudentModel = require("../model/CompanyStudentModel")

module.exports = {
    // 下面均为mongodb数据库操作

    getList() {
        return CompanyStudentModel.find()
    },

    async addList(data) {
        // 处理重复文件的逻辑: 更新操作,无论有没有,直接更新,有的话即使重复名字也只是覆盖,没有的话就创建
        
        for (let i of data) {
            await CompanyStudentModel.findOneAndUpdate({
                // 当学生名字和公司名字都一样时,认为这是个重复数据
                // 这里的数据样本很少,所以不用很严谨,常规操作应当录入更多的信息防止重复,比如学号,毕业院校,公司id等
                studentname: i.studentname, 
                company: i.company
            }, {
                $set: i // 查到,更新
            }, {
                upsert: true, // 查不到,插入
            })
        }
        return []
    },

}