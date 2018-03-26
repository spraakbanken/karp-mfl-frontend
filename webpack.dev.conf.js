'use strict'
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  devServer: {
    port: 9000
  },
  devtool: 'inline-source-map',
  mode: 'development'
});
