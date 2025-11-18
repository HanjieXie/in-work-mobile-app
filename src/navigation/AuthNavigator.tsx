import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthStackParamList } from "@/types/navigation";

// 临时占位组件
import LoginScreen from "@features/auth/screens/LoginScreen";  
import RegisterScreen from "@features/auth/screens/RegisterScreen";


const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}