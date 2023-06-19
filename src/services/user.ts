// 封装用户相关的网络请求
import { request } from '@/utils/request'
import type { User } from '@/types/user'

// 1. 登录 -- 密码登录
// export const loginByPassword = (mobile: string, password: string) =>
//   request.request<Res<User>>({
//     url: '/login/password',
//     method: 'POST',
//     data: {
//       mobile,
//       password
//     }
//   })
export const loginByPassword = (mobile: string, password: string) =>
  request<User>('/login/password', 'POST', { mobile, password })
