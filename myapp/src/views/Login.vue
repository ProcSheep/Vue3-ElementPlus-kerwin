<template>
    <div>
        <!-- 加点css样式 -->
        <!-- 动画背景 @tsparticles/vue3 github搜tsparticles-->
        <vue-particles id="tsparticles" @particles-loaded="particlesLoaded" :options="options"></vue-particles>

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

<script setup>
// setup直接使用pinia,pinia已经安装注册好了
import { useUserStore } from '../store/useUserStore';
import axios from 'axios'
const { changeUser } = useUserStore()
// 引入路由 + 自动跳转
import { useRouter } from 'vue-router'
const router = useRouter()
// 引入ref reactive 
import { ref, reactive } from 'vue'
// 引入粒子效果标签options配置对象
import options from '../util/config'
// 弹出error框的组件引入
import { ElMessage } from 'element-plus'


const loginFormRef = ref() // ref传统用法: 获取el-form的实例对象(ref="loginFormRef") 
const loginForm = reactive({
    username: "",
    password: ""
})
// 校验表单规则
const rules = reactive({
    // 可以放多个校验对象,内部数组配置校验细致规则
    username: [ // 必填+提示+失去焦点再校验
        { required: true, message: '请输入用户名', trigger: 'blur' } // trigger: 'blur' 失去焦点再校验
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})
// 登录校验方法
const submitForm = async (formEl) => {
    if (!formEl) return
    // validate立即校验一次,防止用户不点击用户框直接点登录,这样会真的把空用户名,空密码,发给后端
    // valid为true证明符合校验规则,提交; 如果valid为false,不提交,并提供出错区域,validate是ElementPlus的表单验证功能主要依赖于async-validator库
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            // 把用户的关联替换为真正的数据请求,发送校验请求
            // loginForm是username和password(用户登录的数据)

            // const res = await axios.post("/adminapi/users/login",loginForm)

            // 如果你发现网络请求正常,看看有没有响应和预览内容,都有的话再打印res结果如果为undefined,那就是忘了加await了
            // Promise.all() 都成功才会有结果
            // Promise.race() 看谁获取的快就是谁,有风险,如果登陆学生账户,但是users的请求更快于students,就会走请求失败.catch,出现误导
            // Promise.any() 任意一个成功的,就走.then,两个都失败才走.catch,成功的那个最终会返回出res

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

        } else {
            console.log('error submit!', fields)
        }
    })
}
// 粒子标签函数
const particlesLoaded = async container => {
    console.log("Particles container loaded", container);
};

</script>

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

    .demo-ruleForm {
        margin-top: 50px;
    }


}
</style>