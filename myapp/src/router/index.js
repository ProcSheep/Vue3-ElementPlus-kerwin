import {createRouter,createWebHashHistory} from 'vue-router' //地址是# 哈希模式
// 导入路由
import Mainbox from '../views/Mainbox.vue'
import Login from '../views/Login.vue'
// 导入总路由列表(起名为RoutesConfig,获取的是config.js导出的routes)
import RoutesConfig from './config'
// 导入pinia的useRouterStore.js负责动态路由添加
import {useRouterStore} from '../store/useRouterStore'
// 导入404页面
import NotFound from '../views/NotFound/NotFound.vue'
import { useUserStore } from '../store/useUserStore'
// 模块化使用nprogress,文档没有说明
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // 需要引入css

const routes = [
    // 定义两大路由组件 登录和主内容
    {
        path:"/login",
        name:"login",
        component:Login
    },
    {
        path:"/mainbox",
        name:"mainbox",
        component:Mainbox
    },
]

// 配置路由模式和routes
const router = createRouter({
    history: createWebHashHistory(),
    routes // 简写
})

// 路由拦截(路由守卫): 对所有(beforeEach)没有登录授权的用户统一跳转到Login页面
// 内部有2个坑会导致栈溢出(逻辑不对导致无限循环)
// 路由跳转(push)之前
router.beforeEach((to,from,next)=>{
    console.log("拦截")
    // 开始进度条
    NProgress.start();
    // 我们在这里获取pinia的Stroe的值是因为main.js中,先引入了router路由,然后它会先执行路由的相关文件,如果获取pinia的值在外面就会报错,因为此时pinia还没注册(main中),所以不着急,等路由和pinia都注册完了,跳页面时触发路由守卫时再获取,这是pinia早注册完了,同理ConfigRouter内部的获取pinia也是如此
    const {isGetterRouter} = useRouterStore()
    // 必须加一个已经在登录页面的逻辑,否则在第一次进入登录页面的时候没有token,然后执行下面的else内部的代码,会无限循环,一直跳login页面,造成栈溢出风险
    const {user} = useUserStore() // 获取user,初始为空
    if(to.name==='login'){
        next() // 如果跳转的页面是登录页面正常放行就行
    }else{
        if(!user.role){ // 如果本地没有路径信息rights(持久化pinia添加的user.role.rights)
            next({
                path:'/login'
            })
        }else{
            // 动态配置路由,根据用户权限添加路由
            // isGetterRouter是pinia的store,代表'是否动态添加过路由',初始为false,登录后只需要1次动态添加路由
            // 如果没有这个isGetterRouter作为记录,你会无限循环,每次跳页面都会添加一次路由,然后next({path:to.fullPath}),再回来,再添加一次路由,以此类推,无限循环
            // 注意: 刷新后pinia缓存清除,会再重新动态配一次路由
            if(!isGetterRouter){
                // 每次登录,身份不同,需要给mainbox重新添加不同的孩子路由,所以之前登录添加过的孩子就删除
                router.removeRoute("mainbox") // 清除路由mainbox,其内部的孩子也没了,同时在ConfigRouter中把mainbox路由加回来
                ConfigRouter() // 动态添加路由函数,内部会改isGetterRouter为true,下次再跳页面进入路由守卫后,不会重复地添加路由,除非换身份(之后再说)
                // 动态添加路由后,第一次next()不会生效,第二次才可以,所以再跳一次目标页面next-->(to.fullPath)
                next({
                    path:to.fullPath
                })
            }else{
                // 动态添加路由后,二次跳页面,由于isGetterRouter为true,所以会进入此else代码区,next()直接放行通过
                // 第一次next()找不到路由的警告还会报,不过无伤大雅,第二次就通过了
                next()
            }
            // next() 是放行,你该去哪里就去哪里
            // next({path:XX}) 放行+再指向一个新路由地址(跳2次)

        }
    }
})
// 路由跳转之后
router.afterEach(()=>{
    // 结束进度条
    NProgress.done()
})


const ConfigRouter = ()=>{
    const {changeRouter} = useRouterStore()
    // console.log("配置动态路由")
    // 先添加mainbox路由
    console.log("添加mainbox路由")
    router.addRoute({
        path:"/mainbox",
        name:"mainbox",
        component:Mainbox
    })
    // 根据权限配置路由,遍历config内部数组的每一项item
    RoutesConfig.forEach(item=>{
        // console.log(item)

        // 给mainbox组件添加孩子,mainbox是登录进入的主页面,所有的路由均会在里面,只不过后期因为用户的身份不同,权限不同,添加进的路由孩子数量会有区别
        // 第一个参数是给谁添加孩子路由(二级路由) 第二个参数,添加的路由
        // 记得在Mainbox.vue内部给这些二级路由留位置
        // checkPermission函数为真执行后面添加这个路由,如果不符合匹配,就false,后面的代码不执行,就不会添加这个路由
        checkPermission(item) && router.addRoute("mainbox",item)
    })
    // 加在这里是为了后期做权限匹配时能够更好做,kerwin提前提醒的
    // 加重定向
    // console.log("执行重定向")
    router.addRoute("mainbox",{
        path:'/',
        redirect:"/index"
    })
    // 404匹配
    router.addRoute("mainbox",{
        path:"/:pathMatch(.*)*",
        name: "not found",
        component: NotFound
    })

    // 修改isGetterRouter为true,代表已经动态修改路由了
    changeRouter(true)
}

// path所有的路由地址,看看当前用户的权限路由标中是否包含它,包含就返回出去
const checkPermission = ({path})=>{
    // 获取useUserStore的user的值(用户信息),再在role/rights中找到path集合
    const {user:{role:{rights}}} = useUserStore()
    // console.log(rights)
    return rights.includes(path)
}

export default router // 返回出去