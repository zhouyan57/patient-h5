// 导入函数
//  createRouter：创建路由实例
//  createWebHistory：创建 history 路由模式  localhost:3000/login
//  createWebHashHistory：创建 hash 路由模式 localhost:3000/#/login
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
import { showToast } from 'vant'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  showSpinner: false // 关闭右侧加载动画
})

// 创建路由对象
const router = createRouter({
  // 设置路由模式(history模式)
  //  import.meta.env.BASE_URL：会去 vite.config.ts 中去取出配置项 base 中的值
  //  将来请求页面路径时，会带上这个 base 路径（项目的基础路径前缀，默认是 /）
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录页面
    { path: '/login', component: () => import('@/views/Login/index.vue') },
    // 布局容器
    {
      path: '/layout',
      component: () => import('@/views/Layout/index.vue'),
      children: [
        // 我的
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: { title: '我的' }
        },
        // 消息中心
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: { title: '消息中心' }
        },
        // 健康百科
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: { title: '健康百科' }
        },
        // 首页
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: { title: '首页' }
        }
      ]
    },
    {
      path: '/user/patient',
      component: () => import('@/views/User/PatientPage.vue'),
      meta: { title: '家庭档案' }
    },
    {
      path: '/consult/fast',
      component: () => import('@/views/Consult/ConsultFast.vue'),
      meta: { title: '极速问诊' }
    },
    {
      path: '/consult/dep',
      component: () => import('@/views/Consult/ConsultDep.vue'),
      meta: { title: '选择科室' }
    },
    {
      path: '/consult/illness',
      component: () => import('@/views/Consult/ConsultIllness.vue'),
      meta: { title: '病情描述' }
    },
    {
      path: '/consult/pay',
      component: () => import('@/views/Consult/ConsultPay.vue'),
      meta: { title: '问诊支付' }
    },
    {
      path: '/room',
      component: () => import('@/views/Room/index.vue'),
      meta: { title: '问诊室' },
      beforeEnter: (to) => {
        if (to.query.payResult === 'false') return '/user/consult'
      }
    },
    {
      path: '/user/consult',
      component: () => import('@/views/User/ConsultPage.vue'),
      meta: { title: '问诊记录' }
    },
    {
      path: '/user/consult/:id',
      component: () => import('@/views/User/ConsultDetail.vue'),
      meta: { title: '问诊详情' }
    },
    // 重定向
    { path: '/', redirect: '/home' }
  ]
})

// 添加前置导航守卫
router.beforeEach((to) => {
  // 开启进度条
  NProgress.start()
  // 动态设置标题
  if (to.meta.title) {
    document.title = '优医问诊 - ' + to.meta.title
  }
  // 得到 store 实例
  const store = useUserStore()
  // 得到 token
  const token = store.user?.token
  // 设置一个白名单
  const whiteList = ['/login']
  // 不存在 token 且 跳转的页面不在白名单中 返回 login 页面
  if (!token && !whiteList.includes(to.path)) {
    // 提示未登录 并 返回登录页
    showToast('您还未登录')
    return '/login'
  }
})

// 添加后置导航守卫
router.afterEach(() => {
  NProgress.done()
})

export default router
