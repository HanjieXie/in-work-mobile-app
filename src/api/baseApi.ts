import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { MMKV } from 'react-native-mmkv';
import { Config } from '@/constants/config';

// 初始化 MMKV 储存
export const storage = new MMKV();

// 获取Token
const getToken = (): string | undefined => {
  return storage.getString('auth.token');
};

// 自定义 baseQuery 函数, 并将 Token 添加到请求头中添加错误处理
const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: Config.API_BASE_URL,
    prepareHeaders: headers => {
      const token = getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  // 请求拦截器，错误处理
  // 401 未授权
  if (result.error && result.error.status === 401) {
    // 清除 token，跳转到登录页
    storage.delete('auth.token');
    storage.delete('auth.user');
    // TODO:跳转到登录页/退出登录
    
  }
  return result;
};
