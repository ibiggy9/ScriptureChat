module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    comments: process.env.NODE_ENV !== 'production',
    plugins: [
      ...(process.env.NODE_ENV === 'production' ? ['transform-remove-console'] : []),
      'react-native-reanimated/plugin',
    ],
  };
};
