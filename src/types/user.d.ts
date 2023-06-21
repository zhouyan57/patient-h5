// 封装与用户相关的类型
// 1. 用户类型
export type User = {
  token: string
  refreshToken: string
  avatar: string
  mobile: string
  account: string
  id: string
}
// 2. 验证码的类型
// login登录register注册changeMobile更换手机号forgetPassword找回密码,bindMobile绑定三方登录，区分验证码
export type CodeType = 'login' | 'register' | 'changeMobile' | 'forgetPassword' | 'bindMobile'
// 得到与 user 部分属性相同的类型
type OmitUser = Omit<User, 'token' | 'refreshToken'>
// 3. 定义返回的用户对象类型
export type UserInfo = OmitUser & {
  likeNumber: number
  collectionNumber: number
  score: number
  couponNumber: number
  orderInfo: {
    paidNumber: number
    receivedNumber: number
    shippedNumber: number
    finishedNumber: number
  }
}
// 4. 定义患者类型
// 定义患者类型
export type Patient = {
  name?: string
  idCard?: string
  defaultFlag?: number
  gender?: 0 | 1
  genderValue?: string
  age?: number
  id?: string
}
