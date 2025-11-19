import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '@hooks/useAppSelector';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';
import { linking } from './linking';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
    const isAuthenticated = useAppSelector((state) => state.auth?.isAuthenticated ?? false);

    return (
        <NavigationContainer linking={linking}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* 判断是否已经验证登陆 */}
                {isAuthenticated ? (
                    <Stack.Screen name="App" component={TabNavigator} />
                ) : (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootNavigator;