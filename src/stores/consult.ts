// 记录问诊数据（保存订单参数类型）
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PartialConsult, Illness } from '@/types/consult'
import type { ConsultType } from '@/enums'
export const useConsultStore = defineStore(
  'consult',
  () => {
    // 定义问诊记录对象（订单参数类型对象）
    const consult = ref<PartialConsult>({})
    // 保存问诊类型（首页）
    const setType = (type: ConsultType) => {
      consult.value.type = type
    }
    // 保存快速问诊类型（极速问诊）
    const setIllnessType = (illnessType: 0 | 1) => {
      consult.value.illnessType = illnessType
    }
    // 保存科室ID（选择科室）
    const setDepId = (depId: string) => {
      consult.value.depId = depId
    }
    // 保存病情信息（图文问诊）
    const setIllness = (params: Illness) => {
      consult.value.illnessDesc = params.illnessDesc
      consult.value.illnessTime = params.illnessTime
      consult.value.consultFlag = params.consultFlag
      consult.value.pictures = params.pictures
    }
    // 保存患者 ID(选择患者)
    const setPatientId = (id: string) => {
      consult.value.patientId = id
    }
    // 保存优惠券（支付）
    const setCouponId = (couponId: string) => {
      consult.value.couponId = couponId
    }
    // 清除 consult 中的内容
    const removeConsult = () => {
      consult.value = {}
    }
    return {
      consult,
      setType,
      setIllnessType,
      setDepId,
      setIllness,
      setPatientId,
      setCouponId,
      removeConsult
    }
  },
  {
    persist: true
  }
)
