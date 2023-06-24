import { ConsultType, IllnessTime } from '@/enums'
// 首页中的数据类型
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

// 医生对象类型
export type Doctor = {
  // 医生ID
  id: string
  // 医生名称
  name: string
  // 头像
  avatar: string
  // 医院名称
  hospitalName: string
  // 医院等级
  gradeName: string
  // 科室
  depName: string
  // 职称
  positionalTitles: string
  // 是否关注，0 未关注 1 已关注
  likeFlag: 0 | 1
  // 接诊服务费
  serviceFee: number
  // 接诊人数
  consultationNum: number
  // 评分
  score: number
  // 主攻方向
  major: string
}
// 医生列表类型
export type DoctorList = Doctor[]
// 医生接口返回类型
export type DoctorPage = {
  pageTotal: number
  total: number
  rows: DoctorList
}
// 医生接口参数类型
export type DoctorParams = {
  current: number
  pageSize: number
}

// 关注的类型
export type FollowType = 'topic' | 'knowledge' | 'doc' | 'disease'
// 关注接口的参数类型
export type FollowParams = {
  type: FollowType
  id: string
}

// 图片列表
export type Image = {
  // 图片ID
  id: string
  // 图片地址
  url: string
}

// 问诊记录
export type Consult = {
  // 问诊记录ID
  id: string
  // 问诊类型
  type: ConsultType
  // 快速问诊类型，0 普通 1 三甲
  illnessType: 0 | 1
  // 科室ID
  depId: string
  // 疾病描述
  illnessDesc: string
  // 疾病持续时间
  illnessTime: IllnessTime
  // 是否就诊过，0 未就诊过  1 就诊过
  consultFlag: 0 | 1
  // 图片数组
  pictures: Image[]
  // 患者ID
  patientId: string
  // 优惠券ID
  couponId: string
}

// 问诊记录-全部可选
export type PartialConsult = Partial<Consult>
// Required 转换为全部必须   Partial 转换问全部可选  两个内置的泛型类型

// 病情类型
export type Illness = Pick<
  PartialConsult,
  'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'
>
