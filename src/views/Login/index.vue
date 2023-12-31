<script lang="ts" setup>
import { ref } from 'vue'
import { mobileRule, passwordRule, codeRule } from '@/utils/rules'
import { showLoadingToast, showSuccessToast, showToast } from 'vant'
import { loginByPassword, getMobileCode, loginByCode } from '@/services/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

// 1. 点击注册的事件
const toRegister = () => {
  console.log('跳转到注册页面')
}
// 2. 表单结构
const agree = ref(false)
// 3. 密码框的睁眼功能
const show = ref(false)
const mobile = ref('13230000001')
const password = ref('abc12345')
// 4. 提交校验 & 完成短信登录
// 得到 store 实例
const store = useUserStore()
// 得到路由对象
const router = useRouter()
const onSubmit = async () => {
  // 判断是否同意协议
  if (!agree.value) return showToast('请先同意协议')
  // 开启加载效果
  showLoadingToast('登录中...')

  // 发送请求
  const res = isPwd.value
    ? await loginByPassword(mobile.value, password.value) // 发送请求到服务器(密码登录)
    : await loginByCode(mobile.value, code.value) // 发送请求到服务器(验证码登录)

  // 保存用户信息
  store.setUser(res.data)
  // 提示登录成功
  showSuccessToast('登录成功')
  // 跳转到用户信息页面
  router.push('/user')
}
// 5. 密码框和手机验证 切换效果
const isPwd = ref(true)
const code = ref('')
const second = ref(0)
const timer = ref<number>()
// 6. 验证手机号 & 获取验证码 & 设置倒计时
const form = ref<HTMLFormElement | null>(null)
const getCode = async () => {
  await form.value!.validate('mobile')
  const res = await getMobileCode(mobile.value)
  // 显示验证码
  showToast(res.data.code)
  // 开启倒计时
  second.value = 60
  timer.value = setInterval(() => {
    second.value--
    if (second.value <= 0) {
      clearInterval(timer.value)
    }
  }, 1000)
}
</script>

<template>
  <div class="login-page">
    <!-- 头部组件 -->
    <cp-nav-bar :fixed="true" right-text="注册" @click-right="toRegister"></cp-nav-bar>
    <!-- 头部区域 -->
    <div class="login-head">
      <h3>{{ isPwd ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;">
        <span @click="isPwd = !isPwd">{{ isPwd ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单区域 -->
    <van-form ref="form" autocomplete="off" @submit="onSubmit">
      <van-field
        :rules="mobileRule"
        v-model="mobile"
        placeholder="请输入手机号"
        name="mobile"
        type="tel"
      ></van-field>
      <van-field
        v-if="isPwd"
        :rules="passwordRule"
        v-model="password"
        placeholder="请输入密码"
        :type="show ? 'text' : 'password'"
      >
        <template #right-icon>
          <cp-icon @click="show = !show" :name="`login-eye-${show ? 'on' : 'off'}`"></cp-icon>
        </template>
      </van-field>
      <van-field v-model="code" placeholder="短信验证码" :rules="codeRule" v-else>
        <template #button>
          <span v-if="second <= 0" @click="getCode" class="btn-send">发送验证码</span>
          <span v-else>{{ second }}s后再次获取</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button native-type="submit" block round type="primary">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
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
.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
}

// van-form 下添加
.btn-send {
  color: var(--cp-primary);
  &.active {
    color: rgba(22, 194, 163, 0.5);
  }
}
</style>
