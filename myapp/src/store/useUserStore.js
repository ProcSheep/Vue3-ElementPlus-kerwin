// pinia动态路由状态管理
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore("user",()=>{
    const user = ref({}) 
    function changeUser(value){
        user.value = value
    }
    return {
        user,
        changeUser
    }
},{
    // 使用持久化插件,对此store进行持久化处理,刷新不重置(存在localStore中)
    persist:true
})