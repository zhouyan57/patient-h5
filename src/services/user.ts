// 封装用户相关的网络请求
import request from '@/utils/request'
// 1. 登录 -- 密码登录
export const loginByPassword = (mobile: string, password: string) =>
  request.request({
    url: '/login/password',
    method: 'POST',
    data: {
      mobile,
      password
    }
  })
