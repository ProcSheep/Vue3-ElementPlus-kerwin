<template>
    <!-- 24栏layout -->
    <!-- 行提供 gutter 属性来指定列之间的间距，其默认值为0,这里左右平分(12-12)页面,中间间隔20px -->
    <div id="home">
        <!-- v-if="isCreated",当我们的数据请求完毕时再进行页面(echarts)的渲染 -->
        <!-- echarts组件继续包装进components文件夹内的home -->
        <el-row :gutter="20" class="parent" v-if="isCreated">
            <!-- 左边 -->
            <el-col :span="12">
                <!-- 父传子 -->
                <classAverageEchart :data="{ studentsData, classData, tagsData }"></classAverageEchart>
            </el-col>
            <!-- 右边 -->
            <el-col :span="12">
                <el-row :gutter="20" class="parent">
                    <!-- 撑满24,换行,上下布局 -->
                    <el-col :span="24" class="item">
                        <!-- 右上,全体学生平均值 -->
                        <AverageEchart :data="{ studentsData, tagsData }"></AverageEchart>
                    </el-col>
                    <el-col :span="24" class="item">
                        <!-- 右下,全体学生风险评估(倒数5名) -->
                        <DangerStudent :data="{ studentsData, tagsData }"></DangerStudent>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import classAverageEchart from '../../components/home/classAverageEchart.vue'
import AverageEchart from '../../components/home/AverageEchart.vue'
import DangerStudent from '../../components/home/DangerStudent.vue'

const studentsData = ref([])
const classData = ref([])
const tagsData = ref([])

const isCreated = ref(false) // 控制创建echarts的属性
onMounted(async () => {
    // 函数本身的异步不会影响外面的同步执行,所以外面也要异步
    // 一个页面多个axios,会闪现多次loading组件的显示,每一次axios的'请求与成功'拦截,都会执行一次loading的显示(/util/axios.config.js)
    // 为了loading组件显示更好,把axios所有的请求综合到一起
    // promise的all方法,内部是数组,当数组内的所有请求都完成时,才算完成进入下一步
    // all方法没有先后顺序要求,所以这三个await不能有强制的先后顺序
    // 测试: 在调试窗口把网络调速度整到3g即可
    await Promise.all([getStudentList(),getClassList(),getTagList()])
    // await getStudentList()
    // await getClassList()
    // await getTagList()

    isCreated.value = true
})

const getStudentList = async () => {
    studentsData.value = await axios.get("/adminapi/students")
}
const getClassList = async () => {
    classData.value = await axios.get("/adminapi/classes")
}
const getTagList = async () => {
    tagsData.value = await axios.get("/adminapi/tags")
}


</script>

<style lang="scss" scoped>
// 大小适配图片
.parent {
    height: 84vh;

    .item {
        height: 50%;
    }
}

// 加背景
#home {
    background: url("../../assets/bg.png") no-repeat center;
    background-size: 100% 100%;
    padding: 10px;
    color: white;
}
</style>