const CompanyService = require("../service/CompanyService")

module.exports ={
    // 2个系统参数,接受前端的请求req合返回给前端的数据res,再向sevice发起一波请求,这是异步
    async getList(req,res){
        var result = await CompanyService.getList()
        res.send(result) // 把请求的数据传回给前端
    },
    async addList(req,res){
        var result = await CompanyService.addList(req.body)
        res.send(result) // 把请求的数据传回给前端
    },
    async updateList(req,res){
        var result = await CompanyService.updateList(req.params.id,req.body) // 传递path中的id信息和请求体
        res.send(result) // 把请求的数据传回给前端
    },
}
