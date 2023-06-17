<script setup lang="ts"></script>
<template>
  <!-- 设置路由出口 -->
  <router-view></router-view>
  <button @click="$router.push('/login')">点我去登录</button>
</template>
<style scoped></style>
