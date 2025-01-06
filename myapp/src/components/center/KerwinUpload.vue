<template>
    <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="handleChange">
        <img v-if="props.avatar" :src="avatarComputed" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
            <Plus />
        </el-icon>
    </el-upload>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue' // 引入新图标
import { computed } from 'vue'
// 接受父信息
const props = defineProps(["avatar"])
console.log(props.avatar) // 通过props.avatar可以获取传递过来的信息


// 显示图片动态配置src属性的计算属性函数
// 计算属性的箭头函数 ()=> ...(就一行代码,不用return);  ()=>{....(多行代码,需要return)}
const avatarComputed = computed(() =>
    // blob是URL.createObjectURL(evt.raw)转化为一个带有blob字段的内容,如果有,说明经过了URL.createObjectURL处理,如果没有,说明是从后端返回过来的(上一次的),加好前缀地址
    props.avatar.includes("blob") ?
        props.avatar : 'http://localhost:3000' + props.avatar
)

const emit = defineEmits(["change"]) // 子传父
// file是默认参数,是上传文件的信息,原来我们常写为 "evt.raw" 去获取关键信息
const  handleChange = (file)=>{
    emit("change",file,avatar) // 子传父
}

</script>

<style scoped lang="scss">
/* 头像img大小限制 */
.avatar {
    width: 178px;
    height: 178px;
}
// 上传图像的css样式 因为有scope需要:deep
:deep(.avatar-uploader .el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

:deep(.avatar-uploader .el-upload:hover) {
    border-color: var(--el-color-primary);
}

:deep(.el-icon.avatar-uploader-icon) {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

</style>