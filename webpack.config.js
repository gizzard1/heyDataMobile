const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.web.js',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules\/(?!(@react-native\/new-app-screen|react-native|@react-native)\/).*/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@react-native/babel-preset'],
            plugins: ['@babel/plugin-transform-flow-strip-types'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: {
          loader: 'file-loader',
        },
      },
    ],
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
    },
    extensions: ['.web.js', '.js', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json'],
  },
  output: {
    path: path.resolve(__dirname, 'web-build'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'web-build'),
    port: 3001,
    hot: true,
  },
};
