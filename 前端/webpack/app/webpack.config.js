var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin'); //打包html的插件 

module.exports = {
    entry:"./src/js/index.js",
    output:{
        filename:'js/build.js',
        path:path.resolve(__dirname,'dist')
    },
    //插件
    plugins:[
        new HtmlWebpackPlugin()
    ]
};