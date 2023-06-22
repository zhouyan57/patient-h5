// 封装首页相关的网络请求
import { request } from '@/utils/request'
import type { KnowledgeParams, KnowledgePage } from '@/types/consult'
// 1. 首页-查询推荐/减脂/饮食健康/关注页面--百科文章列表
export const getKnowledgeList = (params: KnowledgeParams) =>
  request<KnowledgePage>('/patient/home/knowledge', 'GET', params)
