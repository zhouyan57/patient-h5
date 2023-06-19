// 封装 axios
import { useUserStore } from '@/stores'
import axios from 'axios'
import { useUserStore } from '@/stores'
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
      config.Headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

// 相应拦截器
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    return Promise.reject(err)
  }
)

// 定义返回值的类型
type Res<T> = {
  code: number
  message: string
  data: T
}

// 封装一个统一的网络请求 api
const request = <T>(url: string, method: Method = 'get', obj?: object) => {
  // 发送网络请求
  return instance.request<Res<T>>({
    url,
    method,
    // 属性的键动态生成
    [method.toLowerCase() === 'get' ? 'params' : 'data']: obj
  })
}

export { BASEURL, instance, request }
