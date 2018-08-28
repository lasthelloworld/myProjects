var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin'); //打包html的插件 

module.exports = {
    entry:{
        "/dist/js/build":"./src/js/index.js" //入口文件  入口1

           //我们的是多页面项目，多页面入口配置就是这样，
         //app/src/page下可能还会有很多页面，照着这样配置就行
    },
    output:{
        filename:'[name].js'//打包后的文件名字  [name]代表entry中对应key值 app/dist/js/index最后的index
        // path:path.resolve(__dirname,'dist')
    },
    //插件
    plugins:[
        new HtmlWebpackPlugin({
            chunks:['/dist/js/index'],
            filename:'/index.html',
            template:'./src/index.html'  
        })
    ]
};