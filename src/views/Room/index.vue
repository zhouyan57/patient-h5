<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import io from 'socket.io-client'
import { BASEURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { onUnmounted } from 'vue'
// 1. 使用 websocket 来连接服务器
const userStore = useUserStore()
const route = useRoute()
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
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <!-- 状态栏 -->
    <RoomStatus></RoomStatus>
    <!-- 消息卡片 -->
    <room-message></room-message>
    <!-- 操作栏 -->
    <RoomAction></RoomAction>
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
