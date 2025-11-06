// src/constants/config.ts
import Config from 'react-native-config';

interface AppConfig {
  API_BASE_URL: string;
  APP_ENV: 'development' | 'staging' | 'production';
  ENABLE_LOGS: boolean;
}

const config: AppConfig = {
  API_BASE_URL: Config.API_BASE_URL || 'https://api.example.com',
  APP_ENV: (Config.APP_ENV as any) || 'development',
  ENABLE_LOGS: Config.ENABLE_LOGS === 'true',
};

export default config;