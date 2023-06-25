// 封装首页相关的网络请求
import { request } from '@/utils/request'
import type {
  KnowledgeParams,
  KnowledgePage,
  DoctorParams,
  DoctorPage,
  FollowParams,
  DepList
} from '@/types/consult'
// 1. 首页-查询推荐/减脂/饮食健康/关注页面--百科文章列表
export const getKnowledgeList = (params: KnowledgeParams) =>
  request<KnowledgePage>('/patient/home/knowledge', 'GET', params)
// 2. 首页-关注的医生列表
export const getDoctorList = (params: DoctorParams) =>
  request<DoctorPage>('/home/page/doc', 'get', params)
// 3. 关注-关注操作
export const followLike = (data: FollowParams) => request('/like', 'POST', data)
// 4.0 找医生-查询所有科室-层级
export const getAllDep = () => request<DepList>('/dep/all')
