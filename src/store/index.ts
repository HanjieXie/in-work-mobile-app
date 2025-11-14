// Store 配置
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';

import rootReducer from './rootReducer';
import { baseApi } from '../api/baseApi';

/* 
    TODO: Redux Persist configuration
    用于配置持久化数据的行为
*/
const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth', 'profile', 'settings'], // 需要持久化的reducer
  blacklist: ['todo', 'email', 'message'],  // RTK Query 的 reducer 不需要持久化
};

/* 
    TODO: 创建并配置 Redux Store
*/
export const store = configureStore({
    // 使用 Persist 包装过的 Reducer
    reducer: persistReducer, 
    // 配置中间件
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck:{
                ignoreActions:[FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
        // 添加 RTK Query 的中间件，用于处理 API 请求
        .concat(baseApi.middleware),    
});


/* 
    配置 RTK Query 的 监听器
    用于支持refetchOnFocus 和 refetchOnReconnect 等功能
    
    TODO: 当App重新获得焦点或者网络重新连接时自动获取数据
*/
setupListeners(store.dispatch);


/* 
    TODO: 创建持久化存储实例
    负责将 store 的数据持久化存储到本地中，并在 App 启动时重新加载
*/

export const persistor = persistStore(store);


/* 
    TODO: 类型定义导出
*/

// RootState 类型: 从 Store 中推断整个应用状态类型
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch 类型: 从 Store 中推断出 Dispatch 类型,包含所有的 Action
export type AppDispatch = typeof store.dispatch;
