<script setup lang="ts">
import { getPatientList, addPatient } from '@/services/user'
import type { Patient } from '@/types/user'
import { showLoadingToast, showSuccessToast, showToast } from 'vant'
import { onMounted, ref } from 'vue'
import IDValidator from 'id-validator'
// 1. 获取患者信息（展示患者）
const patientList = ref<Patient[]>([])
const getDataList = async () => {
  const toast = showLoadingToast('数据加载中...')
  const res = await getPatientList()
  patientList.value = res.data
  toast.close()
}
onMounted(() => {
  getDataList()
})
// 2. 封装单选框组件（提供数据源）
const data = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]
// 选中的值
const gender = ref(0)
// 3. 侧边栏的显示与隐藏
const show = ref(false)
const showPop = () => {
  show.value = true
  // 清空数据源
  patient.value = {
    defaultFlag: 0
  }
}
// 4. 准备表单
const patient = ref<Patient>({})
// 5. 数据校验 & 身份证号的校验 & 添加患者
var Validator = new IDValidator()
const submit = async () => {
  // 校验参数(普通校验)
  if (patient.value.name === undefined) return showToast('请输入姓名')
  if (patient.value.idCard === undefined) return showToast('请输入身份证号')
  if (patient.value.gender === undefined) return showToast('请选择性别')
  // 身份证号校验
  if (!Validator.isValid(patient.value.idCard)) return showToast('身份证号不合法')
  // 核对性别
  const { sex } = Validator.getInfo(patient.value.idCard)
  if (sex !== patient.value.gender) return showToast('身份证号码与性别不匹配')
  // 添加患者
  await addPatient(patient.value)
  // 提示成功
  showSuccessToast('添加成功')
  // 关闭面板
  show.value = false
  // 重新加载数据
  await getDataList()
}
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar title="家庭档案"></cp-nav-bar>
    <div class="patient-list">
      <!-- 成员列表 -->
      <div class="patient-item" v-for="item in patientList" :key="item.id">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{
            item.idCard?.replace(/^(.{6})(?:\d+)(.{4})$/, '\$1********\$2')
          }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon"><cp-icon name="user-edit" /></div>
        <div class="tag" v-if="item.defaultFlag">默认</div>
      </div>
      <!-- 添加患者按钮 -->
      <div @click="showPop" class="patient-add" v-if="patientList.length < 6">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>
    <!-- 侧边栏 -->
    <!-- <van-popup :show="show" @update:show="show = $event" position="right"> -->
    <van-popup v-model:show="show" position="right">
      <!-- 头部组件 -->
      <cp-nav-bar
        title="添加患者"
        rightText="保存"
        @click-right="submit"
        :back="
          () => {
            show = false
          }
        "
      ></cp-nav-bar>
      <!-- 表单结构 -->
      <van-form autocomplete="off">
        <van-field v-model="patient.name" label="真实姓名" placeholder="请输入真实姓名" />
        <van-field v-model="patient.idCard" label="身份证号" placeholder="请输入身份证号" />
        <van-field label="性别">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn v-model="patient.gender" :data="data"></cp-radio-btn>
          </template>
        </van-field>
        {{ patient.defaultFlag }}
        <van-field label="默认就诊人">
          <template #input>
            <!-- <van-checkbox v-model="patient.defaultFlag" round /> -->
            <van-checkbox
              :modelValue="patient.defaultFlag ? true : false"
              @update:modelValue="patient.defaultFlag = $event ? 1 : 0"
              round
            />
          </template>
        </van-field>
      </van-form>
    </van-popup>
  </div>

  <!-- <cp-radio-btn
    :data="data"
    :modelValue="gender"
    @update:modelValue="gender = $event as number"
  ></cp-radio-btn> -->
  <!-- <cp-radio-btn :data="data" v-model="gender"></cp-radio-btn> -->
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  ::v-deep() {
    .van-popup {
      // padding-top: 48px;
      width: 100%;
      height: 100%;
    }
  }
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
</style>
