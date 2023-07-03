import { request } from '@/utils/request'
import type { OrderPre, AddressItem, OrderDetail } from '@/types/order'

// 1. 药品订单-支付药款页面-根据处方信息计算药款
export const getMedicalOrderPre = (prescriptionId: string) =>
  request<OrderPre>('/patient/medicine/order/pre', 'GET', { prescriptionId })
// 2. 订单-查询收货地址列表
export const getAddressList = () => request<AddressItem[]>('/patient/order/address')
// 3. 药品订单-根据处方下药品订单
export const createMedicineOrder = (id: string, addressId: string) =>
  request<{ id: string }>('/patient/medicine/order', 'POST', { id, addressId })
// 4. 药品订单-查询订单详情信息
export const getMedicalOrderDetail = (id: string) =>
  request<OrderDetail>(`/patient/medicine/order/detail/${id}`)
