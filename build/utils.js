const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../config');
const variableJson = isJSON();

function getModuleHtml() {
  const modulePath = path.resolve(__dirname, `../src/modules/${process.env.NAME}`);
  const moduleHtmlFile = fs.readdirSync(modulePath).filter(val => val.endsWith('.html'));
  return moduleHtmlFile;
}

exports.setHtmlWebpackPlugin = function () {
  const moduleHtmlFile = getModuleHtml();
  const htmlFiles = moduleHtmlFile.map(val => {
    return path.resolve(__dirname, `../src/modules/${process.env.NAME}/${val}`);
  });;
  if (process.env.NODE_ENV === 'production') {
    return moduleHtmlFile.map(val => {
      return new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, `../dist/${process.env.NAME}/${val}`),
        template: path.resolve(__dirname, `../src/modules/${process.env.NAME}/${val}`),
        inject: 'body',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
      });
    });
  } else {
    return htmlFiles.map(val => {
      return new HtmlWebpackPlugin({
        filename: val,
        template: val,
        inject: 'body'
      })
    });
  }
};

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path);
}

exports.fileCheck = function () {
  if (process.env.NODE_ENV !== 'production') {
    // 赋值
    if (!process.env.NAME) {
      process.env.NAME = variableJson.eventName;
    } else {
      let json = {
        eventName: process.env.NAME
      }

      // 20181017，解决内容不为JSON时，写入到文件为空白bug
      let str = JSON.stringify(json) || {};
      fs.writeFileSync(path.join(__dirname, './variable.json'), str, function (err) {
        if (err) {
          console.error(err);
        }
        console.log('----------新增成功-------------');
      });
    }
  }
}

// 20181105，解决读取json文件内容为空的问题
function isJSON() {
  try {
    return require('./variable.json');
  } catch (e) {
    return {};
  }
}