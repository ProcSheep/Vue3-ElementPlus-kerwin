<template>
    <!-- 点击'添加用户'按钮弹出对话框 -->
    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
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

    <!-- 添加用户弹出的dialog对话框 -->
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
                    <!-- el-option的值从后端请求,数据是roleList,数据来源是roles表,目前只有管理和教师 -->
                    <!-- 首先要理解各属性的作用,v-for就是遍历数据,数据来自后端的表roles,:label是options的命名,:value双向绑定到el-select的 -->
                    <!-- :value把item._id传给addForm.role即可,将来addForm作为req.body向后端传递数据时,我们设置了链表查询(user表根据_id找role表)只需要ObjectId,去userRouter的路由请求getList数据即可 -->
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
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'

// 添加对话框dialog相关数据
const dialogVisible = ref(false)
const dialogUpdateVisible = ref(false)
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
const currentItem = ref({}) // 中间变量,老问题,handleUpdateConfirm更新按钮需要知道更新的是那一条数据的值,记录他的唯一id
const tableData = ref([]) // 表格数据请求
const roleList = ref([]) // el-select/el-options的选项 

onMounted(() => {
    getList()
    getRolesList()
})
const getList = async () => {
    var { data } = await axios.get("/adminapi/users")
    tableData.value = data
    console.log("no1",tableData.value)
}
const getRolesList = async () => {
    var { data } = await axios.get("/adminapi/roles")
    roleList.value = data
}

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
// 点击'更新'按钮,更新用户的信息
// item是scope.row,是当前行信息的值
const handleUpdate = (item)=>{
    // console.log(item)
    dialogUpdateVisible.value = true
    updateForm.username = item.username
    updateForm.password = item.password
    // 经过打印item的值,我们需要的role值根据对象的结构,应在item.role._id存储的(注意外面的那个_id是本条数据的唯一id,不是管理员/教师的专属role表_id)
    updateForm.role = item.role._id
    currentItem.value = item._id // 记录本条数据的唯一id,根据这条唯一id去user表中更新数据
}
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

</script>