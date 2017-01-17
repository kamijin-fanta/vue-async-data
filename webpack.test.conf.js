var webpack = require('webpack');

module.exports = {
  entry: [
    './src/main.js',
    // 'babel-polyfill',
  ],
  output: {
    path: './dest',
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js'],
    alias: {
      vue: 'vue/dist/vue.js'
    },
  },
  resolveLoader: {
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
    ]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    // })
  ],
  devtool: 'inline-source-map',
}
