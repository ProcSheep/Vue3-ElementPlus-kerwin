var express = require('express');
var CompanyRouter = express.Router();
var CompanyController = require("../controllers/CompanyController.js")

// 获取数据的 get
CompanyRouter.get("/adminapi/companys",CompanyController.getList)

// 添加用户的,数据发送方式和getList不同,这是post请求
CompanyRouter.post("/adminapi/companys",CompanyController.addList)
// 动态路由,:id是占位符,无论占位符输入什么都可以访问到/adminapi/users/
CompanyRouter.put("/adminapi/companys/:id",CompanyController.updateList)


module.exports = CompanyRouter // 记得app.js注册
