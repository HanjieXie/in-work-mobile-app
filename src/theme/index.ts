
// 主题入口
// src/theme/index.ts
import { DefaultTheme } from 'react-native-paper';
import { colors } from './colors';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.background.default,
    surface: colors.background.paper,
    text: colors.text.primary,
    error: colors.error,
  },
};

export { colors } from './colors';
export { spacing } from './spacing';
export { typography } from './typography';