import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 仅前端解决: 解决跨域设置了一个代理服务器
  // 后端解决只需要加 Access-Control-Allow-Orign : *
  // vue 5173 ---> nodejs 3000 浏览器发送请求 CORS跨域问题
  server:{
    // 代理服务器思路: 向/adminapi发送的请求,我们代理到3000这个服务器上,拒绝直接使用浏览器请求(跨域会阻止你的),用服务器请求就不会受到跨域阻止
    // 3000就是我们nodejs项目的端口号,向里面请求数据即可
    proxy:{
      "/adminapi":{
        target:"http://localhost:3000",
        changeOrigin:true
      }
    }
  }
})
