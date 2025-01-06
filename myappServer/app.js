var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// 引入RightRouter路由,在下面注册
var RightRouter = require('./routes/RightRouter')
var RoleRouter = require('./routes/RoleRouter')
var UserRouter = require('./routes/UserRouter')
var TagRouter = require('./routes/TagRouter')
var ClassRouter = require('./routes/ClassRouter')
var StudentRouter = require('./routes/StudentRouter')
var CompanyRouter = require('./routes/CompanyRouter')
var CompanyStudentRouter = require('./routes/CompanyStudentRouter')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// JWT jsonwebtoken npmjs搜索,一个生成token的插件
const JWT = require('./util/JWT')

// 后端路由拦截,这里不通过,后面的所有use路由挂载都不会执行
// 这样做就不必单独对每个路由进行校验,这里不通过,后面的都白玩
app.use((req, res, next) => {
  // 不拦截这个路由,这个路由中有我们的登录校验功能,其中使用JWT生成token并存入本地
  // 登录的时候肯定还没有token,这里无条件放行,否则本地中将永远获取不到token
  if (req.url === '/adminapi/users/login') {
    next()
    return
  }

  // console.log(req.headers) // 在axios拦截器中,我们设置了请求头的Authorization属性,但是通过打印,发现大写的A变为小写了
  const token = req.headers["authorization"]?.split(" ")[1] // 使用?特殊处理,请求头authorization有内容,就继续下一步,没有内容,就会停止执行?后面的函数,获取token值 'Bearer XXXXXX' 通过空格分割,然后取后面的[1],即token值,而[0]为'Bearer',如果没有,token就为undefined
  if (token) { // 有token
    var payload = JWT.verfiy(token) // 校验token过没过期
    // console.log("校验结果",payload)
    if (payload) { // 成功,获取我们的解析内容,内含_id和username的值
      // 重新生成一个新的token: 这里的token保质期只有5s是为了测试使用
      // 测试效果是: 我们必须连续操作网站,一旦闲置5s后,在操作网站,就会被踢出重新去登录
      // 我们在登录一个网站后,会获得一个token,假设token保质期1h,那么如果我们只在登陆时设置一个1h保质期的token,那么用户必须每隔一小时重新登陆一次,即使用户在使用这个网站,当到达1h后,会被强制退出访问,这是不合理的,我们要实现效果是,只要用户在使用网站,我们就不能让token过期
      // 解决: 在使用网站进行操作时,会发送许多的axios,拦截后,检查密钥是否过期,如果没有过期,那么重新生成一个新的密钥,这相当于把密钥的保质期重置了,只要这个新密钥的保质期够长,比如1h,那么只有当用户1h不操作网页时,才会被踢出;如果中间用户又操作了网站,那么重新计时1h,也就是用户闲置网站太久才会被踢出重新登陆,只要用户没有闲置网站太久,一直有操作,就会一直更新出新的token,就不会出现前面的问题
      const newToken = JWT.generate({ 
        _id: payload._id,
        username: payload.username
      }, "1d") // 1d = 1day
      res.header("Authorization", newToken) // 重新设置res的请求头密钥,在这之后,我们在请求数据走axios收到信息拦截器,他会通过response获取res的值,再从里面获取请求头内部的新token
      next() // 记得放行
    } else { // token过期
      // 发送状态码401,并向前端发送错误的信息send({.....})
      // 再去axios.config.js拦截器中,处理下axios请求失败情况下的操作
      res.status(401).send({ errorCode: -1, errorInfo: "token过期" })
    }
  } else{
    // 有人直接通过网站访问数据,所以他的请求头中是没有authorization(密钥的),根据三目运算,此时token为undefined,走else代码区
    res.status(401).send({ errorCode: -2, errorInfo: "未授权登录" })
  }
})

// 默认提供了2个路由, /和/user,用于测试端口服务器是否打开
app.use('/', indexRouter);   // http://localhost:3000
app.use('/users', usersRouter); // http://localhost:3000/users
// 注册,这个主路由默认/,要访问的话就寻找其子路由http://localhost:3000 + /adminapi/rights
app.use(RightRouter)
app.use(RoleRouter)
app.use(UserRouter)
app.use(TagRouter)
app.use(ClassRouter)
app.use(StudentRouter)
app.use(CompanyRouter)
app.use(CompanyStudentRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(3000,()=>{
//   console.log("端口号已被监听")
// })

module.exports = app;
