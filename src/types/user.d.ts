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
// 文章类型(参数)
export type KnowledgeType = 'recommend' | 'fatReduction' | 'food' | 'like'
// 文章信息类型
export type Knowledge = {
  id: string
  title: string
  coverUrl: string[]
  topics: string[]
  collectionNumber: number
  commentNumber: number
  creatorName: string
  creatorAvatar: string
  creatorHospatalName: string
  likeFlag: 0 | 1
  content: string
  creatorDep: string
  creatorTitles: string
  creatorId: string
}

// 文章列表
export type KnowledgeList = Knowledge[]

// 文章列表带分页
export type KnowledgePage = {
  pageTotal: number
  total: number
  rows: KnowledgeList
}

// 文章列表查询参数
export type KnowledgeParams = {
  type: KnowledgeType
  current: number
  pageSize: number
}
