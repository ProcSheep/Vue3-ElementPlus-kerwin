const mongoose = require("mongoose")
const Schema = mongoose.Schema
// 与classes表进行连表
const StudentType = {
    "studentname" : String, // excel表格里名字栏就是这么写的,这样命名方便后端数据的处理(特指有中文也要用key-value映射给变成英文)
    "class" : {type:Schema.Types.ObjectId,ref:"class"}, // 学生的班级,链接class的ObjectId
    "score": Object, // 学生的成绩是对象格式,tag标签那里的所有标签就是科目,到时候会有对应的成绩
    "password": String, // 密码类型 
    "avatarUrl": String, //头像值
    "gender": Number, // 0 1 2(对应保密 男 女)
    "introduction": String // 介绍
}
// student ---> students
// {minimize:false} 关掉压缩对象的属性,这样空对象score就能存入数据库了
const StudentModel = mongoose.model("student",new Schema(StudentType,{minimize:false}))

module.exports = StudentModel