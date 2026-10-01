module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@stores': './src/core/stores',
          '@screens': './src/core/screens',
          '@components': './src/core/components',
          '@': './src/core',
        },
      },
    ],
  ],
};