var express = require('express');
var CompanyStudentRouter = express.Router();
var CompanyStudentController = require("../controllers/CompanyStudentController.js")

// 获取数据的 get
CompanyStudentRouter.get("/adminapi/companystudents",CompanyStudentController.getList)

// 添加用户的,数据发送方式和getList不同,这是post请求
CompanyStudentRouter.post("/adminapi/companystudents",CompanyStudentController.addList)
// 动态路由,:id是占位符,无论占位符输入什么都可以访问到/adminapi/users/
// StudentRouter.put("/adminapi/companys/:id",StudentController.updateList)

module.exports = CompanyStudentRouter // 记得app.js注册
