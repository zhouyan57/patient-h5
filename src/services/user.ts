// 封装用户相关的网络请求
import { request } from '@/utils/request'
import type { User, CodeType, UserInfo, Patient } from '@/types/user'

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

// 2. 获取手机验证码
export const getMobileCode = (mobile: string, type: CodeType = 'login') =>
  request<{ code: string }>('code', 'get', { mobile, type })

// 3. 登录--手机验证码登录
export const loginByCode = (mobile: string, code: string) =>
  request<User>('/login', 'post', { mobile, code })

// 4. 我的--获取个人用户信息
export const getUserInfo = () => request<UserInfo>('/patient/myUser')

// 5. 问诊--查询患者列表信息
export const getPatientList = () => request<Patient[]>('/patient/mylist')
