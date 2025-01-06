var express = require('express');
var RoleRouter = express.Router();
var RoleController = require("../controllers/RoleController.js")

RoleRouter.get("/adminapi/roles",RoleController.getList)
// 动态路由,:id是占位符,无论占位符输入什么都可以访问到/adminapi/roles/
RoleRouter.put("/adminapi/roles/:id",RoleController.updateList)
RoleRouter.delete("/adminapi/roles/:id",RoleController.deleteList)

module.exports = RoleRouter // 记得app.js注册
