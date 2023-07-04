<script setup lang="ts">
import { getLogistics } from '@/services/order'
import type { Logistics } from '@/types/order'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AMapLoader from '@amap/amap-jsapi-loader'
import startImg from '@/assets/start.png'
import endImg from '@/assets/end.png'
import carImg from '@/assets/car.png'

// 1. 获取物流信息
const route = useRoute()
const orderId = route.params.id
const logisticsInfo = ref<Logistics>()
onMounted(async () => {
  const res = await getLogistics(orderId as string)
  logisticsInfo.value = res.data
})

// 2. 初始化高德地图
window._AMapSecurityConfig = {
  securityJsCode: '2a07402e3a5996d80c57c9ab0cd3d75c'
}
onMounted(async () => {
  AMapLoader.load({
    key: '9c647d09cdb1aca0eec48d143796ab25',
    version: '2.0'
  }).then((AMap) => {
    // 初始化地图
    const map = new AMap.Map('map', {
      mapStyle: 'amap://styles/normal',
      zoom: 12
    })
    // 绘制轨迹
    AMap.plugin('AMap.Driving', () => {
      const driving = new AMap.Driving({
        map: map,
        showTraffic: false, // 关闭实时路况
        hideMarkers: true // 关闭默认标识
      })
      // 设置起点
      const start = logisticsInfo.value?.logisticsInfo.shift()
      // 设置终点
      const end = logisticsInfo.value?.logisticsInfo.pop()
      // 设置途径点
      const wayPoint = logisticsInfo.value?.logisticsInfo.map((item) => {
        return [item.longitude, item.latitude]
      })
      // 添加标记
      // 起点标识
      const startMark = new AMap.Marker({
        icon: startImg,
        position: [start?.longitude, start?.latitude],
        anchor: 'bottom-center'
      })
      map.add(startMark)
      // 终点标识
      const endMark = new AMap.Marker({
        icon: endImg,
        position: [end?.longitude, end?.latitude],
        anchor: 'bottom-center'
      })
      map.add(endMark)
      driving.search(
        [start?.longitude, start?.latitude],
        [end?.longitude, end?.latitude],
        { waypoints: wayPoint },
        () => {
          // 当路径绘制完毕之后，再绘制快递所在的位置
          const current = logisticsInfo.value?.currentLocationInfo
          // 开始绘制标记
          const currentMark = new AMap.Marker({
            icon: carImg,
            position: [current?.longitude, current?.latitude],
            anchor: 'bottom-center'
          })
          map.add(currentMark)
          setTimeout(() => {
            map.setFitView([currentMark])
            map.setZoom(15)
          }, 3000)
        }
      )
    })
  })
})
</script>

<template>
  <div class="order-logistics-page">
    <div id="map">
      <div class="title">
        <van-icon name="arrow-left" @click="$router.back()" />
        <span>{{ logisticsInfo?.statusValue }}</span>
        <van-icon name="service" />
      </div>
      <div class="current">
        <p class="status">
          订单{{ logisticsInfo?.statusValue }}
          <span v-if="logisticsInfo?.status !== 5">预计{{ logisticsInfo?.estimatedTime }}送达</span>
        </p>
        <p class="predict">
          <span>{{ logisticsInfo?.name }}</span>
          <span>{{ logisticsInfo?.awbNo }}</span>
        </p>
      </div>
    </div>
    <div class="logistics">
      <p class="title">物流详情</p>
      <van-steps direction="vertical" :active="0">
        <van-step v-for="i in logisticsInfo?.list" :key="i.id">
          <p class="status">{{ i.statusValue }}</p>
          <p class="content">{{ i.content }}</p>
          <p class="time">{{ i.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-logistics-page {
  --van-step-icon-size: 18px;
  --van-step-circle-size: 10px;
}
#map {
  height: 450px;
  background-color: var(--cp-bg);
  overflow: hidden;
  position: relative;
  .title {
    background-color: #fff;
    height: 46px;
    width: 355px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 16px;
    position: absolute;
    left: 10px;
    top: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    > span {
      flex: 1;
      text-align: center;
    }
    .van-icon {
      font-size: 18px;
      color: #666;
      &:last-child {
        color: var(--cp-primary);
      }
    }
  }
  .current {
    height: 80px;
    border-radius: 4px;
    background-color: #fff;
    height: 80px;
    width: 355px;
    box-sizing: border-box;
    padding: 15px;
    position: absolute;
    left: 10px;
    bottom: 10px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    .status {
      font-size: 15px;
      line-height: 26px;
    }
    .predict {
      color: var(--cp-tip);
      font-size: 13px;
      margin-top: 5px;
      > span {
        padding-right: 10px;
      }
    }
  }
}
.logistics {
  padding: 0 10px 20px;
  .title {
    font-size: 16px;
    padding: 15px 5px 5px;
  }
  .van-steps {
    :deep(.van-step) {
      &::after {
        display: none;
      }
    }
    .status {
      font-size: 15px;
      color: var(--cp-text3);
      margin-bottom: 4px;
    }
    .content {
      font-size: 13px;
      color: var(--cp-tip);
      margin-bottom: 4px;
    }
    .time {
      font-size: 13px;
      color: var(--cp-tag);
    }
  }
}
</style>
