<template>
    <!-- datav-vue3 轮播图 -->
    <div demo-bg>
        <!-- 使用计算属性configData,复用前面两个组件的css样式 -->
        <dv-scroll-board :config="configData" style="width:100%;height:400px; box-sizing: border-box; padding: 20px;" />
    </div>
</template>


<script setup>
import { computed } from 'vue';

// 同理,计算属性处理出合适的数据结构
const props = defineProps(["datalist"])
const configData = computed(() => {
    let { datalist } = props
    // 根据入职日期进行排序,日期越大,代表最近入职,就在上面
    // 日期employ_date数据是字符串格式,无法进行比较,需要转化为时间戳
    // Date.parse(String) --> 转化为Number时间戳
    // 倒序排序 item2 - item1 (大到小)
    // 记住英文:  Date 日期; Data 数据
    let data = datalist.sort((item1, item2) => Date.parse(item2.employ_date) - Date.parse(item1.employ_date))
    // console.log(data)

    // data是二维数组的格式 使用之前用过的Object.entries() 把对象的key和value转化为对应的二维数组
    // 所以我们要构建合适的对象结构,然后利用这个方法转为对应的二维数组
    const configObj = {} // 组装合适的对象结构
    data.forEach(item=>{ // 遍历data数组的每一项学生就业信息
        // 对象的key(学生名) = 对象的value(公司名)
        configObj[item.studentname] = item.company 
    })
    console.log(Object.entries(configObj)) // 结构正确的二维数组

    return {
        header: ['学生', '公司'],
        data: Object.entries(configObj),
        index: true, // index 显示行号 Boolean
        columnWidth: [50], // 列宽
        align: ['center'], // 列对齐方式
        // headerBGC 表头背景色	String
        // oddRowBGC 奇数行背景色 String
        // evenRowBGC 偶数行背景色 String
        headerBGC: 'rgba(0,0,0,0)', // 统一透明
        oddRowBGC: 'rgba(0,0,0,0)',
        evenRowBGC: 'rgba(0,0,0,0)',
        // carousel	轮播方式 String	'single'/'page'(一个一个滚动/一页一页滚动)	
        carousel: 'page',
        waitTime: 4000 // 等待时间(ms) Number
    }
})
// 数据模板
// const config = {
//     header: ['学生', '公司'],
//     data: [
//         ['行1列1', '行1列2', '行1列3'],
//         ['行2列1', '行2列2', '行2列3'],
//         ['行3列1', '行3列2', '行3列3'],
//         ['行4列1', '行4列2', '行4列3'],
//         ['行5列1', '行5列2', '行5列3'],
//         ['行6列1', '行6列2', '行6列3'],
//         ['行7列1', '行7列2', '行7列3'],
//         ['行8列1', '行8列2', '行8列3'],
//         ['行9列1', '行9列2', '行9列3'],
//         ['行10列1', '行10列2', '行10列3'],
//     ],
//     index: false, // index 显示行号 Boolean
//     columnWidth: [50], // 列宽
//     align: ['center'], // 列对齐方式
//     // headerBGC 表头背景色	String
//     // oddRowBGC 奇数行背景色 String
//     // evenRowBGC 偶数行背景色 String
//     headerBGC: 'rgba(0,0,0,0)', // 统一透明
//     oddRowBGC: 'rgba(0,0,0,0)',
//     evenRowBGC: 'rgba(0,0,0,0)',
//     // carousel	轮播方式 String	'single'/'page'(一个一个滚动/一页一页滚动)	
//     carousel: 'page',
//     waitTime: 4000 // 等待时间(ms) Number
// }
</script>