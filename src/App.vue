<script setup lang="ts">
import { Button as VanButton, Checkbox as VanCheckbox } from 'vant'
import { ref } from 'vue'
const agree = ref(true)
</script>
<template>
  <h2>根组件</h2>
  <van-button type="primary">主要按钮</van-button>
  <div class="box"></div>
  <div class="word">我是一个 div</div>
  <van-checkbox v-model="agree">复选框</van-checkbox>
</template>
<style>
:root {
  --main: pink;
}
.box {
  width: 200px;
  height: 200px;
  background-color: var(--main);
}
.word {
  width: 100px;
  height: 50px;
  color: red;
  background-color: var(--main);
}
</style>
