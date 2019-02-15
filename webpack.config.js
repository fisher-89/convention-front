const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name]-[hash:8].js',
  },
  module: {
    rules: [
      { test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ["env", "react", "es2015", "stage-2"],
          plugins: [
            [  "import",{libraryName: "antd", style: 'css'}] // antd按需加载
        ]
        }, 
      },
      { test: /\.(less|css)$/, use: ["style-loader","css-loader", "less-loader"] },
      { test: /\.html$/, loader: 'html-loader' },
      { test: /\.(png|gif)$/, loader: 'url-loader', options: { limit: 8192, name: 'images/[name]-[hash:8].[ext]' } },
      { test: /\.(mp3)$/, loader: 'url-loader', options: { limit: 0, name: 'audio/[name]-[hash:8].[ext]' } },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/app.html',
      chunks: ['app'],
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
      '/api': {
        // target: 'http://192.168.1.16:8007',
        target: 'http://112.74.177.132:8007',
        // pathRewrite: { '^/api': '/sign' },
        changeOrigin: true,
      },
      // '/api': {
      //   target: 'http://of.xigemall.com',
      //   pathRewrite: { '^/api': '/sign' },
      //   changeOrigin: true,
      // },
    },
    historyApiFallback: true,
  }
}