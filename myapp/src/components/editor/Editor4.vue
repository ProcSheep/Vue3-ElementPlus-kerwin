<template>
    <div id="div1"></div>
</template>


<script setup>
// v4 下载: npm i wangeditor --save
import { onMounted } from 'vue';
import E from 'wangeditor'

// 等待dom节点挂载完毕后方可初始化,所以要在onMounted中初始化new
onMounted(() => {
    const editor = new E( document.getElementById('div1') )
    editor.create()
    // 文本编辑器的初始化
    editor.txt.html("<p>hello kerwin!</p>")
    // 监听文本编辑器内的内容变化,最后输出html代码字段(String类型),将来存入CompanyModel的interview属性
    editor.config.onchange = (newhtml)=>{
        console.log(newhtml)
    }
})

</script>