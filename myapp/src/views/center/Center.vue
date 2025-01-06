<template>
    <!-- 新组件page header,下面代码非模板,简单的使用了一些API直接生成的页面 -->
    <!-- icon	Page Header 的图标 Icon 组件 -->
    <!-- title	Page Header 的主标题，默认是 Back (内置 a11y)	 -->
    <!-- content Page Header 的内容 -->
    <el-page-header icon="" content="个人中心" title="学生学业质量管理系统"></el-page-header>

    <!-- 页面布局 24栏 左右比例1:2-->
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
                <el-form ref="userFormRef" style="max-width: 600px" :model="userForm" :rules="rules" label-width="auto"
                    class="demo-ruleForm" status-icon>
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
                        <!-- <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false"
                            :on-change="handleChange"> -->
                        <!-- v-if-else: 如果有userForm.avatar(头像),正常显示上传的头像图片,如果没有走else,默认显示一个图标Plus(引入) -->
                        <!-- :src可以接受图片的二进制格式,再显示图片 -->
                        <!-- <img v-if="userForm.avatar" :src="avatarComputed" class="avatar" />
                            <el-icon v-else class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload> -->

                        <!-- 组件封装 components/center/... -->
                        <kerwinUpload :avatar="userForm.avatar" @change="handleChange"></kerwinUpload>
                    </el-form-item>


                    <el-form-item class="el-form-item-button">
                        <el-button type="primary" @click="submitForm(userFormRef)">
                            更新
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>
    </el-row>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useUserStore } from '../../store/useUserStore';
// 引入组件
import kerwinUpload from '../../components/center/KerwinUpload.vue'
// 引入工具
import Untilkerwinupload from '../../util/kerwinupload'
// import axios from 'axios'

// 头像动态更换 ---> 计算属性
// const circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const circleUrl = computed(() => // 单行代码,无{},省略return
    // 如果store.user.avatarUrl是undefined,说明还没有上传过图片,给后面的默认值; 如果上传过图片,会走 URL.createObjectURL,同理拼接下地址,显示图片即可
    store.user.avatarUrl ? 'http://localhost:3000' + store.user.avatarUrl : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
)

// 直接解构没有响应式更新
// 解构_id用于确定学生身份传递center信息给后端
// 解构更多信息,刷新后,自动填充内容进入form表单(除了密码) gender, introduction,avatarUrl
// 解构changeUser方法,用于存储更新的信息+pinia持久化插件
const { user: { role: { roleName }, username, _id, gender, introduction, avatarUrl }, changeUser } = useUserStore()
const store = useUserStore() // 具有响应性的用法,直接用于实时更新页面各处的信息,再写一遍


const userFormRef = ref() // ref传统用法: 获取el-form的实例对象(ref="loginFormRef") 
const userForm = reactive({
    username,
    password: "",
    gender,// 下拉列表
    introduction, // 自我介绍
    avatar: avatarUrl, // 头像地址
    file: null // 给后端的文件对象信息
})
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

// 校验表单规则
const rules = reactive({
    // 可以放多个校验对象,内部数组配置校验细致规则
    username: [ // 必填+提示+失去焦点再校验
        { required: true, message: '请输入用户名', trigger: 'blur' } // trigger: 'blur' 失去焦点再校验
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
    introduction: [{ required: true, message: '请输入简洁', trigger: 'blur' }],
    avatar: [{ required: true, message: '请选择头像', trigger: 'blur' }],
})
// 文件上传---监听上传图片 
// 接受子信息file(组件KerwinUpload) ---> evt
const handleChange = (evt) => {
    console.log(evt.raw)
    userForm.file = evt.raw

    userForm.avatar = URL.createObjectURL(evt.raw) // 把图片转化为二进制格式显示
    // URL.createObjectURL()是一个 JavaScript 方法，用于创建一个指向Blob（二进制大对象）或者File对象的 URL。这个 URL 是一个临时的、具有唯一性的字符串，以blob:或file:开头，通过这个 URL 可以在浏览器中访问对应的Blob或File对象的内容，就好像它们是普通的网络资源一样。
    // console.log(userForm.avatar)
}

// 提交表单按钮函数
const submitForm = () => {
    // validate方法用于触发表单验证,防止有人直接点击更新不填信息,validate方法接受一个回调函数作为参数。这个回调函数会在验证过程完成后被调用，并且会传入一个valid参数。如果valid为true，表示所有字段都通过了验证；如果valid为false，表示至少有一个字段验证失败
    userFormRef.value.validate(async (valid) => {
        if (valid) { // 校验通过
            console.log(userForm)
            // 请求体中有file属性,这是文件上传数据,却别于普通的字符串
            /*
                常见请求头配置

                Content-Type

                Content-Type 请求头指定了请求体的媒体类型。常见的值包括：

                application/json: 表示请求体是 JSON 格式的数据。

                application/x-www-form-urlencoded: 表示请求体采用 URL 编码的表单数据。

                multipart/form-data: 表示请求体包含文件上传的数据。 <------ 选择这个请求头
            */
            
            // 最后的upload是用于区分和其他post请求的path格式
            // 把这个也封装一下 util/...
            const res = await Untilkerwinupload(`/adminapi/students/${_id}/upload`,userForm)
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

</script>

<style lang="scss" scoped>
.elRow {
    margin-top: 20px;
}

</style>
