const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CompanyStudentType = {
    // 学生数据的录入: 属性与excel每列的标题名一样,这样方便录入数据,即从excel提取出数据后,可以直接录入数据库对应的同名属性中
    "company": String, // 公司名字
    "employ_date": String, // 雇佣日期
    "salary": String, // 薪资
    "studentname": String // 学生姓名 
}
// companystudent ---> companystudents
const CompanyStudentModel = mongoose.model("companystudent",new Schema(CompanyStudentType))

module.exports = CompanyStudentModel