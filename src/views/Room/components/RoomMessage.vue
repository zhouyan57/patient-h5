<script setup lang="ts">
import { MsgType } from '@/enums'
import type { Image } from '@/types/consult'
import type { Message } from '@/types/room'
import { showImagePreview, showToast } from 'vant'
import { useUserStore } from '@/stores'
import dayjs from 'dayjs'
// 1. 接收数据源
defineProps<{
  list: Message[]
}>()

// 2. 预览图片
const imagePreview = (images: Image[] | undefined) => {
  if (!images || images.length === 0) return showToast('暂无图片')
  // 从数据源中将所有的图片提取路径
  const newImages = images.map((item) => item.url)
  // 开启预览
  showImagePreview(newImages)
}

// 3. 修改患病时间 & 是否就诊
// 患病时间选项
const timeOptions = [
  { label: '一周内', value: 1 },
  { label: '一月内', value: 2 },
  { label: '半年内', value: 3 },
  { label: '大于半年', value: 4 }
]
// 是否就诊
const flagOptions = [
  { label: '就诊过', value: 1 },
  { label: '没就诊过', value: 0 }
]
// 根据 value 得到患者的 label
const getTimeLabel = (value: number | undefined) => {
  if (value === undefined) return
  return timeOptions.find((item) => item.value === value)?.label
}
// 根据 value 得到是否就诊的 label
const getFlagLabel = (value: number | undefined) => {
  if (value === undefined) return
  return flagOptions.find((item) => item.value === value)?.label
}

// 4. 处理时间
const FormatTime = (time: string) => {
  return dayjs(time).format('hh:mm')
}

// 5. 获取 store 对象
const userStore = useUserStore()
</script>

<template>
  <div v-for="(item, index) in list" :key="index">
    <!-- 通知 -->
    <div class="msg msg-tip" v-if="item.msgType === MsgType.Notify">
      <div class="content">
        <span>{{ item.msg.content }}</span>
      </div>
    </div>

    <!-- 病情描述 -->
    <div class="msg msg-illness" v-if="item.msgType === MsgType.CardPat">
      <div class="patient van-hairline--bottom">
        <p>
          {{ item.msg.consultRecord?.patientInfo.name }}
          {{ item.msg.consultRecord?.patientInfo.genderValue }}
          {{ item.msg.consultRecord?.patientInfo.age }}岁
        </p>
        <p>
          {{ getTimeLabel(item.msg.consultRecord?.illnessTime) }} |
          {{ getFlagLabel(item.msg.consultRecord?.consultFlag) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ item.msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <van-col span="18" @click="imagePreview(item.msg.consultRecord?.pictures)"
          >点击查看</van-col
        >
      </van-row>
    </div>

    <!-- 温馨提示 -->
    <div class="msg msg-tip" v-if="item.msgType === MsgType.NotifyTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ item.msg.content }}</span>
      </div>
    </div>

    <div v-if="item.msgType === MsgType.MsgText">
      <!-- 发送文字 -->
      <div class="msg msg-to" v-if="item.from === userStore.user?.id">
        <div class="content">
          <div class="time">{{ FormatTime(item.createTime) }}</div>
          <div class="pao">{{ item.msg.content }}</div>
        </div>
        <van-image :src="item.fromAvatar" />
      </div>

      <!-- 接收文字 -->
      <div class="msg msg-from" v-else>
        <van-image
          src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
        />
        <div class="content">
          <div class="time">{{ FormatTime(item.createTime) }}</div>
          <div class="pao">{{ item.msg.content }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ------------------------- -->

  <!-- 发送图片 -->
  <div class="msg msg-to">
    <div class="content">
      <div class="time">20:12</div>
      <van-image
        fit="contain"
        src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg"
      />
    </div>
    <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg" />
  </div>

  <!-- 接收图片 -->
  <div class="msg msg-from">
    <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg" />
    <div class="content">
      <div class="time">20:12</div>
      <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg" />
    </div>
  </div>

  <!-- 处方消息 -->
  <div class="msg msg-recipe">
    <div class="content">
      <div class="head van-hairline--bottom">
        <div class="head-tit">
          <h3>电子处方</h3>
          <p>原始处方 <van-icon name="arrow"></van-icon></p>
        </div>
        <p>李富贵 男 31岁 血管性头痛</p>
        <p>开方时间：2022-01-15 14:21:42</p>
      </div>
      <div class="body">
        <div class="body-item" v-for="i in 2" :key="i">
          <div class="durg">
            <p>优赛明 维生素E乳</p>
            <p>口服，每次1袋，每天3次，用药3天</p>
          </div>
          <div class="num">x1</div>
        </div>
      </div>
      <div class="foot"><span>购买药品</span></div>
    </div>
  </div>

  <!-- 订单取消 -->
  <div class="msg msg-tip msg-tip-cancel">
    <div class="content">
      <span>订单取消</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>
