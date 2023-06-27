<script setup lang="ts">
import { showToast } from 'vant'
import { UploaderAfterRead } from 'vant/lib/uploader/types'
import { ref } from 'vue'
import { updateFile } from '@/services/consult'

// 1. 接收数据
defineProps<{
  disabled: boolean
}>()
// 2. 发送消息
const emit = defineEmits<{
  (e: 'send-text', v: string): void
  (e: 'send-img', img: { id: string; url: string }): void
}>()
const value = ref('')
const submit = () => {
  // 将输入框中的内容提交到 room 中
  if (!value.value || value.value.trim() === '') return showToast('内容不能为空')
  // 返回数据
  emit('send-text', value.value)
  // 清除输入框
  value.value = ''
}
// 3. 发送图片
const afterRead: UploaderAfterRead = async (item) => {
  // 排除数组情况
  if (Array.isArray(item)) return
  // 判断图片是否为空
  if (!item.file) return
  // 上传图片到服务器
  const res = await updateFile(item.file)
  emit('send-img', res.data)
}
</script>

<template>
  <div class="room-action">
    <van-field
      v-model="value"
      @keyup.enter="submit"
      type="text"
      class="input"
      :border="false"
      placeholder="问医生"
      autocomplete="off"
      :disabled="disabled"
    ></van-field>
    <van-uploader :after-read="afterRead" :preview-image="false">
      <cp-icon name="consult-img" />
    </van-uploader>
  </div>
</template>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
