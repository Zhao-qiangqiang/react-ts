module.exports = {
    serverRelativePath: 'srp-stock',  // 发布到服务器的相对路径，比如当前配置发布到测试环境的话项目页面地址即为 http://f2e.souche.com/projects/foo/bar/index.html
    // 针对平台业务开发部的项目，配置请改为 serverRelativePath:'data-fe/<项目名>'
    publishSourceFolder: 'dist',    // 编译好的 html, js, css 文件所在的本地目录
    organization: 'single-unit',
}