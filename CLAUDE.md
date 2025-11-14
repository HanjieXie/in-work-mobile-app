# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 角色：一名资深的React Native项目设计架构师兼开发者，拥有非常丰富的React Native项目设计架构开发经验。
## 语言偏好：中文

在此代码库中工作时，请使用中文进行交流和文档编写。

## 项目概述

这是一个使用 TypeScript 构建的 React Native 移动应用（WorkEfficiencyApp），目标平台为 iOS 和 Android。该应用是一个工作效率工具，功能包括用户管理、邮件、待办事项、消息传递，以及通过 WebSocket 实现的实时通信。

## 开发命令

### 运行应用

```bash
# 启动 Metro 打包工具
npm start

# 在 Android 上运行
npm run android

# 在 iOS 上运行（需要 macOS）
npm run ios
```

### iOS 特定设置

iOS 开发需要安装 CocoaPods 依赖：

```bash
# 首次设置 - 安装 Ruby bundler 依赖
bundle install

# 安装/更新 CocoaPods 依赖（更新原生依赖后运行）
bundle exec pod install
```

### 测试和代码质量

```bash
# 运行测试
npm test

# 运行代码检查
npm lint
```

## 架构设计

### 状态管理

应用使用 **Redux Toolkit** 和 RTK Query 进行状态管理和 API 调用：

- **Store 配置**：`src/store/index.ts` 配置 Redux store
- **根 Reducer**：`src/store/rootReducer.ts` 组合所有 slice reducers
- **持久化**：`src/store/persistConfig.ts` 配置 redux-persist 实现状态持久化
- **中间件**：`src/store/middleware.ts` 包含自定义 Redux 中间件
- **RTK Query**：`src/api/baseApi.ts` 定义带身份验证的基础 API 配置

基础 API（`src/api/baseApi.ts`）自动处理：
- 从 MMKV 存储添加 Bearer token 身份验证
- 处理 401 错误并清除认证令牌
- 向所有请求注入标准请求头

API 端点组织在 `src/api/endpoints/` 目录下：
- `userApi.ts` - 用户认证和个人资料
- `emailApi.ts` - 邮件功能
- `todoApi.ts` - 待办事项/任务管理
- `toolsApi.ts` - 实用工具
- `messageApi.ts` - 消息功能

### 存储方案

应用针对不同用途使用 **三种不同的存储机制**：

1. **MMKV**（`src/services/storage/mmkvStorage.ts`）：快速键值存储，用于简单数据和令牌
2. **Realm**（`src/services/storage/realmStorage.ts`）：本地数据库，用于复杂数据结构
3. **Secure Storage**（`src/services/storage/secureStorage.ts`）：加密存储，用于敏感数据

### 导航系统

导航使用 **React Navigation v7** 实现：

- `src/navigation/RootNavigator.tsx` - 根导航容器
- `src/navigation/AppNavigator.tsx` - 主应用导航
- `src/navigation/AuthNavigator.tsx` - 认证流程导航
- `src/navigation/TabNavigator.tsx` - 底部标签导航
- `src/navigation/types.ts` - TypeScript 导航类型定义
- `src/navigation/linking.ts` - 深度链接配置

### 服务层

#### API 客户端
- `src/services/api/apiClient.ts` - HTTP 客户端配置
- `src/services/api/interceptors.ts` - 请求/响应拦截器
- `src/services/api/errorHandler.ts` - 集中错误处理

#### WebSocket 通信
- `src/services/websocket/socketClient.ts` - Socket.io 客户端设置
- `src/services/websocket/socketHandler.ts` - WebSocket 事件处理器

#### 通知系统
- `src/services/notification/pushNotification.ts` - Firebase 推送通知
- `src/services/notification/localNotification.ts` - 通过 Notifee 实现本地通知
- `src/services/notification/notificationHandler.ts` - 通知事件处理

#### 分析服务
- `src/services/analytics/analyticsServices.ts` - 分析跟踪服务

### 路径别名

项目在 `tsconfig.json` 和 `babel.config.js` 中配置了路径别名：

```typescript
@/* → src/*
@components/* → src/components/*
@features/* → src/features/*
@services/* → src/services/*
@utils/* → src/utils/*
@hooks/* → src/hooks/*
@navigation/* → src/navigation/*
@assets/* → src/assets/*
@theme/* → src/theme/*
@types/* → src/types/*
```

始终使用这些别名而不是相对导入，以提高可维护性。

### 环境配置

应用使用 **react-native-config** 进行环境管理：

- `.env.development` - 开发环境
- `.env.production` - 生产环境
- `.env` - 本地覆盖（已添加到 .gitignore）

通过 `src/config/env.ts` 和 `src/constants/config.ts` 访问环境变量。

环境变量结构示例：
```
API_BASE_URL=https://dev-api.workplace.com
WEBSOCKET_URL=wss://dev-ws.workplace.com
```

### 主题系统

集中式主题管理位于 `src/theme/` 目录：
- `colors.ts` - 调色板
- `typography.ts` - 字体样式和大小
- `spacing.ts` - 间距比例
- `shadows.ts` - 阴影定义
- `index.ts` - 主题导出

### 自定义 Hooks

可复用的 hooks 位于 `src/hooks/` 目录：
- `useAppDispatch.ts` - 类型化的 Redux dispatch hook
- `useAppSelector.ts` - 类型化的 Redux selector hook
- `useDebounce.ts` - 防抖值
- `useThrottle.ts` - 节流函数
- `useKeyboard.ts` - 键盘状态跟踪
- `useOrientation.ts` - 设备方向检测

### 工具函数

常用工具函数位于 `src/utils/` 目录：
- `date.ts` - 日期格式化和操作（使用 date-fns/dayjs）
- `format.ts` - 数据格式化工具
- `validation.ts` - 输入验证（使用 Yup/Zod）
- `string.ts` - 字符串操作
- `array.ts` - 数组工具
- `logger.ts` - 日志工具

### 类型定义

TypeScript 类型定义位于 `src/types/` 目录：
- `common.ts` - 共享通用类型
- `api.ts` - API 请求/响应类型
- `navigation.ts` - 导航参数类型

## 核心依赖

### 核心技术栈
- **React Native 0.82.1** 搭配 **React 19.1.1**
- **TypeScript 5.9.3**（启用严格模式）

### 状态与数据
- **Redux Toolkit** 搭配 RTK Query 用于 API 调用
- **TanStack Query**（React Query）用于额外的数据获取
- **redux-persist** 用于状态持久化

### 表单与验证
- **react-hook-form** 搭配 **@hookform/resolvers**
- **Yup** 和 **Zod** 用于模式验证

### 存储
- **MMKV** - 快速键值存储
- **Realm** - 本地数据库
- **AsyncStorage** - 传统异步存储

### 实时通信与网络
- **Socket.io Client** 用于 WebSocket 连接
- **Axios** 用于 HTTP 请求

### UI 库
- **React Native Paper** - Material Design 组件
- **React Native Vector Icons** - 图标库
- **React Native Reanimated** - 高级动画
- **React Native Gesture Handler** - 触摸手势处理

### Firebase
- **@react-native-firebase/app** - Firebase 核心
- **@react-native-firebase/messaging** - 推送通知

### 通知
- **@notifee/react-native** - 本地通知处理

### 国际化
- **i18next** 搭配 **react-i18next** 实现翻译

## 代码结构说明

- 大多数实现文件目前包含占位符注释（例如 "// Store 配置"、"// HTTP 客户端"）
- 项目结构已搭建完成，但功能处于早期开发阶段
- `src/features/` 目录存在但目前为空
- `src/components/` 目录存在但目前为空

## 重要实现细节

### 身份验证流程
身份验证令牌存储在 MMKV 存储中，使用以下键：
- `auth.token` - Bearer 令牌
- `auth.user` - 用户数据

RTK Query 基础 API 自动处理令牌注入和 401 登出。

### Firebase 设置
应用包含 Firebase 用于推送通知。Podfile 包含 Firebase 依赖：
- FirebaseCoreInternal
- GoogleUtilities

### React Native Reanimated
babel 配置中包含 `react-native-reanimated/plugin` 作为 **最后一个插件**（顺序至关重要）。

## 原生依赖

添加需要 iOS 链接的原生依赖时：
1. 通过 npm/yarn 添加依赖
2. 在项目根目录运行 `bundle exec pod install`
3. 重新构建 iOS 应用
