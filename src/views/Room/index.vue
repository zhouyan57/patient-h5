<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import io from 'socket.io-client'
import { BASEURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { onUnmounted, ref } from 'vue'
import type { Message, TimeMessages } from '@/types/room'
import { MsgType } from '@/enums/index'
import { getConsultOrderDetail } from '@/services/consult'
import type { ConsultOrderItem } from '@/types/consult'
import { OrderType } from '@/enums'
import dayjs from 'dayjs'
// 1. 使用 websocket 来连接服务器
const userStore = useUserStore()
const route = useRoute()
// 返回信息数据源
const list = ref<Message[]>([])
// 与服务端建立连接
const socket = io(BASEURL, {
  auth: {
    token: `Bearer ${userStore.user?.token}`
  },
  query: {
    orderId: route.query.orderId
  }
})

// 建立连接成功的回调
socket.on('connect', () => {
  console.log('连接成功')
  // 2. 获取默认聊天记录
  // 定义默认聊天记录数组
  const defaultArr: Message[] = []
  socket.on('chatMsgList', (res: { data: TimeMessages[] }) => {
    // 得到返回消息的时间，生成为一条信息
    console.log('chatMsgList', res.data)

    defaultArr.push({
      msgType: MsgType.Notify,
      createTime: res.data[0].createTime,
      msg: {
        content: res.data[0].createTime
      }
    })
    // 将剩余的消息添加到默认聊天记录中
    defaultArr.push(...res.data[0].items)
    // 将默认聊天记录添加到消息记录中
    list.value.unshift(...defaultArr)
  })
})
// 监听断开连接
socket.on('disconnect', () => {
  console.log('断开连接')
})
// 监听错误的事件
socket.on('error', (e) => {
  console.log('出错了', e)
})
// 关闭页面断开连接
onUnmounted(() => {
  socket.close()
})

// 2. 获取订单状态
// 保存订单数据
const orderDetail = ref<ConsultOrderItem>()
// 获取订单信息
const getOrderDetail = async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  orderDetail.value = res.data
}
onMounted(async () => {
  await getOrderDetail()
  // 使用 websocket 监听订单状态的变化
  socket.on('statusChange', async () => {
    // 获取新的订单信息
    await getOrderDetail()
  })
})

// 3. 发送消息
// 在事件通过 socket.emit 的 sendChatMsg 发送文字给服务器
const sendText = (v: string) => {
  socket.emit('sendChatMsg', {
    from: userStore.user?.id,
    to: orderDetail.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: {
      content: v
    }
  })
}

// 4. 接收消息
socket.on('receiveChatMsg', (e: Message) => {
  // 将接收到的消息添加到消息列表中
  list.value.push(e)
})

// 5. 发送消息（图片)
// 在事件通过 socket.emit 的 sendChatMsg 发送图片给服务器
const sendImg = (v: { id: string; url: string }) => {
  socket.emit('sendChatMsg', {
    from: userStore.user?.id,
    to: orderDetail.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: {
      picture: v
    }
  })
}
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <!-- 状态栏 -->
    <RoomStatus :status="orderDetail?.status" :time="orderDetail?.countdown"></RoomStatus>
    <!-- 消息卡片 -->
    <room-message :list="list"></room-message>
    <!-- 操作栏 -->
    <RoomAction
      @send-text="sendText"
      @send-img="sendImg"
      :disabled="orderDetail?.status !== OrderType.ConsultChat"
    ></RoomAction>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
