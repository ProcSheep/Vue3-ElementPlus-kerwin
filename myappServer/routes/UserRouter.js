var express = require('express');
var UserRouter = express.Router();
var UserController = require("../controllers/UserController.js")

// 获取数据的 get
UserRouter.get("/adminapi/users",UserController.getList)
// 校验登录的 + 内部有JWT
UserRouter.post("/adminapi/users/login",UserController.login)
// 添加用户的,数据发送方式和getList不同,这是post请求
UserRouter.post("/adminapi/users/",UserController.addList)
// 动态路由,:id是占位符,无论占位符输入什么都可以访问到/adminapi/users/
UserRouter.put("/adminapi/users/:id",UserController.updateList)
UserRouter.delete("/adminapi/users/:id",UserController.deleteList)

module.exports = UserRouter // 记得app.js注册
