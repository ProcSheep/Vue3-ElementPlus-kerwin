<template>
    <!-- 为 ECharts 准备一个定义了id和宽高的 DOM,用于装载echarts的内容 -->
    <div id="classAverageEchart">
        classAverageEchart
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
// 1.导入echarts
import * as echarts from 'echarts';

// 接受父信息
const props = defineProps(["data"])
// console.log(props.data)

// 数据处理函数,解构形参
const handleDate = ({ studentsData, classData, tagsData }) => {
    const source = []
    const series = []
    // console.log(tagsData)

    // source第一个数据: 科目的遍历 X轴
    source.push([
        "tags", // 随影起名字
        // 展开运算,tag数组映射出里面的科目title
        ...tagsData.data.map(item => item.title)
    ])
    // console.log(source) 

    // source后面的数据: 班级+班级每科平均分
    classData.data.forEach(item => { // 遍历classData,即遍历出几个班级(几条折线数据)
        // getAverage返回为数字类型,记得展开合并
        var arr = [item.title, ...getAverage(studentsData, tagsData, item._id)]
        source.push(arr)
        series.push({
            type: 'line',
            smooth: true,
            seriesLayoutBy: 'row',
            emphasis: { focus: 'series' }
        })
    })
    // console.log(source) // 测试
    // 最后记得饼状图,属性可以通过官方查文档了解
    series.push({
        type: 'pie',
        id: 'pie',
        radius: '30%',
        center: ['50%', '25%'],
        emphasis: {
            focus: 'self'
        },
        label: { // 初始化显示
            formatter: '{b}班: {@html5}分', // 控制饼状图显示
            // {b}: 占位符,将来拿种类名,2001 2002 2003
            // {@2012}: 默认显示x轴,我们默认显示html5一列的数据
            color: "#fff" // 字体颜色
        },
        encode: {
            // x轴的起点,当时我们起名字tags
            itemName: 'tags',
            value: 'html5',
            tooltip: 'html5'
        }
    })

    return {
        source,
        series
    }

}

// 班级各科目平均值(修改和复用之前的函数,student-manage/StudentChart.vue的handleData内部部分函数)
const getAverage = (studentsData, tagsData, classId) => {
    const currentClass = studentsData.data.filter(item => item.class._id === classId)

    const average = []

    tagsData.data.forEach(({ title }, index) => {
        let filterArr = currentClass.filter(item => item.score[title])
        average[index] = (filterArr.map(item => item.score[title]).reduce((total, item) => total + item, 0) / (filterArr.length || 1)).toFixed(2)
    })

    return average
}



// 2.这里不必nextTick,在父组件当所有的数据都创建完了,才创建出来的,创建代码在onMounted()函数的最后一步,等待所有的工作做完才创建的el-row,里面是咱们的组件
onMounted(() => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('classAverageEchart'));
    // 数据处理函数 
    let { source, series } = handleDate(props.data)

    // 配置参数(来自'示例/数据集')
    var option = {
        title: [
            {   // 饼状图标题设置,位置自适应,如果位置出错记得刷新一下
                text: "各班级技术Tag平均值",
                textStyle: {
                    fontSize: 14,
                    color: "white"
                }

            }
        ],
        legend: { // 改上面图例的样式
            textStyle: {
                fontSize: 14,
                color: "white"
            }
        },
        tooltip: {
            trigger: 'axis',
            showContent: false
        },
        dataset: {
            // source: [ // 第一个数据: X轴; 后面的数据是所有种类及其Y轴
            //     // 第一个应该是tags的13个技术标签(静态遍历创建); 后面的种类应该是2001 2002 2003班及当科的全班平均分(动态创建,可更新)
            //     ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
            //     ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
            //     ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
            //     ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
            //     ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
            // ]
            source // 简写
        },
        // 控制x轴显示,让所有的x轴Tags都显示
        xAxis: {
            type: 'category',
            axisLabel: { // x轴标签
                interval: 0, //间隔
                rotate: 50 // 旋转50度
            },
            axisLine: { // x轴的样式
                lineStyle: {
                    color: "white"
                }
            }
        },
        yAxis: {
            gridIndex: 0,
            max: 5, // y轴最大为5 (5颗星)
            axisLine: { // y轴的样式
                lineStyle: {
                    color: "white"
                }
            }
        },
        grid: { top: '55%' },
        series // 简写,饼状图的初始配置
    };
    // pie饼状图附带监听事件,鼠标移动在折线图上查看数据移动时触发
    myChart.on('updateAxisPointer', function (event) {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
            const dimension = xAxisInfo.value + 1;
            myChart.setOption({
                series: {
                    id: 'pie',
                    label: {  // 之后饼图的动态显示索引 
                        formatter: '{b}班: {@[' + dimension + ']}分'
                    },
                    encode: {
                        value: dimension,
                        tooltip: dimension
                    }
                }
            });
        }
    });

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

})
</script>

<style scoped>
#classAverageEchart {
    height: 100%;
    /* 透明的背景图 */
    background: url('../../assets/t_bg.png') no-repeat center;
    background-size: 100% 100%;
}
</style>