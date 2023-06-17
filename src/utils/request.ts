// 封装 axios
import axios from 'axios'
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

export default instance
