import axios from 'axios'

function Untilkerwinupload(path,userForm) {
    // 当你需要处理文件上传或者构建更复杂的表单数据结构，包括同时包含文件和文本数据的表单时,new FormData()就非常有用,可以使用FormData对象来构建请求体数据,将表单的信息一个个存入FormData对象里面,作为axios向后端发送的数据载体,同时搭配请求头multipart/form-data
    const params = new FormData()
    for (let i in userForm) { // 获取userForm表单对象的每一个key
        if (i !== "avatar") { // 我们不需要avatar的值(avatarUrl)进后端,这个没有用,avatarUrl作用只是作为特殊的二进制编码,给表单提交图片的src赋值,显示临时图片效果,重新选择图片或者跳转页面过后,会被销毁,真正需要传给后端的是图片信息存储的属性file,将来初始化页面的时候(用户已经修改过个人信息,并将头像图片传递给后端存储在数据库了),从数据库获取file数据,在通过URL.createObjectURL()转化即可又获取到特殊的二进制编码,也就是之前avatarUrl的数据,所以存储avatar属于多此一举,file信息内隐含它的信息,只需要通过转化即可获得
            params.append(i, userForm[i]) // 添加userForm表单的数据,格式类似于 "username" : "张三" (key,value)
        }
    }

    return axios.post(path,params, {
        headers: {
            "Content-Type": "multipart/form-data" // 针对file属性值为文件数据信息
        }
    })
}

export default Untilkerwinupload