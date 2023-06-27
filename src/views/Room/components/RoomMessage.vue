<script setup lang="ts">
import { MsgType, PrescriptionStatus } from '@/enums'
import type { Image } from '@/types/consult'
import type { Message, Prescription } from '@/types/room'
import { showImagePreview, showToast } from 'vant'
import { useUserStore } from '@/stores'
import dayjs from 'dayjs'
import { getPrescriptionUrl } from '@/services/consult'
import { useRouter } from 'vue-router'
import EvaluateCard from './EvaluateCard.vue'

// 1. 接收数据源
const props = defineProps<{
  list: Message[]
  isHistory: boolean // 判断是否是历史记录
}>()

// 2. 预览图片
const imagePreview = (images: Image[] | undefined) => {
  if (!images || images.length === 0) return showToast('暂无图片')
  // 从数据源中将所有的图片提取路径
  const newImages = images.map((item) => item.url)
  // 开启预览
  showImagePreview(newImages)
}

// 3. 修改患病时间 & 是否就诊
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

// 4. 处理时间
const FormatTime = (time: string) => {
  return dayjs(time).format('hh:mm')
}

// 5. 获取 store 对象
const userStore = useUserStore()

// 6. 图片加载完毕之后滚动到底部
const load = () => {
  if (props.isHistory) return
  window.scrollTo(0, document.body.scrollHeight)
}

// 7. 查看处方
const checkPre = async (id: string | undefined) => {
  if (id === undefined) return
  // 得到处方路径
  const res = await getPrescriptionUrl(id)
  // 展示图片
  showImagePreview([res.data.url])
}

// 8. 购买药品
const router = useRouter()
const buy = (pre: Prescription | undefined) => {
  if (!pre) return showToast('处方不存在')
  if (pre.status === PrescriptionStatus.NotPayment && pre.orderId)
    // 跳转到订单详情页面进行付款
    return router.push(`/order/${pre.orderId}`)
  if (pre.status === PrescriptionStatus.NotPayment && !pre.orderId)
    // 跳转到预支付页面
    return router.push(`/order/pay?id=${pre.id}`)
}
</script>

<template>
  <div v-for="(item, index) in list" :key="index">
    <!-- 通知 -->
    <div class="msg msg-tip" v-if="item.msgType === MsgType.Notify">
      <div class="content">
        <span>{{ item.msg.content }}</span>
      </div>
    </div>

    <!-- 病情描述 -->
    <div class="msg msg-illness" v-if="item.msgType === MsgType.CardPat">
      <div class="patient van-hairline--bottom">
        <p>
          {{ item.msg.consultRecord?.patientInfo.name }}
          {{ item.msg.consultRecord?.patientInfo.genderValue }}
          {{ item.msg.consultRecord?.patientInfo.age }}岁
        </p>
        <p>
          {{ getTimeLabel(item.msg.consultRecord?.illnessTime) }} |
          {{ getFlagLabel(item.msg.consultRecord?.consultFlag) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ item.msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <van-col span="18" @click="imagePreview(item.msg.consultRecord?.pictures)"
          >点击查看</van-col
        >
      </van-row>
    </div>

    <!-- 温馨提示 -->
    <div class="msg msg-tip" v-if="item.msgType === MsgType.NotifyTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ item.msg.content }}</span>
      </div>
    </div>

    <div v-if="item.msgType === MsgType.MsgText">
      <!-- 发送文字 -->
      <div class="msg msg-to" v-if="item.from === userStore.user?.id">
        <div class="content">
          <div class="time">{{ FormatTime(item.createTime) }}</div>
          <div class="pao">{{ item.msg.content }}</div>
        </div>
        <van-image :src="item.fromAvatar" />
      </div>

      <!-- 接收文字 -->
      <div class="msg msg-from" v-else>
        <van-image
          src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
        />
        <div class="content">
          <div class="time">{{ FormatTime(item.createTime) }}</div>
          <div class="pao">{{ item.msg.content }}</div>
        </div>
      </div>
    </div>

    <div v-if="item.msgType === MsgType.MsgImage">
      <!-- 发送图片 -->
      <div class="msg msg-to" v-if="item.from === userStore.user?.id">
        <div class="content">
          <div class="time">{{ FormatTime(item.createTime) }}</div>
          <van-image @load="load" fit="contain" :src="item.msg.picture?.url" />
        </div>
        <van-image :src="item.fromAvatar" />
      </div>
      <!-- 接收图片 -->
      <div class="msg msg-from" v-else>
        <van-image
          src="https://img1.baidu.com/it/u=2301129870,1976278379&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
        />
        <div class="content">
          <div class="time">{{ FormatTime(item.createTime) }}</div>
          <van-image @load="load" fit="contain" :src="item.msg.picture?.url" />
        </div>
      </div>
    </div>
    <!-- 处方消息 -->
    <div class="msg msg-recipe" v-if="item.msgType === MsgType.CardPre">
      <div class="content">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <p @click="checkPre(item.msg.prescription?.id)">
              原始处方 <van-icon name="arrow"></van-icon>
            </p>
          </div>
          <p>
            {{ item.msg.prescription?.name }}
            {{ item.msg.prescription?.gender ? '男' : '女' }}
            {{ item.msg.prescription?.age }}岁
            {{ item.msg.prescription?.diagnosis }}
          </p>
          <p>开方时间：{{ item.msg.prescription?.createTime }}</p>
        </div>
        <div class="body">
          <div class="body-item" v-for="i in item.msg.prescription?.medicines" :key="i.id">
            <div class="durg">
              <p>{{ i.name }}</p>
              <p>{{ i.usageDosag }}</p>
            </div>
            <div class="num">x{{ i.quantity }}</div>
          </div>
        </div>
        <div class="foot" @click="buy(item.msg.prescription)"><span>购买药品</span></div>
      </div>
    </div>

    <!-- 医生评价 -->
    <div
      class="msg"
      v-if="item.msgType === MsgType.CardEvaForm || item.msgType === MsgType.CardEva"
    >
      <!-- 评论信息 -->
      <EvaluateCard :type="item.msgType" :myscore="item.msg.evaluateDoc?.score"></EvaluateCard>
    </div>
  </div>

  <!-- ---------------------------------- -->

  <!-- 订单取消 -->
  <div class="msg msg-tip msg-tip-cancel">
    <div class="content">
      <span>订单取消</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>
