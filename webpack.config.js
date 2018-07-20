const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');//压缩js
const htmlPlugin= require('html-webpack-plugin');//打包html
const extractTextPlugin = require("extract-text-webpack-plugin");//将css重js里面分离出来
const autoprefixer = require("autoprefixer");//将css兼容前缀
const glob = require('glob');
const PurifyCSSPlugin = require("purifycss-webpack");
const entry = require("./webpack_config/entry_webpack.js");
const webpack = require("webpack");
const copyWebpackPlugin= require("copy-webpack-plugin");//打包静态资源文件
var website ={
    publicPath:"http://127.0.0.1:8081/"
}
module.exports={
    //入口文件的配置项

     entry:entry.path,//模块化

 
     devtool: 'eval-source-map',
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
                        limit:100,
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
          
          },
          {
            test:/\.js$/,
            use:{
                loader:'babel-loader',
                options:{
                   presets:[
                      'es2015'
                   ]
                }
            },
            exclude:/node_modules/
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
       }),
       new PurifyCSSPlugin({
        paths:glob.sync(path.join(__dirname,'src/*.html')),//去掉多余的CSS
       }),
       new webpack.ProvidePlugin({
        $:'jquery'//全局引入jq
       }),
       new webpack.optimize.CommonsChunkPlugin({
            //name对应入口文件中的名字，我们起的是jQuery
            name:['jquery'],
            //把文件打包到哪里，是一个路径
            filename:"assets/js/[name].js",
            //最小打包的文件模块数，这里直接写2就好
            minChunks:2
        }),
       new copyWebpackPlugin([{
        from:__dirname+'/src/public',
        to:'./public'
         }]),
      new webpack.HotModuleReplacementPlugin()//热更新
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
        // watchOptions:{
        //     //检测修改的时间，以毫秒为单位
        //     poll:1000, 
        //     //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
        //     aggregateTimeout:500, 
        //     //不监听的目录
        //     ignored:/node_modules/
        // }
    }
}