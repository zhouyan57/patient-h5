<script setup lang="ts">
import { payConsultOrder } from '@/services/consult'
import { showToast } from 'vant'
import { ref } from 'vue'

// 1. 接收数据
const props = defineProps<{
  // 关闭面板之前的回调函数
  beforeClose?: () => void
  // 控制面板的显示与隐藏
  show: boolean
  // 实付金额
  actualPayment: number
  // 订单 id
  orderId: string
  // 支付成功后的会跳路径
  payCallback?: string
}>()

// 修改 show 的方法
const emit = defineEmits<{
  (e: 'update:show', v: boolean): void
}>()
const changeShow = (v: boolean) => {
  emit('update:show', v)
}

// 支付的方式
const paymentMethod = ref<0 | 1>()

// 4. 立即支付
const submit = async () => {
  // 判断是否存在订单 id & 请求方式
  if (!props.orderId) return showToast('订单 ID 不存在')
  if (paymentMethod.value === undefined) return showToast('请选择支付方式')
  // 获取支付路径
  const res = await payConsultOrder({
    paymentMethod: paymentMethod.value,
    orderId: props.orderId,
    // 支付完成后的回跳页面
    payCallback: props.payCallback ? props.payCallback : 'http://localhost:5173/room'
  })
  // 根据路径进行跳转
  window.location.href = res.data.payUrl
}
</script>
<template>
  <!-- 支付抽屉 -->
  <!-- <van-action-sheet
    :close-on-popstate="false"
    :closeable="false"
    :close-on-click-overlay="true"
    :beforeClose="beforeClose"
    v-model:show="show"
    title="选择支付方式"
  > -->
  <van-action-sheet
    :close-on-popstate="false"
    :closeable="false"
    :close-on-click-overlay="true"
    :beforeClose="beforeClose"
    :show="show"
    @update:show="changeShow"
    title="选择支付方式"
  >
    <div class="pay-type">
      <p class="amount">￥{{ actualPayment.toFixed(2) }}</p>
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
<style scoped lang="scss">
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
