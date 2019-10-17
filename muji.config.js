const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
module.exports = async () => ({
  publicPath: '/srp-stock/',
  css: {
    modules: true,
  },
  chainWebpack(chainConfig) {
    chainConfig.resolve.alias.set('so-ui-react', '@souche-ui/so-ui-react');
    chainConfig.resolve.alias.set('so-utils', '@souche-f2e/souche-util');
    chainConfig.plugin('moment-locales').use(MomentLocalesPlugin, [
      {
        localesToKeep: ['zh-cn']
      }
    ]);
  },
  devServer: {
    disableHostCheck: true,
    // host: 'localhost.single-unit-shop.singleunit.dev.dasouche.net' // 开发
    host: "local.srp.dasouche.net" //测试
    // host: "localhost.prepub.miaomaicar.com" //预发
  },
  pluginOptions: {
    antdVars: {
      theme: {
        '@primary-color': '#ff571a'
      }
    }
  },
  dynamicImport: { webpackChunkName: true },
  productionSourceMap: true
});

