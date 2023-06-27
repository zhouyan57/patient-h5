// 封装问诊室中的接口
import type { EvaludateDocParams } from '@/types/room'
import { request } from '@/utils/request'

// 1. 问诊-订单-评价医生
export const evaluateDocFn = (data: EvaludateDocParams) =>
  request('/patient/order/evaluate', 'POST', data)
