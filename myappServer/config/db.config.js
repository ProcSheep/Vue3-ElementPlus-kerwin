const mongoose = require("mongoose")
// 连接到如下端口号27107,就是我们刚才开启的mongdb的数据库,没有文件会自动创建一个
// 连接mongodb数据库
mongoose.connect("mongodb://127.0.0.1:27017/smart-student-system")