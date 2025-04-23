# ElementPlus--后台管理系统的demo项目
## 开项目须知(重要!)
- 在配好了后端后(第二单元的后台系统开发/权限列表接口开发),我们运行前端需要提前开好express:(myappSever) `npm run start` + 全局cmd开启mongdb: `mongod --dbpath D:\mongdb\dbEleData`
- 如果不想设计后端,我们把components/SideMenu的axios的请求给改成静态区lib就行了
- 感想: ==随着项目深入,逐渐意识到一整套流程了,纯前端(老三样+各种框架) --> nodejs(前后端交互) --> 后端 ---> 服务器: 数据库(mysql)==
- 本项目我们自己写了后端express,配置了各种路由path等,在公司中前端应该接受到后端写的各种数据接口,然后用nodejs去向后端请求数据,剩下的就是后端的工作了,设计请求服务器,算法等后端业务
## 项目架构设计
### 项目架构搭建
- 首先vite创建项目: `npm create vite@latest`
- 语言: vue + javascript
- 基本架构:
  - 1.App.vue的内容删除,替换最简单的tem+app(div)
  - 2.main.js引入的css文件删了
  - 3.==router的基础配置==
    - 3.1 路由的安装: `npm i vue-router`,在myapp中下载,可以在package.json中检查是否下载完成
    - 3.2 创建router文件夹/index.js文件
    - ==配置路由文件index.js: **确定最基础的路由,最大的2个路由**,一个是登录路由,第二个是登录成功后进入的主页面路由,将来这个路由有许多孩子(二级路由),帮助我们显示不同的页面==  
        ```
            import {createRouter,createWebHashHistory} from 'vue-router' //地址是# 哈希模式
            // 导入路由
            import Mainbox from '../views/Mainbox.vue'
            import Login from '../views/Login.vue'

            const routes = [ 
                {
                path:"/login",
                name:"login",
                component:Login
                },
                {
                path:"/mainbox",
                name:"mainbox",
                component:Mainbox
                }
            ]

            const router = createRouter({
                history: createWebHashHistory(),
                routes // 简写
            })

            export default router // 返回出去
        ```
    > ==注意: 配置history时,createWebHashHistory()不要忘记()!!!!==
    - 为2个大路由创建vue文件,在src下创建views文件夹,分别创建Login.vue和Mainbox.vue(**导入路由文件起的名字要和下面挂载component的名字一样**),两个vue文件内部为最简单的tem+div结构
    - 3.3==main.js的路由导入(别忘了)==
        ```
            import { createApp } from 'vue'
            import App from './App.vue'
            // 导入路由并注册
            import router from './router'

            createApp(App)
            .use(router)
            .mount('#app')
        ```
  - 4.==**在根组件App.vue中给路由留位置(也别忘了)**==
      ```
          <template>
              <div>
                  <!-- !!!: 在根组件App内部预留其他路由页面的位置(views里面的那些s) -->
                  <router-view></router-view>
              </div>
          </template>
      ```
      > main.js是vue的入口,其配置的根组件App.vue是所有页面的根,优先进入,只有在App中预留了router-view的位置,才可以在跳转路由时显示对应的路由的内容,否则不会显示,同理后面的Mainbox.vue内部的二级路由想要显示,也需要预留位置
  - 5.==基础的路由守卫(router/index.js)(**下一节这里会一地鸡毛**)==
  - **详细解释**: 我们对所有网页设置一个路由拦截,拦截那些没有登录的用户,强制他们跳转到Login.vue界面进行登录操作,未登录的用户无法查看Mainbox及其所有孩子路由的内容,判断用户登录的操作是从本地存储localStorage中是否有'token'属性
      ```
          router.beforeEach((to,from,next)=>{
              if(!localStorage.getItem("token")){
                  next({
                      path:"/Login" // 未登录的跳到Login界面
                  })
              }else{
                  next() // 登录的放行,该去哪里去哪里
              }
          })
      ```
    > 测试可以在终端中手动设置localStorage: `localStorage.setItem("token","kerwin")`
### 路由动态配置
- 1.==为动态路由添加做准备==:
  - 1.1 在router内创建config.js文件配置所有的路由,后期可以动态在里面选择路由进行添加
    ```
        import Home from '../views/home/Home.vue'
        import UserList from '../views/user-manage/UserList.vue'
        import RoleList from '../views/right-manage/RoleList.vue'
        import RightList from '../views/right-manage/RightList.vue'
        import TagList from '../views/tag-manage/TagList.vue'
        import CompanyData from '../views/interview-manage/CompanyData.vue'
        import CompanyList from '../views/interview-manage/CompanyList.vue'
        import StudentList from '../views/student-manage/StudentList.vue'
        import GradeList from '../views/student-manage/GradeList.vue'


        // 起好所有路由的名字
        const routes = [
            {
                path:"/index",
                name:"Home",
                component:Home
            },
            {
                path:"/user-manage/list",
                name:"UserList",
                component:UserList
            },
            {
                path:"/right-manage/rolelist",
                name:"RoleList",
                component:RoleList
            },
            {
                path:"/right-manage/rightlist",
                name:"RightList",
                component:RightList
            },
            {
                path:"/tag-manage/list",
                name:"TagList",
                component:TagList
            },
            {
                path:"/interview-manage/companylist",
                name:"CompanyList",
                component:CompanyList
            },
            {
                path:"/interview-manage/companydata",
                name:"CompanyData",
                component:CompanyData
            },
            {
                path:"/student-manage/studentlist",
                name:"StudentList",
                component:StudentList
            },
            {
                path:"/student-manage/gradelist",
                name:"GradeList",
                component:GradeList
            },
        ]

        export default routes

    ```
    - 1.2创建对应的vue文件,在views内部,创建文件时,根据path创建文件夹+vue文件,例如`/user-manage/list`,即在user-manage文件夹内创建UserList.vue文件(==看看文件怎么创建的==),最后每个文件内部设置最简单的tem+div结构
  - 2.==动态配置路由操作(index.js)==
    - **内部会有2个无限循环的坑**
    - ==第一个坑(简单的)==:
        ```
            if(!localStorage.getItem('token')){ // 如果本地没有token,那么跳转到登陆页面
                next({
                    path:'/login'
                })
            }else{
                next()
            }
        ```
        > 这么写,第一次进入到登录页面时你没有token,这是会执行跳转到Login页面,然后还是没token,继续跳Login页面,无限循环
    - 改进: 对于进入Login的用户正常放行
    - 同时添加'动态添加路由'函数ConfigRouter
        ```
            if(to.name==='login'){
                next() // 如果跳转的页面是登录页面正常放行就行
            }else{
                if(!localStorage.getItem('token')){ // 如果本地没有token,那么跳转到登陆页面
                    next({
                        path:'/login'
                    })
                }else{ // 有token
                    ConfigRouter() // 动态添加路由函数
                    next()
                }
            }
        ```
    - ==第二个坑: '动态添加路由'函数ConfigRouter里面的一个环节==
        ```
            // 导入总路由列表(起名为RoutesConfig,获取的是config.js导出的routes)
            import RoutesConfig from './config'

            const ConfigRouter = ()=>{
            console.log("配置动态路由")
                RoutesConfig.forEach(item=>{
                    // console.log(item)
                    // 给mainbox组件添加孩子,mainbox是登录进入的主页面,所有的路由均会在里面,只不过后期因为用户的身份不同,权限不同,添加进的路由孩子数量会有区别
                    // 第一个参数是给谁添加孩子路由(二级路由) 第二个参数,添加的路由
                    // 记得在Mainbox.vue内部给这些二级路由留位置
                    router.addRoute("mainbox",item)
                })
            }
        ```
        > 新语法: router.addRoute(),第一个参数是给谁添加孩子路由(二级路由) 第二个参数,添加的路由,==此时我们把所有的路由都添加进来,后期会根据权限筛选==
    - ==插播一条==: Mainbox.vue中添加`<router-view></router-view>`给子路由的测试预留位置
    - 新的问题: ==我们添加动态路由配置后,第二次访问路径才会生效,也就是说第一次访问路径会报警告,显示找不到此路由,也就是说我们登录后首先需要进入Mainbox页面完成初次路由配置,在此基础上访问其二级路由才会成功,如果刷新页面,也就是直接对其二级路由访问,就会报警告==
      - 初级解决1: 我们让页面再重新跳一次刚才的路由路径,既有 
        ```
        else{
            ConfigRouter() // 动态添加路由函数
            next({
                path: to.fullPath
            })
        }
        ```
        > ==**这就是第二个坑**==: 你重新跳到这个页面后,再次执行根据if逻辑顺下来,又执行动态添加路由函数ConfigRouter,又跳到这个路径to.fullPath,又ConfigRouter,....卡死,无限循环添加新路由并且,反复跳到to.fullPath
    - ==**解决: 引入pinia,用公共状态去界定是否添加过动态路由**==
- 2.==引入pinia解决无限引入动态路由的问题==
  - 1下载pinia(myapp中): `npm i pinia`
  - 2.==在main.js中引入并注册pinia==
    ``` 
        import { createApp } from 'vue'
        import App from './App.vue'
        // 导入路由并注册
        import router from './router'
        // 导入pinia并注册
        import { createPinia } from 'pinia'

        createApp(App)
        .use(router)
        .use(createPinia())
        .mount('#app')
    ```
  - 3.配置Store文件useRouterStore.js(新建文件夹store)
    ```
        // pinia动态路由状态管理
        import { defineStore } from 'pinia'
        import { ref } from 'vue'

        export const useRouterStore = defineStore("router",()=>{
            const isGetterRouter = ref(false) 
            function changeRouter(value){
                isGetterRouter.value = value
            }
            return {
                isGetterRouter,
                changeRouter
            }
        })
    ```
    > 这个写法有点特殊,但是注意,它导出了store,`export const useRouterStore = ...`
    > isGetterRouter: 是判断是否动态添加过路由的状态,初始默认false
    > changeRouter函数: 是修改isGetterRouter值的函数,如果已经动态添加过路由,调用它去修改
    - 4.完全逻辑体的index.js文件,判断登录+判断动态添加路由的路由守卫
        ```
            // 导入pinia的useRouterStore.js负责动态路由添加
            import {useRouterStore} from '../store/useRouterStore'
            // 导入404页面
            import NotFound from '../views/NotFound/NotFound.vue'

            router.beforeEach((to,from,next)=>{
            // 我们在这里获取pinia的Stroe的值是因为main.js中,先引入了router路由,然后它会先执行路由的相关文件,如果获取pinia的值在外面就会报错,因为此时pinia还没注册(main中),所以不着急,等路由和pinia都注册完了,跳页面时触发路由守卫时再获取,这是pinia早注册完了,同理ConfigRouter内部的获取pinia也是如此
            const {isGetterRouter} = useRouterStore()
            // 必须加一个已经在登录页面的逻辑,否则在第一次进入登录页面的时候没有token,然后执行下面的else内部的代码,会无限循环,一直跳login页面,造成栈溢出风险
            if(to.name==='login'){
                next() // 如果跳转的页面是登录页面正常放行就行
            }else{
                if(!localStorage.getItem('token')){ // 如果本地没有token,那么跳转到登陆页面
                    next({
                        path:'/login'
                    })
                }else{
                    // 动态配置路由,根据用户权限添加路由
                    // isGetterRouter是pinia的store,代表'是否动态添加过路由',初始为false,登录后只需要1次动态添加路由
                    // 如果没有这个isGetterRouter作为记录,你会无限循环,每次跳页面都会添加一次路由,然后next({path:to.fullPath}),再回来,再添加一次路由,以此类推,无限循环
                    // 注意: 刷新后pinia缓存清除,会再重新动态配一次路由
                    if(!isGetterRouter){
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

            const ConfigRouter = ()=>{
                const {changeRouter} = useRouterStore()
                console.log("配置动态路由")
                RoutesConfig.forEach(item=>{
                    // console.log(item)
                    // 给mainbox组件添加孩子,mainbox是登录进入的主页面,所有的路由均会在里面,只不过后期因为用户的身份不同,权限不同,添加进的路由孩子数量会有区别
                    // 第一个参数是给谁添加孩子路由(二级路由) 第二个参数,添加的路由
                    // 记得在Mainbox.vue内部给这些二级路由留位置
                    router.addRoute("mainbox",item)
                })
                // 加在这里是为了后期做权限匹配时能够更好做,kerwin提前提醒的
                // 加重定向
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

        ```
    > 注意: 变化我们在动态添加路由的函数之前又加了一个if判断,由isGetterRouter负责判断是否应当动态添加路由,在动态添加函数ConfigRouter内部就有changeRouter函数,去修改isGetterRouter的值,以防止下次跳转其他页面时再次动态申请(==注意: 我们这是一个对所有页面都进行拦截的路由守卫,所以无论跳哪个路由都会检查一次,并执行一次if逻辑语句==)
    - ==番外:== 
      - 1.pinia的引入和使用为何在函数和路由守卫中? 
        - 因为main.js中,先引入了router路由,然后它会先执行路由的相关文件,如果获取pinia在外面就会报错,因为此时pinia还没注册(main中),所以不着急,跳页面时触发路由守卫时再获取pinia的store,这时候pinia早注册完了,所以不会报错"是否引入了pinia"
      - ==**亲测:和main.js的文件引入顺序无关,即使先引入pinia在引入router也是没用的,所以对于这种细微的错误,一定要留意,这个在官方文档的pinia的核心概念的组件外的store中有这个路由守卫的例子,它也示意你需要在守卫内部调用pinia,保证在注册完pinia后才使用store,我们这属于在组件外使用pinia,正常在setup中使用pinia直接引入即可,都不用调用XXStore(),这个原理值得深究**==
      - 2.追加的默认路径和404为何写在动态添加路由函数ConfigRouter后面,并且时一个个加的addRoute,为何不在config.js文件中配置?
        - kerwin老师说了,后期匹配不同权限进行路由筛选时会很麻烦,所以这么写有助于后期,听人劝吃饱饭

### 路由权限配置
- 我们由两个用户类型:==管理员和教师==,它们的路由权限不同,管理员比教师有更多的路由权限,==我们把2个用户角色的信息放入public/lib(全局静态资源)的userInfo.js==
- 1.存储用户登录信息,pinia持久化管理,创建新store文件useUserStore.js
    ```
        // pinia动态路由状态管理
        import { defineStore } from 'pinia'
        import { ref } from 'vue'

        export const useUserStore = defineStore("user",()=>{
            const user = ref({}) 
            function changeUser(value){
                user.value = value
            }
            return {
                user,
                changeUser
            }
        },{
            // 使用持久化插件,对此store进行持久化处理,刷新不重置(存在localStore中)
            persist:true
        })
    ```
    > user: 记录用户类型信息(状态)
    > changeUser: 改变用户类型信息函数
    > 持久化插件作用: user不会因为刷新页面而丢失内容
    > 持久化插件用法,看注释,多加一个参数
  - 1.2 下载pinia持久化插件: `npm i pinia-plugin-persistedstate`
    在main.js配置一下(npmjs官方搜索这个插件的文档用法)
    ```
      // 只显示插件配置的部分代码 
      import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

      const pinia = createPinia()
      pinia.use(piniaPluginPersistedstate)

      createApp(App)
      .use(pinia)
      .mount('#app')
    ```
- 2.在Login.vue中进行测试,首先设置2个按钮,分别为登录管理员和登录教师功能,如下(==前期都是写死的,后期会结合后端==)
  ```
    tem:  Login
    <button @click="handleLogin1">登录管理员</button>
    <button @click="handleLogin2">登录教师</button>

    js:

    import { useUserStore } from '../store/useUserStore';
    // 获取changeUser函数
    const { changeUser } = useUserStore()   

    // 往pinia的useUserStore中传入数据,并把useUserStore使用pinia持久化管理
    const handleLogin1 = () => {
        changeUser({
            "id": 1,
            "username": "admin",
            "password": "123",
            "role": {
                "roleName": "管理员",
                "roleType": 1,
                "rights": [
                    "/index",
                    "/user-manage",
                    "/user-manage/list",
                    "/right-manage",
                    "/right-manage/rolelist",
                    "/right-manage/rightlist",
                    "/tag-manage",
                    "/tag-manage/list",
                    "/interview-manage",
                    "/interview-manage/companylist",
                    "/interview-manage/companydata",
                    "/student-manage",
                    "/student-manage/studentlist",
                    "/student-manage/gradelist"
                ]
            }
        })
        router.push('/') // 自动跳根路径,之后转到/index
    }

    const handleLogin2 = () => {
        changeUser({
            "id": 2,
            "username": "kerwin",
            "password": "123",
            "role": {
                "roleName": "讲师",
                "roleType": 2,
                "rights": [
                    "/index",
                    "/interview-manage",
                    "/interview-manage/companylist",
                    "/interview-manage/companydata",
                    "/student-manage",
                    "/student-manage/studentlist",
                    "/student-manage/gradelist"
                ]
            }
        })
        router.push('/')
    }
  ```
  > **点击测试按钮,往store内部的user传入我们的登录者基本信息**,这是一个过渡,==重点在后面对于rights的筛选,教师和管理员的rights不同,意味着登陆成功后,教师访问的路由数量比管理员少,我们要实现这个效果==
- 3.==**index.js中添加动态路由的地方设置筛选路由的函数**==,原来的动态路由添加没有筛选,所有的路由都会被加入mainbox的孩子,导致'管理员'和'教师'可以访问的路由是一样的
- 在动态添加路由函数内部加一个筛选函数checkPermission()
    ```
        // ConfigRouter就是动态添加路由函数
        const ConfigRouter = ()=>{
            console.log("配置动态路由")
            // RoutesConfig是config.js返回的值(内部是所有路由的配置信息)
            RoutesConfig.forEach(item=>{
                // 筛选函数(item) && 添加路由函数(item)
                checkPermission(item) && router.addRoute("mainbox",item)
            })
        }
    ```
    > 对所有路由,我们一个个筛选`forEach(item=>{...})`,通过筛选函数的才会执行&&后面的代码,也就是添加路由函数,所以流程为'身份不同->筛选条件不同->添加的路由数量不同'
  - 3.1 筛选函数 checkPermission()
    ```
    // 从每一项item结构出path属性值
    const checkPermission = ({path})=>{
        // 获取useUserStore的user的值(用户信息),再在role/rights中找到path集合
        const {user:{role:{rights}}} = useUserStore()
        // return 当前用户权限列表.include(path)
        return rights.includes(path)
    }
    ```
    > 登陆后,我们获取了用户信息,然后持久化地保存在useUserStore的user属性中,我们拿取里面不同用户的路由权限表(==这个结构赋值比较绕,根据handlerLogin传进去的对象结构认真看看,最后return的逻辑是,当此路由路径path存在于我们此用户权限表中时,返回true,然后执行&&后的路由添加函数==)
    > ==**再强调重复一遍! 一定搞清楚rights和path,rights就是用户权限表,可以在public/lib/userInfo.js看,而path就是所有的路由信息,在router/config.js中看**==
- 4.==退出登录功能的模拟(**有大坑**)==
  - ==插播==: 我们判断用户是否登录不再使用'token'了,pinia的持久化插件会把用户信息放入本地存储,user一开始为空对象(空对象也为真),我们点其中一个属性,user.role即可,然后替代 ` if(!user.role){...}`
  - ==正文:**在MainBox.vue中**,设置退出登录按钮==(这是主路由,所有的子路由都在里面显示,所以我们能保证无论身处哪个路由都能点到这个按钮)
    ```
    tem:
        <button @click="handleExit">退出登录</button>

    js:
        // 引入路由方法
        import { useRouter } from 'vue-router';
        // 引入pinia的store
        import { useUserStore } from '../../store/useUserStore';
        import { useRouterStore } from '../../store/useRouterStore';

        const router = useRouter()
        const { changeRouter } = useRouterStore()
        const { changeUser,user:{role:{roleName},username} } = useUserStore()

        // 退出登录函数
        const handleExit = () => {
            // 清理user
            changeUser({})
            // isGetterRouter = false,为下次动态添加路由做准备
            changeRouter(false)
            // 跳Login页面
            router.push('/login')
        }
    ``` 
    > 三部走: 1.清理user 2.isGetterRouter = false,为下次动态添加路由做准备 3.跳Login页面 
    > 每一步操作都有依赖,==总结为2个store的内部信息和函数 + 1个router路由方法==
    - ==**大坑: 我们漏掉了对mainbox路由的子路由的清理**==
    - ==bug体现: 如果你先登录的管理员,测试后所有路由都可以访问,ok,但是你一旦退出重新登录教师账号,你会发现,教师所有的路由都可以登录,这不对,教师的路由权限应该比管理员少== 
    - 原因: ==登录管理时,我们在动态添加路由时,给mainbox添加了属于管理的路由权限表,然后退出登录时没有删除这些路由,从而导致下一次教师添加路由形同虚设,因为咱的mainbox路由还保留着上一次管理员的添加子路由呢,所以这部分路由应当在动态添加路由前先删除,然后再添加,如下==
        ```
             if(!isGetterRouter){
                // 每次登录,身份不同,需要给mainbox重新添加不同的孩子路由,所以之前登录添加过的孩子就删除
                // 清除路由mainbox,其内部的孩子也没了,同时在ConfigRouter中把mainbox路由加回来
                router.removeRoute("mainbox") 
                ConfigRouter() 
                next({
                    path:to.fullPath
                })
            }else{
                next()
            }

            const ConfigRouter = ()=>{
                const {changeRouter} = useRouterStore()
                console.log("配置动态路由")
                // 先添加mainbox路由
                router.addRoute({
                    path:"/mainbox",
                    name:"mainbox",
                    component:Mainbox
                })
                // 根据权限配置路由,遍历config内部数组的每一项item
                RoutesConfig.forEach(item=>{ ... })
            }
        ```
        > 删除路由mainbox,其内部孩子一起没了,`router.removeRoute("mainbox")`
        > 进入路由添加函数后,再添加回来
- 流程图画出来了,如下: 
    [![pAcHd1g.jpg](https://s21.ax1x.com/2024/11/12/pAcHd1g.jpg)](https://imgse.com/i/pAcHd1g)

## 后台系统组件开发
### 登录模块-表单
- 使用elementPlus的表单结构去设计一个简单登录页面,包含基本的表单验证,有用户名和密码两个输入框
- 1.基本的elementplus安装和main.js文件中注册
  - 安装: `npm install element-plus --save`
  - 引入与在注册: main.js
    ```
        import { createApp } from 'vue'
        import App from './App.vue'
        import ElementPlus from 'element-plus'
        import 'element-plus/dist/index.css'

        const app = createApp(App)
        app.use(ElementPlus)
        app.mount('#app')

    ```
    > 其中ele在全局中注册了,也可以局部注册,但是本项目基于ele设计,所以全组件都要用它,所以全局注册,注意如果局部注册,关于ele.css的部分一直放在main.js中即可
- 2.表单的使用(使用form表单的表单校验部分代码)
- 删除精简为2个输入框,外加一个提交按钮,本form表单自带校验功能,实时检查你的输入,==看懂ele的代码结构最重要==
- Login.vue
  ```
    <template>
        <div>
            <div class="formContainer">
                <h3>智慧校园-学生学业质量分析系统</h3>
                <el-form ref="loginFormRef" style="max-width: 600px" :model="loginForm" :rules="rules" label-width="auto"
                    class="demo-ruleForm" status-icon>
                    <!-- prop: 负责获取校验对象username -->
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="loginForm.username" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="loginForm.password" type="password" />
                    </el-form-item>
                    <el-form-item class="el-form-item-button">
                        <el-button type="primary" @click="submitForm(loginFormRef)">
                            登录
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </template>
  ```
  - ==from表单代码解析:==
    - el-form/el-form-item: 表单根+内部表单单项,表单单项有username用户名输入和password密码输入,最后一个表单项内部装入el-button(==button组件==),给提交按钮添加样式
  - ==form表单的内部参数:(**初次看需要结合js,看源代码中每个部分的功能,参数以及js中的对应**)==
    - el-form: 
      - ref="loginFormRef":ref的传统用法(vue的语法),在js中,通过ref可以获取这个表单的实例对象,`const loginFormRef = ref()`
      - :model=...: ele封装的双向绑定数据,我们定义好状态,2个值,username和password初始化,然后双向绑定进表单
        ```
            const loginForm = reactive({
                username: "",
                password: ""
            })
        ```
      - :rules="rules": 通过源码我们知道这是校验表单的标准,后面统一说内部如何配置
      - 剩余的就是基础的css样式,无关紧要和class名字命名
      - status-icon: 局外人,无关大局
    -  el-form-item:
        - label: 表单名,用户名和密码 
        - v-model="loginForm.username": 以用户名为例子,loginForm就是el-form表单:model双向绑定的状态值,取内部username值,双向绑定username状态与username输入框,同理password
        - prop="username": 还是以用户名为例子,校验对象是username,这个和rules的配置名字和配置内容有关
        - 直接看rules如何配置password和username
            ```
                const rules = reactive({
                    // 可以放多个校验对象,内部数组配置校验细致规则
                    username: [ // 必填+提示+失去焦点再校验
                        { required: true, message: '请输入用户名', trigger: 'blur' } // trigger: 'blur' 失去焦点再校验
                    ],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
                })

            ```
            > 之后校验就根据props提供的名,再对应按照rules内部的校验标准去一一校验username和password
        - type: 是html自带的属性,ele这里也给你留下了,可用
    - @click="submitForm(loginFormRef): 提交按钮的事件处理函数,传入的值正是获取的实例对象el-form(ref的传统用法)
        ```
            // 登录校验方法
            const submitForm = async (formEl) => {
                if (!formEl) return
                // validate立即校验一次,防止用户不点击用户框直接点登录,这样会真的把空用户名,空密码,发给后端,validate是ElementPlus的表单验证功能主要依赖于async-validator库
                // valid为true证明符合校验规则,提交; 如果valid为false,不提交,并提供出错区域,
                await formEl.validate((valid, fields) => {
                    if (valid) {
                        //   console.log('submit!,数据为(提交给后端)',loginForm)
                        // 伪装后端,先写死
                        if (loginForm.username === "admin") {
                            handleLogin1()
                        } else {
                            handleLogin2()
                        }
                    } else {
                        console.log('error submit!', fields)
                    }
                })
            }
        ```
        > 这个函数也基本是原代码复制,稍加修改
        - ==看注释: 有些东西你就需要知道他的功能就可以,无需深究其源代码,他这里就是写死的==
            - 首先validate((valid, fields)=>{...})
            - validate就是立即校验,防止用户不点输入框直接点登录
            - 内部的值valid就能检验你是否通过校验
            - fields就能检查出你校验失败在哪个项
        - ==validate来源于一个库,内部的valid和fields也不必深究,你知道它们的作用以及用法,记住这个固定的逻辑模板就可以,我们不必面面俱到,组件的初衷就是方便我们完成业务,我们知其如何用即可==
        - 内部写死了逻辑,校验成功后,username为admin就可以进入管理员模式,其余为教师模式
- 3.给form表单添加css样式,==使用scss(记得npm i scss==)
    ```
        <style lang="scss" scoped>
        //   scss 记得安装
        .formContainer {
            width: 500px;
            height: 300px;
            // 固定定位
            position: fixed;
            left: 50%;
            top: 50%;
            // 居中,返回自身长宽的一半
            transform: translate(-50%, -50%);
            background-color: rgba($color: #000000, $alpha: 0.2);
            color: white;
            text-align: center;
            padding: 20px;

            h3 {
                font-size: 30px;
            }

            // 给组件添加css,深度选择器.deep()
            :deep(.el-form-item__label) {
                color: white
            }

            .demo-ruleForm{
                margin-top: 50px;
            }
        }
        </style>
    ```
    > ==唯一的重点: .deep()的使用,原因是style+scpoed后,其内部css样式会同样添加一条data-v-XXX的class属性来保证class的不重复性,不会影响到其他文件的css,但是组件内部的孩子是没有这个附加class属性的,检查工具可看.el-form-item__label输入el-form-item的孩子,所以它需要deep(),kerwin基础课讲过这个,十分的重要!==

### 登录模块-粒子
- 粒子效果来自github的一个模块: tsparticles
- 从中间找到vue3部分的粒子效果动画,==这个粒子使用的文档不太好,不是很全==
- 在main.js中下载与注册
    ```
        // 例子模块 需要下载 npm i @tsparticles/vue3
        import Particles from "@tsparticles/vue3";
        // tsparticles需要自己下载 npm i tsparticles
        import { loadFull } from "tsparticles"; 

        createApp(App)
        .use(router)
        .use(pinia)
        .use(ElementPlus)
        .use(Particles, {
            init: async engine => {
                await loadFull(engine); 
            },
        })
        .mount('#app')
    ```
    > 官网中.use()提供了两个方法,我们用loadFull,不过用哪个都需要引入一下,文档中没说,这里从tsparticles中引入了loadFull
- 在Login.vue组件中,按照文档放入组件
    ```
        <vue-particles id="tsparticles" @particles-loaded="particlesLoaded" :options="options"></vue-particles>
    ```
    > 重点是options的动态配置,原文档直接写在标签内了,为了简洁我们封装如对象,==在src创建新文件util(工具),创建config.js,定义好options导出,然后在Login中引入,最后放入标签配置,**这里就不写config.js内部配置了,很长一串**==
    - 官网还提供了更多风格的动画,但是浏览器打不开了,不同动画的最大区别就是options的内容不同
### MainBox组件
- 这是所有路由的根,也是第二大组件,我们参考的是ele的container布局容器的"侧边栏 + 顶栏 + 内容"布局,其中顶栏和内容一上一下在右边,侧边栏独自在左边
  ```
        <el-container style="height: 100vh;">
            <SideMenu></SideMenu>
            <!-- el-container的direction属性: 子元素中有el-header或el-footer时为vertical否则为horizontal -->
            <!-- 我们给el-header做成组件了,所以要单独设置一下方向 -->
            <el-container direction="vertical">
                <TopHeader></TopHeader>
                <el-main>
                    <!-- 内容区+滚动组件 -->
                    <el-scrollbar>
                        <router-view></router-view>
                    </el-scrollbar>
                </el-main>
            </el-container>
        </el-container>
  ```
  > 注意: 为了不让Mainbox的组件显得代码冗余,我们随后把el-header和el-sider做成了组件`<TopHeader></TopHeader>`和`<SideMenu></SideMenu>`,然后内容区el-main不变,内部是子路由的窗口router-view,最后给内容区加了滚动的组件,给整体的组件加了100vh的高度
- 命名潜规则: 组件分为两种,一种是views视图类型的组件,它是自成一体独当一面的一整个页面,第二种就是components文件内部的组件,它们通常是views视图中的一部分,负责一个页面显示的一个区域,同理就是这里的TopHeader和SideMenu,所以我们新建components文件夹,介于此两个组件均是视图组件Mainbox内的组件,所以再命名mainbox文件夹,内部创建这2个vue文件,设置好最简单的tem+div
- 最后我们发现改完组建后,页面的排列格式变量,根据文档,el-container的direction属性: 子元素中有el-header或el-footer时为vertical否则为horizontal,我们给el-header做成组件了,所以要单独设置一下方向  
### SideMenu模块
- 使用了Menu菜单的侧边栏组件,大体我们只需要两种侧边栏格式,一种是一级菜单,一种是二级菜单
- ==另外我们提供了一张路由的数据表,这里先写死,在public/lib/rights.json,如下==
  ```
    [
        {
            "title": "学生大数据",
            "path": "/index",
            "icon": "TrendCharts",
            "children": []
        },
        {
            "title": "用户管理",
            "path": "/user-manage",
            "icon": "User",
            "children": [
            {
                "title": "用户列表",
                "path": "/user-manage/list",
                "icon": "List"
            }
            ]
        },
        {
            "title": "权限管理",
            "path": "/right-manage",
            "icon": "Key",
            "children": [
            {
                "title": "角色列表",
                "path": "/right-manage/rolelist",
                "icon": "List"
            },
            {
                "title": "权限列表",
                "path": "/right-manage/rightlist",
                "icon": "List"
            }
            ]
        },
        {
            "title": "技术标签管理",
            "path": "/tag-manage",
            "icon": "Grid",
            "children": [
            {
                "title": "技术标签列表",
                "path": "/tag-manage/list",
                "icon": "List"
            }
            ]
        },
        {
            "title": "面试管理",
            "path": "/interview-manage",
            "icon": "OfficeBuilding",
            "children": [
            {
                "title": "公司列表",
                "path": "/interview-manage/companylist",
                "icon": "List"
            },
            {
                "title": "公司大数据",
                "path": "/interview-manage/companydata",
                "icon": "PieChart"
            }
            ]
        },
        {
            "title": "学生管理",
            "icon": "School",
            "path": "/student-manage",
            "children": [
            {
                "title": "学生列表",
                "path": "/student-manage/studentlist",
                "icon": "List"
            },
            {
                "title": "班级列表",
                "path": "/student-manage/gradelist",
                "icon": "List"
            }
            ]
        }
    ]
    
  ```
  > 内部是title,==path路径(在后期配置side栏很有用==),还有icon图标,最后,我们对路由进行了分类,看children属性有没有孩子,有孩子的可以构成二级菜单
- 1.引入的side组件模板(初始的)
  ```
    <el-menu class="el-menu-vertical-demo">
        <el-sub-menu index="1-4">
            <template #title>item four</template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="4">
            <el-icon><setting /></el-icon>
            <span>Navigator Four</span>
        </el-menu-item>
    </el-menu>
  ```
  - el-menu: 是主菜单
  - el-menu-item: 这是一级菜单,内部配有el-icon图标组件和span的标题
  - el-sub-menu: 这是二级菜单,一级菜单名是tem,二级菜单是内部的el-menu-item
  - ==index: 唯一标识id,我们学过,ele文档强烈建议你设置为path,这样配合menu的一个属性可以激活跳转==
  - ==tem #title: 这是插槽,把想要显示的标题和图标放进去,否则不显示的==
- 2.使用axios获取rights.json的数据
    ```
        import axios from 'axios'
        import { onMounted, ref } from 'vue';
        const rightsList = ref([])
        // 立即执行
        onMounted(async () => {
            var res = await axios.get("/lib/rights.json") // 取public的lib的json文件,获取数据
            // console.log(res)
            rightsList.value = res.data // 获取信息赋值给空数组rightsList
        })
    ```
- 3.==我们一步到位,下面一步步刨析==
    ```
    <el-aside width="200px">
        <el-scrollbar>
            <!-- router属性: 是否启用 vue-router 模式。 启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
            <!-- default-active: 页面加载时默认激活菜单的index(刷新不丢失目录),使用路由工具useRoute获取当前路由的路径 .fullPath-->
            <el-menu class="el-menu-vertical-demo" style="height:100vh" :router="true" :default-active="route.fullPath">
                <!-- v-for和v-if不能同时出现,所以借用tem,它不会显示在页面中 -->
                <template v-for="data in rightsList" :key="data.path">
                    <!-- 普通二级 -->
                    <!-- 看rightsList.json文件结构: 有孩子的,data.children.length不为0,走下面的二级菜单,没有孩子的走v-else的一级菜单 -->
                    <!-- index是唯一id,官网强烈建议设置为path,后面也有用,kerwin讲过 -->
                    <!-- 根据权限函数checkAuth判断当前二级菜单是否应该创建,如果虽然有孩子但是没有权限,那么v-if最终也为false(&&运算) -->
                    <el-sub-menu :index="data.path" v-if="data.children.length && checkAuth(data.path)">
                        <template #title>
                            <el-icon>
                                <component :is="mapIcon[data.icon]"></component>
                            </el-icon>
                            {{ data.title }}
                        </template>
                        <!-- 二级菜单v-for: 不要与一级菜单的循环重名,一个data一个item -->
                        <el-menu-item :index="item.path" v-for="item in data.children">
                            <el-icon>
                                <component :is="mapIcon[item.icon]"></component>
                            </el-icon>
                            {{ item.title }}
                        </el-menu-item>
                    </el-sub-menu>
                    <!-- 普通一级 -->
                    <!-- + 权限函数checkAuth -->
                    <el-menu-item :index="data.path" v-else-if="checkAuth(data.path)">
                        <span>
                            <!-- 动态添加组件 -->
                            <el-icon>
                                <!-- 来自data的icon都是字符串,经过这么一转化,都变为真正的实例对象了 -->
                                <component :is="mapIcon[data.icon]"></component>
                            </el-icon>
                            {{ data.title }}
                        </span>
                    </el-menu-item>
                </template>
            </el-menu>
        </el-scrollbar>
    </el-aside>
    ```
- 1.menu菜单的命名:
  - ==要点1: v-for与v-if的混合使用==
    - 一级二级菜单的最外层,由tem+v-for遍历每一项rights内的数据,然后进入菜单命名的v-if判断,从right获取的每一项data的children中判断是否是二级菜单,如果这个data.children.length为0,直接跳到v-else的一级路由,否则就是二级路由(==这里我们先不讨论checkAuth==),接着二级菜单的下拉二级,继续v-for,item in data.children,把这个children内部的所有孩子遍历出来(==注意:双v-for不要重名,一个data,一个item==)
  - ==要点2: 配置index和激活menu的router模式==
    - 这个就是为何建议index配置为路由的原因,因为menu组件一旦开启router模式,点击此菜单会自动跳转到以index命名path的路由页面
    - 配置路由就跟着v-for顺带完成,一级的data.path,二级的(children内的)item.path
    - 开启路由模式(文档中也有说明,kerwin基础课也说了很多次了),在根菜单组件el-menu添加属性:router="true"
  - ==要点3: 配置图标(**重点在于把字符串转化为变量**)==
    - 我们使用动态路由去创建一个路由(在el-icon内部)
        ```
            <el-icon>
                <component :is="mapIcon[data.icon]"></component>
            </el-icon>
        ```
    - 这个动态:is后面跟的必须是是组件的实例对象,而不是字符串,我们直接从rights.js中引入的icon是字符串,这里需要的是下面这种从el引入的icon实例对象
        ```
            // 记得引入 
            import { TrendCharts, User, Key, List, Grid, OfficeBuilding, PieChart, School } from '@element-plus/icons-vue'
        ```
    - ==解决:利用key-value键值对应的写法去实现,具体原理如下==
        ```
            // 单独以User组件为例子(这是个el-icon的图标组件)
            const mapIcon = {
                // User : User
                User // ES6简写
            }
        ```
    - 此时我们的key是单纯的字符串名字,value是真正的el-icon实例对象(==知道rights.js内部命名icon时为何要和真实的实例对象名一样了吧,为了ES6简写==)
    - 此时我们在执行 `mapIcon['User']`的结果就是取其value值User(这是真正的el-icon实例对象)
    - 所以我们有 `:is=mapIcon[data.icon]`和`:is=mapIcon[item.icon]`,就是把一级和二级(孩子)菜单的rights中的字符串放进去,取出真正的实例对象,至此完成了所有图标设置
  - ==要点4: 权限函数checkAuth的配置==
    - 其实和路由权限配置中动态添加路由中的权限判断几乎一样,只不过在store取用户权限列表的操作有点麻烦,这是一步到位的取值
        ```
            // 导入用户信息的store,我们在登录Login.vue中已经给这个store传入了当前用户的权限路径集合了
            import { useUserStore } from '../../store/useUserStore'
            const { user: { role: { rights } } } = useUserStore() // 获取useUserStore的user的值(用户信息),再在role/rights中找到path集合信息
            // 权限函数,rights为此用户拥有访问权限的路径,path会把所有路径都拿过来一个一个地测试一遍,通过的为true,失败的为false
            const checkAuth = (path) => {
                return rights.includes(path)
            }
        ```
    - 这里的路由权限检查在v-if之前,所以当发现此用户无权使用此路由时,就不会创建相应的菜单了
  - ==要点5: 保留当前菜单的记忆==
    - 为了不刷新后,丢失刚才菜单点击的位置,我们配置default-active属性(kerwin也讲过了),和开启路由模式一样,在el-menu标签上设置,页面加载时默认激活菜单的index,后面只需要跟当前路由的path即可(因为咱们的index=path),所以获取了path,就会激活对应index的菜单,从而实现即使刷新菜单也会保留记忆显示于此页面相关的菜单
    - 用路由工具useRoute获取当前路由的路径 .fullPath
        ```
            import { useRoute } from 'vue-router'
            const route = useRoute() // 应用于el-menu主菜单标签的default-active属性,使用
            route.fullPath获取当前路由的路径,就搜索栏的那行
        ```
    - 最后, 在el-menu中`:default-active="route.fullPath"`,我们最后给el-menu设置了高度样式,100vh
### TopHeader模块
- 使用el-header组件组成顶栏基本架构,el-dropdown-menu下拉菜单组件组成,在用户名下,负责显示登录身份和退出登录(==我们迁移了此功能==)
  ```
    <el-header>
        <div>学生学业质量分析系统</div>
        <!-- dropdown下拉菜单组件 -->
        <div>
            <span style="line-height:40px; margin-right:20px;">欢迎{{username}}回来</span>
            <el-dropdown>
                <!-- CDN导入,简单的 -->
                <!-- <el-avatar :size="40" src='https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'/> -->
                <!-- 本地导入,vite工具导入图片有点麻烦 -->
                <el-avatar :size="40" :src="avatar"></el-avatar>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>身份:{{roleName}}</el-dropdown-item>
                        <el-dropdown-item @click="handleExit">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </el-header>

    <style lang="scss" scpoed>
        .el-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #0d47a1;
            color: white;
        }
    </style>
  ```
  - 顶部栏2个构成,左边自己写的div,右边是组件,设置好scss样式,其中组件el-dropdown下拉菜单的菜单名我们设置为一个头像图(一个avatar组件),由span包裹(和源码一样,只是去掉了class名字),源码中是一串字
  - 下拉菜单名字,一个是身份,一个是退出登录(绑定退出登录处理函数,和测试时退出登录的函数一样,从Mainbox把相关代码剪切过来)
    ```
        // 引入路由方法
        import { useRouter } from 'vue-router';
        // 引入pinia的store
        import { useUserStore } from '../../store/useUserStore';
        import { useRouterStore } from '../../store/useRouterStore';

        const router = useRouter()
        // 额外获取store返回user信息中的rolename和username属性值,可以看看lib/userInfo.json结构
        const { changeRouter } = useRouterStore()
        const { changeUser,user:{role:{roleName},username} } = useUserStore()
        // 退出登录函数
        const handleExit = () => {
            // 清理user
            changeUser({})
            // isGetterRouter = false,为下次动态添加路由做准备
            changeRouter(false)
            // 跳Login页面
            router.push('/login')
        }
    ```
    > 看注释: 从这里面额外获取的roleName和username是用于给顶部栏动态配置用户名(admin/kerwin)和身份的(管理员和教师)
  - ==这里CDN获取el-avatar头像组件更简单,直接引入链接,size是大小,如果非要引入本地图片配置,必须进行如下配置:==   
    ```
        // 本地图片vite的导入
        const avatar = new URL('../../assets/userImg.png',import.meta.url).href
    ```
### 权限列表接口开发(务必复习前后端交互部分的基础知识)
- 1.准备后端express项目架构,==放入**myappServer文件夹**内部==
  - 下载express: `npm install express --save`
  - 创建项目结构: `npx express-generator --view=ejs`,输入此指令后,系统会自动下载工具并创建对应文件夹
  - 下载依赖: `npm install`
  - 更改package-json的热启动: node->nodemon(已经全局下载); 启动为`npm run start`
- 2.数据库--mongodb(==插播:这个数据库是非关系数据库,一般用来联系,真上企业不用这个的,通用的还是mysql==)
  - mongoose插件: `npm i mongoose`
  - 全局启动数据库: `mongod --dbpath D:\mongdb\dbEleData` (后面是路径,不要有中文,文件kerwin给配置好了,全局启动环境在plus也配置好了)
  - 可以同时启动多个数据库,路径不同,每个数据库的端口号也不同,prot默认27017
- 3.数据库可视化(==不是热启动,记得常刷新 refresh all==)
  - studio3t: 已经连接过一次了(应该留档了),保证先打开数据库再进行链接
  - 连接教程: 完成2步的打开数据库,进入studio3t,左上角的connect ->  左上角New Connect --> 选择第二项 --> 进入配置框,起名字Connect name + 配置端口号port(cmd启动mongodb后会显示,默认为27107),最后点击左下角的Test Connect测试链接情况,全部ok后save --> 退出来后再次点击左上角connect根据名字选择要链接的数据库
- 4.node开发的流程(新建文件夹,routes controllers service model)
  - routes配置路由,前端请求路由,基于routes的路由向controllers,基于它再找到service,再基于它控制模型model,最后model对数据库进行增删改查操作,这样的规范化流程有助于维护请求逻辑
- ==笔记图片附带解析(**一定仔细看上面的前置内容,该下载的插件下载好**)==
- 流程图1:[![pAgMxMT.jpg](https://s21.ax1x.com/2024/11/13/pAgMxMT.jpg)](https://imgse.com/i/pAgMxMT)
- ==回忆一下db文件夹是干什么的==: db文件夹其实就是我们在运行mongDB的服务器时存储数据库信息的一个文件夹,可以自己自定义,内部不要有中文,一般来说默认定义为db,如果以后再想打开这个数据库,就找到当初存储这个数据库的文件就行,开启服务器的命令`mongod --dpath 路径`(==已经配置好了,全局cmd输入即可,然后会显示数据库运行图,如下,默认端口27017==)
  [![pAgQ9Z4.png](https://s21.ax1x.com/2024/11/13/pAgQ9Z4.png)](https://imgse.com/i/pAgQ9Z4)
- ==开启完mongdb服务器后我们连接studio3t,对数据库进行可视化的处理,上面前置内容有笔记了==
- ==3.**创建express的项目工程文件,这是nodejs的部分,不太熟**,express将会作为我们的后端去和数据库进行链接==
- 4.==配置express/bin/www文件:==
  配置数据库: 
    ```
        // 配置数据库
        require("../config/db.config")
    ```
  - db.config.js 配置内容
    ``` 
        const mongoose = require("mongoose")
        // 连接到如下端口号27107,就是我们刚才开启的mongdb的数据库,没有文件会自动创建一个
        // 连接mongodb数据库
        mongoose.connect("mongodb://127.0.0.1:27017/smart-student-system")
    ```
    - ==这一步就是express链接数据库的smart-student-system数据区域,基础语法,写好数据库的地址==
- ==**流程图2:这是重点,express如何链接到数据库**==
  [![pAgMzsU.jpg](https://s21.ax1x.com/2024/11/13/pAgMzsU.jpg)](https://imgse.com/i/pAgMzsU)
  首先创建好新建文件夹routes controllers service model和图中对应的文件夹
- ==1.routes/RightRouter.js==
  ```
    var express = require('express');
    var RightRouter = express.Router();
    // 引入controllers的RightController文件
    var RightController = require("../controllers/RightController")
    // 前端访问get请求"/adminapi/rights" ---> 读取controllers的getList方法(写在controllers文件夹内)
    RightRouter.get("/adminapi/rights",RightController.getList)

    // 在app.js中注册这个路由
    module.exports = RightRouter
  ```
  - ==回忆==:当时在plus前端课讲到这个部分时,曾经还有过routes/index.js路由表呢,目的是为了处理过多的路由不在app.js冗余,当时直接把index给引入app.js文件了(==复习!==)
  - 这里没有使用index.js,因为只创建了一个子路由,此操作是创建了一个路由RightRouter和配置了其path,我们挂载到主路由后,可以根据其地址,在express项目架构下,访问其内容
  - express默认端口3000,启动express `npm run start`后,打开项目默认留给我们的地址'/',项目中有两个路由index.js和users.js,挂载到app.js的代码如下:
    - ==app.js==
    ``` 
        // 1.引入
        var indexRouter = require('./routes/index');
        var usersRouter = require('./routes/users');
    
        // 2.注册
        // 默认提供了2个路由, /和/user,用于测试端口服务器是否打开
        app.use('/', indexRouter);   // http://localhost:3000
        app.use('/users', usersRouter); // http://localhost:3000/users
    ```
    - ==index.js==
    ```
        var express = require('express');
        var router = express.Router();

        /* GET home page. */
        router.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
        });

        module.exports = router;
    ```
    - ==users.js==
    ```
        var express = require('express');
        var router = express.Router();

        /* GET users listing. */
        router.get('/', function(req, res, next) {
        res.send('respond with a resource');
        });

        module.exports = router
    ```
  - ==回忆:记得复习express部分的知识==,我们访问路由内容的path是主路由+子路由,子路由是routes内部文件定义 .get('...',XX)里面的path,主路由是app.js挂载的 .use('...',XX)的path,其中'/'默认是没有,由此我们看到项目默认提供的user和index子路由均为"/",就是没有,而主路由,index为'/',user为'/user'
  - 由此我们得出在浏览器上的访问应该如何去写了: 默认路径(http://localhost:3000) + 主路由 + 子路由,即上面app.js代码中的注释路径
  - ==再来看看我们在app.js挂载的RightRouter,看注释==
    ```
        // 1.引入RightRouter路由
        var RightRouter = require('./routes/RightRouter')
        // 2.注册
        // 注册,这个主路由默认为'/',套入访问公式即为 http://localhost:3000 + /adminapi/rights
        app.use(RightRouter)
    ```
  - 这一步做好了路由的path的配置,然后请求数据的任务交controllers部分去完成 
- ==2.controllers/RightController.js==
    ```
        const RightService = require("../service/RightService")

        module.exports ={
            // 2个系统参数,接受前端的请求req合返回给前端的数据res
            async getList(req,res){
                // 再向sevice发起一波请求,这是异步
                // 等待RightService操作数据库,映射数据库的内容给result
                var result = await RightService.getList()
                res.send(result) // 把请求的数据传回给前端
            }
        }
    ```
    - 在getList参数中,默认2个形参,它的作用是等待来自serveice的数据(异步的),并返回这些数据给routes,使用res.send()基础语法
- ==3.service/RightService.js==
    ```
        const RightModel = require("../model/RightModel")

        module.exports = {
            getList(){
                // 操作模型model的RightModel,返回的是一个promise对象(异步)
                // 返回一个模型.find() mongoose基本语法操作 查询全部, RightModel是我们写的一个模型
                return RightModel.find()
            }
        }
    ```
  - 返回promise对象,这个对象是model模型操控数据库获取的数据,.find()是全部查询,即把所有的数据都返回出去   
- ==4.model/RightModel.js==
    ```
        const mongoose = require("mongoose")
        const Schema = mongoose.Schema

        const RightType = {
            // 对myapp的rights.js(public/lib)的格式进行限制
            "title":String,
            "path": String,
            "icon": String,
            "children": Array
        }
        // 编译第一个模型，您需要调用 mongoose.model() 方法，并传入模型名称和 Schema
        // 创建一个right模型,它映射的数据库表的名字就是rights
        // new Schema()是对模型的数据进行约束限制
        const RightModel = mongoose.model("right",new Schema(RightType))

        module.exports = RightModel
    ```
  - 创建一个模型,规定模型的格式数据类型,`mongoose.model()`即是在数据库创建模型的语法,起名为right,数据库会自动给你变为复数
- 到此,所有步骤都完成了,打开express部署的端口服务器,进入到RightRouter的路由,应当看到空对象页面,此时刷新下studio3t,可以看到smart-student-system已经被创建
- ==最后向这个数据文件的rights添加我们来自myapp/pubilc/lib/rights.json的数据,insert JSON document填充数据进入rights,是以{},{},{}的对象为单个个体输入,它会把每个{}自动列为一项,直接把JSON文件全部复制进去即可,点击format JSON整理下格式即可==
  [![pAg1ca4.png](https://s21.ax1x.com/2024/11/13/pAg1ca4.png)](https://imgse.com/i/pAg1ca4)
  [![pAg16ZF.png](https://s21.ax1x.com/2024/11/13/pAg16ZF.png)](https://imgse.com/i/pAg16ZF)
- 流程图3: ==总结: 前端vite(vue) + 后端express(nodejs) + 数据库mongDB 的关系链接==
  [![pAgMjzV.jpg](https://s21.ax1x.com/2024/11/13/pAgMjzV.jpg)](https://imgse.com/i/pAgMjzV)
  总结为: ==前端vite向后端express请求数据,后端向数据库mongodb拿取数据==
- ==这里又涉及到跨域问题了,有两个解决办法,一个是后端写请求头,一个是前端的proxy代理服务器,这个plus中也讲了,记得复习==
- 在vite的vite.config.js中设置代理服务器
    ```
            import { defineConfig } from 'vite'
            import vue from '@vitejs/plugin-vue'

            // https://vite.dev/config/
            export default defineConfig({
            plugins: [vue()],
            // 仅前端解决: 解决跨域设置了一个代理服务器
            // 后端解决只需要加 Access-Control-Allow-Orign : *
            // vue 5173 ---> nodejs 3000 浏览器发送请求 CORS跨域问题
            server:{
                // 代理服务器思路: 向/adminapi发送的请求,我们代理到3000这个服务器上,拒绝直接使用浏览器请求(跨域会阻止你的),用服务器请求就不会受到跨域阻止
                // 3000就是我们nodejs项目的端口号,向里面请求数据即可
                proxy:{
                "/adminapi":{
                    target:"http://localhost:3000",
                    changeOrigin:true
                }
                }
            }
            })
    ```
  - 把向/adminapi路径的所有请求全部发给3000端口号代理,这个端口就是我们的express后端
- vite的components的SideMenu.vue发送的axios,指向后端express+代理服务器
    ```
    onMounted(async () => {
        // vite.config.js设置代理服务器了,直接向adminapi发送请去即可,不要向http://localhost:3000/adminapi/rights请求(跨域)
        var res = await axios.get("/adminapi/rights") // 取public的lib的json文件,获取数据
        // console.log(res)
        rightsList.value = res.data // 获取信息赋值给空数组rightsList
    })
    ```

### 权限列表组件
- 完成views/right-manage/RightList.vue,使用组件表格table完成权限列表功能,其中第一列是常规table组件,第二列和第三列是自定义的table组件,第二列是图标,和components的SideMenu设置图标一样,动态组件component+icon(mapicon[])转化,第三列就是两个el-button按钮

- 代码:
  ```
    <template>
        <!-- table表格/树形数据与懒加载: 支持树类型的数据的显示,当row中包含children字段时,被视为树形数据,渲染嵌套数据需要prop的row-key -->
        <!-- 把row-key设置为path,children内部没有_id属性,直接取数据tableData中的path属性值 -->
        <el-table :data="tableData" style="width: 100%" row-key="path">
            <!-- 没有v-for的情况下如何把数据对应正确的放在对应的列,prop属性至关重要,tableData的所有data属性放在prop=data的组件里,以此类推剩余两个 -->

            ----------------------第1列------------------------------------
            <el-table-column prop="title" label="权限名称" width="180" />
            ----------------------第2列------------------------------------
            <!-- 图标部分,需要ele中找到table的自定义表头组件,align是列的靠向 -->
            <el-table-column align="left" label="图标" width="180">
                <!-- 作用域插槽,组件获取子组件暴漏的内容scpoe -->
                <template #default="scope">
                    <!-- 组件暴漏的内容scope正是我们的整个tableData数组, .row是取内部每一项item(本行数据), .icon就取到了内部的icon字符串 -->
                    <!-- {{scope.row.icon}} -->
                    <el-icon size="20">
                        <!-- 和component/mainbox/SideMenu.vue中对侧边栏的图标显示一样 -->
                        <component :is="mapIcon[scope.row.icon]"></component>
                    </el-icon>
                </template>
            </el-table-column>
            ----------------------第3列------------------------------------
            <!-- 最右侧也是定制化,定制化内容是按钮 -->
            <el-table-column align="left" label="操作" width="280">
                <template #default="scope">
                    <el-button round type="primary">
                        编辑
                    </el-button>
                    <el-button round type="danger">
                        删除
                    </el-button>
                </template>
            </el-table-column>
            <!-- 填充内容的,要不右侧全部空白不好看,没有内容的一列,宽度自适应剩下的 -->
            <el-table-column />
        </el-table>
    </template>

    <script setup>
    import { onMounted, ref } from 'vue';
    import axios from 'axios'
    // 引入icon图标
    import { TrendCharts, User, Key, List, Grid, OfficeBuilding, PieChart, School } from '@element-plus/icons-vue'
    // 映射对象
    const mapIcon = {
        TrendCharts, User, Key, List, Grid, OfficeBuilding, PieChart, School
    }
    const tableData = ref([])

    onMounted(() => {
        getList()
    })

    const getList = async () => {
        var { data } = await axios.get("/adminapi/rights")
        console.log(data)
        tableData.value = data
    }

    </script>
  ```
  - el-table: 根列表 
    - :data="tableData" 这个就是我们rights的数据,通过axios获取
    - ==row-key="path" 新知识,重点==: table表格/树形数据与懒加载: 支持树类型的数据的显示,当row中包含children字段时,被视为树形数据,渲染嵌套数据需要prop的row-key,把row-key设置为path,children内部没有_id属性,此操作是直接取数据tableData中的path属性值,==这是对列表的二级扩充,一步到位==
  - el-table-column: 固定列表
    - prop="title": 把tableData中的title属性内容放入此列,以此类推
    - label: 是列名
    - align="left": 是align是列的靠向
  - el-table-column + template #default="scope" 自定义组件
    - #default="scope": 组件暴漏的内容scope正是我们的整个tableData数组
- ==第二列图标列==: 理解组件的作用域插槽属性scope,组件暴漏的内容scope正是我们的整个tableData数组, .row是取内部每一项item , .icon就取到了内部的icon字符串,正常引入组件+key-value键值映射mapIcon,结合component+:is即可
- ==第三列按钮定制化==: 直接把el-button放进去即可
- ==最后的效果图(共3列)==
    [![pAg6fWq.png](https://s21.ax1x.com/2024/11/14/pAg6fWq.png)](https://imgse.com/i/pAg6fWq)
### 权限列表更新
- ==承接上一节,给按钮加功能,分为**更新和删除两个功能**==
- ==RightList.vue的权限列表代码==
  ```
    <el-table-column align="left" label="操作" width="280">
            <template #default="scope">
                <!-- 更新函数传入这一行的数据scoped.row  -->
                <el-button round type="primary" @click="handleUpdate(scope.row)">
                    更新
                </el-button>
                <!-- 新组件: Popconfirm 气泡确认框,会弹出一个确认框,防止手误直接错误删除 -->
                <!-- 文档: confirm-button-text: 确认按钮文字 cancel-button-text: 取消按钮文字 (all String)-->
                <!-- 事件: confirm 点击确认按钮时触发 -->
                <el-popconfirm title="你确定要删除吗?" confirm-button-text="确定" cancel-button-text="取消" @confirm="handleDelete(scope.row)">
                    <template #reference>
                        <el-button round type="danger">
                            删除
                        </el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
        <!-- 填充内容的,要不右侧全部空白不好看,没有内容的一列,宽度自适应剩下的 -->
        <el-table-column />
    </el-table>
  ```
    - ==更新功能==: 点击触发handleUpdate函数,同时使用新组件dialog,作用是弹出一个框,我们之后会在里面放入el-form表单等内容
    - ==删除功能==: 根据文档设置了'确认'按钮点击触发事件函数`@confirm="handleDelete(scope.row)"`
>
- 1.==更新功能==
  - 新组件的代码就放在权限列表代码下面即可,这个组件是一个气泡弹出框,默认不让他显示即可,显示也会盖在table组件上面,对页面结构不影响,如下:
    [![pAg6RFs.jpg](https://s21.ax1x.com/2024/11/14/pAg6RFs.jpg)](https://imgse.com/i/pAg6RFs)
    - dialog组件代码:
    ```
        <el-dialog v-model="dialogVisible" title="更新权限" width="500">
            <!-- 表单组件插入 -->
            <el-form :model="updateForm" label-width="auto" status-icon>
                <!-- prop: 负责获取校验对象username -->
                <el-form-item label="权限名称" prop="title">
                    <el-input v-model="updateForm.title" />
                </el-form-item>
            </el-form>
            <!-- 对话框的2个按钮 -->
            <template #footer>
                <div class="dialog-footer">
                    <!-- 两个按钮点击都会隐藏掉对话框 -->
                    <el-button type="primary" @click="handleConfirm()">
                        确认
                    </el-button>
                    <el-button @click="dialogVisible = false">
                        取消
                    </el-button>
                </div>
            </template>
        </el-dialog>
    ```
    - 组件介绍: 
      - ==**el-dialog(新组件)**==: 弹出气泡框的根组件,内部的内容自定义,我们在内部这次写了el-form表单和2个el-button按钮来作为内容,如上图,一个输入框和2个按钮
      - ==el-form==: 讲过多次了,在这里搭配最简单的el-form-item,做了一个输入框
      - ==el-button==: 按钮,附带一些功能,重点看'确认'按钮的功能
    - ==**组件属性介绍(重点)**==
      - ==el-dialog==: 
        - v-model: ==双向绑定的了一个属性**dialogVisible**,它是布尔值,为true时,这个框才会显示,我们初始化定义其为false,不显示==
        - title: 气泡框的名字
      - ==el-form==: 
        - model: 双向绑定了表单的数据,updateForm需要在js中初始化
      - ==el-form-item:==
        - label: 输入框命名
        - prop: 在这里没用,这是对列数据排列的功能
      - ==el-button==: 没有重点,加了点击事件处理函数
        - 确认按钮: 绑定函数handleConfirm(),较为复杂的
        - 取消按钮: 直接给dialogVisible赋值false,弹框消失
- 1.2 更新功能--==表单列表的更新按钮函数==--==handleUpdate==
  - 代码:
    ```
        // 点击更新按钮---更新事件处理
        const handleUpdate = (item) => {
        // console.log(item)
        dialogVisible.value = true
        // 改变表单的内容为本行数据的title值
        updateForm.title = item.title
        // 保存这次的数据
        currentItem.value = item
    }
    ```
  - ==**形参item: 函数传入item的是scope.row,我们可以通过它获取点击项的当行数据,这是组件非常好用的一个参数,也是重点参数**==
  - 函数作用: 
    - 1.把dialogVisible设置为true,显示弹框
    - 2.把el-form的输入框列表名变为更新项的名字
    - 3.==**临时保存scope.row的值,这是重点,作用是我们确定更新后,负责更新传数据的函数handleConfirm()是无法获取这个参数的,它们是两个函数,没有互相调用,是割裂的,所以引入全局的中间变量**==      
- 1.3 更新功能--==弹框的确认按钮函数==--==handleConfirm()==
    - 代码示例:
        ```
            const handleConfirm = async () => {
                dialogVisible.value = false
                // 请求数据
                await axios.put("/adminapi/rights", {
                    data: currentItem.value, // req.body信息,直接传id不行,后面就知道了children内部没有id
                    // 但是title属性只有updateForm知道,我们获取的这个item是未更新的数据
                    title: updateForm.title // 重新传递更新后的title值
            })
            await getList() // 删除后,重新请求一次数据,更新页面
        }
        ```
    - 点击确认也是先把弹出框隐藏,然后向后端发送axios,这次需要发送请求数据req,其中data就是我们临时保存的scope.row信息,title是我们更新修改的title值,通过express操纵数据库更新数据后,再重新请求一次数据getList(),实现页面响应式更新
- 2.==后端部分,express-->mongodb数据库==
- ==流程一样的: 如下 myappSever==
  - ==RightRouter.js==
    ```
        // 前端更新数据put请求(用户权限名字更新) 和get一个流程
        RightRouter.put("/adminapi/rights",RightController.updateList)
    ```
    > 设置put请求路由(get是用于获取数据,put是用于发送请求req获取数据,实际使用没啥区别,各有倾向的用途),请求路径不变,设置新函数updateList
  - ==RightController.js==
    ```
        async updateList(req,res){
            // 把更新的数据都放在请求数据req的body里面
            var result = await RightService.updateList(req.body)
            res.send(result) // 把请求的数据传回给前端
        }
    ```
    > 同理继续向updateService请求数据,==这次传进去我们的请求数据req.body信息==
  - ==RightService.js==
    ```
        updateList({data,title}){
            // console.log(item) // 打印req.body测试,在express的终端打印的,还没返回给浏览器呢,所以浏览器的终端看不到打印
            // 更新唯一的数据,参数1: 查哪一项,即_id为item._id的这一项,必须是唯一id
            // 参数2: 更新 内部的title属性值改为形参的title,这两个title不是一个,前者是data内部属性,后者是结构出来的值,也是更新值
            // 更新数据库的title值后,重新请求一次数据,在更新按钮函数请求后端之后重写一次请求数据的函数getList(),前端的页面会响应式变化
            // 对于数据data的children属性内部的值是没有_id属性的,所以对于孩子需要新方法取更新
            if(data._id){
                return RightModel.findOneAndUpdate({_id:data._id},{
                    "$set":{
                        title: title
                    }
                })
            }else{
                // 深度数组查询: 没有_id,下面是查children里面的path属性,会自动遍历所有的数组项,然后这个数组项内部的path只要等于我们data的path,就是我们要找的
                return RightModel.findOneAndUpdate({
                    "children.path": data.path
                },{
                    // 修改children的本项($占位符,会自动匹配你找的那个项)的title修改为title,固定写法
                    // 深度更新
                    $set:{
                        "children.$.title" : title
                    }
                })
            }  
        }
    ```
    - ==重点: model文件是对数据库进行操作的位置==
      - 里面的代码就是对数据库mongodb数据操作的基础语法,看注释,这里涉及新的知识,涉及深度数组查询,因为children内部是没有_id属性的,所以额外做了处理
    - ==我们在企业中基本都是使用关系型数据库mysql,mongodb是非关系型数据库,公司是不用的,所以后期要自己学些mysql的基础语法,不需要做到精通,只需要把最基础的最常用的语法学会,增删改查等,然后结合前端的nodejs前后端交互操纵数据库==
  - 至此完成了更新的功能,在权限列表点击更新按钮,触发handleUpdate,打开弹出框,在框内输入更改数据,然后点击确认,触发handleConfirm(),然后进行一系列的数据处理(express-->mongodb),最后实现数据库更新映射到页面
  - 重点:
    - 理解scope.row的重要性
    - 中间变量存储scope的值(handleUpdate-->handleConfirm)
    - 后端路由传递数据的流程在复习,携带req传递数据
  - 次重点: mongodb的数据库语法,这个自己玩可以,公司不用的
### 权限列表删除
- ==书接上一回,我们做完了权限列表的更新功能,这次我们做删除功能==
- 再次看下代码:
    ```
    <el-table-column align="left" label="操作" width="280">
            <template #default="scope">
                <!-- 更新函数传入这一行的数据scoped.row  -->
                <el-button round type="primary" @click="handleUpdate(scope.row)">
                    更新
                </el-button>
                <!-- 新组件: Popconfirm 气泡确认框,会弹出一个确认框,防止手误直接错误删除 -->
                <!-- 文档: confirm-button-text: 确认按钮文字 cancel-button-text: 取消按钮文字 (all String)-->
                <!-- 事件: confirm 点击确认按钮时触发 -->
                <el-popconfirm title="你确定要删除吗?" confirm-button-text="确定" cancel-button-text="取消" @confirm="handleDelete(scope.row)">
                    <template #reference>
                        <el-button round type="danger">
                            删除
                        </el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
        <!-- 填充内容的,要不右侧全部空白不好看,没有内容的一列,宽度自适应剩下的 -->
        <el-table-column />
    </el-table>
    ```
    - 锁定删除el-button,使用了==新组件: Popconfirm 气泡确认框==,会弹出一个确认框,防止手误直接错误删除,这个组件包住el-button,然后点击删除按钮就会跳出确认框
      - confirm-button-text: 确认按钮文字
      - cancel-button-text: 取消按钮文字 
      - ==事件: confirm 点击确认按钮时触发handleDelete(scope.row)==
- handleDelete(scope.row)函数:
    ```
    // 删除表单-->向后端发送请求
    // 删除权限列表单项 item就是scope.row获取的单行数据对象
    const handleDelete = async (item)=>{
        // console.log(item)
        // 删除请求 delete 用于删除数据
        await axios.delete("/adminapi/rights",{
            // delete传参比较特殊,一般是把要删除的id拼在路径上
            // 注意: 这里传递的是一个对象,而且对象名字必须是data后端才会接收到,并且会自动消化掉data属性名,只获取其值
            data: item // 点击项数据发送给后端,用于匹配删除,整个item可以唯一标识,id还是不行,因为children没id,删不了
        })
        await getList() // 删除后,重新请求一次数据,更新页面
        // 删除完成后,重新导入一遍数据,手动导入
    }
    ```
    > 依旧是利用scope.row获取我们要删除数据的基本信息,知道你要删除哪一行的数据,这个参数会获取你点击删除的那行数据proxy对象
    > ==和更新同理,需要向后端传递req信息,data的item就是scope==
    > 注意删除数据的请求是 ==axios.**delete**(...)==
- 2.老样子,前面的几乎一样,express部分 myappServer
  - RightRouter.js
    ```
        // 前端删除列表delete请求
        RightRouter.delete("/adminapi/rights",RightController.deleteList)
    ```
  - RightController.js
    ```
        async deleteList(req,res){
            // 把删除的数据都放在请求数据req的body里面
            var result = await RightService.deleteList(req.body)
            res.send(result) // 把请求的数据传回给前端
        }
    ```
  - RightService.js
    ```
        // 删除列表函数
    deleteList(item){
        // console.log(item)
        if(item._id){
            return RightModel.findOneAndDelete({"_id":item._id}) // 找到对应的id删除
        }else{
            // 深度更新children数组内部的项 新知识 2个参数 
            return RightModel.findOneAndUpdate({ // 不要写成删除findOneAndDelete,是更新操作,找到对应项,拉取数据,然后更新,否则删除孩子会把其父一同打包删除
                "children.path": item.path // 在children中找到对应项
            },
            {
                $pull:{"children":{path:item.path}} // pull意为拉取,把children中符合这一项的拉取出来(删除)
            })
        }
    }
    ```
    - 涉及了mongodb的数据删除操作,看看注释的语法,注意深度删除children内部的数据还是更新的操作,拿去里面的一条数据后,再进行更新
    - ==最后,删除数据不可逆,如果需要数据,需要在studio3t中重新添加一遍==
### 角色列表组件
- 角色列表的创建和权限列表的构建差不多
- 角色列表的效果图如下: ==right-manage/RoleList.vue==
  [![pAgbGOH.png](https://s21.ax1x.com/2024/11/14/pAgbGOH.png)](https://imgse.com/i/pAgbGOH)
- 权限列表的效果图如下: ==right-manage/RightList.vue==
  [![pAg6fWq.png](https://s21.ax1x.com/2024/11/14/pAg6fWq.png)](https://imgse.com/i/pAg6fWq)
- 把权限列表的代码复制过来,三列变两列,删除图标列,数据是kerwin提供的,已经保存静态资源public/lib/roles.json
- 
- ==先完成列表的重构 el-table==
  ```
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="roleName" label="角色名称" width="180" />
        <!-- 最右侧也是定制化,定制化内容是按钮 -->
        <el-table-column align="left" label="操作" width="280">
            <template #default="scope">
                <!-- 更新函数传入这一行的数据scoped.row  -->
                <el-button round type="primary" @click="handleUpdate(scope.row)">
                    更新
                </el-button>
                <!-- 新组件: Popconfirm 气泡确认框,会弹出一个确认框,防止手误直接错误删除 -->
                <el-popconfirm title="你确定要删除吗?" confirm-button-text="确定" cancel-button-text="取消"
                    @confirm="handleDelete(scope.row)">
                    <template #reference>
                        <el-button round type="danger">
                            删除
                        </el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
        <!-- 填充内容的,要不右侧全部空白不好看,没有内容的一列,宽度自适应剩下的 -->
        <el-table-column />
    </el-table>
  ```
  - el-table-column: 
    - ==简单修改==
    - 第一列: 修改prop,更新为roleName(管理员/教师) label->角色名称
    - 第二列: 什么都没改,还是两个按钮
- 2.==在数据库中创建新的集合roles(注入roles.json),并从中获取数据getList==
  - 流程一样,首先在routes -> controller -> service -> model四个文件夹中创建roles相关的文件
  - ==**第一步优先获取到数据即可,内容几乎和当时rights的创建没区别,复制黏贴即可,改改名字**==
  - RoleRouter.js
    ```
        var express = require('express');
        var RoleRouter = express.Router();
        var RoleController = require("../controllers/RoleController.js")

        RoleRouter.get("/adminapi/roles",RoleController.getList)

        module.exports = RoleRouter // 记得app.js中注册
    ```
  - app.js的注册:
    ```
        var RoleRouter = require('./routes/RoleRouter')
        app.use(RoleRouter)
    ```
  - RoleController.js
    ```
        const RoleService = require("../service/RoleService")

        module.exports ={
            async getList(req,res){
                var result = await RoleService.getList()
                res.send(result) // 把请求的数据传回给前端
            }
        }
    ```
  - RoleService.js
    ```
    const RoleModel = require("../model/RoleModel")

    module.exports = {
        // 下面均为mongodb数据库操作
        getList() {
            // 操作模型model的RightModel,返回的是一个promise对象(异步)
            // 返回一个模型.find() mongoose基本语法操作 查询全部, RightModel是我们写的一个模型
            return RoleModel.find()
        }
    }
    ```
  - RoleModel.js(==操作数据库的文件,这里是目前差别最大的地方==)
    ```
        const mongoose = require("mongoose")
        const Schema = mongoose.Schema

        const RoleType = {
            // id会自动生成,roles.json数据文件的格式限制
            "roleName":String,
            "roleType": Number,
            "rights": Array
        }
        // role ---> roles
        const RoleModel = mongoose.model("role",new Schema(RoleType))

        module.exports = RoleModel
    ```
    > 由于rights和roles的数据构成不同,所以我们限制类型RoleType会有所不同
- roles.json文件的结构:
    ```
    [
        -------------1------------------
        {
            "id": 1,
            "roleName": "管理员",
            "roleType": 1,
            "rights": [
                "/index",
                "/user-manage",
                "/user-manage/list",
                "/right-manage",
                "/right-manage/rolelist",
                "/right-manage/rightlist",
                "/tag-manage",
                "/tag-manage/list",
                "/interview-manage",
                "/interview-manage/companylist",
                "/interview-manage/companydata",
                "/student-manage",
                "/student-manage/studentlist",
                "/student-manage/gradelist"
            ]
        },
        ----------------2---------------
        {
            "id": 2,
            "roleName": "讲师",
            "roleType": 2,
            "rights": [
                "/index",
                "/interview-manage",
                "/interview-manage/companylist",
                "/interview-manage/companydata",
                "/student-manage",
                "/student-manage/studentlist",
                "/student-manage/gradelist"
            ]
        }
    ]
    ```
- 往数据库注入数据后,然后请求数据,提供给el-table,它:model双向绑定的属性就是tableData的值
- RoleList.vue
    ```
        const tableData = ref([]) // 角色列表

        onMounted(() => {
            getList()
        })

        const getList = async () => {
            // 向新的数据库集合roles请求数据(mongodb时非关系型数据库,叫做集合,在mysql这种关系型数据库中,叫做表)
            var { data } = await axios.get("/adminapi/roles")
            // console.log(data)
            tableData.value = data
        }
    ```
### 角色列表更新
- ==**重点: 处理弹出框的内容,这里有新的组件el-tree**==
- 角色列表的弹出框效果图:
  [![pAgbYmd.png](https://s21.ax1x.com/2024/11/14/pAgbYmd.png)](https://imgse.com/i/pAgbYmd)
- 点击更新按钮,弹出dialog的处理框,还是函数handleUpdate,控制dialogVisible为true让弹出框显示出来,先暂时不展示代码,后面结合新组件一起,==注意: 这里函数handleUpdate和handleConfirm还是权限列表更新和一样,有差不多的配合,一会见分晓==
- ==1.优先处理dialog内部的样式以及引入新组件==
  ```
    <!-- 对话框dialog组件 -->
    <!-- v-model双向绑定: dialogVisible为true就显示,为false就隐藏 -->
    <el-dialog v-model="dialogVisible" title="更新角色" width="500">
        <!-- 表单组件 -->
        <el-form :model="updateForm" label-width="auto" status-icon>
            <el-form-item label="角色名称" prop="roleName">
                <!-- 输入框内容双向绑定,预输入updateForm.roleName -->
                <el-input v-model="updateForm.roleName" />
            </el-form-item>
            <!-- 新组件: Tree属性控件 -->
            <el-form-item label="角色权限" prop="rights">
                <!-- data就是数据,根据数据创建属性结构,我们对rights再次取一遍即可 -->
                <!-- node-key: 其值为节点数据中的一个字段名，该字段在整棵树中是唯一的,因为children中没有id,所以统一用path作为唯一id -->
                <!-- :props/label指定节点标签为节点对象的某个属性值 -->
                <!-- :default-checked-keys=['/index'] 就会选中唯一id是'/index'的框,:default-checked-keys="updateForm.rights"即全选,但是这个其实不行,第一次点开的谁,以后就永远跟着谁了,无法动态更新,意味着我们的权限列表在管理和讲师之间只能2选1,不用这个 -->
                <el-tree style="max-width: 600px" :data="rightsList" show-checkbox node-key="path"
                    :props="{ label: 'title' }" ref="treeRef" :check-strictly="true" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="handleConfirm()">
                    确认
                </el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </div>
        </template>
    </el-dialog>
  ```
- el-dialog分为两部分: 看图片,一个是角色名称的普通输入框部分,一个是角色权限新组件部分
  - ==角色名称部分:(简单,预填写输入框的内容)==
  - 1.el-form: 双向绑定的值updateForm
    ```
        // 权限列表的title名称
        const updateForm = reactive({
            roleName: "",
            rights: []
        })
    ```
  - 2.点击更新按钮时,通过scope把那一列的信息传进handleUpdate
    ```
    const handleUpdate = (item) => {
        dialogVisible.value = true
        updateForm.roleName = item.roleName
        ...
    }
    ```
  - 3.给el-input(输入框双向绑定) `:model = updateForm.roleName`
  - ==角色权限部分: 新组件: Tree属性控件==
    ```
        <el-form-item label="角色权限" prop="rights">
            <el-tree style="max-width: 600px" :data="rightsList" show-checkbox node-key="path"
                :props="{ label: 'title' }" ref="treeRef" :check-strictly="true" />
        </el-form-item>
    ```
  - el-form-item(角色权限) 内部包装新组件el-tree
  - ==内部的属性帮助我们实现功能:==
    - data: 绑定数据,我们这里需要权限数据rights,根据数据创建属性结构,我们对rights再次取一遍即可
    ```
        const rightsList = ref([]) // 权限列表
        onMounted(() => {
            ...
            getRightList()
        })
        const getRightList = async () => {
            var { data } = await axios.get("/adminapi/rights")
            console.log(data)
            rightsList.value = data
        }
    ``` 
    - node-key: 其值为节点数据中的一个字段名，该字段在整棵树中是唯一的,因为children中没有id,所以统一用path作为唯一id
    - :props/label指定节点标签为节点对象的某个属性值,把选项名改为数据里面的title值
    - 我们拿rights.json其中一项数据
    ```
    {
        "title": "用户管理",
        "path": "/user-manage",
        "icon": "User",
        "children": [
            {
                "title": "用户列表",
                "path": "/user-manage/list",
                "icon": "List"
            }
        ]
    },
    ```
    - 把所有的权限名字title作为选项名字列好
    - 效果图: [![pAgbYmd.png](https://s21.ax1x.com/2024/11/14/pAgbYmd.png)](https://imgse.com/i/pAgbYmd)
  - ==下一步我们实现默认勾选,所有的框先全选==
  - 注意: 属性:default-checked-keys=['/index'] 就会选中唯一id是'/index'的框,:default-checked-keys="updateForm.rights"即全选,但是这个其实不行,第一次点开的谁,以后就永远跟着谁了,无法动态更新,意味着我们的权限列表在管理和讲师之间只能2选1,不用这个
     > element的使用就在于看文档,发现这个不行就继续找新的方法,最终在事件栏找到了解决函数,如下 
  - ==使用setCheckedKeys函数==: 
    - 函数介绍: 设置目前选中的节点，使用此方法必须设置 node-key 属性,(keys, leafOnly) 接收两个参数: 1. 一个需要被选中的多节点 key 的数组 2. 布尔类型的值 如果设置为 true，将只设置选中的叶子节点状态。 默认值是 false.
  - 语法: `树的对象.setCheckedKeys`
  - 获取el-tree的对象: 我们使用ref的方式,在el-tree的标签上已经标记ref="treeRef",随后获取`const treeRef = ref(null) // 获取tree对象`(==全是老知识==)
  - 我们给选项框默认勾选的函数应当在handleUpdate函数中,即打开dialog前完成默认勾选,==**坑: 这里有坑,el-dialog是懒惰的,因为默认弹出框是不显示的,所以它不会创建dom,之后我们执行上面的代码dialogVisible.value = true,把dialog虽然是创建出来了,但是创建dialog的dom是异步的,而获取dialog内部的节点(ref)是js同步代码,也就是说第一次点击更新,第一次创建dialog,在此情况下,我们无法获取其节点值treeRef,当第一次创建过后,之后就是节点的隐藏与显示了,节点已经创建完成了,所以在第二次点击更新后,才能获取ref的节点**==
  - 点击的第一次是获取不到el-tree对象的,第二次才有,效果如下:
  [![pAgb1SO.png](https://s21.ax1x.com/2024/11/14/pAgb1SO.png)](https://imgse.com/i/pAgb1SO)
  - 使用nextTick(记得引入)
    - 使用nextTick,他会等待上面的状态更新完成之后(dom创建完成)再执行回调函数,这样不必在update生命周期函数被多次调用
    - 它是一次性的,不过从第二次开始我们也创建好dialog组件了,所以正好走的恰到好处
    ```
        const handleUpdate = (item) => {
            dialogVisible.value = true
            updateForm.roleName = item.roleName
            updateForm.rights = item.rights
            ...
             nextTick(() => [
                treeRef.value.setCheckedKeys(updateForm.rights)
            ])
        }
    ```
    - 参数的updateForm.rights是默认选中的节点数组,教师和管理的权限不通,数组自然也不同,通过scope-->item,我们可以获取当前点击的是哪一项(教师/管理),然后取其rights值,赋值给updateForm.rights,最后将其作为评判标准设置默认勾选
- ==dialog的确认按钮--handleConfirm()是真实的要更新数据库的内容了==
  - 代码:
    ```
    const handleConfirm = async () => {
        dialogVisible.value = false
        await axios.put(`/adminapi/roles/${currentItem.value._id}`, {
            roleName: updateForm.roleName,
            rights: treeRef.value.getCheckedKeys()
        })

        await getList() // 响应式更新数据
    }
    ```
  - 1.==需要三个值== 
    - _id: 识别是更新教师还是管理
    - roleName: el-input的修改,更新名字
    - rights: el-tree的修改,更新权限列表
  - 2.currentItem又用上了,还是那个原因,==handleUpdate有scope,知道点的哪一个,而dialog的handleConfirm函数和它是割裂的,无法得知点击的是哪一个(教师/管理),所以借助全局变量临时存储,教师和管理的属性中(roles.json)_id可以帮助我们区分==
  - handleUpdate(==完全体==): + currentItem
    ```
        // 全局的临时保存
        const currentItem = ref({})

        const handleUpdate = (item) => {
            dialogVisible.value = true
            updateForm.roleName = item.roleName
            updateForm.rights = item.rights
            currentItem.value = item

            nextTick(() => [
                treeRef.value.setCheckedKeys(updateForm.rights)
            ])
        }
    ```
    - roleName: 获取就是通过全局状态updateForm获取的
    - _id: 通过全局状态currentItem获取,==和当时rights获取数据不同的是这次用了动态路由的方式,把_id存到path请求路径里面去了,后面有从path中取动态路由数据_id的办法==
    - 动态路由配置: RoleRouter.js
    ```
        // 动态路由,:id是占位符,无论占位符输入什么都可以访问到/adminapi/roles/
        RoleRouter.put("/adminapi/roles/:id",RoleController.updateList)
    ```
    - rights: treeRef.value.getCheckedKeys()
    - ==使用了事件函数getCheckedKeys(),和setCheckedKeys()打配合==
    - 函数功能: 若节点可用被选中 (show-checkbox 为 true), 它将返回当前选中节点 key 的数组
    - 我们点击确定按钮后,从el-tree树结构中获取我们到底给那些权限打勾了,整齐的把其id(也就是我们设置的唯一path)放入数组中
    - ==注意:== rights: updateForm.rights不行,那是初始化全选的权限列表,还没手动勾选更新呢
    - ==更新前: setCheckedKeys()函数根据用户身份不同,默认勾选不同的权限框,更新后,getCheckedKeys()能直接获取当前的勾选状况,并记录==
  - ==最后一个问题==,发现删除一个孩子,父会跟着消失,连同他的所有孩子,所以这里需要给==el-tree设置一个属性check-strictly==
  - check-strictly 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
  - 我们在上面的代码中设置为true,即父子关系不互相关联,`:check-strictly="true"`
- ==3.发送了携带好数据的axios之后,就需要在相关的后端配置更新函数了==
- **大部分是体力话,千篇一律的重复**
- RightRouter.js
    ```
        // 前端更新数据put请求(用户权限名字更新) 和get一个流程
        RightRouter.put("/adminapi/rights",RightController.updateList)
    ```
- RoleController.js(==**难点: 在这里获取动态路由信息_id**==)
    ```
    async updateList(req,res){
        // 从nodejs终端看
        // console.log(req)
        // console.log(req.body) // 请求体 
        // console.log(req.params.id) // 拿到动态路由的值
        // 把更新的数据都放在请求数据req的body里面
        var result = await RoleService.updateList(req.params.id,req.body)
        res.send(result) // 把请求的数据传回给前端
    }
    ```
    - ==从path中提取动态路由,这个动态路由的作用是携带id信息,这是一个新思路,你也可以和之前一样,把id像roleName和rights封装如req.body传过去,这里用新方法,最后是通过req.params.id获取的==
    - 相关的数据在nodejs终端显示,你可以看看打印的都是些什么(以管理员为例子,点击的是管理员的更新+确定按钮,所以req的数据都是关于管理员的)
        ```
        /*
            req: 巨长一串,内部有许多的信息,不复制了
            req.body:
            {
                roleName: '管理员',
                rights: [
                    '/tag-manage',
                    '/tag-manage/list',
                    '/student-manage',
                    '/student-manage/studentlist',
                    '/student-manage/gradelist',
                    '/user-manage',
                    '/user-manage/list',
                    '/interview-manage',
                    '/interview-manage/companylist',
                    '/interview-manage/companydata',
                    '/right-manage',
                    '/right-manage/rolelist',
                    '/right-manage/rightlist'
                ]
            }
            ---------------
            req.params
            { id: '6735c31e720e4a1fa219868d' }
            // 我们直接取其id即可
        */
        ```
- RoleService.js(==按照id区分更新哪一项,更新的数据为roleName和rights==)
  ```
    updateList(id,{roleName,rights}){
        // 更新,根据id更新
        return RoleModel.findByIdAndUpdate(id,{
            roleName, // 简写
            rights
        })
    },
  ```
- 没有model的事情了,他的任务就是配置好数据类型限制RoleType,并在数据库中创建集合roles

- ==最后是删除功能: 就是更新右边的按钮==
- handleDelete(scope.row)处理函数,发送删除请求函数delete
  ```
    const handleDelete = async (item)=>{
        await axios.delete(`/adminapi/roles/${item._id}`)

        await getList() // 响应式更新数据
        // 删完了记得在studio3t添加回来,我们学了前面的知识后,其实也能仿照着加一个添加功能
    }
  ```
  - 把要删除的id数据直接作为动态路由传给后端,到时候后端提取其id内容,删除相关数据即可
- RoleRouter.js
  ```
    // 前端删除列表delete请求
    RightRouter.delete("/adminapi/rights",RightController.deleteList)
  ```
- RoleController.js (==动态路由的数据被提取出来,作为参数传递给下一个==)
  ```
    async deleteList(req,res){
        var result = await RoleService.deleteList(req.params.id)
        res.send(result) // 把请求的数据传回给前端
    }
  ```
- RoleService.js (==基础语法:按照id删除数据==)
  ```
    deleteList(id){
        return RoleModel.findByIdAndDelete(id)
    }
  ```
- 至此所有的内容完成:==重点==
  - 新组件el-tree的属性和用法,特别是那两个函数
  - 像后端请求数据使用动态路由方式,以及获取动态路由信息的方式
  - 点击更新按钮和确认按钮的函数联动,这也是上节课的重点,使用去全局变量传递scope的值
  - 懒惰的el-dialog创建异步过程导致无法即使获取getCheckedKeys(),这个问题的解决很简单nextTick,难点在于意识到el-dialog的创建机制是懒惰的+dom的更新是异步的,==js的难点就是异步,我们的同步代码有时候获取不到一些数据,典型的就是dom的创建这种异步的行为,常常拖我们代码信息获取的后腿==
  - ==暂时想不出来了==
### 用户列表接口
- 用户列表数据来自于/lib/user.json,==注意用户列表的数据是基于role数据变化的,我们在修改用户权限列表后,用户列表的数据应当发生改变==
- user.json的某部分(==user里面的role属性值部分跟随role表变化==)
  ```
    {
        "id": 1,
        "username": "admin",
        "password": "123",
        "role": {
            "roleName": "管理员",
            "roleType": 1,
            "rights": [
                "/index",
                "/user-manage",
                "/user-manage/list",
                "/right-manage",
                "/right-manage/rolelist",
                "/right-manage/rightlist",
                "/tag-manage",
                "/tag-manage/list",
                "/interview-manage",
                "/interview-manage/companylist",
                "/interview-manage/companydata",
                "/student-manage",
                "/student-manage/studentlist",
                "/student-manage/gradelist"
            ]
        }
  }
  ```
- ==1.创建用户列表user的后端架构:==
- userRouter.js(==记得app.js挂载(略),先获取数据==)
  ```
        var express = require('express');
        var UserRouter = express.Router();
        var UserController = require("../controllers/UserController.js")

        UserRouter.get("/adminapi/users",UserController.getList)  
  ```
- UserController.js(==没变改改名字==)
  ```
        const UserService = require("../service/UserService")

        module.exports ={
            // 2个系统参数,接受前端的请求req合返回给前端的数据res,再向sevice发起一波请求,这是异步
            async getList(req,res){
                var result = await UserService.getList()
                res.send(result) // 把请求的数据传回给前端
            },
            ...
        }
  ```
- UserService.js(==连表查询.populate(role),连role表==)
  ```
    const UserModel = require("../model/UserModel")

    module.exports = {
        // 下面均为mongodb数据库操作
        getList() {
            // 连表查询,连role表
            return UserModel.find().populate("role")
        },
        ....
    }
  ```
- UserModel.js(==连表查询的Schema配置==)
  ```
    const mongoose = require("mongoose")
    const Schema = mongoose.Schema

    const UserType = {
        // id会自动生成,roles.json数据文件的格式限制
        "username":String,
        "password": String,
        // role用户权限表会影响user用户列表,所以对user的role区域建立关联字段
        // user表中的role属性根据role表内容来的,通过role表的_id寻找
        // ?? 新知识: 写好类型ObjectId类型,第二个是关联的谁,关联role模型(RoleModel的命名)
        // 把id放进role(users),根据id找到role里面相对应的id
        "role": {type:Schema.Types.ObjectId,ref:"role"},
        "default": Boolean // 禁用功能
    }
    // user(lib的新json) ---> users
    const UserModel = mongoose.model("user",new Schema(UserType))

    module.exports = UserModel
  ``` 
  - ==user表的role属性链接role表,所以在Schema的设置中,设置数据类型是Schema.Types.ObjectId,这个是数据库自动生成的ObjectId,链接的模型是role,不是roles,看你给模型起名==
- 执行命令,创建完users表,我们输入默认数据,管理员的和教师的,这里展示管理员的
- 把roles表的ObjectId赋值给users表的role项,如下(配置user的role属性值)
  [![pA2ikLt.png](https://s21.ax1x.com/2024/11/15/pA2ikLt.png)](https://imgse.com/i/pA2ikLt)
- ==**重点**==: 最后user的管理员数据如下,_id是user表自动生成的,role后面的那串数字,是role表中管理员的_id,链接ref="role"后,就根据这个user表的role属性值,去role表中找对应_id(ObjectId),然后把数据全都赋给role即可,这样实现了动态链接,即user的role跟着role表走
  [![pA2iCzd.png](https://s21.ax1x.com/2024/11/15/pA2iCzd.png)](https://imgse.com/i/pA2iCzd)
- 输入完管理数据,测试一下,local:3000,页面返回的数据如下,观看role属性值已经同步为role表的内容了(==role表现在就是默认数据,没做更改==)
  [![pA2iEeP.png](https://s21.ax1x.com/2024/11/15/pA2iEeP.png)](https://imgse.com/i/pA2iEeP)

- 登录功能校验login
  - user表为用户数据库,user中提前内置好了管理和教师两个用户的基本账号,用户名分别为 admin/kerwin,密码均为123,校验用户登录就是检查Login.vue中输入的username和password是否和数据库user中的账户一致
- UserRouter.js(==新的处理函数login,路由路径命名语义化==)
  ```
        // user中负责登录功能 + /login
        UserRouter.post("/adminapi/users/login",UserController.login)
  ```
- UserController.js(==处理下返回数据,优化==)
  ```
    async login(req,res){
        var result = await UserService.login(req.body)
        if(result.length > 0){
            // 不要返回密码
            let {_id,username,role} = result[0]
            res.send({
                ActionType: "OK",
                data: {_id,username,role}// 返回匹配的数据
            })
        }else{
            res.send({
                ActionType: "fail" // 没有数据
            })
        }
    },
  ```
  - 只有查询到数据才会返回result,内容为查询到的user数据,否则result的值为空,所以result的长度可以判断user内部是否有数据
  - 优化输出,result[0]的内部是用户账号的所有数据,包括密码,所以我们再解构一下,不要显示出密码,ActionType代表是否成功
- ==下一步,登录后根据用户的身份user和role权限列表的勾选情况,动态生成SideBar的内容,一开始我们是写死的,现在动态化,信息来源就是user==
- Login.vue
  ```
        // 登录校验方法
        const submitForm = async (formEl) => {
            if (!formEl) return
            // validate立即校验一次,防止用户不点击用户框直接点登录,这样会真的把空用户名,空密码,发给后端
            // valid为true证明符合校验规则,提交; 如果valid为false,不提交,并提供出错区域,validate是ElementPlus的表单验证功能主要依赖于async-validator库
            await formEl.validate(async (valid, fields) => {
                if (valid) {
                    // 把用户的关联替换为真正的数据请求,发送校验请求
                    // loginForm是username和password
                    const res = await axios.post("/adminapi/users/login",loginForm)
                    console.log(res.data)
                    let {ActionType,data} = res.data
                    if(ActionType === 'OK'){
                        console.log("data: ", data)
                        changeUser(data) // 把用户信息存起来
                        console.log("登录成功")
                        router.push("/")
                    }else{
                        // Message组件,弹出错误信息,ElMessage需要引入
                        ElMessage.error('用户不存在')
                    }
                } else {
                    console.log('error submit!', fields)
                } 
            })
        }
  ```
  - 把用户登录输入的username和password作为请求数据发送axios,这两个数据被双向绑定到属性loginForm中
  - 接受请求数据,经过UserController.js的返回数据优化后,我们解构出ActionType和data
  - 只有ActionType为OK时,才认定为登陆成功,==回忆changeUser()函数就是当时我们输入死数据的函数,现在输入动态的user内部数据data(解构出来的),然后登录到默认路由'/'==
  - 登录失败,使用新组件ElMessage(需引入),简单调用提示失败了即可
  - data(==解构后的返回值打印示例==)
    [![pA2iVdf.png](https://s21.ax1x.com/2024/11/15/pA2iVdf.png)](https://imgse.com/i/pA2iVdf)
    > ==注意当年写死changUser传数据时也是这个结构(),要不然之前写好的页面对应会因为找不到相关的属性而导致出各种bug,这个很重要==
  - ==当年的结构如下(**两者结构相同**)==
    ```
        {
            "id": 1,
            "username": "admin",
            "password": "123",
            "role": {
                "roleName": "管理员",
                "roleType": 1,
                "rights": [
                    "/index",
                    "/user-manage",
                    "/user-manage/list",
                    "/right-manage",
                    "/right-manage/rolelist",
                    "/right-manage/rightlist",
                    "/tag-manage",
                    "/tag-manage/list",
                    "/interview-manage",
                    "/interview-manage/companylist",
                    "/interview-manage/companydata",
                    "/student-manage",
                    "/student-manage/studentlist",
                    "/student-manage/gradelist"
                ]
            }
        }
    ```
### 用户列表组件
- 列表组件的template样式设置,暂时不涉及按钮事件的触发,效果图如下
  [![pA2n06U.png](https://s21.ax1x.com/2024/11/15/pA2n06U.png)](https://imgse.com/i/pA2n06U)
- 代码:
  ```
    <template>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column label="角色名称" width="180">
                <template #default="scope">
                    <div>{{ scope.row.role.roleName }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名" width="180" />
            <el-table-column align="left" label="操作" width="280">
                <template #default="scope">
                    <!-- 更新函数传入这一行的数据scoped.row  -->
                    <!-- 添加禁用功能,:disabled动态绑定的用户的default属性,管理员的属性默认为false -->
                    <el-button round type="primary" @click="handleUpdate(scope.row)" :disabled="scope.row.default">
                        更新
                    </el-button>
                    <!-- 新组件: Popconfirm 气泡确认框,会弹出一个确认框,防止手误直接错误删除 -->
                    <el-popconfirm title="你确定要删除吗?" confirm-button-text="确定" cancel-button-text="取消"
                        @confirm="handleDelete(scope.row)">
                        <template #reference>
                            <el-button round type="danger" :disabled="scope.row.default">
                                删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
            <!-- 占位,没内容 -->
            <el-table-column />
        </el-table>
    </template>

    <script setup>
    import { ref, onMounted } from 'vue'
    import axios from 'axios'

    const tableData = ref([])
    onMounted(() => {
        getList()
    })
    const getList = async () => {
        var { data } = await axios.get("/adminapi/users")
        tableData.value = data
    }

    </script>
  ```
  -  复制了之前的代码,el-table组件的按钮直接拿过来,然后把数据来源改一改,请求的users的数据,用户内部使用插槽写好roleName的名字(自定义的el-table)

### 用户列表添加
- 书接上一回,本节课处理添加用户的功能,在el-table的上面添加一个el-button的按钮`<el-button type="primary" @click="dialogVisible = true">添加用户</el-button>`,==对应的弹出添加用户的对话框dialog==
[![pA2hXTK.png](https://s21.ax1x.com/2024/11/16/pA2hXTK.png)](https://imgse.com/i/pA2hXTK)
- ==对话框dialog构建==
- ==这一步两个目标: 1.运用组件建立基本的html结构 2.收集表单信息addForm,后期提交数据用==
  ```
    <el-dialog v-model="dialogVisible" title="添加用户" width="500">
        <!-- label-width: 控制输入框的对齐 -->
        <el-form :model="addForm" label-width="auto" status-icon>
            <!-- prop应该时是有用的,el-input的双向绑定addForm.username找username就按着prop找 -->
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password" type="password" />
            </el-form-item>
            <!-- 下拉列表组件select -->
            <el-form-item label="角色" prop="role">
                <el-select v-model="addForm.role" placeholder="请选择角色" style="width: 100%">
                    <!-- el-option的值从后端请求,role的类型,目前只有管理和教师,options是数据 -->
                    <!-- 首先要理解各属性的作用,v-for就是遍历数据,数据来自后端的表roles,:label是options的命名,:value双向绑定到el-select的 -->
                    <!-- :value把item._id传给addForm.role即可,将来addForm作为req.body向后端传递数据时,我们设置了链表查询(user表根据_Id找role表)只需要ObjectId,去userRouter的路由请求getList数据即可 -->
                    <el-option v-for="item in roleList" :key="item._id" :label="item.roleName" :value="item._id" />
                </el-select>
            </el-form-item>
        </el-form>
        <!-- 对话框的2个按钮 -->
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="handleAddConfirm()">
                    确认
                </el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </div>
        </template>
    </el-dialog>

  ```
- ==用户名和密码的表单部分==
  - 内部表单绑定的是addForm属性,js设置如下(用户名username和密码password)
    ```
          const addForm = reactive({
              username: "",
              password: "",
              role: ""
          })
    ```
  - 改名字,内部el-form-item的双向绑定和label的命名等
- ==角色选择部分==
  - 新组件el-select + el-option,==认识内部的属性值是关键==
  - el-option的值从后端请求,数据是roleList,数据来源是roles表,目前只有管理和教师
    ```
        const roleList = ref([]) // el-select/el-options的选项 
        const getRolesList = async () => {
            var { data } = await axios.get("/adminapi/roles")
            roleList.value = data
        }
    ```
  - roles表的效果图,访问后端的数据
    [![pA2WdXt.png](https://s21.ax1x.com/2024/11/16/pA2WdXt.png)](https://imgse.com/i/pA2WdXt)
   - 继续el-option的介绍: v-for就是遍历数据,数据来自后端的表roles,:label是options的命名,:value双向绑定到el-select的
   - ==:value把item._id传给addForm.role即可,**将来addForm作为req.body向后端传递数据时,我们设置了链表查询(user表根据_Id找role表)只需要ObjectId**,去userRouter的路由请求getList数据即可==
   - 至此我们的updateForm信息填装完毕,用户名和密码是常规,role内部是roles表的管理员和教师的唯一id(ObjectId的值)
- ==2.确定好提交表单信息后,开始向后端请求数据==
  ```
        // 添加用户的dialog弹出框
        // 添加角色'确认'按钮触发事件handleAddConfirm
        const handleAddConfirm = async ()=>{
            // 打印我们获取的el-from的所有信息,校验一下
            // 其中role就是装的_id(role表的管理和教师的ObjectId值,这是数据库系统给的,是自动生成的唯一id)
            // console.log(addForm)
            dialogVisible.value = false
            // 添加接口(添加用户数据进数据库),新用户的数据是addForm
            // 去后端把相关的userRouter一脉的处理函数写好
            await axios.post('/adminapi/users',addForm)
            // 获取列表,更新el-table,响应式改变页面
            await getList()

            // 列表清空,addForm是reactive类型,不是普通的Object类型,不能粗暴的直接赋空值(={}),按照语法来
            addForm.username = ""
            addForm.password = ""
            addForm.role = ""
        }
  ```
  - 1.隐藏dialog
  - 2.发axios post(==下一步去后端配置函数去==)
  - 3.响应式页面变化,即在请求一次el-table的数据 getList
  - 4.重置addForm内容,下次添加用户是保证输入框是空的
- ==axios的后端配置 express myappSever==
  - 1.UserRouter.js
    ```
        var express = require('express');
        var UserRouter = express.Router();
        var UserController = require("../controllers/UserController.js")

        // 获取数据的 get
        UserRouter.get("/adminapi/users",UserController.getList)
        // 校验登录的
        UserRouter.post("/adminapi/users/login",UserController.login)
        // 添加用户的,数据发送方式和getList不同,这是post请求
        UserRouter.post("/adminapi/users/",UserController.addList)
        ...
    ```
    > 第三个post路由请求的配置就是添加用户的,对应addList函数,不必担心path相同导致1和3混淆,这两个的请求方式不同,get != post
  - 2.UserController.js(==传参添加数据,参数req.body就是addForm==)
    ```
    const UserService = require("../service/UserService")

    module.exports ={
        async getList(req,res){
            .....
        },
        async login(req,res){
            .....
        },
        async addList(req,res){
            var result = await UserService.addList(req.body)
            res.send(result) // 把请求的数据传回给前端
        },
        .....
    }
    ```
  - 3.UserService.js
    ```
        const UserModel = require("../model/UserModel")

        module.exports = {
            // 下面均为mongodb数据库操作
                .....
            addList(data){
                // 添加数据
                return UserModel.create(data)
            },
            .....
        }
    ```
    - 直接创建数据即可(data数据包含username,password,role三项),我们最后创建出的数据效果如下
    [![pA2Wa6I.png](https://s21.ax1x.com/2024/11/16/pA2Wa6I.png)](https://imgse.com/i/pA2Wa6I)
    - ==这是user表,里面的role属性是与roles表链接的,而role的属性值正是role表的唯一id(ObjectId),user表会根据id去role表找对应的信息==
    - 如下图,管理的_id是...94,教师的_id是...95
    [![pA2WdXt.png](https://s21.ax1x.com/2024/11/16/pA2WdXt.png)](https://imgse.com/i/pA2WdXt)
- 最后就如数据库的信息所显示,我们成功的把数据添加到user表中了,而用户表也是我们登录校验信息的依据表,我们可以添加完用户后,登录测试一下,看看是否能登录上我们新加的用户,测试这些用户的类型是否符合显示的权限表  
### 用户列表更新
- 本节课处理el-table的更新和删除按钮,==同时要新增新的dialog弹出框,这个弹出框与添加用户的不是一个==
  ```
    <!-- 更新用户弹出的dialog对话框 -->
    <el-dialog v-model="dialogUpdateVisible" title="更新用户" width="500">
        <!-- label-width: 控制输入框的对齐 -->
        <el-form :model="updateForm" label-width="auto" status-icon>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="updateForm.username" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="updateForm.password" type="password" />
            </el-form-item>
            <!-- 下拉列表组件select -->
            <el-form-item label="角色" prop="role">
                <el-select v-model="updateForm.role" placeholder="请选择角色" style="width: 100%">
                    <el-option v-for="item in roleList" :key="item._id" :label="item.roleName" :value="item._id" />
                </el-select>
            </el-form-item>
        </el-form>
        <!-- 对话框的2个按钮 -->
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="handleUpdateConfirm()">
                    确认
                </el-button>
                <el-button @click="dialogUpdateVisible = false">取消</el-button>
            </div>
        </template>
    </el-dialog>
  ```
  - 内部的基本逻辑没变化,表单数据变为了updateForm,这个数据将来同样会作为req.body传向更新数据的函数,定义的内部结构也和addForm一样,如下:
    ```
        // el-form表单的数据,发给后端的信息
        const addForm = reactive({
            username: "",
            password: "",
            role: ""
        })
        // 额外记录表单信息,用于显示点击'更新'按钮显示对应dialog表单的内容
        const updateForm = reactive({
            username: "",
            password: "",
            role: ""
        })
    ```
  - ==对更新dialog的表单初始化,在点击更新按钮时,把本条数据的信息通过scope.item传递给更新表单数据updateForm==
    ```
        // 点击'更新'按钮,更新用户的信息
        // item是scope.row,是当前行信息的值
        const handleUpdate = (item)=>{
            // console.log(item)
            dialogUpdateVisible.value = true
            updateForm.username = item.username
            updateForm.password = item.password
            // 经过打印item的值,我们需要的role值根据对象的结构,应在item.role._id存储的(注意外面的那个_id是本条数据的唯一id,不是管理员/教师的专属role表_id)
            updateForm.role = item.role._id
            .......
        }
    ```
    > 看注释,其中表单的role值获取不要想当然
  - 在更新完dialog内部的数据后,在点击'确然'按钮执行handleUpdateConfirm函数,把数据发送给后端,请求更新数据,==但是我们需要知道我们更新的是那一条数据,**老问题了**,设置全局变量临时存储此条数据的scpoe.item的值,在点击'更新'按钮的handleUpdate时存储==
  ```
    const currentItem = ref({}) // 中间变量,老问题,handleUpdateConfirm更新按钮需要知道更新的是那一条数据的值,记录他的唯一id

    const handleUpdate = (item)=>{
        .....
        // 经过打印item的值,我们需要的role值根据对象的结构,应在item.role._id存储的(注意外面的那个_id是本条数据的唯一id,不是管理员/教师的专属role表_id)
        updateForm.role = item.role._id
        currentItem.value = item._id // 记录本条数据的唯一id,根据这条唯一id去user表中更新数据
    }
  ```
  - ==**重点**== : 我故意又留下了updateForm.role的获取,仔细想想这两个_id的获取分别是什么,item.role._id的id是role表管理员/教师的唯一id,是更新数据用的,后者item._id是存储的本条数据的唯一id,之前我们每向user表中添加一条数据,都会对应自动生成一个唯一id用于区分,所以我们使用全局变量,从handleUpdate那里获取了本条数据的id就是为了在user表中找到我们当前点击到的这条数据,进行更新,总结就是更具item._id在user表中找到数据,然后更新数据内容,item.role._id只是更新内容的role属性
  - 效果图:
    [![pA2hGzd.png](https://s21.ax1x.com/2024/11/16/pA2hGzd.png)](https://imgse.com/i/pA2hGzd)
    [![pA2h8RH.png](https://s21.ax1x.com/2024/11/16/pA2h8RH.png)](https://imgse.com/i/pA2h8RH)
    > 看上面的图,红色箭头指向的就是item._id,我们需要找到具体是更新的那条数据,而红圈中的role就是我们item.role._id,将来我们可能要更新里面的值
- ==2.整理好id和updateForm之后,发送axios请求,**这次我们把删除按钮的事件处理函数一起写了,两者都是动态路由申请的,删除函数和之前没变化**== 
- ==把id封装入path,动态路由请求==
  ```
    // 点击更新dialog对话框的确认按钮
    const handleUpdateConfirm = async ()=>{
        dialogUpdateVisible.value = false
        // console.log(currentItem.value,updateForm)
        // 向后端发送(put)更新user的数据请求,把id直接放在路径中(动态路由)
        await axios.put(`/adminapi/users/${currentItem.value}`,updateForm)

        await getList()
    }
    // 点击'删除'按钮执行handleUpdate
    const handleDelete = async ({_id})=>{ // 获取删除数据的_id(解构来自scope.row)
        await axios.delete(`adminapi/users/${_id}`) 
        // 之后再去后端完善动态路由的delete函数
        await getList()
    }
  ```
- 1.UserRouter.js
  ```
    // 动态路由,:id是占位符,无论占位符输入什么都可以访问到/adminapi/users/
    UserRouter.put("/adminapi/users/:id",UserController.updateList)
    UserRouter.delete("/adminapi/users/:id",UserController.deleteList)
  ```
- 2.UserController.js
  ```
    async updateList(req,res){
        var result = await UserService.updateList(req.params.id,req.body)
        res.send(result) // 把请求的数据传回给前端
    },
    async deleteList(req,res){
        var result = await UserService.deleteList(req.params.id)
        res.send(result) // 把请求的数据传回给前端
    }
  ```
- 3.UserService.js
  ```
    updateList(id,data){
        // 直接覆盖更新,自动覆盖user表内的同字段的username,password和role的内容
        return UserModel.findByIdAndUpdate(id,data)
    },

    deleteList(id){
        return UserModel.findByIdAndDelete(id)
    }
  ```
- ==至此更新和删除功能的函数完成,难点不在于后端,函数基本没变化的,重点是前端整理好更新的数据updateForm和对应的id,帮助数据库找到对应的数据去覆盖更新数据==
### 标签技术组件
- ==这节课的代码几乎是用户列表代码的复制品,因为几乎功能是一样的,特别是后端==
- 我们实现的效果图如下:
  [![pA2OdPI.png](https://s21.ax1x.com/2024/11/16/pA2OdPI.png)](https://imgse.com/i/pA2OdPI)
- 1.==先写后端的代码,几乎一样的==
- 1.TagRouter.js(==改名+删除login功能+记得app注册(略)==)
  ```
    var express = require('express');
    var TagRouter = express.Router();
    var TagController = require("../controllers/TagController.js")

    // 获取数据的 get
    TagRouter.get("/adminapi/tags",TagController.getList)

    // 添加用户的,数据发送方式和getList不同,这是post请求
    TagRouter.post("/adminapi/tags",TagController.addList)
    // 动态路由,:id是占位符,无论占位符输入什么都可以访问到/adminapi/users/
    TagRouter.put("/adminapi/tags/:id",TagController.updateList)
    TagRouter.delete("/adminapi/tags/:id",TagController.deleteList)

    module.exports = TagRouter // 记得app.js中注册
  ```
- 2.TagController.js(==删除login功能==)
  ```
    const TagService = require("../service/TagService")

    module.exports ={
        // 2个系统参数,接受前端的请求req合返回给前端的数据res,再向sevice发起一波请求,这是异步
        async getList(req,res){
            var result = await TagService.getList()
            res.send(result) // 把请求的数据传回给前端
        },
        async addList(req,res){
            var result = await TagService.addList(req.body)
            res.send(result) // 把请求的数据传回给前端
        },
        async updateList(req,res){
            var result = await TagService.updateList(req.params.id,req.body)
            res.send(result) // 把请求的数据传回给前端
        },
        async deleteList(req,res){
            var result = await TagService.deleteList(req.params.id)
            res.send(result) // 把请求的数据传回给前端
        }
    }
  ```
- 3.TagService.js(==删除login功能+获取数据时添加排序功能==)
  ```
        const TagModel = require("../model/TagModel")

        module.exports = {
            // 下面均为mongodb数据库操作

            getList() {
                // 额外排序工作: 后端返回数据时,按照grade数据进行正序排序,1为正序,-1为倒序
                // 这一步是为了,添加完数据后,更新页面时能够按照顺序来,这个工作不交给前端做了
                return TagModel.find().sort({grade:1})
            },

            addList(data){
                return TagModel.create(data)
            },

            updateList(id,data){
                return TagModel.findByIdAndUpdate(id,data)
            },

            deleteList(id){
                return TagModel.findByIdAndDelete(id)
            }

        }
  ```
- 4.TagModel.js(==改变了Schema的限制规则,根据新的数据lib/tags.json==)
  ```
    const mongoose = require("mongoose")
    const Schema = mongoose.Schema

    const TagType = {
        "title": String,
        "grade": Number
    }
    // tag(lib的新json) ---> tags
    const TagModel = mongoose.model("tag",new Schema(TagType))

    module.exports = TagModel
  ```
- 经过上面的操作,直接创建出tags表,然后把tags.json的信息输入进去,如下
    [![pA2qpLQ.png](https://s21.ax1x.com/2024/11/16/pA2qpLQ.png)](https://imgse.com/i/pA2qpLQ)
- ==TagList.vue 页面渲染==
- el-table阶段:
  ```
    <!-- 点击'添加标签'按钮弹出对话框 -->
    <el-button type="primary" @click="dialogVisible = true">添加标签</el-button>

    <!-- table表单 -->
    <el-table :data="tableData" style="width: 100%">
        <!-- el-table组件的一个属性,添加排序功能,在列中设置 sortable 属性即可实现以该列为基准的排序,接受一个Boolean,默认为false -->
        <!-- 可以使用 sort-method 或者 sort-by 使用自定义的排序规则 -->
        <el-table-column label="阶段" width="180" :sortable="true" :sort-method="sort">
            <template #default="scope">
                <!-- 下面有数组names指示显示什么字段,同理types显示不同类型的tag标签组件 -->
                <!-- 新组件tag,显示的更好看一些 -->
                <el-tag :type="types[scope.row.grade - 1]">{{ names[scope.row.grade - 1] }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="title" label="标签名" width="180" />
        <el-table-column align="left" label="操作" width="280">
            <template #default="scope">
                <el-button round type="primary" @click="handleUpdate(scope.row)">
                    更新
                </el-button>
                <!-- 新组件: Popconfirm 气泡确认框,会弹出一个确认框,防止手误直接错误删除 -->
                <el-popconfirm title="你确定要删除吗?" confirm-button-text="确定" cancel-button-text="取消"
                    @confirm="handleDelete(scope.row)">
                    <template #reference>
                        <el-button round type="danger" :disabled="scope.row.default">
                            删除
                        </el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
        <!-- 占位,没内容 -->
        <el-table-column />
    </el-table>
  ```
- 1.改变了tableData的数据来源,新增tags表,所以请求数据的getList请求axios改变了请求路径
  ```
    onMounted(() => {
        getList()
    })
    const getList = async () => {
        var { data } = await axios.get("/adminapi/tags")
        tableData.value = data
    }
  ```
- 2.新增了tags标签,==这里巧妙地使用了数组的方式,把grade的数字变为了自定义内容,tags的属性也利用动态绑定实现同理效果,就是数组的key->value的利用==
  ```
    const names = ["第一阶段", "第二阶段", "第三阶段"]
    const types = ["success", "warning", "danger"]
  ```
- 3.相关的改名tabel不再演示
- 4.在阶段列的排序的功能,文档上新属性
  - el-table组件的一个属性,添加排序功能,在列中设置 sortable 属性即可实现以该列为基准的排序,接受一个Boolean,默认为false
  - 可以使用 sort-method 或者 sort-by 使用自定义的排序规则
  ```
        // 阶段排序,默认接受两个参数(上面不用传参,他自动接受),它会把相邻项传入,只要有数字类型的就行
        // 这个方法使用和js内置的数组sort排序方法使用方式一样,这样写是升序,反过来是降序
        const sort = (rowa,rowb)=>{
            return rowa.grade - rowb.grade
        }
  ```
  - 就如同下面js中的sort用法示例:
    [![pA2OUIA.png](https://s21.ax1x.com/2024/11/16/pA2OUIA.png)](https://imgse.com/i/pA2OUIA)
### 标签技术添加
- 对最左上角的按钮进行事件处理,弹出添加"标签"的dialog
  ```
    <!-- 添加标签弹出的dialog对话框 -->
    <el-dialog v-model="dialogVisible" title="添加标签" width="500">
        <!-- label-width: 控制输入框的对齐 -->
        <el-form :model="addForm" label-width="auto" status-icon>
            <!-- prop真的在这里咩用,他就是对列的归纳用的属性 -->
            <el-form-item label="标签名" prop="title">
                <el-input v-model="addForm.title" />
            </el-form-item>
            <!-- 下拉列表组件select -->
            <el-form-item label="阶段" prop="grade">
                <el-select v-model="addForm.grade" placeholder="请选择阶段" style="width: 100%">
                    <!-- 这里使用index索引正好,第一key的值为index,因为这里不涉及数据的删除等,所以使用index无伤大雅,第二:value的值会传给addForm.grade,index+1正好数字'1 2 3'对应第一,二,三阶段 -->
                    <el-option v-for="(item,index) in names" :key="index" :label="item" :value="index+1" />
                </el-select>
            </el-form-item>
        </el-form>
        <!-- 对话框的2个按钮 -->
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="handleAddConfirm()">
                    确认
                </el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </div>
        </template>
    </el-dialog>
  ```
  - 1.addForm初始化改变
    ```
        const addForm = reactive({
            title: "",
            grade:""
        })
    ```
  - 2.更新列表初始化: 直接利用names,v-for数组names,select内部的options的值label直接就是item,然后由于数据不涉及更新操作,所以key设置为index无所谓,第二, :value的值会传给addForm.grade,index+1正好数字'1 2 3'对应第一,二,三阶段,还是Number类型的数据
  - 3.添加标签函数改变axios的请求地址即可复现,最后数据清空也对应改好
    ```
        // 添加标签'确认'按钮触发事件handleAddConfirm
        const handleAddConfirm = async () => {
            dialogVisible.value = false
            // console.log(addForm)
            await axios.post('/adminapi/tags', addForm)
            await getList()

            addForm.title = ""
            addForm.grade = ""
        }
    ```
### 标签技术更新
- 本节课为标签的更新和删除按钮事件处理
- 1.==点击更新弹出dialog框==
  - 更新的dialog和添加的dialog一样的,只是表单数据一个是addForm,一个是updateForm,后者和前者的初始化操作一样的
  - 由于几乎一样的el-dialog代码所以不放出来了
- 2.==更新handleUpdate ---> 确认handleUpdateConfirm==
- ==熟悉的感觉,又要有中间变量记录点击的哪条数据量==
  ```
        // 点击'更新'按钮,更新标签的信息
        // item是scope.row,是当前行信息的值
        const handleUpdate = (item) => {
            // console.log(item) // 通过打印发现每一条数据都有自己的_id !!!
            dialogUpdateVisible.value = true
            updateForm.title = item.title
            updateForm.grade = item.grade
            currentItem.value = item // 记录点击的是哪一条的数据
        }

        // 点击更新dialog对话框的确认按钮
        const handleUpdateConfirm = async () => {
            dialogUpdateVisible.value = false
            // console.log(currentItem.value,updateForm)
            // 向后端发送(put)更新user的数据请求,把id直接放在路径中(动态路由)
            // 是有_id这个属性值的,看handleUpdate函数内部对item的打印
            await axios.put(`/adminapi/tags/${currentItem.value._id}`, updateForm)

            await getList()
        }
  ```
  > ==操作一样的,唯一注意,scpoe.row传递的值会自动生成_id供你区分,所以在handleUpdateConfirm中我们把_id作为唯一id去寻找数据,并用updateForm去覆盖更新==
- 删除事件处理函数(==最轻松的,改一下路径即可==)
  ```
        // 点击'删除'按钮执行handleUpdate
        const handleDelete = async ({ _id }) => { // 获取删除数据的_id(解构来自scope.row)
            await axios.delete(`adminapi/tags/${_id}`)
            // 之后再去后端完善动态路由的delete函数
            await getList()
        }
  ```
  > 直接从scope.row中解构出_id即可,其余不变
### 班级列表组件
- 班级列表效果图: (一个table列表+一个dialog弹出窗)
- ==注意: 此时table列表还没有内容,还没写后端,这是最终示意图==
  [![pARQq7F.png](https://s21.ax1x.com/2024/11/17/pARQq7F.png)](https://imgse.com/i/pARQq7F)
  [![pARQOk4.png](https://s21.ax1x.com/2024/11/17/pARQOk4.png)](https://imgse.com/i/pARQOk4)
- 1.==添加文件按钮+dialog弹出框(新组件)==
  ```
    <!-- 点击'添加班级'按钮弹出对话框 -->
    <el-button type="primary" @click="dialogVisible = true">添加班级</el-button>

    <!-- 添加班级弹出的dialog对话框 -->
    <el-dialog v-model="dialogVisible" title="添加班级" width="500">
        <el-form :model="addForm" label-width="auto" status-icon>
            <el-form-item label="班级名称">
                <el-input v-model="addForm.title" />
            </el-form-item>
            <el-form-item label="导入名单">
                <!-- 上传文件组件upload -->
                <!-- on-change: 文件状态改变时的钩子,添加文件、上传成功和上传失败时都会被调用 -->
                <!-- 双向绑定的fileList是上传文件的列表,想要的效果是当文件存储到本地浏览器后,自动消失 -->
                <el-upload :auto-upload="false" :on-change="handleChange" style="width: 100%"
                    v-model:file-list="addForm.fileList">
                    <el-button class="ml-3" type="primary">
                        选择文件
                    </el-button>
                </el-upload>
            </el-form-item>
        </el-form>
        <!-- 对话框的2个按钮 -->
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="handleAddConfirm()">
                    确认
                </el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </div>
        </template>
    </el-dialog>
  ```
  - ==新组件: 添加文件upload==
    - on-change: 文件状态改变时的钩子,添加文件、上传成功和上传失败时都会被调用
    - 双向绑定的fileList是上传文件的列表,想要的效果是当文件存储到本地浏览器后,自动消失 
  - ==on-change的处理函数,**重点: 处理excel文件-->json文件**==
    ```
    const handleChange = (ev) => { // evt是自动获取的参数
        console.log(ev) // 监视上传文件的信息,其中raw属性是文件信息的关键
        addForm.title = ev.name.split(".")[0] // 把文件名字记录下来
        // 安装excel表格解析插件xlsx,传入excle的文件信息ev.raw
        ImportExcel(ev.raw, (data) => {
            console.log(data) // 获取解析文件的信息,数组类型
            addForm.list = data // 保存数据
        })
    }
    ```
    - 1.==on-change的会自动接收参数ev,这是上传文件excel的信息,其中raw信息是文件内容信息,name就是文件名==
    - 2.==**这里下载了新模块`npm i xlsx`(npmjs可查),这个模块的作用是把excel表格的内容转化为JSON数据,官方文档有说明,用豆包翻译学习,这里kerwin直接提供了写好的模块ImportExcel,在utils中,具体注释也有,后续再学习时,结合文档,了解函数的意思,并会使用xlsx去自己写一个工具模块**,最后这个模块的用法就是把数据的raw传进去,第二个参数可以获取解析好的数据==
    - ==下面演示excel表格数据转化为JSON数据的图==
    - excle表格信息
    [![pARQIlq.png](https://s21.ax1x.com/2024/11/17/pARQIlq.png)](https://imgse.com/i/pARQIlq)
    - ev.raw
    [![pARQ5pn.png](https://s21.ax1x.com/2024/11/17/pARQ5pn.png)](https://imgse.com/i/pARQ5pn)
    - data(解析好的数据)
    [![pAR1YIe.png](https://s21.ax1x.com/2024/11/17/pAR1YIe.png)](https://imgse.com/i/pAR1YIe)
- ==到此基本架构完成一半,接下来下节课内容,先构建后端,我们需要两个后端接口,一个负责学生students表,一个负责班级classes表,两表间有联系,我们先通过上传excel文件,转为JSON,然后post到classes表中去,然后el-table向classes表请求数据,这时候再构建表格信息,最后完善students表的后端,这里涉及与classes表的连接,和user表与roles表的连接差不多,之后students表会在学生管理/学生列表中再去做,现在不用==
### 班级列表接口
- 1.构建班级列表的后端代码(都不涉及更新了,所以删除掉更新的内容,==基本复用了tag系列的代码==)
- 1.ClassRouter.js(==app注册,略,其余没区别==)
  ```
    var express = require('express');
    var ClassRouter = express.Router();
    var ClassController = require("../controllers/ClassController.js")

    // 获取数据的 get
    ClassRouter.get("/adminapi/classes",ClassController.getList)
    // 添加用户的,数据发送方式和getList不同,这是post请求
    ClassRouter.post("/adminapi/classes",ClassController.addList)
    // 动态路由,:id是占位符,无论占位符输入什么都可以访问到/adminapi/users/
    ClassRouter.delete("/adminapi/classes/:id",ClassController.deleteList)

    module.exports = ClassRouter // 记得app.js中注册
  ```
- 2.ClassService.js (==没啥区别==)
  ```
    const ClassService = require("../service/ClassService")

    module.exports ={
        // 2个系统参数,接受前端的请求req合返回给前端的数据res,再向sevice发起一波请求,这是异步
        async getList(req,res){
            var result = await ClassService.getList()
            res.send(result) // 把请求的数据传回给前端
        },
        async addList(req,res){
            var result = await ClassService.addList(req.body)
            res.send(result) // 把请求的数据传回给前端
        },
        async deleteList(req,res){
            var result = await ClassService.deleteList(req.params.id)
            res.send(result) // 把请求的数据传回给前端
        }
    }
  ```
- 3.ClassModel.js (==没啥区别==) 
  ```
    const ClassModel = require("../model/ClassModel")

    module.exports = {
        // 下面均为mongodb数据库操作

        getList() {
            return ClassModel.find()
        },

        addList(data){
            return ClassModel.create(data)
        },

        deleteList(id){
            return ClassModel.findByIdAndDelete(id)
        }
    }
  ```
- 4.ClassModel.js (==表格Schema改了一下,其余没变==)
  ```
        const mongoose = require("mongoose")
        const Schema = mongoose.Schema

        const ClassType = {
            "title": String, // 班级名字
            "number": Number // 班级人数
        }
        // class ---> classes
        const ClassModel = mongoose.model("class",new Schema(ClassType))

        module.exports = ClassModel
  ```
- 5.==点击dialog确定按钮,上传文件==
  ```
    const addForm = reactive({
        title: "",
        list: [],
        fileList: []
    })

    // 把数据传递给后端
    const handleAddConfirm = async () => {
        dialogVisible.value = false
        // 两张表,学生表和班级表,学生的表'链接'班级表(用过,roles表与users表的链接),删除班级学生自动删除

        // 1.班级名字 + 人数 --> classes
        // 班级表 2001 2002 2003.excel
        // 发送数据给后端的数据库,提供数据给新集合(新表)classes
        let classObj = await axios.post("/adminapi/classes", {
            title: addForm.title,
            number: addForm.list.length // 传的是人数,所以把学生excel数组的长度数据传进去即可
        })
        // console.log(classObj) // classObj.data._id 提前记录学生班级的信息,从中获取ObjectId的信息

        ///// 学生的代码暂时略 ...

        // 清空列表显示,输入框的title和list数组数据
        addForm.fileList = []
        addForm.list = []
        addForm.title = ""
        // 重新渲染
        getList()
    }
  ```
  - 1.addForm是我们要发送的信息(req.body),classes后端只接受2个信息,一个是班级名字title(String),一个是班级人数number(Number)
  - 2.看看监视函数(==上传文件就会执行的handleChange函数==),内部已经对addForm的title和list赋值了,title直接就是excle的名字(删除了后缀.xlsx),list就是excle文件经过解析后的JSON,这些JSON就是每一个学生包装进一个对象,最后全部放入list数组,学生人数即数组长度
  - 3.把请求addForm发送后,接受返回数据时,记录下返回的示例对象,我们连接students表要用它的ObjectId(==可以打印下测试,这个返回数据中有数据库自动添加的唯一id值(ObjectId)==)
- ==6.根据返回的数据,构建班级列表==
  - 获取数据给tableData
    ```
        onMounted(() => {
            getList()
        })
        const getList = async () => {
            var { data } = await axios.get("/adminapi/classes")
            tableData.value = data
            // console.log("tableData",tableData.value)
        }
    ```
  - 根据tableData构建table列表
    ```
    <!-- 添加班级成功后,显示班级数据的table -->
    <!-- table表单 -->
    <el-table :data="tableData" style="width: 100%">
        <el-table-column label="班级" width="180" prop="title" />
        <el-table-column label="人数" width="180" prop="number" />
        <el-table-column align="left" label="操作" width="280">
            <template #default="scope">
                <el-popconfirm title="你确定要删除吗?" confirm-button-text="确定" cancel-button-text="取消"
                    @confirm="handleDelete(scope.row)">
                    <template #reference>
                        <el-button round type="danger" :disabled="scope.row.default">
                            删除
                        </el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
        <!-- 占位,没内容 -->
        <el-table-column />
    </el-table>
    ```
- 构建的效果(==先添加excel文件,对应的页面更新==)
  [![pARQq7F.png](https://s21.ax1x.com/2024/11/17/pARQq7F.png)](https://imgse.com/i/pARQq7F)
- ==**第二大章节,创建students表**==
- 1.StudentRouter.js(==略,和classes一摸一样,改了改名字==)
- 2.StudentController.js(==同上==)
- 3.StudentService.js(==变化: 处理请求数据==)
  ```
    const StudentModel = require("../model/StudentModel")

    module.exports = {
        // 下面均为mongodb数据库操作
        getList() {
            return StudentModel.find()
        },

        addList(data){
            // create可以接受对象,一次存一条; 也可以接受数组,一次存一组
            // 但是要切合Schema的解构要求,即数组的每一项item为定义的Schema格式
            const list = data.list.map(item=>({
                studentname: item.studentname,
                class: data.class,
                score: {}
            }))
            console.log(list) // 打印映射结构
            return StudentModel.create(list)
        },

        deleteList(id){
            return StudentModel.findByIdAndDelete(id)
        }

    }
  ```
- 4.StudentModel.js(==连接classes表==)
  ```
    const mongoose = require("mongoose")
    const Schema = mongoose.Schema
    // 与classes表进行连表
    const StudentType = {
        "studentname" : String, // excel表格里名字栏就是这么写的,这样命名方便后端数据的处理(特指有中文也要用key-value映射给变成英文)
        "class" : {type:Schema.Types.ObjectId,ref:"class"}, // 学生的班级,链接class的ObjectId
        "score": Object // 学生的成绩是对象格式,tag标签那里的所有标签就是科目,到时候会有对应的成绩
    }
    // student ---> students
    // {minimize:false} 关掉压缩对象的属性,这样空对象score就能存入数据库了
    const StudentModel = mongoose.model("student",new Schema(StudentType,{minimize:false}))

    module.exports = StudentModel
  ```
  - 注意: {minimize:false} 关掉压缩对象的属性,这样空对象score就能存入数据库了,这个score后期在学生列表也要用,现在先存空的
  - ==同理连接classes表的ObjectId,这样我们知道这些学生在那个班级里==
- GradeList.vue(==向学生表发送请求==)
  ```
    const handleAddConfirm = async () => {
        dialogVisible.value = false
        // 两张表,学生表和班级表,学生的表'链接'班级表(用过,roles表与users表的链接),删除班级学生自动删除

        // 1.班级名字 + 人数 --> classes
        // 班级表 2001 2002 2003.excel
        // 发送数据给后端的数据库,提供数据给新集合(新表)classes
        let classObj = await axios.post("/adminapi/classes", {
            title: addForm.title,
            number: addForm.list.length // 传的是人数,所以把学生excel数组的长度数据传进去即可
        })
        // console.log(classObj) // classObj.data._id 提前记录学生班级的信息,从中获取ObjectId的信息

        // 学生名字 --> students
        await axios.post("adminapi/students",{
            list: addForm.list,
            class: classObj.data._id,
        })

        // 清空列表显示,输入框的title和list数组数据
        addForm.fileList = []
        addForm.list = []
        addForm.title = ""
        // 重新渲染
        getList()
    }
  ```
  - 先向classes表发送请求,在向students表发送请求,因为学生表连接教室表的唯一id,传递的数据直接把学生的数组传递进去+id
  - ==新知识,之前我们添加数据是一条一条加,现在是一次加多个学生,mongodb支持多次加数据,放在数组中即可,数组的每一项item,都满足模型的Schema即可==
  - 所以我们在StudentController.js打印过请求数据,如下:
    [![pARQhfs.png](https://s21.ax1x.com/2024/11/17/pARQhfs.png)](https://imgse.com/i/pARQhfs)
  - 在StudentService.js创建新数据时,对数据进行map处理,对每一项进行规范,最会效果图如下: ==2001班classes表和students表中所有的2001班学生==
    [![pARQfYj.png](https://s21.ax1x.com/2024/11/17/pARQfYj.png)](https://imgse.com/i/pARQfYj)
  - 最后可以一次添加多个学生的数据,而且学生数据的classes的ObjectId也和classes表连接,如下
    [![pARQ2Tg.png](https://s21.ax1x.com/2024/11/17/pARQ2Tg.png)](https://imgse.com/i/pARQ2Tg)
    [![pARQWkQ.png](https://s21.ax1x.com/2024/11/17/pARQWkQ.png)](https://imgse.com/i/pARQWkQ)
- ==至此完成所有的操作,难点在于处理添加文件把excel表转为JSON,其次是两个表的连接,students处理数据后再一次添加多条数据==
### 班级列表删除
- 上一节课留的尾巴,==在查找学生表的信息时连接classes表,和之前的roles连接class表一样,代码如下==
  ```
        getList() {
        // 连表查询classes表,不过写的是模型名class
        return StudentModel.find().populate("class")
        }
  ```
  - 效果图: [![pARHOyD.png](https://s21.ax1x.com/2024/11/18/pARHOyD.png)](https://imgse.com/i/pARHOyD)
- 这里还有方法2,kerwin在nodejs中讲过,但是很麻烦不用,可以看看
  ```
        return StudentModel.aggregate([
            {
                "$lookup" : {
                    "from": "classes", // 2.关联classes表
                    "localField": "class", // 1.当前表中,找到class属性
                    "foreignField": "_id", // 3.根据_id去关联每一项
                    "as" : "kerwinMatch" // 4.随意起名字
                }
                // 总结: 学生表的class属性的值是关联classes表的,依据classes表的_id去关联每一项数据,最后放入kerwinMatch中
            }
        ])
  ```
  - 效果图:[![pARHXOe.png](https://s21.ax1x.com/2024/11/18/pARHXOe.png)](https://imgse.com/i/pARHXOe)
- ==防止重复添加数据,针对classes和students表==
- ClassService.js
  ```
    addList(data){
        // return ClassModel.create(data)
        // 后端解决方式: (针对重复updateOne更新不返回数据信息的问题)
        return ClassModel.findOneAndUpdate({
            title:data.title, // 根据查询名字
        },{
            $set:data // 查到,更新
        },{
            upsert:true, // 查不到,插入
            returnDocument:"after" // 无论查到与否,都会返回数据库中这个对象的所有信息,用于获取此班级的ObjectId的信息
        }) 
    },
  ```
  - ==思路:== 处理重复文件的逻辑: 更新操作,无论有没有,直接更新,有的话即使重复名字也只是覆盖,没有的话就创建
  - ==**findOneAndUpdate和updateOne2个方法**==
    - ==updateOne的方法有个坑: 通过打印前端获取的class数据,发现这个方法的一个机制,即如果有数据就正常创建数据,并把数据的ObjectId返回出来,**如果发现数据已经存在了,只会返回一个查找结果为true的通知,而相关的信息特别是class的ObjectId不会返回给前端,造成如果重复添加一个班级,除第一次,后面覆盖的学生数据将没有class的ObjectId的值**==
    - ==解决这个方法可以从前端入手==,思路是: 在前端的学生数据请求axios加一个if判断
      - 如果if没有匹配到,即第一次添加这个班级,data中会有一个属性upsertId,里面是class的ObjectId; 
      - 如果在添加class时,匹配成功了,返回值中虽然没有相关数据了,但是会有通知你成功了的属性,比如data中的matchCount = 1,即if一旦检测到匹配成功了,本次学生数据不再更新(否则会把class的ObjectId丢失)
    - ==findOneAndUpdate(后端解决,更简单)==
      - 如上面的代码,多加一个属性`returnDocument:"after"`,无论查到与否,都会返回数据库中这个对象的所有信息,用于获取此班级的ObjectId的信息,不必担心出现获取不到数据的问题
- ==删除班级的操作(先删除班级表,再删除学生表)==
    ```
    const handleDelete = async(item)=>{
        await axios.delete(`/adminapi/classes/${item._id}`)
        await axios.delete(`/adminapi/students/${item._id}`) // 这里的删除函数需要处理成单个学生的删除,在StudentService.js中
        getList()
    }
    ```
### 学生列表组件
- 效果图:[![pARbNkR.png](https://s21.ax1x.com/2024/11/18/pARbNkR.png)](https://imgse.com/i/pARbNkR)
- ==本节课先构建列表的所有基本显示,5列,然后把第一列和第二列的功能实现,第一列是搜索功能,第二列是筛选功能,3和4列学会新组件即可==
- 第一列的
    ```
        <template>
        <!-- table表单 -->
        <!-- data选择computedTableData为了获取筛选好的学生姓名构建新的列表 -->
        <el-table :data="computedTableData" style="width: 100%">
            <el-table-column label="学生名字" width="150">
                <!-- table自定义表头 -->
                <template #header>
                    <!-- 双向绑定的数据记录你输入的值 -->
                    <el-input v-model="search" size="small" placeholder="请输入学生的名字" />
                </template>
                <template #default="scope">
                    {{ scope.row.studentname }}
                </template>
            </el-table-column>
            .......
        </template>

        js:
        // 基本列表的架构
        const tableData = ref([])
        
        onMounted(() => {
            getList()
            ...
        })
        // 请求学生数据
        const getList = async () => {
            var { data } = await axios.get("/adminapi/students")
            tableData.value = data
        }

        // 计算属性计算table数据,然后把过滤的属性放在table表中,箭头函数后面就一句话,默认返回
        const computedTableData = computed(() => tableData.value.filter(
            // 筛选条件: 因为全是中文所以不在乎大小写匹配,计算属性返回过滤好的新数据
            data => data.studentname.includes(search.value)
        ))
    ```
    - ==第一列:自定义表头default #header==,然后我们要输入框搜索内容,内部配el-input,双向绑定的数据v-model为search,==然后我们使用计算属性进行筛选数据==,先获取原始的全部数据tableData,然后在计算属性的里使用includes根据studentname筛选对应的数据,组成新的数据返回给el-table
- 第二列: (==跟着第一列的代码省略号==) 
  ```
    <!-- table表格的筛选功能,:filter是数据匹配,:filter-method是点击确定后筛选处理事件函数,filter-placement是下拉列表的位置(无所谓) -->
    <el-table-column label="班级" width="120" :filters="computedClass" :filter-method="filterClass"
        filter-placement="bottom-end">
        <template #default="scope">
            {{ scope.row.class.title }}
        </template>
    </el-table-column>
  ```
  - ==重点在于筛选的功能(el-table添加许多属性)==:效果图如下
    [![pARbTBQ.png](https://s21.ax1x.com/2024/11/18/pARbTBQ.png)](https://imgse.com/i/pARbTBQ)
  - ==filter是数据匹配==
    - 官网的数据示例:
    ```
    官网的用法:
    筛选的列表: text是筛选下拉的名字 value是帮你找到所筛选数据的id,我们会根据value去后端找对应的数据
    :filters="[
        { text: 'Home', value: 'Home' },
        { text: 'Office', value: 'Office' },
    ]"
    ```
    - 代码:(==我们请求classes表的数据(略),然后进行映射==)
    ```
    // 对classes表做映射,title->text _id->value,然后放入动态绑定的属性:filters里面
    const computedClass = computed(() => {
        // 映射操作,把原来的相关数据放入新的对象结构,映射为一个符合要求的新对象 text: title + value: _id 
        return classData.value.map(item=>({
            text: item.title,
            value: item._id
        }))
    })
    ```

    - ==所以我们使用map映射把原本的数据映射为官网要求的对象结构如下==
    [![pARq9HJ.png](https://s21.ax1x.com/2024/11/18/pARq9HJ.png)](https://imgse.com/i/pARq9HJ)
    - ==按照官网的操作最后对点击confirm的事件处理函数:filter-method="filterClass"==
    ```
        // 默认第一个参数是我们勾选的选项所对应的value; 第二个参数是我们根据value找到的数据
        // 比如点击的2001班,在filters中 title: 2001 value: 2001的ObjectId
        // 第一个参数value: 2001的ObjectId; 第二个参数item: 2001班的6个学生数据(proxy对象),会自动把每一个遍历出来,一个个对应
        const filterClass = (value,item)=>{
            // console.log(value,item)
            return value === item.class._id
            // 返回true会显示,false不显示
        }
    ```
    - value和title的打印效果图如下:
    [![pARqpB4.png](https://s21.ax1x.com/2024/11/18/pARqpB4.png)](https://imgse.com/i/pARqpB4)
    - 第三列: 新的组件----评分
    ```
         <el-table-column label="综合评分" width="195">
            <template #default="scope">
                <!-- rate组件 -- 评分,评分先固定写,使用属性model-value固定为3,colors是引入的数组 -->
                <!-- 这里评分是在"操作"栏中,经过所有评分后,平均算的,所以这个评分是禁用的,传入只读属性disabled,允许半星allow-half -->
                <el-rate :model-value="3" :colors="colors" disabled allow-half />
            </template>
        </el-table-column>
    ```
    - ==看注释即可,rate组件,直接用,现在写死3星==
    - 第四列: 新组件----进度条
    ```
         <el-table-column label="评分进度" width="195">
            <template #default="scope">
                <!-- 进度条组件progress,用第一个最简单的,percentage是进度条进度,后期计算,现在写死 -->
                <el-progress :percentage="50" />
            </template>
        </el-table-column>
    ```
    - ==看注释即可,progress组件,直接用,现在写死50%==
    - 第五列: el-button组件,普通按钮,不设置点击事件
    ```
        <el-table-column align="left" label="操作" width="180">
                <template #default="scope">
                    <el-button round type="primary">评分</el-button>
                </template>
        </el-table-column>
    ```
### 战力评分组件
- 1.==插播:== 每一行调整高度,默认是自适应的高度,el-table是有height高度的,不过那是加在根组件el-table的,对整体的列表限制高度,对于el-table-column无效
  - 解决: 因为列的高度是内容撑开的,所以把任意一列的内容高度设置好,整体高度就都又变化了,我们设置插槽内容高度,==最后一列的'操作'列的代码,可以去看看代码,设置了一些高度,布局的格式等==
- 2.==完成'评分操作':给按钮设置事件,点击后打开'抽屉',**新组件:Drawer 抽屉组件(侧边栏)**==
    [![pAWn7N9.png](https://s21.ax1x.com/2024/11/19/pAWn7N9.png)](https://imgse.com/i/pAWn7N9)
- 代码样例:
  ```
    <!-- 点击评分,拉出'抽屉'侧边栏,Drawer 抽屉组件 -->
        <el-table-column align="left" label="操作">
            <template #default="scope">
                <!-- 调整下高度,显示出红色标点,调整某一个的行高,这一行的行高都会跟着变化 -->
                <div style="display: flex; align-items: center; height: 55px;">
                    <el-button round type="primary" @click="handleRate(scope.row)">评分</el-button>
                </div>
            </template>
        </el-table-column>
  ```
  - 1.新组件drawer在列的插槽内
  - 2.div设置了一些样式,==这就是上面插播的内容代码,改变了单列的高度,进而影响全部==
  - 3.==和弹窗一样,按钮控制着一个属性,双向绑定到抽屉组件,布尔值,true的话抽屉就拉出来,false就回去==
- 抽屉组件的代码:
  ```
    <!-- 抽屉组件,direction抽屉从右向左出rtl,文档固定的; v-model绑定的是boolean属性,关乎是否拉出'抽屉' -->
    <!-- size: Drawer 窗体的大小, 当使用 number 类型时, 以像素为单位, 当使用 string 类型时, 请传入 'x%', 否则便会以 number 类型解释 -->
    <el-drawer v-model="outDrawer" title="I am the title" direction="rtl" :size="size">
        <!-- 自定义抽屉的头部 -->
        <template #header>
            <h4>学生战力分析</h4>
        </template>
        <div>
            <!-- 按钮+图标(记得引入) :icon=图标 -->
            <el-button round type="primary" :icon="PieChart" @click="handlePie"></el-button>
        </div>
        <!-- 分割线组件 -->
        <el-divider />
        <!-- alert组件,支持插槽,直接把内容写在里面,show-icon是图标(默认提供) -->
        <el-alert type="info" show-icon>
            请为<b style=" font-size: 20px;">{{ currentItem.studentname }}</b>同学评分
        </el-alert>
        <el-divider />
        <!-- 评分板 -->
        <div v-for="item in tagData" :key="item._id">
            <div class="rate-item">
                <div>{{ item.title }}</div>
                <!-- 评分: 监听handleRateEvent,获取点击的值($event默认数据) -->
                <!-- XXX可清空: clearable 双击相同分数清空为0 -->
                <el-rate :colors="colors" allow-half @change="handleRateEvent($event, item.title)"
                    :model-value="getItemRate(item.title)" clearable />
            </div>
            <el-divider></el-divider>
        </div>

    </el-drawer>
  ```
  - 从上至下,有几个新组件,但是很简单
    - 1.自定义头部 --- 标题
    - 2.分割线,新组件el-divider
    - 3.提示框,新组件el-alert
    - 4.==评分版,v-for循环,把外面的评分组件复制一份el-rate==
      - colors: 普通属性,随着星星变多,颜色变深,需要引入数组说明颜色
      - allow-half: 允许半星
      - ==@change: 监听事件,监听你打了几星==
      - ==:model-value: 双向绑定的值,number数据,代表星数==
      - clearable: 普通属性,双击清零星
  - 监听函数 handleRateEvent($event, item.title)
    - ==触发条件: 打星==
    - 参数: ==$event,代表默认传参,内容为打了几星==
    - item.title: 从tagData内部遍历每一项,取其科目名
  - 代码:
    ```
        // 引入echart的组件 components
        import StudentChart from '../../components/student-manage/StudentChart.vue';

        // 记录评分
        const handleRateEvent = async (value, title) => {
            console.log(value, title) // 获取评分和科目
            // 学生的信息id已经从currentItem获取了
            // 更新students的score数据,去后端写更新函数(动态路由版)
            await axios.put(`/adminapi/students/${currentItem.value._id}`, {
                key: title,
                value: value
            })
            // message评分组件,需要引入
            ElMessage({
                message: `${currentItem.value.studentname}的${title}的评分已更新`,
                type: 'success',
                plain: true,
            })

            await getList()
        }
    ```
    - 内容: message评分组件,需要引入,内部``+$动态显示你更新了哪个科目的打分
    - 请求数据axios,动态更新后台students表的score属性,这个之前默认空对象,==currentItem.value._id即你点击的学生的_id==,后面是传递的req.body格式
- ==后端创建新函数接受请求,并更新students表的score属性:==
    - StudentRouter.js
    ```
        // 动态路由,:id是占位符,无论占位符输入什么都可以访问到/adminapi/users/
        StudentRouter.put("/adminapi/students/:id",StudentController.updateList)

    ```
    - StudentController.js (==2个参数,一个id,一个请求信息==)
    ```
        async updateList(req,res){
            var result = await StudentService.updateList(req.params.id,req.body)
            res.send(result) // 把请求的数据传回给前端
        },

    ```
    - StudentService.js
    ```
        // 重点: 深度更新数据,更新的是学生的score属性值
        updateList(id,{key,value}){
            return StudentModel.findByIdAndUpdate(id,{
                "$set":{
                    // "score.html5": 5 写死的
                    ["score." + key]:value // 对象的动态写法,基础知识,不常用,别忘了
                }
            })
        },
    ```
    - 根据id找到学生,深度更新score属性(==有打分才更新,没打分,里面压根没有对应的key和value==),score是一个对象,内部13个学科,每个学科对应着打分,正常格式给了,然后使用对象的动态写法,更新score的内部内容,效果图如下:
    [![pAWuBgx.png](https://s21.ax1x.com/2024/11/19/pAWuBgx.png)](https://imgse.com/i/pAWuBgx)
- ==后端更新完score后,前端的打星表也应当对应更新星数==
- :model-value牵头的getItemRate函数,代码如下:
  ```
        // 返回对应科目分数的函数,参数title是当前打分的科目
        const getItemRate = (title) => {
            // return currentItem.value.score[title] // 当前打分的对象的score中的value(分数)
            // 这么写有个小问题,就是只有刷新页面后才会更新页面
            // 原因: 虽然后端更新了,但是currentItem还是刚开始点开评分获取的初始值,不过通过getList获取的tableData数据就是实时更新的后端数据了,使用id从tableData中过滤出是哪个学生,然后取score表内对应的科目title,即可实现实时更新
            // console.log(tableData.value,currentItem.value)
            // console.log(tableData.value.filter(item=>item._id === currentItem.value._id))
            return tableData.value.filter(item => item._id === currentItem.value._id)[0].score[title]
        }
  ```
  - ==解释代码:(内部的坑注释说了,要最新的数据tableData)== 
    - `item => item._id === currentItem.value._id`: 前者遍历所有学生的id,等于当前点击学生的id(currentItem.value._id)的时候,就筛选出来,筛选出来的是数组,只有一位,取[0],再取score表内对应的科目title
### 评分进度组件
- 代码如下:(==新组件: 进度条组件progress==)
  ```
    <el-table-column label="评分进度" min-width="160">
        <template #default="scope">
            <!-- 进度条组件progress,用第一个最简单的,percentage是进度条进度,是数字,我们动态获取 -->
            <el-progress :percentage="getProgress(scope.row)" />
        </template>
    </el-table-column>

    js:
    // 进度条获取
    const getProgress = ({ score }) => {
        if (tagData.value.length === 0) return 0  // 如果tableData的数据还没来及获取,我们就直接返回0,或者你在onMounted中把getList()放在getTag()下面,先获取tagData再获取tableData,防止出现除0现象,NaN
        let keys = Object.keys(score) // 已经评分的科目
        // console.log(keys) // 把score学生的key拿出来做成数组了
        // 百分制数字类型,比如返回50,在进度条组件里代表就是50%
        // 四舍五入的取整
        // 注意: 这里即使一个人全零蛋,那也叫100%完成度
        return Math.round((keys.length / tagData.value.length) * 100)
    }
  ```
  - 组件控制进度的就一个属性percentage,要求Number类型数据,比如返回50,在进度条组件里代表就是50%
  - 函数解析: 获取点击学生的score数组,==因为只有打过星才会记录在score数组内==,所以数组长度就是学生的打过星的科目数目,再除以总科数就是打星占比了,稍微做个运算,四舍五入 + 乘100(外面百分制)
### 综合评分计算
- ==综合评分(第三列)==:
  ```
    <el-table-column label="综合评分" min-width="140">
        <template #default="scope">
            <!-- 综合评分汇总就是一个小算法,综合评分是阶段式,未评分的科目不录入评分范畴,在已评分的科目中计算平均 -->
            <el-rate :model-value="getAllRate(scope.row)" :colors="colors" disabled allow-half />
        </template>
    </el-table-column>
  ```
  - ==disabled是只读==
  - 111
    ```
        // 获取综合评分的函数
        const getAllRate = ({ score, studentname }) => { // 只对评分的科目计算
            let values = Object.values(score) // 已经评分的个数
            // console.log(studentname,values) // 单独把score学生的成绩值value拿出来做成数组了
            let total = values.reduce((prop, current) => prop + current, 0) // reduce会记录上一次的值,上一次的值+这次的值,依次累加,prop初始值必须定义,这里定义为0,current是values数组的每一项数据,其实就是成绩值
            // console.log("total",total)
            // console.log("values.length",values.length)
            // console.log("average",total / (values.length || 1))
            // 防止一个学科没有人导致除0现象
            return total / (values.length || 1) // 总成绩/已评分科目的个数
        }
    ```
    - ==**注意: 计算平均分的前提是,只对打过分的数据做阶段性总结,没有打分的科目不进入计算的范畴,后面的平均分计算都是如此(班级平均分逻辑更绕一点)**==
    - ==Object.values(score):== 单独把score学生的成绩值value拿出来做成数组了 
    - ==数组的reduce方法:== reduce会记录上一次的值,上一次的值+这次的值,依次累加,prop初始值必须定义,这里定义为0,current是values数组的每一项数据,其实就是成绩值 
    - 平均分: 总分/科目 (==注意:防止一个学科没有人导致除0现象,所以return的代码要稍微优化,注意看代码==)
    - 最后返回给:model-value,显示出打星星数量
### 学生战力可视化组件
- 二级抽屉,嵌套抽屉,需要一个属性,==如果你需要在不同图层中多个抽屉，你必须设置 append-to-body 属性到 true== 
- 这个嵌套的抽屉组件在el-button下面,也由这个按钮触发显示
  ```
    <el-drawer v-model="outDrawer" title="I am the title" direction="rtl" :size="size">
        <!-- 自定义抽屉的头部 -->
        <template #header>
            <h4>学生战力分析</h4>
        </template>
        <div>
            <!-- 按钮+图标(记得引入) :icon=图标 -->
            <!-- 可视化分析图,echarts插件,需要'二级抽屉'(嵌套抽屉),组件drawer里有 -->
            <el-button round type="primary" :icon="PieChart" @click="handlePie"></el-button>
            <el-drawer v-model="innerDrawer" title="学生战力分析" :append-to-body="true" size="45%"
                :before-close="handleClose">
                <!-- 这里放echarts的组件(需下载npm install echarts),从外层引入(components/student-manage),不再本页冗余代码了 -->
                <!-- 父传子,分别是'所有的学生表,当前点击的学生,13个标签(科目)' -->
                 <!-- 浏览器创建销毁可以帮助我们多次执行组件的onMounted函数,从而我们可以观察不同同学的战力数据 -->
                <StudentChart :data="{ tableData, currentItem, tagData }" v-if="innerDrawer"></StudentChart>
            </el-drawer>
        </div>
        <!-- 分割线组件 -->
        <el-divider />
       ..........
    </el-drawer>
  ```
- ==双抽屉的显示效果如果要有层级感,就需要不同的宽度==
- 二级抽屉的绑定的显示隐藏属性为innerDrawer,和外层outerDrawer不同,二级抽屉事件处理函数
  ```
        // 嵌套抽屉 战力分析按钮点击处理时间函数
        const handlePie = () => {
            innerDrawer.value = true
            // 改变外部抽屉的大小(30%->65%),内层设置45%
            size.value = "65%"
        }

        // 嵌套抽屉关闭时,点击 X,出发的事件处理函数
        const handleClose = () => {
            // 关闭嵌套抽屉时,再把外层抽屉的宽度改回来
            size.value = "30%"
            innerDrawer.value = false
        }
  ```
  - 思路:通过改变一级抽屉的宽度实现层级感,二级抽屉固定宽45%,一级初始30%,当二级抽屉出来时变65%,有层级了;当二级抽屉回去时又变回35%,实现收放自如,效果图如下:
    [![pAWnL1x.png](https://s21.ax1x.com/2024/11/19/pAWnL1x.png)](https://imgse.com/i/pAWnL1x)
- 战力雷达图: ==老朋友echarts组件,由于代码冗余,我们使用组件(components)去写,最后插入此路由中,使用前记得下载`npm install echarts`==
- 组件components/student-manage/StudentChart.vue
- 简单的示范:(==样例:网站示例栏的雷达图==)
  ```
    <template>
        <!-- 为 ECharts 准备一个定义了宽高的 DOM ,宽度和高度自适应父组件el-drawer-->
        <div id="studentchart" style="width:100%; height:100%;"></div>
    </template>

    <script setup>
        // 1.导入echarts
        import * as echarts from 'echarts';
        import { onMounted } from 'vue';

        // 只有dom挂载完了,才能使用echarts
        onMounted(() => {
                // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));

            option = {
                title: {
                    text: 'Basic Radar Chart'
                },
                legend: {
                    data: ['Allocated Budget', 'Actual Spending']
                },
                radar: {
                    // shape: 'circle',
                    indicator: [
                    { name: 'Sales', max: 6500 },
                    { name: 'Administration', max: 16000 },
                    { name: 'Information Technology', max: 30000 },
                    { name: 'Customer Support', max: 38000 },
                    { name: 'Development', max: 52000 },
                    { name: 'Marketing', max: 25000 }
                    ]
                },
                series: [
                    {
                    name: 'Budget vs spending',
                    type: 'radar',
                    data: [
                        {
                        value: [4200, 3000, 20000, 35000, 50000, 18000],
                        name: 'Allocated Budget'
                        },
                        {
                        value: [5000, 14000, 28000, 26000, 42000, 21000],
                        name: 'Actual Spending'
                        }
                    ]
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        })
    </script>
  ```
  - ==只有options不同而已,下面介绍大体意思==
    - title: 雷达标题
    - legend: 不同折线种类的名字
    - radar: 雷达角属性名
    - series: 折线的偏移量
### 学生战力数据分析
- 明白雷达图后的各个属性的意思后,开始整理数据,==要两个数据,班级平均分数和个人的平均分数==
- 组件需要基本信息,父传子如下:
  ```
        <!-- -->
        <StudentChart :data="{ tableData, currentItem, tagData }" v-if="innerDrawer"></StudentChart>
  ```
  - ==**父传子,分别是'所有的学生表,当前点击的学生,13个标签(科目)'**== 
- 子获取父的信息:
  ```
        // 获取父信息,装入数组
        const props = defineProps(["data"])
        console.log(props.data) // 打印测试: .data是因为父组件的传递属性是:data
  ```

- 组件StudentChart.vue的代码:(==处理数据的函数,处理完后返回给echarts代码区域直接使用,现在重点是整理出合理的数据==)
    ```
        // 单独处理数据的函数
        const handleData = ({ tableData, currentItem, tagData }) => {
            let legendData = [currentItem.class.title + "班平均值", currentItem.studentname]
            // console.log(legendData)

            let indicatorData = tagData.map(item => ({
                name: item.title,
                max: 5
            }))
            // console.log(indicatorData)

            // ------最难的一部分: 个人vs全班平均-------
            // 从所有的学生中过滤出点击的此学生班级
            const currentClass = tableData.filter(item => item.class._id === currentItem.class._id)
            // console.log(currentClass) // 例如张三2001班,那么这里的数据就是所有2001班的学生集合

            // 对于学生score中没有数据的科目不可以累加,只累加有评分的
            const average = []

            // 这是循环,对所有的tag(科目)进行一次循环,从而得到此班级所有科目的全班平均分
            tagData.forEach(({ title }, index) => { // 默认参数为: item,index 代表'数组每一项和索引',其中前者我们解构了
                let filterArr = currentClass.filter(item => item.score[title])
                // console.log("科目:" + title, filterArr)
                // filterArr.map(item=>item.score[title]).reduce((total,item)=>total+item,0)
                // console.log("单科成绩列表", filterArr.map(item => item.score[title]))
                // console.log("单科平均分:(此科目的总成绩/此科目的人数)", (filterArr.map(item => item.score[title]).reduce((total, item) => total + item, 0) / (filterArr.length || 1)).toFixed(2))
                average[index] = (filterArr.map(item => item.score[title]).reduce((total, item) => total + item, 0) / (filterArr.length || 1)).toFixed(2)
            })
            // console.log(average) // 点击哪个班级的学生会显示此班级学生的所有单科平均成绩,按tags的顺序排列



            const averageObj = { // 班级的
                name: legendData[0], // XX班平均值,
                value: average // 此班级13个科目的每个科目的全班平均值数组集合,按tags排列
            }
            console.log(averageObj)
            const currentObj = { // 点击的这个学生
                name: legendData[1], // 学生名
                value: tagData.map(({ title }) => currentItem.score[title] ? currentItem.score[title] : 0) // 13标签映射为此学生此标签的成绩(当然如果学生没有这个科目的评分就默认为0),使用三目,如果没有这科目成绩(undefined),走后面的0,如果有,就是正常取
            }
            console.log(currentObj)

            const seriesData = [averageObj, currentObj]

            return {
                legendData,
                indicatorData,
                seriesData
            }

        }
    ```
- ==前两个数据获取简单,重点在第三个数据的获取:==
  - legendData: 种类名字为 XX班级/XX学生 (看代码直接能从父传递的信息中获取)
  - indicatorData: 映射下tagData,把13个科目依次映射出来,最后变为对象数组格式,每个科目的数值都为5(5颗星),看代码,很简单
  - ==seriesData: 由班级平均分对象averageObj和个人成绩对象currentObj构成,严格按照模板的格式来==
- 班级平均分对象averageObj: ==之前个人星星综合评价中有个规则,只有这个科目有分时才加入计算平均分的范畴,班级同理,代码刨析如下==
  -  tagData.forEach(): 这是循环,对所有的tag(科目)进行一次循环,从而得到此班级所有科目的全班平均分
     -  参数: `({ title }, index)` , 默认参数为: item,index 代表'数组每一项和索引',其中前者我们解构了
  - ==第一次过滤:== 
    ```
        let filterArr = currentClass.filter(item => item.score[title])
    ```
    - ==**解析:这个学科有成绩的学生才会进入数组**;例如第一门学科html5,在2001班中,html5有成绩的学生数据才会进入数组filterArr==
      **2001班 html5和css3表的示例,只有有此科目成绩的才会被录入数据**
    [![pAWnq91.png](https://s21.ax1x.com/2024/11/19/pAWnq91.png)](https://imgse.com/i/pAWnq91)
  - ==第二次过滤:==
    ```
        // 代码中的注释部分:
        filterArr.map(item=>item.score[title])
    ```
    - ==**解析: 把过滤出来的学生数组映射为单独的学科成绩;** 接着上面的例子,假设有5个学生有html5成绩,那么数据item由5个学生的全部信息映射为5个学生的html5成绩==
    **继续看上面的图: 单科成绩列表,把此科目的成绩都映射出来了,最后再通过reduce相加,得到这个科目的全班总成绩(==只限有这课成绩的,不代表所有人,有的人没有这科成绩,不再考虑范围内==)**
    ```
        filterArr.map(item=>item.score[title]).reduce((total,item)=>total+item,0)
    ```
    [![pAWnq91.png](https://s21.ax1x.com/2024/11/19/pAWnq91.png)](https://imgse.com/i/pAWnq91)
    - ==以此类推,每个科目都这样计算全班平均分(总成绩/总人数) **注意: 总认识只限于有这科成绩的学生,不是全班学生!!**==
    - 再根据索引index,依次把13个科目的班级平均分放入average数组
    ```
        average[index] = (filterArr.map(item => item.score[title]).reduce((total, item) => total + item, 0) / (filterArr.length || 1)).toFixed(2)
    ```
    - ==优化个地方==: 如果一个班级中,有的科目,所有人都没有成绩,那么筛选出来的此成绩人数filterArr数组就为空,即长度为0,这样会出现'/0'(除0)的情况,结果为NaN,所以加一个'或' (|| 1),这样结果就为0了
    - ==最后整理格式==:
        ```
        const averageObj = { // 班级的
            name: legendData[0], // XX班平均值,
            value: average // 此班级13个科目的每个科目的全班平均值数组集合,按tags排列
        }
        ```
- 个人成绩对象currentObj: 
    ```
        const currentObj = { // 点击的这个学生
            name: legendData[1], // 学生名
            value: tagData.map(({ title }) => currentItem.score[title] ? currentItem.score[title] : 0) 
        }
    ```
    - 解构item,拿出tagData每一项的title值(标签名字html5,css3....),共计13科目映射为'此学生13科目的单个成绩'
    - ==注意: 使用三目,如果没有这科目成绩(undefined),走后面的0,如果有,就是正常取,防止没有此科目成绩导致出现了出现undefined==
- 把班级平均分对象averageObj和个人成绩对象currentObj合并进seriesData对象:
  ```
    const seriesData = [averageObj, currentObj]
  ```
- 最后把整理好的数据返回出去,再echarts内部接受并使用:
  ```
    return {
        legendData,
        indicatorData,
        seriesData
    }
  ```
- 使用信息:(==tooltip属性是面板信息显示,可有可无,是个鼠标跟随操作,重点看legend,radar和series,多么简单的引入==)
  ```
    // 单独处理数据的函数
        let { legendData, indicatorData, seriesData } = handleData(props.data)
        // 指定图表的配置项和数据
        var option = {
            // title: { // 标题
            //     text: 'Basic Radar Chart'
            // },
            legend: { // 图标折现分类
                data: legendData
            },
            // 提示框,kerwin写的,里面重点position是坐标,这个坐标是跟随鼠标的
            tooltip: {
                trigger: 'item',
                //鼠标跟随
                position: function (point, params, dom, rect, size) {
                    // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
                    // 提示框位置
                    var x = 0; // x坐标位置
                    var y = 0; // y坐标位置

                    // 当前鼠标位置
                    var pointX = point[0];
                    var pointY = point[1];

                    // 外层div大小
                    // var viewWidth = size.viewSize[0];
                    // var viewHeight = size.viewSize[1];

                    // 提示框大小
                    var boxWidth = size.contentSize[0];
                    var boxHeight = size.contentSize[1];

                    // boxWidth > pointX 说明鼠标左边放不下提示框
                    if (boxWidth > pointX) {
                        x = 5;
                    } else { // 左边放的下
                        x = pointX - boxWidth;
                    }

                    // boxHeight > pointY 说明鼠标上边放不下提示框
                    if (boxHeight > pointY) {
                        y = 5;
                    } else { // 上边放得下
                        y = pointY - boxHeight;
                    }

                    return [x, y];
                }
            },
            radar: { // 雷达图的各个角的属性名
                // shape: 'circle',
                indicator: indicatorData
            },
            series: [
                {
                    name: 'Budget vs spending',
                    type: 'radar',
                    data: seriesData
                }
            ]
        };

  ```
- ==最后的小问题:==
  ```
    <template>
        <!-- 为 ECharts 准备一个定义了宽高的 DOM ,宽度和高度自适应父组件el-drawer-->
        <div id="studentchart" style="width:100%; height:100%;"></div>
    </template>
  ```
  - 这个echarts的图标宽高自适应依据父组件el-drawer的值,而它的dom挂载可能要比echarts晚,所以我们使用nextTick,等待第一次el-drawer的挂载完成之后再执行echarts的代码
  - 所以所有的echarts组件被包装如nextTick内部,这样保证了所有dom挂载完再执行echarts的创建,==问题是onMounted只执行一次,这样我们看不了其他同学的成绩,无法实时更新==
  - 解决: 浏览器==(创建销毁)**v-if**==可以帮助我们多次执行组件的onMounted函数,从而我们可以观察不同同学的战力数据  
    ```
        <StudentChart :data="{ tableData, currentItem, tagData }" v-if="innerDrawer"></StudentChart>
    ```
  - onMounted只会执行一次,为了轻松,也是减少bug,我们不再结合onUpdate去写代码了,==我们每次让**浏览器(显示/隐藏)的v-show模式改为(创建/销毁)的v-if模式**==
  - 这里多嘴一句: ==像是弹出框dialog和这里的抽屉drawer都是懒惰的,只有第一次点击后才会创建其dom对象,然后后续的隐藏显示都为v-show模式==
  - 这样每次创建一次,就会执行一次onMounted,我们就可以实时查看不同人的战力雷达

## 大数据展示
### 学生大数据组件 + 数据源
- ==学生大数据页面在视图view的home.vue,效果图如下==
    [![pAWcLTS.png](https://s21.ax1x.com/2024/11/20/pAWcLTS.png)](https://imgse.com/i/pAWcLTS)
- ==布局基本页面==
  - 页面分为左右两大板块,右板块又分为上下两个板块,整体加了背景图片,板块的划分使用了==24栏布局组件layout==
  ```
    <template>
        <div id="home">
            <el-row :gutter="20" class="parent" v-if="isCreated">
                <!-- 左边 -->
                <el-col :span="12">
                    <!-- 父传子 -->
                    <classAverageEchart :data="{ studentsData, classData, tagsData }"></classAverageEchart>
                </el-col>
                <!-- 右边 -->
                <el-col :span="12">
                    <el-row :gutter="20" class="parent">
                        <!-- 撑满24,换行,上下布局 -->
                        <el-col :span="24" class="item">
                            <!-- 右上,全体学生平均值 -->
                            <AverageEchart :data="{ studentsData, tagsData }"></AverageEchart>
                        </el-col>
                        <el-col :span="24" class="item">
                            <!-- 右下,全体学生风险评估(倒数5名) -->
                            <DangerStudent :data="{ studentsData, tagsData }"></DangerStudent>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>
    </template>
  ```
  - ==24栏组件el-row:==
    - 左/右: 行提供 gutter 属性来指定列之间的间距，其默认值为0,这里左右平分(12-12)页面,中间间隔20px
    - 右的(上/下): 撑满24,换行,上下布局
    - ==**属性v-if="isCreated"**==: 大数据页面的图标都是来自echart组件,这些图标的数据源均来自学生大数据页面的axios获取,如果异步axios获取时间超时,导致echart在没有获取到数据的前提下进行渲染图标,会造成bug,所以我们需要等待所有数据获取成功后,再创建(v-if通过)tem相关解构,此时组件再获取数据就绝对安全了!
    ```
        const studentsData = ref([])
        const classData = ref([])
        const tagsData = ref([])

        const isCreated = ref(false) // 控制创建echarts的属性
        onMounted(async () => {
            // 函数本身的异步不会影响外面的同步执行,所以外面也要异步
            await getStudentList()
            await getClassList()
            await getTagList()
            isCreated.value = true
        })

        const getStudentList = async () => {
            studentsData.value = await axios.get("/adminapi/students")
        }
        const getClassList = async () => {
            classData.value = await axios.get("/adminapi/classes")
        }
        const getTagList = async () => {
            tagsData.value = await axios.get("/adminapi/tags")
        }
    ```
    > onMounted也被加上了async-await,确保了数据都请求到后,再isCreated.value = true
- 对布局样式设置了宽高等css基本样式:
  ```
    <style lang="scss" scoped>
        // 大小适配图片
        .parent {
            height: 84vh;

            .item {
                height: 50%;
            }
        }

        // 加背景
        #home {
            background: url("../../assets/bg.png") no-repeat center;
            background-size: 100% 100%;
            padding: 10px;
            color: white;
        }
    </style>
  ```
### 学生大数据-各班级均值
- 构建学生大数据页面(1): ==**左侧页面的内容**,由组件classAverageEchart负责完成(components/home/classAverageEchart.vue)==
  ```
    <!-- 左边 -->
    <el-col :span="12">
        <!-- 父传子 -->
        <classAverageEchart :data="{ studentsData, classData, tagsData }"></classAverageEchart>
    </el-col>
  ```
  > 父传子数据: ==所有学生的信息;班级的信息;标签的信息==
- ==classAverageEchart.vue==
  - echart组件--数据集的一个饼状图+折线图的demo
    ```
    <template>
        <!-- 为 ECharts 准备一个定义了id和宽高的 DOM,用于装载echarts的内容 -->
        <div id="classAverageEchart">
            classAverageEchart
        </div>
    </template>

    <script setup>
        import { onMounted } from 'vue'
        // 1.导入echarts
        import * as echarts from 'echarts';

        // 接受父信息
        const props = defineProps(["data"])

        // 2.这里不必nextTick,在父组件当所有的数据都创建完了,才创建出来的,创建代码在onMounted()函数的最后一步,等待所有的工作做完才创建的el-row,里面是咱们的组件
        onMounted(() => {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('classAverageEchart'));
            // 数据处理函数 
            let { source, series } = handleDate(props.data)

            // 配置参数(来自'示例/数据集')
            var option = {
                title: [
                    {   // 饼状图标题设置,位置自适应,如果位置出错记得刷新一下
                        text: "各班级技术Tag平均值",
                        textStyle: {
                            fontSize: 14,
                            color: "white"
                        }

                    }
                ],
                legend: { // 改上面图例的样式
                    textStyle: {
                        fontSize: 14,
                        color: "white"
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    showContent: false
                },
                dataset: {
                    // source: [ // 第一个数据: X轴; 后面的数据是所有种类及其Y轴
                    //     // 第一个应该是tags的13个技术标签(静态遍历创建); 后面的种类应该是2001 2002 2003班及当科的全班平均分(动态创建,可更新)
                    //     ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
                    //     ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
                    //     ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
                    //     ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
                    //     ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
                    // ]
                    source // 简写
                },
                // 控制x轴显示,让所有的x轴Tags都显示
                xAxis: {
                    type: 'category',
                    axisLabel: { // x轴标签
                        interval: 0, //间隔
                        rotate: 50 // 旋转50度
                    },
                    axisLine: { // x轴的样式
                        lineStyle: {
                            color: "white"
                        }
                    }
                },
                yAxis: {
                    gridIndex: 0,
                    max: 5,
                    axisLine: { // y轴的样式
                        lineStyle: {
                            color: "white"
                        }
                    }
                },
                grid: { top: '55%' },
                series // 简写,饼状图的初始配置
            };
            // pie饼状图附带监听事件,鼠标移动在折线图上查看数据移动时触发
            myChart.on('updateAxisPointer', function (event) {
                const xAxisInfo = event.axesInfo[0];
                if (xAxisInfo) {
                    const dimension = xAxisInfo.value + 1;
                    myChart.setOption({
                        series: {
                            id: 'pie',
                            label: {  // 之后饼图的动态显示 
                                formatter: '{b}班: {@[' + dimension + ']}分'
                            },
                            encode: {
                                value: dimension,
                                tooltip: dimension
                            }
                        }
                    });
                }
            });

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);

            })
    </script>
    ```
    > ==内部出多数据的配置都可以查询文档解决,主要了解其意思,才能替换其对应数据==
- ==组件的属性介绍及数据整理==
  - title: 大标题,可设置样式
  - legend: 图例,可更改样式
  - ==dataset: 折线图的数据源,数组内的第一个item是X轴,后面的item是种类及其值,与X轴一一对应==
  - xAxis: X轴的样式
  - yAxis: Y轴的样式
  - series: 饼状图配置
    - label: 初始化显示配置/ formatter: 饼状图索引数据 
    - encode: 初始化的x轴坐标/ itemName: X轴名字(dataset的第一个item数据起的名字) value+tooltip: X轴起点的坐标名
  - myChart.on(): 饼状图的监听函数
    - label: 饼状图在初始化后,之后鼠标移动到不同X轴坐标显示不同的饼状图样式,这里配置动态显示的饼状图索引数据(与初始化中的label一个作用)
- 配图:(==绿色圈内的为图例---legend,红色圈内的为饼状图索引数据---series/formatter和动态配置myChart.on()/label==)
  [![pAWcLTS.png](https://s21.ax1x.com/2024/11/20/pAWcLTS.png)](https://imgse.com/i/pAWcLTS)
- **配置数据函数handleDate,主要配置dataset的source数据,其次是series**
- ==1.配置source数据:(**前提获取了父信息**==)
  ```
    // 接受父信息
    const props = defineProps(["data"])

    onMounted(()=>{
        ....
        let { source, series } = handleDate(props.data)
        ....
    })

    const handleDate = ({ studentsData, classData, tagsData }) => {
        const source = []
        const series = []
        // console.log(tagsData)

        // source第一个数据: 科目的遍历 X轴
        source.push([
            "tags", // 随影起名字
            // 展开运算,tag数组映射出里面的科目title
            ...tagsData.data.map(item => item.title)
        ])
        // console.log(source) 

        // source后面的数据: 班级+班级每科平均分
        classData.data.forEach(item => { // 遍历classData,即遍历出几个班级(几条折线数据)
            // getAverage返回为数字类型,记得展开合并
            var arr = [item.title, ...getAverage(studentsData, tagsData, item._id)]
            source.push(arr)
            series.push({
                type: 'line',
                smooth: true,
                seriesLayoutBy: 'row',
                emphasis: { focus: 'series' }
            })
        })

        .....
    }
  ```
  - ==优先配置第一个item数据==: 由X轴名字和13个科目标签组成,结构为`["tags","html5","css3","DOM操作",....]`,如代码,通过push操作,tags+tagsData的map映射,简单解决(title就是科目名)
  - 后面的数据: ==我们要3个班级的折线情况,所以遍历班级2001 2002 2003,**结构为`[班级名,全班各科目平均成绩依次排列]`,最终呈现效果如下图**==
    [![pAWBTsO.png](https://s21.ax1x.com/2024/11/20/pAWBTsO.png)](https://imgse.com/i/pAWBTsO)
  - ==全班各科平均成绩我们**用函数getAverage负责整理**==,最后传递一个纯数字数组,再借助展开运算符即可解决,向函数传递参数studentsData, tagsData, item._id(==其中第三个为此班级的ObjectId==)
- 函数getAverage(==修改和复用之前的函数,student-manage/StudentChart.vue的handleData内部部分函数==)
  ```
    const getAverage = (studentsData, tagsData, classId) => {
        const currentClass = studentsData.data.filter(item => item.class._id === classId)

        const average = []

        tagsData.data.forEach(({ title }, index) => {
            let filterArr = currentClass.filter(item => item.score[title])
            average[index] = (filterArr.map(item => item.score[title]).reduce((total, item) => total + item, 0) / (filterArr.length || 1)).toFixed(2)
        })

        return average
    }
  ```
  > 几乎没有任何变化,就改了一个地方,即第一行代码,我们通过传递的班级ObjectId从全部学生中筛选出此班级的学生,然后对此班级的学生进行各科平均分计算,==注意别忘了,此科目没有评分的学生不在"此科目全班平均分计算"范畴内==
- ==2.配置初始化饼图series和后续监控饼图函数==
  ```
    // 紧接上面handleData函数的source处理部分

    // 最后记得饼状图,属性可以通过官方查文档了解
    series.push({
        type: 'pie',
        id: 'pie',
        radius: '30%',
        center: ['50%', '25%'],
        emphasis: {
            focus: 'self'
        },
        label: { // 初始化显示
            formatter: '{b}班: {@html5}分', // 控制饼状图显示
            // {b}: 占位符,将来拿种类名,2001 2002 2003
            // {@2012}: 默认显示x轴,我们默认显示html5一列的数据
            color: "#fff" // 字体颜色
        },
        encode: {
            // x轴的起点,当时我们起名字tags
            itemName: 'tags',
            value: 'html5',
            tooltip: 'html5'
        }
    })

    // 最后返回整理好的两个数据
    return {
        source,
        series
    }
  ```
  > ==看注释,简单的初始化,结合上面的组件属性介绍==
- 动态监控饼状图索引提示,就改了一个地方,==注释处formatter==
  ```
    // pie饼状图附带监听事件,鼠标移动在折线图上查看数据移动时触发
    myChart.on('updateAxisPointer', function (event) {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
            const dimension = xAxisInfo.value + 1;
            myChart.setOption({
                series: {
                    id: 'pie',
                    label: {  // 之后饼图的动态显示索引 
                        formatter: '{b}班: {@[' + dimension + ']}分'
                    },
                    encode: {
                        value: dimension,
                        tooltip: dimension
                    }
                }
            });
        }
    });
  ```
### 学生大数据-技术强弱图
- 学生大数据(2): ==**页面的右上部分内容**,由AverageEchart组件负责(components/home/AverageEchart.vue)==
- 此组件作用是显示全体学生成绩平均值,所以父传子的信息不再传递班级数据
  ```
    <el-col :span="24" class="item">
        <!-- 右上,全体学生平均值 -->
        <AverageEchart :data="{ studentsData, tagsData }"></AverageEchart>
    </el-col>
  ```
- AverageEchart.vue(==样例来自'示例/柱状图/极坐标柱状图',不同的echart图标样例只需要不同option参数配置==)
- 接受父信息,配置基础的echarts等操作略去,只关注option参数的变化和数据整理,其中重复的属性一笔带过
  ```
    // 配置参数(来自'示例/柱状图/极坐标柱状图')
    var option = {
        title: [ // 标题
            {
                text: '全体学生技术Tag强弱图',
                textStyle: {
                    fontSize: 14,
                    color: "#fff"
                }
            }
        ],
        polar: {
            radius: [30, '80%']
        },
        radiusAxis: { // 角度轴y轴最大值 =5
            max: 5,
            axisLine: { // y轴颜色
                lineStyle: {
                    color: "#fff"
                }
            }
        },
        angleAxis: { // angle意为'四周',角度轴
            type: 'category',
            // data: ['a', 'b', 'c', 'd'], // 未来是Tags学科名字,角度轴数据
            data: angleAxisData,
            startAngle: 75,
            axisLine: { // 角度轴颜色
                lineStyle: {
                    color: "#fff"
                }
            }
        },
        tooltip: {},
        series: {
            type: 'bar',
            // data: [2, 1.2, 2.4, 3.6], // 对应学科全部学生的平均值
            data: seriesData,
            coordinateSystem: 'polar',
            label: {
                show: true,
                position: 'middle',
                // formatter: '{b}: {c}' 
                formatter: '' // 不显示每一条柱状的名称,显示不开
            }
        },
        colorBy:"data", // 和之前不同,这里的数据共属于一条,即全部学生,而非2001 2002 2003的区分,所以要添加新属性,每一个数据独有一个颜色
        // 调色盘,提供更多的颜色
        color: ['#FCCE10', '#E87C25', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD', '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'],
        animation: true // 有动画
    };
  ```
  - title: 标题
  - angleAxis: 相当于X轴,这里是角度轴,360度环绕
    - data: 角度轴数据, `[13个学科名]`
  - radiusAxis: 等于Y轴
  - series: 
    - ==data: Y轴的值==
    - label/formatter: 每条柱显示的信息,如果不希望有,请赋空值"",别不写,有默认的
  - color + colorBy: 前者是调色板,后者是为了让每根柱都有不同的颜色
   关于colorBy的注意事项:和之前不同,这里的数据共属于一条,即全部学生,而非2001 2002 2003的区分,所以要添加新属性,每一个数据独有一个颜色
- ==数据整理函数handleDate:==
  ```
    const handleDate = ({ studentsData, tagsData }) => {
        return {
            angleAxisData: tagsData.data.map(item => item.title), // 角度轴,标签科目映射
            seriesData: getAverage(studentsData, tagsData)
        }
    }
  ```
  - 角度周(X轴)的标签获取: tagsData的map映射,十分简单,过
  - 全体学生的单科平均分: 依旧依据函数getAverage获取
  ```
    const getAverage = (studentsData, tagsData) => {
        const average = []

        tagsData.data.forEach(({ title }, index) => {
            let filterArr = studentsData.data.filter(item => item.score[title]) // 过滤所有学生有这个成绩的
            average[index] = (filterArr.map(item => item.score[title]).reduce((total, item) => total + item, 0) / (filterArr.length || 1)).toFixed(2)
        })

        return average
    }
  ```
  > 更加简单,不用再根据班级筛选学生了,直接对全体学生进行学科成绩筛选,遍历tagsData获取每个学科item,以此对所有学生的本学科成绩进行筛选,此目的是剔除掉本学科没有成绩的学生,所以一轮筛选后,数组内是本学科全体同学(有分数的)的大集合,然后进行reduce累加,然后除人数(数组长度),算平均(保留2为小数).
- ==最后把对应的数据放入柱状图options参数配置的对应位置,完善X和Y轴的数据显示,完活==
### 学生大数据-风险学生
- 学生大数据(3): ==**右下,学生风险评估部分**,由DangerStudent组件负责(components/home/DangerStudent.vue)==
- ==**组件功能介绍**==: 本内容负责在全体学生中,选取总成绩最低的5人,然后列出每个人成绩最低的5科(最多5科),最后增加点击跳转功能,即点击学生,跳转到学生列表页面,自动搜索出此学生的全部信息
- ==本次父传子和右上的AverageEchart组件一摸一样,只传递学生信息和标签信息,所以这里略掉相关代码==
- 学生列表页面:
  [![pARbNkR.png](https://s21.ax1x.com/2024/11/18/pARbNkR.png)](https://imgse.com/i/pARbNkR)
- DangerStudent.vue
  ```
    <template>
        <!-- el-table表格组件,加了点样式,保证el-table不溢出又有合理间距 -->
        <el-table id="DangerStudent" :data="tableData" style="width: 100%; height: 90%; margin-top: 5%;" class="table">
            <el-table-column label="风险学生">
                <template #default="scope">
                    <!-- 给学生名字添加新组件,el-link,新增跳转功能,跳转到学生列表,并把当前学生的信息搜索出来 -->
                    <!-- el-link 支持style属性,直接css定义颜色 -->
                    <el-link style="color: white;" @click="handleClick(scope.row.studentname)">{{ scope.row.studentname }}</el-link>
                </template>
            </el-table-column>

            <el-table-column label="班级">
                <template #default="scope">
                    {{ scope.row.class.title }}
                </template>
            </el-table-column>

            <el-table-column label="低tag值技术">
                <template #default="scope">
                    <!-- 不要以数组的形式显示,用' | '的形式连接在一起 -->
                    {{ scope.row.lowTag.join(" | ") }}
                </template>
            </el-table-column>
        </el-table>
    </template>
  ```
  - 这个部分不再是echarts的图标结构,而是列表el-table,分为三列,学生名字,学生班级(studentData中有此学生的班级信息),最低的5科成绩,==其中前面2个直接获取即可,看上面代码,而最后一个需要数据整理,由handleData函数负责==
- handleData函数: (已经接受父信息的两个参数了)
  ```
    const handleData = ({ studentsData, tagsData }) => {
        const averageStudent = []
        studentsData.data.forEach((item, index) => {
            let values = Object.values(item.score) // 只把此学生数据中的score属性拿出来,没有测评的科目不会被记入
            // 总成绩/学科数量(保留2位小数)
            let averageValue = (values.reduce((total, item) => total + item, 0) / values.length).toFixed(2)
            // 如果此学生所有科目都没有打分,这个values.length长度是0,结果为NaN(除0),这种学生属于还未测评的学生,不属于我们考虑范畴内,需要过滤
            // console.log(item,averageValue)

            if (!isNaN(averageValue)) { // 意思是如果这个学生是NaN的情况,即所有科目都还未测评的,则筛出去,不添加进最终数组
                averageStudent.push({
                    ...item, // 学生的所有数据
                    averageValue // 学生已有科目的平均分
                })
            }
        })

        // 对筛选后学生的平均分averageValue把所有对象进行排序
        averageStudent.sort((item1, item2) => item1.averageValue - item2.averageValue) // averageValue(个人成绩平均分)的大小排序
        // console.log(averageStudent)

        // 截取前5名,即平均分倒数5名的学生信息
        let students = averageStudent.slice(0, 5)
        let finalStudents = [] // 最终学生数据
        // 获取这5名学生数据低Tag值
        students.forEach((item, index) => {
            // 对每位学生的成绩进行枚举,转化为对应的二维数组
            // Object.entries()方法是 JavaScript 中用于将一个对象自身可枚举的属性[key, value]对转换为一个二维数组的方法。其中，每个子数组包含两个元素：第一个元素是属性名（键），第二个元素是属性值。
            let lowTag = Object.entries(item.score).sort((item1, item2) => item1[1] - item2[1]).slice(0, 5).map(item => item[0]) // 排序是对数组的第二项(即array[1])学生学科成绩进行排序,再截取前5项(最低的5项),有几个截取几个,最后我们映射这些数组的第一项[0],我们要的是其学科名
            // console.log(lowTag)
            finalStudents.push({
                ...item,
                lowTag
            })
        })
        // console.log(finalStudents) // 最后5名倒数学生数据和其最差的5们学科信息lowTag

        return finalStudents
    }
  ```
- ==第一步studentsData.data.forEach()遍历每个学生==
  - 通过Object.values(item.score),把此学生数据中的score属性拿出来,没有测评的科目不会被记入
  - ==然后进行平均分计算,并且没有规避NaN的情况==
  - ==if (!isNaN(averageValue))二次筛选:== 如果此学生所有科目都没有打分,这个values.length长度是0,结果为NaN(除0),这种学生属于还未测评的学生,不属于我们考虑范畴内,需要过滤,所以在评分未完成的情况下,经过本次筛选后,合格学生的数量只会小于等于学生总数
  - 然后对二次筛选的学生数据进行排序sort,依据averageValue(这是对象中的一个属性,意为个人成绩平均分)的大小排序
  - ==到此时数据效果图为:==
    [![pAWBbee.png](https://s21.ax1x.com/2024/11/20/pAWBbee.png)](https://imgse.com/i/pAWBbee)
  - 经过排序(正序,从小到大),截取前5个数据,即倒数5名的学生,放入新数组
  `let students = averageStudent.slice(0, 5)`
  - ==获取这5名学生数据低Tag值,students.forEach((item, index))=>{}==
  - 枚举每位学生,使用**Object.entries**对学生的score属性进行处理(==Object.entries()方法是 JavaScript 中用于将一个对象自身可枚举的属性[key, value]对转换为一个二维数组的方法。其中，每个子数组包含两个元素：第一个元素是属性名（键），第二个元素是属性值。==)
  [![pAWB7LD.png](https://s21.ax1x.com/2024/11/20/pAWB7LD.png)](https://imgse.com/i/pAWB7LD)
  - 然后经过排序sort,截取前5个数据slice,映射出学科名map之后,得出此学生最低的5科成绩,效果图如下
  [![pAWBoQK.png](https://s21.ax1x.com/2024/11/20/pAWBoQK.png)](https://imgse.com/i/pAWBoQK)
- 返回出数据后,最后在外面的el-table中,涉及数组,我们借助join()转化下格式显示即可
> 
- ==2.点击对应姓名即可跳转到学生列表页面并搜索的功能==
  - 新组件el-link,跳转链接的组件,配置点击事件函数,使用路由功能跳转
    ```
        <el-table-column label="风险学生">
            <template #default="scope">
                <!-- 给学生名字添加新组件,el-link,新增跳转功能,跳转到学生列表,并把当前学生的信息搜索出来 -->
                <!-- el-link 支持style属性,直接css定义颜色 -->
                <el-link style="color: white;" @click="handleClick(scope.row.studentname)">{{ scope.row.studentname }}</el-link>
            </template>
        </el-table-column>

        import {useRouter} from 'vue-router'

        // 记得引入useRouter
        const router = useRouter()
        // 点击学生名字跳转事件处理函数
        const handleClick = (name)=>{
            // console.log(name)
            // view跳转到studentlist路由,忘了path去router文件夹的config.js看
            // 传递参数,使用query方式(vue基础讲push跳转时讲过,如何携带参数及如何获取参数),不能使用${},这样浏览器会把name当作路由路径的一部分,最后就是404
            router.push(`/student-manage/studentlist?name=${name}`)
        }
    ```
    > ==看注释,这里由vue的基础知识,关于路由的跳转router.push的多种方法,这里为了携带信息,使用query方法==
- StudentList.vue: 学生列表组件
  ```
    <el-table-column>
            <!-- table自定义表头 -->
            <template #header>
                <!-- 双向绑定的数据记录你输入的值 -->
                <el-input v-model="search" size="small" placeholder="请输入学生的名字" />
            </template>
            <template #default="scope">
                {{ scope.row.studentname }}
            </template>
    </el-table-column>


    js:
    import {useRoute} from 'vue-router'
    // 获取当前路由的path,进而获取其内部的query.name,用于接收path中query传参的name属性
    const route = useRoute()
    const search = ref(route.query.name || "") // 搜索学生框的双向绑定,如果有相关信息就直接搜索,如果没有就默认空字符串
  ```
  > 对搜索的双向绑定初始化时进行更改,如果由传过来的query信息,就直接搜索,没有就默认空
- ==最后,关于组件DangerStudent的css样式问题,又涉及组件深度样式添加的(:deep),另外注意css的优先级,直接设置为最高的!important==
  ```
    <style scoped lang="scss">
        .table {
            background: url('../../assets/t_bg.png') no-repeat center;
            background-size: 100% 100%;

            // 原本el-table就有背景样式,记得这里给组件内部的标签加css样式需要深度选择 :deep()
            // 加上层级,级别最高(!important),所有的css样式都听我的
            :deep(tr) {
                background-color: rgba($color: #fff, $alpha: 0) !important; // 背景透明,alpha为透明度(0-1),这是完全透明的白色,注意: 纯 CSS 中通常没有$符号来定义参数,这里是scss下的写法,正常写在rgba的第四个参数, 纯css: rgba(255,255,255,0)
                color: white
            }

            :deep(th) {
                background-color: rgba($color: #fff, $alpha: 0) !important;
                color: white
            }

            :deep(tr):hover td {
                background-color: rgba($color: #fff, $alpha: 0) !important;
            }
        }
    </style>
  ```
### 面试管理全系列
- ==**我们一口气通关了,内部包含'公司列表组件,更新题库功能,面试题预览功能'三个部分**==
- interview-manage/CompanyList.vue,上传excel文件,根据上传文件的数据构成下列表格,==上传文件组件upload,复用添加班级页面的代码==
  ```
    tem: 
    <el-upload :auto-upload="false" :on-change="handleChange" style="width: 100%" v-model:file-list="fileList">
        <el-button class="ml-3" type="primary">
            选择就业excel文件
        </el-button>
    </el-upload>

    <!-- 公司的列表el-table + 搜索功能 (复制student-manage/studentList.vue) -->
    <el-table :data="computedTableData" style="width: 100%">
        <el-table-column>
            <!-- table自定义表头 -->
            <template #header>
                <!-- 双向绑定的数据记录你输入的值 -->
                <el-input v-model="search" size="small" placeholder="请输入公司的名字" />
            </template>
            <template #default="scope">
                {{ scope.row.title }}
            </template>
        </el-table-column>

        <el-table-column align="left" label="操作">
            <template #default="scope">
                <!-- 调整下高度,调整某一个的行高,这一行的行高都会跟着变化 -->
                <div style="display: flex; align-items: center; height: 55px;">
                    <el-button round type="primary" @click="handlePreview(scope.row)">面试题</el-button>
                    <el-button round type="warning" @click="handleUpdate(scope.row)">更新题库</el-button>
                </div>
            </template>
        </el-table-column>

        <!-- 占位,没内容 -->
        <el-table-column />
    </el-table>

    js:
    import ImportExcel from '../../util/ImportExcel'
    import axios from 'axios'

    const fileList = ref([])
    // 监听excel上传文件的函数
    const handleChange = (ev) => {
        console.log(ev.raw)
        ImportExcel(ev.raw, async (data) => {
            console.log(data) // 获取解析文件的信息,数组类型
            // 1.存储公司数据
            // 2.存储就业学生数据,这个数据和学生列表数据库是2个不同的数据集合,一个是就业学生数据,一个是测评成绩(正在学习的学生数据)
            // 接下来去后端完善这两个数据库模型的创建等操作

            // 发送公司数据 list是从data提取的公司信息
            const list = data.map(item => ({ title: item.company })) //公司名数组集合
            // console.log(list)
            await axios.post("/adminapi/companys", list)
            // 发送学生数据 data是完整的excel提取信息,也就是学生就业信息
            await axios.post("/adminapi/companystudents", data)

            getList() // 最后获取公司和学生的数据,根据这些数据进行页面的渲染

            // 延时1s清空上传列表
            setTimeout(() => {
                fileList.value = []
            }, 1000)
        })
    }


    // el-table公司表格数据源
    const tableData = ref([])
    const search = ref("")
    const getList = async () => {
        var { data } = await axios.get("/adminapi/companys") // 获取公司数据
        tableData.value = data
        // console.log(tableData.value)
    }

    // 计算属性计算table数据,然后把过滤的属性放在table表中,箭头函数后面就一句话,默认返回
    const computedTableData = computed(() => tableData.value.filter(
        // 筛选条件: 因为全是中文所以不在乎大小写匹配,计算属性返回过滤好的新数据
        data => data.title.includes(search.value)
    ))

    onMounted(() => {
        getList()
    })
        
  ```
- ==**步骤及思路:**==
  - 1.利用提前写好的ImportExcel组件获取excel文件的数据,然后数据整理为公司名数据list发送新的公司路由地址,再发送原数据给新的学生就业路由地址
  - 2.构建后端,新建2个模型,分别为公司数据和就业学生数据,然后把整理的数据存进去
  - 3.把数据请求回来后,获取数据赋值给tableData,有了数据后,按照要求构建列表el-table
- ==最终效果图如下==: 
    [![pAWj7Cj.png](https://s21.ax1x.com/2024/11/21/pAWj7Cj.png)](https://imgse.com/i/pAWj7Cj)
- ==代码重点解析:==
  - ==**1.后端的2个模型构建:**==
  - ==1.1 公司数据模型==
  - CompanyRouter.js(==记得app挂载,复用度极高,没有删除功能==)
    ```
        var express = require('express');
        var CompanyRouter = express.Router();
        var CompanyController = require("../controllers/CompanyController.js")

        // 获取数据的 get
        CompanyRouter.get("/adminapi/companys",CompanyController.getList)

        // 添加用户的,数据发送方式和getList不同,这是post请求
        CompanyRouter.post("/adminapi/companys",CompanyController.addList)
        // 动态路由,:id是占位符,无论占位符输入什么都可以访问到/adminapi/users/
        CompanyRouter.put("/adminapi/companys/:id",CompanyController.updateList)


        module.exports = CompanyRouter // 记得app.js中注册
    ```
  - CompanyController.js(==更新数据函数有2个参数,id和请求体==)
    ``` 
        const CompanyService = require("../service/CompanyService")

        module.exports ={
            // 2个系统参数,接受前端的请求req合返回给前端的数据res,再向sevice发起一波请求,这是异步
            // 1.获取数据
            async getList(req,res){
                var result = await CompanyService.getList()
                res.send(result) // 把请求的数据传回给前端
            },
            // 2.添加数据
            async addList(req,res){
                var result = await CompanyService.addList(req.body)
                res.send(result) // 把请求的数据传回给前端
            },
            // 3.更新数据
            async updateList(req,res){
                var result = await CompanyService.updateList(req.params.id,req.body) // 传递path中的id信息和请求体
                res.send(result) // 把请求的数据传回给前端
            },
        }
    ```
  - CompanyService.js
    ```
        const CompanyModel = require("../model/CompanyModel")

        module.exports = {
            // 下面均为mongodb数据库操作

            getList() {
                return CompanyModel.find()
            },

            async addList(data) {
                // 处理重复文件的逻辑: 更新操作,无论有没有,直接更新,有的话即使重复名字也只是覆盖,没有的话就创建
                // data是公司数据,是一个数组,有多个数据,所以要遍历
                for (let i of data) {
                    await CompanyModel.findOneAndUpdate({
                        title: i.title, // 根据查询名字
                    }, {
                        $set: i // 查到,更新
                    }, {
                        upsert: true, // 查不到,插入
                    })
                }
                return []
            },

            async updateList(id,data){
                return CompanyModel.findByIdAndUpdate(id,data) // 根据id找到对应数据,更新数据为data
            }
        }
    ```
    - ==保留了查重机制,不允许重复添加一个excel文件的数据,其中改变的是,这次数据的添加是一个对象数组,我们从excle文件获取了一组的班级名字,在查重以及添加操作中,应遍历数组,一项一项地单个加进去==
    - CompanyModel.js(==改变了Schema的标准==)
    ```
        const mongoose = require("mongoose")
        const Schema = mongoose.Schema

        const CompanyType = {
            "title": String, // 公司名字
            "interview": String // 面试题
        }
        // company ---> companies
        const CompanyModel = mongoose.model("company",new Schema(CompanyType))

        module.exports = CompanyModel
    ```
    - 1.2==学生数据的模型==
    - CompanyStudentRouter.js(==记得app.js中注册,只有存post和取get==)
        ```
            var express = require('express');
            var CompanyStudentRouter = express.Router();
            var CompanyStudentController = require("../controllers/CompanyStudentController.js")

            // 获取数据的 get
            CompanyStudentRouter.get("/adminapi/companystudents",CompanyStudentController.getList)

            // 添加用户的,数据发送方式和getList不同,这是post请求
            CompanyStudentRouter.post("/adminapi/companystudents",CompanyStudentController.addList)
            // 动态路由,:id是占位符,无论占位符输入什么都可以访问到/adminapi/users/
            // StudentRouter.put("/adminapi/companys/:id",StudentController.updateList)

            module.exports = CompanyStudentRouter // 记得app.js中注册
        ```
    - CompanyStudentController.js(==没有新东西==)
        ```
            const CompanyStudentService = require("../service/CompanyStudentService")

            module.exports ={
                // 2个系统参数,接受前端的请求req合返回给前端的数据res,再向sevice发起一波请求,这是异步
                async getList(req,res){
                    var result = await CompanyStudentService.getList()
                    res.send(result) // 把请求的数据传回给前端
                },
                async addList(req,res){
                    var result = await CompanyStudentService.addList(req.body)
                    res.send(result) // 把请求的数据传回给前端
                }
            }
        ```
    - CompanyStudentService.js
        ```
            const CompanyStudentModel = require("../model/CompanyStudentModel")

            module.exports = {
                // 下面均为mongodb数据库操作

                getList() {
                    return CompanyStudentModel.find()
                },

                async addList(data) {
                    // 处理重复文件的逻辑: 更新操作,无论有没有,直接更新,有的话即使重复名字也只是覆盖,没有的话就创建
                    
                    for (let i of data) {
                        await CompanyStudentModel.findOneAndUpdate({
                            studentname: i.studentname, 
                            company: i.company
                        }, {
                            $set: i // 查到,更新
                        }, {
                            upsert: true, // 查不到,插入
                        })
                    }
                    return []
                },
            }
        ```
        - ==对就业学生的数据进行查重,遍历数据,一个一个查,查重标准:当学生名字和公司名字都一样时,认为这是个重复数据==
        - 注意: 这里的数据样本很少,所以不用很严谨,常规操作应当录入更多的信息防止重复,比如学号,毕业院校,公司id等
    - CompanyStudentModel.js
        ``` 
            const mongoose = require("mongoose")
            const Schema = mongoose.Schema

            const CompanyStudentType = {
                "company": String, // 公司名字
                "employ_date": String, // 雇佣日期
                "salary": String, // 薪资
                "studentname": String // 学生姓名 
            }
            // companystudent ---> companystudents
            const CompanyStudentModel = mongoose.model("companystudent",new Schema(CompanyStudentType))

            module.exports = CompanyStudentModel    
        ```
    - ==**学生数据的录入技巧**: 属性与excel每列的标题名一样,这样方便录入数据,即从excel提取出数据后,可以直接录入数据库对应的同名属性中==
- 最终效果图(==下面分别为学生就业数据库和公司名数据库==)
  [![pAWf6aV.png](https://s21.ax1x.com/2024/11/21/pAWf6aV.png)](https://imgse.com/i/pAWf6aV)
  [![pAWfyV0.png](https://s21.ax1x.com/2024/11/21/pAWfyV0.png)](https://imgse.com/i/pAWfyV0)
- ==2.构建el-table列表==
  - 2.1 搜素功能, search + includes() + 计算属性computedTableData
  - 2.2 常规列表, tem自定义,一列公司名,一列双按钮
  - 2.3 **==重点: 2个按钮的功能实现,一个是更新面试题,涉及新组件,一个是预览面试题==**
  - ==2.3.1更新面试题的实现==
  - 面试功能: 点击更新题库按钮,弹出dialog,内部的内容是一个新组件---==富文本编辑器==
  - 效果图: [![pAWvfzR.png](https://s21.ax1x.com/2024/11/21/pAWvfzR.png)](https://imgse.com/i/pAWvfzR)
  - 新组件介绍及使用: 
    - 在npmjs中,搜索wangeditor组件(开源 Web 富文本编辑器，开箱即用，配置简单。支持 JS Vue React)
    - 需要npm下载,当前有4和5两个版本,推荐5,都用一下
    - v5版本更好地适配了多个框架,例如vue,react,在文档中有模板(基于Vue React),我们直接使用提供的模板
  - v4版本:(==v4 下载: npm i wangeditor --save==)
  - Editor4.vue(==简单看看==)
    ```
        <template>
            <div id="div1"></div>
        </template>

        <script setup>
            // v4 下载: npm i wangeditor --save
            import { onMounted } from 'vue';
            import E from 'wangeditor'

            // 等待dom节点挂载完毕后方可初始化,所以要在onMounted中初始化new
            onMounted(() => {
                const editor = new E( document.getElementById('div1') )
                editor.create()
                // 文本编辑器的初始化
                editor.txt.html("<p>hello kerwin!</p>")
                // 监听文本编辑器内的内容变化,最后输出html代码字段(String类型),将来存入CompanyModel的interview属性
                editor.config.onchange = (newhtml)=>{
                    console.log(newhtml)
                }
            })
        </script>
    ```
    - ==**v5版本(推荐)**==
    - v5 下载2个组件,本体组件和适配vue的附加组件
      - npm install @wangeditor/editor --save 
      - npm install @wangeditor/editor-for-vue@next --save
    - 代码示例(==文档中有模板,复制过来,注意: 模板中不是"script + setup" ,我们改为setup模式==)
    ```
    <template>
        <div style="border: 1px solid #ccc">
            <!-- :editor="editorRef": 编辑器示例,注意,在Editor组件创建完毕后再初始化赋值,在其@onCreated="handleCreated"的处理函数内 -->
            <!--  :mode="mode": 编辑器模式 -->
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                :mode="mode" />
            <!-- v-model="valueHtml" 双向绑定的编辑器内容,可通过赋值实现初始化 -->
            <!-- @onChange: 在编辑区内容改变时自动调用; @onBlur: 失去焦点时才触发,更加'懒惰' -->
            <!-- @onCreated="handleCreated": 创建Editor组件时调用这个函数 -->
            <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
                :mode="mode" @onCreated="handleCreated" @onChange="handleChange" />
        </div>
    </template>

    <script setup>
        import '@wangeditor/editor/dist/css/style.css' // 引入 css

        import { onBeforeUnmount, ref, shallowRef } from 'vue'
        import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

        // 编辑器实例，必须用 shallowRef,浅层ref,只能绑定简单数据类型,或者复杂数据类型的最外层数据; 而ref可以递归遍历到复杂数据的深层结构
        const editorRef = shallowRef()

        // 获取父传子,内容是上次提交dialog后,编辑区的内容
        const props = defineProps(["content"])

        // 内容 HTML 双向绑定到Editor的内容 可以初始化内容
        const valueHtml = ref("")

        // 子传父事件获取
        const emit = defineEmits(["event"])
        const toolbarConfig = {}
        const editorConfig = { placeholder: '请输入内容...' }
        // 模式mode
        const mode = "default" // 默认模式,还有简单模式'simple' 

        // 编辑器Editor创建时,触发此函数
        const handleCreated = (editor) => {
            console.log("create")
            editorRef.value = editor // 记录 editor 实例，重要！
            // 每次打开更新题库重新初始化编辑组件Editor时,都对编辑区的内容(valueHtml.value)进行1次初始化,防止刷新丢失上次的内容
            // 这里有个坑: 需要等待editor实例创建后再对里面双向绑定属性valueHtml赋值,而这个函数handleCreated执行时间在onMounted后面,所以直接写在实例创建好代码的下面,保证安全
            valueHtml.value = props.content // 获取父信息
        }

        // 编辑区内容改变触发事件函数 onBlur类型
        // 这里有坑,我们使用onChange,这个函数更新数据的速度比dialog点击确认的handleUpdateConfirm更快,可以实时更新数据后再发送到后端
        const handleChange = () => {
            // console.log(valueHtml.value)
            emit("event", valueHtml.value) // 子传父
        }

        // 组件销毁时，也及时销毁编辑器
        onBeforeUnmount(() => {
            console.log("destory")
            const editor = editorRef.value
            if (editor == null) return
            editor.destroy()
        })
        </script>
    ```
    - 1.编辑器的tem由两部分组成,分别是Toolbar和Editor,分别负责工具栏和编辑区域
    - ==Toolbar中的属性:==
      - editor="editorRef": 编辑器示例,注意,在Editor组件创建完毕后再初始化赋值,在其@onCreated="handleCreated"的处理函数内
      - :mode="mode": 编辑器模式
    - ==Editor中的属性:== 
      - v-model="valueHtml" 双向绑定的编辑器内容,可通过赋值实现初始化
      - @onChange: 在编辑区内容改变时自动调用; @onBlur: 失去焦点时才触发,更加'懒惰' (==这里有坑,两个的函数的触发时间不同,后面讲==)
      - @onCreated="handleCreated": 创建Editor组件时调用这个函数
    - ==2.编辑器监听输入,@onChange="handleChange"==
    valueHtml双向绑定了输入的内容,通过监听,触发函数内部的子传父,把编辑器的输入内容发送给父组件,父组件在把这些题库数据发送给这个公司的数据库(interview部分),存储题库数据
    - ==重点代码截取==
        ```
            // 子传父(子组件)
            const handleChange = () => {
                // console.log(valueHtml.value)
                emit("event", valueHtml.value) // 子传父
            }
        -------------------------------------------------
            // 父接受子信息(父组件),@event="handleUpdateEditorEvent
            <Editor @event="handleUpdateEditorEvent" :content="currentItem['interview']" v-if="dialogUpdateVisible"></Editor>
        ```
    - ==@event="handleUpdateEditorEvent==
        ```
        const handleUpdateEditorEvent = (data) => {
            // 把当前点击的数据interview属性值改为编辑区的内容
            // currentItem是点击此数据时获取的scoped.row
            currentItem.value["interview"] = data 
        }
        ```
    [![pAWLlHe.png](https://s21.ax1x.com/2024/11/21/pAWLlHe.png)](https://imgse.com/i/pAWLlHe)
    - 子传父后,父组件临时存储信息,接下来处理'确认'按钮,即dialog的确认按钮,通过这个函数,我们向数据库提交函数(==**坑来了**==)
        ```
            // dialog,更新确认按钮函数
            const handleUpdateConfirm = async () => {
                // 当点击确定提交按钮时,提交编辑区的信息给后端,路径中传递了_id,用于确定是更新的哪个公司的题库
                await axios.put(`/adminapi/companys/${currentItem.value._id}`, currentItem.value)

                dialogUpdateVisible.value = false
                // 这里没使用 await getList(),是因为子传父已经在handleUpdateEditorEvent函数内部把编辑区内容(currentItem.value["interview"])更新了,这里相当于优化的代码,减少了1次后端请求
                // 之前不这么做的原因是数据太多了麻烦,这里就一个数据data
            }
        ```
    - ==坑: 这里的currentItem.value时我们向后端发送的请求体,内部是编辑区内容,但是如果我们的在Editor组件内使用的监听函数是onBlur,那么你会发现,这个数据为空,==**原因是,onBlur监听内容触发子传父的速度慢于提交axios的速度,导致还没给currentItem.value赋值编辑内容,就把空数据发送出去了**==
    - ==解决:== 使用onChange,这个函数更新数据的速度比dialog点击确认的handleUpdateConfirm更快,可以实时更新数据后再发送到后端
        > 阶段总结: 这一套流程为,我们点更新题库按钮,弹出dialog框,内部是文本编辑器,当我们在文本编辑器中输入内容时,通过onChange监听函数和双向绑定的属性valueHtml,通过子传父把数据发送给父组件,点击dialog的确认按钮时,触发父组件的handleUpdateConfirm函数,把子信息发axios给后端,保存在公司数据库的interview属性中
    - ==父传子的必要性 :content="currentItem['interview']==
    - 把当前对象的interview属性值再传回去,防止页面刷新后,丢失编辑区的信息,如果没有就是undefined 
        ```
            <Editor @event="handleUpdateEditorEvent" :content="currentItem['interview']" v-if="dialogUpdateVisible"></Editor>

            --------子接受父信息-----------------------
            // 子组件 js
            // 获取父传子,内容是上次提交dialog后,编辑区的内容
            const props = defineProps(["content"])

            // 编辑器Editor创建时,触发此函数
            const handleCreated = (editor) => {
                console.log("create")
                editorRef.value = editor // 记录 editor 实例，重要！
                // 每次打开更新题库重新初始化编辑组件Editor时,都对编辑区的内容(valueHtml.value)进行1次初始化,防止刷新丢失上次的内容
                valueHtml.value = props.content // 获取父信息
            }
        ```
    - ==这里有个坑: 需要等待editor实例创建后再对里面双向绑定属性valueHtml赋值,而这个函数handleCreated执行时间在onMounted后面,所以直接写在实例创建好代码的下面,保证安全==
    > 我们通过获取此公司的后端数据库中的interview题库部分的数据,实现了编辑区的内容保存,不会因为页面刷新而丢失上次的编辑内容
    - ==**大坑:(完成上述子父互传后)**==
    - ==现象==: 当我们编辑好一个公司的题库内容时,再更新其他公司的题库,会发现所有公司的题库编辑内容都一样
    - ==原因==: 因为我们对编辑器内容的赋值是在组件内的@onCreated函数中执行的,这个函数只有在组件Editor重新创建时才会执行,而我们打开不同公司的题库,只会在父传子的:content中发生了点变化,组件只会执行更新生命周期,不会重新走创建流程,所以也就不执行@onCreated函数,也就不会重新把新的父信息赋值给编辑区内容valueHtml,从始至终我们一直在用一个编辑器,他没有被销毁,导致之后我们更新数据就只会把内容的数据双向绑定到valueHtml属性上,然后大家(所有的公司)共用一个编辑器,所以内容都一样,也都同步更新
    - ==解决(之前用过)==: 使用v-if (v-if="dialogUpdateVisible"),每次都重新创建,每次也都重新执行@onCreated,每次也都重新赋值,而后端早就记录了上次编辑的内容了,所以即使editor组件销毁了,内容也不会因此丢失!
    ``` 
        <Editor @event="handleUpdateEditorEvent" :content="currentItem['interview']" v-if="dialogUpdateVisible"></Editor>
    ```
    > 总结: 至此所有关于更新题库的内容完成,每个公司都有自己独立的interview记录自己的题库,通过子父互传,实现了编辑器内容与数据库的互通有无,最后通过创建/销毁编辑器的办法,独立各个文本编辑器的内容
- ==3.预览题库的功能: 很简单了==
    ```
        // el-column-item内
        <el-button round type="primary" @click="handlePreview(scope.row)">面试题</el-button>

        <!-- 预览对话框(点击面试题按钮弹出) -->
        <el-dialog v-model="dialogPreviewVisible" title="预览题库" width="80%">
            <!-- 把内容的以HTML格式显示出来,使用v-html显示(特别信任这个后端的数据), {{}}不行,为了防止脚本攻击,vue设置了阻拦 -->
            <!-- 新组件,卡片组件,样式更好看,shadow属性改为hover,鼠标移动上去后,显示阴影 -->
            <el-card shadow="hover">
                <div v-html="currentItem.interview"></div>
            </el-card>
        </el-dialog>

        // 预览面试题函数
        const handlePreview = (data) => {
            // console.log(data.interview) // 可以拿到当前对象的面试题内容
            currentItem.value = data // 记录当前对象
            dialogPreviewVisible.value = true
        }
    ```
    - 1.获取当前公司题库数据 interview
    - 2.弹出新的dialog,内部内容为编辑器内容,使用新组件el-card(美观)
    - 3.为了实现html样式,使用了v-html
### 公司大数据
- 页面样板图如下(CompanyData.vue),和学生大数据差不多,不过用了新的组件
    [![pAWjXrV.png](https://s21.ax1x.com/2024/11/21/pAWjXrV.png)](https://imgse.com/i/pAWjXrV)
- 大体布局tempalte:
  - 整体的三栏布局还是24栏布局组件layout/el-row,
  - 我们可以通过echarts完成这个页面的构建,但是太麻烦了,==所以使用了新组件DataV的改版DataV-Vue3(已收藏)==,前者框架作者多年未更新了,后者是社区有人写的完善版本,更适配vue3,不过这个网站常常崩溃404,可以结合DataV原网站的vue2部分继续使用,新作者为了切合原版,很多模板使用方式几乎完全一样
- ==三个板块都有内部组件进一步完成,我们先进行整体布局结构规划==
  ```
    <template>
        <div id="companydata">
            <!-- 24栏组件,三等分,间距20px -->
            <!-- 整体使用datav大屏组件 边框10,里面的三个部分,两侧都是边框11,中间使用的是边框8 -->
            <dv-border-box10>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <dv-border-box11 title="最受欢迎的公司" :title-width="400" :animate="false">
                            <!-- 父传子: 传递入职公司学生的各项数据信息 -->
                            <!-- 设置class属性,目的是设置css样式,三个组件都共有这个class属性,这个class属性会透传到子组件,css样式也同理 -->
                            <!-- 设置好定位后的内容可以正常地显示在内容中心,而不是左上角 -->
                            <Welcompany :datalist="datalist" class="company_data"></Welcompany>
                        </dv-border-box11>
                    </el-col>
                    <el-col :span="8">
                        <!-- dur: 单次动画时长(秒) -->
                        <dv-border-box8 :dur="5">
                            <!-- 装饰7 -->
                            <dv-decoration7 style="width:100%;height:50px;">
                                <div style="font-size:20px; color: white;">最不差钱的公司</div>
                            </dv-decoration7>
                        </dv-border-box8>
                    </el-col>
                    <el-col :span="8">
                        <dv-border-box11 title="最近入职的公司" :title-width="400" :animate="false"> </dv-border-box11>
                    </el-col>
                </el-row>
            </dv-border-box10>
        </div>
    </template>

    <script setup>
        // npm install @kjgl77/datav-vue3 下载后,在main.js中挂载

        // 和学生大数据思路一样,三个部分的数据在这里统一获取,通过父传子提供给各个组件
        import axios from 'axios'
        import { onMounted, ref } from 'vue';
        // 导入三个部分的组件
        import Welcompany from '../../components/company/Welcompany.vue'

        const datalist = ref([])
        onMounted(() => {
            getList()
        })

        const getList = async () => {
            var { data } = await axios.get("/adminapi/companystudents") // 获取入职公司学生的各项数据信息
            datalist.value = data
        }
    </script>

    <style scoped lang="scss">
        #companydata {
            background: url('../../assets/bg.png') no-repeat center;
            background-size: 100% 100%;
            padding: 10px;
            height: 84vh;
            // 三个组件的内容区域的css设置
            .company_data {
                position: absolute;
                top: 80px;
                width: 100%;
                color: white;
                text-align: center;
            }
        }

        .el-row {
            height: 600px;
            padding: 30px;
        }
    </style>
  ```
  - ==dv-border-boxXX: 这就是新组件DataV-Vue3,我们选取的边框样式==
  - 24栏不再赘述,三等分后,加了边距20px,背景图等样式设置同理
  - DataV-Vue3组件的使用
    - 下载: `npm install @kjgl77/datav-vue3`
    - main.js挂载: (==至此src内所有的vue文件都可以用了==)
    ```
        // 可视化组件DateV-Vue3引入
        import DataVVue3 from '@kjgl77/datav-vue3'

        .....
        .use(DataVVue3) // 众多use中的一项
        ....
    ```
  - 最后还有对3栏内组件的class样式设置,主要是内容的居中,字体的颜色,通过透传进入组件内部影响css格式
### 公司大数据-WelCompany组件
- 最左侧的图例: components/company/Welcompany.vue
- ==使用了胶囊柱图,config接受数据,调整样式,**为了响应式数据,我们使用计算属性computedComfig来对config数据进行配置**==
    ```
    <template>
        <dv-capsule-chart :config="computedComfig" style="width:100%;height:400px; box-sizing: border-box; padding: 20px;" />
    </template>
    ```
  - :config是柱状图数据来源的关键,配置的参数格式如下
    ```
        const config = {
            data: [
                {
                name: '南阳',
                value: 167
                },
                {
                name: '周口',
                value: 123
                },
                {
                name: '漯河',
                value: 98
                },
                {
                name: '郑州',
                value: 75
                },
                {
                name: '西峡',
                value: 66
                },
            ],
            colors: ['#e062ae', '#fb7293', '#e690d1', '#32c5e9', '#96bfff'],
            unit: '万元',
        }
    ```
    > 其中data是柱状图的数值,name是X轴名字,value就是Y轴值,colors是颜色版,unit是单位显示
- 重点在于data数据的配置,配置要求为 name->公司名 value->就职学生人数
- 父传子信息: datalist 入职公司学生的各项数据信息
  ```
        <Welcompany :datalist="datalist" class="company_data"></Welcompany>

        js:
        const datalist = ref([])
        onMounted(() => {
            getList()
        })
        const getList = async () => {
            var { data } = await axios.get("/adminapi/companystudents") // 获取入职公司学生的各项数据信息
            datalist.value = data
        }
  ```
- 子组件: 接受数据,整理数据
  ```
    <script setup>
        import { computed } from 'vue';
        import _ from 'lodash' // 很好用的js库,内含各种算法,方法
        const props = defineProps(["datalist"])
        // 加工props数据,作为data的参数,风格应为: name->公司名;value->就职学生人数
        
        const computedComfig = computed(() => {
            // 在这里对数据二次加工成对应的格式
            let { datalist } = props
            // 使用lodash,分组方法,groupBy() 第一个参数是要分组的对象,第二个参数是依据什么进行分组(每一项的company属性),即按照公司把datalist进行分组
            // 注意: 第二个参数的item会自动检索datalist的每一项数据
            // console.log(_.groupBy(datalist, item => item.company)) 
            // 结果是对象,每个item由"属性(公司名):属性值(数组)"组成,其中数组内部是对象,每个对象是就职于本公司的学生信息
            let groupObj = _.groupBy(datalist, item => item.company)
            let configData = []
            for(let item in groupObj){
                configData.push({
                    name: item, // key 公司名
                    value: groupObj[item].length // groupObj[item]=value,学生人数就取长度length
            })
        }
        // 最后倒序排序(大到小),基于configData内部的value属性排序,截取前8个公司
        const data = configData.sort((item1,item2)=>item2.value - item1.value).slice(0,8)

        return {
            data, // 简写
            colors: ['#e062ae', '#fb7293', '#e690d1', '#32c5e9', '#96bfff'],
            unit: '人数',
        }
    })
    </script>
  ```
  - ==问题: 接受父传子的信息datalist打印值为空==
  - ==原因:== 我们数据获取是异步的(==datalist是通过getList异步axios请求的==),当组件构建完成时,异步数据还没请求过来,即使是onMounted也早于数据的异步获取
  - ==解决:== 使用计算属性,特性是随着数据的变化实时更新,所以即使一开始没有数据,只要后期数据请求过来了,计算属性会帮我们响应式地更新数据
  - lodash库: 很好用的js库,内含各种算法,方法,==之前我们用过_.groupBy功能==
  - 看注释即可,主要是把学生按照公司进行分组,然后进行排序(倒序),最后截取前8为作为显示数据,其中把对应的数据按照规定好的格式push进对象data
  - lodash操作并排序后的效果图:
  [![pAWL8Nd.png](https://s21.ax1x.com/2024/11/21/pAWL8Nd.png)](https://imgse.com/i/pAWL8Nd)
  [![pAWL3AH.png](https://s21.ax1x.com/2024/11/21/pAWL3AH.png)](https://imgse.com/i/pAWL3AH)
### 公司大数据-RichCompany
- 处理中间页面的数据: (新组件,排名轮播表(自动对数据排序))
  ```
    <template>
        <!-- 排名轮播表(自动对数据排序),css样式复制welcompany.vue -->
        <dv-scroll-ranking-board :config="computedConfig"
            style="width:100%;height:400px; box-sizing: border-box; padding: 20px;" />
    </template>

    <script setup>
    // 和welcompany一样
    import _ from 'lodash' // js算法库,数据分组使用
    import { computed } from 'vue'
    const props = defineProps(["datalist"])
    // 和welcompany差不多,且不用排序操作
    const computedConfig = computed(() => { // 响应式接受数据,不会受异步影响(datalist是异步获取的)
        let { datalist } = props // 解构父信息
        let groupObj = _.groupBy(datalist, item => item.company)
        // console.log(groupObj)
        let configData = []
        for (let item in groupObj) {
            configData.push({
                name: item,
                // 公司入职学生平均值 = 入职学生工资总合/入职学生人数 (注意,salary在后端是字符串格式,转为数字类型)
                value: groupObj[item].reduce((total, item) => total + Number(item.salary), 0) / groupObj[item].length
            })
        }
        // console.log(configData)
        
        // 这个组件可以自动排序,所以直接把数据放进去即可
        return {
            data: configData,
            color: 'rgb(29,193,245)', // 进度条颜色
            unit: "元"
        }
    })
  ``` 
  - 基本和左边的Welcompany.vue一样,都进行了相同数据的父传子和css样式设置
  - data数据的样板:
    ```
        // value: 记录本公司入职学生的工资平均值,做排序; name公司名
        // const config = {
        //     data: [
        //         {
        //             name: '周口',
        //             value: 55
        //         },
        //         {
        //             name: '南阳',
        //             value: 120
        //         },
        //         {
        //             name: '西峡',
        //             value: 78
        //         },
        //          ........
        //     ],
        //     color: 'rgb(29,193,245)', // 进度条颜色
        //     unit: "元"
        // }
    ```
  - 再同理通过lodash分组后,对每个公司的平均学生薪资进行计算,唯一要注意的是salary是字符串类型,所以提前转化为number其余都很简单
### 公司大数据-EntryCompany
- 最后一个组件,右边的信息,复用也很高,父传子数据和css样式复用
- 唯一区别的也是data的数据整理,这里的data数据格式要求是一个二维数组,使用之前用过的Object.entries() 把对象的key和value转化为对应的二维数组
  ```
    // 数据模板
    // const config = {
    //     header: ['学生', '公司'],
    //     data: [
    //         ['行1列1', '行1列2', '行1列3'],
    //         ['行2列1', '行2列2', '行2列3'],
    //         ['行3列1', '行3列2', '行3列3'],
    //         ['行4列1', '行4列2', '行4列3'],
    //         ['行5列1', '行5列2', '行5列3'],
    //         ['行6列1', '行6列2', '行6列3'],
    //         ['行7列1', '行7列2', '行7列3'],
    //         ['行8列1', '行8列2', '行8列3'],
    //         ['行9列1', '行9列2', '行9列3'],
    //         ['行10列1', '行10列2', '行10列3'],
    //     ],
    //     index: false, // index 显示行号 Boolean
    //     columnWidth: [50], // 列宽
    //     align: ['center'], // 列对齐方式
    //     // headerBGC 表头背景色	String
    //     // oddRowBGC 奇数行背景色 String
    //     // evenRowBGC 偶数行背景色 String
    //     headerBGC: 'rgba(0,0,0,0)', // 统一透明
    //     oddRowBGC: 'rgba(0,0,0,0)',
    //     evenRowBGC: 'rgba(0,0,0,0)',
    //     // carousel	轮播方式 String	'single'/'page'(一个一个滚动/一页一页滚动)	
    //     carousel: 'page',
    //     waitTime: 4000 // 等待时间(ms) Number
    // }
    </script>

  ```
- ==根据入职日期进行排序,日期越大,代表最近入职,就在上面,日期employ_date数据是字符串格式,无法进行比较,需要转化为时间戳,Date.parse(String) --> 转化为Number时间戳,根据这个排序即可,其余没有太大区别了==
- 记住英文:  Date 日期; Data 数据
- 代码:
  ```
    <template>
    <!-- datav-vue3 轮播图 -->
    <div demo-bg>
        <!-- 使用计算属性configData,复用前面两个组件的css样式 -->
        <dv-scroll-board :config="configData" style="width:100%;height:400px; box-sizing: border-box; padding: 20px;" />
    </div>
    </template>


    <script setup>
    import { computed } from 'vue';

    // 同理,计算属性处理出合适的数据结构
    const props = defineProps(["datalist"])
    const configData = computed(() => {
        let { datalist } = props
        // 根据入职日期进行排序,日期越大,代表最近入职,就在上面
        // 日期employ_date数据是字符串格式,无法进行比较,需要转化为时间戳
        // Date.parse(String) --> 转化为Number时间戳
        // 倒序排序 item2 - item1 (大到小)
        // 记住英文:  Date 日期; Data 数据
        let data = datalist.sort((item1, item2) => Date.parse(item2.employ_date) - Date.parse(item1.employ_date))
        // console.log(data)

        // data是二维数组的格式 使用之前用过的Object.entries() 把对象的key和value转化为对应的二维数组
        // 所以我们要构建合适的对象结构,然后利用这个方法转为对应的二维数组
        const configObj = {} // 组装合适的对象结构
        data.forEach(item=>{ // 遍历data数组的每一项学生就业信息
            // 对象的key(学生名) = 对象的value(公司名)
            configObj[item.studentname] = item.company 
        })
        console.log(Object.entries(configObj)) // 结构正确的二维数组

        return {
            header: ['学生', '公司'],
            data: Object.entries(configObj),
            index: true, // index 显示行号 Boolean
            columnWidth: [50], // 列宽
            align: ['center'], // 列对齐方式
            // headerBGC 表头背景色	String
            // oddRowBGC 奇数行背景色 String
            // evenRowBGC 偶数行背景色 String
            headerBGC: 'rgba(0,0,0,0)', // 统一透明
            oddRowBGC: 'rgba(0,0,0,0)',
            evenRowBGC: 'rgba(0,0,0,0)',
            // carousel	轮播方式 String	'single'/'page'(一个一个滚动/一页一页滚动)	
            carousel: 'page',
            waitTime: 4000 // 等待时间(ms) Number
        }
    })

  ```

### 系统授权token验证
- ==截至现在,我们项目的安全隐患问题很大,所有人都可以轻易访问我们的后端,随意插入数据等,**所以需要设置token去限制不合法的访问,保护我们的后端数据**==
- 解决: 在npmjs中直接搜索jsonwebtoken即可找到,是个密钥多功能组件,==简单地使用jsonwebtoken的部分功能,实现基础的token生成业务和校验业务==
- ==使用jsonwebtoken构建token的功能:==
  - **token的相关处理涉及后端,所以在后端的myappServer的终端中下载**: `npm install jsonwebtoken`
  - ==在myappServer创建util文件夹,创建JWT.js文件,用来封装jsonwebtoken的功能函数==,供其他组件使用
    - ==JWT.js==
    - 先简单的组件的token创建与检验的函数用法:
    ```
        // 1.引入
        const jsonwebtoken = require('jsonwebtoken')
        const secret = "kerwin" // 额外加密的数据,盐

        // 2.sign内置方法,生成token
        var token = jsonwebtoken.sign({
            data: 'foobar' // 要加密的数据
        }, secret, { expiresIn: '1000ms' }); // secret 额外加密; expiresIn保质期 1s
        console.log(token)

        // 3.verify内置方法,校验token
        // 解析需要密钥token和盐secret
        console.log(jsonwebtoken.verify(token,secret)) // 校验密钥token是否过期,立即校验,没过期,会解析出原来的数据
        // 延时2s
        setTimeout(()=>{
            // console.log(jsonwebtoken.verify(token,secret)) // TokenExpiredError: jwt expired 密钥过期错误
            // 为了不是编译器报错终端,使用try-catch捕捉
            try{
                console.log(jsonwebtoken.verify(token,secret))
            }catch(e){
                console.log("密钥过期了")
            }
        },2000)
    ```
    - ==简单介绍密钥创建方法sign和密钥校验方法verify,我们就用这两个方法去封装==
    - secret: 额外加密,称为'盐',==十分重要,如果有人偷取了你的token,没有盐,他也无法解析内部的数据,相当于一个保险==
    - nodejs打印密钥测试:
    [![pAfVEp6.png](https://s21.ax1x.com/2024/11/22/pAfVEp6.png)](https://imgse.com/i/pAfVEp6)
  - ==**正式封装JWT函数**==
  ```
    const jsonwebtoken = require('jsonwebtoken')
    const secret = "kerwin" // 额外加密的数据,盐

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
  ```
  - ==这里生成密钥时,盐是我们JWT函数提供的,也就是用户如果直接使用你的工具组件进行密钥生成,他是不知道盐具体是什么的,所以盗窃者同理,也不知道,所以只有正规途径使用JWT的解析函数verfiy才能解析信息==
- 使用JWT去生成token: 登录时,我们在后端设置过登录校验功能,在UserController.js内部,==思路: 在登陆时,校验好用户信息后,把用户的username和_id封装为密钥,保质期1天,并把密钥封装如请求头的Authorization中,(潜规则命名为Authorization,可以随意起,但不建议),登陆成功后,会有一个post请求的请求头中有Authorization属性,内部的值就是token==
  [![pAfVV1K.png](https://s21.ax1x.com/2024/11/22/pAfVV1K.png)](https://imgse.com/i/pAfVV1K)
  ```
    const JWT = require("../util/JWT") // 记得引入

    ........
    async login(req, res) {
        var result = await UserService.login(req.body)
        if (result.length > 0) {
            // 不要返回密码
            let { _id, username, role } = result[0]
            // 引入JWT使用其内部创建token的函数,把用户的_id和username封装,进行token加密
            const token = JWT.generate({
                _id, // 简写
                username
            },"1d") // 1d = 1day
            // 把token存在请求头中,潜规则命名为Authorization(可以随意起,但不建议)
            res.header("Authorization", token)
            res.send({
                ActionType: "OK",
                data: { _id, username, role }// 返回匹配的数据
            })
        } else {
            res.send({
                ActionType: "fail" // 没有数据
            })
        }
    },
  ```
  - 登录成功后众多的axios请求中,打印找到了这个设置过请求头的请求信息
    [![pAfV2B4.png](https://s21.ax1x.com/2024/11/22/pAfV2B4.png)](https://imgse.com/i/pAfV2B4)
### axios拦截器-intercept
- 前提摘要: 我们已经通过jsonwebtoken组件,在第一次登录的时候生成了依次token.接下来要保存到本地localStorage中,然后拦截axios请求,进行token判断
- ==npmjs搜索axios,在里面再搜索intercept,这是axios拦截器,我们在vue跳转axios请求时,需要这个方法的拦截,它会拦截所有的请求(get/post/put/delete.....),所以在myapp/util中创建axios.config.js文件,专门用来处理axios的拦截问题==
- axios拦截器模板 (==注意: 记得在main.js中导入这里的axios的拦截器==)
  ```
    main.js: 
    // 导入axios的拦截器组件,只需要导入
    import "./util/axios.config"
    -----------------------------------
    axios.config.js

    axios.interceptors.request.use(function (config) { // config就是请求头
        // 在发送axios请求前做点什么
        // console.log("请求发送之前")
        const token = localStorage.getItem("token")
        // 给请求头的Authorization赋值token,除了第一次登录还没有在本地存token,之后在登录状态下,进行所有axios请求,都可以在本地存储中获取到token
        config.headers.Authorization = `Bearer ${token}` // 潜规则这么命名

        return config;
    }, function (error) {
        // 请求失败了,拦截错误的信息,先走到这里操作点什么,再在控制台报错
        return Promise.reject(error);
    });

    // axios收到信息拦截器
    axios.interceptors.response.use(function (response) {
        // axios成功发送,并收到信息,在这里做点什么
        // console.log("请求成功,请求信息为",response)
        // 寻找axios请求的请求头内含有密钥的信息(注意: 密钥生成于login校验步骤,所以在登录的时候才能从众多的请求信息的请求头中获取到authorization)
        const {authorization} = response.headers
        // 如果能捕捉到密钥信息,就存储到本地的token属性中,每次存储保证了token的新鲜性
        authorization && localStorage.setItem("token",authorization)
        return response;
    }, function (error) {
        // axios请求失败,返回了报错信息,在这里做点什么
        const {status} = error.response // 获取错误信息状态码
        if(status === 401){ // 401代表token过期了
        localStorage.removeItem("token") // 移除本地存储的过期token
        window.location.href = "#/login" // 暴力跳转到登录页面
        }
        return Promise.reject(error);
    });
  ```
  - 两个拦截:(==所有的axios会先进入这个拦截器的回调函数进行处理,然后再走常规流程==)
    - axios.interceptors.request.use(function (config))
      - config就是请求头
      - ==在发送axios请求前做点什么==
      - function (error): 请求失败了,拦截错误的信息,先走到这里操作点什么,再在控制台报错
    -  axios.interceptors.response.use(function (response))
       -  response就是res,内部含请求信息
       -  ==axios成功发送,并收到信息,在这里做点什么==
       -  function (error):  axios请求失败,返回了报错信息,在这里做点什么
- 1.利用axios拦截器,把第一次登录的token存在本地
- 在axios.interceptors.response.use处理,截取
  ```
    axios.interceptors.response.use(function (response) {
    // 寻找axios请求的请求头内含有密钥的信息(注意: 密钥生成于login校验步骤,所以在登录的时候才能从众多的请求信息的请求头中获取到authorization)
    const {authorization} = response.headers
    // 如果能捕捉到密钥信息,就存储到本地的token属性中,每次存储保证了token的新鲜性
    authorization && localStorage.setItem("token",authorization)

    return response;
  }, ....)
  ```
  - 其中authorization变为小写了,我们当时设置大写,因为系统一些操作,变为小写,可以打印response测试
  [![pAfu0SI.png](https://s21.ax1x.com/2024/11/22/pAfu0SI.png)](https://imgse.com/i/pAfu0SI)
- 2,保存本地token后,在发送axios之前,我们给请求头Authorization设置好token,以后我们会用来检测用,即如果你axios请求没有相关token,不予访问
  ```
    axios.interceptors.request.use(function (config) { // config就是请求头
        // 在发送axios请求前做点什么
        // console.log("请求发送之前")
        const token = localStorage.getItem("token")
        // 给请求头的Authorization赋值token,除了第一次登录还没有在本地存token,之后在登录状态下,进行所有axios请求,都可以在本地存储中获取到token
        config.headers.Authorization = `Bearer ${token}` // 潜规则这么命名
        return config;
    }, function (error) {
        // 请求失败了,拦截错误的信息,先走到这里操作点什么,再在控制台报错
        return Promise.reject(error);
    });
  ```
> ==阶段总结:== 第一次登陆,我们封装token到请求头的Authorization中,然后借助拦截器的axios.interceptors.response.use,拦截axios请求,寻找含有token信息的axios请求,找到后存入本地,再通过axios.interceptors.request.use,在所有的axios发送前,给所有的请求头Authorization属性赋值上这个token
- 3.==验证axios请求是否有合格的token==
  - 之前我们所有的路由都设置好了,如果一个个的验证,从router文件夹中一个个添加验证程序会很累,所以直接在myappServer/app.js的所有路由挂载前进行拦截,这样做就不必单独对每个路由进行校验,这里不通过,后面的都白玩
  ```
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

        const token = req.headers["authorization"]?.split(" ")[1] // 使用三目,请求头authorization有内容,就继续下一步,获取token值 'Bearer XXXXXX' 通过空格分割,然后取后面的[1],即token值,而[0]为'Bearer',如果没有,token就为undefined
        if (token) { // 有token
            var payload = JWT.verfiy(token) // 校验token过没过期
            // console.log("校验结果",payload)
            if (payload) { // 成功,获取我们的解析内容,内含_id和username的值
            // 重新生成一个新的token: 这里的token保质期只有5s是为了测试使用
            // 测试效果是: 我们必须连续操作网站,一旦闲置5s后,在操作网站,就会被踢出重新去登录
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
  ```
- ==1.在所有的挂载use前面,保证了统筹拦截,只要这里不过关,后面的路由无法挂载,自然就无法访问==
- 2.不拦截'/adminapi/users/login',这个路由中有我们的登录校验功能,其中使用JWT生成token并存入本地,登录的时候肯定还没有token,这里无条件放行,否则本地中将永远获取不到token
- 3.重新生成token的原因: 
  - 我们在登录一个网站后,会获得一个token,假设token保质期1h,那么如果我们只在登陆时设置一个1h保质期的token,那么用户必须每隔一小时重新登陆一次,即使用户在使用这个网站,当到达1h后,会被强制退出访问,这是不合理的,我们要实现效果是,只要用户在使用网站,我们就不能让token过期
  - ==解决==: 在使用网站进行操作时,会发送许多的axios,拦截后,检查密钥是否过期,如果没有过期,那么重新生成一个新的密钥,这相当于把密钥的保质期重置了,只要这个新密钥的保质期够长,比如1h,那么只有当用户1h不操作网页时,才会被踢出;如果中间用户又操作了网站,那么重新计时1h,也就是用户闲置网站太久才会被踢出重新登陆,只要用户没有闲置网站太久,一直有操作,就会一直更新出新的token,就不会出现前面的问题
  - ==操作==: 使用三目,请求头authorization有内容,就继续下一步,获取token值 'Bearer XXXXXX' 通过空格分割,然后取后面的[1],即token值,而[0]为'Bearer',如果没有,token就为undefined
  - 如果token有效,就进一步解析它,生成payload,如果payload有数据,那就再利用JWT重新封装为新token,此时保质期重置
  - 1.==如果token没有为undefined==,判定此访问内部没有密钥,是非法访问,返回401处理结果,打印相关信息,典型为有人直接通过网站访问数据,所以他的请求头中是没有authorization(密钥的),根据三目运算,此时token为undefined,走else代码区
  [![pAfuaYd.png](https://s21.ax1x.com/2024/11/22/pAfuaYd.png)](https://imgse.com/i/pAfuaYd)
  - 2.==如果payload为空,说明token过期,解析不出数据,返回401信息==
  - 2.1 同时这里要处理axios访问失败的处理,上面当token解析不出数据时,会直接报错,因为代码走不通了,下面的use路由挂载全部失效,会报路由500错误(即没有这个路由),==再回到axios.config.js中,处理axios请求失败的函数==
  ```
        // axios收到信息拦截器
        axios.interceptors.response.use(function (response) {
            ......
        }, function (error) {
            // axios请求失败,返回了报错信息,在这里做点什么
            const {status} = error.response // 获取错误信息状态码
            if(status === 401){ // 401代表token过期了
            localStorage.removeItem("token") // 移除本地存储的过期token
            window.location.href = "#/login" // 暴力跳转到登录页面
            }
            return Promise.reject(error);
        });
  ```
  - 操作为: 删除本地token,前置跳转到登陆页面,让用户重新登录
- ==至此完结,通过检查用户的访问中有没有token来提高安全性==
  - 重点: jsonwebtoken新组件 axios拦截器的使用intercapt 实时更新token保质期等
### loading与nprogress
- 这两个组件是优化网页的,loading是在数据加载时,显示缓冲圈,nprogress是在加载时在页面上方显示进度条
- loading elenment提供的组件
- axios.config.js
  ```
    import { ElLoading } from 'element-plus'
    let loadingInstance = null // 定义变量(不能是const,一会要赋新值),一会用于加载loading效果

    axios.interceptors.request.use(function (config) { // config就是请求头
    // 在发送axios请求前做点什么
    // console.log("请求发送之前")

    // 所有的axios请求发送之前,调用的全屏Loading  
    loadingInstance = ElLoading.service({ fullscreen: true })

    .....

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
       .....
    }, function (error) {
        // axios请求失败,返回了报错信息,在这里做点什么
        loadingInstance.close() // 请求失败了也要关闭缓冲条, close 方法来关闭它
        ......
    });

  ```
  - 看文档,引入定义,然后使用,在axios发送前拦截并全屏启动loading,==axios请求无论成功和失败,都清除loading,否则他会一直显示loading==
  - 注意: 比如在学生大数据页面Home
  - 涉及多个请求axios情况,会多次返回调用loading,如果axios不强调先后顺序,可以promise.all(),等待所有axios结束再进行下一步
    ```
    onMounted(async () => {
        // 函数本身的异步不会影响外面的同步执行,所以外面也要异步
        // 一个页面多个axios,会闪现多次loading组件的显示,每一次axios的'请求与成功'拦截,都会执行一次loading的显示(/util/axios.config.js)
        // 为了loading组件显示更好,把axios所有的请求综合到一起
        // promise的all方法,内部是数组,当数组内的所有请求都完成时,才算完成进入下一步
        // all方法没有先后顺序要求,所以这三个await不能有强制的先后顺序
        // 测试: 在调试窗口把网络调速度整到3g即可
        await Promise.all([getStudentList(),getClassList(),getTagList()])

        // await getStudentList()
        // await getClassList()
        // await getTagList()

        isCreated.value = true
    })
    ```
   - npmjs nprogress 新组件
   - 下载: npm i nprogress
   - ==进度条显示在路由加载前,所以把代码写在路由的加载拦截器,加载完后记得删除==
   - router/index.js
        ```
        // 模块化使用nprogress,文档没有说明
        import NProgress from 'nprogress'
        import 'nprogress/nprogress.css' // 需要引入css

        // 路由拦截(路由守卫): 对所有(beforeEach)没有登录授权的用户统一跳转到Login页面
        router.beforeEach((to,from,next)=>{
            // 开始进度条
            NProgress.start();
            .....
        })

        // 路由跳转之后
        router.afterEach(()=>{
            // 结束进度条
            NProgress.done()
        })
        ```
    > 注意: 官方文档中,没告诉模块化使用方式,一定记住处理引入本体外,还要引入其css相关文件
### 编译部署 
- 编译部署就是把vue的代码打包为浏览器认可的html+css+js的代码,代码构造`npm run build`
- ==现在前端vue/vite使用代理服务器向后端nodejs服务器发送数据,交互数据,一般情况下(数据量较大),前端和后端应该各自配置一个服务器,vite属于开发者服务器,是用于开发的不是正常的服务器; 但在数据量较小的情况下,可以把前端的代码打包为静态资源,放入myappService的静态文件夹public内部,这样只需要开启后端服务器(local 3000)即可运行项目,而且没有跨域问题==

## 升级战略
### 升级战略-学生登录
- ==新增学生身份==,学生身份与教师和admin都不同,有自己独特的路由解构,并且有些路由的操作被限制,比如学生可以看自己的评分,但不能给自己打分等
- 介绍: ==学生拥有的路由有"学生大数据,公司大数据,公司大数据,学生列表(评分页面),**新增个人中心路由**==
- ==1.新建center.vue,并配置相关信息==
  - 1.1==创建vue文件==views/center/ + center.vue , 还是文件夹分类,内部最基本的tem+div解构先测试用
  - 1.2==配置vue的路由path==
    - router/config.js (==路由集中存放地==)
        ```
        const routes = [
            {
                path:"/index",
                name:"Home",
                component:Home
            },
            {
                path:"/center",
                name:"Center",
                component:Center // 记得引入vue
            },
            {
                path:"/user-manage/list",
                name:"UserList",
                component:UserList
            },
            ...
        ]
        ```
  - 2.==新增登录路由 Login.vue==
    - 原先只有讲师和admin两个角色时,登录校验等操作均请求adminapi/users/login路径,依据user表;==现在在students表的基础上,新增一个登录功能==
    - 2.1 首先给students表添加密码属性password
      - StudentService.js 添加学生信息addList,给所有人设置默认密码123
      - StudentModel.js 设置schema的StudentType + "password":String
      - ==**至此,学生表所有人都新增属性"password": 123**==
    - 2.2 给studentRuter.js添加登录的路由,负责学生登录校验,新增函数login(==一条龙写了==)
        ```
        // 学生登录校验
        StudentRouter.post("/adminapi/students/login",StudentController.login)

        --------------------------------

        StudentController.js
        async login(req, res) { // 登录校验
            // console.log(req.body)
            var result = await StudentService.login(req.body)
            if (result.length > 0) {
                // 不要返回密码
                let { _id, studentname,introduction,avatarUrl,gender } = result[0]
                // 引入JWT使用其内部创建token的函数,把用户的_id和username封装,进行token加密
                const token = JWT.generate({
                    _id, // 简写
                    username: studentname
                }, "1d") // 1d = 1day
                // 把token存在请求头中,潜规则命名为Authorization(可以随意起,但不建议)
                res.header("Authorization", token)
                res.send({
                    ActionType: "OK",
                    data: {
                        _id, username: studentname, // 统一格式
                        introduction,avatarUrl,gender, // 额外返回信息,用于center页面的介绍,头像地址,性别信息
                        "role": { // 学生登录的role信息是固定的,不可更改
                            "roleName": "学生",
                            "roleType": 3,
                            "rights": [
                                // 学生可以登录的路由
                                "/index",
                                "/center",
                                "/interview-manage",
                                "/interview-manage/companylist",
                                "/interview-manage/companydata",
                                "/student-manage",
                                "/student-manage/studentlist",
                            ]
                        }
                    }// 返回匹配的数据
                })
            } else {
                res.status(400).send({
                    ActionType: "fail" // 没有数据
                })
            }
        },
        ```
    - StudentController.js中登录校验功能基本复制的usercController.js的内容,逻辑相同的token校验和更新等操作,唯一区别的是,==学生数据的返回(res.send)自己需要的路由,都是固定写好的,如上代码==
    - 注意: 统一一下格式,原来通过持久化pinia存在本地的数据是username,所以赋值统一一下,==我们SideMenu显示就是根据本地存储的信息显示的==,如下图:
    [![pAhKCdS.png](https://s21.ax1x.com/2024/11/24/pAhKCdS.png)](https://imgse.com/i/pAhKCdS)
    - ==通过返回相同的信息res.send,特别是学生的role(**关乎路由以及SideMenu和内容的创建**),构建出学生身份独有的身份页面==
    [![pAhKFiQ.png](https://s21.ax1x.com/2024/11/24/pAhKFiQ.png)](https://imgse.com/i/pAhKFiQ)
  - ==2.2.1没有显示个人中心center页面==
  - 其实这个接口已经有了,但是不显示,看components/SideMenu.vue
    ```
    

    onMounted(async () => {
        var res = await axios.get("/adminapi/rights") // 取public的lib的json文件,获取数据

        rightsList.value = res.data // 获取信息赋值给空数组rightsList
    })

    const checkAuth = (path) => {
        return rights.includes(path)
    }
    ```
  - ==其实SideMenu在添加侧边栏时,依据的rights表进行校验,所以我们需要**在数据库rights表中手动添加center的路由信息**==
  [![pAhKes0.png](https://s21.ax1x.com/2024/11/24/pAhKes0.png)](https://imgse.com/i/pAhKes0)
  - ==2.2.4 try+catch捕获优化==
  - 如果promise.any两个都失败了,说明输入的用户不存在,这是需要捕获失败行为,返回message失败消息,不用catch就会直接报错,下面的逻辑是,先校验form表单,校验失败直接返回message失败信息,如果成功,再进一步校验用户存在与否,如果用户不存在,catch捕获,同理返回message失败信息,只有用户存在,才登录成功进入系统
    ```
    // 校验form表单成功情况下
         if (valid) {
            // 把用户的关联替换为真正的数据请求,发送校验请求
            // loginForm是username和password(用户登录的数据)
            try {
                const res = await Promise.any([axios.post("/adminapi/users/login", loginForm), axios.post("/adminapi/students/login", {
                    studentname: loginForm.username, // students表和user表不同,所以整理下数据传递过去
                    password: loginForm.password
                })])

                console.log(res.data)

                let { ActionType, data } = res.data
                if (ActionType === 'OK') {
                    console.log("data: ", data)
                    changeUser(data) // 把用户信息存起来
                    console.log("登录成功")
                    router.push("/")
                } else {
                    // Message组件,弹出错误信息,ElMessage需要引入
                    ElMessage.error('用户不存在')
                }

            } catch (e) { // 当Promise.any都失败时,res就没有信息,执行let { ActionType, data } = res.data,会报错,从undefined中获取信息,所以走catch
                ElMessage.error('用户不存在')
            }

        } else { // 校验表单失败
            console.log('error submit!', fields)
        }
    ```
  - ==2.2.5侧边栏有班级列表,学生不应看到班级列表(学生管理的二级路由)==
  - ==原因: SideMenu,其构建二级菜单的过程中没有校验==,一级菜单有校验,所以教师和admin2个角色的一级菜单显示才有区别
    ```
         <!-- 需要校验二级菜单是否存在,v-for和v-if不能同时在一起 -->
        <template v-for="item in data.children" :key="item.path">
            <el-menu-item :index="item.path" v-if="checkAuth(item.path)">
                <el-icon>
                    <component :is="mapIcon[item.icon]"></component>
                </el-icon>
                {{ item.title }}
            </el-menu-item>
        </template>

    ----------------------js----------------
    const route = useRoute() // 应用于el-menu主菜单标签的default-active属性,使用route.fullPath获取当前路由的路径,就搜索栏的那行
    const { user: { role: { rights } } } = useUserStore() // 获取useUserStore的user的值(用户信息),再在role/rights中找到path集合信息
    // 权限函数,rights为此用户拥有访问权限的路径,path会把所有路径都拿过来一个一个地测试一遍,通过的为true,失败的为false
    const checkAuth = (path) => {
        return rights.includes(path)
    }
    ```
    - 注意: v-for和v-if不能同时在一起,所以加了template
  - ==2.3Login.vue配置学生登录== 
    - Promise.all() 都成功才会有结果
    - Promise.race() 看谁获取的快就是谁,有风险,如果登陆学生账户,但是users的请求更快于students,就会走请求失败.catch,出现误导
    - ==Promise.any() 任意一个成功的,就走.then,两个都失败才走.catch,成功的那个最终会返回出res==
        ```
            const res = await Promise.any([axios.post("/adminapi/users/login", loginForm), axios.post("/adminapi/students/login", {
                    studentname: loginForm.username, // students表和user表不同,所以整理下数据传递过去
                    password: loginForm.password
            })])

            console.log(res.data)
        ```
    - ==注意: 在传递数据,用户名和密码的时候,在students表中,学生的名字属性是studentname,不是username,以后会有多个涉及这里的细节==
    - **这一步操作是,在登录时同时校验2条路径,那个走的同去那个,同时传递用户名和密码2个信息给后端,校验是否有这个用户**
  - ==2.4路由配置问题== 
    - promise.any内的两个axios其实无论返回谁都是成功的,status 200 OK, 为何? ==如果不改变状态码,虽然我们心里认为这是个失败返回(ActionType: "fail"),但是电脑还是会接收到一个对象,它会认为这是成功(因为有res返回值,它才不管你里面写的什么,代表什么意思,有返回就是OK),状态码200,**所以我们必须定义400,请求失败的状态码,同时返回失败的信息**==
  - 解决: 在UserController.js和StudentsController.js表中,对于失败的返回值额外加一个状态码400的设置,规定了这个返回数据属于失败的(==代码上面有一个示例==),这样2个axios肯定有一个会失败,成功的那个会赋值给res,然后进行登录校验等操作,然后进入系统页面

- ==**总结**==: 
  - Login.vue中,promise.any配置2条axios请求登录的路径,一个学生,一个老师和admin,同时使用try-catch捕获2条都出错的欣慰
  - 学生axios的请求: 需要新建login校验专属路由和处理方法(仿照教师和admin登录校验即可),同时改变students表的结构,新增password类型,addlist给所有学生添加默认密码123
  - SideMenu部分: 页面的center添加和学生页面显示: res返回学生role(rights),生成学生的路由导航页面,center添加进rights表,这是导航添加的依据
### 升级战略-学生权限
- 对一些页面进行限制,例如: 学生页面虽然有学生列表界面,但是只能看自己的评分,并且不能给自己评分,只能教师角色和admin角色才有权限.
- ==更改公司列表conpanyList.vue==
- ==学生不具备更新题库,上传excle文件的功能,仅保留搜索公司和查看面试题的2个功能==
  - 删除更新题库按钮
    ```
    tem:
     <el-table-column align="left" label="操作">
            <template #default="scope">
                <!-- 调整下高度,调整某一个的行高,这一行的行高都会跟着变化 -->
                <div style="display: flex; align-items: center; height: 55px;">
                    <el-button round type="primary" @click="handlePreview(scope.row)">面试题</el-button>
                    <el-button round type="warning" @click="handleUpdate(scope.row)" v-if="roleType!=3" >更新题库</el-button>
                </div>
            </template>
    </el-table-column>

    JS:
        import { useUserStore } from '../../store/useUserStore';

        // 无法响应时的更新
        const {user:{role:{roleType}}} = useUserStore() // 获取用户的信息roleType
        
    ```
    - useUserStore是pinia的函数,在store中useUserStore.js中定义的函数,返回此登录者的信息,通过结构获取,roleName=3代表的学生身份,在更新按钮设置v-if判断是否是学生,是的话不创建
    - ==在center页面构建时,我们会认识到具备响应性的重要性==
`


- ==更改学生列表StudentList.vue== 
- ==学生只能看自己的评分,并且不能给自己评分,不具备搜索学生姓名的功能==
  - 禁用搜索学生功能 + 自动搜索自己的信息 + 禁止学生评分
    ```
    tem:
    <el-table-column>
            <!-- table自定义表头 -->
            <template #header>
                <!-- 双向绑定的数据记录你输入的值,搜索框有禁用限制,学生不可用 -->
                <el-input v-model="search" size="small" placeholder="请输入学生的名字" :disabled="roleType===3" />
            </template>
            <template #default="scope">
                {{ scope.row.studentname }}
            </template>
    </el-table-column>

    <el-alert type="info" show-icon>
            请为<b style=" font-size: 20px;">{{ currentItem.studentname }}</b>同学评分
        </el-alert>
        <el-divider />
        <!-- 评分板 -->
        <div v-for="item in tagData" :key="item._id">
            <div class="rate-item">
                <div>{{ item.title }}</div>
                <!-- 评分: 监听handleRateEvent,获取点击的值($event默认数据) -->
                <!-- XXX可清空: clearable 双击相同分数清空为0 -->
                 <!-- rate打分表禁用 -->
                <el-rate :colors="colors" allow-half @change="handleRateEvent($event, item.title)"
                    :model-value="getItemRate(item.title)" clearable :disabled="roleType===3" />
            </div>
            <el-divider></el-divider>
        </div>
    </el-alert?


    js: 
    // 同理使用stroe
    import { useUserStore } from '../../store/useUserStore';

    // 无法响应时的更新
    const {user:{role:{roleType},username}} = useUserStore() // 获取用户的信息roleType

    onMounted(() => {
        if(roleType===3){ // 搜索框禁用后,需要自动赋值本学生名字搜索出本学生的信息
            search.value = username
        }
        getList()
        getClassList()
        getTags()
    })
    ```
    - 1.使用disabled+roleName身份判断,禁用搜索功能
    - 2.在生命周期中,自动给搜索双向绑定的值赋值本用户,自动搜索
    - 3.el-rate的disabled+roleName身份判断,禁止学生评分
### 升级战略-Center布局 + 接口处理
- center页面最终效果图,个人信息的修改,==看着图片和布局提示,理解代码==
    [![pAhasUA.png](https://s21.ax1x.com/2024/11/25/pAhasUA.png)](https://imgse.com/i/pAhasUA)
- ==布局概括:== 
  - 页面布局 24栏 左右比例1:2,使用el-card美化显示,有阴影
    ```
        <el-row :gutter="10" class="elRow">
        <el-col :span="8">
            <!-- el-card立体感更强的装饰组件 -->
            <el-card style="text-align: center;">
                <!-- 头像组件avatar -->
                <!-- 头像的图片是计算属性circleUrl -->
                <el-avatar :size="100" :src="circleUrl" />
                <!-- 这样写有响应性 -->
                <h3>{{ store.user.username }}</h3>
                <h5>{{ roleName }}</h5>
            </el-card>
        </el-col>
        <el-col :span="16">
            <el-card>
                form表单...
            </el-card>
        </el-col>
    ```
  - 顶栏使用新组件---page header
    ```
    <!-- 新组件page header,下面代码非模板,简单的使用了一些API直接生成的页面 -->
    <!-- icon	Page Header 的图标 Icon 组件 -->
    <!-- title	Page Header 的主标题，默认是 Back (内置 a11y)	 -->
    <!-- content Page Header 的内容 -->
    <el-page-header icon="" content="个人中心" title="学生学业质量管理系统"></el-page-header>

    ```
  - 左侧使用avatar组件,构建头像框,下面响应式学生名字; 头像值初始化默认值
  - 登录的表单tem复制Login.vue的form表单代码,改造一下
    - 性别: 下拉列表 el-select + el-option,==label是下拉列表显示的名字,value的值会被传递给userForm.gender,传向后端,下拉列表时动态组件的,配置的options的值==
    - select的数据代码:
      ```
      const options = [
          {
              label: "保密",
              value: 0
          },
          {
              label: "男",
              value: 1
          },
          {
              label: "女",
              value: 2
          }
      ]
      ```
  - 个人介绍: el-input , text文本框,设置type=textarea类型即可
  - ==上传头像el-upload(新组件): 附带一些css样式一并复制过来(**组件的css样式要加 :deep()**); 记得配置相关的rules==
  - 表单代码:
    ```
        <el-form ref="userFormRef" style="max-width: 600px" :model="userForm" :rules="rules" label-width="auto" class="demo-ruleForm" status-icon>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="userForm.username" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="userForm.password" type="password" />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
                <!-- 下拉列表,双向绑定选中的性别 -->
                <el-select style="width:100%;" v-model="userForm.gender">
                    <!-- label是下拉列表显示的名字,value的值会被传递给userForm.gender,传向后端 -->
                    <el-option v-for="item in options" :key="item.label" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="简介" prop="introduction">
                <!-- text文本框,type=textarea类型 -->
                <el-input v-model="userForm.introduction" type="textarea" />
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <!-- upload的上传/用户头像: :auto-upload 禁止自动上传,需要由更新按钮提交控制上传; :show-file-list 不显示上传列表,和上传excle文件下的列表一样  -->
                <!-- companyList中我们就用过这个上传组件,on-change响应式监听上传图片的情况 -->

                <!-- 封装下面的代码 -->
                <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false"
                    :on-change="handleChange">
                <!-- v-if-else: 如果有userForm.avatar(头像,双向绑定的头像属性,可以获取后端存储的数据),正常显示上传的头像图片,如果没有走else,默认显示一个图标Plus(引入) -->
                <!-- :src可以接受图片的二进制格式,再显示图片 -->
                <img v-if="userForm.avatar" :src="avatarComputed" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus /> // 没有上传任何图片,默认显示Plus组件(这是element的icon图标,记得引入)
                    </el-icon>
                </el-upload>

                <!-- 组件封装 components/center/... -->
                <kerwin-upload :avatar="userForm.avatar" @change="handleChange"></kerwin-upload>
            </el-form-item>


            <el-form-item class="el-form-item-button">
                <el-button type="primary" @click="submitForm(userFormRef)">
                    更新
                </el-button>
            </el-form-item>
        </el-form>

    ```  
- 定义好表单的双向绑定userForm,通过ref获取form节点,把userForm相关属性默认双向绑定到form表单里(除了密码),==后期提交把数据存入数据库,再次打开即可自动初始化==
  ```
    const userFormRef = ref() // ref传统用法: 获取el-form的实例对象(ref="loginFormRef") 
    const userForm = reactive({
        username,
        password: "",
        gender,// 下拉列表
        introduction, // 自我介绍
        avatar: avatarUrl, // 头像地址
        file: null // 给后端的文件对象信息(默认没有)
    })
  ```
- ==表单的上传图片新组件upload的使用==
- 上传图片需要显示图片,还要把图片的信息发送到后端,==依靠on-change监听上传图片的行为,**通过默认参数可以获取图片的信息,和上传excel文件获取信息一样**==
  ```
    // 文件上传---监听上传图片 
    // 接受子信息file(组件KerwinUpload) ---> evt
    const handleChange = (evt) => {
        console.log(evt.raw)
        userForm.file = evt.raw // 存储文件对象信息
        userForm.avatar = URL.createObjectURL(evt.raw) // 显示图片,把图片转化为二进制格式显示
    }
  ```
- 获取的默认信息打印如下
  [![pAhcsLq.jpg](https://s21.ax1x.com/2024/11/25/pAhcsLq.jpg)](https://imgse.com/i/pAhcsLq)
- ==文件图片上传的知识:==
  - 在 JavaScript 中，img标签的src属性通常是指向一个 URL（可以是相对路径或者绝对路径），用于加载图像资源。它本身不直接支持二进制参数码这种说法。
  - 不过，==有一种间接的方式可以将类似二进制数据（实际上是经过编码的二进制数据）用于src属性==，那就是 Data URLs。Data URLs 允许将小文件（如图片）直接嵌入到文档中，格式为`data:[<mediatype>][;base64],<data>`。
  - ==这种方式可以用于加载一些小的图像（因为 Data URLs 会使 HTML 文件变大），或者在没有方便的服务器端存储和提供图像的情况下，临时展示图像,比如表单上传图片==。
  - ==URL.createObjectURL()是一个 JavaScript 方法，它用于创建一个 DOMString，这个 DOMString 包含一个表示对象（通常是File或Blob对象）的 URL。这个 URL 是一个临时的 URL，它的生命周期和创建它的文档相关联。
  - ==**使用URL.createObjectURL()方法将这个文件对象转换为一个 URL，并将其赋值给新创建的img元素的src属性。这样，就可以在页面上显示用户选择的文件（假设是图片）的预览。所以userForm.avatar获取了转化好的图片值,通过表单双向绑定给upload组件的src属性,临时显示上传的图片**==
  - 注意: ==当你使用URL.createObjectURL()创建了一个对象 URL 后，这个 URL 会占用内存资源==。**为了避免内存泄漏，当你不再需要这个 URL 时，应该调用URL.revokeObjectURL()方法来释放内存**。
  > 注意: 为了代码可运行,我们没有更改任何代码,也没有添加清除缓存的机制
- 表单提交验证:
    ```
        // 提交表单按钮函数
        const submitForm = () => {
            // 
            userFormRef.value.validate(async (valid) => {
                if (valid) { // 校验通过
                    console.log(userForm) 
                  
                    // 提交userForm信息(复杂表单,含文件上传)给后端
                    // 当你需要处理文件上传或者构建更复杂的表单数据结构，包括同时包含文件和文本数据的表单时,new FormData()就非常有用
                    // 可以使用FormData对象来构建请求体数据,将表单的信息一个个存入FormData对象里面,作为axios向后端发送的数据载体,同时搭配请求头multipart/form-data
                    const params = new FormData()
                    for (let i in userForm) { // 获取userForm表单对象的每一个key
                        if (i !== "avatar") { 
                        // 我们不需要avatar的值(avatarUrl)进后端,这个没有用,avatarUrl作用只是作为特殊的二进制编码,给表单提交图片的src赋值,显示临时图片效果,重新选择图片或者跳转页面过后,会被销毁
                        // 真正需要传给后端的是图片信息存储的属性file,将来初始化页面的时候(用户已经修改过个人信息,并将头像图片传递给后端存储在数据库了),从数据库获取file数据,在通过URL.createObjectURL()转化即可又获取到特殊的二进制编码,也就是之前avatarUrl的数据,所以存储avatar属于多此一举,file信息内隐含它的信息,只需要通过转化即可获得
                            params.append(i, userForm[i]) // 添加userForm表单的数据,格式类似于 "username" : "张三" (key,value)
                        }
                    }

                    // 最后的upload是用于区分和其他post请求的path格式
                    const res = await axios(`/adminapi/students/${_id}/upload`,params,{
                        headers: {
                            "Content-Type": "multipart/form-data" // 针对file属性值为文件数据信息
                        }
                    })
                    console.log(res);

                    // 改变pinia store
                    changeUser({
                        ...store.user, // 旧信息
                        username: res.data.studentname, // 注意: 老信息是username,而新的信息(可以从数据库students表中看)对应的是studentname,所以同步一下
                        ...res.data, // 新信息
                    })

                }
            })
        }

    ```
    - ==1.validate方法用于触发表单验证,防止有人直接点击更新不填信息(在Login.vue表单提交验证时用过1次)==,validate方法接受一个回调函数作为参数。这个回调函数会在验证过程完成后被调用，并且会传入一个valid参数。如果valid为true，表示所有字段都通过了验证；如果valid为false，表示至少有一个字段验证失败
    - ==2.表单的提交验证==
    - ==2.1请求头配置Content-Type==
       - Content-Type 请求头指定了请求体的媒体类型。常见的值包括：

       - ==application/json: 表示请求体是 JSON 格式的数据。==

       - ==application/x-www-form-urlencoded: 表示请求体采用 URL 编码的表单数据。==

       - ==**multipart/form-data: 表示请求体包含文件上传的数据。 <------ 选择这个请求头**==
   - ==我们上传图片,文件时转化数据已经不再是简单的form表单提交了,所以需要额外设置请求头类型,默认情况是前2个==
  > 
   - ==2.2表单form的数据整理==
   - 当你需要处理文件上传或者构建更复杂的表单数据结构，包括同时包含文件和文本数据的表单时,==需要借助new FormData()去转化form表单信息==
   - ==可以使用FormData对象来构建请求体数据,将表单的信息一个个存入FormData对象里面(`.append()`方法),作为axios向后端发送的数据载体,同时搭配请求头multipart/form-data==
- ==**后端的工作(针对表单提交)**==
- ==1.基础的数据库格式和返回的数据数量==
- 提交表单给后端,需要在StudentModel.js中添加新的数据类型供数据库存储,同时在StudentController.js中返回这些新的数据,通过axios返回提供给res
  ```
  ------------Model-------------------
    const StudentType = {
        "studentname" : String, // excel表格里名字栏就是这么写的,这样命名方便后端数据的处理(特指有中文也要用key-value映射给变成英文)
        "class" : {type:Schema.Types.ObjectId,ref:"class"}, // 学生的班级,链接class的ObjectId
        "score": Object, // 学生的成绩是对象格式,tag标签那里的所有标签就是科目,到时候会有对应的成绩
        "password": String, // 密码类型 
        "avatarUrl": String, //头像值
        "gender": Number, // 0 1 2(对应保密 男 女)
        "introduction": String // 介绍
    }

    ---------Controller--------------------
    res.send({
        ActionType: "OK",
        data: {
            _id, username: studentname, // 统一格式
            introduction,avatarUrl,gender, // 额外返回信息,用于center页面的介绍,头像地址,性别信息
            "role": { // 学生登录的role信息是固定的,不可更改
                "roleName": "学生",
                "roleType": 3,
                "rights": [
                    // 学生可以登录的路由
                    "/index",
                    "/center",
                    "/interview-manage",
                    "/interview-manage/companylist",
                    "/interview-manage/companydata",
                    "/student-manage",
                    "/student-manage/studentlist",
                ]
            }
        }// 返回匹配的数据
    })
  ```
- ==2.构建接受表单数据的路由和函数==
- StudentRouter.js
  ```
    // 接受文件需要新的插件multer(隶属express的小插件)
    const multer  = require('multer') // npm i multer下载
    const upload = multer({ dest: 'public/uploads/' }) // dest存放文件的地址,我们直接存到静态文件夹内部即可

    // 动态路由,:id是占位符,无论占位符输入什么都可以访问到/adminapi/users/
    // 需要添加中间件(multer的用法), single()内的参数是存放文件的属性名字file
    StudentRouter.post("/adminapi/students/:id/upload",upload.single("file"),StudentController.upload)
  ```
  - Multer 是一个用于处理multipart/form - data类型表单数据的中间件，主要用于在 Node.js 的 Express 框架中方便地处理文件上传。
  - ==使用前记得先下载`npm i multer`和引入==
  - 上面的multer代码指定了将来文件的存储地址dest,以及使用了multer中间件,==upload.single('file')表示这个路由处理函数期望**接收一个名为file的文件。Multer 会从请求中提取这个文件，并将其存储在req.file对象中**。文件信息包括文件名、文件大小、文件类型等。==
  - ==**我们在前端axios发送表单数据时,正是file属性存储了文件的信息,所以这里的single内的参数就写file,同时记住这个文件信息会存入req.file中**,这与其他常规信息(用户名,密码,性别等非文件类简单字符串信息)存储位置不同,这些简单信息还是存在req.body中==
- StudentController.js
  ```
    async upload(req, res) { // 更新个人中心函数
        // console.log(req.file,req.body) // multer使用方法,打印一下配置的file文件信息req.file和其他请求体信息req.body
        // res.send([])
        // 传参, 占位符的id , 图片文件的信息(自成一体) , 其他信息(请求体)
        var result = await StudentService.upload(req.params.id, req.file, req.body)
        res.send(result) 
    },
  ```
  - 在这打印一下经过处理的req信息,==分别是req.file和req.body,在后端的myappServer终端中查看==,前者是经过multer处理后存储文件信息的,后者是正常存储表单简单内容
  - 上面的是req.file的打印,比如有文件的名字filename(系统自己起的名字)和path(我们规定dest后,文件存储的路径信息)
  - 下面的就是常规信息的打印,req.body
    [![pAhc6e0.jpg](https://s21.ax1x.com/2024/11/25/pAhc6e0.jpg)](https://imgse.com/i/pAhc6e0)
  - 随后把用户信息的id,头像信息req.file,常规信息req.body传给下一个service函数
> 
- StudentService.js(==获取用户信息的id,头像信息req.file,常规信息req.body并更新数据==)
    ```
    // 更新center页面的函数
        upload(id,file,body){
            if(file){ // 更新头像了,file不为null
                return StudentModel.findByIdAndUpdate(id,{
                    ...body,
                    studentname: body.username, // body内的名字和数据库名字不同,同步并覆盖一下
                    avatarUrl: `/uploads/${file.filename}` // 因为在静态文件夹,所以省略public,filename是multer对图片名字信息的重命名,这样我们前端src的本地地址也配置好了
                },{returnDocument: "after"}) // 额外属性: 获取更新后的信息
            }else{ // 没有更新头像,file为null,所以就不更新了
                return StudentModel.findByIdAndUpdate(id,{
                    ...body,
                    studentname: body.username, // body内的名字和数据库名字不同,同步并覆盖一下
                },{returnDocument: "after"}) // 额外属性: 获取更新后的信息
            }
        },
    ```
    - 注意: ==在students表中名字是studentname属性管理,而传递来的res.body中存储名字的属性名为username,统一为studentname再进入数据库==
    - ==存储avatarUrl的信息是本地地址,只能在自己电脑上玩玩==
    - returnDocument: "after": 额外属性: 获取更新后的信息,这样前端会获取更新后的一手数据
    - 最后学生数据库的内容存储了表单的信息,如下 
        [![pAhgRBt.jpg](https://s21.ax1x.com/2024/11/25/pAhgRBt.jpg)](https://imgse.com/i/pAhgRBt)
> 
- ==提交完表单,存储完学生数据进入数据库后,下一步在前端请求数据,如果用户在之前提交过个人信息,并提交存储在数据库内了,那么我们从数据库请求出数据直接初始化好个人中心==

- ==信息获取:获取用户的登录信息==
    - 我们通过useUserStore()获取的信息就是pinia持久化存在本地的数据,如下图(==这是admin的登录信息示例==): 
    [![pAhKCdS.png](https://s21.ax1x.com/2024/11/24/pAhKCdS.png)](https://imgse.com/i/pAhKCdS)

- 代码:(==然后动态配置即可(记住没有响应性,之后会讲如何改)==)
    ```
    js:
    import { useUserStore } from '../../store/useUserStore';
    const { user: { role: { roleName }, username, _id, gender, introduction, avatarUrl }, changeUser } = useUserStore()

    const userForm = reactive({
        username,
        password: "",
        gender,// 下拉列表
        introduction, // 自我介绍
        avatar: avatarUrl, // 头像地址
        file: null // 给后端的文件对象信息
    })
    ```
- 通过在本地存储中获取了足够的信息,然后存入双向绑定的表单数据userForm中,如果数据库有数据,那么就会获取,然后赋值给相关属性(==看好userForm内部赋值都是ES6简便写法(username,gender,introduce),其中密码不能初始化显示(保密),avartar属性名和数据库属性名不同,不能简写,file不会在前端页面显示==)
- 其中图片的显示avatar需要特殊处理:
- 为了动态显示上传头像的图片,使用计算属性去动态化显示(==响应性!!==)
  ```
    在tem中,circleUrl会赋值给upload组件的src属性的
  ------------------js------------------
    const circleUrl = computed(() => 
        userForm.avatar.include("blob") ? useForm.avatar : 'http://loacalhost:3000' + userForm.avatar
    )
  ```
    - ==前提: 我们每次上传更新数据库图片到后端,都要经过URL.createObjectURL()对图片文件的处理,然后存入表单的userForm双向绑定属性avatar中,其中经过这个方法处理后,会生成一个带有blob字段的地址文件,大体为'blob XXXXXXX'后面的XXX就是转化的文件信息等== 
    - 三目: 意为如果有blob字段,说明你刚上传了一个图片进入表单,那么就显示这个刚上传的图片,经过URL.createObjectURL()处理上传文件后转为特殊二进制赋值给表单useForm.avatar,直接用它即可
    - (==前提: 首先用户已经有个人中心数据了,排除第一次登录的情况==)如果没有blob字段,说明用户还没有上传图片,那么userForm.avatar的数据是数据库存储的,也是上次用户存的图片,==userForm.avatar获取的是数据库的avatarUrl的值,也就是存放图片的绝对地址,存储位置是后端服务器的静态文件夹,所以加好前缀(后端服务器地址)http://localhost:3000,拼接起来就是一个图片的正经地址,赋值给src即可显示存储在数据库内部的图片信息==
- 处理完avatar头像的动态更新后,用户的信息就可以从数据库获取学生个人中心的信息,从而实现初始化,显示上次用户保存的个人信息
> 
- ==注意: 这里箭头函数老犯错,计算属性这里==
  ```
    // func1和func2都是返回数字100,但是写法不同

    // 多行代码,加{},返回数据+return
    const func1 = ()=>{
        let a = 100
        return a
    }
    // 单行代码,可以省略{}和return
    const func2 = ()=> 100
  
  ```
- 处理bug: 如果我们不更新头像,点击更新,后端直接报错500,为何?
  - 因为我们的表单数据file属性默认null(初始化),如果我们不更新图片,那么axios像后端会传递一个file = null的文件,后端multer处理文件信息时,会把null存入req.file文件中,后续会报错的
- 修正: (==StudentService.js==)
  ```
    // 更新center页面的函数
    upload(id,file,body){
        if(file){ // 更新头像了,file不为null
            return StudentModel.findByIdAndUpdate(id,{
                ...body,
                studentname: body.username, // body内的名字和数据库名字不同,同步并覆盖一下
                avatarUrl: `/uploads/${file.filename}` // 因为在静态文件夹,所以省略public,filename是multer对图片名字信息的重命名,这样我们前端src的本地地址也配置好了
            },{returnDocument: "after"}) // 额外属性: 获取更新后的信息
        }else{ // 没有更新头像,file为null,所以就不更新了
            return StudentModel.findByIdAndUpdate(id,{
                ...body,
                studentname: body.username, // body内的名字和数据库名字不同,同步并覆盖一下
            },{returnDocument: "after"}) // 额外属性: 获取更新后的信息
        }
    },
  ```
  - 判断file是否为空,为空就不更新头像属性了,如果不为空,再更新进数据库,否则avatarUrl: \`uploads/${file.filename}\`,相当于从undefined中取值  
- ==完成更新bug调试后,提交表单更新后,获取到res数据,然后把res存在本地中(持久化pinia),使用userstore.js函数changeUser==
  ```
        const { user: { role: { roleName }, username, _id, gender, introduction, avatarUrl }, changeUser } = useUserStore()
        const store = useUserStore() // 具有响应性的用法,直接用于实时更新页面各处的信息,再写一遍

        const res = await Untilkerwinupload(`/adminapi/students/${_id}/upload`,userForm)
        console.log(res);
        // 改变pinia store
        changeUser({
            ...store.user, // 旧信息
            username: res.data.studentname, // 注意: 老信息是username,而新的信息(可以从数据库students表中看)对应的是studentname,所以同步一下
            ...res.data, // 新信息
        })

  ```
  > 注意: 对象res返回的信息是students表中的信息,而主页pinia存储要求的格式是username,统一一下
  - 重新创建一个store变量用于存储旧信息,res存储新信息,展开覆盖进去
  - 最终本地化存储的效果如下,学生的数据库信息经过pinia持久化存储到本地
  [![pAh4RBj.jpg](https://s21.ax1x.com/2024/11/25/pAh4RBj.jpg)](https://imgse.com/i/pAh4RBj)
> 
- ==最后一个问题,响应性更新页面的信息,比如左边的头像和姓名,顶栏的头像和姓名==
- 解决: 想要响应性更新,不能结构pinia本地化存储的信息,而是直接获取整个对象信息,然后通过.的方式,获取内部信息,这样具有响应性
- 个人中心center.vue左侧的响应式更新:
  ```
    <el-col :span="8">
            <!-- el-card立体感更强的装饰组件 -->
            <el-card style="text-align: center;">
                <!-- 头像组件avatar -->
                <!-- 头像的图片是计算属性circleUrl -->
                <el-avatar :size="100" :src="circleUrl" />
                <!-- 这样写有响应性 -->
                <h3>{{ store.user.username }}</h3>
                <h5>{{ roleName }}</h5>
            </el-card>
    </el-col>

    ------------js------------------
    const circleUrl = computed(() => 
        // createObjectURL,同理拼接下地址,显示图片即可
        store.user.avatarUrl ? 'http://localhost:3000' + store.user.avatarUrl : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    )
  ```
  - 头像的响应性也是计算属性,如果store.user.avatarUrl是undefined,说明还没有上传过图片,给后面的默认值(那个地址是element提供的默认头像地址); 如果上传过图片,会走前面,提取数据库图片信息,配置好本地路径,显示用户数据库内部存储的图片作为头像
- 同理顶部栏 components/mainbox/Topheader.vue
  ```
    tem:
    <div>
        <span style="line-height:40px; margin-right:20px;">欢迎{{store.user.username}}回来</span>
        <el-dropdown>
            <!-- CDN导入,简单的 -->
            <!-- <el-avatar :size="40" src='https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'/> -->
            <!-- 本地导入,vite工具导入图片有点麻烦 -->
            <el-avatar :size="40" :src="avatar"></el-avatar>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>身份:{{roleName}}</el-dropdown-item>
                    <el-dropdown-item @click="handleExit">退出</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
    

    js:
    const store = useUserStore()
    // 本地图片vite的导入
    // const avatar = new URL('../../assets/userImg.png',import.meta.url).href
    const avatar = computed(() => 
        // 和center的头像一个处理方式,代码相同,下面是2个方法
        store.user.avatarUrl ? 'http://localhost:3000' + store.user.avatarUrl : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        // store.user.avatarUrl ? 'http://localhost:3000' + store.user.avatarUrl : new URL('../../assets/userImg.png',import.meta.url).href
    )
  ```
    - ==学生姓名响应性: {{store.user.username}}==
    - ==学生头像的响应性: src = avatar(来自计算属性)==

### 升级战略-Center封装
- 封装upload部分为组件components; 封装axios-post提交表单为工具类组件util
    > ==注意: 记得引入在center.vue中引入2个封装的组件==
- ==封装upload--> kerwinUpload==
    ```
     <kerwinUpload :avatar="userForm.avatar" @change="handleChange"></kerwinUpload>
    ```
  - ==父传子: 传递表单的avatar头像信息; 子传父change自定义事件== 
  - conponents/cneter/KerwinUpload.vue
    ```
    <template>
        <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="handleChange">
            <img v-if="props.avatar" :src="avatarComputed" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
                <Plus />
            </el-icon>
        </el-upload>
    </template>

    <script setup>
        import { Plus } from '@element-plus/icons-vue' // 引入新图标
        import { computed } from 'vue'
        // 接受父信息
        const props = defineProps(["avatar"])
        console.log(props.avatar) // 通过props.avatar可以获取传递过来的信息


        // 显示图片动态配置src属性的计算属性函数
        const avatarComputed = computed(() =>
            // blob是URL.createObjectURL(evt.raw)转化为一个带有blob字段的内容,如果有,说明经过了URL.createObjectURL处理,如果没有,说明是从后端返回过来的(上一次的),加好前缀地址
            props.avatar.includes("blob") ?
                props.avatar : 'http://localhost:3000' + props.avatar
        )

        const emit = defineEmits(["change"]) // 子传父
        // file是默认参数,是上传文件的信息,原来我们常写为 "evt.raw" 去获取关键信息
        const  handleChange = (file)=>{
            emit("change",file,avatar) // 子传父
        }
    </script>

    .....把css样式复制过来
    ```
  - 父传子: 接受信息-->props,同理剪切计算属性进来动态配置头像显示
  - 子传父: emit-->change(父自定义事件),传递默认参数file,即upload上传文件的信息
  - 父组件(change触发事件函数handlechange不用动),接受evt就是子传过来的file参数
    ```
    const handleChange = (evt) => {
        console.log(evt.raw)
        userForm.file = evt.raw
        userForm.avatar = URL.createObjectURL(evt.raw) // 把图片转化为二进制格式显示
    }
    ```
- 封装axios  center.vue
  ```
        const res = await Untilkerwinupload(`/adminapi/students/${_id}/upload`,userForm)
        console.log(res);
  ```  
- util/kerwinupload.js
  ```
        import axios from 'axios'

        function Untilkerwinupload(path,userForm) {
            
            const params = new FormData()
            for (let i in userForm) { // 获取userForm表单对象的每一个key
                if (i !== "avatar") {
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
  ```
  - 在外部直接传入表单数据即可,组件内部可以转化好表单的类型 new FormData,并且配置好请求头发送axios