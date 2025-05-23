const TagService = require("../service/TagService")

module.exports ={
    // 2个系统参数,接受前端的请求req合返回给前端的数据res,再向sevice发起一波请求,这是异步
    async getList(req,res){
        var result = await TagService.getList()
        res.send(result) // 把请求的数据传回给前端
    },
    async addList(req,res){
        var result = await TagService.addList(req.body)
        res.send(result) // 把请求的数据传回给前端
    },
    async updateList(req,res){
        var result = await TagService.updateList(req.params.id,req.body)
        res.send(result) // 把请求的数据传回给前端
    },
    async deleteList(req,res){
        var result = await TagService.deleteList(req.params.id)
        res.send(result) // 把请求的数据传回给前端
    }
}
