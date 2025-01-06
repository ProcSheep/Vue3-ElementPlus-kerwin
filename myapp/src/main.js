import { createApp } from 'vue'
import App from './App.vue'
// 导入pinia并注册
import { createPinia } from 'pinia'
// 导入路由并注册
import router from './router'
// 使用pinia持久化插件,略微改变pinia的创建与注册格式(记得npm下载 npm i pinia-plugin-persistedstate)
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// 引入ElementPlus (全局引入) 下载: npm install element-plus --save
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' // css引入,就一直在全局就行
// 粒子模块 需要下载 npm i @tsparticles/vue3
import Particles from "@tsparticles/vue3";
// tsparticles需要自己下载 npm i tsparticles
import { loadFull } from "tsparticles"; 
// 可视化组件DateV-Vue3引入
import DataVVue3 from '@kjgl77/datav-vue3'
// 导入axios的拦截器组件,只需要导入
import "./util/axios.config"


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
    .use(router)
    .use(pinia)
    .use(ElementPlus)
    .use(DataVVue3)
    .use(Particles, {
        init: async engine => {
            await loadFull(engine); 
        },
    })
    .mount('#app')
