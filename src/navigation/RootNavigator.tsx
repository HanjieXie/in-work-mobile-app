import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../hooks/useAppDispatch';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { linking } from './linking';

const Stack = createStackNavigator();
const RooNavigator: React.FC = () => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    return (
        <NavigationContainer linking={linking}>
            <Stack.navigator srceenOptions={{ headerShown: false }}>
                {/* 判断是否已经验证登陆 */}
                {isAuthenticated ? (
                    <Stack.Screen name="App" component={AppNavigator} />
                ) : (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                )}
            </Stack.navigator>

        </NavigationContainer>
    )
}

export default RooNavigator;