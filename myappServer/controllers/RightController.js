const RightService = require("../service/RightService")

module.exports ={
    // 2个系统参数,接受前端的请求req合返回给前端的数据res
    async getList(req,res){
        // 再向sevice发起一波请求,这是异步
        // 等待RightService操作数据库,映射数据库的内容给result
        var result = await RightService.getList()
        res.send(result) // 把请求的数据传回给前端
    },
    async updateList(req,res){
        // 把更新的数据都放在请求数据req的body里面
        var result = await RightService.updateList(req.body)
        res.send(result) // 把请求的数据传回给前端
    },
    async deleteList(req,res){
        // 把删除的数据都放在请求数据req的body里面
        var result = await RightService.deleteList(req.body)
        res.send(result) // 把请求的数据传回给前端
    }
}