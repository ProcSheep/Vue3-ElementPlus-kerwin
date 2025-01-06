const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ClassType = {
    "title": String, // 班级名字
    "number": Number // 班级人数
}
// class ---> classes
const ClassModel = mongoose.model("class",new Schema(ClassType))

module.exports = ClassModel