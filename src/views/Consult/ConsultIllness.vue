<script setup lang="ts">
import type { Illness } from '@/types/consult'
import { showConfirmDialog, showToast, type UploaderFileListItem } from 'vant'
import { computed, ref } from 'vue'
import { updateFile } from '@/services/consult'
import type { UploaderAfterRead } from 'vant/lib/uploader/types'
import { useConsultStore } from '@/stores'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 1. 渲染结构
// 表单数据源
const form = ref<Illness>({
  pictures: []
})
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
// 2. 预览图片
const fileList = ref<UploaderFileListItem[]>([])
// 3. 上传图片
const afterRead: UploaderAfterRead = async (items) => {
  // 排除图片为数组的情况
  if (Array.isArray(items)) return
  if (!items.file) return
  // 设置加载状态
  items.status = 'uploading'
  items.message = '上传中...'
  setTimeout(async () => {
    // 上传图片
    const res = await updateFile(items.file!)
    items.url = res.data.url
    // 保存上传图片的信息到 form 中的 pictures 中
    form.value.pictures?.push(res.data)
    // 设置完成状态
    items.status = 'done'
    items.message = '完成上传'
  }, 2000)
}
// 4. 删除图片
const deleteImg: UploaderAfterRead = (items) => {
  // 删除 pictures 中对应的图片
  if (Array.isArray(items)) return
  if (!items.url) return
  form.value.pictures = form.value.pictures?.filter((item) => item.url !== items.url)
}
// 5. 保存数据
const router = useRouter()
const store = useConsultStore()
const next = () => {
  // 判断数据合法性
  if (form.value.illnessDesc?.trim() === '') return showToast('病情描述不能为空')
  store.setIllness(form.value)
  // 把图片保存到本地
  localStorage.setItem('fileList', JSON.stringify(fileList.value))
  // 跳转到选择患者页面
  router.push('/user/patient?isChange=1')
}
const disabled = computed(() => {
  return (
    form.value.illnessDesc === undefined ||
    form.value.illnessTime === undefined ||
    form.value.consultFlag === undefined
  )
})
// 6. 数据回显
onMounted(async () => {
  // 判断 pinia 中的 consult 模块是否存在数据
  if (store.consult.illnessDesc) {
    // 询问用户是否回显
    await showConfirmDialog({
      title: '温馨提示',
      message: '是否恢复您之前填写的病情信息呢？',
      closeOnPopstate: false
    })
    // 取出数据
    form.value = {
      illnessDesc: store.consult.illnessDesc,
      illnessTime: store.consult.illnessTime,
      consultFlag: store.consult.consultFlag,
      pictures: store.consult.pictures
    }
    fileList.value = JSON.parse(localStorage.getItem('fileList') || '[]')
  }
})
</script>

<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="图文问诊" />
    <!-- 医生提示 -->
    <div class="illness-tip van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助</p>
        <p class="safe"><cp-icon name="consult-safe" /><span>内容仅医生可见</span></p>
      </div>
    </div>
    <!-- 表单 -->
    <div class="illness-form">
      <!-- 病情描述 -->
      <van-field
        type="textarea"
        rows="3"
        placeholder="请详细描述您的病情，病情描述不能为空"
        v-model="form.illnessDesc"
      ></van-field>
      <!-- 患病时间 -->
      <div class="item">
        <p>本次患病多久了？</p>
        <cp-radio-btn :data="timeOptions" v-model="form.illnessTime" />
      </div>
      <!-- 是否就诊 -->
      <div class="item">
        <p>此次病情是否去医院就诊过？</p>
        <cp-radio-btn :data="flagOptions" v-model="form.consultFlag" />
      </div>
      <!-- 上传结构 -->
      <div class="illness-img">
        <van-uploader
          v-model="fileList"
          :after-read="afterRead"
          @delete="deleteImg"
          upload-icon="photo-o"
          upload-text="上传图片"
          :max-count="3"
          :max-size="5 * 1024 * 1024"
        />
        <p class="tip" v-if="fileList.length <= 0">上传内容仅医生可见,最多9张图,最大5MB</p>
      </div>
      <!-- 下一步按钮 -->
      <van-button :class="{ disabled: disabled }" @click="next" type="primary" block round>
        下一步
      </van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// .consult-illness-page {
//   padding-top: 46px;
// }
.illness-tip {
  display: flex;
  padding: 15px;
  .img {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 10px;
  }
  .info {
    flex: 1;
    padding-left: 12px;
    .tit {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .tip {
      padding: 12px;
      background: var(--cp-bg);
      color: var(--cp-text3);
      font-size: 13px;
      margin-bottom: 10px;
    }
    .safe {
      font-size: 10px;
      color: var(--cp-text3);
      display: flex;
      align-items: center;
      .cp-icon {
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }
}
.illness-form {
  padding: 15px;
  .van-field {
    padding: 0;
    &::after {
      border-bottom: none;
    }
  }
  .item {
    > p {
      color: var(--cp-text3);
      padding: 15px 0;
    }
  }
}
.illness-img {
  padding-top: 16px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  .tip {
    font-size: 12px;
    color: var(--cp-tip);
  }
  ::v-deep() {
    .van-uploader {
      &__preview {
        &-delete {
          left: -6px;
          top: -6px;
          border-radius: 50%;
          background-color: var(--cp-primary);
          width: 20px;
          height: 20px;
          &-icon {
            transform: scale(0.9) translate(-22%, 22%);
          }
        }
        &-image {
          border-radius: 8px;
          overflow: hidden;
        }
      }
      &__upload {
        border-radius: 8px;
      }
      &__upload-icon {
        color: var(--cp-text3);
      }
    }
  }
}
.van-button {
  font-size: 16px;
  margin-bottom: 30px;
  &.disabled {
    opacity: 1;
    background: #fafafa;
    color: #d9dbde;
    border: #fafafa;
  }
}
</style>
