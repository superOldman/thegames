const { defineConfig } = require('@vue/cli-service')

const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,
  // 打包输出文件夹
  outputDir: 'game',
  // 部署应用包时的基本 URL
  publicPath: process.env.NODE_ENV === 'production' ? '/game/' : './',
  configureWebpack: {
    //线上环境不打包map文件
    // devtool: isProduction ? false : 'source-map',
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
  },
  devServer: {
    port: '9999',
    open: true,
    hot: true,
    proxy: {
      // '/dev-api': {
      //   target: "http://192.168.27.123:8888",
      //   secure: false,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/dev-api': ''
      //   }
      // }
    }
  }
})
