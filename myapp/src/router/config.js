import Home from '../views/home/Home.vue'
import Center from '../views/center/Center.vue'
import UserList from '../views/user-manage/UserList.vue'
import RoleList from '../views/right-manage/RoleList.vue'
import RightList from '../views/right-manage/RightList.vue'
import TagList from '../views/tag-manage/TagList.vue'
import CompanyData from '../views/interview-manage/CompanyData.vue'
import CompanyList from '../views/interview-manage/CompanyList.vue'
import StudentList from '../views/student-manage/StudentList.vue'
import GradeList from '../views/student-manage/GradeList.vue'


// 起好所有路由的名字
const routes = [
    {
        path:"/index",
        name:"Home",
        component:Home
    },
    {
        path:"/center",
        name:"Center",
        component:Center
    },
    {
        path:"/user-manage/list",
        name:"UserList",
        component:UserList
    },
    {
        path:"/right-manage/rolelist",
        name:"RoleList",
        component:RoleList
    },
    {
        path:"/right-manage/rightlist",
        name:"RightList",
        component:RightList
    },
    {
        path:"/tag-manage/list",
        name:"TagList",
        component:TagList
    },
    {
        path:"/interview-manage/companylist",
        name:"CompanyList",
        component:CompanyList
    },
    {
        path:"/interview-manage/companydata",
        name:"CompanyData",
        component:CompanyData
    },
    {
        path:"/student-manage/studentlist",
        name:"StudentList",
        component:StudentList
    },
    {
        path:"/student-manage/gradelist",
        name:"GradeList",
        component:GradeList
    },
]

export default routes