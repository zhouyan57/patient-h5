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
  ConsultOrderPreData,
  PartialConsult,
  ConsultOrderItem,
  ConsultOrderListParams,
  ConsultOrderPage
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
// 7. 问诊-保存/修改问诊订单
export const createConsultOrder = (data: PartialConsult) =>
  request<{ id: string }>('/patient/consult/order', 'POST', data)
// 8. 订单-支付接口
export const payConsultOrder = (data: {
  paymentMethod: number
  orderId: string
  payCallback: string
}) => request<{ payUrl: string }>('/patient/consult/pay', 'POST', data)

// 9. 问诊-查询订单详情信息-找医生、极速问诊和开药问诊
export const getConsultOrderDetail = (orderId: string) =>
  request<ConsultOrderItem>('/patient/consult/order/detail', 'GET', { orderId })

// 10. 药品订单-根据处方ID查询处方单
export const getPrescriptionUrl = (id: string) =>
  request<{ url: string }>(`/patient/consult/prescription/${id}`)

// 11. 问诊记录-订单列表-找医生、极速问诊、开药问诊
export const getConsultOrderList = (params: ConsultOrderListParams) =>
  request<ConsultOrderPage>('/patient/consult/order/list', 'get', params)

// 12. 订单-取消订单
export const orderCancel = (id: string) => request(`/patient/order/cancel/${id}`, 'PUT')

// 13. 订单-删除订单
export const orderDel = (id: string) => request(`/patient/order/${id}`, 'DELETE')
