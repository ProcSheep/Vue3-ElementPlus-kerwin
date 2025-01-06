<!--
 * @作者: kerwin
-->
<template>
    <div id="studentchart" style="height:100%;">
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, nextTick } from 'vue';
const props = defineProps(["data"])
// console.log(props.data)

const handleData = ({ tableData, currentItem, tagData }) => {
    let lengendData = [currentItem.class.title + "班平均值", currentItem.studentname]
    // 
    let indicatorData = tagData.map(item => ({ name: item.title, max: 5 }))

    // console.log(indicatorData)

    const currentClass = tableData.filter(item => item.class._id === currentItem.class._id)

    // console.log(currentClass)
    const average = []

    tagData.forEach(({ title }, index) => {
        var filterArr = currentClass.filter(item => item.score[title])

        average[index] = (filterArr.map(item => item.score[title]).reduce((total, item) => total + item, 0) / (filterArr.length || 1)).toFixed(2)
    })

    // console.log(average)

    const averageObj = {
        name: lengendData[0],
        value: average
    }

    const currentObj = {
        name: lengendData[1],
        value: tagData.map(({ title }) => currentItem.score[title] ? currentItem.score[title] : 0)
    }

    const seriesData = [averageObj, currentObj]

    return {
        lengendData,
        indicatorData,
        seriesData
    }
}
onMounted(() => {
    nextTick(() => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('studentchart'));

        let { lengendData,
            indicatorData,
            seriesData } = handleData(props.data)
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'item',
                //鼠标跟随
                position: function (point, params, dom, rect, size) {
                    // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
                    // 提示框位置
                    var x = 0; // x坐标位置
                    var y = 0; // y坐标位置

                    // 当前鼠标位置
                    var pointX = point[0];
                    var pointY = point[1];

                    // 外层div大小
                    // var viewWidth = size.viewSize[0];
                    // var viewHeight = size.viewSize[1];

                    // 提示框大小
                    var boxWidth = size.contentSize[0];
                    var boxHeight = size.contentSize[1];

                    // boxWidth > pointX 说明鼠标左边放不下提示框
                    if (boxWidth > pointX) {
                        x = 5;
                    } else { // 左边放的下
                        x = pointX - boxWidth;
                    }

                    // boxHeight > pointY 说明鼠标上边放不下提示框
                    if (boxHeight > pointY) {
                        y = 5;
                    } else { // 上边放得下
                        y = pointY - boxHeight;
                    }

                    return [x, y];
                }

            },
            legend: {
                data: lengendData
            },
            radar: {
                // shape: 'circle',
                indicator: indicatorData
            },
            series: [
                {
                    name: 'Budget vs spending',
                    type: 'radar',
                    data: seriesData
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    })
})

// onUpdated
</script>