<script setup lang="ts">
import { getMedicalOrderPre, getAddressList, createMedicineOrder } from '@/services/order'
import type { OrderPre, AddressItem } from '@/types/order'
import { showToast } from 'vant'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
// 1. 得到药品信息
const route = useRoute()
const orderInfo = ref<OrderPre>()
onMounted(async () => {
  const res = await getMedicalOrderPre(route.query.id as string)
  orderInfo.value = res.data
})

// 2. 得到收货地址列表
const addressList = ref<AddressItem[]>([])
onMounted(async () => {
  const res = await getAddressList()
  addressList.value = res.data
})

// 3. 进入支付
const agree = ref(false)
// 订单 ID
const orderId = ref('')
const show = ref(false)
const submit = async () => {
  // 判断是否同意协议
  if (!agree.value) return showToast('请同意协议')
  // 生成订单
  const res = await createMedicineOrder(route.query.id as string, addressList.value[0].id)
  orderId.value = res.data.id
  // 打开支付抽屉组件
  show.value = true
}
</script>

<template>
  <div class="order-pay-page">
    <cp-nav-bar title="药品支付" />
    <div class="order-address">
      <p class="area">
        <van-icon name="location" />
        <span>{{ addressList[0]?.province }}</span>
        <span>{{ addressList[0]?.city }}</span>
        <span>{{ addressList[0]?.county }}</span>
      </p>
      <p class="detail">{{ addressList[0]?.addressDetail }}</p>
      <p>{{ addressList[0]?.receiver }} {{ addressList[0]?.mobile }}</p>
    </div>
    <div class="order-medical">
      <div class="head">
        <h3>优医药房</h3>
        <small>优医质保 假一赔十</small>
      </div>
      <div class="item van-hairline--top" v-for="i in orderInfo?.medicines" :key="i.id">
        <img class="img" :src="i.avatar" alt="" />
        <div class="info">
          <p class="name">
            <span>{{ i.name }}</span>
            <span>x{{ i.quantity }}</span>
          </p>
          <p class="size">
            <van-tag>{{ i.prescriptionFlag ? '处方药' : '非处方药' }}</van-tag>
            <span>{{ i.specs }}</span>
          </p>
          <p class="price">￥{{ i.amount }}</p>
        </div>
        <div class="desc">用法用量：{{ i.usageDosag }}</div>
      </div>
    </div>
    <div class="order-detail">
      <van-cell-group>
        <van-cell title="药品金额" :value="`￥${orderInfo?.payment}`" />
        <van-cell title="运费" :value="`￥${orderInfo?.expressFee}`" />
        <van-cell title="优惠券" :value="`-￥${orderInfo?.couponDeduction}`" />
        <van-cell title="实付款" :value="`￥${orderInfo?.actualPayment}`" class="price" />
      </van-cell-group>
    </div>
    <div class="order-tip">
      <p class="tip">
        由于药品的特殊性，如非错发、漏发药品的情况，药品一经发出
        不得退换，请核对药品信息无误后下单。
      </p>
      <van-checkbox v-model="agree">我已同意<a href="javascript:;">支付协议</a></van-checkbox>
    </div>
    <van-submit-bar
      @click="submit"
      :price="50 * 100"
      button-text="立即支付"
      button-type="primary"
      text-align="left"
    ></van-submit-bar>
    <!-- 支付抽屉 -->
    <CpPaySheet
      v-model:show="show"
      :actual-payment="orderInfo?.actualPayment!"
      :order-id="orderId"
      pay-callback="http://localhost:5173/order/pay/result"
    ></CpPaySheet>
  </div>
</template>

<style lang="scss" scoped>
:deep(.van-nav-bar) {
  background-color: var(--cp-primary);
  .van-nav-bar__arrow,
  .van-nav-bar__title {
    color: #fff;
  }
}
:deep(.van-cell) {
  .van-cell__title {
    font-size: 16px;
  }
  .van-cell__value {
    font-size: 16px;
  }
  &.price {
    .van-cell__value {
      font-size: 18px;
      color: var(--cp-price);
    }
  }
}
:deep(.van-submit-bar) {
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  .van-button {
    width: 200px;
  }
}
.order-pay-page {
  padding: 46px 0 65px;
}
.order-address {
  padding: 15px 15px 0 15px;
  background-color: #fff;
  font-size: 13px;
  .area {
    color: var(--cp-tag);
    margin-bottom: 5px;
    .van-icon-location {
      color: #ff7702;
      font-size: 14px;
    }
  }
  .detail {
    font-size: 17px;
    margin-bottom: 5px;
  }
  &::after {
    content: '';
    display: block;
    height: 12px;
    background-color: var(--cp-bg);
    margin: 0 -15px;
    margin-top: 15px;
  }
}

.order-medical {
  background-color: #fff;
  padding: 0 15px;
  .head {
    display: flex;
    height: 54px;
    align-items: center;
    > h3 {
      font-size: 16px;
      font-weight: normal;
    }
    > small {
      font-size: 13px;
      color: var(--cp-tag);
      margin-left: 10px;
    }
  }
  .item {
    display: flex;
    flex-wrap: wrap;
    padding: 15px 0;
    .img {
      width: 80px;
      height: 70px;
      border-radius: 2px;
      overflow: hidden;
    }
    .info {
      padding-left: 15px;
      width: 250px;
      .name {
        display: flex;
        font-size: 15px;
        margin-bottom: 5px;
        > span:first-child {
          width: 200px;
        }
        > span:last-child {
          width: 50px;
          text-align: right;
        }
      }
      .size {
        margin-bottom: 5px;
        .van-tag {
          background-color: var(--cp-primary);
          vertical-align: middle;
        }
        span:not(.van-tag) {
          margin-left: 10px;
          color: var(--cp-tag);
          vertical-align: middle;
        }
      }
      .price {
        font-size: 16px;
        color: #eb5757;
      }
    }
    .desc {
      width: 100%;
      background-color: var(--cp-bg);
      border-radius: 4px;
      margin-top: 10px;
      padding: 4px 10px;
      color: var(--cp-tip);
    }
  }
}
.order-tip {
  padding: 0 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
  .tip {
    font-size: 12px;
    color: var(--cp-tag);
    width: 100%;
    &::before {
      content: '*';
      color: var(--cp-price);
      font-size: 14px;
    }
    margin-bottom: 30px;
  }
  .van-checkbox {
    a {
      color: var(--cp-primary);
    }
  }
}
</style>
