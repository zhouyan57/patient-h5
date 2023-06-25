// 封装首页相关的网络请求
import { request } from '@/utils/request'
import type {
  KnowledgeParams,
  KnowledgePage,
  DoctorParams,
  DoctorPage,
  FollowParams,
  DepList,
  ConsultOrderPreParams,
  ConsultOrderPreData
} from '@/types/consult'
// 1. 首页-查询推荐/减脂/饮食健康/关注页面--百科文章列表
export const getKnowledgeList = (params: KnowledgeParams) =>
  request<KnowledgePage>('/patient/home/knowledge', 'GET', params)
// 2. 首页-关注的医生列表
export const getDoctorList = (params: DoctorParams) =>
  request<DoctorPage>('/home/page/doc', 'get', params)
// 3. 关注-关注操作
export const followLike = (data: FollowParams) => request('/like', 'POST', data)
// 4. 找医生-查询所有科室-层级
export const getAllDep = () => request<DepList>('/dep/all')
// 5. 上传文件/图片
export const updateFile = (file: File) => {
  // 如果要进入文件的上传，需要将文件管理到一个对象：formData
  const fd = new FormData()
  fd.append('file', file)
  return request<{ id: string; url: string }>('/upload', 'POST', fd)
}
// 6. 问诊-支付页面-计算就诊信息和抵扣信息
export const getConsultOrderPre = (params: ConsultOrderPreParams) =>
  request<ConsultOrderPreData>('/patient/consult/order/pre', 'GET', params)
