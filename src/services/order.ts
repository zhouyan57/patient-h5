import { request } from '@/utils/request'
import type { OrderPre, AddressItem } from '@/types/order'

// 1. 药品订单-支付药款页面-根据处方信息计算药款
export const getMedicalOrderPre = (prescriptionId: string) =>
  request<OrderPre>('/patient/medicine/order/pre', 'GET', { prescriptionId })
// 2. 订单-查询收货地址列表
export const getAddressList = () => request<AddressItem[]>('/patient/order/address')
