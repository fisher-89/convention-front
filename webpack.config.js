const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Uglify = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/app.js',
    board: './src/board.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[hash:8].js',
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.(less|css)$/, use: ['style-loader', 'css-loader', 'less-loader'] },
      { test: /\.html$/, loader: 'html-loader' },
      { test: /\.(png|gif)$/, loader: 'url-loader', options: { limit: 8192, name: '[name]-[hash:8].[ext]' } },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/app.html',
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'board/index.html',
      template: './src/board.html',
      chunks: ['board'],
    }),
  ],
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
    }
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: '0.0.0.0',
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://192.168.20.16:8002',
        pathRewrite: { '^/api': '/sign' },
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
  }
}