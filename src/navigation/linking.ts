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