import { request } from '@/utils/request'
import type { OrderPre } from '@/types/order'

// 1.0 药品订单-支付药款页面-根据处方信息计算药款
export const getMedicalOrderPre = (prescriptionId: string) =>
  request<OrderPre>('/patient/medicine/order/pre', 'GET', { prescriptionId })
