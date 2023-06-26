<script setup lang="ts">
import { getConsultOrderPre, createConsultOrder, payConsultOrder } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData } from '@/types/consult'
import { showDialog, showToast } from 'vant'
import { onMounted, ref } from 'vue'
import { getPatient } from '@/services/user'
import type { Patient } from '@/types/user'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

// 1. 渲染订单信息
const store = useConsultStore()
const { type, illnessType, patientId, illnessDesc, illnessTime, consultFlag } = store.consult
const consult = ref<ConsultOrderPreData>()
const router = useRouter()
onMounted(async () => {
  // 6. 处理在当前页面的刷新逻辑(生成订单后数据清空，需要回退到首页)
  if (
    !type ||
    illnessType === undefined ||
    !patientId ||
    !illnessDesc ||
    illnessTime === undefined ||
    consultFlag === undefined
  ) {
    {
      // 提示问题信息不存在
      await showDialog({
        title: '温馨提示',
        message: '支付信息不完整请重新填写，如果未支付，可以去记录继续支付'
      })
      return router.push('/home')
    }
  }

  const res = await getConsultOrderPre({
    type,
    illnessType
  })
  consult.value = res.data
})
// 2. 设置患者信息
const patient = ref<Patient>()
onMounted(async () => {
  if (!patientId || !illnessType) return showToast('缺少必要的参数')
  const res = await getPatient(patientId)
  patient.value = res.data
})
// 3. 立即支付（生成订单 & 选择支付方式 & 清除问诊信息）
const agree = ref(false)
const orderId = ref('')
const show = ref(false)
// 支付方式
const paymentMethod = ref<0 | 1>()
const pay = async () => {
  // 判断参数
  if (!agree.value) return showToast('请同意协议')
  if (
    type === undefined ||
    illnessType === undefined ||
    patientId === undefined ||
    illnessDesc === undefined ||
    illnessTime === undefined ||
    consultFlag === undefined
  )
    return showToast('参数缺失')
  // 生成订单
  const res = await createConsultOrder(store.consult)
  orderId.value = res.data.id
  // 选择支付方式（打开支付面板）
  show.value = true
  // 清除问诊信息
  store.removeConsult()
}
// 4. 立即支付（获取支付页面的路径）
const submit = async () => {
  // 判断是否存在订单 id & 请求方式
  if (!orderId.value) return showToast('订单 ID 不存在')
  if (paymentMethod.value === undefined) return showToast('请选择支付方式')
  // 获取支付路径
  const res = await payConsultOrder({
    paymentMethod: paymentMethod.value,
    orderId: orderId.value,
    payCallback: 'http://localhost:5173/room'
  })
  // 根据路径进行跳转
  window.location.href = res.data.payUrl
}

// 5. 生成订单后页面不可回退
onBeforeRouteLeave(() => {
  if (orderId.value) return false
})
</script>

<template>
  <div class="consult-pay-page">
    <!-- 头部导航 -->
    <cp-nav-bar title="支付" />
    <!-- 问诊区域 -->
    <div class="pay-info">
      <p class="tit">图文问诊 {{ consult?.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>

    <!-- 支付信息区域 -->
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${consult?.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${consult?.pointDeduction}`" />
      <van-cell title="实付款" :value="`¥${consult?.actualPayment}`" class="pay-price" />
    </van-cell-group>
    <div class="pay-space"></div>

    <!-- 患者信息 -->
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient?.name} | ${patient?.genderValue} | ${patient?.age}岁`"
      ></van-cell>
      <van-cell title="病情描述" :label="illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>
    <!-- 底部按钮区域 -->
    <van-submit-bar
      button-type="primary"
      :price="consult?.actualPayment! * 100"
      button-text="立即支付"
      text-align="left"
      @click="pay"
    />
  </div>
  <!-- 支付抽屉 -->
  <van-action-sheet
    :close-on-popstate="false"
    :closeable="false"
    :close-on-click-overlay="false"
    v-model:show="show"
    title="选择支付方式"
  >
    <div class="pay-type">
      <p class="amount">￥{{ consult?.actualPayment.toFixed(2) }}</p>
      <van-cell-group>
        <van-cell title="微信支付" @click="paymentMethod = 0">
          <template #icon><cp-icon name="consult-wechat" /></template>
          <template #extra><van-checkbox :checked="paymentMethod === 0" /></template>
        </van-cell>
        <van-cell title="支付宝支付" @click="paymentMethod = 1">
          <template #icon><cp-icon name="consult-alipay" /></template>
          <template #extra><van-checkbox :checked="paymentMethod === 1" /></template>
        </van-cell>
      </van-cell-group>
      <div class="btn">
        <van-button @click="submit" type="primary" round block>立即支付</van-button>
      </div>
    </div>
  </van-action-sheet>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  //   padding: 46px 0 50px 0;
  padding: 0 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
