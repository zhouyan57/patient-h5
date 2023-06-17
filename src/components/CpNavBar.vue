<script setup lang="ts">
// 导入得到路由对象的函数
import { useRouter } from 'vue-router'
import {} from 'vant'
// 接收数据
defineProps<{
  // 标题
  title?: string
  // 右侧文本
  rightText?: string
}>()
// 定义事件
const emit = defineEmits<{
  (e: 'click-right'): void
}>()
// 右侧文本的点击事件
const clickRight = () => {
  // 触发外界事件
  emit('click-right')
}
// 箭头的点击事件
const router = useRouter()
const clickLeft = () => {
  // 返回到上一个页面：
  router.back() // 以前 this.$router
}
</script>
<template>
  <!-- 封装一个头部组件 -->
  <van-nav-bar
    left-arrow
    :title="title"
    :right-text="rightText"
    @click-right="clickRight"
    @click-left="clickLeft"
  />
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
