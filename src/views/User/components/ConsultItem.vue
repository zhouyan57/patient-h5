<script setup lang="ts">
import type { ConsultOrderItem } from '@/types/consult'
import { OrderType } from '@/enums'
import { computed, ref } from 'vue'
import { useShowPrescription, useOrderCancel, useOrderDel } from '@/composable'

// 1.0 接收数据
const props = defineProps<{
  data: ConsultOrderItem
}>()
// 2. 渲染按钮
const showPopover = ref(false)
// const actions = [{ text: '查看处方' }, { text: '删除订单' }]
const actions = computed(() => {
  return [{ text: '查看处方', disabled: props.data.prescriptionId }, { text: '删除订单' }]
})
// 点击更多选项时会触发的方法
const onSelect = (action: { text: string }) => {
  if (action.text === '删除订单') {
    del(props.data.id)
  } else {
    checkPre(props.data.prescriptionId)
  }
}

// 3. 取消订单
const { loading, cancel } = useOrderCancel()
// const loading = ref(false)
// const cancel = async (data: ConsultOrderItem) => {
//   if (!data.id) return showToast('订单 id 有误')
//   loading.value = true
//   setTimeout(async () => {
//     await orderCancel(data.id)
//     // 手动让订单状态改为已取消
//     data.status = OrderType.ConsultCancel
//     data.statusValue = '已取消'
//     loading.value = false
//   }, 1000)
// }

// 4. 删除订单
const emit = defineEmits<{
  (e: 'del-item', id: string): void
}>()
const { delLoading, del } = useOrderDel((id: string) => {
  emit('del-item', id)
})
// const delLoading = ref(false)
// const del = (id: string | undefined) => {
//   if (!id) return showToast('订单 id 有误')
//   delLoading.value = true
//   setTimeout(async () => {
//     await orderDel(id)
//     // 将要删除订单的 id 提交给父组件，在父组件中删除订单
//     emit('del-item', id)
//     delLoading.value = false
//   }, 1000)
// }

// 5. 查看处方
const { checkPre } = useShowPrescription()
</script>

<template>
  <div class="consult-item">
    <div class="head van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p>{{ data.docInfo?.name || '极速问诊（自动分配医生）' }}</p>
      <span>{{ data.statusValue }}</span>
    </div>
    <div class="body">
      <div class="body-row">
        <div class="body-label">病情描述</div>
        <div class="body-value">{{ data.illnessDesc }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">价格</div>
        <div class="body-value">¥ {{ data.payment.toFixed(2) }}</div>
      </div>
      <div class="body-row">
        <div class="body-label">创建时间</div>
        <div class="body-value tip">{{ data.createTime }}</div>
      </div>
    </div>
    <!-- <div class="foot">
      <van-button class="gray" plain size="small" round>取消问诊</van-button>
      <van-button type="primary" plain size="small" round>去支付</van-button>
    </div> -->
    <!-- 待支付 -->
    <div class="foot" v-if="data.status === OrderType.ConsultPay">
      <van-button :loading="loading" @click="cancel(data)" class="gray" plain size="small" round
        >取消问诊</van-button
      >
      <van-button
        @click="$router.push(`/user/consult/${data.id}`)"
        type="primary"
        plain
        size="small"
        round
        >去支付</van-button
      >
    </div>
    <!-- 待接诊 -->
    <div class="foot" v-if="data.status === OrderType.ConsultWait">
      <van-button :loading="loading" @click="cancel(data)" class="gray" plain size="small" round
        >取消问诊</van-button
      >
      <van-button
        @click="$router.push(`/room?orderId=${data.id}`)"
        type="primary"
        plain
        size="small"
        round
        >继续沟通</van-button
      >
    </div>
    <!-- 咨询中 -->
    <div class="foot" v-if="data.status === OrderType.ConsultChat">
      <van-button
        @click="checkPre(data.prescriptionId)"
        v-if="data.prescriptionId"
        class="gray"
        plain
        size="small"
        round
      >
        查看处方
      </van-button>
      <van-button
        @click="$router.push(`/room?orderId=${data.id}`)"
        type="primary"
        plain
        size="small"
        round
        >继续沟通</van-button
      >
    </div>
    <!-- 已完成 -->
    <div class="foot complete" v-if="data.status === OrderType.ConsultComplete">
      <van-popover v-model:show="showPopover" :actions="actions" @select="onSelect">
        <template #reference>
          <span>更多</span>
        </template>
      </van-popover>
      <div>
        <van-button
          @click="$router.push(`/room?orderId=${data.id}`)"
          class="gray"
          plain
          size="small"
          round
        >
          问诊记录
        </van-button>
        <van-button
          @click="$router.push(`/room?orderId=${data.id}`)"
          type="primary"
          plain
          size="small"
          round
        >
          {{ data.evaluateId ? '查看评价' : '写评价' }}
        </van-button>
      </div>
    </div>
    <!-- 已取消 -->
    <div class="foot" v-if="data.status === OrderType.ConsultCancel">
      <van-button :loading="delLoading" @click="del(data.id)" class="gray" plain size="small" round
        >删除订单</van-button
      >
      <van-button type="primary" plain size="small" round>咨询其它医生</van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-item {
  border-radius: 4px;
  box-shadow: 0px 0px 22px 0px rgba(245, 245, 245, 0.1);
  background-color: #fff;
  margin-bottom: 10px;
  .head {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 15px;
    .img {
      width: 20px;
      height: 20px;
    }
    > p {
      flex: 1;
      font-size: 15px;
      padding-left: 10px;
    }
    > span {
      color: var(--cp-tag);
      &.orange {
        color: #f2994a;
      }
      &.green {
        color: var(--cp-primary);
      }
    }
  }
  .body {
    padding: 15px 15px 8px 15px;
    .body-row {
      display: flex;
      margin-bottom: 7px;
    }
    .body-label {
      width: 62px;
      font-size: 13px;
      color: var(--cp-tip);
    }
    .body-value {
      width: 250px;
      &.tip {
        color: var(--cp-tip);
      }
    }
  }
  .foot {
    padding: 0 15px 15px 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .van-button {
      margin-left: 10px;
      padding: 0 16px;
      &.gray {
        color: var(--cp-text3);
        background-color: var(--cp-bg);
      }
    }
    .more {
      color: var(--cp-tag);
      flex: 1;
      font-size: 13px;
    }
  }
}
.complete {
  justify-content: space-between !important;
}
</style>
