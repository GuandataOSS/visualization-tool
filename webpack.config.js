const path = require('path')

module.exports = {
    mode:'development',
    entry: {
        plugin: [
            // "babel-polyfill",
            "./src/plugin.js" //需要压缩的js，目前只支持单个文件一个一个压缩 = =！
        ],
        'gd-sdk': [
            // "babel-polyfill",
            "./src/gd-sdk.js" //需要压缩的js，目前只支持单个文件一个一个压缩 = =！
        ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'), //输出目录
        filename: '[name].js' //输出文件名称，建议与源文件同名
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: "babel-loader"
            }
        }]
    }
};
