<script setup lang="ts">
import type { Medical } from '@/types/room'

// 1.0 接收数据
defineProps<{
  medical?: Medical[]
}>()
</script>
<template>
  <div class="order-medical">
    <div class="head">
      <h3>优医药房</h3>
      <small>优医质保 假一赔十</small>
    </div>
    <div class="item van-hairline--top" v-for="i in medical" :key="i.id">
      <img class="img" :src="i.avatar" alt="" />
      <div class="info">
        <p class="name">
          <span>{{ i.name }}</span>
          <span>x{{ i.quantity }}</span>
        </p>
        <p class="size">
          <van-tag>{{ i.prescriptionFlag ? '处方药' : '非处方药' }}</van-tag>
          <span>{{ i.specs }}</span>
        </p>
        <p class="price">￥{{ i.amount }}</p>
      </div>
      <div class="desc">用法用量：{{ i.usageDosag }}</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.order-medical {
  background-color: #fff;
  padding: 0 15px;
  .head {
    display: flex;
    height: 54px;
    align-items: center;
    > h3 {
      font-size: 16px;
      font-weight: normal;
    }
    > small {
      font-size: 13px;
      color: var(--cp-tag);
      margin-left: 10px;
    }
  }
  .item {
    display: flex;
    flex-wrap: wrap;
    padding: 15px 0;
    .img {
      width: 80px;
      height: 70px;
      border-radius: 2px;
      overflow: hidden;
    }
    .info {
      padding-left: 15px;
      width: 250px;
      .name {
        display: flex;
        font-size: 15px;
        margin-bottom: 5px;
        > span:first-child {
          width: 200px;
        }
        > span:last-child {
          width: 50px;
          text-align: right;
        }
      }
      .size {
        margin-bottom: 5px;
        .van-tag {
          background-color: var(--cp-primary);
          vertical-align: middle;
        }
        span:not(.van-tag) {
          margin-left: 10px;
          color: var(--cp-tag);
          vertical-align: middle;
        }
      }
      .price {
        font-size: 16px;
        color: #eb5757;
      }
    }
    .desc {
      width: 100%;
      background-color: var(--cp-bg);
      border-radius: 4px;
      margin-top: 10px;
      padding: 4px 10px;
      color: var(--cp-tip);
    }
  }
}
</style>
