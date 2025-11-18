// 导航类型
import { NavigatorScreenParams } from '@react-navigation/native';

// 根导航类型
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

// 认证导航类型
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgetPassword: undefined;
};

export type AppStackParamList = {
  Main: undefined;
  ToDoDetail: { todoId: string };
  EmailCompose: { replyTo?: string };
};

// TAB 导航类型
export type MainTabParamList = {
  TodoTab: NavigatorScreenParams<TodoTabParamList>;
  EmailTab: undefined;
  MessageTab: undefined;
  ToolsTab: undefined;
  ProfileTab: undefined;
};

export type TodoTabParamList = {
  TodoList: undefined;
  TodoCalendar: undefined;
  TodoReview: undefined;
}
