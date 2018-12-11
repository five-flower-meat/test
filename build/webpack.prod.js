/**
 * @author carroll
 * @since 20180723
 * @example NAME="filename" npm run build
 * @description 打包文件在dist/"filename"下，实现功能es6转es5，打包压缩文件。
*/

const baseWebpackConfig = require('./webpack.base.js');
const merge = require('webpack-merge');
const webpack = require('webpack');
const config = require('../config');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const fs = require('fs');
const utils = require('./utils.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const modulesPath = path.resolve(__dirname, '../src/modules');
const files = fs.readdirSync(modulesPath);

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

utils.fileCheck();

// 判断名称必填
if (!process.env.NAME) {
  throw new Error('NAME is must, please use "NAME=test npm run build"!');
}
// 判断名称是否不存在
if (!files.includes(process.env.NAME)) {
  throw new Error('NAME is not exist, please check!');
}

const prodWebpackConfig = merge(baseWebpackConfig, {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: `./src/modules/${process.env.NAME}/app.js`
  },
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // 公共模块单独抽离，且保持hash不变
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      },
      {
        test: /\.css$/,
        // 将css从js中抽离出来
        use: ExtractTextPlugin.extract({
          // 20180815,添加publicPath，解决css背景图片问题
          publicPath: '../../',
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                query: {
                  autoprefixer: false
                }
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  require('autoprefixer')({
                    browsers: [
                      '> 0.001%',
                      'last 7 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ]
                  })
                ]
              }
            }
          ]
          // loader: 'style-loader!css-loader!postcss-loader'
        })
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      allChunks: true
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
        autoprefixer: false
      }
    }),
    ...utils.setHtmlWebpackPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        );
      }
    }),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        // 20181109，忽略子层大的字体文件
        ignore: ['**/.font-spider/*.ttf']
      }
    ]),
  ]
});

module.exports = prodWebpackConfig;