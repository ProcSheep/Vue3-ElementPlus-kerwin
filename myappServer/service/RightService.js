const RightModel = require("../model/RightModel")


module.exports = {
    // 下面均为mongodb数据库操作

    getList() {
        // 操作模型model的RightModel,返回的是一个promise对象(异步)
        // 返回一个模型.find() mongoose基本语法操作 查询全部, RightModel是我们写的一个模型
        return RightModel.find()
    },
    // 测试
    // updateList(item) {
    //     console.log(item) // 打印req.body测试,在express的终端打印的,还没返回给浏览器呢,所以浏览器的终端看不到打印
    //     return ['1']
    // }
    // 解构出data和title属性
    // 解构前的模板如下
    /* 
        {
            data: {
                _id: '6734789f9543ea137cb8841a',
                title: '学生大数据',
                path: '/index',
                icon: 'TrendCharts',
                children: []
            },
            title: '学生大数据123'
        }    
    */

    updateList({data,title}){
        // console.log(item) // 打印req.body测试,在express的终端打印的,还没返回给浏览器呢,所以浏览器的终端看不到打印
        // 更新唯一的数据,参数1: 查哪一项,即_id为item._id的这一项,必须是唯一id
        // 参数2: 更新 内部的title属性值改为形参的title,这两个title不是一个,前者是data内部属性,后者是结构出来的值,也是更新值
        // 更新数据库的title值后,重新请求一次数据,在更新按钮函数请求后端之后重写一次请求数据的函数getList(),前端的页面会响应式变化
        // 对于数据data的children属性内部的值是没有_id属性的,所以对于孩子需要新方法取更新
        if(data._id){
            return RightModel.findOneAndUpdate({_id:data._id},{
                "$set":{
                    title: title
                }
            })
        }else{
            // 深度数组查询: 没有_id,下面是查children里面的path属性,会自动遍历所有的数组项,然后这个数组项内部的path只要等于我们data的path,就是我们要找的
            return RightModel.findOneAndUpdate({
                "children.path": data.path
            },{
                // 修改children的本项($占位符,会自动匹配你找的那个项)的title修改为title,固定写法
                // 深度更新
                $set:{
                    "children.$.title" : title
                }
            })
        }  
    },

    // 测试: 虽然children内部有path,但是以path为唯一id去查询依旧没改变本质,因为它查询以data的每一项item为对象,查询item.path有没有和item内部children某项的path,不会匹配到正确数据,不会更新,所以最后只能深度遍历到数组中,这是mongodb的特点
    // updateList({ data, title }) {
    //     console.log(data,title)
    //     return RightModel.findOneAndUpdate({ path: data.path }, {
    //         "$set": {
    //             title: title
    //         }
    //     })
    // }

    // 删除列表函数
    deleteList(item){
        // console.log(item)
        if(item._id){
            return RightModel.findOneAndDelete({"_id":item._id}) // 找到对应的id删除
        }else{
            // 深度更新children数组内部的项 新知识 2个参数 
            return RightModel.findOneAndUpdate({ // 不要写成删除findOneAndDelete,是更新操作,找到对应项,拉取数据,然后更新,否则删除孩子会把其父一同打包删除
                "children.path": item.path // 在children中找到对应项
            },{
                $pull:{"children":{path:item.path}} // pull意为拉取,把children中符合这一项的拉取出来(删除)
            })
        }
    }
}