const RoleService = require("../service/RoleService")

module.exports ={
    // 2个系统参数,接受前端的请求req合返回给前端的数据res,再向sevice发起一波请求,这是异步
    async getList(req,res){
        var result = await RoleService.getList()
        res.send(result) // 把请求的数据传回给前端
    },
    async updateList(req,res){
        // 从nodejs终端看
        // console.log(req)
        // console.log(req.body) // 请求体 
        // console.log(req.params.id) // 拿到动态路由的值
        // 把更新的数据都放在请求数据req的body里面
        var result = await RoleService.updateList(req.params.id,req.body)
        res.send(result) // 把请求的数据传回给前端
    },
    async deleteList(req,res){
        var result = await RoleService.deleteList(req.params.id)
        res.send(result) // 把请求的数据传回给前端
    }
}

/*
req: 巨长一串,内部有许多的信息,不复制了
req.body:
{
  roleName: '管理员',
  rights: [
    '/tag-manage',
    '/tag-manage/list',
    '/student-manage',
    '/student-manage/studentlist',
    '/student-manage/gradelist',
    '/user-manage',
    '/user-manage/list',
    '/interview-manage',
    '/interview-manage/companylist',
    '/interview-manage/companydata',
    '/right-manage',
    '/right-manage/rolelist',
    '/right-manage/rightlist'
  ]
}
---------------
req.params
{ id: '6735c31e720e4a1fa219868d' }
// 我们直接取其id即可
*/