<script setup lang="ts">
import { getConsultOrderDetail } from '@/services/consult'
import type { ConsultOrderItem } from '@/types/consult'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
// 1. 获取订单详情数据
// 得到订单 id
const route = useRoute()
const orderId = route.params.id
const orderDetail = ref<ConsultOrderItem>()
onMounted(async () => {
  const res = await getConsultOrderDetail(orderId as string)
  orderDetail.value = res.data
})
// 患病时间选项
const timeOptions = [
  { label: '一周内', value: 1 },
  { label: '一月内', value: 2 },
  { label: '半年内', value: 3 },
  { label: '大于半年', value: 4 }
]
// 是否就诊
const flagOptions = [
  { label: '就诊过', value: 1 },
  { label: '没就诊过', value: 0 }
]
// 根据 value 得到患者的 label
const getTimeLabel = (value: number | undefined) => {
  if (value === undefined) return
  return timeOptions.find((item) => item.value === value)?.label
}
// 根据 value 得到是否就诊的 label
const getFlagLabel = (value: number | undefined) => {
  if (value === undefined) return
  return flagOptions.find((item) => item.value === value)?.label
}
</script>

<template>
  <div class="consult-detail-page" v-if="orderDetail">
    <cp-nav-bar title="问诊详情" />
    <div class="detail-head">
      <div class="text">
        <h3>图文问诊 {{ orderDetail?.payment }} 元</h3>
        <span class="sta green">{{ orderDetail?.statusValue }}</span>
        <p class="tip">服务医生信息</p>
      </div>
      <div class="card">
        <img class="avatar" src="@/assets/avatar-doctor.svg" alt="" />
        <p class="doc">
          <span>极速问诊</span>
          <span>
            {{ orderDetail?.docInfo?.name ? orderDetail?.docInfo?.name : '自动分配医生' }}
          </span>
        </p>
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="detail-patient">
      <van-cell-group :border="false">
        <van-cell
          title="患者信息"
          :value="`${orderDetail?.patientInfo.name} | ${orderDetail?.patientInfo.genderValue} | ${orderDetail?.patientInfo.age}岁`"
        />
        <van-cell title="患病时长" :value="getTimeLabel(orderDetail?.illnessTime)" />
        <van-cell title="就诊情况" :value="getFlagLabel(orderDetail?.consultFlag)" />
        <van-cell title="病情描述" :label="orderDetail?.illnessDesc" />
      </van-cell-group>
    </div>
    <div class="detail-order">
      <h3>订单信息</h3>
      <van-cell-group :border="false">
        <van-cell title="订单编号">
          <template #value>
            <span class="copy">复制</span>
            {{ orderDetail?.orderNo }}
          </template>
        </van-cell>
        <van-cell title="创建时间" :value="orderDetail?.createTime" />
        <van-cell title="应付款" :value="`￥${orderDetail?.payment}`" />
        <van-cell title="优惠券" :value="`-￥${orderDetail?.couponDeduction}`" />
        <van-cell title="积分抵扣" :value="`-￥${orderDetail?.pointDeduction}`" />
        <van-cell title="实付款" :value="`￥${orderDetail?.actualPayment}`" class="price" />
      </van-cell-group>
    </div>
    <div class="detail-action van-hairline--top">
      <div class="price">
        <span>需付款</span>
        <span>￥{{ orderDetail?.actualPayment }}</span>
      </div>
      <van-button type="default" round>取消问诊</van-button>
      <van-button type="primary" round>继续支付</van-button>
    </div>
  </div>
  <div class="consult-detail-page" v-else>
    <cp-nav-bar title="问诊详情" />
    <van-skeleton title :row="4" style="margin-top: 30px" />
    <van-skeleton title :row="4" style="margin-top: 30px" />
  </div>
</template>

<style lang="scss" scoped>
.consult-detail-page {
  padding: 46px 0 110px 0;
}
.detail-head {
  height: 140px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 135px;
    background: linear-gradient(180deg, rgba(44, 181, 165, 0), rgba(44, 181, 165, 0.2));
    border-bottom-left-radius: 150px 20px;
    border-bottom-right-radius: 150px 20px;
  }
  padding: 15px;
  .text {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 10px 3px;
    .sta {
      color: var(--cp-tag);
      font-weight: 500;
      font-size: 16px;
      &.green {
        color: var(--cp-primary);
      }
      &.orange {
        color: #f2994a;
      }
    }
    .tip {
      width: 100%;
      color: var(--cp-text3);
      margin-top: 5px;
    }
  }
  .card {
    height: 74px;
    background-color: #fff;
    border-radius: 8px;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 15px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    .avatar {
      width: 38px;
      height: 38px;
    }
    .doc {
      flex: 1;
      padding-left: 15px;
      > span {
        display: block;
        font-size: 16px;
        &:last-child {
          font-size: 13px;
          color: var(--cp-text3);
        }
      }
    }
    .van-icon {
      color: var(--cp-tip);
    }
  }
}
.detail-patient {
  &::after {
    content: '';
    display: block;
    height: 12px;
    background-color: var(--cp-bg);
  }
}
.detail-order {
  > h3 {
    padding: 10px 18px;
    font-weight: normal;
  }
  .copy {
    padding: 2px 10px;
    border: 1px solid var(--cp-primary);
    background-color: var(--cp-plain);
    color: var(--cp-primary);
    font-size: 12px;
    border-radius: 12px;
    margin-right: 10px;
  }
  :deep(.van-cell__title) {
    width: 70px;
    flex: none;
  }
  .price :deep(.van-cell__value) {
    font-size: 16px;
    color: var(--cp-price);
  }
}
.detail-action {
  height: 65px;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  background-color: #fff;
  justify-content: flex-end;
  padding: 0 15px;
  box-sizing: border-box;
  .price {
    flex: 1;
    > span:last-child {
      font-size: 18px;
      color: var(--cp-price);
      padding-left: 5px;
    }
  }
  .van-button {
    margin-left: 10px;
    padding-left: 17px;
    padding-right: 17px;
  }
  :deep(.van-button--default) {
    background-color: var(--cp-bg);
    color: var(--cp-text3);
  }
}
.van-cell {
  padding-left: 18px;
  padding-right: 18px;
}
</style>
