const StudentService = require("../service/StudentService")
const JWT = require("../util/JWT")


module.exports = {
    // 2个系统参数,接受前端的请求req合返回给前端的数据res,再向sevice发起一波请求,这是异步
    async getList(req, res) {
        var result = await StudentService.getList()
        res.send(result) // 把请求的数据传回给前端
    },
    async addList(req, res) {
        // console.log(req.body)
        var result = await StudentService.addList(req.body)
        res.send(result) // 把请求的数据传回给前端
    },
    async login(req, res) { // 登录校验
        // console.log(req.body)
        var result = await StudentService.login(req.body)
        if (result.length > 0) {
            // 不要返回密码
            let { _id, studentname,introduction,avatarUrl,gender } = result[0]
            // 引入JWT使用其内部创建token的函数,把用户的_id和username封装,进行token加密
            const token = JWT.generate({
                _id, // 简写
                username: studentname
            }, "1d") // 1d = 1day
            // 把token存在请求头中,潜规则命名为Authorization(可以随意起,但不建议)
            res.header("Authorization", token)
            res.send({
                ActionType: "OK",
                data: {
                    _id, username: studentname, // 统一格式
                    introduction,avatarUrl,gender, // 额外返回信息,用于center页面的介绍,头像地址,性别信息
                    "role": { // 学生登录的role信息是固定的,不可更改
                        "roleName": "学生",
                        "roleType": 3,
                        "rights": [
                            // 学生可以登录的路由
                            "/index",
                            "/center",
                            "/interview-manage",
                            "/interview-manage/companylist",
                            "/interview-manage/companydata",
                            "/student-manage",
                            "/student-manage/studentlist",
                        ]
                    }
                }// 返回匹配的数据
            })
        } else {
            res.status(400).send({
                ActionType: "fail" // 没有数据
            })
        }
    },
    async updateList(req, res) {
        var result = await StudentService.updateList(req.params.id, req.body)
        res.send(result) // 把请求的数据传回给前端
    },
    async upload(req, res) { // 更新个人中心函数
        // console.log(req.file,req.body) // multer使用方法,打印一下配置的file文件信息req.file和其他请求体信息req.body
        // res.send([])
        // 传参, 占位符的id , 图片文件的信息(自成一体) , 其他信息(请求体)
        var result = await StudentService.upload(req.params.id, req.file, req.body)
        res.send(result) 
    },
    async deleteList(req, res) {
        var result = await StudentService.deleteList(req.params.id)
        res.send(result) 
    },
}
