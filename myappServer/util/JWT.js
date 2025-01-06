// 简单地使用jsonwebtoken的部分功能,实现基础的token生成业务和校验业务
const jsonwebtoken = require('jsonwebtoken')
const secret = "kerwin" // 额外加密的数据,盐

// // 测试
// // sign内置方法,生成token
// var token = jsonwebtoken.sign({
//     data: 'foobar'
// }, secret, { expiresIn: '1000ms' }); // expiresIn保质期 1s
// console.log(token)

// // verify内置方法,校验token
// console.log(jsonwebtoken.verify(token,secret)) // 校验密钥token是否过期,立即校验
// // 延时2s
// setTimeout(()=>{
//     // console.log(jsonwebtoken.verify(token,secret)) // TokenExpiredError: jwt expired 密钥过期错误
//     // 为了不是编译器报错终端,使用try-catch捕捉
//     try{
//         console.log(jsonwebtoken.verify(token,secret))
//     }catch(e){
//         console.log("密钥过期了")
//     }
// },2000)

// 封装一个JWT对象,内含生成token和校验token2个函数
const JWT = {
    generate(value, expires) { // value: 要生成密钥的数据 expires: 保质期时间
        // 密钥secret已经在上面了,使用JWT的人不能知道这个密钥,这是双层保险,没有这个密钥,即使窃取了token,也无法解析
        return jsonwebtoken.sign(value, secret, { expiresIn: expires }) 
    },
    verfiy(token) { // token: 要检验的token
        try{
            return jsonwebtoken.verify(token,secret) // 成功了返回解析内容
        }catch(e){
            return false // 过期了返回false
        }
    }
}

module.exports = JWT

