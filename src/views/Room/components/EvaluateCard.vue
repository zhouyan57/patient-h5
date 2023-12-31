<script lang="ts" setup>
import { MsgType } from '@/enums'
import type { ConsultOrderItem } from '@/types/consult'
import { inject, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { evaluateDocFn } from '@/services/room'
import { showToast } from 'vant'

// 1. 接收评价状态
defineProps<{
  type: MsgType
  myscore?: number
}>()

// 2. 评论医生（准备参数）
// 订单详情（为获取医生id）
const orderDetail = inject<Ref<ConsultOrderItem>>('orderDetail')
// 订单 id
const route = useRoute()
const orderId = route.query.orderId
const score = ref(0)
const content = ref('')
const anonymousFlag = ref(0)

// 3. 提交参数
const changeEva = inject<(score: number) => void>('changeEva')
const submit = async () => {
  // 判断参数是否存在
  if (!orderDetail?.value.docInfo?.id) return showToast('医生不存在')
  if (!orderId) return showToast('订单不存在')
  if (!score.value) return showToast('请设置分数')
  if (content.value.trim() === '') return showToast('请输入内容')
  // 发送请求
  await evaluateDocFn({
    docId: orderDetail.value.docInfo.id,
    orderId: orderId as string,
    score: score.value,
    content: content.value,
    anonymousFlag: anonymousFlag.value
  })
  // 由于服务器没有返回提交评价后的数据，所以我们应该直接修改评价数据
  changeEva && changeEva(score.value)
}
</script>
<template>
  <!-- 显示评价 -->
  <div class="evalutate-card" v-if="type === MsgType.CardEva">
    <p class="title">医生服务评价</p>
    <p class="desc">我们会更加努力提升服务质量</p>
    <van-rate
      :modelValue="myscore"
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
    />
  </div>
  <!-- 评价表单 -->
  <div class="evalutate-card" v-else>
    <p class="title">感谢您的评价</p>
    <p class="desc">本次在线问诊服务您还满意吗？</p>
    <van-rate
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
    />
    <van-field
      type="textarea"
      maxlength="150"
      show-word-limit
      rows="3"
      placeholder="请描述您对医生的评价或是在医生看诊过程中遇到的问题"
    ></van-field>
    <div class="footer">
      <van-checkbox
        :model-value="anonymousFlag"
        @update:model-value="anonymousFlag = $event ? 1 : 0"
        >匿名评价
      </van-checkbox>
      <van-button type="primary" size="small" round @click="submit"> 提交评价 </van-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.evalutate-card {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 15px;
  .title {
    font-size: 15px;
    margin-bottom: 5px;
  }
  .desc {
    font-size: 12px;
    margin-bottom: 15px;
    color: var(--cp-tip);
  }
  .van-field {
    background-color: var(--cp-bg);
    margin: 15px 0;
    border-radius: 8px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    ::v-deep() {
      .van-checkbox {
        .van-icon {
          font-size: 12px;
        }
        &__label {
          font-size: 12px;
          color: var(--cp-tip);
        }
        height: 16px;
      }
      .van-button {
        padding: 0 16px;
        &.disabled {
          opacity: 1;
          background: #fafafa;
          color: #d9dbde;
          border: #fafafa;
        }
      }
    }
  }
}
</style>
