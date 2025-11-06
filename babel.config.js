// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/screens': './src/screens',
          '@/store': './src/store',
          '@/api': './src/api',
          '@/hooks': './src/hooks',
          '@/utils': './src/utils',
          '@/constants': './src/constants',
          '@/types': './src/types',
          '@/navigation': './src/navigation',
          '@/services': './src/services',
        },
      },
    ],
  ],
};