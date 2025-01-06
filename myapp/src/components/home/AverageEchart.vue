<template>
    <div id="averageEchart">
        averageEchart
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
// 1.导入echarts
import * as echarts from 'echarts';
// 接受父信息(不再需要classData信息)
const props = defineProps(["data"])

const handleDate = ({ studentsData, tagsData }) => {
    return {
        angleAxisData: tagsData.data.map(item => item.title), // 角度轴,标签科目映射
        seriesData: getAverage(studentsData, tagsData)
    }
}

const getAverage = (studentsData, tagsData) => {
    const average = []
    tagsData.data.forEach(({ title }, index) => {
        let filterArr = studentsData.data.filter(item => item.score[title]) // 过滤所有学生有这个成绩的
        average[index] = (filterArr.map(item => item.score[title]).reduce((total, item) => total + item, 0) / (filterArr.length || 1)).toFixed(2)
    })
    return average
}

onMounted(() => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('averageEchart'));
    // 数据处理函数 
    let { angleAxisData, seriesData } = handleDate(props.data)

    // 配置参数(来自'示例/柱状图/极坐标柱状图')
    var option = {
        title: [ // 标题
            {
                text: '全体学生技术Tag强弱图',
                textStyle: {
                    fontSize: 14,
                    color: "#fff"
                }
            }
        ],
        polar: {
            radius: [30, '80%']
        },
        radiusAxis: { // 角度轴y轴最大值 =5
            max: 5,
            axisLine: { // y轴颜色
                lineStyle: {
                    color: "#fff"
                }
            }
        },
        angleAxis: { // angle意为'四周',角度轴
            type: 'category',
            // data: ['a', 'b', 'c', 'd'], // 未来是Tags学科名字,角度轴数据
            data: angleAxisData,
            startAngle: 75,
            axisLine: { // 角度轴颜色
                lineStyle: {
                    color: "#fff"
                }
            }
        },
        tooltip: {},
        series: {
            type: 'bar',
            // data: [2, 1.2, 2.4, 3.6], // 对应学科全部学生的平均值
            data: seriesData,
            coordinateSystem: 'polar',
            label: {
                show: true,
                position: 'middle',
                // formatter: '{b}: {c}' 
                formatter: '' // 不显示每一条柱状的名称,显示不开
            }
        },
        colorBy:"data", // 和之前不同,这里的数据共属于一条,即全部学生,而非2001 2002 2003的区分,所以要添加新属性,每一个数据独有一个颜色
        // 调色盘,提供更多的颜色
        color: ['#FCCE10', '#E87C25', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD', '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'],
        animation: true // 有动画
    };

    myChart.setOption(option);
})
</script>

<style scoped>
#averageEchart {
    height: 100%;
    /* 透明的背景图 */
    background: url('../../assets/t_bg.png') no-repeat center;
    background-size: 100% 100%;
}
</style>