<script setup lang="ts"></script>
<template>
  <div class="layout-page">
    <!-- 二级路由出口 -->
    <router-view></router-view>
    <!-- 底部的 tab 栏 -->
    <van-tabbar route>
      <van-tabbar-item to="/home">
        首页
        <template #icon="scope">
          <cp-icon :name="`home-index-${scope.active ? 'active' : 'default'}`"></cp-icon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/article">
        健康百科
        <template #icon="{ active }">
          <cp-icon :name="`home-article-${active ? 'active' : 'default'}`"></cp-icon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/notify">
        消息中心
        <template #icon="{ active }">
          <cp-icon :name="`home-notice-${active ? 'active' : 'default'}`"></cp-icon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/user">
        我的
        <template #icon="{ active }">
          <cp-icon :name="`home-mine-${active ? 'active' : 'default'}`"></cp-icon>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<style scoped lang="scss"></style>
