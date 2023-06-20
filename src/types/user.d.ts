// 封装与用户相关的类型
// 用户类型
export type User = {
  token: string
  refreshToken: string
  avatar: string
  mobile: string
  account: string
  id: string
}
// 验证码的类型
// login登录register注册changeMobile更换手机号forgetPassword找回密码,bindMobile绑定三方登录，区分验证码
// 验证码的类型
export type CodeType = 'login' | 'register' | 'changeMobile' | 'forgetPassword' | 'bindMobile'
