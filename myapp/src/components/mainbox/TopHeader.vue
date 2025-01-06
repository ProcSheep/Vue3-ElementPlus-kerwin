<template>
    <el-header>
        <div>学生学业质量分析系统</div>
        <!-- dropdown下拉菜单组件 -->
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
    </el-header>

</template>

<script setup>
// 引入路由方法
import { useRouter } from 'vue-router';
// 引入pinia的store
import { useUserStore } from '../../store/useUserStore';
import { useRouterStore } from '../../store/useRouterStore';
import { computed } from 'vue';

const store = useUserStore()

// 本地图片vite的导入
// const avatar = new URL('../../assets/userImg.png',import.meta.url).href
const avatar = computed(() => 
    // 和center的头像一个处理方式,代码相同,下面是2个方法
    store.user.avatarUrl ? 'http://localhost:3000' + store.user.avatarUrl : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    // store.user.avatarUrl ? 'http://localhost:3000' + store.user.avatarUrl : new URL('../../assets/userImg.png',import.meta.url).href
)

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

</script>


<style lang="scss" scpoed>
.el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #0d47a1;
    color: white;
}
</style>