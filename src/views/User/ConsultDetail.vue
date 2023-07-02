<script setup lang="ts">
import { getConsultOrderDetail } from '@/services/consult'
import type { ConsultOrderItem } from '@/types/consult'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { OrderType } from '@/enums'
import { useOrderCancel, useShowPrescription, useOrderDel } from '@/composable'
import { useClipboard } from '@vueuse/core'
import { showToast } from 'vant'
import { watch } from 'vue'

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

// 2. 取消订单
const { loading, cancel } = useOrderCancel()

// 3. 删除订单
const router = useRouter()
const { delLoading, del } = useOrderDel(() => {
  // 删除成功之后，应该跳转到问诊记录页面
  router.push('/user/consult')
})

// 4. 查看处方
const { checkPre } = useShowPrescription()

// 5. 复制订单编号
const { copy, copied, isSupported } = useClipboard()
const onCopy = () => {
  // 判断是否支持
  if (!isSupported.value) return showToast('浏览器不支持该功能')
  if (!orderDetail.value?.orderNo) return
  copy(orderDetail.value?.orderNo)
}
watch(copied, () => {
  if (copied.value) showToast('复制成功')
})

// 6. 使用支付抽屉组件
const show = ref(false)
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
            <span @click="onCopy" class="copy">复制</span>
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
    <!-- 待支付 -->
    <div class="detail-time" v-if="orderDetail.status === OrderType.ConsultPay">
      请在 <van-count-down :time="orderDetail.countdown * 1000" /> 内完成支付，超时订单将取消
    </div>
    <div class="detail-action van-hairline--top" v-if="orderDetail.status === OrderType.ConsultPay">
      <div class="price">
        <span>需付款</span>
        <span>￥{{ orderDetail?.actualPayment }}</span>
      </div>
      <van-button :loading="loading" @click="cancel(orderDetail!)" type="default" round
        >取消问诊</van-button
      >
      <van-button @click="show = true" type="primary" round>继续支付</van-button>
    </div>
    <!-- 待接诊 -->
    <div
      class="detail-action van-hairline--top"
      v-if="orderDetail.status === OrderType.ConsultWait"
    >
      <van-button :loading="loading" @click="cancel(orderDetail!)" type="default" round
        >取消问诊</van-button
      >
      <van-button @click="$router.push(`/room?orderId=${orderDetail?.id}`)" type="primary" round>
        继续沟通
      </van-button>
    </div>
    <!-- 咨询中 -->
    <div
      class="detail-action van-hairline--top"
      v-if="orderDetail.status === OrderType.ConsultChat"
    >
      <van-button
        @click="checkPre(orderDetail?.prescriptionId)"
        v-if="orderDetail.prescriptionId"
        type="default"
        round
        >查看处方</van-button
      >
      <van-button @click="$router.push(`/room?orderId=${orderDetail?.id}`)" type="primary" round>
        继续沟通
      </van-button>
    </div>
    <!-- 已完成 -->
    <div
      class="detail-action van-hairline--top"
      v-if="orderDetail.status === OrderType.ConsultComplete"
    >
      <cp-consult-more
        :disabled="orderDetail.prescriptionId ? false : true"
        @del-item="del(orderDetail?.id)"
        @check-pre="checkPre(orderDetail?.prescriptionId)"
      ></cp-consult-more>
      <van-button @click="$router.push(`/room?orderId=${orderDetail?.id}`)" type="default" round>
        问诊记录
      </van-button>
      <van-button type="primary" round>
        {{ orderDetail.evaluateId ? '查看评价' : '写评价' }}
      </van-button>
    </div>
    <!-- 已取消 -->
    <div
      class="detail-action van-hairline--top"
      v-if="orderDetail.status === OrderType.ConsultCancel"
    >
      <van-button :loading="delLoading" @click="del(orderDetail?.id)" type="default" round
        >删除订单</van-button
      >
      <van-button type="primary" round>咨询其它医生 </van-button>
    </div>
    <!-- 支付的抽屉 -->
    <cp-pay-sheet
      v-model:show="show"
      :actual-payment="orderDetail.actualPayment"
      :order-id="orderDetail.id"
    ></cp-pay-sheet>
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
.detail-time {
  position: fixed;
  left: 0;
  bottom: 65px;
  width: 100%;
  height: 44px;
  background-color: #fff7eb;
  text-align: center;
  line-height: 44px;
  font-size: 13px;
  color: #f2994a;
  .van-count-down {
    display: inline;
    color: #f2994a;
  }
}
</style>
