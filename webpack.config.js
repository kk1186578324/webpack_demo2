const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');//压缩js
const htmlPlugin= require('html-webpack-plugin');//打包html
const extractTextPlugin = require("extract-text-webpack-plugin");//将css重js里面分离出来
const autoprefixer = require("autoprefixer");//将css兼容前缀
var website ={
    publicPath:"http://127.0.0.1:8081/"
}
module.exports={
    //入口文件的配置项
    entry:{
          entry:'./src/entry.js',
    },
    //出口文件的配置项
    output:{
         //输出的路径，用了Node语法
        path:path.resolve(__dirname,'dist'),
        //输出的文件名称
        filename:'[name].js',
        publicPath:website.publicPath//设置公共路径
    },
    //模块：例如解读CSS,图片如何转换，压缩
    module:{
       rules:[
          {
            test:/\.css$/,
            use:extractTextPlugin.extract({
                fallback:'style-loader',
               
                  use:[{
                        loader:"css-loader"
                      },{
                        loader:"postcss-loader",
                        options:{
                          ident:'postcss',
                          plugins:[
                             require('autoprefixer')()
                          ]
                        }
                      }],
            })//css分离打包
          },{
            test:/\.(png|jpg|gif)/,
            use:[
                {
                    loader:'url-loader',
                    options:{
                        limit:100000000,
                        outputPath:'image/'
                    }
                }
            ]
          },{
            test:/\.(html|html)$/i,
            use:['html-withimg-loader']
          },{
            test:/\.less$/,
            use:extractTextPlugin.extract({
               
                  use:[{
                        loader:"css-loader"
                      },{
                        loader:"less-loader"
                      }],
                   fallback:'style-loader'//less打包分离
               })
          
          }
       ]
 

    },
    //插件，用于生产模版和各项功能
    plugins:[
       
       new uglify(),
       new extractTextPlugin("/css/index2.css"),
       new htmlPlugin({
           minify:{
            removeAttributeQuotes:true//去掉属性的双引号
           },
           hash:true,
           template:'./src/index.html'
       })
     ],
    //配置webpack开发服务功能
    devServer:{
        //设置基本目录结构
        contentBase:path.resolve(__dirname,'dist'),
        //服务器ip地址
        host:'localhost',
        //服务器压缩是否开启
        compress:true,
        //配置服务器端口号
        port:8081
    }
}