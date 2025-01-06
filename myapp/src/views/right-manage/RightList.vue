<template>
    <!-- table表格/树形数据与懒加载: 支持树类型的数据的显示,当row中包含children字段时,被视为树形数据,渲染嵌套数据需要prop的row-key -->
    <!-- 把row-key设置为path,children内部没有_id属性,直接取数据tableData中的path属性值 -->
    <el-table :data="tableData" style="width: 100%" row-key="path">
        <!-- 没有v-for的情况下如何把数据对应正确的放在对应的列,prop属性至关重要,tableData的所有data属性放在prop=data的组件里,以此类推剩余两个 -->
        <el-table-column prop="title" label="权限名称" width="180" />
        <!-- 图标部分,需要ele中找到table的自定义表头组件,align是列的靠向 -->
        <el-table-column align="left" label="图标" width="180">
            <!-- 作用域插槽,组件获取子组件暴漏的内容scpoe -->
            <template #default="scope">
                <!-- 组件暴漏的内容scope正是我们的整个tableData数组, .row是取内部每一项item(本行的数据), .icon就取到了内部的icon字符串 -->
                <!-- {{scope.row.icon}} -->
                <el-icon size="20">
                    <!-- 和component/mainbox/SideMenu.vue中对侧边栏的图标显示一样 -->
                    <component :is="mapIcon[scope.row.icon]"></component>
                </el-icon>
            </template>
        </el-table-column>
        <!-- 最右侧也是定制化,定制化内容是按钮 -->
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

    <!-- 对话框dialog组件 -->
    <!-- v-model双向绑定: dialogVisible为true就显示,为false就隐藏 -->
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
                <el-button @click="dialogVisible = false">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios'
// 引入icon图标
import { TrendCharts, User, Key, List, Grid, OfficeBuilding, PieChart, School } from '@element-plus/icons-vue'
// 映射对象
const mapIcon = {
    TrendCharts, User, Key, List, Grid, OfficeBuilding, PieChart, School
}
const tableData = ref([])
// 控制对话框的显示
const dialogVisible = ref(false)
// 权限列表的title名称
const updateForm = reactive({
    title: ""
})
// 临时保存更新的项(用于提交put的请求req)
const currentItem = ref({})


onMounted(() => {
    getList()
})

const getList = async () => {
    var { data } = await axios.get("/adminapi/rights") // 后端型
    // var { data } = await axios.get("/lib/rights.json") // 静态资源获取
    console.log(data)
    tableData.value = data
}
// 点击更新按钮---更新事件处理
const handleUpdate = (item) => {
    // console.log(item)
    dialogVisible.value = true
    // 改变表单的内容为本行数据的title值
    updateForm.title = item.title
    // 保存这次的数据
    currentItem.value = item
}

// 更新表单-->向后端发送请求
// 更新表单的确认按钮
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
</script>