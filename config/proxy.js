module.exports = {
  '/migu/*': {
    target: 'http://dev.miguai.top:19552',
    // target: 'http://test.miguai.top:19550',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/migu/': '/migu/'
    }
  }
};
