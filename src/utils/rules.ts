// 设置校验规则
import type { FieldRule } from 'vant'
// 1. 手机号的校验规则
export const mobileRule: FieldRule[] = [
  {
    required: true,
    message: '请输入手机号',
    trigger: 'onBlur'
  },
  { pattern: /^1[3-9]\d{9}$/, message: '手机号不合法', trigger: 'onBlur' }
]
// 2. 密码框的校验规则
export const passwordRule: FieldRule[] = [
  { required: true, message: '请输入密码', trigger: 'onBlur' },
  { pattern: /^\w{8,24}$/, message: '密码长度为8~24', trigger: 'onBlur' }
]
