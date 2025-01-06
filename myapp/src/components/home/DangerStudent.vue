<template>
    <!-- el-table表格组件,加了点样式,保证el-table不溢出又有合理间距 -->
    <el-table id="DangerStudent" :data="tableData" style="width: 100%; height: 90%; margin-top: 5%;" class="table">
        <el-table-column label="风险学生">
            <template #default="scope">
                <!-- 给学生名字添加新组件,el-link,新增跳转功能,跳转到学生列表,并把当前学生的信息搜索出来 -->
                <!-- el-link 支持style属性,直接css定义颜色 -->
                <el-link style="color: white;" @click="handleClick(scope.row.studentname)">{{ scope.row.studentname }}</el-link>
            </template>
        </el-table-column>

        <el-table-column label="班级">
            <template #default="scope">
                {{ scope.row.class.title }}
            </template>
        </el-table-column>

        <el-table-column label="低tag值技术">
            <template #default="scope">
                <!-- 不要以数组的形式显示,用' | '的形式连接在一起 -->
                {{ scope.row.lowTag.join(" | ") }}
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import {useRouter} from 'vue-router'
// 接受父信息
const props = defineProps(["data"])
const tableData = ref([])

const handleData = ({ studentsData, tagsData }) => {
    const averageStudent = []
    studentsData.data.forEach((item, index) => {
        let values = Object.values(item.score) // 只把此学生数据中的score属性拿出来,没有测评的科目不会被记入
        // 总成绩/学科数量(保留2位小数)
        let averageValue = (values.reduce((total, item) => total + item, 0) / values.length).toFixed(2)
        // 如果此学生所有科目都没有打分,这个values.length长度是0,结果为NaN(除0),这种学生属于还未测评的学生,不属于我们考虑范畴内,需要过滤
        // console.log(item,averageValue)

        if (!isNaN(averageValue)) { // 意思是如果这个学生是NaN的情况,即所有科目都还未测评的,则筛出去,不添加进最终数组
            averageStudent.push({
                ...item, // 学生的所有数据
                averageValue // 学生已有科目的平均分
            })
        }
    })

    // 对筛选后学生的平均分averageValue把所有对象进行排序
    averageStudent.sort((item1, item2) => item1.averageValue - item2.averageValue) // averageValue(个人成绩平均分)的大小排序
    // console.log(averageStudent)

    // 截取前5名,即平均分倒数5名的学生信息
    let students = averageStudent.slice(0, 5)
    let finalStudents = [] // 最终学生数据
    // 获取这5名学生数据低Tag值
    students.forEach((item, index) => {
        // 对每位学生的成绩进行枚举,转化为对应的二维数组
        // Object.entries()方法是 JavaScript 中用于将一个对象自身可枚举的属性[key, value]对转换为一个二维数组的方法。其中，每个子数组包含两个元素：第一个元素是属性名（键），第二个元素是属性值。
        let lowTag = Object.entries(item.score).sort((item1, item2) => item1[1] - item2[1]).slice(0, 5).map(item => item[0]) // 排序是对数组的第二项(即array[1])学生学科成绩进行排序,再截取前5项(最低的5项),有几个截取几个,最后我们映射这些数组的第一项[0],我们要的是其学科名
        // console.log(lowTag)
        finalStudents.push({
            ...item,
            lowTag
        })
    })
    // console.log(finalStudents) // 最后5名倒数学生数据和其最差的5们学科信息lowTag

    return finalStudents
}

onMounted(() => {
    tableData.value = handleData(props.data)
    console.log(tableData.value)
})

// 记得引入useRouter
const router = useRouter()
// 点击学生名字跳转事件处理函数
const handleClick = (name)=>{
    // console.log(name)
    // view跳转到studentlist路由,忘了path去router文件夹的config.js看
    // 传递参数,使用query方式(vue基础讲push跳转时讲过,如何携带参数及如何获取参数),不能使用${},这样浏览器会把name当作路由路径的一部分,最后就是404
    router.push(`/student-manage/studentlist?name=${name}`)
}


</script>


<style scoped lang="scss">
.table {
    background: url('../../assets/t_bg.png') no-repeat center;
    background-size: 100% 100%;

    // 原本el-table就有背景样式,记得这里给组件内部的标签加css样式需要深度选择 :deep()
    // 加上层级,级别最高(!important),所有的css样式都听我的
    :deep(tr) {
        background-color: rgba($color: #fff, $alpha: 0) !important; // 背景透明,alpha为透明度(0-1),这是完全透明的白色,注意: 纯 CSS 中通常没有$符号来定义参数,这里是scss下的写法,正常写在rgba的第四个参数, 纯css: rgba(255,255,255,0)
        color: white
    }

    :deep(th) {
        background-color: rgba($color: #fff, $alpha: 0) !important;
        color: white
    }

    :deep(tr):hover td {
        background-color: rgba($color: #fff, $alpha: 0) !important;
    }
}
</style>