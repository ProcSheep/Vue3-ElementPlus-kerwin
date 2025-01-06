<template>

    <!-- 上传文件组件upload,复用添加班级页面的代码 -->
    <el-upload :auto-upload="false" :on-change="handleChange" style="width: 100%" v-model:file-list="fileList" v-if="roleType!=3">
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
                    <el-button round type="warning" @click="handleUpdate(scope.row)" v-if="roleType!=3" >更新题库</el-button>
                </div>
            </template>
        </el-table-column>

        <!-- 占位,没内容 -->
        <el-table-column />
    </el-table>

    <!-- 更新题库弹出的dialog对话框 -->
    <el-dialog v-model="dialogUpdateVisible" title="更新题库" width="80%">
        <!-- 文本编辑器,使用组件封装,组件components/editor/Editor.vue,我们用v5版本 -->
        <!-- <Editor4></Editor4> -->
        <!-- 需要子传父,传递编辑区的内容; 需要父传子,把当前对象的interview属性值再传回去,防止刷新后,丢失编辑区的信息,如果没有就是undefined -->
        <!-- 坑: 当我们编辑好一个公司的题库内容时,再更新其他公司的题库,会发现所有公司的题库编辑内容都一样,这是因为我们对编辑器内容的赋值是在组件内的 @onCreated函数中执行的,这个函数只有在组件Editor重新创建时才会执行,而我们打开不同公司的题库,只会在父传子:content发生了点变化,组件执行更新生命周期,不执行@onCreated函数,也就不会重新把新的父信息赋值给编辑区内容valueHtml,从始至终我们一直在用一个编辑器,他没有被销毁,导致之后我们更新数据就只会把内容的数据双向绑定到valueHtml属性上,然后大家(所有的公司)共用一个编辑器,所以内容都一样,也都同步更新,而赋值功能失灵 -->
        <!-- 简单解决: 之前我们用过,使用v-if,每次都重新创建,每次也都重新执行@onCreated,每次也都重新赋值,而后端早就记录了上次编辑的内容了,所以即使editor组件销毁了,内容也不会因此丢失! -->
        <Editor @event="handleUpdateEditorEvent" :content="currentItem['interview']" v-if="dialogUpdateVisible">
        </Editor>
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

    <!-- 预览对话框(点击面试题按钮弹出) -->
    <el-dialog v-model="dialogPreviewVisible" title="预览题库" width="80%">
        <!-- 把内容的以HTML格式显示出来,使用v-html显示(特别信任这个后端的数据), {{}}不行,为了防止脚本攻击,vue设置了阻拦 -->
        <!-- 新组件,卡片组件,样式更好看,shadow属性改为hover,鼠标移动上去后,显示阴影 -->
        <el-card shadow="hover">
            <div v-html="currentItem.interview"></div>
        </el-card>
    </el-dialog>
</template>

<script setup>
import ImportExcel from '../../util/ImportExcel'
import axios from 'axios'
import { ref, onMounted, computed } from 'vue';
// import Editor4 from '../../components/editor/Editor4.vue'; // v4版本
import Editor from '../../components/editor/Editor.vue'; // v5版本(用这个)
import { useUserStore } from '../../store/useUserStore';

// 无法响应时的更新
const {user:{role:{roleType}}} = useUserStore() // 获取用户的信息roleType

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

// 记录当前是哪个对象的信息
const currentItem = ref({}) // 记录整个对象的信息
// dialog弹出框
const dialogUpdateVisible = ref(false) // 负责更新面试题弹出框
const dialogPreviewVisible = ref(false) // 负责预览题库弹出框
// 更新题库函数
const handleUpdate = (item) => {
    // console.log(item)
    currentItem.value = item
    dialogUpdateVisible.value = true
}

// editor组件,子传父触发函数
const handleUpdateEditorEvent = (data) => {
    // console.log(data) //获取子信息
    // console.log(currentItem.value) 
    // 这里有个坑,更新数据的速度
    // 在子组件中, onBlur事件下发送的信息速度甚至比handleUpdateConfirm(dialog更新确认按钮函数)都慢,导致发送的数据中对于interview根本没有更新
    // 解决: 把onBlur事件替换为onChange事件
    currentItem.value["interview"] = data // 把当前点击的数据interview属性值改为编辑区的内容
}

// dialog,更新确认按钮函数
const handleUpdateConfirm = async () => {
    // 当点击确定提交按钮时,提交编辑区的信息给后端,路径中传递了_id,用于确定是更新的哪个公司的题库
    await axios.put(`/adminapi/companys/${currentItem.value._id}`, currentItem.value)

    dialogUpdateVisible.value = false
    // 这里没使用 await getList(),是因为子传父已经在handleUpdateEditorEvent函数内部把编辑区内容(currentItem.value["interview"])更新了,这里相当于优化的代码,减少了1次后端请求
    // 之前不这么做的原因是数据太多了麻烦,这里就一个数据data
}

// 预览面试题函数
const handlePreview = (data) => {
    // console.log(data.interview) // 可以拿到当前对象的面试题内容
    currentItem.value = data // 记录当前对象
    dialogPreviewVisible.value = true
}



</script>