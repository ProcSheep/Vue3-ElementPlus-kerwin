<template>
    <div class="common-layout">
        <el-container style="height: 100vh;">
            <SideMenu></SideMenu>
            <!-- el-container的direction属性: 子元素中有el-header或el-footer时为vertical否则为horizontal -->
            <!-- 我们给el-header做成组件了,所以要单独设置一下方向 -->
            <el-container direction="vertical">
                <TopHeader></TopHeader>
                <el-main>
                    <!-- 内容区+滚动组件 -->
                    <el-scrollbar>
                        <router-view></router-view>
                    </el-scrollbar>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
// 导入el-container的组件,侧边栏和顶栏
import SideMenu from '../components/mainbox/SideMenu.vue';
import TopHeader from '../components/mainbox/TopHeader.vue';

</script>