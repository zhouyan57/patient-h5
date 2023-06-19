// 封装 axios
import axios, { type Method } from 'axios'
import { useUserStore } from '@/stores'
import { showToast } from 'vant'
// 定义基地址
const BASEURL = 'https://consult-api.itheima.net/'
// 创建 axios 副本对象
const instance = axios.create({
  baseURL: BASEURL,
  timeout: 5000
})
// 设置拦截器
// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 得到 token
    const store = useUserStore()
    const token = store.user?.token
    // 判断是否存在token：如果存在，将 token 携带在请求头中
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    if (response.data.code !== 10000) {
      // 提示出错
      showToast(response.data.message)
      return Promise.reject(new Error(response.data.message))
    }
    // 对返回的数据进行过滤
    return response.data
  },
  (err) => {
    return Promise.reject(err)
  }
)

// 定义返回值的类型
// type Res<T> = {
//   code: number
//   message: string
//   data: T
// }

// 封装一个统一的网络请求 api
const request = <T>(url: string, method: Method = 'get', obj?: object) => {
  // 发送网络请求
  return instance.request<T>({
    url,
    method,
    // 属性的键动态生成
    [method.toLowerCase() === 'get' ? 'params' : 'data']: obj
  })
}

export { BASEURL, instance, request }
