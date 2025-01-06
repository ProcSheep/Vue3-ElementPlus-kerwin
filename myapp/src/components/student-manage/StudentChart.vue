<template>
    <!-- 为 ECharts 准备一个定义了宽高的 DOM ,宽度和高度自适应父组件el-drawer-->
    <div id="studentchart" style="width:100%; height:100%;"></div>
</template>

<script setup>
// 1.导入echarts
import * as echarts from 'echarts';
import { nextTick, onMounted } from 'vue';

// 获取父信息,装入数组
const props = defineProps(["data"])
// console.log(props.data) // 打印测试: .data是因为父组件的传递属性是:data

// 单独处理数据的函数
const handleData = ({ tableData, currentItem, tagData }) => {
    let legendData = [currentItem.class.title + "班平均值", currentItem.studentname]
    // console.log(legendData)

    let indicatorData = tagData.map(item => ({
        name: item.title,
        max: 5
    }))
    // console.log(indicatorData)

    // ------最难的一部分: 个人vs全班平均-------
    // 从所有的学生中过滤出点击的此学生班级
    const currentClass = tableData.filter(item => item.class._id === currentItem.class._id)
    // console.log(currentClass) // 例如张三2001班,那么这里的数据就是所有2001班的学生集合

    // 对于学生score中没有数据的科目不可以累加,只累加有评分的
    const average = []

    // 这是循环,对所有的tag(科目)进行一次循环,从而得到此班级所有科目的全班平均分
    tagData.forEach(({ title }, index) => { // 默认参数为: item,index 代表'数组每一项和索引',其中前者我们解构了
        // 第一次过滤: 这个学科有成绩的学生才会进入数组; 例如第一门学科html5,在2001班中,html5有成绩的学生数据才会进入数组filterArr
        // 此时item是currentClass的单项,是单独一个学生的全部信息
        let filterArr = currentClass.filter(item => item.score[title])
        // console.log("科目:" + title, filterArr)
        // filterArr.map(item=>item.score[title]).reduce((total,item)=>total+item,0)
        // 第二部: 把过滤出来的学生数组映射为单独的学科成绩; 接着上面的例子,假设有5个学生有html5成绩,那么数据item由5个学生的全部信息映射为5个学生的html5成绩
        // console.log("单科成绩列表", filterArr.map(item => item.score[title]))
        // 把所有班级里所有评过科目的成绩综合起来,和之前一样, 累加总成绩/人数(只有有这科目成绩的才行,所以不能用currentClass.length,有些人没有这科的成绩,不能作为分母加进去) (小数点的保留2位)
        // console.log("单科平均分:(此科目的总成绩/此科目的人数)", (filterArr.map(item => item.score[title]).reduce((total, item) => total + item, 0) / (filterArr.length || 1)).toFixed(2))
        // 把单科的平均分依次放入数组(小数点的保留2位)
        // 优化一个地方,如果一个班级中,有的科目,所有人都没有成绩,那么筛选出来的此成绩人数filterArr数组就为空,即长度为0,这样会出现'/0'(除0)的情况,结果为NaN,所以加一个'或' (|| 1) 
        average[index] = (filterArr.map(item => item.score[title]).reduce((total, item) => total + item, 0) / (filterArr.length || 1)).toFixed(2)
    })
    // console.log(average) // 点击哪个班级的学生会显示此班级学生的所有单科平均成绩,按tags的顺序排列



    const averageObj = { // 班级的
        name: legendData[0], // XX班平均值,
        value: average // 此班级13个科目的每个科目的全班平均值数组集合,按tags排列
    }
    console.log(averageObj)
    const currentObj = { // 点击的这个学生
        name: legendData[1], // 学生名
        value: tagData.map(({ title }) => currentItem.score[title] ? currentItem.score[title] : 0) // 解构item,拿出tagData每一项的title值(标签名字html5,css3....),共计13科目映射为'此学生13科目的单个成绩'
        // 注意: 使用三目,如果没有这科目成绩(undefined),走后面的0,如果有,就是正常取,防止没有此科目成绩导致出现了出现undefined
    }
    console.log(currentObj)

    const seriesData = [averageObj, currentObj]

    return {
        legendData,
        indicatorData,
        seriesData
    }

}


// 只有dom挂载完了,才能使用echarts
// onMounted只会执行一次,为了轻松,也是减少bug,我们不再结合onUpdate去写代码了,我们每次让浏览器(显示/隐藏)的v-show模式改为(创建/销毁)的v-if模式
// 这样每次创建一次,就会执行一次onMounted,我们就可以实时查看不同人的战力雷达,具体在studentList.vue的组件使用处
onMounted(() => {
    // 这个echarts的图标宽高自适应依据父组件el-drawer的值,而它的dom挂载可能要比echarts晚,所以我们使用nextTick,等待第一次el-drawer的挂载完成之后再执行echarts的代码
    nextTick(() => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('studentchart'));

        // 单独处理数据的函数
        let { legendData, indicatorData, seriesData } = handleData(props.data)
        // 指定图表的配置项和数据
        var option = {
            // title: { // 标题
            //     text: 'Basic Radar Chart'
            // },
            legend: { // 图标折现分类
                data: legendData
            },
            // 提示框,kerwin写的,里面重点position是坐标,这个坐标是跟随鼠标的
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
            radar: { // 雷达图的各个角的属性名
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


</script>