<script lang="ts" setup>
// 1. 点击注册的事件
const toRegister = () => {
  console.log('跳转到注册页面')
}
</script>

<template>
  <div class="login-page">
    <!-- 头部组件 -->
    <cp-nav-bar :fixed="true" right-text="注册" @click-right="toRegister"></cp-nav-bar>
    <!-- 头部区域 -->
    <div class="login-head">
      <h3>密码登录</h3>
      <a href="javascript:;">
        <span>短信验证码登录</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单区域 -->
    <!-- 底部区域 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  &-page {
    padding-top: 46px;
  }
  &-head {
    background-color: pink;
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }

  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
</style>
