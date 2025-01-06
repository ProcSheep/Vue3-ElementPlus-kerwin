<template>
    <!-- 使用了胶囊柱图,config接受数据,调整样式,为了响应式数据,我们使用计算属性 -->
    <dv-capsule-chart :config="computedComfig" style="width:100%;height:400px; box-sizing: border-box; padding: 20px;" />
</template>

<script setup>
import { computed } from 'vue';
import _ from 'lodash' // 很好用的js库,内含各种算法,方法
const props = defineProps(["datalist"])
// 加工props数据,作为data的参数,风格应为: name->公司名;value->就职学生人数
// console.log(props.datalist)
// 问题: props.datalist为空 
// 原因: 我们数据获取是异步的,当组件构建完成时,异步数据还没请求过来,即使是onMounted也早于数据的异步获取
// 解决: 使用计算属性,特性是随着数据的变化实时更新,所以即使一开始没有数据,只要后期数据请求过来了,计算属性会帮我们响应式地更新数据
const computedComfig = computed(() => {
    // 在这里对数据二次加工成对应的格式
    let { datalist } = props
    // 使用lodash,分组方法,groupBy() 第一个参数是要分组的对象,第二个参数是依据什么进行分组(每一项的company属性),即按照公司把datalist进行分组
    // 注意: 第二个参数的item会自动检索datalist的每一项数据
    // console.log(_.groupBy(datalist, item => item.company)) 
    // 结果是对象,每个item由"属性(公司名):属性值(数组)"组成,其中数组内部是对象,每个对象是就职于本公司的学生信息
    let groupObj = _.groupBy(datalist, item => item.company)
    let configData = []
    for(let item in groupObj){
        configData.push({
            name: item, // key 公司名
            value: groupObj[item].length // groupObj[item]=value,学生人数就取长度length
        })
    }
    // 最后倒序排序(大到小),基于configData内部的value属性排序,截取前8个公司
    const data = configData.sort((item1,item2)=>item2.value - item1.value).slice(0,8)

    return {
        data, // 简写
        colors: ['#e062ae', '#fb7293', '#e690d1', '#32c5e9', '#96bfff'],
        unit: '人数',
    }
})


</script>