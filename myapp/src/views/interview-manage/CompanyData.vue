<template>
    <div id="companydata">
        <!-- 24栏组件,三等分,间距20px -->
        <!-- 整体使用datav大屏组件 边框10,里面的三个部分,两侧都是边框11,中间使用的是边框8 -->
        <dv-border-box10>
            <el-row :gutter="20">
                <el-col :span="8">
                    <dv-border-box11 title="最受欢迎的公司" :title-width="400" :animate="false">
                        <!-- 父传子: 传递入职公司学生的各项数据信息 -->
                        <!-- 设置class属性,目的是设置css样式,三个组件都共有这个class属性,这个class属性会透传到子组件,css样式也同理 -->
                        <!-- 设置好定位后的内容可以正常地显示在内容中心,而不是左上角 -->
                        <Welcompany :datalist="datalist" class="company_data"></Welcompany>
                    </dv-border-box11>
                </el-col>
                <el-col :span="8">
                    <!-- dur: 单次动画时长(秒) -->
                    <dv-border-box8 :dur="5">
                        <!-- 装饰7: 标题边框 -->
                        <dv-decoration7 style="width:100%;height:50px;">
                            <div style="font-size:20px; color: white;">最不差钱的公司</div>
                        </dv-decoration7>
                        <!-- 透传company_data的css样式 -->
                        <RichCompany class="company_data" :datalist="datalist"></RichCompany>
                    </dv-border-box8>
                </el-col>
                <el-col :span="8">
                    <dv-border-box11 title="最近入职的公司" :title-width="400" :animate="false">
                        <EntryCompany class="company_data" :datalist="datalist"></EntryCompany>
                    </dv-border-box11>
                </el-col>
            </el-row>
        </dv-border-box10>
    </div>
</template>

<script setup>
// 我们可以通过echarts完成这个页面的构建,但是太麻烦了,所以我们使用新框架DataV的改版DataV-Vue3(已收藏),前者框架作者多年未更新了,后者是社区有人写的完善版本,更适配vue3,不过这个网站常常崩溃404,可以结合DataV原网站的vue2部分继续使用,新作者为了切合原版,很多模板使用方式几乎完全一样
// npm install @kjgl77/datav-vue3 下载后,在main.js中挂载

// 和学生大数据思路一样,三个部分的数据在这里统一获取,通过父传子提供给各个组件
import axios from 'axios'
import { onMounted, ref } from 'vue';
// 导入三个部分的组件
import Welcompany from '../../components/company/Welcompany.vue'
import RichCompany from '../../components/company/RichCompany.vue'
import EntryCompany from '../../components/company/EntryCompany.vue'

const datalist = ref([])
onMounted(() => {
    getList()
})

const getList = async () => {
    var { data } = await axios.get("/adminapi/companystudents") // 获取入职公司学生的各项数据信息
    datalist.value = data
}


</script>

<style scoped lang="scss">
#companydata {
    background: url('../../assets/bg.png') no-repeat center;
    background-size: 100% 100%;
    padding: 10px;
    height: 84vh;

    // 三个组件的内容区域的css设置
    .company_data {
        // 三部分边框内容公用的css样式
        position: absolute;
        top: 80px;
        width: 100%;
        color: white;
        text-align: center;
    }
}

.el-row {
    height: 600px;
    padding: 30px;
}
</style>