<template>
    <!-- table表单 -->
    <!-- data选择computedTableData为了获取筛选好的学生姓名构建新的列表 -->
    <el-table :data="computedTableData" style="width: 100%">
        <el-table-column>
            <!-- table自定义表头 -->
            <template #header>
                <!-- 双向绑定的数据记录你输入的值,搜索框有禁用限制,学生不可用 -->
                <el-input v-model="search" size="small" placeholder="请输入学生的名字" :disabled="roleType===3" />
            </template>
            <template #default="scope">
                {{ scope.row.studentname }}
            </template>
        </el-table-column>
        <!-- table表格的筛选功能,:filter是数据匹配,:filter-method是点击确定后筛选处理事件函数,filter-placement是下拉列表的位置(无所谓) -->
        <el-table-column label="班级" :filters="computedClass" :filter-method="filterClass" filter-placement="bottom-end">
            <template #default="scope">
                {{ scope.row.class.title }}
            </template>
        </el-table-column>

        <el-table-column label="综合评分" min-width="140">
            <template #default="scope">
                <!-- rate组件 -- 评分,评分先固定写,使用属性model-value固定为3,colors是引入的数组 -->
                <!-- 这里评分是在"操作"栏中,经过所有评分后,平均算的,所以这个评分是禁用的,传入只读属性disabled,允许半星allow-half -->
                <!-- 综合评分汇总就是一个小算法,综合评分是阶段式,未评分的科目不录入评分范畴,在已评分的科目中计算平均 -->
                <el-rate :model-value="getAllRate(scope.row)" :colors="colors" disabled allow-half />
            </template>
        </el-table-column>
        <el-table-column label="评分进度" min-width="160">
            <template #default="scope">
                <!-- 进度条组件progress,用第一个最简单的,percentage是进度条进度,是数字,我们动态获取 -->
                <el-progress :percentage="getProgress(scope.row)" />
            </template>
        </el-table-column>
        <!-- 点击评分,拉出'抽屉'侧边栏,Drawer 抽屉组件 -->
        <el-table-column align="left" label="操作">
            <template #default="scope">
                <!-- 调整下高度,显示出红色标点,调整某一个的行高,这一行的行高都会跟着变化 -->
                <div style="display: flex; align-items: center; height: 55px;">
                    <!-- 插槽内加新组件badge,显示小红点(剩余未完成评分操作的数量) -->
                    <!-- hidden属性是隐藏,当我们未评分的数量为0时,隐藏掉红色标点显示 -->
                    <el-badge :value="getBadge(scope.row)" class="item" :hidden="getBadge(scope.row) === 0">
                        <el-button round type="primary" @click="handleRate(scope.row)">评分</el-button>
                    </el-badge>
                </div>
            </template>
        </el-table-column>
        <!-- 占位,没内容 -->
        <el-table-column />
    </el-table>

    <!-- 抽屉组件,direction抽屉从右向左出rtl,文档固定的; v-model绑定的是boolean属性,关乎是否拉出'抽屉' -->
    <!-- size: Drawer 窗体的大小, 当使用 number 类型时, 以像素为单位, 当使用 string 类型时, 请传入 'x%', 否则便会以 number 类型解释 -->
    <el-drawer v-model="outDrawer" title="I am the title" direction="rtl" :size="size">
        <!-- 自定义抽屉的头部 -->
        <template #header>
            <h4>学生战力分析</h4>
        </template>
        <div>
            <!-- 按钮+图标(记得引入) :icon=图标 -->
            <!-- 可视化分析图,echarts插件,需要'二级抽屉'(嵌套抽屉),组件drawer里有 -->
            <!-- 如果你需要在不同图层中多个抽屉，你必须设置 append-to-body 属性到 true -->
            <el-button round type="primary" :icon="PieChart" @click="handlePie"></el-button>
            <el-drawer v-model="innerDrawer" title="学生战力分析" :append-to-body="true" size="45%"
                :before-close="handleClose">
                <!-- 这里放echarts的组件(需下载npm install echarts),从外层引入(components/student-manage),不再本页冗余代码了 -->
                <!-- 父传子,分别是'所有的学生表,当前点击的学生,13个标签(科目)' -->
                 <!-- 浏览器创建销毁可以帮助我们多次执行组件的onMounted函数,从而我们可以观察不同同学的战力数据 -->
                <StudentChart :data="{ tableData, currentItem, tagData }" v-if="innerDrawer"></StudentChart>
            </el-drawer>
        </div>
        <!-- 分割线组件 -->
        <el-divider />
        <!-- alert组件,支持插槽,直接把内容写在里面,show-icon是图标(默认提供) -->
        <el-alert type="info" show-icon>
            请为<b style=" font-size: 20px;">{{ currentItem.studentname }}</b>同学评分
        </el-alert>
        <el-divider />
        <!-- 评分板 -->
        <div v-for="item in tagData" :key="item._id">
            <div class="rate-item">
                <div>{{ item.title }}</div>
                <!-- 评分: 监听handleRateEvent,获取点击的值($event默认数据) -->
                <!-- XXX可清空: clearable 双击相同分数清空为0 -->
                 <!-- rate打分表禁用 -->
                <el-rate :colors="colors" allow-half @change="handleRateEvent($event, item.title)"
                    :model-value="getItemRate(item.title)" clearable :disabled="roleType===3" />
            </div>
            <el-divider></el-divider>
        </div>

    </el-drawer>
</template>


<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import {useRoute} from 'vue-router'
import axios from 'axios'
import { PieChart } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
// 引入echart的组件 components
import StudentChart from '../../components/student-manage/StudentChart.vue';
import { useUserStore } from '../../store/useUserStore';

// 无法响应时的更新
// useUserStore是pinia,获取user表信息
const {user:{role:{roleType},username}} = useUserStore() // 获取用户的信息roleType

// 基本列表的架构
const tableData = ref([])
const classData = ref([])
const tagData = ref([])

const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900']) // 评分颜色板 1->5颜色不同
// 获取当前路由的path,进而获取其内部的query.name,用于接收path中query传参的name属性
const route = useRoute()
const search = ref(route.query.name || "") // 搜索学生框的双向绑定,如果有相关信息就直接搜索,如果没有就默认空字符串

// 抽屉是否显示的双向绑定,默认为false
const outDrawer = ref(false) // 外层抽屉
const innerDrawer = ref(false) // 内层抽屉
const size = ref("30%")
// 评分: 记录当前点击的信息,handleRate内部
const currentItem = ref({})

onMounted(() => {
    if(roleType===3){ // 搜索框禁用后,需要自动赋值本学生名字搜索出本学生的信息
        search.value = username
    }
    getList()
    getClassList()
    getTags()
})
// 请求学生数据
const getList = async () => {
    var { data } = await axios.get("/adminapi/students")
    tableData.value = data
    // console.log("tableData",tableData.value)
}
// 请求班级数据
const getClassList = async () => {
    var { data } = await axios.get("/adminapi/classes")
    classData.value = data
}
// 请求标签数据
const getTags = async () => {
    var { data } = await axios.get("/adminapi/tags")
    tagData.value = data
}
// 计算属性计算table数据,然后把过滤的属性放在table表中,箭头函数后面就一句话,默认返回
const computedTableData = computed(() => tableData.value.filter(
    // 筛选条件: 因为全是中文所以不在乎大小写匹配,计算属性返回过滤好的新数据
    data => data.studentname.includes(search.value)
))

// 对classes表做映射,title->text _id->value,然后放入动态绑定的属性:filters里面
const computedClass = computed(() => {
    // 映射操作,把原来的相关数据放入新的对象结构,映射为一个符合要求的新对象 text: title + value: _id 
    return classData.value.map(item => ({
        text: item.title,
        value: item._id
    }))
})
/*  官网的用法
    筛选的列表: text是筛选下拉的名字 value是帮你找到所筛选数据的id,我们会根据value去后端找对应的数据
    :filters="[
        { text: 'Home', value: 'Home' },
        { text: 'Office', value: 'Office' },
    ]"
*/
// 筛选函数,默认第一个参数是我们勾选的选项所对应的value; 第二个参数是我们根据value找到的数据
// 比如点击的2001班,在filters中 title: 2001 value: 2001的ObjectId
// 第一个参数value: 2001的ObjectId; 第二个参数item: 2001班的6个学生数据(proxy对象),会自动把每一个遍历出来,一个个对应
const filterClass = (value, item) => {
    // console.log(value,item)
    return value === item.class._id
    // 返回true会显示,false不显示
}


// 评分函数
const handleRate = (item) => {
    // console.log("123")
    outDrawer.value = true // 打开抽屉 
    currentItem.value = item
    // console.log(currentItem)
}
// 记录评分
const handleRateEvent = async (value, title) => {
    console.log(value, title) // 获取评分和科目
    // 学生的信息id已经从currentItem获取了
    // 更新students的score数据,去后端写更新函数(动态路由版)
    await axios.put(`/adminapi/students/${currentItem.value._id}`, {
        key: title,
        value: value
    })
    // message评分组件,需要引入
    ElMessage({
        message: `${currentItem.value.studentname}的${title}的评分已更新`,
        type: 'success',
        plain: true,
    })

    await getList()
}

// 返回对应科目分数的函数,参数title是当前打分的科目
const getItemRate = (title) => {
    // return currentItem.value.score[title] // 当前打分的对象的score中的value(分数)
    // 这么写有个小问题,就是只有刷新页面后才会更新页面
    // 原因: 虽然后端更新了,但是currentItem还是刚开始点开评分获取的初始值,不过通过getList获取的tableData数据就是实时更新的后端数据了,使用id从tableData中过滤出是哪个学生,然后取score表内对应的科目title,即可实现实时更新
    // console.log(tableData.value,currentItem.value)
    // console.log(tableData.value.filter(item=>item._id === currentItem.value._id))
    return tableData.value.filter(item => item._id === currentItem.value._id)[0].score[title]
}

// 获取剩余为评分的项
const getBadge = ({ score }) => {
    let keys = Object.keys(score) // 获取score数组的key值
    // 未评分的个数 = 总标签数的长度(总科目个数) - 已评分数组的长度(已评分个数)
    return tagData.value.length - keys.length
}
// 进度条获取
const getProgress = ({ score }) => {
    if (tagData.value.length === 0) return 0  // 如果tableData的数据还没来及获取,我们就直接返回0,或者你在onMounted中把getList()放在getTag()下面,先获取tagData再获取tableData,防止出现除0现象,NaN
    let keys = Object.keys(score) // 已经评分的科目
    // console.log(keys) // 把score学生的key拿出来做成数组了
    // 百分制数字类型,比如返回50,在进度条组件里代表就是50%
    // 四舍五入的取整
    // 注意: 这里即使一个人全零蛋,那也叫100%完成度
    return Math.round((keys.length / tagData.value.length) * 100)
}
// 获取综合评分的函数
const getAllRate = ({ score, studentname }) => { // 只对评分的科目计算
    let values = Object.values(score) 
    // console.log(studentname,values) // 单独把score学生的成绩值value拿出来做成数组了
    let total = values.reduce((prop, current) => prop + current, 0) // reduce会记录上一次的值,上一次的值+这次的值,依次累加,prop初始值必须定义,这里定义为0,current是values数组的每一项数据,其实就是成绩值
    // console.log("total",total)
    // console.log("values.length",values.length)
    // console.log("average",total / (values.length || 1))
    // 防止一个学科没有人导致除0现象
    return total / (values.length || 1) // 总成绩/已评分科目的个数
}

// 嵌套抽屉 战力分析按钮点击处理时间函数
const handlePie = () => {
    innerDrawer.value = true
    // 改变外部抽屉的大小(30%->65%),内层设置45%
    size.value = "65%"
}

// 嵌套抽屉关闭时,点击 X,出发的事件处理函数
const handleClose = () => {
    // 关闭嵌套抽屉时,再把外层抽屉的宽度改回来
    size.value = "30%"
    innerDrawer.value = false
}

</script>

<style lang="scss" scoped>
.rate-item {
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>