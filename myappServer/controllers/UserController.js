const UserService = require("../service/UserService")
const JWT = require("../util/JWT")

module.exports = {
    // 2个系统参数,接受前端的请求req合返回给前端的数据res,再向sevice发起一波请求,这是异步
    async getList(req, res) {
        var result = await UserService.getList()
        res.send(result) // 把请求的数据传回给前端
    },
    async login(req, res) {
        var result = await UserService.login(req.body)
        // console.log(req.body)
        // console.log(result)
        if (result.length > 0) {
            // 不要返回密码
            let { _id, username, role } = result[0]
            // 引入JWT使用其内部创建token的函数,把用户的_id和username封装,进行token加密
            const token = JWT.generate({
                _id, // 简写
                username
            },"1d") // 1d = 1day
            // 把token存在请求头中,潜规则命名为Authorization(可以随意起,但不建议)
            res.header("Authorization", token)
            res.send({
                ActionType: "OK",
                data: { _id, username, role }// 返回匹配的数据
            })
        } else {
            // 如果不改变状态码,虽然我们心里认为这是个失败返回(ActionType: "fail"),但是电脑还是会接收到一个对象,它会认为这是成功(因为有res返回值,它才不管你里面写的什么,代表什么意思,有返回就是OK),状态码200
            // 所以我们必须定义400,请求失败的状态码,同时返回失败的信息
            // 记得学生登录校验同步修改
            res.status(400).send({
                ActionType: "fail" // 没有数据
            })
        }
    },
    async addList(req, res) {
        var result = await UserService.addList(req.body)
        res.send(result) // 把请求的数据传回给前端
    },
    async updateList(req, res) {
        var result = await UserService.updateList(req.params.id, req.body)
        res.send(result) // 把请求的数据传回给前端
    },
    async deleteList(req, res) {
        var result = await UserService.deleteList(req.params.id)
        res.send(result) // 把请求的数据传回给前端
    }
}
