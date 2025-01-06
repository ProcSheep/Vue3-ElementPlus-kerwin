<template>
    <!-- 没有树形结构了,删掉row-key属性 -->
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

</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
import axios from 'axios'

const tableData = ref([]) // 角色列表
const rightsList = ref([]) // 权限列表
const treeRef = ref(null) // 获取tree对象
// 控制对话框的显示
const dialogVisible = ref(false)
// 权限列表的title名称
const updateForm = reactive({
    roleName: "",
    rights: []
})
// 全局的临时保存
const currentItem = ref({})


onMounted(() => {
    getList()
    getRightList()
})

const getList = async () => {
    // 向新的数据库集合roles请求数据(mongodb时非关系型数据库,叫做集合,在mysql这种关系型数据库中,叫做表)
    var { data } = await axios.get("/adminapi/roles")
    // console.log(data)
    tableData.value = data
}
const getRightList = async () => {
    var { data } = await axios.get("/adminapi/rights")
    console.log(data)
    rightsList.value = data
}

const handleUpdate = (item) => {
    dialogVisible.value = true
    updateForm.roleName = item.roleName
    updateForm.rights = item.rights
    currentItem.value = item // 全局变量存储item,作用是提供给handleConfirm我们点击的那一条数据,是讲师还是管理员,dialog是获取不到的

    // 使用ele提供的一个方法实现默认选中 树的对象.setCheckedKeys
    // 树的对象是通过ref对el-tree组件对象获取
    // 这里有坑,el-dialog是懒惰的,因为默认弹出框是不显示的,所以它不会创建dom,之后我们执行上面的代码dialogVisible.value = true,把dialog虽然是创建出来了,但是创建dialog的dom是异步的,而获取dialog内部的节点(ref)是js同步代码,也就是说第一次点击更新,第一次创建dialog,在此情况下,我们无法获取其节点值treeRef,当第一次创建过后,之后就是节点的隐藏与显示了,节点已经创建完成了,所以在第二次点击更新后,才能获取ref的节点
    // console.log("treeRef.value",treeRef.value)
    // 使用nextTick,他会等待上面的状态更新完成之后(dom创建完成)再执行回调函数,这样不必在update生命周期函数被多次调用
    // 它是一次性的,不过从第二次开始我们也创建好dialog组件了,所以正好走的恰到好处
    nextTick(() => [
        // console.log("treeRef.value",treeRef.value)
        treeRef.value.setCheckedKeys(updateForm.rights)
        // 函数介绍: 设置目前选中的节点，使用此方法必须设置 node-key 属性,(keys, leafOnly) 接收两个参数: 1. 一个需要被选中的多节点 key 的数组 2. 布尔类型的值 如果设置为 true，将只设置选中的叶子节点状态。 默认值是 false.
        // 这里我们只用第一个参数,全选自己身份应有的所有选项
    ])
}

const handleConfirm = async () => {
    dialogVisible.value = false
    // 更新完列表后,点击确认,获取更新后的角色名字和角色权限(勾选了哪些)
    // 把这些数据给后端
    // console.log(updateForm.roleName)
    // console.log(treeRef.value.getCheckedKeys())
    // 更新数据,通过全局数据知道我们这个dialog是点击哪一条数据显示出来的(管理员或教师),获取其_id
    // console.log(currentItem.value._id)

    // getCheckedKeys: 若节点可用被选中 (show-checkbox 为 true), 它将返回当前选中节点 key 的数组
    // 我们点击确定按钮后,从el-tree树结构中获取我们到底给那些权限打勾了,整齐的把其id(也就是我们设置的唯一path)放入数组中
    // rights: updateForm.rights不行,那是初始化全选的权限列表,还没手动勾选更新呢
    // 最后一个问题,发现删除一个孩子,父会跟着消失,连同他的所有孩子,所以这里需要给el-tree设置一个属性check-strictly
    // check-strictly 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false

    // 向后端发送请求,新方法,你也可以学习rights传参方法
    await axios.put(`/adminapi/roles/${currentItem.value._id}`, {
        roleName: updateForm.roleName,
        rights: treeRef.value.getCheckedKeys()
    })
    await getList() // 响应式更新数据
}

const handleDelete = async (item)=>{
    await axios.delete(`/adminapi/roles/${item._id}`)

    await getList() // 响应式更新数据
    // 删完了记得在studio3t添加回来,我们学了前面的知识后,其实也能仿照着加一个添加功能
}

</script>