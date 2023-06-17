<script setup lang="ts">
import { Button as VanButton } from 'vant'
</script>
<template>
  <h2>根组件</h2>
  <van-button type="primary">主要按钮</van-button>
  <div class="box"></div>
</template>
<style scoped>
.box {
  margin-top: 20px;
  width: 200px;
  height: 200px;
  background-color: pink;
}
</style>
