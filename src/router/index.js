import Vue from 'vue'// 创建vue
import VueRouter from 'vue-router' // 引入路由
import Login from '../views/login.vue' // 登录页
import Home from '../components/home.vue' // 主页
import WelcoMe from '../components/Welcome.vue'// 欢迎页
import Users from '../components/user/users.vue' // 用户列表页
import Right from '../components/power/Rights.vue'// 权限列表页
import Roles from '../components/power/Roles.vue'// 角色列表页
import Cate from '../components/goods/Cate.vue' // 商品管理/商品分类页
import Parmas from '../components/goods/Params.vue'// 商品管理/分类参数
import Goods from '../components/goods/Goods.vue'// 商品管理/分类参数
import Add from '../components/goods/Add.vue'// 商品管理/商品列表/添加商品
import List from '../components/Order/List.vue' // 订单管理
import Reports from '../components/reports/reports.vue'// 数据统计
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/Welcome',
    children: [{
      path: '/Welcome',
      component: WelcoMe
    },
    {
      path: '/users',
      component: Users
    },
    {
      path: '/rights',
      component: Right
    },
    {
      path: '/roles',
      component: Roles
    },
    {
      path: '/categories',
      component: Cate
    },
    {
      path: '/params',
      component: Parmas
    },
    {
      path: '/goods',
      component: Goods
    },
    {
      path: '/goods/add',
      component: Add
    },
    {
      path: '/orders',
      component: List
    },
    {
      path: '/reports',
      component: Reports
    }
    ]

  }

]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表是从那个路径跳转进来
  // next 代表放行 可以在next('/login')的方法里添加强制要跳转的路径
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) { return next('/login') }
  next()
})

export default router
