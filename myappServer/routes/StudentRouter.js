var express = require('express');
var StudentRouter = express.Router();
var StudentController = require("../controllers/StudentController.js")
// 接受文件需要新的插件multer(隶属express的小插件)
const multer  = require('multer') // npm i multer下载
const upload = multer({ dest: 'public/uploads/' }) // dest存放文件的地址,我们直接存到静态文件夹内部即可

// 获取数据的 get
StudentRouter.get("/adminapi/students",StudentController.getList)
// 添加用户的,数据发送方式和getList不同,这是post请求
StudentRouter.post("/adminapi/students",StudentController.addList)
// 学生登录校验
StudentRouter.post("/adminapi/students/login",StudentController.login)
// 动态路由,:id是占位符,无论占位符输入什么都可以访问到/adminapi/users/
StudentRouter.put("/adminapi/students/:id",StudentController.updateList)
// 需要添加中间件(multer的用法), single()内的参数是存放文件的属性名字file
StudentRouter.post("/adminapi/students/:id/upload",upload.single("file"),StudentController.upload)
StudentRouter.delete("/adminapi/students/:id",StudentController.deleteList)

module.exports = StudentRouter // 记得app.js注册
