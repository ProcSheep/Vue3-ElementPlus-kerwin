var express = require('express');
var RightRouter = express.Router();
// 引入controllers的RightController文件
var RightController = require("../controllers/RightController")

// 前端访问get请求"/adminapi/rights" ---> 读取controllers的getList方法(写在controllers文件夹内)
RightRouter.get("/adminapi/rights",RightController.getList)
// 前端更新数据put请求(用户权限名字更新) 和get一个流程
RightRouter.put("/adminapi/rights",RightController.updateList)
// 前端删除列表delete请求
RightRouter.delete("/adminapi/rights",RightController.deleteList)

// 在app.js注册这个路由
module.exports = RightRouter
