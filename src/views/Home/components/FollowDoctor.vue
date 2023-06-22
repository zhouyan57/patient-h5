<script setup lang="ts">
import DoctorCard from './DoctorCard.vue'
// import { onMounted, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
// 1.0 解决宽度问题
// ----- 得到屏幕的宽度（@vueuse/core) ---
const { width } = useWindowSize()
// ----- 得到屏幕的宽度（dom 操作） ---
// const width = ref(0)
// const getWdth = () => {
//   width.value = window.innerWidth
//   console.log(width.value)
// }
// onMounted(() => {
//   getWdth()
//   window.addEventListener('resize', getWdth)
// })
</script>

<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <div class="body">
      <!-- swipe 组件 -->
      <van-swipe :show-indicators="false" :width="(150 / 375) * width">
        <van-swipe-item v-for="i in 8" :key="i">
          <DoctorCard></DoctorCard>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  height: 250px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
