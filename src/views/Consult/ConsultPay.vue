<script setup lang="ts">
import { getConsultOrderPre } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData } from '@/types/consult'
import { showToast } from 'vant'
import { onMounted, ref } from 'vue'

// 1. 渲染订单信息
const store = useConsultStore()
const { type, illnessType } = store.consult
const consult = ref<ConsultOrderPreData>()
onMounted(async () => {
  if (!type || !illnessType) return showToast('缺少必要的参数')
  const res = await getConsultOrderPre({
    type,
    illnessType
  })
  consult.value = res.data
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
      <van-cell title="患者信息" value="李富贵 | 男 | 30岁"></van-cell>
      <van-cell title="病情描述" label="头痛，头晕，恶心"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox>我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>
    <!-- 底部按钮区域 -->
    <van-submit-bar
      button-type="primary"
      :price="consult?.actualPayment! * 100"
      button-text="立即支付"
      text-align="left"
    />
  </div>
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
</style>
