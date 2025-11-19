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
npm run lint
```

注意：package.json 中的 lint 命令使用 `eslint .`

## 架构设计

### 状态管理

应用使用 **Redux Toolkit** 和 RTK Query 进行状态管理和 API 调用：

- **Store 配置**：`src/store/index.ts` 配置 Redux store，包含 redux-persist 配置
- **根 Reducer**：`src/store/rootReducer.ts`（目前是空文件，需要组合所有 slice reducers）
- **持久化**：persist 配置直接在 `src/store/index.ts` 中实现，使用 AsyncStorage
- **中间件**：`src/store/middleware.ts`（目前是空文件）
- **RTK Query**：`src/api/baseApi.ts` 定义带身份验证的基础 API 配置

**Redux Persist 配置**（在 `src/store/index.ts` 中）：
```typescript
const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth', 'profile', 'settings'], // 需要持久化的 reducer
  blacklist: ['todo', 'email', 'message'],    // RTK Query 的 reducer 不需要持久化
};
```

基础 API（`src/api/baseApi.ts`）自动处理：
- 从 Redux state 的 `auth.token` 读取并添加 Bearer token 身份验证
- 向所有请求注入标准请求头（Content-Type: application/json）
- 定义 tag types：Todos, Emails, Messages, Tools, Profile

API 端点组织在 `src/api/endpoints/` 目录下（目前都是空文件）：
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

- `src/navigation/RootNavigator.tsx` - 根导航容器，包含 NavigationContainer 和认证路由逻辑
- `src/navigation/AppNavigator.tsx` - 主应用导航（目前是空文件）
- `src/navigation/AuthNavigator.tsx` - 认证流程导航（登录、注册）
- `src/navigation/TabNavigator.tsx` - 底部标签导航，包含 5 个标签：
  - TodoTab - 待办事项（使用 TodoNavigator）
  - EmailTab - 邮件（占位符）
  - MessageTab - 消息（占位符）
  - ToolsTab - 工具（占位符）
  - ProfileTab - 个人资料（占位符）
- `src/navigation/types.ts` - TypeScript 导航参数类型定义
- `src/navigation/linking.ts` - 深度链接配置

**导航层级结构**：
```
RootNavigator (Stack)
├── Auth (未认证时)
│   └── AuthNavigator (Stack)
│       ├── Login
│       └── Register
└── App (已认证时)
    └── AppNavigator
        └── TabNavigator (BottomTabs)
            ├── TodoTab
            ├── EmailTab
            ├── MessageTab
            ├── ToolsTab
            └── ProfileTab
```

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

**重要：项目处于早期开发阶段**

- 大多数实现文件目前只包含占位符注释（例如 "// Store 配置"、"// HTTP 客户端"、"// 根 reducer"）
- 项目架构已经设计并搭建完成，但大部分功能尚未实现
- 许多文件只有一行注释，实际实现代码需要补充
- `src/features/` 目录有基础结构（auth, todo），但实现不完整
- `src/components/` 目录只有一个 PlaceholderScreen 组件用于占位
- 所有存储服务文件（mmkvStorage, realmStorage, secureStorage）都是空文件
- 所有工具函数文件都是空文件
- 服务层（API、WebSocket、通知）文件都是空文件

在开发新功能时，需要先实现这些基础服务和工具函数。

## 重要实现细节

### 身份验证流程
身份验证令牌存储在 Redux state 中（通过 redux-persist 持久化到 AsyncStorage）：
- `state.auth.token` - Bearer 令牌
- `state.auth.user` - 用户数据
- `state.auth.isAuthenticated` - 认证状态标志

RTK Query 基础 API（`src/api/baseApi.ts`）在 `prepareHeaders` 中自动：
1. 从 Redux state 读取 token
2. 添加到请求头：`Authorization: Bearer ${token}`
3. 设置 Content-Type 为 application/json

导航流程（`src/navigation/RootNavigator.tsx`）：
- 根据 `state.auth.isAuthenticated` 决定显示 AuthNavigator 还是 AppNavigator
- 未认证时显示登录/注册界面
- 认证后显示主应用界面（底部标签导航）

### Firebase 设置
应用包含 Firebase 用于推送通知。Podfile 包含 Firebase 依赖：
- FirebaseCoreInternal
- GoogleUtilities

### React Native Reanimated
babel 配置中包含 `react-native-reanimated/plugin` 作为 **最后一个插件**（顺序至关重要）。

## 原生依赖

添加需要 iOS 链接的原生依赖时：
1. 通过 npm 添加依赖
2. 在项目根目录运行 `bundle exec pod install`
3. 重新构建 iOS 应用

## 开发工作流程

### 添加新功能的步骤

1. **创建 Feature 目录结构**（在 `src/features/` 下）：
   ```
   src/features/[feature-name]/
   ├── components/      # 功能特定的组件
   ├── screens/         # 屏幕组件
   ├── navigation/      # 功能的导航配置（如果需要）
   ├── slice.ts         # Redux slice（状态管理）
   └── types.ts         # 类型定义
   ```

2. **如果需要 API 调用**：
   - 在 `src/api/endpoints/` 中创建或更新 API 文件
   - 使用 `baseApi.injectEndpoints()` 添加端点
   - 在 `baseApi.ts` 的 tagTypes 中添加新的 tag type

3. **如果需要状态管理**：
   - 在 feature 目录下创建 `slice.ts`
   - 在 `src/store/rootReducer.ts` 中导入并添加到 reducer
   - 更新 `src/store/index.ts` 的 persistConfig（如果需要持久化）

4. **导航集成**：
   - 在相应的 Navigator 中添加新屏幕
   - 在 `src/navigation/types.ts` 中定义导航参数类型

### 实现基础服务的优先级

由于大多数服务文件是空的，建议按以下顺序实现：

1. **存储服务**（优先级：高）
   - `src/services/storage/mmkvStorage.ts` - 用于快速 key-value 存储
   - `src/services/storage/secureStorage.ts` - 用于敏感数据

2. **工具函数**（优先级：高）
   - `src/utils/logger.ts` - 日志记录
   - `src/utils/validation.ts` - 表单验证
   - `src/utils/date.ts` - 日期处理

3. **API 客户端**（优先级：中）
   - `src/services/api/apiClient.ts` - HTTP 客户端（如果不使用 RTK Query）
   - `src/services/api/errorHandler.ts` - 错误处理

4. **其他服务**（优先级：低）
   - WebSocket、通知等根据需要实现

## 已知问题

### RootNavigator 中的拼写错误
`src/navigation/RootNavigator.tsx` 中存在以下拼写错误（需要修复）：
- 第 10 行：`RooNavigator` 应为 `RootNavigator`
- 第 15 行：`srceenOptions` 应为 `screenOptions`
- 第 15 行：`Stack.navigator` 应为 `Stack.Navigator`

### App.tsx 未集成
`App.tsx` 中导入了 RootNavigator 和其他组件，但未在返回的 JSX 中使用。需要集成：
```tsx
return (
  <SafeAreaProvider>
    <PaperProvider theme={theme}>
      <RootNavigator />
    </PaperProvider>
    <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
  </SafeAreaProvider>
);
```

### Redux Store 未连接
App.tsx 缺少 Redux Provider，需要添加：
```tsx
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@store';
```

### Store 配置问题
`src/store/index.ts` 第 37 行使用了 `persistReducer` 但应该使用 `persistReducer(persistConfig, rootReducer)`。需要：
1. 确保 `rootReducer.ts` 正确导出 root reducer
2. 修正 store 配置中的 reducer 配置
