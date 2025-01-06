const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CompanyType = {
    "title": String, // 公司名字
    "interview": String // 面试题
}
// company ---> companies
const CompanyModel = mongoose.model("company",new Schema(CompanyType))

module.exports = CompanyModel