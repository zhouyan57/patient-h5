<script lang="ts" setup>
// 1. 点击注册的事件
const toRegister = () => {
  console.log('跳转到注册页面')
}
</script>

<template>
  <div class="login-page">
    <cp-nav-bar right-text="注册" @click-right="toRegister"></cp-nav-bar>
  </div>
</template>

<style></style>
