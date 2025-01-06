var express = require('express');
var ClassRouter = express.Router();
var ClassController = require("../controllers/ClassController.js")

// 获取数据的 get
ClassRouter.get("/adminapi/classes",ClassController.getList)
// 添加用户的,数据发送方式和getList不同,这是post请求
ClassRouter.post("/adminapi/classes",ClassController.addList)
// 动态路由,:id是占位符,无论占位符输入什么都可以访问到/adminapi/users/
// ClassRouter.put("/adminapi/classes/:id",ClassController.updateList) // 不涉及更新功能
ClassRouter.delete("/adminapi/classes/:id",ClassController.deleteList)

module.exports = ClassRouter // 记得app.js注册
