<template>
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

    <!-- 更新标签弹出的dialog对话框 -->
    <el-dialog v-model="dialogUpdateVisible" title="更新标签" width="500">
        <!-- 完全复用上面的对话框,记得把addForm改为updateForm即可 -->
        <el-form :model="updateForm" label-width="auto" status-icon>
            <el-form-item label="标签名" prop="title">
                <el-input v-model="updateForm.title" />
            </el-form-item>
            <!-- 下拉列表组件select -->
            <el-form-item label="阶段" prop="grade">
                <el-select v-model="updateForm.grade" placeholder="请选择阶段" style="width: 100%">
                    <el-option v-for="(item,index) in names" :key="index" :label="item" :value="index+1" />
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
    title: "",
    grade:""
})
// 额外记录表单信息,用于显示点击'更新'按钮显示对应dialog表单的内容
const updateForm = reactive({
    title: "",
    grade: "",
})
const currentItem = ref({}) // 中间变量,老问题,handleUpdateConfirm更新按钮需要知道更新的是那一条数据的值,记录他的唯一id
const tableData = ref([]) // 表单数据请求
const names = ["第一阶段", "第二阶段", "第三阶段"]
const types = ["success", "warning", "danger"]

onMounted(() => {
    getList()
})
const getList = async () => {
    var { data } = await axios.get("/adminapi/tags")
    tableData.value = data
}

// 添加标签'确认'按钮触发事件handleAddConfirm
const handleAddConfirm = async () => {
    dialogVisible.value = false
    // console.log(addForm)
    await axios.post('/adminapi/tags', addForm)
    await getList()

    addForm.title = ""
    addForm.grade = ""
}

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
// 点击'删除'按钮执行handleUpdate
const handleDelete = async ({ _id }) => { // 获取删除数据的_id(解构来自scope.row)
    await axios.delete(`adminapi/tags/${_id}`)
    // 之后再去后端完善动态路由的delete函数
    await getList()
}

// 阶段排序,默认接受两个参数(上面不用传参,他自动接受),它会把相邻项传入,只要有数字类型的就行
// 这个方法使用和js内置的数组sort排序方法使用方式一样,这样写是升序,反过来是降序
const sort = (rowa,rowb)=>{
    return rowa.grade - rowb.grade
}

</script>