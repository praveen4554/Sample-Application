var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: __dirname+'./dist',
    publicPath: 'http://localhost:8080/',
    filename: 'main.bundle.js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new ExtractTextPlugin('style.css')
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
});
