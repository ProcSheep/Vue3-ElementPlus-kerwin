<template>
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
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import ImportExcel from '../../util/ImportExcel'
import axios from 'axios'

const dialogVisible = ref(false)
const addForm = reactive({
    title: "",
    list: [],
    fileList: []
})
const tableData = ref([])

onMounted(() => {
    getList()
})
const getList = async () => {
    var { data } = await axios.get("/adminapi/classes")
    tableData.value = data
    // console.log("tableData",tableData.value)
}


const handleChange = (ev) => { // evt是自动获取的参数
    console.log(ev) // 监视上传文件的信息,其中raw属性是文件信息的关键
    addForm.title = ev.name.split(".")[0] // 把文件名字记录下来
    // 安装excel表格解析插件xlsx,传入excle的文件信息ev.raw
    ImportExcel(ev.raw, (data) => {
        console.log(data) // 获取解析文件的信息,数组类型
        addForm.list = data // 保存数据
    })

}
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
    // 这里处理了'重复数据问题': 在ClassService.js和StudentService.js中处理相关信息,其中前者有坑
    console.log("classObj",classObj.data) // 提前记录学生班级的信息,从中获取ObjectId的信息(._id)
 
    // 前端的思路是不改变后端的数据库处理方法updateOne方法,但是在前端的学生数据请求axios加一个if判断,即如果在添加class时,匹配成功了,返回值中虽然没有相关数据了,但是会有通知你成功了的属性,比如data中的matchCount = 1,如果if没有匹配到,即第一次添加这个班级,data中会有一个属性upsertId,里面是class的ObjectId; if一旦检测到匹配成功了,本次学生数据不再更新(否则会把class的ObjectId丢失)
    // 学生名字 --> students
    await axios.post("adminapi/students",{
        list: addForm.list,
        class: classObj.data._id 
    })

    // 清空列表显示,输入框的title和list数组数据
    addForm.fileList = []
    addForm.list = []
    addForm.title = ""
    // 重新渲染
    getList()
}

const handleDelete = async(item)=>{
    await axios.delete(`/adminapi/classes/${item._id}`)
    await axios.delete(`/adminapi/students/${item._id}`) // 这里的删除函数需要处理成单个学生的删除,在StudentService.js中
    getList()
}


</script>