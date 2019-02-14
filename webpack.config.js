const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');



module.exports = {
  mode: 'development',
  entry: {
    checkin:  './src/checkin/checkin.js',
    // app: './src/app.js',
    // board: './src/board.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name]/[name]-[hash:8].js',
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.(less|css)$/, use: ['style-loader', 'css-loader', 'less-loader'] },
      { test: /\.html$/, loader: 'html-loader' },
      { test: /\.(png|gif)$/, loader: 'url-loader', options: { limit: 50000, name: 'images/[name]-[hash:8].[ext]' } },
      { test: /\.(mp3)$/, loader: 'url-loader', options: { limit: 0, name: 'audio/[name]-[hash:8].[ext]' } },
    ]
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: './src/app.html',
    //   chunks: ['app'],
    // }),
    // new HtmlWebpackPlugin({
    //   filename: './board.html',
    //   template: './src/board.html',
    //   chunks: ['board'],
    // }),
    new HtmlWebpackPlugin({
      filename: './checkin/checkin.html',
      template: './src/checkin/checkin.html',
      chunks: ['checkin'],
    }),
    new CleanWebpackPlugin(['dist']),
  ],
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      public: path.resolve(__dirname, 'src/public'),
    }
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: '0.0.0.0',
    port: 8000,
    // proxy: {
    //   '/api': {
    //     target: 'http://of.xigemall.com',
    //     pathRewrite: { '^/api': '/sign' },
    //     changeOrigin: true,
    //   },
    // },
    proxy: {
      '': {
        target: '112.74.177.132:8007',
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
  }
}