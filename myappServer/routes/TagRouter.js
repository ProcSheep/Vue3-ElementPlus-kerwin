var express = require('express');
var TagRouter = express.Router();
var TagController = require("../controllers/TagController.js")

// 获取数据的 get
TagRouter.get("/adminapi/tags",TagController.getList)

// 添加用户的,数据发送方式和getList不同,这是post请求
TagRouter.post("/adminapi/tags",TagController.addList)
// 动态路由,:id是占位符,无论占位符输入什么都可以访问到/adminapi/users/
TagRouter.put("/adminapi/tags/:id",TagController.updateList)
TagRouter.delete("/adminapi/tags/:id",TagController.deleteList)

module.exports = TagRouter // 记得app.js注册
