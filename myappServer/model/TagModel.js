const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TagType = {
    "title": String,
    "grade": Number
}
// tag(lib的新json) ---> tags
const TagModel = mongoose.model("tag",new Schema(TagType))

module.exports = TagModel