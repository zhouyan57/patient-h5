<script setup lang="ts">
// import {} from 'vant'
</script>
<template>
  <!-- 封装一个头部组件 -->
  <van-nav-bar left-arrow title="标题" right-text="右侧文本" />
</template>
<style scoped lang="scss">
::v-deep() {
  // 左侧文本大小&颜色
  .van-nav-bar__arrow {
    font-size: 18px;
    color: var(--cp-text1);
  }
  // 右侧文本大小
  .van-nav-bar__text {
    font-size: 15px;
  }
}
</style>
