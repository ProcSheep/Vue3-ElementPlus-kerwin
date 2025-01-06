<!--
 * @作者: kerwin
-->
<template>
    <div>
        login
        <button @click="handleLogin1()">登录-管理员</button>
        <button @click="handleLogin2()">登录-讲师</button>
    </div>
</template>
<script setup>
import { useUserStore } from '../store/useUserStore';
import {useRouter} from 'vue-router'
const router = useRouter()
const { changeUser } = useUserStore()
const handleLogin1 = () => {
    changeUser({
        "id": 1,
        "username": "admin",
        "password": "123",
        "role": {
            "roleName": "管理员",
            "roleType": 1,
            "rights": [
                "/index",
                "/user-manage",
                "/user-manage/list",
                "/right-manage",
                "/right-manage/rolelist",
                "/right-manage/rightlist",
                "/tag-manage",
                "/tag-manage/list",
                "/interview-manage",
                "/interview-manage/companylist",
                "/interview-manage/companydata",
                "/student-manage",
                "/student-manage/studentlist",
                "/student-manage/gradelist"
            ]
        }
    })
    router.push("/")
}
const handleLogin2 = () => {
    changeUser({
        "id": 2,
        "username": "kerwin",
        "password": "123",
        "role": {
            "roleName": "讲师",
            "roleType": 2,
            "rights": [
                "/index",
                "/interview-manage",
                "/interview-manage/companylist",
                "/interview-manage/companydata",
                "/student-manage",
                "/student-manage/studentlist",
                "/student-manage/gradelist"
            ]
        }
    })
    router.push("/")
}
</script>