<template>
    <div style="border: 1px solid #ccc">
        <!-- :editor="editorRef": 编辑器示例,注意,在Editor组件创建完毕后再初始化赋值,在其@onCreated="handleCreated"的处理函数内 -->
        <!--  :mode="mode": 编辑器模式 -->
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
            :mode="mode" />
        <!-- v-model="valueHtml" 双向绑定的编辑器内容,可通过赋值实现初始化 -->
        <!-- @onChange: 在编辑区内容改变时自动调用; @onBlur: 失去焦点时才触发,更加'懒惰' -->
        <!-- @onCreated="handleCreated": 创建Editor组件时调用这个函数 -->
        <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
            :mode="mode" @onCreated="handleCreated" @onChange="handleChange" />
    </div>
</template>


<script setup>// 注意: 模板中不是"script + setup" ,我们改为setup模式
// 在npmjs中,搜索wangeditor组件(开源 Web 富文本编辑器，开箱即用，配置简单。支持 JS Vue React)
// 需要npm下载,当前有4和5两个版本,推荐5,都用一下
// v4 代码在Editor4.vue里面,这里以5为准
// v5版本更好地适配了多个框架,例如vue,react,在文档中有模板(基于Vue React),我们直接使用提供的模板
// v5 下载2个组件,本体组件和适配vue的附加组件 
// npm install @wangeditor/editor --save 
// npm install @wangeditor/editor-for-vue@next --save

import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'


// 编辑器实例，必须用 shallowRef,浅层ref,只能绑定简单数据类型,或者复杂数据类型的最外层数据; 而ref可以递归遍历到复杂数据的深层结构
const editorRef = shallowRef()

// 获取父传子,内容是上次提交dialog后,编辑区的内容
const props = defineProps(["content"])

// 内容 HTML 双向绑定到Editor的内容 可以初始化内容
const valueHtml = ref("")

// 子传父事件获取
const emit = defineEmits(["event"])
const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }
// 模式mode
const mode = "default" // 默认模式,还有简单模式'simple' 

// 编辑器Editor创建时,触发此函数
const handleCreated = (editor) => {
    console.log("create")
    editorRef.value = editor // 记录 editor 实例，重要！
    // 每次打开更新题库重新初始化编辑组件Editor时,都对编辑区的内容(valueHtml.value)进行1次初始化,防止刷新丢失上次的内容
    // 这里有个坑: 需要等待editor实例创建后再对里面双向绑定属性valueHtml赋值,而这个函数handleCreated执行时间在onMounted后面,所以直接写在实例创建好代码的下面,保证安全
    valueHtml.value = props.content // 获取父信息
}

// 编辑区内容改变触发事件函数 onBlur类型
// 这里有坑,我们使用onChange,这个函数更新数据的速度比dialog点击确认的handleUpdateConfirm更快,可以实时更新数据后再发送到后端
const handleChange = () => {
    // console.log(valueHtml.value)
    emit("event", valueHtml.value) // 子传父
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    console.log("destory")
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

</script>