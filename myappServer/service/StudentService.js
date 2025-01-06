const StudentModel = require("../model/StudentModel")

module.exports = {
    // 下面均为mongodb数据库操作
    getList() {
        // 连表查询classes表,不过写的是模型名class
        return StudentModel.find().populate("class")

        // 麻烦写法
        // 补充: nodejs的知识aggregate,kerwin应该讲过,但我没听kerwin的nodejs部分的课
        // return StudentModel.aggregate([
        //     {
        //         "$lookup" : {
        //             "from": "classes", // 2.关联classes表
        //             "localField": "class", // 1.当前表中,找到class属性
        //             "foreignField": "_id", // 3.根据_id去关联每一项
        //             "as" : "kerwinMatch" // 4.随意起名字
        //         }
        //         // 总结: 学生表的class属性的值是关联classes表的,依据classes表的_id去关联每一项数据,最后放入kerwinMatch中
        //     }
        // ])

    },

    async addList(data){
        // create可以接受对象,一次存一条; 也可以接受数组,一次存一组
        // 但是要切合Schema的解构要求,即数组的每一项item为定义的Schema格式
        const list = data.list.map(item=>({
            studentname: item.studentname,
            class: data.class,
            score: {},
            password: "123" // + 添加密码属性
        }))
        console.log(list) // 打印映射结构
        // 学生也要放重复
        for(let i of list){
            // 和班级一样,只不过要一个一个学生地处理
            await StudentModel.updateOne({
                studentname: i.studentname      
            },{
                $set: i
            },{upsert:true})
        }
        
        return []
    },


    login(data){ // 登录校验函数
        return StudentModel.find(data)
    },

    // 重点: 深度更新数据,更新的是学生的score属性值
    updateList(id,{key,value}){
        return StudentModel.findByIdAndUpdate(id,{
            "$set":{
                // "score.html5": 5 写死的
                ["score." + key]:value // 对象的动态写法,基础知识,不常用,别忘了
            }
        })
    },

    // 更新center页面的函数
    upload(id,file,body){
        if(file){ // 更新头像了,file不为null
            return StudentModel.findByIdAndUpdate(id,{
                ...body,
                studentname: body.username, // body内的名字和数据库名字不同,同步并覆盖一下
                avatarUrl: `/uploads/${file.filename}` // 因为在静态文件夹,所以省略public,filename是multer对图片名字信息的重命名,这样我们前端src的本地地址也配置好了
            },{returnDocument: "after"}) // 额外属性: 获取更新后的信息
        }else{ // 没有更新头像,file为null,所以就不更新了
            return StudentModel.findByIdAndUpdate(id,{
                ...body,
                studentname: body.username, // body内的名字和数据库名字不同,同步并覆盖一下
            },{returnDocument: "after"}) // 额外属性: 获取更新后的信息
        }

    },

    deleteList(id){
        return StudentModel.deleteMany({ // 删除多个
            class: id // 只要学生的class属性为id的(id是班级的Object属性),就删除
        })
    }

}