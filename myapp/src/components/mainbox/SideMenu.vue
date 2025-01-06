<template>
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
                        <!-- 需要校验二级菜单是否存在,v-for和v-if不能同时在一起 -->
                        <template v-for="item in data.children" :key="item.path">
                            <el-menu-item :index="item.path" v-if="checkAuth(item.path)">
                                <el-icon>
                                    <component :is="mapIcon[item.icon]"></component>
                                </el-icon>
                                {{ item.title }}
                            </el-menu-item>
                        </template>

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
</template>


<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue';
// 引入icon图标
import { TrendCharts, User, Key, List, Grid, OfficeBuilding, PieChart, School, House } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
// 导入用户信息的store,我们在登录Login.vue中已经给这个store传入了当前用户的权限路径集合了
import { useUserStore } from '../../store/useUserStore'

const rightsList = ref([])
// rightsList的icon都是字符串,不能直接应用于动态组件is,它需要icon的实例对象
// 字符串变为变量,使用key-value对象方法解决(map映射)
// 以下都是简写: User(key名字): User(value实例对象)
// mapIcon['User'](放入字符串) = User(value,这是icon的实例对象,不是字符串了)
// 然后以这种形式给动态组件的:is赋值,让他转换为对应的icon组件
// key与value的同名设置也是为了由key(字符串)丝滑传为value(实例对象) 
const mapIcon = {
    TrendCharts, User, Key, List, Grid, OfficeBuilding, PieChart, School, House
}
const route = useRoute() // 应用于el-menu主菜单标签的default-active属性,使用route.fullPath获取当前路由的路径,就搜索栏的那行
const { user: { role: { rights } } } = useUserStore() // 获取useUserStore的user的值(用户信息),再在role/rights中找到path集合信息
// 权限函数,rights为此用户拥有访问权限的路径,path会把所有路径都拿过来一个一个地测试一遍,通过的为true,失败的为false
const checkAuth = (path) => {
    return rights.includes(path)
}

onMounted(async () => {
    // vite.config.js设置代理服务器了,直接向adminapi发送请去即可,不要向http://localhost:3000/adminapi/rights请求(跨域)

    // var res = await axios.get("/lib/rights.json") // public静态文件获取数据
    // express请求真实的后端,需要打开express和mongodb数据库
    var res = await axios.get("/adminapi/rights") // 取public的lib的json文件,获取数据

    // console.log(res)
    rightsList.value = res.data // 获取信息赋值给空数组rightsList
})


</script>