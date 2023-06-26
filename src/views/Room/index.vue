<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <!-- 状态栏 -->
    <RoomStatus></RoomStatus>
    <!-- 消息卡片 -->
    <!-- 操作栏 -->
    <RoomAction></RoomAction>
  </div>
</template>

<style lang="scss" scoped></style>
