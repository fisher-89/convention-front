const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = {
  mode: 'development',
  entry: {
    checkin: './src/checkin/checkin.js',
    luckdraw: './src/luckdraw/luckdraw.js',
    app: './src/app/app.js',
    supple: './src/supple/supple.js',
    passport: './src/oauth/oauth.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name]/[name]-[hash:8].js',
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.(less|css)$/, use: ["style-loader", "css-loader", "less-loader"] },
      { test: /\.html$/, loader: 'html-loader' },
      { test: /\.(png|gif)$/, loader: 'url-loader', options: { limit: 50000, name: 'images/[name]-[hash:8].[ext]' } },
      { test: /\.(mp3)$/, loader: 'url-loader', options: { limit: 0, name: 'audio/[name]-[hash:8].[ext]' } },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: './app/index.html',
      template: './src/app/app.html',
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: './supple/index.html',
      template: './src/supple/supple.html',
      chunks: ['supple'],
    }),
    new HtmlWebpackPlugin({
      filename: './checkin/index.html',
      template: './src/checkin/checkin.html',
      chunks: ['checkin'],
    }),
    new HtmlWebpackPlugin({
      filename: './checkin/clear.html',
      template: './src/checkin/clear.html',
      chunks: ['checkin'],
    }),
    new HtmlWebpackPlugin({
      filename: './luckdraw/index.html',
      template: './src/luckdraw/luckdraw.html',
      chunks: ['luckdraw'],
    }),
    new HtmlWebpackPlugin({
      filename: './passport/index.html',
      template: './src/oauth/oauth.html',
      chunks: ['passport'],
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
    proxy: {
      '/oauth': {
        target: 'http://112.74.177.132:8002',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://cs.xigemall.com',
        changeOrigin: true,
      },
    },
    historyApiFallback: {
      rewrites: [
        { from: /^\/passport/, to: '/passport/index.html' },
      ]
    },
  }
}