# Workplace Productivity App - React Native 架构设计文档

## 📋 目录
1. [项目概述](#项目概述)
2. [需求分析](#需求分析)
3. [技术栈选型](#技术栈选型)
4. [项目架构设计](#项目架构设计)
5. [目录结构设计](#目录结构设计)
6. [核心模块设计](#核心模块设计)
7. [状态管理方案](#状态管理方案)
8. [导航架构设计](#导航架构设计)
9. [API接口设计](#api接口设计)
10. [数据持久化方案](#数据持久化方案)
11. [推送通知方案](#推送通知方案)
12. [性能优化策略](#性能优化策略)
13. [项目搭建步骤](#项目搭建步骤)

---

## 项目概述

### App定位
工作效率提升工具，为用户提供一站式工作管理解决方案，整合待办事项、邮件、消息、工具集和个人信息管理。

### 核心价值
- 统一的工作流管理平台
- 实时消息和提醒通知
- 高效的任务和时间管理
- 个性化工具集成

---

## 需求分析

### 功能模块矩阵

| 模块 | 核心功能 | 技术挑战 | 优先级 |
|------|---------|---------|--------|
| **To Do** | 日历、待办列表、工作回顾、提醒 | 日历UI、本地提醒、数据同步 | P0 |
| **Email** | 邮件收发、日程管理、提醒 | 邮件协议集成、富文本编辑 | P0 |
| **Message** | 消息收发、实时通知 | WebSocket、推送通知 | P0 |
| **Tools** | 工具集合、分享、下载 | 动态加载、权限管理 | P1 |
| **Profile** | 个人信息、设置 | 数据安全、多账户支持 | P1 |

### 非功能性需求
- **性能**：启动时间 < 2s，页面切换流畅(60fps)
- **可靠性**：离线可用，数据同步机制
- **安全性**：数据加密、Token刷新、敏感信息保护
- **可扩展性**：模块化设计、插件化架构
- **可维护性**：清晰的代码结构、完善的文档

---

## 技术栈选型

### 核心技术栈

```typescript
// 基础框架
React Native: 0.74+           // 核心框架
TypeScript: 5.0+              // 类型安全

// 导航
@react-navigation/native: 6.x // 导航框架
@react-navigation/bottom-tabs // 底部导航
@react-navigation/stack       // 栈导航
@react-navigation/drawer      // 抽屉导航

// 状态管理
Redux Toolkit: 2.0+           // 状态管理
RTK Query                     // API请求和缓存
Redux Persist                 // 状态持久化

// UI组件库
React Native Paper: 5.x       // Material Design组件
React Native Vector Icons     // 图标库
React Native Gesture Handler  // 手势处理
React Native Reanimated: 3.x  // 动画库

// 日历和日期
React Native Calendars        // 日历组件
Day.js                        // 日期处理

// 表单处理
React Hook Form               // 表单管理
Yup / Zod                     // 表单验证

// 本地存储
AsyncStorage                  // 键值存储
MMKV                          // 高性能KV存储
Realm / WatermelonDB          // 本地数据库

// 网络请求
Axios                         // HTTP客户端
Socket.io-client              // WebSocket

// 推送通知
@react-native-firebase/messaging  // FCM推送
@notifee/react-native         // 本地通知

// 工具库
React Native MMKV             // 快速存储
React Native Device Info      // 设备信息
React Native Permissions      // 权限管理
React Native Share            // 分享功能
React Native Document Picker  // 文件选择
```

### 技术选型理由

#### 1. Redux Toolkit + RTK Query
- **优势**：开箱即用的最佳实践、自动缓存、乐观更新
- **适用场景**：复杂状态管理、API请求、跨模块数据共享
- **替代方案**：Zustand(轻量级)、MobX(响应式)

#### 2. React Navigation
- **优势**：社区标准、性能优秀、深度链接支持
- **适用场景**：复杂导航结构、多层级页面
- **替代方案**：React Native Navigation(原生性能更好)

#### 3. React Native Paper
- **优势**：Material Design、主题系统、无障碍支持
- **适用场景**：企业级应用、快速开发
- **替代方案**：NativeBase、Tamagui

#### 4. MMKV / Realm
- **MMKV优势**：极快的读写速度、简单的KV存储
- **Realm优势**：关系型数据、复杂查询、数据同步
- **使用场景**：MMKV存Token等简单数据，Realm存复杂业务数据

---

## 项目架构设计

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        Presentation Layer                    │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │  To Do   │  Email   │ Message  │  Tools   │ Profile  │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
│         ▲          ▲          ▲          ▲          ▲       │
└─────────┼──────────┼──────────┼──────────┼──────────┼───────┘
          │          │          │          │          │
┌─────────┴──────────┴──────────┴──────────┴──────────┴───────┐
│                      Business Logic Layer                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Redux Store (RTK)                     │ │
│  │  ┌──────┬────────┬─────────┬───────┬─────────────┐   │ │
│  │  │ Todo │ Email  │ Message │ Tools │   Profile   │   │ │
│  │  └──────┴────────┴─────────┴───────┴─────────────┘   │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Services Layer                      │ │
│  │  • API Service    • Auth Service   • Notification    │ │
│  │  • Storage Service • WebSocket    • Analytics        │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
          │          │          │          │          │
┌─────────┴──────────┴──────────┴──────────┴──────────┴───────┐
│                      Data Access Layer                        │
│  ┌──────────┬────────────┬──────────────┬─────────────────┐ │
│  │   RTK    │   Realm    │  AsyncStorage│   SecureStore   │ │
│  │  Query   │  Database  │     MMKV     │                 │ │
│  └──────────┴────────────┴──────────────┴─────────────────┘ │
└───────────────────────────────────────────────────────────────┘
          │          │          │          │
┌─────────┴──────────┴──────────┴──────────┴───────────────────┐
│                    External Services                          │
│  • REST API  • WebSocket  • Push Notification  • Analytics   │
└───────────────────────────────────────────────────────────────┘
```

### 架构分层说明

#### 1. **Presentation Layer (表现层)**
- **职责**：UI展示、用户交互、页面导航
- **组件类型**：
  - Screen Components: 页面级组件
  - Feature Components: 功能组件
  - Common Components: 通用组件
  - Layout Components: 布局组件

#### 2. **Business Logic Layer (业务逻辑层)**
- **职责**：状态管理、业务规则、数据转换
- **核心模块**：
  - Redux Slices: 模块化状态管理
  - RTK Query APIs: API定义和缓存
  - Custom Hooks: 业务逻辑封装
  - Utils & Helpers: 工具函数

#### 3. **Data Access Layer (数据访问层)**
- **职责**：数据持久化、缓存管理
- **存储方案**：
  - RTK Query: API数据缓存
  - Realm: 结构化数据存储
  - MMKV: 高性能KV存储
  - SecureStore: 敏感数据加密存储

#### 4. **External Services (外部服务层)**
- **职责**：与外部系统交互
- **服务类型**：
  - REST API: 后端接口
  - WebSocket: 实时通信
  - Push Notification: 消息推送
  - Analytics: 数据分析

---

## 目录结构设计

```
WorkplaceApp/
├── android/                      # Android原生代码
├── ios/                          # iOS原生代码
├── src/
│   ├── api/                      # API接口定义
│   │   ├── endpoints/            # RTK Query端点
│   │   │   ├── todoApi.ts
│   │   │   ├── emailApi.ts
│   │   │   ├── messageApi.ts
│   │   │   ├── toolsApi.ts
│   │   │   └── userApi.ts
│   │   ├── config.ts             # API配置
│   │   └── baseApi.ts            # RTK Query基础配置
│   │
│   ├── assets/                   # 静态资源
│   │   ├── fonts/                # 字体文件
│   │   ├── images/               # 图片资源
│   │   ├── animations/           # 动画文件
│   │   └── icons/                # 图标资源
│   │
│   ├── components/               # 通用组件
│   │   ├── common/               # 基础通用组件
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Avatar/
│   │   │   ├── Badge/
│   │   │   └── LoadingSpinner/
│   │   ├── layout/               # 布局组件
│   │   │   ├── Container/
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   └── SafeAreaWrapper/
│   │   └── feedback/             # 反馈组件
│   │       ├── Toast/
│   │       ├── Modal/
│   │       ├── Alert/
│   │       └── EmptyState/
│   │
│   ├── features/                 # 功能模块(按业务划分)
│   │   ├── todo/                 # To Do模块
│   │   │   ├── screens/          # 页面
│   │   │   │   ├── TodoListScreen.tsx
│   │   │   │   ├── TodoDetailScreen.tsx
│   │   │   │   ├── TodoCalendarScreen.tsx
│   │   │   │   └── TodoReviewScreen.tsx
│   │   │   ├── components/       # 模块专属组件
│   │   │   │   ├── TodoItem/
│   │   │   │   ├── TodoFilter/
│   │   │   │   ├── Calendar/
│   │   │   │   └── ReviewCard/
│   │   │   ├── hooks/            # 模块Hooks
│   │   │   │   ├── useTodoList.ts
│   │   │   │   ├── useTodoFilter.ts
│   │   │   │   └── useTodoReminder.ts
│   │   │   ├── store/            # 模块状态
│   │   │   │   ├── todoSlice.ts
│   │   │   │   └── todoSelectors.ts
│   │   │   ├── types/            # 类型定义
│   │   │   │   └── todo.types.ts
│   │   │   └── utils/            # 工具函数
│   │   │       └── todoHelpers.ts
│   │   │
│   │   ├── email/                # Email模块
│   │   │   ├── screens/
│   │   │   │   ├── EmailListScreen.tsx
│   │   │   │   ├── EmailDetailScreen.tsx
│   │   │   │   ├── EmailComposeScreen.tsx
│   │   │   │   └── CalendarScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── EmailItem/
│   │   │   │   ├── EmailEditor/
│   │   │   │   ├── CalendarView/
│   │   │   │   └── EventCard/
│   │   │   ├── hooks/
│   │   │   │   ├── useEmailList.ts
│   │   │   │   ├── useEmailCompose.ts
│   │   │   │   └── useCalendar.ts
│   │   │   ├── store/
│   │   │   │   ├── emailSlice.ts
│   │   │   │   └── calendarSlice.ts
│   │   │   └── types/
│   │   │       └── email.types.ts
│   │   │
│   │   ├── message/              # Message模块
│   │   │   ├── screens/
│   │   │   │   ├── MessageListScreen.tsx
│   │   │   │   └── ChatScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── MessageItem/
│   │   │   │   ├── ChatBubble/
│   │   │   │   └── MessageInput/
│   │   │   ├── hooks/
│   │   │   │   ├── useMessageList.ts
│   │   │   │   └── useChat.ts
│   │   │   ├── store/
│   │   │   │   └── messageSlice.ts
│   │   │   └── types/
│   │   │       └── message.types.ts
│   │   │
│   │   ├── tools/                # Tools模块
│   │   │   ├── screens/
│   │   │   │   ├── ToolsListScreen.tsx
│   │   │   │   └── ToolDetailScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── ToolCard/
│   │   │   │   └── ToolGrid/
│   │   │   ├── hooks/
│   │   │   │   └── useTools.ts
│   │   │   ├── store/
│   │   │   │   └── toolsSlice.ts
│   │   │   └── types/
│   │   │       └── tools.types.ts
│   │   │
│   │   ├── profile/              # Profile模块
│   │   │   ├── screens/
│   │   │   │   ├── ProfileScreen.tsx
│   │   │   │   ├── EditProfileScreen.tsx
│   │   │   │   └── SettingsScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── ProfileHeader/
│   │   │   │   ├── SettingItem/
│   │   │   │   └── ProfileForm/
│   │   │   ├── hooks/
│   │   │   │   └── useProfile.ts
│   │   │   ├── store/
│   │   │   │   └── profileSlice.ts
│   │   │   └── types/
│   │   │       └── profile.types.ts
│   │   │
│   │   └── auth/                 # 认证模块
│   │       ├── screens/
│   │       │   ├── LoginScreen.tsx
│   │       │   ├── RegisterScreen.tsx
│   │       │   └── ForgotPasswordScreen.tsx
│   │       ├── components/
│   │       │   ├── AuthForm/
│   │       │   └── SocialLogin/
│   │       ├── hooks/
│   │       │   └── useAuth.ts
│   │       ├── store/
│   │       │   └── authSlice.ts
│   │       └── types/
│   │           └── auth.types.ts
│   │
│   ├── navigation/               # 导航配置
│   │   ├── types.ts              # 导航类型定义
│   │   ├── RootNavigator.tsx     # 根导航
│   │   ├── AppNavigator.tsx      # 应用导航
│   │   ├── AuthNavigator.tsx     # 认证导航
│   │   ├── TabNavigator.tsx      # Tab导航
│   │   └── linking.ts            # 深度链接配置
│   │
│   ├── services/                 # 服务层
│   │   ├── api/                  # API服务
│   │   │   ├── apiClient.ts      # HTTP客户端
│   │   │   ├── interceptors.ts   # 请求拦截器
│   │   │   └── errorHandler.ts   # 错误处理
│   │   ├── storage/              # 存储服务
│   │   │   ├── mmkvStorage.ts    # MMKV存储
│   │   │   ├── realmStorage.ts   # Realm数据库
│   │   │   └── secureStorage.ts  # 安全存储
│   │   ├── notification/         # 通知服务
│   │   │   ├── pushNotification.ts
│   │   │   ├── localNotification.ts
│   │   │   └── notificationHandler.ts
│   │   ├── websocket/            # WebSocket服务
│   │   │   ├── socketClient.ts
│   │   │   └── socketHandlers.ts
│   │   └── analytics/            # 分析服务
│   │       └── analyticsService.ts
│   │
│   ├── store/                    # Redux Store
│   │   ├── index.ts              # Store配置
│   │   ├── rootReducer.ts        # 根Reducer
│   │   ├── middleware.ts         # 中间件
│   │   └── persistConfig.ts      # 持久化配置
│   │
│   ├── hooks/                    # 全局Hooks
│   │   ├── useAppDispatch.ts
│   │   ├── useAppSelector.ts
│   │   ├── useDebounce.ts
│   │   ├── useThrottle.ts
│   │   ├── useKeyboard.ts
│   │   └── useOrientation.ts
│   │
│   ├── utils/                    # 工具函数
│   │   ├── date.ts               # 日期处理
│   │   ├── format.ts             # 格式化
│   │   ├── validation.ts         # 验证
│   │   ├── string.ts             # 字符串处理
│   │   ├── array.ts              # 数组处理
│   │   └── logger.ts             # 日志工具
│   │
│   ├── constants/                # 常量定义
│   │   ├── colors.ts             # 颜色常量
│   │   ├── sizes.ts              # 尺寸常量
│   │   ├── api.ts                # API常量
│   │   ├── storage.ts            # 存储键常量
│   │   └── config.ts             # 配置常量
│   │
│   ├── theme/                    # 主题配置
│   │   ├── index.ts              # 主题入口
│   │   ├── colors.ts             # 颜色配置
│   │   ├── typography.ts         # 字体配置
│   │   ├── spacing.ts            # 间距配置
│   │   └── shadows.ts            # 阴影配置
│   │
│   ├── types/                    # 全局类型定义
│   │   ├── common.ts             # 通用类型
│   │   ├── api.ts                # API类型
│   │   └── navigation.ts         # 导航类型
│   │
│   ├── config/                   # 配置文件
│   │   ├── env.ts                # 环境变量
│   │   ├── app.ts                # 应用配置
│   │   └── permissions.ts        # 权限配置
│   │
│   └── App.tsx                   # 应用入口
│
├── __tests__/                    # 测试文件
│   ├── unit/                     # 单元测试
│   ├── integration/              # 集成测试
│   └── e2e/                      # E2E测试
│
├── .env                          # 环境变量
├── .env.development              # 开发环境
├── .env.production               # 生产环境
├── tsconfig.json                 # TypeScript配置
├── babel.config.js               # Babel配置
├── metro.config.js               # Metro配置
├── package.json                  # 依赖配置
└── README.md                     # 项目文档
```

### 目录结构设计原则

1. **按功能模块划分(Feature-Based)**
   - 每个功能模块独立管理自己的screens、components、hooks、store
   - 高内聚低耦合,便于维护和扩展

2. **清晰的分层架构**
   - components: 通用组件
   - features: 业务功能模块
   - services: 服务层封装
   - store: 状态管理
   - utils: 工具函数

3. **类型安全**
   - 每个模块都有自己的types定义
   - 全局types统一管理

4. **可扩展性**
   - 新增功能模块时,直接在features下新建文件夹
   - 遵循相同的文件结构规范

---

## 核心模块设计

### 1. To Do模块设计

#### 数据模型

```typescript
// src/features/todo/types/todo.types.ts

export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TodoStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: TodoPriority;
  status: TodoStatus;
  dueDate?: Date;
  reminderTime?: Date;
  tags: string[];
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  userId: string;
}

export interface DailyReview {
  id: string;
  date: Date;
  completedTodos: Todo[];
  totalTodos: number;
  completionRate: number;
  notes?: string;
  achievements: string[];
}

export interface TodoFilter {
  status?: TodoStatus[];
  priority?: TodoPriority[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  searchQuery?: string;
}
```

#### 状态管理(Redux Slice)

```typescript
// src/features/todo/store/todoSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo, TodoFilter } from '../types/todo.types';

interface TodoState {
  todos: Todo[];
  selectedDate: Date;
  filter: TodoFilter;
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  selectedDate: new Date(),
  filter: {},
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },
    setSelectedDate: (state, action: PayloadAction<Date>) => {
      state.selectedDate = action.payload;
    },
    setFilter: (state, action: PayloadAction<TodoFilter>) => {
      state.filter = action.payload;
    },
  },
});

export const { 
  setTodos, 
  addTodo, 
  updateTodo, 
  deleteTodo, 
  setSelectedDate, 
  setFilter 
} = todoSlice.actions;

export default todoSlice.reducer;
```

#### API接口(RTK Query)

```typescript
// src/api/endpoints/todoApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseApi } from '../baseApi';
import { Todo, TodoFilter } from '../../features/todo/types/todo.types';

export const todoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], TodoFilter>({
      query: (filter) => ({
        url: '/todos',
        params: filter,
      }),
      providesTags: ['Todos'],
    }),
    getTodoById: builder.query<Todo, string>({
      query: (id) => `/todos/${id}`,
      providesTags: (result, error, id) => [{ type: 'Todos', id }],
    }),
    createTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (todo) => ({
        url: '/todos',
        method: 'POST',
        body: todo,
      }),
      invalidatesTags: ['Todos'],
    }),
    updateTodo: builder.mutation<Todo, { id: string; data: Partial<Todo> }>({
      query: ({ id, data }) => ({
        url: `/todos/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Todos', id }],
    }),
    deleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todos'],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoByIdQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApi;
```

#### 自定义Hook

```typescript
// src/features/todo/hooks/useTodoList.ts

import { useMemo } from 'react';
import { useGetTodosQuery } from '../../../api/endpoints/todoApi';
import { useAppSelector } from '../../../hooks/useAppDispatch';
import { Todo, TodoFilter } from '../types/todo.types';

export const useTodoList = () => {
  const filter = useAppSelector(state => state.todo.filter);
  
  const { data: todos = [], isLoading, error } = useGetTodosQuery(filter);
  
  const filteredTodos = useMemo(() => {
    let result = [...todos];
    
    // 根据状态过滤
    if (filter.status && filter.status.length > 0) {
      result = result.filter(todo => filter.status!.includes(todo.status));
    }
    
    // 根据优先级过滤
    if (filter.priority && filter.priority.length > 0) {
      result = result.filter(todo => filter.priority!.includes(todo.priority));
    }
    
    // 根据搜索关键词过滤
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      result = result.filter(todo => 
        todo.title.toLowerCase().includes(query) ||
        todo.description?.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [todos, filter]);
  
  const todayTodos = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return filteredTodos.filter(todo => {
      if (!todo.dueDate) return false;
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    });
  }, [filteredTodos]);
  
  const overdueTodos = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return filteredTodos.filter(todo => {
      if (!todo.dueDate) return false;
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today && todo.status !== 'completed';
    });
  }, [filteredTodos]);
  
  return {
    todos: filteredTodos,
    todayTodos,
    overdueTodos,
    isLoading,
    error,
  };
};
```

### 2. Email模块设计

#### 数据模型

```typescript
// src/features/email/types/email.types.ts

export enum EmailStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
  SPAM = 'spam',
  TRASH = 'trash'
}

export interface Email {
  id: string;
  from: EmailAddress;
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  subject: string;
  body: string;
  htmlBody?: string;
  status: EmailStatus;
  isStarred: boolean;
  hasAttachments: boolean;
  attachments?: Attachment[];
  receivedAt: Date;
  sentAt?: Date;
  threadId?: string;
  labels: string[];
}

export interface EmailAddress {
  name?: string;
  email: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  attendees: EventAttendee[];
  organizer: EmailAddress;
  reminderMinutes?: number;
  recurrence?: RecurrenceRule;
  status: EventStatus;
}

export enum EventStatus {
  TENTATIVE = 'tentative',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

export interface EventAttendee {
  email: string;
  name?: string;
  responseStatus: 'accepted' | 'declined' | 'tentative' | 'needsAction';
}
```

### 3. Message模块设计

#### 数据模型

```typescript
// src/features/message/types/message.types.ts

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  VOICE = 'voice',
  VIDEO = 'video',
  SYSTEM = 'system'
}

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  content: string;
  metadata?: MessageMetadata;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface MessageMetadata {
  // 图片/视频
  mediaUrl?: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
  
  // 文件
  fileName?: string;
  fileSize?: number;
  fileUrl?: string;
  
  // 语音
  audioUrl?: string;
  audioDuration?: number;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  avatar?: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
}
```

#### WebSocket集成

```typescript
// src/services/websocket/socketClient.ts

import io, { Socket } from 'socket.io-client';
import { Message } from '../../features/message/types/message.types';

class SocketClient {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  connect(token: string) {
    this.socket = io(process.env.WEBSOCKET_URL!, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // 发送消息
  sendMessage(message: Partial<Message>) {
    if (this.socket && this.isConnected) {
      this.socket.emit('message:send', message);
    }
  }

  // 监听新消息
  onMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on('message:new', callback);
    }
  }

  // 监听消息状态更新
  onMessageStatus(callback: (data: { messageId: string; status: string }) => void) {
    if (this.socket) {
      this.socket.on('message:status', callback);
    }
  }

  // 加入会话
  joinConversation(conversationId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('conversation:join', conversationId);
    }
  }

  // 离开会话
  leaveConversation(conversationId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('conversation:leave', conversationId);
    }
  }

  // 发送正在输入状态
  sendTyping(conversationId: string, isTyping: boolean) {
    if (this.socket && this.isConnected) {
      this.socket.emit('conversation:typing', { conversationId, isTyping });
    }
  }
}

export default new SocketClient();
```

### 4. Tools模块设计

#### 插件化架构

```typescript
// src/features/tools/types/tools.types.ts

export enum ToolCategory {
  PRODUCTIVITY = 'productivity',
  COMMUNICATION = 'communication',
  UTILITIES = 'utilities',
  DEVELOPMENT = 'development',
  CUSTOM = 'custom'
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  isEnabled: boolean;
  version: string;
  author?: string;
  url?: string;
  config?: Record<string, any>;
  permissions?: string[];
}

export interface ToolPlugin {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  version: string;
  
  // 插件生命周期
  onInstall?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
  onEnable?: () => Promise<void>;
  onDisable?: () => Promise<void>;
  
  // 插件功能
  execute: (params?: any) => Promise<any>;
  getConfig?: () => Promise<any>;
  setConfig?: (config: any) => Promise<void>;
}
```

### 5. Profile模块设计

#### 数据模型

```typescript
// src/features/profile/types/profile.types.ts

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  birthday?: Date;
  gender?: 'male' | 'female' | 'other';
  location?: Location;
  timezone: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  country: string;
  city: string;
  address?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  display: DisplaySettings;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  showPreview: boolean;
  todoReminders: boolean;
  emailNotifications: boolean;
  messageNotifications: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

export interface PrivacySettings {
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  allowReadReceipts: boolean;
  allowTypingIndicator: boolean;
}

export interface DisplaySettings {
  fontSize: 'small' | 'medium' | 'large';
  dateFormat: string;
  timeFormat: '12h' | '24h';
  firstDayOfWeek: 0 | 1; // 0: Sunday, 1: Monday
}
```

---

## 状态管理方案

### Redux Store配置

```typescript
// src/store/index.ts

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

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth', 'profile', 'settings'], // 需要持久化的reducer
  blacklist: ['todo', 'email', 'message'], // RTK Query管理的不需要持久化
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// src/store/rootReducer.ts

import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from '../api/baseApi';

// Feature reducers
import authReducer from '../features/auth/store/authSlice';
import todoReducer from '../features/todo/store/todoSlice';
import emailReducer from '../features/email/store/emailSlice';
import messageReducer from '../features/message/store/messageSlice';
import toolsReducer from '../features/tools/store/toolsSlice';
import profileReducer from '../features/profile/store/profileSlice';

const rootReducer = combineReducers({
  // RTK Query API
  [baseApi.reducerPath]: baseApi.reducer,
  
  // Feature slices
  auth: authReducer,
  todo: todoReducer,
  email: emailReducer,
  message: messageReducer,
  tools: toolsReducer,
  profile: profileReducer,
});

export default rootReducer;
```

### RTK Query基础配置

```typescript
// src/api/baseApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      headers.set('Content-Type', 'application/json');
      
      return headers;
    },
  }),
  tagTypes: ['Todos', 'Emails', 'Messages', 'Tools', 'Profile'],
  endpoints: () => ({}),
});
```

---

## 导航架构设计

### 导航结构

```
RootNavigator (Stack)
├── AuthNavigator (Stack)
│   ├── Login
│   ├── Register
│   └── ForgotPassword
│
└── AppNavigator (Stack)
    ├── TabNavigator (BottomTabs)
    │   ├── TodoStack (Stack)
    │   │   ├── TodoList
    │   │   ├── TodoDetail
    │   │   ├── TodoCalendar
    │   │   └── TodoReview
    │   │
    │   ├── EmailStack (Stack)
    │   │   ├── EmailList
    │   │   ├── EmailDetail
    │   │   ├── EmailCompose
    │   │   └── Calendar
    │   │
    │   ├── MessageStack (Stack)
    │   │   ├── MessageList
    │   │   └── Chat
    │   │
    │   ├── ToolsStack (Stack)
    │   │   ├── ToolsList
    │   │   └── ToolDetail
    │   │
    │   └── ProfileStack (Stack)
    │       ├── Profile
    │       ├── EditProfile
    │       └── Settings
    │
    └── Modal Screens
        ├── Notifications
        ├── Search
        └── Filter
```

### 导航实现

```typescript
// src/navigation/RootNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../hooks/useAppDispatch';

import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { linking } from './linking';

const Stack = createStackNavigator();

const RootNavigator: React.FC = () => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
```

```typescript
// src/navigation/TabNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import TodoStack from '../features/todo/navigation/TodoStack';
import EmailStack from '../features/email/navigation/EmailStack';
import MessageStack from '../features/message/navigation/MessageStack';
import ToolsStack from '../features/tools/navigation/ToolsStack';
import ProfileStack from '../features/profile/navigation/ProfileStack';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'TodoTab':
              iconName = focused ? 'checkbox-marked-circle' : 'checkbox-marked-circle-outline';
              break;
            case 'EmailTab':
              iconName = focused ? 'email' : 'email-outline';
              break;
            case 'MessageTab':
              iconName = focused ? 'message' : 'message-outline';
              break;
            case 'ToolsTab':
              iconName = focused ? 'toolbox' : 'toolbox-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: '#757575',
      })}
    >
      <Tab.Screen 
        name="TodoTab" 
        component={TodoStack}
        options={{ tabBarLabel: 'To Do' }}
      />
      <Tab.Screen 
        name="EmailTab" 
        component={EmailStack}
        options={{ tabBarLabel: 'Email' }}
      />
      <Tab.Screen 
        name="MessageTab" 
        component={MessageStack}
        options={{ 
          tabBarLabel: 'Message',
          tabBarBadge: 3, // 可以从Redux获取未读消息数
        }}
      />
      <Tab.Screen 
        name="ToolsTab" 
        component={ToolsStack}
        options={{ tabBarLabel: 'Tools' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStack}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
```

---

## API接口设计

### RESTful API规范

```typescript
// API端点命名规范

// 认证相关
POST   /auth/login              // 登录
POST   /auth/register           // 注册
POST   /auth/logout             // 登出
POST   /auth/refresh            // 刷新Token
POST   /auth/forgot-password    // 忘记密码
POST   /auth/reset-password     // 重置密码

// To Do相关
GET    /todos                   // 获取待办列表
GET    /todos/:id               // 获取待办详情
POST   /todos                   // 创建待办
PUT    /todos/:id               // 更新待办
DELETE /todos/:id               // 删除待办
GET    /todos/daily-review      // 每日回顾

// Email相关
GET    /emails                  // 获取邮件列表
GET    /emails/:id              // 获取邮件详情
POST   /emails                  // 发送邮件
PUT    /emails/:id              // 更新邮件状态
DELETE /emails/:id              // 删除邮件
GET    /emails/calendar         // 获取日程
POST   /emails/calendar         // 创建日程

// Message相关
GET    /conversations           // 获取会话列表
GET    /conversations/:id       // 获取会话详情
POST   /conversations           // 创建会话
GET    /messages                // 获取消息列表
POST   /messages                // 发送消息
PUT    /messages/:id            // 更新消息
DELETE /messages/:id            // 删除消息

// Tools相关
GET    /tools                   // 获取工具列表
GET    /tools/:id               // 获取工具详情
POST   /tools/install           // 安装工具
DELETE /tools/:id               // 卸载工具

// Profile相关
GET    /profile                 // 获取个人信息
PUT    /profile                 // 更新个人信息
PUT    /profile/avatar          // 更新头像
PUT    /profile/settings        // 更新设置
```

### API请求/响应格式

```typescript
// src/types/api.ts

// 统一响应格式
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  timestamp: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 错误响应
export interface ApiError {
  success: false;
  message: string;
  code: string;
  errors?: Record<string, string[]>;
  timestamp: number;
}
```

### HTTP拦截器

```typescript
// src/services/api/interceptors.ts

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { store } from '../../store';
import { logout, refreshToken } from '../../features/auth/store/authSlice';

// 请求拦截器
export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const state = store.getState();
  const token = state.auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 添加请求ID用于追踪
  config.headers['X-Request-ID'] = generateRequestId();

  return config;
};

export const requestErrorInterceptor = (error: AxiosError) => {
  return Promise.reject(error);
};

// 响应拦截器
export const responseInterceptor = (response: AxiosResponse) => {
  return response.data;
};

export const responseErrorInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  // Token过期,自动刷新
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      const state = store.getState();
      const refreshTokenValue = state.auth.refreshToken;

      if (refreshTokenValue) {
        const response = await axios.post('/auth/refresh', {
          refreshToken: refreshTokenValue,
        });

        const { token } = response.data;
        store.dispatch(refreshToken({ token }));

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      }
    } catch (refreshError) {
      store.dispatch(logout());
      return Promise.reject(refreshError);
    }
  }

  // 处理其他错误
  return Promise.reject(error);
};

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

---

## 数据持久化方案

### 存储策略

| 数据类型 | 存储方案 | 原因 |
|---------|---------|------|
| Token、用户偏好 | MMKV | 高性能、简单KV存储 |
| 待办事项、邮件 | Realm | 复杂查询、关系型数据 |
| 敏感信息(密码) | Keychain/Keystore | 安全加密存储 |
| API缓存 | RTK Query | 自动缓存管理 |
| 文件、图片 | FileSystem | 大文件存储 |

### MMKV配置

```typescript
// src/services/storage/mmkvStorage.ts

import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'workplace-app-storage',
  encryptionKey: 'your-encryption-key', // 生产环境从安全地方获取
});

export const StorageKeys = {
  // Auth
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
  
  // Settings
  THEME: 'theme',
  LANGUAGE: 'language',
  NOTIFICATION_ENABLED: 'notification_enabled',
  
  // Cache
  LAST_SYNC_TIME: 'last_sync_time',
  CACHE_VERSION: 'cache_version',
} as const;

export const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  
  getItem: (key: string): string | undefined => {
    return storage.getString(key);
  },
  
  removeItem: (key: string) => {
    storage.delete(key);
  },
  
  clear: () => {
    storage.clearAll();
  },
  
  // 类型安全的存取方法
  setObject: <T>(key: string, value: T) => {
    storage.set(key, JSON.stringify(value));
  },
  
  getObject: <T>(key: string): T | undefined => {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : undefined;
  },
  
  setBoolean: (key: string, value: boolean) => {
    storage.set(key, value);
  },
  
  getBoolean: (key: string): boolean | undefined => {
    return storage.getBoolean(key);
  },
};
```

### Realm数据库配置

```typescript
// src/services/storage/realmStorage.ts

import Realm from 'realm';

// Todo Schema
export class TodoSchema extends Realm.Object<TodoSchema> {
  _id!: Realm.BSON.ObjectId;
  title!: string;
  description?: string;
  priority!: string;
  status!: string;
  dueDate?: Date;
  reminderTime?: Date;
  tags!: Realm.List<string>;
  createdAt!: Date;
  updatedAt!: Date;
  userId!: string;
  isSynced!: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'Todo',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      title: 'string',
      description: 'string?',
      priority: 'string',
      status: 'string',
      dueDate: 'date?',
      reminderTime: 'date?',
      tags: 'string[]',
      createdAt: 'date',
      updatedAt: 'date',
      userId: 'string',
      isSynced: { type: 'bool', default: false },
    },
  };
}

// Email Schema
export class EmailSchema extends Realm.Object<EmailSchema> {
  _id!: Realm.BSON.ObjectId;
  from!: string;
  to!: Realm.List<string>;
  subject!: string;
  body!: string;
  status!: string;
  receivedAt!: Date;
  userId!: string;
  isSynced!: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'Email',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      from: 'string',
      to: 'string[]',
      subject: 'string',
      body: 'string',
      status: 'string',
      receivedAt: 'date',
      userId: 'string',
      isSynced: { type: 'bool', default: false },
    },
  };
}

// Realm配置
const realmConfig: Realm.Configuration = {
  schema: [TodoSchema, EmailSchema],
  schemaVersion: 1,
  migration: (oldRealm, newRealm) => {
    // 数据迁移逻辑
  },
};

// 获取Realm实例
export const getRealm = async (): Promise<Realm> => {
  return await Realm.open(realmConfig);
};

// Realm操作封装
export const realmStorage = {
  // 创建
  create: async <T extends Realm.Object>(
    schemaName: string,
    data: Partial<T>
  ): Promise<T> => {
    const realm = await getRealm();
    let result: T;
    
    realm.write(() => {
      result = realm.create(schemaName, {
        _id: new Realm.BSON.ObjectId(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }) as T;
    });
    
    return result!;
  },
  
  // 查询所有
  findAll: async <T extends Realm.Object>(
    schemaName: string
  ): Promise<Realm.Results<T>> => {
    const realm = await getRealm();
    return realm.objects<T>(schemaName);
  },
  
  // 根据ID查询
  findById: async <T extends Realm.Object>(
    schemaName: string,
    id: string
  ): Promise<T | undefined> => {
    const realm = await getRealm();
    return realm.objectForPrimaryKey<T>(schemaName, new Realm.BSON.ObjectId(id));
  },
  
  // 更新
  update: async <T extends Realm.Object>(
    schemaName: string,
    id: string,
    data: Partial<T>
  ): Promise<void> => {
    const realm = await getRealm();
    
    realm.write(() => {
      realm.create(
        schemaName,
        {
          _id: new Realm.BSON.ObjectId(id),
          ...data,
          updatedAt: new Date(),
        },
        Realm.UpdateMode.Modified
      );
    });
  },
  
  // 删除
  delete: async (schemaName: string, id: string): Promise<void> => {
    const realm = await getRealm();
    const object = realm.objectForPrimaryKey(schemaName, new Realm.BSON.ObjectId(id));
    
    if (object) {
      realm.write(() => {
        realm.delete(object);
      });
    }
  },
  
  // 清空
  deleteAll: async (schemaName: string): Promise<void> => {
    const realm = await getRealm();
    const objects = realm.objects(schemaName);
    
    realm.write(() => {
      realm.delete(objects);
    });
  },
};
```

---

## 推送通知方案

### 通知类型设计

```typescript
// src/services/notification/types.ts

export enum NotificationType {
  TODO_REMINDER = 'todo_reminder',
  EMAIL_RECEIVED = 'email_received',
  MESSAGE_RECEIVED = 'message_received',
  CALENDAR_EVENT = 'calendar_event',
  SYSTEM = 'system',
}

export interface NotificationPayload {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: number;
}
```

### Firebase Cloud Messaging配置

```typescript
// src/services/notification/pushNotification.ts

import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native';

class PushNotificationService {
  // 请求通知权限
  async requestPermission(): Promise<boolean> {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
  }

  // 获取FCM Token
  async getFCMToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  // 初始化推送通知
  async initialize() {
    // 请求权限
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      console.warn('Notification permission denied');
      return;
    }

    // 获取并保存FCM Token
    const token = await this.getFCMToken();
    if (token) {
      // 上传Token到服务器
      await this.uploadTokenToServer(token);
    }

    // 监听Token刷新
    messaging().onTokenRefresh(async (newToken) => {
      await this.uploadTokenToServer(newToken);
    });

    // 前台消息处理
    messaging().onMessage(async (remoteMessage) => {
      await this.displayNotification(remoteMessage);
    });

    // 后台/退出状态消息处理
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background message:', remoteMessage);
    });

    // 通知点击处理
    messaging().onNotificationOpenedApp((remoteMessage) => {
      this.handleNotificationClick(remoteMessage);
    });

    // 应用从退出状态启动时的通知
    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      this.handleNotificationClick(initialNotification);
    }
  }

  // 显示通知
  async displayNotification(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      android: {
        channelId,
        smallIcon: 'ic_notification',
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
      data: remoteMessage.data,
    });
  }

  // 处理通知点击
  private handleNotificationClick(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
    const data = remoteMessage.data;
    
    // 根据通知类型导航到对应页面
    if (data?.type === 'todo_reminder') {
      // 导航到待办详情
    } else if (data?.type === 'message_received') {
      // 导航到消息会话
    }
  }

  // 上传Token到服务器
  private async uploadTokenToServer(token: string) {
    try {
      // 调用API上传Token
      console.log('Uploading FCM token:', token);
    } catch (error) {
      console.error('Error uploading FCM token:', error);
    }
  }
}

export default new PushNotificationService();
```

### 本地通知(待办提醒)

```typescript
// src/services/notification/localNotification.ts

import notifee, { 
  TimestampTrigger, 
  TriggerType,
  AndroidImportance 
} from '@notifee/react-native';

class LocalNotificationService {
  // 创建通知渠道
  async createChannels() {
    await notifee.createChannel({
      id: 'todo-reminders',
      name: 'Todo Reminders',
      importance: AndroidImportance.HIGH,
    });

    await notifee.createChannel({
      id: 'calendar-events',
      name: 'Calendar Events',
      importance: AndroidImportance.HIGH,
    });
  }

  // 安排待办提醒
  async scheduleTodoReminder(todoId: string, title: string, reminderTime: Date) {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: reminderTime.getTime(),
    };

    await notifee.createTriggerNotification(
      {
        id: `todo-${todoId}`,
        title: 'Todo Reminder',
        body: title,
        android: {
          channelId: 'todo-reminders',
          smallIcon: 'ic_notification',
          actions: [
            {
              title: 'Mark as Done',
              pressAction: { id: 'mark-done', launchActivity: 'default' },
            },
            {
              title: 'Snooze',
              pressAction: { id: 'snooze', launchActivity: 'default' },
            },
          ],
        },
        ios: {
          categoryId: 'todo-reminder',
        },
        data: {
          type: 'todo_reminder',
          todoId,
        },
      },
      trigger
    );
  }

  // 取消提醒
  async cancelReminder(notificationId: string) {
    await notifee.cancelNotification(notificationId);
  }

  // 获取所有待处理的通知
  async getPendingNotifications() {
    const notifications = await notifee.getTriggerNotifications();
    return notifications;
  }

  // 取消所有通知
  async cancelAllNotifications() {
    await notifee.cancelAllNotifications();
  }
}

export default new LocalNotificationService();
```

---

## 性能优化策略

### 1. 列表优化

```typescript
// 使用FlatList优化大列表渲染

import { FlatList } from 'react-native';

<FlatList
  data={todos}
  renderItem={({ item }) => <TodoItem todo={item} />}
  keyExtractor={(item) => item.id}
  // 性能优化配置
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={10}
  // 优化滚动性能
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  // 分隔线组件优化
  ItemSeparatorComponent={Separator}
  // 空状态
  ListEmptyComponent={EmptyState}
/>
```

### 2. 图片优化

```typescript
// 使用React Native Fast Image

import FastImage from 'react-native-fast-image';

<FastImage
  style={{ width: 200, height: 200 }}
  source={{
    uri: imageUrl,
    priority: FastImage.priority.normal,
  }}
  resizeMode={FastImage.resizeMode.cover}
/>
```

### 3. 代码分割和懒加载

```typescript
// 使用React.lazy和Suspense

import React, { Suspense, lazy } from 'react';

const TodoDetailScreen = lazy(() => import('./screens/TodoDetailScreen'));

<Suspense fallback={<LoadingSpinner />}>
  <TodoDetailScreen />
</Suspense>
```

### 4. Memo优化

```typescript
// 使用React.memo避免不必要的重渲染

const TodoItem = React.memo(({ todo, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(todo.id)}>
      <Text>{todo.title}</Text>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.todo.id === nextProps.todo.id &&
         prevProps.todo.title === nextProps.todo.title;
});
```

### 5. 动画优化

```typescript
// 使用React Native Reanimated 3

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const AnimatedComponent = () => {
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <Animated.View style={animatedStyles}>
      {/* Content */}
    </Animated.View>
  );
};
```

---

## 项目搭建步骤

### Step 1: 初始化项目

```bash
# 使用React Native CLI创建项目
npx react-native@latest init WorkplaceApp --template react-native-template-typescript

cd WorkplaceApp
```

### Step 2: 安装核心依赖

```bash
# 导航
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs @react-navigation/drawer
npm install react-native-screens react-native-safe-area-context

# 状态管理
npm install @reduxjs/toolkit react-redux redux-persist
npm install @react-native-async-storage/async-storage

# UI组件
npm install react-native-paper react-native-vector-icons
npm install react-native-gesture-handler react-native-reanimated

# 日历和日期
npm install react-native-calendars dayjs

# 表单
npm install react-hook-form yup

# 网络和API
npm install axios socket.io-client

# 本地存储
npm install react-native-mmkv realm

# 推送通知
npm install @react-native-firebase/app @react-native-firebase/messaging
npm install @notifee/react-native

# 工具库
npm install react-native-device-info
npm install react-native-permissions
npm install react-native-share
npm install react-native-document-picker

# 开发依赖
npm install --save-dev @types/react @types/react-native
npm install --save-dev eslint @typescript-eslint/eslint-plugin
npm install --save-dev prettier eslint-config-prettier
```

### Step 3: 配置TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["es2019", "es2020.promise", "es2020.bigint", "es2020.string"],
    "jsx": "react-native",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@features/*": ["src/features/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"],
      "@hooks/*": ["src/hooks/*"],
      "@navigation/*": ["src/navigation/*"],
      "@assets/*": ["src/assets/*"],
      "@theme/*": ["src/theme/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "extends": "@react-native/typescript-config/tsconfig.json",
  "include": ["src/**/*"],
  "exclude": ["node_modules", "babel.config.js", "metro.config.js"]
}
```

### Step 4: 配置路径别名(Babel)

```javascript
// babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@features': './src/features',
          '@services': './src/services',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@navigation': './src/navigation',
          '@assets': './src/assets',
          '@theme': './src/theme',
          '@types': './src/types',
        },
      },
    ],
  ],
};
```

### Step 5: 创建目录结构

```bash
# 创建主要目录
mkdir -p src/{api,assets,components,features,navigation,services,store,hooks,utils,constants,theme,types,config}

# 创建功能模块目录
mkdir -p src/features/{todo,email,message,tools,profile,auth}/{screens,components,hooks,store,types,utils}

# 创建组件目录
mkdir -p src/components/{common,layout,feedback}

# 创建服务目录
mkdir -p src/services/{api,storage,notification,websocket,analytics}
```

### Step 6: 配置Redux Store

```typescript
// src/store/index.ts
// (参考前面的Redux Store配置代码)

// src/App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as PaperProvider } from 'react-native-paper';
import { store, persistor } from './store';
import RootNavigator from './navigation/RootNavigator';
import { theme } from './theme';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <RootNavigator />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
```

### Step 7: 配置环境变量

```bash
# 安装react-native-config
npm install react-native-config
npm install --save-dev @types/react-native-config

# iOS
cd ios && pod install && cd ..
```

```
# .env.development
API_BASE_URL=https://dev-api.workplace.com
WEBSOCKET_URL=wss://dev-ws.workplace.com
```

```
# .env.production
API_BASE_URL=https://api.workplace.com
WEBSOCKET_URL=wss://ws.workplace.com
```

### Step 8: 配置Firebase(推送通知)

```bash
# iOS配置
# 1. 下载GoogleService-Info.plist
# 2. 将文件添加到ios/WorkplaceApp/

# Android配置
# 1. 下载google-services.json
# 2. 将文件放到android/app/
```

```java
// android/build.gradle
buildscript {
  dependencies {
    classpath 'com.google.gms:google-services:4.4.0'
  }
}
```

```java
// android/app/build.gradle
apply plugin: 'com.google.gms.google-services'
```

### Step 9: 配置深度链接

```typescript
// src/navigation/linking.ts
import { LinkingOptions } from '@react-navigation/native';

export const linking: LinkingOptions<any> = {
  prefixes: ['workplaceapp://', 'https://workplace.app'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
        },
      },
      App: {
        screens: {
          TabNavigator: {
            screens: {
              TodoTab: {
                screens: {
                  TodoList: 'todos',
                  TodoDetail: 'todos/:id',
                },
              },
              EmailTab: {
                screens: {
                  EmailList: 'emails',
                  EmailDetail: 'emails/:id',
                },
              },
              MessageTab: {
                screens: {
                  MessageList: 'messages',
                  Chat: 'messages/:conversationId',
                },
              },
            },
          },
        },
      },
    },
  },
};
```

### Step 10: 运行项目

```bash
# iOS
npm run ios

# Android
npm run android

# 启动Metro
npm start
```

---

## 开发规范

### 1. 命名规范

- **组件**: PascalCase (例: `TodoItem.tsx`)
- **文件夹**: kebab-case (例: `todo-list/`)
- **变量/函数**: camelCase (例: `getTodoList`)
- **常量**: UPPER_SNAKE_CASE (例: `API_BASE_URL`)
- **类型/接口**: PascalCase + 描述性后缀 (例: `TodoItem`, `TodoListProps`)

### 2. 文件组织

```typescript
// 推荐的组件文件结构

// 1. 导入(按类别分组)
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 2. 类型定义
interface TodoItemProps {
  todo: Todo;
  onPress: (id: string) => void;
}

// 3. 组件定义
export const TodoItem: React.FC<TodoItemProps> = ({ todo, onPress }) => {
  // Hooks
  const [isPressed, setIsPressed] = useState(false);
  
  // 事件处理
  const handlePress = () => {
    setIsPressed(true);
    onPress(todo.id);
  };
  
  // 渲染
  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Text style={styles.title}>{todo.title}</Text>
    </TouchableOpacity>
  );
};

// 4. 样式
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
  },
});
```

### 3. Git Commit规范

```bash
# Commit Message格式
<type>(<scope>): <subject>

# 类型(type)
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式(不影响功能)
refactor: 重构
test: 测试
chore: 构建/工具链

# 示例
feat(todo): add todo reminder functionality
fix(email): resolve email sync issue
docs(readme): update installation instructions
```

---

## 总结

这份架构设计文档涵盖了:

✅ **完整的技术栈选型**和理由
✅ **清晰的分层架构**设计
✅ **详细的目录结构**和组织方式
✅ **五大核心模块**的数据模型、状态管理、API设计
✅ **Redux Toolkit + RTK Query**状态管理方案
✅ **React Navigation**导航架构
✅ **MMKV + Realm**数据持久化方案
✅ **Firebase + Notifee**推送通知方案
✅ **性能优化策略**
✅ **完整的项目搭建步骤**
✅ **开发规范和最佳实践**

### 下一步行动

1. **初始化项目**:按照Step 1-10搭建基础框架
2. **实现认证模块**:登录/注册/Token管理
3. **实现To Do模块**:作为第一个完整功能模块
4. **逐步实现其他模块**:Email → Message → Tools → Profile
5. **集成推送通知**:FCM配置和本地通知
6. **性能优化和测试**:确保流畅体验
7. **打包发布**:App Store和Google Play

这个架构设计为企业级React Native应用提供了坚实的基础,具有良好的可扩展性、可维护性和性能表现!