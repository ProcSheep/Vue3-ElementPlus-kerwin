import axios from 'axios'
// 新组件---loading加载中页面,以服务的方式来调用
import { ElLoading } from 'element-plus'
let loadingInstance = null // 定义变量(不能是const,一会要赋新值),一会用于加载loading效果

// 下面是axios的拦截器模板,npmjs-->axios-->文档中的intercept拦截器
// 注意: 记得在main.js中导入这里的axios的拦截器
// 请求拦截器,拦截所有的请求(get/post/put/delete.....)
axios.interceptors.request.use(function (config) { // config就是请求头
    // 在发送axios请求前做点什么
    // console.log("请求发送之前")

    // 所有的axios请求发送之前,调用的全屏Loading  
    loadingInstance = ElLoading.service({ fullscreen: true })

    const token = localStorage.getItem("token")
    // 给请求头的Authorization赋值token,除了第一次登录还没有在本地存token,之后在登录状态下,进行所有axios请求,都可以在本地存储中获取到token
    config.headers.Authorization = `Bearer ${token}` // 潜规则这么命名

    return config;
  }, function (error) {
    // 请求失败了,拦截错误的信息,先走到这里操作点什么,再在控制台报错
    loadingInstance.close() // close 方法来关闭它
    return Promise.reject(error);
  });

// axios收到信息拦截器
axios.interceptors.response.use(function (response) {
    // axios成功发送,并收到信息,在这里做点什么
    // console.log("请求成功,请求信息为",response)

    // 当axios请求成功后,先把全屏的loading的效果关闭掉
    loadingInstance.close() // close 方法来关闭它

    // 寻找axios请求的请求头内含有密钥的信息(注意: 密钥生成于login校验步骤,所以在登录的时候才能从众多的请求信息的请求头中获取到authorization)
    const {authorization} = response.headers
    // 如果能捕捉到密钥信息,就存储到本地的token属性中,每次存储保证了token的新鲜性
    authorization && localStorage.setItem("token",authorization)

    return response;
  }, function (error) {
    // axios请求失败,返回了报错信息,在这里做点什么
    loadingInstance.close() // 请求失败了也要关闭缓冲条, close 方法来关闭它
    const {status} = error // 获取错误信息状态码
    console.log(error)
    if(status === 401){ // 401代表token过期了
      localStorage.removeItem("token") // 移除本地存储的过期token
      window.location.href = "#/login" // 暴力跳转到登录页面
    }
    return Promise.reject(error);
  });