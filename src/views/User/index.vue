<script setup lang="ts">
import { getUserInfo } from '@/services/user'
import type { UserInfo } from '@/types/user'
import { showConfirmDialog } from 'vant'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
// 1. 获取用户信息数据
// 定义用户对象
const userInfo = ref<UserInfo>()
onMounted(async () => {
  const res = await getUserInfo()
  userInfo.value = res.data
})
// 2. 渲染快捷工具数据
const tools = [
  { label: '我的问诊', path: '/user/consult' },
  { label: '我的处方', path: '/' },
  { label: '家庭档案', path: '/user/patient' },
  { label: '地址管理', path: '/user/address' },
  { label: '我的评价', path: '/' },
  { label: '官方客服', path: '/' },
  { label: '设置', path: '/' }
]
// 3. 退出登录
const store = useUserStore()
const router = useRouter()
const logout = async () => {
  // 询问用户是否退出
  await showConfirmDialog({
    title: '温馨提示',
    message: '您确认要退出优医问诊吗？'
  })
  // 退出登录：清除用户信息
  store.removeUser()
  // 回到登录页面
  router.push('/login')
}
</script>

<template>
  <div class="user-page">
    <div class="user-page-head">
      <div class="top">
        <van-image round fit="cover" :src="userInfo?.avatar" />
        <div class="name">
          <p>{{ userInfo?.account }}</p>
          <p><van-icon name="edit" /></p>
        </div>
      </div>
      <van-row>
        <van-col span="6">
          <p>{{ userInfo?.collectionNumber }}</p>
          <p>收藏</p>
        </van-col>
        <van-col span="6">
          <p>{{ userInfo?.likeNumber }}</p>
          <p>关注</p>
        </van-col>
        <van-col span="6">
          <p>{{ userInfo?.score }}</p>
          <p>积分</p>
        </van-col>
        <van-col span="6">
          <p>{{ userInfo?.couponNumber }}</p>
          <p>优惠券</p>
        </van-col>
      </van-row>
    </div>
    <div class="user-page-order">
      <div class="head">
        <h3>药品订单</h3>
        <router-link to="/order">全部订单 <van-icon name="arrow" /></router-link>
      </div>
      <van-row>
        <van-col span="6">
          <van-badge :content="userInfo?.orderInfo.paidNumber || ''">
            <cp-icon name="user-paid" />
            <p>待付款</p>
          </van-badge>
        </van-col>
        <van-col span="6">
          <van-badge :content="userInfo?.orderInfo.receivedNumber || ''">
            <cp-icon name="user-shipped" />
            <p>待发货</p>
          </van-badge>
        </van-col>
        <van-col span="6">
          <van-badge :content="userInfo?.orderInfo.shippedNumber || ''">
            <cp-icon name="user-received" />
            <p>待收货</p>
          </van-badge>
        </van-col>
        <van-col span="6">
          <van-badge :content="userInfo?.orderInfo.finishedNumber || ''">
            <cp-icon name="user-finished" />
            <p>已完成</p>
          </van-badge>
        </van-col>
      </van-row>
    </div>
    <div class="user-page-group">
      <h3>快捷工具</h3>
      <van-cell
        :title="item.label"
        :to="item.path"
        is-link
        :border="false"
        v-for="(item, index) in tools"
        :key="index"
      >
        <template #icon><cp-icon :name="`user-tool-0${index + 1}`" /></template>
      </van-cell>
    </div>
    <a class="logout" href="javascript:;" @click="logout">退出登录</a>
  </div>
</template>

<style lang="scss" scoped>
.user-page {
  background-color: var(--cp-bg);
  min-height: calc(100vh - 50px);
  padding: 0 15px 65px;
  // 头部
  &-head {
    height: 200px;
    background: linear-gradient(180deg, rgba(44, 181, 165, 0.46), rgba(44, 181, 165, 0));
    margin: 0 -15px;
    padding: 0 15px;
    .top {
      display: flex;
      padding-top: 50px;
      align-items: center;
      .van-image {
        width: 70px;
        height: 70px;
      }
      .name {
        padding-left: 10px;
        p {
          &:first-child {
            font-size: 18px;
            font-weight: 500;
          }
          &:last-child {
            margin-top: 10px;
            color: var(--cp-primary);
            font-size: 16px;
          }
        }
      }
    }
    .van-row {
      margin: 0 -15px;
      padding-top: 15px;
      p {
        text-align: center;
        &:first-child {
          font-size: 18px;
          font-weight: 500;
        }
        &:last-child {
          color: var(--cp-dark);
          font-size: 12px;
          padding-top: 4px;
        }
      }
    }
  }
  // 订单
  &-order {
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    .head {
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      padding: 0 15px;
      a {
        color: var(--cp-tip);
      }
    }
    .van-col {
      text-align: center;
      .cp-icon {
        font-size: 28px;
      }
      p {
        font-size: 12px;
        padding-top: 4px;
      }
    }
  }
  // 分组（快捷工具）
  &-group {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    h3 {
      padding-left: 16px;
      line-height: 44px;
    }
    .van-cell {
      align-items: center;
    }
    .cp-icon {
      font-size: 17px;
      margin-right: 10px;
    }
  }
}
.logout {
  display: block;
  margin: 20px auto;
  width: 100px;
  text-align: center;
  color: var(--cp-price);
}
</style>
