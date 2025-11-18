// src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MainTabParamList } from './types';
import { colors } from '@theme';

// 临时占位组件
import TodoNavigator from '@features/todo/navigation/TodoNavigator';
import PlaceholderScreen from '@components/common/PlaceholderScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
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
      })}
    >
      <Tab.Screen 
        name="TodoTab" 
        component={TodoNavigator}
        options={{ tabBarLabel: 'To Do' }}
      />
      <Tab.Screen 
        name="EmailTab" 
        component={PlaceholderScreen}
        options={{ tabBarLabel: 'Email' }}
      />
      <Tab.Screen 
        name="MessageTab" 
        component={PlaceholderScreen}
        options={{ tabBarLabel: 'Message' }}
      />
      <Tab.Screen 
        name="ToolsTab" 
        component={PlaceholderScreen}
        options={{ tabBarLabel: 'Tools' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={PlaceholderScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};