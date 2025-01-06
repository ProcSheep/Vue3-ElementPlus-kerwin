<template>
    <!-- 排名轮播表(自动对数据排序),css样式复制welcompany.vue -->
    <dv-scroll-ranking-board :config="computedConfig"
        style="width:100%;height:400px; box-sizing: border-box; padding: 20px;" />
</template>

<script setup>
// 和welcompany一样
import _ from 'lodash' // js算法库,数据分组使用
import { computed } from 'vue'
const props = defineProps(["datalist"])
// 和welcompany差不多,且不用排序操作
const computedConfig = computed(() => { // 响应式接受数据,不会受异步影响(datalist是异步获取的)
    let { datalist } = props // 解构父信息
    let groupObj = _.groupBy(datalist, item => item.company)
    // console.log(groupObj)
    let configData = []
    for (let item in groupObj) {
        configData.push({
            name: item,
            // 公司入职学生平均值 = 入职学生工资总合/入职学生人数 (注意,salary在后端是字符串格式,转为数字类型)
            value: groupObj[item].reduce((total, item) => total + Number(item.salary), 0) / groupObj[item].length
        })
    }
    // console.log(configData)
    
    // 这个组件可以自动排序,所以直接把数据放进去即可
    return {
        data: configData,
        color: 'rgb(29,193,245)', // 进度条颜色
        unit: "元"
    }
})

// value: 记录本公司入职学生的工资平均值,做排序; name公司名
// const config = {
//     data: [
//         {
//             name: '周口',
//             value: 55
//         },
//         {
//             name: '南阳',
//             value: 120
//         },
//         {
//             name: '西峡',
//             value: 78
//         },
//          ........
//     ],
//     color: 'rgb(29,193,245)', // 进度条颜色
//     unit: "元"
// }


</script>